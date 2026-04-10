<template>
  <div class="page-common m-vehicle-purpose-change-apply-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="VIN">
        <tag-input v-model="form.vinList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="申请单号">
        <el-input placeholder="请输入" v-model="form.applyNo" clearable />
      </el-form-item>
      <el-form-item label="申请门店" v-show="this.visibleCount === 3 || show">
        <fetch-select :remote-method="getDealerListByName" remote v-model="form.dealerCodeList" placeholder="请输入门店编码或名称"
          labelKey="storeName" valueKey="storeCode" subLabelKey="storeCode" clearable filterable multiple
          collapse-tags />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="用途变更类型">
          <fetch-select :request="fetchOptions" enumCode="vehstock_change_type" v-model="form.changeType"
            placeholder="请选择" clearable filterable />
        </el-form-item>
        <el-form-item label="申请状态">
          <fetch-select :request="fetchOptions" enumCode="vehstock_purpose_change_apply_type"
            v-model="form.applyStatusList" placeholder="请选择" clearable multiple filterable />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="form.createTime" type="daterange" :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="车型">
          <fetch-select v-model="form.modelIdList" remote placeholder="请输入" labelKey="name" valueKey="id" clearable
            filterable multiple collapse-tags :remote-method="getModelListByName" />
        </el-form-item>
      </template>
      <page-search-action v-if="canList" v-model="show" is-expandable :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i
          class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <!-- <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete"
        :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)"
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
    <Upload :visible="uploadDialogVisible" :id="'1'" @close="handleUploadDialogClose" @getData="getData" />
    <!-- 审批弹窗 -->
    <ApprovalDialog ref="approvalDialog" :visible.sync="approvalDialogVisible" :approvalId="approvalId"
      :name="approvalName" @close="handleApprovalDialogClose" @submit="getData" />
    <!-- 审核记录抽屉 -->
    <review-drawer ref="reviewDrawer" :visible.sync="reviewDrawerVisible" :drawerData="reviewData"
      @update:visible="val => reviewDrawerVisible = val" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, enableItemSubmit, enableItemCancel } from '@/api/vehstock/store/vehiclePurposeChangeApply/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listVehicleModel } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, getEndOfDayString, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import { listOrgStoreInfo } from '@/libs/api/common';
import TagInput from '@/libs/components/TagInput';
import ApprovalDialog from './ApprovalDialog.vue';
import ReviewDrawer from './ReviewDrawer.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  applyNo: '',
  dealerCode: '',
  applyStatusList: [],
  vin: '',
  vinList: [],
  modelId: '',
  changeType: '',
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
    TagInput,
    ApprovalDialog,
    ReviewDrawer
  },
  data () {
    return {
      pageTitle: '车辆用途变更申请',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-vehiclePurposeChangeApply',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      approvalDialogVisible: false, // 审批弹窗
      approvalName: '', // 弹窗标题
      approvalId: '', // 审批id
      reviewDrawerVisible: false, // 审核记录抽屉
      reviewData: {}, // 审核记录数据
      clickItemId: '',
      optionObj: {
        id: 'vehiclePurposeChangeApplyTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'applyNo',
            label: '申请单号',
            visible: false,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/store/vehiclePurposeChangeApply/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'applyNo', label: '申请单号', visible: true, width: 200 },
          { props: 'dealerName', label: '申请门店名称', visible: true, width: 200 },
          { props: 'applyStatusLabel', label: '申请状态', visible: true, width: 120 },
          { props: 'vin', label: '门店库存台账', visible: true, width: 200 },
          { props: 'modelName', label: '车型', visible: true, width: 200 },
          { props: 'changeTypeLabel', label: '用途变更类型', visible: true, width: 140 },
          { props: 'originalOrderType', label: '原批售订单分类', visible: true, width: 150 },
          { props: 'originalReservedLabel', label: '原是否预留', visible: true, width: 130 },
          { props: 'originalReservedType', label: '原预留类型', visible: true, width: 160 },
          { props: 'changedReservedLabel', label: '变更后是否预留', visible: true, width: 140 },
          { props: 'changedReservedType', label: '变更后预留类型', visible: true, width: 140 },
          { props: 'stockInTime', label: '入库时间', visible: true, width: 200 },
          { props: 'applyDesc', label: '申请说明', visible: true, width: 200 },
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
            buttons: [{
              name: '提交',
              popconfirmTitle: '确认提交用途变更申请吗?',
              show: (row) => {
                return (row.applyStatus === 1 || row.applyStatus === 6) && this.permissions.has(`${this.moduleKey}-submit`);
              },
              click: (rowIndex, row) => {
                enableItemSubmit(row.id).then(res => {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.getData();
                });
              },
              type: 'info'
            }, {
              name: '作废',
              popconfirmTitle: '确认作废单据吗?',
              show: (row) => {
                return (row.applyStatus === 1 || row.applyStatus === 6) && this.permissions.has(`${this.moduleKey}-cancel`);
              },
              click: (rowIndex, row) => {
                enableItemCancel(row.id).then(res => {
                  this.$message({
                    message: '作废成功',
                    type: 'success'
                  });
                  this.getData();
                });
              },
              type: 'info'
            }, {
              name: '零售经理审',
              show: (row) => {
                return row.applyStatus === 2 && this.permissions.has(`${this.moduleKey}-approveByRetailManager`);
              },
              click: (rowIndex, row) => {
                this.handleApprove(row, 'retail');
              },
              type: 'info'
            }, {
              name: '大区总审',
              show: (row) => {
                return row.applyStatus === 3 && this.permissions.has(`${this.moduleKey}-approveByAreaManager`);
              },
              click: (rowIndex, row) => {
                this.handleApprove(row, 'region');
              },
              type: 'info'
            }, {
              name: '总部审',
              show: (row) => {
                return row.applyStatus === 4 && this.permissions.has(`${this.moduleKey}-approveByHeadquarters`);
              },
              click: (rowIndex, row) => {
                this.handleApprove(row, 'headquarters');
              },
              type: 'info'
            }, {
              name: '审核记录',
              click: (rowIndex, row) => {
                this.handleReview(row);
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
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
        path: '/vehstock/store/vehiclePurposeChangeApply/edit'
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
        businessType: '车辆用途变更申请',
        dataFetchPath: 'vehstock/web/store/vehiclePurposeChangeApply/statistics',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '车辆用途变更申请.xlsx');
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
          data.createTimeEnd = getEndOfDayString(this.form.createTime[1]);
        }
      }
      if (Array.isArray(this.form.vinList) && this.form.vinList.length <= 1) {
        delete data.vinList;
        data.vinLike = this.form.vinList[0] || '';
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
    },
    // 查询门店编码或名称
    async getDealerListByName (params) {
      return listOrgStoreInfo({ keyword: params });
    },
    // 查询车型名称
    async getModelListByName (params) {
      return listVehicleModel({ modelNameLike: params });
    },
    // 审批弹窗
    handleApprove (row, type) {
      this.approvalId = row.id;
      this.approvalName = type;
      this.approvalDialogVisible = true;
    },
    handleApprovalDialogClose () {
      this.approvalDialogVisible = false;
    },
    // 审核记录
    handleReview (row) {
      this.reviewData = row;
      this.reviewDrawerVisible = true;
    },
  }
};
</script>

<style lang="scss" scoped>
.m-vehicle-purpose-change-apply-list {}
</style>
