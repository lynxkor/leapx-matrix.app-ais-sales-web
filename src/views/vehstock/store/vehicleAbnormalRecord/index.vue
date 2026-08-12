<template>
  <div class="page-common m-vehicle-abnormal-record-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="VIN">
        <tag-input v-model="form.vinList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="车辆异常类型">
        <fetch-select :request="fetchOptions" enumCode="vehstock_fence_crossed_type" v-model="form.fenceCrossedType"
          placeholder="请选择" clearable filterable />
      </el-form-item>
      <el-form-item label="销售门店" v-show="this.visibleCount === 3 || show">
        <fetch-select
          filterable
          clearable
          remote
          multiple
          collapseTags
          v-model="form.saleDealerCodeList"
          :remote-method="getDealerListByName"
          value-key="storeCode"
          label-key="storeName"
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="物料编码">
          <tag-input v-model="form.materialsCodeList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="物料描述">
          <tag-input v-model="form.materialsDescList" placeholder="请输入" />
        </el-form-item>
      </template>
      <page-search-action v-if="canList" v-model="show" is-expandable :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <!-- <div class="ais-active">
    </div> -->
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="主页" name="homePage"></el-tab-pane>
        <el-tab-pane label="电量不足" name="fenceCrossed"></el-tab-pane>
        <el-tab-pane label="当前电量不足" name="fenceCrossedPower"></el-tab-pane>
        <el-tab-pane label="实车交付未出库" name="fenceNotCrossed"></el-tab-pane>
        <el-tab-pane label="当前实车交付未出库" name="fenceNotDelivered"></el-tab-pane>
      </el-tabs>
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page checkboxFixed centralized
        :option-obj="optionObj" :get-config="getConfig" :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange" @handleSelect="handleSelectionChange" @listSelect="handleListSelect"
        @sortChange="handleSortChange">
        <EditPage slot="centralizedViewSlot" :id="clickItemId" />
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload :visible="uploadDialogVisible" :id="'1'" @close="handleUploadDialogClose" @getData="getData" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehstock/store/vehicleAbnormalRecord/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  vin: '',
  vinList: [],
  materialsDescList: [],
  fenceCrossedType: '',
  saleDealerCode: '',
  materialsCode: '',
  materialsDesc: '',
  materialsCodeList: [],
  saleDealerCodeList: []
};

