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
        :showEditBtn="form.refundStatus === 1010 || form.refundStatus === 1040 || form.refundStatus === 1030"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
          <el-button
            @click="openCancelShow"
            v-if="canCancel && (form.refundStatus === 1010 || form.refundStatus === 1040)"
            size="small">
            作废
          </el-button>
          <el-button
            @click="openCommitShow"
            v-if="canCommit && (form.refundStatus === 1010 || form.refundStatus === 1040)">
            提交审批
          </el-button>
          <el-button
            @click="openPreAuditShow"
            v-if="canPreApprove && form.refundStatus === 1020"
          >
            初审
          </el-button>
          <el-button
            @click="openAuditShow"
            v-if="canApprove && form.refundStatus === 1025"
          >
            审核
          </el-button>
          <el-button
            @click="openFinalAuditShow"
            v-if="canFinalApprove && form.refundStatus === 1027"
          >
            终审
          </el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="(isEditing || !_id) && form.refundStatus !== 1030">
                <!-- 第1行：商城订单编号 | 整车订单 | 基本车型 -->
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  <fetch-select
                    v-bind="selectOptions"
                    :remote-method="retailOrderSearch"
                    v-model="form.mallOrderCode"
                    @change="retailOrderChange"
                    :disabled="form.id && form.id.length > 0"
                  />
                </el-form-item>
                <el-form-item label="整车订单：" prop="retailOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderCode"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="基本车型：" prop="modelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <!-- 第2行：退订原因分类 | 退订原因说明 | 订单物料码 | 退订方式 -->
                <el-form-item label="退订原因分类：" prop="cateCode">
                  <fetch-select
                    v-bind="selectCategoryOptions"
                    :remote-method="changeCategorySearch"
                    v-model="form.cateCode"
                    @change="changeCategoryChange"
                  />
                </el-form-item>
                <el-form-item label="退订原因说明：" prop="refundReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundReason"
                    type="textarea"
                    :disabled="!form.refundReasonChanged || form.refundReasonChanged === 0"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单物料码：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="退订方式：" prop="orderRefundType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="order_refund_type"
                    v-model="form.orderRefundType"
                    placeholder="请选择"
                    disabled
                    clearable
                    filterable
                  />
                </el-form-item>
                <!-- 第3行：定金退回方式 | 是否有陪伴礼 | 是否停产 | 数据来源 -->
                <el-form-item label="定金退回方式：" prop="depositRefundType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="order_fund_return_type"
                    v-model="form.depositRefundType"
                    placeholder="请选择"
                    :disabled="form.refundTypeSelect !== 1"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否有陪伴礼：" prop="enjoyGift">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.enjoyGift"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否停产：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.discontinueStatusLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="dataSource"
                    v-model="form.dataSource"
                    placeholder="请选择"
                    disabled
                    clearable
                    filterable
                  />
                </el-form-item>
                <!-- 第4行：银行开户名 | 陪伴礼账号 | 销售门店 -->
                <el-form-item
                  v-show="form.depositRefundType === '15'"
                  label="银行开户名：" prop="refundBankUser"
                  :rules="form.depositRefundType === '15' ? rules.refundBankUser: []">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundBankUser"
                    :disabled="form.depositRefundType !== '15'"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="陪伴礼账号：" prop="enjoyGiftAccount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.enjoyGiftAccount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <!-- 第5行：退款银行 | 大区 | 省 | 市 -->
                <el-form-item
                  v-show="form.depositRefundType === '15'"
                  label="退款银行：" prop="refundBank"
                  :rules="form.depositRefundType === '15' ? rules.refundBank: []">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundBank"
                    :disabled="form.depositRefundType !== '15'"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceName"
                    clearable
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
                <!-- 第6行：退款银行账号 | 原因二级分类 | 特殊备注 | 退订附件上传要求 -->
                <el-form-item
                  v-show="form.depositRefundType === '15'"
                  label="退款银行账号："
                  prop="refundBankAccount"
                  :rules="form.depositRefundType === '15' ? rules.refundBankAccount: []">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundBankAccount"
                    :disabled="form.depositRefundType !== '15'"
                    clearable
                  />
                </el-form-item>
                <el-form-item v-if="subCateShow" label="原因二级分类：" prop="subCateName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.subCateName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item v-if="specRemarkShow" label="特殊备注：" prop="specialRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.specialRemark"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="退订附件上传要求：" prop="refundAttachRequired">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundAttachRequired"
                    type="textarea"
                    disabled
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id) || (isEditing && form.refundStatus === 1030)">
                <!-- 第1行：商城订单编号 | 整车订单 | 基本车型 | 申请单状态 -->
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                  <el-button v-if="vrFinanceOrder" size="small" type="primary" plain @click="openFinancialOrderShow">查询金融订单</el-button>
                </el-form-item>
                <el-form-item label="整车订单：" prop="retailOrderCode">
                  <el-button
                    class="link"
                    @click="navigateToRoute({
                      path: '/vehretail/orderManager/retailOrderInfo/edit',
                      query: {
                        id: form.retailOrderId,
                      },
                    })"
                    type="text">{{form.retailOrderCode}}</el-button>
                </el-form-item>
                <el-form-item label="基本车型：" prop="modelName">
                  <el-button
                    class="link"
                    @click="navigateToRoute({
                      path: '/datacenter/materials/vehicleModel/detail',
                      query: {
                        id: form.modelId,
                      }
                    })"
                    type="text">{{form.modelName}}</el-button>
                </el-form-item>
                <el-form-item label="申请单状态：" prop="refundStatusLabel">
                  <span class="status-tag link">{{ form.refundStatusLabel }}</span>
                </el-form-item>
                <!-- 第2行：退订原因分类 | 退订原因说明 | 订单物料码 | 退订方式 -->
                <el-form-item label="退订原因分类：" prop="cateName">
                  {{ form.cateName }}
                </el-form-item>
                <el-form-item label="退订原因说明：" prop="refundReason">
                  {{ form.refundReason }}
                </el-form-item>
                <el-form-item label="订单物料码：" prop="materialsCode">
                  <el-button
                    class="link"
                    @click="navigateToRoute({
                        path: '/datacenter/materials/vehicleMaterials/detail',
                        query: { id: form.materialsId }
                    })"
                    v-if="form.materialsCode"
                    type="text">{{ form.materialsCode }}</el-button>
                  <span v-else>{{ form.materialsCode }}</span>
                  <el-button v-if="vehicleVdcInventoryLedger" size="small" type="primary" plain @click="openVehicleStockShow">查询库存车</el-button>
                </el-form-item>
                <el-form-item label="退订方式：" prop="orderRefundTypeLabel">
                  {{ form.orderRefundTypeLabel }}
                </el-form-item>
                <!-- 第3行：定金退回方式 | 是否有陪伴礼 | 是否停产 | 数据来源 -->
                <el-form-item label="定金退回方式：" prop="depositRefundTypeLabel">
                  {{ form.depositRefundTypeLabel }}
                </el-form-item>
                <el-form-item label="是否有陪伴礼：" prop="enjoyGiftLabel">
                  {{ form.enjoyGiftLabel }}
                </el-form-item>
                <el-form-item label="是否停产：" prop="discontinueStatusLabel">
                  <span :class="['status-tag', form.discontinueStatus === 0 ? 'primary' : 'danger']">{{ form.discontinueStatusLabel}}</span>
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  {{ form.dataSourceLabel }}
                </el-form-item>
                <!-- 第4行：银行开户名 | 陪伴礼账号 | 销售门店 | 创建时间 -->
                <el-form-item label="银行开户名：" prop="refundBankUser">
                  {{ form.refundBankUser }}
                </el-form-item>
                <el-form-item label="陪伴礼账号：" prop="enjoyGiftAccount">
                  {{ form.enjoyGiftAccount }}
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-button
                    class="link"
                    v-if="form.saleDealerName"
                    @click="handleRouteToStoreDetail(form.saleDealerCode)"
                    type="text">{{form.saleDealerName}}</el-button>
                  <span v-else>{{ form.saleDealerName }}</span>
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <!-- 第5行：退款银行 | 大区 | 省 | 市 -->
                <el-form-item label="退款银行：" prop="refundBank">
                  {{ form.refundBank }}
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <!-- 第6行：退款银行账号 | 原因二级分类 | 特殊备注 | 退订附件上传要求 -->
                <el-form-item label="退款银行账号：" prop="refundBankAccount">
                  {{ form.refundBankAccount }}
                </el-form-item>
                <el-form-item v-if="subCateShow" label="原因二级分类：" prop="subCateName">
                  {{ form.subCateName }}
                </el-form-item>
                <el-form-item v-if="specRemarkShow" label="特殊备注：" prop="specialRemark">
                  {{ form.specialRemark }}
                </el-form-item>
                <el-form-item v-if="specRemarkShow" label="退订附件上传要求：" prop="refundAttachRequired">
                  {{ form.refundAttachRequired }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>退订附件</h2>
            </div>
            <div class="common-section-table">
              <!--附件上传组件 -->
              <AisAttachment
                ref="attachment"
                :businessId="_id"
                :readonly="!_id || !(form.refundStatus === 1010 || form.refundStatus === 1040)"
                configCode="mcs_vehorderrefund"
              />
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>订单信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 订单信息 - 编辑表单（全部禁用） -->
              <el-form :inline="true" :model="form" label-width="150px" class="form-edit" v-show="(isEditing || !_id) && (!form.refundStatus || form.refundStatus !== 1030)">
                <!-- 第1行：整车订单状态 | 商城订单编号 | 购车人手机号码 | 订单取消原因 -->
                <el-form-item label="整车订单状态：" prop="orderStatusLabel">
                  <el-input
                    v-model="form.orderStatusLabel"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  <el-input
                    v-model="form.mallOrderCode"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="购车人手机号码：" prop="buyerPhone">
                  <el-input
                    v-model="form.buyerPhone"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单取消原因：" prop="orderCancelReason">
                  <el-input
                    v-model="form.orderCancelReason"
                    disabled
                    clearable
                  />
                </el-form-item>
                <!-- 第2行：销售门店 | 缴定金时间 | 证件类型 | 订单取消说明 -->
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-input
                    v-model="form.saleDealerName"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="缴定金时间：" prop="paymentTime">
                  <el-input
                    v-model="form.paymentTime"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="证件类型：" prop="idCardTypeLabel">
                  <el-input
                    v-model="form.idCardTypeLabel"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item v-if="form.refundStatus === 1030" label="订单取消说明：" prop="orderCancelDescp">
                  <el-input
                    v-model="form.orderCancelDescp"
                    maxlength="100"
                    show-word-limit
                    :disabled="!(form.refundStatus === 1030 && (isEditing || !_id))"
                    clearable
                  />
                </el-form-item>
                <el-form-item v-else label="订单取消说明：" prop="orderCancelDescp">
                  <el-input
                    v-model="form.orderCancelDescp"
                    disabled
                    clearable
                  />
                </el-form-item>
                <!-- 第3行：交付门店 | 购车人名称 | 代办联系人 | 订单取消时间 -->
                <el-form-item label="交付门店：" prop="deliveryDealerName">
                  <el-input
                    v-model="form.deliveryDealerName"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="购车人名称：" prop="buyerName">
                  <el-input
                    v-model="form.buyerName"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="代办联系人：" prop="agentName">
                  <el-input
                    v-model="form.agentName"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单取消时间：" prop="orderCancelTime">
                  <el-input
                    v-model="form.orderCancelTime"
                    disabled
                    clearable
                  />
                </el-form-item>
                <!-- 第4行：定金金额 | 证件号码  | 物料描述 | 订单来源 -->
                <el-form-item label="定金金额：" prop="depositAmount">
                  <el-input
                    v-model="form.depositAmount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="证件号码：" prop="idCardNo">
                  <el-input
                    v-model="form.idCardNo"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  <el-input
                    v-model="form.materialsDesc"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单来源：" prop="orderSource">
                  <el-input
                    v-model="form.orderSource"
                    disabled
                    clearable
                  />
                </el-form-item>
                <!-- 第5行：特殊备注 | 基本车型 -->
                <el-form-item v-if="orderSpecRemarkShow" label="特殊备注：" prop="orderSpecialRemark">
                  <el-input
                    v-model="form.orderSpecialRemark"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="基本车型：" prop="modelName">
                  <el-input
                    v-model="form.modelName"
                    disabled
                    clearable
                  />
                </el-form-item>
              </el-form>
              <!-- 订单信息 - 详情展示 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id) || (isEditing && form.refundStatus === 1030)">
                <!-- 第1行：整车订单状态 | 商城订单编号 | 购车人手机号码 | 订单取消原因 -->
                <el-form-item label="整车订单状态：" prop="orderStatus">
                  <span class="status-tag link">{{ form.orderStatusLabel }}</span>
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="购车人手机号码：" prop="buyerPhone">
                  <!-- <LPEncrypted
                    :value.sync="form.buyerPhone"
                    :decryptMethod="() => form.buyerPhone"
                  > -->
                    {{ form.buyerPhone }}
                  <!-- </LPEncrypted> -->
                </el-form-item>
                <el-form-item label="订单取消原因：" prop="orderCancelReason">
                  {{ form.orderCancelReason }}
                </el-form-item>
                <!-- 第2行：销售门店 | 缴定金时间 | 证件类型 | 订单取消说明 -->
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-button
                    class="link"
                    @click="handleRouteToStoreDetail(form.saleDealerCode)"
                    type="text">{{form.saleDealerName}}</el-button>
                </el-form-item>
                <el-form-item label="缴定金时间：" prop="paymentTime">
                  {{ form.paymentTime }}
                </el-form-item>
                <el-form-item label="证件类型：" prop="idCardTypeLabel">
                  {{ form.idCardTypeLabel }}
                </el-form-item>
                <el-form-item v-show="canOrderCancelDescp && form.refundStatus === 1030 && (isEditing || !_id)" label="订单取消说明：" prop="orderCancelDescp">
                  <el-input
                    placeholder="请输入"
                    maxlength="100"
                    show-word-limit
                    v-model="form.orderCancelDescp"
                    clearable
                  />
                </el-form-item>
                <el-form-item v-show="!(canOrderCancelDescp && form.refundStatus === 1030 && (isEditing || !_id))" label="订单取消说明：" prop="orderCancelDescp">
                  {{ form.orderCancelDescp }}
                </el-form-item>
                <!-- 第3行：交付门店 | 购车人名称 | 代办联系人 | 订单取消时间 -->
                <el-form-item label="交付门店：" prop="deliveryDealerName">
                  <el-button
                    class="link"
                    @click="handleRouteToStoreDetail(form.deliveryDealerCode)"
                    type="text">{{form.deliveryDealerName}}</el-button>
                </el-form-item>
                <el-form-item label="购车人名称：" prop="buyerName">
                  <!-- <LPEncrypted
                    :value.sync="form.buyerName"
                    :decryptMethod="() => { return form.buyerName }"
                  > -->
                    {{ form.buyerName }}
                  <!-- </LPEncrypted> -->
                </el-form-item>
                <el-form-item label="代办联系人：" prop="agentName">
                  {{ form.agentName }}
                </el-form-item>
