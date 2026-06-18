<template>
  <div class="page-common m-wholesaleDealerTestDriveQuota-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
        <el-form-item label="门店编码">
          <fetch-select
            filterable
            clearable
            multiple
            remote
            collapseTags
            v-model="form.dealerCodes"
            :remote-method="getDealerListByCode"
            value-key="storeCode"
            label-key="storeCode"
          />
        </el-form-item>
        <el-form-item label="门店名称">
          <fetch-select
            filterable
            clearable
            multiple
            remote
            collapseTags
            v-model="form.dealerNames"
            :remote-method="getDealerListByName"
            value-key="storeName"
            label-key="storeName"
          />
        </el-form-item>
        <el-form-item label="年款" v-show="this.visibleCount === 3 || show">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.vehicleYearTypeId"
            :params="form.vehicleYearType"
            :remote-method="getVehicleYearTypeList"
            value-key="id"
            label-key="name"
          />
        </el-form-item>
      <template v-if="show">
        <el-form-item label="系列">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.vehicleModelLineId"
            :params="form.vehicleModelLine"
            :remote-method="getVehicleModelLineList"
            value-key="id"
            label-key="name"
          />
        </el-form-item>
        <el-form-item label="车系">
          <fetch-select
            filterable
            clearable
            multiple
            remote
            collapseTags
            v-model="form.seriesIds"
            :remote-method="getVehicleSeriesList"
            value-key="id"
            label-key="name"
          />
        </el-form-item>
        <el-form-item label="配额数量">
          <el-input-number
            :controls="false"
            placeholder="请输入"
            v-model="form.quotaQty"
            clearable
            :precision="0"
            :min="null"
          />
        </el-form-item>
        <el-form-item label="状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="StatusEnum"
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
            unlink-panels
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
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
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
    <!-- 日志弹窗 -->
    <el-dialog
      title="门店试驾车配额调整记录"
      :visible.sync="logDialogVisible"
      width="80%"
      :modal-append-to-body="false"
      :before-close="handleLogDialogClose"
      class="dialog-with-table"
    >
      <vxe-table
        ref="logTableRef"
        v-loading="logLoading"
        :data="logOptionObj.dataList"
        height="auto"
        stripe
        border
      >
        <vxe-column field="changeBeforeQty" title="变化前数量" width="200"></vxe-column>
        <vxe-column field="changeAfterQty" title="变化后数量" width="200"></vxe-column>
        <vxe-column field="changeQty" title="变化数量" width="200"></vxe-column>
        <vxe-column field="changeTime" title="变化时间" width="200"></vxe-column>
        <vxe-column field="logDataSourceLabel" title="数据来源" width="200"></vxe-column>
        <vxe-column field="relatedFormCode" title="相关单号" width="200"></vxe-column>
        <vxe-column field="changeDesc" title="调整说明" width="200"></vxe-column>
        <vxe-column field="changeDescFileId" title="附件调整说明" width="200">
          <template #default="{ row }">
            <a v-if="row.changeDescFileId" :href="row.changeDescFileId" target="_blank" style="color: #409EFF; text-decoration: underline; cursor: pointer;">附件下载</a>
          </template>
        </vxe-column>
        <vxe-column field="responsibleName" title="负责人" width="200"></vxe-column>
        <vxe-column field="createTime" title="创建时间" width="200"></vxe-column>
      </vxe-table>
    </el-dialog>

    <!-- 配额调整弹窗 -->
    <el-dialog
      :title="adjustmentDialogTitle"
      :visible.sync="adjustmentDialogVisible"
      width="60%"
      :modal-append-to-body="false"
      :before-close="handleAdjustmentDialogClose"
      class="dialog-with-component"
    >
      <component
        :is="'QuotaEdit'"
        v-if="adjustmentDialogVisible"
        :id="currentRow.id"
        :initialQuotaQty="currentRow.quotaQty"
        :initialRequestQty="currentRow.requestQty"
        :initialDealerCode="currentRow.dealerCode"
        :initialDealerName="currentRow.dealerName"
        :initialVehicleYearTypeId="currentRow.vehicleYearTypeId"
        :initialVehicleModelLineId="currentRow.vehicleModelLineId"
        :initialSeriesId="currentRow.seriesId"
        @close="handleAdjustmentDialogClose"
        ref="adjustmentComponentRef"
      />
    </el-dialog>
    <!-- TIPS: 填入项目信息 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'wholesaleDealerTestDriveQuotaImport'"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import QuotaEdit from '@/views/vehwholesale/basic/wholesaleDealerTestDriveQuota/QuotaEdit.vue';
import { getList, deleteItem, enableItem } from '@/api/vehwholesale/basic/wholesaleDealerTestDriveQuota/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfo, listVehicleYearType, vehicleModelLineList, vehicleSeriesList } from '@/api/common';
import { getList as getLogList } from '@/api/vehwholesale/basic/dealerDemoVehicleQuotaRecord/index';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  dealerCodes: [],
  dealerNames: [],
  vehicleYearTypeId: '',
  vehicleModelLineId: '',
  seriesIds: '',
  quotaQty: null,
  status: '',
  createTime: '',
};

