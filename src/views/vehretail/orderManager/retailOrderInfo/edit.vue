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
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small" type="primary" @click="handleEquityInquiry">权益查询</el-button> -->
          <el-button size="small" type="primary" @click="handlePrintContractTermination">打印合同解除协议</el-button>
          <el-button size="small" type="primary" @click="handleSetSpecialMark">设置特殊标识</el-button>
          <el-button size="small" type="primary" @click="handleModifyConfiguration">修改配置</el-button>
          <!-- <el-button size="small" type="primary" @click="handleManualVehicleAllocation">手工配车</el-button> -->
          <el-button size="small" type="primary" @click="handleAutoLockVehicle">自动锁车</el-button>
          <el-button size="small" type="primary" @click="handleViewPurchaseAgreement">查看购车协议</el-button>
          <el-button size="small" type="primary" @click="handleOrderUnsubscribe">订单退订</el-button>
          <el-button size="small" type="primary" @click="handleCarOwnerChangeApplication">购车人变更申请</el-button>
          <el-button size="small" type="primary" @click="handleQualityIssueUnbindApplication">质量问题解绑申请</el-button>
        </template>
        <!-- 固定悬浮导航栏 -->
        <div class="fixed-nav">
          <ul>
            <li v-for="(navItem, index) in navItems" :key="index">
              <a
                :href="navItem.href"
                :class="{ active: activeSection === navItem.id }"
                @click.prevent="scrollToSection(navItem.id)"
              >
                {{ navItem.title }}
              </a>
            </li>
          </ul>
        </div>

        <el-main>
          <section id="retail-order-status" class="common-section">
            <div class="common-section-header">
              <h2>销服订单状态</h2>
            </div>
            <div class="common-section-body">
              <NavTop :current="form.orderStatus" :navType="'order'" :retailOrderCode="form.retailOrderCode"/>
            </div>
          </section>
          <section id="app-order-status" class="common-section">
            <div class="common-section-header">
              <h2>APP订单状态</h2>
            </div>
            <div class="common-section-body">
              <NavTop :current="form.leapAppOrderStatus"/>
            </div>
          </section>
          <section id="basic-info" class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" label-width="180px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderCode"
                    clearable
                    :disabled="!canEditField('mallOrderCode')"
                  />
                </el-form-item>
                <el-form-item label="整车订单号：" prop="retailOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderCode"
                    clearable
                    :disabled="!canEditField('retailOrderCode')"
                  />
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="!canEditField('orderStatus')"
                  />
                </el-form-item>
                <el-form-item label="商城下单时间：" prop="orderTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.orderTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :disabled="!canEditField('orderTime')"
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
                    :disabled="!canEditField('createTime')"
                  />
                </el-form-item>
                <el-form-item label="综合订单编码：" prop="compositeOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.compositeOrderCode"
                    clearable
                    :disabled="!canEditField('compositeOrderCode')"
                  />
                </el-form-item>
                <el-form-item label="订单来源：" prop="orderSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderSource"
                    clearable
                    :disabled="!canEditField('orderSource')"
                  />
                </el-form-item>
                <el-form-item label="外部订单号：" prop="outTradeNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.outTradeNo"
                    clearable
                    :disabled="!canEditField('outTradeNo')"
                  />
                </el-form-item>
                <el-form-item label="销售模式：" prop="saleModeLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleModeLabel"
                    clearable
                    :disabled="!canEditField('saleModeLabel')"
                  />
                </el-form-item>
                <el-form-item label="订单销售门店：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                    :disabled="!canEditField('saleDealerName')"
                  />
                </el-form-item>
                <el-form-item label="订单销售顾问：" prop="saleUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单交付门店：" prop="deliveryDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDealerName"
                    clearable
                    :disabled="!canEditField('deliveryDealerName')"
                  />
                </el-form-item>
                <el-form-item label="订单交付顾问：" prop="deliveryUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否预售订单：" prop="preSaleOrderLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.preSaleOrderLabel"
                    clearable
                    :disabled="!canEditField('preSaleOrderLabel')"
                  />
                </el-form-item>
                <el-form-item label="是否盲订订单：" prop="blindOrderLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.blindOrderLabel"
                    clearable
                    :disabled="!canEditField('blindOrderLabel')"
                  />
                </el-form-item>
                <el-form-item label="订单备注：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    :max-length="100"
                  />
                </el-form-item>
                <el-form-item label="特殊备注：" prop="specialRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.specialRemark"
                    clearable
                    :disabled="!canEditField('specialRemark')"
                  />
                </el-form-item>
                <!-- <el-form-item label="合同解除协议文件地址：" prop="contractTerminationFileUrl">
                  <el-input
                    placeholder="请输入"
                    v-model="form.contractTerminationFileUrl"
                    clearable
                  />
                </el-form-item> -->
                <el-form-item label="交付周期上限(周)：" prop="deliveryCycleMaxWeek">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryCycleMaxWeek"
                    clearable
                    :disabled="!canEditField('deliveryCycleMaxWeek')"
                  />
                </el-form-item>
                <el-form-item label="动态交付周期说明：" prop="dynamicDeliveryCycleDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dynamicDeliveryCycleDesc"
                    clearable
                    :disabled="!canEditField('dynamicDeliveryCycleDesc')"
                  />
                </el-form-item>
                <el-form-item label="初始交付周期说明：" prop="initialDeliveryCycleDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.initialDeliveryCycleDesc"
                    clearable
                    :disabled="!canEditField('initialDeliveryCycleDesc')"
                  />
                </el-form-item>
                <el-form-item label="二网门店：" prop="secondNetStoreName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.secondNetStoreName"
                    clearable
                    :disabled="!canEditField('secondNetStoreName')"
                  />
                </el-form-item>
              </el-form>
              <generic-detail-display
                :formData="form"
                :fields="displayFields"
                v-show="!(isEditing || !_id)"
              />
            </div>
          </section>
          <section id="car-owner" class="common-section">
            <div class="common-section-header">
              <h2>购车人信息</h2>
            </div>
            <div class="common-section-body">
              <generic-detail-display
                :formData="form.carOwner || {}"
                :fields="carOwnerDisplayFields"
              />
            </div>
          </section>
          <section id="order-fund" class="common-section">
            <div class="common-section-header">
              <h2>资金信息</h2>
            </div>
            <div class="common-section-body">
              <generic-detail-display
                :formData="form.orderFund || {}"
                :fields="orderFundDisplayFields"
              />
            </div>
          </section>
          <section id="materials" class="common-section">
            <div class="common-section-header">
              <h2>订单物料信息</h2>
            </div>
            <div class="common-section-body">
              <generic-detail-display
                :formData="form.materials || {}"
                :fields="materialsDisplayFields"
              />
            </div>
          </section>
          <section id="lock-allocation" class="common-section">
            <div class="common-section-header">
              <h2>锁/配车信息</h2>
            </div>
            <div class="common-section-body">
              <generic-detail-display
                :formData="form"
                :fields="lockAllocationDisplayFields"
              />
            </div>
          </section>
          <section id="wholesale" class="common-section">
            <div class="common-section-header">
              <h2>批售信息</h2>
            </div>
            <div class="common-section-body">
              <generic-detail-display
                :formData="form.wholesaleOrderDetail || {}"
                :fields="wholesaleDisplayFields"
              />
            </div>
          </section>
          <section id="refund" class="common-section">
            <div class="common-section-header">
              <h2>订单取消信息</h2>
            </div>
            <div class="common-section-body">
              <generic-detail-display
                :formData="form.refundDetail || {}"
                :fields="refundDisplayFields"
              />
            </div>
          </section>
          <section id="finance" class="common-section">
            <div class="common-section-header">
              <h2>附属信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" ref="ruleForm2" label-width="180px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="金融方案：">
                  <fetch-select
                    v-model="form.finance.financialPlan"
                    placeholder="请选择"
                    clearable
                    :request="fetchOptions"
                    enumCode="xxx"
                    filterable
                  />
                </el-form-item>
                <el-form-item label="金融按揭进度：">
                  <fetch-select
                    v-model="form.finance.mortgageProgress"
                    placeholder="请选择"
                    clearable
                    :request="fetchOptions"
                    enumCode="xxx"
                    filterable
                  />
                </el-form-item>
                <el-form-item label="金融订单号：">
                  <el-input v-model="form.finance.mortgageProgressDesc" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="金融订单状态：">
                  <el-input v-model="form.finance.financialOrderStatusLabel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="保险办理进度：">
                  <fetch-select
                    v-model="form.finance.insuranceProgress"
                  />
                </el-form-item>
                <el-form-item label="保险方案：">
                  <fetch-select
                    v-model="form.finance.insurancePlan"
                  />
                </el-form-item>
              </el-form>
              <generic-detail-display
                v-show="!(isEditing || !_id)"
                :formData="form.finance || {}"
                :fields="financeDisplayFields"
              />
            </div>
          </section>
          <section id="term" class="common-section">
            <div class="common-section-header">
              <h2>期限信息</h2>
            </div>
            <div class="common-section-body">
              <generic-detail-display
                :formData="form"
                :fields="termDisplayFields"
              />
            </div>
          </section>
          <section v-for="(tableConfig, index) in tableConfigs" :key="index" class="common-section" :id="tableConfig.sectionId">
            <div class="common-section-header">
              <h2>{{ tableConfig.title }}</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <component-table
                  :tableDataExternal="form[tableConfig.field]"
                  :columns="tableConfig.columns"
                />
              </div>
            </div>
          </section>
          <!-- 组件位置不要放在右侧栏组件 -->
           <!-- 修改配置对话框 -->
          <materials-dialog ref="materialsDialog" :row="form" @confirm="getDetailData" />
          <!-- 购车协议对话框 -->
          <purchase-agreement-dialog
            ref="PurchaseAgreementDialog"
            :visible.sync="agreementDialogVisible"
            :content="agreementDialogContent"
            title="零跑汽车购车协议"
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
import { getDetail, addOrUpdate, autoLock, querySnapShot } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import {
  retailOrderDisplayFields,
  carOwnerDisplayFields,
  orderFundDisplayFields,
  materialsDisplayFields,
  lockAllocationDisplayFields,
  wholesaleDisplayFields,
  refundDisplayFields,
  financeDisplayFields,
  termDisplayFields,
  modificationRecordDisplayFields,
  orderChangeApplicationDisplayFields,
  unlockApplicationRecordDisplayFields,
  lockCarRecordDisplayFields,
  orderTransparencyTrackingDisplayFields,
  orderCancellationRecordDisplayFields,
  orderPaymentRecordDisplayFields
} from './components/fieldConfigs'; // 引入字段配置
import ComponentTable from './components/ComponentTable';
import GenericDetailDisplay from './components/GenericDetailDisplay';
import NavTop from './components/NavTop';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import MaterialsDialog from './components/MaterialsDialog';
import PurchaseAgreementDialog from './components/PurchaseAgreementDialog';

