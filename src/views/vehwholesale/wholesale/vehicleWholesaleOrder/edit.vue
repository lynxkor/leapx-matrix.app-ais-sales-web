<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <span class="status primary">状态</span>
        </template>
        <template #extraButtons >
          <el-button  size="small" type="primary" @click="handleCheckConfirm">审核确认</el-button>
          <el-button  size="small" type="primary" @click="handleaAutoVehicleAllocation">自动配车</el-button>
          <el-button  size="small" type="primary" @click="handleManualVehicleAllocation">手工配车</el-button>
          <el-button  size="small" type="primary" @click="handleDelete">删除</el-button>
          <el-button  size="small" type="primary" @click="handleCancel">作废</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>订单信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="订单状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_wholesale_order_status"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                   <el-form-item label="确认状态：" prop="confirmStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_wholesale_confirm_status"
                    v-model="form.confirmStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>

                 <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
                    clearable
                  />
                </el-form-item>
                                <el-form-item label="交付门店编码：" prop="deliveryDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDealerName"
                    clearable
                  />
                </el-form-item>
                    <el-form-item label="门店仓库编码：" prop="dealerWarehouseCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerWarehouseCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店仓库名称：" prop="dealerWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerWarehouseName"
                    clearable
                  />
                </el-form-item>
                    <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.replenishApplyCode"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="订单分类：" prop="orderCategory">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderCategory"
                    clearable
                  />
                </el-form-item>
                   <el-form-item label="批售方式：" prop="wholesaleWay">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleWay"
                    clearable
                  />
                </el-form-item>
                   <el-form-item label="订单时间：" prop="orderTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.orderTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                  <el-form-item label="物料描述：" prop="materialsDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsDesc"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="专项活动：" prop="prodScheduleActivityId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.prodScheduleActivityId"
                    clearable
                  />
                </el-form-item>
                     <el-form-item label="ERP发票号：" prop="erpInvoiceCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.erpInvoiceCode"
                    clearable
                  />
                </el-form-item>
                   <el-form-item label="开票时间：" prop="invoiceTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.invoiceTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                   <el-form-item label="设置急单时间：" prop="invoiceTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.invoiceTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                  <el-form-item label="急单备注：" prop="emergencyOrderRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.emergencyOrderRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="确认说明：" prop="confirmRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.confirmRemark"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="确认人：" prop="confirmUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.confirmUserName"
                    clearable
                  />
                </el-form-item>
                    <el-form-item label="确认时间：" prop="confirmTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.confirmTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                 <el-form-item label="未自动确认原因：" prop="noAutoConfirmReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.noAutoConfirmReason"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="允许锁零售单：" prop="allowLockRetail">
                  <el-input
                    placeholder="请输入"
                    v-model="form.allowLockRetail"
                    clearable
                  />
                </el-form-item>
                   <el-form-item label="整车补货单明细号：" prop="replenishApplyDetailCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.replenishApplyDetailCode"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="订单物料编码：" prop="orderMaterialCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderMaterialCode"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="指定发运方式：" prop="deliveryWay">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryWay"
                    clearable
                  />
                </el-form-item>

              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <!-- <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
                </el-form-item> -->
                <el-form-item label="订单状态：" prop="statusLabel">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="确认状态：" prop="confirmStatusLabel">
                  {{ form.confirmStatusLabel }}
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                  <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="交付门店编码：" prop="deliveryDealerCode">
                  {{ form.deliveryDealerCode }}
                </el-form-item>
                <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                  {{ form.deliveryDealerName }}
                </el-form-item>

                <el-form-item label="门店仓库编码：" prop="dealerWarehouseCode">
                  {{ form.dealerWarehouseCode }}
                </el-form-item>
                <el-form-item label="门店仓库名称：" prop="dealerWarehouseName">
                  {{ form.dealerWarehouseName }}
                </el-form-item>
                 <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                  {{ form.replenishApplyCode }}
                </el-form-item>
                   <el-form-item label="订单分类：" prop="orderCategoryLabel">
                  {{ form.orderCategoryLabel }}
                </el-form-item>
                 <el-form-item label="批售方式：" prop="wholesaleWayLabel">
                  {{ form.wholesaleWayLabel }}
                </el-form-item>
                  <el-form-item label="订单时间：" prop="orderTime">
                  {{ form.orderTime }}
                </el-form-item>
                 <el-form-item label="物料描述：" prop="materialsDesc">
                  {{ form.materialsDesc }}
                </el-form-item>
                    <el-form-item label="专项活动：" prop="prodScheduleActivityId">
                  {{ form.prodScheduleActivityId }}
                </el-form-item>
                  <el-form-item label="ERP发票号：" prop="erpInvoiceCode">
                  {{ form.erpInvoiceCode }}
                </el-form-item>
                <el-form-item label="开票日期：" prop="invoiceTime">
                  {{ form.invoiceTime }}
                </el-form-item>

                <el-form-item label="设置急单时间：" prop="emergencyOrderTime">
                  {{ form.emergencyOrderTime }}
                </el-form-item>

                 <el-form-item label="急单备注：" prop="emergencyOrderRemark">
                  {{ form.emergencyOrderRemark }}
                </el-form-item>
                   <el-form-item label="确认说明：" prop="confirmRemark">
                  {{ form.confirmRemark }}
                </el-form-item>
                  <el-form-item label="确认人：" prop="confirmUserName">
                  {{ form.confirmUserName }}
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmTime">
                  {{ form.confirmTime }}
                </el-form-item>
                <el-form-item label="未自动确认原因：" prop="noAutoConfirmReason">
                  {{ form.noAutoConfirmReason }}
                </el-form-item>
                <el-form-item label="允许锁零售单" prop="allowLockRetailLabel">
                  {{ form.allowLockRetailLabel }}
                </el-form-item>
                 <el-form-item label="整车补货单明细号：" prop="replenishApplyDetailCode">
                  {{ form.replenishApplyDetailCode }}
                </el-form-item>
                 <el-form-item label="订单物料编码：" prop="orderMaterialCode">
                  {{ form.orderMaterialCode }}
                </el-form-item>
                <el-form-item label="指定发运方式：" prop="deliveryWayLabel">
                  {{ form.deliveryWayLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>配车/结算信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="是否已锁定：" prop="lockStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.lockStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                   <el-form-item label="锁定时间：" prop="lockTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.lockTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderCode"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="配车方式：" prop="allocateWay">
                  <el-input
                    placeholder="请输入"
                    v-model="form.allocateWay"
                    clearable
                  />
                </el-form-item>
                   <el-form-item label="配车VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="配车时间：" prop="allocateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.allocateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                    <el-form-item label="ERP销售订单号：" prop="erpSaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.erpSaleOrderCode"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="结算时间：" prop="settleTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.settleTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                    <el-form-item label="结算方式：" prop="settleWay">
                  <el-input
                    placeholder="请输入"
                    v-model="form.settleWay"
                    clearable
                  />
                </el-form-item>
                   <el-form-item label="首次配车时间：" prop="firstAllocateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.firstAllocateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                  <el-form-item label="退车标识：" prop="vehicleReturnFlag">
                  <el-radio-group v-model="form.vehicleReturnFlag">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="特殊备注：" prop="specialRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.specialRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合格证是否质押：" prop="certificatePledged">
                  <el-radio-group v-model="form.certificatePledged">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                 <el-form-item label="取消配车说明：" prop="cancelAllocateRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelAllocateRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="批售方式：" prop="wholesaleWay">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleWay"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.replenishApplyCode"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="取消结算时间：" prop="firstCancelAllocateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.firstCancelAllocateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="首次取消配车时间：" prop="firstCancelAllocateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.firstCancelAllocateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="是否创建发运单计划：" prop="createdShippingPlan">
                  <el-input
                    placeholder="请输入"
                    v-model="form.createdShippingPlan"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="作废说明：" prop="cancelRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelRemark"
                    clearable
                  />
                </el-form-item>
                    <el-form-item label="是否存在结算失败：" prop="hasSettleFailed">
                  <el-radio-group v-model="form.hasSettleFailed">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                  <el-form-item label="车辆交付状态：" prop="deliveryStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.deliveryStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                 <el-form-item label="是否需要自动配车" prop="needAutoAllocateCar">
                  <el-input
                    placeholder="请输入"
                    v-model="form.needAutoAllocateCar"
                    clearable
                  />
                </el-form-item>
                    <el-form-item label="整车物流预留：" prop="logisticsReserve">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsReserve"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流预留备注：" prop="logisticsReserveRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsReserveRemark"
                    clearable
                  />
                </el-form-item>
                    <el-form-item label="初始交付周期说明：" prop="initDeliveryCycleDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.initDeliveryCycleDesc"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="动态交付周期说明：" prop="dynamicDeliveryCycleDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dynamicDeliveryCycleDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="电池电芯(订单物料)：" prop="orderBatteryCellName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderBatteryCellName"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="电池电芯(配车物料)：" prop="batteryCellName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.batteryCellName"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="是否已锁定：" prop="lockStatusLabel">
                  {{ form.lockStatusLabel }}
                </el-form-item>
                 <el-form-item label="锁定时间：" prop="lockTime">
                  {{ form.lockTime }}
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  {{ form.retailOrderCode }}
                </el-form-item>
                  <el-form-item label="配车方式：" prop="allocateWayLabel">
                  {{ form.allocateWayLabel }}
                </el-form-item>
                <el-form-item label="配车VIN码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="配车时间：" prop="allocateTime">
                  {{ form.allocateTime }}
                </el-form-item>
                 <el-form-item label="ERP销售订单号：" prop="erpSaleOrderCode">
                  {{ form.erpSaleOrderCode }}
                </el-form-item>
                <el-form-item label="结算时间：" prop="settleTime">
                  {{ form.settleTime }}
                </el-form-item>
                <el-form-item label="结算方式：" prop="settleWayLabel">
                  {{ form.settleWayLabel }}
                </el-form-item>
                 <el-form-item label="首次配车时间：" prop="firstAllocateTime">
                  {{ form.firstAllocateTime }}
                </el-form-item>
                 <el-form-item label="退车标识：" prop="vehicleReturnFlagLabel">
                   {{ form.vehicleReturnFlagLable }}
                  <!-- {{ yes_no_enum_map[form.vehicleReturnFlag] }} -->
                </el-form-item>
                  <el-form-item label="特殊备注：" prop="specialRemark">
                  {{ form.specialRemark }}
                </el-form-item>
                 <el-form-item label="合格证是否质押：" prop="certificatePledgedLabel">
                  {{ form.certificatePledgedLabel }}
                </el-form-item>
                <el-form-item label="取消配车说明：" prop="cancelAllocateRemark">
                  {{ form.cancelAllocateRemark }}
                </el-form-item>
                <el-form-item label="取消结算时间：" prop="cancelAllocateRemark">
                  <!-- {{ form.cancelAllocateRemark }}  -->
                </el-form-item>
                <el-form-item label="首次取消配车时间：" prop="firstCancelAllocateTime">
                  {{ form.firstCancelAllocateTime }}
                </el-form-item>
                <el-form-item label="是否创建发运单计划：" prop="createdShippingPlanLabel">
                  {{ form.createdShippingPlanLabel }}
                </el-form-item>
                <el-form-item label="作废说明：" prop="cancelRemark">
                  {{ form.cancelRemark }}
                </el-form-item>
                <el-form-item label="是否存在结算失败：" prop="hasSettleFailedLabel">
                  {{ form.hasSettleFailedLabel }}
                </el-form-item>
                <el-form-item label="车辆交付状态：" prop="deliveryStatusLabel">
                  {{ form.deliveryStatusLabel }}
                </el-form-item>
                 <el-form-item label="是否需要自动配车" prop="needAutoAllocateCarLabel">
                  {{ form.needAutoAllocateCarLabel }}
                </el-form-item>
                <el-form-item label="整车物流预留：" prop="logisticsReserve">
                  {{ form.logisticsReserve }}
                </el-form-item>
                <el-form-item label="物流预留备注：" prop="logisticsReserveRemark">
                  {{ form.logisticsReserveRemark }}
                </el-form-item>
                  <el-form-item label="初始交付周期说明：" prop="initDeliveryCycleDesc">
                  {{ form.initDeliveryCycleDesc }}
                </el-form-item>
                <el-form-item label="动态交付周期说明：" prop="dynamicDeliveryCycleDesc">
                  {{ form.dynamicDeliveryCycleDesc }}
                </el-form-item>
                <el-form-item label="电池电芯(订单物料)：" prop="orderBatteryCellName">
                  {{ form.orderBatteryCellName }}
                </el-form-item>
                <el-form-item label="电池电芯(配车物料)：" prop="batteryCellName">
                  {{ form.batteryCellName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>资金结算信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
               <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="结算资金类型：" prop="settleFundType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_fundtype"
                    v-model="form.settleFundType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                   <el-form-item label="金融机构名称：" prop="financialOrganizationName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.financialOrganizationName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零售价：" prop="retailPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailPrice"
                    clearable
                  />
                </el-form-item>

                <el-form-item label="开票类型：" prop="invoiceDiscountType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_invoice_type"
                    v-model="form.invoiceDiscountType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="开票系数：" prop="invoiceCoefficient">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceCoefficient"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="批售价：" prop="wholesalePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesalePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="返利使用类型：" prop="rebateUseType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_rebate_use_type"
                    v-model="form.rebateUseType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="返利使用系数：" prop="rebateCoefficient">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rebateCoefficient"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="使用现金金额：" prop="usedCashAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.usedCashAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="赊销欠款：" prop="usedCashAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.usedCashAmount"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="是否赊销：" prop="creditSaleFlag">
                  <el-radio-group v-model="form.creditSaleFlag">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                   <el-form-item label="赊销是否还款：" prop="creditSaleRepaid">
                  <el-radio-group v-model="form.creditSaleRepaid">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                 <el-form-item label="同步SAP状态：" prop="syncSapStatus">
                  <el-input
                    placeholder="请输入"
                    v-model="form.syncSapStatus"
                    clearable
                  />
                </el-form-item>

              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="结算资金类型：" prop="settleFundTypeLabel">
                  {{ form.settleFundTypeLabel }}
                </el-form-item>
                <el-form-item label="金融机构名称：" prop="financialOrganizationName">
                  {{ form.financialOrganizationName }}
                </el-form-item>
                <el-form-item label="零售价：" prop="retailPrice">
                  {{ form.retailPrice }}
                </el-form-item>
                <el-form-item label="开票类型：" prop="invoiceDiscountTypeLabel">
                  {{ form.invoiceDiscountTypeLabel }}
                </el-form-item>
                <el-form-item label="开票系数：" prop="invoiceCoefficient">
                  {{ form.invoiceCoefficient }}
                </el-form-item>
                <el-form-item label="批售价：" prop="wholesalePrice">
                  {{ form.wholesalePrice }}
                </el-form-item>
                <el-form-item label="返利使用类型：" prop="rebateUseTypeLabel">
                  {{ form.rebateUseTypeLabel }}
                </el-form-item>
                <el-form-item label="返利使用系数：" prop="rebateCoefficient">
                  {{ form.rebateCoefficient }}
                </el-form-item>
                <el-form-item label="使用返利金额：" prop="usedRebateAmount">
                  {{ form.usedRebateAmount }}
                </el-form-item>
                 <el-form-item label="使用现金金额：" prop="usedCashAmount">
                  {{ form.usedCashAmount }}
                </el-form-item>
                 <el-form-item label="赊销欠款：" prop="creditSaleFlag">
                  {{ form.creditSaleFlag }}
                </el-form-item>
                  <el-form-item label="是否赊销：" prop="creditSaleFlagLabel">
                  {{ form.creditSaleFlagLabel }}
                </el-form-item>
                <el-form-item label="赊销是否还款：" prop="creditSaleRepaidLabel">
                   {{ form.creditSaleRepaidLabel }}
                </el-form-item>

                <el-form-item label="同步SAP状态：" prop="syncSapStatus">
                   {{ form.syncSapStatus }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>整车资金账户信息</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
                />
              </div>
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
import { getDetail, addOrUpdate, batchConfirmItem } from '@/api/vehwholesale/wholesale/vehicleWholesaleOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { ids } from 'webpack';

const defaultForm = {
  // 多选时字段有变化，自行修复
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
  creditSalesAmount: '',
  emergencyOrderRemark: '',
  downPaymentRatio: '',
  deliveryWay: '',
  deliveryStatus: '',
  orderMaterialCode: '',
  needAutoAllocateCar: '',
  dealerWarehouseCode: '',
  dealerWarehouseName: '',
  logisticsReserve: '',
  logisticsReserveRemark: '',
  initDeliveryCycleDesc: '',
  dynamicDeliveryCycleDesc: '',
  batteryCellName: '',
  hasSettleFailed: '',
  cityCode: '',
  exteriorId: '',
  saleTargetTrackingId: '',
  replenishApplyDetailCode: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  statusDesc: '',
  saleCompanyId: '',
  deliveryDealerCode: '',
  deliveryDealerName: '',
  materialsId: '',
  materialsCode: '',
  settleTime: '',
  regionCode: '',
  provinceCode: '',
  provinceName: '',
  interiorId: '',
  modelId: '',
  wheelHubId: '',
  yearTypeId: '',
  firstSettleFailedTime: '',
  mallOrderCode: '',
  retailOrderCode: '',
  emergencyOrder: '',
  dataSource: '',
  financialOrganizationId: '',
  financialOrganizationName: '',
  wholesaleOrderExtId: '',
  confirmUserId: '',
  cancelAllocateRemark: '',
  cancelRemark: '',
  usedCashAmount: '',
  confirmRemark: '',
  noAutoConfirmReason: '',
  expectedOfflineTime: '',
  creditSaleFlag: '',
  deliveryDelayed: '',
  creditSaleRepaid: '',
  certificatePledged: '',
  vehicleReturnFlag: '',
  clearedFlag: '',
  purchaseOrderId: '',
  wholesaleOrderId: '',
};

export default {
  name: 'orderEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    EditTable,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '整车批售-批售主数据-整车批售订单管理',
      pageType: 'edit',
      title: '批售订单号：' + form.wholesaleOrderCode,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-vehicleWholesaleOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '资金类型',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '可用余额',
          editable: true,
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '冻结资金',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'email',
          title: '剩余可用额度',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'email',
          title: '首付款比例%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        wholesaleOrderCode: [
          { required: true, message: '请输入批售订单号', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ],
        orderTime: [
          { required: true, message: '请选择订单时间', trigger: 'change' }
        ],
        confirmTime: [
          { required: true, message: '请选择确认时间', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        orderCategory: [
          { required: true, message: '请输入订单分类', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        wholesaleWay: [
          { required: true, message: '请输入批售方式', trigger: 'change' }
        ],
        materialsDesc: [
          { required: true, message: '请输入物料描述', trigger: 'change' }
        ],
        allocateTime: [
          { required: true, message: '请选择配车时间', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入配车VIN码', trigger: 'change' }
        ],
        replenishApplyCode: [
          { required: true, message: '请输入整车补货单号', trigger: 'change' }
        ],
        regionName: [
          { required: true, message: '请输入大区', trigger: 'change' }
        ],
        cityName: [
          { required: true, message: '请输入市', trigger: 'change' }
        ],
        prodScheduleActivityId: [
          { required: true, message: '请输入专项活动', trigger: 'change' }
        ],
        allowLockRetail: [
          { required: true, message: '请输入允许锁零售单', trigger: 'change' }
        ],
        retailPrice: [
          { required: true, message: '请输入零售价', trigger: 'change' }
        ],
        invoiceDiscountType: [
          { required: true, message: '请选择开票类型', trigger: 'change' }
        ],
        invoiceCoefficient: [
          { required: true, message: '请输入开票系数', trigger: 'change' }
        ],
        wholesalePrice: [
          { required: true, message: '请输入批售价', trigger: 'change' }
        ],
        rebateUseType: [
          { required: true, message: '请选择返利使用类型', trigger: 'change' }
        ],
        rebateCoefficient: [
          { required: true, message: '请输入返利使用系数', trigger: 'change' }
        ],
        usedRebateAmount: [
          { required: true, message: '请输入使用返利金额', trigger: 'change' }
        ],
        erpSaleOrderCode: [
          { required: true, message: '请输入ERP销售订单号', trigger: 'change' }
        ],
        erpInvoiceCode: [
          { required: true, message: '请输入ERP发票号', trigger: 'change' }
        ],
        syncSapStatus: [
          { required: true, message: '请输入同步SAP状态', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'change' }
        ],
        applyReason: [
          { required: true, message: '请输入申请原因', trigger: 'change' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'change' }
        ],
        interiorName: [
          { required: true, message: '请输入内饰', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
        ],
        exteriorName: [
          { required: true, message: '请输入外观', trigger: 'change' }
        ],
        wheelHubName: [
          { required: true, message: '请输入轮毂名称', trigger: 'change' }
        ],
        yearTypeName: [
          { required: true, message: '请选择年款名称', trigger: 'change' }
        ],
        specialRemark: [
          { required: true, message: '请输入特殊备注', trigger: 'change' }
        ],
        firstCancelAllocateTime: [
          { required: true, message: '请选择首次取消配车时间', trigger: 'change' }
        ],
        firstAllocateTime: [
          { required: true, message: '请选择首次配车时间', trigger: 'change' }
        ],
        outboundTime: [
          { required: true, message: '请选择出库时间', trigger: 'change' }
        ],
        confirmStatus: [
          { required: true, message: '请选择确认状态', trigger: 'change' }
        ],
        lockStatus: [
          { required: true, message: '请选择是否已锁定', trigger: 'change' }
        ],
        lockTime: [
          { required: true, message: '请选择锁定时间', trigger: 'change' }
        ],
        createdShippingPlan: [
          { required: true, message: '请输入是否创建发运单计划', trigger: 'change' }
        ],
        confirmUserName: [
          { required: true, message: '请输入确认人', trigger: 'change' }
        ],
        settleWay: [
          { required: true, message: '请输入结算方式', trigger: 'change' }
        ],
        allocateWay: [
          { required: true, message: '请输入配车方式', trigger: 'change' }
        ],
        cooperateType: [
          { required: true, message: '请选择合作类型', trigger: 'change' }
        ],
        settleFundType: [
          { required: true, message: '请选择结算资金类型', trigger: 'change' }
        ],
        creditSalesAmount: [
          { required: true, message: '请输入融资金额&#x2F;赊账', trigger: 'change' }
        ],
        emergencyOrderRemark: [
          { required: true, message: '请输入急单备注', trigger: 'change' }
        ],
        downPaymentRatio: [
          { required: true, message: '请输入首付款比例%', trigger: 'change' }
        ],
        deliveryWay: [
          { required: true, message: '请输入指定发运方式', trigger: 'change' }
        ],
        deliveryStatus: [
          { required: true, message: '请选择车辆交付状态', trigger: 'change' }
        ],
        orderMaterialCode: [
          { required: true, message: '请输入订单物料编码', trigger: 'change' }
        ],
        needAutoAllocateCar: [
          { required: true, message: '请输入是否需要自动配车', trigger: 'change' }
        ],
        dealerWarehouseCode: [
          { required: true, message: '请输入门店仓库编码', trigger: 'change' }
        ],
        dealerWarehouseName: [
          { required: true, message: '请输入门店仓库名称', trigger: 'change' }
        ],
        logisticsReserve: [
          { required: true, message: '请输入整车物流预留', trigger: 'change' }
        ],
        logisticsReserveRemark: [
          { required: true, message: '请输入物流预留备注', trigger: 'change' }
        ],
        initDeliveryCycleDesc: [
          { required: true, message: '请输入初始交付周期说明', trigger: 'change' }
        ],
        dynamicDeliveryCycleDesc: [
          { required: true, message: '请输入动态交付周期说明', trigger: 'change' }
        ],
        batteryCellName: [
          { required: true, message: '请输入电池电芯名称', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请输入市code', trigger: 'change' }
        ],
        exteriorId: [
          { required: true, message: '请输入外观ID', trigger: 'change' }
        ],
        saleTargetTrackingId: [
          { required: true, message: '请输入批售目标额度占用记录ID', trigger: 'change' }
        ],
        replenishApplyDetailCode: [
          { required: true, message: '请输入整车补货单明细号', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        saleCompanyId: [
          { required: true, message: '请输入销售公司', trigger: 'change' }
        ],
        deliveryDealerCode: [
          { required: true, message: '请输入交付门店编码', trigger: 'change' }
        ],
        deliveryDealerName: [
          { required: true, message: '请输入交付门店名称', trigger: 'change' }
        ],
        materialsId: [
          { required: true, message: '请输入物料ID', trigger: 'change' }
        ],
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
        ],
        settleTime: [
          { required: true, message: '请选择结算时间', trigger: 'change' }
        ],
        regionCode: [
          { required: true, message: '请输入大区编码', trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: '请输入省code', trigger: 'change' }
        ],
        provinceName: [
          { required: true, message: '请输入省', trigger: 'change' }
        ],
        interiorId: [
          { required: true, message: '请输入内饰ID', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        wheelHubId: [
          { required: true, message: '请输入轮毂ID', trigger: 'change' }
        ],
        yearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' }
        ],
        firstSettleFailedTime: [
          { required: true, message: '请选择首次结算失败时间', trigger: 'change' }
        ],
        mallOrderCode: [
          { required: true, message: '请输入商城订单号', trigger: 'change' }
        ],
        retailOrderCode: [
          { required: true, message: '请输入零售订单号', trigger: 'change' }
        ],
        emergencyOrder: [
          { required: true, message: '请输入是否紧急订单：1是0否', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
        financialOrganizationId: [
          { required: true, message: '请输入金融机构ID', trigger: 'change' }
        ],
        financialOrganizationName: [
          { required: true, message: '请输入金融机构名称', trigger: 'change' }
        ],
        wholesaleOrderExtId: [
          { required: true, message: '请输入批售订单扩展ID', trigger: 'change' }
        ],
        confirmUserId: [
          { required: true, message: '请输入确认人', trigger: 'change' }
        ],
        cancelAllocateRemark: [
          { required: true, message: '请输入取消配车说明', trigger: 'change' }
        ],
        cancelRemark: [
          { required: true, message: '请输入作废说明', trigger: 'change' }
        ],
        usedCashAmount: [
          { required: true, message: '请输入使用现金金额', trigger: 'change' }
        ],
        confirmRemark: [
          { required: true, message: '请输入确认说明', trigger: 'change' }
        ],
        noAutoConfirmReason: [
          { required: true, message: '请输入未自动确认原因', trigger: 'change' }
        ],
        expectedOfflineTime: [
          { required: true, message: '请选择车辆预计下线日期', trigger: 'change' }
        ],
        purchaseOrderId: [
          { required: true, message: '请输入采购订单ID', trigger: 'change' }
        ],
        wholesaleOrderId: [
          { required: true, message: '请输入批售订单ID', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    allAllowConfirm (items) {
      const ALLOWED_STATUS = [0, 11];
      for (const item of items) {
        if (item.confirmStatus !== 1010) {
          this.$message({
            type: 'error',
            message: '选择的数据中[确认状态]必须为[未确认]!'
          });
          return;
        };
        if (!ALLOWED_STATUS.includes(item.status)) {
          this.$message({
            type: 'error',
            message: '选择的数据中[订单状态]必须为[未配车,配车失败]!'
          });
          return;
        };
        if (item.orderCategory !== 1) {
          this.$message({
            type: 'error',
            message: '选择的数据中[订单分类]必须为[商品车订单]!'
          });
          return;
        }
      }
    },
    handleCheckConfirm () {  // 审核确认
      const checkStatus = this.allAllowConfirm(this.form);
      if (checkStatus) {
        this.$confirm('是否需要对批售订单进行批售确认? 注意：确认订单结算资金类型', '操作提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchConfirmItem({
            ids: [this.form.id]
          }).then(() => {
            this.$message({
              type: 'success',
              message: '确认成功!'
            });
            this.getData();
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '确认失败!'
            });
          });
        }).catch(() => {});
      }
    },
    handleaAutoVehicleAllocation () { // 自动配车

    },
    handleManualVehicleAllocation () { // 手工配车

    },
    handleDelete () { // 删除

    },
    handleCancel () { // 作废

    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
