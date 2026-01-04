<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="赊销明细编号" prop="creditSalesDetailCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.creditSalesDetailCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="母公司名称" prop="dealerCompanyName">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCompanyName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="母公司编码" prop="dealerCompanyCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCompanyCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="门店编码" prop="dealerCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="门店名称" prop="dealerName">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="整车批售订单" prop="wholesaleOrderCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesaleOrderCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="企业客户整车订单" prop="entVehorderCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.entVehorderCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="整车VIN编码" prop="vin">
                <el-input
                  placeholder="请输入"
                  v-model="form.vin"
                  clearable
                />
              </el-form-item>
              <el-form-item label="批售价&#x2F;折扣价" prop="wholesalePrice">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesalePrice"
                  clearable
                />
              </el-form-item>
              <el-form-item label="现金金额" prop="cashAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.cashAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="返利金额" prop="rebateAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.rebateAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="首付款比例，如0.15" prop="downPaymentRatio">
                <el-input
                  placeholder="请输入"
                  v-model="form.downPaymentRatio"
                  clearable
                />
              </el-form-item>
              <el-form-item label="赊销金额" prop="creditSalesAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.creditSalesAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="赊销时间" prop="creditSalesTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.creditSalesTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="赊销天数" prop="creditSalesDays">
                <el-input
                  placeholder="请输入"
                  v-model="form.creditSalesDays"
                  clearable
                />
              </el-form-item>
              <el-form-item label="还款时间" prop="repaymentTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.repaymentTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="还款金额" prop="repaymentAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.repaymentAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="赊销费用" prop="creditSalesFee">
                <el-input
                  placeholder="请输入"
                  v-model="form.creditSalesFee"
                  clearable
                />
              </el-form-item>
              <el-form-item label="合格证赎回申请ID" prop="certificateRedemptionApplyId">
                <el-input
                  placeholder="请输入"
                  v-model="form.certificateRedemptionApplyId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="超期赊销费用" prop="overdueFee">
                <el-input
                  placeholder="请输入"
                  v-model="form.overdueFee"
                  clearable
                />
              </el-form-item>
              <el-form-item label="违约金" prop="penaltyFee">
                <el-input
                  placeholder="请输入"
                  v-model="form.penaltyFee"
                  clearable
                />
              </el-form-item>
              <el-form-item label="凭证号" prop="voucherNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.voucherNo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建人" prop="creatorName">
                <el-input
                  placeholder="请输入"
                  v-model="form.creatorName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.createTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="修改人" prop="modifierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifierName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改时间" prop="updateTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.updateTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="主键" prop="id">
                <el-input
                  placeholder="请输入"
                  v-model="form.id"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建者" prop="creator">
                <el-input
                  placeholder="请输入"
                  v-model="form.creator"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改者" prop="modifier">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifier"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="状态变更描述" prop="statusDesc">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.statusDesc"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="是否还款" prop="repaymentFlag">
                <el-input
                  placeholder="请输入"
                  v-model="form.repaymentFlag"
                  clearable
                />
              </el-form-item>
              <el-form-item label="企业客户整车订单ID" prop="entVehorderId">
                <el-input
                  placeholder="请输入"
                  v-model="form.entVehorderId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="批售订单ID" prop="wholesaleOrderId">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesaleOrderId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="关联资金账户ID" prop="fundAccountId">
                <el-input
                  placeholder="请输入"
                  v-model="form.fundAccountId"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehwholesale/creditsales/fundOwnCreditSalesDetail/page/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  creditSalesDetailCode: '',
  dealerCompanyName: '',
  dealerCompanyCode: '',
  dealerCode: '',
  dealerName: '',
  wholesaleOrderCode: '',
  entVehorderCode: '',
  vin: '',
  wholesalePrice: '',
  cashAmount: '',
  rebateAmount: '',
  downPaymentRatio: '',
  creditSalesAmount: '',
  creditSalesTime: '',
  creditSalesDays: '',
  repaymentTime: '',
  repaymentAmount: '',
  creditSalesFee: '',
  certificateRedemptionApplyId: '',
  overdueFee: '',
  penaltyFee: '',
  voucherNo: '',
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  modifier: '',
  remark: '',
  status: '',
  statusDesc: '',
  repaymentFlag: '',
  entVehorderId: '',
  wholesaleOrderId: '',
  fundAccountId: '',
};

export default {
  name: 'pageEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val) {
          this.getDetailData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '账户管理-赊销管理-自有资金赊销明细管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-page',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        creditSalesDetailCode: [
          { required: true, message: '请输入赊销明细编号', trigger: 'change' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'change' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        wholesaleOrderCode: [
          { required: true, message: '请输入整车批售订单', trigger: 'change' }
        ],
        entVehorderCode: [
          { required: true, message: '请输入企业客户整车订单', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入整车VIN编码', trigger: 'change' }
        ],
        wholesalePrice: [
          { required: true, message: '请输入批售价&#x2F;折扣价', trigger: 'change' }
        ],
        cashAmount: [
          { required: true, message: '请输入现金金额', trigger: 'change' }
        ],
        rebateAmount: [
          { required: true, message: '请输入返利金额', trigger: 'change' }
        ],
        downPaymentRatio: [
          { required: true, message: '请输入首付款比例，如0.15', trigger: 'change' }
        ],
        creditSalesAmount: [
          { required: true, message: '请输入赊销金额', trigger: 'change' }
        ],
        creditSalesTime: [
          { required: true, message: '请选择赊销时间', trigger: 'change' }
        ],
        creditSalesDays: [
          { required: true, message: '请输入赊销天数', trigger: 'change' }
        ],
        repaymentTime: [
          { required: true, message: '请选择还款时间', trigger: 'change' }
        ],
        repaymentAmount: [
          { required: true, message: '请输入还款金额', trigger: 'change' }
        ],
        creditSalesFee: [
          { required: true, message: '请输入赊销费用', trigger: 'change' }
        ],
        certificateRedemptionApplyId: [
          { required: true, message: '请输入合格证赎回申请ID', trigger: 'change' }
        ],
        overdueFee: [
          { required: true, message: '请输入超期赊销费用', trigger: 'change' }
        ],
        penaltyFee: [
          { required: true, message: '请输入违约金', trigger: 'change' }
        ],
        voucherNo: [
          { required: true, message: '请输入凭证号', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建人', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改人', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
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
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        repaymentFlag: [
          { required: true, message: '请输入是否还款', trigger: 'change' }
        ],
        entVehorderId: [
          { required: true, message: '请输入企业客户整车订单ID', trigger: 'change' }
        ],
        wholesaleOrderId: [
          { required: true, message: '请输入批售订单ID', trigger: 'change' }
        ],
        fundAccountId: [
          { required: true, message: '请输入关联资金账户ID', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this._id;
      if (!this.id) {
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['账户管理-赊销管理-自有资金赊销明细管理', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          addOrUpdate({ ...this.form }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            const id = this.$route.query.id;
            if (rest || !id) {
              this.resetForm(formName);
            } else {
              this.getDetailData();
            }
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
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
    }
  }
};
</script>
