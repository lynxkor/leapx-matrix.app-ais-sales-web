<template>
  <edit-page-layout ref="editLayout" title="订单权益申请详情" showPaneFooter>
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
      >
        <template #status>
          <span class="status primary"> {{ form.auditStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button size="small" @click="auditLog">申请记录</el-button>
          <el-button size="small" @click="handleCancel">作废</el-button>
          <el-button size="small" @click="handleSubmitApproval">提交审批</el-button>
          <el-button size="small" @click="handleAudit">审核</el-button>
          <el-button size="small" @click="handleRecall">审核撤回</el-button>
        </template>
        <el-main>
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="订单权益申请单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="商城订单号：" prop="mallOrderNo">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.mallOrderNo"
                    :remote-method="getRetailOrderListByNo"
                    value-key="mallOrderCode"
                    label-key="mallOrderCode"
                    placeholder="请选择商城订单号"
                    @change="handleMallOrderNoChange"
                  />
                </el-form-item>
                <el-form-item label="整车订单编号：" prop="vehicleOrderNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleOrderNo"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="原车VIN号：" prop="originalVin">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.originalVin"
                    :remote-method="getOriginalVinList"
                    value-key="vin"
                    label-key="vin"
                    placeholder="请选择原车VIN号"
                    :disabled="form.replacementType === 20"
                    @change="handleOriginalVinChange"
                  />
                </el-form-item>
                <el-form-item label="权益大类：" prop="equityCategoryName">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.equityCategoryId"
                    :remote-method="getEquityCategoryList"
                    value-key="id"
                    label-key="name"
                    placeholder="请选择权益大类"
                    @change="handleEquityCategoryChange"
                  />
                </el-form-item>
                <el-form-item label="置换类型：" prop="replacementType" v-show="form.equityCategoryName === '增换购券' || form.equityCategoryName === '新标专项'">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_order_benefit_replacement_type"
                    v-model="form.replacementType"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="handleReplacementTypeChange"
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
                <el-form-item label="其他品牌：" prop="otherBrand">
                  <el-input
                    placeholder="请输入"
                    v-model="form.otherBrand"
                    clearable
                    :disabled="form.replacementType === 10"
                    maxlength="50"
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
                <el-form-item label="订单权益申请单号：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="商城订单号：">
                  {{ form.mallOrderNo }}
                </el-form-item>
                <el-form-item label="整车订单编号：">
                  {{ form.vehicleOrderNo }}
                </el-form-item>
                <el-form-item label="原车VIN号：">
                  {{ form.originalVin }}
                </el-form-item>
                <el-form-item label="权益大类：">
                  {{ form.equityCategoryName }}
                </el-form-item>
                <el-form-item label="置换类型：">
                  {{ form.replacementTypeLabel }}
                </el-form-item>
                <el-form-item label="优惠金额：">
                  {{ form.discountAmount }}
                </el-form-item>
                <el-form-item label="其他品牌：">
                  {{ form.otherBrand }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="提交人：">
                  {{ form.submitterName }}
                </el-form-item>
                <el-form-item label="提交时间：">
                  {{ form.submitTime }}
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
                attachType="订单权益申请附件"
                configCode="vr_equity_apply"
                :readonly="!(isEditing || !_id)"
              />
            </div>
          </section>

          <!-- 订单信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>订单信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="orderForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="商城订单编号：" prop="mallOrderNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderNo"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="缴定金时间：" prop="depositTime">
                  <el-date-picker
                    v-model="form.depositTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="锁单时间：" prop="lockTime">
                  <el-date-picker
                    v-model="form.lockTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
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
                <el-form-item label="购车人证件类型：" prop="buyerIdType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="form.buyerIdType"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="购车人证件号码：" prop="buyerIdNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.buyerIdNumber"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="下单人ID：" prop="orderUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderUserId"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
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
                <el-form-item label="所属区域：" prop="regionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="商城订单编号：">
                  {{ form.mallOrderNo }}
                </el-form-item>
                <el-form-item label="缴定金时间：">
                  {{ form.depositTime }}
                </el-form-item>
                <el-form-item label="锁单时间：">
                  {{ form.lockTime }}
                </el-form-item>
                <el-form-item label="代办联系人：">
                  {{ form.agentContact }}
                </el-form-item>
                <el-form-item label="购车人姓名：">
                  {{ form.buyerName }}
                </el-form-item>
                <el-form-item label="购车人手机号码：">
                  {{ form.buyerPhone }}
                </el-form-item>
                <el-form-item label="购车人证件类型：">
                  {{ form.buyerIdTypeLabel }}
                </el-form-item>
                <el-form-item label="购车人证件号码：">
                  {{ form.buyerIdNumber }}
                </el-form-item>
                <el-form-item label="下单人ID：">
                  {{ form.orderUserId }}
                </el-form-item>
                <el-form-item label="销售门店：">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="合作类型：">
                  {{ form.cooperationTypeLabel }}
                </el-form-item>
                <el-form-item label="所属区域：">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="省：">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：">
                  {{ form.cityName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 订单物料信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>订单物料信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="materialsForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="订单物料码：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsDesc"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="基本车系：" prop="seriesName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="基本车型：" prop="modelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="车辆年型：" prop="vehicleYearType">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleYearType"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="选装包：" prop="optionPackageName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.optionPackageName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="订单物料码：">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="物料描述：">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="基本车系：">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="基本车型：">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="车辆年型：">
                  {{ form.vehicleYearType }}
                </el-form-item>
                <el-form-item label="选装包：">
                  {{ form.optionPackageName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 放发信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>发放信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="issueForm" label-width="150px" class="form-edit" v-show="isEditing || !_id || canEditIssue">
                <el-form-item label="是否发放：" prop="isIssued">
                  <fetch-select
                    :options="yes_no_enum"
                    v-model="form.isIssued"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="预计发放日期：" prop="expectedIssueDate">
                  <el-date-picker
                    v-model="form.expectedIssueDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item label="发放类型：" prop="issueType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_order_benefit_issue_type"
                    v-model="form.issueType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id || canEditIssue)">
                <el-form-item label="是否发放：">
                  {{ form.isIssuedLabel }}
                </el-form-item>
                <el-form-item label="预计发放日期：">
                  {{ form.expectedIssueDate }}
                </el-form-item>
                <el-form-item label="发放类型：">
                  {{ form.issueTypeLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 跨月权益 -->
          <!-- <section class="common-section" v-if="form.equityCategoryName === '跨月权益'"> -->
          <section class="common-section" >
            <div class="common-section-header">
              <h2>跨月权益</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="benefitForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="原权益享受日期：" prop="originalBenefitDate">
                  <el-date-picker
                    v-model="form.originalBenefitDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="变更后权益日期：" prop="changedBenefitDate">
                  <el-date-picker
                    v-model="form.changedBenefitDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="OA流程编号：" prop="oaProcessNo">
                  <el-input
                    placeholder="请输入OA流程编号"
                    v-model="form.oaProcessNo"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="原权益享受日期：">
                  {{ form.originalBenefitDate }}
                </el-form-item>
                <el-form-item label="变更后权益日期：">
                  {{ form.changedBenefitDate }}
                </el-form-item>
                <el-form-item label="OA流程编号：">
                  {{ form.oaProcessNo }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 原车车主信息 -->
          <!-- <section class="common-section" v-if="form.replacementType === 10 && (form.equityCategoryName === '新标专项' || form.equityCategoryName === '增值换购')"> -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>原车车主信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ownerForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="原车车主姓名：" prop="originalOwnerName">
                  <el-input
                    placeholder="请输入原车车主姓名"
                    v-model="form.originalOwnerName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="原车车主手机号：" prop="originalOwnerPhone">
                  <el-input
                    placeholder="请输入原车车主手机号"
                    v-model="form.originalOwnerPhone"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="原车主证件类型：" prop="originalOwnerIdType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="form.originalOwnerIdType"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="原车主证件号码：" prop="originalOwnerIdNumber">
                  <el-input
                    placeholder="请输入原车主证件号码"
                    v-model="form.originalOwnerIdNumber"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="原车物料码：" prop="originalMaterialsCode">
                  <el-input
                    placeholder="请输入原车物料码"
                    v-model="form.originalMaterialsCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="基本车型：" prop="originalModelName">
                  <el-input
                    placeholder="请输入基本车型"
                    v-model="form.originalModelName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="原车车主姓名：">
                  {{ form.originalOwnerName }}
                </el-form-item>
                <el-form-item label="原车车主手机号：">
                  {{ form.originalOwnerPhone }}
                </el-form-item>
                <el-form-item label="原车主证件类型：">
                  {{ form.originalOwnerIdTypeLabel }}
                </el-form-item>
                <el-form-item label="原车主证件号码：">
                  {{ form.originalOwnerIdNumber }}
                </el-form-item>
                <el-form-item label="原车物料码：">
                  {{ form.originalMaterialsCode }}
                </el-form-item>
                <el-form-item label="基本车型：">
                  {{ form.originalModelName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 审批信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="初审人：">
                  {{ form.firstAuditorName }}
                </el-form-item>
                <el-form-item label="初审时间：">
                  {{ form.firstAuditTime }}
                </el-form-item>
                <el-form-item label="初审意见：">
                  {{ form.firstAuditOpinion }}
                </el-form-item>
                <el-form-item label="审核人：">
                  {{ form.auditorName }}
                </el-form-item>
                <el-form-item label="审核时间：">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="审核意见：">
                  {{ form.auditOpinion }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <div style="padding: 20px;">
          <h3>申请概况</h3>
          <div style="margin-top: 10px; padding: 15px; background: #f5f7fa; border-radius: 4px;">
            <div><strong>申请单号:</strong> {{ form.code || '-' }}</div>
            <div style="margin-top: 8px;"><strong>申请状态:</strong> {{ form.auditStatusLabel || '-' }}</div>
            <div style="margin-top: 8px;"><strong>商城订单:</strong> {{ form.mallOrderNo || '-' }}</div>
            <div style="margin-top: 8px;"><strong>权益大类:</strong> {{ form.equityCategoryName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>置换类型:</strong> {{ form.replacementTypeLabel || '-' }}</div>
            <div style="margin-top: 8px;"><strong>优惠金额:</strong> {{ form.discountAmount || '-' }}</div>
            <div style="margin-top: 8px;"><strong>销售门店:</strong> {{ form.saleDealerName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>提交时间:</strong> {{ form.submitTime || '-' }}</div>
          </div>
        </div>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, selectedVehicleOrderValid, submit, approve, invalid, cancelApprove, cancelApproveValid, approveRecord } from '@/api/vehretail/orderManager/vrEquityApply/index';
import { getList as getRetailOrderList, getDetail as getRetailOrderDetail } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import { listByAuth as getEquityCategoryListApi } from '@/api/vehretail/basicConfig/vrEquityCategory/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { getList as getVehicleProfileList } from '@/api/datacenter/vehicle/vehicleProfile/index.js';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
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
  mallOrderNo: '',
  vehicleOrderNo: '',
  originalVin: '',
  equityCategoryId: null,
  equityCategoryName: '',
  replacementType: null,
  discountAmount: null,
  otherBrand: '',
  submitterUserId: '',
  submitterName: '',
  submitTime: '',
  depositTime: '',
  lockTime: '',
  agentContact: '',
  buyerName: '',
  buyerPhone: '',
  buyerIdType: null,
  buyerIdNumber: '',
  orderUserId: '',
  saleDealerName: '',
  saleDealerCode: '',
  cooperationType: null,
  regionName: '',
  provinceName: '',
  cityName: '',
  materialsCode: '',
  materialsDesc: '',
  seriesName: '',
  seriesId: '',
  modelName: '',
  modelId: '',
  vehicleYearType: '',
  vehicleYearTypeId: '',
  optionPackageName: '',
  optionPackageId: '',
  isIssued: null,
  expectedIssueDate: '',
  issueType: null,
  originalBenefitDate: '',
  changedBenefitDate: '',
  oaProcessNo: '',
  originalOwnerName: '',
  originalOwnerPhone: '',
  originalOwnerIdType: null,
  originalOwnerIdNumber: '',
  originalMaterialsCode: '',
  originalModelName: '',
  originalModelId: '',
  firstAuditorName: '',
  firstAuditorUserId: '',
  firstAuditTime: '',
  firstAuditOpinion: '',
  auditorName: '',
  auditorUserId: '',
  auditTime: '',
  auditOpinion: '',
  auditStatus: null
};

export default {
  name: 'vrEquityApplyEdit',
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
    AisAttachment,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '订单权益申请单号：' + (this.form.code || '');
    },
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
      pageTitle: '整车零售-订单管理-订单权益申请管理',
      pageType: 'edit',
      moduleKey: 'AISVR-vrEquityApply',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      yes_no_enum_map: {},
      form: { ...form },
      originalForm: { ...form },
      fileList: [],
      rules: {
        code: [
          { required: false, message: '请输入订单权益申请单号', trigger: 'change' }
        ],
        mallOrderNo: [
          { required: true, message: '请输入商城订单号', trigger: 'change' }
        ],
        vehicleOrderNo: [
          { message: '请输入整车订单编号', trigger: 'change' }
        ],
        originalVin: [
          { required: true, message: '请选择原车VIN号', trigger: 'change' }
        ],
        equityCategoryId: [
          { required: true, message: '请选择权益大类', trigger: 'change' }
        ],
        replacementType: [
          { required: false, message: '请选择置换类型', trigger: 'change' }
        ],
        discountAmount: [
          { required: true, message: '请输入优惠金额', trigger: 'change' },
          { type: 'number', min: 0, max: 100000000000, message: '输入一个介于 0.00 到 100,000,000,000.00 之间的值', trigger: 'blur' }
        ],
        buyerName: [
          { message: '请输入购车人姓名', trigger: 'change' }
        ],
        buyerPhone: [
          { message: '请输入购车人手机号码', trigger: 'change' }
        ],
        saleDealerName: [
          { message: '请输入销售门店', trigger: 'change' }
        ],
        materialsCode: [
          { message: '请输入订单物料码', trigger: 'change' }
        ],
        otherBrand: [
          { max: 50, message: '其他品牌不能超过50个字符', trigger: 'blur' }
        ],
        remark: [
          { max: 1000, message: '备注不能超过1000个字符', trigger: 'blur' }
        ],
        oaProcessNo: [
          { required: true, message: '请输入OA流程编号', trigger: 'blur' },
        ]
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
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async handleCancel () {
      this.$confirm('确认要作废此申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await invalid({ id: this.form.id });
          this.$message.success('作废成功');
          this.$refs.containerRef.loadDetail();
        } catch (error) {
          this.$message.error('作废失败：' + (error.message || '未知错误'));
        }
      });
    },
    async handleSubmitApproval () {
      this.$confirm('确认要提交审批吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await submit({ id: this.form.id });
          this.$message.success('提交成功');
          this.$refs.containerRef.loadDetail();
        } catch (error) {
          this.$message.error('提交失败：' + (error.message || '未知错误'));
        }
      });
    },
    async handleAudit () {
      this.$confirm('确认要审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await approve({ id: this.form.id });
          this.$message.success('审核成功');
          this.$refs.containerRef.loadDetail();
        } catch (error) {
          this.$message.error('审核失败：' + (error.message || '未知错误'));
        }
      });
    },
    async handleRecall () {
      try {
        // 先进行撤回审批验证
        await cancelApproveValid({ id: this.form.id });

        this.$confirm('撤回后将无法恢复，请确认是否撤回', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            await cancelApprove({ id: this.form.id });
            this.$message.success('撤回成功');
            this.$refs.containerRef.loadDetail();
          } catch (error) {
            this.$message.error('撤回失败：' + (error.message || '未知错误'));
          }
        });
      } catch (error) {
        this.$message.error('撤回验证失败：' + (error.message || '未知错误'));
      }
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },

    // 获取零售订单列表
    async getRetailOrderListByNo (query = '') {
      return await getRetailOrderList({
        mallOrderCode: query,
        pageSize: 20
      });
    },

    // 获取权益类别列表
    async getEquityCategoryList () {
      return await getEquityCategoryListApi(
        { orderStatus: this.form.orderStatus }
      );
    },

    // 获取原车VIN列表
    async getOriginalVinList (query = '') {
      return await getVehicleProfileList({
        searchVin: query,
        pageSize: 20
      });
    },

    // 权益大类变化时的处理
    async handleEquityCategoryChange (categoryId, record) {
      try {
        await this.validateSelectedVehicleOrder();
        this.form.equityCategoryName = record?.name || '';
      } catch (error) {
        console.error('获取权益分类信息失败:', error);
        this.$message.error('获取权益分类信息失败');
      }
    },

    // 置换类型变化时的处理
    async handleReplacementTypeChange (replacementType) {
      await this.validateSelectedVehicleOrder();
    },

    // 商城订单号变化时的处理
    async handleMallOrderNoChange (value, record) {
      // 校验选中的整车订单是否有效
      await this.validateSelectedVehicleOrder();
      this.form.equityCategoryId = null;
      this.form.equityCategoryName = '';
      this.form.orderId = record?.id || null;

      // 根据商城订单号获取订单详情
      const order = await getRetailOrderDetail(
        this.form.orderId,
      );
      // 更新订单相关信息
      this.form.mallOrderNo = order.mallOrderCode || '';
      this.form.vehicleOrderNo = order.retailOrderCode || '';
      this.form.depositTime = order.paymentTime || '';
      this.form.lockTime = order.lockTime || '';
      this.form.agentContact = order.carOwner.agentName || '';
      this.form.buyerName = order.carOwner.carBuyerName || '';
      this.form.buyerPhone = order.carOwner.carBuyerPhone || '';
      this.form.buyerIdType = order.carOwner.idCardType || '';
      this.form.buyerIdNumber = order.carOwner.idCardNo || '';
      this.form.orderUserId = order.orderUserId || '';
      this.form.ownerOrgId = order.saleOrgId || '';
      this.form.saleDealerName = order.saleDealerName || '';
      this.form.saleDealerCode = order.saleDealerCode || '';
      this.form.cooperationType = order.cooperationType || '';
      this.form.regionName = order.regionName || '';
      this.form.provinceName = order.provinceName || '';
      this.form.cityName = order.cityName || '';
      this.form.materialsId = order.materials.materialsId || '';
      this.form.materialsCode = order.materials.materialsCode || '';
      this.form.materialsDesc = order.materials.materialsDesc || '';
      this.form.seriesName = order.materials.seriesName || '';
      this.form.seriesId = order.materials.seriesId || '';
      this.form.modelName = order.materials.modelName || '';
      this.form.modelId = order.materials.modelId || '';
      this.form.vehicleYearType = order.materials.yearTypeName || '';
      this.form.vehicleYearTypeId = order.materials.yearTypeId || '';
      this.form.optionPackageId = order.materials.optionPackageId || '';
      this.form.optionPackageName = order.materials.optionPackageName || '';
      this.form.orderStatus = order.orderStatus || null;
      this.form.originalBenefitDate = order.rightsEnjoyDate || '';
    },

    // 校验选中的整车订单是否有效
    async validateSelectedVehicleOrder () {
      // 检查三个关键字段是否都有值
      if (!this.form.mallOrderNo || !this.form.equityCategoryId || !this.form.replacementType) {
        return;
      }
      try {
        // 调用校验接口
        await selectedVehicleOrderValid({
          mallOrderNo: this.form.mallOrderNo,
          equityCategoryId: this.form.equityCategoryId,
          replacementType: this.form.replacementType
        });
      } catch (error) {
        // 显示错误消息
        const errorMessage = error.message || '整车订单校验失败，请检查选择的商城订单号、权益大类和置换类型组合是否有效';
        this.$message.error(errorMessage);
      }
    },

    // 原车VIN号变化时的处理
    async handleOriginalVinChange (query, record) {
      // if (this.form.replacementType === 10 && (this.form.equityCategoryName === '新标专项' || this.form.equityCategoryName === '增值换购')) {
        this.form.originalVinId = record.id || '';
        this.form.originalOwnerName = record.vehicleProfileOwnerResp.ownerName || '';
        this.form.originalOwnerPhone = record.vehicleProfileOwnerResp.mobilephone || '';
        this.form.originalOwnerIdType = record.vehicleProfileOwnerResp.idcardType || '';
        this.form.originalOwnerIdNumber = record.vehicleProfileOwnerResp.idcardNo || '';
        this.form.originalMaterialsCode = record.vehicleMaterialCode || '';
        this.form.originalMaterialsId = record.vehicleMaterialId || '';
        this.form.originalModelName = record.vehicleModelName || '';
        this.form.originalModelId = record.vehicleModelId || '';
      // }
    },

    // 查看申请记录
    async auditLog () {
      try {
        const records = await approveRecord({ id: this.form.id });
        // 这里可以打开一个弹窗显示审批记录
        this.$alert(JSON.stringify(records, null, 2), '审批记录', {
          confirmButtonText: '确定',
          type: 'info',
          dangerouslyUseHTMLString: true
        });
      } catch (error) {
        this.$message.error('获取审批记录失败：' + (error.message || '未知错误'));
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.page-common-edit {
  h3 {
    margin: 0 0 15px;
    font-size: 16px;
  }
}
</style>
