<template>
  <div class="page-common m-retail-order-info-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="车系">
        <fetch-select
          :remote-method="remoteMethods.series"
          v-model="form.seriesId"
          placeholder="请选择"
          labelKey="name"
          valueKey="id"
          clearable
          filterable
          remote
          @change="seriesListChange" />
      </el-form-item>
      <el-form-item label="车型">
        <el-select
          v-model="form.modelId"
          clearable
          filterable
          remote
          @change="modelListChange"
        >
          <el-option
          v-for="item in modelList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="年款">
        <el-select
          v-model="form.yearTypeId"
          clearable
          filterable
          remote
        >
          <el-option
          v-for="item in yearModelList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
        </el-select>
      </el-form-item>
      <template v-if="show">
        <el-form-item label="外观：">
          <fetch-select
            v-model="form.exteriorId"
            v-bind="selectOptions"
            :remote-method="remoteMethods.exterior"
          />
        </el-form-item>
      <el-form-item label="内饰">
          <fetch-select
            v-model="form.interiorId"
            v-bind="selectOptions"
            :remote-method="remoteMethods.interior"
          />
      </el-form-item>
      <el-form-item label="轮毂">
          <fetch-select
            v-model="form.wheelHubId"
            v-bind="selectOptions"
            :remote-method="remoteMethods.wheel"
          />
      </el-form-item>
      <el-form-item label="选装包">
          <fetch-select
            v-model="form.optionPackageId"
            v-bind="selectOptions"
            :remote-method="remoteMethods.optional"
          />
      </el-form-item>
      <!-- <el-form-item label="整车订单状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vr_order_status"
          v-model="form.orderStatus"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item> -->
      <el-form-item label="原订单状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vr_order_status"
          v-model="form.originalOrderStatus"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="新订单状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vr_order_status"
          v-model="form.orderStatus"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="商城订单号">
        <el-input v-model="form.mallOrderCode" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="缴定金时间">
        <el-date-picker
         :default-time="['00:00:00', '23:59:59']"
          v-model="form.paymentTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="是否回退记录">
        <fetch-select :options="yes_no_enum" v-model="form.statusRollbackFlag" disabled placeholder="请选择" clearable />
      </el-form-item>
      <el-form-item label="操作时间">
        <dateranges
            v-model="form.createTime"
            :setDefault="true"
            deftTime="最近一周"
          />
        <!-- <el-date-picker
         :default-time="['00:00:00', '23:59:59']"
          v-model="form.createTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        /> -->
      </el-form-item>
      <el-form-item label="批售配车时间">
        <el-date-picker
         :default-time="['00:00:00', '23:59:59']"
          v-model="form.wholesaleMatchTime"
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
        is-checkbox
        is-page
        centralized
        checkboxFixed
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      >
      </LPVxeTable>
    </div>
  </div>
</template>

<script>
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { queryOrderStatusBackRecord } from '@/api/vehretail/orderManager/retailOrderInfo';
import { getTimeRangeByTypeFormat } from '@/libs/utils/time';
import commonMixins from '@/libs/mixins/commonMixins';
import {
  getTableConfig,
  tableAddOrUpdate,
  exportTable,
  getEnum,
  vehicleSeriesList,
  vehicleModelList,
  vehicleModelYearTypeRelationDistinctYeayType,
  vehicleExterior,
  vehicleInterior,
  vehicleWheelHub,
  vehicleOptionPackage,
  vehicleBatteryCell,
  vehicleRoof,
} from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import dateranges from '@/libs/components/dateranges';

