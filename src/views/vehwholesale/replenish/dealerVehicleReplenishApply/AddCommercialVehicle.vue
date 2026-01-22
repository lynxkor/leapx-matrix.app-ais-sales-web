<template>
    <div>
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="车系">
        <tag-input v-model="form.seriesIds" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="车系">
        <tag-input v-model="form.seriesIds" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="车系">
        <tag-input v-model="form.seriesIds" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="车系">
        <tag-input v-model="form.seriesIds" placeholder="请输入" />
      </el-form-item>
      <!-- <el-form-item label="物料编码">
         <tag-input v-model="form.materialsCodeSet" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="物料描述">
        <tag-input v-model="form.materialsDescSet" placeholder="请输入" />
      </el-form-item>
        <el-form-item label="车系" v-show="visibleCount === 3 || show">
          <fetch-select
            :remote-method="seriesSearch"
            remote
            v-model="form.seriesIds"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            clearable
            multiple
            collapseTags
            filterable
            :options="seriesList"
            @change="seriesListChange" />
        </el-form-item> -->
      <template v-if="show">
        <!-- <el-form-item label="车型">
          <fetch-select
            :remote-method="modelSearch"
            remote
            reserve-keyword
            :options="modelList" v-model="form.modelIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable
            @change="modelListChange" />
        </el-form-item>
        <el-form-item label="年款">
          <fetch-select :options="yearModelList" v-model="form.yearTypeIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable/>
        </el-form-item>
        <el-form-item label="外观">
          <fetch-select :options="exteriorList" v-model="form.exteriorIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable/>
        </el-form-item>
        <el-form-item label="内饰">
          <fetch-select :options="interiorList" v-model="form.interiorIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags/>
        </el-form-item>
        <el-form-item label="轮毂">
          <fetch-select :options="wheelHubList" v-model="form.wheelHubIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable/>
        </el-form-item>
        <el-form-item label="选装包">
          <fetch-select :options="optionPackageList" v-model="form.optionPackageIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable/>
        </el-form-item>
        <el-form-item label="电池电芯">
          <fetch-select :options="batteryCellList" v-model="form.batteryCellIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable/>
        </el-form-item>
        <el-form-item label="车顶">
          <fetch-select :options="roofList" v-model="form.roofIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable/>
        </el-form-item> -->
        <!-- <el-form-item label="是否允许排产申请">
          <fetch-select :options="yes_no_enum" v-model="form.allowProductionSchedule" placeholder="请选择" clearable />
        </el-form-item>
        <el-form-item label="是否允许展车批售">
          <fetch-select :options="yes_no_enum" v-model="form.allowDisplayVehicleWholesale" placeholder="请选择" clearable />
        </el-form-item>
        <el-form-item label="是否允许试驾车批售">
          <fetch-select :options="yes_no_enum" v-model="form.allowTestDriveVehicleWholesale" placeholder="请选择" clearable />
        </el-form-item> -->
        <el-form-item label="状态">
           <fetch-select
            :request="fetchOptions"
            enumCode="StatusEnum"
            v-model="form.statusIncludeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
      </template>
      <page-search-action v-model="show" is-expandable :loading="loading" @submit="onSubmit" @reset="onReset" />
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
              @current-page-change="pageChange"
              @page-size-change="sizeChange"
            />
          </div>
        </div>
      </section>
    </div>
</template>

<script>

import debounce from 'lodash.debounce';
import EditTable from '@/libs/components/EditTable';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, listCanSettleAccountList } from '@/api/vehwholesale/fund/account/index';
import { getEnum } from '@/api/common';
import { queryPlantWholesaleInStockInventory } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApply/index';

import FetchSelect from '@/libs/components/FetchSelect';
import permissions from '@/libs/mixins/permissions';
import TagInput from '@/libs/components/TagInput';
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
  name: 'AddCommercialVehicle',
  props: {
  },
  mixins: [permissions],
  components: {
    TagInput,
    FetchSelect,
    EditTable,
    PageSearchAction
  },
  data () {
    return {
      title: '厂端现车批售',
      moduleKey: '',
      total: 0,
      loading: false,
      show: false,
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
    listCanSettleAccountList () {
      listCanSettleAccountList().then(res => {
        console.log('listCanSettleAccountList:', res);
      }).catch(err => { console.log(err); });
    },
    queryPlantWholesaleInStockInventory () {
      queryPlantWholesaleInStockInventory({}).then(res => {
        console.log('queryPlantWholesaleInStockInventory:', res);
      }).catch(err => { console.log(err); });
    },
    handleClose () {
      this.form = { ...defaultForm }; // 重置表单数据
      this.tableData = []; // 清空表格数据
      this.columns = []; // 清空列配置
    },
    pageChange (page) {
      this.optionObj.form.page = page;
      this.debouncedGetData();
    },
    sizeChange (size) {
      this.optionObj.form.size = size;
      this.debouncedGetData();
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

      // this.queryPlantWholesaleInStockInventory();
      this.listCanSettleAccountList();
    },
    confirm () {
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