const pageSize = 20;
// const logPageSize = 20;
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
    QuotaEdit
  },
  data () {
    return {
      pageTitle: '门店试驾车配额',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleDealerTestDriveQuota',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      logDialogVisible: false,
      logLoading: false,
      currentRow: {},
      adjustmentDialogVisible: false,
      adjustmentDialogTitle: '配额调整',
      optionObj: {
        id: 'wholesaleDealerTestDriveQuotaTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '编码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/basic/wholesaleDealerTestDriveQuota/edit',
                  query: {
                    id: row.id,
                    isEditing: false
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 150, buttons: [{ click: (rowIndex, row) => { window.open('/partner/channelManagement/shopDetail?dealerCode=' + row.dealerCode, '_blank'); }, type: 'primary' }] },
          { props: 'dealerName', label: '门店名称', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open('/partner/channelManagement/shopDetail?dealerCode=' + row.dealerCode, '_blank'); }, type: 'primary' }] },
          { props: 'vehicleYearType', label: '年款', visible: true, width: 100, buttons: [{ click: (rowIndex, row) => { window.open('/sales/datacenter/materials/vehicleYearType/edit?id=' + row.vehicleYearTypeId, '_blank'); }, type: 'primary' }] },
          { props: 'vehicleModelLine', label: '系列', visible: true, width: 100, buttons: [{ click: (rowIndex, row) => { window.open('/sales/datacenter/materials/vehicleModelLine/edit?id=' + row.vehicleModelLineId, '_blank'); }, type: 'primary' }] },
          { props: 'seriesName', label: '车系', visible: true, width: 100, buttons: [{ click: (rowIndex, row) => { window.open('/sales/datacenter/materials/vehicleSeries/edit?id=' + row.seriesId, '_blank'); }, type: 'primary' }] },
          { props: 'requestQty', label: '累计已申请数', visible: true, width: 120, align: 'right' },
          { props: 'changeDesc', label: '调整说明', visible: true, width: 180 },
          { props: 'quotaQty', label: '配额数量', visible: true, width: 100, align: 'right' },
          { props: 'statusLabel', label: '状态', visible: true, width: 78 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 140 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '配额调整',
              click: (rowIndex, row) => {
                this.openAdjustmentDialog(row);
              },
              type: 'info'
            }, {
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/basic/wholesaleDealerTestDriveQuota/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '日志',
              click: (rowIndex, row) => {
                this.openLogDialog(row);
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      logOptionObj: {
        id: 'dealerDemoVehicleQuotaRecordTable',
        dataList: [],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/vehwholesale/basic/wholesaleDealerTestDriveQuota/edit'
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
        businessType: '门店试驾车配额',
        dataFetchPath: '/vw/web/basic/wholesaleDealerTestDriveQuota/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店试驾车配额.xlsx');
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
    },
    async getDealerListByCode (params) {
      return listOrgStoreInfo({ storeCode: params, isWholesaleSale: true });
    },
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async getVehicleModelLineList (params) {
      return vehicleModelLineList({ modelLineNameLike: params, status: 1 });
    },
    async getVehicleYearTypeList (params) {
      return listVehicleYearType({ yearTypeNameLike: params, status: 1 });
    },
    // 日志弹窗相关方法
    openLogDialog (row) {
      this.currentRowId = row.id;
      this.logDialogVisible = true;
      this.getLogData();
    },
    handleLogDialogClose () {
      this.logDialogVisible = false;
    },
    getLogData () {
      this.logLoading = true;

      getLogList({
        relatedId: this.currentRowId
      })
        .then(res => {
          this.logOptionObj.dataList = res.records.map(item => {
            return {
              ...item
            };
          });
        }).finally(() => {
          this.logLoading = false;
        });
    },
    getLogConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.logOptionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    // 配额调整弹窗相关方法
    openAdjustmentDialog (row) {
      this.currentRow = row;
      this.adjustmentDialogTitle = `配额调整 - ${row.dealerName}`;
      this.adjustmentDialogVisible = true;
    },
    handleAdjustmentDialogClose () {
      this.adjustmentDialogVisible = false;
      // 关闭时刷新列表数据
      this.getData();
    },
  }
};
</script>

<style lang="scss" scoped>
  ::v-deep .el-input-number {
    width: 100%;
  }

  ::v-deep .dialog-with-table {
    .el-dialog {
      margin-top: 6vh !important;
      height: 70vh;
      min-height: 500px;
      display: flex;
      flex-direction: column;

      .el-dialog__body {
        flex: 1;
        overflow: auto;
        padding: 10px 20px !important;
        display: flex;
        flex-direction: column;

        .ais-table-c {
          flex: 1;
          min-height: 400px;
          display: flex;
          flex-direction: column;

          .vxe-table--render-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .vxe-table--main-wrapper {
            flex: 1;
            min-height: 350px;
          }

          .vxe-table--footer-wrapper {
            flex-shrink: 0;
          }
        }
      }
    }
  }
</style>
