<template>
  <edit-page-layout ref="editLayout" title="VDC库存台账" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- 批量编辑模式下显示批量编辑按钮 -->
          <el-button v-if="isBatchEdit" size="small" @click="handleBatchEdit">批量编辑</el-button>
        </template>
        <el-main>
          <!-- 基础信息展示区域 - 仅在非批量编辑模式下显示 -->
          <section v-if="!isBatchEdit" class="common-section">
            <div class="common-section-header">
              <h2>基本信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="VIN：" prop="vin">
                  <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`" target="_blank">{{ form.vin }}</el-link>
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialsCode">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclematerials/edit?id=${form.materialsCode}`" target="_blank">{{ form.materialsCode }}</el-link>
                </el-form-item>
                <el-form-item label="车系：" prop="seriesName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleseries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName }}</el-link>
                </el-form-item>
                <el-form-item label="产地：" prop="productarea">
                  {{ form.productarea }}
                </el-form-item>
                <el-form-item label="车辆交付状态：" prop="vehicleDeliveryStatusLabel">
                  {{ form.vehicleDeliveryStatusLabel }}
                </el-form-item>
                <el-form-item label="是否配车：" prop="carAllocatedLabel">
                  {{ form.carAllocatedLabel }}
                </el-form-item>
                <el-form-item label="制造工厂：" prop="factory">
                  {{ form.factory }}
                </el-form-item>
                <el-form-item label="整车仓库：" prop="warehouseName">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="库存状态：" prop="vdcInventoryStatusLabel">
                  {{ form.vdcInventoryStatusLabel }}
                </el-form-item>
                <el-form-item label="电量（%）：" prop="electricity">
                  {{ form.electricity }}
                </el-form-item>
                <el-form-item label="电量获取时间：" prop="electricityon">
                  {{ form.electricityon }}
                </el-form-item>
                <el-form-item label="下线时间：" prop="offlineTime">
                  {{ form.offlineTime }}
                </el-form-item>
                <el-form-item label="VDC入库时间：" prop="inboundDateTime">
                  {{ form.inboundDateTime }}
                </el-form-item>
                <el-form-item label="VDC出库时间：" prop="outboundDateTime">
                  {{ form.outboundDateTime }}
                </el-form-item>
                <el-form-item label="最近入库时间：" prop="lastInboundTime">
                  {{ form.lastInboundTime }}
                </el-form-item>
                <el-form-item label="最近出库时间：" prop="lastOutboundTime">
                  {{ form.lastOutboundTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 销售信息展示和编辑区域 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>销售信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form
                v-if="isEditing || isBatchEdit"
                :model="form"
                :rules="rules"
                ref="ruleForm"
                label-width="150px"
                class="form-edit"
                :inline="true"
              >
                <!-- 可编辑的五个字段 -->
                <el-form-item label="销售预留：" prop="reserved">
                  <template v-if="isBatchEdit">
                    <el-checkbox v-model="form.isReserved" @change="onReservedCheckChange">是否修改</el-checkbox>
                  </template>
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.reserved"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="reservedChange"
                    :disabled="isBatchEdit && !form.isReserved"
                  />
                </el-form-item>
                <el-form-item label="销售预留类型：" prop="reservedType">
                  <el-select
                    v-model="form.reservedType"
                    placeholder="请选择"
                    @change="changereservedType"
                    :disabled="(isBatchEdit && !form.isReserved) || (!form.reserved && isBatchEdit)"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="销售备注：" prop="salesRemark">
                  <template v-if="isBatchEdit">
                    <el-checkbox v-model="form.isSalesRemark" @change="onCheckChange('isSalesRemark', 'salesRemark')">是否修改</el-checkbox>
                  </template>
                  <el-input placeholder="请输入" v-model="form.salesRemark" clearable :disabled="isBatchEdit && !form.isSalesRemark" />
                </el-form-item>
                <el-form-item label="特殊预留备注：" prop="specialReserveRemark">
                  <template v-if="isBatchEdit">
                    <el-checkbox v-model="form.isSpecialReserveRemark" @change="onCheckChange('isSpecialReserveRemark', 'specialReserveRemark')">是否修改</el-checkbox>
                  </template>
                  <el-input placeholder="请输入" v-model="form.specialReserveRemark" clearable :disabled="isBatchEdit && !form.isSpecialReserveRemark" />
                </el-form-item>
                <el-form-item label="允许锁零售单：" prop="allowLockRetail">
                  <template v-if="isBatchEdit">
                    <el-checkbox v-model="form.isAllowLockRetail" @change="onCheckChange('isAllowLockRetail', 'allowLockRetail')">是否修改</el-checkbox>
                  </template>
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.allowLockRetail"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="isBatchEdit && !form.isAllowLockRetail"
                  />
                </el-form-item>
                <!-- 仅在非批量编辑模式下显示其他只读字段 -->
                <template v-if="!isBatchEdit">
                  <el-form-item label="订单编号：" prop="po">
                    <el-input v-model="form.po" disabled />
                  </el-form-item>
                  <el-form-item label="整车物流预留：" prop="logisticsReservedLabel">
                    <el-input v-model="form.logisticsReservedLabel" disabled />
                  </el-form-item>
                  <el-form-item label="订单状态：" prop="poStatusLabel">
                    <el-input v-model="form.poStatusLabel" disabled />
                  </el-form-item>
                  <el-form-item label="门店：" prop="dealerName">
                    <el-input v-model="form.dealerName" disabled />
                  </el-form-item>
                  <el-form-item label="销售解除预留时间：" prop="salesCancelReservedon">
                    <el-input v-model="form.salesCancelReservedon" disabled />
                  </el-form-item>
                  <el-form-item label="整车物流操作时间：" prop="vehicleLogisticsOperationTime">
                    <el-input v-model="form.vehicleLogisticsOperationTime" disabled />
                  </el-form-item>
                  <el-form-item label="门店入库时间：" prop="dealerinTime">
                    <el-input v-model="form.dealerinTime" disabled />
                  </el-form-item>
                  <el-form-item label="销售预留时间：" prop="salesReservedon">
                    <el-input v-model="form.salesReservedon" disabled />
                  </el-form-item>
                  <el-form-item label="整车物流操作人：" prop="vehicleLogisticsOperatorName">
                    <el-input v-model="form.vehicleLogisticsOperatorName" disabled />
                  </el-form-item>
                  <el-form-item label="订单类型：" prop="orderType">
                    <el-input v-model="form.orderType" disabled />
                  </el-form-item>
                  <el-form-item label="退车标识：" prop="returnLabelLabel">
                    <el-input v-model="form.returnLabelLabel" disabled />
                  </el-form-item>
                  <el-form-item label="销售预留操作人：" prop="salesReservationOperatorName">
                    <el-input v-model="form.salesReservationOperatorName" disabled />
                  </el-form-item>
                  <el-form-item label="ERP销售订单号：" prop="erpSalesOrder">
                    <el-input v-model="form.erpSalesOrder" disabled />
                  </el-form-item>
                  <el-form-item label="ERP交货单：" prop="erpDeliverOrder">
                    <el-input v-model="form.erpDeliverOrder" disabled />
                  </el-form-item>
                  <el-form-item label="ERP发票号：" prop="erpInvoice">
                    <el-input v-model="form.erpInvoice" disabled />
                  </el-form-item>
                  <el-form-item label="同步SAP时间：" prop="sapSyncTime">
                    <el-input v-model="form.sapSyncTime" disabled />
                  </el-form-item>
                  <el-form-item label="同步SAP状态：" prop="sapSyncStatus">
                    <el-input v-model="form.sapSyncStatus" disabled />
                  </el-form-item>
                  <el-form-item label="整车物流预留备注：" prop="vehicleLogisticsReserveRemark">
                    <el-input v-model="form.vehicleLogisticsReserveRemark" disabled />
                  </el-form-item>
                </template>
              </el-form>

              <!-- 详情模式 -->
              <el-form
                v-else
                :inline="true"
                class="form-detail"
              >
                <el-form-item label="订单编号：" prop="po">
                  {{ form.po }}
                </el-form-item>
                <el-form-item label="销售预留：" prop="reservedLabel">
                  {{ form.reservedLabel }}
                </el-form-item>
                <el-form-item label="整车物流预留：" prop="logisticsReservedLabel">
                  {{ form.logisticsReservedLabel }}
                </el-form-item>
                <el-form-item label="订单状态：" prop="poStatusLabel">
                  {{ form.poStatusLabel }}
                </el-form-item>
                <el-form-item label="销售预留类型：" prop="reservedTypeLabel">
                  {{ form.reservedTypeLabel }}
                </el-form-item>
                <el-form-item label="门店：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="销售解除预留时间：" prop="salesCancelReservedon">
                  {{ form.salesCancelReservedon }}
                </el-form-item>
                <el-form-item label="整车物流操作时间：" prop="vehicleLogisticsOperationTime">
                  {{ form.vehicleLogisticsOperationTime }}
                </el-form-item>
                <el-form-item label="门店入库时间：" prop="dealerinTime">
                  {{ form.dealerinTime }}
                </el-form-item>
                <el-form-item label="销售预留时间：" prop="salesReservedon">
                  {{ form.salesReservedon }}
                </el-form-item>
                <el-form-item label="整车物流操作人：" prop="vehicleLogisticsOperatorName">
                  {{ form.vehicleLogisticsOperatorName }}
                </el-form-item>
                <el-form-item label="订单类型：" prop="orderType">
                  {{ form.orderType }}
                </el-form-item>
                <el-form-item label="退车标识：" prop="returnLabelLabel">
                  {{ form.returnLabelLabel }}
                </el-form-item>
                <el-form-item label="销售预留操作人：" prop="salesReservationOperatorName">
                  {{ form.salesReservationOperatorName }}
                </el-form-item>
                <el-form-item label="允许锁零售单：" prop="allowLockRetailLabel">
                  {{ form.allowLockRetailLabel }}
                </el-form-item>
                <el-form-item label="ERP销售订单号：" prop="erpSalesOrder">
                  {{ form.erpSalesOrder }}
                </el-form-item>
                <el-form-item label="ERP交货单：" prop="erpDeliverOrder">
                  {{ form.erpDeliverOrder }}
                </el-form-item>
                <el-form-item label="ERP发票号：" prop="erpInvoice">
                  {{ form.erpInvoice }}
                </el-form-item>
                <el-form-item label="同步SAP时间：" prop="sapSyncTime">
                  {{ form.sapSyncTime }}
                </el-form-item>
                <el-form-item label="同步SAP状态：" prop="sapSyncStatus" style="width: 100%;">
                  {{ form.sapSyncStatus }}
                </el-form-item>
                <el-form-item label="整车物流预留备注：" prop="vehicleLogisticsReserveRemark" style="width: 100%;">
                  {{ form.vehicleLogisticsReserveRemark }}
                </el-form-item>
                <el-form-item label="特殊预留备注：" prop="specialReserveRemark" style="width: 100%;">
                  {{ form.specialReserveRemark }}
                </el-form-item>
                <el-form-item label="销售备注：" prop="salesRemark" style="width: 100%;">
                  {{ form.salesRemark }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 物料信息展示区域 - 仅在非批量编辑模式下显示 -->
          <section v-if="!isBatchEdit" class="common-section">
            <div class="common-section-header">
              <h2>物料信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="物料编码：" prop="materialsCode">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="车系：" prop="seriesName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleseries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName }}</el-link>
                </el-form-item>
                <el-form-item label="车型：" prop="modelName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclemodel/edit?id=${form.modelId}`" target="_blank">{{ form.modelName }}</el-link>
                </el-form-item>
                <el-form-item label="续航里程：" prop="drivingRangeName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicledrivingrange/edit?id=${form.drivingRangeId}`" target="_blank">{{ form.drivingRangeName }}</el-link>
                </el-form-item>
                <el-form-item label="选配动力：" prop="rangePowerName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclerangepower/edit?id=${form.rangePowerId}`" target="_blank">{{ form.rangePowerName }}</el-link>
                </el-form-item>
                <el-form-item label="外观：" prop="exteriorName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleexterior/edit?id=${form.exteriorId}`" target="_blank">{{ form.exteriorName }}</el-link>
                </el-form-item>
                <el-form-item label="内饰：" prop="interiorName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleinterior/edit?id=${form.interiorId}`" target="_blank">{{ form.interiorName }}</el-link>
                </el-form-item>
                <el-form-item label="选配轮毂：" prop="wheelHubName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclewheelhub/edit?id=${form.wheelHubId}`" target="_blank">{{ form.wheelHubName }}</el-link>
                </el-form-item>
                <el-form-item label="电池电芯：" prop="batteryCellName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclebatterycell/edit?id=${form.batteryCellId}`" target="_blank">{{ form.batteryCellName }}</el-link>
                </el-form-item>
                <el-form-item label="年款：" prop="yearTypeName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleyeartype/edit?id=${form.yearTypeId}`" target="_blank">{{ form.yearTypeName }}</el-link>
                </el-form-item>
                <el-form-item label="选装包：" prop="optionPackageName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleoptionpackage/edit?id=${form.optionPackageId}`" target="_blank">{{ form.optionPackageName }}</el-link>
                </el-form-item>
                <el-form-item label="是否允许现车批售：" prop="allowWholesaleLabel">
                  {{ form.allowWholesaleLabel }}
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc" style="width: 100%;">
                  {{ form.materialsDesc }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 生产信息展示区域 - 仅在非批量编辑模式下显示 -->
          <section v-if="!isBatchEdit" class="common-section">
            <div class="common-section-header">
              <h2>生产信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="工厂：" prop="factory">
                  {{ form.factory }}
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`" target="_blank">{{ form.vin }}</el-link>
                </el-form-item>
                <el-form-item label="计划收车时间：" prop="planReceiveCarTime">
                  {{ form.planReceiveCarTime }}
                </el-form-item>
                <el-form-item label="公告车型：" prop="vehicleRegisteredModelName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleregisteredmodel/edit?id=${form.vehicleRegisteredModelId}`" target="_blank">{{ form.vehicleRegisteredModelName }}</el-link>
                </el-form-item>
                <el-form-item label="合格证号：" prop="certNumber">
                  {{ form.certNumber }}
                </el-form-item>
                <el-form-item label="焊装上线时间：" prop="weldingOnlineTime">
                  {{ form.weldingOnlineTime }}
                </el-form-item>
                <el-form-item label="发动机号：" prop="enginenNumber">
                  {{ form.enginenNumber }}
                </el-form-item>
                <el-form-item label="发动机型号：" prop="enginenModel">
                  {{ form.enginenModel }}
                </el-form-item>
                <el-form-item label="涂装上线时间：" prop="paintingOnlineTime">
                  {{ form.paintingOnlineTime }}
                </el-form-item>
                <el-form-item label="电机型号：" prop="motorModel">
                  {{ form.motorModel }}
                </el-form-item>
                <el-form-item label="电驱序列号（前）：" prop="electricNumberBefore">
                  {{ form.electricNumberBefore }}
                </el-form-item>
                <el-form-item label="总装上线时间：" prop="finalAssemblyOnlineTime">
                  {{ form.finalAssemblyOnlineTime }}
                </el-form-item>
                <el-form-item label="电机序列号：" prop="motorSerialNumber">
                  {{ form.motorSerialNumber }}
                </el-form-item>
                <el-form-item label="电驱序列号（后）：" prop="electricNumberAfter">
                  {{ form.electricNumberAfter }}
                </el-form-item>
                <el-form-item label="PDI上线时间：" prop="pdiOnlineTime">
                  {{ form.pdiOnlineTime }}
                </el-form-item>
                <el-form-item label="电池包编号：" prop="batteryPackNumber">
                  {{ form.batteryPackNumber }}
                </el-form-item>
                <el-form-item label="电池序列号：" prop="batterySerialNumber">
                  {{ form.batterySerialNumber }}
                </el-form-item>
                <el-form-item label="MES订单状态：" prop="mesStatusLabel">
                  {{ form.mesStatusLabel }}
                </el-form-item>
                <el-form-item label="制造日期：" prop="manufacturingDate">
                  {{ form.manufacturingDate }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, batchEdit, getByVin } from '@/api/vehstock/vdc/vehicleVdcInventoryLedger/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  vin: '',
  materialsCode: '',
  seriesName: '',
  productarea: '',
  factory: '',
  warehouseName: '',
  electricity: '',
  electricityon: '',
  offlineTime: '',
  inboundDateTime: '',
  outboundDateTime: '',
  lastInboundTime: '',
  lastOutboundTime: '',
  po: '',
  reserved: '',
  reservedLabel: '',
  logisticsReserved: '',
  logisticsReservedLabel: '',
  poStatus: '',
  poStatusLabel: '',
  reservedType: '',
  reservedTypeLabel: '',
  dealerName: '',
  salesCancelReservedon: '',
  vehicleLogisticsOperationTime: '',
  dealerinTime: '',
  salesReservedon: '',
  vehicleLogisticsOperatorName: '',
  orderType: '',
  returnLabel: '',
  returnLabelLabel: '',
  salesReservationOperatorName: '',
  allowLockRetail: '',
  allowLockRetailLabel: '',
  erpSalesOrder: '',
  erpDeliverOrder: '',
  erpInvoice: '',
  sapSyncTime: '',
  sapSyncStatus: '',
  vehicleLogisticsReserveRemark: '',
  specialReserveRemark: '',
  salesRemark: '',
  modelName: '',
  drivingRangeName: '',
  rangePowerName: '',
  exteriorName: '',
  interiorName: '',
  wheelHubName: '',
  batteryCellName: '',
  yearTypeName: '',
  optionPackageName: '',
  allowWholesale: '',
  allowWholesaleLabel: '',
  materialsDesc: '',
  planReceiveCarTime: '',
  vehicleRegisteredModelName: '',
  certNumber: '',
  weldingOnlineTime: '',
  enginenNumber: '',
  enginenModel: '',
  paintingOnlineTime: '',
  motorModel: '',
  electricNumberBefore: '',
  finalAssemblyOnlineTime: '',
  motorSerialNumber: '',
  electricNumberAfter: '',
  pdiOnlineTime: '',
  batteryPackNumber: '',
  batterySerialNumber: '',
  mesStatus: '',
  mesStatusLabel: '',
  manufacturingDate: '',
  creatorName: '',
  updateTime: '',
  modifierName: '',
  remark: '',
  // 批量编辑模式下,标记对应字段是否需要变更
  // isReserved 同时控制"销售预留"和"销售预留类型"两个字段
  isReserved: false,
  isSalesRemark: false,
  isSpecialReserveRemark: false,
  isAllowLockRetail: false
};

export default {
  name: 'vehicleVdcInventoryLedgerEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    _vin () {
      return this.$route.query.vin || this.form.vin;
    },
    title () {
      return 'VIN：' + this.form.vin;
    },
    isBatchEdit () {
      return !!this.$route.query.list;
    }
  },
  watch: {
    id: {
      handler (val) {
        this.salesType();
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    },
    'form.reserved': {
      handler (newVal, oldVal) {
        // 编辑时 销售预留和预留类型绑定 填了销售预留  类型就必填
        if (newVal) {
          this.rules.reservedType[0].required = true;
        } else {
          this.rules.reservedType[0].required = false;
          this.$refs.ruleForm?.clearValidate?.('reservedType');
        }
      }
    }
  },
  data () {
    const form = this.getDefaultForm();
    return {
      pageTitle: 'VDC库存台账',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVS-vehicleVdcInventoryLedger',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      allOptions: [], // 固定不变的原始数据源
      options: [], // 动态显示的选项
      rules: {
        reserved: [
          { required: true, message: '请输入销售预留', trigger: 'change' }
        ],
        reservedType: [
          { required: true, message: '请选择销售预留类型', trigger: 'change' }
        ],
        allowLockRetail: [
          { required: true, message: '请输入允许锁零售单', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    changereservedType (val, row) {
      this.form.reservedType = val;
    },
    detailRequest () {
      const id = this._id;
      const vin = this._vin;
      if (id) {
        return getDetail(id);
      }
      if (vin) {
        return getByVin(vin);
      }
    },
    async submitRequest () {
      const id = this.$route.query.id;
      let txt = '是否需要更新！';
      const submitData = { ...this.form };

      if (!id && this.isBatchEdit) {
        let list = JSON.parse(localStorage.getItem('selectedIds'));
        submitData.ids = list;
        txt = '是否需要批量更新！';
        // 批量编辑模式下,根据"是否修改"复选框决定是否提交对应字段
        // isReserved 同时控制"销售预留"和"销售预留类型"
        submitData.isReserved = !!this.form.isReserved;
        submitData.isSalesRemark = !!this.form.isSalesRemark;
        submitData.isSpecialReserveRemark = !!this.form.isSpecialReserveRemark;
        submitData.isAllowLockRetail = !!this.form.isAllowLockRetail;
        // 未勾选修改的字段,需要传值(后端接口要求)但用原值,后端通过 isXxx=false 跳过应用
        if (!this.form.isReserved) {
          submitData.reserved = this.originalForm.reserved ?? '';
          submitData.reservedType = this.originalForm.reservedType ?? '';
        }
        if (!this.form.isSalesRemark) {
          submitData.salesRemark = this.originalForm.salesRemark ?? '';
        }
        if (!this.form.isSpecialReserveRemark) {
          submitData.specialReserveRemark = this.originalForm.specialReserveRemark ?? '';
        }
        if (!this.form.isAllowLockRetail) {
          submitData.allowLockRetail = this.originalForm.allowLockRetail ?? '';
        }
      } else {
        submitData.ids = [id];
        txt = '是否需要更新！';
        // 单条编辑模式:isXxx 标记字段不参与提交
        delete submitData.isReserved;
        delete submitData.isSalesRemark;
        delete submitData.isSpecialReserveRemark;
        delete submitData.isAllowLockRetail;
      }

      try {
        await this.$confirm(`${txt}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const result = await batchEdit(submitData);
        return result;
      } catch (error) {
        if (error !== 'cancel') {
          throw error;
        }
      }
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefaultForm () {
      return { ...defaultForm };
    },
    // 批量编辑 - 销售预留复选框切换(同时控制销售预留和销售预留类型)
    onReservedCheckChange () {
      if (!this.form.isReserved && this.originalForm) {
        if (this.originalForm.reserved !== undefined) {
          this.$set(this.form, 'reserved', this.originalForm.reserved);
        }
        if (this.originalForm.reservedType !== undefined) {
          this.$set(this.form, 'reservedType', this.originalForm.reservedType);
        }
      }
    },
    // 批量编辑 - 是否修改 复选框切换
    // 取消勾选时,从 originalForm 中还原字段原值
    onCheckChange (isKey, valueKey, labelKey) {
      if (!this.form[isKey]) {
        // 取消勾选:从 originalForm 还原对应字段
        if (this.originalForm && this.originalForm[valueKey] !== undefined) {
          this.$set(this.form, valueKey, this.originalForm[valueKey]);
        }
        if (labelKey && this.originalForm && this.originalForm[labelKey] !== undefined) {
          this.$set(this.form, labelKey, this.originalForm[labelKey]);
        }
      }
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 销售预留类型接口枚举
    async salesType () {
      const res = await getEnum('vehstock_reserved_type');
      this.allOptions = res.map(item => {
        return {
          label: item.message,
          value: Number(item.code)
        };
      });
      if (Number(this.form.reserved) === 0) {
        // 当 销售预留 为 否 时，只显示可售
        this.options = this.allOptions.filter(option => option.value === 1);
      } else {
        // 当 销售预留 不为 否 时，不显示可售
        this.options = this.allOptions.filter(option => option.value !== 1);
      }
    },
    // 点击销售预留改变预留类型值
    reservedChange () {
      // 批量编辑模式下,未勾选"是否修改销售预留"时不应联动清空预留类型
      if (this.isBatchEdit && !this.form.isReserved) {
        return;
      }
      this.form.reservedType = '';
      if (Number(this.form.reserved) === 0) {
        // 当 销售预留 为 否 时，只显示可售
        this.options = this.allOptions.filter(option => option.value === 1);
      } else {
        // 当 销售预留 不为 否 时，不显示可售
        this.options = this.allOptions.filter(option => option.value !== 1);
      }
    },
    // 批量编辑处理
    handleBatchEdit () {
      // 批量编辑的具体逻辑已经在 submitRequest 中处理
      this.$refs.containerRef?.handleSubmit();
    }
  }
};
</script>
