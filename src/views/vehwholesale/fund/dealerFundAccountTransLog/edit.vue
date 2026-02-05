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
              <el-form-item label="流水编号" prop="transLogCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.transLogCode"
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
              <el-form-item label="金融机构ID" prop="financialOrganizationId">
                <el-input
                  placeholder="请输入"
                  v-model="form.financialOrganizationId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="交易类型" prop="transactionType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.transactionType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="交易金额" prop="transactionAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.transactionAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="过账时间（交易时间）" prop="transactionTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.transactionTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="交易凭证号" prop="transactionReceiptCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.transactionReceiptCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备注（说明）" prop="remark">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
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
              <el-form-item label="批售订单ID" prop="wholesaleOrderId">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesaleOrderId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="交车单ID" prop="deliveryOrderId">
                <el-input
                  placeholder="请输入"
                  v-model="form.deliveryOrderId"
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
              <el-form-item label="母公司名称" prop="dealerCompanyName">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCompanyName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="母公司编码" prop="dealerComapnyCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerComapnyCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="整车资金账户ID" prop="fundAccountId">
                <el-input
                  placeholder="请输入"
                  v-model="form.fundAccountId"
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
              <el-form-item label="门店编码" prop="dealerCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="交易前-可用余额" prop="availableBalanceBefore">
                <el-input
                  placeholder="请输入"
                  v-model="form.availableBalanceBefore"
                  clearable
                />
              </el-form-item>
              <el-form-item label="交易前-冻结余额" prop="frozenBalanceBefore">
                <el-input
                  placeholder="请输入"
                  v-model="form.frozenBalanceBefore"
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
              <el-form-item label="版本号，来自资金账户的版本号" prop="version">
                <el-input
                  placeholder="请输入"
                  v-model="form.version"
                  clearable
                />
              </el-form-item>
              <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级" prop="ownerOrgId">
                <el-input
                  placeholder="请输入"
                  v-model="form.ownerOrgId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="业务幂等ID" prop="bizIdempotentId">
                <el-input
                  placeholder="请输入"
                  v-model="form.bizIdempotentId"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" @click="handleBack">取消</el-button>
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/accountTranslog/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  transLogCode: '',
  fundType: '',
  financialOrganizationId: '',
  transactionType: '',
  transactionAmount: '',
  transactionTime: '',
  transactionReceiptCode: '',
  remark: '',
  vin: '',
  wholesaleOrderId: '',
  deliveryOrderId: '',
  dealerName: '',
  dealerCompanyName: '',
  dealerComapnyCode: '',
  fundAccountId: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  status: '',
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
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '账户管理-整车资金-整车资金账户交易流水管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-accountTranslog',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        transLogCode: [
          { required: true, message: '请输入流水编号', trigger: 'blur' }
        ],
        fundType: [
          { required: true, message: '请选择资金类型', trigger: 'change' }
        ],
        financialOrganizationId: [
          { required: true, message: '请输入金融机构ID', trigger: 'blur' }
        ],
        transactionType: [
          { required: true, message: '请选择交易类型', trigger: 'change' }
        ],
        transactionAmount: [
          { required: true, message: '请输入交易金额', trigger: 'blur' }
        ],
        transactionTime: [
          { required: true, message: '请选择过账时间（交易时间）', trigger: 'change' }
        ],
        transactionReceiptCode: [
          { required: true, message: '请输入交易凭证号', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注（说明）', trigger: 'blur' }
        ],
        vin: [
          { required: true, message: '请输入整车VIN编码', trigger: 'blur' }
        ],
        wholesaleOrderId: [
          { required: true, message: '请输入批售订单ID', trigger: 'blur' }
        ],
        deliveryOrderId: [
          { required: true, message: '请输入交车单ID', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'blur' }
        ],
        dealerComapnyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'blur' }
        ],
        fundAccountId: [
          { required: true, message: '请输入整车资金账户ID', trigger: 'blur' }
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
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'blur' }
        ],
        availableBalanceBefore: [
          { required: true, message: '请输入交易前-可用余额', trigger: 'blur' }
        ],
        frozenBalanceBefore: [
          { required: true, message: '请输入交易前-冻结余额', trigger: 'blur' }
        ],
        entVehorderId: [
          { required: true, message: '请输入企业客户整车订单ID', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入版本号，来自资金账户的版本号', trigger: 'blur' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'blur' }
        ],
        bizIdempotentId: [
          { required: true, message: '请输入业务幂等ID', trigger: 'blur' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    handleBack () {
      // this.$router.back();
      let newPath = this.$route.path.replace(/\/edit$/, '');
      this.$router.push(newPath);
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['账户管理-整车资金-整车资金账户交易流水管理', `${id ? '编辑' : '新建'}`]);
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
              const currentPath = this.$route.path;
              this.$router.push({
                path: currentPath,
                query: { id: res }
              });
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
