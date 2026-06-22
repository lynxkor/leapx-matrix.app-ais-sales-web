<template>
  <div class="page-common m-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="批售订单号">
        <tag-input v-model="form.wholesaleOrderCodes" placeholder="请输入" />
      </el-form-item>
        <el-form-item label="配车VIN码">
          <tag-input v-model="form.vins" placeholder="请输入" />
        </el-form-item>
         <el-form-item label="订单时间"  v-show="this.visibleCount === 3 || show">
        <dateranges
          v-model="form.orderTime"
          :setDefault="true"
          deftTime="最近一年"
          ref="transactionTime"/>
        </el-form-item>
      <template v-if="show">
        <el-form-item label="订单状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vw_wholesale_order_status"
          v-model="form.orderStatuses"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
        <el-form-item label="物料描述">
          <tag-input v-model="form.orderMaterialDescs" placeholder="请输入" />
        </el-form-item>
         <el-form-item label="商城订单号">
          <tag-input v-model="form.mallOrderCodes" placeholder="请输入" />
        </el-form-item>
         <el-form-item label="ERP发票是否开票">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.invoiceFlag"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
          <el-form-item label="订单分类">
            <fetch-select
              :remote-method="getWholesaleEorderTyprList"
              remote
              v-model="form.orderCategories"
              placeholder="请选择"
              clearable
              multiple
              filterable
            />
        </el-form-item>
            <el-form-item label="确认状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_wholesale_confirm_status"
            v-model="form.confirmStatuses"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
         <el-form-item label="所属大区">
          <fetch-select
            filterable
            clearable
            remote
            multiple
            collapse-tags
            v-model="form.regionCodes"
            :remote-method="getRegionList"
            value-key="orgCode"
            label-key="orgName"
          />
        </el-form-item>
        <el-form-item label="销售门店">
            <tag-input v-model="form.saleDealerNames" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="整车补货单号">
          <el-input
          placeholder="请输入"
          v-model="form.replenishApplyCodeLike"
          clearable
        />
          <!-- <tag-input v-model="form.replenishApplyCodes" placeholder="请输入" /> -->
        </el-form-item>
      <el-form-item label="创建时间" >
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
          <el-form-item label="配车时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.allocateTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="结算时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.settleTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
            <el-form-item label="年款名称">
              <fetch-select
                :remote-method="listVehicleYearType"
                remote
                v-model="form.yearTypeIds"
                placeholder="请选择"
                labelKey="name"
                valueKey="id"
                clearable
                multiple
                collapseTags
                filterable
                :options="yearTypeList"
              />
        </el-form-item>
         <el-form-item label="车型名称">
          <fetch-select
            :remote-method="modelSearch"
            remote
            reserve-keyword
            :options="modelList" v-model="form.modelIds" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable
            />
        </el-form-item>
           <el-form-item label="专项活动">
            <fetch-select
            :remote-method="prodScheduleActivitySearch"
            remote
            reserve-keyword
            labelKey="name"
            valueKey="id"
            v-model="form.prodScheduleActivityIds"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>

         <el-form-item label="省份">
            <fetch-select
              filterable
              clearable
              remote
              v-model="form.provinceCode"
              :remote-method="getProvince"
              value-key="code"
              label-key="name"
              @change="handleChangeProvince"
            />
        </el-form-item>
          <el-form-item label="城市">
            <fetch-select
            filterable
            clearable
            v-model="form.cityCode"
            :options="cityOptions"
            value-key="code"
            label-key="name"
          />
        </el-form-item>
         <el-form-item label="所属母公司">
           <fetch-select
                  :remote-method="getParentCompany"
                  remote
                  v-model="form.dealerCompanyCodes"
                  placeholder="请选择"
                  labelKey="companyName"
                  valueKey="companyCode"
                  multiple
                  clearable
                  filterable
                  />

          <!-- <tag-input v-model="form.dealerCompanyCodes" placeholder="请输入" /> -->
        </el-form-item>
        <el-form-item label="允许锁零售单">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.allowLockRetail"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="批售方式">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_wholesale_way"
            v-model="form.wholesaleWays"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
          <el-form-item label="结算资金类型">
            <fetch-select
                   :options="settleFundTypeOptions"
                    v-model="form.settleFundTypes"
                    placeholder="请选择"
                    clearable
                    filterable
                    multiple
                  />
        </el-form-item>
        <el-form-item label="金融机构名称">
          <fetch-select
            :remote-method="repairItemSearch"
            remote
            reserve-keyword
            labelKey="name"
            valueKey="id"
            v-model="form.financialOrganizationIds"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="确认时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.confirmTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <!-- <el-form-item label="销售门店编码">
          <el-input
            placeholder="请输入"
            v-model="form.saleDealerCodes"
            clearable
          />
        </el-form-item> -->
          <el-form-item label="是否已锁定">
            <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.lockStatus"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="车辆交付状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="vehstock_vehicle_delivery_status"
            v-model="form.deliveryStatuses"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="初始交付周期说明">
          <tag-input v-model="form.initDeliveryCycleDescs" placeholder="请输入" />
        </el-form-item>
          <el-form-item label="动态交付周期说明">
            <tag-input v-model="form.dynamicDeliveryCycleDescs" placeholder="请输入" />
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
      <button-group collapse-direction="left" maxWidth="95%">
        <el-button v-permission="moduleKey+'-batchConfirm'"  size="small" :disabled="selectionList.length === 0" @click="handleBatchConfirm">批售确认</el-button>
        <el-button v-permission="moduleKey+'-batchAllocateVehicle'" size="small" :disabled="selectionList.length === 0" @click="handleBatchAllocateVehicle">配车</el-button>
        <el-button v-permission="moduleKey+'-batchSettleSubmit'"  size="small" :disabled="selectionList.length === 0" @click="handleBatchSettleSubmit">结算</el-button>
        <el-button v-permission="moduleKey+'-batchCancelSettle'" size="small" :disabled="selectionList.length === 0" @click="handleBatchCancelSettle">取消结算</el-button>
        <el-button v-permission="moduleKey+'-batchCancel'" size="small" :disabled="selectionList.length === 0" @click="handleBatchCancel">作废</el-button>
        <el-button v-permission="moduleKey+'-batchSetAutoAllocate'"  size="small" :disabled="selectionList.length === 0" @click="handleBatchCancelAllocateVehicle">取消配车</el-button>
        <el-button v-permission="moduleKey+'-batchSetAutoAllocate'"  size="small" :disabled="selectionList.length === 0" @click="handleBatchSetAutoAllocate">设置自动配车</el-button>
        <el-button v-permission="moduleKey+'-batchSetAutoAllocate'" size="small" :disabled="selectionList.length === 0" @click="handleBatchSetNotAutoAllocate">设置不自动配车</el-button>
        <el-button v-permission="moduleKey+'-setEmergencyOrder'"  size="small" :disabled="selectionList.length === 0" @click="handleSetEmergencyOrder">设置急单</el-button>
        <el-button v-permission="moduleKey+'-setEmergencyOrder'" size="small" :disabled="selectionList.length === 0" @click="handleCancelEmergencyOrder">取消急单</el-button>
        <el-button v-permission="moduleKey+'-refreshPrice'" size="small" @click="handleRefreshPriceCoefficient">刷新价格</el-button>
        <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
        <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      </button-group>
    </div>
    <div
      class="ais-table-c"
    >
      <div>
        <el-tabs v-model="tabName" @tab-click="handleClickTab">
          <el-tab-pane label="全量" name="1"></el-tab-pane>
          <!-- <el-tab-pane label="未完成批售订单" name="2"></el-tab-pane> -->
          <!-- <el-tab-pane label="待处理现车批售" name="3"></el-tab-pane> -->
          <el-tab-pane label="待结算批售单" name="4"></el-tab-pane>
          <el-tab-pane label="待配车批售单" name="5"></el-tab-pane>
        </el-tabs>
      </div>
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
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      id="importPriceCoefficient"
      @close="handleUploadDialogClose"
    />

    <BatchCancelInput
      :visible.sync="showBatchCancelDialog"
      :cancel-ids="selectionList.map(item => item.id)"
      @confirm="cancelApproval"
    />
    <SetEmergencyOrderInput
      :visible.sync="showSetEmergencyOrderDialog"
      :emergency-ids="selectionList.map(item => item.id)"
      @confirm="emergencyApproval"
    />

    <BatchAllocateVehicleInput
      :visible.sync="showBatchAllocateVehicleDialog"
      :cancel-ids="selectionList.map(item => item.id)"
      @confirmBatchAllocateVehicle="confirmBatchAllocateVehicle"
    />

     <CancleBatchAllocateVehicleInput
      :visible.sync="showCancleBatchAllocateVehicleDialog"
      :cancel-ids="selectionList.map(item => item.id)"
      @cancleBatchAllocateVehicle="cancleBatchAllocateVehicle"
    />

    <BatchCancelSettleInput
      :visible.sync="showBatchCancelSettleDialog"
      :cancel-ids="selectionList.map(item => item.id)"
      @batchCancelSettle="batchCancelSettle"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, batchConfirmItem, setEmergencyOrderItem, batchCancelItem, batchAllocateVehicleItem, batchSettleSubmitItem, batchCancelSettleItem, batchSetAutoAllocateItem, refreshPriceItem, batchCancleAllocateVehicleItem } from '@/api/vehwholesale/wholesale/vehicleWholesaleOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listVehicleYearType, vehicleModelList, cityPage, getProvinceTree, getParentCompany, getRigion } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import BatchCancelInput from './BatchCancelInput.vue';
