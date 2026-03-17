<template>
  <edit-page-layout ref="editLayout" title="自有资金赊销配置" showPaneFooter>
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
          {{ form.configCode }}
        </template>
        <template #extraButtons>
          <el-button v-show="auditSub" size="small" type="primary" @click="handleSubmit">提交</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2 v-show="_id">基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <fetch-select
                    :remote-method="getParentCompany"
                    remote
                    v-model="form.dealerCompanyName"
                    placeholder="请选择母公司名称"
                    labelKey="companyName"
                    valueKey="companyName"
                    clearable
                    filterable
                    :disabled="!!_id"
                    @change="getDealerCompanyCode"
                  />
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  <el-input
                    placeholder="请输入母公司编码"
                    v-model="form.dealerCompanyCode"
                    clearable
                    maxlength="50"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="赊销账户状态：" prop="creditAccountStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_fund_own_credit_sales_limit_status"
                    v-model="form.creditAccountStatus"
                    placeholder="请选择赊销账户状态"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="授信额度：" prop="creditAmount">
                  <el-input-number
                    placeholder="请输入授信额度"
                    v-model="form.creditAmount"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
                  />
                </el-form-item>
                <el-form-item label="首付款比例%：" prop="downPaymentRatio">
                  <el-input-number
                    placeholder="请输入首付款比例"
                    v-model="form.downPaymentRatio"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :max="100"
                    :controls="false"
                  />
                </el-form-item>
                <el-form-item label="额度生效日期：" prop="effectiveTime">
                  <el-date-picker
                    type="date"
                    v-model="form.effectiveTime"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择额度生效日期"
                  />
                </el-form-item>
                <el-form-item label="额度失效日期：" prop="expireTime">
                  <el-date-picker
                    type="date"
                    v-model="form.expireTime"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择额度失效日期"
                  />
                </el-form-item>
                <el-form-item label="配置人：" prop="configUserName">
                  <el-input
                    placeholder="请输入配置人"
                    v-model="form.configUserName"
                    clearable
                    maxlength="50"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.remark"
                    clearable
                    maxlength="200"
                    type="textarea"
                    :rows="1"
                  />
                </el-form-item>
                <el-form-item label="配置时间：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.configTime"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="配置状态：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditStatusLabel"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="配置编号：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.configCode"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" label-width="150px" v-show="!(isEditing || !_id)">
                <el-form-item label="配置编号：" prop="configCode">
                  {{ form.configCode }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  {{ form.dealerCompanyCode }}
                </el-form-item>
                <el-form-item label="赊销账户状态：" prop="creditAccountStatusLabel">
                  {{ form.creditAccountStatusLabel }}
                </el-form-item>
                <el-form-item label="授信额度：" prop="creditAmount">
                  {{ form.creditAmount }}
                </el-form-item>
                <el-form-item label="首付款比例%：" prop="downPaymentRatio">
                  {{ form.downPaymentRatio }}
                </el-form-item>
                <el-form-item label="额度生效日期：" prop="effectiveTime">
                  {{ form.effectiveTime }}
                </el-form-item>
                <el-form-item label="额度失效日期：" prop="expireTime">
                  {{ form.expireTime }}
                </el-form-item>
                <el-form-item label="配置人：" prop="configUserName">
                  {{ form.configUserName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="配置时间：" prop="configTime">
                  {{ form.configTime }}
                </el-form-item>
                <el-form-item label="配置状态：" prop="auditStatusLabel">
                  {{ form.auditStatusLabel }}
                </el-form-item>
                <el-form-item label="配置编号：" prop="configCode">
                  {{ form.configCode }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="_id">
            <div class="common-section-header">
              <h2>复核信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" label-width="150px">
                <el-form-item label="复核人：" prop="reviewName">
                  {{ form.reviewName }}
                </el-form-item>
                <el-form-item label="复核时间：" prop="reviewTime">
                  {{ form.reviewTime }}
                </el-form-item>
                <el-form-item label="复核意见：" prop="reviewOpinion">
                  {{ form.reviewOpinion }}
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
import { getDetail, addOrUpdate, submitItem, gdclItem } from '@/api/vehwholesale/creditsales/fundOwnCreditSalesConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getParentCompany, loginUserGet } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import moment from 'moment';

const defaultForm = {
  configCode: '',
  dealerCompanyName: '',
  dealerCompanyCode: '',
  creditAccountStatus: '',
  creditAmount: '',
  downPaymentRatio: '',
  effectiveTime: '',
  expireTime: '',
  configUserName: '',
  configTime: '',
  auditStatus: '',
  remark: '',
  reviewName: '',
  reviewTime: '',
  reviewOpinion: '',
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  modifier: '',
  status: '',
  statusDesc: '',
  reviewUserId: ''
};

export default {
  name: 'fundOwnCreditSalesConfigEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
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
      return '配置编号：' + this.form.configCode;
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

    // 自定义校验规则：失效日期 > 生效日期
    const validateDateRange = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择额度失效日期'));
        return;
      }
      if (this.form.effectiveTime && new Date(value) <= new Date(this.form.effectiveTime)) {
        callback(new Error('失效日期必须大于生效日期'));
        return;
      }
      callback();
    };

    return {
      pageTitle: '自有资金赊销配置',
      pageType: 'edit',
      moduleKey: 'AISVW-fundOwnCreditSalesConfig',
      auditSub: false,
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        dealerCompanyName: [
          { required: true, message: '请选择母公司名称', trigger: 'change' }
        ],
        creditAccountStatus: [
          { required: true, message: '请选择赊销账户状态', trigger: 'change' }
        ],
        creditAmount: [
          { required: true, message: '请输入授信额度', trigger: 'change' },
          { type: 'number', min: 0, message: '授信额度必须大于等于0', trigger: 'change' }
        ],
        downPaymentRatio: [
          { required: true, message: '请输入首付款比例', trigger: 'change' },
          { type: 'number', min: 0, max: 100, message: '首付款比例必须在0-100之间', trigger: 'change' }
        ],
        effectiveTime: [
          { required: true, message: '请选择额度生效日期', trigger: 'change' }
        ],
        expireTime: [
          { required: true, message: '请选择额度失效日期', trigger: 'change' },
          { validator: validateDateRange, trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
  },
  methods: {
    getDealerCompanyCode (dealerCompanyCode, obj) {
      this.form.dealerCompanyCode = obj.companyCode;
      gdclItem({ dealerCompanyCode: obj.companyCode }).then((res) => {
        if (res) {
          this.form.creditAccountStatus = res.creditAccountStatus;
          this.form.creditAmount = res.creditAmount;
          this.form.downPaymentRatio = res.downPaymentRatio;
          this.form.effectiveTime = res.effectiveTime;
          this.form.expireTime = res.expireTime;
        } else {
          this.form.creditAccountStatus = '';
          this.form.creditAmount = '';
          this.form.downPaymentRatio = '';
          this.form.effectiveTime = '';
          this.form.expireTime = '';
        }
      }).catch(() => {
      });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          // 设置提交按钮显示状态
          this.auditSub = (res.auditStatus === 0 || res.auditStatus === 2);
          return res;
        });
      } else {
        // 新建时初始化配置人信息
        return loginUserGet().then(res => {
          this.form.configUserName = res.userName;
          this.form.configTime = moment().format('YYYY-MM-DD HH:mm:ss');
          this.form.auditStatus = 0; // 初始化为草稿状态
          return this.form;
        });
      }
    },
    submitRequest () {
      // 提交时移除只读字段
      const submitForm = { ...this.form };
      const readOnlyFields = ['creatorName', 'createTime', 'modifierName', 'updateTime',
        'configUserName', 'configTime', 'auditStatusLabel', 'creditAccountStatusLabel',
        'reviewName', 'reviewTime', 'reviewOpinion'];
      readOnlyFields.forEach(field => {
        delete submitForm[field];
      });
      return addOrUpdate(submitForm);
    },
    handleSubmit () {
      const params = {
        idSet: [this.form.id]
      };
      this.$confirm('是否对配置编号为' + this.form.configCode + '的数据进行提交？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submitItem(params).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.$refs.containerRef.loadDetail();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '提交失败!'
          });
        });
      }).catch(() => {});
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        creatorName: userInfo.userName,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        auditStatus: 0 // 初始化草稿状态
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async getParentCompany (query) {
      try {
        return await getParentCompany({ parentCompanyName: query });
      } catch (error) {
        console.error('Error fetching parent company list:', error);
        return [];
      }
    }
  }
};
</script>
