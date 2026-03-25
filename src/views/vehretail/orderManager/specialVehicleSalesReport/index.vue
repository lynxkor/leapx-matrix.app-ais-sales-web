<template>
  <div class="page-common m-refund-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="提报编号">
        <tag-input v-model="form.specialReportCodeList" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="终端状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="special_vehicle_sales_report_status"
          v-model="form.status"
          placeholder="请选择状态"
          clearable
          filterable
        />
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
      <template v-if="show">
        <el-form-item label="车型名称">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.modelName"
            :remote-method="vehicleModelSearch"
            value-key="id"
            label-key="name"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="车辆属性">
          <fetch-select
            :request="fetchOptions"
            enumCode="vehicle_attribute_type"
            v-model="form.vehicleAttribute"
            placeholder="请选择车辆属性"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="VIN码">
          <tag-input v-model="form.vinList" placeholder="请输入VIN码" />
        </el-form-item>
        <el-form-item label="车主信息">
          <el-input v-model="form.carBuyerInfo" placeholder="请输入车主信息" />
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
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
<!--      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>-->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
<!--      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>-->
<!--      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>-->
<!--      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>-->
      <el-button size="small" @click="openBatchCancel">作废</el-button>
      <el-button size="small" @click="handleBatchRevoke">撤回</el-button>
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
    <cancel-dialog
      ref="cancelDialogRef"
      @audit="handleBatchCancel"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, submitReport, cancelReport, revokeReport, adjustVehicleAttribute, batchCancelReports, batchRevokeReports } from '@/api/vehretail/orderManager/specialVehicleSalesReport/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfo, listVehicleModel } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import TagInput from '@/libs/components/TagInput';
