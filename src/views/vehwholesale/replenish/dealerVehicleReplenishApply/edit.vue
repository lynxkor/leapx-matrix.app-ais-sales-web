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
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <span class="status primary">状态</span>
        </template>
        <template #extraButtons>
          <el-button size="small">提交补货申请</el-button>
          <el-button size="small" @click="handleAuditValid('dealer')">门店审核</el-button>
          <el-button size="small" @click="handleAuditValid('factory')">厂端审核</el-button>
          <el-button size="small">作废</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.replenishApplyCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="门店编码" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.saleDealerName"
                    :remote-method="getDealerListByName"
                    value-key="storeCode"
                    label-key="storeName"
                    @change="handleChangeDealer"
                  />
                </el-form-item>
                <el-form-item label="订单分类：" prop="orderCategory">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="ws_order_category"
                    v-model="form.orderCategory"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="handleChangeOrderCategory"
                  />
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.deliveryDealerCode"
                    :remote-method="getDealerListByName"
                    value-key="storeCode"
                    label-key="storeName"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="批售方式：" prop="wholesaleWay">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_wholesale_way"
                    v-model="form.wholesaleWay"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item
                  label="专项活动："
                  prop="prodScheduleActivityId"
                  v-show="isShowActivity"
                >
                  <fetch-select
                    :remote-method="prodScheduleActivitySearch"
                    remote
                    reserve-keyword
                    labelKey="name"
                    valueKey="id"
                    v-model="form.prodScheduleActivityId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item
                  label="申请类别："
                  prop="applyCategory"
                  v-show="isShowApplyCategory"
                  :rules="form.orderCategory === '2' ? rules.applyCategory: []"
                >
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_replenish_apply_type"
                    v-model="form.applyCategory"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="门店仓库：" prop="dealerWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerWarehouseName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="审核状态：" prop="auditStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_replenish_audit_status"
                    v-model="form.auditStatus"
                    placeholder="请选择"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item
                  label="金融机构："
                  prop="financialOrganizationId"
                  :rules="form.settleFundType==='2010' ? rules.financialOrganizationId: []"
                  v-show="isShowFinancialOrganization"
                >
                  <fetch-select
                    :remote-method="repairItemSearch"
                    remote
                    reserve-keyword
                    labelKey="name"
                    valueKey="id"
                    v-model="form.financialOrganizationId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否赊销：" prop="isCreditSale">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.isCreditSale"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_fundtype"
                    v-model="form.settleFundType"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="handleChangeFundType"
                  />
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyReason"
                    clearable
                    maxlength="150"
                  />
                </el-form-item>
                <el-form-item label="申请总数量：" prop="applyTotalQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyTotalQty"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="仓库编码：" prop="dealerWarehouseCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerWarehouseCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="仓库地址：" prop="dealerWarehouseAddress">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerWarehouseAddress"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="审批时间：" prop="auditDateTime">
                  <el-date-picker
                    v-model="form.auditDateTime"
                    type="datetime"
                    placeholder="请选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                  {{ form.replenishApplyCode }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="订单分类：" prop="orderCategory">
                  {{ form.orderCategoryLabel }}
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerCode">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="批售方式：" prop="wholesaleWay">
                  {{ form.wholesaleWayLabel }}
                </el-form-item>
                <el-form-item label="专项活动：" prop="prodScheduleActivityId">
                  {{ form.prodScheduleActivity }}
                </el-form-item>
                <el-form-item label="申请类别：" prop="applyCategory">
                  {{ form.applyCategoryLabel }}
                </el-form-item>
                <el-form-item label="门店仓库：" prop="dealerWarehouseName">
                  {{ form.dealerWarehouseName }}
                </el-form-item>
                <el-form-item label="审核状态：" prop="auditStatus">
                  {{ form.auditStatusLabel }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationId">
                  {{ form.financialOrganization }}
                </el-form-item>
                <el-form-item label="是否赊销：" prop="isCreditSale">
                  {{ form.settleFundType === '1050' ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundType">
                  {{ form.settleFundTypeLabel }}
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  {{ form.applyReason }}
                </el-form-item>
                <el-form-item label="申请总数量：" prop="applyTotalQty">
                  {{ form.applyTotalQty }}
                </el-form-item>
                <el-form-item label="仓库编码：" prop="dealerWarehouseCode">
                  {{ form.dealerWarehouseCode }}
                </el-form-item>
                <el-form-item label="仓库地址：" prop="dealerWarehouseAddress">
                  {{ form.dealerWarehouseAddress }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="auditDateTime">
                  {{ form.auditDateTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>整车门店补货明细</h2>
              <el-button size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <component-table
                  :tableData="form.details"
                  :columns="detailsColumns"
                />
              </div>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>整车资金账户</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <component-table
                  :tableData="form.wholesaleOrders"
                  :columns="columns"
                />
              </div>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>批售订单信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <component-table
                  :tableData="form.wholesaleOrders"
                  :columns="wholesaleOrdersColumns"
                />
              </div>
            </div>
          </section>
          <auditDialog ref="auditInputForDealer" @audit="handelAuditForDealer"/>
          <auditDialog ref="auditInputForFactory" @audit="handelAuditForFactory"/>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
        <add-commercial-vehicle-dialog ref="addCommercialVehicleDialog" />
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, dealerAuditValid, factoryAuditValid, dealerApproval, factoryApproval } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApply/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getDealerDetailByCode, getRigion, listOrgStoreInfo } from '@/api/common';
import { listIdNames as listFinancialOrganization } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import { listIdNames as listWholesaleProdScheduleActivity } from '@/api/vehwholesale/basic/wholesaleProdScheduleActivity/index';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ComponentTable from './ComponentTable.vue';
import AddCommercialVehicleDialog from './AddCommercialVehicleDialog.vue';
import auditDialog from '@/libs/components/auditDialog';

const defaultForm = {
  // 多选时字段有变化，自行修复
  replenishApplyCode: '',
  saleDealerName: '',
  auditStatus: '1',
  regionName: '',
  wholesaleWay: '10',
  prodScheduleActivityId: '',
  serials: '',
  orderCategory: '',
  applyTotalQty: '',
  applyTime: '',
  applyReason: '',
  auditTime: '',
  settleFundType: '',
  financialOrganizationId: '',
  dealerWarehouseName: '',
  deliveryDealerName: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  saleDealerCode: '',
  deliveryDealerCode: '',
  dealerWarehouseCode: '',
  regionCode: '',
  applyCategory: '',
  auditorName: '',
  auditorUserId: '',
  auditOpinion: '',
  reviewName: '',
  reviewUserId: '',
  reviewTime: '',
  reviewOpinion: '',
  permission: '',
  isCreditSale: 0,
  dealerWarehouseAddress: '',
  auditDateTime: ''
};

export default {
  name: 'dealerVehicleReplenishApplyEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    AddCommercialVehicleDialog,
    ComponentTable,
    EditPageLayout,
    EditBaseContainer,
    FetchSelect,
    auditDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
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
      pageTitle: '整车批售-批售主数据-整车门店补货申请管理',
      pageType: 'edit',
      title: '整车补货单号：' + form.replenishApplyCode,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-dealerVehicleReplenishApply',
      isShowActivity: false,
      isShowApplyCategory: false,
      isShowFinancialOrganization: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      tableData: [
      ],
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        { field: 'fundTypeLabel', title: '资金类型', width: '12%' },
        { field: 'availableBalance', title: '可用余额', width: '12%' },
        { field: 'frozenBalance', title: '冻结资金', width: '12%' },
        { field: 'availableCreditAmount', title: '剩余可用额度', width: '12%' },
        { field: 'downPaymentRatio', title: '首付款比例（%）', width: '12%' },
        { field: 'creditAccountStatusLabel', title: '赊销账户状态', width: '12%' },
        { field: 'effectiveTime', title: '额度生效日期', width: '14%' },
        { field: 'expireTime', title: '额度失效日期', width: '14%' },
      ],
      wholesaleOrdersColumns: [
        { field: 'wholesaleOrderCode', title: '批售订单号', width: '150' },
        { field: 'vin', title: '配车VIN码', width: '180' },
        { field: 'wholesalePrice', title: '批售价', width: '120' },
        { field: 'confirmTime', title: '确认时间', width: '180' },
        { field: 'noAutoConfirmReason', title: '未自动确认原因', width: '150' },
        { field: 'confirmRemark', title: '确认说明', width: '150' },
        { field: 'prodScheduleActivityId', title: '专项活动', width: '120' },
        { field: 'confirmStatus', title: '确认状态', width: '120' },
        { field: 'statusDesc', title: '订单状态', width: '120' },
        { field: 'orderTime', title: '订单时间', width: '180' },
        { field: 'allocateTime', title: '配车时间', width: '180' },
        { field: 'settleTime', title: '结算时间', width: '180' },
        { field: 'saleDealerName', title: '销售门店', width: '150' },
        { field: 'deliveryDealerName', title: '交付门店', width: '150' },
        { field: 'applyReason', title: '申请原因', width: '150' },
        { field: 'modelName', title: '车型', width: '120' },
        { field: 'yearTypeName', title: '年款', width: '100' },
        { field: 'materialsDesc', title: '物料描述（L）', width: '350' },
        { field: '', title: '选配续航（L）', width: '150' },
        { field: 'exteriorName', title: '外饰风格（L)', width: '120' },
        { field: 'wheelHubName', title: '选配轮毂（L）', width: '120' },
        { field: '', title: '选配动力（L）', width: '120' },
        { field: 'remark', title: '描述', width: '150' },
        { field: 'orderCategoryName', title: '订单分类', width: '120' },
        { field: 'wholesaleWay', title: '批售方式', width: '120' },
        { field: 'settleFundType', title: '结算资金类型', width: '150' },
        { field: 'financialOrganizationName', title: '金融机构', width: '150' },
        { field: 'createTime', title: '创建时间', width: '180' },
        { field: 'vehicleReturnFlag', title: '退车标识', width: '120' }
      ],
      detailsColumns: [
        { field: 'replenishApplyDetailCode', title: '整车补货明细单号', width: '280' },
        { field: 'seriesName', title: '车系', width: '120' },
        { field: 'modelName', title: '车型', width: '200' },
        { field: 'materialsCode', title: '物料编码', width: '250' },
        { field: 'materialsDesc', title: '物料描述（L）', width: '350' },
        { field: 'applyQty', title: '申请数量', width: '120' },
        { field: 'invoiceDiscountType', title: '开票类型', width: '120' },
        { field: 'invoiceCoefficient', title: '开票系数', width: '120' },
        { field: '', title: '申请时间', width: '180' },
        { field: 'updateTime', title: '审批时间', width: '180' },
        // { field: 'orderCategoryName', title: '订单分类', width: '180' },
        // { field: '', title: '结算资金类型', width: '180' },
        // { field: '', title: '融资机构', width: '180' },
        { field: 'remark', title: '申请原因', width: '150' },
        { field: 'creatorName', title: '创建人', width: '120' },
        { field: 'createTime', title: '创建时间', width: '180' }
      ],
      rules: {
        replenishApplyCode: [
          { required: true, message: '请输入整车补货单号', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        auditStatus: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        regionName: [
          { required: true, message: '请输入所属大区', trigger: 'change' }
        ],
        wholesaleWay: [
          { required: true, message: '请输入批售方式', trigger: 'change' }
        ],
        prodScheduleActivityId: [
          { required: false, message: '请输入专项活动', trigger: 'change' }
        ],
        serials: [
          { required: true, message: '请输入车系组合', trigger: 'change' }
        ],
        orderCategory: [
          { required: true, message: '请输入订单分类', trigger: 'change' }
        ],
        applyTotalQty: [
          { required: true, message: '请输入申请总数量', trigger: 'change' }
        ],
        applyTime: [
          { required: true, message: '请选择申请时间', trigger: 'change' }
        ],
        applyReason: [
          { required: true, message: '请输入申请原因', trigger: 'change' }
        ],
        auditTime: [
          { required: false, message: '请选择审核时间', trigger: 'change' }
        ],
        settleFundType: [
          { required: true, message: '请选择结算资金类型', trigger: 'change' }
        ],
        financialOrganizationId: [
          { required: true, message: '请输入金融机构ID', trigger: 'change' }
        ],
        dealerWarehouseName: [
          { required: true, message: '请输入门店仓库名称', trigger: 'change' }
        ],
        deliveryDealerName: [
          { required: true, message: '请输入交付门店名称', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注（说明）', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        deliveryDealerCode: [
          { required: true, message: '请输入交付门店编码', trigger: 'change' }
        ],
        dealerWarehouseCode: [
          { required: true, message: '请输入门店仓库编码', trigger: 'change' }
        ],
        regionCode: [
          { required: true, message: '请输入大区ID', trigger: 'change' }
        ],
        applyCategory: [
          { required: false, message: '请输入申请类别', trigger: 'change' }
        ],
        auditorName: [
          { required: true, message: '请输入门店审核人', trigger: 'change' }
        ],
        auditorUserId: [
          { required: true, message: '请输入门店审核人', trigger: 'change' }
        ],
        auditOpinion: [
          { required: true, message: '请输入审核意见', trigger: 'change' }
        ],
        reviewName: [
          { required: true, message: '请输入厂端审核人', trigger: 'change' }
        ],
        reviewUserId: [
          { required: true, message: '请输入厂端审核人', trigger: 'change' }
        ],
        reviewTime: [
          { required: true, message: '请选择厂端审核时间', trigger: 'change' }
        ],
        reviewOpinion: [
          { required: true, message: '请输入厂端审核意见', trigger: 'change' }
        ],
        permission: [
          { required: true, message: '请输入权限', trigger: 'change' }
        ],
        isCreditSale: [
          { required: false, message: '请选择是否赊销', trigger: 'change' }
        ],
        dealerWarehouseAddress: [
          { required: true, message: '请输入仓库地址', trigger: 'change' }
        ],
        auditDateTime: [
          { required: true, message: '请选择审批时间', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        const res = getDetail(id);
        return res;
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
      this.$refs.editLayout.openPane();
      // this.$refs.addCommercialVehicleDialog.dialogshow();
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
    handleChangeDealer (val, record) {
      this.form.saleDealerCode = record?.storeCode || '';
      this.form.regionCode = record?.regionCode || '';
      this.form.regionName = record?.region || '';
      getDealerDetailByCode(this.form.saleDealerCode).then(response => {
        this.form.deliveryDealerCode = response?.exclusiveDeliveryStoreCode || '';
        this.form.deliveryDealerName = response?.exclusiveDeliveryStoreName || '';
      }).catch(error => {
        // 错误处理逻辑
        console.error('请求失败:', error);
      });
      if (this.form.deliveryDealerCode) {
        getDealerDetailByCode(this.form.deliveryDealerCode).then(response => {
          this.form.dealerWarehouseCode = response?.storeWarehouseResp?.warehouseCode || '';
          this.form.dealerWarehouseAddress = response?.storeWarehouseResp?.warehouseDetailAddress || '';
          this.form.dealerWarehouseName = response?.storeWarehouseResp?.warehouseName || '';
        }).catch(error => {
          // 错误处理逻辑
          console.error('请求失败:', error);
        });
      }
    },
    handleChangeOrderCategory (val) {
      if (val === '2') {
        this.isShowApplyCategory = true;
        this.isShowActivity = false;
        this.form.prodScheduleActivityId = '';
      } else if (val === '1' || val === '3') {
        this.isShowApplyCategory = false;
        this.isShowActivity = true;
        this.form.applyCategory = '';
      } else {
        this.isShowApplyCategory = false;
        this.isShowActivity = false;
        this.form.applyCategory = '';
        this.form.prodScheduleActivityId = '';
      }
    },
    handleChangeFundType (val) {
      if (val === '2010') {
        this.isShowFinancialOrganization = true;
      } else {
        this.isShowFinancialOrganization = false;
        this.form.financialOrganizationId = '';
      }
      if (val === '1050') {
        this.form.isCreditSale = 1;
      }
    },
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    async getRegionList (params) {
      return getRigion({ orgName: params });
    },
    async repairItemSearch (query) {
      return listFinancialOrganization({ organizationNameLike: query, status: 1 });
    },
    async prodScheduleActivitySearch (query) {
      return listWholesaleProdScheduleActivity({ activityNameLike: query, status: 1, valid: true });
    },
    handleAuditValidForDealer (type) {
      return dealerAuditValid([this._id]).then(() => {
        this.$refs.auditInputForDealer.show();
      });
    },
    handleAuditValidForFactory (type) {
      return factoryAuditValid([this._id]).then(() => {
        this.$refs.auditInputForFactory.show();
      });
    },
    handelAuditForDealer (data) {
      dealerApproval({
        ids: [this._id],
        isAudit: data.result,
        auditOpinion: data.remark
      });
    },
    handelAuditForFactory (data) {
      factoryApproval({
        ids: [this._id],
        isAudit: data.result,
        auditOpinion: data.remark
      });
    }
  }
};
</script>
