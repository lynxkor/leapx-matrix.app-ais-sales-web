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
              <h2 v-show="_id">账户信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                 <el-form-item label="账户编号：" prop="fundAccountCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/dealerFundAccount/edit?id=${form.fundAccountId}`" target="_blank">{{form.fundAccountCode}}</el-link>
                </el-form-item>
                 <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <!-- <el-link type="primary" :href="`/partner/channelManagement/companyDetails?companyCode=${form.dealerComapnyCode}`" target="_blank">{{ form.dealerCompanyName }}</el-link> -->
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerComapnyCode">
                  <!-- <el-link type="primary" :href="`/partner/channelManagement/companyDetails?companyCode=${form.dealerComapnyCode}`" target="_blank">{{ form.dealerComapnyCode }}</el-link> -->
                  {{ form.dealerComapnyCode }}
                </el-form-item>
                <el-form-item label="销售公司名称：" prop="saleCompanyName">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/fundSaleCompany/edit?id=${form.saleCompanyId}`" target="_blank">{{ form.saleCompanyName }}</el-link>
                </el-form-item>
                <el-form-item label="资金类型：" prop="fundTypeLabel">
                  {{ form.fundTypeLabel }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationName">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=${form.financialOrganizationId}`" target="_blank">{{ form.financialOrganizationName }}</el-link>
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>交易信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                 <el-form-item label="交易金额：" prop="transactionAmount">
                  {{ form.transactionAmount }}
                </el-form-item>
                 <el-form-item label="过账时间：" prop="transactionTime">
                  {{ form.transactionTime }}
                </el-form-item>
                <el-form-item label="交易类型：" prop="transactionTypeLabel">
                  {{ form.transactionTypeLabel }}
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="整车批售订单：" prop="wholesaleOrderCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit?id=${form.wholesaleOrderId}`" target="_blank">{{form.wholesaleOrderCode}}</el-link>
                </el-form-item>
                <el-form-item label="企业客户整车订单：" prop="entVehorderCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/entorder/entVehicleOrder/edit?id=${form.entVehorderId}`" target="_blank">{{form.entVehorderCode}}</el-link>
                </el-form-item>
                <el-form-item label="交车单号：" prop="deliveryOrderCode">
                  <el-link type="primary" :href="`/sales/vehretail/orderManager/deliveryOrder/edit?id=${form.deliveryOrderId}`" target="_blank">{{ form.deliveryOrderCode }}</el-link>
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">{{form.dealerName}}</el-link>
                </el-form-item>
                 <el-form-item label="入账凭证号：" prop="transactionReceiptCode">
                  {{ form.transactionReceiptCode }}
                </el-form-item>
                <el-form-item label="行项目号：" prop="lineNo">
                  {{ form.lineNo }}
                </el-form-item>
                <el-form-item label="年度：" prop="yearNo">
                  {{ form.yearNo }}
                </el-form-item>
                 <el-form-item label="流水编号：" prop="transLogCode">
                  {{ form.transLogCode }}
                </el-form-item>
                 <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
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
// import FetchSelect from '@/libs/components/FetchSelect';
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
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
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
    openWindow (url) {
      window.open(url, '_blank');
    },
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
