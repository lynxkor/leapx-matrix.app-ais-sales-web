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
                <el-form-item label="审核状态 1010-草稿 1020-已提交 1030-已通过 1040-已驳回 1050-已作废：" prop="status">
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
                <el-form-item label="整车上牌记录编号：" prop="soldPlateCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.soldPlateCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交车单ID：" prop="deliveryOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryOrderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零售订单ID：" prop="retailOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderId"
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
                <el-form-item label="已售上牌资料来源 report-特殊销售提报 delivery-交车单 plate-已售上牌新增：" prop="soldPlateSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.soldPlateSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
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
                <el-form-item label="车型名称：" prop="modelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店id：" prop="saleOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车主姓名：" prop="carBuyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carBuyerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车主电话：" prop="carBuyerPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carBuyerPhone"
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
                <el-form-item label="证件号码：" prop="idCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.idCardNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆用途 10-私家车 20-公户车 30-试乘试驾车 40-大客户用车 50-营运-预约出租客运 100-其他：" prop="vehiclePurpose">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehiclePurpose"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="公告车型ID：" prop="carSaleSversionId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carSaleSversionId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="公告车型名称：" prop="carSalesVersionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carSalesVersionName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="产地：" prop="vehiclePlaceOrigin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehiclePlaceOrigin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发动机号：" prop="enginenNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.enginenNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合格证号：" prop="certificateNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.certificateNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车开票记录编号：" prop="invoiceRecordCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceRecordCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="特殊车辆销售提报编号：" prop="specialReportCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.specialReportCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="行驶证VIN号：" prop="drivingLicenseVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.drivingLicenseVin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="行驶证所有人：" prop="drivingLicenseOwner">
                  <el-input
                    placeholder="请输入"
                    v-model="form.drivingLicenseOwner"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车牌号码：" prop="plateNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.plateNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="上牌日期：" prop="plateDate">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.plateDate"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="上牌省份编码：" prop="provinceCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="上牌省份：" prop="provinceName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="上牌城市编码：" prop="cityCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="上牌城市：" prop="cityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="上牌区&#x2F;县编码：" prop="districtCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.districtCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="上牌区&#x2F;县：" prop="districtName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.districtName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆注册地址：" prop="vehicleRegisterAddress">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleRegisterAddress"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="行驶证编号：" prop="drivingLicenseNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.drivingLicenseNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="行驶证品牌型号：" prop="drivingLicenseBrandModel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.drivingLicenseBrandModel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="提交审核时间：" prop="submitTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.submitTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="提交人id：" prop="submitUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.submitUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="提交人：" prop="submitUser">
                  <el-input
                    placeholder="请输入"
                    v-model="form.submitUser"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审核时间：" prop="auditTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.auditTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="审核人id：" prop="auditUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审核人：" prop="auditUser">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditUser"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="撤回时间：" prop="withdrawTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.withdrawTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="撤回人id：" prop="withdrawUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.withdrawUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="撤回人：" prop="withdrawUser">
                  <el-input
                    placeholder="请输入"
                    v-model="form.withdrawUser"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审核意见：" prop="auditRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否自动审核 0-否 1-是（默认否）：" prop="autoAuditStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.autoAuditStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="数据来源，150-新销服; 10-老销服：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
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
                <el-form-item label="审核状态 1010-草稿 1020-已提交 1030-已通过 1040-已驳回 1050-已作废：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="整车上牌记录编号：" prop="soldPlateCode">
                  {{ form.soldPlateCode }}
                </el-form-item>
                <el-form-item label="交车单ID：" prop="deliveryOrderId">
                  {{ form.deliveryOrderId }}
                </el-form-item>
                <el-form-item label="零售订单ID：" prop="retailOrderId">
                  {{ form.retailOrderId }}
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  {{ form.retailOrderCode }}
                </el-form-item>
                <el-form-item label="已售上牌资料来源 report-特殊销售提报 delivery-交车单 plate-已售上牌新增：" prop="soldPlateSource">
                  {{ form.soldPlateSource }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="车型ID：" prop="modelId">
                  {{ form.modelId }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="门店id：" prop="saleOrgId">
                  {{ form.saleOrgId }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="车主姓名：" prop="carBuyerName">
                  {{ form.carBuyerName }}
                </el-form-item>
                <el-form-item label="车主电话：" prop="carBuyerPhone">
                  {{ form.carBuyerPhone }}
                </el-form-item>
                <el-form-item label="证件类型：身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20：" prop="idCardType">
                  {{ form.idCardType }}
                </el-form-item>
                <el-form-item label="证件号码：" prop="idCardNo">
                  {{ form.idCardNo }}
                </el-form-item>
                <el-form-item label="车辆用途 10-私家车 20-公户车 30-试乘试驾车 40-大客户用车 50-营运-预约出租客运 100-其他：" prop="vehiclePurpose">
                  {{ form.vehiclePurpose }}
                </el-form-item>
                <el-form-item label="公告车型ID：" prop="carSaleSversionId">
                  {{ form.carSaleSversionId }}
                </el-form-item>
                <el-form-item label="公告车型名称：" prop="carSalesVersionName">
                  {{ form.carSalesVersionName }}
                </el-form-item>
                <el-form-item label="产地：" prop="vehiclePlaceOrigin">
                  {{ form.vehiclePlaceOrigin }}
                </el-form-item>
                <el-form-item label="发动机号：" prop="enginenNumber">
                  {{ form.enginenNumber }}
                </el-form-item>
                <el-form-item label="合格证号：" prop="certificateNo">
                  {{ form.certificateNo }}
                </el-form-item>
                <el-form-item label="整车开票记录编号：" prop="invoiceRecordCode">
                  {{ form.invoiceRecordCode }}
                </el-form-item>
                <el-form-item label="特殊车辆销售提报编号：" prop="specialReportCode">
                  {{ form.specialReportCode }}
                </el-form-item>
                <el-form-item label="行驶证VIN号：" prop="drivingLicenseVin">
                  {{ form.drivingLicenseVin }}
                </el-form-item>
                <el-form-item label="行驶证所有人：" prop="drivingLicenseOwner">
                  {{ form.drivingLicenseOwner }}
                </el-form-item>
                <el-form-item label="车牌号码：" prop="plateNo">
                  {{ form.plateNo }}
                </el-form-item>
                <el-form-item label="上牌日期：" prop="plateDate">
                  {{ form.plateDate }}
                </el-form-item>
                <el-form-item label="上牌省份编码：" prop="provinceCode">
                  {{ form.provinceCode }}
                </el-form-item>
                <el-form-item label="上牌省份：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="上牌城市编码：" prop="cityCode">
                  {{ form.cityCode }}
                </el-form-item>
                <el-form-item label="上牌城市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="上牌区&#x2F;县编码：" prop="districtCode">
                  {{ form.districtCode }}
                </el-form-item>
                <el-form-item label="上牌区&#x2F;县：" prop="districtName">
                  {{ form.districtName }}
                </el-form-item>
                <el-form-item label="车辆注册地址：" prop="vehicleRegisterAddress">
                  {{ form.vehicleRegisterAddress }}
                </el-form-item>
                <el-form-item label="行驶证编号：" prop="drivingLicenseNumber">
                  {{ form.drivingLicenseNumber }}
                </el-form-item>
                <el-form-item label="行驶证品牌型号：" prop="drivingLicenseBrandModel">
                  {{ form.drivingLicenseBrandModel }}
                </el-form-item>
                <el-form-item label="提交审核时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="提交人id：" prop="submitUserId">
                  {{ form.submitUserId }}
                </el-form-item>
                <el-form-item label="提交人：" prop="submitUser">
                  {{ form.submitUser }}
                </el-form-item>
                <el-form-item label="审核时间：" prop="auditTime">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="审核人id：" prop="auditUserId">
                  {{ form.auditUserId }}
                </el-form-item>
                <el-form-item label="审核人：" prop="auditUser">
                  {{ form.auditUser }}
                </el-form-item>
                <el-form-item label="撤回时间：" prop="withdrawTime">
                  {{ form.withdrawTime }}
                </el-form-item>
                <el-form-item label="撤回人id：" prop="withdrawUserId">
                  {{ form.withdrawUserId }}
                </el-form-item>
                <el-form-item label="撤回人：" prop="withdrawUser">
                  {{ form.withdrawUser }}
                </el-form-item>
                <el-form-item label="审核意见：" prop="auditRemark">
                  {{ form.auditRemark }}
                </el-form-item>
                <el-form-item label="是否自动审核 0-否 1-是（默认否）：" prop="autoAuditStatus">
                  {{ form.autoAuditStatus }}
                </el-form-item>
                <el-form-item label="数据来源，150-新销服; 10-老销服：" prop="dataSource">
                  {{ form.dataSource }}
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
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/soldPlateInfo/index';
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
  soldPlateCode: '',
  deliveryOrderId: '',
  retailOrderId: '',
  retailOrderCode: '',
  soldPlateSource: '',
  vin: '',
  modelId: '',
  modelName: '',
  saleOrgId: '',
  saleDealerCode: '',
  saleDealerName: '',
  carBuyerName: '',
  carBuyerPhone: '',
  idCardType: '',
  idCardNo: '',
  vehiclePurpose: '',
  carSaleSversionId: '',
  carSalesVersionName: '',
  vehiclePlaceOrigin: '',
  enginenNumber: '',
  certificateNo: '',
  invoiceRecordCode: '',
  specialReportCode: '',
  drivingLicenseVin: '',
  drivingLicenseOwner: '',
  plateNo: '',
  plateDate: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  vehicleRegisterAddress: '',
  drivingLicenseNumber: '',
  drivingLicenseBrandModel: '',
  submitTime: '',
  submitUserId: '',
  submitUser: '',
  auditTime: '',
  auditUserId: '',
  auditUser: '',
  withdrawTime: '',
  withdrawUserId: '',
  withdrawUser: '',
  auditRemark: '',
  autoAuditStatus: '',
  dataSource: '',
};

export default {
  name: 'soldPlateInfoEdit',
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
      pageTitle: '已售上牌车辆资料管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVRFDI-soldPlateInfo',
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
          { required: true, message: '请选择审核状态 1010-草稿 1020-已提交 1030-已通过 1040-已驳回 1050-已作废', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        soldPlateCode: [
          { required: true, message: '请输入整车上牌记录编号', trigger: 'change' }
        ],
        deliveryOrderId: [
          { required: true, message: '请输入交车单ID', trigger: 'change' }
        ],
        retailOrderId: [
          { required: true, message: '请输入零售订单ID', trigger: 'change' }
        ],
        retailOrderCode: [
          { required: true, message: '请输入零售订单号', trigger: 'change' }
        ],
        soldPlateSource: [
          { required: true, message: '请输入已售上牌资料来源 report-特殊销售提报 delivery-交车单 plate-已售上牌新增', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
        ],
        saleOrgId: [
          { required: true, message: '请输入门店id', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        carBuyerName: [
          { required: true, message: '请输入车主姓名', trigger: 'change' }
        ],
        carBuyerPhone: [
          { required: true, message: '请输入车主电话', trigger: 'change' }
        ],
        idCardType: [
          { required: true, message: '请选择证件类型：身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20', trigger: 'change' }
        ],
        idCardNo: [
          { required: true, message: '请输入证件号码', trigger: 'change' }
        ],
        vehiclePurpose: [
          { required: true, message: '请输入车辆用途 10-私家车 20-公户车 30-试乘试驾车 40-大客户用车 50-营运-预约出租客运 100-其他', trigger: 'change' }
        ],
        carSaleSversionId: [
          { required: true, message: '请输入公告车型ID', trigger: 'change' }
        ],
        carSalesVersionName: [
          { required: true, message: '请输入公告车型名称', trigger: 'change' }
        ],
        vehiclePlaceOrigin: [
          { required: true, message: '请输入产地', trigger: 'change' }
        ],
        enginenNumber: [
          { required: true, message: '请输入发动机号', trigger: 'change' }
        ],
        certificateNo: [
          { required: true, message: '请输入合格证号', trigger: 'change' }
        ],
        invoiceRecordCode: [
          { required: true, message: '请输入整车开票记录编号', trigger: 'change' }
        ],
        specialReportCode: [
          { required: true, message: '请输入特殊车辆销售提报编号', trigger: 'change' }
        ],
        drivingLicenseVin: [
          { required: true, message: '请输入行驶证VIN号', trigger: 'change' }
        ],
        drivingLicenseOwner: [
          { required: true, message: '请输入行驶证所有人', trigger: 'change' }
        ],
        plateNo: [
          { required: true, message: '请输入车牌号码', trigger: 'change' }
        ],
        plateDate: [
          { required: true, message: '请选择上牌日期', trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: '请输入上牌省份编码', trigger: 'change' }
        ],
        provinceName: [
          { required: true, message: '请输入上牌省份', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请输入上牌城市编码', trigger: 'change' }
        ],
        cityName: [
          { required: true, message: '请输入上牌城市', trigger: 'change' }
        ],
        districtCode: [
          { required: true, message: '请输入上牌区&#x2F;县编码', trigger: 'change' }
        ],
        districtName: [
          { required: true, message: '请输入上牌区&#x2F;县', trigger: 'change' }
        ],
        vehicleRegisterAddress: [
          { required: true, message: '请输入车辆注册地址', trigger: 'change' }
        ],
        drivingLicenseNumber: [
          { required: true, message: '请输入行驶证编号', trigger: 'change' }
        ],
        drivingLicenseBrandModel: [
          { required: true, message: '请输入行驶证品牌型号', trigger: 'change' }
        ],
        submitTime: [
          { required: true, message: '请选择提交审核时间', trigger: 'change' }
        ],
        submitUserId: [
          { required: true, message: '请输入提交人id', trigger: 'change' }
        ],
        submitUser: [
          { required: true, message: '请输入提交人', trigger: 'change' }
        ],
        auditTime: [
          { required: true, message: '请选择审核时间', trigger: 'change' }
        ],
        auditUserId: [
          { required: true, message: '请输入审核人id', trigger: 'change' }
        ],
        auditUser: [
          { required: true, message: '请输入审核人', trigger: 'change' }
        ],
        withdrawTime: [
          { required: true, message: '请选择撤回时间', trigger: 'change' }
        ],
        withdrawUserId: [
          { required: true, message: '请输入撤回人id', trigger: 'change' }
        ],
        withdrawUser: [
          { required: true, message: '请输入撤回人', trigger: 'change' }
        ],
        auditRemark: [
          { required: true, message: '请输入审核意见', trigger: 'change' }
        ],
        autoAuditStatus: [
          { required: true, message: '请选择是否自动审核 0-否 1-是（默认否）', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150-新销服; 10-老销服', trigger: 'change' }
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
