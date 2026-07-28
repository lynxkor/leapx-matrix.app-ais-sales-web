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
        :showEditBtn="form.permissions.edit && perEdit"
      >
        <template #status>
          <span v-if="form.auditStatus === 10" class="status link">{{ form.auditStatusLabel }}</span>
          <span v-else-if="form.auditStatus === 20 || form.auditStatus === 70" class="status danger">{{ form.auditStatusLabel }}</span>
          <span v-else-if="[30, 40, 50, 60].includes(form.auditStatus)" class="status success">{{ form.auditStatusLabel }}</span>
          <span v-else class="status success">{{ form.auditStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button size="small" @click="auditLog">申请记录</el-button>
          <el-button v-if = "form.permissions.cancel && perCancel" size="small" @click="handleCancel">作废</el-button>
          <el-button v-if = "form.permissions.submit && perSubmit" size="small" :loading="submitLoading" :disabled="submitLoading" @click="handleSubmitApproval">提交审批</el-button>
          <el-button v-if = "form.permissions.firstAudit && perFirstAudit" size="small" @click="handleAudit(1)">初审</el-button>
          <el-button v-if = "form.permissions.audit && perAudit" size="small" @click="handleAudit(2)">审核</el-button>
          <el-button v-if = "form.permissions.auditRevoke && perAuditRevoke" size="small" @click="handleRecall">审核撤回</el-button>
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
                    :disabled="!form.permissions.draft && isEditing"
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
                <el-form-item label="原车VIN号：" prop="originalVin" v-if="form.replacementType == 10 || form.replacementType == '10'">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.originalVin"
                    :remote-method="getOriginalVinList"
                    value-key="vin"
                    label-key="vin"
                    placeholder="请选择原车VIN号"
                    :disabled="!form.permissions.draft  && isEditing"
                    @change="handleOriginalVinChange"
                  />
                </el-form-item>
                <el-form-item label="权益大类：" prop="equityCategoryId">
                  <template v-if="!form.permissions.draft && isEditing">
                    <el-input
                      placeholder="请输入"
                      v-model="form.equityCategoryName"
                      :disabled="true"
                    />
                  </template>
                  <template v-else>
                    <fetch-select
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      :options="equityCategoryOptions"
                      v-model="form.equityCategoryId"
                      :param="form.equityCategoryName"
                      value-key="id"
                      label-key="name"
                      placeholder="请选择权益大类"
                      @change="handleEquityCategoryChange"
                      :disabled="!form.permissions.draft && isEditing"
                    />
                  </template>
                </el-form-item>
                <el-form-item label="置换类型：" prop="replacementType" v-if="form.equityCategoryName === '增换购券'">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_order_benefit_replacement_type"
                    v-model="form.replacementType"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="handleReplacementTypeChange"
                    :disabled="!form.permissions.draft && isEditing"
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
                    :disabled="form.equityCategoryName === '跨月权益' || !form.permissions.draft && isEditing"
                  />
                </el-form-item>
                <el-form-item label="其他品牌：" prop="otherBrand">
                  <el-input
                    placeholder="请输入"
                    v-model="form.otherBrand"
                    clearable
                    :disabled="form.replacementType == 10 || form.equityCategoryName === '跨月权益' || !form.permissions.draft && isEditing"
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
                    :disabled="!form.permissions.draft && isEditing"
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
                <el-form-item label="原车VIN号：" v-if="form.replacementType == 10 || form.replacementType == '10'">
                  {{ form.originalVin }}
                </el-form-item>
                <el-form-item label="权益大类：">
                  {{ form.equityCategoryName }}
                </el-form-item>
                <el-form-item label="置换类型：" v-if="form.equityCategoryName === '增换购券'">
                  {{ form.replacementTypeLabel }}
                </el-form-item>
                <el-form-item label="优惠金额：">
                  {{ form.discountAmount !== null && form.discountAmount !== undefined ? parseFloat(form.discountAmount).toFixed(2) : '' }}
                </el-form-item>
                <el-form-item label="其他品牌：">
                  {{ form.otherBrand }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="提交人：">
                  <!-- <el-link
                    v-if="form.submitterUserId"
                    type="primary"
                    :underline="false"
                    @click="$userDialog.show({ userId: form.submitterUserId })"
                  >{{ form.submitterName }}</el-link>
                  <span v-else>{{ form.submitterName }}</span> -->
                  {{ form.submitterName }}
                </el-form-item>
                <el-form-item label="提交时间：">
                  {{ form.submitTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 原车车主信息 -->
          <section class="common-section" v-if="form.replacementType == 10 || form.replacementType == '10'" >
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

          <!-- 附件材料 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>附件材料</h2>
            </div>
            <div class="common-section-body">
              <AisAttachment
                :ref="'attachment'"
                :businessId="_id"
                attachType="附件"
                configCode="mcs_equityapply"
                :readonly="!(isEditing || !_id) || !form.permissions.draft"
                :uploadConfig = {required:true}
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
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.saleDealerCode}`" target="_blank">{{ form.saleDealerName }}</el-link>
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
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${form.materialsCode}`" target="_blank">{{ form.materialsCode }}</el-link>
                </el-form-item>
                <el-form-item label="物料描述：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${form.materialsCode}`" target="_blank">{{ form.materialsDesc }}</el-link>
                </el-form-item>
                <el-form-item label="基本车系：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleSeries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName }}</el-link>
                </el-form-item>
                <el-form-item label="基本车型：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleModel/edit?id=${form.modelId}`" target="_blank">{{ form.modelName }}</el-link>
                </el-form-item>
                <el-form-item label="车辆年型：">
                  {{ form.vehicleYearType }}
                </el-form-item>
                <el-form-item label="选装包：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleOptionPackage/edit?id=${form.optionPackageId}`" target="_blank">{{ form.optionPackageName }}</el-link>
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
              <el-form :inline="true" :model="form" :rules="rules" ref="issueForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="是否发放：" prop="isIssued">
                  <fetch-select
                    :options="yes_no_enum"
                    v-model="form.isIssued"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="!form.permissions.editIssue"
                  />
                </el-form-item>
                <el-form-item label="预计发放日期：" prop="expectedIssueDate">
                  <el-date-picker
                    v-model="form.expectedIssueDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :disabled="!form.permissions.editIssue"
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
                    :disabled="!form.permissions.editIssue"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
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
          <section class="common-section" v-if="form.equityCategoryName === '跨月权益'">
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
                    :disabled="!form.permissions.draft  && isEditing"
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
        <auditDialog ref="auditInput" @audit="handleAuditSubmit" :auditTitle='form.auditStatus === 30 ? "初审" : "审核"'/>
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
            <div style="margin-top: 8px;"><strong>优惠金额:</strong> {{ form.discountAmount !== null && form.discountAmount !== undefined ? parseFloat(form.discountAmount).toFixed(2) : '-' }}</div>
            <div style="margin-top: 8px;"><strong>销售门店:</strong> {{ form.saleDealerName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>提交时间:</strong> {{ form.submitTime || '-' }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- 申请记录弹窗 -->
    <el-dialog
      title="申请记录"
      :visible.sync="logDialogVisible"
      width="60%"
      min-height="70%"
      :modal-append-to-body="false"
      :before-close="handleLogDialogClose"
      class="dialog-with-table"
    >
      <vxe-table
        ref="logTableRef"
        v-loading="logLoading"
        :data="logOptionObj.dataList"
        height="400"
        stripe
        :resizable="true"
      >
        <vxe-column type="seq" title="序号" width="80" fixed="left"></vxe-column>
        <vxe-column field="submitTime" title="提交时间" min-width="150"></vxe-column>
        <vxe-column field="auditStatusLabel" title="申请单状态" min-width="100"></vxe-column>
        <vxe-column field="equityCategoryName" title="权益大类" min-width="100"></vxe-column>
        <vxe-column field="replacementTypeLabel" title="置换类型" min-width="100"></vxe-column>
        <vxe-column field="discountAmount" title="优惠金额" min-width="100" :formatter="formatDiscountAmount"></vxe-column>
        <vxe-column field="isIssuedLabel" title="是否发放" min-width="100"></vxe-column>
        <vxe-column field="expectedIssueDate" title="发放日期" min-width="120"></vxe-column>
        <vxe-column field="issueTypeLabel" title="发放类型" min-width="100"></vxe-column>
      </vxe-table>
    </el-dialog>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, selectedVehicleOrderValid, submit, approve, firstApprove, invalid, cancelApprove, cancelApproveValid, approveRecord } from '@/api/vehretail/orderManager/vrEquityApply/index';
import { getList as getRetailOrderList, getBaseInfo as getRetailOrderDetail } from '@/api/vehretail/orderManager/retailOrderInfo/index';
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
import auditDialog from '@/libs/components/auditDialog';
import { formatDateTime } from '@/libs/utils';

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
  auditStatus: null,
  permissions: {}
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
    FetchSelect,
    auditDialog
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
  mounted () {
    this.getEquityCategoryList();
    this.initPermissions();
    this.initMallOrderCodeFromQuery();
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '订单权益申请',
      pageType: 'edit',
      moduleKey: 'AISVR-vrEquityApply',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      yes_no_enum_map: {},
      form: { ...form },
      originalForm: { ...form },
      perEdit: false,
      perCancel: false,
      perSubmit: false,
      perFirstAudit: false,
      perAudit: false,
      perAuditRevoke: false,
      fileList: [],
      equityCategoryOptions: [], // 权益类别选项列表
      logDialogVisible: false,
      logLoading: false,
      buttonType: 1,
      logOptionObj: {
        id: 'vrEquityApplyRecordTable',
        dataList: [],
        total: 0
      },
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
          { required: false, validator: this.validateOriginalVin, trigger: 'change' }
        ],
        equityCategoryId: [
          { required: true, message: '请选择权益大类', trigger: 'change' }
        ],
        replacementType: [
          { required: true, message: '请选择置换类型', trigger: 'change' }
        ],
        discountAmount: [
          { required: false, validator: this.validateDiscountAmount, trigger: 'change' },
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
          { required: false, validator: this.validateOtherBrand, trigger: 'blur' },
          { max: 50, message: '其他品牌不能超过50个字符', trigger: 'blur' }
        ],
        remark: [
          { max: 1000, message: '备注不能超过1000个字符', trigger: 'blur' }
        ],
        oaProcessNo: [
          { required: false, validator: this.validateOaProcessNo, trigger: 'blur' },
        ]
      }
    };
  },
  methods: {
    async detailRequest () {
      const id = this._id;
      if (id) {
        // 先加载权益类别选项，确保FetchSelect能正确显示
        await this.getEquityCategoryList();
        const detail = await getDetail(id);
        return detail;
      }
    },
    async submitRequest () {
      // 对于跨月权益，需要校验OA流程编号不能为空
      if (this.form.equityCategoryName === '跨月权益' && !this.form.oaProcessNo) {
        this.$message.error('跨月权益类型的申请必须填写OA流程编号');
        throw new Error('请填写OA流程编号');
      }

      if (this.isEditing) {
        const allFiles = this.$refs.attachment.getFileList();
        console.log('总附件数:', allFiles.length);
        if (allFiles.length === 0) {
          this.$message.error('附件不能为空！');
          throw new Error('附件不能为空！');
        }
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
    async handleSubmitApproval () {
      if (this.submitLoading) return;
      const allFiles = this.$refs.attachment.getFileList();
      console.log('总附件数:', allFiles.length);
      if (allFiles.length === 0) {
        this.$message.error('附件不能为空！');
        throw new Error('附件不能为空！');
      }
      this.submitLoading = true;
      this.$confirm('确认要提交审批吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await submit(this._id);
        this.$message.success('提交成功');
        this.$refs.containerRef.loadDetail();
      }).catch(err => {
        console.error('提交审批失败:', err);
      }).finally(() => {
        this.submitLoading = false;
      });
    },
    async handleAudit (value) {
      this.buttonType = value;
      this.$refs.auditInput.show();
    },

    async handleAuditSubmit (data) {
      if (this.buttonType === 1) {
        await firstApprove({
          id: this._id,
          isAudit: data.result,
          auditOpinion: data.content || data.remark
        });
      } else {
        await approve({
          id: this._id,
          isAudit: data.result,
          auditOpinion: data.content || data.remark
        });
      }
      this.$message.success('审核成功');
      this.$refs.containerRef.loadDetail();
    },
    async handleRecall () {
      // 先进行撤回审批验证
      await cancelApproveValid(this._id);
      this.$confirm('撤回后将无法恢复，请确认是否撤回', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await cancelApprove(this._id);
        this.$message.success('撤回成功');
        this.$refs.containerRef.loadDetail();
      });
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

    // 根据整车订单号从零售订单列表中匹配记录
    async findRecordByRetailOrderCode (retailOrderCode) {
      const result = await getRetailOrderList({
        retailOrderCode,
        pageSize: 20
      });
      const records = result?.records || result || [];
      return records.find(r => r.retailOrderCode === retailOrderCode) || null;
    },

    // 根据商城订单号从远程列表中匹配记录
    async findMallOrderRecord (mallOrderCode) {
      const result = await this.getRetailOrderListByNo(mallOrderCode);
      const records = result?.records || result || [];
      return records.find(r => r.mallOrderCode === mallOrderCode) || null;
    },

    // 处理 URL 上携带的 mallOrderCode / retailOrderCode 查询参数：回填并触发选中逻辑
    async initMallOrderCodeFromQuery () {
      // 优先使用 mallOrderCode；如果没有，再尝试 retailOrderCode 反查
      let mallOrderCode = this.$route.query.mallOrderCode;
      if (!mallOrderCode) {
        const retailOrderCode = this.$route.query.retailOrderCode;
        if (!retailOrderCode) {
          return;
        }
        const record = await this.findRecordByRetailOrderCode(retailOrderCode);
        if (record && record.mallOrderCode) {
          mallOrderCode = record.mallOrderCode;
        } else {
          this.$message.warning('未找到该整车订单号对应的商城订单，请重新选择');
          return;
        }
      }
      this.$set(this.form, 'mallOrderNo', mallOrderCode);
      try {
        const record = await this.findMallOrderRecord(mallOrderCode);
        if (record) {
          await this.handleMallOrderNoChange(mallOrderCode, record);
        } else {
          this.$message.warning('未找到该商城订单号对应的订单，请重新选择');
        }
      } catch (error) {
        // 校验失败时 handleMallOrderNoChange 内部已清空 mallOrderNo
      }
    },

    // 获取权益类别列表
    async getEquityCategoryList () {
      const response = await getEquityCategoryListApi(
        { orderStatus: this.form.orderStatus }
      );
      const options = Array.isArray(response) ? response : (response.records || []);
      // 更新本地存储的选项
      this.equityCategoryOptions = options;
      return options;
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
      this.form.equityCategoryName = record?.name || '';
      await this.validateSelectedVehicleOrder();
      // 清空原车信息
      this.form.originalVin = '';
      this.form.originalOwnerName = '';
      this.form.originalOwnerPhone = '';
      this.form.originalOwnerIdType = null;
      this.form.originalOwnerIdNumber = '';
      this.form.originalMaterialsCode = '';
      this.form.originalModelName = '';
      this.form.originalModelId = '';
      this.form.originalVinId = '';
      this.form.originalMaterialsId = '';
      // 清空置换类型
      this.form.replacementType = '';
      this.form.otherBrand = '';
      this.form.discountAmount = '';
    },

    // 置换类型变化时的处理
    async handleReplacementTypeChange (replacementType) {
      await this.validateSelectedVehicleOrder();
      if (replacementType === '10' || replacementType === 10) {
        this.form.otherBrand = '';
      } else if (replacementType === '20' || replacementType === 20) {
        this.form.originalVin = '';
        this.form.originalOwnerName = '';
        this.form.originalOwnerPhone = '';
        this.form.originalOwnerIdType = null;
        this.form.originalOwnerIdNumber = '';
        this.form.originalMaterialsCode = '';
        this.form.originalModelName = '';
        this.form.originalModelId = '';
        this.form.originalVinId = '';
        this.form.originalMaterialsId = '';
      }
    },

    // 商城订单号变化时的处理
    async handleMallOrderNoChange (value, record) {
      // 校验选中的整车订单是否有效
      await this.validateSelectedVehicleOrder();
      this.form.equityCategoryId = null;
      this.form.equityCategoryName = '';
      this.form.orderId = record?.id || null;

      // 根据商城订单号获取订单详情
      let order = null;
      if (record) {
        order = await getRetailOrderDetail(
          { retailOrderId: this.form.orderId }
        );
      }
      // 更新订单相关信息
      this.form.mallOrderNo = order?.orderInfo?.mallOrderCode || '';
      this.form.vehicleOrderNo = order?.orderInfo?.retailOrderCode || '';
      this.form.depositTime = order?.orderFund?.paymentTime || '';
      this.form.lockTime = order?.orderInfo?.lockTime || '';
      this.form.agentContact = order?.orderCarOwner?.agentName || '';
      this.form.buyerName = order?.orderCarOwner?.carBuyerName || '';
      this.form.buyerPhone = order?.orderCarOwner?.carBuyerPhone || '';
      this.form.buyerIdType = order?.orderCarOwner?.idCardType || '';
      this.form.buyerIdNumber = order?.orderCarOwner?.idCardNo || '';
      this.form.orderUserId = order?.orderInfo?.orderUserId || '';
      this.form.ownerOrgId = order?.orderInfo?.saleOrgId || '';
      this.form.saleDealerName = order?.orderInfo?.saleDealerName || '';
      this.form.saleDealerCode = order?.orderInfo?.saleDealerCode || '';
      this.form.cooperationType = order?.orderInfo?.cooperationType || '';
      this.form.regionName = order?.orderInfo?.regionName || '';
      this.form.provinceName = order?.orderInfo?.provinceName || '';
      this.form.cityName = order?.orderInfo?.cityName || '';
      this.form.materialsId = order?.orderMaterials?.materialsId || '';
      this.form.materialsCode = order?.orderMaterials?.materialsCode || '';
      this.form.materialsDesc = order?.orderMaterials?.materialsDesc || '';
      this.form.seriesName = order?.orderMaterials?.seriesName || '';
      this.form.seriesId = order?.orderMaterials?.seriesId || '';
      this.form.modelName = order?.orderMaterials?.modelName || '';
      this.form.modelId = order?.orderMaterials?.modelId || '';
      this.form.vehicleYearType = order?.orderMaterials?.yearTypeName || '';
      this.form.vehicleYearTypeId = order?.orderMaterials?.yearTypeId || '';
      this.form.optionPackageId = order?.orderMaterials?.optionPackageId || '';
      this.form.optionPackageName = order?.orderMaterials?.optionPackageName || '';
      this.form.orderStatus = order?.orderInfo?.orderStatus || null;
      this.form.originalBenefitDate = order?.orderInfo?.rightsEnjoyDate ? formatDateTime(order.orderInfo.rightsEnjoyDate, 'data') : '';
      // 重新查询权益类别列表，更新下拉框选项
      await this.getEquityCategoryList();
    },

    // 校验选中的整车订单是否有效
    async validateSelectedVehicleOrder () {
      // 检查三个关键字段是否都有值
      // 注意：权益大类为跨月权益时，置换类型可能为空，所以排除这种情况
      if (!this.form.mallOrderNo || !this.form.equityCategoryId ||
          (!this.form.replacementType && this.form.equityCategoryName === '增换购券')) {
        return;
      }
      // 调用校验接口
      await selectedVehicleOrderValid({
        mallOrderNo: this.form.mallOrderNo,
        equityCategoryId: this.form.equityCategoryId,
        replacementType: this.form.replacementType,
        excludeSelf: Boolean(this._id)
      });
    },

    // 原车VIN号变化时的处理
    async handleOriginalVinChange (query, record) {
      if (this.form.replacementType === 10 || this.form.replacementType === '10') {
        this.form.originalVinId = record.id || '';
        this.form.originalOwnerName = record.vehicleProfileOwnerResp.ownerName || '';
        this.form.originalOwnerPhone = record.vehicleProfileOwnerResp.mobilephone || '';
        this.form.originalOwnerIdType = record.vehicleProfileOwnerResp.idcardType || '';
        this.form.originalOwnerIdNumber = record.vehicleProfileOwnerResp.idcardNo || '';
        this.form.originalMaterialsCode = record.vehicleMaterialCode || '';
        this.form.originalMaterialsId = record.vehicleMaterialId || '';
        this.form.originalModelName = record.vehicleModelName || '';
        this.form.originalModelId = record.vehicleModelId || '';
      }
    },

    formatDiscountAmount ({ cellValue }) {
      if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
        return parseFloat(cellValue).toFixed(2);
      }
      return '-';
    },

    // 查看申请记录
    async auditLog () {
      try {
        this.logDialogVisible = true;
        this.getLogData();
      } catch (error) {
        this.$message.error('获取审批记录失败：' + (error.message || '未知错误'));
      }
    },

    // 日志弹窗相关方法
    handleLogDialogClose () {
      this.logDialogVisible = false;
    },

    async getLogData () {
      this.logLoading = true;

      try {
        // 获取申请记录列表
        const response = await approveRecord(this._id);

        // 处理返回的数据，因为API返回的是列表
        let records = [];
        if (Array.isArray(response)) {
          records = response;
        } else if (response && response.records) {
          records = response.records;
        } else {
          records = [];
        }
        this.logOptionObj.dataList = records;

        this.logOptionObj.total = this.logOptionObj.dataList.length;
      } catch (error) {
        this.$message.error('获取申请记录失败：' + (error.message || '未知错误'));
        this.logOptionObj.dataList = [];
        this.logOptionObj.total = 0;
      } finally {
        this.logLoading = false;
      }
    },

    // 自定义验证规则：当其他品牌不禁用时，必须填写
    validateOtherBrand (rule, value, callback) {
      // 当置换类型不是10时，其他品牌字段是启用状态，此时为必填
      if (this.form.replacementType === 20 || this.form.replacementType === '20') {
        if (!value || value.trim() === '') {
          callback(new Error('其他品牌不能为空'));
        } else {
          callback();
        }
      } else {
        // 当置换类型是10时，字段被禁用，不需要验证
        callback();
      }
    },

    // 自定义验证规则：当优惠金额不禁用时，必须填写
    validateDiscountAmount (rule, value, callback) {
      // 当权益类别为'跨月权益'或没有draft权限时，字段被禁用，不需要验证
      if (this.form.equityCategoryName === '跨月权益' || !this.form.permissions.draft) {
        callback(); // 不进行验证
      } else {
        // 字段处于启用状态，需要验证是否为空
        if (!value && value !== 0) {
          callback(new Error('请输入优惠金额'));
        } else {
          // 验证数字格式，参考已有的验证规则
          if (typeof value === 'number' && value >= 0 && value <= 100000000000) {
            callback();
          } else if (typeof value === 'string' && !isNaN(Number(value))) {
            const numValue = Number(value);
            if (numValue >= 0 && numValue <= 100000000000) {
              callback();
            } else {
              callback(new Error(rule.message || '输入一个介于 0.00 到 100,000,000,000.00 之间的值'));
            }
          } else {
            callback(new Error(rule.message || '输入一个介于 0.00 到 100,000,000,000.00 之间的值'));
          }
        }
      }
    },

    // 自定义验证规则：当原车VIN号不禁用时，必须填写
    validateOriginalVin (rule, value, callback) {
      // 当置换类型不是20时，原车VIN号字段是启用状态，此时为必填
      if (this.form.replacementType === '10' || this.form.replacementType === 10) {
        console.log('validateOriginalVin called with value:', value, 'replacementType:', this.form.replacementType);
        if (!value || value.trim() === '') {
          callback(new Error('请选择原车VIN号'));
        } else {
          callback();
        }
      } else {
        // 当置换类型是20时，字段被禁用，不需要验证
        callback();
      }
    },

    // 自定义验证规则：当权益类别为跨月权益时，OA流程编号为必填
    validateOaProcessNo (rule, value, callback) {
      // 当权益类别为跨月权益且字段处于可编辑状态时，OA流程编号为必填
      if (this.form.equityCategoryName === '跨月权益' && this.form.permissions.draft) {
        if (!value || value.trim() === '') {
          callback(new Error(rule.message || '请输入OA流程编号'));
        } else {
          callback();
        }
      } else {
        // 其他情况下不需要验证
        callback();
      }
    },

    initPermissions () {
      this.perEdit = this.permissions.has(`${this.moduleKey}-addOrUpdate`);
      this.perCancel = this.permissions.has(`${this.moduleKey}-invalid`);
      this.perSubmit = this.permissions.has(`${this.moduleKey}-submit`);
      this.perFirstAudit = this.permissions.has(`${this.moduleKey}-firstApprove`);
      this.perAudit = this.permissions.has(`${this.moduleKey}-approve`);
      this.perAuditRevoke = this.permissions.has(`${this.moduleKey}-cancelApprove`);
    }

  }
};
</script>

<style lang="scss" scoped>
// .page-common-edit {
//   h3 {
//     margin: 0 0 15px;
//     font-size: 16px;
//   }
// }

// ::v-deep .dialog-with-table {
//   .el-dialog {
//     margin-top: 6vh !important;
//     height: 70vh;
//     min-height: 500px;
//     display: flex;
//     flex-direction: column;

//     .el-dialog__body {
//       flex: 1;
//       overflow: auto;
//       padding: 10px 20px !important;
//       display: flex;
//       flex-direction: column;

//       .ais-table-c {
//         flex: 1;
//         min-height: 400px;
//         display: flex;
//         flex-direction: column;

//         .vxe-table--render-wrapper {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//         }

//         .vxe-table--main-wrapper {
//           flex: 1;
//           min-height: 350px;
//         }

//         .vxe-table--footer-wrapper {
//           flex-shrink: 0;
//         }
//       }
//     }
//   }
// }
</style>
