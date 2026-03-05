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
        :showEditBtn="form.refundStatus === 1010 || form.refundStatus === 1040"
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
            v-if="form.refundStatus === 1010 || form.applyStatus === 1040"
            v-permission="moduleKey + '-cancel'"
            size="small">
            作废
          </el-button>
          <el-button
            @click="openCommitShow"
            v-if="form.refundStatus === 1010 || form.refundStatus === 1040"
            v-permission="moduleKey + '-commit'">
            提交审批
          </el-button>
          <el-button
            @click="openPreAuditShow"
            v-permission="moduleKey + '-preApprove'"
            v-if="form.refundStatus === 1020"
          >
            初审
          </el-button>
          <el-button
            @click="openAuditShow"
            v-permission="moduleKey + '-approve'"
            v-if="form.refundStatus === 1025"
          >
            审核
          </el-button>
          <el-button
            @click="openFinalAuditShow"
            v-permission="moduleKey + '-finalApprove'"
            v-if="form.refundStatus === 1027"
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderCode"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  <fetch-select
                    v-bind="selectOptions"
                    :remote-method="retailOrderSearch"
                    v-model="form.mallOrderCode"
                    @change="retailOrderChange"
                    :disabled="form.id"
                  />
                </el-form-item>
                <el-form-item label="退订原因分类：" prop="cateCode">
                  <fetch-select
                    v-bind="selectCategoryOptions"
                    :remote-method="changeCategorySearch"
                    v-model="form.cateCode"
                    @change="changeCategoryChange"
                  />
                </el-form-item>
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
                <el-form-item label="陪伴礼账号：" prop="enjoyGiftAccount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.enjoyGiftAccount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退款银行：" prop="refundBank"
                              :rules="form.depositRefundType === '30' ? rules.refundBank: []">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundBank"
                    :disabled="form.depositRefundType !== '30'"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退款银行开户名：" prop="refundBankUser"
                              :rules="form.depositRefundType === '30' ? rules.refundBankUser: []">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundBankUser"
                    :disabled="form.depositRefundType !== '30'"
                    clearable
                  />
                </el-form-item>
                <el-form-item
                  label="退款银行账号："
                              prop="refundBankAccount"
                              :rules="form.depositRefundType === '30' ? rules.refundBankAccount: []">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundBankAccount"
                    :disabled="form.depositRefundType !== '30'"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退订原因说明：" prop="refundReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundReason"
                    type="textarea"
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
                <el-form-item label="车型名称：" prop="modelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
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
                <el-form-item label="销售门店-省编码：" prop="provinceCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售门店-省：" prop="provinceName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售门店-市编码：" prop="cityCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售门店-市：" prop="cityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityName"
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
                <el-form-item label="订单来源：" prop="orderSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderSource"
                    disabled
                    clearable
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="退订申请单号：" prop="refundCode">
                  {{ form.refundCode }}
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  <el-button
                    class="link"
                    @click="navigateToRoute({
                      path: '/vehretail/orderManager/retailOrderInfo',
                      query: {
                        retailOrderCode: form.retailOrderCode,
                      },
                    })"
                    type="text">{{form.retailOrderCode}}</el-button>
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="退订原因分类编码：" prop="cateCode">
                  {{ form.cateCode }}
                </el-form-item>
                <el-form-item label="退订原因分类：" prop="cateName">
                  {{ form.cateName }}
                </el-form-item>
                <el-form-item label="申请单状态：" prop="refundStatusLabel">
                  {{ form.refundStatusLabel }}
                </el-form-item>
                <el-form-item label="订单来源：" prop="orderSource">
                  {{ form.orderSource }}
                </el-form-item>
                <el-form-item label="定金退回方式：" prop="depositRefundTypeLabel">
                  {{ form.depositRefundTypeLabel }}
                </el-form-item>
                <el-form-item label="是否有陪伴礼：" prop="enjoyGiftLabel">
                  {{ form.enjoyGiftLabel }}
                </el-form-item>
                <el-form-item label="陪伴礼账号：" prop="enjoyGiftAccount">
                  {{ form.enjoyGiftAccount }}
                </el-form-item>
                <el-form-item label="退款银行：" prop="refundBank">
                  {{ form.refundBank }}
                </el-form-item>
                <el-form-item label="退款银行开户名：" prop="refundBankUser">
                  {{ form.refundBankUser }}
                </el-form-item>
                <el-form-item label="退款银行账号：" prop="refundBankAccount">
                  {{ form.refundBankAccount }}
                </el-form-item>
                <el-form-item label="退订原因说明：" prop="refundReason">
                  {{ form.refundReason }}
                </el-form-item>
                <el-form-item label="订单物料码：" prop="materialsCode">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="车型ID：" prop="modelId">
                  {{ form.modelId }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  <el-button
                    class="link"
                    @click="navigateToRoute({
                      path: '/partner/businessData/carType',
                      query: {
                        modelName: form.modelName,
                      },
                    })"
                    type="text">{{form.modelName}}</el-button>
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="originalSaleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="originalSaleDealerName">
                  <el-button
                    class="link"
                    @click="navigateToRoute({
                      path: '/partner/channelManagement/shopBasicsMessage',
                      query: {
                        saleDealerName: form.saleDealerName,
                      },
                    })"
                    type="text">{{form.saleDealerName}}</el-button>
                </el-form-item>
                <el-form-item label="销售门店-省编码：" prop="provinceCode">
                  {{ form.provinceCode }}
                </el-form-item>
                <el-form-item label="销售门店-省：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="销售门店-市编码：" prop="cityCode">
                  {{ form.cityCode }}
                </el-form-item>
                <el-form-item label="销售门店-市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="退订方式：" prop="orderRefundTypeLabel">
                  {{ form.orderRefundTypeLabel }}
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="退订原因分类编码：" prop="cateCode">
                  {{ form.cateCode }}
                </el-form-item>
                <el-form-item label="退订原因分类：" prop="cateName">
                  {{ form.cateName }}
                </el-form-item>
                <el-form-item label="退订原因二级分类编码：" prop="subCateCode">
                  {{ form.subCateCode }}
                </el-form-item>
                <el-form-item label="退订原因二级分类：" prop="subCateName">
                  {{ form.subCateName }}
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
                :businessId="_id"
                :readonly="!(isEditing || !_id)"
                configCode="mcs_vehorderapplylog"
                attachType="订单信息变更申请附件"
              />
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>订单信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail1" v-show="!(isEditing || !_id)">
                <el-form-item label="整车订单状态：" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="商城下单时间：" prop="orderTime">
                  {{ form.orderTime }}
                </el-form-item>
                <el-form-item label="下单用户ID：" prop="orderUserId">
                  {{ form.orderUserId }}
                </el-form-item>
                <el-form-item label="下单人姓名：" prop="orderUserName">
                  {{ form.orderUserName }}
                </el-form-item>
                <el-form-item label="购车人名称：" prop="buyerName">
                  {{ form.buyerName }}
                </el-form-item>
                <el-form-item label="购车人手机号码：" prop="buyerPhone">
                  {{ form.buyerPhone }}
                </el-form-item>
                <el-form-item label="证件类型：" prop="idCardTypeLabel">
                  {{ form.idCardTypeLabel }}
                </el-form-item>
                <el-form-item label="购车人证件号码：" prop="idCardNo">
                  {{ form.idCardNo }}
                </el-form-item>
                <el-form-item label="代办联系人：" prop="agentName">
                  {{ form.agentName }}
                </el-form-item>
                <el-form-item label="缴定金时间：" prop="paymentTime">
                  {{ form.paymentTime }}
                </el-form-item>
                <el-form-item label="定金金额：" prop="depositAmount">
                  {{ form.depositAmount }}
                </el-form-item>
                <el-form-item label="补贴后价格：" prop="priceAfterSubsidy">
                  {{ form.priceAfterSubsidy }}
                </el-form-item>
                <el-form-item label="订单物料码：" prop="materialsCode">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="配车物料编码：" prop="allocationMaterialCode">
                  {{ form.allocationMaterialCode }}
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-button
                    class="link"
                    @click="navigateToRoute({
                      path: '/partner/channelManagement/shopBasicsMessage',
                      query: {
                        saleDealerName: form.saleDealerName,
                      },
                    })"
                    type="text">{{form.saleDealerName}}</el-button>
                </el-form-item>
                <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="交车VIN码：" prop="deliveryVin">
                  {{ form.deliveryVin }}
                </el-form-item>
                <el-form-item label="交车时间：" prop="deliveryTime">
                  {{ form.deliveryTime }}
                </el-form-item>
                <el-form-item label="订单取消时间：" prop="orderCancelTime">
                  {{ form.orderCancelTime }}
                </el-form-item>
                <el-form-item label="订单取消原因：" prop="orderCancelReason">
                  {{ form.orderCancelReason }}
                </el-form-item>
                <el-form-item label="订单取消说明：" prop="orderCancelDescp">
                  {{ form.orderCancelDescp }}
                </el-form-item>
                <el-form-item label="车系名称：" prop="seriesName">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  <el-button
                    class="link"
                    @click="navigateToRoute({
                      path: '/partner/businessData/carType',
                      query: {
                        modelName: form.modelName,
                      },
                    })"
                    type="text">{{form.modelName}}</el-button>
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialsCode">
                  {{ form.materialsCode }}
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
                <el-form-item label="年款名称：" prop="yearTypeName">
                  {{ form.yearTypeName }}
                </el-form-item>
                <el-form-item label="选装包名称：" prop="optionPackageName">
                  {{ form.optionPackageName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header" v-show="!(isEditing || !_id)">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail2" v-show="!(isEditing || !_id)">
                <el-form-item label="提交人：" prop="submitUser">
                  {{ form.submitUser }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="初审人：" prop="preApproveUser">
                  {{ form.preApproveUser }}
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
                  {{ form.finalApproveUser }}
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
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header" v-show="!(isEditing || !_id)">
              <h2>退款记录</h2>
            </div>
            <div>
              <el-table :data="form.payRefundRecordList" style="width: 100%" v-show="!(isEditing || !_id)">
                <el-table-column prop="payCode" label="收款编号" width="180"/>
                <el-table-column prop="paySerialNumber" label="支付流水号" width="180"/>
                <el-table-column prop="payCategoryLabel" label="收款类型" width="180"/>
                <el-table-column prop="paymentAmount" label="付款金额" width="180"/>
                <el-table-column prop="paymentTypeLabel" label="支付方式" width="180"/>
                <el-table-column prop="paymentWayLabel" label="支付渠道" width="180"/>
                <el-table-column prop="paymentTime" label="付款时间" width="180"/>
                <el-table-column prop="refundTime" label="退款时间" width="180"/>
                <el-table-column prop="refundResult" label="退款结果" width="180"/>
                <el-table-column prop="refundRemark" label="退款说明" width="180"/>
              </el-table>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header" v-show="!(isEditing || !_id)">
              <h2>审批明细</h2>
            </div>
            <div>
              <el-table :data="form.approveLogList" style="width: 60%" v-show="!(isEditing || !_id)">
                <el-table-column
                  prop="createTime"
                  label="操作时间"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="operateStatusLabel"
                  label="申请状态">
                </el-table-column>
                <el-table-column
                  prop="operatorName"
                  label="操作人"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="operateExplain"
                  label="审核意见">
                </el-table-column>
              </el-table>
            </div>
          </section>
          <refund-apply-audit-dialog
            :audit-type="auditType"
            :main-cate-code="form.cateCode"
            ref="auditRef"
            @audit="handleAudit"
          />
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
  submit
} from '@/api/vehretail/orderRefund/refundApply/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList as retailOrderPage } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import { fetchCategoryList } from '@/api/vehretail/orderRefund/category';
import RefundApplyAuditDialog from '@/views/vehretail/orderRefund/refundApply/auditDialog';

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
  orderRefundType: 10,
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
    RefundApplyAuditDialog,
    EditPageLayout,
    EditBaseContainer,
    AisAttachment,
    FetchSelect,
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
      pageTitle: '整车零售退订申请单管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVRRO-retailOrderRefund',
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
        refundCode: [
          { required: false, message: '请输入退订申请单号', trigger: 'change' }
        ],
        refundStatus: [
          { required: false, message: '请选择申请单状态 1010:草稿 1020:已提交 1025:已初审 1027:待终审 1030:已通过 1040:已驳回 1050:已作废', trigger: 'change' }
        ],
        retailOrderCode: [
          { required: true, message: '请输入零售订单号', trigger: 'change' }
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
          { required: true, message: '请输入退款银行开户名', trigger: 'change' }
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
      return await fetchCategoryList({ pageSize: 1000 });
    },
    changeCategoryChange (val, selectedOption) {
      this.form.cateCode = val ? selectedOption.cateCode : '';
      this.form.cateName = val ? selectedOption.cateName : '';
      this.form.depositRefundType = val ? selectedOption.refundTypeDefault : null;
      this.form.refundAttachRequired = val ? selectedOption.refundAttachRequired : null;
      this.form.refundTypeSelect = val ? selectedOption.refundTypeSelect : null;
    },
    async retailOrderSearch (val) {
      const params = {
        pageSize: 1000,
        orderStatusExcludeList: [0, 99],
        mallOrderCodeLike: val,
      };
      return await retailOrderPage(params);
    },
    retailOrderChange (val, selectedOption) {
      this.form.retailOrderCode = val ? selectedOption.retailOrderCode : '';
      this.form.mallOrderCode = val ? selectedOption.mallOrderCode : '';
      this.form.saleOrgId = val ? selectedOption.saleOrgId : '';
      this.form.saleDealerCode = val ? selectedOption.saleDealerCode : '';
      this.form.saleDealerName = val ? selectedOption.saleDealerName : '';
      this.form.modelId = val ? selectedOption.modelId : '';
      this.form.modelName = val ? selectedOption.modelName : '';
      this.form.orderUserName = val ? selectedOption.orderUserName : '';
      this.form.orderUserPhone = val ? selectedOption.orderUserPhone : '';
      this.form.idCardType = val ? selectedOption.idCardType : 1;
      this.form.idCardNo = val ? selectedOption.idCardNo : '';
      this.form.agentName = val ? selectedOption.agentName : '';
      this.form.saleDealerCode = val ? selectedOption.saleDealerCode : '';
      this.form.saleDealerName = val ? selectedOption.saleDealerName : '';
      this.form.materialsCode = val ? selectedOption.materialsCode : '';
      this.form.paymentTime = val ? selectedOption.paymentTime : '';
      this.form.deliveryTime = val ? selectedOption.deliveryTime : '';
      this.form.deliveryStatus = val && selectedOption.deliveryTime ? 1 : 0;
      this.form.dataSource = val ? selectedOption.dataSource : null;
      this.form.orderSource = val ? selectedOption.orderSource : null;
      this.form.orderStatus = val ? selectedOption.orderStatus : null;
      this.form.provinceCode = val ? selectedOption.provinceCode : '';
      this.form.provinceName = val ? selectedOption.provinceName : '';
      this.form.cityCode = val ? selectedOption.cityCode : '';
      this.form.cityName = val ? selectedOption.cityName : '';
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
    openCancelShow () {
      this.$confirm('确认是否对数据进行作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 作废接口
        cancel(this.form);
      }).catch(() => {});
    },
    openCommitShow () {
      this.$confirm('确认是否对数据进行提交审批?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 提交审批接口 判断是否需要初审
        submit(this.form).then(res => {
          // 重新加载详情数据
          if (this.$refs.containerRef) {
            this.$refs.containerRef.loadDetail();
          }
          // 或者关闭编辑状态
          this.isEditing = false;
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
          if (this.$refs.containerRef) {
            this.$refs.containerRef.loadDetail();
          }
          // 或者关闭编辑状态
          this.isEditing = false;
        });
      } else if (this.auditType === 'preApprove') {
        preApprove(auditForm).then(res => {
          // 重新加载详情数据
          if (this.$refs.containerRef) {
            this.$refs.containerRef.loadDetail();
          }
          // 或者关闭编辑状态
          this.isEditing = false;
        });
      } else if (this.auditType === 'finalApprove') {
        finalApprove(auditForm).then(res => {
          // 重新加载详情数据
          if (this.$refs.containerRef) {
            this.$refs.containerRef.loadDetail();
          }
          // 或者关闭编辑状态
          this.isEditing = false;
        });
      }
    }
  }
};
</script>
