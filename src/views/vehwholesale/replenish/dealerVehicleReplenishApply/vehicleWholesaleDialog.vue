<template>
  <el-dialog :title="title" width="1200px" :visible.sync="dialogVisible" @close="handleClose">
    <div class="page-common m-account-list">
      <el-form
        ref="form"
        :model="form"
        label-width="120px"
        :inline="true"
        size="small"
        label-position="right"
        class="ais-search-form"
      >
      <el-form-item label="返利余额下限（万元）：" class="long_text">
        <el-input-number v-model="form.rebateBalanceMin" :controls="false" placeholder="请选择" clearable />
        </el-form-item>
        <page-search-action
          v-model="show"
          :is-expandable="false"
          :loading="loading"
          @submit="onSubmit"
          @reset="onReset"
        />
      </el-form>
      <div class="ais-actions">
        <!--  TIPS:根据产品增删功能按钮  -->
          <span>
          </span>
      </div>
      <section class="common-section">
        <div class="common-section-body">
          <div class="common-section-table">
            <edit-table
              ref="editTable"
              :columns="columns"
              :data="tableData"
              :show-toolbar="false"
              :show-pagination="true"
              :checkbox="true"
              :total="total"
              :auth="{ edit: false, delete: false }"
            />
          </div>
        </div>
      </section>
    </div>
  </el-dialog>
</template>

<script>

import debounce from 'lodash.debounce';
import EditTable from '@/libs/components/EditTable';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, listCanSettleAccount } from '@/api/vehwholesale/fund/account/index';
import { getEnum } from '@/api/common';
import { queryPlantWholesaleInStockInventory } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApply/index';

// import FetchSelect from '@/libs/components/FetchSelect';
import permissions from '@/libs/mixins/permissions';
// import TagInput from '@/libs/components/TagInput';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  setRebateFlagQuery: true,
  dealerCompanyNames: [],
  financialOrganizationId: '',
  dealerCompanyNameLike: '',
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
  createTime: ''
};
const pageSize = 20;
export default {
  name: 'vehicleWholesaleDialog',
  props: {
  },
  mixins: [permissions],
  components: {
    // TagInput,
    // FetchSelect,
    EditTable,
    PageSearchAction
  },
  data () {
    return {
      title: '厂端现车批售',
      moduleKey: 'AISVW-dealerFundAccount',
      total: 0,
      loading: false,
      show: false,
      dialogVisible: false,
      form: {
        ...defaultForm
      },
      columns: [
        { field: 'dealerCompanyName', title: '母公司名称', width: '30%' },
        { field: 'fundTypeLabel', title: '资金类型', width: 120 },
        { field: 'entOrderQuota', title: '企业订单额度系数', width: 200 },
        { field: 'financialOrganizationName', title: '金融机构', width: 120 },
        { field: 'availableBalance', title: '可用余额', width: 200 },
        { field: 'rebateAvailableBalance', title: '返利账户可用余额', width: 200 },
        { field: 'allowUseRebateLabel', title: '是否允许使用返利', width: 200 },
        { field: 'fundAccountCode', title: '账户编号', width: 200 },
        { field: 'lastTradeTime', title: '最近交易时间', width: 200 },
        { field: 'createTime', title: '创建时间', width: 200 },
      ],
      optionObj: {
        form: {
          page: 1,
          size: pageSize
        }
      },
      tableData: []
    };
  },
  methods: {
    listCanSettleAccount () {
      listCanSettleAccount({}).then(res => {
        console.log('listCanSettleAccount:', res);
      }).catch(err => { console.log(err); });
    },
    queryPlantWholesaleInStockInventory () {
      queryPlantWholesaleInStockInventory({}).then(res => {
        console.log('queryPlantWholesaleInStockInventory:', res);
        this.tableData = res.inStockInventoryDtoList || [{}, {}];
      }).catch(err => { console.log(err); });
    },
    handleClose () {
      this.form = { ...defaultForm }; // 重置表单数据
      this.tableData = []; // 清空表格数据
      this.columns = []; // 清空列配置
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
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });
      if (Array.isArray(this.form.dealerCompanyNames) && this.form.dealerCompanyNames.length <= 1) {
        delete data.dealerCompanyNames;
        data.dealerCompanyNameLike = this.form.dealerCompanyNames[0] || '';
      };
      return data;
    },
    getData () {
      this.loading = true;
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.tableData = res.records;
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),

    dialogshow () {
      // this.getData();

      this.queryPlantWholesaleInStockInventory();
      this.listCanSettleAccount();
      this.dialogVisible = true;
    },
    confirm () {
      this.dialogVisible = true;
      this.$refs.editTable.clearSelection();
      this.$emit('confirm', this.form);
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
.long_text {
  ::v-deep .el-form-item__label {
    line-height: 20px;
  }
  ::v-deep .el-input-number--small {
    width: 100%;
  }
}
::v-deep .dialog-footer {
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
}
/* 输入框居中样式 */
.centered-input {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
