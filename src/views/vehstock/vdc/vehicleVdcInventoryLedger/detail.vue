<template>
  <div class="page-common-detail m-vehicle-vdc-inventory-ledger-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>主键：{{ info.id }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i
            class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基本信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="VIN：" prop="vin">
              {{ info.vin }}
            </el-form-item>
            <el-form-item label="物料编码：" prop="materialsCode">
              {{ info.materialsCode }}
            </el-form-item>
            <el-form-item label="车系：" prop="seriesName">
              {{ info.seriesName }}
            </el-form-item>
            <el-form-item label="产地：" prop="productarea">
              {{ info.productarea }}
            </el-form-item>
            <el-form-item label="车辆交付状态：" prop="vehicleDeliveryStatusLabel">
              {{ info.vehicleDeliveryStatusLabel }}
            </el-form-item>
            <el-form-item label="是否配车：" prop="carAllocatedLabel">
              {{ info.carAllocatedLabel }}
            </el-form-item>
            <el-form-item label="制造工厂：" prop="factory">
              {{ info.factory }}
            </el-form-item>
            <el-form-item label="整车仓库：" prop="warehouseName">
              {{ info.warehouseName }}
            </el-form-item>
            <el-form-item label="电量（%）：" prop="electricity">
              {{ info.electricity }}
            </el-form-item>
            <el-form-item label="电量获取时间：" prop="electricityon">
              {{ info.electricityon }}
            </el-form-item>
            <el-form-item label="下线时间：" prop="offlineTime">
              {{ info.offlineTime }}
            </el-form-item>
            <el-form-item label="VDC入库时间：" prop="inboundDateTime">
              {{ info.inboundDateTime }}
            </el-form-item>
            <el-form-item label="VDC出库时间：" prop="outboundDateTime">
              {{ info.outboundDateTime }}
            </el-form-item>
            <el-form-item label="最近入库时间：" prop="lastInboundTime">
              {{ info.lastInboundTime }}
            </el-form-item>
            <el-form-item label="最近出库时间：" prop="lastOutboundTime">
              {{ info.lastOutboundTime }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>销售信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="订单编号：" prop="po">
              {{ info.po }}
            </el-form-item>
            <el-form-item label="销售预留：" prop="reserved">
              {{ info.reservedLabel }}
            </el-form-item>
            <el-form-item label="整车物流预留：" prop="logisticsReserved">
              {{ info.logisticsReservedLabel }}
            </el-form-item>
            <el-form-item label="订单状态：" prop="poStatus">
              {{ info.poStatusLabel }}
            </el-form-item>
            <el-form-item label="销售预留类型：" prop="reservedType">
              {{ info.reservedTypeLabel }}
            </el-form-item>
            <el-form-item label="门店：" prop="dealerName">
              {{ info.dealerName }}
            </el-form-item>
            <el-form-item label="销售解除预留时间：" prop="salesCancelReservedon">
              {{ info.salesCancelReservedon }}
            </el-form-item>
            <el-form-item label="整车物流操作时间：" prop="vehicleLogisticsOperationTime">
              {{ info.vehicleLogisticsOperationTime }}
            </el-form-item>
            <el-form-item label="门店入库时间：" prop="dealerinTime">
              {{ info.dealerinTime }}
            </el-form-item>
            <el-form-item label="销售预留时间：" prop="salesReservedon">
              {{ info.salesReservedon }}
            </el-form-item>
            <el-form-item label="整车物流操作人：" prop="vehicleLogisticsOperatorName">
              {{ info.vehicleLogisticsOperatorName }}
            </el-form-item>
            <el-form-item label="订单类型：" prop="orderType">
              {{ info.orderType }}
            </el-form-item>
            <el-form-item label="退车标识：" prop="returnLabel">
              {{ info.returnLabelLabel }}
            </el-form-item>
            <el-form-item label="销售预留操作人：" prop="salesReservationOperatorName">
              {{ info.salesReservationOperatorName }}
            </el-form-item>
            <el-form-item label="允许锁零售单：" prop="allowLockRetail">
              {{ info.allowLockRetailLabel }}
            </el-form-item>
            <el-form-item label="ERP销售订单号：" prop="erpSalesOrder">
              {{ info.erpSalesOrder }}
            </el-form-item>
            <el-form-item label="ERP交货单：" prop="erpDeliverOrder">
              {{ info.erpDeliverOrder }}
            </el-form-item>
            <el-form-item label="ERP发票号：" prop="erpInvoice">
              {{ info.erpInvoice }}
            </el-form-item>
            <el-form-item label="同步SAP时间：" prop="sapSyncTime">
              {{ info.sapSyncTime }}
            </el-form-item>
            <el-form-item label="同步SAP状态：" prop="sapSyncStatus" style="width: 100%;">
              {{ info.sapSyncStatus }}
            </el-form-item>
            <el-form-item label="整车物流预留备注：" prop="vehicleLogisticsReserveRemark" style="width: 100%;">
              {{ info.vehicleLogisticsReserveRemark }}
            </el-form-item>
            <el-form-item label="特殊预留备注：" prop="specialReserveRemark" style="width: 100%;">
              {{ info.specialReserveRemark }}
            </el-form-item>
            <el-form-item label="销售备注：" prop="salesRemark" style="width: 100%;">
              {{ info.salesRemark }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>物料信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="物料编码：" prop="materialsCode">
              {{ info.materialsCode }}
            </el-form-item>
            <el-form-item label="车系：" prop="seriesName">
              {{ info.seriesName }}
            </el-form-item>
            <el-form-item label="车型：" prop="modelName">
              {{ info.modelName }}
            </el-form-item>
            <el-form-item label="续航里程：" prop="drivingRangeName">
              {{ info.drivingRangeName }}
            </el-form-item>
            <el-form-item label="选配动力：" prop="rangePowerName">
              {{ info.rangePowerName }}
            </el-form-item>
            <el-form-item label="外观：" prop="exteriorName">
              {{ info.exteriorName }}
            </el-form-item>
            <el-form-item label="内饰：" prop="interiorName">
              {{ info.interiorName }}
            </el-form-item>
            <el-form-item label="选配轮毂：" prop="wheelHubName">
              {{ info.wheelHubName }}
            </el-form-item>
            <el-form-item label="电池电芯：" prop="batteryCellName">
              {{ info.batteryCellName }}
            </el-form-item>
            <el-form-item label="年款：" prop="yearTypeName">
              {{ info.yearTypeName }}
            </el-form-item>
            <el-form-item label="选装包：" prop="optionPackageName">
              {{ info.optionPackageName }}
            </el-form-item>
            <el-form-item label="是否允许现车批售：" prop="allowWholesale">
              {{ info.allowWholesaleLabel }}
            </el-form-item>
            <el-form-item label="物料描述：" prop="materialsDesc" style="width: 100%;">
              {{ info.materialsDesc }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>生产信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="工厂：" prop="factory">
              {{ info.factory }}
            </el-form-item>
            <el-form-item label="VIN：" prop="vin">
              {{ info.vin }}
            </el-form-item>
            <el-form-item label="计划收车时间：" prop="planReceiveCarTime">
              {{ info.planReceiveCarTime }}
            </el-form-item>
            <el-form-item label="公告车型：" prop="vehicleRegisteredModelName">
              {{ info.vehicleRegisteredModelName }}
            </el-form-item>
            <el-form-item label="合格证号：" prop="certNumber">
              {{ info.certNumber }}
            </el-form-item>
            <el-form-item label="焊装上线时间：" prop="weldingOnlineTime">
              {{ info.weldingOnlineTime }}
            </el-form-item>
            <el-form-item label="发动机号：" prop="enginenNumber">
              {{ info.enginenNumber }}
            </el-form-item>
            <el-form-item label="发动机型号：" prop="enginenModel">
              {{ info.enginenModel }}
            </el-form-item>
            <el-form-item label="涂装上线时间：" prop="paintingOnlineTime">
              {{ info.paintingOnlineTime }}
            </el-form-item>
            <el-form-item label="电机型号：" prop="motorModel">
              {{ info.motorModel }}
            </el-form-item>
            <el-form-item label="电驱序列号（前）：" prop="electricNumberBefore">
              {{ info.electricNumberBefore }}
            </el-form-item>
            <el-form-item label="总装上线时间：" prop="finalAssemblyOnlineTime">
              {{ info.finalAssemblyOnlineTime }}
            </el-form-item>
            <el-form-item label="电机序列号：" prop="motorSerialNumber">
              {{ info.motorSerialNumber }}
            </el-form-item>
            <el-form-item label="电驱序列号（后）：" prop="electricNumberAfter">
              {{ info.electricNumberAfter }}
            </el-form-item>
            <el-form-item label="PDI上线时间：" prop="pdiOnlineTime">
              {{ info.pdiOnlineTime }}
            </el-form-item>
            <el-form-item label="电池包编号：" prop="batteryPackNumber">
              {{ info.batteryPackNumber }}
            </el-form-item>
            <el-form-item label="电池序列号：" prop="batterySerialNumber">
              {{ info.batterySerialNumber }}
            </el-form-item>
            <el-form-item label="MES订单状态：" prop="mesStatusLabel">
              {{ info.mesStatusLabel }}
            </el-form-item>
            <el-form-item label="制造日期：" prop="manufacturingDate">
              {{ info.manufacturingDate }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehstock/vdc/vehicleVdcInventoryLedger/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'vehicleVdcInventoryLedgerDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: 'VDC库存台账',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVS-vehicleVdcInventoryLedger',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['VDC库存台账', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehstock/vdc/vehicleVdcInventoryLedger/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
