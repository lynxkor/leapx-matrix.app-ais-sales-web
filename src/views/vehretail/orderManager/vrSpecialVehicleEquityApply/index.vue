<template>
  <div class="page-common m-vr-special-vehicle-equity-apply-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="VIN">
        <el-input
          placeholder="请输入"
          v-model="form.vin"
          clearable
        />
      </el-form-item>
      <el-form-item label="申请状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vr_special_vehicle_benefit_status"
          v-model="form.applyStatus"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="整车物料码">
        <el-input
          placeholder="请输入"
          v-model="form.materialsCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="基本车型">
        <fetch-select
          filterable
          clearable
          remote
          collapseTags
          v-model="form.modelId"
          :remote-method="getVehicleModelList"
          value-key="id"
          label-key="label"
        />
      </el-form-item>
      <el-form-item label="销售门店">
        <fetch-select
          filterable
          clearable
          remote
          collapseTags
          v-model="form.saleDealerCode"
          :remote-method="getDealerList"
          value-key="storeCode"
          label-key="label"
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="原车主名称">
          <el-input
            placeholder="请输入"
            v-model="form.originalOwnerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="新车主名称">
          <el-input
            placeholder="请输入"
            v-model="form.newOwnerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="新车主证件号码">
          <el-input
            placeholder="请输入"
            v-model="form.newOwnerIdNumber"
            clearable
          />
        </el-form-item>
        <el-form-item label="新车主证件类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vehretail_id_card_type"
            v-model="form.newOwnerIdType"
            placeholder="请选择新车主证件类型"
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
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/vehretail/orderManager/vrSpecialVehicleEquityApply/index';
import { getTableConfig, exportTable, getEnum, vehicleModelList, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  vin: '',
  applyStatus: '',
  materialsCode: '',
  modelId: '',
  saleDealerCode: '',
  originalOwnerName: '',
  newOwnerName: '',
  newOwnerIdNumber: '',
  newOwnerIdType: ''
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
      pageTitle: '整车零售-订单管理-特殊车辆权益申请管理',
      pageType: 'list',
      moduleKey: 'AISVR-vrSpecialVehicleEquityApply',
      form: {
        ...defaultForm
      },
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      selectionList: [],
      optionObj: {
        id: 'vrSpecialVehicleEquityApplyTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '权益申请编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/vrSpecialVehicleEquityApply/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.vinId) {
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
          { props: 'applyStatusLabel', label: '申请状态', visible: true, width: 120 },
          { props: 'applyTime', label: '申请时间', visible: true, width: 180 },
          {
            props: 'materialsCode',
            label: '整车物料码',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/materials/vehicleMaterials/detail',
                  query: {
                    id: row.materialsId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'modelName',
            label: '基本车型',
            visible: true,
            width: 150,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/materials/vehicleModel/detail',
                  query: {
                    id: row.modelId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'saleDealerName',
            label: '销售门店',
            visible: true,
            width: 240,
            buttons: [{
              click: (rowIndex, row) => {
                this.navigateToRoute({
                  path: '/partner/channelManagement/shopBasicsMessageDetails',
                  query: {
                    id: row.ownerOrgId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'originalOwnerName', label: '原车主名称', visible: true, width: 150 },
          { props: 'newOwnerName', label: '新车主名称', visible: true, width: 150 },
          { props: 'newOwnerPhone', label: '新车主手机号', visible: true, width: 150 },
          { props: 'newOwnerIdNumber', label: '新车主证件号码', visible: true, width: 180 },
          { props: 'newOwnerIdTypeLabel', label: '新车主证件类型', visible: true, width: 150 },
          { props: 'ocrInvoiceDate', label: '发票识别的开票日期', visible: true, width: 180 },
          { props: 'ocrInvoiceAmount', label: '发票识别的开票金额', visible: true, width: 150 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180, fixed: 'right', sortable: true },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 150,
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/vrSpecialVehicleEquityApply/edit',
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
    handleAdd () {
      this.$router.push({
        path: '/vehretail/orderManager/vrSpecialVehicleEquityApply/edit'
      });
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
        businessType: '整车零售-订单管理-特殊车辆权益申请管理',
        dataFetchPath: 'vr/web/order/vrSpecialVehicleEquityApply/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车零售-订单管理-特殊车辆权益申请管理.xlsx');
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
      Object.keys(data).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });
      data.sortColumns = this.sortColumns;
      return data;
    },
    // 获取车型列表
    async getVehicleModelList (query = '') {
      try {
        const res = await vehicleModelList({
          modelNameLike: query,
          limitSize: 1000
        });
        return res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.id // 使用id作为值
          };
        });
      } catch (error) {
        console.error('获取车型列表失败:', error);
        return [];
      }
    },

    // 获取销售门店列表
    async getDealerList (query = '') {
      try {
        const res = await listOrgStoreInfo({
          storeName: query,
          pageSize: 1000
        });
        return res.records.map(item => {
          return {
            ...item,
            label: item.storeName,
            value: item.storeCode // 使用storeCode作为值
          };
        });
      } catch (error) {
        console.error('获取销售门店列表失败:', error);
        return [];
      }
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
.m-vr-special-vehicle-equity-apply-list {
}
</style>
