<template>
  <div class="page-common m-sold-plate-info-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="VIN">
        <tag-input v-model="form.vinList" placeholder="请输入VIN" clearable />
      </el-form-item>
      <el-form-item label="审核状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vehretail_order_change_apply_status"
          v-model="form.status"
          placeholder="请选择"
          clearable
        />
      </el-form-item>
      <el-form-item label="是否自动审核">
        <fetch-select
          :request="fetchOptions"
          enumCode="BooleanEnum"
          v-model="form.autoAuditStatus"
          placeholder="请选择"
          clearable
        />
      </el-form-item>
      <el-form-item label="车型名称">
        <fetch-select
          filterable
          clearable
          remote
          reserve-keyword
          v-model="form.modelId"
          :remote-method="vehicleModelSearch"
          :params="form.modelId"
          value-key="id"
          label-key="name"
          placeholder="请选择"
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="车主信息">
          <el-input v-model="form.searchContentPc" placeholder="请输入车主姓名/电话/证件号码" clearable />
        </el-form-item>
        <el-form-item label="交车时间">
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
        <el-form-item label="上牌日期">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.plateDate"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="审核时间">
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
        <el-form-item label="创建时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.createTime"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
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
<!--      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>-->
      <el-button size="small" @click="handleBatchSubmit">提交审核</el-button>
      <el-button size="small" @click="openBatchAuditShow">批量审核</el-button>
      <el-button size="small" @click="handleBatchCancel">作废</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
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
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>

      <audit-dialog
        ref="auditRef"
        :maxlength="100"
        @audit="handleBatchAudit"
      />
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
import {
  aggregatePage,
  deleteItem,
  enableItem,
  submitBatch,
  // revocation,
  revocationBatch, cancelBatch, auditBatch
} from '@/api/vehretail/orderManager/soldPlateInfo/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listVehicleModel } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import auditDialog from '@/libs/components/auditDialog/index.vue';

