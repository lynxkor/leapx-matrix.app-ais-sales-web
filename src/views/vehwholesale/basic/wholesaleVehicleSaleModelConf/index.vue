<template>
  <div class="page-common m-wholesale-vehicle-sale-model-conf-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
    <el-form-item label="车系">
      <fetch-select
        v-model="form.seriesIds"
        :remote-method="remoteMethods.series"
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
      <el-form-item label="车型">
        <fetch-select
          filterable
          clearable
          multiple
          remote
          reserve-keyword
          collapseTags
          v-model="form.modelIds"
          :remote-method="getModelIdList"
          value-key="id"
          label-key="name"
        />
      </el-form-item>
      <el-form-item label="年款">
        <fetch-select
          filterable
          clearable
          multiple
          remote
          reserve-keyword
          v-model="form.vehicleYearTypeIds"
          :remote-method="remoteMethods.yearType"
          value-key="id"
          label-key="name"
        />
      </el-form-item>
      <el-form-item label="订单分类"  v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="vw_order_category"
          v-model="form.orderCategory"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="审核状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="ws_audit_status"
            v-model="form.auditStatus"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="母公司">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.dealerParentOrgCode"
            :remote-method="getDealerParentOrgList"
            value-key="companyCode"
            label-key="companyName"
          />
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.updateTime"
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
      <!-- <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
      <el-button v-permission="moduleKey+'-batchEdit'" size="small" @click="handleBatchEditValid" :disabled="selectionList.length === 0">批量编辑</el-button>
      <el-button v-permission="moduleKey+'-batchSubmit'" size="small" @click="handleBatchSubmitValid" :disabled="selectionList.length === 0">批量提交</el-button>
      <el-button v-permission="moduleKey+'-batchAudit'" size="small" @click="handleBatchAuditValid" :disabled="selectionList.length === 0">批量审核</el-button>
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
        @sortChange="handleSortChange"
      />
    </div>
    <Upload
      :visible="uploadDialogVisible"
      :id="'wholesaleVehicleSaleModelConfImport'"
      @close="handleUploadDialogClose"
    />
    <audit-dialog
      ref="auditRef"
      @audit="handleBatchAudit"
      :auditDataList="selectionList"
      :field="'code'"
    />
    <BatchEditInput
      :visible.sync="showEditDialog"
      :edit-ids="selectionList.map(item => item.id)"
      @confirm="handleBatchEdit"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, batchAuditValid, batchSubmitValid, batchAudit, batchSubmit, batchEditValid, batchEdit } from '@/api/vehwholesale/basic/wholesaleVehicleSaleModelConf/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listVehicleModel, listVehicleYearType, getParentCompany, vehicleSeriesList } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import auditDialog from '@/libs/components/auditDialog';
