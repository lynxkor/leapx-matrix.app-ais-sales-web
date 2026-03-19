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
          <span class="status primary"> {{ form.auditStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if = "form.permissions.cancel" size="small" @click="handleViewAuditUsers">查看审核人员</el-button>
          <el-button v-if = "form.permissions.cancel" size="small" @click="handleCancel">作废</el-button>
          <el-button v-if = "form.permissions.submit" size="small" @click="handleSubmitApproval">提交审批</el-button>
          <el-button v-if = "form.permissions.audit" size="small" @click="handleAudit">审核</el-button>
          <el-button v-if = "form.permissions.auditRevoke" size="small" @click="handleRecall">审核撤回</el-button>
        </template>
        <el-main>
          <!-- 审核步骤条 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-body">
              <div v-for="(step, index) in stepInfoList" :key="index" class="step-wrapper">
                <div class="step-item" :class="getStepClassByStepInfo(step.status, step.isCome)">
                  <div class="step-circle">{{ index + 1 }}</div>
                  <div class="step-label">{{ step.name }}</div>
                </div>
                <div v-if="index < stepInfoList.length - 1" class="step-line" :class="getLineClassByStepInfo(step.status, step.isCome)"></div>
              </div>
            </div>
          </section>

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
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="合作类型：">
                  {{ form.cooperationTypeLabel || '-' }}
                </el-form-item>
                <el-form-item label="车型：">
                  {{ form.modelName || '-' }}
                </el-form-item>
                <el-form-item label="车系：">
                  {{ form.seriesName || '-' }}
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
                  {{ form.dealerName }}
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
                    :request="getEnterpriseList"
                    v-model="form.companyName"
                    placeholder="请选择公司"
                    clearable
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
                  />
                </el-form-item>
                <el-form-item label="优惠券：" prop="couponName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.couponName"
                    clearable
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
              <AisAttachment
                :businessId="_id"
                attachType="团购订单权益申请附件"
                configCode="vr_groupbuy_order_equity_apply"
                :readonly="!(isEditing || !_id)"
              />
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
                  {{ form.materialsDesc }}
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
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_order_source"
                    v-model="form.orderSource"
                    placeholder="请选择"
                    clearable
                    filterable
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
                    enumCode="vr_id_type"
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
                  />
                </el-form-item>
                <el-form-item label="交车时间：" prop="deliveryTime">
                  <el-date-picker
                    v-model="form.deliveryTime"
                    type="datetime"
                    placeholder="请选择"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
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
                    v-model="form.saleDealerCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDealerCode"
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
                  {{ form.orderSourceLabel || '-' }}
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
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="交付门店：">
                  {{ form.deliveryDealerCode }}
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
                  <vxe-column field="operationStatus" title="操作状态" min-width="120" />
                  <vxe-column field="operationDesc" title="操作描述" min-width="200" />
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
import { getDetail, addOrUpdate, submit, invalid, approve, selectedVehicleOrderValid, queryAuditor, queryStepInfo } from '@/api/vehretail/orderManager/vrGroupbuyOrderEquityApply/index';
import { getList as getApprovalDetailList } from '@/api/vehretail/orderManager/vrGroupbuyOrderEquityApplyLog/index';
import { getMatchingCompanyNamesBySeries as getEnterprisePolicyList } from '@/api/vehretail/orderManager/vrGroupbuyEnterprisePolicy/index';
import { getList as getRetailOrderList } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import auditDialog from '@/libs/components/auditDialog';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import FetchSelect from '@/libs/components/FetchSelect';

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
    FetchSelect
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
      pageTitle: '整车零售-订单管理-团购订单权益申请管理',
      pageType: 'edit',
      moduleKey: 'AISVR-vrGroupbuyOrderEquityApply',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      approvalDetailList: [],
      stepInfoList: [],
      auditorList: [],
      rules: {
        companyName: [
          { required: true, message: '请选择公司名称', trigger: 'change' }
        ],
        mallOrderCode: [
          { required: true, message: '请选择商城订单号', trigger: 'change' }
        ]
      }
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
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        const detail = getDetail(id);
        this.getApprovalDetailList();
        this.getStepInfo(id);
        return detail;
      }
    },
    submitRequest () {
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
    async handleViewAuditUsers () {
      this.auditorList = await queryAuditor({
        cooperationType: this.form.cooperationType,
        auditStatus: null,
        dealerCode: this.form.dealerCode
      }) || [];
    },
    // 公司下拉
    async getEnterpriseList () {
      const result = await getEnterprisePolicyList({
        pageNum: 1,
        pageSize: 20,
        companyName: this.form.companyName,
        seriesId: this.form.seriesId,
      });
      return result;
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
      selectedVehicleOrderValid({
        mallOrderCode: value,
        excludeSelf: this._id
      });
      this.fillOrderInfo(record);
    },

    // 处理公司选择变化
    async handleCompanyChange (value, record) {
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
    // 审批
    async handleAudit () {
      this.$refs.auditInput.show();
    },
    async handleAuditSubmit (data) {
      await approve({
        id: this._id,
        isAudit: data.result,
        auditStatus: this.form.auditStatus,
        auditOpinion: data.content || data.remark
      });
      this.$message.success('审核成功');
      this.$refs.containerRef.loadDetail();
    },
    // 获取审批明细
    async getApprovalDetailList () {
      this.approvalDetailList = await getApprovalDetailList({ groupbuyOrderEquityApplyId: this._id }) || [];
    },
    // 获取流程步骤信息
    async getStepInfo (id) {
      this.stepInfoList = (await queryStepInfo({ id }))?.stepInfoList || [];
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 根据订单号填充订单信息
    async fillOrderInfo (orderInfo) {
      // 填充订单相关字段（公司信息除外）
      this.$set(this.form, 'vehicleOrderNo', orderInfo?.vehicleOrderNo || '');
      this.$set(this.form, 'orderMaterialsCode', orderInfo?.orderMaterialsCode || '');
      this.$set(this.form, 'dealerName', orderInfo?.dealerName || '');
      this.$set(this.form, 'cooperationType', orderInfo?.cooperationType || '');
      this.$set(this.form, 'modelName', orderInfo?.modelName || '');
      this.$set(this.form, 'seriesName', orderInfo?.seriesName || '');
      this.$set(this.form, 'buyerName', orderInfo?.buyerName || '');
      this.$set(this.form, 'buyerPhone', orderInfo?.buyerPhone || '');
      this.$set(this.form, 'userId', orderInfo?.userId || '');
      this.$set(this.form, 'materialsDesc', orderInfo?.materialsDesc || '');
      this.$set(this.form, 'vehicleOrderStatus', orderInfo?.vehicleOrderStatus || '');
      this.$set(this.form, 'mallOrderTime', orderInfo?.mallOrderTime || '');
      this.$set(this.form, 'orderSource', orderInfo?.orderSource);
      this.$set(this.form, 'idType', orderInfo?.idType);
      this.$set(this.form, 'idNumber', orderInfo?.idNumber);
      this.$set(this.form, 'discountedPrice', orderInfo?.discountedPrice);
      this.$set(this.form, 'depositAmount', orderInfo?.depositAmount);
      this.$set(this.form, 'deliveryTime', orderInfo?.deliveryTime);
      this.$set(this.form, 'allocationMaterialsCode', orderInfo?.allocationMaterialsCode);
      this.$set(this.form, 'saleDealerCode', orderInfo?.saleDealerCode);
      this.$set(this.form, 'deliveryDealerCode', orderInfo?.deliveryDealerCode);
      this.$set(this.form, 'deliveryVin', orderInfo?.deliveryVin);
      this.$set(this.form, 'agentContact', orderInfo?.agentContact);
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
