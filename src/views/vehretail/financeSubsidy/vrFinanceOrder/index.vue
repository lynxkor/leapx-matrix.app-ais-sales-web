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
        <tag-input v-model="form.mallOrderCodeList" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="金融订单号">
        <el-input
          placeholder="请输入"
          v-model="form.code"
          clearable
        />
      </el-form-item>
      <el-form-item label="配车VIN">
        <tag-input v-model="form.matchVinList" clearable placeholder="请输入" />
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
          <tag-input v-model="form.dealerNameList" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="基本车型">
          <el-input
            placeholder="请输入"
            v-model="form.basicCarModel"
            clearable
          />
        </el-form-item>
        <el-form-item label="金融订单状态">
          <fetch-select
            :options="financeOrderStatusOptions"
            v-model="form.financeOrderStatusList"
            :valueKey="'value'"
            :labelKey="'label'"
            placeholder="请选择"
            clearable
            filterable
            multiple
            collapse-tags
          />
        </el-form-item>
        <el-form-item label="金融机构">
          <fetch-select
            :options="financeOrganizationOptions"
            v-model="form.financeOrganizationNameList"
            :valueKey="'financeOrganizationName'"
            :labelKey="'financeOrganizationName'"
            placeholder="请选择"
            clearable
            filterable
            multiple
            collapse-tags
          />
        </el-form-item>
        <el-form-item label="是否贴息">
          <fetch-select
            :options="yes_or_no"
            :valueKey="'value'"
            :labelKey="'label'"
            v-model="form.discount"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="门店有无金融返佣">
          <fetch-select
            :options="yes_or_no"
            :valueKey="'value'"
            :labelKey="'label'"
            v-model="form.dealerHasCommission"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="分期期数">
          <fetch-select
            :options="installmentPeriodsOptions"
            v-model="form.installmentPeriodsList"
            :valueKey="'value'"
            :labelKey="'label'"
            placeholder="请选择"
            clearable
            filterable
            multiple
            collapse-tags
          />
        </el-form-item>
        <el-form-item label="省">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.provinceName"
            :remote-method="getProvince"
            value-key="name"
            label-key="name"
            @change="handleChangeProvince"
          />
        </el-form-item>
        <el-form-item label="市">
          <fetch-select
            filterable
            clearable
            v-model="form.cityName"
            :options="cityOptions"
            value-key="name"
            label-key="name"
          />
        </el-form-item>
        <el-form-item label="放款日期">
          <el-date-picker
            v-model="form.loanDisbursementDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item label="交车日期">
          <el-date-picker
            v-model="form.deliveryDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item label="贷款申请时间">
          <el-date-picker
            v-model="form.loanApplicationTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
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
import { getList, getDecryptField } from '@/api/vehretail/financeSubsidy/vrFinanceOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getRigion, getProvinceTree } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import { getList as getFinanceOrganizationList } from '@/api/vehretail/financeSubsidy/vrFinanceOrganization/index';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  installmentOrderCode: '',
  mallOrderCodeList: [],
  code: '',
  matchVinList: [],
  carOwnerName: '',
  phoneNumber: '',
  regionName: '',
  partnerName: '',
  dealerNameList: [],
  basicCarModel: '',
  financeOrderStatusList: [],
  financeOrganizationNameList: [], // 金融机构
  discount: '', // 是否贴息
  dealerHasCommission: '', // 门店有无金融返佣
  installmentPeriodsList: [], // 分期期数
  provinceName: '', // 省
  cityName: '', // 市
  loanDisbursementDateRange: [], // 放款日期范围
  deliveryDateRange: [], // 交车日期范围
  loanApplicationTimeRange: [] // 贷款申请时间范围
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
    FetchSelect,
    TagInput
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
      financeOrderStatusOptions: [
        { label: '预审申请中', value: '0' },
        { label: '预审审批中', value: '1' },
        { label: '预审批通过', value: '2' },
        { label: '预审拒绝', value: '3' },
        { label: '分期审批中', value: '4' },
        { label: '分期审批通过', value: '5' },
        { label: '分期审批拒绝', value: '6' },
        { label: '放款材料待补充', value: '7' },
        { label: '待放款', value: '8' },
        { label: '已放款', value: '9' },
        { label: '放款拒绝', value: '10' },
        { label: '订单取消', value: '11' },
        { label: '订单退回', value: '12' },
        { label: '待面签', value: '13' },
        { label: '合同签署中', value: '14' },
        { label: '客户经理变更', value: '101' }
      ],
      financeOrganizationOptions: [], // 金融机构选项
      yes_or_no: YES_NO_ENUM.map(item => ({ label: item.message, value: item.code })), // 是否贴息选项
      installmentPeriodsOptions: [ // 分期期数选项
        { label: '3期', value: 3 },
        { label: '6期', value: 6 },
        { label: '9期', value: 9 },
        { label: '12期', value: 12 },
        { label: '18期', value: 18 },
        { label: '24期', value: 24 },
        { label: '36期', value: 36 },
        { label: '42期', value: 42 },
        { label: '48期', value: 48 },
        { label: '54期', value: 54 },
        { label: '60期', value: 60 },
        { label: '72期', value: 72 },
        { label: '84期', value: 84 },
        { label: '96期', value: 96 }
      ],
      cityOptions: [], // 城市选项
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
          { props: 'vin', label: '交车VIN码', visible: true, width: 200, mask: true, getValue: (row) => getDecryptField(row.id, 'vin') },
          { props: 'matchVin', label: '配车VIN码', visible: true, width: 200, mask: true, getValue: (row) => getDecryptField(row.id, 'matchVin') },
          { props: 'regionName', label: '所属区域和部门', visible: true, width: 180 },
          { props: 'cityName', label: '市', visible: true, width: 120 },
          { props: 'provinceName', label: '省', visible: true, width: 120 },
          { props: 'carOwnerName', label: '车主姓名', visible: true, width: 120, mask: true, getValue: (row) => getDecryptField(row.id, 'carOwnerName') },
          { props: 'phoneNumber', label: '手机号码', visible: true, width: 150, mask: true, getValue: (row) => getDecryptField(row.id, 'phoneNumber') },
          { props: 'idTypeLabel', label: '证件类型', visible: true, width: 120 },
          { props: 'idNumber', label: '身份证号', visible: true, width: 200, mask: true, getValue: (row) => getDecryptField(row.id, 'idNumber') },
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
    this.getFinanceOrganizations(); // 获取金融机构选项
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
    // 获取金融机构选项
    async getFinanceOrganizations () {
      try {
        const response = await getFinanceOrganizationList({
          pageNum: 1,
          pageSize: 1000
        });
        if (response && response.records) {
          this.financeOrganizationOptions = response.records.map(item => ({
            id: item.id,
            financeOrganizationName: item.financeOrganizationName
          }));
        }
      } catch (error) {
        console.error('获取金融机构选项失败:', error);
      }
    },
    // 选择省以后带出市信息
    handleChangeProvince (val, record) {
      if (record && record.child && record.child.length > 0) {
        this.cityOptions = record.child.map(city => ({
          code: city.code,
          name: city.name
        })); // 选择省以后带出市信息
        this.form.cityName = ''; // 清空已选的城市
      } else {
        this.cityOptions = [];
        this.form.cityName = '';
      }
    },
    // 查询省份信息
    async getProvince (params) {
      try {
        const response = await getProvinceTree();
        let list = response || [];
        if (params && params.trim()) {
          const searchText = params.trim().toLowerCase();
          list = list.filter(item => item.name && item.name.toLowerCase().includes(searchText));
        }
        return list;
      } catch (error) {
        console.error('获取省份选项失败:', error);
        return [];
      }
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
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
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
          if (!res || !res.records) {
            this.$message.warning('数据获取失败，请稍后重试');
            this.optionObj.dataList = [];
            this.optionObj.total = 0;
            return;
          }
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item
            };
          });
          this.optionObj.total = res.total || 0;
        }).catch(() => {
          this.optionObj.dataList = [];
          this.optionObj.total = 0;
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
      if (Array.isArray(this.form.mallOrderCodeList) && this.form.mallOrderCodeList.length <= 1) {
        delete data.mallOrderCodeList;
        data.mallOrderCode = this.form.mallOrderCodeList[0] || '';
      }
      if (Array.isArray(this.form.matchVinList) && this.form.matchVinList.length <= 1) {
        delete data.matchVinList;
        data.matchVin = this.form.matchVinList[0] || '';
      }
      if (Array.isArray(this.form.dealerNameList) && this.form.dealerNameList.length <= 1) {
        delete data.dealerNameList;
        data.dealerName = this.form.dealerNameList[0] || '';
      }
      // 处理放款日期范围
      if (Array.isArray(this.form.loanDisbursementDateRange) && this.form.loanDisbursementDateRange.length === 2) {
        data.loanDisbursementDateStart = this.form.loanDisbursementDateRange[0];
        data.loanDisbursementDateEnd = this.form.loanDisbursementDateRange[1];
      }

      // 处理交车日期范围
      if (Array.isArray(this.form.deliveryDateRange) && this.form.deliveryDateRange.length === 2) {
        data.deliveryDateStart = this.form.deliveryDateRange[0];
        data.deliveryDateEnd = this.form.deliveryDateRange[1];
      }

      // 处理贷款申请时间范围
      if (Array.isArray(this.form.loanApplicationTimeRange) && this.form.loanApplicationTimeRange.length === 2) {
        data.loanApplicationTimeStart = this.form.loanApplicationTimeRange[0];
        data.loanApplicationTimeEnd = this.form.loanApplicationTimeRange[1];
      }
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