import BatchAllocateVehicleInput from './BatchAllocateVehicleInput.vue';
import CancleBatchAllocateVehicleInput from './CancleBatchAllocateVehicleInput.vue';
import SetEmergencyOrderInput from './SetEmergencyOrderInput.vue';
import BatchCancelSettleInput from './BatchCancelSettleInput.vue';
import ButtonGroup from '@/libs/components/ButtonGroup';
import dateranges from '@/libs/components/dateranges';
import { listIdNames as listWholesaleProdScheduleActivity } from '@/api/vehwholesale/basic/wholesaleProdScheduleActivity/index';
import { listIdNames as listFundFinancialOrganization } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  wholesaleOrderCode: '',
  status: '',
  orderTime: [],
  confirmTime: '',
  saleDealerCode: '',
  orderCategory: '',
  saleDealerName: '',
  wholesaleWay: '',
  materialsDesc: '',
  allocateTime: '',
  vin: '',
  replenishApplyCode: '',
  regionName: '',
  cityName: '',
  prodScheduleActivityId: '',
  allowLockRetail: '',
  retailPrice: '',
  invoiceDiscountType: '',
  invoiceCoefficient: '',
  wholesalePrice: '',
  rebateUseType: '',
  rebateCoefficient: '',
  usedRebateAmount: '',
  erpSaleOrderCode: '',
  erpInvoiceCode: '',
  syncSapMsg: '',
  createTime: [],
  dealerCompanyCode: '',
  applyReason: '',
  dealerCompanyName: '',
  interiorName: '',
  modelName: '',
  exteriorName: '',
  wheelHubName: '',
  yearTypeName: '',
  specialRemark: '',
  firstCancelAllocateTime: '',
  firstAllocateTime: '',
  outboundTime: '',
  confirmStatus: '',
  lockStatus: '',
  lockTime: '',
  createdShippingPlan: '',
  confirmUserName: '',
  settleWay: '',
  allocateWay: '',
  cooperateType: '',
  settleFundType: '',
  emergencyOrderRemark: '',
  deliveryWay: '',
  deliveryStatus: '',
  orderMaterialCode: '',
  needAutoAllocateCar: '',
  dealerWarehouseName: '',
  logisticsReserve: '',
  logisticsReserveRemark: '',
  initDeliveryCycleDesc: '',
  dynamicDeliveryCycleDesc: '',
  batteryCellName: '',
  cityCode: '',
  exteriorId: '',
  replenishApplyDetailCode: '',
  wholesaleOrderId: '',
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
    Upload,
    TagInput,
    BatchCancelInput,
    SetEmergencyOrderInput,
    BatchAllocateVehicleInput,
    CancleBatchAllocateVehicleInput,
    BatchCancelSettleInput,
    ButtonGroup,
    dateranges
  },
  data () {
    return {
      pageTitle: '整车批售订单',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-vehicleWholesaleOrder',
      form: {
        ...defaultForm
      },
      tabName: '1',
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      showBatchCancelDialog: false,
      showSetEmergencyOrderDialog: false,
      showBatchAllocateVehicleDialog: false,
      showCancleBatchAllocateVehicleDialog: false,
      showBatchCancelSettleDialog: false,
      yearTypeList: [],
      options: [],
      modelList: [],
      cityOptions: [],
      ALLOWED_STATUS: [0, 11],
      settleFundTypeOptions: [],
      ALLOWED_CANCELALLOCATEVEHICLE_STATUS: [1, 5, 4],
      ALLOW_REFRESH: [0, 1, 4, 5, 11],
      SETTLED_SUCCESSFULLY_STATUS: [3],
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'orderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'wholesaleOrderCode',
            label: '批售订单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/wholesale/vehicleWholesaleOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'orderStatusLabel', label: '订单状态', visible: true, width: 100 },
          { props: 'orderTime', label: '订单时间', visible: true, width: 200 },
          { props: 'confirmTime', label: '确认时间', visible: true, width: 200 },
          {
            props: 'saleDealerName',
            label: '销售门店',
            visible: true,
            width: 200,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.saleDealerCode}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          { props: 'orderCategoryLabel', label: '订单分类', visible: true, width: 100 },
          { props: 'wholesaleWayLabel', label: '批售方式', visible: true, width: 120 },
          {
            props: 'orderMaterialsCode',
            label: '物料编码',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleMaterials/edit?id=${row.orderMaterialsId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'orderMaterialsDesc',
            label: '物料描述',
            visible: true,
            width: 240,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleMaterials/edit?id=${row.orderMaterialsId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'allocateTime', label: '配车时间', visible: true, width: 200 },
          { props: 'settleTime', label: '结算时间', visible: true, width: 200 },
          { props: 'materialsCode', label: '配车物料码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleMaterials/edit?id=${row.materialsCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'vin', label: '配车VIN码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${row.vin}`, '_blank'); }, type: 'primary' }] },
          { props: 'replenishApplyCode', label: '整车补货单号', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/vehwholesale/replenish/dealerVehicleReplenishApply/edit?id=${row.replenishApplyCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'regionName', label: '所属大区', visible: true, width: 200 },
          { props: 'provinceName', label: '省份', visible: true, width: 200 },
          { props: 'cityName', label: '城市', visible: true, width: 200 },
          { props: 'prodScheduleActivityName', label: '专项活动', visible: true, width: 200 },
          { props: 'allowLockRetailLabel', label: '允许锁零售单', visible: true, width: 200 },
          { props: 'retailPrice', label: '零售价', visible: true, width: 120, align: 'right' },
          { props: 'invoiceDiscountTypeLabel', label: '开票类型', visible: true, width: 120 },
          { props: 'invoiceCoefficient', label: '开票系数', visible: true, width: 120, align: 'right' },
          { props: 'wholesalePrice', label: '批售价', visible: true, width: 120, align: 'right' },
          { props: 'rebateUseTypeLabel', label: '返利使用类型', visible: true, width: 150 },
          { props: 'rebateCoefficient', label: '返利使用系数', visible: true, width: 150, align: 'right' },
          { props: 'usedRebateAmount', label: '使用返利金额', visible: true, width: 150, align: 'right' },
          { props: 'erpSaleOrderCode', label: 'ERP销售订单号', visible: true, width: 200 },
          { props: 'erpDeliverOrder', label: 'ERP交货单', visible: true, width: 200 },
          { props: 'erpInvoiceCode', label: 'ERP发票号', visible: true, width: 200 },
          { props: 'syncSapMsg', label: '同步SAP状态', visible: true, width: 200 },
          { props: 'applyReason', label: '申请原因', visible: true, width: 200 },
          { props: 'dealerCompanyName', label: '母公司名称', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/companyDetails?companyCode=${row.dealerCompanyCode}`, '_blank'); }, type: 'primary' }] },
          // { props: 'dealerCompanyCode', label: '母公司代码', visible: true, width: 200 },
          // { props: 'saleDealerCode', label: '销售公司编码', visible: true, width: 200 },
          {
            props: 'interiorName',
            label: '内饰',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleInterior/edit?id=${row.interiorId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'modelName',
            label: '车型',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleModel/edit?id=${row.modelId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'exteriorName',
            label: '外饰风格',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleExterior/edit?id=${row.exteriorId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'wheelHubName',
            label: '选配轮毂',
            visible: true,
            width: 200,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/sales/datacenter/materials/vehicleWheelHub/edit?id=${row.wheelHubId}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          { props: 'specialRemark', label: '特殊备注', visible: true, width: 200 },
          { props: 'firstCancelAllocateTime', label: '首次取消配车时间', visible: true, width: 200 },
          { props: 'firstAllocateTime', label: '首次配车时间', visible: true, width: 200 },
          { props: 'outboundTime', label: '出库时间', visible: true, width: 200 },
          { props: 'lockStatusLabel', label: '是否已锁定', visible: true, width: 200 },
          { props: 'lockTime', label: '锁定时间', visible: true, width: 200 },
          {
            props: 'mallOrderCode',
            label: '商城订单号',
            visible: true,
            width: 200,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/sales/vehretail/orderManager/retailOrderInfo/edit?id=${row.retailOrderId}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          { props: 'confirmStatusLabel', label: '确认状态', visible: true, width: 200 },
          { props: 'createdShippingPlanLabel', label: '是否创建发运单计划', visible: true, width: 200 },
          { props: 'hasSettleFailedLabel', label: '是否存在结算失败', visible: true, width: 200 },
          { props: 'confirmUserName', label: '确认人', visible: true, width: 200 },
          {
            props: 'yearTypeName',
            label: '年款',
            visible: true,
            width: 200,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/sales/datacenter/materials/vehicleYearType/edit?id=${row.yearTypeId}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          { props: 'settleWayLabel', label: '结算方式', visible: true, width: 200 },
          { props: 'allocateWayLabel', label: '配车方式', visible: true, width: 200 },
          { props: 'cooperateTypeLabel', label: '合作类型', visible: true, width: 200 },
          { props: 'settleFundTypeLabel', label: '结算资金类型', visible: true, width: 200 },
          {
            props: 'financialOrganizationName',
            label: '金融机构',
            visible: true,
            width: 200,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=${row.financialOrganizationId}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          { props: 'creditSalesAmount', label: '融资金额/赊账', visible: true, width: 180, align: 'right' },
          // { props: 'emergencyOrderRemark', label: '急单备注', visible: true, width: 200 },
          { props: 'downPaymentRatio', label: '首付款比例%', visible: true, width: 150, align: 'right' },
          // { props: 'downPaymentRatio', label: '配车顺序时间', visible: true, width: 200 },
          { props: 'deliveryStatusLabel', label: '车辆交付状态', visible: true, width: 200 },
          { props: 'logisticsReserve', label: '物流说明', visible: true, width: 200 },
          { props: 'initDeliveryCycleDesc', label: '初始交付周期说明', visible: true, width: 200 },
          { props: 'dynamicDeliveryCycleDesc', label: '动态交付周期说明', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '日志',
              click: (rowIndex, row) => {
                this.$auditLog.show({ id: row.id });
              },
              type: 'info'
            }
            ]
          }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.$nextTick(() => {
      this.getData();
    });
    this.getCity();
    this.fetchSettleFundTypeOptions();
  },
  methods: {
    repairItemSearch (query) { return listFundFinancialOrganization({ organizationNameLike: query, status: 1 }); },
    async fetchSettleFundTypeOptions () {
      const response = await getEnum('vw_fundtype');
      this.settleFundTypeOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['1050', '1010', '2010'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    handleRefreshPriceCoefficient () {
      const ids = this.selectionList.map(item => item.id) || [];
      refreshPriceItem({ idSet: ids }).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功!'
        });
        this.getData();
      });
    },
    allAllocateVehicleConfirm (items) {
      if (items.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要操作的数据！!'
        });
        return false;
      };
      for (const item of items) {
        if (item.confirmStatus !== 1020) {
          this.$message({
            type: 'error',
            message: '该批售订单确认状态未确认，无法进行配车操作!'
          });
          return false;
        };
        if (!this.ALLOWED_STATUS.includes(item.orderStatus)) {
          this.$message({
            type: 'error',
            message: '选择的数据中[订单状态]必须为[未配车,配车失败]!'
          });
          return false;
        };
      }
      return true;
    },
    handleBatchAllocateVehicle () {
      // this.showBatchAllocateVehicleDialog = true;
      const ids = this.selectionList.map(item => item.id) || [];
      const data = {
        idSet: ids
      };
      this.$confirm('是否确定要执行配车操作？', '操作提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchAllocateVehicleItem(data).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getData();
        });
      }).catch(() => {});
    },
    allBatchSetAutoAllocateConfirm (items) {
      if (items.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要操作的数据！!'
        });
        return false;
      };
      for (const item of items) {
        if (!this.ALLOWED_STATUS.includes(item.orderStatus)) {
          this.$message({
            type: 'error',
            message: '存在' + item.orderStatusLabel + '的订单，请重新核对需要操作的订单！'
          });
          return false;
        };
        if (item.needAutoAllocateCar !== 0) {
          this.$message({
            type: 'error',
            message: '存在已设置为参与自动配车的订单，请重新核对需要操作的订单！'
          });
          return false;
        }
      }
      return true;
    },
    handleBatchSetAutoAllocate () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('是否确定要执行自动配车操作？', '操作提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchSetAutoAllocateItem({
          ids: ids,
          needAutoAllocateCar: 1
        }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getData();
        });
      }).catch(() => {});
    },
    BatchSetNotAutoAllocateConfirm (items) {
      if (items.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要操作的数据！!'
        });
        return false;
      };
      for (const item of items) {
        if (!this.ALLOWED_STATUS.includes(item.orderStatus)) {
          this.$message({
            type: 'error',
            message: '存在' + item.orderStatusLabel + '的订单，请重新核对需要操作的订单！'
          });
          return false;
        };
        if (item.needAutoAllocateCar !== 1) {
          this.$message({
            type: 'error',
            message: '存在已设置为不自动配车的订单，请重新核对需要操作的订单！'
          });
          return false;
        }
      }
      return true;
    },
    handleBatchSetNotAutoAllocate () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('是否确定要执行取消自动配车操作？', '操作提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchSetAutoAllocateItem({
          ids: ids,
          needAutoAllocateCar: 0
        }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getData();
        });
      }).catch(() => {});
    },
    handleBatchSettleSubmit () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('是否需要对批售订单进行结算?', '操作提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchSettleSubmitItem({
          idSet: ids
        }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getData();
        });
      }).catch(() => {});
    },
    batchCancelSettleConfirm (items) {
      if (items.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要操作的数据！!'
        });
        return false;
      };
      for (const item of items) {
        if (!this.SETTLED_SUCCESSFULLY_STATUS.includes(item.orderStatus)) {
          this.$message({
            type: 'error',
            message: '选择的数据中[订单状态]必须为[结算成功]!'
          });
          return false;
        };
        if (item.createdShippingPlan !== 0) {
          this.$message({
            type: 'error',
            message: '整车补货订单' + item.wholesaleOrderCode + '已经做了发运计划不能取消结算!'
          });
          return false;
        }
      }
      return true;
    },
    handleBatchCancelSettle () {
      this.showBatchCancelSettleDialog = true;
      // const items = this.selectionList.map(item => item) || [];
      // const allowStatus = this.batchCancelSettleConfirm(items);
      // if (allowStatus) {
      //   this.showBatchCancelSettleDialog = true;
      // }
    },
    CancelAllocateVehicleConfirm (items) {
      if (items.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要操作的数据！!'
        });
        return false;
      };
      for (const item of items) {
        if (!this.ALLOWED_CANCELALLOCATEVEHICLE_STATUS.includes(item.orderStatus)) {
          this.$message({
            type: 'error',
            message: '选择的数据中[订单状态]必须为[已完成配车、取消结算、结算失败]!'
          });
          return false;
        };
      }
      return true;
    },
    cancleBatchAllocateVehicle (data) {
      const ids = this.selectionList.map(item => item.id) || [];
      return batchCancleAllocateVehicleItem({
        idSet: ids,
        cancelAllocateVehicleType: data.cancelAllocateVehicleType
      }).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.getData();
      });
    },
    handleBatchCancelAllocateVehicle () {
      this.showCancleBatchAllocateVehicleDialog = true;
      // const items = this.selectionList.map(item => item) || [];
      // const allowStatus = this.CancelAllocateVehicleConfirm(items);
      // if (allowStatus) {
      //   this.showCancleBatchAllocateVehicleDialog = true;
      // }
    },
    async getRegionList (params) {
      return getRigion({ orgName: params });
    },
    async prodScheduleActivitySearch (query) {
      return listWholesaleProdScheduleActivity({ activityNameLike: query, status: 1 });
    },
    async getParentCompany (query) {
      try {
        const res = await getParentCompany({ parentCompanyName: query });
        console.log(res);
        this.parentCompanyNames = res;
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    allAllowCancelEmergency (items) {
      if (items.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要操作的数据！!'
        });
        return false;
      };
      for (const item of items) {
        if (!this.ALLOWED_STATUS.includes(item.orderStatus)) {
          this.$message({
            type: 'error',
            message: '只有该订单状态【未配车、或配车失败】可以取消急单!'
          });
          return false;
        };
        if (item.emergencyOrder !== 1) {
          this.$message({
            type: 'error',
            message: '只有【已设置急单】可以取消急单!'
          });
          return false;
        };
      }
      return true;
    },
    handleCancelEmergencyOrder () {
      const ids = this.selectionList.map(item => item.id) || [];
      // const items = this.selectionList.map(item => item) || [];
      // const allowStatus = this.allAllowCancelEmergency(items);
      // if (allowStatus) {
      const params = {
        emergencyOrder: 0,
        ids: ids
      };
      setEmergencyOrderItem(params).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功!'
        });
        this.getData();
      });
    },
    emergencyApproval (data) {
      return setEmergencyOrderItem(data).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.getData();
      });
    },
    batchCancelSettle (data) {
      const ids = this.selectionList.map(item => item.id) || [];
      return batchCancelSettleItem({
        idSet: ids,
        cancelSettleType: data.cancelSettleType
      }).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.getData();
      });
    },
    confirmBatchAllocateVehicle (data) {
      return batchAllocateVehicleItem(data).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.getData();
      });
    },
    cancelApproval (data) {
      return batchCancelItem(data).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.getData();
      });
    },
    allAllowConfirm (items) {
      if (items.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要操作的数据！!'
        });
        return false;
      };
      for (const item of items) {
        if (item.confirmStatus !== 1010) {
          this.$message({
            type: 'error',
            message: '选择的数据中[确认状态]必须为[未确认]!'
          });
          return false;
        };
        if (!this.ALLOWED_STATUS.includes(item.orderStatus)) {
          this.$message({
            type: 'error',
            message: '选择的数据中[订单状态]必须为[未配车,配车失败]!'
          });
          return false;
        };
        if (item.orderCategory !== 0) {
          this.$message({
            type: 'error',
            message: '选择的数据中[订单分类]必须为[商品车订单]!'
          });
          return false;
        }
      }
      return true;
    },
    allAllowCancel (items) {
      if (items.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要操作的数据！!'
        });
        return false;
      };
      for (const item of items) {
        if (!this.ALLOWED_STATUS.includes(item.orderStatus)) {
          this.$message({
            type: 'error',
            message: '订单已完成配车，不允许作废!'
          });
          return false;
        };
        if (item.allowLockRetail === 0) {
          this.$message({
            type: 'error',
            message: '批售订单已绑定零售订单,不允许作废!'
          });
          return false;
        }
      }
      return true;
    },
    allAllowEmergency (items) {
      if (items.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要操作的数据！'
        });
        return false;
      };
      for (const item of items) {
        if (!this.ALLOWED_STATUS.includes(item.orderStatus)) {
          this.$message({
            type: 'error',
            message: '只有【订单状态】为未配车、配车失败的记录可以设置，请核实！'
          });
          return false; // 只要有一个不满足，立即终止操作
        }
      }
      return true;
    },
    handleSetEmergencyOrder () {
      this.showSetEmergencyOrderDialog = true;
      // const items = this.selectionList.map(item => item) || [];
      // const allowStatus = this.allAllowEmergency(items);
      // if (allowStatus) {
      //   this.showSetEmergencyOrderDialog = true;
      // }
    },
    handleBatchCancel () {
      this.showBatchCancelDialog = true;
      // const items = this.selectionList.map(item => item) || [];
      // const allowStatus = this.allAllowCancel(items);
      // if (allowStatus) {
      //   this.showBatchCancelDialog = true;
      // }
    },
    // 批量确认
    handleBatchConfirm () {
      const ids = this.selectionList.map(item => item.id) || [];
      const items = this.selectionList.map(item => item) || [];
      const allowStatus = this.allAllowConfirm(items);
      if (allowStatus) {
        this.$confirm('是否需要对批售订单进行批售确认? 注意：确认订单结算资金类型', '操作提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchConfirmItem({
            idSet: ids
          }).then(() => {
            this.$message({
              type: 'success',
              message: '提交成功!'
            });
            this.getData();
          });
        }).catch(() => {});
      }
    },
    handleClickTab () {
      this.form.queryTab = this.tabName;
      this.getData();
    },
    // 查询所有省市区
    async getProvince (params) {
      const res = await getProvinceTree();
      let list = res || [];
      if (params && params.trim()) {
        const searchText = params.trim().toLowerCase();
        list = list.filter(item => item.name && item.name.toLowerCase().includes(searchText));
      }
      return list;
    },
    // 选择省以后带出市信息
    handleChangeProvince (val, selectedOption) {
      if (val) {
        this.form.provinceCode = selectedOption?.code || '';
        this.cityOptions = selectedOption?.child || []; // 选择省以后带出市信息
        this.form.cityCode = '';
      }
    },
    async modelSearch (query) {
      // if (query) {
      let params = {
        modelNameLike: query || '',
        seriesIdList: this.form.seriesIds || []
      };
      let res = await vehicleModelList(params);
      if (res.length) {
        const vehicleModelData = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.id
          };
        });
        this.modelList = vehicleModelData;
      } else {
        this.modelList = [];
      }
      // }
    },
    // 城市下拉
    async getCity () {
      const params = {
        page: 1,
        size: -1
      };
      const res = await cityPage(params);
      const list = res.records || [];
      this.options = list.map(item => {
        return {
          label: item.areaName,
          value: item.areaCode
        };
      });
    },
    async listVehicleYearType (query) {
      try {
        const res = await listVehicleYearType({ yearTypeNameLike: query });
        this.yearTypeList = res;
        return res;
      } catch (error) {
        console.error('Error fetching model list:', error);
      }
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
        path: '/vehwholesale/wholesale/vehicleWholesaleOrder/edit'
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
        businessType: '整车批售订单',
        dataFetchPath: 'vw/web/wholesale/vehicleWholesaleOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车批售订单.xlsx');
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

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size, queryTab: this.tabName })
        .then(res => {
          this.optionObj.dataList = (res.records || []).map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total || 0;
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
        if (data[key] === '' || data[key] === null || (typeof data[key] === 'object' && Object.keys(data[key]).length === 0)) {
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

      if (this.form.orderTime) {
        delete data.orderTime;
        if (this.form.orderTime.length > 1) {
          data.orderTimeStart = this.form.orderTime[0];
          data.orderTimeEnd = this.form.orderTime[1];
        }
      }

      if (this.form.settleTime) {
        delete data.settleTime;
        if (this.form.settleTime.length > 1) {
          data.settleTimeStart = this.form.settleTime[0];
          data.settleTimeEnd = this.form.settleTime[1];
        }
      }

      if (this.form.confirmTime) {
        delete data.confirmTime;
        if (this.form.confirmTime.length > 1) {
          data.confirmTimeStart = this.form.confirmTime[0];
          data.confirmTimeEnd = this.form.confirmTime[1];
        }
      }

      if (this.form.allocateTime) {
        delete data.allocateTime;
        if (this.form.allocateTime.length > 1) {
          data.allocateTimeStart = this.form.allocateTime[0];
          data.allocateTimeEnd = this.form.allocateTime[1];
        }
      }

      return data;
    },
    async getWholesaleEorderTyprList (query) {
      // 筛选过滤(保留 0 和 20)
      return this.fetchOptions('vw_eorder_type').then(list => list.filter(item => item.code === '0' || item.code === '20' || item.code === '2'));
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
      // const ids = this.selectionList.map(item => item.id) || [];
      // this.$confirm(`此操作将${status ? '启用' : '停用'}选中项，是否继续?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   enableItem({
      //     idSet: ids,
      //     status
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '操作成功!'
      //     });
      //     this.getData();
      //   }).catch(() => {
      //     this.$message({
      //       type: 'error',
      //       message: '操作失败!'
      //     });
      //   });
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-order-list {
  ::v-deep .m-vxe-table-options{
    top: -102px;
  }
}
</style>
