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
              <el-form-item label="母公司名称" prop="dealerCompanyName">
                  <fetch-select
                  :remote-method="getParentCompany"
                  remote
                  v-model="form.dealerCompanyName"
                  placeholder="请选择"
                  labelKey="companyName"
                  valueKey="companyCode"
                  clearable
                  filterable
                  @change="getDealerCompanyCode"
                  />
              </el-form-item>

              <el-form-item label="母公司编码">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCompanyCode"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="赊销账户状态" prop="creditAccountStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="vw_fund_own_credit_sales_limit_status"
                  v-model="form.creditAccountStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="授信额度" prop="creditAmount" >
                <el-input-number placeholder="请输入" v-model="form.creditAmount" clearable :controls="false" style="width: 100%;"
                :precision="2" :min="0" :step="0.01"  />
              </el-form-item>
              <el-form-item label="首付款比例%" prop="downPaymentRatio">
                <el-input-number placeholder="请输入" v-model="form.downPaymentRatio" clearable :controls="false" style="width: 100%;"
                :precision="2" :min="0" :step="0.01" :max="100" />
              </el-form-item>
              <el-form-item label="额度生效日期" prop="effectiveTime">
                <el-date-picker
                  type="date"
                  v-model="form.effectiveTime"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="额度失效日期" prop="expireTime">
                <el-date-picker
                  type="date"
                  v-model="form.expireTime"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <!-- <el-form-item label="创建人" prop="creatorName" v-show="!_id">
                <el-input
                  placeholder="请输入"
                  v-model="form.creatorName"
                  clearable
                  disabled
                />
              </el-form-item> -->
              <el-form-item label="配置人" >
                <el-input
                  placeholder="请输入"
                  v-model="form.configUserName"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                />
              </el-form-item>
              <!-- <el-form-item label="创建时间" prop="createTime" v-show="!_id">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.createTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  disabled
                />
              </el-form-item> -->
              <el-form-item label="配置时间" >
                <el-date-picker
                  type="datetime"
                  v-model="form.configTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  disabled
                />
              </el-form-item>
              <el-form-item label="配置状态">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="ve_credit_sales_config_audit_status"
                  v-model="form.auditStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                  disabled
                />
              </el-form-item>
              <el-form-item label="配置编号" prop="configCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.configCode"
                  clearable
                  disabled
                />
              </el-form-item>
            </el-form>
          </div>
        </section>

        <section class="common-section" v-show="_id">
          <div class="common-section-header">
            <h2>复核信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :model="form"  label-width="150px">
              <el-form-item label="复核人" prop="reviewName">
                <el-input
                  placeholder="请输入"
                  v-model="form.reviewName"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="复核时间" prop="reviewTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.reviewTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  disabled
                />
              </el-form-item>
              <el-form-item label="复核意见" prop="reviewOpinion">
                <el-input
                  placeholder="请输入"
                  v-model="form.reviewOpinion"
                  clearable
                  disabled
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <!-- <el-button v-if="form.auditStatus === 0 || form.auditStatus === 2" size="small" type="primary" @click="submitForm('submit')" :loading="submitLoading">提交</el-button> -->
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate, submitItem } from '@/api/vehwholesale/creditsales/fundOwnCreditSalesConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, getParentCompany } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
// import { formatDateTime } from '@/libs/utils';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  dealerCompanyName: '',
  dealerCompanyCode: '',
  creditAccountStatus: '',
  creditAmount: '',
  downPaymentRatio: '',
  effectiveTime: '',
  expireTime: '',
  creatorName: '',
  createTime: '',
  auditStatus: '',
  reviewName: '',
  reviewTime: '',
  remark: '',
  reviewOpinion: '',
  modifierName: '',
  updateTime: '',
  creator: '',
  modifier: '',
  status: '',
  statusDesc: '',
  reviewUserId: '',
  configCode: '',
  configTime: new Date(),
  configUserName: '',
  configUserId: '',
};

export default {
  name: 'fundOwnCreditSalesConfigEdit',
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

    // 1. 自定义校验规则：失效日期 > 生效日期
    const validateDateRange = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择额度失效日期'));
        return;
      }
      callback();
    };
    return {
      pageTitle: '账户管理-赊销管理-自有资金赊销配置管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundOwnCreditSalesConfig',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'change' }
        ],
        // dealerCompanyCode: [
        //   { required: true, message: '请输入母公司编码', trigger: 'change' }
        // ],
        creditAccountStatus: [
          { required: true, message: '请选择赊销账户状态', trigger: 'change' }
        ],
        creditAmount: [
          { required: true, message: '请输入授信额度', trigger: 'change' }
        ],
        downPaymentRatio: [
          { required: true, message: '请输入首付款比例', trigger: 'change' }
        ],
        effectiveTime: [
          { required: true, message: '请选择额度生效日期', trigger: 'change' }
        ],
        expireTime: [
          { required: true, message: '请选择额度失效日期', trigger: 'change' },
          { required: true, trigger: 'change', validator: validateDateRange }
        ]
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    getDealerCompanyCode (dealerCompanyCode) {
      console.log('query', dealerCompanyCode);
      this.form.dealerCompanyCode = dealerCompanyCode;
    },

    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this._id;
      if (!this.id) {
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['账户管理-赊销管理-自有资金赊销配置管理', `${id ? '详情' : '新建'}`]);
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
      if (formName === 'ruleForm') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            addOrUpdate({
              ...this.form,
            }).then(res => {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              // const id = this.$route.query.id;
              // if (rest || !id) {
              //   this.resetForm(formName);
              // } else {
              //   this.getDetailData();
              // }
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        });
      } else if (formName === 'submit') {
        const params = {
          idSet: [this.form.id]
        };
        this.$confirm('是否对配置编号为' + this.form.id + '的数据进行提交？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          submitItem(params).then(() => {
            this.$message({
              type: 'success',
              message: '提交成功!'
            });
            this.getDetailData();
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          });
        }).catch(() => {});
      //   let params = {
      //     "ids": [this.form.id]
      //   }
      //   submitItem(params).then(res => {
      //   this.$message.success('提交成功');
      // }).catch(() => {});
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        creatorName: userInfo.userName,
        createTime: new Date(),
        // 初始化草稿
        auditStatus: 0,
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
    async getParentCompany (query) {
      try {
        const res = await getParentCompany({ parentCompanyName: query });
        this.parentCompanyNames = res;
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
  }
};
</script>
