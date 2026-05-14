<template>
  <div class="page-common m-vehicle-model-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
     <el-form-item label="系列名称">
      <fetch-select
        :options="vehicleModelList"
        v-model="form.modelLineIdList"
        placeholder="请选择"
        labelKey="name"
        valueKey="id"
        clearable
        multiple
        collapseTags
        filterable
      />
    </el-form-item>
    <el-form-item label="车系名称">
      <fetch-select
        v-model="form.seriesIdList"
        :remote-method="vehicleSeriesSearch"
        placeholder="请选择"
        labelKey="name"
        valueKey="id"
        clearable
        remote
        reserve-keyword
        multiple
        collapseTags
        filterable
      />
    </el-form-item>
    <el-form-item label="车型名称" v-if="visibleCount === 3 || show">
        <tag-input v-model="form.modelNameList" placeholder="请输入" />
      <!-- <fetch-select
        v-model="form.idSet"
        placeholder="请选择"
        labelKey="name"
        valueKey="id"
        clearable
        multiple
        collapseTags
        filterable
        remote
        reserve-keyword
        :remote-method="modelNameSearch"
      /> -->
    </el-form-item>
      <!-- <el-form-item label="年型名称">
        <fetch-select
          :request="fetchOptions"
          enumCode="xxx"
          v-model="form.yearTypeName"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item> -->

      <template v-if="show">

        <!-- <el-form-item label="备注">
          <el-input
            placeholder="请输入"
            v-model="form.remark"
            clearable
          />
        </el-form-item> -->
        <el-form-item label="状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="StatusEnum"
            v-model="form.statusIncludeList"
            placeholder="请选择"
            clearable
            multiple
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
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <!-- <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button> -->
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
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
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'vehicleModelImport'"
      @close="handleUploadDialogClose"
    />
    <!-- 审核记录 -->
    <!-- <audit-dialog ref="auditRef" @audit="auditFun" /> -->
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/datacenter/materials/vehicleModel/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, vehicleSeriesList, vehicleModelLineList, listVehicleModel } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
// import { handleBatchStatusChange, downloadExcel, batchAuditHandler } from '@/libs/utils';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
// import auditDialog from '@/libs/components/auditDialog';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  modelNameLike: '',
  modelNameList: [],
  modelLineIdList: [],
  statusIncludeList: ['1'],
  seriesIdList: [],
  idSet: [],
  modelName: '',
  yearTypeName: '',
  seriesName: '',
  modelLineName: '',
  remark: '',
  status: '',
  statusDesc: '',
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    // auditDialog,
    TagInput,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    Upload
  },
  data () {
    return {
      pageTitle: '车型',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISDC-vehicleModel',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      optionObj: {
        id: 'vehicleModelTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'modelName',
            label: '车型名称',
            visible: true,
            width: 220,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/materials/vehicleModel/edit',
                  query: {
                    id: row.id,
                    isEditing: false
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'yearTypeName', label: '年款名称', visible: true, width: 120, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleYearType/edit?id=${row.yearTypeId}`, '_blank'); }, type: 'primary' }] },
          { props: 'modelLineName', label: '系列名称', visible: true, width: 140, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleModelLine/edit?id=${row.modelLineId}`, '_blank'); }, type: 'primary' }] },
          { props: 'seriesName', label: '车系名称', visible: true, width: 140, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleSeries/edit?id=${row.seriesId}`, '_blank'); }, type: 'primary' }] },
          { props: 'remark', label: '备注', visible: true, width: 300 },
          { props: 'statusLabel', label: '状态', visible: true, width: 60 },
          { props: 'statusDesc', label: '说明', visible: true, width: 300 },
          { props: 'creatorName', label: '创建人', visible: true, width: 180 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 },
          { props: 'modifierName', label: '更改人', visible: true, width: 180 },
          { props: 'updateTime', label: '更改时间', visible: true, width: 180 },
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
                  path: '/datacenter/materials/vehicleModel/edit',
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
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      vehicleModelList: [],
      vehicleSeriesIdList: [],
      listVehicleModelList: []
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
    this.getVehicleModelLineList();
  },
  methods: {
    modelNameSearch (query) {
      return listVehicleModel({ modelNameLike: query, size: 100 });
    },
    vehicleSeriesSearch (query) {
      return vehicleSeriesList({ seriesNameLike: query, size: 100 });
    },
    // modelLineIdChange (query) {
    //   if (query && query.length) {
    //     let params = {
    //       modelLineIds: query,
    //       size: 100
    //     };
    //     vehicleSeriesList(params).then(res => {
    //       this.vehicleSeriesIdList = res;
    //     }).catch(() => {});
    //   } else {
    //     this.form.seriesIdList = [];
    //     this.vehicleSeriesIdList = [];
    //   }
    // },
    seriesIdChange (val) {
      if (val && val.length) {
        let params = {
          seriesIdList: val,
          size: 100
        };
        listVehicleModel(params).then(res => {
          this.listVehicleModelList = res;
        }).catch(() => {});
      } else {
        this.form.idSet = [];
        this.listVehicleModelList = [];
      }
    },
    async remoteMethod (query, api, targetKey) {
      try {
        let apiResult = {};
        if (targetKey === 'vehicleModelList') {
          apiResult.modelLineNameLike = query;
        } else if (targetKey === 'vehicleSeriesIdList') {
          apiResult.seriesNameLike = query;
          apiResult.modelLineIds = this.form.modelLineIdList;
        } else if (targetKey === 'listVehicleModelList') {
          apiResult.modelNameLike = query;
          apiResult.modelLineIdList = this.form.modelLineIdList;
          apiResult.seriesIdList = this.form.seriesIdList;
        }
        const res = await api({ size: 100, ...apiResult });
        // 映射新数据
        if (res && Array.isArray(res)) {
          this[targetKey] = res.map(item => ({
            ...item,
            label: item.name || item.label,
            value: item.id || item.value
          }));
        }
        return this[targetKey];
      } catch (error) {
        return [];
      }
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/datacenter/materials/vehicleModel/edit'
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
        businessType: '新页面',
        dataFetchPath: '/datacenter/web/materials/vehicleModel/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res) {
          if (res.excelUrl) {
            try {
              await downloadExcel(res.excelUrl, '配置主数据-车型.xlsx');
            } catch (error) {
              this.$message({
                type: 'error',
                message: '文件导出失败'
              });
            }
          } else {
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
      // this.getVehicleModelLineList();

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
      if (Array.isArray(this.form.modelNameList) && this.form.modelNameList.length <= 1) {
        delete data.modelNameList;
        data.modelNameLike = this.form.modelNameList[0] || '';
      }

      return data;
    },
    async getVehicleModelLineList (val) {
      const res = await vehicleModelLineList({ size: 1000 });
      if (res.length) {
        const data = res;
        this.vehicleModelList = data;
      }
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
      }).catch(() => {});
    },
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData,
        options: {
          statusName: 'status',
          requireInput: true
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-vehicle-model-list {
}
</style>
