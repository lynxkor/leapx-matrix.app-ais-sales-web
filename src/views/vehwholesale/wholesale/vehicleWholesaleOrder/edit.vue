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
        <template #extraButtons>
          <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
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
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
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
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
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
                <el-form-item label="配车VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
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
                <el-form-item label="大区：" prop="regionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityName"
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
                <el-form-item label="允许锁零售单,1:是允许，0否不允许：" prop="allowLockRetail">
                  <el-input
                    placeholder="请输入"
                    v-model="form.allowLockRetail"
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
                    enumCode="xxx"
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
                    enumCode="xxx"
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
                <el-form-item label="使用返利金额：" prop="usedRebateAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.usedRebateAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="ERP销售订单号：" prop="erpSaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.erpSaleOrderCode"
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
                <el-form-item label="同步SAP状态：" prop="syncSapStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.syncSapStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyReason"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="内饰：" prop="interiorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.interiorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="外观：" prop="exteriorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.exteriorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="轮毂名称：" prop="wheelHubName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wheelHubName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.yearTypeName"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="特殊备注：" prop="specialRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.specialRemark"
                    clearable
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
                <el-form-item label="出库时间：" prop="outboundTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.outboundTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="确认状态：" prop="confirmStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.confirmStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否已锁定,1是0否：" prop="lockStatus">
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
                <el-form-item label="是否创建发运单计划：" prop="createdShippingPlan">
                  <el-input
                    placeholder="请输入"
                    v-model="form.createdShippingPlan"
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
                <el-form-item label="结算方式：" prop="settleWay">
                  <el-input
                    placeholder="请输入"
                    v-model="form.settleWay"
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
                <el-form-item label="合作类型：" prop="cooperateType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.cooperateType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.settleFundType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="融资金额&#x2F;赊账：" prop="creditSalesAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creditSalesAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="急单备注：" prop="emergencyOrderRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.emergencyOrderRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="首付款比例%：" prop="downPaymentRatio">
                  <el-input
                    placeholder="请输入"
                    v-model="form.downPaymentRatio"
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
                <el-form-item label="订单物料编码：" prop="orderMaterialCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderMaterialCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否需要自动配车,1:是；0：否：" prop="needAutoAllocateCar">
                  <el-input
                    placeholder="请输入"
                    v-model="form.needAutoAllocateCar"
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
                <el-form-item label="电池电芯名称：" prop="batteryCellName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.batteryCellName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否存在结算失败：" prop="hasSettleFailed">
                  <el-radio-group v-model="form.hasSettleFailed">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="市code：" prop="cityCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="外观ID：" prop="exteriorId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.exteriorId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="批售目标额度占用记录ID：" prop="saleTargetTrackingId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleTargetTrackingId"
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
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="销售公司：" prop="saleCompanyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleCompanyId"
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
                <el-form-item label="物料ID：" prop="materialsId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
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
                <el-form-item label="大区编码：" prop="regionCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="省code：" prop="provinceCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="内饰ID：" prop="interiorId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.interiorId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车型ID：" prop="modelId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="轮毂ID：" prop="wheelHubId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wheelHubId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="年款ID：" prop="yearTypeId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.yearTypeId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="首次结算失败时间：" prop="firstSettleFailedTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.firstSettleFailedTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="商城订单号：" prop="mallOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否紧急订单：1是0否：" prop="emergencyOrder">
                  <el-input
                    placeholder="请输入"
                    v-model="form.emergencyOrder"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="金融机构ID：" prop="financialOrganizationId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.financialOrganizationId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="金融机构名称：" prop="financialOrganizationName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.financialOrganizationName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="批售订单扩展ID：" prop="wholesaleOrderExtId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleOrderExtId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.confirmUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="取消配车说明：" prop="cancelAllocateRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelAllocateRemark"
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
                <el-form-item label="使用现金金额：" prop="usedCashAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.usedCashAmount"
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
                <el-form-item label="未自动确认原因：" prop="noAutoConfirmReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.noAutoConfirmReason"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆预计下线日期：" prop="expectedOfflineTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.expectedOfflineTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="是否赊销：" prop="creditSaleFlag">
                  <el-radio-group v-model="form.creditSaleFlag">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否延期交付：" prop="deliveryDelayed">
                  <el-radio-group v-model="form.deliveryDelayed">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="赊销是否还款：" prop="creditSaleRepaid">
                  <el-radio-group v-model="form.creditSaleRepaid">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="合格证是否质押：" prop="certificatePledged">
                  <el-radio-group v-model="form.certificatePledged">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="退车标识：" prop="vehicleReturnFlag">
                  <el-radio-group v-model="form.vehicleReturnFlag">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否清账：" prop="clearedFlag">
                  <el-radio-group v-model="form.clearedFlag">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="采购订单ID：" prop="purchaseOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseOrderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="批售订单ID：" prop="wholesaleOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleOrderId"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
                </el-form-item>
                <el-form-item label="订单状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="订单时间：" prop="orderTime">
                  {{ form.orderTime }}
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmTime">
                  {{ form.confirmTime }}
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="订单分类：" prop="orderCategory">
                  {{ form.orderCategory }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="批售方式：" prop="wholesaleWay">
                  {{ form.wholesaleWay }}
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="配车时间：" prop="allocateTime">
                  {{ form.allocateTime }}
                </el-form-item>
                <el-form-item label="配车VIN码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                  {{ form.replenishApplyCode }}
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="专项活动：" prop="prodScheduleActivityId">
                  {{ form.prodScheduleActivityId }}
                </el-form-item>
                <el-form-item label="允许锁零售单,1:是允许，0否不允许：" prop="allowLockRetail">
                  {{ form.allowLockRetail }}
                </el-form-item>
                <el-form-item label="零售价：" prop="retailPrice">
                  {{ form.retailPrice }}
                </el-form-item>
                <el-form-item label="开票类型：" prop="invoiceDiscountType">
                  {{ form.invoiceDiscountType }}
                </el-form-item>
                <el-form-item label="开票系数：" prop="invoiceCoefficient">
                  {{ form.invoiceCoefficient }}
                </el-form-item>
                <el-form-item label="批售价：" prop="wholesalePrice">
                  {{ form.wholesalePrice }}
                </el-form-item>
                <el-form-item label="返利使用类型：" prop="rebateUseType">
                  {{ form.rebateUseType }}
                </el-form-item>
                <el-form-item label="返利使用系数：" prop="rebateCoefficient">
                  {{ form.rebateCoefficient }}
                </el-form-item>
                <el-form-item label="使用返利金额：" prop="usedRebateAmount">
                  {{ form.usedRebateAmount }}
                </el-form-item>
                <el-form-item label="ERP销售订单号：" prop="erpSaleOrderCode">
                  {{ form.erpSaleOrderCode }}
                </el-form-item>
                <el-form-item label="ERP发票号：" prop="erpInvoiceCode">
                  {{ form.erpInvoiceCode }}
                </el-form-item>
                <el-form-item label="同步SAP状态：" prop="syncSapStatus">
                  {{ form.syncSapStatus }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  {{ form.dealerCompanyCode }}
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  {{ form.applyReason }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="内饰：" prop="interiorName">
                  {{ form.interiorName }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="外观：" prop="exteriorName">
                  {{ form.exteriorName }}
                </el-form-item>
                <el-form-item label="轮毂名称：" prop="wheelHubName">
                  {{ form.wheelHubName }}
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeName">
                  {{ form.yearTypeName }}
                </el-form-item>
                <el-form-item label="特殊备注：" prop="specialRemark">
                  {{ form.specialRemark }}
                </el-form-item>
                <el-form-item label="首次取消配车时间：" prop="firstCancelAllocateTime">
                  {{ form.firstCancelAllocateTime }}
                </el-form-item>
                <el-form-item label="首次配车时间：" prop="firstAllocateTime">
                  {{ form.firstAllocateTime }}
                </el-form-item>
                <el-form-item label="出库时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
                <el-form-item label="确认状态：" prop="confirmStatus">
                  {{ form.confirmStatus }}
                </el-form-item>
                <el-form-item label="是否已锁定,1是0否：" prop="lockStatus">
                  {{ form.lockStatus }}
                </el-form-item>
                <el-form-item label="锁定时间：" prop="lockTime">
                  {{ form.lockTime }}
                </el-form-item>
                <el-form-item label="是否创建发运单计划：" prop="createdShippingPlan">
                  {{ form.createdShippingPlan }}
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmUserName">
                  {{ form.confirmUserName }}
                </el-form-item>
                <el-form-item label="结算方式：" prop="settleWay">
                  {{ form.settleWay }}
                </el-form-item>
                <el-form-item label="配车方式：" prop="allocateWay">
                  {{ form.allocateWay }}
                </el-form-item>
                <el-form-item label="合作类型：" prop="cooperateType">
                  {{ form.cooperateType }}
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundType">
                  {{ form.settleFundType }}
                </el-form-item>
                <el-form-item label="融资金额&#x2F;赊账：" prop="creditSalesAmount">
                  {{ form.creditSalesAmount }}
                </el-form-item>
                <el-form-item label="急单备注：" prop="emergencyOrderRemark">
                  {{ form.emergencyOrderRemark }}
                </el-form-item>
                <el-form-item label="首付款比例%：" prop="downPaymentRatio">
                  {{ form.downPaymentRatio }}
                </el-form-item>
                <el-form-item label="指定发运方式：" prop="deliveryWay">
                  {{ form.deliveryWay }}
                </el-form-item>
                <el-form-item label="车辆交付状态：" prop="deliveryStatus">
                  {{ form.deliveryStatus }}
                </el-form-item>
                <el-form-item label="订单物料编码：" prop="orderMaterialCode">
                  {{ form.orderMaterialCode }}
                </el-form-item>
                <el-form-item label="是否需要自动配车,1:是；0：否：" prop="needAutoAllocateCar">
                  {{ form.needAutoAllocateCar }}
                </el-form-item>
                <el-form-item label="门店仓库编码：" prop="dealerWarehouseCode">
                  {{ form.dealerWarehouseCode }}
                </el-form-item>
                <el-form-item label="门店仓库名称：" prop="dealerWarehouseName">
                  {{ form.dealerWarehouseName }}
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
                <el-form-item label="电池电芯名称：" prop="batteryCellName">
                  {{ form.batteryCellName }}
                </el-form-item>
                <el-form-item label="是否存在结算失败：" prop="hasSettleFailed">
                  {{ yes_no_enum_map[form.hasSettleFailed] }}
                </el-form-item>
                <el-form-item label="市code：" prop="cityCode">
                  {{ form.cityCode }}
                </el-form-item>
                <el-form-item label="外观ID：" prop="exteriorId">
                  {{ form.exteriorId }}
                </el-form-item>
                <el-form-item label="批售目标额度占用记录ID：" prop="saleTargetTrackingId">
                  {{ form.saleTargetTrackingId }}
                </el-form-item>
                <el-form-item label="整车补货单明细号：" prop="replenishApplyDetailCode">
                  {{ form.replenishApplyDetailCode }}
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="销售公司：" prop="saleCompanyId">
                  {{ form.saleCompanyId }}
                </el-form-item>
                <el-form-item label="交付门店编码：" prop="deliveryDealerCode">
                  {{ form.deliveryDealerCode }}
                </el-form-item>
                <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="物料ID：" prop="materialsId">
                  {{ form.materialsId }}
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialsCode">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="结算时间：" prop="settleTime">
                  {{ form.settleTime }}
                </el-form-item>
                <el-form-item label="大区编码：" prop="regionCode">
                  {{ form.regionCode }}
                </el-form-item>
                <el-form-item label="省code：" prop="provinceCode">
                  {{ form.provinceCode }}
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="内饰ID：" prop="interiorId">
                  {{ form.interiorId }}
                </el-form-item>
                <el-form-item label="车型ID：" prop="modelId">
                  {{ form.modelId }}
                </el-form-item>
                <el-form-item label="轮毂ID：" prop="wheelHubId">
                  {{ form.wheelHubId }}
                </el-form-item>
                <el-form-item label="年款ID：" prop="yearTypeId">
                  {{ form.yearTypeId }}
                </el-form-item>
                <el-form-item label="首次结算失败时间：" prop="firstSettleFailedTime">
                  {{ form.firstSettleFailedTime }}
                </el-form-item>
                <el-form-item label="商城订单号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  {{ form.retailOrderCode }}
                </el-form-item>
                <el-form-item label="是否紧急订单：1是0否：" prop="emergencyOrder">
                  {{ form.emergencyOrder }}
                </el-form-item>
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="金融机构ID：" prop="financialOrganizationId">
                  {{ form.financialOrganizationId }}
                </el-form-item>
                <el-form-item label="金融机构名称：" prop="financialOrganizationName">
                  {{ form.financialOrganizationName }}
                </el-form-item>
                <el-form-item label="批售订单扩展ID：" prop="wholesaleOrderExtId">
                  {{ form.wholesaleOrderExtId }}
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmUserId">
                  {{ form.confirmUserId }}
                </el-form-item>
                <el-form-item label="取消配车说明：" prop="cancelAllocateRemark">
                  {{ form.cancelAllocateRemark }}
                </el-form-item>
                <el-form-item label="作废说明：" prop="cancelRemark">
                  {{ form.cancelRemark }}
                </el-form-item>
                <el-form-item label="使用现金金额：" prop="usedCashAmount">
                  {{ form.usedCashAmount }}
                </el-form-item>
                <el-form-item label="确认说明：" prop="confirmRemark">
                  {{ form.confirmRemark }}
                </el-form-item>
                <el-form-item label="未自动确认原因：" prop="noAutoConfirmReason">
                  {{ form.noAutoConfirmReason }}
                </el-form-item>
                <el-form-item label="车辆预计下线日期：" prop="expectedOfflineTime">
                  {{ form.expectedOfflineTime }}
                </el-form-item>
                <el-form-item label="是否赊销：" prop="creditSaleFlag">
                  {{ yes_no_enum_map[form.creditSaleFlag] }}
                </el-form-item>
                <el-form-item label="是否延期交付：" prop="deliveryDelayed">
                  {{ yes_no_enum_map[form.deliveryDelayed] }}
                </el-form-item>
                <el-form-item label="赊销是否还款：" prop="creditSaleRepaid">
                  {{ yes_no_enum_map[form.creditSaleRepaid] }}
                </el-form-item>
                <el-form-item label="合格证是否质押：" prop="certificatePledged">
                  {{ yes_no_enum_map[form.certificatePledged] }}
                </el-form-item>
                <el-form-item label="退车标识：" prop="vehicleReturnFlag">
                  {{ yes_no_enum_map[form.vehicleReturnFlag] }}
                </el-form-item>
                <el-form-item label="是否清账：" prop="clearedFlag">
                  {{ yes_no_enum_map[form.clearedFlag] }}
                </el-form-item>
                <el-form-item label="采购订单ID：" prop="purchaseOrderId">
                  {{ form.purchaseOrderId }}
                </el-form-item>
                <el-form-item label="批售订单ID：" prop="wholesaleOrderId">
                  {{ form.wholesaleOrderId }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>区块标题</h2>
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/wholesale/vehicleWholesaleOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

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
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
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
          { required: true, message: '请输入允许锁零售单,1:是允许，0否不允许', trigger: 'change' }
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
          { required: true, message: '请选择同步SAP状态', trigger: 'change' }
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
          { required: true, message: '请选择是否已锁定,1是0否', trigger: 'change' }
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
          { required: true, message: '请输入是否需要自动配车,1:是；0：否', trigger: 'change' }
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
