<template>
  <edit-page-layout ref="editLayout" :title="pannelTitle" showPaneFooter @save="handleSave" @cancel="handleCancel">
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
        :showEditBtn="form.permission.edit"
      >
        <template #status>
          {{ form.replenishApplyCode }}
          <span class="status primary">{{ form.auditStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button size="small" @click="handleSubmit" :disabled="!form.permission.submit">提交补货申请</el-button>
          <el-button size="small" @click="handleAuditValidForDealer()" :disabled="!form.permission.dealerAudit">门店审核</el-button>
          <el-button size="small" @click="handleAuditValidForFactory()" :disabled="!form.permission.factoryAudit">厂端审核</el-button>
          <el-button size="small" @click="handleUnused" :disabled="!form.permission.cancel">作废</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                  <el-input
                    placeholder="请输入整车补货单号"
                    v-model="form.replenishApplyCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入门店编码"
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
                    :options="orderCategoryOptions"
                    v-model="form.orderCategory"
                    placeholder="请选择订单分类"
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
                    placeholder="请选择批售方式"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="专项活动："
                  prop="prodScheduleActivityId"
                  v-show="form.orderCategory !== '2'"
                >
                  <fetch-select
                    :remote-method="prodScheduleActivitySearch"
                    :options="prodScheduleActivityOptions"
                    remote
                    reserve-keyword
                    labelKey="activityName"
                    valueKey="scheduleActivityId"
                    v-model="form.prodScheduleActivityId"
                    :params="form.prodScheduleActivityName"
                    placeholder="请选择专项活动"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item
                  label="申请类别："
                  prop="applyCategory"
                  v-show="form.orderCategory === '2'"
                >
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_replenish_apply_type"
                    v-model="form.applyCategory"
                    placeholder="请选择申请类别"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="门店仓库：" prop="dealerWarehouseName">
                  <el-input
                    placeholder="请输入门店仓库"
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
                    placeholder="请选择审核状态"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item
                  label="金融机构："
                  prop="financialOrganizationId"
                  :rules="form.settleFundType + '' === '2010' ? rules.financialOrganizationId: []"
                  v-show="form.settleFundType + '' === '2010'"
                >
                  <fetch-select
                    :remote-method="repairItemSearch"
                    remote
                    reserve-keyword
                    labelKey="name"
                    valueKey="id"
                    v-model="form.financialOrganizationId"
                    placeholder="请选择金融机构"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否赊销：" prop="isCreditSale">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.isCreditSale"
                    placeholder="请选择是否赊销"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundType">
                  <fetch-select
                    :options="settleFundTypeOptions"
                    enumCode="vw_fundtype"
                    v-model="form.settleFundType"
                    placeholder="请选择结算资金类型"
                    clearable
                    filterable
                    @change="handleChangeFundType"
                  />
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  <el-input
                    placeholder="请输入申请原因"
                    v-model="form.applyReason"
                    clearable
                    maxlength="150"
                  />
                </el-form-item>
                <el-form-item label="申请总数量：" prop="applyTotalQty">
                  <el-input
                    placeholder="请输入申请总数量"
                    v-model="form.applyTotalQty"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="仓库编码：" prop="dealerWarehouseCode">
                  <el-input
                    placeholder="请输入仓库编码"
                    v-model="form.dealerWarehouseCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="仓库地址：" prop="dealerWarehouseAddress">
                  <el-input
                    placeholder="请输入仓库地址"
                    v-model="form.dealerWarehouseAddress"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="审批时间：" prop="auditDateTime">
                  <el-date-picker
                    v-model="form.auditDateTime"
                    type="datetime"
                    placeholder="请选择审批时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="true"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                  {{ form.replenishApplyCode }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="订单分类：" prop="orderCategoryLabel">
                  {{ form.orderCategoryLabel }}
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerName">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="批售方式：" prop="wholesaleWayLabel">
                  {{ form.wholesaleWayLabel }}
                </el-form-item>
                <el-form-item label="专项活动：" prop="prodScheduleActivityName" v-show="form.orderCategory + '' !== '2'">
                  {{ form.prodScheduleActivityName }}
                </el-form-item>
                <el-form-item label="申请类别：" prop="applyCategoryLabel" v-show="form.orderCategory + '' === '2'">
                  {{ form.applyCategoryLabel }}
                </el-form-item>
                <el-form-item label="门店仓库：" prop="dealerWarehouseName">
                  {{ form.dealerWarehouseName }}
                </el-form-item>
                <el-form-item label="审核状态：" prop="auditStatusLabel">
                  {{ form.auditStatusLabel }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationName" v-show="form.settleFundType==2010">
                  {{ form.financialOrganizationName }}
                </el-form-item>
                <el-form-item label="是否赊销：" prop="isCreditSale">
                  {{ form.settleFundType === '1050' ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundTypeLabel">
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
                <el-form-item label="创建人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>整车门店补货明细</h2>
            </div>
            <div class="common-section-body">
              <el-button size="small" @click="handleAddRow" style="margin-bottom: 10px;" v-show = "(form.permission.edit && _id) || !_id">添加补货明细</el-button>
              <div class="common-section-table">
                <component-table
                  :tableData="form.details"
                  :columns="detailsColumns"
                  :show-delete="isEditing || !_id"
                  @delete-row="handleDeleteDetailRow"
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
                  :tableData="form.dealerFundAccounts"
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
        <add-commercial-vehicle ref="addCommercialVehicle" :orderCategory="form.orderCategory" />
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, dealerAuditValid, factoryAuditValid, dealerApproval, factoryApproval, unusedApply, replenishmentSubmit } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApply/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getDealerDetailByCode, getRigion, listOrgStoreInfo } from '@/api/common';
import { listIdNames as listFinancialOrganization } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import { getList as listWholesaleProdScheduleActivity } from '@/api/vehwholesale/basic/wholesaleProdScheduleActivityDetail/index';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ComponentTable from './ComponentTable.vue';
import AddCommercialVehicle from './AddCommercialVehicle.vue';
import auditDialog from '@/libs/components/auditDialog';
import moment from 'moment';

const defaultForm = {
  replenishApplyCode: '',
  saleDealerName: '',
  auditStatus: '1',
  regionName: '',
  wholesaleWay: '10',
  prodScheduleActivityId: '',
  prodScheduleActivityName: '',
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
  auditDateTime: '',
  orderCategoryLabel: '',
  wholesaleWayLabel: '',
  settleFundTypeLabel: '',
  financialOrganizationName: '',
  auditStatusLabel: ''
};

export default {
  name: 'dealerVehicleReplenishApplyEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    AddCommercialVehicle,
    ComponentTable,
    EditPageLayout,
    EditBaseContainer,
    FetchSelect,
    auditDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '整车补货单号：' + this.form.replenishApplyCode;
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
    'form.details': {
      handler (newVal) {
        this.updateApplyTotalQty();
      },
      deep: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    const routeOrderCategory = this.$route.query.orderCategory ? (this.$route.query.orderCategory) : '';
    form.orderCategory = routeOrderCategory;
    return {
      pageTitle: '整车门店补货申请',
      pageType: 'edit',
      pannelTitle: '',
      moduleKey: 'AISVW-dealerVehicleReplenishApply',
      orderCategoryOptions: [],
      settleFundTypeOptions: [],
      prodScheduleActivityOptions: [],
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      tableData: [],
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
        { field: 'wholesaleOrderCode', title: '批售订单号', width: '240' },
        { field: 'vin', title: '配车VIN码', width: '180' },
        { field: 'wholesalePrice', title: '批售价', width: '120' },
        { field: 'confirmTime', title: '确认时间', width: '180' },
        { field: 'noAutoConfirmReason', title: '未自动确认原因', width: '150' },
        { field: 'confirmRemark', title: '确认说明', width: '150' },
        { field: 'prodScheduleActivityName', title: '专项活动', width: '120' },
        { field: 'confirmStatusLabel', title: '确认状态', width: '120' },
        { field: 'statusLabel', title: '订单状态', width: '120' },
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
        { field: 'orderCategoryNameLabel', title: '订单分类', width: '120' },
        { field: 'wholesaleWayLabel', title: '批售方式', width: '120' },
        { field: 'settleFundTypeLabel', title: '结算资金类型', width: '150' },
        { field: 'financialOrganizationName', title: '金融机构', width: '150' },
        { field: 'createTime', title: '创建时间', width: '180' },
        { field: 'vehicleReturnFlagLabel', title: '退车标识', width: '120' }
      ],
      detailsColumns: [
        { field: 'replenishApplyDetailCode', title: '整车补货明细单号', width: '280' },
        { field: 'seriesName', title: '车系', width: '120' },
        { field: 'modelName', title: '车型', width: '200' },
        { field: 'materialsCode', title: '物料编码', width: '250' },
        { field: 'materialsDesc', title: '物料描述（L）', width: '350' },
        { field: 'applyQty', title: '申请数量', width: '120' },
        { field: 'invoiceDiscountTypeLabel', title: '开票类型', width: '120' },
        { field: 'invoiceCoefficient', title: '开票系数', width: '120' },
        { field: 'createTime', title: '创建时间', width: '180' }
      ],
      rules: {
        saleDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        orderCategory: [
          { required: true, message: '请选择订单分类', trigger: 'change' }
        ],
        wholesaleWay: [
          { required: true, message: '请选择批售方式', trigger: 'change' }
        ],
        prodScheduleActivityId: [
          { required: false, message: '请选择专项活动', trigger: 'change' }
        ],
        applyCategory: [
          { required: false, message: '请选择申请类别', trigger: 'change' }
        ],
        settleFundType: [
          { required: true, message: '请选择结算资金类型', trigger: 'change' }
        ],
        financialOrganizationId: [
          { required: true, message: '请选择金融机构', trigger: 'change' }
        ],
        applyReason: [
          { required: true, message: '请输入申请原因', trigger: 'change' },
          { max: 150, message: '最多输入150个字符', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    this.fetchOrderCategoryOptions();
    this.fetchsettleFundTypeOptions();
  },
  methods: {
    handleDeleteDetailRow (row, rowIndex) {
      this.$confirm(`确定要删除${row.replenishApplyDetailCode}表格数据吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.details.splice(rowIndex, 1);
        this.updateApplyTotalQty();
      }).catch(() => {
      });
    },
    handleSave () {
      const dataList = this.$refs.addCommercialVehicle.tableList;
      if (!dataList || dataList.length === 0) return;
      const processedDataList = dataList.map(item => {
        const { id, yearTypeId, yearTypeName, ...rest } = item;
        return {
          ...rest,
          vehicleYearTypeId: yearTypeId,
          vehicleYearType: yearTypeName
        };
      });
      if (!Array.isArray(this.form.details)) {
        this.form.details = [];
      }
      const existingDetailsMap = new Map();
      this.form.details.forEach(detail => {
        if (detail.materialsCode) {
          existingDetailsMap.set(detail.materialsCode, detail);
        }
      });
      const newDetails = [];
      const updatedDetails = [...this.form.details];
      processedDataList.forEach(dataItem => {
        const existingDetail = existingDetailsMap.get(dataItem.materialsCode);
        if (existingDetail) {
          existingDetail.applyQty = (Number(existingDetail.applyQty) || 0) + (Number(dataItem.applyQty) || 0);
        } else {
          newDetails.push(dataItem);
        }
      });
      this.form.details = [...updatedDetails, ...newDetails];
      this.updateApplyTotalQty();
      this.$refs.editLayout.closePane();
    },
    handleCancel () {
      this.$refs.editLayout.closePane();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          const data = res;
          if (data && data.orderCategory !== undefined && data.orderCategory !== null) {
            data.orderCategory = String(data.orderCategory);
          }
          if (data && data.dealerFundAccounts) {
            data.dealerFundAccounts = data.dealerFundAccounts.map(account => {
              if (account.creditSalesLimit) {
                return {
                  ...account,
                  availableCreditAmount: account.creditSalesLimit.availableCreditAmount,
                  downPaymentRatio: account.creditSalesLimit.downPaymentRatio,
                  creditAccountStatusLabel: account.creditSalesLimit.creditAccountStatusLabel,
                  effectiveTime: account.creditSalesLimit.effectiveTime,
                  expireTime: account.creditSalesLimit.expireTime,
                };
              }
              return account;
            });
          }
          this.updateApplyTotalQty();
          return data;
        }).catch(error => {
          this.$message.error('获取详情失败');
          throw error;
        });
      }
      return Promise.resolve(null);
    },
    submitRequest () {
      let params = {
        mainData: {
          ...this.form,
          auditDateTime: this.form.auditDateTime ? (this.form.auditDateTime.length === 16 ? this.form.auditDateTime + ':00' : this.form.auditDateTime) : null,
          auditTime: this.form.auditTime ? (this.form.auditTime.length === 16 ? this.form.auditTime + ':00' : this.form.auditTime) : null,
          applyTime: this.form.applyTime ? (this.form.applyTime.length === 16 ? this.form.applyTime + ':00' : this.form.applyTime) : null,
          reviewTime: this.form.reviewTime ? (this.form.reviewTime.length === 16 ? this.form.reviewTime + ':00' : this.form.reviewTime) : null,
        },
        detailList: this.form.details
      };

      // 移除只读字段
      const readOnlyFields = ['creatorName', 'createTime', 'modifierName', 'updateTime', 'auditStatusLabel',
        'orderCategoryLabel', 'wholesaleWayLabel', 'settleFundTypeLabel', 'financialOrganizationName'];
      readOnlyFields.forEach(field => {
        delete params.mainData[field];
      });

      if (!this.form.details || this.form.details.length <= 0) {
        this.$message.error('请至少添加一条补货明细');
        return Promise.reject(new Error('请至少添加一条补货明细'));
      }

      if ((this.form.orderCategory === '2' || this.form.orderCategory === 2) && this.form.applyTotalQty !== 1) {
        this.$message.error('试驾车订单申请不能大于1');
        return Promise.reject(new Error('试驾车订单申请不能大于1'));
      }

      return addOrUpdate(params);
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleAddRow () {
      if (!['0', '2', '20'].includes(this.form.orderCategory + '')) {
        return;
      }
      let categoryText = '';
      if (this.form.orderCategory + '' === '0') {
        categoryText = '商品车';
      } else if (this.form.orderCategory + '' === '2') {
        categoryText = '试驾车';
      } else if (this.form.orderCategory + '' === '20') {
        categoryText = '展车';
      }
      this.pannelTitle = `补货申请添加【${categoryText}】`;
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        creatorName: userInfo.userName,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async fetchOrderCategoryOptions () {
      const response = await getEnum('vw_order_category');
      this.orderCategoryOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['0', '2', '20'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    async fetchsettleFundTypeOptions () {
      const response = await getEnum('vw_fundtype');
      this.settleFundTypeOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['1010', '1050', '2010'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    async handleChangeDealer (val, record) {
      this.form.saleDealerName = record?.storeName || '';
      this.form.saleDealerCode = record?.storeCode || '';
      this.form.regionCode = record?.regionCode || '';
      this.form.regionName = record?.region || '';
      this.form.prodScheduleActivityId = '';
      this.form.prodScheduleActivityName = '';
      try {
        const result = await listWholesaleProdScheduleActivity({ status: 1, dealerCode: this.form.saleDealerCode });
        this.prodScheduleActivityOptions = result.records || [];
        const dealerResponse = await getDealerDetailByCode(this.form.saleDealerCode);
        this.form.deliveryDealerCode = dealerResponse?.exclusiveDeliveryStoreCode || '';
        this.form.deliveryDealerName = dealerResponse?.exclusiveDeliveryStoreName || '';
        if (this.form.deliveryDealerCode) {
          const deliveryDealerResponse = await getDealerDetailByCode(this.form.deliveryDealerCode);
          this.form.dealerWarehouseCode = deliveryDealerResponse?.storeWarehouseResp?.warehouseCode || '';
          this.form.dealerWarehouseAddress = deliveryDealerResponse?.storeWarehouseResp?.warehouseDetailAddress || '';
          this.form.dealerWarehouseName = deliveryDealerResponse?.storeWarehouseResp?.warehouseName || '';
        }
      } catch (error) {
        console.error('获取经销商信息失败:', error);
        this.$message.error('获取经销商信息失败，请重试');
      }
    },
    handleChangeOrderCategory (val) {
      if (val + '' === '2') {
        this.form.prodScheduleActivityId = '';
      } else if (val + '' === '0' || val + '' === '20') {
        this.form.applyCategory = '';
      }
    },
    handleChangeFundType (val) {
      if (val + '' !== '2010') {
        this.form.financialOrganizationId = '';
      }
      if (val + '' === '1050') {
        this.form.isCreditSale = 1;
      } else {
        this.form.isCreditSale = 0;
      }
      console.log('结算资金类型改变:', val);
    },
    async getDealerListByName (params) {
      return await listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    async getRegionList (params) {
      return await getRigion({ orgName: params });
    },
    async repairItemSearch (query) {
      return await listFinancialOrganization({ organizationNameLike: query, status: 1 });
    },
    async prodScheduleActivitySearch (query) {
      if (!this.form.saleDealerCode) {
        this.$message.warning('请先选择销售门店');
        return [];
      }
      const searchQuery = typeof query === 'string' ? query : '';
      const result = await listWholesaleProdScheduleActivity({ scheduleActivityIdLike: searchQuery, status: 1, dealerCode: this.form.saleDealerCode });
      this.prodScheduleActivityOptions = result.records || [];
      return result || [];
    },
    handleAuditValidForDealer () {
      dealerAuditValid([this._id]).then(() => {
        this.$refs.auditInputForDealer.show();
      }).catch(() => {});
    },
    handleAuditValidForFactory () {
      factoryAuditValid([this._id]).then(() => {
        this.$refs.auditInputForFactory.show();
      }).catch(() => {});
    },
    handelAuditForDealer (data) {
      dealerApproval({
        ids: [this._id],
        isAudit: data.result,
        auditOpinion: data.remark
      }).then(() => {
        this.$message.success('补货申请门店审核成功');
        this.getDetailData();
      });
    },
    handelAuditForFactory (data) {
      factoryApproval({
        ids: [this._id],
        isAudit: data.result,
        auditOpinion: data.remark
      }).then(() => {
        this.$message.success('补货申请厂端审核成功');
        this.getDetailData();
      });
    },
    updateApplyTotalQty () {
      if (!this.form.details || this.form.details.length === 0) {
        this.form.applyTotalQty = 0;
        return;
      }
      let total = 0;
      this.form.details.forEach(detail => {
        const qty = Number(detail.applyQty) || 0;
        total += qty;
      });
      this.form.applyTotalQty = total;
    },
    getDetailData () {
      const id = this._id;
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    handleUnused () {
      this.$confirm('是否执行作废操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unusedApply(this._id).then(() => {
          this.$message.success('补货申请已作废');
          this.getDetailData();
        }).catch(() => {
          this.$message.error('补货申请作废失败');
        });
      }).catch(() => {
      });
    },
    handleSubmit () {
      replenishmentSubmit({ id: this._id }).then(() => {
        this.$message.success('补货申请提交成功');
        this.getDetailData();
      });
    }
  }
};
</script>
