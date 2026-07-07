<template>
  <div class="page-common m-ent-vehicle-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="企业客户整车订单号">
           <tag-input v-model="form.entOrderCodes" placeholder="请输入" />
        </el-form-item>
     <el-form-item label="企业客户名称">
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
      <el-form-item label="销售公司" v-show="this.visibleCount === 3 || show">
         <fetch-select
            filterable
            clearable
            remote
            multiple
            v-model="form.saleCompanyIds"
            :params="form.saleCompanyName"
            :remote-method="getCompanyList"
            value-key="id"
            label-key="companyName"
          />
        </el-form-item>
      <template v-if="show">
        <el-form-item label="企业客户补货订单号" >
           <tag-input v-model="form.entReplenishOrderCodes" placeholder="请输入" />
        </el-form-item>
         <el-form-item label="第七大区订单号" >
           <tag-input v-model="form.cbuOrderCodes" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="配车VIN" >
           <tag-input v-model="form.vins" placeholder="请输入" />
        </el-form-item>
         <el-form-item label="下单物料描述" >
           <tag-input v-model="form.orderMaterialsDescs" placeholder="请输入" />
        </el-form-item>
         <el-form-item label="订单分类">
          <fetch-select
              :options="orderCategoryOptions"
              v-model="form.orderCategories"
              placeholder="请选择订单分类"
              clearable
              multiple
              filterable
            />
        </el-form-item>
         <el-form-item label="结算资金类型">
          <fetch-select
          :options="settleFundTypeOptions"
            v-model="form.settleFundTypes"
            placeholder="请选择"
            clearable
            filterable
            multiple
          />
        </el-form-item>
         <el-form-item label="金融机构">
           <fetch-select
          :remote-method="repairItemSearch"
          remote
          multiple
          reserve-keyword
          labelKey="organizationName"
          valueKey="id"
          v-model="form.financialOrganizationIds"
          placeholder="请选择"
          clearable
          filterable
        />
        </el-form-item>
         <el-form-item label="订单时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.orderTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
         <el-form-item label="订单状态">
          <fetch-select
              :options="orderStatusOptions"
              v-model="form.orderStatuses"
              placeholder="请选择订单状态"
              clearable
              multiple
              filterable
            />
      </el-form-item>
      <el-form-item label="结算状态">

            <fetch-select
              :options="settleStatusOptions"
              v-model="form.settleStatuses"
              placeholder="请选择结算状态"
              clearable
              multiple
              filterable
            />
      </el-form-item>
       <el-form-item label="验收方式">
        <fetch-select
          :request="fetchOptions"
          enumCode="vw_acceptance_method"
          v-model="form.acceptanceMethod"
          placeholder="请选择"
          clearable
          filterable
        />
        </el-form-item>
      <el-form-item label="数据来源">
       <fetch-select
          :request="fetchOptions"
          enumCode="vehretail_data_source"
          v-model="form.dataSource"
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
      <button-group collapse-direction="left" maxWidth="95%">
        <el-button v-permission="moduleKey+'-batchAllocateSubmit'" size="small" :disabled="selectionList.length === 0" @click="handleBatchAllocateVehicle">批量配车</el-button>
        <el-button v-permission="moduleKey+'-batchCancelAllocateSubmit'" size="small" :disabled="selectionList.length === 0" @click="handleBatchCancelAllocateVehicle">取消配车</el-button>
        <el-button v-permission="moduleKey+'-batchSettleSubmit'" size="small" :disabled="selectionList.length === 0" @click="handleBatchSettleSubmit">批量结算</el-button>
        <el-button v-permission="moduleKey+'-batchCancelSettleSubmit'" size="small" :disabled="selectionList.length === 0" @click="handleBatchCancelSettle">取消结算</el-button>
        <el-button v-permission="moduleKey+'-batchCancelOrders'" size="small" :disabled="selectionList.length === 0" @click="handleBatchCancel">批量作废</el-button>
        <el-button v-permission="moduleKey+'-setAutoAllocate'" size="small" :disabled="selectionList.length === 0" @click="handleBatchSetAutoAllocate">批量设置自动配车</el-button>
        <el-button v-permission="moduleKey+'-setAutoAllocate'" size="small" :disabled="selectionList.length === 0" @click="handleBatchSetNotAutoAllocate">批量设置不自动配车</el-button>
        <el-button v-permission="moduleKey+'-setEmergencyOrder'" size="small" :disabled="selectionList.length === 0" @click="handleSetEmergencyOrder">设置急单</el-button>
        <el-button v-permission="moduleKey+'-setEmergencyOrder'" size="small" :disabled="selectionList.length === 0" @click="handleCancelEmergencyOrder">取消急单</el-button>
        <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      </button-group>
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
      <BatchCancelInput
      :visible.sync="showBatchCancelDialog"
      :cancel-ids="selectionList.map(item => item.id)"
      @confirm="cancelApproval"
    />
    <SetEmergencyOrderInput
      :visible.sync="showSetEmergencyOrderDialog"
      :emergency-ids="selectionList.map(item => item.id)"
      @confirm="emergencyApproval"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, batchAllocateSubmit, batchCancelAllocateSubmit, batchCancelOrders, batchCancelSettleSubmit, batchSettleSubmit, setAutoAllocate, setEmergencyOrder } from '@/api/vehwholesale/entorder/entVehicleOrder/index';
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
import { getList as companyList } from '@/api/vehwholesale/fund/fundSaleCompany/index';
import BatchCancelInput from './BatchCancelInput.vue';
import SetEmergencyOrderInput from './SetEmergencyOrderInput.vue';
import TagInput from '@/libs/components/TagInput';
import ButtonGroup from '@/libs/components/ButtonGroup';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  status: '',
  dataSource: '',
  entCustomerName: '',
  saleCompanyId: '',
  orderCategory: '',
  entReplenishOrderCode: '',
  settleFundType: '',
  financialOrganizationId: '',
  acceptanceMethod: '',
  orderTime: '',
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
    BatchCancelInput,
    TagInput,
    SetEmergencyOrderInput,
    ButtonGroup
  },
  data () {
    return {
      pageTitle: '企业客户整车订单',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-entVehicleOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      orderCategoryOptions: [],
      saleCompanyOptions: [],
      settleFundTypeOptions: [],
      orderStatusOptions: [],
      settleStatusOptions: [],
      showBatchCancelDialog: false,
      showSetEmergencyOrderDialog: false,
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'entVehicleOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'entOrderCode',
            label: '企业客户整车订单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/entorder/entVehicleOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dataSourceLabel', label: '数据来源', visible: true, width: 200 },
          { props: 'saleCompanyName', label: '销售公司', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/vehwholesale/fund/fundSaleCompany/edit?id=${row.saleCompanyId}`, '_blank'); }, type: 'primary' }] },
          { props: 'entCustomerName', label: '企业客户名称', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/companyDetails?companyCode=${row.entCustomerCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'orderCategoryLabel', label: '订单分类', visible: true, width: 200 },
          { props: 'needAutoAllocateCarLabel', label: '是否需要自动配车', visible: true, width: 200 },
          { props: 'needAsyncSapLabel', label: '是否需要同步SAP', visible: true, width: 200 },
          {
            props: 'entReplenishOrderCode',
            label: '企业客户补货订单号',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/vehwholesale/replenish/entVehicleReplenishOrder/edit?id=${row.entVehicleReplenishOrderId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'taxInvoiceCode', label: '税务发票号', visible: true, width: 200 },
          { props: 'pickupContactName', label: '接车联系人', visible: true, width: 200 },
          { props: 'pickupContactMobile', label: '接车联系电话', visible: true, width: 200 },
          { props: 'terminalStatusLabel', label: '终端状态', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '订单状态', visible: true, width: 200 },
          { props: 'emergencyOrderLabel', label: '是否紧急订单', visible: true, width: 200 },
          { props: 'orderSyncStatusLabel', label: '订单同步状态', visible: true, width: 200 },
          { props: 'allocateStatusLabel', label: '配车状态', visible: true, width: 200 },
          { props: 'settleStatusLabel', label: '结算状态', visible: true, width: 200 },
          { props: 'settleFundTypeLabel', label: '结算资金类型', visible: true, width: 200 },
          {
            props: 'financialOrganizationName',
            label: '金融机构',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=${row.financialOrganizationId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'acceptanceMethodLabel', label: '验收方式', visible: true, width: 200 },
          { props: 'salesMarketLabel', label: '销售市场', visible: true, width: 200 },
          { props: 'vin', label: '配车VIN码', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.saleDealerCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'provinceName', label: '省份', visible: true, width: 200 },
          { props: 'cityName', label: '城市', visible: true, width: 200 },
          { props: 'districtName', label: '区/县', visible: true, width: 200 },
          { props: 'address', label: '交车地址', visible: true, width: 200 },
          { props: 'longitude', label: '经度', visible: true, width: 200 },
          { props: 'latitude', label: '维度', visible: true, width: 200 },
          { props: 'orderTime', label: '订单时间', visible: true, width: 200 },
          { props: 'saleUserName', label: '销售人员', visible: true, width: 200 },
          { props: 'remark', label: '订单备注', visible: true, width: 200 },
          { props: 'allocateTime', label: '配车时间', visible: true, width: 200 },
          { props: 'outboundTime', label: '出库时间', visible: true, width: 200 },
          { props: 'standardPrice', label: '标准价格', visible: true, width: 200 },
          { props: 'salesPrice', label: '销售价格', visible: true, width: 200 },
          { props: 'relatedTxnExTaxPrice', label: '关联交易不含税价', visible: true, width: 200 },
          { props: 'downPaymentRatio', label: '首付款比例', visible: true, width: 200 },
          { props: 'usedCashAmount', label: '使用现金金额', visible: true, width: 200 },
          { props: 'creditSalesAmount', label: '融资金额/赊销金额', visible: true, width: 200 },
          { props: 'clearedFlagLabel', label: '是否还款', visible: true, width: 200 },
          {
            props: 'orderMaterialsCode',
            label: '订单物料编码',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleMaterials/edit?id=${row.orderMaterialsCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'erpSaleOrderCode', label: 'ERP销售订单号', visible: true, width: 200 },
          {
            props: 'modelName',
            label: '车型',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleModel/edit?id=${row.modelId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'yearTypeName',
            label: '年款',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleYearType/edit?id=${row.yearTypeId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'orderMaterialsDesc', label: '订单物料描述', visible: true, width: 200 },
          {
            props: 'drivingRangeName',
            label: '选配续航',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleDrivingRange/edit?id=${row.drivingRangeId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'exteriorName',
            label: '外饰风格',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleExterior/edit?id=${row.exteriorId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'interiorName',
            label: '内饰风格',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleInterior/edit?id=${row.interiorId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'wheelHubName',
            label: '选配轮毂',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleWheelHub/edit?id=${row.wheelHubId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'rangePowerName',
            label: '选配动力',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleRangePower/edit?id=${row.rangePowerId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '更新时间', visible: true, width: 200 },
          { props: 'vehicleReturnFlagLabel', label: '退车标识', visible: true, width: 200 }
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
    this.getCompanyList();
    this.fetchSettleFundTypeOptions();
    this.fetchSOrderStatusOptions();
    this.fetchsettleStatusOptions();
  },
  methods: {
    async fetchsettleStatusOptions () {
      const response = await getEnum('vw_ent_vehicle_order_settle_status');
      this.settleStatusOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['2', '3', '4', '5', '21', '30'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
      console.log(this.settleStatusOptions);
    },
    async fetchSOrderStatusOptions () {
      const response = await getEnum('vw_ent_vehicle_order_status');
      this.orderStatusOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['3', '7', '9', '50', '51', '99'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    async fetchSettleFundTypeOptions () {
      const response = await getEnum('vw_fundtype');
      this.settleFundTypeOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['1050', '1010', '2010'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    emergencyApproval (data) {
      return setEmergencyOrder(data).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.getData();
      });
    },
    getCompanyList (query) {
      return companyList({ companyNameLike: query, status: 1 });
    },
    handleCancelEmergencyOrder () {
      const ids = this.selectionList.map(item => item.id) || [];
      const params = {
        emergencyOrder: 0,
        ids: ids
      };
      this.$confirm('是否确定要批量取消急单？', '操作提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setEmergencyOrder(params).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getData();
        });
      }).catch(() => {});
    },
    handleSetEmergencyOrder () {
      this.showSetEmergencyOrderDialog = true;
    },
    handleBatchSetNotAutoAllocate () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('是否确定要执行取消自动配车操作？', '操作提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setAutoAllocate({
          ids: ids,
          needAutoAllocateCar: 0
        }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getData();
        });
      }).catch(() => {});
    },
    handleBatchSetAutoAllocate () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('是否确定要执行自动配车操作？', '操作提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setAutoAllocate({
          ids: ids,
          needAutoAllocateCar: 1
        }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getData();
        });
      }).catch(() => {});
    },
    handleBatchCancel () {
      this.showBatchCancelDialog = true;
    },
    cancelApproval (data) {
      console.log('cancelApproval', data);
      return batchCancelOrders(data).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.getData();
      });
    },
    handleBatchCancelSettle () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将批量取消结算, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchCancelSettleSubmit({
          idSet: ids,
        }).then(() => {
          this.$message.success('提交成功');
          this.getData();
        });
      }).catch(() => {});
    },
    handleBatchSettleSubmit () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将批量结算, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchSettleSubmit({
          idSet: ids,
        }).then(() => {
          this.$message.success('提交成功');
          this.getData();
        });
      }).catch(() => {});
    },
    handleBatchAllocateVehicle () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将批量配车, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchAllocateSubmit({
          idSet: ids,
        }).then(() => {
          this.$message.success('提交成功');
          this.getData();
        });
      }).catch(() => {});
    },
    handleBatchCancelAllocateVehicle () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将批量取消配车, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchCancelAllocateSubmit({
          idSet: ids
        }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getData();
        });
      }).catch(() => {});
    },
    async listNetworkParentCompany (query) {
      return getParentCompany({ parentCompanyName: query });
    },
    async repairItemSearch (query) {
      return fundGetList({ organizationNameLike: query, status: 1 });
    },
    async fetchOrderCategoryOptions () {
      const response = await getEnum('vw_eordertype');
      this.orderCategoryOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['1', '8', '21', '22'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
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
    handleAdd () {
      this.$router.push({
        path: '/vehwholesale/entorder/entVehicleOrder/edit'
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
        businessType: '整车销售-企业客户订单-企业客户整车订单管理',
        dataFetchPath: 'vw/web/entorder/entVehicleOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '企业客户整车订单管理.xlsx');
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
          // 后端返回 data 为 null 时，res.records 为 undefined 会导致 map 白屏，需提前守卫
          if (!res || !res.records) {
            return;
          }
          this.optionObj.dataList = res.records.map(item => {
            const vehicleMaterials = item.vehicleMaterialsDo || {};
            return {
              ...item,
              modelName: vehicleMaterials.modelName || '',
              modelId: vehicleMaterials.modelId || '',
              drivingRangeName: vehicleMaterials.drivingRangeName || '',
              drivingRangeId: vehicleMaterials.drivingRangeId || '',
              rangePowerName: vehicleMaterials.rangePowerName || '',
              rangePowerId: vehicleMaterials.rangePowerId || '',
              exteriorName: vehicleMaterials.exteriorName || '',
              exteriorId: vehicleMaterials.exteriorId || '',
              interiorName: vehicleMaterials.interiorName || '',
              interiorId: vehicleMaterials.interiorId || '',
              wheelHubName: vehicleMaterials.wheelHubName || '',
              wheelHubId: vehicleMaterials.wheelHubId || '',
              yearTypeName: vehicleMaterials.yearTypeName || '',
              yearTypeId: vehicleMaterials.yearTypeId || '',
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

      // 订单时间
      if (this.form.orderTime) {
        delete data.orderTime;
        if (this.form.orderTime.length > 1) {
          data.orderTimeStart = this.form.orderTime[0];
          data.orderTimeEnd = this.form.orderTime[1];
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-ent-vehicle-order-list {
}
</style>
