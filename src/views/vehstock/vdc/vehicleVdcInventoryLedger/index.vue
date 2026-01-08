<template>
  <div class="page-common m-vehicle-vdc-inventory-ledger-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="VIN">
        <tag-input v-model="form.vinList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="物料描述">
        <tag-input v-model="form.materialsDescList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="VDC入库时间">
        <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.inboundDateTime" type="daterange"
          :picker-options="pickerOptions" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="物料编码">
          <tag-input v-model="form.materialsCodeList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="车系">
          <fetch-select v-model="form.seriesIdList" v-bind="selectOptions" :remote-method="remoteMethods.series" />
        </el-form-item>
        <el-form-item label="是否配车">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.carAllocated" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="车辆交付状态">
          <fetch-select :request="fetchOptions" enumCode="vehstock_vehicle_delivery_status"
            v-model="form.vehicleDeliveryStatusList" placeholder="请选择" clearable multiple filterable />
        </el-form-item>
        <el-form-item label="整车物流预留">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.logisticsReserved"
            placeholder="请选择" clearable filterable />
        </el-form-item>
        <el-form-item label="整车仓库">
          <fetch-select v-model="form.warehouseCodeList" filterable clearable remote multiple reserve-keyword
            placeholder="请选择" :remote-method="serchWarehouse" value-key="warehouseCode" label-key="warehouseName" />
        </el-form-item>
        <el-form-item label="退车标识">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.returnLabel" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="允许锁零售单">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.allowLockRetail" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="发运方式">
          <fetch-select :request="fetchOptions" enumCode="vehstock_ship_via" v-model="form.shipVia" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="公告车型">
          <fetch-select v-model="form.vehicleRegisteredModelIdList" v-bind="selectOptions"
            :remote-method="remoteMethods.announcement" />
        </el-form-item>
        <el-form-item label="常用复合查询">
          <fetch-select :request="fetchOptions" enumCode="vehstock_vdc_common_composite_query"
            v-model="form.vdcCommonCompositeQuery" placeholder="请选择" clearable filterable />
        </el-form-item>
      </template>
      <page-search-action v-if="canList" v-model="show" is-expandable :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <!-- <div class="ais-active"> 暂时注释 等架构修改公共组件
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="主页" name="homePage"></el-tab-pane>
        <el-tab-pane label="低电量≤10%" name="lowBattery"></el-tab-pane>
      </el-tabs>
    </div> -->
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)"
        :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)"
        :disabled="selectionList.length === 0">批量停用</el-button>
    </div>
    <div class="ais-table-c" v-if="activeName === 'homePage'">
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page checkboxFixed :option-obj="optionObj"
        :get-config="getConfig" :save-or-update="saveOrUpdate" @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange" />
    </div>
    <div class="ais-table-c" v-if="activeName === 'lowBattery'">
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page checkboxFixed :option-obj="optionDdl"
        :get-config="getConfigDl" :save-or-update="saveOrUpdate" @paginationChange="paginationChangeDl"
        @handleSelect="handleSelectionChange" />
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload :visible="uploadDialogVisible" :id="'vehicleVdcInventoryLedgerImport'" @close="handleUploadDialogClose" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehstock/vdc/vehicleVdcInventoryLedger/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, vehicleSeriesList, vehicleSalesVersionList, pageWithPermission } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  createTime: '',
  warehouseCodeList: [],
  vinLike: '',
  vinList: [],
  materialsDescLike: '',
  materialsDescList: [],
  vehicleDeliveryStatusList: ['3', '4'],
  carAllocated: '0',
  logisticsReserved: '0',
  returnLabel: '',
  allowLockRetail: '',
  vehicleRegisteredModelIdList: [],
  materialsCode: '',
  materialsCodeList: [],
  seriesIdList: [],
  shipVia: '',
  vdcCommonCompositeQuery: '',
  lowBatteryCar: 0,
  inboundDateTime: []
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
    Upload,
    TagInput
  },
  data () {
    return {
      pageTitle: 'VDC库存台账',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-vehicleVdcInventoryLedger',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      warehouseOptions: [], // 整车仓库
      activeName: 'homePage',
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      optionObj: {
        id: 'vehicleVdcInventoryLedgerTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/vdc/vehicleVdcInventoryLedger/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'inboundDateTime',
            label: 'VDC入库时间',
            visible: true,
            width: 200,
          },
          { props: 'stockAge', label: '库龄（天）', visible: true, width: 200 },
          { props: 'warehouseName', label: '整车仓库', visible: true, width: 200 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'allowWholesaleLabel', label: '是否允许现车批售', visible: true, width: 200 },
          { props: 'vehicleDeliveryStatusLabel', label: '车辆交付状态', visible: true, width: 200 },
          { props: 'carAllocatedLabel', label: '是否配车', visible: true, width: 200 },
          { props: 'carAllocatedDateTime', label: '配车时间', visible: true, width: 200 },
          { props: 'reservedLabel', label: '销售预留', visible: true, width: 200 },
          { props: 'reservedTypeLabel', label: '销售预留类型', visible: true, width: 200 },
          { props: 'logisticsReservedLabel', label: '整车物流预留', visible: true, width: 200 },
          { props: 'batteryCellName', label: '电池电芯', visible: true, width: 200 },
          { props: 'returnLabelLabel', label: '退车标识', visible: true, width: 200 },
          { props: 'allowLockRetailLabel', label: '允许锁零售单', visible: true, width: 200 },
          { props: 'vehicleRegisteredModelName', label: '公告车型', visible: true, width: 200 },
          { props: 'electricity', label: '电量（%）', visible: true, width: 200 },
          { props: 'electricityon', label: '电量获取时间', visible: true, width: 200 },
          { props: 'salesRemark', label: '销售备注', visible: true, width: 200 },
          { props: 'specialReserveRemark', label: '特殊预留备注', visible: true, width: 200 },
          { props: 'vehicleLogisticsReserveRemark', label: '整车物流预留备注', visible: true, width: 200 },
          { props: 'yearTypeName', label: '年款', visible: true, width: 200 },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 200 },
          { props: 'seriesName', label: '车系', visible: true, width: 200 },
          { props: 'modelName', label: '车型', visible: true, width: 200 },
          { props: 'shipViaLabel', label: '发运方式', visible: true, width: 200 },
          { props: 'vdcInventoryStatusLabel', label: '库存状态', visible: true, width: 200 },
          { props: 'po', label: '订单编号', visible: true, width: 200 },
          { props: 'optionPackageName', label: '选配包', visible: true, width: 200 },
          { props: 'rangePowerName', label: '选配动力', visible: true, width: 200 },
          { props: 'drivingRangeName', label: '续航里程', visible: true, width: 200 },
          { props: 'exteriorName', label: '外观', visible: true, width: 200 },
          { props: 'interiorName', label: '内饰', visible: true, width: 200 },
          { props: 'wheelHubName', label: '选配轮毂', visible: true, width: 200 },
          { props: 'outboundDateTime', label: 'VDC出库时间', visible: true, width: 200 },
          { props: 'bulkoutLabel', label: '是否批量出库', visible: true, width: 200 },
          { props: 'offlineTime', label: '下线时间', visible: true, width: 200 },
          { props: 'lastInboundTime', label: '最近入库时间', visible: true, width: 200 },
          { props: 'lastOutboundTime', label: '最近出库时间', visible: true, width: 200 },
          { props: 'erpSalesOrder', label: 'ERP销售订单号', visible: true, width: 200 },
          { props: 'erpDeliverOrder', label: 'ERP交货单', visible: true, width: 200 },
          { props: 'erpInvoice', label: 'ERP发票号', visible: true, width: 200 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
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
                  path: '/vehstock/vdc/vehicleVdcInventoryLedger/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
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
      optionDdl: {
        id: 'vehicleVdcInventoryLedgerTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'electricity', label: '电量（%）', visible: true, width: 200, fixed: 'left' },
          { props: 'electricityon', label: '电量获取时间', visible: true, width: 200, fixed: 'left' },
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/vdc/vehicleVdcInventoryLedger/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'inboundDateTime',
            label: 'VDC入库时间',
            visible: true,
            width: 200,
          },
          { props: 'stockAge', label: '库龄（天）', visible: true, width: 200 },
          { props: 'warehouseName', label: '整车仓库', visible: true, width: 200 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'allowWholesaleLabel', label: '是否允许现车批售', visible: true, width: 200 },
          { props: 'vehicleDeliveryStatusLabel', label: '车辆交付状态', visible: true, width: 200 },
          { props: 'carAllocatedLabel', label: '是否配车', visible: true, width: 200 },
          { props: 'carAllocatedDateTime', label: '配车时间', visible: true, width: 200 },
          { props: 'reservedLabel', label: '销售预留', visible: true, width: 200 },
          { props: 'reservedTypeLabel', label: '销售预留类型', visible: true, width: 200 },
          { props: 'logisticsReservedLabel', label: '整车物流预留', visible: true, width: 200 },
          { props: 'batteryCellName', label: '电池电芯', visible: true, width: 200 },
          { props: 'returnLabelLabel', label: '退车标识', visible: true, width: 200 },
          { props: 'allowLockRetailLabel', label: '允许锁零售单', visible: true, width: 200 },
          { props: 'vehicleRegisteredModelName', label: '公告车型', visible: true, width: 200 },
          { props: 'salesRemark', label: '销售备注', visible: true, width: 200 },
          { props: 'specialReserveRemark', label: '特殊预留备注', visible: true, width: 200 },
          { props: 'vehicleLogisticsReserveRemark', label: '整车物流预留备注', visible: true, width: 200 },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 200 },
          { props: 'yearTypeName', label: '年款', visible: true, width: 200 },
          { props: 'seriesName', label: '车系', visible: true, width: 200 },
          { props: 'modelName', label: '车型', visible: true, width: 200 },
          { props: 'shipViaLabel', label: '发运方式', visible: true, width: 200 },
          { props: 'po', label: '订单编号', visible: true, width: 200 },
          { props: 'optionPackageName', label: '选配包', visible: true, width: 200 },
          { props: 'rangePowerName', label: '选配动力', visible: true, width: 200 },
          { props: 'drivingRangeName', label: '续航里程', visible: true, width: 200 },
          { props: 'exteriorName', label: '外观', visible: true, width: 200 },
          { props: 'interiorName', label: '内饰', visible: true, width: 200 },
          { props: 'wheelHubName', label: '选配轮毂', visible: true, width: 200 },
          { props: 'vdcInventoryStatusLabel', label: '库存状态', visible: true, width: 200 },
          { props: 'outboundDateTime', label: 'VDC出库时间', visible: true, width: 200 },
          { props: 'bulkoutLabel', label: '是否批量出库', visible: true, width: 200 },
          { props: 'offlineTime', label: '下线时间', visible: true, width: 200 },
          { props: 'lastInboundTime', label: '最近入库时间', visible: true, width: 200 },
          { props: 'lastOutboundTime', label: '最近出库时间', visible: true, width: 200 },
          { props: 'erpSalesOrder', label: 'ERP销售订单号', visible: true, width: 200 },
          { props: 'erpDeliverOrder', label: 'ERP交货单', visible: true, width: 200 },
          { props: 'erpInvoice', label: 'ERP发票号', visible: true, width: 200 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
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
                  path: '/vehstock/vdc/vehicleVdcInventoryLedger/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
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
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      // 远程搜索方法
      remoteMethods: {
        series: async (query) => {
          return await vehicleSeriesList({ seriesNameLike: query });
        },
        announcement: async (query) => {
          return await vehicleSalesVersionList({ registeredModelNameLike: query });
        }
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/vehstock/vdc/vehicleVdcInventoryLedger/edit'
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
        businessType: 'VDC库存台账',
        dataFetchPath: 'vehstock/web/vdc/vehicleVdcInventoryLedger/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, 'VDC库存台账.xlsx');
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
    // 低电量
    getDataDl () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionDdl.form.page, pageSize: this.optionDdl.form.size })
        .then(res => {
          console.log(res);
          this.optionDdl.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionDdl.total = res.total;
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
    getConfigDl () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({});
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

      if (this.form.inboundDateTime) {
        delete data.inboundDateTime;
        if (this.form.inboundDateTime.length > 1) {
          data.inboundDateTimeStart = this.form.inboundDateTime[0];
          data.inboundDateTimeEnd = this.form.inboundDateTime[1];
        }
      }

      if (Array.isArray(this.form.vinList) && this.form.vinList.length <= 1) {
        delete data.vinList;
        data.vinLike = this.form.vinList[0] || '';
      }
      if (Array.isArray(this.form.materialsDescList) && this.form.materialsDescList.length <= 1) {
        delete data.materialsDescList;
        data.materialsDescLike = this.form.materialsDescList[0] || '';
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
      }).catch(() => { });
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
    // 搜索仓库
    async serchWarehouse (query) {
      const res = await pageWithPermission({ warehouseName: query, page: 1, size: 20 });
      return res?.records?.map(item => {
        return {
          ...item,
          label: item.warehouseName,
          value: item.warehouseCode,
        };
      });
    },
    // 点击tabs栏 切换
    handleClick (item) {
      if (item.name === 'homePage') {
        this.form.lowBatteryCar = 0;
        this.getData();
      } else {
        this.form.lowBatteryCar = 1;
        this.getDataDl();
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.m-vehicle-vdc-inventory-ledger-list {}
.ais-active {
  margin-top: 20px;
}
</style>
