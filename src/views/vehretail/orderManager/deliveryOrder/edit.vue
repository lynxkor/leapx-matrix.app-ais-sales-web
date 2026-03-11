<template>
  <edit-page-layout ref="editLayout" title="交车单详情" showPaneFooter>
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
          <!-- 支持 primary,warning,success,danger 等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <el-button v-permission="moduleKey+'-appointment'" size="small" @click="handleAppointmentDelivery">预约交车</el-button>
          <el-button v-permission="moduleKey+'-deliveryConfirm'" size="small" :loading="buttonLoading['generateConfirmOrder']" @click="handleGenerateConfirmOrder">交车确认单生成</el-button>
          <el-button v-permission="moduleKey+'-changeAppointmentTime'" size="small" @click="handleChangeAppointmentTime">更改预约时间</el-button>
          <el-button v-permission="moduleKey+'-cancelOrderRights'" size="small" @click="handleVerifyOrderRights">核销订单权益</el-button>
          <el-button v-permission="moduleKey+'-revertCancelOrderRights'" size="small" :loading="buttonLoading['verifyWithdraw']" @click="handleVerifyWithdraw">核销撤回</el-button>
          <el-button v-permission="moduleKey+'-addPaymentRecord'" size="small" @click="handleAddPaymentRecord">添加收款记录</el-button>
          <el-button v-permission="moduleKey+'-confirmPayment'" size="small" @click="handleConfirmPayment">确认收款</el-button>
          <el-button v-permission="moduleKey+'-deliveryConfirmPush'" size="small" @click="handleRepushConfirmOrder">交车确认单补推</el-button>
          <el-button v-permission="moduleKey+'-deliveryConfirmResign'" size="small" @click="handleReSignConfirmOrder">交车确认单重签</el-button>
          <el-button v-permission="moduleKey+'-viewDeliveryConfirm'" size="small" @click="handleViewConfirmOrder">查看交车确认单</el-button>
          <el-button v-permission="moduleKey+'-uploadInvoice'" size="small" @click="handleUploadInvoice">上传发票</el-button>
          <el-button v-permission="moduleKey+'-cancelPayment'" size="small" @click="handlePaymentWithdraw">收款撤回</el-button>
          <el-button v-permission="moduleKey+'-cancelDelivery'" size="small" @click="handleDeliveryWithdraw">交车撤回</el-button>
          <!-- <el-button v-permission="'AISVR-retailOrderPayRecord' + '-delete'" size="small" @click="handleDelete">删除</el-button> -->
        </template>
        <el-main>
          <!--  -->
          <NavTop
            title="交车单步骤"
            :current="2"/>
          <!-- 订单归属 -->
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header" data-section="orderBelonging">
              <h2>订单归属</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" :label-width="labelWidth" class="form-edit">
                <el-form-item label="订单销售门店：" prop="salesStoreName">
                  <el-input v-model="form.salesStoreName" disabled />
                </el-form-item>
                <el-form-item label="订单销售顾问：" prop="salesAdvisorId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.salesAdvisorId"
                    :remote-method="remoteMethods.saleUser"
                    value-key="userId"
                    label-key="username"
                    @change="(val, row) => handleSaleUserChange(val,row, 'saleUser')"
                  />
                </el-form-item>
                <el-form-item label="订单交付门店：" prop="deliveryStoreName">
                  <el-input v-model="form.deliveryStoreName" disabled />
                </el-form-item>
                <el-form-item label="订单交付顾问：" prop="deliveryAdvisorId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.deliveryAdvisorId"
                    :remote-method="remoteMethods.deliveryUser"
                    value-key="userId"
                    label-key="username"
                    @change="(val, row) => handleSaleUserChange(val,row, 'deliveryUser')"
                  />
                </el-form-item>
                <el-form-item label="交付衍生工程师：" prop="deliveryDerivativeUserId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.deliveryAdvisorId"
                    :remote-method="remoteMethods.deliveryDerive"
                    value-key="userId"
                    label-key="username"
                    @change="(val, row) => handleSaleUserChange(val,row, 'deliveryDerive')"
                  />
                </el-form-item>
                <el-form-item label="现场交付工程师：" prop="onSiteDeliveryUserId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.onSiteDeliveryUserId"
                    :remote-method="remoteMethods.deliveryUser"
                    value-key="userId"
                    label-key="username"
                    @change="(val, row) => handleSaleUserChange(val,row, 'deliveryUser')"
                  />
                </el-form-item>
                <el-form-item label="专属服务门店：">
                  <el-input v-model="form.exclusiveServiceStoreName" disabled />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <generic-detail-display
            v-show="!(isEditing || !_id)"
            title="订单归属"
            :form-data="form"
            :fields="orderBelongingFields"
            :label-width="labelWidth"
            section-key="orderBelonging"
          />
          <!-- 交付信息 -->
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header" data-section="deliveryInfo">
              <h2>交付信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" :label-width="labelWidth" class="form-edit">
                <el-form-item label="门店应收金额：" prop="receivableAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receivableAmount"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="门店优惠金额：" prop="discountAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.discountAmount"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="机动车发票其他费用：" prop="otherAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.otherAmount"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="权益抵扣总额：" prop="equityDeductionTotalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.equityDeductionTotalAmount"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="开票金额：" prop="invoiceAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceAmount"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="剩余应收款：" prop="remainingReceivableAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remainingReceivableAmount"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="保险方案：" prop="insurancePlan">
                  <fetch-select
                    :options="insurancePlanOptions"
                    :valueKey="'value'"
                    :labelKey="'label'"
                    v-model="form.insurancePlan"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="保险办理进度：" prop="insuranceProgress">
                  <fetch-select
                    :options="insuranceProgressOptions"
                    :valueKey="'value'"
                    :labelKey="'label'"
                    v-model="form.insuranceProgress"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="金融方案：" prop="financePlan">
                  <fetch-select
                    :options="financePlanOptions"
                    :valueKey="'value'"
                    :labelKey="'label'"
                    v-model="form.financePlan"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="金融按揭进度：" prop="financeProgress">
                  <fetch-select
                    :options="financeProgressOptions"
                    :valueKey="'value'"
                    :labelKey="'label'"
                    v-model="form.financeProgress"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="交车时里程：" prop="deliveryMileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryMileage"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="交车时电量：" prop="deliveryBatteryPower">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryBatteryPower"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="交车车机版本号：" prop="deliveryMachineVersion">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryMachineVersion"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="交车版本升级时间：" prop="deliveryVersionUpgradeTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.deliveryVersionUpgradeTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <generic-detail-display
            v-show="!(isEditing || !_id)"
            title="交付信息"
            :form-data="form"
            :fields="deliveryInfoFields"
            :label-width="labelWidth"
            section-key="deliveryInfo"
          />
          <!-- 基础信息 -->
          <generic-detail-display title="基础信息" :form-data="form" :fields="basicInfoFields" :label-width="labelWidth" section-key="basicInfo" />
          <!-- 预约信息 -->
          <generic-detail-display title="预约信息" :form-data="form" :fields="appointmentFields" :label-width="labelWidth" section-key="appointment" />
          <!-- 整车订单信息 -->
          <generic-detail-display title="整车订单信息" :form-data="form" :fields="retailOrderFields" :label-width="labelWidth" section-key="retailOrder" />
          <!-- 实名认证信息 -->
          <generic-detail-display title="实名认证信息" :form-data="form" :fields="realNameAuthFields" :label-width="labelWidth" section-key="realNameAuth" />
          <!-- 交车确认单 -->
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header" data-section="deliveryInfo">
              <h2>交付信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :label-width="labelWidth" class="form-edit">
                <el-form-item label="签署数据来源：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.signatureDataSourceDesc"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="签署时间：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.signatureTime"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="购车人手机是否注册：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.buyerMobileRegisteredLabel"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="交车确认单状态：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryConfirmStatusDesc"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="城市交付顺序：">
                  <el-input-number
                    placeholder="请输入"
                    v-model="form.cityDeliveryOrder"
                    clearable
                    :controls="false"
                    :min="cityDeliveryOrderMin"
                    :step="1"
                  />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <!-- 交车确认单 -->
          <generic-detail-display title="交车确认单" :form-data="form" :fields="deliveryConfirmFields" :label-width="labelWidth" section-key="deliveryConfirm" />
          <!-- 收款记录&权益项抵扣记录 -->
          <component-table
            ref="paymentRecordTable"
            :table-config="{ title: '收款记录&权益项抵扣记录' }"
            :columns="paymentRecordColumns" section-key="paymentRecords"
            :api-method="getPaymentRecordList"
            :extra-params="{ retailOrderId: _id }"
            :showPagination="true"
          >
            <template v-slot:operation_default="{ row }">
              <el-button
                type="text"
                style="color: #67c23a;"
                @click="handleDeletePaymentRecord(row)"
              >删除</el-button>
            </template>
          </component-table>
          <!-- 预约记录 -->
          <component-table
            :table-config="{ title: '预约记录' }"
            :columns="appointmentRecordColumns" section-key="appointmentRecords"
            :tableDataExternal="form.appointmentRecord"
            :showPagination="false"
          />
          <!-- 附件清单 -->
          <component-table
            :table-config="{ title: '附件清单' }"
            :columns="attachmentColumns" section-key="attachments"
            :tableDataExternal="form.attachment"
            :showPagination="false"
          />
        </el-main>
      </edit-base-container>
      <!-- 预约交车对话框组件 -->
      <delivery-appointment-dialog
        ref="deliveryAppointmentDialog"
        :deliveryAdvisorId="form.deliveryAdvisorId"
        :deliveryCityId="form.deliveryStoreId"
        :orderCreateTime="form.orderCreateTime"
        :orderId="_id"
        :originalAppointmentTime="form.appointmentTime"
        @refresh="getDetail"
      />
      <!-- 核销权益对话框组件 -->
      <verify-order-rights-dialog
        ref="verifyOrderRightsDialog"
        :orderId="_id"
        @refresh="getDetail"
      />
      <!-- 收款记录对话框组件 -->
      <payment-record-dialog
        ref="paymentRecordDialog"
        :orderId="_id"
        :financePlan="form.financePlan"
        @refresh="getDetail"
      />
      <!-- 消息提醒对话框 -->
      <message-dialog
        ref="messageDialog"
        type="warning"
        :show-cancel="true"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="handleReSignConfirmOrderConfirm"
      />
      <!-- 成功消息提醒对话框 -->
      <message-dialog
        ref="successMessageDialog"
        type="success"
        :show-cancel="false"
        confirm-text="确定"
        @confirm="handleSuccessMessageConfirm"
      />
      <!-- 确认收款消息提醒对话框 -->
      <message-dialog
        ref="confirmPaymentDialog"
        type="warning"
        :show-cancel="true"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="handleConfirmPaymentConfirm"
      />
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，预留 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, validateInvoiceAmount, validateRemainingReceivable, validateUnverifiedRights, confirmPayment } from '@/api/vehretail/orderManager/deliveryOrder/index';
import {
  getList as getPaymentRecordList,
  deleteItem as deletePaymentRecord
} from '@/api/vehretail/orderManager/orderPayRecord/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { engineerList } from '@/libs/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import GenericDetailDisplay from '@/views/vehretail/orderManager/retailOrderInfo/components/GenericDetailDisplay';
import ComponentTable from '@/views/vehretail/orderManager/retailOrderInfo/components/ComponentTable';
import NavTop from './components/NavTop';
import DeliveryAppointmentDialog from './components/DeliveryAppointmentDialog';
import VerifyOrderRightsDialog from './components/VerifyOrderRightsDialog';
import PaymentRecordDialog from './components/PaymentRecordDialog';
import MessageDialog from '@/libs/components/MessageDialog';