// 默认排序：创建时间倒序。data() 和 onReset 复用同一份常量，避免两份硬编码不一致。
const DEFAULT_SORT_COLUMNS = [
  { column: 'create_time', sort: 'DESC' }
];

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
    Upload,
    TagInput
  },
  data () {
    return {
      pageTitle: '车辆异常记录',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVS-vehicleAbnormalRecord',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      activeName: 'homePage',
      clickItemId: '',
      optionObj: {
        id: 'vehicleAbnormalRecordTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'abnormalRecordNo', label: '异常记录单号', visible: true, width: 200 },
          { props: 'vin', label: 'VIN', visible: true, width: 180 },
          { props: 'electricity', label: '车辆电量(%)', visible: true, width: 140, align: 'right' },
          { props: 'fenceCrossedTypeLabel', label: '车辆异常类型', visible: true, width: 140 },
          { props: 'continuousLowBatteryDays', label: '连续低电量天数', visible: true, width: 150, align: 'right' },
          { props: 'abnormalRecordTime', label: '异常记录时间', visible: true, width: 200, sortable: true },
          { props: 'vechicleStatusLabel', label: '车辆状态', visible: true, width: 100 },
          { props: 'saleDealerName', label: '销售门店', visible: true, width: 200 },
          { props: 'dealerWarehouseName', label: '门店仓库', visible: true, width: 200 },
          { props: 'dealerWarehouseAddress', label: '仓库地址', visible: true, width: 200 },
          { props: 'vehicleArrivalOn', label: '物流到店日期', visible: true, width: 200 },
          { props: 'poentryOn', label: '采购入库时间', visible: true, width: 200 },
          { props: 'syncSourceLabel', label: '标识来源', visible: true, width: 140 },
          { props: 'vehdeLiveriedOn', label: '标识记录日期', visible: true, width: 200, sortable: true },
          { props: 'actualVehicleLongitude', label: '实车位置经度', visible: true, width: 140 },
          { props: 'actualVehicleLatitude', label: '实车位置纬度', visible: true, width: 140 },
          { props: 'warehouseLongitude', label: '仓库位置经度', visible: true, width: 140 },
          { props: 'warehouseLatitude', label: '仓库位置纬度', visible: true, width: 140 },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 160 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 160 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200, sortable: true },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 160 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: []
          }
        ],
        total: 0
      },
      sortColumns: [...DEFAULT_SORT_COLUMNS]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    // 排序
    handleSortChange (value) {
      const list = value || [];
      if (!list.length) {
        this.sortColumns = [];
        this.getData();
        return;
      }
      const latest = list.reduce((acc, cur) => (cur.sortTime || 0) > (acc.sortTime || 0) ? cur : acc);
      const def = this.optionObj.dataProp.find(item => item.props === latest.field) || {};
      this.sortColumns = [{
        column: def.sortField || (latest.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
        sort: (latest.order || '').toUpperCase()
      }];
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
        path: '/vehstock/store/vehicleAbnormalRecord/edit'
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
      if (this.activeName === 'fenceCrossed') {
        this.form.fenceCrossedType = '50';
      } else if (this.activeName === 'fenceCrossedPower') {
        this.form.fenceCrossedType = '60';
      } else if (this.activeName === 'fenceNotCrossed') {
        this.form.fenceCrossedType = '30';
      } else if (this.activeName === 'fenceNotDelivered') {
        this.form.fenceCrossedType = '70';
      }
      this.sortColumns = [...DEFAULT_SORT_COLUMNS];
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
        businessType: '车辆异常记录',
        dataFetchPath: 'vehstock/web/store/vehicleAbnormalRecord/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '车辆异常记录.xlsx');
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
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          // 后端异常返回 null 时 res.records 为 undefined 会导致 map 白屏，做空值兜底
          this.optionObj.dataList = (res?.records || []).map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res?.total || 0;
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
    // 销售门店搜索
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isSales: true });
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }
      if (Array.isArray(this.form.vinList) && this.form.vinList.length <= 1) {
        delete data.vinList;
        data.vinLike = this.form.vinList[0] || '';
      }
      if (Array.isArray(this.form.materialsDescList) && this.form.materialsDescList.length <= 1) {
        delete data.materialsDescList;
        data.materialsDescLike = this.form.materialsDescList[0] || '';
      }
      if (Array.isArray(this.form.materialsCodeList) && this.form.materialsCodeList.length <= 1) {
        delete data.materialsCodeList;
        data.materialsCodeLike = this.form.materialsCodeList[0] || '';
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
      }).catch(() => { });
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
    // 点击tabs栏切换
    handleClick (item) {
      this.activeName = item.name;
      if (item.name === 'homePage') {
        this.onReset();
      } else if (item.name === 'fenceCrossed') {
        this.onReset();
        this.form.fenceCrossedType = '50';
      } else if (item.name === 'fenceCrossedPower') {
        this.onReset();
        this.form.fenceCrossedType = '60';
      } else if (item.name === 'fenceNotCrossed') {
        this.onReset();
        this.form.fenceCrossedType = '30';
      } else if (item.name === 'fenceNotDelivered') {
        this.onReset();
        this.form.fenceCrossedType = '70';
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.m-vehicle-abnormal-record-list {
  ::v-deep .m-vxe-table .m-vxe-table-options {
    top: -96px;
  }
  .ais-actions {
    margin-bottom: 8px;
  }
  .ais-table-c {
    height: calc(100% - 168px);
  }
}
</style>
