<template>
  <div class="page-common m-vr-finance-order-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="分期订单号">
        <el-input
          placeholder="请输入"
          v-model="form.installmentOrderCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="商城订单号">
        <el-input
          placeholder="请输入"
          v-model="form.mallOrderCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="金融订单号">
        <el-input
          placeholder="请输入"
          v-model="form.code"
          clearable
        />
      </el-form-item>
      <el-form-item label="VIN">
        <el-input
          placeholder="请输入"
          v-model="form.vin"
          clearable
        />
      </el-form-item>
      <el-form-item label="车主姓名">
        <el-input
          placeholder="请输入"
          v-model="form.carOwnerName"
          clearable
        />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input
          placeholder="请输入"
          v-model="form.phoneNumber"
          clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="所属区域或部门">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.regionName"
            :remote-method="getRegionList"
            value-key="orgName"
            label-key="orgName"
          />
        </el-form-item>
        <el-form-item label="合作伙伴名称">
          <el-input
            placeholder="请输入"
            v-model="form.partnerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="门店名称">
          <el-input
            placeholder="请输入"
            v-model="form.dealerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="基本车型">
          <el-input
            placeholder="请输入"
            v-model="form.basicCarModel"
            clearable
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
        is-checkbox
        is-page
        centralized
        checkboxFixed
        :option-obj="optionObj"
        :get-config="getConfig"
        @paginationChange="paginationChange"
        @listSelect="handleListSelect"
        @sortChange="handleSortChange"
        @handleSelect="handleSelectionChange"
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
import { getList } from '@/api/vehretail/financeSubsidy/vrFinanceOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getRigion } from '@/api/common';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  installmentOrderCode: '',
  mallOrderCode: '',
  code: '',
  vin: '',
  carOwnerName: '',
  phoneNumber: '',
  regionName: '',
  partnerName: '',
  dealerName: '',
  basicCarModel: ''
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
    EditPage,
    FetchSelect
  },
  data () {
    return {
      pageTitle: '金融订单',
      pageType: 'list',
      moduleKey: 'AISVR-vrFinanceOrder',
      form: {
        ...defaultForm
      },
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      selectionList: [],
      optionObj: {
        id: 'vrFinanceOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '金融订单号',
            visible: true,
            width: 300,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/financeSubsidy/vrFinanceOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'mallOrderCode', label: '商城订单号', visible: true, width: 200 },
          { props: 'installmentOrderCode', label: '分期订单号', visible: true, width: 180 },
          { props: 'dataSourceLabel', label: '数据来源', visible: true, width: 120 },
          { props: 'dealerHasCommissionLabel', label: '门店有无金融返佣', visible: true, width: 150 },
          { props: 'discountLabel', label: '是否贴息', visible: true, width: 120 },
          { props: 'financeOrderStatusLabel', label: '金融订单状态', visible: true, width: 150 },
          { props: 'vin', label: 'VIN码', visible: true, width: 200 },
          { props: 'regionName', label: '所属区域和部门', visible: true, width: 180 },
          { props: 'cityName', label: '市', visible: true, width: 120 },
          { props: 'provinceName', label: '省', visible: true, width: 120 },
          { props: 'carOwnerName', label: '车主姓名', visible: true, width: 120 },
          { props: 'phoneNumber', label: '手机号码', visible: true, width: 150 },
          { props: 'idTypeLabel', label: '证件类型', visible: true, width: 120 },
          { props: 'idNumber', label: '身份证号', visible: true, width: 200 },
          { props: 'basicCarModel', label: '基本车型', visible: true, width: 150 },
          { props: 'financeOrganizationName', label: '金融机构', visible: true, width: 150 },
          { props: 'discountScheme', label: '贴息方案', visible: true, width: 150 },
          { props: 'partnerName', label: '合作伙伴名称', visible: true, width: 150 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 240 },
          { props: 'respManName', label: '负责人', visible: true, width: 280 },
          { props: 'invoiceAmount', label: '开票金额', visible: true, width: 120, align: 'right' },
          { props: 'terminalPrice', label: '终端售价', visible: true, width: 120, align: 'right' },
          { props: 'downPayment', label: '首付金额（元）', visible: true, width: 150, align: 'right' },
          { props: 'loanAmount', label: '放款金额', visible: true, width: 120, align: 'right' },
          { props: 'vehicleLoanAmount', label: '车款贷款金额', visible: true, width: 150, align: 'right' },
          { props: 'derivativeFeeLoanAmount', label: '衍生费用贷款金额', visible: true, width: 200, align: 'right' },
          { props: 'interestBeforeDiscount', label: '贴息前利息金额', visible: true, width: 150, align: 'right' },
          { props: 'handlingFeeBeforeDiscount', label: '贴息前手续费金额', visible: true, width: 150, align: 'right' },
          { props: 'annualRateBeforeDiscount', label: '贴息前年化利率', visible: true, width: 150 },
          { props: 'installmentPeriods', label: '分期期数', visible: true, width: 120 },
          { props: 'loanRate', label: '贷款费率（%）', visible: true, width: 120 },
          { props: 'totalInterest', label: '总利息金额', visible: true, width: 120, align: 'right' },
          { props: 'manufacturerDiscountAmount', label: '厂家贴息金额', visible: true, width: 150, align: 'right' },
          { props: 'manufacturerDiscountRate', label: '厂家贴息费率（%）', visible: true, width: 150 },
          { props: 'customerBearInterest', label: '客户承担利息金额', visible: true, width: 150, align: 'right' },
          { props: 'loanApplicationTime', label: '贷款申请时间', visible: true, width: 180 },
          { props: 'loanDisbursementDate', label: '放款日期', visible: true, width: 120 },
          { props: 'deliveryDate', label: '交车日期', visible: true, width: 120 },
          { props: 'remark', label: '备注', visible: true, width: 150 },
          { props: 'auditTime', label: '审核时间', visible: true, width: 180 },
          { props: 'auditOpinion', label: '审核意见', visible: true, width: 150 },
          { props: 'cancelReason', label: '取消原因', visible: true, width: 150 },
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
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
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
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '金融订单',
        dataFetchPath: 'vr/web/financeSubsidy/vrFinanceOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '金融订单.xlsx');
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
      });
      data.sortColumns = this.sortColumns;
      return data;
    },
    async getRegionList (params) {
      return getRigion({ orgName: params });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-vr-finance-order-list {
}
</style>