const defaultForm = {
  // 订单归属
  salesStoreId: '',
  salesStoreName: '',
  salesAdvisorId: '',
  salesAdvisorName: '',
  deliveryStoreId: '',
  deliveryStoreName: '',
  deliveryAdvisorId: '',
  deliveryAdvisorName: '',
  deliveryDerivativeUserId: '',
  deliveryDerivativeUserName: '',
  onSiteDeliveryUserId: '',
  onSiteDeliveryUserName: '',
  exclusiveServiceStoreId: '',
  exclusiveServiceStoreName: '',
  // 交付信息
  receivableAmount: '',
  discountAmount: '',
  otherAmount: '',
  equityDeductionTotalAmount: '',
  invoiceAmount: '',
  remainingReceivableAmount: '',
  insurancePlan: '',
  insuranceProgress: '',
  financePlan: '',
  financeProgress: '',
  deliveryMileage: '',
  deliveryBatteryPower: '',
  deliveryMachineVersion: '',
  deliveryVersionUpgradeTime: '',
  // 基础信息
  deliveryOrderCode: '',
  vin: '',
  vehicleMaterial: '',
  retailOrderCode: '',
  deliveryTime: '',
  status: '',
  statusDesc: '',
  createTime: '',
  // 预约信息
  appointmentTime: '',
  appointmentDelayStatus: '',
  appointmentChangeCount: '',
  appointmentOperationTime: '',
  appointmentRemark: '',
  appointmentTimeoutReason: '',
  // 整车订单信息
  retailOrderStatus: '',
  orderCreateTime: '',
  mallOrderCode: '',
  orderSource: '',
  userId: '',
  buyerName: '',
  buyerMobile: '',
  idType: '',
  idNumber: '',
  agentContact: '',
  vehicleGuidePrice: '',
  depositAmount: '',
  orderMaterialCode: '',
  vehicleMaterialCode: '',
  // 实名认证信息
  realNameAuthSource: '',
  realNameAuthTime: '',
  // 交车确认单
  signatureDataSource: '',
  signatureDataSourceDesc: '',
  signatureTime: '',
  buyerMobileRegistered: '',
  deliveryConfirmStatus: '',
  deliveryConfirmStatusDesc: '',
  cityDeliveryOrder: ''
};

