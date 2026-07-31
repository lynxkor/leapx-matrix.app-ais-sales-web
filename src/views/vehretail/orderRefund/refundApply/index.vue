<template>
  <div class="page-common m-sales-proxy-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="退订申请单号">
        <tag-input v-model="form.refundCodeList" placeholder="请输入" clearable/>
      </el-form-item>
      <el-form-item label="申请状态"  v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="vehretail_order_change_apply_status"
          v-model="form.refundStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="退订原因分类" v-show="this.visibleCount === 3 || show">
        <fetch-select
          v-bind="selectCategoryOptions"
          :remote-method="changeCategorySearch"
          v-model="form.cateCode"
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="定金退回方式" prop="depositRefundType">
          <fetch-select
            :request="fetchOptions"
            enumCode="order_fund_return_type"
            v-model="form.depositRefundType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="购车人姓名">
          <el-input v-model="form.buyerName" placeholder="请输入"  clearable/>
        </el-form-item>
        <el-form-item label="购车人手机号">
          <el-input v-model="form.buyerPhone" placeholder="请输入"  clearable/>
        </el-form-item>
        <el-form-item label="销售门店">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.saleDealerCode"
            :remote-method="saleDealerSearch"
            value-key="storeCode"
            label-key="storeName"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="基础车型">
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
        <el-form-item label="商城订单编号">
          <tag-input v-model="form.mallOrderCodeList" placeholder="请输入"  clearable/>
        </el-form-item>
        <el-form-item label="整车订单号">
          <tag-input v-model="form.retailOrderCodeList" placeholder="请输入"  clearable/>
        </el-form-item>
        <el-form-item label="省市区">
          <el-cascader
            placeholder="请选择省市区"
            v-model="form.area"
            :props="orgProps"
            :options="areaOptions"
            filterable
            clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="大区">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.regionCode"
            :remote-method="remoteMethods.region"
            value-key="orgCode"
            label-key="orgName"
          />
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.createTimeRange"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleCreateTimeChange"
            clearable
          />
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.submitTimeRange"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="缴定金时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.paymentTimeRange"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="初审人">
          <el-input v-model="form.preApproveUser" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item label="初审时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.preApproveTimeRange"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="审核人">
          <el-input v-model="form.approveUser" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item label="审核时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.approveTimeRange"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="终审人">
          <el-input v-model="form.finalApproveUser" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item label="终审时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.finalApproveTimeRange"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
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
      <el-button v-if="canImport" size="small" @click="handleDepositRefundTypeImport">导入定金退回方式</el-button>
      <el-button v-if="canImport" size="small" @click="handleFundResultImport">导入退订退款结果</el-button>
      <el-button v-if="canBatchAudit && Number(refundStatusTab) !== 0" size="small" @click="openBatchAuditShow">批量审核</el-button>
<!--      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>-->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
<!--      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>-->
<!--      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>-->
<!--      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>-->
    </div>
    <div class="ais-table-c">
      <el-tabs v-model="refundStatusTab" @tab-click="handleRefundStatusClick">
        <el-tab-pane label="全部用户退订申请" name="0" status="0" />
        <el-tab-pane label="待初审" name="1020" status="1020" />
        <el-tab-pane label="待审核" name="1025" status="1025"/>
        <el-tab-pane label="待终审" name="1027" status="1027"/>
      </el-tabs>
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
      :id="'orderRefundDepositRefundTypeImport'"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
    <Upload
      :visible="uploadDialogVisible1"
      :id="'orderPayRefundRecordResultImport'"
      @close="handleUploadDialogClose1"
      @getData="getData"
    />
    <!--  批量审核  -->
    <audit-dialog
      ref="auditRef"
      @audit="handleBatchAudit"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { batchAudit, deleteItem, enableItem, getList } from '@/api/vehretail/orderRefund/refundApply/index';
