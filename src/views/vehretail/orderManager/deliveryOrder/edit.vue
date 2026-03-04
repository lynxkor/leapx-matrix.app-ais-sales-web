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
          <!-- <el-button size="small">按钮 1</el-button>
          <el-button size="small">按钮 2</el-button> -->
        </template>
        <el-main>
          <!-- 订单归属 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>订单归属</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
                    enumCode="delivery_advisor_enum"
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="订单销售门店：">
                  {{ form.salesStoreName }}
                </el-form-item>
                <el-form-item label="订单销售顾问：">
                  {{ form.salesAdvisorName }}
                </el-form-item>
                <el-form-item label="订单交付门店：">
                  {{ form.deliveryStoreName }}
                </el-form-item>
                <el-form-item label="订单交付顾问：">
                  {{ form.deliveryAdvisorName }}
                </el-form-item>
                <el-form-item label="交付衍生工程师：">
                  {{ form.deliveryDerivativeUserName }}
                </el-form-item>
                <el-form-item label="现场交付工程师：">
                  {{ form.onSiteDeliveryUserName }}
                </el-form-item>
                <el-form-item label="专属服务门店：">
                  {{ form.exclusiveServiceStoreName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 交付信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>交付信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
                    :request="fetchOptions"
                    enumCode="insurance_plan_enum"
                    v-model="form.insurancePlan"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="保险办理进度：" prop="insuranceProgress">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="insurance_progress_enum"
                    v-model="form.insuranceProgress"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="金融方案：" prop="financePlan">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="finance_plan_enum"
                    v-model="form.financePlan"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="金融按揭进度：" prop="financeProgress">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="finance_progress_enum"
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="门店应收金额：">
                  {{ form.receivableAmount }}
                </el-form-item>
                <el-form-item label="门店优惠金额：">
                  {{ form.discountAmount }}
                </el-form-item>
                <el-form-item label="机动车发票其他费用：">
                  {{ form.otherAmount }}
                </el-form-item>
                <el-form-item label="权益抵扣总额：">
                  {{ form.equityDeductionTotalAmount }}
                </el-form-item>
                <el-form-item label="开票金额：">
                  {{ form.invoiceAmount }}
                </el-form-item>
                <el-form-item label="剩余应收款：">
                  {{ form.remainingReceivableAmount }}
                </el-form-item>
                <el-form-item label="保险方案：">
                  {{ form.insurancePlan }}
                </el-form-item>
                <el-form-item label="保险办理进度：">
                  {{ form.insuranceProgress }}
                </el-form-item>
                <el-form-item label="金融方案：">
                  {{ form.financePlan }}
                </el-form-item>
                <el-form-item label="金融按揭进度：">
                  {{ form.financeProgress }}
                </el-form-item>
                <el-form-item label="交车时里程：">
                  {{ form.deliveryMileage }}
                </el-form-item>
                <el-form-item label="交车时电量：">
                  {{ form.deliveryBatteryPower }}
                </el-form-item>
                <el-form-item label="交车车机版本号：">
                  {{ form.deliveryMachineVersion }}
                </el-form-item>
                <el-form-item label="交车版本升级时间：">
                  {{ form.deliveryVersionUpgradeTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="交车单编号：" prop="deliveryOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryOrderCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="VIN 码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="整车物料：" prop="vehicleMaterial">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleMaterial"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="整车订单：" prop="retailOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="交车时间：" prop="deliveryTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.deliveryTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="交车状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="delivery_order_status_enum"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="true"
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
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="交车单编号：">
                  {{ form.deliveryOrderCode }}
                </el-form-item>
                <el-form-item label="VIN 码：">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="整车物料：">
                  {{ form.vehicleMaterial }}
                </el-form-item>
                <el-form-item label="整车订单：">
                  {{ form.retailOrderCode }}
                </el-form-item>
                <el-form-item label="交车时间：">
                  {{ form.deliveryTime }}
                </el-form-item>
                <el-form-item label="交车状态：">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 预约信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>预约信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="预约提车时间：" prop="appointmentTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.appointmentTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="是否延期预约：" prop="appointmentDelayStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="yes_no_enum"
                    v-model="form.appointmentDelayStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="预约变更次数：" prop="appointmentChangeCount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.appointmentChangeCount"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="预约操作时间：" prop="appointmentOperationTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.appointmentOperationTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="预约备注：" prop="appointmentRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.appointmentRemark"
                    clearable
                    :disabled="true"
                    type="textarea"
                    :rows="3"
                  />
                </el-form-item>
                <el-form-item label="预约超时原因：" prop="appointmentTimeoutReason">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="timeout_reason_enum"
                    v-model="form.appointmentTimeoutReason"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="预约提车时间：">
                  {{ form.appointmentTime }}
                </el-form-item>
                <el-form-item label="是否延期预约：">
                  {{ form.appointmentDelayStatus === 1 ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="预约变更次数：">
                  {{ form.appointmentChangeCount }}
                </el-form-item>
                <el-form-item label="预约操作时间：">
                  {{ form.appointmentOperationTime }}
                </el-form-item>
                <el-form-item label="预约备注：">
                  {{ form.appointmentRemark }}
                </el-form-item>
                <el-form-item label="预约超时原因：">
                  {{ form.appointmentTimeoutReason }}
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
              <el-form :inline="true" class="form-detail">
                <el-form-item label="整车订单状态：">
                  {{ form.retailOrderStatus }}
                </el-form-item>
                <el-form-item label="商城下单时间：">
                  {{ form.orderCreateTime }}
                </el-form-item>
                <el-form-item label="商城订单编号：">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="订单来源：">
                  {{ form.orderSource }}
                </el-form-item>
                <el-form-item label="用户 ID：">
                  {{ form.userId }}
                </el-form-item>
                <el-form-item label="购车人姓名：">
                  {{ form.buyerName }}
                </el-form-item>
                <el-form-item label="购车人手机：">
                  {{ form.buyerMobile }}
                </el-form-item>
                <el-form-item label="证件类型：">
                  {{ form.idType }}
                </el-form-item>
                <el-form-item label="证件号码：">
                  {{ form.idNumber }}
                </el-form-item>
                <el-form-item label="代办联系人：">
                  {{ form.agentContact }}
                </el-form-item>
                <el-form-item label="整车指导价：">
                  {{ form.vehicleGuidePrice }}
                </el-form-item>
                <el-form-item label="定金金额：">
                  {{ form.depositAmount }}
                </el-form-item>
                <el-form-item label="订单物料码：">
                  {{ form.orderMaterialCode }}
                </el-form-item>
                <el-form-item label="配车物料码：">
                  {{ form.vehicleMaterialCode }}
                </el-form-item>
                <el-form-item label="销售门店：">
                  {{ form.salesStoreName }}
                </el-form-item>
                <el-form-item label="交付门店：">
                  {{ form.deliveryStoreName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 实名认证信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>实名认证信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="实名认证来源：">
                  {{ form.realNameAuthSource === 1 ? '零小跑实名' : '零跑 APP 实名' }}
                </el-form-item>
                <el-form-item label="实名认证时间：">
                  {{ form.realNameAuthTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 交车确认单 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>交车确认单</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="签署数据来源：">
                  {{ form.signatureDataSourceDesc }}
                </el-form-item>
                <el-form-item label="签署时间：">
                  {{ form.signatureTime }}
                </el-form-item>
                <el-form-item label="购车人手机是否注册：">
                  {{ form.buyerMobileRegistered === 1 ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="交车确认单状态：">
                  {{ form.deliveryConfirmStatusDesc }}
                </el-form-item>
                <el-form-item label="城市交付顺序：">
                  {{ form.cityDeliveryOrder }}
                </el-form-item>
              </el-form>
            </div>
          </section>
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
      rules: {
        deliveryAdvisorId: [
          { required: true, message: '请选择订单交付顾问', trigger: 'change' }
        ],
        financePlan: [
          { required: true, message: '请选择金融方案', trigger: 'change' }
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-delivery-order-edit {
}
</style>
