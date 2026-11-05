<template>
  <div class="page-common m-risk-check-audit-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="110px"
      class="ais-search-form"
    >
      <el-form-item label="VIN">
        <tag-input v-model="form.vinList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="任务名称">
        <el-input v-model="form.taskName" placeholder="请输入" clearable @clear="debouncedGetData" />
      </el-form-item>
      <el-form-item label="门店名称">
        <tag-input v-model="form.storeNameList" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="车辆状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vs_risk_check_status"
          v-model="form.checkStatusList"
          placeholder="请选择"
          clearable
          filterable
          multiple
        />
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker
          v-model="form.submitTime"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="/"
          start-placeholder="开始时间"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <page-search-action
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <el-button v-permission="moduleKey+'-approve'" size="small" :disabled="!hasAuditSelected" @click="handleBatchAudit">审核</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
    <!-- 批量审核弹窗：通过 / 不通过（审核说明始终展示、非必填；不通过时必填 G11、≤200 字 G12），与 audit.vue 单条审核同款交互 -->
    <el-dialog
      title="批量审核"
      :visible.sync="auditDialogVisible"
      width="520px"
      append-to-body
    >
      <div class="audit-batch-tip">本次将审核 <b>{{ batchAuditIds.length }}</b> 条审核记录</div>
      <el-form :model="auditForm" label-width="90px" size="small">
        <el-form-item label="审核结果">
          <el-radio-group v-model="auditForm.pass">
            <el-radio :label="true">通过</el-radio>
            <el-radio :label="false">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核说明">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="200"
            show-word-limit
            v-model="auditForm.auditOpinion"
            placeholder="非必填，最多200字"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="auditDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="auditSubmitting" @click="submitAudit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getAuditList, approve } from '@/api/vehstock/risktask/riskCheckAudit/index';
