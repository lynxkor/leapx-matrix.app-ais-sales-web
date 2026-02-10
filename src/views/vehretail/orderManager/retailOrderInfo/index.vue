<template>
  <div class="page-common m-retail-order-info-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="商城订单编号">
        <tag-input v-model="form.mallOrderCodeList" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="购车人信息">
        <el-input
          placeholder="请输入"
          v-model="form.carBuyerParams"
          clearable
        />
      </el-form-item>
      <el-form-item label="批售订单号"  v-show="this.visibleCount === 3 || show">
        <tag-input v-model="form.wholesaleOrderCodeList" clearable placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
      <el-form-item label="整车订单状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vr_order_status"
          v-model="form.orderStatus"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
        <el-form-item label="配车VIN码">
          <tag-input v-model="form.matchVinList" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="销售门店">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.saleDealerCode"
            :remote-method="getIsSalesCode"
            value-key="storeCode"
            label-key="storeName"
          />
        </el-form-item>
        <el-form-item label="物料编码">
          <tag-input v-model="form.materialsCodeList" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="物料描述">
          <el-input
            placeholder="请输入"
            v-model="form.materialsDesc"
            clearable
          />
        </el-form-item>
        <el-form-item label="车系名称">
          <fetch-select
            :remote-method="remoteMethods.series"
            v-model="form.seriesId"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            clearable
            filterable
            remote
            @change="seriesListChange" />
        </el-form-item>
        <el-form-item label="车型名称">
          <el-select
            v-model="form.modelId"
            clearable
            filterable
            remote
            @change="modelListChange"
          >
            <el-option
            v-for="item in modelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="年款名称">
          <el-select
            v-model="form.yearTypeId"
            clearable
            filterable
            remote
            @change="modelListChange"
          >
            <el-option
            v-for="item in yearModelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="大区">
          <fetch-select
            filterable
            clearable
            remote
            v-model="form.regionCode"
            :remote-method="remoteMethods.region"
            value-key="orgCode"
            label-key="orgName"
          />
        </el-form-item>
        <el-form-item label="省市区">
          <el-cascader
            placeholder="请选择省市区"
            v-model="form.area"
            :props="orgProps"
            :options="areaOptions"
            filterable
            clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="是否预售订单">
          <fetch-select :options="yes_no_enum" v-model="form.preSaleOrder" placeholder="请选择" clearable />
        </el-form-item>
        <el-form-item label="是否绑定批售">
          <fetch-select :options="yes_no_enum" v-model="form.wholesaleBindStatus" placeholder="请选择" clearable />
        </el-form-item>
        <el-form-item label="批售订单状态">
          <fetch-select :options="yes_no_enum" v-model="form.wholesaleOrderStatus" placeholder="请选择" clearable />
        </el-form-item>
        <el-form-item label="订单排序时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.orderSortTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="缴定金时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.paymentTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="交车时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.deliveryTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.createTime"
            type="daterange"
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
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button> -->
       <el-button v-if="canAddOrUpdate" size="small" :disabled="selectionList.length !== 1" @click="handleUnlock">取消锁车</el-button>
       <el-button v-if="canAddOrUpdate" size="small" @click="handleAdd">更换销售门店</el-button>
       <el-button v-if="canAddOrUpdate" size="small" @click="handleAdd">更换交付门店</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
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
    <Upload :visible="uploadDialogVisible" :id="'1'" @close="handleUploadDialogClose" />
    <!-- 取消锁车 -->
     <UnlockDialog
      ref="unlockDialog"
      :businessId="businessId"
      :row="row"
      @refresh="getData"
    />
    <!-- 配置页 -->
     <MaterialsDialog
      ref="materialsDialog"
      :row="row"
      @confirm="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, getOrderUnlockConfig } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import {
  getTableConfig,
  tableAddOrUpdate,
  exportTable,
  getEnum,
  listOrgStoreInfo,
  vehicleSeriesList,
  vehicleModelList,
  vehicleModelYearTypeRelationDistinctYeayType,
  getRigion,
  loginUserGet,
} from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import UnlockDialog from './components/UnlockDialog';
import MaterialsDialog from './components/MaterialsDialog';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  area: [],
  mallOrderCodeList: [],
  wholesaleOrderCodeList: [],
  matchVinList: [],
  materialsCodeList: [],
  carBuyerParams: '',
  saleUserName: '',
  orderStatusLabel: '',
  lockStatusLabel: '',
  lockTime: '',
  wholesaleBindStatus: '',
  priceAfterSubsidy: '',
  depositAmount: '',
  agentName: '',
  cooperationTypeLabel: '',
  saleDealerCode: '',
  provinceName: '',
  cityName: '',
  regionName: '',
  dealerCompanyName: '',
  deliveryDealerName: '',
  seriesId: '',
  modelName: '',
  yearTypeName: '',
  materialsDesc: '',
  rangePowerName: '',
  drivingRangeName: '',
  exteriorName: '',
  interiorName: '',
  wheelHubName: '',
  optionPackageName: '',
  lockCarTypeLabel: '',
  retailOrderCode: '',
  outTradeNo: '',
  orderTime: '',
  paymentTime: '',
  rightsEnjoyDate: '',
  wholesaleOrderStatus: '',
  unlockCount: '',
  changeConfigCount: '',
  confirmedCount: '',
  deliveryCycleMaxWeek: '',
  initialDeliveryCycleDesc: '',
  dynamicDeliveryCycleDesc: '',
  orderSortTime: '',
  deliveryTime: '',
  orderUserId: '',
  createTime: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    MaterialsDialog,
    UnlockDialog,
    TagInput,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload
  },
  data () {
    return {
      pageTitle: '整车零售订单管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-retailOrderInfo',
      businessId: '',
      row: {},
      form: {
        ...defaultForm
      },
      accountFlag: null, // 账户标识  true: 是店端账号；false: 厂端账号
      orgProps: {
        checkStrictly: true,
        emitPath: true,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      areaOptions: JSON.parse(localStorage.areaTree),
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      modelList: [],
      yearModelList: [],
      remoteMethods: {
        series: async (query) => {
          return await vehicleSeriesList({ seriesNameLike: query, status: 1 });
        },
        region: async (query) => {
          return await getRigion({ seriesNameLike: query, status: 1 });
        },
      },
      optionObj: {
        id: 'retailOrderInfoTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'mallOrderCode',
            label: '商城订单编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/retailOrderInfo/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'preSaleOrderLabel', label: '是否预售订单', visible: true, width: 200 },
          {
            props: 'carBuyerName',
            label: '购车人姓名',
            visible: true,
            width: 100,
            mask: true,
            // getValue: (row) => getDetailDecryptField(row.id, 'carBuyerName')
          },
          {
            props: 'carBuyerPhone',
            label: '购车人手机号',
            visible: true,
            width: 200,
            mask: true,
            // getValue: (row) => getDetailDecryptField(row.id, 'carBuyerPhone')
          },
          {
            props: 'idCardNo',
            label: '证件号码',
            visible: true,
            width: 200,
            mask: true,
            // getValue: (row) => getDetailDecryptField(row.id, 'idCardNo')
          },
          { props: 'saleUserName', label: '订单销售顾问', visible: true, width: 200 },
          { props: 'matchVin', label: '配车VIN码', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '零售订单状态', visible: true, width: 200 },
          { props: 'lockStatusLabel', label: '是否锁单', visible: true, width: 200 },
          { props: 'lockTime', label: '锁单时间', visible: true, width: 200 },
          { props: 'wholesaleBindStatus', label: '是否绑定批售', visible: true, width: 200 },
          { props: 'priceAfterSubsidy', label: '补贴后价格', visible: true, width: 200 },
          { props: 'depositAmount', label: '应收定金', visible: true, width: 200 },
          { props: 'agentName', label: '代办联系人', visible: true, width: 200 },
          { props: 'cooperationTypeLabel', label: '合作类型', visible: true, width: 200 },
          { props: 'saleDealerName', label: '订单销售门店', visible: true, width: 200 },
          { props: 'provinceName', label: '销售门店-省', visible: true, width: 200 },
          { props: 'cityName', label: '销售门店-市', visible: true, width: 200 },
          { props: 'regionName', label: '所属区域或部门', visible: true, width: 200 },
          { props: 'dealerCompanyName', label: '销售门店母公司', visible: true, width: 200 },
          { props: 'deliveryDealerName', label: '订单交付门店', visible: true, width: 200 },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 200 },
          { props: 'seriesName', label: '车系名称', visible: true, width: 200 },
          { props: 'modelName', label: '车型名称', visible: true, width: 200 },
          { props: 'yearTypeName', label: '年款名称', visible: true, width: 200 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 300 },
          { props: 'rangePowerName', label: '选配动力', visible: true, width: 200 },
          { props: 'drivingRangeName', label: '续航里程', visible: true, width: 200 },
          { props: 'exteriorName', label: '外观名称', visible: true, width: 200 },
          { props: 'interiorName', label: '内饰名称', visible: true, width: 200 },
          { props: 'wheelHubName', label: '轮毂名称', visible: true, width: 200 },
          { props: 'optionPackageName', label: '选装包名称', visible: true, width: 200 },
          { props: 'lockCarTypeLabel', label: '锁车匹配类型', visible: true, width: 200 },
          { props: 'retailOrderCode', label: '订单编码', visible: true, width: 200 },
          { props: 'outTradeNo', label: '外部订单号', visible: true, width: 200 },
          { props: 'orderTime', label: '商城下单时间', visible: true, width: 200 },
          { props: 'paymentTime', label: '缴定金时间', visible: true, width: 200 },
          { props: 'rightsEnjoyDate', label: '权益享受日期', visible: true, width: 200 },
          { props: 'wholesaleOrderStatusLabel', label: '批售订单状态', visible: true, width: 200 },
          { props: 'unlockCount', label: '解绑次数', visible: true, width: 200 },
          { props: 'changeConfigCount', label: '改配次数', visible: true, width: 200 },
          { props: 'confirmedCount', label: '批售确认次数', visible: true, width: 200 },
          { props: 'deliveryCycleMaxWeek', label: '交付周期上限', visible: true, width: 200 },
          { props: 'initialDeliveryCycleDesc', label: '初始交付周期说明', visible: true, width: 200 },
          { props: 'dynamicDeliveryCycleDesc', label: '动态交付周期说明', visible: true, width: 200 },
          { props: 'orderSortTime', label: '订单排序时间', visible: true, width: 200 },
          { props: 'deliveryTime', label: '交车时间', visible: true, width: 200 },
          { props: 'orderUserId', label: '下单人UserID', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '修改配置',
              click: (rowIndex, row) => {
                this.changeConfiguration(row);
              },
              type: 'info'
            }, {
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/retailOrderInfo/edit',
                  query: {
                    id: row.id,
                    isEditing: true
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
    this.modelSearch();
    this.listVehicleYearType();
    this.loginUserGet();
  },
  methods: {
    changeConfiguration (row) {
      this.row = row;
      this.$refs.materialsDialog.show();
    },
    async handleUnlock () {
      this.businessId = this.selectionList[0]?.id;
      this.row = this.selectionList[0];
      const res = await getOrderUnlockConfig(this.row.retailOrderCode);
      // 检查返回结果是否有效
      if (!res || res.allowUnlockStatus !== 1 || res.allowManualCarStatus !== 1) {
        this.$message.error('该门店没有取消配车权限');
        return;
      }
      // 检查 accountFlag 和 unlockCount 的关系
      if (this.accountFlag && this.row.unlockCount >= 1) {
        this.$message.error('该订单取消配车次数已达上限');
        return;
      }
      this.$refs.unlockDialog.show();
    },
    loginUserGet () {
      loginUserGet().then(res => {
        // true 店端 false厂端
        this.accountFlag = res.accountFlag;
      }).catch(() => {});
    },
    async modelSearch () {
      const res = await vehicleModelList({ seriesId: this.form.seriesId, status: 1 });
      if (res.length) {
        const vehicleModelData = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.id
          };
        });
        this.modelList = vehicleModelData;
      } else {
        this.modelList = [];
      }
    },
    async listVehicleYearType () {
      const param = {
        // seriesId: this.form.seriesId,
        modelId: this.form.modelId,
        status: 1
      };
      const res = await vehicleModelYearTypeRelationDistinctYeayType(param);
      this.yearModelList = res.map(item => {
        return {
          ...item,
          label: item.yearTypeName,
          value: item.yearTypeId
        };
      });
    },
    seriesListChange (val) {
      if (val.length) {
        this.modelSearch();
        this.listVehicleYearType();
      } else {
        this.modelList = [];
        this.form.modelId = '';
        this.yearModelList = [];
        this.form.yearTypeId = '';
        this.modelSearch();
        this.listVehicleYearType();
      }
    },
    modelListChange (val, selectedOption) {
      if (val.length) {
        this.listVehicleYearType();
      } else {
        this.listVehicleYearType();
        this.yearModelList = [];
        this.form.yearTypeId = '';
      }
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
        path: '/vehretail/orderManager/retailOrderInfo/edit'
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
        businessType: '整车零售订单管理',
        dataFetchPath: 'web/vehretail/orderManager/retailOrderInfo/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车零售订单管理.xlsx');
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
      const timeFields = ['createTime', 'orderSortTime', 'paymentTime', 'deliveryTime'];
      timeFields.forEach(field => {
        if (this.form[field]) {
          delete data[field];
          if (this.form[field].length > 1) {
            data[`${field}Start`] = this.form[field][0];
            data[`${field}End`] = this.form[field][1];
          }
        }
      });
      console.log('this.area:', this.form.area);
      if (Array.isArray(this.form.area) && this.form.area.length > 0) {
        delete data.area;
        console.log('delete data.area:', data);
        data.provinceCode = this.form.area[0];
        console.log(' data.provinceCode:', data.provinceCode);
        if (this.form.area.length > 1) {
          data.cityCode = this.form.area[1];
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
    },
    async getIsSalesCode (params) {
      return listOrgStoreInfo({ keyword: params, isSales: true });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-retail-order-info-list {
}
</style>
