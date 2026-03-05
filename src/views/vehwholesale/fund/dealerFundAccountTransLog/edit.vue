<template>
  <edit-page-layout ref="editLayout" title="整车资金账户交易流水" showPaneFooter>
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
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2 v-show="_id">余额信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="流水编号：" prop="transLogCode">
                  <el-input
                    placeholder="请输入流水编号"
                    v-model="form.transLogCode"
                    clearable
                    :disabled="!!_id"
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="资金类型：" prop="fundType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_fundtype"
                    v-model="form.fundType"
                    placeholder="请选择资金类型"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationId">
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
                <el-form-item label="交易类型：" prop="transactionType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_transaction_type"
                    v-model="form.transactionType"
                    placeholder="请选择交易类型"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="交易金额：" prop="transactionAmount">
                  <el-input
                    placeholder="请输入交易金额"
                    v-model="form.transactionAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="过账时间：" prop="transactionTime">
                  <el-date-picker
                    v-model="form.transactionTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择过账时间"
                  />
                </el-form-item>
                <el-form-item label="交易凭证号：" prop="transactionReceiptCode">
                  <el-input
                    placeholder="请输入交易凭证号"
                    v-model="form.transactionReceiptCode"
                    clearable
                    maxlength="100"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    placeholder="请输入备注"
                    v-model="form.remark"
                    clearable
                    maxlength="500"
                    :rows="3"
                  />
                </el-form-item>
                <el-form-item label="整车VIN编码：" prop="vin">
                  <el-input
                    placeholder="请输入整车VIN编码"
                    v-model="form.vin"
                    clearable
                    maxlength="17"
                  />
                </el-form-item>
                <el-form-item label="批售订单ID：" prop="wholesaleOrderId">
                  <el-input
                    placeholder="请输入批售订单ID"
                    v-model="form.wholesaleOrderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交车单ID：" prop="deliveryOrderId">
                  <el-input
                    placeholder="请输入交车单ID"
                    v-model="form.deliveryOrderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入门店名称"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <el-input
                    placeholder="请输入母公司名称"
                    v-model="form.dealerCompanyName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerComapnyCode">
                  <el-input
                    placeholder="请输入母公司编码"
                    v-model="form.dealerComapnyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车资金账户ID：" prop="fundAccountId">
                  <el-input
                    placeholder="请输入整车资金账户ID"
                    v-model="form.fundAccountId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    v-model="form.createTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择创建时间"
                  />
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入主键"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入创建者"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入创建者名称"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入修改者"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入修改者名称"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    v-model="form.updateTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择修改时间"
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择状态"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择状态变更描述"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-input
                    placeholder="请输入门店编码"
                    v-model="form.dealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交易前-可用余额：" prop="availableBalanceBefore">
                  <el-input
                    placeholder="请输入交易前-可用余额"
                    v-model="form.availableBalanceBefore"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交易前-冻结余额：" prop="frozenBalanceBefore">
                  <el-input
                    placeholder="请输入交易前-冻结余额"
                    v-model="form.frozenBalanceBefore"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="企业客户整车订单ID：" prop="entVehorderId">
                  <el-input
                    placeholder="请输入企业客户整车订单ID"
                    v-model="form.entVehorderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="版本号：" prop="version">
                  <el-input
                    placeholder="请输入版本号"
                    v-model="form.version"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="归属门店ID：" prop="ownerOrgId">
                  <el-input
                    placeholder="请输入归属门店ID"
                    v-model="form.ownerOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="业务幂等ID：" prop="bizIdempotentId">
                  <el-input
                    placeholder="请输入业务幂等ID"
                    v-model="form.bizIdempotentId"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="流水编号：" prop="transLogCode">
                  {{ form.transLogCode }}
                </el-form-item>
                <el-form-item label="资金类型：" prop="fundTypeLabel">
                  {{ form.fundTypeLabel }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationName">
                  {{ form.financialOrganizationName }}
                </el-form-item>
                <el-form-item label="交易类型：" prop="transactionTypeLabel">
                  {{ form.transactionTypeLabel }}
                </el-form-item>
                <el-form-item label="交易金额：" prop="transactionAmount">
                  {{ form.transactionAmount }}
                </el-form-item>
                <el-form-item label="过账时间：" prop="transactionTime">
                  {{ form.transactionTime }}
                </el-form-item>
                <el-form-item label="交易凭证号：" prop="transactionReceiptCode">
                  {{ form.transactionReceiptCode }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="整车VIN编码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="批售订单ID：" prop="wholesaleOrderId">
                  {{ form.wholesaleOrderId }}
                </el-form-item>
                <el-form-item label="交车单ID：" prop="deliveryOrderId">
                  {{ form.deliveryOrderId }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerComapnyCode">
                  {{ form.dealerComapnyCode }}
                </el-form-item>
                <el-form-item label="整车资金账户ID：" prop="fundAccountId">
                  {{ form.fundAccountId }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="交易前-可用余额：" prop="availableBalanceBefore">
                  {{ form.availableBalanceBefore }}
                </el-form-item>
                <el-form-item label="交易前-冻结余额：" prop="frozenBalanceBefore">
                  {{ form.frozenBalanceBefore }}
                </el-form-item>
                <el-form-item label="企业客户整车订单ID：" prop="entVehorderId">
                  {{ form.entVehorderId }}
                </el-form-item>
                <el-form-item label="版本号：" prop="version">
                  {{ form.version }}
                </el-form-item>
                <el-form-item label="归属门店ID：" prop="ownerOrgId">
                  {{ form.ownerOrgId }}
                </el-form-item>
                <el-form-item label="业务幂等ID：" prop="bizIdempotentId">
                  {{ form.bizIdempotentId }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>关联信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="VIN编码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="批售订单：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
                </el-form-item>
                <el-form-item label="交车单：" prop="deliveryOrderCode">
                  {{ form.deliveryOrderCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerComapnyCode">
                  {{ form.dealerComapnyCode }}
                </el-form-item>
                <el-form-item label="账户编号：" prop="fundAccountCode">
                  {{ form.fundAccountCode }}
                </el-form-item>
              </el-form>
            </div>
          </section>
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/accountTranslog/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { listIdNames } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';

const defaultForm = {
  transLogCode: '',
  fundType: '',
  fundTypeLabel: '',
  financialOrganizationId: '',
  financialOrganizationName: '',
  transactionType: '',
  transactionTypeLabel: '',
  transactionAmount: '',
  transactionTime: '',
  transactionReceiptCode: '',
  remark: '',
  vin: '',
  wholesaleOrderId: '',
  wholesaleOrderCode: '',
  deliveryOrderId: '',
  deliveryOrderCode: '',
  dealerName: '',
  dealerCompanyName: '',
  dealerComapnyCode: '',
  fundAccountId: '',
  fundAccountCode: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  status: '',
  statusLabel: '',
  statusDesc: '',
  dealerCode: '',
  availableBalanceBefore: '',
  frozenBalanceBefore: '',
  entVehorderId: '',
  version: '',
  ownerOrgId: '',
  bizIdempotentId: '',
};

export default {
  name: 'accountTranslogEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
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
      return '流水编号：' + this.form.transLogCode;
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
      pageTitle: '整车资金账户交易流水',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-accountTranslog',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      isEditing: false,
      rules: {
        transLogCode: [
          { required: true, message: '请输入流水编号', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ],
        fundType: [
          { required: true, message: '请选择资金类型', trigger: 'change' }
        ],
        financialOrganizationId: [
          { required: true, message: '请选择金融机构', trigger: 'change' }
        ],
        transactionType: [
          { required: true, message: '请选择交易类型', trigger: 'change' }
        ],
        transactionAmount: [
          { required: true, message: '请输入交易金额', trigger: 'blur' },
          { pattern: /^-?\d+(\.\d{1,2})?$/, message: '请输入有效的金额格式', trigger: 'blur' }
        ],
        transactionTime: [
          { required: true, message: '请选择过账时间', trigger: 'change' }
        ],
        transactionReceiptCode: [
          { required: true, message: '请输入交易凭证号', trigger: 'blur' },
          { max: 100, message: '最多输入100个字符', trigger: 'blur' }
        ],
        remark: [
          { max: 500, message: '最多输入500个字符', trigger: 'blur' }
        ],
        vin: [
          { max: 17, message: 'VIN编码最多17个字符', trigger: 'blur' }
        ],
        bizIdempotentId: [
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
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
    repairItemSearch (query) {
      return listIdNames({ organizationNameLike: query, status: 1 });
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      return {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