import {
  exportTable,
  getEnum,
  getTableConfig,
  tableAddOrUpdate,
  getRigion,
  vehicleSeriesList,
  listVehicleModel, listOrgStoreInfo
} from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel, handleBatchStatusChange } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import { fetchCategoryList } from '@/api/vehretail/orderRefund/category';
import TagInput from '@/libs/components/TagInput';
import auditDialog from '@/libs/components/auditDialog/index.vue';
import { getAreaTree } from '@/utils';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  createTime: '',
  refundCode: '',
  refundStatus: null,
  retailOrderCode: '',
  mallOrderCode: '',
  cateCode: '',
  area: [],
  submitTimeRange: null,
  paymentTimeRange: null,
  preApproveUser: '',
  preApproveTimeRange: null,
  approveUser: '',
  approveTimeRange: null,
  finalApproveUser: '',
  finalApproveTimeRange: null
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
    auditDialog
  },
  data () {
    return {
      selectCategoryOptions: {
        placeholder: '请选择',
        labelKey: 'cateName',
        valueKey: 'cateCode',
        clearable: true,
        // multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      pageTitle: '用户退订申请',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVRRO-retailOrderRefund',
      // 权限控制
      canBatchAudit: false,
      form: {
        ...defaultForm
      },
      refundStatusTab: '0',
      orgProps: {
        checkStrictly: true,
        emitPath: true,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      areaOptions: getAreaTree(),
      remoteMethods: {
        model: async (query) => {
          return await listVehicleModel({ modelNameLike: query });
        },
        series: async (query) => {
          return await vehicleSeriesList({ seriesNameLike: query, status: 1 });
        },
        region: async (query) => {
          return await getRigion({ regionName: query, status: 1 });
        },
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      uploadDialogVisible1: false,
      clickItemId: '',
      optionObj: {
        id: 'refundTable',
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
            props: 'refundCode',
            label: '退订申请单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderRefund/refundApply/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'refundStatusLabel', label: '申请状态', visible: true, width: 200, sortable: true },
          { props: 'buyerNameEncrypt', label: '购车人名称', visible: true, width: 200, sortable: true, mask: true, getValue: (row) => Promise.resolve(row.buyerName) },
          { props: 'buyerPhoneEncrypt', label: '购车人手机', visible: true, width: 200, sortable: true, mask: true, getValue: (row) => Promise.resolve(row.buyerPhone) },
          { props: 'saleUserName', label: '订单销售顾问', visible: true, width: 200, sortable: true },
          {
            props: 'applyTime',
            label: '申请时间',
            visible: true,
            width: 200,
            sortable: true
          },
          {
            props: 'creatorName',
            label: '申请人',
            visible: false,
            width: 200
          },
          { props: 'submitTime', label: '提交时间', visible: true, width: 200, sortable: true },
          { props: 'preApproveUserEncrypt', label: '初审人', visible: true, width: 200, sortable: false },
          { props: 'preApproveTime', label: '初审时间', visible: true, width: 200, sortable: true },
          { props: 'approveUser', label: '审核人', visible: true, width: 200, sortable: false },
          { props: 'approveTime', label: '审核时间', visible: true, width: 200, sortable: true },
          { props: 'finalApproveUserEncrypt', label: '终审人', visible: true, width: 200, sortable: false },
          { props: 'finalApproveTime', label: '终审时间', visible: true, width: 200, sortable: true },
          { props: 'orderRefundTypeLabel', label: '退订方式', visible: true, width: 200 },
          { props: 'cateName', label: '退订原因分类', visible: true, width: 200, sortable: true },
          { props: 'refundReason', label: '退订原因说明', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店', visible: true, width: 200, sortable: true },
          { props: 'provinceName', label: '省', visible: true, width: 200 },
          { props: 'cityName', label: '市', visible: true, width: 200 },
          { props: 'regionName', label: '大区', visible: true, width: 200 },
          { props: 'modelName', label: '基本车型', visible: true, width: 200, sortable: true },
          { props: 'refundBank', label: '退款银行', visible: true, width: 200 },
          { props: 'refundBankUser', label: '银行开户名', visible: true, width: 200 },
          { props: 'refundBankAccount', label: '退款银行账号', visible: true, width: 200 },
          { props: 'retailOrderCode', label: '零售订单号', visible: true, width: 200 },
          { props: 'mallOrderCode', label: '商城订单编号', visible: true, width: 200 },
          { props: 'enjoyGiftLabel', label: '是否有陪伴礼', visible: true, width: 200 },
          // { props: 'orderUserName', label: '下单人', visible: true, width: 200 },
          { props: 'orderUserId', label: '下单人ID', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '整车订单状态', visible: true, width: 200 },
          { props: 'orderCancelTime', label: '订单取消时间', visible: true, width: 200, sortable: true },
          { props: 'orderCancelDescp', label: '订单取消说明', visible: true, width: 200 },
          { props: 'orderSource', label: '订单来源', visible: true, width: 200 },
          { props: 'dataSourceLabel', label: '数据来源', visible: true, width: 200 },
          { props: 'depositRefundTypeLabel', label: '定金退回方式', visible: true, width: 200 },
          { props: 'paymentTime', label: '缴定金时间', visible: true, width: 200, sortable: true },
          { props: 'firstSubmitTime', label: '首次提交时间', visible: true, width: 200, sortable: true },
          { props: 'createTime', label: '创建时间', visible: true, width: 200, sortable: true },

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
              //       path: '/vehretail/orderRefund/refundApply/edit',
              //       query: {
              //         id: row.id,
              //         isEditing: true
              //       }
              //     });
              //   },
              //   type: 'info'
              // }
            ]
          }
        ],
        total: 0
      },
      sortColumns: [
        {
          column: 'create_time',
          sort: 'DESC'
        }
      ]
    };
  },
  created () {
    this.initPermissions();
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    // 初始化权限
    initPermissions () {
      this.canBatchAudit = this.permissions.has(`${this.moduleKey}-batchAudit`);
    },
    handleRefundStatusClick (item) {
      this.refundStatusTab = item.name;
      this.getData();
    },
    // 排序
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '')
            .replace('_label', '')
            .replace('apply_time', 'create_time'),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleDepositRefundTypeImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleFundResultImport () {
      this.uploadDialogVisible1 = true;
    },
    handleUploadDialogClose1 () {
      this.uploadDialogVisible1 = false;
    },
    openBatchAuditShow () {
      if (this.selectionList.length === 0) {
        this.$message.error('请选择要批量审核的退订申请！');
        return;
      }
      this.$refs.auditRef.show();
    },
    // 提交审批结果
    handleBatchAudit (auditForm) {
      if (this.selectionList.length === 0) {
        this.$message.error('请选择要批量审核的退订申请！');
        return;
      }
      // 申请单号列表
      const refundCodeList = this.selectionList.map(item => item.refundCode) || [];
      const idList = this.selectionList.map(item => item.id) || [];
      auditForm.refundCodeList = refundCodeList;
      auditForm.idList = idList;
      auditForm.auditResult = auditForm.result;
      auditForm.auditContent = auditForm.remark;
      auditForm.refundStatus = this.refundStatusTab;
      // this.$message.info(JSON.stringify(auditForm));
      batchAudit(auditForm).then(res => {
        this.$message.success('批量审核成功');
        this.getData();
      });
    },
    handleAdd () {
      this.$router.push({
        path: '/vehretail/orderRefund/refundApply/edit'
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
      exportTable({
        businessType: '用户退订申请',
        dataFetchPath: '/vr/web/refund/retailOrderRefund/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '用户退订申请.xlsx');
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
      this.form.refundStatus = this.refundStatusTab === '0' ? null : this.refundStatusTab;
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
      // 提交时间
      if (this.form.submitTimeRange && this.form.submitTimeRange.length > 1) {
        delete data.submitTimeRange;
        data.submitTimeStart = this.form.submitTimeRange[0];
        data.submitTimeEnd = this.form.submitTimeRange[1];
      }
      // 初审时间
      if (this.form.preApproveTimeRange && this.form.preApproveTimeRange.length > 1) {
        delete data.preApproveTimeRange;
        data.preApproveTimeStart = this.form.preApproveTimeRange[0];
        data.preApproveTimeEnd = this.form.preApproveTimeRange[1];
      }
      // 审核时间
      if (this.form.approveTimeRange && this.form.approveTimeRange.length > 1) {
        delete data.approveTimeRange;
        data.approveTimeStart = this.form.approveTimeRange[0];
        data.approveTimeEnd = this.form.approveTimeRange[1];
      }
      // 终审时间
      if (this.form.finalApproveTimeRange && this.form.finalApproveTimeRange.length > 1) {
        delete data.finalApproveTimeRange;
        data.finalApproveTimeStart = this.form.finalApproveTimeRange[0];
        data.finalApproveTimeEnd = this.form.finalApproveTimeRange[1];
      }
      // 缴定金时间
      if (this.form.paymentTimeRange && this.form.paymentTimeRange.length > 1) {
        delete data.paymentTimeRange;
        data.paymentTimeStart = this.form.paymentTimeRange[0];
        data.paymentTimeEnd = this.form.paymentTimeRange[1];
      }
      if (this.selectionList.length > 0) {
        data.ids = this.selectionList.map(item => item.id);
      }
      // 排序字段
      data.sortColumns = this.sortColumns;
      // 省市区
      if (Array.isArray(this.form.area) && this.form.area.length > 0) {
        delete data.area;
        data.provinceCode = this.form.area[0];
        if (this.form.area.length > 1) {
          data.cityCode = this.form.area[1];
        }
      }
      return data;
    },
    handleCreateTimeChange (createTime) {
      if (createTime && createTime.length > 1) {
        this.form.createTimeStart = createTime[0];
        this.form.createTimeEnd = createTime[1];
      } else {
        this.form.createTimeStart = null;
        this.form.createTimeEnd = null;
      }
    },
    async saleDealerSearch (val) {
      const params = {
        keyword: val,
        pageSize: 5000
      };
      return await listOrgStoreInfo(params);
    },
    async changeCategorySearch (val) {
      return await fetchCategoryList({ pageSize: 1000, cateName: val });
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
.m-sales-proxy-list {
  ::v-deep .m-vxe-table .m-vxe-table-options {
    top: -96px;
  }
  .ais-actions {
    margin-bottom: 8px;
  }
  .ais-table-c {
    height: calc(100% - 168px);
  }
}
</style>
