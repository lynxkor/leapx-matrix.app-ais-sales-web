<template>
  <edit-page-layout ref="editLayout" title="整车资金账户管理" showPaneFooter>
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
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="账户编号：" prop="fundAccountCode">
                  {{ form.fundAccountCode }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="资金类型：" prop="fundTypeLabel">
                  {{ form.fundTypeLabel }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationName">
                  {{ form.financialOrganizationName }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  {{ form.dealerCompanyCode }}
                </el-form-item>
                <el-form-item label="是否允许使用返利：" prop="allowUseRebate">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.allowUseRebate"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否允许企业订单结算：" prop="allowEntOrderSettle">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.allowEntOrderSettle"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="企业订单额度系数：" prop="entOrderQuota">
                  <el-input-number
                    v-model="form.entOrderQuota"
                    :controls="false"
                    placeholder="请输入"
                    clearable
                    :min="0"
                    :max="1"
                    :step="0.01"
                    :precision="2"
                  />
                </el-form-item>
                <el-form-item label="资金结算顺序：" prop="settleSort">
                  <el-input-number
                    v-model="form.settleSort"
                    :controls="false"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" label-width="150px" v-show="!(isEditing || !_id)">
                <el-form-item label="账户编号：" prop="fundAccountCode">
                  {{ form.fundAccountCode }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="资金类型：" prop="fundTypeLabel">
                  {{ form.fundTypeLabel }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationName">
                  {{ form.financialOrganizationName }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  {{ form.dealerCompanyCode }}
                </el-form-item>
                <el-form-item label="是否允许使用返利：" prop="allowUseRebateLabel">
                  {{ form.allowUseRebateLabel }}
                </el-form-item>
                <el-form-item label="是否允许企业订单结算：" prop="allowEntOrderSettleLabel">
                  {{ form.allowEntOrderSettleLabel }}
                </el-form-item>
                <el-form-item label="企业订单额度系数：" prop="entOrderQuota">
                  {{ form.entOrderQuota }}
                </el-form-item>
                <el-form-item label="资金结算顺序：" prop="settleSort">
                  {{ form.settleSort }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2 v-show="_id">余额信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" label-width="150px">
                <el-form-item label="可用余额：" prop="availableBalance">
                  {{ form.availableBalance }}
                </el-form-item>
                <el-form-item label="冻结余额：" prop="frozenBalance">
                  {{ form.frozenBalance }}
                </el-form-item>
                <el-form-item label="最近交易时间：" prop="lastTradeTime">
                  {{ latestTransLog.transactionTime }}
                </el-form-item>
                <el-form-item label="累计充值金额：" prop="totalRechargeAmount">
                  {{ form.totalRechargeAmount }}
                </el-form-item>
                <el-form-item label="累计结算金额：" prop="totalSettleAmount">
                  {{ form.totalSettleAmount }}
                </el-form-item>
                <el-form-item label="最近交易金额：" prop="lastTradeAmount">
                  {{ latestTransLog.transactionAmount }}
                </el-form-item>
                <el-form-item label="最近交易类型：" prop="lastTradeType">
                  {{ latestTransLog.transactionTypeLabel }}
                </el-form-item>
                <el-form-item label="最近交易描述：" prop="lastTradeRemark">
                  {{ latestTransLog.remark }}>
                  {{ latestTransLog.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>配置信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" label-width="150px">
                <el-form-item label="是否允许使用返利：" prop="allowUseRebate">
                  {{ form.allowUseRebateLabel  }}
                </el-form-item>
                <el-form-item label="是否允许企业订单结算：" prop="allowEntOrderSettle">
                  {{ form.allowEntOrderSettleLabel  }}
                </el-form-item>
                <el-form-item label="企业订单额度系数：" prop="entOrderQuota">
                  {{ form.entOrderQuota  }}
                </el-form-item>
                <el-form-item label="资金结算顺序：" prop="settleSort">
                  {{ form.settleSort  }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>账户流水</h2>
            </div>
            <div class="common-section-body">
              <edit-table
                ref="editTable"
                :columns="columns"
                :data="tableData"
                :show-toolbar="false"
                :show-pagination="true"
                :total="total"
                @current-page-change="pageChange"
                @page-size-change="sizeChange"
              />
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/account/index';
import { getList } from '@/api/vehwholesale/fund/accountTranslog/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import routeGuard from '@/libs/mixins/routeGuard';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';

const pageSize = 10;
const defaultForm = {
  fundAccountCode: '',
  dealerCompanyName: '',
  fundType: '',
  fundTypeLabel: '',
  financialOrganizationName: '',
  dealerCompanyCode: '',
  allowUseRebate: '',
  allowUseRebateLabel: '',
  allowEntOrderSettle: '',
  allowEntOrderSettleLabel: '',
  entOrderQuota: '',
  settleSort: '',
  availableBalance: '',
  frozenBalance: '',
  totalRechargeAmount: '',
  totalSettleAmount: '',
  lastTradeTime: '',
  id: ''
};

export default {
  name: 'accountEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditTable,
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '账户编号：' + this.form.fundAccountCode;
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
    return {
      pageTitle: '整车资金账户管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-account',
      loading: false,
      submitLoading: false,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      latestTransLog: {},
      yes_no_enum_map: YES_NO_ENUM_MAP,
      columns: [
        { field: 'transLogCode', title: '流水编号', width: 240 },
        { field: 'transactionTypeLabel', title: '交易类型', width: 120 },
        { field: 'transactionAmount', title: '交易金额', width: 160 },
        { field: 'transactionTime', title: '过账时间', width: 200 },
        { field: 'transactionTime', title: '入账凭证时间', width: 200 },
        { field: 'lineNo', title: '行项目号', width: 200 },
        { field: 'remark', title: '备注', width: 260 },
        { field: 'vin', title: 'VIN码', width: 200 },
        { field: 'wholesaleOrderCode', title: '整车补货订单', width: 200 },
        { field: 'entVehorderCode', title: '企业客户整车订单', width: 200 },
        { field: 'deliveryOrderCode', title: '交车单', width: 200 },
        { field: 'dealerName', title: '门店', width: 200 },
        { field: 'createTime', title: '创建时间', width: 200 },
      ],
      optionObj: {
        form: {
          page: 1,
          size: pageSize
        }
      },
      total: 0,
      tableData: [],
      rules: {
        allowUseRebate: [
          { required: true, message: '请选择是否允许使用返利', trigger: 'change' }
        ],
        allowEntOrderSettle: [
          { required: true, message: '请选择是否允许企业订单结算', trigger: 'change' }
        ],
        entOrderQuota: [
          { required: true, message: '请输入企业订单额度系数', trigger: 'blur' },
          { type: 'number', min: 0, max: 1, message: '请输入0-1之间的数值', trigger: 'blur' }
        ],
        settleSort: [
          { required: true, message: '请输入资金结算顺序', trigger: 'blur' },
          { type: 'number', message: '请输入有效的数字', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车资金账户管理', '编辑']);
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          this.latestTransLog = res.latestTransLog ?? {};
          this.getList();
          return res;
        });
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    pageChange (page) {
      this.optionObj.form.page = page;
      this.getList();
    },
    sizeChange (size) {
      this.optionObj.form.size = size;
      this.getList();
    },
    getList () {
      getList({ fundAccountId: this._id, pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.tableData = res.records;
          this.total = res.total;
        }).catch(() => {
          this.tableData = [];
        });
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
