<template>
  <div class="page-common m-wholesaleSpotConfig-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="120px"
      class="ais-search-form"
    >
      <el-form-item label="车系">
        <fetch-select
          filterable
          clearable
          remote
          v-model="form.seriesId"
          :params="form.seriesName"
          :remote-method="getVehicleSeriesList"
          value-key="id"
          label-key="name"
        />
      </el-form-item>
      <el-form-item label="年款">
        <fetch-select
          filterable
          clearable
          remote
          v-model="form.yearTypeId"
          :params="form.yearTypeName"
          :remote-method="getVehicleYearTypeList"
          value-key="id"
          label-key="name"
        />
      </el-form-item>
      <el-form-item label="资金校验">
        <fetch-select
          :request="fetchBooleanOptions"
          enumCode="BooleanEnum"
          v-model="form.fundCheckFlag"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="未配车作废">
        <fetch-select
          :request="fetchBooleanOptions"
          enumCode="BooleanEnum"
          v-model="form.unallocatedCancelFlag"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="未结算释放">
        <fetch-select
          :request="fetchBooleanOptions"
          enumCode="BooleanEnum"
          v-model="form.unsettledReleaseFlag"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="按序配车">
        <fetch-select
          :request="fetchBooleanOptions"
          enumCode="BooleanEnum"
          v-model="form.seqAllocateFlag"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="StatusEnum"
          v-model="form.status"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <page-search-action
        v-if="canList"
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
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
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
    <!-- 导入弹窗：id 与后端 @ResourcePermission 模板业务码对应 -->
    <!-- TODO: 部署时需 DBA 在 app_portal 库 commonDataProcessExcelModelMap 表注册 code='WholesaleSpotConfigImport' 的导入模板 -->
    <Upload
      :visible="uploadDialogVisible"
      id="WholesaleSpotConfigImport"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
  </div>
</template>

<script>
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import Upload from '@/libs/components/UploadDialog';
import { pageList, enableOrDisable } from '@/api/vehwholesale/basic/wholesaleSpotConfig/index';
import { getEnum, vehicleSeriesList, listVehicleYearType } from '@/api/common';
import { exportTable } from '@/libs/api/common';
import { downloadExcel, handleBatchStatusChange } from '@/libs/utils';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  seriesId: '',
  seriesName: '',
  yearTypeId: '',
  yearTypeName: '',
  fundCheckFlag: '',
  unallocatedCancelFlag: '',
  unsettledReleaseFlag: '',
  seqAllocateFlag: '',
  status: ''
};

const pageSize = 20;

export default {
  name: 'wholesaleSpotConfigList',
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    Upload
  },
  data () {
    return {
      pageTitle: '现车批售信息配置',
      pageType: 'list',
      moduleKey: 'AISVW-wholesaleSpotConfig',
      form: { ...defaultForm },
      selectionList: [],
      loading: false,
      uploadDialogVisible: false,
      exportLoading: false,
      optionObj: {
        id: 'wholesaleSpotConfigTable',
        dataList: [],
        form: { page: 1, size: pageSize },
        dataProp: [
          { props: 'seriesName', label: '车系', visible: true, width: 140 },
          { props: 'yearTypeName', label: '年款', visible: true, width: 100 },
          { props: 'fundCheckFlagLabel', label: '资金校验', visible: true, width: 100 },
          { props: 'unallocatedCancelFlagLabel', label: '未配车作废', visible: true, width: 110 },
          { props: 'unsettledReleaseFlagLabel', label: '未结算释放', visible: true, width: 110 },
          { props: 'seqAllocateFlagLabel', label: '按序配车', visible: true, width: 100 },
          { props: 'statusLabel', label: '状态', visible: true, width: 80 },
          { props: 'modifierName', label: '修改人', visible: true, width: 120 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => this.handleEdit(row),
              type: 'info'
            }, {
              name: '启用',
              show: (row) => row.status === 0,
              click: (rowIndex, row) => this.handleSingleEnable(row, 1),
              type: 'info'
            }, {
              name: '停用',
              show: (row) => row.status === 1,
              click: (rowIndex, row) => this.handleSingleEnable(row, 0),
              type: 'info'
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
  methods: {
    handleAdd () {
      this.$router.push({ path: '/vehwholesale/basic/wholesaleSpotConfig/edit' });
    },
    handleEdit (row) {
      this.$router.push({ path: '/vehwholesale/basic/wholesaleSpotConfig/edit', query: { id: row.id } });
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
      this.selectionList = [];
      const params = {
        ...this.form,
        pageNum: this.optionObj.form.page,
        pageSize: this.optionObj.form.size
      };
      Object.keys(params).forEach(k => {
        if (params[k] === '' || params[k] === null || params[k] === undefined) delete params[k];
      });
      pageList(params).then(res => {
        this.optionObj.dataList = (res.records || []).map(item => ({ ...item, deleteLoading: false }));
        this.optionObj.total = res.total || 0;
      }).finally(() => { this.loading = false; });
    },
    paginationChange (type, num) {
      if (type === 'page') this.optionObj.form.page = num;
      else this.optionObj.form.size = num;
      this.getData();
    },
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    async fetchOptions (code) {
      if (code) return getEnum(code);
      return [];
    },
    async fetchBooleanOptions (code) {
      if (code) return getEnum(code);
      return [];
    },
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async getVehicleYearTypeList (params) {
      return listVehicleYearType({ yearTypeNameLike: params, status: 1 });
    },
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableOrDisable,
        refreshFunc: this.getData
      });
    },
    handleSingleEnable (row, status) {
      handleBatchStatusChange.call(this, {
        selectionList: [row],
        targetStatus: status,
        apiFunc: enableOrDisable,
        refreshFunc: this.getData
      });
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    getFormData () {
      // 导出：剥离空值字段，避免后端被空字符串干扰
      const params = { ...this.form };
      Object.keys(params).forEach(k => {
        if (params[k] === '' || params[k] === null || params[k] === undefined) delete params[k];
      });
      return params;
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        reqParams.ids = this.selectionList.map(item => item.id) || [];
      }
      exportTable({
        businessType: '现车批售信息配置',
        dataFetchPath: '/vw/web/basic/wholesaleSpotConfig/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '现车批售信息配置.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => { this.exportLoading = false; });
    }
  }
};
</script>

<style lang="scss" scoped>
  ::v-deep .el-input-number {
    width: 100%;
  }
</style>