const defaultForm = {
  seriesId: '',
  modelId: '',
  yearTypeId: '',
  exteriorId: '',
  interiorId: '',
  wheelHubId: '',
  optionPackageId: '',
  orderStatus: '',
  originalOrderStatus: '',
  newOrderStatus: '',
  mallOrderCode: '',
  paymentTime: '',
  statusRollbackFlag: 1,
  createTime: '', // 待后端确认字段
  wholesaleMatchTime: '', // 待后端确认字段
  wholesaleSettlementTime: '', // 待后端确认字段
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    dateranges,
    PageSearchAction,
    LPVxeTable,
    FetchSelect
  },
  data () {
    return {
      pageTitle: '回退订单状态记录查询',
      pageType: 'list',
      moduleKey: 'AISVR-orderBackStatusRecord',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        multiple: false,
        collapseTags: false,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      modelList: [],
      yearModelList: [],
      remoteMethods: {
        series: async (query) => {
          return await vehicleSeriesList({ seriesNameLike: query, status: 1 });
        },
        exterior: async (query) => {
          return await vehicleExterior({ exteriorNameLike: query });
        },
        interior: async (query) => {
          return await vehicleInterior({ interiorNameLike: query });
        },
        wheel: async (query) => {
          return await vehicleWheelHub({ wheelHubNameLike: query });
        },
        optional: async (query) => {
          return await vehicleOptionPackage({ optionPackageNameLike: query });
        },
        battery: async (query) => {
          return await vehicleBatteryCell({ batteryCellNameLike: query });
        },
        roof: async (query) => {
          return await vehicleRoof({ roofNameLike: query });
        }
      },
      optionObj: {
        id: 'orderBackStatusRecordTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'retailOrderCode',
            label: '整车订单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/retailOrderInfo/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'mallOrderCode', label: '商城订单号', visible: true, width: 200 },
          {
            props: 'saleDealerName',
            label: '订单销售门店',
            visible: true,
            width: 240,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.saleDealerCode) {
                  this.navigateToRoute({
                    path: '/partner/channelManagement/shopBasicsMessageDetails',
                    query: {
                      id: row.ownerOrgId
                    }
                  });
                }
              },
              type: 'primary'
            }]
          },
          { props: 'carBuyerName', label: '购车人姓名', visible: true, width: 120 },
          { props: 'carBuyerPhone', label: '购车人手机', visible: true, width: 140 },
          { props: 'regionName', label: '大区', visible: true, width: 160 },
          { props: 'provinceName', label: '省份', visible: true, width: 160 },
          { props: 'cityName', label: '城市', visible: true, width: 160 },
          { props: 'seriesName', label: '车系', visible: true, width: 120 }, // 没有
          { props: 'modelName', label: '车型', visible: true, width: 160 }, // 没有
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 300 },
          {
            props: 'vin', // 没有
            label: '配车 VIN 号',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.originalVin) {
                  this.navigateToRoute({
                    path: '/service/datacenter/vehicle/vehicleProfile/edit',
                    query: {
                      id: row.vinId
                    }
                  });
                }
              },
              type: 'primary'
            }]
          },
          { props: 'paymentTime', label: '缴定金时间', visible: true, width: 200 },
          { props: '', label: '确认批售时间', visible: true, width: 200 },
          { props: 'allocateTime', label: '批售配车时间', visible: true, width: 200 },
          { props: 'settleTime', label: '配售结算时间', visible: true, width: 200 },
          { props: '', label: '发运时间', visible: true, width: 200 },
          { props: '', label: '车辆到店时间', visible: true, width: 200 },
          { props: '', label: '交车时间', visible: true, width: 200 },
          { props: 'statusRollbackFlagLabel', label: '是否回退记录', visible: true, width: 140 },
          { props: 'orderStatusLabel', label: '整车订单状态', visible: true, width: 150 },
          { props: '', label: '原始订单状态', visible: true, width: 150 },
          { props: 'orderStatusLabel', label: '新订单状态', visible: true, width: 150 },
          { props: '', label: '操作描述', visible: true, width: 300 },
          { props: '', label: '操作时间', visible: true, width: 200 },
          { props: '', label: '操作人', visible: true, width: 120, fixed: 'right' }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    const { startTime, endTime } = getTimeRangeByTypeFormat('最近一周');
    this.form.createTime = [startTime, endTime];
    this.getData();
    this.modelSearch();
    this.listVehicleYearType();
  },
  methods: {
    async modelSearch () {
      const res = await vehicleModelList({ seriesId: this.form.seriesId, status: 1 });
      if (res.length) {
        const vehicleModelData = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.id
          };
        });
        this.modelList = vehicleModelData;
      } else {
        this.modelList = [];
      }
    },
    async listVehicleYearType () {
      const param = {
        modelId: this.form.modelId,
        status: 1
      };
      const res = await vehicleModelYearTypeRelationDistinctYeayType(param);
      this.yearModelList = res.map(item => {
        return {
          ...item,
          label: item.yearTypeName,
          value: item.yearTypeId
        };
      });
    },
    seriesListChange (val) {
      if (val.length) {
        this.modelSearch();
        this.listVehicleYearType();
      } else {
        this.modelList = [];
        this.form.modelId = '';
        this.yearModelList = [];
        this.form.yearTypeId = '';
        this.modelSearch();
        this.listVehicleYearType();
      }
    },
    modelListChange (val) {
      if (val.length) {
        this.listVehicleYearType();
      } else {
        this.listVehicleYearType();
        this.yearModelList = [];
        this.form.yearTypeId = '';
      }
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
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
        businessType: '回退订单状态记录',
        dataFetchPath: 'vr/web/order/orderBackStatusRecord/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '回退订单状态记录.xlsx');
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

      queryOrderStatusBackRecord({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
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
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.getData();
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });
      const timeFields = ['paymentTime', 'wholesaleMatchTime', 'wholesaleSettlementTime', 'createTime'];
      timeFields.forEach(field => {
        if (this.form[field]) {
          delete data[field];
          if (this.form[field].length > 1) {
            data[`${field}Start`] = this.form[field][0];
            data[`${field}End`] = this.form[field][1];
          }
        }
      });

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
.m-retail-order-info-list {
}
</style>
