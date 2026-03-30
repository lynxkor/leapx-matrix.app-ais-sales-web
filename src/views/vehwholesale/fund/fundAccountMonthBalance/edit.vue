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
              <el-form-item label="记录编号" prop="code">
                <el-input
                  placeholder="请输入"
                  v-model="form.code"
                  clearable
                />
              </el-form-item>
              <el-form-item label="母公司名称" prop="parentCompanyName">
                <el-input
                  placeholder="请输入"
                  v-model="form.parentCompanyName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="年份" prop="year">
                <el-input
                  placeholder="请输入"
                  v-model="form.year"
                  clearable
                />
              </el-form-item>
              <el-form-item label="月份" prop="month">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="month_enum"
                  v-model="form.month"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="本期期初" prop="periodBeginBalance">
                <el-input
                  placeholder="请输入"
                  v-model="form.periodBeginBalance"
                  clearable
                />
              </el-form-item>
              <el-form-item label="本期期末" prop="periodEndBalance">
                <el-input
                  placeholder="请输入"
                  v-model="form.periodEndBalance"
                  clearable
                />
              </el-form-item>
              <el-form-item label="本期使用金额" prop="periodUseAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.periodUseAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="本期入账金额" prop="periodEntryAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.periodEntryAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="账户类型" prop="accountType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="vw_fundtype"
                  v-model="form.accountType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="金融机构名称" prop="financeOrganizationName">
                <el-input
                  placeholder="请输入"
                  v-model="form.financeOrganizationName"
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/fundAccountMonthBalance/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  parentCompanyName: '',
  year: '',
  month: '',
  periodBeginBalance: '',
  periodEndBalance: '',
  periodUseAmount: '',
  periodEntryAmount: '',
  accountType: '',
  financeOrganizationName: '',
  createTime: '',
};

export default {
  name: 'fundAccountMonthBalanceEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '资金账户月度余额管理：' + this.form.code;
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
      pageTitle: '整车批售-整车资金-资金账户月度余额管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISMC-FundAccountMonthBalance',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        code: [
          { required: true, message: '请输入记录编号', trigger: 'change' }
        ],
        parentCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'change' }
        ],
        year: [
          { required: true, message: '请输入年份', trigger: 'change' }
        ],
        month: [
          { required: true, message: '请选择月份', trigger: 'change' }
        ],
        periodBeginBalance: [
          { required: true, message: '请输入本期期初', trigger: 'change' }
        ],
        periodEndBalance: [
          { required: true, message: '请输入本期期末', trigger: 'change' }
        ],
        periodUseAmount: [
          { required: true, message: '请输入本期使用金额', trigger: 'change' }
        ],
        periodEntryAmount: [
          { required: true, message: '请输入本期入账金额', trigger: 'change' }
        ],
        accountType: [
          { required: true, message: '请选择账户类型', trigger: 'change' }
        ],
        financeOrganizationName: [
          { required: true, message: '请输入金融机构名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
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
