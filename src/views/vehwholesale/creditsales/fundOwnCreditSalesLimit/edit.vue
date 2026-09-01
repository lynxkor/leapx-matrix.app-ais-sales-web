<template>
  <edit-page-layout ref="editLayout" title="自有资金赊销额度" showPaneFooter>
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
        :showEditBtn="false"
      >
        <template #status>
          <!-- {{ form.creditSalesLimitCode }} -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2 v-show="_id">基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="赊销额度记录编号：" prop="creditSalesLimitCode">
                  <el-input
                    placeholder="请输入赊销额度记录编号"
                    v-model="form.creditSalesLimitCode"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  <el-input
                    placeholder="请输入母公司编码"
                    v-model="form.dealerCompanyCode"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <el-input
                    placeholder="请输入母公司名称"
                    v-model="form.dealerCompanyName"
                    clearable
                    maxlength="100"
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
                    controls-position="right"
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
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="额度生效日期：" prop="effectiveTime">
                  <el-date-picker
                    v-model="form.effectiveTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择额度生效日期"
                  />
                </el-form-item>
                <el-form-item label="额度失效日期：" prop="expireTime">
                  <el-date-picker
                    v-model="form.expireTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择额度失效日期"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.remark"
                    clearable
                    maxlength="200"
                    type="textarea"
                    :rows="3"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="赊销额度记录编号：" prop="creditSalesLimitCode">
                  {{ form.creditSalesLimitCode }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  <!-- <el-link type="primary" :href="`/service/datacenter/store/parentCompany/detail?companyCode=${form.dealerCompanyCode}`" target="_blank">{{ form.dealerCompanyCode }}</el-link> -->
                  {{ form.dealerCompanyCode }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <!-- <el-link type="primary" :href="`/service/datacenter/store/parentCompany/detail?companyCode=${form.dealerCompanyCode}`" target="_blank">{{ form.dealerCompanyName }}</el-link> -->
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="赊销账户状态：" prop="creditAccountStatusLabel">
                  {{ form.creditAccountStatusLabel }}
                </el-form-item>
                <el-form-item label="授信额度：" prop="creditAmount">
                  {{ formatAmount(form.creditAmount) }}
                </el-form-item>
                <el-form-item label="首付款比例%：" prop="downPaymentRatio">
                  {{ form.downPaymentRatio }}
                </el-form-item>
                <el-form-item label="累计提款金额：" prop="totalDrawnAmount">
                  {{ formatAmount(form.totalDrawnAmount) }}
                </el-form-item>
                <el-form-item label="已用额度：" prop="usedCreditAmount">
                  {{ formatAmount(form.usedCreditAmount) }}
                </el-form-item>
                <el-form-item label="资金使用率%：" prop="usedRatio">
                  {{ form.usedRatio }}
                </el-form-item>
                <el-form-item label="剩余可用额度：" prop="availableCreditAmount">
                  {{ formatAmount(form.availableCreditAmount) }}
                </el-form-item>
                <el-form-item label="累计赊销金额：" prop="totalCreditSalesAmount">
                  {{ formatAmount(form.totalCreditSalesAmount) }}
                </el-form-item>
                <el-form-item label="剩余应收账款：" prop="remainingReceivableAmount">
                  {{ formatAmount(form.remainingReceivableAmount) }}
                </el-form-item>
                <el-form-item label="最近结算金额：" prop="transactionAmount">
                  {{ formatAmount(form.transactionAmount) }}
                </el-form-item>
                <el-form-item label="额度生效日期：" prop="effectiveTime">
                  {{ form.effectiveTime }}
                </el-form-item>
                <el-form-item label="额度失效日期：" prop="expireTime">
                  {{ form.expireTime }}
                </el-form-item>
                <el-form-item label="额度是否有效：" prop="valid">
                  {{ form.valid ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="最近结算时间：" prop="latestSettleDateTime">
                  {{ form.latestSettleDateTime }}
                </el-form-item>
                <el-form-item label="最近交易类型：" prop="transactionTypeLabel">
                  {{ form.transactionTypeLabel }}
                </el-form-item>
                <el-form-item label="最近交易原因：" prop="transactionTypeReason">
                  {{ form.transactionTypeReason }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/creditsales/fundOwnCreditSalesLimit/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import moment from 'moment';
import { formatAmount as fmtAmount } from '@/libs/utils';

const defaultForm = {
  creditSalesLimitCode: '',
  dealerCompanyCode: '',
  dealerCompanyName: '',
  creditAccountStatus: '',
  creditAccountStatusLabel: '',
  creditAmount: '',
  downPaymentRatio: '',
  totalDrawnAmount: '',
  usedCreditAmount: '',
  usedRatio: '',
  availableCreditAmount: '',
  totalCreditSalesAmount: '',
  remainingReceivableAmount: '',
  transactionAmount: '',
  effectiveTime: '',
  expireTime: '',
  latestSettleDateTime: '',
  transactionTypeLabel: '',
  transactionTypeReason: '',
  remark: '',
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  modifier: '',
  status: '',
  statusDesc: '',
  creditSalesConfigId: ''
};

export default {
  name: 'fundOwnCreditSalesLimitEdit',
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
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '赊销额度记录编号：' + this.form.creditSalesLimitCode;
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
    // 自定义校验规则
    const validateDateRange = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择额度失效日期'));
        return;
      }

      // 获取当前日期的零点时间，用于比较日期部分
      const now = new Date();
      const currentDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // 获取失效日期的零点时间
      const expireDay = new Date(value);
      expireDay.setHours(0, 0, 0, 0);

      // 1. 验证失效日期必须大于当前日期
      if (expireDay <= currentDay) {
        callback(new Error('失效日期必须大于当前日期'));
        return;
      }

      // 2. 验证失效日期必须大于生效日期
      if (this.form.effectiveTime) {
        const effectiveDay = new Date(this.form.effectiveTime);
        effectiveDay.setHours(0, 0, 0, 0);
        if (expireDay <= effectiveDay) {
          callback(new Error('失效日期必须大于生效日期'));
          return;
        }
      }

      callback();
    };

    return {
      pageTitle: '自有资金赊销额度',
      pageType: 'edit',
      moduleKey: 'AISVW-fundOwnCreditSalesLimit',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        creditSalesLimitCode: [
          { required: true, message: '请输入赊销额度记录编号', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'blur' },
          { max: 100, message: '最多输入100个字符', trigger: 'blur' }
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
      // 提交时移除只读字段
      const submitForm = { ...this.form };
      const readOnlyFields = ['creatorName', 'createTime', 'modifierName', 'updateTime',
        'creditAccountStatusLabel', 'totalDrawnAmount', 'usedCreditAmount',
        'usedRatio', 'availableCreditAmount', 'totalCreditSalesAmount',
        'remainingReceivableAmount', 'transactionAmount', 'latestSettleDateTime',
        'transactionTypeLabel', 'transactionTypeReason'];
      readOnlyFields.forEach(field => {
        delete submitForm[field];
      });
      return addOrUpdate(submitForm);
    },
    openPane () {
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
    formatAmount (value) {
      return fmtAmount(value);
    }
  }
};
</script>
