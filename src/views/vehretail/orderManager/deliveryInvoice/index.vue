<template>
  <div class="page-common m-delivery-invoice-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="VIN码">
        <tag-input
          placeholder="请输入"
          v-model="form.matchVinList"
          clearable
        />
      </el-form-item>
      <el-form-item label="整车开票状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vr_delivery_invoice_status"
          v-model="form.statusIncludeList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="车辆属性">
        <fetch-select
          :request="fetchOptions"
          enumCode="vehicle_attribute_type"
          v-model="form.vehicleAttribute"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <template v-if="show">
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
        <el-form-item label="交付门店">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.deliveryDealerCode"
            :remote-method="saleDealerSearch"
            value-key="storeCode"
            label-key="storeName"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="车主信息">
          <el-input
            placeholder="请输入"
            v-model="form.buyerInfo"
            clearable
          />
        </el-form-item>
        <el-form-item label="交车单">
          <tag-input
            placeholder="请输入"
            v-model="form.deliveryOrderCodeList"
            clearable
          />
        </el-form-item>
        <el-form-item label="整车订单">
          <tag-input
            placeholder="请输入"
            v-model="form.retailOrderCodeList"
            clearable
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.createTimeRange"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
           @change="handleCreateTimeChange"
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
<!--      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>-->
<!--      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>-->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button size="small" @click="handleBatchCancel" :disabled="selectionList.length === 0">批量作废</el-button>
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
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { batchCancel, enableItem, getList } from '@/api/vehretail/orderManager/deliveryInvoice/index';
import { exportTable, getEnum, getTableConfig, listOrgStoreInfo, tableAddOrUpdate } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel, handleBatchStatusChange } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput/index.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  status: '',
  deliveryInvoiceCode: '',
  deliveryOrderCode: '',
  retailOrderCode: '',
  createTime: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    TagInput,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload
  },
  data () {
    return {
      pageTitle: '整车开票记录',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVRFDI-deliveryInvoice',
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
        id: 'deliveryInvoiceTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'deliveryInvoiceCode',
            label: '开票记录编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/deliveryInvoice/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'vin', label: 'VIN', visible: true, width: 200 },
          { props: 'statusLabel', label: '整车开票状态', visible: true, width: 200 },
          { props: 'invoiceTime', label: '开票时间', visible: true, width: 200 },
          { props: 'invoiceName', label: '开票名称', visible: true, width: 200 },
          { props: 'vehicleAttribute', label: '车辆属性', visible: true, width: 200 },
          { props: 'orderCarBuyerPhone', label: '购车人手机号码', visible: true, width: 200 },
          { props: 'orderIdCardTypeLabel', label: '车主证件类型', visible: true, width: 200 },
          { props: 'orderIdCardNo', label: '车主证件号码', visible: true, width: 200 },
          { props: 'invoiceNo', label: '发票号码', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店', visible: true, width: 200 },
          { props: 'deliveryDealerName', label: '交付门店', visible: true, width: 200 },
          { props: 'deliveryOrderCode', label: '交车单', visible: true, width: 200 },
          { props: 'mallOrderCode', label: '商城订单编号', visible: true, width: 200 },
          { props: 'retailOrderCode', label: '整车订单', visible: true, width: 200 },
          { props: 'invoiceCode', label: '发票代码', visible: false, width: 200 },
          { props: 'invoiceAmount', label: '发票金额', visible: false, width: 200 },
          { props: 'certificateNo', label: '发票合格证号', visible: false, width: 200 },
          { props: 'engineNumber', label: '发票发动机号', visible: false, width: 200 },
          { props: 'carBuyerName', label: '证件识别的客户姓名', visible: false, width: 200 },
          { props: 'idCardNo', label: '证件识别的证件号码', visible: false, width: 200 },
          { props: 'idCardType', label: '证件类型标签', visible: false, width: 200 },
          { props: 'paymentTime', label: '缴定金时间', visible: true, width: 200 },
          { props: 'lockTime', label: '锁单时间', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/deliveryInvoice/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info',
              show: (row) => row.status === 0
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
        path: '/vehretail/orderManager/deliveryInvoice/edit'
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
        businessType: '整车开票记录',
        dataFetchPath: '/vr/web/delivery/deliveryInvoice/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车开票记录.xlsx');
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
    async saleDealerSearch (val) {
      const params = {
        keyword: val,
        pageSize: 5000
      };
      return await listOrgStoreInfo(params);
    },
    // 批量作废
    handleBatchCancel () {
      const ids = this.selectionList.map(item => item.id) || [];
      const statusValidateErrIds = this.selectionList.filter(item => item.status !== 0).map(item => item.id);
      if (statusValidateErrIds.length > 0) {
        this.$message({
          type: 'warning',
          message: '请选择状态为[草稿]的项'
        });
        return;
      }
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">此操作将作废所选开票记录, 是否继续</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        batchCancel(ids).then(() => {
          this.$message({
            type: 'success',
            message: '作废成功!'
          });
          this.getData();
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
  }
};
</script>

<style lang="scss" scoped>
.m-delivery-invoice-list {
}
</style>
