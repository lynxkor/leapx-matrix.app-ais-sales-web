<template>
  <div class="page-common m-eop-material-demand-total-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="物料编码">
        <tag-input v-model="form.materialsCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="物料描述">
        <el-input placeholder="请输入" v-model="form.materialsDesc" clearable />
      </el-form-item>
      <el-form-item label="入库统计开始日期" v-show="this.visibleCount === 3 || show">
        <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.stockStatStartDate"
            type="daterange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="创建时间">
          <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.createTime" type="daterange"
            :picker-options="pickerOptions" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="状态">
          <fetch-select :request="fetchOptions" enumCode="StatusEnum" v-model="form.status" placeholder="请选择" clearable
            multiple filterable />
        </el-form-item>
        <el-form-item label="车系">
          <fetch-select
            v-model="form.seriesIdList"
            v-bind="selectOptions"
            :remote-method="remoteMethods.series"
          />
        </el-form-item>
        <el-form-item label="车型">
          <fetch-select
            v-model="form.modelIdList"
            v-bind="selectOptions"
            :remote-method="remoteMethods.model"
          />
        </el-form-item>
        <el-form-item label="年款">
          <fetch-select
            v-model="form.yearTypeIdList"
            v-bind="selectOptions"
            :remote-method="remoteMethods.yearType"
          />
        </el-form-item>
      </template>
      <page-search-action v-if="canList" v-model="show" is-expandable :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <!-- <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button> -->
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)"
        :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)"
        :disabled="selectionList.length === 0">批量停用</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page checkboxFixed centralized
        :option-obj="optionObj" :get-config="getConfig" :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange" @handleSelect="handleSelectionChange" @listSelect="handleListSelect"
        @sortChange="handleSortChange">
        <EditPage slot="centralizedViewSlot" :id="clickItemId" />
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload :visible="uploadDialogVisible" :id="'eopMaterialDemandTotalImport'" @close="handleUploadDialogClose" @getData="getData" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehstock/store/eopMaterialDemandTotal/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, vehicleSeriesList, listVehicleModel, listVehicleYearType } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  createTime: '',
  status: '',
  materialsCode: '',
  materialsDesc: '',
  stockStatStartDate: '',
  seriesId: '',
  modelId: '',
  seriesIdList: [],
  modelIdList: [],
  yearTypeIdList: [],
  yearTypeId: '',
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
    EditPage,
    Upload,
    TagInput
  },
  data () {
    return {
      pageTitle: 'EOP物料需求总量',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-eopMaterialDemandTotal',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'eopMaterialDemandTotalTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'eopDemandNo',
            label: 'EOP需求单号',
            visible: true,
            width: 200,
            fixed: 'left',
            // buttons: [{
            //   click: (rowIndex, row) => {
            //     this.$router.push({
            //       path: '/vehstock/store/eopMaterialDemandTotal/edit',
            //       query: {
            //         id: row.id
            //       }
            //     });
            //   },
            //   type: 'primary'
            // }]
          },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 200 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'stockStatStartDate', label: '入库统计开始日期', visible: true, width: 200 },
          { props: 'eopDemandTotal', label: 'EOP需求总量', visible: true, width: 140, align: 'right' },
          { props: 'eopStockedTotal', label: 'EOP累计入库数量', visible: true, width: 160, align: 'right' },
          { props: 'inProductionQty', label: '生产中数量', visible: true, width: 120, align: 'right' },
          { props: 'plannedProductionQty', label: '计划排产数量', visible: true, width: 140, align: 'right' },
          { props: 'availableStockQty', label: '可用库存数量', visible: true, width: 140, align: 'right' },
          { props: 'unmatchedVehicleQty', label: '未配车数量', visible: true, width: 140, align: 'right' },
          { props: 'statusLabel', label: '状态', visible: true, width: 78 },
          { props: 'seriesName', label: '车系', visible: true, width: 100 },
          { props: 'modelName', label: '车型', visible: true, width: 160 },
          { props: 'yearTypeName', label: '年款', visible: true, width: 100 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 160 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 160 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
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
    handleAdd () {
      this.$router.push({
        path: '/vehstock/store/eopMaterialDemandTotal/edit'
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
        businessType: 'EOP物料需求总量',
        dataFetchPath: 'vehstock/web/store/eopMaterialDemandTotal/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, 'EOP物料需求总量.xlsx');
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

      if (this.form.stockStatStartDate) {
        delete data.stockStatStartDate;
        if (this.form.stockStatStartDate.length > 1) {
          data.stockStatStartDateStart = this.form.stockStatStartDate[0];
          data.stockStatStartDateEnd = this.form.stockStatStartDate[1];
        }
      }

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }

      if (Array.isArray(this.form.materialsCodeList) && this.form.materialsCodeList.length <= 1) {
        delete data.materialsCodeList;
        data.materialsCodeLike = this.form.materialsCodeList[0] || '';
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
.m-eop-material-demand-total-list {}
</style>
