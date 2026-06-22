<template>
  <div class="page-common m-vr-special-vehicle-list">
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
      <el-form-item label="整车物料码">
        <el-input
          placeholder="请输入"
          v-model="form.materialsCode"
          clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="整车车型">
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
        <el-form-item label="基本车系">
          <fetch-select
            filterable
            clearable
            remote
            collapseTags
            v-model="form.seriesId"
            :remote-method="getVehicleSeriesList"
            value-key="id"
            label-key="label"
          />
        </el-form-item>
        <el-form-item label="外饰风格">
          <fetch-select
            filterable
            clearable
            remote
            collapseTags
            v-model="form.exteriorStyle"
            :remote-method="getVehicleExteriorList"
            value-key="name"
            label-key="label"
          />
        </el-form-item>
        <el-form-item label="内饰风格">
          <fetch-select
            filterable
            clearable
            remote
            collapseTags
            v-model="form.interiorStyle"
            :remote-method="getVehicleInteriorList"
            value-key="name"
            label-key="label"
          />
        </el-form-item>
        <el-form-item label="车辆年型(L)">
          <fetch-select
            filterable
            clearable
            remote
            collapseTags
            v-model="form.vehicleYearTypeId"
            :remote-method="getVehicleYearTypeList"
            value-key="id"
            label-key="label"
          />
        </el-form-item>
        <el-form-item label="选装包">
          <fetch-select
            filterable
            clearable
            remote
            collapseTags
            v-model="form.optionPackageId"
            :remote-method="getVehicleOptionPackageList"
            value-key="id"
            label-key="label"
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
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/vehretail/orderManager/vrSpecialVehicle/index';
import { getTableConfig, exportTable, vehicleSeriesList, vehicleExterior, vehicleInterior, vehicleModelList, listVehicleYearType, vehicleOptionPackage } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  vin: '',
  materialsCode: '',
  modelId: '',
  seriesId: '',
  exteriorStyle: '',
  interiorStyle: '',
  vehicleYearTypeId: '',
  optionPackageId: ''
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
      pageTitle: '特殊车辆清单',
      pageType: 'list',
      moduleKey: 'AISVR-vrSpecialVehicle',
      form: {
        ...defaultForm
      },
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      selectionList: [],
      // 下拉选项数据
      seriesList: [],
      modelList: [],
      yearTypeList: [],
      exteriorList: [],
      interiorList: [],
      optionPackageList: [],
      optionObj: {
        id: 'vrSpecialVehicleTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                if (row.vinId) {
                  this.navigateToRoute({
                    path: '/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit',
                    query: {
                      vin: row.vin
                    }
                  }, true);
                }
              },
              type: 'primary'
            }]
          },
          { props: 'materialsCode', label: '整车物料码', visible: true, width: 180 },
          { props: 'materialsDesc', label: '整车物料描述', visible: true, width: 200 },
          {
            props: 'modelName',
            label: '整车车型',
            visible: true,
            width: 150,
            buttons: [{
              click: (rowIndex, row) => {
                this.navigateToRoute({
                  path: '/sales/datacenter/materials/vehicleModel/detail',
                  query: {
                    id: row.modelId
                  }
                }, true);
              },
              type: 'primary'
            }]
          },
          { props: 'seriesName', label: '基本车系', visible: true, width: 150 },
          { props: 'exteriorStyle', label: '外饰风格', visible: true, width: 150 },
          { props: 'interiorStyle', label: '内饰风格', visible: true, width: 150 },
          { props: 'vehicleYearType', label: '车辆年型(L)', visible: true, width: 150 },
          { props: 'optionPackage', label: '选装包', visible: true, width: 150 },
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
    this.initDropdownData();
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
        businessType: '特殊车辆清单',
        dataFetchPath: 'vr/web/order/vrSpecialVehicle/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '特殊车辆清单.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导入中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
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
          this.optionObj.dataList = (res?.records || []).map(item => {
            return {
              ...item
            };
          });
          this.optionObj.total = res?.total || 0;
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
      data.sortColumns = this.sortColumns;
      return data;
    },

    // 初始化下拉选项数据
    async initDropdownData () {
      await Promise.all([
        this.getVehicleSeriesList(),
        this.getVehicleModelList(),
        this.getVehicleYearTypeList(),
        this.getVehicleExteriorList(),
        this.getVehicleInteriorList(),
        this.getVehicleOptionPackageList()
      ]);
    },

    // 获取车辆系列列表
    async getVehicleSeriesList (query = '') {
      try {
        const res = await vehicleSeriesList({
          seriesNameLike: query,
          limitSize: 1000
        });
        this.seriesList = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.name // 使用name作为value，因为v-model绑定的是name字段
          };
        });
        return this.seriesList;
      } catch (error) {
        console.error('获取车辆系列列表失败:', error);
        return [];
      }
    },

    // 获取车型列表
    async getVehicleModelList (query = '') {
      try {
        const res = await vehicleModelList({
          modelNameLike: query,
          limitSize: 1000
        });
        this.modelList = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.name // 使用name作为value，因为v-model绑定的是name字段
          };
        });
        return this.modelList;
      } catch (error) {
        console.error('获取车型列表失败:', error);
        return [];
      }
    },

    // 获取年款列表
    async getVehicleYearTypeList (query = '') {
      try {
        const res = await listVehicleYearType({
          yearTypeNameLike: query,
          limitSize: 1000
        });
        this.yearTypeList = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.name // 使用name作为value
          };
        });
        return this.yearTypeList;
      } catch (error) {
        console.error('获取年款列表失败:', error);
        return [];
      }
    },

    // 获取外饰风格列表
    async getVehicleExteriorList (query = '') {
      try {
        const res = await vehicleExterior({
          exteriorNameLike: query,
          limitSize: 1000
        });
        this.exteriorList = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.name // 使用name作为value
          };
        });
        return this.exteriorList;
      } catch (error) {
        console.error('获取外饰风格列表失败:', error);
        return [];
      }
    },

    // 获取内饰风格列表
    async getVehicleInteriorList (query = '') {
      try {
        const res = await vehicleInterior({
          interiorNameLike: query,
          limitSize: 1000
        });
        this.interiorList = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.name // 使用name作为value
          };
        });
        return this.interiorList;
      } catch (error) {
        console.error('获取内饰风格列表失败:', error);
        return [];
      }
    },

    // 获取选装包列表
    async getVehicleOptionPackageList (query = '') {
      try {
        const res = await vehicleOptionPackage({
          optionPackageNameLike: query,
          limitSize: 1000
        });
        this.optionPackageList = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.name // 使用name作为value
          };
        });
        return this.optionPackageList;
      } catch (error) {
        console.error('获取选装包列表失败:', error);
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-vr-special-vehicle-list {
}
</style>
