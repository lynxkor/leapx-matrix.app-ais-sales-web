<template>
  <div class="page-common m-store-vehicle-pdi-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="VIN">
        <tag-input placeholder="请输入" v-model="form.vinList" clearable />
      </el-form-item>
      <el-form-item label="PDI单号">
        <tag-input placeholder="请输入" v-model="form.codeList" clearable />
      </el-form-item>
      <el-form-item label="PDI类型" v-if="this.visibleCount === 3 || show">
        <fetch-select :request="fetchOptions" enumCode="vehstock_veh_pdi_type" v-model="form.vehPdiType"
          placeholder="请选择" clearable filterable />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="PDI是否完成提交">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.isPdiSubmit"
          placeholder="请选择" clearable filterable />
        </el-form-item>
        <el-form-item label="车辆是否存在异常">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.isUnusual"
          placeholder="请选择" clearable filterable />
        </el-form-item>
        <el-form-item label="车辆异常是否修复">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.isRepaired"
          placeholder="请选择" clearable filterable />
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
        <el-form-item label="销售门店">
          <fetch-select
            filterable
            clearable
            remote
            collapseTags
            v-model="form.saleDealerCode"
            :remote-method="getDealerListByName"
            value-key="storeCode"
            label-key="storeName"
          />
        </el-form-item>
        <el-form-item label="交付门店">
          <fetch-select
            filterable
            clearable
            remote
            collapseTags
            v-model="form.deliveryDealerCode"
            :remote-method="getDealerListBy"
            value-key="storeCode"
            label-key="storeName"
          />
        </el-form-item>
        <el-form-item label="PDI提交人">
          <fetch-select
            remote
            filterable
            clearable
            :remote-method="getPdiUser"
            v-model="form.pdiSubmitById"
            value-key="userId"
            label-key="username"
          />
        </el-form-item>
        <el-form-item label="PDI提交时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
              v-model="form.pdiSubmitTime"
              type="daterange"
              unlink-panels
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
        </el-form-item>
      </template>
      <page-search-action v-if="canList" v-model="show" is-expandable :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete"
        :disabled="selectionList.length === 0">批量删除</el-button>
      <!-- <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)"
        :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)"
        :disabled="selectionList.length === 0">批量停用</el-button> -->
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
    <Upload :visible="uploadDialogVisible" :id="'1'" @close="handleUploadDialogClose" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehstock/store/storeVehiclePdi/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, vehicleSeriesList, listVehicleModel, listVehicleYearType, listOrgStoreInfo, getUserByNameOrNo } from '@/api/common';
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
  codeList: [],
  vinList: [],
  vehPdiType: '',
  isPdiSubmit: '',
  isUnusual: '',
  isRepaired: '',
  seriesId: '',
  modelId: '',
  yearTypeId: '',
  saleDealerCode: '',
  deliveryDealerCode: '',
  pdiSubmitById: '',
  pdiSubmitOn: '',
  pdiSubmitTime: [],
};

// 默认排序：创建时间倒序。data() 和 onReset 复用同一份常量，避免两份硬编码不一致。
const DEFAULT_SORT_COLUMNS = [
  { column: 'create_time', sort: 'DESC' }
];

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
      pageTitle: '门店整车PDI单',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVS-storeVehiclePdi',
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
        id: 'storeVehiclePdiTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: 'PDI单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/store/storeVehiclePdi/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'vin', label: 'VIN', visible: true, width: 180 },
          { props: 'vehPdiTypeLabel', label: 'PDI类型', visible: true, width: 120 },
          { props: 'isPdiSubmitLabel', label: 'PDI是否完成提交', visible: true, width: 160 },
          { props: 'isUnusualLabel', label: '车辆是否存在异常', visible: true, width: 160 },
          { props: 'isRepairedLabel', label: '车辆异常是否修复', visible: true, width: 160 },
          { props: 'lockStatusLabel', label: '是否匹配订单', visible: true, width: 140 },
          { props: 'seriesName', label: '车系', visible: true, width: 100 },
          { props: 'modelName', label: '车型', visible: true, width: 120 },
          { props: 'yearTypeName', label: '年款', visible: true, width: 80 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 160 },
          { props: 'saleDealerName', label: '销售门店名称', visible: true, width: 200 },
          { props: 'deliveryDealerName', label: '交付门店名称', visible: true, width: 200 },
          { props: 'pdiSubmitBy', label: 'PDI提交人', visible: true, width: 160 },
          { props: 'pdiSubmitOn', label: 'PDI提交时间', visible: true, width: 200, sortable: true },
          { props: 'repairedBy', label: '异常修复确认人', visible: true, width: 160 },
          { props: 'repairedOn', label: '异常修复确认时间', visible: true, width: 200, sortable: true },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 160 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200, sortable: true },
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
      sortColumns: [...DEFAULT_SORT_COLUMNS],
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
        model: async (query) => {
          return await this.searchModel(query);
        },
        yearType: async (query) => {
          return await listVehicleYearType({ yearTypeNameLike: query });
        },
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleSortChange (value) {
      const list = value || [];
      if (!list.length) {
        this.sortColumns = [];
        this.getData();
        return;
      }
      const latest = list.reduce((acc, cur) => (cur.sortTime || 0) > (acc.sortTime || 0) ? cur : acc);
      const def = this.optionObj.dataProp.find(item => item.props === latest.field) || {};
      this.sortColumns = [{
        column: def.sortField || (latest.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
        sort: (latest.order || '').toUpperCase()
      }];
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
        path: '/vehstock/store/storeVehiclePdi/edit'
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
      this.sortColumns = [...DEFAULT_SORT_COLUMNS];
      this.getData();
    },
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
    // 销售门店搜索
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isSales: true });
    },
    // 交付门店搜索
    async getDealerListBy (params) {
      return listOrgStoreInfo({ storeName: params, isSupportDeliver: true });
    },
    async getPdiUser (params) {
      return getUserByNameOrNo({ name: params });
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '门店整车PDI单',
        dataFetchPath: 'vehstock/web/store/storeVehiclePdi/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店整车PDI单.xlsx');
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
      this.form.pdiSubmitOnStart = this.form.pdiSubmitTime ? this.form.pdiSubmitTime[0] : '';
      this.form.pdiSubmitOnEnd = this.form.pdiSubmitTime ? this.form.pdiSubmitTime[1] : '';
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

      if (Array.isArray(this.form.vinList) && this.form.vinList.length <= 1) {
        delete data.vinList;
        data.vinLike = this.form.vinList[0] || '';
      }
      if (Array.isArray(this.form.codeList) && this.form.codeList.length <= 1) {
        delete data.codeList;
        data.codeLike = this.form.codeList[0] || '';
      }

      if (this.form.saleDealerCode) { // // 销售门店增加这两个参数
        data.buildStoreType = ['16', '17', '15', '3'];
        data.isSales = true;
      }
      if (this.form.deliveryDealerCode) { // 交付门店增加这两个参数
        data.buildStoreType = ['16', '17', '15', '3', '13', '8'];
        data.isSupportDeliver = true;
      }
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
      // const ids = this.selectionList.map(item => item.id) || [];
      // this.$confirm(`此操作将${status ? '启用' : '停用'}选中项，是否继续?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   enableItem({
      //     idSet: ids,
      //     status
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '操作成功!'
      //     });
      //     this.getData();
      //   }).catch(() => {
      //     this.$message({
      //       type: 'error',
      //       message: '操作失败!'
      //     });
      //   });
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-store-vehicle-pdi-list {}
</style>
