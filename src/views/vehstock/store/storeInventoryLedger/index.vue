<template>
  <div class="page-common m-store-inventory-ledger-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="VIN">
        <tag-input v-model="form.vinList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="车辆状态">
        <fetch-select :request="fetchOptions" enumCode="vehstock_vechicle_status" v-model="form.vechicleStatusList"
          placeholder="请选择" clearable multiple filterable />
      </el-form-item>
      <el-form-item label="物料描述" v-if="this.visibleCount === 3 || show">
        <tag-input v-model="form.materialsDescList" placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="出库时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.moveoutDateTime"
            type="daterange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="车辆物流状态">
          <fetch-select :request="fetchOptions" enumCode="vehstock_logistic_status" v-model="form.logisticStatusList"
            placeholder="请选择" clearable multiple filterable />
        </el-form-item>
        <el-form-item label="物流到店日期">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.vehicleArrivalOnTime"
            type="daterange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="是否预留">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.reserved" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="车辆类型">
          <fetch-select :request="fetchOptions" enumCode="vehstock_reservation_status" v-model="form.reservationStatusList"
            placeholder="请选择" clearable multiple filterable />
        </el-form-item>
        <el-form-item label="是否匹配订单">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.lockStatus" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="实车交车标识">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.vehdeLiveried" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="销售门店">
          <fetch-select
            filterable
            clearable
            remote
            collapseTags
            v-model="form.saleDealerCode"
            :remote-method="getDealerListByName"
            value-key="storeCode"
            label-key="storeName"
          />
        </el-form-item>
        <el-form-item label="交付门店">
          <fetch-select
            filterable
            clearable
            remote
            collapseTags
            v-model="form.deliveryDealerCode"
            :remote-method="getDealerListByName"
            value-key="storeCode"
            label-key="storeName"
          />
        </el-form-item>
        <el-form-item label="物料编码">
          <tag-input v-model="form.materialsCodeList" placeholder="请输入" />
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
        <el-form-item label="采购入库时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.poentryOnTime"
            type="daterange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="入库时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.moveinDateTime"
            type="daterange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="入库是否及时">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.inboundTimeLy" placeholder="请选择"
            clearable filterable />
        </el-form-item>
      </template>
      <page-search-action v-if="canList" v-model="show" is-expandable :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button size="small" @click="batchreseRvation('reserve')"
      :disabled="selectionList.length === 0">批量预留</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="batchreseRvation('cancelReserve')"
        :disabled="selectionList.length === 0">批量解预留</el-button>
        <el-button v-if="canEnableOrDisable" size="small" @click="batchreseRvation('car')"
        :disabled="selectionList.length === 0">运损车出库</el-button>
        <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchMove"
        :disabled="selectionList.length === 0">同门店移库</el-button>
        <el-button v-if="canDelete" size="small" @click="handleBatchDelete"
        :disabled="selectionList.length === 0">批量删除</el-button>
      <!-- <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)"
        :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)"
        :disabled="selectionList.length === 0">批量停用</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button> -->
    </div>
    <div class="ais-table-c">
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page checkboxFixed centralized
        :option-obj="optionObj" :get-config="getConfig" :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange" @handleSelect="handleSelectionChange" @listSelect="handleListSelect">
        <EditPage slot="centralizedViewSlot" :id="clickItemId" />
      </LPVxeTable>
    </div>
    <BatchDialog
      :visible="batchDialog"
      :selectionId="selectionListIds"
      :name="batchName"
      @close="closeBatchDialog"
      @submit="submitBatchReserve"
    />
    <MoveDialog
      :visible="moveDialog"
      :selectionId="selectionListIds"
      :saleDealerCode="dealerCode"
      @close="closeMoveDialog"
      @submit="submitBatchMove"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehstock/store/storeInventoryLedger/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, vehicleSeriesList, listVehicleModel, vehicleExterior, vehicleInterior, vehicleWheelHub, vehicleOptionPackage, vehicleBatteryCell, vehicleSalesVersionList, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import BatchDialog from './BatchDialog.vue';
