<template>
  <div class="page-common m-fund-vehicle-rebate-bill-detail-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
    <el-form-item label="返利核算单明细编号">
      <tag-input v-model="form.rebateBillDetailCodes" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="返利类型">
      <fetch-select
        :request="fetchOptions"
        enumCode="vw_rebate_type"
        v-model="form.rebateTypes"
        placeholder="请选择"
        clearable
        multiple
        filterable
      />
    </el-form-item>
    <el-form-item label="创建时间">
      <dateranges
        v-model="form.createTime"
        :setDefault="true"
        deftTime="最近一周"
        :limtNum="3"
        ref="transactionTime"/>
   </el-form-item>
   <el-form-item label="VIN" v-show="this.visibleCount === 3 || show">
      <tag-input v-model="form.vins" placeholder="请输入" />
    </el-form-item>
  <template v-if="show">
    <el-form-item label="母公司名称">
      <tag-input v-model="form.dealerCompanyNames" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="门店名称">
      <tag-input v-model="form.dealerNames" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="单据状态" prop="billStatuses">
        <fetch-select
          :request="fetchOptions"
          enumCode="vw_rebate_bills_detail_status"
          v-model="form.billStatuses"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="预算科目">
        <fetch-select
          filterable
          clearable
          remote
          v-model="form.budgetItemIds"
          :remote-method="getFundBudgetItemList"
          value-key="id"
          label-key="name"
          multiple
      />
        </el-form-item>
         <el-form-item label="费用支持类型">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.feeSupportTypeIds"
            :remote-method="getFeeSuportTypeList"
            value-key="id"
            label-key="name"
            multiple
        />
        </el-form-item>
         <el-form-item label="交车单号">
          <tag-input v-model="form.deliveryOrderCodes" placeholder="请输入" />
        </el-form-item>
      <el-form-item label="车系">
        <fetch-select
            :remote-method="seriesSearch"
            remote
            v-model="form.seriesIds"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            clearable
            multiple
            collapseTags
            filterable
            :options="seriesList"
             />
      </el-form-item>
       <el-form-item label="车型">
          <fetch-select
            :remote-method="modelSearch"
            remote
            reserve-keyword
            :options="modelList" v-model="form.modelIds" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable
            />
        </el-form-item>
        <el-form-item label="业务单据号">
            <tag-input v-model="form.bizOrderNos" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="创建人">
        <el-input
          placeholder="请输入"
          v-model="form.creatorName"
          clearable
        />
      </el-form-item>
      <!-- 初审人 -->
      <el-form-item label="初审人">
        <el-input
          placeholder="请输入"
          v-model="form.auditorName"
          clearable
        />
      </el-form-item>
      <!-- 复审人 -->
      <el-form-item label="复审人">
        <el-input
          placeholder="请输入"
          v-model="form.reviewName"
          clearable
        />
      </el-form-item>
      <!-- 备注 -->
      <el-form-item label="备注">
        <el-input
          placeholder="请输入"
          v-model="form.remark"
          clearable
        />
      </el-form-item>
      <!-- 复审时间 (区间) -->
      <el-form-item label="复审时间">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.reviewTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="初审日期">
        <el-date-picker
         :default-time="['00:00:00', '23:59:59']"
          v-model="form.auditTime"
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
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button> -->
      <el-button v-permission="moduleKey+'-audit'" size="small" @click="handleBatchAudit()" >批量初审</el-button>
      <el-button v-permission="moduleKey+'-review'" size="small" @click="handleBatchReview()" >批量复审</el-button>
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
      id="fundVehicleRebateBillDetailImport"
      @close="handleUploadDialogClose"
    />
    <BatchAuditDialog
      ref="showBatchAudit" @callParentMethod="batchAuditgetData">
    </BatchAuditDialog>
    <BatchReviewDialog
      ref="showBatchReview" @callReviewParentMethod="batchReviewgetData">
    </BatchReviewDialog>
    <audit-dialog
      ref="auditDialogRef"
      @audit="handleAudit"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, reviewItem, auditItem } from '@/api/vehwholesale/rebate/fundVehicleRebateBillDetail/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, vehicleSeriesList, vehicleModelList, getParentCompany } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel, formatAmount } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import { listIdNames as fundBudgetItemList } from '@/api/vehwholesale/fund/fundBudgetItem/index';
