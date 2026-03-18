<template>
  <div class="page-common m-special-vehicle-sales-report-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <template v-if="show">
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
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
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
import { getList, deleteItem, enableItem } from '@/api/vehretail/orderManager/specialVehicleSalesReport/index';
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
      pageTitle: '特殊车辆销售提报管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVRFDI-specialVehicleSalesReport',
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
        id: 'specialVehicleSalesReportTable',
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
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/specialVehicleSalesReport/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'status', label: '终端状态 0-草稿 1-已提交 20-作废', visible: true, width: 200 },
          { props: 'specialReportCode', label: '特殊车辆销售提报编号', visible: true, width: 200 },
          { props: 'vin', label: 'VIN码', visible: true, width: 200 },
          { props: 'modelId', label: '车型ID', visible: true, width: 200 },
          { props: 'modelName', label: '车型名称', visible: true, width: 200 },
          { props: 'vehicleAttribute', label: '车辆属性 1-家用 2-营运 4-B级车 10-J级车 20-J1级车 30-专车 60-报废灭失', visible: true, width: 200 },
          { props: 'vehiclePurpose', label: '车辆用途 10-私家车 20-公户车 30-试乘试驾车 40-大客户用车 50-营运-预约出租客运 100-其他', visible: true, width: 200 },
          { props: 'vehicleSalesVersionId', label: '公告车型ID', visible: true, width: 200 },
          { props: 'vehicleSalesVersionName', label: '公告车型名称', visible: true, width: 200 },
          { props: 'vehicleProductArea', label: '产地', visible: true, width: 200 },
          { props: 'enginenNumber', label: '发动机号', visible: true, width: 200 },
          { props: 'certificateNo', label: '合格证号', visible: true, width: 200 },
          { props: 'storeInventoryId', label: '门店库存台账', visible: true, width: 200 },
          { props: 'wholesaleOrderCode', label: '整车批售单号', visible: true, width: 200 },
          { props: 'ocrCarBuyerName', label: '证件识别的客户姓名', visible: true, width: 200 },
          { props: 'ocrIdCardNo', label: '证件识别的证件号码', visible: true, width: 200 },
          { props: 'invoiceEnginenNumber', label: '发票发动机号', visible: true, width: 200 },
          { props: 'invoiceCertificateNo', label: '发票合格证号', visible: true, width: 200 },
          { props: 'invoiceProductionPlace', label: '发票产地', visible: true, width: 200 },
          { props: 'invoiceVin', label: '发票VIN号', visible: true, width: 200 },
          { props: 'brandModel', label: '发票厂牌型号', visible: true, width: 200 },
          { props: 'cancelRemark', label: '作废说明', visible: true, width: 200 },
          { props: 'submitTime', label: '提交时间', visible: true, width: 200 },
          { props: 'carBuyerName', label: '车主姓名', visible: true, width: 200 },
          { props: 'carBuyerPhone', label: '车主手机号码', visible: true, width: 200 },
          { props: 'idCardType', label: '车主证件类型：身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20', visible: true, width: 200 },
          { props: 'idCardNo', label: '车主证件号码', visible: true, width: 200 },
          { props: 'address', label: '车主详细地址', visible: true, width: 200 },
          { props: 'saleOrgId', label: '销售门店ID', visible: true, width: 200 },
          { props: 'saleDealerCode', label: '销售门店编码', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店名称', visible: true, width: 200 },
          { props: 'deliveryOrgId', label: '交付门店ID', visible: true, width: 200 },
          { props: 'deliveryDealerCode', label: '交付门店编码', visible: true, width: 200 },
          { props: 'deliveryDealerName', label: '交付门店名称', visible: true, width: 200 },
          { props: 'exclusiveServiceStoreId', label: '专属服务门店ID', visible: true, width: 200 },
          { props: 'exclusiveServiceStoreCode', label: '专属服务门店编码', visible: true, width: 200 },
          { props: 'exclusiveServiceStoreName', label: '专属服务门店名称', visible: true, width: 200 },
          { props: 'invoiceNo', label: '发票号码', visible: true, width: 200 },
          { props: 'invoiceDate', label: '开票日期', visible: true, width: 200 },
          { props: 'invoiceAmount', label: '发票金额', visible: true, width: 200 },
          { props: 'documentCode', label: '单据编号', visible: true, width: 200 },
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
                  path: '/vehretail/orderManager/specialVehicleSalesReport/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '删除',
              popconfirmTitle: '此操作将永久删除, 是否继续?',
              click: (rowIndex, row) => {
                deleteItem([row.id]).then(() => {
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
              },
              type: 'danger'
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
        path: '/vehretail/orderManager/specialVehicleSalesReport/edit'
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
        businessType: '特殊车辆销售提报管理',
        dataFetchPath: 'vehretail/web/orderManager/specialVehicleSalesReport/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '特殊车辆销售提报管理.xlsx');
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
.m-special-vehicle-sales-report-list {
}
</style>
