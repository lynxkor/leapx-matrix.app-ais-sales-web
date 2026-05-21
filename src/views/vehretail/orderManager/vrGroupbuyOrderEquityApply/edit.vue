<template>
  <edit-page-layout ref="editLayout" title="团购订单权益申请详情" showPaneFooter>
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
        :showEditBtn="form.permissions.edit"
      >
        <template #status>
          <span v-if="form.auditStatus === 10" class="status link">{{ form.auditStatusLabel }}</span>
          <span v-else-if="form.auditStatus === 20 || form.auditStatus === 70" class="status danger">{{ form.auditStatusLabel }}</span>
          <span v-else-if="[30, 40, 50, 60].includes(form.auditStatus)" class="status success">{{ form.auditStatusLabel }}</span>
          <span v-else class="status success">{{ form.auditStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if = "isShowAuditorBtn" size="small" @click="handleViewAuditUsers">查看审核人员</el-button>
          <el-button v-if = "form.permissions.cancel" size="small" @click="handleCancel">作废</el-button>
          <el-button v-if = "form.permissions.submit" size="small" @click="handleSubmitApproval">提交审批</el-button>
          <el-button v-if = "form.permissions.firstApprove" size="small" @click="handleAudit(1)">初审</el-button>
          <el-button v-if = "form.permissions.secondApprove" size="small" @click="handleAudit(2)">复审</el-button>
          <el-button v-if = "form.permissions.finalApprove" size="small" @click="handleAudit(3)">终审</el-button>
          <el-button v-if = "form.permissions.auditRevoke" size="small" @click="handleRecall">审核撤回</el-button>
        </template>
        <el-main>
          <!-- 审核步骤条 -->
          <NavTop :stepInfoList="stepInfoList"/>

          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="团购权益申请单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.mallOrderCode"
                    :remote-method="getRetailOrderListByNo"
                    value-key="mallOrderCode"
                    label-key="mallOrderCode"
                    placeholder="请选择商城订单号"
                    @change="handleMallOrderCodeChange"
                  />
                </el-form-item>
                <el-form-item label="整车订单号：" prop="vehicleOrderNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleOrderNo"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="订单物料码：" prop="orderMaterialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderMaterialsCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="合作类型：" prop="cooperationType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_cooperation_type"
                    v-model="form.cooperationType"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="车型：" prop="modelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="车系：" prop="seriesName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="购车人姓名：" prop="buyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.buyerName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="购车人手机号码：" prop="buyerPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.buyerPhone"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="下单人用户ID号：" prop="userId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.userId"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    maxlength="1000"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="团购权益申请单号：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="商城订单编号：">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="整车订单号：">
                  {{ form.vehicleOrderNo || '-' }}
                </el-form-item>
                <el-form-item label="订单物料码：">
                  {{ form.orderMaterialsCode }}
                </el-form-item>
                <el-form-item label="销售门店：">
                  <el-link v-if="form.dealerCode" type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">{{ form.dealerName }}</el-link><span v-else>{{ form.dealerName }}</span>
                </el-form-item>
                <el-form-item label="合作类型：">
                  {{ form.cooperationTypeLabel || '-' }}
                </el-form-item>
                <el-form-item label="车型：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclemodel/edit?id=${form.modelId}`" target="_blank">{{ form.modelName || '-' }}</el-link>
                </el-form-item>
                <el-form-item label="车系：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleseries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName || '-' }}</el-link>
                </el-form-item>
                <el-form-item label="购车人姓名：">
                  {{ form.buyerName }}
                </el-form-item>
                <el-form-item label="购车人手机号码：">
                  {{ form.buyerPhone }}
                </el-form-item>
                <el-form-item label="下单人用户ID号：">
                  {{ form.userId }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 销售门店 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>销售门店</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="dealerForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="合作类型：" prop="cooperationType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_cooperation_type"
                    v-model="form.cooperationType"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="所属区域或部门：" prop="regionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="门店名称：">
                  <el-link v-if="form.dealerCode" type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">{{ form.dealerName }}</el-link><span v-else>{{ form.dealerName }}</span>
                </el-form-item>
                <el-form-item label="门店编码：">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="合作类型：">
                  {{ form.cooperationTypeLabel || '-' }}
                </el-form-item>
                <el-form-item label="所属区域或部门：">
                  {{ form.regionName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 公司信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>公司信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="companyForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="公司名称：" prop="companyName">
                  <fetch-select
                    :remote-method="getEnterpriseList"
                    v-model="form.companyName"
                    placeholder="请选择公司"
                    clearable
                    remote
                    filterable
                    value-key="companyName"
                    label-key="companyName"
                    @change="handleCompanyChange"
                  />
                </el-form-item>
                <el-form-item label="优惠金额：" prop="discountAmount">
                  <el-input-number
                    v-model="form.discountAmount"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :max="100000000000"
                    placeholder="请输入"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="优惠券：" prop="couponName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.couponName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="公司名称：">
                  {{ form.companyName }}
                </el-form-item>
                <el-form-item label="优惠金额：">
                  {{ form.discountAmount }}
                </el-form-item>
                <el-form-item label="优惠券：">
                  {{ form.couponName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 附件材料 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>附件材料</h2>
            </div>
            <div class="common-section-body">
              <div class="attachment-grid">
                <AisAttachment
                  v-for="(item, index) in attachmentList" :key="index"
                  :businessId="_id"
                  :ref="'attachment' + index"
                  :configCode="item.configCode"
                  :attachType="item.attachType"
                  :title="item.label"
                  :uploadConfig="item.uploadConfig"
                  type="card"
                  :readonly="!(isEditing || !_id)"
                />
            </div>
            </div>
          </section>
          <!-- 整车物料 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>整车物料</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="materialForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="物料描述：" prop="materialsDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsDesc"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="物料描述：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclematerials/edit?id=${form.materialsCode}`" target="_blank">{{ form.materialsDesc }}</el-link>
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 整车订单信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>整车订单信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="orderForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="整车订单状态：" prop="vehicleOrderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_order_status"
                    v-model="form.vehicleOrderStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="商城下单时间：" prop="mallOrderTime">
                  <el-date-picker
                    v-model="form.mallOrderTime"
                    type="datetime"
                    placeholder="请选择"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="订单来源：" prop="orderSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderSource"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="用户ID：" prop="userId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.userId"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="购车人姓名：" prop="buyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.buyerName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="购车人手机：" prop="buyerPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.buyerPhone"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="证件类型：" prop="idType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="form.idType"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="证件号码：" prop="idNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.idNumber"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="代办联系人：" prop="agentContact">
                  <el-input
                    placeholder="请输入"
                    v-model="form.agentContact"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="补贴后价格：" prop="discountedPrice">
                  <el-input-number
                    v-model="form.discountedPrice"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :max="100000000000"
                    placeholder="请输入"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="定金金额：" prop="depositAmount">
                  <el-input-number
                    v-model="form.depositAmount"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :max="100000000000"
                    placeholder="请输入"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="交车时间：" prop="deliveryTime">
                  <el-date-picker
                    v-model="form.deliveryTime"
                    type="datetime"
                    placeholder="请选择"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" :model="form" :rules="rules" ref="orderForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="订单物料码：" prop="orderMaterialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderMaterialsCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="配车物料码：" prop="allocationMaterialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.allocationMaterialsCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDealerName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="交车VIN码：" prop="deliveryVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryVin"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="整车订单状态：">
                  {{ form.vehicleOrderStatusLabel || '-' }}
                </el-form-item>
                <el-form-item label="商城下单时间：">
                  {{ form.mallOrderTime }}
                </el-form-item>
                <el-form-item label="商城订单编号：">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="订单来源：">
                  {{ form.orderSource || '-' }}
                </el-form-item>
                <el-form-item label="用户ID：">
                  {{ form.userId }}
                </el-form-item>
                <el-form-item label="购车人姓名：">
                  {{ form.buyerName }}
                </el-form-item>
                <el-form-item label="购车人手机：">
                  {{ form.buyerPhone }}
                </el-form-item>
                <el-form-item label="证件类型：">
                  {{ form.idTypeLabel || '-' }}
                </el-form-item>
                <el-form-item label="证件号码：">
                  {{ form.idNumber }}
                </el-form-item>
                <el-form-item label="代办联系人：">
                  {{ form.agentContact }}
                </el-form-item>
                <el-form-item label="补贴后价格：">
                  {{ form.discountedPrice }}
                </el-form-item>
                <el-form-item label="定金金额：">
                  {{ form.depositAmount }}
                </el-form-item>
                <el-form-item label="交车时间：">
                  {{ form.deliveryTime }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="订单物料码：">
                  {{ form.orderMaterialsCode }}
                </el-form-item>
                <el-form-item label="配车物料码：">
                  {{ form.allocationMaterialsCode }}
                </el-form-item>
                <el-form-item label="销售门店：">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="交付门店：">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="交车VIN码：">
                  {{ form.deliveryVin }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 申请信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>申请信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="applyForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="申请人：" prop="applicant">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applicant"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="申请时间：" prop="applicationTime">
                  <el-date-picker
                    v-model="form.applicationTime"
                    type="datetime"
                    placeholder="请选择"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  <el-date-picker
                    v-model="form.submitTime"
                    type="datetime"
                    placeholder="请选择"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="申请人：">
                  {{ form.applicant }}
                </el-form-item>
                <el-form-item label="申请时间：">
                  {{ form.applicationTime }}
                </el-form-item>
                <el-form-item label="提交时间：">
                  {{ form.submitTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <!-- 审批明细 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>审批明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="approvalTableRef"
                  stripe
                  :data="approvalDetailList"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="operationStatusLabel" title="操作状态" min-width="120" />
                  <vxe-column field="operationDescription" title="操作描述" min-width="200" />
                  <vxe-column field="operator" title="操作人" min-width="120" />
                  <vxe-column field="operationTime" title="操作时间" min-width="180" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无审批明细</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
        </el-main>
        <auditDialog ref="auditInput" @audit="handleAuditSubmit" :auditTitle='getAuditTitle()'/>

        <!-- 审核人员弹窗 -->
        <el-dialog
          title="审核人员"
          :visible.sync="auditorDialogVisible"
          width="60%"
          min-height="70%"
          :modal-append-to-body="false"
          :before-close="handleAuditorDialogClose"
          class="dialog-with-table"
        >
          <vxe-table
            ref="auditorTableRef"
            :data="auditorList"
            height="400"
            stripe
            :resizable="true"
          >
            <vxe-column field="auditorName" title="用户名" min-width="150" align="center"></vxe-column>
            <vxe-column field="auditorOrgName" title="业务部门" min-width="200" align="center"></vxe-column>
          </vxe-table>
        </el-dialog>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <div style="padding: 20px;">
          <h3>申请概况</h3>
          <div style="margin-top: 10px; padding: 15px; background: #f5f7fa; border-radius: 4px;">
            <div><strong>申请单号:</strong> {{ form.code || '-' }}</div>
            <div style="margin-top: 8px;"><strong>申请状态:</strong> {{ form.auditStatusLabel }}</div>
            <div style="margin-top: 8px;"><strong>销售门店:</strong> {{ form.dealerName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>合作类型:</strong> {{ form.cooperationTypeLabel || '-' }}</div>
            <div style="margin-top: 8px;"><strong>商城订单号:</strong> <el-link type="primary" @click="handleViewMallOrderDetail">{{ form.mallOrderCode || '-' }}</el-link></div>
            <div style="margin-top: 8px;"><strong>购车人:</strong> {{ form.buyerName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>公司名称:</strong> {{ form.companyName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>优惠金额:</strong> {{ form.discountAmount || '-' }}</div>
          </div>
        </div>
      </div>
    </template>

  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, submit, invalid, firstApprove, secondApprove, finalApprove, selectedVehicleOrderValid, queryAuditor, queryStepInfo } from '@/api/vehretail/orderManager/vrGroupbuyOrderEquityApply/index';
import { getList as getApprovalDetailList } from '@/api/vehretail/orderManager/vrGroupbuyOrderEquityApplyLog/index';
import { getMatchingCompanyNamesBySeries as getEnterprisePolicyList } from '@/api/vehretail/orderManager/vrGroupbuyEnterprisePolicy/index';
import { getList as getRetailOrderList, getDetail as getRetailOrderDetail } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import auditDialog from '@/libs/components/auditDialog';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import FetchSelect from '@/libs/components/FetchSelect';
import NavTop from './components/NavTop';

const defaultForm = {
  id: '',
  creator: null,
  creatorName: '',
  createTime: '',
  modifier: null,
  modifierName: '',
  updateTime: '',
  remark: '',
  status: null,
  statusDesc: '',
  dataSource: null,
  code: '',
  ownerOrgId: null,
  dealerName: '',
  dealerCode: '',
  cooperationType: '',
  regionName: '',
  companyName: '',
  discountAmount: null,
  couponName: '',
  materialsCode: '',
  materialsDesc: '',
  vehicleOrderStatus: '',
  mallOrderTime: '',
  mallOrderCode: '',
  orderSource: '',
  userId: '',
  buyerName: '',
  buyerPhone: '',
  idNumber: '',
  idType: '',
  agentContact: '',
  discountedPrice: null,
  depositAmount: null,
  deliveryTime: '',
  orderMaterialsCode: '',
  allocationMaterialsCode: '',
  saleDealerCode: '',
  deliveryDealerCode: '',
  deliveryVin: '',
  applicant: '',
  applicantId: '',
  applicationTime: '',
  submitTime: '',
  auditStatus: null,
  vehicleOrderNo: '',
  seriesId: null,
  regionCode: null,
  modelId: null,
  modelName: '',
  seriesName: '',
  materialsId: null,
  permissions: {},
};

export default {
  name: 'vrGroupbuyOrderEquityApplyEdit',
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
    auditDialog,
    AisAttachment,
    FetchSelect,
    NavTop
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '团购订单权益申请编号：' + (this.form.code || '');
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '团购订单权益申请',
      pageType: 'edit',
      moduleKey: 'AISVR-vrGroupbuyOrderEquityApply',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      approvalDetailList: [],
      stepInfoList: [],
      isShowAuditorBtn: false,
      auditorList: [],
      auditorDialogVisible: false, // 审核人员弹窗可见性
      buttonType: 1,
      rules: {
        companyName: [
          { required: true, message: '请选择公司名称', trigger: 'change' }
        ],
        mallOrderCode: [
          { required: true, message: '请选择商城订单号', trigger: 'change' }
        ]
      },
      attachmentList: [
        { label: '近6个月内社保或公积金或纳税证明', required: true, configCode: 'default', attachType: '默认' },
        { label: '工作证或工作证明（需加盖公章）', required: true, configCode: 'vr_groupbuy_order_equity_apply', attachType: '工作证明' },
        { label: '购车人在所属单位门口处与公司门头合影照片', required: true, configCode: 'vr_groupbuy_order_equity_apply', attachType: '工作照' },
        { label: '户口本（户主页）', required: false, configCode: 'vr_groupbuy_order_equity_apply', attachType: '直系亲属证明（户主页）' },
        { label: '户口本（本人页）', required: false, configCode: 'vr_groupbuy_order_equity_apply', attachType: '直系亲属证明（本人页）' },
        { label: '派出所出具的直系亲属证明材料', required: false, configCode: 'vr_groupbuy_order_equity_apply', attachType: '直系亲属证明' },
        { label: '结婚证', required: false, configCode: 'vr_groupbuy_order_equity_apply', attachType: '结婚证' }
      ]
    };
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
  mounted () {
    if (this._id) {
      this.getStepInfo(this._id);
      this.getApprovalDetail(this._id);
    }
  },
  methods: {
    async detailRequest () {
      const id = this._id;
      if (id) {
        const detail = await getDetail(id);
        this.fillOrderInfo(detail.retailOrderId);
        this.getStepInfo(this._id);
        this.getApprovalDetail(this._id);
        return detail;
      }
    },
    async submitRequest () {
      // 校验基础信息表单
      const ruleFormValid = await this.$refs.ruleForm.validate().catch(() => false);
      if (!ruleFormValid) {
        throw new Error('基础信息表单校验失败');
      }

      // 校验公司信息表单
      const companyFormValid = await this.$refs.companyForm.validate().catch(() => false);
      if (!companyFormValid) {
        throw new Error('公司信息表单校验失败');
      }

      if (this.isEditing) {
        this.handleConfirm();
      }

      return addOrUpdate({ ...this.form });
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    getAuditTitle () {
      if (this.form.auditStatus === 30 || this.form.auditStatus === '30') {
        return '初审';
      }
      if (this.form.auditStatus === 40 || this.form.auditStatus === '40') {
        return '复审';
      }
      return '终审';
    },
    // 查看审核人员
    handleViewAuditUsers () {
      try {
        this.auditorDialogVisible = true;
        queryAuditor({
          cooperationType: this.form.cooperationType,
          auditStatus: this.form.auditStatus
        }).then(res => {
          this.auditorList = res.auditorList || [];
        });
      } catch (error) {
        this.$message.error('获取审核人员失败：' + (error.message || '未知错误'));
      }
    },

    // 审核人员弹窗相关方法
    handleAuditorDialogClose () {
      this.auditorDialogVisible = false;
    },
    // 公司下拉
    async getEnterpriseList (value) {
      const result = await getEnterprisePolicyList({
        pageNum: 1,
        pageSize: 20,
        companyName: value,
        seriesId: this.form.seriesId,
      });
      return result || [];
    },

    // 商城订单号下拉
    async getRetailOrderListByNo (query = '') {
      const result = await getRetailOrderList({
        mallOrderCode: query,
        pageSize: 20
      });
      return result;
    },

    // 处理商城订单号选择变化
    async handleMallOrderCodeChange (value, record) {
      try {
        await selectedVehicleOrderValid({
          mallOrderCode: value,
          excludeSelf: Boolean(this._id)
        });
      } catch (error) {
        this.form.mallOrderCode = '';
        return;
      }
      this.fillOrderInfo(record.id);
    },

    // 处理公司选择变化
    handleCompanyChange (value, record) {
      this.fillCompanyInfo(record);
    },

    // 作废
    async handleCancel () {
      this.$confirm('确认要作废此申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await invalid(this._id);
        this.$message.success('作废成功');
        this.$refs.containerRef.loadDetail();
      });
    },
    // 提交审批
    async handleSubmitApproval () {
      this.handleConfirm();
      this.$confirm('确认要提交审批吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await submit(this._id);
        this.$message.success('提交成功');
        this.$refs.containerRef.loadDetail();
      });
    },
    handleConfirm () {
      // 校验必填项
      const missingRequired = [];
      this.attachmentList.forEach((item, index) => {
        if (item.required) {
          const refName = 'attachment' + index;
          const fileLength = this.$refs[refName]?.[0]?.getFileList?.()?.length || 0;
          if (fileLength === 0) {
            missingRequired.push(item.label);
          }
        }
      });

      if (missingRequired.length > 0) {
        this.$message.error(`以下必填项未上传：${missingRequired.join('、')}`);
        throw new Error(`以下必填项未上传：${missingRequired.join('、')}`);
      }

      this.$emit('confirm');
    },
    // 审批
    async handleAudit (value) {
      this.buttonType = value;
      this.$refs.auditInput.show();
    },
    async handleAuditSubmit (data) {
      const req = {
        id: this._id,
        isAudit: data.result,
        auditOpinion: data.content || data.remark
      };
      if (this.buttonType === 1) {
        await firstApprove(req);
      } else if (this.buttonType === 2) {
        await secondApprove(req);
      } else {
        await finalApprove(req);
      }
      this.$message.success('审核成功');
      this.$refs.containerRef.loadDetail();
    },
    // 获取审批明细
    getApprovalDetail (id) {
      getApprovalDetailList({ groupbuyOrderEquityApplyId: id }).then(res => {
        this.approvalDetailList = res.records || [];
      });
    },
    // 获取流程步骤信息
    getStepInfo (id) {
      queryStepInfo(id).then(res => {
        this.stepInfoList = res.stepInfoList || [];
        this.isShowAuditorBtn = res.isShowAuditorBtn;
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 根据订单号填充订单信息
    async fillOrderInfo (id) {
      // 根据商城订单号获取订单详情
      if (!id) {
        return;
      }
      const orderInfo = await getRetailOrderDetail(
        id,
      );
      // 填充订单相关字段（公司信息除外）
      this.$set(this.form, 'ownerOrgId', orderInfo?.saleOrgId || '');
      this.$set(this.form, 'vehicleOrderNo', orderInfo?.retailOrderCode || '');
      this.$set(this.form, 'orderMaterialsCode', orderInfo?.materials?.materialsCode || '');
      this.$set(this.form, 'dealerName', orderInfo?.saleDealerName || '');
      this.$set(this.form, 'dealerCode', orderInfo?.saleDealerCode || '');
      this.$set(this.form, 'cooperationType', orderInfo?.cooperationType || '');
      this.$set(this.form, 'cooperationTypeLabel', orderInfo?.cooperationTypeLabel || '');
      this.$set(this.form, 'regionCode', orderInfo?.regionCode || '');
      this.$set(this.form, 'regionName', orderInfo?.regionName || '');
      this.$set(this.form, 'modelId', orderInfo?.materials?.modelId || '');
      this.$set(this.form, 'modelName', orderInfo?.materials?.modelName || '');
      this.$set(this.form, 'seriesId', orderInfo?.materials?.seriesId || '');
      this.$set(this.form, 'seriesName', orderInfo?.materials?.seriesName || '');
      this.$set(this.form, 'buyerName', orderInfo?.carOwner?.carBuyerName || '');
      this.$set(this.form, 'buyerPhone', orderInfo?.carOwner?.carBuyerPhone || '');
      this.$set(this.form, 'userId', orderInfo?.orderUserId || '');
      this.$set(this.form, 'materialsCode', orderInfo?.materials?.materialsCode || '');
      this.$set(this.form, 'materialsId', orderInfo?.materials?.materialsId || '');
      this.$set(this.form, 'materialsDesc', orderInfo?.materialsDesc || '');
      this.$set(this.form, 'vehicleOrderStatus', orderInfo?.orderStatus || '');
      this.$set(this.form, 'vehicleOrderStatusLabel', orderInfo?.orderStatusLabel || '');
      this.$set(this.form, 'orderSource', orderInfo?.orderSource || '');
      this.$set(this.form, 'mallOrderTime', orderInfo?.orderTime || '');
      this.$set(this.form, 'idType', orderInfo?.carOwner?.idCardType);
      this.$set(this.form, 'idTypeLabel', orderInfo?.carOwner?.idCardTypeLabel);
      this.$set(this.form, 'idNumber', orderInfo?.carOwner?.idCardNo);
      this.$set(this.form, 'discountedPrice', orderInfo?.guidePrice);
      this.$set(this.form, 'depositAmount', orderInfo?.depositAmount);
      this.$set(this.form, 'deliveryTime', orderInfo?.deliveryTime);
      this.$set(this.form, 'allocationMaterialsCode', orderInfo?.allocationMaterialCode);
      this.$set(this.form, 'saleDealerCode', orderInfo?.saleDealerCode);
      this.$set(this.form, 'saleDealerName', orderInfo?.saleDealerName);
      this.$set(this.form, 'deliveryDealerCode', orderInfo?.deliveryDealerCode);
      this.$set(this.form, 'deliveryDealerName', orderInfo?.deliveryDealerName);
      this.$set(this.form, 'deliveryVin', orderInfo?.deliveryVin);
      this.$set(this.form, 'agentContact', orderInfo?.carOwner?.agentName);
    },

    // 根据公司信息填充公司字段
    async fillCompanyInfo (companyInfo) {
      this.$set(this.form, 'companyName', companyInfo?.companyName || '');
      this.$set(this.form, 'discountAmount', companyInfo?.discountAmount || null);
      this.$set(this.form, 'couponName', companyInfo?.couponName || '');
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
