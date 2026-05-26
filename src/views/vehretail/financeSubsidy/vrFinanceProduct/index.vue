<template>
  <div class="page-common m-vr-finance-product-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="金融产品名称">
        <el-input
          placeholder="请输入"
          v-model="form.financeProductName"
          clearable
        />
      </el-form-item>
      <el-form-item label="金融产品编码">
        <el-input
          placeholder="请输入"
          v-model="form.code"
          clearable
        />
      </el-form-item>
      <el-form-item label="金融机构">
        <el-input
          placeholder="请输入"
          v-model="form.financeOrganizationName"
          clearable
        />
      </el-form-item>
      <el-form-item label="生效日期">
        <el-date-picker
         :default-time="['00:00:00', '23:59:59']"
          v-model="form.effectiveDate"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="失效日期">
        <el-date-picker
         :default-time="['00:00:00', '23:59:59']"
          v-model="form.expireDate"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="息费模式">
          <fetch-select
            :request="fetchOptions"
            enumCode="vr_interest_fee_mode"
            v-model="form.interestFeeMode"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="付息方式">
          <fetch-select
            :request="fetchOptions"
            enumCode="vr_interest_payment_method"
            v-model="form.interestPaymentMethod"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="金融产品状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="StatusEnum"
            v-model="form.financeProductStatus"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="金融产品类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vr_finance_product_type"
            v-model="form.financeProductType"
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
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-page
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        @paginationChange="paginationChange"
        @listSelect="handleListSelect"
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/vehretail/financeSubsidy/vrFinanceProduct/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  financeProductName: '',
  code: '',
  financeOrganizationName: '',
  effectiveDate: '',
  expireDate: '',
  interestFeeMode: '',
  interestPaymentMethod: '',
  financeProductStatus: '',
  financeProductType: ''
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage
  },
  data () {
    return {
      pageTitle: '金融产品',
      pageType: 'list',
      moduleKey: 'AISVR-vrFinanceProduct',
      form: {
        ...defaultForm
      },
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      optionObj: {
        id: 'vrFinanceProductTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'financeProductName',
            label: '金融产品名称',
            visible: true,
            width: 180,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/financeSubsidy/vrFinanceProduct/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'code', label: '金融产品编码', visible: true, width: 180 },
          { props: 'dataSourceLabel', label: '数据来源', visible: true, width: 120 },
          { props: 'financeOrganizationName', label: '金融机构', visible: true, width: 150 },
          { props: 'effectiveDate', label: '生效日期', visible: true, width: 180 },
          { props: 'expireDate', label: '失效日期', visible: true, width: 180 },
          { props: 'minDownPaymentRatio', label: '最低首付比例(%)', visible: true, width: 150 },
          { props: 'minFinalPaymentRatio', label: '最低尾款比例(%)', visible: true, width: 150 },
          { props: 'maxDownPaymentRatio', label: '最高首付比例(%)', visible: true, width: 150 },
          { props: 'maxFinalPaymentRatio', label: '最高尾款比例(%)', visible: true, width: 150 },
          { props: 'interestFeeModeLabel', label: '息费模式', visible: true, width: 120 },
          { props: 'interestPaymentMethodLabel', label: '付息方式', visible: true, width: 120 },
          { props: 'financeProductStatusLabel', label: '金融产品状态', visible: true, width: 150 },
          { props: 'financeProductTypeLabel', label: '金融产品类型', visible: true, width: 150 },
          { props: 'updateTime', label: '最近更新时间', visible: true, width: 180 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180, sortable: true, fixed: 'right' }
        ],
        total: 0
      },
      sortColumns: [
        {
          column: 'create_time',
          sort: 'DESC'
        }
      ]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      exportTable({
        businessType: '金融产品',
        dataFetchPath: 'vehretail/web/financeSubsidy/vrFinanceProduct/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '金融产品.xlsx');
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
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
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
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
        if (key === 'effectiveDate' || key === 'expireDate') {
          if (data[key] && Array.isArray(data[key]) && data[key].length === 2) {
            data[`${key}Start`] = data[key][0];
            data[`${key}End`] = data[key][1];
          }
          delete data[key];
        }
      });
      data.sortColumns = this.sortColumns;
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
.m-vr-finance-product-list {
}
</style>
