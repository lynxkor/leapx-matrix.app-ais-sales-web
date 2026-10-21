<template>
  <div class="page-common m-vr-equity-apply-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="订单权益申请编号">
        <el-input
          placeholder="请输入"
          v-model="form.code"
          clearable
        />
      </el-form-item>
      <el-form-item label="商城订单编号">
        <el-input
          placeholder="请输入"
          v-model="form.mallOrderNo"
          clearable
        />
      </el-form-item>
      <el-form-item label="下单人ID">
        <el-input
          placeholder="请输入"
          v-model="form.orderUserId"
          clearable
        />
      </el-form-item>
      <el-form-item label="代办联系人">
        <el-input
          placeholder="请输入"
          v-model="form.agentContact"
          clearable
        />
      </el-form-item>
      <el-form-item label="购车人姓名">
        <el-input
          placeholder="请输入"
          v-model="form.buyerName"
          clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="购车人手机号">
          <el-input
            placeholder="请输入"
            v-model="form.buyerPhone"
            clearable
          />
        </el-form-item>
        <el-form-item label="销售门店">
          <fetch-select
            filterable
            clearable
            remote
            collapse-tags
            v-model="form.saleDealerCode"
            :remote-method="getDealerList"
            value-key="storeCode"
            label-key="label"
          />
        </el-form-item>
        <el-form-item label="基本车型">
          <fetch-select
            filterable
            clearable
            remote
            collapse-tags
            v-model="form.modelId"
            :remote-method="getVehicleModelList"
            value-key="id"
            label-key="label"
          />
        </el-form-item>
        <el-form-item label="订单物料码">
          <fetch-select
            filterable
            clearable
            remote
            collapse-tags
            v-model="form.materialsCode"
            :remote-method="getMaterialsCodeList"
            value-key="value"
            label-key="label"
          />
        </el-form-item>
        <el-form-item label="申请单状态">
          <fetch-select
            :options="auditStatusOptions"
            :valueKey="'value'"
            :labelKey="'label'"
            v-model="form.auditStatus"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="权益大类">
          <fetch-select
            filterable
            clearable
            remote
            collapse-tags
            v-model="form.equityCategoryId"
            :remote-method="getEquityCategoryList"
            value-key="id"
            label-key="name"
          />
        </el-form-item>
        <el-form-item label="置换类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vr_order_benefit_replacement_type"
            v-model="form.replacementType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="发放类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vr_order_benefit_issue_type"
            v-model="form.issueType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="合作类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vr_cooperation_type"
            v-model="form.cooperationType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否发放">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isIssued"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="其他品牌">
          <el-input
            placeholder="请输入"
            v-model="form.otherBrand"
            clearable
          />
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.submitTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="缴定金时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.depositTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="锁单时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.lockTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="订单交车时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.deliveryTime"
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
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入发放结果</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button
        v-if="batchAuditShow"
        size="small"
        :disabled="selectionList.length === 0"
        @click="openBatchAuditShow"
      >批量审核</el-button>
    </div>
    <div class="ais-table-c">
      <el-tabs v-model="activeAuditTab" @tab-click="handleAuditTabClick">
        <el-tab-pane
          v-for="tab in auditTabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        />
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
    <Upload
      :visible="uploadDialogVisible"
      :id="'importExcelForIssueInfo'"
      @close="handleUploadDialogClose"
    />
    <audit-dialog
      ref="auditRef"
      audit-title="批量审核"
      :audit-data-list="[]"
      field="code"
      @audit="handleBatchAuditSubmit"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, getDecryptField, batchFirstApprove, batchApprove } from '@/api/vehretail/orderManager/vrEquityApply/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, vehicleModelList, listOrgStoreInfo, vehicleMaterials } from '@/api/common';