import MoveDialog from './MoveDialog.vue';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  vinList: [],
  vechicleStatusList: [],
  materialsDescList: [],
  moveoutDate: '',
  logisticStatusList: [],
  vehicleArrivalOn: '',
  reserved: '',
  reservationStatusList: [],
  lockStatus: '',
  vehdeLiveried: '',
  saleDealerCode: '',
  deliveryDealerCode: '',
  poentryOn: '',
  inboundTimeLy: '',
  materialsCodeList: [],
  seriesIdList: [],
  modelIdList: [],
  exteriorIdList: [],
  interiorIdList: [],
  wheelHubIdList: [],
  optionPackageIdList: [],
  moveinDate: '',
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
    EditPage,
    BatchDialog,
    MoveDialog,
    TagInput
  },
  data () {
    return {
      pageTitle: '门店库存台账',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-storeInventoryLedger',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      batchDialog: false, // 批量操作弹窗
      batchName: '', // 批量操作弹窗标题
      selectionListIds: [], // 批量操作选中的行
      moveDialog: false, // 同门店移库弹窗
      dealerCode: '', // 销售门店编码
      clickItemId: '',
      optionObj: {
        id: 'storeInventoryLedgerTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/store/storeInventoryLedger/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'vechicleStatusLabel', label: '车辆状态', visible: true, width: 200 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'moveoutDate', label: '出库时间', visible: true, width: 200 },
          { props: 'moveoutTypeLabel', label: '出库类型', visible: true, width: 200 },
          { props: 'moveTypeLabel', label: '入库类型', visible: true, width: 200 },
          { props: 'logisticStatusLabel', label: '车辆物流状态', visible: true, width: 200 },
          { props: 'vehicleArrivalOn', label: '物流到店日期', visible: true, width: 200 },
          { props: 'inboundLatestDate', label: '要求入库截止日期', visible: true, width: 200 },
          { props: 'reservedLabel', label: '是否预留', visible: true, width: 200 },
          { props: 'reserveDesc', label: '预留原因', visible: true, width: 200 },
          { props: 'reservationStatusLabel', label: '车辆类型', visible: true, width: 200 },
          { props: 'lockStatusLabel', label: '是否匹配订单', visible: true, width: 200 },
          { props: 'lockTime', label: '匹配时间', visible: true, width: 200 },
          { props: 'isRepaidLabel', label: '是否还款', visible: true, width: 200 },
          { props: 'financeOrgName', label: '金融机构', visible: true, width: 200 },
          { props: 'settlementFundType', label: '结算资金类型', visible: true, width: 200 },
          { props: 'vehdeLiveriedLabel', label: '实车交车标识', visible: true, width: 200 },
          { props: 'syncSourceLabel', label: '标识来源', visible: true, width: 200 },
          { props: 'isFenceCrossedLabel', label: '是否异常车辆', visible: true, width: 200 },
          { props: 'fenceCrossedTypeLabel', label: '车辆异常类型', visible: true, width: 200 },
          { props: 'vehdeLiveriedOn', label: '标识记录日期', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店名称', visible: true, width: 200 },
          { props: 'deliveryDealerName', label: '交付门店名称', visible: true, width: 200 },
          { props: 'poentryDealerName', label: '采购入库门店名称', visible: true, width: 200 },
          { props: 'poentryOn', label: '采购入库时间', visible: true, width: 200 },
          { props: 'inboundTimeLyLabel', label: '入库是否及时', visible: true, width: 200 },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 200 },
          { props: 'seriesName', label: '车系', visible: true, width: 200 },
          { props: 'modelName', label: '车型', visible: true, width: 200 },
          { props: 'exteriorName', label: '外观', visible: true, width: 200 },
          { props: 'interiorName', label: '内饰', visible: true, width: 200 },
          { props: 'wheelHubName', label: '选配轮毂', visible: true, width: 200 },
          { props: 'optionPackageName', label: '选装包', visible: true, width: 200 },
          { props: 'moveinDate', label: '入库时间', visible: true, width: 200 },
          { props: 'receivedBy', label: '收车确认人', visible: true, width: 200 },
          { props: 'receivedOn', label: '收车确认时间', visible: true, width: 200 },
          { props: 'receivedplatformLabel', label: '收车操作来源', visible: true, width: 200 },
          // { props: 'statusLabel', label: '状态', visible: true, width: 200 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
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
    // 销售门店搜索
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
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
        path: '/vehstock/store/storeInventoryLedger/edit'
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
        businessType: '门店库存台账',
        dataFetchPath: 'vehstock/web/store/storeInventoryLedger/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店库存台账.xlsx');
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

      if (this.form.poentryOnTime) {
        delete data.poentryOnTime;
        if (this.form.poentryOnTime.length > 1) {
          data.poentryOnStart = this.form.poentryOnTime[0];
          data.poentryOnEnd = this.form.poentryOnTime[1];
        }
      }

      if (this.form.moveinDateTime) {
        delete data.moveinDateTime;
        if (this.form.moveinDateTime.length > 1) {
          data.moveinDateStart = this.form.moveinDateTime[0];
          data.moveinDateEnd = this.form.moveinDateTime[1];
        }
      }

      if (this.form.moveoutDateTime) {
        delete data.moveoutDateTime;
        if (this.form.moveoutDateTime.length > 1) {
          data.moveoutDateStart = this.form.moveoutDateTime[0];
          data.moveoutDateEnd = this.form.moveoutDateTime[1];
        }
      }

      if (this.form.vehicleArrivalOnTime) {
        delete data.vehicleArrivalOnTime;
        if (this.form.vehicleArrivalOnTime.length > 1) {
          data.vehicleArrivalOnStart = this.form.vehicleArrivalOnTime[0];
          data.vehicleArrivalOnEnd = this.form.vehicleArrivalOnTime[1];
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
    // 批量预留
    batchreseRvation (val) {
      // 筛选已预留和未预留的车辆 1:已预留 0:未预留
      const reservedList = this.selectionList.filter(item => Number(item.reserved) === 1);
      const unreservedList = this.selectionList.filter(item => Number(item.reserved) === 0);
      const vechicleStatusList = this.selectionList.filter(item => Number(item.vechicleStatus) !== 12);
      if (val === 'reserve') {
        // 批量预留时，检查是否存在已预留的车辆
        if (reservedList.length > 0) {
          const plates = reservedList.map(item => item.vin).join('、');
          this.$message({
            type: 'warning',
            message: `选中的${plates}车辆存在预留，请检查！`
          });
          return;
        }
      } else if (val === 'cancelReserve') {
        // 批量解预留时，检查是否存在未预留的车辆
        if (unreservedList.length > 0) {
          const plates = unreservedList.map(item => item.vin).join('、');
          this.$message({
            type: 'warning',
            message: `选中的${plates}车辆未预留，请检查！`
          });
          return;
        }
      } else if (val === 'car') {
        // 运损车出库
        if (vechicleStatusList.length > 0) {
          const plates = vechicleStatusList.map(item => item.vin).join('、');
          this.$message({
            type: 'warning',
            message: `选中的${plates}车辆不符合运损车出库条件，请检查！`
          });
          return;
        }
      }
      this.selectionListIds = this.selectionList.map(item => item.id) || [];
      this.batchName = val;
      this.batchDialog = true;
    },
    closeBatchDialog () {
      this.batchDialog = false;
    },
    submitBatchReserve () {
      this.batchDialog = false;
      this.getData();
    },
    // 同门店移库
    handleBatchMove () {
      this.selectionListIds = this.selectionList.map(item => item.id) || [];
      // 获取第一个数据的 code 作为基准
      const firstCode = this.selectionList[0].saleDealerCode;
      this.dealerCode = firstCode;
      // 检查是否每一个数据的 code 都等于第一个数据的 code
      const isAllSame = this.selectionList.every(item => item.saleDealerCode === firstCode);

      if (!isAllSame) {
        // 如果不一致，阻止操作并提示
        return this.$message.warning('只能选择相同销售门店名称的数据进行批量操作');
      };
      // 车辆状态需要是：待提交PDI，PDI待修复，已入门店库
      const plates = this.selectionList.filter(item => ![12, 20, 25].includes(item.vechicleStatus)).map(item => item.vin).join('、');
      if (plates) {
        this.$message({
          type: 'warning',
          message: `选中的${plates}车辆不符合移库条件，请检查！`
        });
        return;
      }
      this.moveDialog = true;
    },
    closeMoveDialog () {
      this.moveDialog = false;
    },
    submitBatchMove () {
      this.moveDialog = false;
      this.dealerCode = '';
      this.getData();
    },
  }
};
</script>

<style lang="scss" scoped>
.m-store-inventory-ledger-list {}
</style>
