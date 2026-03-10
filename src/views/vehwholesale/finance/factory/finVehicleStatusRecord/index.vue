<template>
  <div class="page-common m-fin-vehicle-status-record-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="融资数据来源">
        <fetch-select
          :request="fetchOptions"
          enumCode="vw_financing_data_source"
          v-model="form.financingDataSource"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="订单号">
        <tag-input
          placeholder="请输入"
          v-model="form.orderCodes"
          clearable
        />
      </el-form-item>
      <el-form-item label="车辆状态"  v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="vw_vehicle_status"
          v-model="form.vehicleStatus"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="VIN号">
          <tag-input
            placeholder="请输入"
            v-model="form.vins"
            clearable
          />
        </el-form-item>
      <el-form-item label="母公司编码">
        <fetch-select
          filterable
          clearable
          remote
          multiple
          v-model="form.mainDealerCompanyCodes"
          :remote-method="getDealerParentOrgListByCode"
          value-key="companyCode"
          label-key="companyCode"
        />
      </el-form-item>
      <el-form-item label="母公司名称">
        <fetch-select
          filterable
          clearable
          remote
          multiple
          v-model="form.mainDealerCompanyCodes"
          :remote-method="getDealerParentOrgListByName"
          value-key="companyCode"
          label-key="companyName"
        />
      </el-form-item>
        <el-form-item label="融资金融机构">
          <fetch-select
            :remote-method="repairItemSearch"
            remote
            reserve-keyword
            multiple
            labelKey="organizationName"
            valueKey="organizationCode"
            v-model="form.fundFinancialOrganizationIds"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="发车日期">
          <el-date-picker
            v-model="form.shipmentDate"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="收车日期">
          <el-date-picker
            v-model="form.receiveDate"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="同步状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_sync_status"
            v-model="form.syncStatus"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <dateranges
            v-model="form.createTime"
            :setDefault="true"
            deftTime="最近三个月"
          />
        </el-form-item>
        <el-form-item label="状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="StatusEnum"
            v-model="form.status"
            placeholder="请选择"
            clearable
            filterable
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
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="1"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehwholesale/finance/factory/finVehicleStatusRecord/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getParentCompany } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import { getList as fundGetList } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import TagInput from '@/libs/components/TagInput';
import dateranges from '@/libs/components/dateranges';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  financingDataSource: '',
  orderCodes: [],
  vehiclestatus: '1',
  vins: [],
  dealerCompanyCode: '',
  dealerCompanyCodes: [],
  dealerCompanyName: '',
  fundFinancialOrganizationIds: [],
  shipmentDate: '',
  receiveDate: '',
  syncStatus: '',
  createTime: '',
  status: '1',
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
    dateranges
  },
  data () {
    return {
      pageTitle: '车辆状态记录',
      pageType: 'list',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-finVehicleStatusRecord',
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
        id: 'finVehicleStatusRecordTable',
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
                  path: '/vehwholesale/finance/factory/finVehicleStatusRecord/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'financingDataSourceLabel', label: '融资数据来源', visible: true, width: 200 },
          { props: 'orderCode', label: '订单号', visible: true, width: 200 },
          { props: 'vehicleStatusLabel', label: '车辆状态', visible: true, width: 200 },
          { props: 'vin', label: 'VIN号', visible: true, width: 200 },
          { props: 'financingAmount', label: '融资金额', visible: true, width: 200 },
          { props: 'taxIncludedPrice', label: '含税价格', visible: true, width: 200 },
          { props: 'dealerCompanyCode', label: '母公司编码', visible: true, width: 200 },
          { props: 'dealerCompanyName', label: '母公司名称', visible: true, width: 200 },
          { props: 'dealerCode', label: '经销商编码', visible: true, width: 200 },
          { props: 'dealerName', label: '经销商名称', visible: true, width: 200 },
          { props: 'unifiedSocialCreditCode', label: '统一社会信用代码', visible: true, width: 200 },
          { props: 'fundFinancialOrganizationName', label: '融资金融机构', visible: true, width: 200 },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 200 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'shipmentDate', label: '发车日期', visible: true, width: 200 },
          { props: 'receiveDate', label: '收车日期', visible: true, width: 200 },
          { props: 'syncStatusLabel', label: '同步状态', visible: true, width: 200 },
          { props: 'syncResult', label: '同步结果', visible: true, width: 200 },
          { props: 'syncCount', label: '推送次数', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'statusLabel', label: '状态', visible: true, width: 200 },
          { props: 'statusDesc', label: '状态变更描述', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
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
        path: '/vehwholesale/finance/factory/finVehicleStatusRecord/edit'
      });
    },
    onSubmit () {
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
        businessType: '车辆状态记录',
        dataFetchPath: 'vw/web/finance/factory/finVehicleStatusRecord/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '车辆状态记录.xlsx');
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
      if (this.form.shipmentDate) {
        delete data.shipmentDate;
        if (this.form.shipmentDate.length > 1) {
          data.shipmentDateStart = this.form.shipmentDate[0];
          data.shipmentDateEnd = this.form.shipmentDate[1];
        }
      }
      if (this.form.receiveDate) {
        delete data.receiveDate;
        if (this.form.receiveDate.length > 1) {
          data.receiveDateStart = this.form.receiveDate[0];
          data.receiveDateEnd = this.form.receiveDate[1];
        }
      }
      if (Array.isArray(this.form.vins) && this.form.vins.length <= 1) {
        delete data.vins;
        data.vinLike = this.form.vins[0] || '';
      }
      if (Array.isArray(this.form.orderCodes) && this.form.orderCodes.length <= 1) {
        delete data.orderCodes;
        data.orderCodeLike = this.form.orderCodes[0] || '';
      }

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
    async repairItemSearch (query) {
      return fundGetList({ organizationNameLike: query, status: 1 });
    },
    async getDealerParentOrgListByCode (params) {
      return getParentCompany({ companyCode: params });
    },
    async getDealerParentOrgListByName (params) {
      return getParentCompany({ companyName: params });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-fin-vehicle-status-record-list {
}
</style>
