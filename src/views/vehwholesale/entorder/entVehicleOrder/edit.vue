<template>
  <div>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="企业客户整车订单:"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="form.status === 3 || form.status === 50"
      >
        <template #status>
          <span>{{ form.entOrderCode }}</span>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <el-button  size="small" @click="handlequerySAPAccountBalance" >查询整车账户余额</el-button>
          <el-button  size="small" @click="handlevinAllocateVehicle" >配车</el-button>
          <el-button  size="small" @click="handlebatchCancelAllocateSubmit" >取消配车</el-button>
          <el-button  size="small" @click="handlebatchSettleSubmit" >提交结算</el-button>
          <el-button  size="small" @click="handlebatchCancelSettleSubmit" >取消结算</el-button>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form"  ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
              <el-form-item label="企业客户整车订单号：" prop="entOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.entOrderCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="企业客户补货订单编号：" prop="entReplenishOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.entReplenishOrderCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售公司：" prop="saleCompanyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleCompanyName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="第七大区CBU订单：" prop="cbuOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cbuOrderCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                  <el-form-item label="企业客户名称：" prop="entCustomerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.entCustomerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="销售门店名称：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="订单分类：" prop="orderCategory">
                   <el-input
                    placeholder="请输入"
                    v-model="form.orderCategoryLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="车辆属性：" prop="vehicleAttribute">
                   <fetch-select
                        :request="fetchOptions"
                        enumCode="vw_vehicle_attribute"
                        v-model="form.vehicleAttribute"
                        placeholder="请选择"
                        clearable
                        filterable
                      />
                </el-form-item>
                <el-form-item label="税务发票号：" prop="taxInvoiceCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.taxInvoiceCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="开票日期：" prop="invoiceTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.invoiceTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSourceLabel"
                    clearable
                    disabled
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
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="订单状态：" prop="status">
                   <el-input
                    placeholder="请输入"
                    v-model="form.statusLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="是否急单：" prop="emergencyOrder">
                   <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.emergencyOrder"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                </el-form-item>
                 <el-form-item label="设置急单时间：" prop="emergencyOrderTime">
                  <el-date-picker
                    type="datetime"
                    v-model="form.emergencyOrderTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    :disabled="form.emergencyOrder !== '1' && form.emergencyOrder !== 1"
                  />
                </el-form-item>
                  <el-form-item label="急单备注：" prop="emergencyOrderRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.emergencyOrderRemark"
                    clearable
                    maxlength="150"
                  />
                </el-form-item>
                 <el-form-item label="下单物料码：" prop="orderMaterialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderMaterialsCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="物料描述：" prop="orderMaterialsDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderMaterialsDesc"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="订单取消时间：" prop="cancelTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.cancelTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="订单取消原因：" prop="cancelRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelRemark"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="订单备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="创建人：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                    disabled
                  />
                </el-form-item>
                  <el-form-item label="销售市场：" prop="salesMarketLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesMarketLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                     <el-form-item label="验收方式：" prop="acceptanceMethodLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.acceptanceMethodLabel"
                    clearable
                    disabled
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
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                 <el-form-item label="企业客户整车订单号：" prop="entOrderCode">
                  {{ form.entOrderCode }}
                </el-form-item>
                 <el-form-item label="企业客户补货订单编号：" prop="entReplenishOrderCode">
                  {{ form.entReplenishOrderCode }}
                </el-form-item>
                 <el-form-item label="第七大区CBU订单号：" prop="cbuOrderCode">
                  {{ form.cbuOrderCode }}
                </el-form-item>
                 <el-form-item label="销售公司：" prop="saleCompanyName">
                  {{ form.saleCompanyName }}
                </el-form-item>
                 <el-form-item label="企业客户名称：" prop="entCustomerName">
                  {{ form.entCustomerName }}
                </el-form-item>
                 <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                 <el-form-item label="订单分类：" prop="orderCategoryLabel">
                  {{ form.orderCategoryLabel }}
                </el-form-item>
                 <el-form-item label="车辆属性：" prop="vehicleAttributeLabel">
                  {{ form.vehicleAttributeLabel }}
                </el-form-item>
                 <el-form-item label="税务发票号：" prop="taxInvoiceCode">
                  {{ form.taxInvoiceCode }}
                </el-form-item>
                 <el-form-item label="开票日期：" prop="invoiceTime">
                  {{ form.invoiceTime }}
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSourceLabel">
                  {{ form.dataSourceLabel }}
                </el-form-item>
                 <el-form-item label="订单时间：" prop="orderTime">
                  {{ form.orderTime }}
                </el-form-item>
                  <el-form-item label="订单状态：" prop="statusLabel">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="是否急单：" prop="emergencyOrderLabel">
                  {{ form.emergencyOrderLabel }}
                </el-form-item>
                <el-form-item label="设置急单时间：" prop="emergencyOrderTime">
                  {{ form.emergencyOrderTime }}
                </el-form-item>
                <el-form-item label="急单备注：" prop="emergencyOrderRemark">
                  {{ form.emergencyOrderRemark }}
                </el-form-item>
                  <el-form-item label="下单物料码：" prop="orderMaterialsCode">
                  {{ form.orderMaterialsCode }}
                </el-form-item>
                <el-form-item label="物料描述：" prop="orderMaterialsDesc">
                  {{ form.orderMaterialsDesc }}
                </el-form-item>
                 <el-form-item label="订单取消时间：" prop="cancelTime">
                  {{ form.cancelTime }}
                </el-form-item>
                 <el-form-item label="订单取消原因：" prop="cancelRemark">
                  {{ form.cancelRemark }}
                </el-form-item>
                <el-form-item label="订单备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="销售市场：" prop="salesMarketLabel">
                  {{ form.salesMarketLabel }}
                </el-form-item>
                <el-form-item label="验收方式：" prop="acceptanceMethodLabel">
                  {{ form.acceptanceMethodLabel }}
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
              <el-form :inline="true" :model="form" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                 <el-form-item label="配车VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="配车物料编码：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
                    clearable
                    disabled
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
                    disabled
                  />
                </el-form-item>
                <el-form-item label="整车仓库：" prop="warehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.warehouseName"
                    clearable
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
                  />
                </el-form-item>
                <el-form-item label="ERP销售订单号：" prop="erpSaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.erpSaleOrderCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="是否需要自动配车：" prop="needAutoAllocateCar">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.needAutoAllocateCar"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                 <el-form-item label="配车状态：" prop="allocateStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_ent_vehicle_order_allocate_status"
                    v-model="form.allocateStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundTypeLabel">
                   <fetch-select
                   :options="settleFundTypeOptions"
                    v-model="form.settleFundTypeLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                    labelKey="message"
                    valueKey="message"
                    @change="clearCache"
                  />
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationId">
                  <fetch-select
                    :remote-method="repairItemSearch"
                    remote
                    reserve-keyword
                    labelKey="organizationName"
                    valueKey="id"
                    v-model="form.financialOrganizationId"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="form.settleFundType !== '2010' && form.settleFundType !== 2010"
                  />
                </el-form-item>
                 <el-form-item label="合格证是否质押：" prop="certificatePledged">
                   <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.certificatePledged"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="结算状态：" prop="settleStatus">
                 <el-input
                    placeholder="请输入"
                    v-model="form.settleStatusLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                  <el-form-item label="标准价格：" prop="standardPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.standardPrice"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售价格：" prop="salesPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesPrice"
                    clearable
                    disabled
                  />
                </el-form-item>
                  <el-form-item label="关联交易不含税价：" prop="relatedTxnExTaxPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.relatedTxnExTaxPrice"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="首付款比例%：" prop="downPaymentRatio">
                  <el-input
                    placeholder="请输入"
                    v-model="form.downPaymentRatio"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="使用现金金额：" prop="usedCashAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.usedCashAmount"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="融资金额/赊销金额：" prop="creditSalesAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creditSalesAmount"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="是否还款：" prop="clearedFlag">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.clearedFlag"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="是否赊销：" prop="creditSaleFlag">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.creditSaleFlag"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="是否创建发运计划：" prop="createdShippingPlanLabel">
                 <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.createdShippingPlanLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="是否存在结算失败记录：" prop="hasSettleFailed">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.hasSettleFailed"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="是否需要同步SAP：" prop="needAsyncSap">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.needAsyncSap"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="同步状态：" prop="orderSyncStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_ent_vehicle_order_sync_status"
                    v-model="form.orderSyncStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                  <el-form-item label="退车标识：" prop="vehicleReturnFlag">
                   <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.vehicleReturnFlag"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="特殊车提报：" prop="specialRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.specialRemark"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="终端状态：" prop="terminalStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_special_vehicle_benefit_status"
                    v-model="form.terminalStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">

                <el-form-item label="配车VIN码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                 <el-form-item label="配车物料编码：" prop="materialsCode">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="配车时间：" prop="allocateTime">
                  {{ form.allocateTime }}
                </el-form-item>
                <el-form-item label="整车仓库：" prop="warehouseName">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="结算时间：" prop="settleTime">
                  {{ form.settleTime }}
                </el-form-item>
                <el-form-item label="首次结算失败时间：" prop="firstSettleFailedTime">
                  {{ form.firstSettleFailedTime }}
                </el-form-item>
                 <el-form-item label="出库时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
                <el-form-item label="ERP销售订单号：" prop="erpSaleOrderCode">
                  {{ form.erpSaleOrderCode }}
                </el-form-item>
                 <el-form-item label="是否需要自动配车：" prop="needAutoAllocateCarLabel">
                  {{ form.needAutoAllocateCarLabel }}
                </el-form-item>
                <el-form-item label="配车状态：" prop="allocateStatusLabel">
                  {{ form.allocateStatusLabel }}
                </el-form-item>
                 <el-form-item label="结算资金类型：" prop="settleFundTypeLabel">
                  {{ form.settleFundTypeLabel }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationName">
                  {{ form.financialOrganizationName }}
                </el-form-item>
                <el-form-item label="合格证是否质押：" prop="certificatePledgedLabel">
                  {{ form.certificatePledgedLabel }}
                </el-form-item>
                 <el-form-item label="结算状态：" prop="settleStatusLabel">
                  {{ form.settleStatusLabel }}
                </el-form-item>
                <el-form-item label="标准价格：" prop="standardPrice">
                  {{ form.standardPrice }}
                </el-form-item>
                <el-form-item label="销售价格：" prop="salesPrice">
                  {{ form.salesPrice }}
                </el-form-item>
                <el-form-item label="关联交易不含税价：" prop="relatedTxnExTaxPrice">
                  {{ form.relatedTxnExTaxPrice }}
                </el-form-item>
                <el-form-item label="首付款比例%：" prop="downPaymentRatio">
                  {{ form.downPaymentRatio }}
                </el-form-item>
                <el-form-item label="使用现金金额：" prop="usedCashAmount">
                  {{ form.usedCashAmount }}
                </el-form-item>
                 <el-form-item label="融资金额/赊销金额：" prop="creditSalesAmount">
                  {{ form.creditSalesAmount }}
                </el-form-item>
                 <el-form-item label="是否还款：" prop="clearedFlagLabel">
                  {{ form.clearedFlagLabel }}
                </el-form-item>
                <el-form-item label="是否赊销：" prop="creditSaleFlagLabel">
                  {{ form.creditSaleFlagLabel }}
                </el-form-item>
                 <el-form-item label="是否创建发运计划：" prop="createdShippingPlanLabel">
                  {{ form.createdShippingPlanLabel }}
                </el-form-item>
                 <el-form-item label="是否存在结算失败记录：" prop="hasSettleFailedLabel">
                  {{ form.hasSettleFailedLabel }}
                </el-form-item>
                 <el-form-item label="是否需要同步SAP：" prop="needAsyncSapLabel">
                  {{ form.needAsyncSapLabel }}
                </el-form-item>
                <el-form-item label="同步状态：" prop="orderSyncStatusLabel">
                  {{ form.orderSyncStatusLabel }}
                </el-form-item>
                <el-form-item label="同步信息：" prop="syncSapMsg">
                  {{ form.syncSapMsg }}
                </el-form-item>
                <el-form-item label="退车标识：" prop="vehicleReturnFlagLabel">
                  {{ form.vehicleReturnFlagLabel }}
                </el-form-item>
                  <el-form-item label="特殊车提报：" prop="specialRemark">
                  {{ form.specialRemark }}
                </el-form-item>
                 <el-form-item label="终端状态：" prop="terminalStatusLabel">
                  {{ form.terminalStatusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>接车地址信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form"  ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="接车联系人：" prop="pickupContactName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pickupContactName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="接车人电话：" prop="pickupContactMobile">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pickupContactMobile"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="省：" prop="provinceName">
                   <fetch-select
                      filterable
                      clearable
                      remote
                      v-model="form.provinceName"
                      value-key="code"
                      label-key="name"
                      disabled
                    />
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="区/县：" prop="districtName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.districtName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="交车地址：" prop="address">
                  <el-input
                    placeholder="请输入"
                    v-model="form.address"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="经度：" prop="longitude">
                  <el-input
                    placeholder="请输入"
                    v-model="form.longitude"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="维度：" prop="latitude">
                  <el-input
                    placeholder="请输入"
                    v-model="form.latitude"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">

                <el-form-item label="接车联系人：" prop="pickupContactName">
                  {{ form.pickupContactName }}
                </el-form-item>
                <el-form-item label="接车人电话：" prop="pickupContactMobile">
                  {{ form.pickupContactMobile }}
                </el-form-item>
                <el-form-item label="省份：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="城市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                 <el-form-item label="区/县：" prop="districtName">
                  {{ form.districtName }}
                </el-form-item>
                  <el-form-item label="交车地址：" prop="address">
                  {{ form.address }}
                </el-form-item>
                 <el-form-item label="经度：" prop="longitude">
                  {{ form.longitude }}
                </el-form-item>
                <el-form-item label="维度：" prop="latitude">
                  {{ form.latitude }}
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

  <vinAllocateVehicle :visible.sync="showvinAllocateVehicleDialog" ref="vinAllocateVehicleDialog" :id="_id"
      @confirm="vinConfirm"
      >
    </vinAllocateVehicle>
     <component-table
        :tableDataExternal="accountData"
        :columns="detailsColumns"
        :visible.sync="showComponentTabelDialog"
      />
  </div>
</template>

<script>
import { getDetail, addOrUpdate, batchCancelSettleSubmit, batchSettleSubmit, batchCancelAllocateSubmit, vinAllocateVehicleItem, querySAPAccountBalance } from '@/api/vehwholesale/entorder/entVehicleOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import vinAllocateVehicle from './vinAllocateVehicle.vue';
import ComponentTable from './ComponentTable.vue';
import { getList as fundGetList } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import { getList as accountList } from '@/api/vehwholesale/fund/account/index';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  entOrderCode: '',
  entCustomerCode: '',
  entCustomerName: '',
  saleDealerCode: '',
  saleDealerName: '',
  saleCompanyId: '',
  orderCategory: '',
  needAutoAllocateCar: '',
  needAsyncSap: '',
  entReplenishOrderCode: '',
  entReplenishOrderDetailId: '',
  taxInvoiceCode: '',
  invoiceTime: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  address: '',
  fullAddress: '',
  longitude: '',
  latitude: '',
  pickupContactName: '',
  pickupContactMobile: '',
  orderSyncStatus: '',
  terminalStatus: '',
  allocateStatus: '',
  settleStatus: '',
  settleFundType: '',
  financialOrganizationId: '',
  acceptanceMethod: '',
  salesMarket: '',
  creditSaleFlag: '',
  vehicleAttribute: '',
  orderTime: '',
  allocateTime: '',
  outboundTime: '',
  settleTime: '',
  orderMaterialsCode: '',
  orderMaterialsId: '',
  orderMaterialsDesc: '',
  materialsId: '',
  materialsCode: '',
  vin: '',
  standardPrice: '',
  salesPrice: '',
  relatedTxnExTaxPrice: '',
  relatedTxnPriceRate: '',
  cbuOrderCode: '',
  emergencyOrderTime: '',
  emergencyOrderRemark: '',
  specialRemark: '',
  creditSalesAmount: '',
  usedCashAmount: '',
  erpSaleOrderCode: '',
  erpInvoiceCode: '',
  sapSerialCode: '',
  hasSettleFailed: '',
  certificatePledged: '',
  vehicleReturnFlag: '',
  clearedFlag: '',
  purchaseOrderCode: '',
  downPaymentRatio: '',
  cancelTime: '',
  cancelRemark: '',
};

export default {
  name: 'entVehicleOrderEdit',
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
    vinAllocateVehicle,
    ComponentTable
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '主键：' + this.form.id;
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
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '企业客户整车订单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVW-entVehicleOrder',
      loading: false,
      submitLoading: false,
      showvinAllocateVehicleDialog: false,
      showComponentTabelDialog: false,
      yes_no_enum: YES_NO_ENUM,
      orderCategoryOptions: [],
      settleFundTypeOptions: [],
      accountData: [],
      form: { ...form },
      originalForm: { ...form },
      detailsColumns: [
        { field: 'dealerCompanyName', title: '销售公司' },
        { field: 'gtext', title: '资金类型' },
        { field: 'availableBalance', title: '可用余额' },
        { field: 'creditAmount', title: '赊销金额' },
        { field: 'chargeAmount', title: '充值金额' },
        { field: 'frozenAmount', title: '占用余额' },
      ],
    };
  },
  mounted () {
    // this.fetchSettleFundTypeOptions();
  },
  methods: {
    clearCache (val, row) {
      this.form.settleFundType = row.code;
      this.form.settleFundTypeLabel = row.message;
      this.form.financialOrganizationId = '';
      this.form.financialOrganizationName = '';
    },
    getFundAccount () {
      this.settleFundTypeOptions = [];
      if (!this.form.entCustomerName || !this.form.saleCompanyName) {
        return;
      }
      const params = {
        dealerCompanyNames: [this.form.entCustomerName],
        allowEntOrderSettle: '1',
        saleCompanyNames: [this.form.saleCompanyName]
      };
      accountList(params).then((res) => {
        if (res && res.records) {
          // 【新增】使用 Map 进行去重，key 为 fundType
          const uniqueMap = new Map();
          res.records.forEach(item => {
            // 只有当 Map 中不存在该 fundType 时才添加，确保保留第一条记录
            if (!uniqueMap.has(item.fundType)) {
              uniqueMap.set(item.fundType, {
                code: item.fundType,
                message: item.fundTypeLabel
              });
            }
          });
          // 将 Map 的值转换为数组并赋值
          this.settleFundTypeOptions = Array.from(uniqueMap.values());
        }
      }).catch(() => {
      });
    },
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
    async fetchOrderCategoryOptions () {
      const response = await getEnum('vw_order_category');
      // 过滤出 code 为 0、2、20 的数据，且确保 code 是字符串类型
      // 0 商品车订单
      // 2 试驾车订单
      // 20 展车订单
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
    async repairItemSearch (query) {
      return fundGetList({ organizationNameLike: query, status: 1 });
    },
    handlequerySAPAccountBalance () {
      const params = {
        id: this._id,
      };
      querySAPAccountBalance(params).then((res) => {
        this.accountData = res;
        this.showComponentTabelDialog = true;
      });
    },
    vinConfirm (data) {
      const params = {
        entOrderId: this._id,
        vin: data,
      };
      vinAllocateVehicleItem(params).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.$refs.containerRef.loadDetail();
        this.showvinAllocateVehicleDialog = false;
      });
    },
    handlebatchCancelAllocateSubmit () {
      const ids = [this._id];
      this.$confirm('此操作将取消配车, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchCancelAllocateSubmit({
          idSet: ids
        }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.$refs.containerRef.loadDetail();
        });
      }).catch(() => {});
    },
    handlebatchCancelSettleSubmit () {
      this.$confirm('此操作将取消结算, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchCancelSettleSubmit({
          idSet: [this._id],
        }).then(() => {
          this.$message.success('提交成功');
          this.$refs.containerRef.loadDetail();
        });
      }).catch(() => {});
    },
    handlebatchSettleSubmit () {
      this.$confirm('此操作提交结算, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchSettleSubmit({
          idSet: [this._id],
        }).then(() => {
          this.$message.success('提交成功');
          this.$refs.containerRef.loadDetail();
        });
      }).catch(() => {});
    },
    handleCheckConfirm () {},
    handlevinAllocateVehicle () {
      this.$refs.vinAllocateVehicleDialog.getData();
      this.showvinAllocateVehicleDialog = true;
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          // 1. 更新表单数据
          this.form = { ...this.form, ...res };
          // 2. 如果有原始表单引用，也同步更新
          // if (this.$refs.containerRef) {
          //   this.$refs.containerRef.originalForm = { ...res };
          // }

          // 3. 【新增】数据加载完成后，再执行获取资金账户逻辑
          this.getFundAccount();

          return res;
        });
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      // const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
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