export default {
  name: 'deliveryOrderEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    NavTop,
    ComponentTable,
    GenericDetailDisplay,
    EditPageLayout,
    EditBaseContainer,
    FetchSelect,
    DeliveryAppointmentDialog,
    VerifyOrderRightsDialog,
    PaymentRecordDialog,
    MessageDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '交车单编号：' + (this.form.deliveryOrderCode || '');
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
      pageTitle: '交车单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name 为小写驼峰格式
      moduleKey: 'AISVR-deliveryOrder',
      loading: false,
      submitLoading: false,
      // 按钮 loading 状态集合
      buttonLoading: {},
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      cityDeliveryOrderMin: 0,
      // 当前确认收款数据
      currentConfirmPaymentData: {},
      // 远程搜索方法
      remoteMethods: {
        // 初始方法
        saleUser: async (query) => {
          console.log('saleUser query:', query);
          return await engineerList({ username: query, salesConfigKey: 'saleUser', orgCodeList: ['100088'] });
        },
        deliveryUser: async (query) => {
          return await engineerList({ username: query, salesConfigKey: 'deliveryUser', orgCodeList: ['100088'] });
        },
        deliveryDerive: async (query) => {
          return await engineerList({ username: query, salesConfigKey: 'deliveryDerive', orgCodeList: ['100088'] });
        },
        listParentForOption: async (query) => {
          return await engineerList({ username: query, salesConfigKey: 'deliveryDerive', orgCodeList: ['100088'] });
        },
      },
      rules: {
        deliveryAdvisorId: [
          { required: true, message: '请选择订单交付顾问', trigger: 'change' }
        ],
        financePlan: [
          { required: true, message: '请选择金融方案', trigger: 'change' }
        ]
      },
      labelWidth: '150px',
      // 保险方案枚举
      insurancePlanOptions: [
        { value: 1010, label: '自行投保' },
        { value: 1020, label: '店内投保' }
      ],
      // 保险办理进度枚举
      insuranceProgressOptions: [
        { value: 1010, label: '保险沟通' },
        { value: 1020, label: '保险确定' }
      ],
      // 金融方案枚举
      financePlanOptions: [
        { value: 1010, label: '全款购车' },
        { value: 1020, label: '分期购车（非厂端金融）' },
        { value: 1030, label: '分期购车（厂端金融）' }
      ],
      // 金融按揭进度枚举
      financeProgressOptions: [
        { value: 1010, label: '申请中' },
        { value: 1020, label: '面签中' },
        { value: 1030, label: '已放款' },
        { value: 1040, label: '已办结' }
      ],
      orderBelongingFields: [
        { key: 'salesStoreName', label: '订单销售门店' },
        { key: 'salesAdvisorName', label: '订单销售顾问' },
        { key: 'deliveryStoreName', label: '订单交付门店' },
        { key: 'deliveryAdvisorName', label: '订单交付顾问' },
        { key: 'deliveryDerivativeUserName', label: '交付衍生工程师' },
        { key: 'onSiteDeliveryUserName', label: '现场交付工程师' },
        { key: 'exclusiveServiceStoreName', label: '专属服务门店' }
      ],
      deliveryInfoFields: [
        { key: 'receivableAmount', label: '门店应收金额' },
        { key: 'discountAmount', label: '门店优惠金额' },
        { key: 'otherAmount', label: '机动车发票其他费用' },
        { key: 'equityDeductionTotalAmount', label: '权益抵扣总额' },
        { key: 'invoiceAmount', label: '开票金额' },
        { key: 'remainingReceivableAmount', label: '剩余应收款' },
        { key: 'insurancePlan', label: '保险方案' },
        { key: 'insuranceProgress', label: '保险办理进度' },
        { key: 'financePlan', label: '金融方案' },
        { key: 'financeProgress', label: '金融按揭进度' },
        { key: 'deliveryMileage', label: '交车时里程' },
        { key: 'deliveryBatteryPower', label: '交车时电量' },
        { key: 'deliveryMachineVersion', label: '交车车机版本号' },
        { key: 'deliveryVersionUpgradeTime', label: '交车版本升级时间' }
      ],
      retailOrderFields: [
        { key: 'retailOrderStatus', label: '整车订单状态' },
        { key: 'orderCreateTime', label: '商城下单时间' },
        { key: 'mallOrderCode', label: '商城订单编号' },
        { key: 'orderSource', label: '订单来源' },
        { key: 'userId', label: '用户 ID' },
        { key: 'buyerName', label: '购车人姓名' },
        { key: 'buyerMobile', label: '购车人手机' },
        { key: 'idType', label: '证件类型' },
        { key: 'idNumber', label: '证件号码' },
        { key: 'agentContact', label: '代办联系人' },
        { key: 'vehicleGuidePrice', label: '整车指导价' },
        { key: 'depositAmount', label: '定金金额' },
        { key: 'orderMaterialCode', label: '订单物料码' },
        { key: 'vehicleMaterialCode', label: '配车物料码' },
        { key: 'salesStoreName', label: '销售门店' },
        { key: 'deliveryStoreName', label: '交付门店' }
      ],
      realNameAuthFields: [
        { key: 'realNameAuthSourceLabel', label: '实名认证来源' },
        { key: 'realNameAuthTime', label: '实名认证时间' }
      ],
      deliveryConfirmFields: [
        { key: 'signatureDataSourceDesc', label: '签署数据来源' },
        { key: 'signatureTime', label: '签署时间' },
        { key: 'buyerMobileRegisteredLabel', label: '购车人手机是否注册' },
        { key: 'deliveryConfirmStatusDesc', label: '交车确认单状态' },
        { key: 'cityDeliveryOrder', label: '城市交付顺序' }
      ],
      basicInfoFields: [
        { key: 'deliveryOrderCode', label: '交车单编号' },
        { key: 'vin', label: 'VIN 码' },
        { key: 'vehicleMaterial', label: '整车物料' },
        { key: 'retailOrderCode', label: '整车订单' },
        { key: 'deliveryTime', label: '交车时间' },
        { key: 'statusDesc', label: '交车状态' },
        { key: 'createTime', label: '创建时间' }
      ],
      appointmentFields: [
        { key: 'appointmentTime', label: '预约提车时间' },
        { key: 'appointmentDelayStatusLabel', label: '是否延期预约' },
        { key: 'appointmentChangeCount', label: '预约变更次数' },
        { key: 'appointmentOperationTime', label: '预约操作时间' },
        { key: 'appointmentRemark', label: '预约备注' },
        { key: 'appointmentTimeoutReason', label: '预约超时原因' }
      ],
      // 收款记录&权益项抵扣记录列配置
      paymentRecordColumns: [
        { field: 'paymentCode', title: '收款编号', width: 150 },
        { field: 'paymentTypeLabel', title: '收款类型', width: 120 },
        { field: 'paymentAmount', title: '付款金额', width: 120 },
        { field: 'paymentTime', title: '付款时间', width: 180 },
        { field: 'paymentMethodLabel', title: '支付方式', width: 120 },
        { field: 'payer', title: '支付人', width: 120 },
        { field: 'mallSerialNumber', title: '商城流水号', width: 150 },
        { field: 'rightsTypeLabel', title: '权益类型', width: 120 },
        { field: 'rightsItemCode', title: '权益项编号', width: 150 },
        { field: 'rightsGrantCode', title: '权益核销券码', width: 150 },
        { field: 'remark', title: '备注', width: 200 },
        { field: 'createTime', title: '创建时间', width: 180 },
        { field: 'operation', title: '操作', width: 80, fixed: 'right', slots: { default: 'operation_default' } }
      ],
      // 预约记录列配置
      appointmentRecordColumns: [
        { field: 'appointmentOperationTime', title: '预约操作时间', width: 200 },
        { field: 'appointmentOperator', title: '预约操作人', width: 120 },
        { field: 'appointmentTime', title: '预约时间', width: 200 },
        { field: 'timeoutReasonLabel', title: '超时原因', width: 360 },
        { field: 'changeTimeReasonLabel', title: '更改时间原因', width: 360 },
        { field: 'appointmentRemark', title: '预约备注', width: 360 }
      ],
      // 附件清单列配置
      attachmentColumns: [
        { field: 'attachmentName', title: '附件名称', width: 360 },
        { field: 'attachmentSuffix', title: '附件后缀', width: 160 },
        { field: 'attachmentSizeKB', title: '附件大小(KB)', width: 180 },
        { field: 'documentTypeLabel', title: '证件类型', width: 180 },
        { field: 'ocrRecognitionStatus', title: 'OCR识别状态', width: 180 },
        { field: 'createTime', title: '创建时间', width: 240 }
      ]
    };
  },
  mounted () {
    this.$nextTick(() => {
      // 需要默认隐藏的 section 标识列表
      const sectionsToHide = ['basicInfo', 'appointment', 'retailOrder', 'realNameAuth', 'deliveryConfirm', 'paymentRecords', 'appointmentRecords', 'attachments'];
      sectionsToHide.forEach(sectionKey => {
        const header = document.querySelector(`.common-section-header[data-section="${sectionKey}"]`);
        if (header && !header.classList.contains('fold')) {
          // 模拟点击，触发收起
          this.addHeaderActions({ target: header.querySelector('h2') });
        }
      });
    });
    this.loadCityDeliveryOrderMin();
  },
  methods: {
    getPaymentRecordList,
    handleSaleUserChange (val, row, name) {
      console.log('val', val);
      console.log('row', row);
      console.log('name', name + 'Name');
    },
    // 统一按钮 loading 管理工具方法
    // 用法：await this.withLoading('btnName', async () => { await api.xxx() })
    async withLoading (actionName, fn) {
      this.$set(this.buttonLoading, actionName, true);
      try {
        return await fn();
      } finally {
        this.$delete(this.buttonLoading, actionName);
      }
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    getDetail () {
      getDetail(this._id).then(res => {
        this.form = res;
      }).catch(() => {});
    },
    async submitRequest () {
      // 将表单校验封装为 Promise 并并行执行
      const validateForm = (formRef) => {
        return new Promise((resolve) => {
          if (formRef) {
            formRef.validate(valid => {
              resolve(valid);
            });
          } else {
            resolve(true); // 如果没有引用，视为校验通过
          }
        });
      };
      const [ruleForm1Valid, ruleForm2Valid] = await Promise.all([
        validateForm(this.$refs.ruleForm1),
        validateForm(this.$refs.ruleForm2)
      ]);
      if (ruleForm1Valid && ruleForm2Valid) {
        return addOrUpdate({ ...this.form });
      } else {
        return Promise.reject(new Error('表单校验未通过'));
      }
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // async fetchOptions (code) {
    //   if (code) {
    //     return getEnum(code);
    //   }
    //   return [];
    // },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
      };
    },
    // 计算城市交付顺序的最小值
    calculateCityDeliveryOrderMin (maxOrder) {
      let nextOrder = maxOrder + 1;
      // 如果末位为4，则再加1(为了吉利没有结尾4的交付顺序)
      if (nextOrder % 10 === 4) {
        nextOrder += 1;
      }
      return nextOrder;
    },
    // 加载城市交付顺序最小值
    async loadCityDeliveryOrderMin () {
      try {
        // const vehicleData = {
        //   vin: this.form.vin || this.$route.query.vin
        // };
        // 调用假接口获取当前城市最大交付顺序
        // const response = await getMaxCityDeliveryOrder(vehicleData);
        const response = 3;
        const maxOrder = response.data || 0;
        // 计算最小值
        this.cityDeliveryOrderMin = this.calculateCityDeliveryOrderMin(maxOrder);
        // 如果是新建记录且cityDeliveryOrder为空，设置默认值
        if (!this._id && !this.form.cityDeliveryOrder) {
          this.form.cityDeliveryOrder = this.cityDeliveryOrderMin;
        }
      } catch (error) {
        console.error('获取城市交付顺序失败:', error);
        // 如果失败，设置默认最小值为1
        this.cityDeliveryOrderMin = 1;
      }
    },
    // 预约交车
    async handleAppointmentDelivery () {
      // 1. 校验当前表单是否填写
      // const validateForm = (formRef) => {
      //   return new Promise((resolve) => {
      //     if (formRef) {
      //       formRef.validate(valid => {
      //         resolve(valid);
      //       });
      //     } else {
      //       resolve(true);
      //     }
      //   });
      // };
      // const [ruleForm1Valid, ruleForm2Valid] = await Promise.all([
      //   validateForm(this.$refs.ruleForm1),
      //   validateForm(this.$refs.ruleForm2)
      // ]);
      // if (!ruleForm1Valid || !ruleForm2Valid) {
      //   this.$message.warning('请先填写并保存表单信息');
      //   return;
      // }

      // 2. 调用接口校验购车人手机号是否注册
      try {
        const isRegistered = await this.checkBuyerMobileRegistered();
        // 3. 传给对话框组件
        this.$refs.deliveryAppointmentDialog.open(isRegistered);
      } catch (error) {
        console.error('校验手机号注册状态失败:', error);
        this.$message.error('校验手机号注册状态失败');
      }
    },
    // 校验购车人手机号是否注册（模拟接口）
    async checkBuyerMobileRegistered () {
      // 模拟接口返回
      return new Promise((resolve) => {
        setTimeout(() => {
          // 模拟随机返回注册或未注册
          const mockRegistered = Math.random() > 0.5;
          console.log('模拟校验结果：isRegistered =', mockRegistered);
          resolve(mockRegistered);
        }, 500);
      });
    },
    // 交车确认单生成
    async handleGenerateConfirmOrder () {
      await this.withLoading('generateConfirmOrder', async () => {
        await this.checkBuyerMobileRegistered();
        // 3. 成功后显示提示
        this.$confirm(`
          <div class="ais-leave-tips-main">
              <i class="iconfont icon-lxppc-prompt"></i>交车确认单提醒
            </div>
            <div class="ais-leave-tips-sub">交车确认单创建成功，请通知用户打开零跑 APP 站内信完成签署</div>
        `, '', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '',
          showCancelButton: false,
          showClose: false,
          customClass: 'ais-leave-tips',
        }).then(() => {}).catch(() => {});
      });
    },
    // 更改预约时间
    handleChangeAppointmentTime () {
      // if (!this.form.appointmentTime) {
      //   this.$message.warning('当前订单暂无预约时间，请使用「预约交车」功能');
      //   return;
      // }
      // 以更改预约时间模式打开对话框
      this.$refs.deliveryAppointmentDialog.openChangeAppointment({
        originalAppointmentTime: this.form.appointmentTime
      });
    },
    // 核销订单权益
    handleVerifyOrderRights () {
      if (!this._id) {
        this.$message.warning('请先保存订单信息');
        return;
      }
      this.$refs.verifyOrderRightsDialog.open();
    },
    // 核销撤回
    async handleVerifyWithdraw () {
      await this.withLoading('verifyWithdraw', async () => {
        await getDetail(this._id);
        this.$message.success('订单权益核销撤回成功');
      });
    },
    // 添加收款记录
    handleAddPaymentRecord () {
      if (!this._id) {
        this.$message.warning('请先保存订单信息');
        return;
      }
      this.$refs.paymentRecordDialog.open();
    },
    // 确认收款
    async handleConfirmPayment () {
      this.currentConfirmPaymentData = {}; // 重置当前确认收款数据
      await this.withLoading('confirmPayment', async () => {
        try {
          // 1. 校验开票金额：开票金额 = 补贴后价格 - 门店优惠金额 - 权益抵扣金额 + 机动车发票其他费用
          const invoiceAmountParams = {
            id: this._id,
            invoiceAmount: this.form.invoiceAmount,
            subsidyPrice: this.form.receivableAmount, // 补贴后价格使用门店应收金额
            discountAmount: this.form.discountAmount,
            equityDeductionTotalAmount: this.form.equityDeductionTotalAmount,
            otherAmount: this.form.otherAmount
          };
          const invoiceAmountResult = await validateInvoiceAmount(invoiceAmountParams);
          if (!invoiceAmountResult) {
            this.$message.error('交车订单付款记录不等于订单金额，不能确认收款');
            return;
          }

          // 2. 校验剩余应收款：剩余应收款 = 门店应收金额 - 收款类型为尾款/贷款/贷款首付款记录之和 = 0
          const remainingReceivableParams = {
            id: this._id,
            remainingReceivableAmount: this.form.remainingReceivableAmount,
            receivableAmount: this.form.receivableAmount
          };
          const remainingReceivableResult = await validateRemainingReceivable(remainingReceivableParams);
          if (!remainingReceivableResult) {
            this.$message.error('交车订单付款记录不等于订单金额，不能确认收款');
            return;
          }

          // 3. 校验是否存在未核销权益
          const unverifiedRightsParams = {
            id: this._id
          };
          const unverifiedRightsResult = await validateUnverifiedRights(unverifiedRightsParams);

          if (!unverifiedRightsResult.hasUnverifiedRights) {
            // 没有未核销权益，直接调用确认收款接口
            await this.submitConfirmPayment();
          } else {
            // 存在未核销权益，弹出二次确认对话框
            this.currentConfirmPaymentData.skipValidation = true;
            this.$refs.confirmPaymentDialog.open({
              title: '确认收款提醒',
              description: '该订单存在未核销的权益，请先核销权益再进行确认收款，是否继续确认收款？',
              type: 'warning',
              showCancel: true,
              confirmText: '确定',
              cancelText: '取消'
            });
          }
        } catch (error) {
          console.error('确认收款校验失败:', error);
          // 接口 1 或 2 失败时，显示错误提示
          // if (error.message) {
          //   this.$message.error(error.message);
          // }
        }
      });
    },
    // 确认收款 - 确认回调（二次确认框的确认按钮回调）
    async handleConfirmPaymentConfirm () {
      // 用户点击二次确认框的确定按钮，执行确认收款
      await this.submitConfirmPayment();
    },
    // 执行确认收款接口调用
    async submitConfirmPayment () {
      try {
        await confirmPayment({ id: this._id });
        this.$message.success('确认收款成功');
        this.getDetail();
        // 重置跳过校验标志
        this.currentConfirmPaymentData.skipValidation = false;
      } catch (error) {
        console.error('确认收款失败:', error);
        this.$message.error('确认收款失败');
      }
    },
    // 交车确认单补推
    handleRepushConfirmOrder () {},
    // 交车确认单重签
    handleReSignConfirmOrder () {
      this.$refs.messageDialog.open({
        title: '交车确认单重签',
        description: '确认重新生成用户交车确认单进行签署',
        type: 'warning',
        showCancel: true,
        confirmText: '确定',
        cancelText: '取消'
      });
    },
    // 交车确认单重签 - 确认回调
    async handleReSignConfirmOrderConfirm () {
      try {
        // 调用接口更新状态
        // await updateDeliveryConfirmStatus({ id: this._id });
        // 成功调用接口后，打开成功提示弹框进行二次提醒
        this.$refs.successMessageDialog.open({
          title: '交车确认单提醒',
          description: '交车确认单创建成功，请联系用户进行签署',
          type: 'success',
          showCancel: false
        });
        this.getDetail();
      } catch (error) {
        console.error('交车确认单重签失败:', error);
        this.$message.error('交车确认单重签失败');
      }
    },
    // 交车确认单重签 - 二次弹框确认后回调（可选）
    handleSuccessMessageConfirm () {
      // 如需在用户点击成功弹框的确定按钮后执行额外操作，可在此添加
    },
    // 查看交车确认单
    handleViewConfirmOrder () {},
    // 上传发票
    handleUploadInvoice () {},
    // 收款撤回
    handlePaymentWithdraw () {},
    // 交车撤回
    handleDeliveryWithdraw () {},
    handleDelete () {},
    // 判断收款记录是否可以删除
    canDeletePaymentRecord (row) {
      // 已预约状态的可以删除
      if (row.status !== '1010') {
        return false;
      }
      // 收款类型为门店优惠/贷款/尾款/贷款首付款/机动车发票其他费用可以删除
      const allowDeleteTypes = ['1020', '1030', '1040', '1050'];
      if (!allowDeleteTypes.includes(row.paymentType)) {
        return false;
      }
      return true;
    },
    // 删除收款记录
    async handleDeletePaymentRecord (row) {
      if (!row.id) {
        this.$message.warning('收款记录 ID 不存在');
        return;
      }
      try {
        await this.$confirm('确认删除该收款记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
      } catch (error) {
        return;
      }
      try {
        await deletePaymentRecord([row.id]);
        this.$message.success('删除成功');
        // 刷新表格
        if (this.$refs.paymentRecordTable) {
          this.$refs.paymentRecordTable.refresh();
        }
      } catch (error) {
        console.error('删除收款记录失败:', error);
        this.$message.error('删除失败');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-delivery-order-edit {
}
</style>
