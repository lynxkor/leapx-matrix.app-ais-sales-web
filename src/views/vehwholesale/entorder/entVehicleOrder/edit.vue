<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="企业客户整车订单"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <span>{{ form.entOrderCode }}</span>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
              <el-form-item label="企业客户整车订单号：" prop="entOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.entOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="企业客户补货订单编号：" prop="entReplenishOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.entReplenishOrderCode"
                    clearable
                  />
                </el-form-item>

                <el-form-item label="第七大区CBU订单：" prop="cbuOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cbuOrderCode"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="销售公司：" prop="saleCompanyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleCompanyId"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="企业客户名称：" prop="entCustomerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.entCustomerName"
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
                <el-form-item label="订单分类：" prop="orderCategory">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderCategory"
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
                <el-form-item label="车辆属性：" prop="vehicleAttribute">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleAttribute"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="税务发票号：" prop="taxInvoiceCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.taxInvoiceCode"
                    clearable
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
                  />
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
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
                 <el-form-item label="设置急单时间：" prop="emergencyOrderTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.emergencyOrderTime"
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
                 <el-form-item label="订单物料ID，下单时物料ID：" prop="orderMaterialsId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderMaterialsId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下单物料描述：" prop="orderMaterialsDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderMaterialsDesc"
                    clearable
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
                  />
                </el-form-item>
                <el-form-item label="订单取消原因：" prop="orderMaterialsDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderMaterialsDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单备注：" prop="orderMaterialsDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderMaterialsDesc"
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
                  <el-form-item label="销售市场：" prop="salesMarket">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesMarket"
                    clearable
                  />
                </el-form-item>
                     <el-form-item label="验收方式：" prop="acceptanceMethod">
                  <el-input
                    placeholder="请输入"
                    v-model="form.acceptanceMethod"
                    clearable
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
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                 <el-form-item label="企业客户整车订单号：" prop="entOrderCode">
                  {{ form.entOrderCode }}
                </el-form-item>
                 <el-form-item label="企业客户补货订单编号：" prop="entReplenishOrderCode">
                  {{ form.entReplenishOrderCode }}
                </el-form-item>
                 <el-form-item label="CBU订单号，目前是第七大区CBU订单：" prop="cbuOrderCode">
                  {{ form.cbuOrderCode }}
                </el-form-item>
                 <el-form-item label="销售公司：" prop="saleCompanyId">
                  {{ form.saleCompanyId }}
                </el-form-item>
                 <el-form-item label="企业客户名称：" prop="entCustomerName">
                  {{ form.entCustomerName }}
                </el-form-item>
                 <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                 <el-form-item label="订单分类：" prop="orderCategory">
                  {{ form.orderCategory }}
                </el-form-item>
                 <el-form-item label="车辆属性：" prop="vehicleAttribute">
                  {{ form.vehicleAttribute }}
                </el-form-item>
                 <el-form-item label="税务发票号：" prop="taxInvoiceCode">
                  {{ form.taxInvoiceCode }}
                </el-form-item>
                 <el-form-item label="开票日期：" prop="invoiceTime">
                  {{ form.invoiceTime }}
                </el-form-item>
                <el-form-item label="数据来源" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                 <el-form-item label="订单时间：" prop="orderTime">
                  {{ form.orderTime }}
                </el-form-item>
                  <el-form-item label="订单状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="设置急单时间：" prop="emergencyOrderTime">
                  {{ form.emergencyOrderTime }}
                </el-form-item>
                <el-form-item label="急单备注：" prop="emergencyOrderRemark">
                  {{ form.emergencyOrderRemark }}
                </el-form-item>
                  <el-form-item label="订单物料ID，下单时物料ID：" prop="orderMaterialsId">
                  {{ form.orderMaterialsId }}
                </el-form-item>
                <el-form-item label="下单物料描述：" prop="orderMaterialsDesc">
                  {{ form.orderMaterialsDesc }}
                </el-form-item>
                 <el-form-item label="订单取消时间：" prop="cancelTime">
                  {{ form.cancelTime }}
                </el-form-item>
                 <el-form-item label="订单取消原因：" prop="cancelRemark">
                  {{ form.cancelRemark }}
                </el-form-item>
                <el-form-item label="订单取消备注：" prop="cancelRemark">
                  {{ form.cancelRemark }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="销售市场：" prop="salesMarket">
                  {{ form.salesMarket }}
                </el-form-item>
                <el-form-item label="验收方式：" prop="acceptanceMethod">
                  {{ form.acceptanceMethod }}
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                 <el-form-item label="配车VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="配车物料编码：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
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
                <el-form-item label="整车仓库：" prop="materialsCode">
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
                <el-form-item label="ERP销售订单号：" prop="erpSaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.erpSaleOrderCode"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="是否需要自动配车：" prop="needAutoAllocateCar">
                  <el-input
                    placeholder="请输入"
                    v-model="form.needAutoAllocateCar"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="配车状态：" prop="allocateStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.allocateStatus"
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
                <el-form-item label="金融机构：" prop="financialOrganizationId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.financialOrganizationId"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="合格证是否质押：" prop="certificatePledged">
                  <el-input
                    placeholder="请输入"
                    v-model="form.certificatePledged"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="结算状态：" prop="settleStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.settleStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                  <el-form-item label="标准价格：" prop="standardPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.standardPrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售价格：" prop="salesPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesPrice"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="关联交易不含税价：" prop="relatedTxnExTaxPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.relatedTxnExTaxPrice"
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
                 <el-form-item label="使用现金金额：" prop="usedCashAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.usedCashAmount"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="融资金额/赊销金额：" prop="creditSalesAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creditSalesAmount"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="是否还款：" prop="clearedFlag">
                  <el-input
                    placeholder="请输入"
                    v-model="form.clearedFlag"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否赊销：" prop="creditSaleFlag">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creditSaleFlag"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否创建发运计划：" prop="creditSaleFlag">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creditSaleFlag"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="是否存在结算失败记录：" prop="hasSettleFailed">
                  <el-input
                    placeholder="请输入"
                    v-model="form.hasSettleFailed"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="是否需要同步SAP：" prop="needAsyncSap">
                  <el-input
                    placeholder="请输入"
                    v-model="form.needAsyncSap"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单同步状态：" prop="orderSyncStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderSyncStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                 <el-form-item label="同步结果：" prop="needAsyncSap">
                  <el-input
                    placeholder="请输入"
                    v-model="form.needAsyncSap"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="退车标识：" prop="vehicleReturnFlag">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleReturnFlag"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="特殊车提报：" prop="specialRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.specialRemark"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="终端状态：" prop="terminalStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.terminalStatus"
                    placeholder="请选择"
                    clearable
                    filterable
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
                <el-form-item label="整车仓库：" prop="allocateTime">
                  {{ form.allocateTime }}
                </el-form-item>
                <el-form-item label="结算时间：" prop="settleTime">
                  {{ form.settleTime }}
                </el-form-item>
                 <el-form-item label="出库时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
                <el-form-item label="ERP销售订单号：" prop="erpSaleOrderCode">
                  {{ form.erpSaleOrderCode }}
                </el-form-item>
                 <el-form-item label="是否需要自动配车：" prop="needAutoAllocateCar">
                  {{ form.needAutoAllocateCar }}
                </el-form-item>
                <el-form-item label="配车状态：" prop="allocateStatus">
                  {{ form.allocateStatus }}
                </el-form-item>
                 <el-form-item label="结算资金类型：" prop="settleFundType">
                  {{ form.settleFundType }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationId">
                  {{ form.financialOrganizationId }}
                </el-form-item>
                <el-form-item label="合格证是否质押：" prop="certificatePledged">
                  {{ form.certificatePledged }}
                </el-form-item>
                 <el-form-item label="结算状态：" prop="settleStatus">
                  {{ form.settleStatus }}
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
                 <el-form-item label="是否还款：" prop="clearedFlag">
                  {{ form.clearedFlag }}
                </el-form-item>
                <el-form-item label="是否赊销，1是，0否：" prop="creditSaleFlag">
                  {{ form.creditSaleFlag }}
                </el-form-item>
                 <el-form-item label="是否创建发运计划：" prop="creditSaleFlag">
                  {{ form.creditSaleFlag }}
                </el-form-item>
                 <el-form-item label="是否存在结算失败记录：" prop="hasSettleFailed">
                  {{ form.hasSettleFailed }}
                </el-form-item>
                 <el-form-item label="是否需要同步SAP：" prop="needAsyncSap">
                  {{ form.needAsyncSap }}
                </el-form-item>
                <el-form-item label="同步状态：" prop="orderSyncStatus">
                  {{ form.orderSyncStatus }}
                </el-form-item>
                <el-form-item label="同步结果：" prop="needAsyncSap">
                  {{ form.needAsyncSap }}
                </el-form-item>
                <el-form-item label="退车标识：" prop="needAsyncSap">
                  {{ form.needAsyncSap }}
                </el-form-item>
                  <el-form-item label="特殊车提报：" prop="specialRemark">
                  {{ form.specialRemark }}
                </el-form-item>
                 <el-form-item label="终端状态：" prop="terminalStatus">
                  {{ form.terminalStatus }}
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="接车联系人：" prop="pickupContactName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pickupContactName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="接车联系电话：" prop="pickupContactMobile">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pickupContactMobile"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="省：" prop="provinceName">
                   <fetch-select
                      filterable
                      clearable
                      remote
                      v-model="form.provinceName"
                      :remote-method="getProvince"
                      value-key="code"
                      label-key="name"
                    />
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="区县名称：" prop="districtName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.districtName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交车地址：" prop="address">
                  <el-input
                    placeholder="请输入"
                    v-model="form.address"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="经度：" prop="longitude">
                  <el-input
                    placeholder="请输入"
                    v-model="form.longitude"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维度：" prop="latitude">
                  <el-input
                    placeholder="请输入"
                    v-model="form.latitude"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">

                <el-form-item label="接车联系人：" prop="pickupContactName">
                  {{ form.pickupContactName }}
                </el-form-item>
                <el-form-item label="接车联系电话：" prop="pickupContactMobile">
                  {{ form.pickupContactMobile }}
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                 <el-form-item label="区县名称：" prop="districtName">
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
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>子表标题</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryListData"
                    remote
                    placeholder="请选择"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleAddTableData"
                  />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="name" title="名称" min-width="30%" />
                  <vxe-column field="age" title="年龄" min-width="30%" />
                  <vxe-column field="email" title="邮箱" min-width="30%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
                  </template>
                </vxe-table>
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/entorder/entVehicleOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

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
    FetchSelect
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
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '整车销售-企业客户订单-企业客户整车订单管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVW-entVehicleOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
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
        status: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源', trigger: 'change' }
        ],
        entOrderCode: [
          { required: true, message: '请输入企业客户整车订单号', trigger: 'change' }
        ],
        entCustomerCode: [
          { required: true, message: '请输入企业客户编码', trigger: 'change' }
        ],
        entCustomerName: [
          { required: true, message: '请输入企业客户名称', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        saleCompanyId: [
          { required: true, message: '请输入销售公司', trigger: 'change' }
        ],
        orderCategory: [
          { required: true, message: '请输入订单分类', trigger: 'change' }
        ],
        needAutoAllocateCar: [
          { required: true, message: '请输入是否需要自动配车', trigger: 'change' }
        ],
        needAsyncSap: [
          { required: true, message: '请输入是否需要同步SAP', trigger: 'change' }
        ],
        entReplenishOrderCode: [
          { required: true, message: '请输入企业客户补货订单编号', trigger: 'change' }
        ],
        entReplenishOrderDetailId: [
          { required: true, message: '请输入企业客户补货订单明细ID', trigger: 'change' }
        ],
        taxInvoiceCode: [
          { required: true, message: '请输入税务发票号', trigger: 'change' }
        ],
        invoiceTime: [
          { required: true, message: '请选择开票日期', trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: '请输入省code', trigger: 'change' }
        ],
        provinceName: [
          { required: true, message: '请输入省', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请输入市code', trigger: 'change' }
        ],
        cityName: [
          { required: true, message: '请输入市', trigger: 'change' }
        ],
        districtCode: [
          { required: true, message: '请输入区&#x2F;县编码', trigger: 'change' }
        ],
        districtName: [
          { required: true, message: '请输入区&#x2F;县名称', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入交车地址', trigger: 'change' }
        ],
        fullAddress: [
          { required: true, message: '请输入省市区+详细地址', trigger: 'change' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'change' }
        ],
        latitude: [
          { required: true, message: '请输入维度', trigger: 'change' }
        ],
        pickupContactName: [
          { required: true, message: '请输入接车联系人', trigger: 'change' }
        ],
        pickupContactMobile: [
          { required: true, message: '请输入接车联系电话', trigger: 'change' }
        ],
        orderSyncStatus: [
          { required: true, message: '请选择订单同步状态', trigger: 'change' }
        ],
        terminalStatus: [
          { required: true, message: '请选择终端状态', trigger: 'change' }
        ],
        allocateStatus: [
          { required: true, message: '请选择配车状态', trigger: 'change' }
        ],
        settleStatus: [
          { required: true, message: '请选择结算状态', trigger: 'change' }
        ],
        settleFundType: [
          { required: true, message: '请选择结算资金类型', trigger: 'change' }
        ],
        financialOrganizationId: [
          { required: true, message: '请输入金融机构', trigger: 'change' }
        ],
        acceptanceMethod: [
          { required: true, message: '请输入验收方式', trigger: 'change' }
        ],
        salesMarket: [
          { required: true, message: '请输入销售市场', trigger: 'change' }
        ],
        creditSaleFlag: [
          { required: true, message: '请输入是否赊销，1是，0否', trigger: 'change' }
        ],
        vehicleAttribute: [
          { required: true, message: '请输入车辆属性', trigger: 'change' }
        ],
        orderTime: [
          { required: true, message: '请选择订单时间', trigger: 'change' }
        ],
        allocateTime: [
          { required: true, message: '请选择配车时间', trigger: 'change' }
        ],
        outboundTime: [
          { required: true, message: '请选择出库时间', trigger: 'change' }
        ],
        settleTime: [
          { required: true, message: '请选择结算时间', trigger: 'change' }
        ],
        orderMaterialsCode: [
          { required: true, message: '请输入订单物料编码', trigger: 'change' }
        ],
        orderMaterialsId: [
          { required: true, message: '请输入订单物料ID，下单时物料ID', trigger: 'change' }
        ],
        orderMaterialsDesc: [
          { required: true, message: '请输入下单物料描述', trigger: 'change' }
        ],
        materialsId: [
          { required: true, message: '请输入配车物料ID', trigger: 'change' }
        ],
        materialsCode: [
          { required: true, message: '请输入配车物料编码', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入配车VIN码', trigger: 'change' }
        ],
        standardPrice: [
          { required: true, message: '请输入标准价格', trigger: 'change' }
        ],
        salesPrice: [
          { required: true, message: '请输入销售价格', trigger: 'change' }
        ],
        relatedTxnExTaxPrice: [
          { required: true, message: '请输入关联交易不含税价', trigger: 'change' }
        ],
        relatedTxnPriceRate: [
          { required: true, message: '请输入关联交易价格比例', trigger: 'change' }
        ],
        cbuOrderCode: [
          { required: true, message: '请输入CBU订单号，目前是第七大区CBU订单', trigger: 'change' }
        ],
        emergencyOrderTime: [
          { required: true, message: '请选择设置急单时间', trigger: 'change' }
        ],
        emergencyOrderRemark: [
          { required: true, message: '请输入急单备注', trigger: 'change' }
        ],
        specialRemark: [
          { required: true, message: '请输入特殊车提报', trigger: 'change' }
        ],
        creditSalesAmount: [
          { required: true, message: '请输入融资金额&#x2F;赊销金额', trigger: 'change' }
        ],
        usedCashAmount: [
          { required: true, message: '请输入使用现金金额', trigger: 'change' }
        ],
        erpSaleOrderCode: [
          { required: true, message: '请输入ERP销售订单号', trigger: 'change' }
        ],
        erpInvoiceCode: [
          { required: true, message: '请输入ERP发票号', trigger: 'change' }
        ],
        sapSerialCode: [
          { required: true, message: '请输入SAP流水号，来自采购订单', trigger: 'change' }
        ],
        hasSettleFailed: [
          { required: true, message: '请输入是否存在结算失败记录', trigger: 'change' }
        ],
        certificatePledged: [
          { required: true, message: '请输入合格证是否质押', trigger: 'change' }
        ],
        vehicleReturnFlag: [
          { required: true, message: '请输入退车标识', trigger: 'change' }
        ],
        clearedFlag: [
          { required: true, message: '请输入是否还款', trigger: 'change' }
        ],
        purchaseOrderCode: [
          { required: true, message: '请输入整车采购订单编码', trigger: 'change' }
        ],
        downPaymentRatio: [
          { required: true, message: '请输入首付款比例%', trigger: 'change' }
        ],
        cancelTime: [
          { required: true, message: '请选择订单取消时间', trigger: 'change' }
        ],
        cancelRemark: [
          { required: true, message: '请选择订单取消备注', trigger: 'change' }
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
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
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
