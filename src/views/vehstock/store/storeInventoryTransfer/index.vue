<template>
  <div class="page-common m-store-inventory-transfer-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="VIN">
        <tag-input v-model="form.vinList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="目标门店编码">
        <fetch-select :remote-method="getDealerListByName" remote v-model="form.targetDealerCodeList"
          placeholder="请输入门店编码或名称" labelKey="storeName" valueKey="storeCode" subLabelKey="storeCode" clearable multiple
          collapseTags filterable />
      </el-form-item>
      <el-form-item label="单据状态">
        <fetch-select :request="fetchOptions" enumCode="vehstock_transfer_audit_status" v-model="form.auditStatusList"
          placeholder="请选择" clearable multiple filterable />
      </el-form-item>
      <template v-if="show">
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
    <!-- 调拨审批弹窗 -->
    <approval-dialog ref="approvalDialog" :visible.sync="approvalVisible" :data="approvalData"
      @update:visible="val => approvalVisible = val" @submit="getData" />
    <!-- 审核记录抽屉 -->
    <review-drawer ref="reviewDrawer" :visible.sync="reviewDrawerVisible" :drawerData="reviewData"
      @update:visible="val => reviewDrawerVisible = val" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, storeSubmit, storeInvalid } from '@/api/vehstock/store/storeInventoryTransfer/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import ApprovalDialog from './ApprovalDialog.vue';
import ReviewDrawer from './ReviewDrawer.vue';
import { listOrgStoreInfo } from '@/libs/api/common';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  vinList: [],
  targetDealerCode: '',
  auditStatus: '',
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
    ApprovalDialog,
    ReviewDrawer,
    TagInput
  },
  data () {
    return {
      pageTitle: '门店库存调拨',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-storeInventoryTransfer',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      approvalVisible: false, // 调拨审批弹窗
      approvalData: {},
      reviewDrawerVisible: false, // 审核记录抽屉
      reviewData: {},
      clickItemId: '',
      optionObj: {
        id: 'storeInventoryTransferTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'transferNo',
            label: '整车调拨单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/store/storeInventoryTransfer/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'sourceDealerName', label: '源门店名称', visible: true, width: 200 },
          { props: 'sourceDealerAddress', label: '源门店地址', visible: true, width: 200 },
          { props: 'targetDealerName', label: '目标门店名称', visible: true, width: 200 },
          { props: 'targetDealerAddress', label: '目标门店地址', visible: true, width: 200 },
          { props: 'moveoutTime', label: '移出时间', visible: true, width: 200 },
          { props: 'moveinTime', label: '移入时间', visible: true, width: 200 },
          { props: 'applyTime', label: '申请时间', visible: true, width: 200 },
          { props: 'auditStatusLabel', label: '单据状态', visible: true, width: 120 },
          { props: 'outApprovalLabel', label: '调出审批', visible: true, width: 100 },
          { props: 'outRemark', label: '调出意见', visible: true, width: 200 },
          { props: 'inApprovalLabel', label: '调入审批', visible: true, width: 100 },
          { props: 'inRemark', label: '调入意见', visible: true, width: 200 },
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
              name: '编辑',
              show: (row) => {
                return row.auditStatus === 1 || row.auditStatus === 5;
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/store/storeInventoryTransfer/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            },
            // {
            //   name: '删除',
            //   popconfirmConfirmButtonType: 'danger',
            //   popconfirmConfirmButtonText: '删除',
            //   popconfirmTitle: '此操作将永久删除, 是否继续?',
            //   click: (rowIndex, row) => {
            //     deleteItem([row.id]).then(() => {
            //       this.$message({
            //         type: 'success',
            //         message: '删除成功!'
            //       });
            //       this.getData();
            //     }).catch(() => {
            //       this.$message({
            //         type: 'error',
            //         message: '删除失败!'
            //       });
            //     });
            //   },
            //   type: 'danger'
            // },
            {
              name: '提交',
              popconfirmTitle: '是否要提交?',
              show: (row) => {
                return (row.auditStatus === 1 || row.auditStatus === 5) && this.permissions.has(`${this.moduleKey}-submit`);
              },
              click: (rowIndex, row) => {
                storeSubmit(row.id).then(() => {
                  this.$message({
                    type: 'success',
                    message: '提交成功!'
                  });
                  this.getData();
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '提交失败!'
                  });
                });
              },
              type: 'info'
            }, {
              name: '作废',
              popconfirmTitle: '确定作废单据吗?',
              show: (row) => {
                return (row.auditStatus === 1 || row.auditStatus === 5) && this.permissions.has(`${this.moduleKey}-invalid`);
              },
              click: (rowIndex, row) => {
                storeInvalid(row.id).then(() => {
                  this.$message({
                    type: 'success',
                    message: '作废成功!'
                  });
                  this.getData();
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '作废失败!'
                  });
                });
              },
              type: 'info'
            }, {
              name: '调出审批',
              show: (row) => {
                return row.auditStatus === 2 && row.outApproval !== 1 && this.permissions.has(`${this.moduleKey}-approveOut`);
              },
              click: (rowIndex, row) => {
                this.handleApproval(row, 'outApproval');
              },
              type: 'info'
            }, {
              name: '调入审批',
              show: (row) => {
                return row.auditStatus === 2 && row.inApproval !== 1 && this.permissions.has(`${this.moduleKey}-approveIn`);
              },
              click: (rowIndex, row) => {
                this.handleApproval(row, 'inApproval');
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
        path: '/vehstock/store/storeInventoryTransfer/edit'
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
        businessType: '门店库存调拨管理',
        dataFetchPath: 'vehstock/web/store/storeInventoryTransfer/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店库存调拨管理.xlsx');
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
      if (Array.isArray(this.form.vinList) && this.form.vinList.length <= 1) {
        delete data.vinList;
        data.vinLike = this.form.vinList[0] || '';
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
    // 查询门店编码或名称
    async getDealerListByName (params) {
      return listOrgStoreInfo({ keyword: params });
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
    // 调拨审批
    handleApproval (row, type) {
      this.approvalData = {
        id: row.id,
        type: type
      };
      this.approvalVisible = true;
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
.m-store-inventory-transfer-list {}
</style>