import { listIdNames as fundFeeSuportTypeList } from '@/api/vehwholesale/fund/fundFeeSupportType/index';
import TagInput from '@/libs/components/TagInput';
import BatchAuditDialog from '../components/batchAudit';
import BatchReviewDialog from '../components/batchReview';
import dateranges from '@/libs/components/dateranges';
import auditDialog from '@/libs/components/auditDialog';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  rebateBillDetailCodes: [],
  creatorName: '',
  createTime: [],
  dealerCompanyName: '',
  dealerName: '',
  rebateTypes: [],
  vin: '',
  bizOrderNo: '',
  modelName: '',
  seriesName: '',
  budgetItemId: '',
  feeSupportTypeId: '',
  auditTime: '',
  billStatus: '',
  deliveryOrderCode: '',
  // 新增筛选字段
  auditorName: '', // 初审人
  reviewName: '', // 复审人
  reviewTime: [], // 复审时间(区间)
  remark: '', // 备注
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
    BatchAuditDialog,
    BatchReviewDialog,
    dateranges,
    auditDialog

  },
  data () {
    return {
      pageTitle: '整车返利核算单明细',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-fundVehicleRebateBillDetail',
      form: {
        ...defaultForm
      },
      selectionList: [],
      modelList: [],
      seriesList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      batchAuditDialogVisible: false,
      reviewFalg: false,
      clickItemId: '',
      sortColumns: [],
      optionObj: {
        id: 'fundVehicleRebateBillDetailTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'rebateBillDetailCode',
            label: '返利核算单明细编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/rebate/fundVehicleRebateBillDetail/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          // { props: 'dealerCompanyName', label: '母公司名称', visible: true, width: 260, buttons: [{ click: (rowIndex, row) => { window.open(`/service/datacenter/store/parentCompany/detail?companyCode=${row.dealerCompanyCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'dealerCompanyName', label: '母公司名称', visible: true, width: 260 },
          // { props: 'dealerName', label: '门店名称', visible: true, width: 240, buttons: [{ click: (rowIndex, row) => { window.open(`/service/datacenter/store/parentCompany/detail?companyCode=${row.dealerName}`, '_blank'); }, type: 'primary' }] },
          { props: 'dealerName', label: '门店名称', visible: true, width: 240 },
          { props: 'periodLabel', label: '周期', visible: true, width: 100 },
          { props: 'year', label: '年度', visible: true, width: 100 },
          { props: 'quarterLabel', label: '季度', visible: true, width: 100 },
          { props: 'monthLabel', label: '月度', visible: true, width: 100 },
          { props: 'rebateTypeLabel', label: '返利类型', visible: true, width: 120 },
          { props: 'vin', label: 'VIN号', visible: true, width: 200 },
          { props: 'bizOrderNo', label: '业务单据号', visible: true, width: 200 },
          { props: 'rebateAmount', label: '核销金额', visible: true, width: 100 },
          { props: 'accruedAmount', label: '预提金额', visible: true, width: 100 },
          {
            props: 'modelName',
            label: '基本车型',
            visible: true,
            width: 120,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleModel/edit?id=${row.modelId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'seriesName',
            label: '车系',
            visible: true,
            width: 100,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleSeries/edit?id=${row.seriesId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'billStatusLabel', label: '单据状态', visible: true, width: 100 },
          {
            props: 'budgetItemName',
            label: '预算科目',
            visible: true,
            width: 100,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/vehwholesale/fund/fundBudgetItem/edit?id=${row.budgetItemId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'feeSupportTypeName',
            label: '费用支持类型',
            visible: true,
            width: 150,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/vehwholesale/fund/fundFeeSupportType/edit?id=${row.feeSupportTypeId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'auditorName', label: '初审人', visible: true, width: 100 },
          { props: 'auditTime', label: '初审时间', visible: true, width: 200, sortable: true },
          { props: 'auditOpinion', label: '初审意见', visible: true, width: 200 },
          { props: 'reviewName', label: '复审人', visible: true, width: 100 },
          { props: 'reviewTime', label: '复审时间', visible: true, width: 200, sortable: true },
          { props: 'reviewOpinion', label: '复审意见', visible: true, width: 120 },
          { props: 'postedLabel', label: '是否入账', visible: true, width: 100 },
          { props: 'dataSourceLabel', label: '数据来源', visible: true, width: 100 },
          { props: 'deliveryOrderCode', label: '交车单号', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { this.openWindow('/sales/vehretail/orderManager/deliveryOrder/edit?id=' + row.deliveryOrderId); }, type: 'primary' }] },
          { props: 'createTime', label: '创建时间', visible: true, width: 200, sortable: true },
          { props: 'creatorName', label: '创建人', visible: true, width: 100 },
          // { props: 'modifierName', label: '更新人', visible: true, width: 200 },
          // { props: 'updateTime', label: '更新时间', visible: true, width: 200 },
          // // { props: 'rebateBillDetailCode', label: '返利核算单明细编号', visible: true, width: 200 },
          // { props: 'accruedAmount', label: '预提金额', visible: true, width: 200 },
          // {
          //   props: 'operate',
          //   label: '操作',
          //   type: 'operate',
          //   visible: true,
          //   fixed: 'right',
          //   buttons: [
          //   //   {
          //   //   name: '编辑',
          //   //   click: (rowIndex, row) => {
          //   //     this.$router.push({
          //   //       path: '/vehwholesale/rebate/fundVehicleRebateBillDetail/edit',
          //   //       query: {
          //   //         id: row.id
          //   //       }
          //   //     });
          //   //   },
          //   //   type: 'info'
          //   // },
          //     {
          //       name: '删除',
          //       popconfirmTitle: '此操作将永久删除, 是否继续?',
          //       click: (rowIndex, row) => {
          //         deleteItem([row.id]).then(() => {
          //           this.$message({
          //             type: 'success',
          //             message: '删除成功!'
          //           });
          //           this.getData();
          //         }).catch(() => {
          //           this.$message({
          //             type: 'error',
          //             message: '删除失败!'
          //           });
          //         });
          //       },
          //       type: 'danger'
          //     }]
          // }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    // 确保默认的创建时间能够赋值
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
    },
    async seriesSearch (query) {
      try {
        const res = await vehicleSeriesList({ seriesNameLike: query });
        this.seriesList = res;
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async modelSearch (query) {
      // if (query) {
      let params = {
        modelNameLike: query || '',
        seriesIdList: this.form.seriesIds || []
      };
      let res = await vehicleModelList(params);
      if (res.length) {
        const vehicleModelData = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.id
          };
        });
        this.modelList = vehicleModelData;
      } else {
        this.modelList = [];
      }
      // }
    },
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params });
    },

    async getFundBudgetItemList (params) {
      return fundBudgetItemList({ budgetItemNameLike: params });
    },
    async getFeeSuportTypeList (params) {
      return fundFeeSuportTypeList({ feeSupportTypeNameLike: params });
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleSortChange (value) {
      const list = value || [];
      if (!list.length) {
        this.sortColumns = [];
        this.getData();
        return;
      }
      const sortColumns = list.map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      const lastSort = sortColumns[sortColumns.length - 1]?.sort || 'DESC';
      sortColumns.push({ column: 'id', sort: lastSort });
      this.sortColumns = sortColumns;
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
        path: '/vehwholesale/rebate/fundVehicleRebateBillDetail/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.form.createTime = [];
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      // 排序兜底：无排序时导出默认按id倒序
      const sortColumns = [...(reqParams.sortColumns || [])];
      if (!sortColumns.some(col => col.column === 'id')) {
        const lastSort = sortColumns.length > 0 ? sortColumns[sortColumns.length - 1].sort : 'DESC';
        sortColumns.push({ column: 'id', sort: lastSort });
      }
      reqParams.sortColumns = sortColumns;
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '整车返利核算单明细',
        dataFetchPath: '/vw/web/rebate/fundVehicleRebateBillDetail/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车返利核算单明细.xlsx');
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
    batchAuditgetData () {
      this.getData();
    },
    batchReviewgetData () {
      this.getData();
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              rebateAmount: formatAmount(item.rebateAmount),
              accruedAmount: formatAmount(item.accruedAmount),
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
        if (data[key] === '' || data[key] === null || (typeof data[key] === 'object' && Object.keys(data[key]).length === 0)) {
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
      if (this.form.auditTime) {
        delete data.auditTime;
        if (this.form.auditTime.length > 1) {
          data.auditTimeStart = this.form.auditTime[0];
          data.auditTimeEnd = this.form.auditTime[1];
        }
      }
      // 新增:复审时间区间
      if (this.form.reviewTime) {
        delete data.reviewTime;
        if (this.form.reviewTime.length > 1) {
          data.reviewTimeStart = this.form.reviewTime[0];
          data.reviewTimeEnd = this.form.reviewTime[1];
        }
      }

      // 排序字段
      data.sortColumns = [...(this.sortColumns || [])];
      if (data.sortColumns.length > 0 && !data.sortColumns.some(col => col.column === 'id')) {
        data.sortColumns.push({ column: 'id', sort: data.sortColumns[data.sortColumns.length - 1].sort });
      }
      if (data.sortColumns.length === 0) {
        data.sortColumns = [{ column: 'id', sort: 'DESC' }];
      }
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    update (val) {
      this.batchAuditDialogVisible = true;
    },
    // 判断数组的所有元素是否都等于某个值
    isAllSpecifiedValue (arr, targetValue) {
      if (arr.length === 0) return false;
      return arr.every(item => item === targetValue);
    },
    handleBatchReview () {
      this.reviewFalg = true;
      const BatchReviewIds = this.selectionList.map(item => item.id) || [];
      if (BatchReviewIds.length > 0) {
        const billStatues = this.selectionList.map(item => item.billStatus) || [];
        if (this.isAllSpecifiedValue(billStatues, 1040)) {
          // this.$refs.showBatchReview.showOrHide('isSelect', BatchReviewIds);
          this.$refs.auditDialogRef.show();
        } else {
          this.$message({
            type: 'warning',
            message: '存在不是已初审的记录，请确认!'
          });
        }
      } else {
        this.$refs.showBatchReview.showOrHide('notSelect');
      }
    },
    handleAudit (data) {
      const ids = this.selectionList.map(item => item.id) || [];
      let params = {
        ids: ids,
        opinion: data.remark,
        passOrReject: data.result
      };
      if (this.reviewFalg) { // 批量复审
        reviewItem(params).then(res => {
          this.$message.success('批量复审成功');
        }).catch(() => {});
      } else { // 初审
        auditItem(params).then(res => {
          this.$message.success('批量初审成功');
          this.getData();
        }).catch(() => {});
      }
      this.getData();
    },
    handleBatchAudit () {
      this.reviewFalg = false;
      const BatchAuditIds = this.selectionList.map(item => item.id) || [];
      if (BatchAuditIds.length > 0) {
        const billStatuss = this.selectionList.map(item => item.billStatus) || [];
        if (this.isAllSpecifiedValue(billStatuss, 1020)) {
          // this.$refs.showBatchAudit.showOrHide('isSelect', BatchAuditIds);
          this.$refs.auditDialogRef.show();
        } else {
          this.$message({
            type: 'warning',
            message: '存在不是待审核的记录，请确认!'
          });
        }
      } else {
        this.$refs.showBatchAudit.showOrHide('notSelect');
      }
    },
    isAllSpecifiedStatus (arr, targetValue, targetValue2) {
      if (arr.length === 0) return false;
      return arr.every(item => item === targetValue || item === targetValue2);
    },
    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      const selectBillStatuses = this.selectionList.map(item => item.billStatus) || [];
      if (this.isAllSpecifiedStatus(selectBillStatuses, 1020, 1030)) {
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
        }).catch(() => {});
      } else {
        this.$message({
          type: 'warning',
          message: '存在不是待审核或驳回的记录，请确认!'
        });
      }
    },
    async getParentCompany (query) {
      try {
        return await getParentCompany({ parentCompanyName: query });
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
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
.m-fund-vehicle-rebate-bill-detail-list {
}
</style>
