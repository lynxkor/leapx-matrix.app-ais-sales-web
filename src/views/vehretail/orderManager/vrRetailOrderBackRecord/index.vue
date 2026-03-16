<template>
  <div class="page-common m-vr-retail-order-back-record-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="车系">
        <el-input
          placeholder="请输入"
          v-model="form.seriesName"
          clearable
        />
      </el-form-item>
      <el-form-item label="车型">
        <el-input
          placeholder="请输入"
          v-model="form.modelName"
          clearable
        />
      </el-form-item>
      <el-form-item label="年款">
        <el-input
          placeholder="请输入"
          v-model="form.vehicleYearType"
          clearable
        />
      </el-form-item>
      <el-form-item label="外观">
        <el-input
          placeholder="请输入"
          v-model="form.exteriorStyle"
          clearable
        />
      </el-form-item>
      <el-form-item label="内饰">
        <el-input
          placeholder="请输入"
          v-model="form.interiorStyle"
          clearable
        />
      </el-form-item>
      <el-form-item label="轮毂">
        <el-input
          placeholder="请输入"
          v-model="form.wheelHub"
          clearable
        />
      </el-form-item>
      <el-form-item label="整车订单状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="retailOrderStatusEnum"
          v-model="form.orderStatus"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="原订单状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="retailOrderStatusEnum"
            v-model="form.originalStatus"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="新订单状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="retailOrderStatusEnum"
            v-model="form.newStatus"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="商城订单号">
          <el-input
            placeholder="请输入"
            v-model="form.mallOrderCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="缴定金时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.payDepositTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="是否回退记录">
          <fetch-select
            :options="yes_no_enum"
            v-model="form.statusRollbackFlag"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.operationTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="批售配车时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.wholesaleAllocationTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="批售结算时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.wholesaleSettlementTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/vehretail/orderManager/vrRetailOrderBackRecord/index';
import { getTableConfig, exportTable } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  seriesName: '',
  modelName: '',
  vehicleYearType: '',
  exteriorStyle: '',
  interiorStyle: '',
  wheelHub: '',
  orderStatus: '',
  originalStatus: '',
  newStatus: '',
  mallOrderCode: '',
  payDepositTime: '',
  statusRollbackFlag: '',
  operationTime: '',
  wholesaleAllocationTime: '',
  wholesaleSettlementTime: ''
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
    FetchSelect
  },
  data () {
    return {
      pageTitle: '整车零售-订单管理-整车零售订单管理-回退记录',
      pageType: 'list',
      moduleKey: 'AISVR-vrRetailOrderBackRecord',
      form: {
        ...defaultForm
      },
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      yes_no_enum: YES_NO_ENUM,
      optionObj: {
        id: 'vrRetailOrderBackRecordTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'retailOrderCode', label: '整车订单', visible: true, width: 200, fixed: 'left' },
          { props: 'mallOrderCode', label: '商城订单号', visible: true, width: 200 },
          { props: 'saleDealerName', label: '订单销售门店', visible: true, width: 180 },
          { props: 'carOwnerName', label: '购车人姓名', visible: true, width: 150 },
          { props: 'carOwnerPhone', label: '购车人手机', visible: true, width: 150 },
          { props: 'regionName', label: '大区', visible: true, width: 120 },
          { props: 'provinceName', label: '省份', visible: true, width: 120 },
          { props: 'cityName', label: '城市', visible: true, width: 120 },
          { props: 'seriesName', label: '车系', visible: true, width: 120 },
          { props: 'modelName', label: '车型', visible: true, width: 120 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'matchVin', label: '配车VIN号', visible: true, width: 200 },
          { props: 'payDepositTime', label: '缴定金时间', visible: true, width: 180 },
          { props: 'confirmWholesaleTime', label: '确认批售时间', visible: true, width: 180 },
          { props: 'wholesaleAllocationTime', label: '批售配车时间', visible: true, width: 180 },
          { props: 'wholesaleSettlementTime', label: '配售结算时间', visible: true, width: 180 },
          { props: 'shippingTime', label: '发运时间', visible: true, width: 180 },
          { props: 'vehicleArrivalTime', label: '车辆到店时间', visible: true, width: 180 },
          { props: 'deliveryTime', label: '交车时间', visible: true, width: 180 },
          { props: 'statusRollbackFlag', label: '是否回退记录', visible: true, width: 120 },
          { props: 'orderStatus', label: '整车订单状态', visible: true, width: 150 },
          { props: 'originalStatus', label: '原始订单状态', visible: true, width: 150 },
          { props: 'newStatus', label: '新订单状态', visible: true, width: 150 },
          { props: 'operationDescription', label: '操作描述', visible: true, width: 200 },
          { props: 'operationTime', label: '操作时间', visible: true, width: 180 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180, fixed: 'right', sortable: true }
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
        businessType: '整车零售-订单管理-整车零售订单管理-回退记录',
        dataFetchPath: 'vehretail/web/orderManager/retailOrderInfo/backRecord/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车零售订单回退记录.xlsx');
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

      // 处理时间范围字段
      if (this.form.payDepositTime && this.form.payDepositTime.length > 1) {
        delete data.payDepositTime;
        data.payDepositTimeStart = this.form.payDepositTime[0];
        data.payDepositTimeEnd = this.form.payDepositTime[1];
      }
      if (this.form.operationTime && this.form.operationTime.length > 1) {
        delete data.operationTime;
        data.operationTimeStart = this.form.operationTime[0];
        data.operationTimeEnd = this.form.operationTime[1];
      }
      if (this.form.wholesaleAllocationTime && this.form.wholesaleAllocationTime.length > 1) {
        delete data.wholesaleAllocationTime;
        data.wholesaleAllocationTimeStart = this.form.wholesaleAllocationTime[0];
        data.wholesaleAllocationTimeEnd = this.form.wholesaleAllocationTime[1];
      }
      if (this.form.wholesaleSettlementTime && this.form.wholesaleSettlementTime.length > 1) {
        delete data.wholesaleSettlementTime;
        data.wholesaleSettlementTimeStart = this.form.wholesaleSettlementTime[0];
        data.wholesaleSettlementTimeEnd = this.form.wholesaleSettlementTime[1];
      }

      data.sortColumns = this.sortColumns;
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return this.$getEnum(code);
      }
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.m-vr-retail-order-back-record-list {
}
</style>