import BatchEditInput from './BatchEditInput.vue';
import Upload from '@/libs/components/UploadDialog';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  seriesIds: [],
  modelIds: [],
  vehicleYearTypeIds: [],
  orderCategory: '',
  auditStatus: '',
  dealerParentOrgCode: '',
  updateTime: '',
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
    auditDialog,
    BatchEditInput,
    Upload
  },
  data () {
    return {
      pageTitle: '整车销售模式配置',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleVehicleSaleModelConf',
      form: {
        ...defaultForm
      },
      selectionList: [],
      sortColumns: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      showEditDialog: false,
      // 远程搜索方法
      remoteMethods: {
        series: async (query) => {
          return await vehicleSeriesList({ seriesNameLike: query, size: 100 });
        },
        yearType: async (query) => {
          return await listVehicleYearType({ yearTypeNameLike: query });
        }
      },
      optionObj: {
        id: 'wholesaleVehicleSaleModelConfTable',
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
                  path: '/vehwholesale/basic/wholesaleVehicleSaleModelConf/edit',
                  query: {
                    id: row.id,
                    isEditing: false
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'seriesName',
            label: '车系',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleSeries/edit?id=${row.seriesId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'modelName',
            label: '车型',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleModel/edit?id=${row.modelId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'vehicleYearType',
            label: '年款',
            visible: true,
            width: 120,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleYearType/edit?id=${row.vehicleYearTypeId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'orderCategoryLabel', label: '订单分类', visible: true, width: 120, sortable: true },
          { props: 'cooperationModeLabel', label: '合作模式', visible: true, width: 120 },
          { props: 'invoiceDiscountTypeLabel', label: '开票优惠类型', visible: true, width: 150 },
          { props: 'invoiceCoefficient', label: '开票系数', visible: true, width: 100, align: 'right', sortable: true },
          { props: 'rebateUseTypeLabel', label: '返利使用类型', visible: true, width: 150, sortable: true },
          { props: 'rebateCoefficient', label: '返利使用系数', visible: true, width: 100, align: 'right' },
          { props: 'dealerParentOrgName', label: '母公司', visible: true, width: 240 },
          { props: 'startDate', label: '开始日期', visible: true, width: 160 },
          { props: 'endDate', label: '截止日期', visible: true, width: 160 },
          { props: 'submitterName', label: '提交人', visible: true, width: 100 },
          { props: 'submitTime', label: '提交时间', visible: true, width: 180 },
          { props: 'auditorName', label: '审核人', visible: true, width: 100 },
          { props: 'auditTime', label: '审核时间', visible: true, width: 180 },
          { props: 'auditStatusLabel', label: '审核状态', visible: true, width: 100 },
          { props: 'auditOpinion', label: '审核意见', visible: true, width: 180 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 140 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              show: (row) => row.permission.edit,
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/basic/wholesaleVehicleSaleModelConf/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            },
            {
              name: '日志',
              click: (rowIndex, row) => {
                this.$auditLog.show({ id: row.id });
              },
              type: 'info'
            }]
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
    handleSortChange (value) {
      const list = value || [];
      if (!list.length) {
        this.sortColumns = [];
        this.getData();
        return;
      }
      const latest = list.reduce((acc, cur) => (cur.sortTime || 0) > (acc.sortTime || 0) ? cur : acc);
      const def = this.optionObj.dataProp.find(d => d.props === latest.field) || {};
      this.sortColumns = [{
        column: def.sortField || (latest.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
        sort: (latest.order || '').toUpperCase()
      }];
      this.getData();
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/vehwholesale/basic/wholesaleVehicleSaleModelConf/edit'
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
        businessType: '整车销售模式配置',
        dataFetchPath: '/vw/web/basic/wholesaleVehicleSaleModelConf/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车销售模式配置.xlsx');
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
      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = this.form.updateTime[1];
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
    async getModelIdList (params) {
      return listVehicleModel({ modelNameLike: params, status: 1 });
    },
    async getDealerParentOrgList (params) {
      return getParentCompany({ parentCompanyName: params });
    },
    handleBatchAudit (data) {
      let params = {
        ids: data.auditDataList ? data.auditDataList.map(item => item.id) : [],
        isAudit: data.result,
        auditOpinion: data.remark
      };
      return batchAudit(params).then(() => {
        this.$message({
          type: 'success',
          message: '批量审核成功'
        });
        this.getData();
      });
    },
    handleBatchSubmit (ids) {
      return batchSubmit(ids).then(() => {
        this.$message({
          type: 'success',
          message: '批量提交成功'
        });
        this.getData();
      });
    },
    handleBatchAuditValid () {
      const ids = this.selectionList.map(item => item.id) || [];
      return batchAuditValid(ids).then(() => {
        this.$refs.auditRef.show();
      });
    },
    handleBatchSubmitValid () {
      const ids = this.selectionList.map(item => item.id) || [];
      return batchSubmitValid(ids).then(() => {
        const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>是否确认批量提交?</div>';
        this.$confirm(message, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          customClass: 'ais-leave-tips',
          showClose: false
        }).then(() => {
          this.handleBatchSubmit(ids);
        });
      });
    },
    handleBatchEditValid () {
      const ids = this.selectionList.map(item => item.id) || [];
      return batchEditValid(ids).then(() => {
        this.showEditDialog = true;
      });
    },
    handleBatchEdit (data) {
      return batchEdit(data).then(() => {
        this.$message({
          type: 'success',
          message: '批量编辑成功'
        });
        this.getData();
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-wholesale-vehicle-sale-model-conf-list {
}
</style>