import EditPage from './edit.vue';
import CancelDialog from '@/views/vehretail/orderManager/specialVehicleSalesReport/cancelDialog';

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
    TagInput,
    Upload,
    CancelDialog
  },
  computed: {

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
          {
            props: 'specialReportCode',
            label: '提报编号',
            visible: true,
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
          {
            props: 'statusLabel',
            label: '终端状态',
            visible: true,
            width: 120
          },
          { props: 'saleDealerName', label: '销售门店', visible: true, width: 200 },
          { props: 'deliveryDealerName', label: '交付门店', visible: true, width: 200 },
          { props: 'vin', label: 'VIN码', visible: true, width: 200 },
          { props: 'modelName', label: '车型名称', visible: true, width: 200 },
          {
            props: 'vehicleAttributeLabel',
            label: '车辆属性',
            visible: true,
            width: 150
          },
          {
            props: 'vehiclePurposeLabel',
            label: '车辆用途',
            visible: true,
            width: 150
          },
          { props: 'storeInventoryId', label: '门店库存台账', visible: true, width: 150 },
          { props: 'wholesaleOrderCode', label: '整车批售单号', visible: true, width: 150 },
          { props: 'carBuyerName', label: '车主姓名', visible: true, width: 150 },
          { props: 'carBuyerPhone', label: '车主手机号码', visible: true, width: 150 },
          { props: 'idCardType', label: '车主证件类型', visible: true, width: 150 },
          { props: 'idCardNo', label: '车主证件号码', visible: true, width: 150 },
          { props: 'address', label: '车主详细地址', visible: true, width: 150 },
          { props: 'invoiceNo', label: '发票号码', visible: true, width: 180, sortable: true },
          { props: 'invoiceDate', label: '开票日期', visible: true, width: 180, sortable: true },
          { props: 'invoiceAmount', label: '发票金额', visible: true, width: 180, sortable: true },
          { props: 'createTime', label: '创建时间', visible: true, width: 180, sortable: true },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 250,
            buttons: [
              {
                name: '编辑',
                click: (rowIndex, row) => {
                  // 只有草稿状态才能编辑
                  if (row.status === '0' || row.status === 0) {
                    this.$router.push({
                      path: '/vehretail/orderManager/specialVehicleSalesReport/edit',
                      query: {
                        id: row.id,
                        isEditing: true
                      }
                    });
                  } else {
                    this.$message.warning('只有草稿状态的记录才能编辑');
                  }
                },
                type: 'info',
                visible: (row) => {
                  return row.status === '0' || row.status === 0;
                }
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

      if (this.form.submitTimeRange) {
        delete data.submitTimeRange;
        if (this.form.submitTimeRange.length > 1) {
          data.submitTimeStart = this.form.submitTimeRange[0];
          data.submitTimeEnd = this.form.submitTimeRange[1];
        }
      }

      // 排序字段
      data.sortColumns = this.sortColumns;
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
    },

    // 提交操作
    handleSubmit (row) {
      this.$confirm(`确定要提交【${row.specialReportCode || row.id}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submitReport({ id: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getData();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message || '提交失败!'
          });
        });
      }).catch(() => {
        // 用户取消操作
      });
    },

    // 作废操作
    handleCancel (row) {
      this.$prompt('请输入作废说明', '作废说明', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: '作废说明不能为空且不能超过200个字符',
        inputPlaceholder: '请输入作废说明'
      }).then(({ value }) => {
        cancelReport({
          id: row.id,
          remark: value
        }).then(() => {
          this.$message({
            type: 'success',
            message: '作废成功!'
          });
          this.getData();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message || '作废失败!'
          });
        });
      }).catch(() => {
        // 用户取消操作
      });
    },

    // 撤回操作
    handleRevoke (row) {
      this.$prompt('请输入撤回说明', '撤回说明', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: '撤回说明不能为空且不能超过200个字符',
        inputPlaceholder: '请输入撤回说明'
      }).then(({ value }) => {
        revokeReport({
          id: row.id,
          remark: value
        }).then(() => {
          this.$message({
            type: 'success',
            message: '撤回成功!'
          });
          this.getData();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message || '撤回失败!'
          });
        });
      }).catch(() => {
        // 用户取消操作
      });
    },

    // 调整车辆属性操作
    handleAdjustVehicleAttribute (row) {
      this.$prompt('请输入新的车辆属性值', '调整车辆属性', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.vehicleAttribute,
        inputPattern: /^\d+$/,
        inputErrorMessage: '请输入有效的数字',
        inputPlaceholder: '请输入车辆属性值（如：1-家用 2-营运 4-B级车 10-J级车 20-J1级车 30-专车 60-报废灭失）'
      }).then(({ value }) => {
        adjustVehicleAttribute({
          id: row.id,
          vehicleAttribute: parseInt(value)
        }).then(() => {
          this.$message({
            type: 'success',
            message: '调整车辆属性成功!'
          });
          this.getData();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message || '调整车辆属性失败!'
          });
        });
      }).catch(() => {
        // 用户取消操作
      });
    },

    // 批量作废操作
    openBatchCancel () {
      this.$refs.cancelDialogRef.show();
    },
    handleBatchCancel (auditForm) {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选择要批量作废的记录！');
        return;
      }

      // 检查所选记录是否都是草稿状态
      const invalidRecords = this.selectionList.filter(item => item.status !== '0' && item.status !== 0);
      if (invalidRecords.length > 0) {
        this.$message.warning('只能对草稿状态的记录进行批量作废操作！');
        return;
      }
      const ids = this.selectionList.map(item => item.id);
      batchCancelReports({
        ids: ids,
        cancelRemark: auditForm.cancelRemark
      }).then(() => {
        this.$message({
          type: 'success',
          message: '批量作废成功!'
        });
        this.getData();
      });
    },

    // 批量撤回操作
    handleBatchRevoke () {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选择要批量撤回的记录！');
        return;
      }
      // 检查所选记录是否都是已提交状态
      const invalidRecords = this.selectionList.filter(item => item.status !== '1' && item.status !== 1);
      if (invalidRecords.length > 0) {
        this.$message.warning('只能对已提交状态的记录进行批量撤回操作！');
        return;
      }
      const ids = this.selectionList.map(item => item.id);
      batchRevokeReports({
        ids: ids
      }).then(() => {
        this.$message({
          type: 'success',
          message: '批量撤回成功!'
        });
        this.getData();
      });
    },
    async saleDealerSearch (val) {
      const params = {
        isSales: true,
        keyword: val,
        pageSize: 5000
      };
      return await listOrgStoreInfo(params);
    },
    async vehicleModelSearch (val) {
      const params = {
        modelNameLike: val,
        pageSize: 100
      };
      return await listVehicleModel(params);
    }
  }
};
</script>

<style lang="scss" scoped>
.m-special-vehicle-sales-report-list {
}
</style>
