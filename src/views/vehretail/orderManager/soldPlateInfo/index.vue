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
      <el-form-item label="审核状态 1010-草稿 1020-已提交 1030-已通过 1040-已驳回 1050-已作废">
        <fetch-select
          :request="fetchOptions"
          enumCode="xxx"
          v-model="form.status"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
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
import { getList, deleteItem, enableItem } from '@/api/vehretail/orderManager/soldPlateInfo/index';
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
  status: '',
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
            props: 'id',
            label: '主键',
            visible: false,
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
          { props: 'status', label: '审核状态 1010-草稿 1020-已提交 1030-已通过 1040-已驳回 1050-已作废', visible: true, width: 200 },
          { props: 'soldPlateCode', label: '整车上牌记录编号', visible: true, width: 200 },
          { props: 'deliveryOrderId', label: '交车单ID', visible: true, width: 200 },
          { props: 'retailOrderId', label: '零售订单ID', visible: true, width: 200 },
          { props: 'retailOrderCode', label: '零售订单号', visible: true, width: 200 },
          { props: 'soldPlateSource', label: '已售上牌资料来源 report-特殊销售提报 delivery-交车单 plate-已售上牌新增', visible: true, width: 200 },
          { props: 'vin', label: 'VIN码', visible: true, width: 200 },
          { props: 'modelId', label: '车型ID', visible: true, width: 200 },
          { props: 'modelName', label: '车型名称', visible: true, width: 200 },
          { props: 'saleOrgId', label: '门店id', visible: true, width: 200 },
          { props: 'saleDealerCode', label: '门店编码', visible: true, width: 200 },
          { props: 'saleDealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'carBuyerName', label: '车主姓名', visible: true, width: 200 },
          { props: 'carBuyerPhone', label: '车主电话', visible: true, width: 200 },
          { props: 'idCardType', label: '证件类型：身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20', visible: true, width: 200 },
          { props: 'idCardNo', label: '证件号码', visible: true, width: 200 },
          { props: 'vehiclePurpose', label: '车辆用途 10-私家车 20-公户车 30-试乘试驾车 40-大客户用车 50-营运-预约出租客运 100-其他', visible: true, width: 200 },
          { props: 'carSaleSversionId', label: '公告车型ID', visible: true, width: 200 },
          { props: 'carSalesVersionName', label: '公告车型名称', visible: true, width: 200 },
          { props: 'vehiclePlaceOrigin', label: '产地', visible: true, width: 200 },
          { props: 'enginenNumber', label: '发动机号', visible: true, width: 200 },
          { props: 'certificateNo', label: '合格证号', visible: true, width: 200 },
          { props: 'invoiceRecordCode', label: '整车开票记录编号', visible: true, width: 200 },
          { props: 'specialReportCode', label: '特殊车辆销售提报编号', visible: true, width: 200 },
          { props: 'drivingLicenseVin', label: '行驶证VIN号', visible: true, width: 200 },
          { props: 'drivingLicenseOwner', label: '行驶证所有人', visible: true, width: 200 },
          { props: 'plateNo', label: '车牌号码', visible: true, width: 200 },
          { props: 'plateDate', label: '上牌日期', visible: true, width: 200 },
          { props: 'provinceCode', label: '上牌省份编码', visible: true, width: 200 },
          { props: 'provinceName', label: '上牌省份', visible: true, width: 200 },
          { props: 'cityCode', label: '上牌城市编码', visible: true, width: 200 },
          { props: 'cityName', label: '上牌城市', visible: true, width: 200 },
          { props: 'districtCode', label: '上牌区&#x2F;县编码', visible: true, width: 200 },
          { props: 'districtName', label: '上牌区&#x2F;县', visible: true, width: 200 },
          { props: 'vehicleRegisterAddress', label: '车辆注册地址', visible: true, width: 200 },
          { props: 'drivingLicenseNumber', label: '行驶证编号', visible: true, width: 200 },
          { props: 'drivingLicenseBrandModel', label: '行驶证品牌型号', visible: true, width: 200 },
          { props: 'submitTime', label: '提交审核时间', visible: true, width: 200 },
          { props: 'submitUser', label: '提交人', visible: true, width: 200 },
          { props: 'auditUser', label: '审核人', visible: true, width: 200 },
          { props: 'withdrawUser', label: '撤回人', visible: true, width: 200 },
          { props: 'auditRemark', label: '审核意见', visible: true, width: 200 },
          { props: 'autoAuditStatus', label: '是否自动审核 0-否 1-是（默认否）', visible: true, width: 200 },
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
                  path: '/vehretail/orderManager/soldPlateInfo/edit',
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
        dataFetchPath: 'vehretail/web/orderManager/soldPlateInfo/page',
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
.m-sold-plate-info-list {
}
</style>