<!--                <el-form-item label="代办人电话：" prop="agentPhone">-->
                  <!-- <LPEncrypted
                    :value.sync="form.agentPhone"
                    :decryptMethod="() => { return form.agentPhone }"
                  > -->
<!--                    {{ form.agentPhone }}-->
                  <!-- </LPEncrypted> -->
<!--                </el-form-item>-->
                <el-form-item label="订单取消时间：" prop="orderCancelTime">
                  {{ form.orderCancelTime }}
                </el-form-item>
                <!-- 第4行：定金金额 | 证件号码  | 物料描述 | 订单来源 -->
                <el-form-item label="定金金额：" prop="depositAmount">
                  {{ form.depositAmount }}
                </el-form-item>
                <el-form-item label="证件号码：" prop="idCardNo">
                  <!-- <LPEncrypted
                    :value.sync="form.idCardNo"
                    :decryptMethod="() => { return form.idCardNo }"
                  > -->
                  {{ form.idCardNo }}
                  <!-- </LPEncrypted> -->
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${form.materialsCode}`" target="_blank">{{ form.materialsDesc }}</el-link>
                </el-form-item>
                <el-form-item label="订单来源：" prop="orderSource">
                  {{ form.orderSource }}
                </el-form-item>
                <!-- 第5行：特殊备注 | 物料描述 -->
                <el-form-item v-if="orderSpecRemarkShow" label="特殊备注：" prop="orderSpecialRemark">
                  {{ form.orderSpecialRemark }}
                </el-form-item>
                <el-form-item label="基本车型：" prop="modelName">
                  <el-button
                    class="link"
                    @click="navigateToRoute({
                      path: '/datacenter/materials/vehicleModel/detail',
                      query: {
                        id: form.modelId
                      },
                    })"
                    type="text">{{form.modelName}}</el-button>
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header" v-show="!(isEditing || !_id) || (isEditing && form.refundStatus === 1030)">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id) || (isEditing && form.refundStatus === 1030)">
                <el-form-item label="申请人：" prop="creator">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="申请时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="提交人：" prop="submitUser">
                  {{ form.submitUser }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="初审人：" prop="preApproveUser">
                  <!-- <LPEncrypted
                    :value.sync="form.preApproveUser"
                    :decryptMethod="() => form.preApproveUser"
                  > -->
                    {{ form.preApproveUserEncrypt }}
                  <!-- </LPEncrypted> -->
                </el-form-item>
                <el-form-item label="初审时间：" prop="preApproveTime">
                  {{ form.preApproveTime }}
                </el-form-item>
                <el-form-item label="初审意见：" prop="preApproveRemark">
                  {{ form.preApproveRemark }}
                </el-form-item>
                <el-form-item label="审核人：" prop="approveUser">
                  {{ form.approveUser }}
                </el-form-item>
                <el-form-item label="审核时间：" prop="approveTime">
                  {{ form.approveTime }}
                </el-form-item>
                <el-form-item label="审核意见：" prop="approveRemark">
                  {{ form.approveRemark }}
                </el-form-item>
                <el-form-item label="终审人：" prop="finalApproveUser">
                  <!-- <LPEncrypted
                    :value.sync="form.finalApproveUser"
                    :decryptMethod="() => form.finalApproveUser"
                  > -->
                    {{ form.finalApproveUserEncrypt }}
                  <!-- </LPEncrypted> -->
                </el-form-item>
                <el-form-item label="终审时间：" prop="finalApproveTime">
                  {{ form.finalApproveTime }}
                </el-form-item>
                <el-form-item label="终审意见：" prop="finalApproveRemark">
                  {{ form.finalApproveRemark }}
                </el-form-item>
                <el-form-item label="首次提交时间：" prop="firstSubmitTime">
                  {{ form.firstSubmitTime }}
                </el-form-item>
                <el-form-item label="取消时间：" prop="orderCancelTime">
                  {{ form.orderCancelTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <!-- 退款记录表格 -->
          <section v-if="!(isEditing || !_id) || (isEditing && form.refundStatus === 1030)" class="common-section">
            <div class="common-section-header">
              <h2>退款记录</h2>
            </div>
            <div class="common-section-body">
              <vxe-table
                ref="refundRecordTable"
                :data="form.payRefundRecordList"
                stripe
                resizable
                border="inner"
                size="medium"
                show-overflow
              >
                <vxe-column field="payCode" title="收款编号" width="180" align="center" />
                <vxe-column field="paySerialNumber" title="支付流水号" width="180" align="center" />
                <vxe-column field="payCategoryLabel" title="收款类型" width="180" align="center" />
                <vxe-column field="paymentAmount" title="付款金额" width="180" align="center" />
                <vxe-column field="paymentTypeLabel" title="支付方式" width="180" align="center" />
                <vxe-column field="paymentWayLabel" title="支付渠道" width="180" align="center" />
                <vxe-column field="paymentTime" title="付款时间" width="180" align="center" />
                <vxe-column field="refundTime" title="退款时间" width="180" align="center">
                  <template v-slot:default="{ row, rowIndex }">
                    <el-date-picker
                      v-if="editingRefundRowIndex === rowIndex"
                      v-model="row.refundTime"
                      type="datetime"
                      placeholder="选择退款时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      style="width: 100%"
                    />
                    <span v-else>{{ row.refundTime }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="refundResult" title="退款结果" width="180" align="center">
                  <template v-slot:default="{ row, rowIndex }">
                    <el-select
                      v-if="editingRefundRowIndex === rowIndex"
                      v-model="row.refundResult"
                      placeholder="请选择退款结果"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in refundResultOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <span v-else>{{ row.refundResultLabel }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="refundRemark" title="退款说明" width="180" align="center">
                  <template v-slot:default="{ row, rowIndex }">
                    <el-input
                      v-if="editingRefundRowIndex === rowIndex"
                      v-model="row.refundRemark"
                      placeholder="请输入退款说明"
                    />
                    <span v-else>{{ row.refundRemark }}</span>
                  </template>
                </vxe-column>
                <vxe-column v-if="form.refundStatus === 1030" title="操作" width="160" align="center" fixed="right">
                  <template v-slot:default="{ row, rowIndex }">
                    <el-button
                      v-if="editingRefundRowIndex !== rowIndex"
                      type="text"
                      size="small"
                      @click="handleEditRefundRecord(rowIndex)"
                    >
                      编辑
                    </el-button>
                    <template v-else>
                      <el-button
                        type="text"
                        size="small"
                        :loading="savingRefundRecord"
                        @click="handleSaveRefundRecord(row)"
                      >
                        保存
                    </el-button>
                      <el-button
                        type="text"
                        size="small"
                        @click="handleCancelEditRefundRecord"
                      >
                        取消
                      </el-button>
                    </template>
                  </template>
                </vxe-column>
              </vxe-table>
            </div>
          </section>
          <component-table
                v-if="!(isEditing || !_id) || (isEditing && form.refundStatus === 1030)"
                :table-config="{ title: '审批明细' }"
                :table-data-external="form.approveLogList"
                :columns="approveColumns"
                :show-pagination="false"
              />
          <refund-apply-audit-dialog
            :audit-type="auditType"
            :main-cate-code="form.cateCode"
            ref="auditRef"
            @audit="handleAudit"
          />
          <financial-order-dialog ref="financialOrderDialog" />
          <vehicle-stock-dialog ref="vehicleStockDialog" />
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
import {
  addOrUpdate,
  approve,
  cancel,
  finalApprove,
  getDetail,
  preApprove,
  submit,
  cancelReasonChange,
  legalVerification
} from '@/api/vehretail/orderRefund/refundApply/index';
import { addOrUpdate as updateRefundRecord } from '@/api/vehretail/orderRefund/payRefundRecord/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import ComponentTable from '@/libs/components/ComponentTable/index.vue';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { pageNoDesensitize as retailOrderPage } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import { fetchCategoryList } from '@/api/vehretail/orderRefund/category';
import RefundApplyAuditDialog from '@/views/vehretail/orderRefund/refundApply/auditDialog';
import { getList as getMaterialInfoList } from '@/api/datacenter/materials/vehicleMaterials/index';
import { getList as getVehicleMaterialsMatchList } from '@/api/datacenter/materials/vehicleMaterialsMatch/index';
import FinancialOrderDialog from './components/FinancialOrderDialog.vue';
import VehicleStockDialog from './components/VehicleStockDialog.vue';
import navigate from '@/libs/utils/navigate';
// import LPEncrypted from '@/libs/components/LPEncrypted/index.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: null,
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  refundCode: '',
  refundStatus: '',
  retailOrderCode: '',
  mallOrderCode: '',
  orderSource: '',
  depositRefundType: null,
  enjoyGift: '',
  enjoyGiftAccount: '',
  refundBank: '',
  refundBankUser: '',
  refundBankAccount: '',
  orderRefundType: 20,
  cateCode: '',
  refundReason: '',
  firstSubmitTime: '',
  submitUser: '',
  submitTime: '',
  preApproveUser: '',
  preApproveTime: '',
  preApproveRemark: '',
  approveUser: '',
  approveTime: '',
  approveRemark: '',
  finalApproveUser: '',
  finalApproveTime: '',
  finalApproveRemark: '',
  orderCancelTime: '',
  orderCancelReason: '',
  orderCancelDescp: '',
  discontinueStatusLabel: '',
  payRefundRecordList: [],
  approveLogList: [],
  // 加密字段
  buyerName: '',
  buyerPhone: '',
  idCardNo: '',
  agentPhone: ''
};

export default {
  name: 'orderRefundApplyEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    // LPEncrypted,
    VehicleStockDialog,
    FinancialOrderDialog,
    RefundApplyAuditDialog,
    EditPageLayout,
    EditBaseContainer,
    AisAttachment,
    FetchSelect,
    ComponentTable,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '退订申请单号：' + this.form.refundCode;
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
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'mallOrderCode',
        valueKey: 'mallOrderCode',
        clearable: true,
        // multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true,
      },
      selectCategoryOptions: {
        placeholder: '请选择',
        labelKey: 'cateName',
        valueKey: 'cateCode',
        clearable: true,
        // multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      auditType: 'approve',
      pageTitle: '用户退订申请',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVRRO-retailOrderRefund',
      // 权限控制
      canCancel: false, // 作废
      canCommit: false, // 提交审批
      canPreApprove: false, // 初审
      canApprove: false, // 审核
      canFinalApprove: false, // 终审
      canOrderCancelDescp: false, // 终审
      loading: false,
      submitLoading: false,
      // 字段权限控制
      vrFinanceOrder: false, // 查询金融订单展示
      vehicleVdcInventoryLedger: false, // 查询库存车展示
      subCateShow: false, // 原因二级分类展示
      specRemarkShow: false, // 特殊备注展示
      orderSpecRemarkShow: false, // 订单特殊备注展示
      preApproverShow: false, // 初审人展示
      finalApproverShow: false, // 终审人展示
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      refundColumns: [
        { field: 'payCode', title: '收款编号', width: 180 },
        { field: 'paySerialNumber', title: '支付流水号', width: 180 },
        { field: 'payCategoryLabel', title: '收款类型', width: 180 },
        { field: 'paymentAmount', title: '付款金额', width: 180 },
        { field: 'paymentTypeLabel', title: '支付方式', width: 180 },
        { field: 'paymentWayLabel', title: '支付渠道', width: 180 },
        { field: 'paymentTime', title: '付款时间', width: 180 },
        { field: 'refundTime', title: '退款时间', width: 180 },
        { field: 'refundResultLabel', title: '退款结果', width: 180 },
        { field: 'refundRemark', title: '退款说明', width: 180 }
      ],
      approveColumns: [
        { field: 'createTime', title: '操作时间', width: 180 },
        { field: 'operateStatusLabel', title: '申请状态', minWidth: 150 },
        { field: 'operatorName', title: '操作人', width: 180 },
        { field: 'operateExplain', title: '审核意见', minWidth: 200 }
      ],
      // 退款记录编辑相关
      editingRefundRowIndex: null,
      savingRefundRecord: false,
      originalRefundRecordData: null,
      refundResultOptions: [
        { label: '退款成功', value: '1010' },
        { label: '退款失败', value: '1020' }
      ],
      rules: {
        refundCode: [
          { required: false, message: '请输入退订申请单号', trigger: 'change' }
        ],
        refundStatus: [
          { required: false, message: '请选择申请单状态 1010:草稿 1020:已提交 1025:已初审 1027:待终审 1030:已通过 1040:已驳回 1050:已作废', trigger: 'change' }
        ],
        retailOrderCode: [
          { required: true, message: '请输入整车订单', trigger: 'blur' }
        ],
        mallOrderCode: [
          { required: true, message: '请输入商城订单编号', trigger: 'change' }
        ],
        orderSource: [
          { required: false, message: '请输入订单来源 天猫、管理后台、拼多多、mall、京东、App、小程序、官网', trigger: 'change' }
        ],
        depositRefundType: [
          { required: false, message: '请选择定金退回方式', trigger: 'change' }
        ],
        enjoyGift: [
          { required: false, message: '请输入是否有陪伴礼 0:否 1:是', trigger: 'change' }
        ],
        enjoyGiftAccount: [
          { required: false, message: '请输入陪伴礼账号', trigger: 'change' }
        ],
        refundBank: [
          { required: true, message: '请输入退款银行', trigger: 'change' }
        ],
        refundBankUser: [
          { required: true, message: '请输入银行开户名', trigger: 'change' }
        ],
        refundBankAccount: [
          { required: true, message: '请输入退款银行账号', trigger: 'change' }
        ],
        orderRefundType: [
          { required: true, message: '请选择退订方式', trigger: 'change' }
        ],
        cateCode: [
          { required: true, message: '请输入退订原因分类', trigger: 'change' }
        ],
        refundReason: [
          { required: false, message: '请输入退订原因说明', trigger: 'change' }
        ]
      }
    };
  },
  created () {
    this.initPermissions();
    const mallOrderCode = this.$route.query.mallOrderCode;
    if (mallOrderCode) {
      this.form.mallOrderCode = mallOrderCode;
      const params = {
        pageSize: 1,
        orderStatusExcludeList: [0, 99],
        mallOrderCodeLike: mallOrderCode
      };
      retailOrderPage(params).then(res => {
        if (res.total > 0) {
          this.retailOrderChange(mallOrderCode, res.records[0]);
        }
      });
    }
  },
  mounted () {
  },
  methods: {
    // 初始化权限
    initPermissions () {
      this.canCancel = this.permissions.has(`${this.moduleKey}-cancel`);
      this.canCommit = this.permissions.has(`${this.moduleKey}-commit`);
      this.canPreApprove = this.permissions.has(`${this.moduleKey}-preApprove`);
      this.canApprove = this.permissions.has(`${this.moduleKey}-approve`);
      this.canFinalApprove = this.permissions.has(`${this.moduleKey}-finalApprove`);
      this.canOrderCancelDescp = this.permissions.has(`${this.moduleKey}-orderCancelDescp`);
      // 字段权限控制初始化
      this.vrFinanceOrder = this.permissions.has(`${this.moduleKey}-vrFinanceOrder`);
      this.vehicleVdcInventoryLedger = this.permissions.has(`${this.moduleKey}-vehicleVdcInventoryLedger`);
      this.subCateShow = this.permissions.has(`${this.moduleKey}-subCateShow`);
      this.specRemarkShow = this.permissions.has(`${this.moduleKey}-specRemarkShow`);
      this.orderSpecRemarkShow = this.permissions.has(`${this.moduleKey}-orderSpecRemarkShow`);
      this.preApproverShow = this.permissions.has(`${this.moduleKey}-preApproverShow`);
      this.finalApproverShow = this.permissions.has(`${this.moduleKey}-finalApproverShow`);
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    async submitRequest () {
      // 校验：当 refundStatus 为 1010 或 1040 且有_id 时，附件必须上传
      if ((this.form.refundStatus === 1010 || this.form.refundStatus === 1040) && this._id) {
        // 等待一下确保文件列表已更新
        await this.$nextTick();
        const attachmentList = this.$refs.attachment?.getFileList() || [];
        if (!attachmentList || attachmentList.length === 0) {
          this.$message.warning('请上传退订附件');
          return Promise.reject(new Error('请上传退订附件'));
        }
      }
      // 修改取消原因
      if (this.form.refundStatus === 1030) {
        if (!this.form.orderCancelDescp || this.form.orderCancelDescp === '') {
          this.$message.error('请输入取消说明!');
          return Promise.reject(new Error('请输入取消说明!'));
        }
        const res = await cancelReasonChange({ ...this.form });
        // 保存成功后退出编辑状态
        this.isEditing = false;
        return res;
      } else {
        const res = await addOrUpdate({ ...this.form });
        // 保存成功后退出编辑状态
        this.isEditing = false;
        return res;
      }
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
    async changeCategorySearch (val) {
      return await fetchCategoryList({ pageSize: 1000, selectorDisplay: 1, cateName: val });
    },
    changeCategoryChange (val, selectedOption) {
      this.form.cateCode = val ? selectedOption.cateCode : '';
      this.form.cateName = val ? selectedOption.cateName : '';
      this.form.refundReason = val ? selectedOption.refundReasonDefault : '';
      this.form.refundReasonChanged = val ? selectedOption.refundReasonChanged : 0;
      this.form.depositRefundType = val ? selectedOption.refundTypeDefault + '' : null;
      this.form.refundAttachRequired = val ? selectedOption.refundAttachRequired : null;
      this.form.refundTypeSelect = val ? selectedOption.refundTypeSelect : null;
    },
    async retailOrderSearch (val) {
      const params = {
        pageSize: 20,
        orderStatusExcludeList: [0, 99],
        mallOrderCodeLike: val,
      };
      return await retailOrderPage(params);
    },
    retailOrderChange (val, selectedOption) {
      this.$refs.ruleForm.resetFields();
      if (val) {
        legalVerification(selectedOption.retailOrderCode)
          .then(res => {
            this.refreshOrderInfo(val, selectedOption);
          });
      }
    },
    refreshOrderInfo (val, selectedOption) {
      this.form.retailOrderCode = val ? selectedOption.retailOrderCode : '';
      this.form.mallOrderCode = val ? selectedOption.mallOrderCode : '';
      this.form.saleOrgId = val ? selectedOption.saleOrgId : '';
      this.form.saleDealerCode = val ? selectedOption.saleDealerCode : '';
      this.form.saleDealerName = val ? selectedOption.saleDealerName : '';
      this.form.modelId = val ? selectedOption.modelId : '';
      this.form.modelName = val ? selectedOption.modelName : '';
      this.form.seriesId = val ? selectedOption.seriesId : '';
      this.form.seriesName = val ? selectedOption.seriesName : '';
      this.form.orderUserId = val ? selectedOption.orderUserId : '';
      this.form.orderUserName = val ? selectedOption.orderUserName : '';
      this.form.orderUserPhone = val ? selectedOption.orderUserPhone : '';
      this.form.buyerName = val ? selectedOption.carBuyerName : '';
      this.form.buyerPhone = val ? selectedOption.carBuyerPhone : '';
      this.form.idCardType = val ? selectedOption.idCardType : null;
      this.form.idCardTypeLabel = val ? selectedOption.idCardTypeLabel : null;
      this.form.idCardNo = val ? selectedOption.idCardNo : '';
      this.form.agentName = val ? selectedOption.agentName : '';
      this.form.agentPhone = val ? selectedOption.agentPhone : '';
      this.form.saleDealerCode = val ? selectedOption.saleDealerCode : '';
      this.form.saleDealerName = val ? selectedOption.saleDealerName : '';
      this.form.saleUserName = val ? selectedOption.saleUserName : '';
      this.form.materialsCode = val ? selectedOption.materialsCode : '';
      this.form.discontinueStatusLabel = null;
      this.form.orderTime = val ? selectedOption.orderTime : '';
      this.form.paymentTime = val ? selectedOption.paymentTime : '';
      this.form.deliveryTime = val ? selectedOption.deliveryTime : '';
      this.form.deliveryStatus = val && selectedOption.deliveryTime ? 1 : 0;
      this.form.dataSource = val ? selectedOption.dataSource : null;
      this.form.orderSource = val ? selectedOption.orderSource : null;
      this.form.orderStatus = val ? selectedOption.orderStatus : null;
      this.form.orderStatusLabel = val ? selectedOption.orderStatusLabel : null;
      this.form.provinceCode = val ? selectedOption.provinceCode : '';
      this.form.provinceName = val ? selectedOption.provinceName : '';
      this.form.cityCode = val ? selectedOption.cityCode : '';
      this.form.cityName = val ? selectedOption.cityName : '';
      this.form.regionName = val ? selectedOption.regionName : '';
      this.form.depositAmount = val ? selectedOption.depositAmount : '';
      this.form.rangePowerId = val ? selectedOption.rangePowerId : '';
      this.form.rangePowerName = val ? selectedOption.rangePowerName : '';
      this.form.drivingRangeId = val ? selectedOption.drivingRangeId : '';
      this.form.drivingRangeName = val ? selectedOption.drivingRangeName : '';
      this.form.exteriorId = val ? selectedOption.exteriorId : '';
      this.form.exteriorName = val ? selectedOption.exteriorName : '';
      this.form.interiorId = val ? selectedOption.interiorId : '';
      this.form.interiorName = val ? selectedOption.interiorName : '';
      this.form.wheelHubId = val ? selectedOption.wheelHubId : '';
      this.form.wheelHubName = val ? selectedOption.wheelHubName : '';
      this.form.yearTypeId = val ? selectedOption.yearTypeId : '';
      this.form.yearTypeName = val ? selectedOption.yearTypeName : '';
      this.form.optionPackageId = val ? selectedOption.optionPackageId : '';
      this.form.optionPackageName = val ? selectedOption.optionPackageName : '';
      // 查询物料是否停产
      if (this.form.materialsCode) {
        getMaterialInfoList({ materialsCodeLike: this.form.materialsCode, pageSize: 1 })
          .then(res => {
            if (res.records && res.records.length > 0) {
              this.$nextTick(() => {
                // this.$message.info(JSON.stringify(res.records[0]));
                this.form.discontinueStatusLabel = res.records[0].discontinueStatusLabel;
              });
            }
          });
      }
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
    },
    openFinancialOrderShow () {
      this.$refs.financialOrderDialog.show(this.form.mallOrderCode);
    },
    openVehicleStockShow () {
      // 获取可配物料关系
      getVehicleMaterialsMatchList({ materialsCodeLike: this.form.materialsCode, pageSize: 1 })
        .then(res => {
          const materialCodeArray = res.records.map(item => item.matchMaterialsCode);
          materialCodeArray.push(this.form.materialsCode);
          this.$refs.vehicleStockDialog.show(materialCodeArray);
        });
    },
    openCancelShow () {
      this.$confirm('确认是否对数据进行作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 作废接口
        cancel(this.form).then(res => {
          // 重新加载详情数据
          this.reloadDetail();
        });
      }).catch(() => {});
    },
    openCommitShow () {
      const attachmentList = this.$refs.attachment?.getFileList() || [];
      if (!attachmentList || attachmentList.length === 0) {
        this.$message.warning('请上传退订附件');
        return;
      }
      this.$confirm('确认是否对数据进行提交审批?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 提交审批接口 判断是否需要初审
        submit(this.form).then(res => {
          // 重新加载详情数据
          this.reloadDetail();
        });
      }).catch(() => {});
    },
    openPreAuditShow () {
      this.auditType = 'preApprove';
      this.$refs.auditRef.show();
    },
    openAuditShow () {
      this.auditType = 'approve';
      this.$refs.auditRef.show();
    },
    openFinalAuditShow () {
      this.auditType = 'finalApprove';
      this.$refs.auditRef.show();
    },
    // 提交审批结果
    handleAudit (auditForm) {
      // this.$message.info(JSON.stringify(auditForm));
      auditForm.id = this.form.id;
      auditForm.refundCode = this.form.refundCode;
      auditForm.auditResult = auditForm.result;
      auditForm.auditContent = auditForm.content;
      auditForm.auditRemark = auditForm.remark;
      if (this.auditType === 'approve') {
        approve(auditForm).then(res => {
          // 重新加载详情数据
          this.reloadDetail();
        });
      } else if (this.auditType === 'preApprove') {
        preApprove(auditForm).then(res => {
          // 重新加载详情数据
          this.reloadDetail();
        });
      } else if (this.auditType === 'finalApprove') {
        finalApprove(auditForm).then(res => {
          // 重新加载详情数据
          this.reloadDetail();
        });
      }
    },
    reloadDetail () {
      this.$message.success('操作成功');
      if (this.$refs.containerRef) {
        this.$refs.containerRef.loadDetail();
      }
      // 或者关闭编辑状态
      this.isEditing = false;
    },
    handleRouteToStoreDetail (storeCode) {
      navigate(
        {
          path: '/partner/channelManagement/shopDetail',
          query: {
            dealerCode: storeCode
          },
        },
        true,
        this.$router
      );
    },
    handleRouteToVehicleMaterials (materialsCode) {
      if (!materialsCode) {
        return;
      }
      // 通过物料码查询物料列表获取ID
      getMaterialInfoList({ materialsCodeLike: materialsCode, pageSize: 1 })
        .then(res => {
          if (res.records && res.records.length > 0) {
            const material = res.records[0];
            navigate(
              {
                path: '/sales/datacenter/materials/vehicleMaterials/detail',
                query: {
                  id: material.id,
                },
              },
              true,
              this.$router
            );
          } else {
            this.$message.warning('未找到物料信息');
          }
        });
    },
    // 编辑退款记录
    handleEditRefundRecord (rowIndex) {
      // 保存原始数据用于取消时恢复
      this.originalRefundRecordData = JSON.parse(JSON.stringify(this.form.payRefundRecordList[rowIndex]));
      this.editingRefundRowIndex = rowIndex;
    },
    // 取消编辑退款记录
    handleCancelEditRefundRecord () {
      // 恢复原始数据
      if (this.originalRefundRecordData) {
        this.$set(this.form.payRefundRecordList, this.editingRefundRowIndex, JSON.parse(JSON.stringify(this.originalRefundRecordData)));
      }
      this.editingRefundRowIndex = null;
      this.originalRefundRecordData = null;
    },
    // 保存退款记录
    handleSaveRefundRecord (row) {
      this.savingRefundRecord = true;
      const params = {
        id: row.id,
        refundTime: row.refundTime,
        refundResult: row.refundResult,
        refundRemark: row.refundRemark
      };
      updateRefundRecord(params).then(() => {
        this.$message.success('保存成功');
        this.editingRefundRowIndex = null;
        this.originalRefundRecordData = null;
        // 重新加载详情
        this.$refs.containerRef.loadDetail();
      }).finally(() => {
        this.savingRefundRecord = false;
      });
    }
  }
};
</script>