import { getTableConfig, tableAddOrUpdate, getEnum, exportTable } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getEndOfDayString, downloadExcel } from '@/libs/utils';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  vinList: [],
  taskName: '',
  storeNameList: [],
  checkStatusList: [],
  submitTime: []
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    TagInput
  },
  data () {
    return {
      pageTitle: '排查任务审核',
      pageType: 'list',
      form: {
        ...defaultForm
      },
      moduleKey: 'AISVS-riskCheckAudit',
      show: false,
      loading: false,
      exportLoading: false,
      // 多选勾选行（LPVxeTable 换页/重查不清选中 → getData 里手动清空，防止对已翻走的行发批量审核）
      selectionList: [],
      // 批量审核弹窗
      auditDialogVisible: false,
      auditSubmitting: false,
      batchAuditIds: [],
      auditForm: {
        pass: true,
        auditOpinion: ''
      },
      optionObj: {
        id: 'riskCheckAuditTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            // T22：第一列审核记录编码，点击跳审核记录详情页（同 VIN 跳转，入口互不替代）
            props: 'auditRecordCode',
            label: '审核记录编码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/risktask/riskCheckAudit/auditDetail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/risktask/riskCheckAudit/auditDetail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            // 任务编码点击跳任务详情页：id 取 checkTaskId（任务主键），不是审核记录 row.id
            props: 'checkTaskCode',
            label: '任务编码',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/risktask/riskCheckTask/edit',
                  query: {
                    id: row.checkTaskId,
                    isEditing: false
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'taskName', label: '任务名称', visible: true, minWidth: 180 },
          { props: 'storeName', label: '门店名称', visible: true, minWidth: 160 },
          { props: 'checkStatusLabel', label: '车辆状态', visible: true, width: 100 },
          { props: 'submitUserName', label: '提交人', visible: true, width: 120 },
          { props: 'auditUserName', label: '审核人', visible: true, width: 120 },
          { props: 'auditOpinion', label: '审核说明', visible: true, minWidth: 220 },
          { props: 'submitTime', label: '提交时间', visible: true, width: 170 },
          { props: 'auditTime', label: '审核时间', visible: true, width: 170 }
        ],
        total: 0
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  computed: {
    // 勾选项中是否存在可审核的记录（后端 Resp.checkStatus=60 审核中，G8）
    hasAuditSelected () {
      return this.selectionList.some(item => Number(item.checkStatus) === 60);
    }
  },
  methods: {
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.getData();
    },
    getData () {
      this.loading = true;
      // 换页/重查手动清选中（LPVxeTable 不会自动清，防止对已翻走的行发批量审核）
      this.selectionList = [];
      getAuditList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = (res && res.records) || [];
          this.optionObj.total = res?.total || 0;
        }).catch(err => {
          console.error('排查任务审核列表查询失败:', err);
          this.optionObj.dataList = [];
          this.optionObj.total = 0;
        }).finally(() => {
          this.loading = false;
        });
    },
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    // 多选勾选（LPVxeTable 统一回调）
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    // 批量审核：提交前按「审核中(60)」过滤（G8 后端逐条守卫，这里只送可审行）
    handleBatchAudit () {
      const ids = this.selectionList
        .filter(item => Number(item.checkStatus) === 60)
        .map(item => item.id);
      if (!ids.length) {
        this.$message.warning('请选择审核中状态的记录进行审核');
        return;
      }
      this.batchAuditIds = ids;
      this.auditForm = { pass: true, auditOpinion: '' };
      this.auditDialogVisible = true;
    },
    // 提交批量审核：一次请求传 auditRecordIds（后端逐条独立事务 + 部分成功汇总回显），同 riskCheckTask 批量发布模式
    submitAudit () {
      // 🔑 G11：不通过时审核说明必填
      if (!this.auditForm.pass && !this.auditForm.auditOpinion) {
        this.$message({ type: 'warning', message: '请填写审核说明' });
        return;
      }
      // 🔑 G12：审核说明 ≤200 字
      if (this.auditForm.auditOpinion && this.auditForm.auditOpinion.length > 200) {
        this.$message({ type: 'warning', message: '审核说明不能超过200字' });
        return;
      }
      this.auditSubmitting = true;
      approve({
        // 🔑 批量入口：ID 列表 + 统一的通过/不通过 + 审核说明（后端逐条独立事务，失败记录汇总文案回显）
        auditRecordIds: this.batchAuditIds,
        pass: this.auditForm.pass,
        // 通过 / 不通过都回传审核说明（非必填，通过时也可填，后端无条件落库）
        auditOpinion: this.auditForm.auditOpinion || ''
      }).then(() => {
        this.$message({ type: 'success', message: '审核成功!' });
        this.auditDialogVisible = false;
        this.getData();
      }).catch(() => {}).finally(() => {
        this.auditSubmitting = false;
      });
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });
      if (this.form.submitTime) {
        delete data.submitTime;
        if (this.form.submitTime.length > 1) {
          data.submitTimeStart = this.form.submitTime[0];
          data.submitTimeEnd = getEndOfDayString(this.form.submitTime[1]);
        }
      }
      // VIN / 门店名称：TagInput 多行输入，逐条精准匹配（IN），不支持模糊
      const { vinList = [], storeNameList = [] } = this.form;
      delete data.vinList;
      delete data.storeNameList;
      if (vinList.length > 0) {
        data.vinList = vinList;
      }
      if (storeNameList.length > 0) {
        data.storeNameList = storeNameList;
      }
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 导出（通用导出：dataFetchPath 指向本页分页接口，资源 AISVS-riskCheckAudit-export）
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      exportTable({
        businessType: '风险车辆排查审核',
        dataFetchPath: 'vehstock/web/risktask/riskCheckAudit/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '风险车辆排查审核.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-risk-check-audit-list {
  .audit-batch-tip {
    margin-bottom: 12px;
    font-size: 14px;
    color: var(--leap-color-default);
  }
}
</style>
