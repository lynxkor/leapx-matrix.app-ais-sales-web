<template>
  <div class="page-common m-order-refund-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="退订原因分类">
        <el-input
          placeholder="请输入"
          v-model="form.cateName"
          clearable
        />
      </el-form-item>
      <el-form-item label="下拉选项是否展示">
        <fetch-select
          :request="fetchOptions"
          enumCode="BooleanEnum"
          v-model="form.selectorDisplay"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="是否需要初审" v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="BooleanEnum"
          v-model="form.preApproval"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="是否需要终审">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.finalApproval"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="退还方式是否允许选择">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.refundTypeSelect"
            placeholder="请选择"
            clearable
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
<!--      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>-->
<!--      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>-->
<!--      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>-->
<!--      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>-->
<!--      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>-->
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
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="currentImportType"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehretail/orderRefund/category';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  cateName: '',
  selectorDisplay: null,
  originalRefund: null,
  preApproval: null,
  finalApproval: null,
  refundTypeSelect: null,
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
    Upload
  },
  data () {
    return {
      pageTitle: '退订原因分类',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVRROCA-retailOrderChangeReason',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      currentImportType: '',
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'orderRefundCategoryTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'id',
            label: '主键',
            visible: false,
            width: 200
          },
          {
            props: 'cateCode',
            label: '原因分类代码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderRefund/category/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'cateName', label: '退订原因分类', visible: true, width: 200 },
          { props: 'selectorDisplayLabel', label: '下拉选项是否展示', visible: true, width: 200 },
          { props: 'preApprovalLabel', label: '是否需要初审', visible: true, width: 200 },
          { props: 'finalApprovalLabel', label: '是否需要终审', visible: true, width: 200 },
          { props: 'refundTypeSelectLabel', label: '退还方式是否允许选择', visible: true, width: 200 },
          { props: 'refundTypeDefaultLabel', label: '默认定金退回方式', visible: true, width: 200 },
          { props: 'refundAttachRequired', label: '退订附件上传要求', visible: true, width: 200 },
          { props: 'refundReasonDefault', label: '默认退订原因说明', visible: false, width: 200 },
          { props: 'refundReasonChangedLabel', label: '是否允许退订原因修改', visible: false, width: 200 },
          { props: 'expireOrderAutoPassLabel', label: '超时订单自动审核通过', visible: false, width: 200 },
          { props: 'expireOrderTime', label: '超时订单时间设置(月)', visible: false, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [
              // {
              //   name: '编辑',
              //   click: (rowIndex, row) => {
              //     this.$router.push({
              //       path: '/vehretail/orderRefund/category/edit',
              //       query: {
              //         id: row.id
              //       }
              //     });
              //   },
              //   type: 'info'
              // }
            ]
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
    handleAdd () {
      this.$router.push({
        path: '/vehretail/orderRefund/category/edit'
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
        businessType: '退订原因分类',
        dataFetchPath: '/vr/web/refund/orderRefundCategory/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '退订原因分类.xlsx');
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
      if (this.selectionList.length > 0) {
        data.ids = this.selectionList.map(item => item.id);
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
.m-order-refund-list {
}
</style>
