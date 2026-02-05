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
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
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
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否预售订单 1-是;0-否：" prop="preSaleOrder">
                  <el-input
                    placeholder="请输入"
                    v-model="form.preSaleOrder"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="购车人姓名：" prop="carBuyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carBuyerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="购车人手机号：" prop="carBuyerPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carBuyerPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="证件号码：" prop="idCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.idCardNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售顾问名称：" prop="saleUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="配车VIN码：" prop="matchVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.matchVin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零售订单状态标签：" prop="orderStatusLabel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderStatusLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否锁单 1-是;0-否：" prop="lockStatusLabel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.lockStatusLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="锁单时间：" prop="lockTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.lockTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="是否绑定批售 1-是;0-否：" prop="wholesaleBindStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.wholesaleBindStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="补贴后价格：" prop="priceAfterSubsidy">
                  <el-input
                    placeholder="请输入"
                    v-model="form.priceAfterSubsidy"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="定金金额：" prop="depositAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.depositAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="代办人姓名：" prop="agentName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.agentName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合作类型 0：直营店、2：合作伙伴：" prop="cooperationTypeLabel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.cooperationTypeLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店-省：" prop="provinceName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店-市：" prop="cityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店-大区：" prop="regionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店-母公司名称：" prop="dealerCompanyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyName"
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
                <el-form-item label="物料编码：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
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
                <el-form-item label="物料描述：" prop="materialsDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="选配动力：" prop="rangePowerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rangePowerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="续航里程：" prop="drivingRangeName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.drivingRangeName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="外观名称：" prop="exteriorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.exteriorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="内饰名称：" prop="interiorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.interiorName"
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
                <el-form-item label="选装包名称：" prop="optionPackageName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.optionPackageName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="锁车类型 0-自动锁车;1-手动锁车：" prop="lockCarTypeLabel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.lockCarTypeLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="外部订单号：" prop="outTradeNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.outTradeNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="商城下单时间：" prop="orderTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.orderTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="缴定金时间：" prop="paymentTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.paymentTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="权益享受日期：" prop="rightsEnjoyDate">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.rightsEnjoyDate"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="批售订单状态：" prop="wholesaleOrderStatusLabel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.wholesaleOrderStatusLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="解绑次数：" prop="unlockCount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.unlockCount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="改配次数：" prop="changeConfigCount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.changeConfigCount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="批售确认次数：" prop="confirmedCount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.confirmedCount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付周期上限：" prop="deliveryCycleMaxWeek">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryCycleMaxWeek"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="初始交付周期说明：" prop="initialDeliveryCycleDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.initialDeliveryCycleDesc"
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
                <el-form-item label="订单排序时间：" prop="orderSortTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.orderSortTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="交车时间：" prop="deliveryTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.deliveryTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="下单人ID：" prop="orderUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderUserId"
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
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
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
                <el-form-item label="是否预售订单 1-是;0-否：" prop="preSaleOrderLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.preSaleOrderLabel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="证件类型：身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20：" prop="idCardType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.idCardType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="证件类型标签：" prop="idCardTypeLabel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.idCardTypeLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="销售顾问ID：" prop="saleUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零售订单状态 3-订单确认;5-生产中;30-待门店向工厂付款;40-车辆发运准备中;6-车辆在途;7-等待交车;9-交车完成;10-退订中;15-退款中;99-作废：" prop="orderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否锁单 1-是;0-否：" prop="lockStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.lockStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否绑定批售 1-是;0-否：" prop="wholesaleBindStatusLabel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.wholesaleBindStatusLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="补贴金额：" prop="subsidyAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.subsidyAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车指导价（补贴后价格）：" prop="guidePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.guidePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="代办人电话：" prop="agentPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.agentPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合作类型 0：直营店、2：合作伙伴：" prop="cooperationType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.cooperationType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="销售门店组织ID：" prop="saleOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店编码（组织code同网发门店编码）：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店-大区组织编码：" prop="regionCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店-省组织编码：" prop="provinceCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店-市组织编码：" prop="cityCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店-母公司编码：" prop="dealerCompanyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付门店组织ID：" prop="deliveryOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryOrgId"
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
                <el-form-item label="物料ID：" prop="materialsId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车系ID：" prop="seriesId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车系名称：" prop="seriesName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesName"
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
                <el-form-item label="续航里程ID：" prop="drivingRangeId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.drivingRangeId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="选配动力ID：" prop="rangePowerId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rangePowerId"
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
                <el-form-item label="内饰ID：" prop="interiorId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.interiorId"
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
                <el-form-item label="车顶ID：" prop="roofId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.roofId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车顶名称：" prop="roofName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.roofName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="选装包ID：" prop="optionPackageId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.optionPackageId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="锁车匹配类型 10-VIN码;11-店头库;12-在途车辆;13-VDC库;15-待冲销PO;16-已结算批售;17-已配车未结算批售;18-未配车批售;101-未确认批售;：" prop="lockType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.lockType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="锁车匹配类型 10-VIN码;11-店头库;12-在途车辆;13-VDC库;15-待冲销PO;16-已结算批售;17-已配车未结算批售;18-未配车批售;101-未确认批售;：" prop="lockTypeLabel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.lockTypeLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="批售订单状态：" prop="wholesaleOrderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.wholesaleOrderStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="下单人姓名：" prop="orderUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下单人手机号：" prop="orderUserPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderUserPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="综合订单编码：" prop="compositeOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.compositeOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单来源 天猫、管理后台、拼多多、mall、京东、App、小程序、官网：" prop="orderSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售模式 1-批售;0-寄售：" prop="saleMode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleMode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售模式 1-批售;0-寄售：" prop="saleModeLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleModeLabel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单类型 0-C端用户订单;1-企业订单：" prop="orderType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="订单类型 0-C端用户订单;1-企业订单：" prop="orderTypeLabel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderTypeLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否盲订订单 1-是;0-否：" prop="blindOrder">
                  <el-input
                    placeholder="请输入"
                    v-model="form.blindOrder"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否盲订订单 1-是;0-否：" prop="blindOrderLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.blindOrderLabel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付顾问ID：" prop="deliveryUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付顾问名称：" prop="deliveryUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="锁车类型 0-自动锁车;1-手动锁车：" prop="lockCarType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.lockCarType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="锁批售单时间：" prop="lockWholesaleTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.lockWholesaleTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="配车物料编码：" prop="allocationMaterialCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.allocationMaterialCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否创建发运单计划：" prop="createdShippingPlan">
                  <el-input
                    placeholder="请输入"
                    v-model="form.createdShippingPlan"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否创建发运单计划：" prop="createdShippingPlanLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.createdShippingPlanLabel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交车VIN码：" prop="deliveryVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryVin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="触发交付通知时间：" prop="deliveryNoticeTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.deliveryNoticeTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="是否延期交付 1-是;0-否：" prop="deliveryDelayFlag">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDelayFlag"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否延期交付 1-是;0-否：" prop="deliveryDelayFlagLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDelayFlagLabel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否做过交车撤回 1-是;0-否：" prop="deliveryWithdrawFlag">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryWithdrawFlag"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否做过交车撤回 1-是;0-否：" prop="deliveryWithdrawFlagLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryWithdrawFlagLabel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态是否回退过 1-是;0-否：" prop="statusRollbackFlag">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusRollbackFlag"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态是否回退过 1-是;0-否：" prop="statusRollbackFlagLabel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusRollbackFlagLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="用户提车截止日：" prop="userPickupDeadline">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.userPickupDeadline"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="交付延期天数：" prop="deliveryDelayDays">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDelayDays"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车采购订单号：" prop="purchaseOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="二网门店编码：" prop="secondNetStoreCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.secondNetStoreCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="二网门店名称：" prop="secondNetStoreName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.secondNetStoreName"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="是否预售订单 1-是;0-否：" prop="preSaleOrder">
                  {{ form.preSaleOrder }}
                </el-form-item>
                <el-form-item label="购车人姓名：" prop="carBuyerName">
                  {{ form.carBuyerName }}
                </el-form-item>
                <el-form-item label="购车人手机号：" prop="carBuyerPhone">
                  {{ form.carBuyerPhone }}
                </el-form-item>
                <el-form-item label="证件号码：" prop="idCardNo">
                  {{ form.idCardNo }}
                </el-form-item>
                <el-form-item label="销售顾问名称：" prop="saleUserName">
                  {{ form.saleUserName }}
                </el-form-item>
                <el-form-item label="配车VIN码：" prop="matchVin">
                  {{ form.matchVin }}
                </el-form-item>
                <el-form-item label="零售订单状态标签：" prop="orderStatusLabel">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="是否锁单 1-是;0-否：" prop="lockStatusLabel">
                  {{ form.lockStatusLabel }}
                </el-form-item>
                <el-form-item label="锁单时间：" prop="lockTime">
                  {{ form.lockTime }}
                </el-form-item>
                <el-form-item label="是否绑定批售 1-是;0-否：" prop="wholesaleBindStatus">
                  {{ form.wholesaleBindStatus }}
                </el-form-item>
                <el-form-item label="补贴后价格：" prop="priceAfterSubsidy">
                  {{ form.priceAfterSubsidy }}
                </el-form-item>
                <el-form-item label="定金金额：" prop="depositAmount">
                  {{ form.depositAmount }}
                </el-form-item>
                <el-form-item label="代办人姓名：" prop="agentName">
                  {{ form.agentName }}
                </el-form-item>
                <el-form-item label="合作类型 0：直营店、2：合作伙伴：" prop="cooperationTypeLabel">
                  {{ form.cooperationTypeLabel }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="销售门店-省：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="销售门店-市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="销售门店-大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="销售门店-母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialsCode">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeName">
                  {{ form.yearTypeName }}
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="选配动力：" prop="rangePowerName">
                  {{ form.rangePowerName }}
                </el-form-item>
                <el-form-item label="续航里程：" prop="drivingRangeName">
                  {{ form.drivingRangeName }}
                </el-form-item>
                <el-form-item label="外观名称：" prop="exteriorName">
                  {{ form.exteriorName }}
                </el-form-item>
                <el-form-item label="内饰名称：" prop="interiorName">
                  {{ form.interiorName }}
                </el-form-item>
                <el-form-item label="轮毂名称：" prop="wheelHubName">
                  {{ form.wheelHubName }}
                </el-form-item>
                <el-form-item label="选装包名称：" prop="optionPackageName">
                  {{ form.optionPackageName }}
                </el-form-item>
                <el-form-item label="锁车类型 0-自动锁车;1-手动锁车：" prop="lockCarTypeLabel">
                  {{ form.lockCarTypeLabel }}
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  {{ form.retailOrderCode }}
                </el-form-item>
                <el-form-item label="外部订单号：" prop="outTradeNo">
                  {{ form.outTradeNo }}
                </el-form-item>
                <el-form-item label="商城下单时间：" prop="orderTime">
                  {{ form.orderTime }}
                </el-form-item>
                <el-form-item label="缴定金时间：" prop="paymentTime">
                  {{ form.paymentTime }}
                </el-form-item>
                <el-form-item label="权益享受日期：" prop="rightsEnjoyDate">
                  {{ form.rightsEnjoyDate }}
                </el-form-item>
                <el-form-item label="批售订单状态：" prop="wholesaleOrderStatusLabel">
                  {{ form.wholesaleOrderStatusLabel }}
                </el-form-item>
                <el-form-item label="解绑次数：" prop="unlockCount">
                  {{ form.unlockCount }}
                </el-form-item>
                <el-form-item label="改配次数：" prop="changeConfigCount">
                  {{ form.changeConfigCount }}
                </el-form-item>
                <el-form-item label="批售确认次数：" prop="confirmedCount">
                  {{ form.confirmedCount }}
                </el-form-item>
                <el-form-item label="交付周期上限：" prop="deliveryCycleMaxWeek">
                  {{ form.deliveryCycleMaxWeek }}
                </el-form-item>
                <el-form-item label="初始交付周期说明：" prop="initialDeliveryCycleDesc">
                  {{ form.initialDeliveryCycleDesc }}
                </el-form-item>
                <el-form-item label="动态交付周期说明：" prop="dynamicDeliveryCycleDesc">
                  {{ form.dynamicDeliveryCycleDesc }}
                </el-form-item>
                <el-form-item label="订单排序时间：" prop="orderSortTime">
                  {{ form.orderSortTime }}
                </el-form-item>
                <el-form-item label="交车时间：" prop="deliveryTime">
                  {{ form.deliveryTime }}
                </el-form-item>
                <el-form-item label="下单人ID：" prop="orderUserId">
                  {{ form.orderUserId }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
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
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="是否预售订单 1-是;0-否：" prop="preSaleOrderLabel">
                  {{ form.preSaleOrderLabel }}
                </el-form-item>
                <el-form-item label="证件类型：身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20：" prop="idCardType">
                  {{ form.idCardType }}
                </el-form-item>
                <el-form-item label="证件类型标签：" prop="idCardTypeLabel">
                  {{ form.idCardTypeLabel }}
                </el-form-item>
                <el-form-item label="销售顾问ID：" prop="saleUserId">
                  {{ form.saleUserId }}
                </el-form-item>
                <el-form-item label="零售订单状态 3-订单确认;5-生产中;30-待门店向工厂付款;40-车辆发运准备中;6-车辆在途;7-等待交车;9-交车完成;10-退订中;15-退款中;99-作废：" prop="orderStatus">
                  {{ form.orderStatus }}
                </el-form-item>
                <el-form-item label="是否锁单 1-是;0-否：" prop="lockStatus">
                  {{ form.lockStatus }}
                </el-form-item>
                <el-form-item label="是否绑定批售 1-是;0-否：" prop="wholesaleBindStatusLabel">
                  {{ form.wholesaleBindStatusLabel }}
                </el-form-item>
                <el-form-item label="补贴金额：" prop="subsidyAmount">
                  {{ form.subsidyAmount }}
                </el-form-item>
                <el-form-item label="整车指导价（补贴后价格）：" prop="guidePrice">
                  {{ form.guidePrice }}
                </el-form-item>
                <el-form-item label="代办人电话：" prop="agentPhone">
                  {{ form.agentPhone }}
                </el-form-item>
                <el-form-item label="合作类型 0：直营店、2：合作伙伴：" prop="cooperationType">
                  {{ form.cooperationType }}
                </el-form-item>
                <el-form-item label="销售门店组织ID：" prop="saleOrgId">
                  {{ form.saleOrgId }}
                </el-form-item>
                <el-form-item label="销售门店编码（组织code同网发门店编码）：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="销售门店-大区组织编码：" prop="regionCode">
                  {{ form.regionCode }}
                </el-form-item>
                <el-form-item label="销售门店-省组织编码：" prop="provinceCode">
                  {{ form.provinceCode }}
                </el-form-item>
                <el-form-item label="销售门店-市组织编码：" prop="cityCode">
                  {{ form.cityCode }}
                </el-form-item>
                <el-form-item label="销售门店-母公司编码：" prop="dealerCompanyCode">
                  {{ form.dealerCompanyCode }}
                </el-form-item>
                <el-form-item label="交付门店组织ID：" prop="deliveryOrgId">
                  {{ form.deliveryOrgId }}
                </el-form-item>
                <el-form-item label="交付门店编码：" prop="deliveryDealerCode">
                  {{ form.deliveryDealerCode }}
                </el-form-item>
                <el-form-item label="物料ID：" prop="materialsId">
                  {{ form.materialsId }}
                </el-form-item>
                <el-form-item label="车系ID：" prop="seriesId">
                  {{ form.seriesId }}
                </el-form-item>
                <el-form-item label="车系名称：" prop="seriesName">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="车型ID：" prop="modelId">
                  {{ form.modelId }}
                </el-form-item>
                <el-form-item label="年款ID：" prop="yearTypeId">
                  {{ form.yearTypeId }}
                </el-form-item>
                <el-form-item label="续航里程ID：" prop="drivingRangeId">
                  {{ form.drivingRangeId }}
                </el-form-item>
                <el-form-item label="选配动力ID：" prop="rangePowerId">
                  {{ form.rangePowerId }}
                </el-form-item>
                <el-form-item label="外观ID：" prop="exteriorId">
                  {{ form.exteriorId }}
                </el-form-item>
                <el-form-item label="内饰ID：" prop="interiorId">
                  {{ form.interiorId }}
                </el-form-item>
                <el-form-item label="轮毂ID：" prop="wheelHubId">
                  {{ form.wheelHubId }}
                </el-form-item>
                <el-form-item label="车顶ID：" prop="roofId">
                  {{ form.roofId }}
                </el-form-item>
                <el-form-item label="车顶名称：" prop="roofName">
                  {{ form.roofName }}
                </el-form-item>
                <el-form-item label="选装包ID：" prop="optionPackageId">
                  {{ form.optionPackageId }}
                </el-form-item>
                <el-form-item label="锁车匹配类型 10-VIN码;11-店头库;12-在途车辆;13-VDC库;15-待冲销PO;16-已结算批售;17-已配车未结算批售;18-未配车批售;101-未确认批售;：" prop="lockType">
                  {{ form.lockType }}
                </el-form-item>
                <el-form-item label="锁车匹配类型 10-VIN码;11-店头库;12-在途车辆;13-VDC库;15-待冲销PO;16-已结算批售;17-已配车未结算批售;18-未配车批售;101-未确认批售;：" prop="lockTypeLabel">
                  {{ form.lockTypeLabel }}
                </el-form-item>
                <el-form-item label="批售订单状态：" prop="wholesaleOrderStatus">
                  {{ form.wholesaleOrderStatus }}
                </el-form-item>
                <el-form-item label="下单人姓名：" prop="orderUserName">
                  {{ form.orderUserName }}
                </el-form-item>
                <el-form-item label="下单人手机号：" prop="orderUserPhone">
                  {{ form.orderUserPhone }}
                </el-form-item>
                <el-form-item label="综合订单编码：" prop="compositeOrderCode">
                  {{ form.compositeOrderCode }}
                </el-form-item>
                <el-form-item label="订单来源 天猫、管理后台、拼多多、mall、京东、App、小程序、官网：" prop="orderSource">
                  {{ form.orderSource }}
                </el-form-item>
                <el-form-item label="销售模式 1-批售;0-寄售：" prop="saleMode">
                  {{ form.saleMode }}
                </el-form-item>
                <el-form-item label="销售模式 1-批售;0-寄售：" prop="saleModeLabel">
                  {{ form.saleModeLabel }}
                </el-form-item>
                <el-form-item label="订单类型 0-C端用户订单;1-企业订单：" prop="orderType">
                  {{ form.orderType }}
                </el-form-item>
                <el-form-item label="订单类型 0-C端用户订单;1-企业订单：" prop="orderTypeLabel">
                  {{ form.orderTypeLabel }}
                </el-form-item>
                <el-form-item label="是否盲订订单 1-是;0-否：" prop="blindOrder">
                  {{ form.blindOrder }}
                </el-form-item>
                <el-form-item label="是否盲订订单 1-是;0-否：" prop="blindOrderLabel">
                  {{ form.blindOrderLabel }}
                </el-form-item>
                <el-form-item label="交付顾问ID：" prop="deliveryUserId">
                  {{ form.deliveryUserId }}
                </el-form-item>
                <el-form-item label="交付顾问名称：" prop="deliveryUserName">
                  {{ form.deliveryUserName }}
                </el-form-item>
                <el-form-item label="锁车类型 0-自动锁车;1-手动锁车：" prop="lockCarType">
                  {{ form.lockCarType }}
                </el-form-item>
                <el-form-item label="锁批售单时间：" prop="lockWholesaleTime">
                  {{ form.lockWholesaleTime }}
                </el-form-item>
                <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
                </el-form-item>
                <el-form-item label="配车物料编码：" prop="allocationMaterialCode">
                  {{ form.allocationMaterialCode }}
                </el-form-item>
                <el-form-item label="是否创建发运单计划：" prop="createdShippingPlan">
                  {{ form.createdShippingPlan }}
                </el-form-item>
                <el-form-item label="是否创建发运单计划：" prop="createdShippingPlanLabel">
                  {{ form.createdShippingPlanLabel }}
                </el-form-item>
                <el-form-item label="交车VIN码：" prop="deliveryVin">
                  {{ form.deliveryVin }}
                </el-form-item>
                <el-form-item label="触发交付通知时间：" prop="deliveryNoticeTime">
                  {{ form.deliveryNoticeTime }}
                </el-form-item>
                <el-form-item label="是否延期交付 1-是;0-否：" prop="deliveryDelayFlag">
                  {{ form.deliveryDelayFlag }}
                </el-form-item>
                <el-form-item label="是否延期交付 1-是;0-否：" prop="deliveryDelayFlagLabel">
                  {{ form.deliveryDelayFlagLabel }}
                </el-form-item>
                <el-form-item label="是否做过交车撤回 1-是;0-否：" prop="deliveryWithdrawFlag">
                  {{ form.deliveryWithdrawFlag }}
                </el-form-item>
                <el-form-item label="是否做过交车撤回 1-是;0-否：" prop="deliveryWithdrawFlagLabel">
                  {{ form.deliveryWithdrawFlagLabel }}
                </el-form-item>
                <el-form-item label="状态是否回退过 1-是;0-否：" prop="statusRollbackFlag">
                  {{ form.statusRollbackFlag }}
                </el-form-item>
                <el-form-item label="状态是否回退过 1-是;0-否：" prop="statusRollbackFlagLabel">
                  {{ form.statusRollbackFlagLabel }}
                </el-form-item>
                <el-form-item label="用户提车截止日：" prop="userPickupDeadline">
                  {{ form.userPickupDeadline }}
                </el-form-item>
                <el-form-item label="交付延期天数：" prop="deliveryDelayDays">
                  {{ form.deliveryDelayDays }}
                </el-form-item>
                <el-form-item label="整车采购订单号：" prop="purchaseOrderCode">
                  {{ form.purchaseOrderCode }}
                </el-form-item>
                <el-form-item label="二网门店编码：" prop="secondNetStoreCode">
                  {{ form.secondNetStoreCode }}
                </el-form-item>
                <el-form-item label="二网门店名称：" prop="secondNetStoreName">
                  {{ form.secondNetStoreName }}
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
import { getDetail, addOrUpdate } from '@/api/sales/vehretail/orderManager/retailOrderInfo/index';
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
  mallOrderCode: '',
  preSaleOrder: '',
  carBuyerName: '',
  carBuyerPhone: '',
  idCardNo: '',
  saleUserName: '',
  matchVin: '',
  orderStatusLabel: '',
  lockStatusLabel: '',
  lockTime: '',
  wholesaleBindStatus: '',
  priceAfterSubsidy: '',
  depositAmount: '',
  agentName: '',
  cooperationTypeLabel: '',
  saleDealerName: '',
  provinceName: '',
  cityName: '',
  regionName: '',
  dealerCompanyName: '',
  deliveryDealerName: '',
  materialsCode: '',
  modelName: '',
  yearTypeName: '',
  materialsDesc: '',
  rangePowerName: '',
  drivingRangeName: '',
  exteriorName: '',
  interiorName: '',
  wheelHubName: '',
  optionPackageName: '',
  lockCarTypeLabel: '',
  retailOrderCode: '',
  outTradeNo: '',
  orderTime: '',
  paymentTime: '',
  rightsEnjoyDate: '',
  wholesaleOrderStatusLabel: '',
  unlockCount: '',
  changeConfigCount: '',
  confirmedCount: '',
  deliveryCycleMaxWeek: '',
  initialDeliveryCycleDesc: '',
  dynamicDeliveryCycleDesc: '',
  orderSortTime: '',
  deliveryTime: '',
  orderUserId: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  preSaleOrderLabel: '',
  idCardType: '',
  idCardTypeLabel: '',
  saleUserId: '',
  orderStatus: '',
  lockStatus: '',
  wholesaleBindStatusLabel: '',
  subsidyAmount: '',
  guidePrice: '',
  agentPhone: '',
  cooperationType: '',
  saleOrgId: '',
  saleDealerCode: '',
  regionCode: '',
  provinceCode: '',
  cityCode: '',
  dealerCompanyCode: '',
  deliveryOrgId: '',
  deliveryDealerCode: '',
  materialsId: '',
  seriesId: '',
  seriesName: '',
  modelId: '',
  yearTypeId: '',
  drivingRangeId: '',
  rangePowerId: '',
  exteriorId: '',
  interiorId: '',
  wheelHubId: '',
  roofId: '',
  roofName: '',
  optionPackageId: '',
  lockType: '',
  lockTypeLabel: '',
  wholesaleOrderStatus: '',
  orderUserName: '',
  orderUserPhone: '',
  compositeOrderCode: '',
  orderSource: '',
  saleMode: '',
  saleModeLabel: '',
  orderType: '',
  orderTypeLabel: '',
  blindOrder: '',
  blindOrderLabel: '',
  deliveryUserId: '',
  deliveryUserName: '',
  lockCarType: '',
  lockWholesaleTime: '',
  wholesaleOrderCode: '',
  allocationMaterialCode: '',
  createdShippingPlan: '',
  createdShippingPlanLabel: '',
  deliveryVin: '',
  deliveryNoticeTime: '',
  deliveryDelayFlag: '',
  deliveryDelayFlagLabel: '',
  deliveryWithdrawFlag: '',
  deliveryWithdrawFlagLabel: '',
  statusRollbackFlag: '',
  statusRollbackFlagLabel: '',
  userPickupDeadline: '',
  deliveryDelayDays: '',
  purchaseOrderCode: '',
  secondNetStoreCode: '',
  secondNetStoreName: '',
};

export default {
  name: 'retailOrderInfoEdit',
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
    },
    title () {
      return '：' + this.form.id;
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
      pageTitle: '整车零售订单管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-retailOrderInfo',
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
        mallOrderCode: [
          { required: true, message: '请输入商城订单编号', trigger: 'change' }
        ],
        preSaleOrder: [
          { required: true, message: '请输入是否预售订单 1-是;0-否', trigger: 'change' }
        ],
        carBuyerName: [
          { required: true, message: '请输入购车人姓名', trigger: 'change' }
        ],
        carBuyerPhone: [
          { required: true, message: '请输入购车人手机号', trigger: 'change' }
        ],
        idCardNo: [
          { required: true, message: '请输入证件号码', trigger: 'change' }
        ],
        saleUserName: [
          { required: true, message: '请输入销售顾问名称', trigger: 'change' }
        ],
        matchVin: [
          { required: true, message: '请输入配车VIN码', trigger: 'change' }
        ],
        orderStatusLabel: [
          { required: true, message: '请选择零售订单状态标签', trigger: 'change' }
        ],
        lockStatusLabel: [
          { required: true, message: '请选择是否锁单 1-是;0-否', trigger: 'change' }
        ],
        lockTime: [
          { required: true, message: '请选择锁单时间', trigger: 'change' }
        ],
        wholesaleBindStatus: [
          { required: true, message: '请选择是否绑定批售 1-是;0-否', trigger: 'change' }
        ],
        priceAfterSubsidy: [
          { required: true, message: '请输入补贴后价格', trigger: 'change' }
        ],
        depositAmount: [
          { required: true, message: '请输入定金金额', trigger: 'change' }
        ],
        agentName: [
          { required: true, message: '请输入代办人姓名', trigger: 'change' }
        ],
        cooperationTypeLabel: [
          { required: true, message: '请选择合作类型 0：直营店、2：合作伙伴', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        provinceName: [
          { required: true, message: '请输入销售门店-省', trigger: 'change' }
        ],
        cityName: [
          { required: true, message: '请输入销售门店-市', trigger: 'change' }
        ],
        regionName: [
          { required: true, message: '请输入销售门店-大区', trigger: 'change' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入销售门店-母公司名称', trigger: 'change' }
        ],
        deliveryDealerName: [
          { required: true, message: '请输入交付门店名称', trigger: 'change' }
        ],
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
        ],
        yearTypeName: [
          { required: true, message: '请选择年款名称', trigger: 'change' }
        ],
        materialsDesc: [
          { required: true, message: '请输入物料描述', trigger: 'change' }
        ],
        rangePowerName: [
          { required: true, message: '请输入选配动力', trigger: 'change' }
        ],
        drivingRangeName: [
          { required: true, message: '请输入续航里程', trigger: 'change' }
        ],
        exteriorName: [
          { required: true, message: '请输入外观名称', trigger: 'change' }
        ],
        interiorName: [
          { required: true, message: '请输入内饰名称', trigger: 'change' }
        ],
        wheelHubName: [
          { required: true, message: '请输入轮毂名称', trigger: 'change' }
        ],
        optionPackageName: [
          { required: true, message: '请输入选装包名称', trigger: 'change' }
        ],
        lockCarTypeLabel: [
          { required: true, message: '请选择锁车类型 0-自动锁车;1-手动锁车', trigger: 'change' }
        ],
        retailOrderCode: [
          { required: true, message: '请输入零售订单号', trigger: 'change' }
        ],
        outTradeNo: [
          { required: true, message: '请输入外部订单号', trigger: 'change' }
        ],
        orderTime: [
          { required: true, message: '请选择商城下单时间', trigger: 'change' }
        ],
        paymentTime: [
          { required: true, message: '请选择缴定金时间', trigger: 'change' }
        ],
        rightsEnjoyDate: [
          { required: true, message: '请选择权益享受日期', trigger: 'change' }
        ],
        wholesaleOrderStatusLabel: [
          { required: true, message: '请选择批售订单状态', trigger: 'change' }
        ],
        unlockCount: [
          { required: true, message: '请输入解绑次数', trigger: 'change' }
        ],
        changeConfigCount: [
          { required: true, message: '请输入改配次数', trigger: 'change' }
        ],
        confirmedCount: [
          { required: true, message: '请输入批售确认次数', trigger: 'change' }
        ],
        deliveryCycleMaxWeek: [
          { required: true, message: '请输入交付周期上限', trigger: 'change' }
        ],
        initialDeliveryCycleDesc: [
          { required: true, message: '请输入初始交付周期说明', trigger: 'change' }
        ],
        dynamicDeliveryCycleDesc: [
          { required: true, message: '请输入动态交付周期说明', trigger: 'change' }
        ],
        orderSortTime: [
          { required: true, message: '请选择订单排序时间', trigger: 'change' }
        ],
        deliveryTime: [
          { required: true, message: '请选择交车时间', trigger: 'change' }
        ],
        orderUserId: [
          { required: true, message: '请输入下单人ID', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
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
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        preSaleOrderLabel: [
          { required: true, message: '请输入是否预售订单 1-是;0-否', trigger: 'change' }
        ],
        idCardType: [
          { required: true, message: '请选择证件类型：身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20', trigger: 'change' }
        ],
        idCardTypeLabel: [
          { required: true, message: '请选择证件类型标签', trigger: 'change' }
        ],
        saleUserId: [
          { required: true, message: '请输入销售顾问ID', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择零售订单状态 3-订单确认;5-生产中;30-待门店向工厂付款;40-车辆发运准备中;6-车辆在途;7-等待交车;9-交车完成;10-退订中;15-退款中;99-作废', trigger: 'change' }
        ],
        lockStatus: [
          { required: true, message: '请选择是否锁单 1-是;0-否', trigger: 'change' }
        ],
        wholesaleBindStatusLabel: [
          { required: true, message: '请选择是否绑定批售 1-是;0-否', trigger: 'change' }
        ],
        subsidyAmount: [
          { required: true, message: '请输入补贴金额', trigger: 'change' }
        ],
        guidePrice: [
          { required: true, message: '请输入整车指导价（补贴后价格）', trigger: 'change' }
        ],
        agentPhone: [
          { required: true, message: '请输入代办人电话', trigger: 'change' }
        ],
        cooperationType: [
          { required: true, message: '请选择合作类型 0：直营店、2：合作伙伴', trigger: 'change' }
        ],
        saleOrgId: [
          { required: true, message: '请输入销售门店组织ID', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码（组织code同网发门店编码）', trigger: 'change' }
        ],
        regionCode: [
          { required: true, message: '请输入销售门店-大区组织编码', trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: '请输入销售门店-省组织编码', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请输入销售门店-市组织编码', trigger: 'change' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入销售门店-母公司编码', trigger: 'change' }
        ],
        deliveryOrgId: [
          { required: true, message: '请输入交付门店组织ID', trigger: 'change' }
        ],
        deliveryDealerCode: [
          { required: true, message: '请输入交付门店编码', trigger: 'change' }
        ],
        materialsId: [
          { required: true, message: '请输入物料ID', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请输入车系ID', trigger: 'change' }
        ],
        seriesName: [
          { required: true, message: '请输入车系名称', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        yearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' }
        ],
        drivingRangeId: [
          { required: true, message: '请输入续航里程ID', trigger: 'change' }
        ],
        rangePowerId: [
          { required: true, message: '请输入选配动力ID', trigger: 'change' }
        ],
        exteriorId: [
          { required: true, message: '请输入外观ID', trigger: 'change' }
        ],
        interiorId: [
          { required: true, message: '请输入内饰ID', trigger: 'change' }
        ],
        wheelHubId: [
          { required: true, message: '请输入轮毂ID', trigger: 'change' }
        ],
        roofId: [
          { required: true, message: '请输入车顶ID', trigger: 'change' }
        ],
        roofName: [
          { required: true, message: '请输入车顶名称', trigger: 'change' }
        ],
        optionPackageId: [
          { required: true, message: '请输入选装包ID', trigger: 'change' }
        ],
        lockType: [
          { required: true, message: '请选择锁车匹配类型 10-VIN码;11-店头库;12-在途车辆;13-VDC库;15-待冲销PO;16-已结算批售;17-已配车未结算批售;18-未配车批售;101-未确认批售;', trigger: 'change' }
        ],
        lockTypeLabel: [
          { required: true, message: '请选择锁车匹配类型 10-VIN码;11-店头库;12-在途车辆;13-VDC库;15-待冲销PO;16-已结算批售;17-已配车未结算批售;18-未配车批售;101-未确认批售;', trigger: 'change' }
        ],
        wholesaleOrderStatus: [
          { required: true, message: '请选择批售订单状态', trigger: 'change' }
        ],
        orderUserName: [
          { required: true, message: '请输入下单人姓名', trigger: 'change' }
        ],
        orderUserPhone: [
          { required: true, message: '请输入下单人手机号', trigger: 'change' }
        ],
        compositeOrderCode: [
          { required: true, message: '请输入综合订单编码', trigger: 'change' }
        ],
        orderSource: [
          { required: true, message: '请输入订单来源 天猫、管理后台、拼多多、mall、京东、App、小程序、官网', trigger: 'change' }
        ],
        saleMode: [
          { required: true, message: '请输入销售模式 1-批售;0-寄售', trigger: 'change' }
        ],
        saleModeLabel: [
          { required: true, message: '请输入销售模式 1-批售;0-寄售', trigger: 'change' }
        ],
        orderType: [
          { required: true, message: '请选择订单类型 0-C端用户订单;1-企业订单', trigger: 'change' }
        ],
        orderTypeLabel: [
          { required: true, message: '请选择订单类型 0-C端用户订单;1-企业订单', trigger: 'change' }
        ],
        blindOrder: [
          { required: true, message: '请输入是否盲订订单 1-是;0-否', trigger: 'change' }
        ],
        blindOrderLabel: [
          { required: true, message: '请输入是否盲订订单 1-是;0-否', trigger: 'change' }
        ],
        deliveryUserId: [
          { required: true, message: '请输入交付顾问ID', trigger: 'change' }
        ],
        deliveryUserName: [
          { required: true, message: '请输入交付顾问名称', trigger: 'change' }
        ],
        lockCarType: [
          { required: true, message: '请选择锁车类型 0-自动锁车;1-手动锁车', trigger: 'change' }
        ],
        lockWholesaleTime: [
          { required: true, message: '请选择锁批售单时间', trigger: 'change' }
        ],
        wholesaleOrderCode: [
          { required: true, message: '请输入批售订单号', trigger: 'change' }
        ],
        allocationMaterialCode: [
          { required: true, message: '请输入配车物料编码', trigger: 'change' }
        ],
        createdShippingPlan: [
          { required: true, message: '请输入是否创建发运单计划', trigger: 'change' }
        ],
        createdShippingPlanLabel: [
          { required: true, message: '请输入是否创建发运单计划', trigger: 'change' }
        ],
        deliveryVin: [
          { required: true, message: '请输入交车VIN码', trigger: 'change' }
        ],
        deliveryNoticeTime: [
          { required: true, message: '请选择触发交付通知时间', trigger: 'change' }
        ],
        deliveryDelayFlag: [
          { required: true, message: '请输入是否延期交付 1-是;0-否', trigger: 'change' }
        ],
        deliveryDelayFlagLabel: [
          { required: true, message: '请输入是否延期交付 1-是;0-否', trigger: 'change' }
        ],
        deliveryWithdrawFlag: [
          { required: true, message: '请输入是否做过交车撤回 1-是;0-否', trigger: 'change' }
        ],
        deliveryWithdrawFlagLabel: [
          { required: true, message: '请输入是否做过交车撤回 1-是;0-否', trigger: 'change' }
        ],
        statusRollbackFlag: [
          { required: true, message: '请选择状态是否回退过 1-是;0-否', trigger: 'change' }
        ],
        statusRollbackFlagLabel: [
          { required: true, message: '请选择状态是否回退过 1-是;0-否', trigger: 'change' }
        ],
        userPickupDeadline: [
          { required: true, message: '请选择用户提车截止日', trigger: 'change' }
        ],
        deliveryDelayDays: [
          { required: true, message: '请输入交付延期天数', trigger: 'change' }
        ],
        purchaseOrderCode: [
          { required: true, message: '请输入整车采购订单号', trigger: 'change' }
        ],
        secondNetStoreCode: [
          { required: true, message: '请输入二网门店编码', trigger: 'change' }
        ],
        secondNetStoreName: [
          { required: true, message: '请输入二网门店名称', trigger: 'change' }
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