const defaultForm = {
  // 多选时字段有变化，自行修复
  mallOrderCode: '',
  retailOrderCode: '',
  orderStatus: '',
  orderTime: '',
  createTime: '',
  compositeOrderCode: '',
  orderSource: '',
  outTradeNo: '',
  saleModeLabel: '',
  saleDealerName: '',
  saleUserName: '',
  deliveryDealerName: '',
  deliveryUserName: '',
  preSaleOrderLabel: '',
  blindOrderLabel: '',
  remark: '',
  specialRemark: '',
  contractTerminationFileUrl: '',
  deliveryCycleMaxWeek: '',
  dynamicDeliveryCycleDesc: '',
  initialDeliveryCycleDesc: '',
  secondNetStoreName: '',
  carOwner: {},
  orderFund: {},
  materials: {},
  wholesaleOrderDetail: {},
  refundDetail: {},
  finance: {
    financialPlan: '',
    mortgageProgress: '',
    financialOrderCode: '',
    financialOrderStatus: '',
    financialOrderStatusLabel: '',
    insuranceProgress: '',
    insurancePlan: '',
  }
};

export default {
  name: 'retailOrderInfoEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    PurchaseAgreementDialog,
    MaterialsDialog,
    NavTop,
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
      return '商城订单编号：' + this.form.mallOrderCode;
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
      pageTitle: '整车零售订单管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-retailOrderInfo',
      agreementDialogContent: '',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        saleUserName: [
          { required: true, message: '请输入订单销售顾问', trigger: 'change' }
        ],
        deliveryUserName: [
          { required: true, message: '请输入订单交付顾问', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入订单备注', trigger: 'change' }
        ],
        contractTerminationFileUrl: [
          { required: true, message: '请输入合同解除协议文件地址', trigger: 'change' }
        ],
      },
      displayFields: retailOrderDisplayFields,
      carOwnerDisplayFields: carOwnerDisplayFields,
      orderFundDisplayFields: orderFundDisplayFields,
      materialsDisplayFields: materialsDisplayFields,
      lockAllocationDisplayFields: lockAllocationDisplayFields,
      wholesaleDisplayFields: wholesaleDisplayFields,
      refundDisplayFields: refundDisplayFields,
      financeDisplayFields: financeDisplayFields,
      termDisplayFields: termDisplayFields,
      tableConfigs: [
        {
          title: '整车订单改配信息',
          field: '整车订单改配信息',
          sectionId: 'modification-record',
          columns: this.convertToTableColumns(modificationRecordDisplayFields),
          apiMethod: null // 后续引入API方法
        },
        {
          title: '订单信息变更申请',
          field: 'changeApplyList',
          sectionId: 'order-change-application',
          columns: this.convertToTableColumns(orderChangeApplicationDisplayFields),
          apiMethod: null // 后续引入API方法
        },
        {
          title: '锁车解绑申请记录',
          field: 'unlockApplyList',
          sectionId: 'unlock-application-record',
          columns: this.convertToTableColumns(unlockApplicationRecordDisplayFields),
          apiMethod: null // 后续引入API方法
        },
        {
          title: '锁车记录',
          field: 'lockRecordList',
          sectionId: 'lock-car-record',
          columns: this.convertToTableColumns(lockCarRecordDisplayFields),
          apiMethod: null // 后续引入API方法
        },
        {
          title: '订单透明化状态跟踪',
          field: 'statusTrackList',
          sectionId: 'order-transparency-tracking',
          columns: this.convertToTableColumns(orderTransparencyTrackingDisplayFields),
          apiMethod: null // 后续引入API方法
        },
        {
          title: '订单退订记录',
          field: 'refundList',
          sectionId: 'order-cancellation-record',
          columns: this.convertToTableColumns(orderCancellationRecordDisplayFields),
          apiMethod: null // 后续引入API方法
        },
        {
          title: '订单收款记录',
          field: 'payRecordList',
          sectionId: 'order-pay-record',
          columns: this.convertToTableColumns(orderPaymentRecordDisplayFields),
          apiMethod: null // 后续引入API方法
        }
      ],
      navItems: [
        { id: 'retail-order-status', title: '销服订单状态', href: '#retail-order-status' },
        { id: 'app-order-status', title: 'APP订单状态', href: '#app-order-status' },
        { id: 'basic-info', title: '基础信息', href: '#basic-info' },
        { id: 'car-owner', title: '购车人信息', href: '#car-owner' },
        { id: 'order-fund', title: '资金信息', href: '#order-fund' },
        { id: 'materials', title: '订单物料', href: '#materials' },
        { id: 'lock-allocation', title: '锁/配车', href: '#lock-allocation' },
        { id: 'wholesale', title: '批售信息', href: '#wholesale' },
        { id: 'refund', title: '订单取消', href: '#refund' },
        { id: 'finance', title: '附属信息', href: '#finance' },
        { id: 'term', title: '期限信息', href: '#term' },
        { id: 'modification-record', title: '整车订单改配信息', href: '#modification-record' },
        { id: 'order-change-application', title: '订单信息变更申请', href: '#order-change-application' },
        { id: 'unlock-application-record', title: '锁车解绑申请记录', href: '#unlock-application-record' },
        { id: 'lock-car-record', title: '锁车记录', href: '#lock-car-record' },
        { id: 'order-transparency-tracking', title: '订单透明化状态跟踪', href: '#order-transparency-tracking' },
        { id: 'order-cancellation-record', title: '订单退订记录', href: '#order-cancellation-record' },
        { id: 'order-pay-record', title: '订单收款记录', href: '#order-pay-record' }
      ],
      activeSection: 'basic-info'
    };
  },
  mounted () {
    // 监听滚动事件，高亮当前所在区域
    this.$nextTick(() => {
      this.handleScroll();
      window.addEventListener('scroll', this.handleScroll);
    });
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    // 权益查询
    handleEquityInquiry () {
      console.log('执行权益查询');
    },
    // 打印合同解除协议
    handlePrintContractTermination () {
      // 实现打印合同解除协议逻辑
      console.log('打印合同解除协议');
    },
    // 设置特殊标识
    handleSetSpecialMark () {
      // 实现设置特殊标识逻辑
      console.log('设置特殊标识');
    },
    // 修改配置
    handleModifyConfiguration () {
      this.$refs.materialsDialog.show();
    },
    // 手工配车
    handleManualVehicleAllocation () {
      // 实现手工配车逻辑
      console.log('手工配车');
    },
    // 自动锁车
    handleAutoLockVehicle () {
      const param = {
        orderCode: this.form.mallOrderCode,
        productCode: this.form.materials.productCode,
        skuCode: this.form.materials.skuCode,
      };
      autoLock(param).then(response => {
        this.$message.success('锁车成功');
        this.getDetailData();
      }).catch(() => {});
    },
    // 查看购车协议
    handleViewPurchaseAgreement () {
      // 2362166807179599872
      // this.form.mallOrderCode
      querySnapShot(this.form.mallOrderCode).then(response => {
        console.log('response:', response);
        this.agreementDialogContent = response;
        this.$refs.PurchaseAgreementDialog.dialogVisible = true;
      }).catch(() => {
        this.$message.error('无购车权限');
      });
    },
    // 订单退订
    handleOrderUnsubscribe () {
      // 实现订单退订逻辑
      console.log('订单退订');
    },
    // 购车人变更申请
    handleCarOwnerChangeApplication () {
      // this.$router.push({
      //   path: '/vehwholesale/basic/wholesaleProdScheduleActivity'
      // });
    },
    // 质量问题解绑申请
    handleQualityIssueUnbindApplication () {
      // 实现质量问题解绑申请逻辑
      console.log('质量问题解绑申请');
    },
    // 将显示字段配置转换为表格列配置
    convertToTableColumns (displayFields) {
      return displayFields.map(field => ({
        field: field.key,
        title: field.label,
        width: field.label || 150 // 默认宽度，可根据需要调整
      }));
    },
    getDetailData () {
      if (this._id) {
        getDetail(this._id).then(response => {
          const processedData = response;
          processedData.finance = response.finance || { ...defaultForm.finance };
          // 辅助函数：为数组中的每个对象添加saleDealerName字段
          const addSaleDealerName = (array) => {
            if (array && Array.isArray(array) && response.saleDealerName) {
              return array.map(item => ({
                ...item,
                saleDealerName: response.saleDealerName,
                paymentTime: response.paymentTime,
              }));
            }
            return array || [];
          };
          processedData.statusTrackList = addSaleDealerName(response.statusTrackList);
          processedData.lockRecordList = addSaleDealerName(response.lockRecordList);
          Object.assign(this.form, processedData);
          Object.assign(this.originalForm, processedData);
        }).catch(() => {});
      }
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(response => {
          const processedData = response;
          processedData.finance = response.finance || { ...defaultForm.finance };
          // 辅助函数：为数组中的每个对象添加saleDealerName字段
          const addSaleDealerName = (array) => {
            if (array && Array.isArray(array) && response.saleDealerName) {
              return array.map(item => ({
                ...item,
                saleDealerName: response.saleDealerName,
                paymentTime: response.paymentTime,
              }));
            }
            return array || [];
          };
          processedData.statusTrackList = addSaleDealerName(response.statusTrackList);
          processedData.lockRecordList = addSaleDealerName(response.lockRecordList);
          return processedData;
        });
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
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
    // 判断字段是否可以编辑
    canEditField (field) {
      // 允许编辑的字段列表
      const editableFields = ['saleUserName', 'deliveryUserName', 'remark', 'contractTerminationFileUrl'];
      return editableFields.includes(field);
    },
    // 滚动到指定区域
    scrollToSection (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        // 使用更可靠的滚动方式
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        this.activeSection = sectionId;
      }
    },
    // 监听滚动事件，更新激活的导航项
    handleScroll () {
      const sections = this.navItems.map(item => item.id);
      let currentSection = 'basic-info';

      // 获取页面顶部偏移量（考虑固定导航栏的高度）
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          // 检查当前滚动位置是否在该区域内
          if (scrollTop >= offsetTop - 100 && scrollTop < offsetTop + height - 100) {
            currentSection = sections[i];
            break;
          }
        }
      }

      this.activeSection = currentSection;
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
    }
  }
};
</script>

<style scoped lang="scss">
.fixed-nav {
  position: fixed;
  top: 70%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 15px 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  backdrop-filter: blur(10px); /* 添加背景模糊效果 */
  max-height: 60vh; /* 设置最大高度为视口的60% */
  overflow-y: auto; /* 当内容超出时显示垂直滚动条 */
}
  /* 隐藏滚动条的样式 */
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

.fixed-nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: 40px; /* 确保即使没有内容也有一定高度 */
  max-height: 300px;
}

.fixed-nav li {
  margin: 5px 0;
}

.fixed-nav a {
  display: block;
  padding: 8px 12px;
  text-decoration: none;
  color: var(--leap-color-default-light-1);
  font-size: 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
  white-space: nowrap;
  cursor: pointer;
}

.fixed-nav a:hover {
  background-color: var(--leap-color-default-light-5);
  color: var(--leap-color-primary);
}

.fixed-nav a.active {
  background-color: var(--leap-color-primary-light-6);
  color: #fff;
}

.common-section {
  margin-bottom: 20px;
  scroll-margin-top: 80px; /* 为锚点跳转留出空间 */
  min-height: 100px;
}
</style>
