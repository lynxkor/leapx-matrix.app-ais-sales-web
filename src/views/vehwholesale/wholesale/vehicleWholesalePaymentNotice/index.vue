<template>
  <div class="page-common m-vehicle-wholesale-payment-notice-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
    <el-form-item label="门店名称" >
       <fetch-select
              filterable
              clearable
              remote
              collapseTags
              v-model="form.saleDealerCodes"
              :remote-method="getDealerListByName"
              value-key="storeCode"
              label-key="storeName"
              multiple
            />
      </el-form-item>
       <el-form-item label="所属母公司名称">
        <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.dealerCompanyCodes"
                  :remote-method="getDealerParentOrgList"
                  value-key="companyCode"
                  label-key="companyName"
                  multiple
                />
      </el-form-item>
      <el-form-item label="创建时间"  v-show="this.visibleCount === 3 || show">
        <el-date-picker
         :default-time="['00:00:00', '23:59:59']"
          v-model="form.createTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <template v-if="show">
         <el-form-item label="发布时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.publishTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="发布状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_notice_publish_status"
            v-model="form.publishStatuses"
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
      <el-button v-permission="moduleKey+'-post'"  size="small" @click="handleBatchPost">发布</el-button>
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
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, batchPost } from '@/api/vehwholesale/wholesale/vehicleWholesalePaymentNotice/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfo, getParentCompany } from '@/api/common';
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
  createTime: '',
  dealerCompanyName: '',
  saleDealerName: '',
  publishStatus: '',
  publishTime: '',
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
      pageTitle: '批售请款通知',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-vehicleWholesalePaymentNotice',
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
        id: 'vehicleWholesalePaymentNoticeTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'paymentNoticeCode',
            label: '请款通知单号',
            visible: true,
            width: 220,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/wholesale/vehicleWholesalePaymentNotice/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dealerCompanyName', label: '所属母公司名称', visible: true, width: 240, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/companyDetails?companyCode=${row.dealerCompanyCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'saleDealerName', label: '门店名称', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.saleDealerCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'pendingSettleCount', label: '待结算数', visible: true, width: 100, align: 'right' },
          { props: 'totalWholesaleAmount', label: '批售总金额', visible: true, width: 120, align: 'right' },
          { props: 'publishStatusLabel', label: '发布状态', visible: true, width: 120 },
          { props: 'publishTime', label: '发布时间', visible: true, width: 160 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 120 },
          { props: 'createTime', label: '创建时间', visible: true, width: 160 },
          // {
          //   props: 'operate',
          //   label: '操作',
          //   type: 'operate',
          //   visible: true,
          //   fixed: 'right',
          //   buttons: [{
          //     name: '编辑',
          //     click: (rowIndex, row) => {
          //       this.$router.push({
          //         path: '/vehwholesale/wholesale/vehicleWholesalePaymentNotice/edit',
          //         query: {
          //           id: row.id,
          //           isEditing: true
          //         }
          //       });
          //     },
          //     type: 'info'
          //   }, {
          //     name: '删除',
          //     popconfirmConfirmButtonType: 'danger',
          //     popconfirmConfirmButtonText: '删除',
          //     popconfirmTitle: '此操作将永久删除, 是否继续?',
          //     click: (rowIndex, row) => {
          //       deleteItem(
          //         { idSet: [row.id] }
          //       ).then(() => {
          //         this.$message({
          //           type: 'success',
          //           message: '删除成功!'
          //         });
          //         this.getData();
          //       }).catch(() => {
          //         this.$message({
          //           type: 'error',
          //           message: '删除失败!'
          //         });
          //       });
          //     },
          //     type: 'danger'
          //   }]
          // }
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
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    async getDealerParentOrgList (params) {
      return getParentCompany({ parentCompanyName: params });
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
        path: '/vehwholesale/wholesale/vehicleWholesalePaymentNotice/edit'
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
        businessType: '整车批售-批售管理-批售请款通知管理',
        dataFetchPath: 'vw/web/wholesale/vehicleWholesalePaymentNotice/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '批售请款通知管理.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelImportTask', '_blank'),
            { message: '正在导入中，是否要跳转"系统管理-文件管理-导入任务"中查看？' }
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
          const records = res?.records || [];
          this.optionObj.dataList = records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res?.total || 0;
        }).catch(err => {
          console.error('获取付款通知列表失败:', err);
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

      // 发布时间
      if (this.form.publishTime) {
        delete data.publishTime;
        if (this.form.publishTime.length > 1) {
          data.publishTimeStart = this.form.publishTime[0];
          data.publishTimeEnd = this.form.publishTime[1];
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
    // 发布
    handleBatchPost () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将批量发布, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchPost({
          idSet: ids,
        }).then(() => {
          this.$message.success('提交成功');
          this.getData();
        });
      }).catch(() => {});
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-vehicle-wholesale-payment-notice-list {
}
</style>
