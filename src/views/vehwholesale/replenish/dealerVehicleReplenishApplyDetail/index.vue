<template>
  <div class="page-common m-dealer-vehicle-replenish-apply-detail-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
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
      <el-form-item label="批售方式" v-show="this.visibleCount === 3 || show">
        <fetch-select
          :remote-method="getWholesaleWayList"
          remote
          v-model="form.wholesaleWay"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="审核状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_replenish_audit_status"
            v-model="form.auditStatus"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="订单分类">
          <fetch-select
            :options="orderCategoryOptions"
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
            v-model="form.settleFundType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="车系">
          <fetch-select
            filterable
            clearable
            remote
            collapseTags
            v-model="form.seriesId"
            :remote-method="getVehicleSeriesList"
            value-key="id"
            label-key="name"
          />
        </el-form-item>
        <el-form-item label="申请类别">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_replenish_apply_type"
            v-model="form.applyCategory"
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
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApplyDetail/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getRigion, listOrgStoreInfo, vehicleSeriesList } from '@/api/common';
import { listIdNames as listFinancialOrganization } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
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
  auditStatus: '',
  saleDealerCodes: [],
  regionCodes: [],
  applyCategory: '',
  orderCategory: '',
  settleFundType: '',
  financialOrganizationId: '',
  wholesaleWay: '',
  seriesId: ''
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
      pageTitle: '整车门店补货明细',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-dealerVehicleReplenishApplyDetail',
      form: {
        ...defaultForm
      },
      selectionList: [],
      orderCategoryOptions: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'dealerVehicleReplenishApplyDetailTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'replenishApplyDetailCode',
            label: '整车补货明细单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/replenish/dealerVehicleReplenishApplyDetail/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'auditStatusLabel', label: '审核状态', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店名称', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { this.openWindow('/partner/channelManagement/shopDetail?dealerCode=' + row.saleDealerCode); }, type: 'primary' }] },
          { props: 'regionName', label: '所属大区', visible: true, width: 200 },
          { props: 'wholesaleWayLabel', label: '批售方式', visible: true, width: 200 },
          {
            props: 'prodScheduleActivity',
            label: '专项活动名称',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.openWindow('/sales/vehwholesale/basic/wholesaleProdScheduleActivity/edit?id=' + row.prodScheduleActivityId);
              },
              type: 'primary'
            }]
          },
          { props: 'applyCategoryLabel', label: '申请类别', visible: true, width: 200 },
          {
            props: 'seriesName',
            label: '车系名称',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.openWindow('/sales/datacenter/materials/vehicleSeries/edit?id=' + row.seriesId);
              },
              type: 'primary'
            }]
          },
          {
            props: 'modelName',
            label: '车型名称',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.openWindow('/sales/datacenter/materials/vehicleModel/edit?id=' + row.modelId);
              },
              type: 'primary'
            }]
          },
          { props: 'orderCategoryLabel', label: '订单分类', visible: true, width: 200 },
          { props: 'settleFundTypeLabel', label: '结算资金类型', visible: true, width: 200 },
          {
            props: 'financialOrganization',
            label: '金融机构名称',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.openWindow('/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=' + row.financialOrganizationId);
              },
              type: 'primary'
            }]
          },
          { props: 'applyQty', label: '申请数量', visible: true, width: 120, align: 'right' },
          { props: 'replenishApplyCode', label: '整车补货单号', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { this.openWindow('/sales/vehwholesale/replenish/dealerVehicleReplenishApply/edit?id=' + row.replenishApplyId); }, type: 'primary' }] },
          {
            props: 'materialsCode',
            label: '物料编码',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.openWindow('/sales/datacenter/materials/vehicleMaterials/edit?id=' + row.materialsId);
              },
              type: 'primary'
            }]
          },
          {
            props: 'materialsDesc',
            label: '物料描述',
            visible: true,
            width: 240,
            buttons: [{
              click: (rowIndex, row) => {
                this.openWindow('/sales/datacenter/materials/vehicleMaterials/edit?id=' + row.materialsId);
              },
              type: 'primary'
            }]
          },
          { props: 'applyTime', label: '申请时间', visible: true, width: 200 },
          { props: 'auditDateTime', label: '审核时间', visible: true, width: 200 },
          { props: 'applyReason', label: '申请原因', visible: true, width: 200 },
          { props: 'invoiceDiscountTypeLabel', label: '开票优惠类型', visible: true, width: 200 },
          { props: 'invoiceCoefficient', label: '开票系数', visible: true, width: 120, align: 'right' },
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
                  path: '/vehwholesale/replenish/dealerVehicleReplenishApplyDetail/edit',
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
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  mounted () {
    this.fetchOrderCategoryOptions();
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
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
        path: '/vehwholesale/replenish/dealerVehicleReplenishApplyDetail/edit'
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
        businessType: '整车门店补货明细',
        dataFetchPath: 'vw/web/replenish/dealerVehicleReplenishApplyDetail/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车门店补货明细.xlsx');
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
    async getWholesaleWayList (query) {
      // 不要code为20的
      return this.fetchOptions('vw_wholesale_way').then(list => list.filter(item => item.code !== '20'));
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
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async fetchOrderCategoryOptions () {
      const response = await getEnum('vw_order_category');
      console.log('response:', response);
      // 过滤出 code 为 0、2、20 的数据，且确保 code 是字符串类型
      // 0 商品车订单
      // 2 试驾车订单
      // 20 展车订单
      this.orderCategoryOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['0', '2', '20'].includes(codeStr);
      }).map(item => {
        // 确保 code 字段是字符串类型
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-dealer-vehicle-replenish-apply-detail-list {
}
</style>
