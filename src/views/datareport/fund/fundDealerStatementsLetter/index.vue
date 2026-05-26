<template>
  <div class="page-common m-fundDealerStatementsLetter-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="对账月份">
        <el-date-picker
          v-model="form.reconYearmonth"
          type="month"
          :picker-options="pickerOptions"
          value-format="yyyy-MM"
          placeholder="选择月份"
        />
      </el-form-item>
      <el-form-item label="客户名称">
        <fetch-select
          filterable
          clearable
          remote
          multiple
          v-model="form.customerNameList"
          :param="form.customerName"
          :remote-method="getDealerParentOrgListByName"
          value-key="companyName"
          label-key="companyName"
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="对账单号">
          <tag-input v-model="form.codeList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="客户编码">
          <fetch-select
            filterable
            clearable
            remote
            multiple
            v-model="form.customerCodeList"
            :param="form.customerCode"
            :remote-method="getDealerParentOrgListByCode"
            value-key="companyCode"
            label-key="companyCode"
          />
        </el-form-item>
        <el-form-item label="对账状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="reconciliation_status"
            v-model="form.reconStatusList"
            placeholder="请选择"
            clearable
            filterable
            multiple
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.createTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.updateTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </template>
      <page-search-action
        v-if="canList"
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
    </div>
    <div
      class="ais-table-c"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, downloadStatement, confirmStatement, cancelStatement, regenerateStatement } from '@/api/datareport/fund/fundDealerStatementsLetter/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getParentCompany } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  reconYearmonth: '',
  customerNameList: [],
  customerName: '',
  codeList: [],
  customerCodeList: [],
  customerCode: '',
  reconStatusList: [],
  createTime: '',
  updateTime: '',
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
    TagInput,
    EditPage
  },
  data () {
    return {
      pageType: 'list',
      pageTitle: '经销商对账函',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISDR-fundDealerStatementsLetter',
      form: {
        ...defaultForm
      },
      selectionList: [],
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'fundDealerStatementsLetterTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '对账单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datareport/fund/fundDealerStatementsLetter/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'customerCode', label: '客户编码', visible: true, width: 150 },
          { props: 'customerName', label: '客户名称', visible: true, width: 240 },
          { props: 'reconYearmonth', label: '对账月份', visible: true, width: 150 },
          { props: 'reconStatusLabel', label: '对账状态', visible: true, width: 150 },
          { props: 'reconConfirmUserName', label: '对账确认人', visible: true, width: 140 },
          { props: 'reconConfirmTime', label: '对账确认时间', visible: true, width: 200 },
          { props: 'reconConfirmRemark', label: '对账确认备注', visible: true, width: 240 },
          { props: 'cancelUserName', label: '作废操作人', visible: true, width: 140 },
          { props: 'cancelTime', label: '作废时间', visible: true, width: 200 },
          { props: 'cancelReason', label: '作废原因', visible: true, width: 240 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '下载',
              click: (rowIndex, row) => {
                this.handleDownload(row);
              },
              type: 'primary'
            }, {
              name: '确认',
              show: (row) => {
                return row.reconStatusLabel === '待门店对账确认';
              },
              click: (rowIndex, row) => {
                this.handleConfirm(row);
              },
              type: 'primary'
            }, {
              name: '作废',
              show: (row) => {
                return row.reconStatusLabel === '待门店对账确认' || row.reconStatusLabel === '门店已对账确认';
              },
              click: (rowIndex, row) => {
                this.handleCancel(row);
              },
              type: 'primary'
            }, {
              name: '重新生成对账单',
              show: (row) => {
                return row.reconStatusLabel === '已作废';
              },
              click: (rowIndex, row) => {
                this.handleRegenerate(row);
              },
              type: 'primary'
            }]
          }
        ],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    // 排序
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/datareport/fund/fundDealerStatementsLetter/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '对账函管理-经销商对账函管理',
        dataFetchPath: 'datareport/web/fund/fundDealerStatementsLetter/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '对账函管理-经销商对账函管理.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$message({
            type: 'info',
            message: '请前往导出列表中查询导出结果'
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
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
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      if (this.form.reconYearmonth) {
        // 单个月份选择，计算该月的开始和结束时间
        data.reconYearmonth = this.form.reconYearmonth + '-01 00:00:00';
      }

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }

      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = this.form.updateTime[1];
        }
      }

      // 排序字段
      data.sortColumns = this.sortColumns;
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">此操作将永久删除, 是否继续</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        deleteItem(ids).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        });
      }).catch(() => {});
    },
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
    },
    async getDealerParentOrgListByName (params) {
      return getParentCompany({ parentCompanyName: params });
    },
    async getDealerParentOrgListByCode (params) {
      return getParentCompany({ parentCompanyCode: params });
    },
    // 下载对账单
    handleDownload (row) {
      downloadStatement(row.id).then(blob => {
        // blob 本身就是文件数据，不是 res.data
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // 获取当前时间并格式化
        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

        link.download = `经销商对账函_${timestamp}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // 显示下载成功提示
        this.$message.success('下载成功！');
      }).catch(error => {
        console.error('下载失败:', error);
        this.$message.error('下载失败，请重试！');
      });
    },
    // 确认对账单
    handleConfirm (row) {
      this.$prompt('确认备注', '确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入确认备注',
      }).then(({ value }) => {
        confirmStatement({ id: row.id, reconConfirmRemark: value }).then(res => {
          this.$message({
            type: 'success',
            message: '确认成功!'
          });
          this.getData();
        });
      });
    },
    // 作废对账单
    handleCancel (row) {
      this.$prompt('作废原因', '作废', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入作废原因',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const inputValue = instance.inputValue;
            if (!inputValue || inputValue.trim() === '') {
              this.$message.error('作废原因不能为空！');
              return;
            }
            // 可选：去除首尾空格后保存
            instance.inputValue = inputValue.trim();
            done();
          } else {
            done();
          }
        }
      }).then(({ value }) => {
        cancelStatement({ id: row.id, cancelReason: value }).then(res => {
          this.$message.success('作废成功!');
          this.getData();
        });
      });
    },
    // 重新生成对账单
    handleRegenerate (row) {
      this.$confirm('确认要重新生成对账单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 立即显示"生成中"消息
        this.$message({
          type: 'info',
          message: '对账单重新生成中...请稍后再查看...",',
        });

        // 异步执行重新生成操作
        regenerateStatement(row.id).then(res => {
          this.$message({
            type: 'success',
            message: '对账单重新生成成功!'
          });
          this.getData();
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