import { getSelect as getEquityCategoryListApi } from '@/api/vehretail/basicConfig/vrEquityCategory/index';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import auditDialog from '@/libs/components/auditDialog';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  code: '',
  mallOrderNo: '',
  orderUserId: '',
  agentContact: '',
  buyerName: '',
  buyerPhone: '',
  saleDealerCode: '', // 改为使用门店编码
  originalModelId: '',
  materialsCode: '',
  auditStatus: '',
  equityCategoryId: '', // 改为使用权益分类ID
  replacementType: '',
  issueType: '',
  cooperationType: '',
  isIssued: '',
  otherBrand: '',
  submitTime: '',
  depositTime: '',
  lockTime: '',
  deliveryTime: ''
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
    auditDialog
  },
  data () {
    return {
      pageTitle: '订单权益申请',
      pageType: 'list',
      moduleKey: 'AISVR-vrEquityApply',
      activeAuditTab: 'all',
      auditTabs: [
        { label: '全部', name: 'all', status: null, showBatch: false },
        { label: '已提交', name: 'submitted', status: '30', showBatch: true },
        { label: '已初审', name: 'firstAudited', status: '40', showBatch: true }
      ],
      canBatchFirstAudit: false,
      canBatchAudit: false,
      form: {
        ...defaultForm
      },
      selectionList: [],
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      auditStatusOptions: [
        { label: '草稿', value: '10' },
        { label: '驳回', value: '20' },
        { label: '已提交', value: '30' },
        { label: '已初审', value: '40' },
        { label: '已终审', value: '60' },
        { label: '作废', value: '70' }
      ],
      optionObj: {
        id: 'vrEquityApplyTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '订单权益申请编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/vrEquityApply/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'submitTime', label: '提交时间', visible: true, width: 180 },
          { props: 'auditStatusLabel', label: '申请单状态', visible: true, width: 120 },
          { props: 'mallOrderNo', label: '商城订单号', visible: true, width: 200 },
          { props: 'orderUserId', label: '下单人ID', visible: true, width: 240 },
          { props: 'depositTime', label: '缴定金时间', visible: true, width: 180 },
          { props: 'lockTime', label: '锁单时间', visible: true, width: 180 },
          { props: 'deliveryTime', label: '订单交车时间', visible: true, width: 180 },
          { props: 'agentContact', label: '代办联系人', visible: true, width: 150 },
          {
            props: 'equityCategoryName',
            label: '权益大类',
            visible: true,
            width: 150,
            buttons: [{
              click: (rowIndex, row) => {
                this.navigateToRoute({
                  path: '/sales/vehretail/basicConfig/vrEquityCategory/edit',
                  query: {
                    id: row.equityCategoryId
                  }
                }, true);
              },
              type: 'primary'
            }]
          },
          { props: 'replacementTypeLabel', label: '置换类型', visible: true, width: 120 },
          { props: 'otherBrand', label: '其他品牌', visible: true, width: 150 },
          { props: 'discountAmount', label: '优惠金额', visible: true, width: 120, align: 'right' },
          { props: 'isIssuedLabel', label: '是否发放', visible: true, width: 120 },
          { props: 'expectedIssueDate', label: '预计发放日期', visible: true, width: 150 },
          { props: 'issueTypeLabel', label: '发放类型', visible: true, width: 120 },
          { props: 'originalBenefitDate', label: '原权益享受日期', visible: true, width: 150 },
          { props: 'changedBenefitDate', label: '变更后权益日期', visible: true, width: 150 },
          {
            props: 'saleDealerName',
            label: '销售门店',
            visible: true,
            width: 280,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/service/datacenter/store/store/detail?storeCode=${row.saleDealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'cooperationTypeLabel', label: '合作类型', visible: true, width: 120 },
          {
            props: 'materialsCode',
            label: '订单物料码',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.navigateToRoute({
                  path: '/sales/datacenter/materials/vehicleMaterials/edit',
                  query: {
                    id: row.materialsId
                  }
                }, true);
              },
              type: 'primary'
            }]
          },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 500 },
          { props: 'buyerName', label: '购车人姓名', visible: true, width: 120, mask: true, getValue: (row) => getDecryptField(row.id, 'buyerName') },
          { props: 'buyerPhone', label: '购车人手机号', visible: true, width: 150, mask: true, getValue: (row) => getDecryptField(row.id, 'buyerPhone') },
          {
            props: 'originalVin',
            label: '原车VIN号',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDecryptField(row.id, 'originalVin'),
            buttons: [{
              click: (rowIndex, row) => {
                if (row.originalVin) {
                  // 直接用 then，不会报错
                  getDecryptField(row.id, 'originalVin').then(realVin => {
                    this.navigateToRoute({
                      path: '/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit',
                      query: { vin: realVin }
                    }, true);
                  });
                }
              },
              type: 'primary'
            }]
          },
          { props: 'originalOwnerName', label: '原车车主', visible: true, width: 120, mask: true, getValue: (row) => getDecryptField(row.id, 'originalOwnerName') },
          { props: 'originalOwnerPhone', label: '原车主手机号', visible: true, width: 150, mask: true, getValue: (row) => getDecryptField(row.id, 'originalOwnerPhone') },
          { props: 'firstAuditTime', label: '初审时间', visible: true, width: 180 },
          { props: 'auditTime', label: '审核时间', visible: true, width: 180 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180, sortable: true },
          // { props: 'deliveryTime', label: '交车时间', visible: true, width: 180 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 150,
            buttons: [{
              name: '编辑',
              show: (row) => Number(row.auditStatus) !== 70 && row.permissions.edit && this.permissions.has(`${this.moduleKey}-addOrUpdate`),
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/vrEquityApply/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }]
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
  computed: {
    currentTab () {
      return this.auditTabs.find(t => t.name === this.activeAuditTab) || this.auditTabs[0];
    },
    batchAuditShow () {
      const tab = this.currentTab;
      if (!tab || !tab.showBatch) return false;
      if (tab.name === 'submitted') return this.canBatchFirstAudit;
      if (tab.name === 'firstAudited') return this.canBatchAudit;
      return false;
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.initPermissions();
    this.getData();
  },
  methods: {
    initPermissions () {
      this.canBatchFirstAudit = this.permissions.has(`${this.moduleKey}-batchFirstApprove`);
      this.canBatchAudit = this.permissions.has(`${this.moduleKey}-batchApprove`);
    },
    handleAuditTabClick () {
      // TAB 切换时按 TAB 设置搜索区 auditStatus 默认值：全部→清空；已提交→'30'；已初审→'40'
      this.form.auditStatus = this.currentTab.status || '';
      this.selectionList = [];
      this.optionObj.form.page = 1;
      this.getData();
    },
    openBatchAuditShow () {
      if (this.selectionList.length === 0) {
        this.$message.error('请选择要批量审核的权益申请！');
        return;
      }
      if (!this.validateSelectionStatus()) return;
      this.$refs.auditRef.show();
    },
    validateSelectionStatus () {
      const expected = this.currentTab.status; // '30' 或 '40'
      const invalid = this.selectionList.filter(
        item => String(item.auditStatus) !== expected
      );
      return invalid.length === 0;
    },
    handleBatchAuditSubmit (auditForm) {
      // 二次防御校验
      if (!this.validateSelectionStatus()) return;

      const idList = this.selectionList.map(item => item.id);
      const params = {
        idList,
        isAudit: Boolean(auditForm.result),
        auditOpinion: auditForm.remark || ''
      };

      const apiFn = this.currentTab.name === 'submitted' ? batchFirstApprove : batchApprove;

      return apiFn(params).then(() => {
        this.$message.success('批量审核成功');
        this.selectionList = [];
        this.optionObj.form.page = 1;
        this.getData();
      }).catch(() => {
        // 错误已由 axios 全局拦截器统一提示，此处不再重复弹
      });
    },
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
        path: '/vehretail/orderManager/vrEquityApply/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.activeAuditTab = 'all';
      this.selectionList = [];
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
        businessType: '订单权益申请',
        dataFetchPath: 'vr/web/order/vrEquityApply/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '订单权益申请.xlsx');
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
          const records = (res && res.records) || [];
          this.optionObj.dataList = records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = (res && res.total) || 0;
        }).catch(err => {
          console.error('获取订单权益申请列表失败:', err);
          this.optionObj.dataList = [];
          this.optionObj.total = 0;
        }).finally(() => {
          this.loading = false;
        });
    },
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
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

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      // 申请单状态：用户在下拉中选择的值优先；未选择时按当前 TAB 注入；都没有则不传
      const tab = this.currentTab;
      if (this.form.auditStatus) {
        data.auditStatus = this.form.auditStatus;
      } else if (tab && tab.status) {
        data.auditStatus = tab.status;
      } else {
        delete data.auditStatus;
      }

      if (this.form.submitTime) {
        delete data.submitTime;
        if (this.form.submitTime.length > 1) {
          data.submitTimeStart = this.form.submitTime[0];
          data.submitTimeEnd = this.form.submitTime[1];
        }
      }
      if (this.form.depositTime) {
        delete data.depositTime;
        if (this.form.depositTime.length > 1) {
          data.depositTimeStart = this.form.depositTime[0];
          data.depositTimeEnd = this.form.depositTime[1];
        }
      }
      if (this.form.lockTime) {
        delete data.lockTime;
        if (this.form.lockTime.length > 1) {
          data.lockTimeStart = this.form.lockTime[0];
          data.lockTimeEnd = this.form.lockTime[1];
        }
      }
      if (this.form.deliveryTime) {
        delete data.deliveryTime;
        if (this.form.deliveryTime.length > 1) {
          data.deliveryTimeStart = this.form.deliveryTime[0];
          data.deliveryTimeEnd = this.form.deliveryTime[1];
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

    // 获取车型列表
    async getVehicleModelList (query = '') {
      try {
        const res = await vehicleModelList({
          modelNameLike: query,
          limitSize: 1000
        });
        return res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.name // 使用name作为值
          };
        });
      } catch (error) {
        console.error('获取车型列表失败:', error);
        return [];
      }
    },

    // 获取销售门店列表
    async getDealerList (query = '') {
      try {
        const res = await listOrgStoreInfo({
          storeName: query,
          pageSize: 1000
        });
        return res.records.map(item => {
          return {
            ...item,
            label: item.storeName,
            value: item.storeCode // 使用storeCode作为值
          };
        });
      } catch (error) {
        console.error('获取销售门店列表失败:', error);
        return [];
      }
    },

    // 获取物料码列表
    async getMaterialsCodeList (query = '') {
      try {
        const res = await vehicleMaterials({
          materialsCodeLike: query,
          pageSize: 1000
        });
        return res.map(item => {
          return {
            ...item,
            label: item.materialsCode,
            value: item.materialsCode
          };
        });
      } catch (error) {
        console.error('获取物料码列表失败:', error);
        return [];
      }
    },

    // 获取权益分类列表
    async getEquityCategoryList (query = '') {
      try {
        const res = await getEquityCategoryListApi({
          equityCategoryName: query,
          pageSize: 1000
        });
        return res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.id
          };
        });
      } catch (error) {
        console.error('获取权益分类列表失败:', error);
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-vr-equity-apply-list {
}
</style>
