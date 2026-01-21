<template>
  <div class="page-common m-vehwholesale\replenish\dealer-vehicle-replenish-apply-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="整车补货单号">
        <el-input
          placeholder="请输入"
          v-model="form.replenishApplyCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="销售门店">
        <fetch-select
          filterable
          clearable
          multiple
          remote
          collapseTags
          v-model="form.saleDealerCodes"
          :remote-method="getDealerListByName"
          value-key="storeCode"
          label-key="storeName"
        />
      </el-form-item>
      <el-form-item label="审核状态"  v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="vw_replenish_audit_status"
          v-model="form.auditStatus"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="所属大区">
          <fetch-select
            filterable
            clearable
            remote
            multiple
            collapse-tags
            v-model="form.regionCodes"
            :remote-method="getRegionList"
            value-key="orgCode"
            label-key="orgName"
          />
        </el-form-item>
        <el-form-item label="批售方式">
          <fetch-select
            :remote-method="getWholesaleWayList"
            remote
            v-model="form.wholesaleWay"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="专项活动">
          <fetch-select
            :remote-method="prodScheduleActivitySearch"
            remote
            reserve-keyword
            labelKey="name"
            valueKey="id"
            v-model="form.prodScheduleActivityId"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="车系组合">
          <el-input
            placeholder="请输入"
            v-model="form.serials"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单分类">
          <fetch-select
            :request="fetchOptions"
            enumCode="ws_order_category"
            v-model="form.orderCategory"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="结算资金类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_fundtype"
            v-model="form.fundTypes"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="金融机构">
          <fetch-select
            :remote-method="repairItemSearch"
            remote
            reserve-keyword
            labelKey="name"
            valueKey="id"
            v-model="form.financialOrganizationId"
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
      <el-button size="small" @click="vehicleWholesale">厂端现车批售</el-button>
      <el-dropdown trigger="click" style="margin: 0 10px;">
        <el-button size="small" type="primary" @click="showDropdown">
          {{ dropdownLoading ? '加载中...' : '创建排产申请' }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in validatedOrderategoryList"
            :key="index"
            :command="item.code"
            @click="handleAdd(item.code)">
            {{ item.message }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="small" @click="factoryAuditValid(true)" :disabled="selectionList.length === 0">批量审核通过</el-button>
      <el-button size="small" @click="factoryAuditValid(false)" :disabled="selectionList.length === 0">批量审核驳回</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
    </div>
    <div
      class="ais-table-c"
    >
      <div>
        <el-tabs v-model="tabName" type="card" @tab-click="handleClickTab">
          <el-tab-pane label="全部" name="1"></el-tab-pane>
          <el-tab-pane label="待门店审核" name="2"></el-tab-pane>
          <el-tab-pane label="待审现车批售" name="3"></el-tab-pane>
          <el-tab-pane label="待审排产商品车" name="4"></el-tab-pane>
          <el-tab-pane label="待审展车" name="5"></el-tab-pane>
          <el-tab-pane label="待审试驾车" name="6"></el-tab-pane>
        </el-tabs>
      </div>
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
    <vehicle-wholesale-dialog ref="vehicleWholesale" :dealerCompanyName="'dealerCompanyName'" @confirm="getData" />
    <BatchAuditInput
      :visible.sync="showAuditDialog"
      :audit-ids="selectionList.map(item => item.id)"
      :isApprove="isApprove"
      @confirm="factoryApproval"
    />
    <!-- TIPS: 填入项目id即可 -->
    <!-- <Upload
      :visible="uploadDialogVisible"
      :id="1"
      @close="handleUploadDialogClose"
    /> -->
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, createRequestValid, factoryAuditValid, factoryApproval } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApply/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getRigion, listOrgStoreInfo } from '@/api/common';
import { listIdNames as listFinancialOrganization } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import { listIdNames as listWholesaleProdScheduleActivity } from '@/api/vehwholesale/basic/wholesaleProdScheduleActivity/index';
import FetchSelect from '@/libs/components/FetchSelect';
// import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import vehicleWholesaleDialog from './vehicleWholesaleDialog.vue';
import BatchAuditInput from './BatchAuditInput.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  replenishApplyCode: '',
  saleDealerCodes: [],
  auditStatus: '',
  regionCodes: [],
  wholesaleWay: '',
  prodScheduleActivityId: '',
  serials: '',
  orderCategory: '',
  settleFundType: '',
  financialOrganizationId: '',
  queryTab: '1'
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    vehicleWholesaleDialog,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    BatchAuditInput
    // Upload
  },
  data () {
    return {
      pageTitle: '整车批售-批售主数据-整车门店补货申请管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-dealerVehicleReplenishApply',
      form: {
        ...defaultForm
      },
      selectionList: [],
      showAuditDialog: false,
      isApprove: true,
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      dropdownLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      orderategoryList: [],
      validatedOrderategoryList: [],
      tabName: '1',
      optionObj: {
        id: 'dealerVehicleReplenishApplyTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'replenishApplyCode',
            label: '整车补货单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/replenish/dealerVehicleReplenishApply/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'saleDealerName', label: '销售门店名称', visible: true, width: 200 },
          { props: 'auditStatusLabel', label: '审核状态', visible: true, width: 200 },
          { props: 'regionName', label: '所属大区', visible: true, width: 200 },
          { props: 'wholesaleWayLabel', label: '批售方式', visible: true, width: 200 },
          { props: 'prodScheduleActivityName', label: '专项活动', visible: true, width: 200 },
          { props: 'serials', label: '车系组合', visible: true, width: 200 },
          { props: 'orderCategoryLabel', label: '订单分类', visible: true, width: 200 },
          { props: 'applyTotalQty', label: '申请总数量', visible: true, width: 200 },
          { props: 'applyTime', label: '申请时间', visible: true, width: 200 },
          { props: 'applyReason', label: '申请原因', visible: true, width: 200 },
          { props: 'auditDateTime', label: '审批时间', visible: true, width: 200 },
          { props: 'settleFundTypeLabel', label: '结算资金类型', visible: true, width: 200 },
          { props: 'financialOrganizationName', label: '金融机构ID', visible: true, width: 200 },
          { props: 'dealerWarehouseName', label: '门店仓库名称', visible: true, width: 200 },
          { props: 'deliveryDealerName', label: '交付门店名称', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 200 },
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
                  path: '/vehwholesale/replenish/dealerVehicleReplenishApply/edit',
                  query: {
                    id: row.id
                  }
                });
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
    this.getEnum();
  },
  methods: {
    async vehicleWholesale () {
      try {
        await createRequestValid();
        this.$refs.vehicleWholesale.dialogshow();
      } catch (error) {
        // 忽略验证失败的错误，不显示任何提示
      }
    },
    async getEnum () {
      const response = await getEnum('ws_order_category');
      this.orderategoryList = response;
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
    async showDropdown () {
      this.dropdownLoading = true;
      try {
        await createRequestValid();
        this.dropdownLoading = false;
        this.validatedOrderategoryList = [...this.orderategoryList];
      } catch (error) {
        this.dropdownLoading = false;
        this.validatedOrderategoryList = [];
      }
    },
    handleAdd (code) {
      this.$router.push({
        path: '/vehwholesale/replenish/dealerVehicleReplenishApply/edit',
        query: {
          orderCategory: code
        }
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
      exportTable({
        businessType: '整车批售-批售主数据-整车门店补货申请管理',
        dataFetchPath: 'vehwholesale/replenish/dealerVehicleReplenishApply/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车批售-批售主数据-整车门店补货申请管理.xlsx');
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
    },
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    async getRegionList (params) {
      return getRigion({ orgName: params });
    },
    async repairItemSearch (query) {
      return listFinancialOrganization({ organizationNameLike: query, status: 1 });
    },
    async prodScheduleActivitySearch (query) {
      return listWholesaleProdScheduleActivity({ activityNameLike: query, status: 1 });
    },
    async getWholesaleWayList (query) {
      // 不要code为20的
      return this.fetchOptions('vw_wholesale_way').then(list => list.filter(item => item.code !== '20'));
    },
    handleClickTab () {
      this.form.queryTab = this.tabName;
      this.getData();
    },
    factoryAuditValid (data) {
      const ids = this.selectionList.map(item => item.id) || [];
      return factoryAuditValid(ids).then(() => {
        this.showAuditDialog = true;
        this.isApprove = data;
      });
    },
    factoryApproval (data) {
      return factoryApproval(data).then(() => {
        this.$message({
          type: 'success',
          message: '批量审核成功'
        });
        this.getData();
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-vehwholesale\replenish\dealer-vehicle-replenish-apply-list {
}
</style>
