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
          <el-button size="small" @click="handleAppointmentDelivery">预约交车</el-button>
          <el-button size="small" @click="handleGenerateConfirmOrder">交车确认单生成</el-button>
          <el-button size="small" @click="handleChangeAppointmentTime">更改预约时间</el-button>
          <el-button size="small" @click="handleVerifyOrderRights">核销订单权益</el-button>
          <el-button size="small" @click="handleVerifyWithdraw">核销撤回</el-button>
          <el-button size="small" @click="handleAddPaymentRecord">添加收款记录</el-button>
          <el-button size="small" @click="handleConfirmPayment">确认收款</el-button>
          <el-button size="small" @click="handleRepushConfirmOrder">交车确认单补推</el-button>
          <el-button size="small" @click="handleReSignConfirmOrder">交车确认单重签</el-button>
          <el-button size="small" @click="handleViewConfirmOrder">查看交车确认单</el-button>
          <el-button size="small" @click="handleUploadInvoice">上传发票</el-button>
          <el-button size="small" @click="handlePaymentWithdraw">收款撤回</el-button>
          <el-button size="small" @click="handleDeliveryWithdraw">交车撤回</el-button>
        </template>
        <el-main>
          <!-- 订单归属 -->
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header" data-section="orderBelonging">
              <h2>订单归属</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" :label-width="labelWidth" class="form-edit">
                <el-form-item label="订单销售门店：" prop="salesStoreId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="store_enum"
                    v-model="form.salesStoreId"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="订单销售顾问：" prop="salesAdvisorId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="sales_advisor_enum"
                    v-model="form.salesAdvisorId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="订单交付门店：" prop="deliveryStoreId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="store_enum"
                    v-model="form.deliveryStoreId"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="订单交付顾问：" prop="deliveryAdvisorId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_order_lock_type"
                    v-model="form.deliveryAdvisorId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="交付衍生工程师：" prop="deliveryDerivativeUserId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="delivery_engineer_enum"
                    v-model="form.deliveryDerivativeUserId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="现场交付工程师：" prop="onSiteDeliveryUserId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="onsite_engineer_enum"
                    v-model="form.onSiteDeliveryUserId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="专属服务门店：" prop="exclusiveServiceStoreId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="service_store_enum"
                    v-model="form.exclusiveServiceStoreId"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="true"
                  />
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
            :table-config="{ title: '收款记录&权益项抵扣记录' }"
            :columns="paymentRecordColumns" section-key="paymentRecords"
            :tableDataExternal="form.paymentRecords"
            :showPagination="false"
          />
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
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，预留 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/deliveryOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import GenericDetailDisplay from '@/views/vehretail/orderManager/retailOrderInfo/components/GenericDetailDisplay';
import ComponentTable from '@/views/vehretail/orderManager/retailOrderInfo/components/ComponentTable';

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
    ComponentTable,
    GenericDetailDisplay,
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
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
      pageTitle: '交车单管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name 为小写驼峰格式
      moduleKey: 'AISVR-deliveryOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      cityDeliveryOrderMin: 0,
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
        { field: 'createTime', title: '创建时间', width: 180 }
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
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
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
    handleAppointmentDelivery () {},
    // 交车确认单生成
    handleGenerateConfirmOrder () {},
    // 更改预约时间
    handleChangeAppointmentTime () {},
    // 核销订单权益
    handleVerifyOrderRights () {},
    // 核销撤回
    handleVerifyWithdraw () {},
    // 添加收款记录
    handleAddPaymentRecord () {},
    // 确认收款
    handleConfirmPayment () {},
    // 交车确认单补推
    handleRepushConfirmOrder () {},
    // 交车确认单重签
    handleReSignConfirmOrder () {},
    // 查看交车确认单
    handleViewConfirmOrder () {},
    // 上传发票
    handleUploadInvoice () {},
    // 收款撤回
    handlePaymentWithdraw () {},
    // 交车撤回
    handleDeliveryWithdraw () {}
  }
};
</script>

<style lang="scss" scoped>
.m-delivery-order-edit {
}
</style>
