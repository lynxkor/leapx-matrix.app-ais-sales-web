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
              <!-- <el-form-item label="主键" prop="id">
                <el-input
                  placeholder="请输入"
                  v-model="form.id"
                  clearable
                />
              </el-form-item> -->
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
              <el-form-item label="赊销账户状态" prop="creditAccountStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.creditAccountStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="授信额度" prop="creditAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.creditAmount"
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
              <el-form-item label="额度生效日期" prop="effectiveTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.effectiveTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="额度失效日期" prop="expireTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.expireTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
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
              <el-form-item label="配置状态" prop="auditStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.auditStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="复核人人" prop="reviewName">
                <el-input
                  placeholder="请输入"
                  v-model="form.reviewName"
                  clearable
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
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                />
              </el-form-item>
              <el-form-item label="复核意见" prop="reviewOpinion">
                <el-input
                  placeholder="请输入"
                  v-model="form.reviewOpinion"
                  clearable
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
              <el-form-item label="复核人ID" prop="reviewUserId">
                <el-input
                  placeholder="请输入"
                  v-model="form.reviewUserId"
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/creditsales/fundOwnCreditSalesConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

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
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'change' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'change' }
        ],
        creditAccountStatus: [
          { required: true, message: '请选择赊销账户状态', trigger: 'change' }
        ],
        creditAmount: [
          { required: true, message: '请输入授信额度', trigger: 'change' }
        ],
        downPaymentRatio: [
          { required: true, message: '请输入首付款比例，如0.15', trigger: 'change' }
        ],
        effectiveTime: [
          { required: true, message: '请选择额度生效日期', trigger: 'change' }
        ],
        expireTime: [
          { required: true, message: '请选择额度失效日期', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建人', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        auditStatus: [
          { required: true, message: '请选择配置状态', trigger: 'change' }
        ],
        reviewName: [
          { required: true, message: '请输入复核人人', trigger: 'change' }
        ],
        reviewTime: [
          { required: true, message: '请选择复核时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        reviewOpinion: [
          { required: true, message: '请输入复核意见', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改人', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        reviewUserId: [
          { required: true, message: '请输入复核人ID', trigger: 'change' }
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
