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
          <el-input
            placeholder="请输入"
            v-model="form.modelName"
            clearable
          />
        </el-form-item>
        <el-form-item label="基本车系">
          <el-input
            placeholder="请输入"
            v-model="form.seriesName"
            clearable
          />
        </el-form-item>
        <el-form-item label="外饰风格">
          <el-input
            placeholder="请输入"
            v-model="form.exteriorStyle"
            clearable
          />
        </el-form-item>
        <el-form-item label="内饰风格">
          <el-input
            placeholder="请输入"
            v-model="form.interiorStyle"
            clearable
          />
        </el-form-item>
        <el-form-item label="车辆年型(L)">
          <el-input
            placeholder="请输入"
            v-model="form.vehicleYearType"
            clearable
          />
        </el-form-item>
        <el-form-item label="选装包">
          <el-input
            placeholder="请输入"
            v-model="form.optionPackage"
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
import { getList } from '@/api/vehretail/orderManager/vrSpecialVehicle/index';
import { getTableConfig, exportTable } from '@/api/common';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  vin: '',
  materialsCode: '',
  modelName: '',
  seriesName: '',
  exteriorStyle: '',
  interiorStyle: '',
  vehicleYearType: '',
  optionPackage: ''
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable
  },
  data () {
    return {
      pageTitle: '整车零售-订单管理-特殊车辆清单管理',
      pageType: 'list',
      moduleKey: 'AISMC-vrSpecialVehicle',
      form: {
        ...defaultForm
      },
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      optionObj: {
        id: 'vrSpecialVehicleTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'vin', label: 'VIN', visible: true, width: 200, fixed: 'left' },
          { props: 'materialsCode', label: '整车物料码', visible: true, width: 180 },
          { props: 'materialsDesc', label: '整车物料描述', visible: true, width: 200 },
          { props: 'modelName', label: '整车车型', visible: true, width: 150 },
          { props: 'seriesName', label: '基本车系', visible: true, width: 150 },
          { props: 'exteriorStyle', label: '外饰风格', visible: true, width: 150 },
          { props: 'interiorStyle', label: '内饰风格', visible: true, width: 150 },
          { props: 'vehicleYearType', label: '车辆年型(L)', visible: true, width: 150 },
          { props: 'optionPackage', label: '选装包', visible: true, width: 150 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 }
        ],
        total: 0
      },
      sortColumns: []
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
        businessType: '整车零售-订单管理-特殊车辆清单管理',
        dataFetchPath: 'vehretail/web/orderManager/vrSpecialVehicle/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车零售-订单管理-特殊车辆清单管理.xlsx');
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
      data.sortColumns = this.sortColumns;
      return data;
    }
  }
};
</script>

<style lang="scss" scoped>
.m-vr-special-vehicle-list {
}
</style>
