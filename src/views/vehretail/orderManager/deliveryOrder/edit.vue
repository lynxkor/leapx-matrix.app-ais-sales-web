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
        :showEditBtn="form.status !== 7 && form.status !== 99"
        :key="reloadKey"
      >
        <template #status>
          <!-- 支持 primary,warning,success,danger 等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- 交车状态： 1-待预约 2-待检测 3-已检测 4-已预约 5-已收尾款 6-车联网已开通 7-交车完成 99-作废 -->
          <el-button v-if="canAppointment && form.status === 1" size="small" @click="handleAppointmentDelivery">预约交车</el-button>
          <el-button v-if="canDeliveryConfirm && form.status === 5" size="small" :loading="buttonLoading['generateConfirmOrder']" @click="handleGenerateConfirmOrder">交车确认单生成</el-button>
          <el-button v-if="canChangeAppointmentTime && form.status === 4" size="small" @click="handleChangeAppointmentTime">更改预约时间</el-button>
          <el-button v-if="canCancelOrderRights && form.status === 4" size="small" @click="handleVerifyOrderRights">核销订单权益</el-button>
          <el-button v-if="canRevertCancelOrderRights && form.status === 4 && form.payRightsList && form.payRightsList.some(item => item.paymentType === 1060 || item.paymentType === '1060')" size="small" :loading="buttonLoading['verifyWithdraw']" @click="handleVerifyWithdraw">核销撤回</el-button>
          <el-button v-if="canAddPaymentRecord && form.status === 4" size="small" @click="handleAddPaymentRecord">添加收款记录</el-button>
          <el-button v-if="canConfirmPayment && form.status === 4" size="small" :loading="buttonLoading['confirmPayment']" @click="handleConfirmPayment">确认收款</el-button>
          <el-button v-if="canDeliveryConfirmPush && form.status === 4 && form.deliveryConfirmPdfUrl" size="small" :loading="buttonLoading['repushConfirmOrder']" @click="handleRepushConfirmOrder">交车确认单补推</el-button>
          <el-button v-if="canDeliveryConfirmResign && form.status !== 7 && form.status !== 99 && form.deliveryConfirmStatus === 15" size="small" @click="handleReSignConfirmOrder">交车确认单重签</el-button>
          <el-button v-if="canViewDeliveryConfirm && form.deliveryConfirmStatus === 15 && form.status !== 99" size="small" @click="handleViewConfirmOrder">查看交车确认单</el-button>
          <el-button v-if="canUploadInvoice && form.status === 5" size="small" @click="handleUploadInvoice">上传发票</el-button>
          <el-button v-if="canCancelPayment && form.status === 5" size="small" @click="handlePaymentWithdraw">收款撤回</el-button>
          <el-button v-if="canCancelDelivery && form.status === 7" size="small" @click="handleDeliveryWithdraw">交车撤回</el-button>
          <el-button v-if="canPushDeliveryActive && form.deliveryConfirmStatus !== 99" size="small" @click="handleDeliveryActive">推送激活信息</el-button>
        </template>
        <el-main>
          <!--  -->
          <NavTop title="交车单步骤" :step-highlight="form.deliveryOrderStepResp"/>
          <!-- 订单归属 -->
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header" data-section="orderBelonging">
              <h2>订单归属</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" :label-width="labelWidth" class="form-edit">
                <el-form-item label="订单销售门店：" prop="saleDealerName">
                  <el-input v-model="form.saleDealerName" disabled />
                </el-form-item>
                <el-form-item label="订单销售顾问：" prop="saleUserId">
                  <el-select
                    filterable
                    clearable
                    remote
                    v-model="form.saleUserId"
                    :remote-method="(query) => handleRemoteSearch(query, 'saleUser')"
                    value-key="userId"
                    label-key="username"
                    placeholder="请搜索"
                    @change="(val) => handleSaleUserChange(val, 'saleUser')"
                  >
                    <el-option
                      v-for="item in saleUserOptions"
                      :key="item.userId"
                      :label="item.username"
                      :value="item.userId"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="订单交付门店：" prop="deliveryDealerName">
                  <el-input v-model="form.deliveryDealerName" disabled />
                </el-form-item>
                <el-form-item label="订单交付顾问：" prop="deliveryUserId">
                  <el-select
                    filterable
                    clearable
                    remote
                    v-model="form.deliveryUserId"
                    :remote-method="(query) => handleRemoteSearch(query, 'deliveryUser')"
                    value-key="userId"
                    label-key="username"
                    placeholder="请搜索"
                    @change="(val) => handleSaleUserChange(val, 'deliveryUser')"
                  >
                    <el-option
                      v-for="item in deliveryUserOptions"
                      :key="item.userId"
                      :label="item.username"
                      :value="item.userId"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="交付衍生工程师：" prop="deliveryDerivativeUserId">
                  <el-select
                    filterable
                    clearable
                    remote
                    v-model="form.deliveryDerivativeUserId"
                    :remote-method="(query) => handleRemoteSearch(query, 'deliveryDerive')"
                    value-key="userId"
                    label-key="username"
                    placeholder="请搜索"
                    @change="(val) => handleSaleUserChange(val, 'deliveryDerivativeUser')"
                  >
                    <el-option
                      v-for="item in deliveryDeriveOptions"
                      :key="item.userId"
                      :label="item.username"
                      :value="item.userId"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="现场交付工程师：" prop="onSiteDeliveryUserId">
                  <el-select
                    filterable
                    clearable
                    remote
                    v-model="form.onSiteDeliveryUserId"
                    :remote-method="(query) => handleRemoteSearch(query, 'onSiteDeliveryUser')"
                    value-key="userId"
                    label-key="username"
                    placeholder="请搜索"
                    @change="(val) => handleSaleUserChange(val, 'onSiteDeliveryUser')"
                  >
                    <el-option
                      v-for="item in onSiteDeliveryUserOptions"
                      :key="item.userId"
                      :label="item.username"
                      :value="item.userId"
                      :disabled="item.disabled"
                    />
                  </el-select>
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
                <el-form-item label="保险方案：" prop="insuranceScheme">
                  <fetch-select
                    :options="insuranceSchemeOptions"
                    :valueKey="'value'"
                    :labelKey="'label'"
                    v-model="form.insuranceScheme"
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
                <el-form-item label="金融方案：" prop="financialScheme">
                  <fetch-select
                    :options="financialSchemeOptions"
                    :valueKey="'value'"
                    :labelKey="'label'"
                    v-model="form.financialScheme"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="onFinancialSchemeChange"
                  />
                </el-form-item>
                <el-form-item label="金融按揭进度：" prop="financialMortgageProgress">
                  <fetch-select
                    :options="financialMortgageProgressOptions"
                    :valueKey="'value'"
                    :labelKey="'label'"
                    v-model="form.financialMortgageProgress"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="form.financialScheme === '1010'"
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
          <generic-detail-display title="交车确认单" :form-data="form" :fields="deliveryConfirmFields" :label-width="labelWidth" section-key="deliveryConfirm" />
          <!-- 收款记录&权益项抵扣记录 -->
          <component-table
            ref="paymentRecordTable"
            :table-config="{ title: '收款记录&权益项抵扣记录' }"
            :columns="paymentRecordColumns"
            :api-method="getPaymentRecordList"
            :lazy="true"
            :extra-params="{ retailOrderCode: form.retailOrderCode }"
            section-key="paymentRecords"
          >
            <template v-slot:operation_default="{ row }">
              <el-link
                v-if="form.status === 4 && canDeletePaymentRecord(row)"
                type="danger"
                :underline="false"
                @click="handleDeletePaymentRecord(row)"
              >删除</el-link>
            </template>
          </component-table>
          <!-- 预约记录 -->
          <component-table
            ref="deliveryAppointmentRecordTable"
            :table-config="{ title: '预约记录' }"
            :columns="deliveryAppointmentRecordColumns"
            section-key="deliveryAppointmentRecordRecords"
            :tableDataExternal="form.appointmentRecordList"
          />
          <!-- 附件清单 -->
          <section class="common-section" section-key="appointmentRecords">
            <div class="common-section-header" data-section="orderBelonging">
              <h2>附件清单</h2>
            </div>
            <div class="common-section-body">
              <AisAttachmentList
                ref="attachmentList"
                :businessId="form.deliveryInvoiceId"
                :readonly="!isEditing"
              />
            </div>
          </section>
        </el-main>
      </edit-base-container>
      <!-- 预约交车对话框组件 -->
      <delivery-appointment-dialog
        ref="deliveryAppointmentDialog"
        :deliveryUserId="form.deliveryUserId"
        :deliveryCityId="form.deliveryCityCode"
        :createTime="form.createTime"
        :orderId="_id"
        :cityCode="form.deliveryCityCode"
        :orderCode="form.deliveryOrderCode"
        :originalAppointmentTime="form.appointmentTime"
        @refresh="getDetail"
      />
      <!-- 核销权益对话框组件 -->
      <verify-order-rights-dialog
        ref="verifyOrderRightsDialog"
        :orderId="_id"
        :orderUserId="form.orderUserId"
        :deliveryOrderId="form.deliveryOrderId"
        :shopCode="form.mallOrderCode"
        :retailOrderId="form.retailOrderId"
        @refresh="getDetail"
      />
      <!-- 收款记录对话框组件 -->
      <payment-record-dialog
        ref="paymentRecordDialog"
        :orderId="_id"
        :deliveryOrderId="form.deliveryOrderId"
        :financePlan="form.financialScheme"
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
import {
  getDetail,
  addOrUpdate, // 新增/修改
  validateInvoiceAmount, // 确认收款-校验开票金额-卡点
  validateRemainingReceivableAmount, // 确认收款-校验剩余应收款-卡点
  openGrantQuery, // 核销订单权益列表
  confirmPayment, // 确认收款
  cancelDelivery, // 交车撤回
  cancelPayment, // 收款撤回
  uploadInvoice, // 上传发票
  viewDeliveryConfirm, // 交车确认单查看
  deliveryConfirmResign, // 交车确认单重签
  deliveryConfirmPush, // 交车确认单推送
  deliveryConfirm, // 交车确认单生成
  checkCarBuyerPhoneRegistered, pushDeliveryActive, // 校验购车人手机号是否注册零跑APP
} from '@/api/vehretail/orderManager/deliveryOrder/index';
import {
  getEffectiveByDeliveryOrderId
} from '@/api/vehretail/orderManager/deliveryInvoice/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { engineerList } from '@/libs/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import { getList as getPaymentRecordList, deleteItem as deletePaymentRecord } from '@/api/vehretail/orderManager/orderPayRecord/index';
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
import AisAttachmentList from '@/libs/components/AisAttachmentList';

