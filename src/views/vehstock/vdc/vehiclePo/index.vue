<template>
  <div class="page-common m-vehiclePo-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="VIN">
        <tag-input v-model="form.vinList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="物料描述">
        <tag-input v-model="form.materialsDescList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="物料编码" v-show="this.visibleCount === 3 || show">
        <tag-input v-model="form.materialsCodeList" placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="订单状态">
          <fetch-select :request="fetchOptions" enumCode="vehstock_po_status" v-model="form.poStatusList" placeholder="请选择"
            clearable multiple filterable />
        </el-form-item>
        <el-form-item label="产销识别码">
          <tag-input v-model="form.zppNoList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否配车">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.carAllocated" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="车系">
          <fetch-select
            v-model="form.seriesIdList"
            v-bind="selectOptions"
            :remote-method="remoteMethods.series"
          />
        </el-form-item>

        <el-form-item label="车型">
          <fetch-select
            v-model="form.modelIdList"
            v-bind="selectOptions"
            :remote-method="remoteMethods.model"
          />
        </el-form-item>

        <el-form-item label="年款">
          <fetch-select
            v-model="form.yearTypeIdList"
            v-bind="selectOptions"
            :remote-method="remoteMethods.yearType"
          />
        </el-form-item>
        <el-form-item label="外观">
          <fetch-select
            v-model="form.exteriorIdList"
            v-bind="selectOptions"
            :remote-method="remoteMethods.exterior"
          />
        </el-form-item>
        <el-form-item label="内饰">
          <fetch-select
            v-model="form.interiorIdList"
            v-bind="selectOptions"
            :remote-method="remoteMethods.interior"
          />
        </el-form-item>
        <el-form-item label="选配轮毂">
          <fetch-select
            v-model="form.wheelHubIdList"
            v-bind="selectOptions"
            :remote-method="remoteMethods.wheel"
          />
        </el-form-item>
        <el-form-item label="选装包">
          <fetch-select
            v-model="form.optionPackageIdList"
            v-bind="selectOptions"
            :remote-method="remoteMethods.optional"
          />
        </el-form-item>
        <el-form-item label="计划订单号">
          <tag-input v-model="form.ordNoList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="SAP流水号">
          <tag-input v-model="form.serNoList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="公告车型">
          <fetch-select
            v-model="form.vehicleRegisteredModelIdList"
            v-bind="selectOptions"
            :remote-method="remoteMethods.announcement"
          />
        </el-form-item>
        <el-form-item label="电池电芯">
          <fetch-select
            v-model="form.batteryCellIdList"
            v-bind="selectOptions"
            :remote-method="remoteMethods.battery"
          />
        </el-form-item>
        <el-form-item label="状态">
          <fetch-select :request="fetchOptions" enumCode="StatusEnum" v-model="form.status" placeholder="请选择" clearable
          filterable />
        </el-form-item>
      <el-form-item label="订单编号">
        <tag-input v-model="form.poList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="创建时间">
          <el-date-picker v-model="form.createTime" type="daterange" :picker-options="pickerOptions"
          unlink-panels
            value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
      </template>
      <page-search-action v-if="canList" v-model="show" is-expandable :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)"
        :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)"
        :disabled="selectionList.length === 0">批量停用</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page checkboxFixed :option-obj="optionObj"
        :get-config="getConfig" :save-or-update="saveOrUpdate" @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange" />
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload :visible="uploadDialogVisible" :id="'1'" @close="handleUploadDialogClose" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehstock/vdc/vehiclePo/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, vehicleSeriesList, listVehicleModel, listVehicleYearType, vehicleExterior, vehicleInterior, vehicleWheelHub, vehicleOptionPackage, vehicleBatteryCell, vehicleSalesVersionList } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, getEndOfDayString, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  status: '1',
  zppNoLike: '',
  zppNoList: [],
  vinLike: '',
  vinList: [],
  poLike: '',
  poList: [],
  poStatusList: ['2', '3', '4', '5', '6', '7', '8', '9'],
  carAllocated: '0',
  materialsCodeLike: '',
  materialsCodeList: [],
  materialsDescLike: '',
  materialsDescList: [],
  batteryCellIdList: [],
  vehicleRegisteredModelIdList: [],
  serNoLike: '',
  serNoList: [],
  ordNoLike: '',
  ordNoList: [],
  seriesIdList: [],
  modelIdList: [],
  exteriorIdList: [],
  interiorIdList: [],
  yearTypeIdList: [],
  wheelHubIdList: [],
  optionPackageIdList: [],
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
    Upload,
    TagInput
  },
  data () {
    return {
      pageTitle: '整车采购订单',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVS-vehiclePo',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      optionObj: {
        id: 'vehiclePoTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'po',
            label: '订单编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/vdc/vehiclePo/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'vin', label: 'VIN', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${row.vin}`, '_blank'); }, type: 'primary' }] },
          { props: 'createTime', label: '创建时间', visible: true, width: 160 },
          { props: 'inboundDateTime', label: 'VDC入库时间', visible: true, width: 160 },
          { props: 'zppNo', label: '产销识别码', visible: true, width: 150 },
          { props: 'poStatusLabel', label: '订单状态', visible: true, width: 120 },
          { props: 'reservedLabel', label: '销售预留', visible: true, width: 120 },
          { props: 'reservedTypeLabel', label: '销售预留类型', visible: true, width: 140 },
          { props: 'carAllocatedLabel', label: '是否配车', visible: true, width: 120 },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleMaterials/edit?id=${row.materialsCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleMaterials/edit?id=${row.materialsCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'batteryCellName', label: '电池电芯', visible: true, width: 120, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleBatteryCell/edit?id=${row.batteryCellId}`, '_blank'); }, type: 'primary' }] },
          { props: 'vehicleRegisteredModelName', label: '公告车型', visible: true, width: 150, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleRegisteredModel/edit?id=${row.vehicleRegisteredModelId}`, '_blank'); }, type: 'primary' }] },
          { props: 'outboundDateTime', label: 'VDC出库时间', visible: true, width: 160 },
          { props: 'mesStatusLabel', label: 'MES订单状态', visible: true, width: 150 },
          { props: 'carAllocatedDateTime', label: '配车时间', visible: true, width: 160 },
          { props: 'serNo', label: 'SAP流水号', visible: true, width: 160 },
          { props: 'ordNo', label: '计划订单号', visible: true, width: 160 },
          { props: 'seriesName', label: '车系', visible: true, width: 100, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleSeries/edit?id=${row.seriesId}`, '_blank'); }, type: 'primary' }] },
          { props: 'modelName', label: '车型', visible: true, width: 120, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleModel/edit?id=${row.modelId}`, '_blank'); }, type: 'primary' }] },
          { props: 'rangePowerName', label: '选配动力', visible: true, width: 120, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleRangePower/edit?id=${row.rangePowerId}`, '_blank'); }, type: 'primary' }] },
          { props: 'drivingRangeName', label: '续航里程', visible: true, width: 120, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleDrivingRange/edit?id=${row.drivingRangeId}`, '_blank'); }, type: 'primary' }] },
          { props: 'exteriorName', label: '外观', visible: true, width: 80, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleExterior/edit?id=${row.exteriorId}`, '_blank'); }, type: 'primary' }] },
          { props: 'interiorName', label: '内饰', visible: true, width: 80, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleInterior/edit?id=${row.interiorId}`, '_blank'); }, type: 'primary' }] },
          { props: 'yearTypeName', label: '年款', visible: true, width: 80, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleYearType/edit?id=${row.yearTypeId}`, '_blank'); }, type: 'primary' }] },
          { props: 'wheelHubName', label: '选配轮毂', visible: true, width: 120, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleWheelHub/edit?id=${row.wheelHubId}`, '_blank'); }, type: 'primary' }] },
          { props: 'optionPackageName', label: '选装包', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleOptionPackage/edit?id=${row.optionPackageId}`, '_blank'); }, type: 'primary' }] },
          { props: 'statusLabel', label: '状态', visible: true, width: 78 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'planReceiveCarTime', label: '计划收车时间', visible: true, width: 160 },
          { props: 'weldingOnlineTime', label: '焊装上线时间', visible: true, width: 160 },
          { props: 'weldingOfflineTime', label: '焊装下线时间', visible: true, width: 160 },
          { props: 'paintingOnlineTime', label: '涂装上线时间', visible: true, width: 160 },
          { props: 'paintingOfflineTime', label: '涂装下线时间', visible: true, width: 160 },
          { props: 'finalAssemblyOnlineTime', label: '总装上线时间', visible: true, width: 160 },
          { props: 'pdiOfflineTime', label: 'PDI下线时间', visible: true, width: 160 },
          { props: 'manufacturingDate', label: '制造日期', visible: true, width: 120 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 120 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 160 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 120 },
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
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      // 远程搜索方法
      remoteMethods: {
        series: async (query) => {
          return await vehicleSeriesList({ seriesNameLike: query });
        },
        // model: async (query) => {
        //   return await listVehicleModel({ modelNameLike: query });
        // },
        // 初始方法
        model: async (query) => {
          return await this.searchModel(query);
        },
        yearType: async (query) => {
          return await listVehicleYearType({ yearTypeNameLike: query });
        },
        exterior: async (query) => {
          return await vehicleExterior({ exteriorNameLike: query });
        },
        interior: async (query) => {
          return await vehicleInterior({ interiorNameLike: query });
        },
        wheel: async (query) => {
          return await vehicleWheelHub({ wheelHubNameLike: query });
        },
        optional: async (query) => {
          return await vehicleOptionPackage({ optionPackageNameLike: query });
        },
        battery: async (query) => {
          return await vehicleBatteryCell({ batteryCellNameLike: query });
        },
        announcement: async (query) => {
          return await vehicleSalesVersionList({ registeredModelNameLike: query });
        }
      }
    };
  },
  watch: {
    'form.seriesIdList': {
      handler (newVal) {
        // 车系变化时清空车型选择
        this.form.modelIdList = [];
        this.searchModel();
      },
      deep: true,
      immediate: true
    },
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    // 车型支持车系 ID 和 车型输入 方法
    async searchModel (query) {
      const params = {};

      if (query) {
        params.modelNameLike = query;
      }

      if (this.form.seriesIdList?.length) {
        params.seriesIds = this.form.seriesIdList;
      }

      return await listVehicleModel(params);
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/vehstock/vdc/vehiclePo/edit'
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
      };
      exportTable({
        businessType: '整车采购订单',
        dataFetchPath: 'vehstock/web/vdc/vehiclePo/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车采购订单.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelImportTask', '_blank'),
            { message: '正在导入中，是否要跳转"系统管理-文件管理-导入任务"中查看？' }
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
          const records = res?.records || [];
          this.optionObj.dataList = records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res?.total || 0;
        }).catch(err => {
          console.error('获取PO列表失败:', err);
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

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = getEndOfDayString(this.form.createTime[1]);
        }
      }

      if (Array.isArray(this.form.vinList) && this.form.vinList.length <= 1) {
        delete data.vinList;
        data.vinLike = this.form.vinList[0] || '';
      }
      if (Array.isArray(this.form.poList) && this.form.poList.length <= 1) {
        delete data.poList;
        data.poLike = this.form.poList[0] || '';
      }
      if (Array.isArray(this.form.materialsDescList) && this.form.materialsDescList.length <= 1) {
        delete data.materialsDescList;
        data.materialsDescLike = this.form.materialsDescList[0] || '';
      }
      if (Array.isArray(this.form.materialsCodeList) && this.form.materialsCodeList.length <= 1) {
        delete data.materialsCodeList;
        data.materialsCodeLike = this.form.materialsCodeList[0] || '';
      }
      if (Array.isArray(this.form.zppNoList) && this.form.zppNoList.length <= 1) {
        delete data.zppNoList;
        data.zppNoLike = this.form.zppNoList[0] || '';
      }
      if (Array.isArray(this.form.ordNoList) && this.form.ordNoList.length <= 1) {
        delete data.ordNoList;
        data.ordNoLike = this.form.ordNoList[0] || '';
      }
      if (Array.isArray(this.form.serNoList) && this.form.serNoList.length <= 1) {
        delete data.serNoList;
        data.serNoLike = this.form.serNoList[0] || '';
      }
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
  }
};
</script>

<style lang="scss" scoped>
.m-vehiclePo-list {}
</style>
