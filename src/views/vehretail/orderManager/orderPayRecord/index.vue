<template>
  <div class="page-common m-sales-proxy-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="商城订单号">
        <tag-input v-model="form.mallOrderCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="门店">
        <fetch-select
          filterable
          clearable
          remote
          v-model="form.saleDealerCode"
          :remote-method="getDealerListByName"
          value-key="storeCode"
          label-key="storeName"
        />
      </el-form-item>
      <el-form-item label="整车订单" v-show="this.visibleCount === 3 || show">
        <tag-input v-model="form.retailOrderCodeList" placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="VIN号">
          <el-input v-model="form.vin" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="收款类型">
          <fetch-select :request="fetchOptions" enumCode="vr_pay_category" v-model="form.payCategory" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="退款结果">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.refundResult" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="车型名称">
          <fetch-select
            v-model="form.modelId"
            v-bind="selectOptions"
            :remote-method="remoteMethods.model" />
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
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-active">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="定金退款" name="depositRefund" />
        <el-tab-pane label="权益核销" name="benefitWriteOff" />
      </el-tabs>
    </div>
    <div class="ais-table-c" v-if="activeName === 'depositRefund'">
      <LPVxeTable
        :key="1"
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        centralized
        :option-obj="depositRefundOption"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <div class="ais-table-c" v-if="activeName === 'benefitWriteOff'">
      <LPVxeTable
        :key="2"
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        centralized
        :option-obj="lowEquityOption"
        :get-config="getConfigLowEquity"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChangeLowEquity"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/vehretail/orderManager/orderPayRecord/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listVehicleModel, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  mallOrderCodeList: [],
  saleDealerCode: '',
  retailOrderCodeList: [],
  payCategory: '',
  refundResult: '',
  modelId: '',
  vin: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    TagInput,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage
  },
  data () {
    return {
      pageTitle: '订单收款记录',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-retailOrderPayRecord',
      activeName: 'depositRefund',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      // 远程搜索方法
      remoteMethods: {
        // 初始方法
        model: async (query) => {
          return await listVehicleModel({ modelNameLike: query });
        },
      },
      depositRefundOption: {
        id: 'orderPayRecordDepositRefundTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'payCode',
            label: '收款编号',
            visible: true,
            width: 160,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/orderPayRecord/edit',
                  query: {
                    id: row.id,
                    type: this.activeName
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'carBuyerName', label: '购车人姓名', visible: true, width: 120 },
          { props: 'refundCode', label: '退订申请单', visible: true, width: 150 },
          { props: 'mallOrderCode', label: '商城订单编号', visible: true, width: 160 },
          { props: 'outTradeNo', label: '商城流水号', visible: true, width: 200 },
          { props: 'paySerialNumber', label: '支付流水号', visible: true, width: 180 },
          { props: 'paymentAmount', label: '付款金额', visible: true, width: 120, align: 'right' },
          { props: 'paymentTime', label: '收款时间', visible: true, width: 180 },
          { props: 'payCategoryLabel', label: '收款类型', visible: true, width: 120 },
          { props: 'saleDealerName', label: '订单销售门店', visible: true, width: 200 },
          { props: 'modelName', label: '车型名称', visible: true, width: 150 },
          { props: 'orderCancelReason', label: '订单取消原因', visible: true, width: 150 },
          { props: 'refundTime', label: '退款日期', visible: true, width: 180 },
          { props: 'refundResult', label: '退款结果', visible: true, width: 120 },
          { props: 'refundRemark', label: '退款说明', visible: true, width: 150 },
          { props: 'finalApproveTime', label: '审核时间', visible: true, width: 180 },
          { props: 'paymentTypeLabel', label: '支付方式', visible: true, width: 120 },
          { props: 'paymentWayLabel', label: '支付渠道', visible: true, width: 120 },
          { props: 'refundStatusLabel', label: '申请单状态', visible: true, width: 120 },
          { props: 'orderSourceLabel', label: '订单来源', visible: true, width: 120 },
          { props: 'depositPaymentTime', label: '缴定金时间', visible: true, width: 180 },
          { props: 'depositRefundTypeLabel', label: '定金退回方式', visible: true, width: 150 }
        ],
        total: 0
      },
      lowEquityOption: {
        id: 'orderPayRecordLowEquityTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'payCode',
            label: '收款编号',
            visible: true,
            width: 160,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/orderPayRecord/edit',
                  query: {
                    id: row.id,
                    type: this.activeName
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'deliveryNote', label: '交车单', visible: true, width: 120 },
          { props: 'vin', label: 'VIN码', visible: true, width: 180 },
          { props: 'payCategoryLabel', label: '收款类型', visible: true, width: 120 },
          { props: 'rightsTypeLabel', label: '权益类型', visible: true, width: 120 },
          { props: 'paymentAmount', label: '付款金额', visible: true, width: 120, align: 'right' },
          { props: 'rightsItem', label: '权益项名称', visible: true, width: 150 },
          { props: 'remark', label: '备注', visible: true, width: 120 },
          { props: 'paymentTime', label: '付款时间', visible: true, width: 180 },
          { props: 'rightsItemCode', label: '权益项编号', visible: true, width: 150 },
          { props: 'retailOrderCode', label: '整车订单', visible: true, width: 180 },
          { props: 'saleDealerName', label: '门店', visible: true, width: 200 },
          { props: 'parentCompany', label: '所属母公司', visible: true, width: 220 },
          { props: 'deliveryTime', label: '交车时间', visible: true, width: 180 },
          { props: 'deliveryStatus', label: '交车状态', visible: true, width: 120 },
          { props: 'depositPaymentTime', label: '缴定金时间', visible: true, width: 180 },
          { props: 'mallOrderCode', label: '商城订单编号', visible: true, width: 180 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleClick (item) {
      this.activeName = item.name;
      this.getData();
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleAdd () {
      this.$router.push({
        path: '/vehretail/orderManager/orderPayRecord/edit'
      });
    },
    onSubmit () {
      this.depositRefundOption.form.page = 1;
      this.lowEquityOption.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.depositRefundOption.form.page = 1;
      this.depositRefundOption.form.pageSize = pageSize;
      this.lowEquityOption.form.page = 1;
      this.lowEquityOption.form.pageSize = pageSize;
      this.getData();
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      // 根据当前激活的 tab 设置不同的业务类型和数据路径
      let businessType = '订单收款记录';
      let dataFetchPath = 'vr/web/order/retailOrderPayRecord/page';
      let fileName = '订单收款记录.xlsx';
      let currentOption = this.activeName === 'depositRefund' ? this.depositRefundOption : this.lowEquityOption;
      if (this.activeName === 'depositRefund') {
        businessType = '定金退款记录';
        fileName = '定金退款记录.xlsx';
      } else if (this.activeName === 'benefitWriteOff') {
        businessType = '权益核销记录';
        fileName = '权益核销记录.xlsx';
      }

      exportTable({
        businessType,
        dataFetchPath,
        reqParams,
        titleMap: Object.fromEntries(currentOption.dataProp.filter(col => col.visible !== false).map(col => [col.props, col.label])),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, fileName);
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
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isSales: true });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      let currentOption = this.activeName === 'depositRefund' ? this.depositRefundOption : this.lowEquityOption;

      getList({ ...this.getFormData(), pageNum: currentOption.form.page, pageSize: currentOption.form.size })
        .then(res => {
          console.log(res);
          currentOption.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          currentOption.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      const tableId = 'orderPayRecordDepositRefundTable';
      return new Promise((resolve, reject) => {
        getTableConfig(tableId).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    getConfigLowEquity () {
      const tableId = 'orderPayRecordLowEquityTable';
      return new Promise((resolve, reject) => {
        getTableConfig(tableId).then(data => {
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
        this.depositRefundOption.form.page = num;
      } else {
        this.depositRefundOption.form.size = num;
      }
      this.debouncedGetData();
    },
    paginationChangeLowEquity (type, num) {
      if (type === 'page') {
        this.lowEquityOption.form.page = num;
      } else {
        this.lowEquityOption.form.size = num;
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

      return data;
    },
  }
};
</script>

<style lang="scss" scoped>
.m-sales-proxy-list {
  ::v-deep .m-vxe-table .m-vxe-table-options {
    top: -96px;
  }
  .ais-actions {
    margin-bottom: 8px;
  }
  .ais-table-c {
    height: calc(100% - 168px);
  }
}
</style>