const defaultForm = {
  // 订单归属
  saleDealerCode: '',
  saleDealerName: '',
  saleUserId: '',
  saleUserName: '',
  deliveryDealerCode: '',
  deliveryDealerName: '',
  deliveryUserId: '',
  deliveryUserName: '',
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
  insuranceScheme: '',
  insuranceProgress: '',
  financialScheme: '',
  financialMortgageProgress: '',
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
    MessageDialog,
    AisAttachmentList
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
    },
    'form.retailOrderCode': {
      handler (val) {
        console.log('[edit.vue] retailOrderCode changed to:', val);
        if (val && this.$refs.paymentRecordTable) {
          this.$refs.paymentRecordTable.refresh();
        }
      }
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
      // 用于强制重新渲染按钮组的 key
      reloadKey: 0,
      // 按钮 loading 状态集合
      buttonLoading: {},
      // 权限控制
      canAppointment: false, // 预约交车
      canDeliveryConfirm: false, // 交车确认单生成
      canChangeAppointmentTime: false, // 更改预约时间
      canCancelOrderRights: false, // 核销订单权益
      canRevertCancelOrderRights: false, // 核销撤回
      canAddPaymentRecord: false, // 添加收款记录
      canConfirmPayment: false, // 确认收款
      canDeliveryConfirmPush: false, // 交车确认单补推
      canDeliveryConfirmResign: false, // 交车确认单重签
      canViewDeliveryConfirm: false, // 查看交车确认单
      canUploadInvoice: false, // 上传发票
      canCancelPayment: false, // 收款撤回
      canCancelDelivery: false, // 交车撤回
      canPushDeliveryActive: false, // 推送激活信息
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      cityDeliveryOrderMin: 0,
      // 远程搜索下拉数据
      saleUserOptions: [],
      deliveryUserOptions: [],
      deliveryDeriveOptions: [],
      onSiteDeliveryUserOptions: [],
      // 当前确认收款数据
      currentConfirmPaymentData: {},
      // 远程搜索方法
      remoteMethods: {
        // 初始方法
        saleUser: async (query, orgCode) => {
          const dealerCode = orgCode || this.form.saleDealerCode;
          if (!dealerCode) return [];
          return await engineerList({ username: query, salesConfigKey: 'saleUser', orgCodeList: [dealerCode] });
        },
        deliveryUser: async (query, orgCode) => {
          const dealerCode = orgCode || this.form.deliveryDealerCode;
          if (!dealerCode) return [];
          return await engineerList({ username: query, salesConfigKey: 'deliveryUser', orgCodeList: [dealerCode] });
        },
        deliveryDerive: async (query, orgCode) => {
          const dealerCode = orgCode || this.form.deliveryDealerCode;
          if (!dealerCode) return [];
          return await engineerList({ username: query, salesConfigKey: 'deliveryDerive', orgCodeList: [dealerCode] });
        },
        listParentForOption: async (query, orgCode) => {
          const dealerCode = orgCode || this.form.deliveryDealerCode;
          if (!dealerCode) return [];
          return await engineerList({ username: query, salesConfigKey: 'deliveryDerive', orgCodeList: [dealerCode] });
        },
      },
      rules: {
        insuranceScheme: [
          { required: true, message: '请选择保险方案', trigger: 'change' }
        ],
        saleUserId: [
          { required: true, message: '请选择订单交付顾问', trigger: 'change' }
        ],
        deliveryUserId: [
          { required: true, message: '请选择订单交付顾问', trigger: 'change' }
        ],
        financialScheme: [
          { required: true, message: '请选择金融方案', trigger: 'change' }
        ]
      },
      labelWidth: '150px',
      // 保险方案枚举
      insuranceSchemeOptions: [
        { value: '1010', label: '自行投保' },
        { value: '1020', label: '店内投保' }
      ],
      // 保险办理进度枚举
      insuranceProgressOptions: [
        { value: '1010', label: '保险沟通' },
        { value: '1020', label: '保险确定' }
      ],
      // 金融方案枚举
      financialSchemeOptions: [
        { value: '1010', label: '全款购车' },
        { value: '1020', label: '分期购车（非厂端金融）' },
        { value: '1030', label: '分期购车（厂端金融）' }
      ],
      // 金融按揭进度枚举
      financialMortgageProgressOptions: [
        { value: '1010', label: '申请中' },
        { value: '1020', label: '面签中' },
        { value: '1030', label: '已放款' },
        { value: '1040', label: '已办结' }
      ],
      orderBelongingFields: [
        { key: 'saleDealerName', label: '订单销售门店', link: '/partner/channelManagement/shopDetail', paramKey: 'saleDealerCode', paramName: 'dealerCode' },
        { key: 'saleUserName', label: '订单销售顾问' },
        { key: 'deliveryDealerName', label: '订单交付门店', link: '/partner/channelManagement/shopDetail', paramKey: 'deliveryDealerCode', paramName: 'dealerCode' },
        { key: 'deliveryUserName', label: '订单交付顾问' },
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
        { key: 'insuranceSchemeLabel', label: '保险方案' },
        { key: 'insuranceProgressLabel', label: '保险办理进度' },
        { key: 'financialSchemeLabel', label: '金融方案' },
        { key: 'financialMortgageProgressLabel', label: '金融按揭进度' },
        { key: 'deliveryMileage', label: '交车时里程' },
        { key: 'deliveryBatteryPower', label: '交车时电量' },
        { key: 'deliveryMachineVersion', label: '交车车机版本号' },
        { key: 'deliveryVersionUpgradeTime', label: '交车版本升级时间' }
      ],
      retailOrderFields: [
        { key: 'orderStatusLabel', label: '整车订单状态' },
        { key: 'orderTime', label: '商城下单时间' },
        { key: 'mallOrderCode', label: '商城订单编号' },
        { key: 'orderSource', label: '订单来源' },
        { key: 'orderUserId', label: '用户 ID' },
        { key: 'carBuyerName', label: '购车人姓名' },
        { key: 'carBuyerPhone', label: '购车人手机' },
        { key: 'idCardTypeLabel', label: '证件类型' },
        { key: 'idCardNo', label: '证件号码' },
        { key: 'agentName', label: '代办联系人' },
        { key: 'guidePrice', label: '整车指导价' },
        { key: 'depositAmount', label: '定金金额' },
        { key: 'orderMaterialCode', label: '订单物料码', link: '/sales/datacenter/materials/vehiclematerials/edit', paramKey: 'orderMaterialCode' },
        { key: 'allocationMaterialCode', label: '配车物料码', link: '/sales/datacenter/materials/vehiclematerials/edit', paramKey: 'allocationMaterialsCode' },
        { key: 'saleDealerName', label: '销售门店', link: '/partner/channelManagement/shopDetail', paramKey: 'saleDealerCode', paramName: 'dealerCode' },
        { key: 'deliveryDealerName', label: '交付门店', link: '/partner/channelManagement/shopDetail', paramKey: 'deliveryDealerCode', paramName: 'dealerCode' },
        { key: 'deliveryVin', label: '交车VIN码' },
        { key: 'deliveryTime', label: '交车时间' },
      ],
      realNameAuthFields: [
        { key: 'realNameAuthSourceLabel', label: '实名认证来源' },
        { key: 'realNameAuthTime', label: '实名认证时间' }
      ],
      deliveryConfirmFields: [
        { key: 'signatureDataSourceLabel', label: '签署数据来源' },
        { key: 'signatureTime', label: '签署时间' },
        { key: 'buyerMobileRegisteredLabel', label: '购车人手机是否注册' },
        { key: 'deliveryConfirmStatusLabel', label: '交车确认单状态' },
        { key: 'cityDeliveryOrder', label: '城市交付顺序' },
        { key: 'deliveryConfirmPdfUrl', label: '交车确认PDF', class: 'form-item-full', download: true },
        { key: 'deliveryConfirmSignUrl', label: '交车确认用户签名', class: 'form-item-full', download: true },
      ],
      basicInfoFields: [
        { key: 'deliveryOrderCode', label: '交车单编号' },
        { key: 'vin', label: 'VIN 码', link: '/service/datacenter/vehicle/vehicleProfile/edit', paramKey: 'vin', paramName: 'vin' },
        { key: 'materialsCode', label: '整车物料', link: '/sales/datacenter/materials/vehiclematerials/edit', paramKey: 'materialsCode' },
        { key: 'retailOrderCode', label: '整车订单', link: '/sales/vehretail/ordermanager/retailorderinfo/edit', paramKey: 'retailOrderId' },
        { key: 'deliveryTime', label: '交车时间' },
        { key: 'statusLabel', label: '交车状态' },
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
      // 预约记录列配置
      appointmentRecordColumns: [
        { field: 'appointmentOperationTime', title: '预约操作时间', width: 200 },
        { field: 'appointmentOperator', title: '预约操作人', width: 120 },
        { field: 'appointmentTime', title: '预约时间', width: 200 },
        { field: 'timeoutReasonLabel', title: '超时原因', width: 360 },
        { field: 'changeTimeReasonLabel', title: '更改时间原因', width: 360 },
        { field: 'appointmentRemark', title: '预约备注', width: 360 }
      ],
      // 收款记录列配置
      paymentRecordColumns: [
        { field: 'payCode', title: '收款编号', width: 180 },
        { field: 'payCategoryLabel', title: '收款类型', width: 120 },
        { field: 'paymentAmount', title: '付款金额', width: 120 },
        { field: 'paymentTime', title: '付款时间', width: 180 },
        { field: 'paymentTypeLabel', title: '支付方式', width: 120 },
        { field: 'payerName', title: '支付人', width: 120 },
        { field: 'outTradeNo', title: '商城流水号', width: 200 },
        { field: 'rightsTypeLabel', title: '权益类型', width: 120 },
        { field: 'rightsItemCode', title: '权益项编号', width: 150 },
        { field: 'rightsGrantCode', title: '权益核销券码', width: 150 },
        { field: 'remark', title: '备注', width: 200 },
        { field: 'createTime', title: '创建时间', width: 180 },
        { field: 'operation', title: '操作', width: 80, fixed: 'right', slots: { default: 'operation_default' } }
      ],
      // 预约记录
      deliveryAppointmentRecordColumns: [
        { field: 'appointmentOperationTime', title: '预约操作时间', width: 180 },
        { field: 'creatorName', title: '预约操作人', width: 180 },
        { field: 'appointmentTimeAfter', title: '预约时间', width: 180 },
        { field: 'appointmentTimeoutReason', title: '超时原因', width: 180 },
        { field: 'changeTimeReason', title: '更改时间原因', width: 180 },
        { field: 'appointmentRemark', title: '预约备注' }
      ]
    };
  },
  created () {
    this.initPermissions();
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
    // this.loadCityDeliveryOrderMin();
  },
  methods: {
    getPaymentRecordList,
    // 初始化权限
    initPermissions () {
      this.canAppointment = this.permissions.has(`${this.moduleKey}-appointment`);
      this.canDeliveryConfirm = this.permissions.has(`${this.moduleKey}-deliveryConfirm`);
      this.canChangeAppointmentTime = this.permissions.has(`${this.moduleKey}-changeAppointmentTime`);
      this.canCancelOrderRights = this.permissions.has(`${this.moduleKey}-cancelOrderRights`);
      this.canRevertCancelOrderRights = this.permissions.has(`${this.moduleKey}-revertCancelOrderRights`);
      this.canAddPaymentRecord = this.permissions.has(`${this.moduleKey}-addPaymentRecord`);
      this.canConfirmPayment = this.permissions.has(`${this.moduleKey}-confirmPayment`);
      this.canDeliveryConfirmPush = this.permissions.has(`${this.moduleKey}-deliveryConfirmPush`);
      this.canDeliveryConfirmResign = this.permissions.has(`${this.moduleKey}-deliveryConfirmResign`);
      this.canViewDeliveryConfirm = this.permissions.has(`${this.moduleKey}-viewDeliveryConfirm`);
      this.canUploadInvoice = this.permissions.has(`${this.moduleKey}-uploadInvoice`);
      this.canCancelPayment = this.permissions.has(`${this.moduleKey}-cancelPayment`);
      this.canCancelDelivery = this.permissions.has(`${this.moduleKey}-cancelDelivery`);
      this.canPushDeliveryActive = this.permissions.has(`${this.moduleKey}-pushDeliveryActive`);
    },
    handleSaleUserChange (val, name) {
      // 找到选中的选项，更新对应的 Name
      const optionsMap = {
        saleUser: this.saleUserOptions,
        deliveryUser: this.deliveryUserOptions,
        deliveryDerivativeUser: this.deliveryDeriveOptions,
        onSiteDeliveryUser: this.onSiteDeliveryUserOptions
      };
      const options = optionsMap[name] || [];
      const selected = options.find(item => String(item.userId) === String(val));
      if (selected) {
        this.form[name + 'Name'] = selected.username;
      }
    },
    // 远程搜索公共方法
    async handleRemoteSearch (query, type) {
      const configMap = {
        saleUser: { key: 'saleUser', method: this.remoteMethods.saleUser, formKey: 'saleUser', orgKey: 'saleDealerCode' },
        deliveryUser: { key: 'deliveryUser', method: this.remoteMethods.deliveryUser, formKey: 'deliveryUser', orgKey: 'deliveryDealerCode' },
        deliveryDerive: { key: 'deliveryDerive', method: this.remoteMethods.deliveryDerive, formKey: 'deliveryDerivativeUser', orgKey: 'deliveryDealerCode' },
        onSiteDeliveryUser: { key: 'onSiteDeliveryUser', method: this.remoteMethods.deliveryUser, formKey: 'onSiteDeliveryUser', orgKey: 'deliveryDealerCode' }
      };
      const config = configMap[type];
      if (!config) return;

      const { key, method, formKey, orgKey } = config;
      const orgCode = this.form[orgKey];
      const res = await method(query, orgCode);
      const list = res?.data || res || [];

      // 外部数据合并：查询结果 + params值(如果有且不重复则添加并标注不可选)
      const currentId = this.form[formKey + 'Id'];
      const currentName = this.form[formKey + 'Name'];
      const optionsKey = key + 'Options';

      // 检查当前值是否在列表中，不在则添加
      const exists = list.some(item => String(item.userId) === String(currentId));
      const finalList = [...list];
      if (currentId && currentName && !exists) {
        finalList.push({ userId: currentId, username: currentName, disabled: true });
      }

      this[optionsKey] = finalList;
    },
    onFinancialSchemeChange (val) {
      if (val === '1010') {
        this.form.financialMortgageProgress = '';
      }
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
        return getDetail(id).then(res => {
          res.saleUserId = res.saleUserId ? String(res.saleUserId) : '';
          res.deliveryUserId = res.deliveryUserId ? String(res.deliveryUserId) : '';
          res.deliveryDerivativeUserId = res.deliveryDerivativeUserId ? String(res.deliveryDerivativeUserId) : '';
          res.onSiteDeliveryUserId = res.onSiteDeliveryUserId ? String(res.onSiteDeliveryUserId) : '';
          // 初始化下拉数据
          this.$nextTick(() => {
            if (res.saleUserId) this.handleRemoteSearch('', 'saleUser');
            if (res.deliveryUserId) this.handleRemoteSearch('', 'deliveryUser');
            if (res.deliveryDerivativeUserId) this.handleRemoteSearch('', 'deliveryDerive');
            if (res.onSiteDeliveryUserId) this.handleRemoteSearch('', 'onSiteDeliveryUser');
          });
          return res;
        });
      }
    },
    getDetail () {
      this.$refs.containerRef?.loadDetail();
      // 刷新收款记录表格
      this.$refs.paymentRecordTable?.refresh();
      // 刷新附件列表
      this.$refs.attachmentList?.refresh();
    },
    // 允许提交的字段白名单 (与 API 字段名一致)
    getSubmitFields () {
      return [
        'id',
        'saleUserId',
        'saleUserName',
        'deliveryUserId',
        'deliveryUserName',
        'deliveryDerivativeUserId',
        'deliveryDerivativeUserName',
        'onSiteDeliveryUserId',
        'onSiteDeliveryUserName',
        'insuranceScheme',
        'insuranceProgress',
        'financialScheme',
        'financialMortgageProgress',
        'cityDeliveryOrder',
        'remark'
      ];
    },
    // 过滤提交参数，只保留允许的字段
    filterSubmitParams (form) {
      const allowedFields = this.getSubmitFields();
      const params = {};
      allowedFields.forEach(field => {
        const value = form[field];
        // 只提交非空值
        if (value !== undefined && value !== null && value !== '') {
          params[field] = value;
        }
      });
      params.id = this._id;
      return params;
    },
    async submitRequest () {
      // 将表单校验封装为 Promise 并并行执行
      const validateForm = (formRef) => {
        return new Promise((resolve, reject) => {
          if (formRef) {
            formRef.validate(valid => {
              if (valid) {
                resolve(true);
              } else {
                reject(new Error('表单校验失败'));
              }
            });
          } else {
            resolve(true); // 如果没有引用，视为校验通过
          }
        });
      };
      await Promise.all([
        validateForm(this.$refs.ruleForm1),
        validateForm(this.$refs.ruleForm2)
      ]);
      const submitParams = this.filterSubmitParams(this.form);
      return addOrUpdate(submitParams);
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
      const validateForm = (formRef) => {
        return new Promise((resolve) => {
          if (formRef) {
            formRef.validate(valid => {
              resolve(valid);
            });
          } else {
            resolve(true);
          }
        });
      };
      const [ruleForm1Valid, ruleForm2Valid] = await Promise.all([
        validateForm(this.$refs.ruleForm1),
        validateForm(this.$refs.ruleForm2)
      ]);
      if (!ruleForm1Valid || !ruleForm2Valid) {
        this.$message.warning('请先填写并保存表单信息');
        return;
      }
      // 2. 调用接口校验购车人手机号是否注册
      try {
        const isRegistered = await checkCarBuyerPhoneRegistered(this.form.carBuyerPhone);
        // 3. 传给对话框组件
        this.$refs.deliveryAppointmentDialog.open(isRegistered);
      } catch (error) {
        console.error('校验手机号注册状态失败:', error);
        this.$message.error('校验手机号注册状态失败');
      }
    },
    // 交车确认单生成
    async handleGenerateConfirmOrder () {
      await this.withLoading('generateConfirmOrder', async () => {
        await deliveryConfirm(
          {
            deliveryOrderId: this.form.deliveryOrderId,
            deliveryOrderCode: this.form.deliveryOrderCode
          }
        ); ;
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
        }).then(() => {
          this.getDetail();
        }).catch(() => {});
      });
    },
    // 更改预约时间
    handleChangeAppointmentTime () {
      if (!this.form.appointmentTime) {
        this.$message.warning('当前订单暂无预约时间，请使用「预约交车」功能');
        return;
      }
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
      this.$refs.verifyOrderRightsDialog.open(this.form.mallOrderCode, 2);
    },
    // 核销撤回
    handleVerifyWithdraw () {
      if (!this._id) {
        this.$message.warning('请先保存订单信息');
        return;
      }
      this.$refs.verifyOrderRightsDialog.open(this.form.mallOrderCode, 4);
    },
    // 添加收款记录
    handleAddPaymentRecord () {
      this.$refs.paymentRecordDialog.open();
    },
    // 确认收款
    async handleConfirmPayment () {
      this.currentConfirmPaymentData = {}; // 重置当前确认收款数据
      await this.withLoading('confirmPayment', async () => {
        try {
          // 1. 校验开票金额：开票金额 = 补贴后价格 - 门店优惠金额 - 权益抵扣金额 + 机动车发票其他费用
          const invoiceAmountParams = {
            deliveryOrderId: this.form.deliveryOrderId,
            retailOrderId: this.form.retailOrderId
          };
          const invoiceAmountResult = await validateInvoiceAmount(invoiceAmountParams);
          if (!invoiceAmountResult) {
            this.$message.error('交车订单付款记录不等于订单金额，不能确认收款');
            return;
          }

          // 2. 校验剩余应收款：剩余应收款 = 门店应收金额 - 收款类型为尾款/贷款/贷款首付款记录之和 = 0
          const remainingReceivableParams = {
            deliveryOrderId: this.form.deliveryOrderId,
            retailOrderId: this.form.retailOrderId
          };
          const remainingReceivableResult = await validateRemainingReceivableAmount(remainingReceivableParams);
          if (!remainingReceivableResult) {
            this.$message.error('交车订单付款记录不等于订单金额，不能确认收款');
            return;
          }

          // 3. 校验是否存在未核销权益
          const unverifiedRightsParams = {
            userId: this.form.orderUserId,
            shopCode: this.form.mallOrderCode
          };
          const unverifiedRightsResult = await openGrantQuery(unverifiedRightsParams);
          let hasUnverifiedRights = false;
          if (Array.isArray(unverifiedRightsResult) && unverifiedRightsResult.length > 0) {
            // 检查是否存在未核销的权益（status !== '2'）
            hasUnverifiedRights = unverifiedRightsResult.some(item => item.status !== 2);
          }
          if (!hasUnverifiedRights) {
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
        await confirmPayment({ deliveryOrderId: this._id, retailOrderId: this.form.retailOrderId });
        this.$message.success('确认收款成功');
        this.getDetail();
        // 重置跳过校验标志
        this.currentConfirmPaymentData.skipValidation = false;
      } catch (error) {
        console.error('确认收款失败:', error);
        // this.$message.error('确认收款失败');
      }
    },
    // 交车确认单补推
    async handleRepushConfirmOrder () {
      await this.withLoading('repushConfirmOrder', async () => {
        await deliveryConfirmPush({ deliveryOrderId: this.form.deliveryOrderId, retailOrderId: this.form.retailOrderId });
        this.$message.success('交车确认单补推成功');
        this.getDetail();
      });
    },
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
        await deliveryConfirmResign({ deliveryOrderId: this.form.deliveryOrderId, retailOrderId: this.form.retailOrderId });
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
      }
    },
    // 交车确认单重签 - 二次弹框确认后回调（可选）
    handleSuccessMessageConfirm () {
      // 如需在用户点击成功弹框的确定按钮后执行额外操作，可在此添加
    },
    // 查看交车确认单
    handleViewConfirmOrder () {
      viewDeliveryConfirm({ deliveryOrderId: this.form.deliveryOrderId, retailOrderId: this.form.retailOrderId }).then(res => {
        if (res) {
          console.log('handleViewConfirmOrder,res', res);
          window.open(res, '_blank');
        } else {
          this.$message.error('暂无生成交车确认单');
        }
      }).catch(() => {});
    },
    // 交车确认单激活
    handleDeliveryActive () {
      pushDeliveryActive({ deliveryOrderId: this.form.deliveryOrderId, retailOrderId: this.form.retailOrderId })
        .then(res => {
          this.$message.success('交车确认单激活推送成功');
          this.getDetail();
        });
    },
    // 上传发票
    handleUploadInvoice () {
      if (this.form.deliveryConfirmStatus === 5) {
        this.$confirm('未生成交车确认单，是否生成交车确认单进行签署', '交车确认单生成提醒', {
          distinguishCancelAndClose: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.doUploadInvoice(false);
        }).catch(action => {
          if (action !== 'cancel') {
            return;
          }
          this.doUploadInvoice(true);
        });
      } else {
        // 查询是否已存在开票记录
        getEffectiveByDeliveryOrderId(this.form.deliveryOrderId).then(res => {
          if (res) {
            this.$router.push({
              path: '/vehretail/orderManager/deliveryInvoice/edit',
              query: {
                id: res.id
              }
            });
          } else {
            this.$confirm('未生成整车开票记录，请确认是否生成', '上传发票', {
              distinguishCancelAndClose: true,
              cancelButtonText: '取消',
              confirmButtonText: '确定',
              type: 'warning'
            }).then(() => {
              this.doUploadInvoice(true);
            });
          }
        });
      }
    },
    doUploadInvoice (onlyGenerateInvoice) {
      getEffectiveByDeliveryOrderId(this.form.deliveryOrderId).then(res => {
        if (res) {
          this.$router.push({
            path: '/vehretail/orderManager/deliveryInvoice/edit',
            query: {
              id: res.id
            }
          });
        } else {
          uploadInvoice({
            deliveryOrderId: this.form.deliveryOrderId,
            retailOrderId: this.form.retailOrderId,
            onlyGenerateInvoice: onlyGenerateInvoice,
          }).then(res => {
            this.$message.success('上传发票成功');
            // 重新加载详情数据
            this.getDetail();
          });
        }
      });
    },
    // 收款撤回
    handlePaymentWithdraw () {
      cancelPayment({ deliveryOrderId: this.form.deliveryOrderId, retailOrderId: this.form.retailOrderId }).then(res => {
        this.$message.success('收款撤回成功');
        this.getDetail();
      }).catch(() => {});
    },
    // 交车撤回
    handleDeliveryWithdraw () {
      cancelDelivery({ deliveryOrderId: this.form.deliveryOrderId, retailOrderId: this.form.retailOrderId }).then(res => {
        this.$message.success('交车撤回成功');
        this.getDetail();
      }).catch(() => {});
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
        // 刷新表格数据
        this.$refs.paymentRecordTable?.refresh();
        this.getDetail();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    },
    // 判断收款记录是否可以删除：已预约状态且收款类型为门店优惠/贷款/尾款/贷款首付款/机动车发票其他费用
    canDeletePaymentRecord (row) {
      const deletableTypes = [0, 2, 4, 6, 7]; // 贷款, 尾款, 贷款首付款, 门店优惠, 机动车发票其他费用
      return deletableTypes.includes(row.payCategory);
    }
  }
};
</script>

<style lang="scss" scoped>
.m-delivery-order-edit {
}
</style>
