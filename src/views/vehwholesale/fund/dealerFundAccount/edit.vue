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
              <el-form-item label="账户编号" prop="fundAccountCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.fundAccountCode"
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
              <el-form-item label="母公司名称" prop="dealerCompanyName">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCompanyName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="资金类型" prop="fundType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.fundType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="金融机构名称" prop="financialOrganizationName">
                <el-input
                  placeholder="请输入"
                  v-model="form.financialOrganizationName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="资金结算顺序" prop="settleSort">
                <el-input
                  placeholder="请输入"
                  v-model="form.settleSort"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否允许客户使用返利,1:允许，0不允许" prop="allowUseRebate">
                <el-input
                  placeholder="请输入"
                  v-model="form.allowUseRebate"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否允许企业订单结算,1:允许，0不允许" prop="allowEntOrderSettle">
                <el-input
                  placeholder="请输入"
                  v-model="form.allowEntOrderSettle"
                  clearable
                />
              </el-form-item>
              <el-form-item label="企业订单额度系数" prop="entOrderQuota">
                <el-input
                  placeholder="请输入"
                  v-model="form.entOrderQuota"
                  clearable
                />
              </el-form-item>
              <el-form-item label="可用余额" prop="availableBalance">
                <el-input
                  placeholder="请输入"
                  v-model="form.availableBalance"
                  clearable
                />
              </el-form-item>
              <el-form-item label="冻结余额" prop="frozenBalance">
                <el-input
                  placeholder="请输入"
                  v-model="form.frozenBalance"
                  clearable
                />
              </el-form-item>
              <el-form-item label="累计充值金额" prop="totalRechargeAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.totalRechargeAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="累计结算金额" prop="totalSettleAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.totalSettleAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="最近交易时间" prop="lastTradeTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.lastTradeTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="销售公司" prop="saleCompanyId">
                <el-input
                  placeholder="请输入"
                  v-model="form.saleCompanyId"
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
              <el-form-item label="创建者名称" prop="creatorName">
                <el-input
                  placeholder="请输入"
                  v-model="form.creatorName"
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
              <el-form-item label="修改者名称" prop="modifierName">
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
              <el-form-item label="备注（说明）" prop="remark">
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
              <el-form-item label="母公司ID" prop="dealerCompanyId">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCompanyId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="金融机构ID" prop="financialOrganizationId">
                <el-input
                  placeholder="请输入"
                  v-model="form.financialOrganizationId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="版本号" prop="version">
                <el-input
                  placeholder="请输入"
                  v-model="form.version"
                  clearable
                />
              </el-form-item>
              <el-form-item label="返利账户可用余额," prop="rebateAvailableBalance">
                <el-input
                  placeholder="请输入"
                  v-model="form.rebateAvailableBalance"
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/account/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  fundAccountCode: '',
  dealerCompanyCode: '',
  dealerCompanyName: '',
  fundType: '',
  financialOrganizationName: '',
  settleSort: '',
  allowUseRebate: '',
  allowEntOrderSettle: '',
  entOrderQuota: '',
  availableBalance: '',
  frozenBalance: '',
  totalRechargeAmount: '',
  totalSettleAmount: '',
  lastTradeTime: '',
  saleCompanyId: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  dealerCompanyId: '',
  financialOrganizationId: '',
  version: '',
  rebateAvailableBalance: '',
};

export default {
  name: 'accountEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '账户管理-整车资金-整车资金账户管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-account',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        fundAccountCode: [
          { required: true, message: '请输入账户编号', trigger: 'blur' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'blur' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'blur' }
        ],
        fundType: [
          { required: true, message: '请选择资金类型', trigger: 'change' }
        ],
        financialOrganizationName: [
          { required: true, message: '请输入金融机构名称', trigger: 'blur' }
        ],
        settleSort: [
          { required: true, message: '请输入资金结算顺序', trigger: 'blur' }
        ],
        allowUseRebate: [
          { required: true, message: '请输入是否允许客户使用返利,1:允许，0不允许', trigger: 'blur' }
        ],
        allowEntOrderSettle: [
          { required: true, message: '请输入是否允许企业订单结算,1:允许，0不允许', trigger: 'blur' }
        ],
        entOrderQuota: [
          { required: true, message: '请输入企业订单额度系数', trigger: 'blur' }
        ],
        availableBalance: [
          { required: true, message: '请输入可用余额', trigger: 'blur' }
        ],
        frozenBalance: [
          { required: true, message: '请输入冻结余额', trigger: 'blur' }
        ],
        totalRechargeAmount: [
          { required: true, message: '请输入累计充值金额', trigger: 'blur' }
        ],
        totalSettleAmount: [
          { required: true, message: '请输入累计结算金额', trigger: 'blur' }
        ],
        lastTradeTime: [
          { required: true, message: '请选择最近交易时间', trigger: 'change' }
        ],
        saleCompanyId: [
          { required: true, message: '请输入销售公司', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'blur' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注（说明）', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dealerCompanyId: [
          { required: true, message: '请输入母公司ID', trigger: 'blur' }
        ],
        financialOrganizationId: [
          { required: true, message: '请输入金融机构ID', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ],
        rebateAvailableBalance: [
          { required: true, message: '请输入返利账户可用余额,', trigger: 'blur' }
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
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['账户管理-整车资金-整车资金账户管理', `${id ? '编辑' : '新建'}`]);
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
    // handleJumpAuditLog () {
    //   this.$router.push({
    //     path: '/xxx/auditLog',
    //     query: {
    //       tableCode: '',
    //       tableId: ''
    //     }
    //   });
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
