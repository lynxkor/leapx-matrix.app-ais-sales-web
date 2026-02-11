<template>
  <div class="page-common m-store-inventory-ledger-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="VIN">
        <el-input placeholder="请输入" v-model="form.vin" clearable />
      </el-form-item>
      <el-form-item label="车辆状态">
        <fetch-select :request="fetchOptions" enumCode="vehstock_vechicle_status" v-model="form.vechicleStatusList"
          placeholder="请选择" clearable multiple filterable />
      </el-form-item>
      <el-form-item label="物料描述">
        <el-input placeholder="请输入" v-model="form.materialsDesc" clearable />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="出库时间">
          <el-input placeholder="请输入" v-model="form.moveoutDate" clearable />
        </el-form-item>
        <el-form-item label="车辆物流状态">
          <fetch-select :request="fetchOptions" enumCode="vehstock_logistic_status" v-model="form.logisticStatusList"
            placeholder="请选择" clearable multiple filterable />
        </el-form-item>
        <el-form-item label="物流到店日期">
          <el-input placeholder="请输入" v-model="form.vehicleArrivalOn" clearable />
        </el-form-item>
        <el-form-item label="是否预留">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.reserved" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="车辆类型">
          <fetch-select :request="fetchOptions" enumCode="vehstock_reservation_status" v-model="form.reservationStatusList"
            placeholder="请选择" clearable multiple filterable />
        </el-form-item>
        <el-form-item label="是否匹配订单">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.lockStatus" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="实车交车标识">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.vehdeLiveried" placeholder="请选择"
            clearable filterable />
        </el-form-item>
        <el-form-item label="销售门店编码">
          <el-input placeholder="请输入" v-model="form.saleDealerCode" clearable />
        </el-form-item>
        <el-form-item label="交付门店编码">
          <el-input placeholder="请输入" v-model="form.deliveryDealerCode" clearable />
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input placeholder="请输入" v-model="form.materialsCode" clearable />
        </el-form-item>
        <el-form-item label="车系ID">
          <el-input placeholder="请输入" v-model="form.seriesId" clearable />
        </el-form-item>
        <el-form-item label="车型ID">
          <el-input placeholder="请输入" v-model="form.modelId" clearable />
        </el-form-item>
        <el-form-item label="外观ID">
          <el-input placeholder="请输入" v-model="form.exteriorId" clearable />
        </el-form-item>
        <el-form-item label="内饰ID">
          <el-input placeholder="请输入" v-model="form.interiorId" clearable />
        </el-form-item>
        <el-form-item label="选配轮毂ID">
          <el-input placeholder="请输入" v-model="form.wheelHubId" clearable />
        </el-form-item>
        <el-form-item label="选装包ID">
          <el-input placeholder="请输入" v-model="form.optionPackageId" clearable />
        </el-form-item>
        <el-form-item label="采购入库时间">
          <el-input placeholder="请输入" v-model="form.poentryOn" clearable />
        </el-form-item>
        <el-form-item label="入库时间">
          <el-input placeholder="请输入" v-model="form.moveinDate" clearable />
        </el-form-item>
        <el-form-item label="入库是否及时">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.inboundTimeLy" placeholder="请选择"
            clearable filterable />
        </el-form-item>
      </template>
      <page-search-action v-if="canList" v-model="show" is-expandable :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)"
        :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)"
        :disabled="selectionList.length === 0">批量停用</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete"
        :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page checkboxFixed centralized
        :option-obj="optionObj" :get-config="getConfig" :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange" @handleSelect="handleSelectionChange" @listSelect="handleListSelect">
        <EditPage slot="centralizedViewSlot" :id="clickItemId" />
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload :visible="uploadDialogVisible" :id="1" @close="handleUploadDialogClose" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehstock/store/storeInventoryLedger/index';
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
  vin: '',
  vechicleStatusList: [],
  materialsDesc: '',
  moveoutDate: '',
  logisticStatusList: [],
  vehicleArrivalOn: '',
  reserved: '',
  reservationStatusList: [],
  lockStatus: '',
  vehdeLiveried: '',
  saleDealerCode: '',
  deliveryDealerCode: '',
  poentryOn: '',
  inboundTimeLy: '',
  materialsCode: '',
  seriesId: '',
  modelId: '',
  exteriorId: '',
  interiorId: '',
  wheelHubId: '',
  optionPackageId: '',
  moveinDate: '',
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
      pageTitle: '门店库存台账',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-storeInventoryLedger',
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
        id: 'storeInventoryLedgerTable',
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
                  path: '/vehstock/store/storeInventoryLedger/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'vechicleStatusLabel', label: '车辆状态', visible: true, width: 200 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'moveoutDate', label: '出库时间', visible: true, width: 200 },
          { props: 'moveoutTypeLabel', label: '出库类型', visible: true, width: 200 },
          { props: 'moveTypeLabel', label: '入库类型', visible: true, width: 200 },
          { props: 'logisticStatusLabel', label: '车辆物流状态', visible: true, width: 200 },
          { props: 'vehicleArrivalOn', label: '物流到店日期', visible: true, width: 200 },
          { props: 'inboundLatestDate', label: '要求入库截止日期', visible: true, width: 200 },
          { props: 'reservedLabel', label: '是否预留', visible: true, width: 200 },
          { props: 'reserveDesc', label: '预留说明', visible: true, width: 200 },
          { props: 'reservationStatusLabel', label: '车辆类型', visible: true, width: 200 },
          { props: 'lockStatusLabel', label: '是否匹配订单', visible: true, width: 200 },
          { props: 'lockTime', label: '匹配时间', visible: true, width: 200 },
          { props: 'isRepaidLabel', label: '融资是否还款', visible: true, width: 200 },
          { props: 'financeOrgName', label: '金融机构', visible: true, width: 200 },
          { props: 'settlementFundType', label: '结算资金类型', visible: true, width: 200 },
          { props: 'vehdeLiveriedLabel', label: '实车交车标识', visible: true, width: 200 },
          { props: 'syncSourceLabel', label: '标识来源', visible: true, width: 200 },
          { props: 'isFenceCrossedLabel', label: '是否异常车辆', visible: true, width: 200 },
          { props: 'fenceCrossedTypeLabel', label: '车辆异常类型', visible: true, width: 200 },
          { props: 'vehdeLiveriedOn', label: '标识记录日期', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店名称', visible: true, width: 200 },
          { props: 'deliveryDealerName', label: '交付门店名称', visible: true, width: 200 },
          { props: 'poentryDealerName', label: '采购入库门店名称', visible: true, width: 200 },
          { props: 'poentryOn', label: '采购入库时间', visible: true, width: 200 },
          { props: 'inboundTimeLyLabel', label: '入库是否及时', visible: true, width: 200 },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 200 },
          { props: 'seriesName', label: '车系', visible: true, width: 200 },
          { props: 'modelName', label: '车型', visible: true, width: 200 },
          { props: 'exteriorName', label: '外观', visible: true, width: 200 },
          { props: 'interiorName', label: '内饰', visible: true, width: 200 },
          { props: 'wheelHubName', label: '选配轮毂', visible: true, width: 200 },
          { props: 'optionPackageName', label: '选装包', visible: true, width: 200 },
          { props: 'moveinDate', label: '入库时间', visible: true, width: 200 },
          { props: 'receivedBy', label: '收车确认人', visible: true, width: 200 },
          { props: 'receivedOn', label: '收车确认时间', visible: true, width: 200 },
          { props: 'receivedplatformLabel', label: '收车操作来源', visible: true, width: 200 },
          { props: 'statusLabel', label: '状态', visible: true, width: 200 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
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
        path: '/vehstock/store/storeInventoryLedger/edit'
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
        businessType: '门店库存台账',
        dataFetchPath: 'vehstock/web/store/storeInventoryLedger/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店库存台账.xlsx');
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-store-inventory-ledger-list {}
</style>
