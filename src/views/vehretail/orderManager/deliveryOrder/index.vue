<template>
  <div class="page-common m-delivery-order-list">
    <!--  TIPS: 自行调整如下 label-width，满足 label 不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="VIN码">
        <el-input
          placeholder="请输入"
          v-model="form.vin"
          clearable
        />
      </el-form-item>
      <el-form-item label="交车状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vr_order_status_enum"
          v-model="form.status"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="交车单编号" v-show="this.visibleCount === 3 || show">
        <el-input
          placeholder="请输入"
          v-model="form.deliveryOrderCode"
          clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="车型名称">
          <fetch-select
            :remote-method="remoteMethods.model"
            v-model="form.modelId"
            v-bind="selectOptions"
          />
        </el-form-item>
        <el-form-item label="订单交付顾问">
          <el-input
            placeholder="请输入"
            v-model="form.deliveryAdvisorName"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单销售门店">
          <fetch-select
            filterable
            clearable
            multiple
            remote
            collapseTags
            v-model="form.saleDealerCode"
            :remote-method="remoteMethods.getSaleDealer"
            value-key="storeCode"
            label-key="storeName"
          />
        </el-form-item>
        <el-form-item label="订单交付门店">
          <fetch-select
            filterable
            clearable
            multiple
            remote
            collapseTags
            v-model="form.exclusiveServiceStoreCode"
            :remote-method="remoteMethods.getServiceDealer"
            value-key="storeCode"
            label-key="storeName"
          />
        </el-form-item>
        <el-form-item label="购车人信息">
          <el-input
            placeholder="请输入"
            v-model="form.buyerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="预约提车时间">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.appointmentTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.createTime"
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
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canAssign" size="small" type="primary" @click="handleAssign">分派</el-button>
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
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
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
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/vehretail/orderManager/deliveryOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listVehicleModel, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  deliveryOrderCode: '',
  status: '',
  vin: '',
  vehicleModelName: '',
  deliveryAdvisorName: '',
  salesStoreName: '',
  deliveryStoreName: '',
  buyerName: '',
  appointmentTime: '',
  createTime: ''
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
      pageTitle: '交车单',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-deliveryOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      // 远程搜索方法
      remoteMethods: {
        // 初始方法
        model: async (query) => {
          return await listVehicleModel({ modelNameLike: query, status: 1 });
        },
        getSaleDealer: async (query) => {
          return await listOrgStoreInfo({ modelNameLike: query, isSales: true });
        },
        getServiceDealer: async (query) => {
          return await listOrgStoreInfo({ modelNameLike: query, isSupportDeliver: true });
        }
      },
      optionObj: {
        id: 'deliveryOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'deliveryOrderCode',
            label: '交车单编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/deliveryOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'statusLabel', label: '交车状态', visible: true, width: 200 },
          { props: 'appointmentTime', label: '预约提车时间', visible: true, width: 200 },
          { props: 'vin', label: 'VIN', visible: true, width: 200 },
          { props: 'vehicleModelName', label: '车型名称', visible: true, width: 200 },
          { props: 'buyerName', label: '购车人姓名', visible: false, width: 200 },
          { props: 'vehicleGuidePrice', label: '整车指导价（原补贴后价格）', visible: false, width: 200 },
          { props: 'depositReceivable', label: '应收定金', visible: false, width: 200 },
          { props: 'receivableAmount', label: '门店应收金额', visible: false, width: 200 },
          { props: 'equityDeductionTotalAmount', label: '权益抵扣总额', visible: false, width: 200 },
          { props: 'invoiceAmount', label: '开票金额', visible: false, width: 200 },
          { props: 'depositTime', label: '缴定金时间', visible: false, width: 200 },
          { props: 'lockTime', label: '锁单时间', visible: false, width: 200 },
          { props: 'notifyDeliveryTime', label: '触发交付通知时间', visible: false, width: 200 },
          { props: 'deliveryTime', label: '交车时间', visible: false, width: 200 },
          { props: 'salesStoreName', label: '订单销售门店', visible: false, width: 200 },
          { props: 'deliveryStoreName', label: '订单交付门店', visible: false, width: 200 },
          { props: 'deliveryAdvisorName', label: '订单交付顾问', visible: false, width: 200 },
          { props: 'deliveryBatteryPower', label: '交车时电量', visible: false, width: 200 },
          { props: 'deliveryMileage', label: '交车时里程', visible: false, width: 200 },
          { props: 'createTime', label: '创建时间', visible: false, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/deliveryOrder/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    // 排序
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
    // 分派按钮
    handleAssign () {
      this.$message.info('分派功能待实现');
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
        businessType: '交车单',
        dataFetchPath: 'vr/web/delivery/deliveryOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '交车单.xlsx');
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
          console.log(res);
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
      if (this.form.appointmentTime) {
        delete data.appointmentTime;
        if (this.form.appointmentTime.length > 1) {
          data.appointmentTimeStart = this.form.appointmentTime[0];
          data.appointmentTimeEnd = this.form.appointmentTime[1];
        }
      }
      // 排序字段
      data.sortColumns = this.sortColumns;
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>

<style lang="scss" scoped>
.m-delivery-order-list {
}
</style>