const defaultForm = {
  vin: '',
  status: '',
  autoAuditStatus: '',
  modelName: '',
  modelId: '',
  carBuyerInfo: '',
  createTimeRange: '',
  createTimeStart: null,
  createTimeEnd: null,
  searchContentPc: ''
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    auditDialog,
    TagInput,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload
  },
  data () {
    return {
      pageTitle: '已售上牌车辆资料管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVRFDI-soldPlateInfo',
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
        id: 'soldPlateInfoTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'soldPlateCode',
            label: '已售上牌资料编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/soldPlateInfo/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'statusLabel', label: '审核状态', visible: true, width: 200 },
          { props: 'autoAuditStatusLabel', label: '是否自动审核', visible: true, width: 200 },
          { props: 'auditTime', label: '审核时间', visible: true, width: 200 },
          { props: 'deliveryTime', label: '交车时间', visible: true, width: 200 },
          { props: 'vin', label: 'VIN', visible: true, width: 200 },
          { props: 'modelName', label: '车型名称', visible: true, width: 200 },
          { props: 'carSalesVersionName', label: '公告车型', visible: true, width: 200 },
          { props: 'carBuyerName', label: '车主姓名', visible: true, width: 200 },
          { props: 'carBuyerPhone', label: '车主电话', visible: true, width: 200 },
          { props: 'idCardType', label: '证件类型', visible: true, width: 200 },
          { props: 'idCardNo', label: '证件号码', visible: true, width: 200 },
          { props: 'invoiceNo', label: '发票号码', visible: true, width: 200 },
          { props: 'invoiceTime', label: '开票日期', visible: true, width: 200 },
          { props: 'invoiceAmount', label: '发票金额', visible: true, width: 200, align: 'right' },
          { props: 'plateNo', label: '车牌号码', visible: true, width: 200 },
          { props: 'vehicleRegisterAddress', label: '车辆注册地址', visible: true, width: 200 },
          { props: 'plateDate', label: '上牌日期', visible: true, width: 200 },
          { props: 'provinceName', label: '上牌省份', visible: true, width: 200 },
          { props: 'cityName', label: '上牌城市', visible: true, width: 200 },
          { props: 'saleDealerName', label: '门店', visible: true, width: 200 },
          { props: 'drivingLicenseNumber', label: '行驶证编号', visible: true, width: 200 },
          { props: 'vehiclePurpose', label: '车辆用途', visible: true, width: 200 },
          { props: 'auditRemark', label: '审核意见', visible: true, width: 200 },
          { props: 'submitTime', label: '提交时间', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          // 以下字段不在指定列表中，设置为隐藏
          { props: 'deliveryOrderId', label: '交车单ID', visible: false, width: 200 },
          { props: 'retailOrderId', label: '零售订单ID', visible: false, width: 200 },
          { props: 'retailOrderCode', label: '零售订单号', visible: false, width: 200 },
          { props: 'soldPlateSource', label: '已售上牌资料来源', visible: false, width: 200 },
          { props: 'modelId', label: '车型ID', visible: false, width: 200 },
          { props: 'saleOrgId', label: '门店id', visible: false, width: 200 },
          { props: 'saleDealerCode', label: '门店编码', visible: false, width: 200 },
          { props: 'carSaleSversionId', label: '公告车型ID', visible: false, width: 200 },
          { props: 'vehiclePlaceOriginLabel', label: '产地', visible: false, width: 200 },
          { props: 'enginenNumber', label: '发动机号', visible: false, width: 200 },
          { props: 'certificateNo', label: '合格证号', visible: false, width: 200 },
          { props: 'invoiceRecordCode', label: '整车开票记录编号', visible: false, width: 200 },
          { props: 'specialReportCode', label: '特殊车辆销售提报编号', visible: false, width: 200 },
          { props: 'drivingLicenseVin', label: '行驶证VIN号', visible: false, width: 200 },
          { props: 'drivingLicenseOwner', label: '行驶证所有人', visible: false, width: 200 },
          { props: 'provinceCode', label: '上牌省份编码', visible: false, width: 200 },
          { props: 'cityCode', label: '上牌城市编码', visible: false, width: 200 },
          { props: 'districtCode', label: '上牌区/县编码', visible: false, width: 200 },
          { props: 'districtName', label: '上牌区/县', visible: false, width: 200 },
          { props: 'drivingLicenseBrandModel', label: '行驶证品牌型号', visible: false, width: 200 },
          { props: 'submitUser', label: '提交人', visible: false, width: 200 },
          { props: 'auditUser', label: '审核人', visible: false, width: 200 },
          { props: 'withdrawUser', label: '撤回人', visible: false, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [
              {
                name: '编辑',
                click: (rowIndex, row) => {
                  this.$router.push({
                    path: '/vehretail/orderManager/soldPlateInfo/edit',
                    query: {
                      id: row.id,
                      isEditing: true
                    }
                  });
                },
                type: 'info',
                show: (row) => row.status === 1010 || row.status === 1040
              }
            ]
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
        path: '/vehretail/orderManager/soldPlateInfo/edit'
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
        businessType: '已售上牌车辆资料管理',
        dataFetchPath: '/vr/web/delivery/soldPlateInfo/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '已售上牌车辆资料管理.xlsx');
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

      aggregatePage({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
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
      const timeFields = ['createTime', 'plateDate', 'auditTime', 'deliveryTime'];
      timeFields.forEach(field => {
        if (this.form[field]) {
          delete data[field];
          if (this.form[field].length > 1) {
            data[`${field}Start`] = this.form[field][0];
            data[`${field}End`] = this.form[field][1];
          }
        }
      });
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
    vehicleModelSearch (val) {
      const params = {
        modelNameLike: val,
        pageSize: 100
      };
      return listVehicleModel(params);
    },
    handleCreateTimeChange (createTimeRange) {
      if (createTimeRange && createTimeRange.length > 1) {
        this.form.createTimeStart = createTimeRange[0];
        this.form.createTimeEnd = createTimeRange[1];
      } else {
        this.form.createTimeStart = null;
        this.form.createTimeEnd = null;
      }
    },
    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      if (ids.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的项'
        });
        return;
      }
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
        });
      }).catch(() => {});
    },
    handleBatchSubmit () {
      const ids = this.selectionList.map(item => item.id) || [];
      if (ids.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要提交审核的项'
        });
        return;
      }
      // 判断状态只能为1010
      const errorStatusIds = this.selectionList.filter(item => item.status !== 1010)
        .map(item => item.soldPlateCode);
      if (errorStatusIds && errorStatusIds.length > 0) {
        this.$message({
          type: 'warning',
          message: `单据状态不为草稿状态不允许操作：${errorStatusIds.join(',')}`
        });
        return;
      }
      submitBatch(ids).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功!'
        });
        this.getData();
      }).catch(() => {
      });
    },
    handleBatchRevocation () {
      const ids = this.selectionList.map(item => item.id) || [];
      if (ids.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要撤回的项'
        });
        return;
      }
      revocationBatch(ids).then(() => {
        this.$message({
          type: 'success',
          message: '撤回操作成功!'
        });
        this.getData();
      }).catch(() => {
      });
    },
    handleBatchCancel () {
      const ids = this.selectionList.map(item => item.id) || [];
      if (ids.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要作废的项'
        });
        return;
      }
      // 判断状态只能为1010
      const errorStatusIds = this.selectionList.filter(item => item.status !== 1010)
        .map(item => item.soldPlateCode);
      if (errorStatusIds && errorStatusIds.length > 0) {
        this.$message({
          type: 'warning',
          message: `单据状态不为草稿状态不允许操作：${errorStatusIds.join(',')}`
        });
        return;
      }
      cancelBatch(ids).then(() => {
        this.$message({
          type: 'success',
          message: '作废成功!'
        });
        this.getData();
      }).catch(() => {
      });
    },
    openBatchAuditShow () {
      const ids = this.selectionList.map(item => item.id) || [];
      if (ids.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要审核的项'
        });
        return;
      }
      // 判断状态只能为 1020
      const errorStatusIds = this.selectionList.filter(item => item.status !== 1020).map(item => item.soldPlateCode);
      if (errorStatusIds && errorStatusIds.length > 0) {
        this.$message({
          type: 'warning',
          message: `单据状态不为已提交状态不允许操作：${errorStatusIds.join(',')}`
        });
        return;
      }
      this.$refs.auditRef.show();
    },
    // 提交审批结果
    handleBatchAudit (auditForm) {
      auditForm.ids = this.form.ids;
      auditForm.auditResult = auditForm.result;
      auditForm.auditRemark = auditForm.remark;
      auditBatch(auditForm).then(() => {
        this.getData();
      });
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
.m-sold-plate-info-list {
}
</style>
