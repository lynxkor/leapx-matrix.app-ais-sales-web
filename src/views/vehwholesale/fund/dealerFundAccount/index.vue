<template>
  <div class="page-common m-account-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="母公司编码">
        <tag-input v-model="form.dealerCompanyCodes" placeholder="请输入" />
        <!-- <el-input
          placeholder="请输入"
          v-model="form.dealerCompanyCode"
          clearable
        /> -->
      </el-form-item>
      <el-form-item label="母公司名称"  v-show="this.visibleCount === 3 || show">
        <tag-input v-model="form.dealerCompanyNames" placeholder="请输入" />
        <!-- <el-input
          placeholder="请输入"
          v-model="form.dealerCompanyName"
          clearable
        /> -->
      </el-form-item>
      <template v-if="show">
        <el-form-item label="资金类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_fundtype"
            v-model="form.fundTypes"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="金融机构名称">
          <fetch-select
            :remote-method="repairItemSearch"
            remote
            reserve-keyword
            labelKey="name"
            valueKey="id"
            v-model="form.financialOrganizationIds"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="是否允许使用返利">
           <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.allowUseRebate"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否允许企业订单结算">
         <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.allowEntOrderSettle"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
      </template>
      <page-search-action
        v-if="canList"
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-permission="moduleKey+'-setEntOrderSettleFlag'" v-show="!accountFlag" size="small" @click="componentsDialogChange('setEntOrderSettleFlag')">设置企业订单结算</el-button>
      <el-button v-permission="moduleKey+'-setRebateFlag'" v-show="!accountFlag" size="small" @click="componentsDialogChange('setRebateFlag')">设置使用返利</el-button>
      <el-button v-permission="moduleKey+'-setSettleSort'" v-show="accountFlag" size="small" @click="setSettleSort">设置结算顺序</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div
      class="ais-table-c"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
    <components-dialog ref="componentsDialog" :page-tpye="dialogTpye" />
    <setSettleSort ref="setSettleSort" :dealerCompanyName="dealerCompanyName" @confirm="getData" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/vehwholesale/fund/account/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, loginUserGet } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import componentsDialog from '@/views/vehwholesale/fund/dealerFundAccount/components/componentsDialog.vue';
import setSettleSort from '@/views/vehwholesale/fund/dealerFundAccount/components/setSettleSort.vue';
import { listIdNames } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  fundAccountCode: '',
  dealerCompanyCode: '',
  dealerCompanyNames: [],
  dealerCompanyCodes: [],
  dealerCompanyName: '',
  fundType: '',
  financialOrganizationIds: [],
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
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    TagInput,
    setSettleSort,
    componentsDialog,
    PageSearchAction,
    LPVxeTable,
    FetchSelect
  },
  data () {
    return {
      accountFlag: null, // 账户标识  true: 是店端账号；false: 厂端账号
      parentOrg: {}, // 父级组织
      dialogTpye: '',
      pageTitle: '账户管理-整车资金-整车资金账户管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-dealerFundAccount',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      optionObj: {
        id: 'accountTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'fundAccountCode',
            label: '账户编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/fund/dealerFundAccount/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerCompanyCode',
            label: '母公司编码',
            visible: true,
            width: 200
          },
          { props: 'dealerCompanyName', label: '母公司名称', visible: true, width: 200 },
          { props: 'fundTypeLabel', label: '资金类型', visible: true, width: 200 },
          { props: 'financialOrganizationName', label: '金融机构', visible: true, width: 200 },
          { props: 'settleSort', label: '资金结算顺序', visible: true, width: 200 },
          { props: 'allowUseRebateLabel', label: '是否允许使用返利', visible: true, width: 200 },
          { props: 'allowEntOrderSettleLabel', label: '是否允许企业订单结算', visible: true, width: 200 },
          { props: 'entOrderQuota', label: '企业订单额度系数', visible: true, width: 200 },
          { props: 'availableBalance', label: '可用余额', visible: true, width: 200 },
          { props: 'frozenBalance', label: '冻结余额', visible: true, width: 200 },
          { props: 'totalRechargeAmount', label: '累计充值金额', visible: true, width: 200 },
          { props: 'totalSettleAmount', label: '累计结算金额', visible: true, width: 200 },
          { props: 'lastTradeTime', label: '最近交易时间', visible: true, width: 200 },
          { props: 'saleCompanyName', label: '销售公司', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
    this.loginUserGet();
  },
  methods: {
    loginUserGet () {
      loginUserGet().then(res => {
        console.log('loginUserGet:', res);
        this.accountFlag = res.accountFlag;
        this.dealerCompanyName = res.dealerCompanyName;
      }).catch(() => {});
    },
    repairItemSearch (query) { return listIdNames({ seriesNameLike: query, status: 1 }); },
    componentsDialogChange (type) {
      this.dialogTpye = type;
      this.$refs.componentsDialog.dialogshow(type);
    },
    setSettleSort () {
      // if (this.dealerCompanyName) {
      this.$refs.setSettleSort.dialogshow();
      // } else {
      //   this.$message({
      //     message: '未查询该账号挂靠母公司',
      //     type: 'warning'
      //   });
      // }
    },
    onSubmit () {
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    // 1. 导出excel
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: '账户管理-整车资金-整车资金账户管理',
        dataFetchPath: '/vw/web/fund/dealerFundAccount/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '账户管理-整车资金-整车资金账户管理.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$message({
            type: 'info',
            message: '请前往导出列表中查询导出结果'
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }

      return data;
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

<style lang="scss" scoped>
.m-account-list {
}
</style>
