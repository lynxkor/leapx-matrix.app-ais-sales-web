<template>
  <div>
    <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
      <template #left>
        <!-- TIPS: 如果需要竖排，direction="vertical" -->
        <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
          :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest"
          :showEditBtn="canAddOrUpdate && form.buttonControl && form.buttonControl.editButton">
          <template #status>
            <!-- {{ form.wholesaleOrderCode }} -->
          </template>
          <template #extraButtons>
            <el-button v-if="perquerySapAccount" size="small" :loading="querySapAccountLoading"
              @click="handlequerySAPAccountBalance">查询整车账户余额</el-button>
            <el-button v-if="perbatchConfirm && form.buttonControl && form.buttonControl.confirmManualButton"
              size="small" :loading="checkConfirmLoading" @click="handleCheckConfirm">批售确认</el-button>
            <el-button v-if="perbatchSetAutoAllocate && form.buttonControl && form.buttonControl.autoAllocateVehicle"
              size="small" :loading="autoVehicleAllocationLoading"
              @click="handleaAutoVehicleAllocation">自动配车</el-button>
            <el-button v-if="pervinAllocateVehicle && form.buttonControl && form.buttonControl.manualAllocateVehicle"
              size="small" @click="handleManualVehicleAllocation">手工配车</el-button>
            <el-button v-if="perbatchCancelAllocate && form.buttonControl && form.buttonControl.cancelAllocateVehicle"
              size="small" :loading="cancelAllocateVehicleLoading" @click="handleCancelAllocateVehicle">取消配车</el-button>
            <el-button v-if="perbatchSettleSubmit && form.buttonControl && form.buttonControl.submitSettleButton"
              size="small" :loading="batchSettleSubmitLoading" @click="handleBatchSettleSubmit">提交结算</el-button>
            <el-button v-if="perbatchCancelSettle && form.buttonControl && form.buttonControl.cancelSettle" size="small"
              @click="handleBatchCancelSettle">取消结算</el-button>
            <el-button v-if="perbatchCancel && form.buttonControl && form.buttonControl.cancelButton" size="small"
              @click="handleCancel">作废</el-button>
          </template>
          <el-main>
            <section class="common-section">
              <div class="common-section-header">
                <h2>订单信息</h2>
              </div>
              <div class="common-section-body">
                <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
                <el-form :inline="true" :model="form" ref="ruleForm" label-width="150px" class="form-edit"
                  v-show="isEditing || !_id">
                  <el-form-item label="订单状态：" prop="orderStatus">
                    <fetch-select :request="fetchOptions" enumCode="vw_wholesale_order_status"
                      v-model="form.orderStatus" placeholder="请选择" clearable filterable disabled />
                  </el-form-item>
                  <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                    <el-input placeholder="请输入" v-model="form.replenishApplyCode" clearable disabled />
                  </el-form-item>
                  <el-form-item label="允许锁零售单：" prop="allowLockRetail">
                    <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.allowLockRetail"
                      placeholder="请选择" clearable filterable
                      :disabled='form.orderStatus === 99 || form.orderStatus === "99"' />
                  </el-form-item>
                  <el-form-item label="销售门店名称：" prop="saleDealerName">
                    <el-input placeholder="请输入" v-model="form.saleDealerName" clearable disabled />
                  </el-form-item>
                  <el-form-item label="订单分类：" prop="orderCategory">
                    <fetch-select :options="orderCategoryOptions" v-model="form.orderCategory" placeholder="请选择"
                      clearable filterable disabled />
                  </el-form-item>
                  <el-form-item label="整车补货单明细号：" prop="replenishApplyDetailCode">
                    <el-input placeholder="请输入" v-model="form.replenishApplyDetailCode" clearable disabled />
                  </el-form-item>
                  <el-form-item label="是否二网：" prop="secondDealerFlag">
                    <el-input placeholder="请输入" :value="Number(form.secondDealerFlag) === 1 ? '是' : '否'" clearable disabled />
                  </el-form-item>
                  <el-form-item label="二网门店编码：" prop="secondDealerCode">
                    <el-input placeholder="请输入" v-model="form.secondDealerCode" clearable disabled />
                  </el-form-item>
                  <el-form-item label="二网门店名称：" prop="secondDealerName">
                    <el-input placeholder="请输入" v-model="form.secondDealerName" clearable disabled />
                  </el-form-item>
                  <el-form-item label="允许锁零售节点：" prop="allowLockNode">
                    <fetch-select :request="fetchOptions" enumCode="vw_allow_lock_node_type"
                      v-model="form.allowLockNode" placeholder="请选择允许锁零售节点" clearable filterable />
                  </el-form-item>
                  <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                    <el-input placeholder="请输入" v-model="form.deliveryDealerName" clearable disabled />
                  </el-form-item>
                  <el-form-item label="专项活动：" prop="prodScheduleActivityId">
                    <el-input placeholder="请输入" v-model="form.prodScheduleActivityId" clearable disabled />
                  </el-form-item>
                  <el-form-item label="电池电芯(订单物料)：" prop="orderBatteryCellName">
                    <el-input placeholder="请输入" v-model="form.orderBatteryCellName" clearable disabled />
                  </el-form-item>
                  <el-form-item label="是否紧急订单：" prop="emergencyOrder">
                    <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.emergencyOrder"
                      placeholder="请选择" clearable filterable
                      :disabled='form.orderStatus === 99 || form.orderStatus === "99"' @change="changeStatus" />
                  </el-form-item>
                  <el-form-item label="门店仓库名称：" prop="dealerWarehouseName">
                    <el-input placeholder="请输入" v-model="form.dealerWarehouseName" clearable disabled />
                  </el-form-item>
                  <el-form-item label="批售方式：" prop="wholesaleWay">
                    <fetch-select :request="fetchOptions" enumCode="vw_wholesale_way" v-model="form.wholesaleWay"
                      placeholder="请选择批售方式" clearable filterable disabled />
                  </el-form-item>
                  <el-form-item label="订单物料编码：" prop="orderMaterialCode">
                    <el-input placeholder="请输入" v-model="form.orderMaterialCode" clearable disabled />
                  </el-form-item>
                  <el-form-item label="急单备注：" prop="emergencyOrderRemark">
                    <el-input placeholder="请输入" v-model="form.emergencyOrderRemark" clearable maxlength="300"
                      disabled />
                  </el-form-item>
                  <el-form-item label="税务发票号：" prop="taxInvoiceCode">
                    <el-input placeholder="请输入" v-model="form.taxInvoiceCode" clearable disabled />
                  </el-form-item>
                  <el-form-item label="订单时间：" prop="orderTime">
                    <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.orderTime"
                      :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                      end-placeholder="结束日期" disabled />
                  </el-form-item>
                  <el-form-item label="物料描述：" prop="orderMaterialsDesc">
                    <el-input placeholder="请输入" v-model="form.orderMaterialsDesc" clearable disabled />
                  </el-form-item>
                  <el-form-item label="设置急单时间：" prop="emergencyOrderTime">
                    <el-date-picker type="datetime" v-model="form.emergencyOrderTime" :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" disabled />
                  </el-form-item>
                  <el-form-item label="开票时间：" prop="invoiceTime">
                    <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.invoiceTime"
                      :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                      end-placeholder="结束日期" disabled />
                  </el-form-item>
                  <el-form-item label="确认状态：" prop="confirmStatus">
                    <fetch-select :request="fetchOptions" enumCode="vw_wholesale_confirm_status"
                      v-model="form.confirmStatus" placeholder="请选择" clearable filterable disabled />
                  </el-form-item>
                  <el-form-item label="确认说明：" prop="confirmRemark">
                    <el-input placeholder="请输入" v-model="form.confirmRemark" clearable disabled />
                  </el-form-item>
                  <el-form-item label="指定发运方式：" prop="deliveryWay">
                    <el-input placeholder="请输入" v-model="form.deliveryWay" clearable disabled />
                  </el-form-item>
                  <el-form-item label="未自动确认原因：" prop="noAutoConfirmReason">
                    <el-input placeholder="请输入" v-model="form.noAutoConfirmReason" clearable maxlength="300" disabled />
                  </el-form-item>
                  <el-form-item label="确认时间：" prop="confirmTime">
                    <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.confirmTime"
                      :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                      end-placeholder="结束日期" disabled />
                  </el-form-item>
                  <el-form-item label="确认人：" prop="confirmUserName">
                    <el-input placeholder="请输入" v-model="form.confirmUserName" clearable disabled />
                  </el-form-item>
                  <el-form-item label="是否需要自动配车：" prop="needAutoAllocateCar">
                    <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.needAutoAllocateCar"
                      placeholder="请选择" clearable filterable
                      :disabled="needAutoAllocateCarStatus.includes(form.orderStatus)" />
                  </el-form-item>
                  <!-- <el-form-item label="门店仓库编码：" prop="dealerWarehouseCode">
                    <el-input placeholder="请输入" v-model="form.dealerWarehouseCode" clearable disabled />
                  </el-form-item> -->
                   <el-form-item label="创建时间：" prop="createTime">
                    {{ form.createTime }}
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <!-- <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
                </el-form-item> -->
                  <el-form-item label="订单状态：" prop="orderStatusLabel">
                    {{ form.orderStatusLabel }}
                  </el-form-item>
                  <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                    <el-link type="primary"
                      :href="`/sales/vehwholesale/replenish/dealerVehicleReplenishApply/edit?id=${form.replenishApplyCode}`"
                      target="_blank">{{ form.replenishApplyCode }}</el-link>
                  </el-form-item>
                  <el-form-item label="允许锁零售单：" prop="allowLockRetailLabel">
                    {{ form.allowLockRetailLabel }}
                  </el-form-item>
                  <el-form-item label="销售门店：" prop="saleDealerName">
                    <el-link type="primary"
                      :href="`/service/datacenter/store/store/detail?storeCode=${form.saleDealerCode}`"
                      target="_blank">{{ form.saleDealerName }}</el-link>
                  </el-form-item>
                  <el-form-item label="订单分类：" prop="orderCategoryLabel">
                    {{ form.orderCategoryLabel }}
                  </el-form-item>
                  <el-form-item label="整车补货单明细号：" prop="replenishApplyDetailCode">
                    <el-link type="primary"
                      :href="`/sales/vehwholesale/replenish/dealerVehicleReplenishApplyDetail/edit?id=${form.replenishApplyDetailId}`"
                      target="_blank">{{ form.replenishApplyDetailCode }}</el-link>
                  </el-form-item>
                  <el-form-item label="是否二网：" prop="secondDealerFlag">
                    {{ Number(form.secondDealerFlag) === 1 ? '是' : '否' }}
                  </el-form-item>
                  <el-form-item label="二网门店编码：" prop="secondDealerCode">
                    {{ form.secondDealerCode }}
                  </el-form-item>
                  <el-form-item label="二网门店名称：" prop="secondDealerName">
                    {{ form.secondDealerName }}
                  </el-form-item>
                  <el-form-item label="允许锁零售节点：" prop="allowLockNodeLabel">
                    {{ form.allowLockNodeLabel }}
                  </el-form-item>
                  <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                    <el-link type="primary"
                      :href="`/service/datacenter/store/store/detail?storeCode=${form.deliveryDealerCode}`"
                      target="_blank">{{ form.deliveryDealerName }}</el-link>
                  </el-form-item>
                  <el-form-item label="专项活动：" prop="prodScheduleActivityName">
                    <el-link type="primary"
                      :href="`/sales/vehwholesale/basic/wholesaleProdScheduleActivity/edit?id=${form.prodScheduleActivityId}`"
                      target="_blank">{{ form.prodScheduleActivityName }}</el-link>
                  </el-form-item>
                  <el-form-item label="电池电芯(订单物料)：" prop="orderBatteryCellName">
                    {{ form.orderBatteryCellName }}
                  </el-form-item>
                  <el-form-item label="是否紧急订单：" prop="emergencyOrderLabel">
                    {{ form.emergencyOrderLabel }}
                  </el-form-item>
                  <el-form-item label="门店仓库名称：" prop="dealerWarehouseName">
                    {{ form.dealerWarehouseName }}
                  </el-form-item>
                  <el-form-item label="批售方式：" prop="wholesaleWayLabel">
                    {{ form.wholesaleWayLabel }}
                  </el-form-item>
                  <el-form-item label="订单物料编码：" prop="orderMaterialsCode">
                    <el-link type="primary"
                      :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${form.orderMaterialsCode}`"
                      target="_blank">{{
                        form.orderMaterialsCode }}</el-link>
                  </el-form-item>
                  <el-form-item label="急单备注：" prop="emergencyOrderRemark">
                    {{ form.emergencyOrderRemark }}
                  </el-form-item>
                  <el-form-item label="税务发票号：" prop="taxInvoiceCode">
                    {{ form.taxInvoiceCode }}
                  </el-form-item>
                  <el-form-item label="订单时间：" prop="orderTime">
                    {{ form.orderTime }}
                  </el-form-item>
                  <el-form-item label="物料描述：" prop="orderMaterialsDesc">
                    {{ form.orderMaterialsDesc }}
                  </el-form-item>
                  <el-form-item label="设置急单时间：" prop="emergencyOrderTime">
                    {{ form.emergencyOrderTime }}
                  </el-form-item>
                  <el-form-item label="开票时间：" prop="invoiceTime">
                    {{ form.invoiceTime }}
                  </el-form-item>
                  <el-form-item label="确认状态：" prop="confirmStatusLabel">
                    {{ form.confirmStatusLabel }}
                  </el-form-item>
                  <el-form-item label="确认说明：" prop="confirmRemark">
                    {{ form.confirmRemark }}
                  </el-form-item>
                  <el-form-item label="指定发运方式：" prop="deliveryWayLabel">
                    {{ form.deliveryWayLabel }}
                  </el-form-item>
                  <el-form-item label="未自动确认原因：" prop="noAutoConfirmReason">
                    {{ form.noAutoConfirmReason }}
                  </el-form-item>
                  <el-form-item label="确认时间：" prop="confirmTime">
                    {{ form.confirmTime }}
                  </el-form-item>
                  <el-form-item label="确认人：" prop="confirmUserName">
                    {{ form.confirmUserName }}
                  </el-form-item>
                  <el-form-item label="是否需要自动配车：" prop="needAutoAllocateCarLabel">
                    {{ form.needAutoAllocateCarLabel }}
                  </el-form-item>

                  <el-form-item label="创建时间：" prop="createTime">
                    {{ form.createTime }}
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
                <el-form :inline="true" :model="form" ref="ruleForm" label-width="150px" class="form-edit"
                  v-show="isEditing || !_id">
                  <el-form-item label="是否已锁定：" prop="lockStatus">
                    <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.lockStatus"
                      placeholder="请选择" clearable filterable disabled />
                  </el-form-item>
                  <el-form-item label="配车物料码：" prop="materialsCode">
                    <el-input placeholder="请输入" v-model="form.materialsCode" clearable disabled />
                  </el-form-item>
                  <el-form-item label="电池电芯(配车物料)：" prop="batteryCellName">
                    <el-input placeholder="请输入" v-model="form.batteryCellName" clearable disabled />
                  </el-form-item>
                  <el-form-item label="合格证是否质押：" prop="certificatePledged">
                    <el-radio-group v-model="form.certificatePledged" disabled>
                      <el-radio v-for="item in true_false_enum" :key="item.code" :label="item.code">{{ item.message
                        }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="锁定时间：" prop="lockTime">
                    <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.lockTime"
                      :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                      end-placeholder="结束日期" disabled />
                  </el-form-item>
                  <el-form-item label="配车物料描述：" prop="materialsDesc">
                    <el-input placeholder="请输入" v-model="form.materialsDesc" clearable disabled />
                  </el-form-item>
                  <el-form-item label="首次配车时间：" prop="firstAllocateTime">
                    <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.firstAllocateTime"
                      :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                      end-placeholder="结束日期" disabled />
                  </el-form-item>
                  <el-form-item label="是否创建发运单计划：" prop="createdShippingPlan">
                    <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.createdShippingPlan"
                      placeholder="请选择" clearable filterable disabled />
                  </el-form-item>
                  <el-form-item label="零售订单号：" prop="retailOrderCode">
                    <el-input placeholder="请输入" v-model="form.retailOrderCode" clearable disabled />
                  </el-form-item>
                  <el-form-item label="配车VIN码：" prop="vin">
                    <el-input placeholder="请输入" v-model="form.vin" clearable disabled />
                  </el-form-item>
                  <el-form-item label="首次结算失败时间：" prop=" firstSettleFailedTime">
                    <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.firstSettleFailedTime"
                      :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                      end-placeholder="结束日期" disabled />
                  </el-form-item>
                  <el-form-item label="ERP销售订单号：" prop="erpSaleOrderCode">
                    <el-input placeholder="请输入" v-model="form.erpSaleOrderCode" clearable disabled />
                  </el-form-item>
                  <el-form-item label="商城订单号：" prop="mallOrderCode">
                    <el-input placeholder="请输入" v-model="form.mallOrderCode" clearable disabled />
                  </el-form-item>
                  <el-form-item label="配车方式：" prop="allocateWay">
                    <fetch-select :request="fetchOptions" enumCode="vw_allocate_way" v-model="form.allocateWay"
                      placeholder="请选择" clearable filterable disabled />
                  </el-form-item>
                  <el-form-item label="首次取消配车时间：" prop="firstCancelAllocateTime">
                    <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.firstCancelAllocateTime"
                      :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                      end-placeholder="结束日期" disabled />
                  </el-form-item>
                  <el-form-item label="ERP交货单：" prop="erpDeliverOrder">
                    <el-input placeholder="请输入" v-model="form.erpDeliverOrder" clearable disabled />
                  </el-form-item>
                  <el-form-item label="整车物流预留：" prop="logisticsReserveLabel">
                    <el-input placeholder="请输入" v-model="form.logisticsReserveLabel" clearable disabled />
                  </el-form-item>
                  <el-form-item label="配车时间：" prop="allocateTime">
                    <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.allocateTime"
                      :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                      end-placeholder="结束日期" disabled />
                  </el-form-item>
                  <el-form-item label="取消配车说明：" prop="cancelAllocateVehicleTypeLabel">
                    <el-input placeholder="请输入" v-model="form.cancelAllocateVehicleTypeLabel" clearable maxlength="300"
                      disabled />
                  </el-form-item>
                  <el-form-item label="ERP发票号：" prop="erpInvoiceCode">
                    <el-input placeholder="请输入" v-model="form.erpInvoiceCode" clearable disabled />
                  </el-form-item>
                  <el-form-item label="物流预留备注：" prop="logisticsReserveRemark">
                    <el-input placeholder="请输入" v-model="form.logisticsReserveRemark" clearable disabled />
                  </el-form-item>
                  <el-form-item label="结算时间：" prop="settleTime">
                    <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.settleTime"
                      :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                      end-placeholder="结束日期" disabled />
                  </el-form-item>
                  <el-form-item label="取消结算时间：" prop="cancelSettleTime">
                    <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.cancelSettleTime"
                      :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                      end-placeholder="结束日期" disabled />
                  </el-form-item>
                  <el-form-item label="初始交付周期说明：" prop="initDeliveryCycleDesc">
                    <el-input placeholder="请输入" v-model="form.initDeliveryCycleDesc" clearable disabled />
                  </el-form-item>
                  <el-form-item label="退车标识：" prop="vehicleReturnFlag">
                    <el-radio-group v-model="form.vehicleReturnFlag" disabled>
                      <el-radio v-for="item in true_false_enum" :key="item.code" :label="item.code">{{ item.message
                        }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="结算方式：" prop="settleWay">
                    <fetch-select :request="fetchOptions" enumCode="vw_wholesale_settle_way" v-model="form.settleWay"
                      placeholder="请选择" clearable filterable disabled />
                  </el-form-item>
                  <el-form-item label="是否存在结算失败：" prop="hasSettleFailed">
                    <el-radio-group v-model="form.hasSettleFailed" disabled>
                      <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message
                        }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="动态交付周期说明：" prop="dynamicDeliveryCycleDesc">
                    <el-input placeholder="请输入" v-model="form.dynamicDeliveryCycleDesc" clearable disabled />
                  </el-form-item>
                  <el-form-item label="特殊备注：" prop="specialRemark">
                    <el-input placeholder="请输入" v-model="form.specialRemark" clearable maxlength="300" />
                  </el-form-item>
                  <el-form-item label="车辆交付状态：" prop="deliveryStatus">
                    <fetch-select :request="fetchOptions" enumCode="vw_vehicle_delivery_status"
                      v-model="form.deliveryStatus" placeholder="请选择" clearable filterable disabled />
                  </el-form-item>
                  <el-form-item label="作废说明：" prop="cancelRemark">
                    <el-input placeholder="请输入" v-model="form.cancelRemark" clearable maxlength="300" disabled />
                  </el-form-item>

                </el-form>

                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="是否已锁定：" prop="lockStatusLabel">
                    {{ form.lockStatusLabel }}
                  </el-form-item>
                  <el-form-item label="配车物料码：" prop="materialsCode">
                    <el-link type="primary"
                      :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${form.materialsCode}`"
                      target="_blank">{{ form.materialsCode }}</el-link>
                  </el-form-item>
                  <el-form-item label="电池电芯(配车物料)：" prop="batteryCellName">
                    {{ form.batteryCellName }}
                  </el-form-item>
                  <el-form-item label="合格证是否质押：" prop="certificatePledgedLabel">
                    {{ form.certificatePledgedLabel }}
                  </el-form-item>
                  <el-form-item label="锁定时间：" prop="lockTime">
                    {{ form.lockTime }}
                  </el-form-item>
                  <el-form-item label="配车物料描述：" prop="materialsDesc">
                    {{ form.materialsDesc }}
                  </el-form-item>
                  <el-form-item label="首次配车时间：" prop="firstAllocateTime">
                    {{ form.firstAllocateTime }}
                  </el-form-item>
                  <el-form-item label="是否创建发运单计划：" prop="createdShippingPlanLabel">
                    {{ form.createdShippingPlanLabel }}
                  </el-form-item>
                  <el-form-item label="零售订单号：" prop="retailOrderCode">
                    {{ form.retailOrderCode }}
                  </el-form-item>
                  <el-form-item label="配车VIN码：" prop="vin">
                    <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`"
                      target="_blank">{{ form.vin }}</el-link>
                  </el-form-item>
                  <el-form-item label="是否特供车：" prop="isSpecialSupplyLabel">
                    {{ form.isSpecialSupplyLabel }}
                  </el-form-item>
                  <el-form-item label="特供车标记：" prop="specialSupplyMarkLabel">
                    {{ form.specialSupplyMarkLabel }}
                  </el-form-item>
                  <el-form-item label="首次结算失败时间：" prop="firstSettleFailedTime">
                    {{ form.firstSettleFailedTime }}
                  </el-form-item>
                  <el-form-item label="ERP销售订单号：" prop="erpSaleOrderCode">
                    {{ form.erpSaleOrderCode }}
                  </el-form-item>
                  <el-form-item label="商城订单号：" prop="mallOrderCode">
                    <el-button class="link" style="padding: 0;" type="text"
                      @click="openWindow('/sales/vehretail/orderManager/retailOrderInfo/edit?id=' + form.retailOrderId)">{{
                      form.mallOrderCode }}</el-button>
                  </el-form-item>
                  <el-form-item label="配车方式：" prop="allocateWayLabel">
                    {{ form.allocateWayLabel }}
                  </el-form-item>
                  <el-form-item label="首次取消配车时间：" prop="firstCancelAllocateTime">
                    {{ form.firstCancelAllocateTime }}
                  </el-form-item>
                  <el-form-item label="ERP交货单：" prop="erpDeliverOrder">
                    {{ form.erpDeliverOrder }}
                  </el-form-item>
                  <el-form-item label="整车物流预留：" prop="logisticsReserveLabel">
                    {{ form.logisticsReserveLabel }}
                  </el-form-item>
                  <el-form-item label="配车时间：" prop="allocateTime">
                    {{ form.allocateTime }}
                  </el-form-item>
                  <el-form-item label="取消配车说明：" prop="cancelAllocateVehicleTypeLabel">
                    {{ form.cancelAllocateVehicleTypeLabel }}
                  </el-form-item>
                  <el-form-item label="ERP发票号：" prop="erpInvoiceCode">
                    {{ form.erpInvoiceCode }}
                  </el-form-item>
                  <el-form-item label="物流预留备注：" prop="logisticsReserveRemark">
                    {{ form.logisticsReserveRemark }}
                  </el-form-item>
                  <el-form-item label="结算时间：" prop="settleTime">
                    {{ form.settleTime }}
                  </el-form-item>
                  <el-form-item label="取消结算时间：" prop="cancelSettleTime">
                    {{ form.cancelSettleTime }}
                  </el-form-item>
                  <el-form-item label="初始交付周期说明：" prop="initDeliveryCycleDesc">
                    {{ form.initDeliveryCycleDesc }}
                  </el-form-item>
                  <el-form-item label="退车标识：" prop="vehicleReturnFlagLabel">
                    {{ form.vehicleReturnFlagLabel }}
                    <!-- {{ yes_no_enum_map[form.vehicleReturnFlag] }} -->
                  </el-form-item>
                  <el-form-item label="结算方式：" prop="settleWayLabel">
                    {{ form.settleWayLabel }}
                  </el-form-item>
                  <el-form-item label="是否存在结算失败：" prop="hasSettleFailedLabel">
                    {{ form.hasSettleFailedLabel }}
                  </el-form-item>
                  <el-form-item label="动态交付周期说明：" prop="dynamicDeliveryCycleDesc">
                    {{ form.dynamicDeliveryCycleDesc }}
                  </el-form-item>
                  <el-form-item label="特殊备注：" prop="specialRemark">
                    {{ form.specialRemark }}
                  </el-form-item>
                  <el-form-item label="车辆交付状态：" prop="deliveryStatusLabel">
                    {{ form.deliveryStatusLabel }}
                  </el-form-item>
                  <el-form-item label="作废说明：" prop="cancelRemark">
                    {{ form.cancelRemark }}
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
                <el-form :inline="true" :model="form" ref="ruleForm" label-width="150px" class="form-edit"
                  v-show="isEditing || !_id">
                  <el-form-item label="零售价：" prop="retailPrice">
                    <el-input placeholder="请输入" v-model="form.retailPrice" clearable disabled />
                  </el-form-item>
                  <el-form-item label="结算资金类型：" prop="settleFundType">
                    <fetch-select :options="fundTypeList" v-model="settleFundTypeOptionKey" placeholder="请选择" clearable
                      filterable labelKey="fundTypeLabel" valueKey="fundType" @change="clearCache" />
                  </el-form-item>
                  <el-form-item label="使用返利金额：" prop="usedRebateAmount">
                    <el-input placeholder="请输入" v-model="form.usedRebateAmount" clearable disabled />
                  </el-form-item>
                  <el-form-item label="是否赊销：" prop="creditSaleFlag">
                    <el-radio-group v-model="form.creditSaleFlag" disabled>
                      <el-radio v-for="item in true_false_enum" :key="item.code" :label="item.code">{{ item.message
                        }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="批售价：" prop="wholesalePrice">
                    <el-input placeholder="请输入" v-model="form.wholesalePrice" clearable disabled />
                  </el-form-item>
                  <el-form-item label="金融机构名称：" prop="financialOrganizationId" v-show="['2010', '2020', '2030'].includes(form.settleFundType + '')">
                    <fetch-select :options="financingOrgOptions" v-model="form.financialOrganizationId"
                      placeholder="请选择" clearable filterable labelKey="name" valueKey="id"
                      @change="getNewfinancialOrganization" />
                  </el-form-item>
                  <el-form-item label="使用现金金额：" prop="usedCashAmount">
                    <el-input placeholder="请输入" v-model="form.usedCashAmount" clearable disabled />
                  </el-form-item>
                  <el-form-item label="赊销是否还款：" prop="creditSaleRepaid">
                    <el-radio-group v-model="form.creditSaleRepaid" disabled>
                      <el-radio v-for="item in true_false_enum" :key="item.code" :label="item.code">{{ item.message
                        }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                    <!-- <fetch-select
                    :remote-method="repairItemSearch"
                    remote
                    reserve-keyword
                    labelKey="name"
                    valueKey="id"
                    v-model="form.financialOrganizationId"
                    placeholder="请选择"
                    clearable
                    filterable
                  /> -->
                  <el-form-item label="开票类型：" prop="invoiceDiscountType">
                    <fetch-select :request="fetchOptions" enumCode="vw_invoice_type" v-model="form.invoiceDiscountType"
                      placeholder="请选择" clearable filterable disabled />
                  </el-form-item>
                  <el-form-item label="返利使用类型：" prop="rebateUseType">
                    <fetch-select :request="fetchOptions" enumCode="vw_rebate_use_type" v-model="form.rebateUseType"
                      placeholder="请选择" clearable filterable disabled />
                  </el-form-item>
                  <el-form-item label="首付款比例：" prop="downPaymentRatio">
                    <el-input placeholder="请输入" v-model="form.downPaymentRatio" clearable disabled />
                  </el-form-item>
                  <el-form-item label="同步SAP状态：" prop="syncSapMsg">
                    <el-input placeholder="请输入" v-model="form.syncSapMsg" maxlength="300" clearable disabled />
                  </el-form-item>
                  <el-form-item label="开票系数：" prop="invoiceCoefficient">
                    <el-input placeholder="请输入" v-model="form.invoiceCoefficient" clearable disabled />
                  </el-form-item>
                  <el-form-item label="返利使用系数：" prop="rebateCoefficient">
                    <el-input placeholder="请输入" v-model="form.rebateCoefficient" clearable disabled />
                  </el-form-item>
                  <el-form-item label="融资金额/赊销欠款：" prop="creditSalesAmount">
                    <el-input placeholder="请输入" v-model="form.creditSalesAmount" clearable disabled />
                  </el-form-item>

                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="零售价：" prop="retailPrice">
                    {{ form.retailPrice }}
                  </el-form-item>
                  <el-form-item label="结算资金类型：" prop="settleFundTypeLabel">
                    {{ form.settleFundTypeLabel }}
                  </el-form-item>
                  <el-form-item label="使用返利金额：" prop="usedRebateAmount">
                    {{ form.usedRebateAmount }}
                  </el-form-item>
                  <el-form-item label="是否赊销：" prop="creditSaleFlagLabel">
                    {{ form.creditSaleFlagLabel }}
                  </el-form-item>
                  <el-form-item label="批售价：" prop="wholesalePrice">
                    {{ form.wholesalePrice }}
                  </el-form-item>
                  <el-form-item label="金融机构名称：" prop="financialOrganizationName" v-show="['2010', '2020', '2030'].includes(form.settleFundType + '')">
                    <el-link type="primary"
                      :href="`/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=${form.financialOrganizationId}`"
                      target="_blank">{{ form.financialOrganizationName }}</el-link>
                  </el-form-item>
                  <el-form-item label="使用现金金额：" prop="usedCashAmount">
                    {{ form.usedCashAmount }}
                  </el-form-item>
                  <el-form-item label="赊销是否还款：" prop="creditSaleRepaidLabel">
                    {{ form.creditSaleRepaidLabel }}
                  </el-form-item>
                  <el-form-item label="开票类型：" prop="invoiceDiscountTypeLabel">
                    {{ form.invoiceDiscountTypeLabel }}
                  </el-form-item>
                  <el-form-item label="返利使用类型：" prop="rebateUseTypeLabel">
                    {{ form.rebateUseTypeLabel }}
                  </el-form-item>
                  <el-form-item label="首付款比例：" prop="downPaymentRatio">
                    {{ form.downPaymentRatio }}
                  </el-form-item>
                  <el-form-item label="同步SAP状态：" prop="syncSapMsg">
                    {{ form.syncSapMsg }}
                  </el-form-item>
                  <el-form-item label="开票系数：" prop="invoiceCoefficient">
                    {{ form.invoiceCoefficient }}
                  </el-form-item>
                  <el-form-item label="返利使用系数：" prop="rebateCoefficient">
                    {{ form.rebateCoefficient }}
                  </el-form-item>
                  <el-form-item label="融资金额/赊销欠款：" prop="creditSalesAmount">
                    <!-- todo 后续版本添加字段 -->
                    {{ form.creditSalesAmount }}
                  </el-form-item>

                </el-form>
              </div>
            </section>
            <section class="common-section">
              <div class="common-section-header">
                <h2>整车资金账户信息</h2>
                <!-- <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button> -->
              </div>
              <div class="common-section-body">
                <div class="common-section-table">
                  <el-table :data="form.dealerFundAccounts" border style="width: 100%">
                    <el-table-column label="资金类型" width="180">
                      <template slot-scope="scope">
                        <!--
                          资金类型列展示规则：
                          当 financialOrganizationName 非空时，拼接为 `资金类型（金融机构）`（全角括号）；
                          非融资类账户（现金、赊销-零跑）不带金融机构，自然只显示 fundTypeLabel
                        -->
                        <el-link type="primary"
                          :href="`/sales/vehwholesale/fund/dealerFundAccount/edit?id=${scope.row.id}`"
                          target="_blank">{{ scope.row.financialOrganizationName ? `${scope.row.fundTypeLabel}（${scope.row.financialOrganizationName}）` : (scope.row.fundTypeLabel || '') }}</el-link>
                      </template>
                    </el-table-column>
                    <el-table-column prop="availableBalance" label="可用余额" />
                    <el-table-column prop="frozenBalance" label="冻结资金" />
                    <el-table-column prop="availableCreditAmount" label="剩余可用额度" />
                    <el-table-column prop="downPaymentRatio" label="首付款比例%" />
                    <el-table-column prop="creditAccountStatusLabel" label="赊销账户状态" />
                    <el-table-column prop="effectiveTime" label="额度生效日期" />
                    <el-table-column prop="expireTime" label="额度失效日期" />
                  </el-table>
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
    <BatchCancelInput :visible.sync="showBatchCancelDialog" :cancel-ids="[_id]" @confirm="cancelApproval" />
    <BatchCancelSettleInput :visible.sync="showBatchCancelSettleDialog" ::cancel-ids="[_id]"
      @batchCancelSettle="batchCancelSettle" />
    <ManualVehicle :visible.sync="showManualVehicleDialog" @confirmVin="confirmVin" />
    <component-table :tableDataExternal="accountData" :columns="detailsColumns"
      :visible.sync="showComponentTabelDialog" />

    <CancleBatchAllocateVehicleInput :visible.sync="showCancleBatchAllocateVehicleDialog" :cancel-ids="[_id]"
      @cancleBatchAllocateVehicle="cancleBatchAllocateVehicle" />
  </div>
</template>

<script>
import { batchCancleAllocateVehicleItem, getDetail, addOrUpdate, batchConfirmItem, batchCancelItem, vinAllocateVehicleSubmitItem, batchSettleSubmitItem, batchCancelSettleItem, querySAPAccountBalance, batchAllocateVehicleItem } from '@/api/vehwholesale/wholesale/vehicleWholesaleOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM, TRUE_FALSE_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ManualVehicle from './ManualVehicle.vue';
import BatchCancelInput from './BatchCancelInput.vue';
import { listIdNames } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import BatchCancelSettleInput from './BatchCancelSettleInput.vue';
import ComponentTable from './ComponentTable.vue';
import CancleBatchAllocateVehicleInput from './CancleBatchAllocateVehicleInput.vue';
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
  syncSapMsg: '',
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
  // 二网标识与门店（厂端同门店端同字段含义；下推时从补货申请带过来，厂端仅展示）
  secondDealerFlag: 0,
  secondDealerCode: '',
  secondDealerName: '',
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
    FetchSelect,
    ManualVehicle,
    BatchCancelInput,
    BatchCancelSettleInput,
    ComponentTable,
    CancleBatchAllocateVehicleInput
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '整车批售订单信息：' + (this.form.wholesaleOrderCode || '');
    },
    financingOrgOptions () {
      const ft = this.form.settleFundType + '';
      if (!['2010', '2020', '2030'].includes(ft)) return [];
      return this.financingOrgListMap.get(ft) || [];
    },
    settleFundTypeOptionKey: {
      get () {
        const ft = this.form.settleFundType;
        if (ft === '' || ft === null || ft === undefined) return '';
        return String(ft);
      },
      // set 由 @change 回调 clearCache 负责写回 form 字段，避免双向绑定循环
      set () {}
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
      pageTitle: '整车批售订单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-vehicleWholesaleOrderFactory',
      loading: false,
      submitLoading: false,
      showManualVehicleDialog: false,
      showBatchCancelDialog: false,
      showBatchCancelSettleDialog: false,
      showComponentTabelDialog: false,
      showCancleBatchAllocateVehicleDialog: false,
      querySapAccountLoading: false,
      checkConfirmLoading: false,
      autoVehicleAllocationLoading: false,
      batchSettleSubmitLoading: false,
      cancelAllocateVehicleLoading: false,
      needAutoAllocateCarStatus: [1, 2, 10, 21, 99, 3],
      yes_no_enum: YES_NO_ENUM,
      true_false_enum: TRUE_FALSE_ENUM,
      ALLOWED_STATUS: [0, 11],
      settleFundTypeOptions: [],
      financialOrganizationList: [],
      financingOrgListMap: new Map(),
      orderCategoryOptions: [],
      accountData: [],
      fundTypeList: [],
      // 权限控制
      perquerySapAccount: false,
      perbatchConfirm: false,
      perbatchSetAutoAllocate: false,
      pervinAllocateVehicle: false,
      perbatchSettleSubmit: false,
      perbatchCancelSettle: false,
      perbatchCancel: false,
      perbatchCancelAllocate: false,
      detailsColumns: [
        { field: 'dealerCompanyName', title: '销售公司' },
        { field: 'gtext', title: '资金类型' },
        { field: 'availableBalance', title: '可用余额' },
        { field: 'creditAmount', title: '赊销金额' },
        { field: 'chargeAmount', title: '充值金额' },
        { field: 'frozenAmount', title: '占用余额' },
      ],
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
      },
      tableData: [],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'fundTypeLabel',
          title: '资金类型',
        },
        {
          field: 'availableBalance',
          title: '可用余额',
        },
        {
          field: 'frozenBalance',
          title: '冻结资金',
        },
        {
          field: 'availableCreditAmount',
          title: '剩余可用额度',
        },
        {
          field: 'downPaymentRatio',
          title: '首付款比例%',
        },
        {
          field: 'creditAccountStatusLabel',
          title: '赊销账户状态',
        },
        {
          field: 'effectiveTime',
          title: '额度生效日期',
        },
        {
          field: 'expireTime',
          title: '额度失效日期',
        },
      ],
    };
  },
  mounted () {
    console.log('mounted', ManualVehicle.props);
    this.fetchSettleFundTypeOptions();
    this.fetchOrderCategoryOptions();
  },
  created () {
    this.initPermissions();
  },
  methods: {
    initPermissions () {
      this.perquerySapAccount = this.permissions.has(`${this.moduleKey}-querySapAccount`); // 查询整车账户余额
      this.perbatchConfirm = this.permissions.has(`${this.moduleKey}-batchConfirm`); // 审核确认
      this.perbatchSetAutoAllocate = this.permissions.has(`${this.moduleKey}-batchSetAutoAllocate`); // 自动配车
      this.pervinAllocateVehicle = this.permissions.has(`${this.moduleKey}-vinAllocateVehicle`); // 手工配车
      this.perbatchSettleSubmit = this.permissions.has(`${this.moduleKey}-batchSettleSubmit`); // 提交结算
      this.perbatchCancelSettle = this.permissions.has(`${this.moduleKey}-batchCancelSettle`); // 取消结算
      this.perbatchCancel = this.permissions.has(`${this.moduleKey}-batchCancel`); // 作废
      this.perbatchCancelAllocate = this.permissions.has(`${this.moduleKey}-batchCancelAllocate`); // 取消结算
    },
    openWindow (url) {
      window.open(url, '_blank');
    },
    formatDateTime (date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    changeStatus () {
      if (this.form.emergencyOrder === '1' || this.form.emergencyOrder === 1) {
        this.form.emergencyOrderTime = this.formatDateTime(new Date());
      } else {
        this.form.emergencyOrderTime = '';
      }
    },
    cancleBatchAllocateVehicle (data) {
      const ids = [this._id];
      return batchCancleAllocateVehicleItem({
        idSet: ids,
        cancelAllocateVehicleType: data.cancelAllocateVehicleType
      }).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.getDetailData();
      });
    },
    handleCancelAllocateVehicle () {
      this.showCancleBatchAllocateVehicleDialog = true;
    },
    async fetchOrderCategoryOptions () {
      const response = await getEnum('vw_order_category');
      this.orderCategoryOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['0', '2', '20'].includes(codeStr);
      }).map(item => {
        // 确保 code 字段是字符串类型
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    handlequerySAPAccountBalance () {
      this.querySapAccountLoading = true;
      const params = {
        id: this._id,
      };
      querySAPAccountBalance(params).then((res) => {
        this.accountData = res;
        this.showComponentTabelDialog = true;
      }).finally(() => {
        this.querySapAccountLoading = false;
      });
    },
    async fetchSettleFundTypeOptions () {
      const response = await getEnum('vw_fundtype');
      this.settleFundTypeOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['1050', '1010', '2010', '2020', '2030'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    batchCancelSettle (data) {
      const ids = [this._id];
      return batchCancelSettleItem({
        idSet: ids,
        cancelSettleType: data.cancelSettleType
      }).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.getDetailData();
      });
    },
    handleBatchCancelSettle () {
      this.showBatchCancelSettleDialog = true;
    },
    handleBatchSettleSubmit () {
      this.batchSettleSubmitLoading = true;
      const ids = [this._id];
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
          this.getDetailData();
        }).finally(() => {
          this.batchSettleSubmitLoading = false;
        });
      }).catch(() => {
        this.batchSettleSubmitLoading = false;
      });
    },
    getDetailData () {
      if (this._id) {
        getDetail(this._id).then(res => {
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        }).catch(() => { });
      }
    },
    repairItemSearch (query) {
      console.log('repairItemSearch', listIdNames({ organizationNameLike: query, status: 1 }));
      return listIdNames({ organizationNameLike: query, status: 1 });
    },
    allAllowConfirm (item) {
      if (item.confirmStatus !== 1010) {
        this.$message({
          type: 'error',
          message: '订单[确认状态]必须为[未确认]!'
        });
        return false;
      };
      if (!this.ALLOWED_STATUS.includes(item.orderStatus)) {
        this.$message({
          type: 'error',
          message: '订单[订单状态]必须为[未配车,配车失败]!'
        });
        return false;
      };
      if (item.orderCategory !== 0) {
        this.$message({
          type: 'error',
          message: '订单[订单分类]必须为[商品车订单]!'
        });
        return false;
      }
      return true;
    },
    allAutoVehicleAllocation (item) {
      if (item.confirmStatus !== 1020) {
        this.$message({
          type: 'error',
          message: '订单[确认状态]必须为[已确认]!'
        });
        return false;
      };
      if (!this.ALLOWED_STATUS.includes(item.orderStatus)) {
        this.$message({
          type: 'error',
          message: '订单[订单状态]必须为[未配车,配车失败]!'
        });
        return false;
      };
      return true;
    },
    handleCheckConfirm () { //
      // const checkStatus = this.allAllowConfirm(this.form);
      // if (checkStatus) {
      this.checkConfirmLoading = true;
      this.$confirm('是否需要对批售订单进行确认?', '操作提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchConfirmItem({
          idSet: [this.form.id]
        }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getDetailData();
        }).finally(() => {
          this.checkConfirmLoading = false;
        });
      }).catch(() => {
        this.checkConfirmLoading = false;
      });
      // }
    },
    handleaAutoVehicleAllocation () { // 自动配车
      const data = {
        idSet: [this.form.id],
      };
      batchAllocateVehicleItem(data).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.getDetailData();
      });

      // const checkStatus = this.allAutoVehicleAllocation(this.form);
      // if (checkStatus) {
      // this.autoVehicleAllocationLoading = true;
      // this.$confirm('是否需要对批售订单进行自动配车?', '操作提醒', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   batchSetAutoAllocateItem({
      //     ids: [this.form.id],
      //     needAutoAllocateCar: 1
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '提交成功!'
      //     });
      //     this.getDetailData();
      //   }).finally(() => {
      //     this.autoVehicleAllocationLoading = false;
      //   });
      // }).catch(() => {
      //   this.autoVehicleAllocationLoading = false;
      // });
      // }
    },
    handleManualVehicleAllocation () { // 手工配车
      // 判断是否需要自动配车
      const needAutoAllocateCar = this.form.needAutoAllocateCar;

      // 如果 needAutoAllocateCar = 0（即否），需要二次确认
      if (needAutoAllocateCar === '0' || needAutoAllocateCar === 0) {
        this.$confirm(
          '该订单不需要自动配车，是否执行手工配车',
          '操作提醒',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          // 用户确认，显示手工配车对话框
          this.showManualVehicleDialog = true;
        }).catch(() => {
          // 用户取消，不做任何操作
        });
        return;
      }

      // 其他情况直接显示手工配车对话框
      this.showManualVehicleDialog = true;
    },
    confirmVin (data) {
      const params = {
        wholesaleOrderId: this.form.id,
        vin: data.vin
      };
      vinAllocateVehicleSubmitItem(params).then(() => {
        this.$message({
          type: 'success',
          message: '配车成功!'
        });
        this.getDetailData();
      });
    },
    handleDelete () { // 删除

    },
    allAllowCancel (item) {
      if (!this.ALLOWED_STATUS.includes(item.orderStatus)) {
        this.$message({
          type: 'error',
          message: '订单已完成配车，不允许作废!'
        });
        return;
      };
      if (item.allow_lock_retail === 1) {
        this.$message({
          type: 'error',
          message: '批售订单已绑定零售订单,不允许作废!'
        });
        return false;
      }
      return true;
    },
    handleCancel () { // 作废
      this.showBatchCancelDialog = true;
      // const checkStatus = this.allAllowCancel(this.form);
      // if (checkStatus) {
      //   this.showBatchCancelDialog = true;
      // }
    },
    cancelApproval (data) {
      return batchCancelItem(data).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.getDetailData();
      });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then((res) => {
          // 1. 初始化或清空列表，防止重复添加
          this.financialOrganizationList = [];
          const financingOrgListMap = new Map();
          // 资金类型下拉选项：按资金类型去重；机构名单独下拉选择，避免拼接误导
          // （同一资金类型可对应多家金融机构，"融资（兴业银行）" 这种拼接与列表行 1 对 1 机构的语义不同）
          const fundTypeOptions = [];
          const fundTypeSet = new Set();

          // 2. 处理 dealerFundAccounts
          if (res.dealerFundAccounts && Array.isArray(res.dealerFundAccounts)) {
            res.dealerFundAccounts = res.dealerFundAccounts.map(account => {
              if (account.fundType !== 1020 && account.validIfCreditSaleAccount === true) {
                const ftKey = String(account.fundType);
                if (!fundTypeSet.has(ftKey)) {
                  fundTypeSet.add(ftKey);
                  fundTypeOptions.push({
                    fundType: ftKey,
                    fundTypeLabel: account.fundTypeLabel
                  });
                }
              }
              const ftKey = String(account.fundType);
              if (['2010', '2020', '2030'].includes(ftKey) && account.financialOrganizationId && account.financialOrganizationName) {
                // 按资金类型分组去重收集金融机构（保留给独立机构下拉使用）
                if (!financingOrgListMap.has(ftKey)) {
                  financingOrgListMap.set(ftKey, new Map());
                }
                const orgMap = financingOrgListMap.get(ftKey);
                if (!orgMap.has(account.financialOrganizationId)) {
                  orgMap.set(account.financialOrganizationId, account.financialOrganizationName);
                }
                // 同步向旧版 financialOrganizationList 收集（保留兼容）
                const exists = this.financialOrganizationList.some(item => item.id === account.financialOrganizationId);
                if (!exists) {
                  this.financialOrganizationList.push({
                    id: account.financialOrganizationId,
                    name: account.financialOrganizationName
                  });
                }
              }
              // 原有的映射逻辑
              return {
                ...account,
                creditAccountStatusLabel: account.creditSalesLimit?.creditAccountStatusLabel || '',
                effectiveTime: account.creditSalesLimit?.effectiveTime || '',
                expireTime: account.creditSalesLimit?.expireTime || '',
                downPaymentRatio: account.creditSalesLimit?.downPaymentRatio || '',
                availableCreditAmount: account.creditSalesLimit?.availableCreditAmount || '',
              };
            });
          }
          this.fundTypeList = fundTypeOptions;
          // 转 Map<fundType, Map<orgId, name>> 为 Map<fundType, Array<{id, name}>>
          const orgListMap = new Map();
          financingOrgListMap.forEach((orgMap, ft) => {
            orgListMap.set(ft, Array.from(orgMap.entries()).map(([id, name]) => ({ id, name })));
          });
          this.financingOrgListMap = orgListMap;
          return res;
        }).catch(() => { });
      }
    },
    clearCache (val, row) {
      if (!row) {
        this.form.settleFundType = '';
        this.form.settleFundTypeLabel = '';
        this.form.financialOrganizationId = '';
        this.form.financialOrganizationName = '';
        return;
      }
      // 2010/2020/2030 统一以数字形式保存，与后端/下游比较一致
      const ftKey = row.fundType + '';
      this.form.settleFundType = ['2010', '2020', '2030'].includes(ftKey) ? Number(ftKey) : row.fundType;
      this.form.settleFundTypeLabel = row.fundTypeLabel || '';
      // 机构由独立的"金融机构名称"下拉选择，这里清空，避免上一次选的资金类型与新机构不匹配
      this.form.financialOrganizationId = '';
      this.form.financialOrganizationName = '';
    },
    getNewfinancialOrganization (val, row) {
      if (!val) {
        return;
      }
      this.form.financialOrganizationId = row.id;
      this.form.financialOrganizationName = row.name;
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
