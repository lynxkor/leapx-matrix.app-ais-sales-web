<template>
  <div class="page-common m-store-inventory-inbound-details-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="入库单号">
        <el-input placeholder="请输入" v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="VIN">
        <el-input placeholder="请输入" v-model="form.vin" clearable />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input placeholder="请输入" v-model="form.materialsCode" clearable />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="物料描述">
          <el-input placeholder="请输入" v-model="form.materialsDesc" clearable />
        </el-form-item>
        <el-form-item label="入库类型">
          <fetch-select :request="fetchOptions" enumCode="vehstock_move_type" v-model="form.moveTypeList"
            placeholder="请选择" clearable multiple filterable />
        </el-form-item>
        <el-form-item label="入库时间">
          <el-input placeholder="请输入" v-model="form.moveinDate" clearable />
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
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)"
        :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)"
        :disabled="selectionList.length === 0">批量停用</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page checkboxFixed centralized
        :option-obj="optionObj" :get-config="getConfig" :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange" @handleSelect="handleSelectionChange" @listSelect="handleListSelect">
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload :visible="uploadDialogVisible" :id="1" @close="handleUploadDialogClose" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehstock/store/storeInventoryInboundDetails/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  name: '',
  vin: '',
  materialsCode: '',
  materialsDesc: '',
  moveTypeList: [],
  moveinDate: '',
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
    Upload
  },
  data () {
    return {
      pageTitle: '门店库存入库明细',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-storeInventoryInboundDetails',
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
        id: 'storeInventoryInboundDetailsTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'name', label: '车辆入库单号', visible: true, width: 200 },
          { props: 'vin', label: 'VIN', visible: true, width: 200 },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 200 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'drivingRangeName', label: '续航里程', visible: true, width: 200 },
          { props: 'rangePowerName', label: '选配动力', visible: true, width: 200 },
          { props: 'exteriorName', label: '外观', visible: true, width: 200 },
          { props: 'interiorName', label: '内饰', visible: true, width: 200 },
          { props: 'modelName', label: '车型', visible: true, width: 200 },
          { props: 'wheelHubName', label: '选配轮毂', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店名称', visible: true, width: 200 },
          { props: 'dealerWarehouseName', label: '门店仓库名称', visible: true, width: 200 },
          { props: 'moveTypeLabel', label: '入库类型', visible: true, width: 200 },
          { props: 'moveinDate', label: '入库时间', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 200 },
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
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
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
        businessType: '门店库存入库明细',
        dataFetchPath: 'vehstock/web/store/storeInventoryInboundDetails/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店库存入库明细.xlsx');
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
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
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
.m-store-inventory-inbound-details-list {}
</style>
