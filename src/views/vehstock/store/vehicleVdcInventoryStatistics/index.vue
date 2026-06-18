<template>
  <div class="page-common m-vehicle-vdc-inventory-statistics-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="物料描述">
        <tag-input v-model="form.materialsDescSet" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="车系" v-show="this.visibleCount === 3 || show">
        <fetch-select
            v-model="form.seriesIds"
            v-bind="selectOptions"
            :remote-method="remoteMethods.series"
          />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="车型">
          <fetch-select
            v-model="form.modelIds"
            v-bind="selectOptions"
            :remote-method="remoteMethods.model"
          />
        </el-form-item>
        <el-form-item label="年款">
          <fetch-select
            v-model="form.yearTypeIds"
            v-bind="selectOptions"
            :remote-method="remoteMethods.yearType"
          />
        </el-form-item>
        <el-form-item label="外观">
          <fetch-select
            v-model="form.exteriorIds"
            v-bind="selectOptions"
            :remote-method="remoteMethods.exterior"
          />
        </el-form-item>
        <el-form-item label="内饰">
          <fetch-select
            v-model="form.interiorIds"
            v-bind="selectOptions"
            :remote-method="remoteMethods.interior"
          />
        </el-form-item>
        <el-form-item label="选配轮毂">
          <fetch-select
            v-model="form.wheelHubIds"
            v-bind="selectOptions"
            :remote-method="remoteMethods.wheel"
          />
        </el-form-item>
        <el-form-item label="选装包">
          <fetch-select
            v-model="form.optionPackageIds"
            v-bind="selectOptions"
            :remote-method="remoteMethods.optional"
          />
        </el-form-item>
        <el-form-item label="仓库">
          <fetch-select
            v-model="form.warehouseCodeSet"
            filterable
            clearable
            remote
            multiple
            reserve-keyword
            :options="warehouseOptions"
            placeholder="请选择"
            :remote-method="serchWarehouse"
            value-key="value"
            label-key="label"
          />
        </el-form-item>
      </template>
      <page-search-action v-model="show" is-expandable :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox checkboxFixed centralized
        :option-obj="optionObj" :get-config="getConfig" :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange" @handleSelect="handleSelectionChange" @listSelect="handleListSelect"
        @sortChange="handleSortChange">
        <EditPage slot="centralizedViewSlot" :id="clickItemId" />
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload :visible="uploadDialogVisible" :id="'1'" @close="handleUploadDialogClose" @getData="getData" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehstock/store/vehicleVdcInventoryStatistics/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listVehicleModel, page, vehicleSeriesList, listVehicleYearType, vehicleExterior, vehicleInterior, vehicleWheelHub, vehicleOptionPackage } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  materialsDescList: [],
  materialsCodeList: [],
  seriesIdList: [],
  modelIds: [],
  yearTypeIds: [],
  exteriorIds: [],
  interiorIds: [],
  wheelHubIds: [],
  optionPackageIds: [],
  warehouseCodeSet: []
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
    Upload,
    TagInput
  },
  data () {
    return {
      pageTitle: '整车库存存量统计',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVS-vehicleVdcInventoryStatistics',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      warehouseOptions: [], // 整车仓库
      clickItemId: '',
      optionObj: {
        id: 'vehicleVdcInventoryStatisticsTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'modelName', label: '车型', visible: true, width: 160 },
          { props: 'warehouseName', label: '整车仓库', visible: true, width: 200 },
          { props: 'inventoryResourceLabel', label: '库存资源', visible: true, width: 140 },
          { props: 'productionInProgressResourceLabel', label: '生产中资源', visible: true, width: 140 },
          { props: 'productionScheduledResourceLabel', label: '排产资源', visible: true, width: 120 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'optionPackageName', label: '选配包', visible: true, width: 100 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: []
          }
        ],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ],
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      // 远程搜索方法
      remoteMethods: {
        series: async (query) => {
          return await vehicleSeriesList({ seriesNameLike: query });
        },
        // model: async (query) => {
        //   return await listVehicleModel({ modelNameLike: query });
        // },
        // 初始方法
        model: async (query) => {
          return await this.searchModel(query);
        },
        yearType: async (query) => {
          return await listVehicleYearType({ yearTypeNameLike: query });
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
        }
      }
    };
  },
  watch: {
    'form.seriesIdList': {
      handler (newVal) {
        // 车系变化时清空车型选择
        this.form.modelIdList = [];
        this.searchModel();
      },
      deep: true,
      immediate: true
    },
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    // 车型支持车系 ID 和 车型输入 方法
    async searchModel (query) {
      const params = {};

      if (query) {
        params.modelNameLike = query;
      }

      if (this.form.seriesIdList?.length) {
        params.seriesIds = this.form.seriesIdList;
      }

      return await listVehicleModel(params);
    },
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
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
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
        businessType: '整车库存存量统计',
        dataFetchPath: 'vehstock/web/store/vehicleVdcInventoryStatistics/export',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车库存存量统计.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirm(
            '正在导入中，是否要跳转"系统管理-文件管理-导入任务"中查看？',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            window.open('/service/excelManagement/commonDataProcessExcelImportTask', '_blank');
          }).catch(() => {});
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
          this.optionObj.dataList = res.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          // this.optionObj.dataList = [];
          // this.optionObj.total = 0;
          this.loading = false;
        }).catch(() => {
          this.optionObj.dataList = [];
          this.optionObj.total = 0;
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
        if (data[key] === '' || data[key] === null || data[key] === undefined || data[key].length === 0) {
          delete data[key];
        }
      });
      if (Array.isArray(this.form.materialsDescSet) && this.form.materialsDescSet.length <= 1) {
        delete data.materialsDescSet;
        data.materialsDescLike = this.form.materialsDescSet[0] || '';
      }
      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
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
    // 搜索仓库
    async serchWarehouse (query) {
      const res = await page({ warehouseName: query, page: 1, size: 100, status: 0, warehouseType: 20 });
      this.warehouseOptions = res?.records?.map(item => {
        return {
          label: item.warehouseName,
          value: item.warehouseCode,
        };
      });
      // 在数组最前面新增 "厂端VDC" 选项
      this.warehouseOptions.unshift({
        label: '厂端VDC',
        value: 'VDC'
      });
    },
    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">此操作将永久删除, 是否继续</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        deleteItem(ids).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        });
      }).catch(() => { });
    },
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-vehicle-vdc-inventory-statistics-list {}
</style>
