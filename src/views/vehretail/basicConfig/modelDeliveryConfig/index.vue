<template>
  <div class="page-common m-model-delivery-config-list">
    <!-- TIPS: Adjust label-width as needed to prevent wrapping -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="城市">
        <fetch-select
          filterable
          clearable
          remote
          v-model="form.cityName"
          :remote-method="getCityList"
          value-key="areaCode"
          label-key="areaName"
        />
      </el-form-item>
      <el-form-item label="车型名称">
        <fetch-select
          :remote-method="remoteMethods.model"
          v-model="form.modelId"
          placeholder="请选择"
          clearable
          label-key="name"
          value-key="id"
          filterable
          remote
        />
      </el-form-item>
      <el-form-item label="是否开启交付">
        <fetch-select
          :request="fetchOptions"
          enum-code="BooleanEnum"
          v-model="form.openDeliveryStatus"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="年款名称">
          <fetch-select
            :remote-method="listVehicleYearType"
            remote
            v-model="form.yearTypeId"
            placeholder="请选择"
            label-key="name"
            value-key="id"
            clearable
            collapse-tags
            filterable
            :options="yearTypeList"
          />
        </el-form-item>
        <el-form-item label="状态">
          <fetch-select
            :request="fetchOptions"
            enum-code="StatusEnum"
            v-model="form.status"
            placeholder="请选择"
            clearable
            filterable
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
      <!-- TIPS: Add/remove action buttons as per product requirements -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd">
        <i class="iconfont icon-lxppc-plus"></i> 新增
      </el-button>
      <el-button
        v-if="canEnableOrDisable"
        size="small"
        @click="handleBatchEnable(1)"
        :disabled="selectionList.length === 0"
      >
        批量启用
      </el-button>
      <el-button
        v-if="canEnableOrDisable"
        size="small"
        @click="handleBatchEnable(0)"
        :disabled="selectionList.length === 0"
      >
        批量停用
      </el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">
        导出
      </el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkbox-fixed
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @pagination-change="paginationChange"
        @handle-select="handleSelectionChange"
        @list-select="handleListSelect"
        @sort-change="handleSortChange"
      >
        <EditPage slot="centralized-view-slot" :id="clickItemId" />
      </LPVxeTable>
    </div>
    <!-- TIPS: Fill in project ID here -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
      @get-data="getData"
    />
  </div>
</template>
<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import {
  getList,
  deleteItem,
  enableItem,
} from '@/api/vehretail/basicConfig/modelDeliveryConfig/index';
import {
  getTableConfig,
  tableAddOrUpdate,
  exportTable,
  getEnum,
  cityListByName,
  listVehicleModel,
  listVehicleYearType,
} from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  createTime: '',
  status: '',
  cityName: '',
  modelName: '',
  yearTypeName: '',
  openDeliveryStatus: '',
};

const pageSize = 20;
const mockConfig = {
  data: null,
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload,
  },
  data () {
    return {
      remoteMethods: {
        model: async (query) => {
          return await listVehicleModel({ modelNameLike: query });
        },
      },
      pageTitle: '车型交付配置管理',
      pageType: 'list',
      moduleKey: 'AISVR-modelDeliveryConfig',
      form: {
        ...defaultForm,
      },
      selectionList: [],
      yearTypeList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'modelDeliveryConfigTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize,
        },
        dataProp: [
          {
            props: 'id',
            label: '主键',
            visible: false,
            width: 200,
            fixed: 'left',
            buttons: [
              {
                click: (rowIndex, row) => {
                  this.$router.push({
                    path: '/vehretail/basicConfig/modelDeliveryConfig/edit',
                    query: {
                      id: row.id,
                    },
                  });
                },
                type: 'primary',
              },
            ],
          },
          { props: 'cityName', label: '城市', visible: true, width: 200 },
          { props: 'modelName', label: '车型名称', visible: true, width: 200 },
          { props: 'yearTypeName', label: '年款名称', visible: true, width: 200 },
          { props: 'openDeliveryStatusLabel', label: '是否开启交付', visible: true, width: 200 },
          { props: 'openDeliveryDate', label: '开启交付日期', visible: true, width: 200 },
          { props: 'noOpenDeliveryText', label: '未开启交付文案', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'statusLabel', label: '状态', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [
              {
                name: '编辑',
                click: (rowIndex, row) => {
                  this.$router.push({
                    path: '/vehretail/basicConfig/modelDeliveryConfig/edit',
                    query: {
                      id: row.id,
                      isEditing: true,
                    },
                  });
                },
                type: 'info',
              },
            ],
          },
        ],
        total: 0,
      },
      sortColumns: [],
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    async listVehicleYearType (query) {
      try {
        const res = await listVehicleYearType({ yearTypeNameLike: query });
        this.yearTypeList = res;
        return res;
      } catch (error) {
        console.error('Error fetching model list:', error);
      }
    },
    async getCityList (params) {
      return cityListByName({ cityName: params });
    },
    handleSortChange (value) {
      this.sortColumns = (value || []).map((item) => ({
        column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
        sort: (item.order || '').toUpperCase(),
      }));
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
        path: '/vehretail/basicConfig/modelDeliveryConfig/edit',
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
        const ids = this.selectionList.map((item) => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '车型交付配置管理',
        dataFetchPath: 'vr/web/model/modelDeliveryConfig/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST',
      })
        .then(async (res) => {
          if (res && res.excelUrl) {
            try {
              await downloadExcel(res.excelUrl, '车型交付配置管理.xlsx');
            } catch (error) {
              this.$message({
                type: 'error',
                message: '文件导出失败',
              });
            }
          } else {
            this.$message({
              type: 'info',
              message: '请前往导出列表中查询导出结果',
            });
          }
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({
        ...this.getFormData(),
        pageNum: this.optionObj.form.page,
        pageSize: this.optionObj.form.size,
      })
        .then((res) => {
          console.log(res);
          this.optionObj.dataList = res.records.map((item) => ({
            ...item,
            deleteLoading: false,
          }));
          this.optionObj.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id)
          .then((data) => {
            resolve({ data });
          })
          .catch((err) => {
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
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach((key) => {
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
      data.sortColumns = this.sortColumns;
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleBatchDelete () {
      const ids = this.selectionList.map((item) => item.id) || [];
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteItem(ids)
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.getData();
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败!',
              });
            });
        })
        .catch(() => {});
    },
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.m-model-delivery-config-list {
}
</style>
