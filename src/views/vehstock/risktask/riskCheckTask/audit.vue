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
      <el-form-item label="任务编码">
        <el-input placeholder="请输入" v-model="form.checkTaskCode" clearable />
      </el-form-item>
      <el-form-item label="VIN码">
        <el-input placeholder="请输入" v-model="form.vin" clearable />
      </el-form-item>
      <el-form-item label="门店名称">
        <el-input placeholder="请输入" v-model="form.storeName" clearable />
      </el-form-item>
      <el-form-item label="排查状态">
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
      <page-search-action
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button size="small" @click="goBack">返回</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-page
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
      />
    </div>
    <!-- 审核弹窗 -->
    <el-dialog
      :title="auditDialogTitle"
      :visible.sync="auditDialogVisible"
      width="520px"
      append-to-body
    >
      <el-form :model="auditForm" label-width="90px" size="small">
        <el-form-item label="审核结果">
          <el-radio-group v-model="auditForm.pass">
            <el-radio :label="true">通过</el-radio>
            <el-radio :label="false">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核说明" v-if="!auditForm.pass">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="200"
            show-word-limit
            v-model="auditForm.auditOpinion"
            placeholder="不通过时必填，最多200字"
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
import { downloadExcel } from '@/libs/utils';

const defaultForm = {
  checkTaskCode: '',
  vin: '',
  storeName: '',
  checkStatusList: []
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
    FetchSelect
  },
  data () {
    return {
      pageTitle: '车辆排查任务审核',
      pageType: 'list',
      form: {
        ...defaultForm
      },
      moduleKey: 'AISVS-risktask-riskCheckTask',
      show: false,
      loading: false,
      exportLoading: false,
      checkTaskId: this.$route.query.checkTaskId || '',
      auditDialogVisible: false,
      auditSubmitting: false,
      auditForm: {
        auditRecordId: '',
        pass: true,
        auditOpinion: ''
      },
      optionObj: {
        id: 'riskCheckAuditRecordTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'checkTaskCode', label: '任务编码', visible: true, width: 170, fixed: 'left' },
          { props: 'taskName', label: '任务名称', visible: true, minWidth: 160 },
          { props: 'vin', label: 'VIN码', visible: true, minWidth: 190 },
          { props: 'storeName', label: '门店名称', visible: true, minWidth: 140 },
          { props: 'checkStatusLabel', label: '排查状态', visible: true, width: 100 },
          { props: 'submitUserName', label: '提交人', visible: true, width: 100 },
          { props: 'submitTime', label: '提交时间', visible: true, width: 170 },
          { props: 'auditUserName', label: '审核人', visible: true, width: 100 },
          { props: 'auditTime', label: '审核时间', visible: true, width: 170 },
          { props: 'auditOpinion', label: '审核说明', visible: true, minWidth: 180 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '审核',
              // 🔑 G8：仅审核中(60) 可审核
              show: (row) => Number(row.checkStatus) === 60,
              click: (rowIndex, row) => {
                this.openAuditDialog(row);
              },
              type: 'primary'
            }]
          }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  computed: {
    auditDialogTitle () {
      return this.auditForm.pass ? '审核通过' : '审核不通过';
    }
  },
  methods: {
    /**
     * 操作列按钮按权限过滤（覆盖 permissions mixin 的同名方法）
     * 🔑 本模块专属权限点：approve
     */
    fixTableConfig () {
      const operate = this.optionObj?.dataProp?.find(item => item.props === 'operate');
      if (!operate) {
        return;
      }
      if (!operate.buttons) {
        operate.buttons = [];
      }
      if (!this.permissions.has(`${this.moduleKey}-audit-approve`)) {
        operate.buttons = operate.buttons.filter(item => item.name !== '审核');
      }
      if (operate.buttons.length === 0) {
        this.optionObj.dataProp = this.optionObj.dataProp.filter(item => item.props !== 'operate');
      }
    },
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
      getAuditList({ ...this.getFormData(), checkTaskId: this.checkTaskId, pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = (res && res.records) || [];
          this.optionObj.total = res?.total || 0;
        }).catch(err => {
          console.error('车辆排查审核列表查询失败:', err);
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
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 打开审核弹窗
    openAuditDialog (row) {
      this.auditForm = {
        auditRecordId: row.id,
        pass: true,
        auditOpinion: ''
      };
      this.auditDialogVisible = true;
    },
    // 提交审核
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
      approve({ ...this.auditForm }).then(() => {
        this.$message({ type: 'success', message: '审核成功!' });
        this.auditDialogVisible = false;
        this.getData();
      }).catch(() => {}).finally(() => {
        this.auditSubmitting = false;
      });
    },
    // 返回任务列表
    goBack () {
      this.$router.push({ path: '/vehstock/risktask/riskCheckTask' });
    },
    // 导出（通用导出：dataFetchPath 指向本页分页接口）
    exportExcel () {
      this.exportLoading = true;
      const reqParams = { ...this.getFormData(), checkTaskId: this.checkTaskId } || {};
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
            this.$message({ type: 'error', message: '文件导出失败' });
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
}
</style>
