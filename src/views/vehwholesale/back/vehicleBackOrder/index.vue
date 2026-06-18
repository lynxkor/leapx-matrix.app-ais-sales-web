<template>
  <div class="page-common m-vehicle-back-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
    <el-form-item label="经销商"  >
       <fetch-select
          filterable
          clearable
          remote
            v-model="form.dealerCompanyCodes"
            :remote-method="listNetworkParentCompany"
            labelKey="companyName"
            valueKey="companyCode"
            multiple
        />
      </el-form-item>
      <el-form-item label="单据类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_vehicle_back_order_type"
            v-model="form.orderTypes"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="企业客户名称" v-show="this.visibleCount === 3 || show">
          <fetch-select
              :remote-method="listNetworkParentCompany"
              remote
              v-model="form.entCustomerCodes"
              placeholder="请选择"
              labelKey="companyName"
              valueKey="companyCode"
              clearable
              collapseTags
              filterable
              multiple
        />
        </el-form-item>
      <template v-if="show">
        <el-form-item label="退车日期">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.backTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
         <el-form-item label="退车订单状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vw_vehicle_back_order_audit_status"
          v-model="form.auditStatuses"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
        <el-form-item label="所属大区">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.regionCodes"
            :remote-method="getRegionList"
            multiple
            value-key="orgCode"
            label-key="orgName"
          />
        </el-form-item>
        <el-form-item label="退车类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_vehicle_back_type"
            v-model="form.backTypes"
            placeholder="请选择"
            clearable
            multiple
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
        <el-dropdown trigger="click" style="margin-right: 10px;" @command="handleAdd">
        <el-button size="small" type="primary" @click="showDropdown">
          {{ dropdownLoading ? '加载中...' : '新增整车退车订单' }}
          <i class="iconfont icon-lxppc-down" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in validatedOrderategoryList"
            :key="index"
            :command="item.code">
            {{ item.message }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button> -->
      <el-button v-permission="moduleKey+'-audit'"  size="small" @click="handleAudit" :disabled="selectionList.length === 0">审核</el-button>
      <el-button v-permission="moduleKey+'-cancel'" size="small" @click="handleCancel" :disabled="selectionList.length === 0">作废</el-button>
      <el-button v-if="canExport"  size="small" @click="exportExcel">导出</el-button>
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
    <audit-dialog
      ref="auditRef"
      @audit="handleBatchAudit"
      :auditDataList="[]"
      :maxlength='150'
    />
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
import { getList, deleteItem, enableItem, audit, cancel } from '@/api/vehwholesale/back/vehicleBackOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getRigion, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import auditDialog from '@/libs/components/auditDialog';
import { networkParentCompanyItem } from '@/api/vehwholesale/replenish/entVehicleReplenishOrder/index';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  createTime: '',
  status: '',
  dealerCompanyName: '',
  entCustomerName: '',
  returnTime: '',
  regionName: '',
  returnType: '',
  orderType: '',
  auditStatus: '',
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
      pageTitle: '整车退车订单',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-vehicleBackOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      validatedOrderategoryList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      dropdownLoading: false,
      clickItemId: '',
      optionObj: {
        id: 'vehicleBackOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'backOrderCode',
            label: '退车订单号',
            visible: true,
            width: 150,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/back/vehicleBackOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'auditStatusLabel', label: '退车订单状态', visible: true, width: 120 },
          { props: 'backTime', label: '退车日期', visible: true, width: 160 },
          {
            props: 'dealerCompanyName',
            label: '经销商',
            visible: true,
            width: 240,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.dealerCompanyCode) {
                  window.open(`/partner/channelManagement/companyDetails?companyCode=${row.dealerCompanyCode}`, '_blank');
                }
              },
              type: 'primary'
            }]
          },
          { props: 'regionName', label: '所属大区', visible: true, width: 120 },
          {
            props: 'entCustomerName',
            label: '企业客户',
            visible: true,
            width: 120,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.entCustomerCode) {
                  window.open(`/partner/channelManagement/companyDetails?companyCode=${row.entCustomerCode}`, '_blank');
                }
              },
              type: 'primary'
            }]
          },
          { props: 'backTypeLabel', label: '退车类型', visible: true, width: 120 },
          { props: 'orderTypeLabel', label: '单据类型', visible: true, width: 120 },
          { props: 'remark', label: '退车备注', visible: true, width: 200 },
          { props: 'auditorName', label: '审核人', visible: true, width: 100 },
          { props: 'auditTime', label: '审核时间', visible: true, width: 160 },
          { props: 'auditOpinion', label: '退车审核说明', visible: true, width: 200 },
          { props: 'creatorName', label: '创建人', visible: true, width: 100 },
          { props: 'createTime', label: '创建时间', visible: true, width: 160 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              show: (row) => {
                return row.auditStatus === 10 || row.auditStatus === 20;
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/back/vehicleBackOrder/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
              show: (row) => {
                return row.auditStatus === 10 || row.auditStatus === 20;
              },
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '删除',
              popconfirmTitle: '此操作将永久删除, 是否继续?',
              click: (rowIndex, row) => {
                deleteItem(
                  { idSet: [row.id] }
                ).then(() => {
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
    this.fetchOrderCategoryOptions();
  },
  methods: {
    async fetchOrderCategoryOptions () {
      const response = await getEnum('vw_vehicle_back_order_type');
      this.orderCategoryOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['10', '20'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    async showDropdown () {
      this.dropdownLoading = true;
      try {
        // 又不要校验了
        // await createRequestValid();
        this.dropdownLoading = false;
        this.validatedOrderategoryList = [...this.orderCategoryOptions];
      } catch (error) {
        this.dropdownLoading = false;
        this.validatedOrderategoryList = [];
      }
    },
    async getDealerListByName (params) {
      return await listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    async getRegionList (params) {
      return getRigion({ orgName: params });
    },
    async listNetworkParentCompany (query) {
      return networkParentCompanyItem({ parentCompanyName: query, pageNum: 1, pageSize: 20 });
    },
    handleBatchAudit (data) {
      let params = {
        idSet: this.selectionList.map(item => item.id) || [],
        audit: data.result,
        opinion: data.remark
      };
      return audit(params).then(() => {
        if (params.audit === 1) {
          this.$message({
            type: 'success',
            message: '审批成功'
          });
        } else if (params.audit === 0) {
          this.$message({
            type: 'success',
            message: '驳回成功'
          });
        }
        this.getData();
      });
    },
    handleAudit () {
      this.$refs.auditRef.show();
      this.$refs.auditRef.auditForm.result = 1;
    },
    handleCancel () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('是否对选中数据进行作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancel({ idSet: ids }).then(() => {
          this.$message({
            type: 'success',
            message: '作废成功!'
          });
          this.getData();
        });
      }).catch(() => {});
    },
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
    handleAdd (code) {
      this.$router.push({
        path: '/vehwholesale/back/vehicleBackOrder/edit',
        query: {
          orderCategory: code
        }
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
        businessType: '整车批售-批售管理-整车退车订单管理',
        dataFetchPath: 'vw/web/back/vehicleBackOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车退车订单管理.xlsx');
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
          this.optionObj.dataList = (res?.records || []).map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res?.total || 0;
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
      // 退车日期 backTime
      if (this.form.backTime) {
        delete data.backTime;
        if (this.form.backTime.length > 1) {
          data.backTimeStart = this.form.backTime[0];
          data.backTimeEnd = this.form.backTime[1];
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
.m-vehicle-back-order-list {
}
</style>
