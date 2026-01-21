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
        <el-input
          placeholder="请输入"
          v-model="form.wholesaleOrderCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="订单状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="xxx"
          v-model="form.status"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="订单时间"  v-show="this.visibleCount === 3 || show">
        <el-date-picker
         :default-time="['00:00:00', '23:59:59']"
          v-model="form.orderTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="确认时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.confirmTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="销售门店编码">
          <el-input
            placeholder="请输入"
            v-model="form.saleDealerCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单分类">
          <el-input
            placeholder="请输入"
            v-model="form.orderCategory"
            clearable
          />
        </el-form-item>
        <el-form-item label="销售门店名称">
          <el-input
            placeholder="请输入"
            v-model="form.saleDealerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="批售方式">
          <el-input
            placeholder="请输入"
            v-model="form.wholesaleWay"
            clearable
          />
        </el-form-item>
        <el-form-item label="物料描述">
          <el-input
            placeholder="请输入"
            v-model="form.materialsDesc"
            clearable
          />
        </el-form-item>
        <el-form-item label="配车时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.allocateTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="配车VIN码">
          <el-input
            placeholder="请输入"
            v-model="form.vin"
            clearable
          />
        </el-form-item>
        <el-form-item label="整车补货单号">
          <el-input
            placeholder="请输入"
            v-model="form.replenishApplyCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="大区">
          <el-input
            placeholder="请输入"
            v-model="form.regionName"
            clearable
          />
        </el-form-item>
        <el-form-item label="市">
          <el-input
            placeholder="请输入"
            v-model="form.cityName"
            clearable
          />
        </el-form-item>
        <el-form-item label="专项活动">
          <el-input
            placeholder="请输入"
            v-model="form.prodScheduleActivityId"
            clearable
          />
        </el-form-item>
        <el-form-item label="允许锁零售单,1:是允许，0否不允许">
          <el-input
            placeholder="请输入"
            v-model="form.allowLockRetail"
            clearable
          />
        </el-form-item>
        <el-form-item label="零售价">
          <el-input
            placeholder="请输入"
            v-model="form.retailPrice"
            clearable
          />
        </el-form-item>
        <el-form-item label="开票类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.invoiceDiscountType"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="开票系数">
          <el-input
            placeholder="请输入"
            v-model="form.invoiceCoefficient"
            clearable
          />
        </el-form-item>
        <el-form-item label="批售价">
          <el-input
            placeholder="请输入"
            v-model="form.wholesalePrice"
            clearable
          />
        </el-form-item>
        <el-form-item label="返利使用类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.rebateUseType"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="返利使用系数">
          <el-input
            placeholder="请输入"
            v-model="form.rebateCoefficient"
            clearable
          />
        </el-form-item>
        <el-form-item label="使用返利金额">
          <el-input
            placeholder="请输入"
            v-model="form.usedRebateAmount"
            clearable
          />
        </el-form-item>
        <el-form-item label="ERP销售订单号">
          <el-input
            placeholder="请输入"
            v-model="form.erpSaleOrderCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="ERP发票号">
          <el-input
            placeholder="请输入"
            v-model="form.erpInvoiceCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="同步SAP状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.syncSapStatus"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.createTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="母公司编码">
          <el-input
            placeholder="请输入"
            v-model="form.dealerCompanyCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="申请原因">
          <el-input
            placeholder="请输入"
            v-model="form.applyReason"
            clearable
          />
        </el-form-item>
        <el-form-item label="母公司名称">
          <el-input
            placeholder="请输入"
            v-model="form.dealerCompanyName"
            clearable
          />
        </el-form-item>
        <el-form-item label="内饰">
          <el-input
            placeholder="请输入"
            v-model="form.interiorName"
            clearable
          />
        </el-form-item>
        <el-form-item label="车型名称">
          <el-input
            placeholder="请输入"
            v-model="form.modelName"
            clearable
          />
        </el-form-item>
        <el-form-item label="外观">
          <el-input
            placeholder="请输入"
            v-model="form.exteriorName"
            clearable
          />
        </el-form-item>
        <el-form-item label="轮毂名称">
          <el-input
            placeholder="请输入"
            v-model="form.wheelHubName"
            clearable
          />
        </el-form-item>
        <el-form-item label="年款名称">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.yearTypeName"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="特殊备注">
          <el-input
            placeholder="请输入"
            v-model="form.specialRemark"
            clearable
          />
        </el-form-item>
        <el-form-item label="首次取消配车时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.firstCancelAllocateTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="首次配车时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.firstAllocateTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="出库时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.outboundTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="确认状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.confirmStatus"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="是否已锁定,1是0否">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.lockStatus"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="锁定时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.lockTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="是否创建发运单计划">
          <el-input
            placeholder="请输入"
            v-model="form.createdShippingPlan"
            clearable
          />
        </el-form-item>
        <el-form-item label="确认人">
          <el-input
            placeholder="请输入"
            v-model="form.confirmUserName"
            clearable
          />
        </el-form-item>
        <el-form-item label="结算方式">
          <el-input
            placeholder="请输入"
            v-model="form.settleWay"
            clearable
          />
        </el-form-item>
        <el-form-item label="配车方式">
          <el-input
            placeholder="请输入"
            v-model="form.allocateWay"
            clearable
          />
        </el-form-item>
        <el-form-item label="合作类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.cooperateType"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="结算资金类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.settleFundType"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="急单备注">
          <el-input
            placeholder="请输入"
            v-model="form.emergencyOrderRemark"
            clearable
          />
        </el-form-item>
        <el-form-item label="指定发运方式">
          <el-input
            placeholder="请输入"
            v-model="form.deliveryWay"
            clearable
          />
        </el-form-item>
        <el-form-item label="车辆交付状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.deliveryStatus"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="订单物料编码">
          <el-input
            placeholder="请输入"
            v-model="form.orderMaterialCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="是否需要自动配车,1:是；0：否">
          <el-input
            placeholder="请输入"
            v-model="form.needAutoAllocateCar"
            clearable
          />
        </el-form-item>
        <el-form-item label="门店仓库名称">
          <el-input
            placeholder="请输入"
            v-model="form.dealerWarehouseName"
            clearable
          />
        </el-form-item>
        <el-form-item label="整车物流预留">
          <el-input
            placeholder="请输入"
            v-model="form.logisticsReserve"
            clearable
          />
        </el-form-item>
        <el-form-item label="物流预留备注">
          <el-input
            placeholder="请输入"
            v-model="form.logisticsReserveRemark"
            clearable
          />
        </el-form-item>
        <el-form-item label="初始交付周期说明">
          <el-input
            placeholder="请输入"
            v-model="form.initDeliveryCycleDesc"
            clearable
          />
        </el-form-item>
        <el-form-item label="动态交付周期说明">
          <el-input
            placeholder="请输入"
            v-model="form.dynamicDeliveryCycleDesc"
            clearable
          />
        </el-form-item>
        <el-form-item label="电池电芯名称">
          <el-input
            placeholder="请输入"
            v-model="form.batteryCellName"
            clearable
          />
        </el-form-item>
        <el-form-item label="市code">
          <el-input
            placeholder="请输入"
            v-model="form.cityCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="外观ID">
          <el-input
            placeholder="请输入"
            v-model="form.exteriorId"
            clearable
          />
        </el-form-item>
        <el-form-item label="整车补货单明细号">
          <el-input
            placeholder="请输入"
            v-model="form.replenishApplyDetailCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="批售订单ID">
          <el-input
            placeholder="请输入"
            v-model="form.wholesaleOrderId"
            clearable
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
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
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
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="1"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehwholesale/wholesale/vehicleWholesaleOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  wholesaleOrderCode: '',
  status: '',
  orderTime: '',
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
  syncSapStatus: '',
  createTime: '',
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
    Upload
  },
  data () {
    return {
      pageTitle: '整车批售-批售主数据-整车批售订单管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-vehicleWholesaleOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
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
                  path: '/wholesale/vehicleWholesaleOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'status', label: '订单状态', visible: true, width: 200 },
          { props: 'orderTime', label: '订单时间', visible: true, width: 200 },
          { props: 'confirmTime', label: '确认时间', visible: true, width: 200 },
          { props: 'saleDealerCode', label: '销售门店编码', visible: true, width: 200 },
          { props: 'orderCategory', label: '订单分类', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店名称', visible: true, width: 200 },
          { props: 'wholesaleWay', label: '批售方式', visible: true, width: 200 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'allocateTime', label: '配车时间', visible: true, width: 200 },
          { props: 'vin', label: '配车VIN码', visible: true, width: 200 },
          { props: 'replenishApplyCode', label: '整车补货单号', visible: true, width: 200 },
          { props: 'regionName', label: '大区', visible: true, width: 200 },
          { props: 'cityName', label: '市', visible: true, width: 200 },
          { props: 'prodScheduleActivityId', label: '专项活动', visible: true, width: 200 },
          { props: 'allowLockRetail', label: '允许锁零售单,1:是允许，0否不允许', visible: true, width: 200 },
          { props: 'retailPrice', label: '零售价', visible: true, width: 200 },
          { props: 'invoiceDiscountType', label: '开票类型', visible: true, width: 200 },
          { props: 'invoiceCoefficient', label: '开票系数', visible: true, width: 200 },
          { props: 'wholesalePrice', label: '批售价', visible: true, width: 200 },
          { props: 'rebateUseType', label: '返利使用类型', visible: true, width: 200 },
          { props: 'rebateCoefficient', label: '返利使用系数', visible: true, width: 200 },
          { props: 'usedRebateAmount', label: '使用返利金额', visible: true, width: 200 },
          { props: 'erpSaleOrderCode', label: 'ERP销售订单号', visible: true, width: 200 },
          { props: 'erpInvoiceCode', label: 'ERP发票号', visible: true, width: 200 },
          { props: 'syncSapStatus', label: '同步SAP状态', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'dealerCompanyCode', label: '母公司编码', visible: true, width: 200 },
          { props: 'applyReason', label: '申请原因', visible: true, width: 200 },
          { props: 'dealerCompanyName', label: '母公司名称', visible: true, width: 200 },
          { props: 'interiorName', label: '内饰', visible: true, width: 200 },
          { props: 'modelName', label: '车型名称', visible: true, width: 200 },
          { props: 'exteriorName', label: '外观', visible: true, width: 200 },
          { props: 'wheelHubName', label: '轮毂名称', visible: true, width: 200 },
          { props: 'yearTypeName', label: '年款名称', visible: true, width: 200 },
          { props: 'specialRemark', label: '特殊备注', visible: true, width: 200 },
          { props: 'firstCancelAllocateTime', label: '首次取消配车时间', visible: true, width: 200 },
          { props: 'firstAllocateTime', label: '首次配车时间', visible: true, width: 200 },
          { props: 'outboundTime', label: '出库时间', visible: true, width: 200 },
          { props: 'confirmStatus', label: '确认状态', visible: true, width: 200 },
          { props: 'lockStatus', label: '是否已锁定,1是0否', visible: true, width: 200 },
          { props: 'lockTime', label: '锁定时间', visible: true, width: 200 },
          { props: 'createdShippingPlan', label: '是否创建发运单计划', visible: true, width: 200 },
          { props: 'confirmUserName', label: '确认人', visible: true, width: 200 },
          { props: 'settleWay', label: '结算方式', visible: true, width: 200 },
          { props: 'allocateWay', label: '配车方式', visible: true, width: 200 },
          { props: 'cooperateType', label: '合作类型', visible: true, width: 200 },
          { props: 'settleFundType', label: '结算资金类型', visible: true, width: 200 },
          { props: 'creditSalesAmount', label: '融资金额&#x2F;赊账', visible: true, width: 200 },
          { props: 'emergencyOrderRemark', label: '急单备注', visible: true, width: 200 },
          { props: 'downPaymentRatio', label: '首付款比例%', visible: true, width: 200 },
          { props: 'deliveryWay', label: '指定发运方式', visible: true, width: 200 },
          { props: 'deliveryStatus', label: '车辆交付状态', visible: true, width: 200 },
          { props: 'orderMaterialCode', label: '订单物料编码', visible: true, width: 200 },
          { props: 'needAutoAllocateCar', label: '是否需要自动配车,1:是；0：否', visible: true, width: 200 },
          { props: 'dealerWarehouseName', label: '门店仓库名称', visible: true, width: 200 },
          { props: 'logisticsReserve', label: '整车物流预留', visible: true, width: 200 },
          { props: 'logisticsReserveRemark', label: '物流预留备注', visible: true, width: 200 },
          { props: 'initDeliveryCycleDesc', label: '初始交付周期说明', visible: true, width: 200 },
          { props: 'dynamicDeliveryCycleDesc', label: '动态交付周期说明', visible: true, width: 200 },
          { props: 'batteryCellName', label: '电池电芯名称', visible: true, width: 200 },
          { props: 'cityCode', label: '市code', visible: true, width: 200 },
          { props: 'exteriorId', label: '外观ID', visible: true, width: 200 },
          { props: 'replenishApplyDetailCode', label: '整车补货单明细号', visible: true, width: 200 },
          { props: 'wholesaleOrderId', label: '批售订单ID', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/wholesale/vehicleWholesaleOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
              popconfirmTitle: '此操作将永久删除, 是否继续?',
              click: (rowIndex, row) => {
                deleteItem([row.id]).then(() => {
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
              },
              type: 'danger'
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
        path: '/wholesale/vehicleWholesaleOrder/edit'
      });
    },
    onSubmit () {
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
      exportTable({
        businessType: '整车批售-批售主数据-整车批售订单管理',
        dataFetchPath: 'vw/web/wholesale/vehicleWholesaleOrder/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车批售-批售主数据-整车批售订单管理.xlsx');
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

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
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
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
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
}
</style>
