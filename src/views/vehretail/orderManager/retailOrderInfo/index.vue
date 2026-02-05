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
        <el-input
          placeholder="请输入"
          v-model="form.mallOrderCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="证件号码">
        <el-input
          placeholder="请输入"
          v-model="form.idCardNo"
          clearable
        />
      </el-form-item>
      <el-form-item label="销售顾问名称"  v-show="this.visibleCount === 3 || show">
        <el-input
          placeholder="请输入"
          v-model="form.saleUserName"
          clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="配车VIN码">
          <el-input
            placeholder="请输入"
            v-model="form.matchVin"
            clearable
          />
        </el-form-item>
        <el-form-item label="零售订单状态标签">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.orderStatusLabel"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="是否锁单 1-是;0-否">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.lockStatusLabel"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="锁单时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.lockTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="是否绑定批售 1-是;0-否">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.wholesaleBindStatus"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="补贴后价格">
          <el-input
            placeholder="请输入"
            v-model="form.priceAfterSubsidy"
            clearable
          />
        </el-form-item>
        <el-form-item label="定金金额">
          <el-input
            placeholder="请输入"
            v-model="form.depositAmount"
            clearable
          />
        </el-form-item>
        <el-form-item label="代办人姓名">
          <el-input
            placeholder="请输入"
            v-model="form.agentName"
            clearable
          />
        </el-form-item>
        <el-form-item label="合作类型 0：直营店、2：合作伙伴">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.cooperationTypeLabel"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="销售门店名称">
          <el-input
            placeholder="请输入"
            v-model="form.saleDealerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="销售门店-省">
          <el-input
            placeholder="请输入"
            v-model="form.provinceName"
            clearable
          />
        </el-form-item>
        <el-form-item label="销售门店-市">
          <el-input
            placeholder="请输入"
            v-model="form.cityName"
            clearable
          />
        </el-form-item>
        <el-form-item label="销售门店-大区">
          <el-input
            placeholder="请输入"
            v-model="form.regionName"
            clearable
          />
        </el-form-item>
        <el-form-item label="销售门店-母公司名称">
          <el-input
            placeholder="请输入"
            v-model="form.dealerCompanyName"
            clearable
          />
        </el-form-item>
        <el-form-item label="交付门店名称">
          <el-input
            placeholder="请输入"
            v-model="form.deliveryDealerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input
            placeholder="请输入"
            v-model="form.materialsCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="车型名称">
          <el-input
            placeholder="请输入"
            v-model="form.modelName"
            clearable
          />
        </el-form-item>
        <el-form-item label="年款名称">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.yearTypeName"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="物料描述">
          <el-input
            placeholder="请输入"
            v-model="form.materialsDesc"
            clearable
          />
        </el-form-item>
        <el-form-item label="选配动力">
          <el-input
            placeholder="请输入"
            v-model="form.rangePowerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="续航里程">
          <el-input
            placeholder="请输入"
            v-model="form.drivingRangeName"
            clearable
          />
        </el-form-item>
        <el-form-item label="外观名称">
          <el-input
            placeholder="请输入"
            v-model="form.exteriorName"
            clearable
          />
        </el-form-item>
        <el-form-item label="内饰名称">
          <el-input
            placeholder="请输入"
            v-model="form.interiorName"
            clearable
          />
        </el-form-item>
        <el-form-item label="轮毂名称">
          <el-input
            placeholder="请输入"
            v-model="form.wheelHubName"
            clearable
          />
        </el-form-item>
        <el-form-item label="选装包名称">
          <el-input
            placeholder="请输入"
            v-model="form.optionPackageName"
            clearable
          />
        </el-form-item>
        <el-form-item label="锁车类型 0-自动锁车;1-手动锁车">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.lockCarTypeLabel"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="零售订单号">
          <el-input
            placeholder="请输入"
            v-model="form.retailOrderCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="外部订单号">
          <el-input
            placeholder="请输入"
            v-model="form.outTradeNo"
            clearable
          />
        </el-form-item>
        <el-form-item label="商城下单时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.orderTime"
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
        <el-form-item label="权益享受日期">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.rightsEnjoyDate"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="批售订单状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.wholesaleOrderStatusLabel"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="解绑次数">
          <el-input
            placeholder="请输入"
            v-model="form.unlockCount"
            clearable
          />
        </el-form-item>
        <el-form-item label="改配次数">
          <el-input
            placeholder="请输入"
            v-model="form.changeConfigCount"
            clearable
          />
        </el-form-item>
        <el-form-item label="批售确认次数">
          <el-input
            placeholder="请输入"
            v-model="form.confirmedCount"
            clearable
          />
        </el-form-item>
        <el-form-item label="交付周期上限">
          <el-input
            placeholder="请输入"
            v-model="form.deliveryCycleMaxWeek"
            clearable
          />
        </el-form-item>
        <el-form-item label="初始交付周期说明">
          <el-input
            placeholder="请输入"
            v-model="form.initialDeliveryCycleDesc"
            clearable
          />
        </el-form-item>
        <el-form-item label="动态交付周期说明">
          <el-input
            placeholder="请输入"
            v-model="form.dynamicDeliveryCycleDesc"
            clearable
          />
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
        <el-form-item label="下单人ID">
          <el-input
            placeholder="请输入"
            v-model="form.orderUserId"
            clearable
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
import { getList, deleteItem, enableItem } from '@/api/vehretail/orderManager/retailOrderInfo/index';
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
  mallOrderCode: '',
  idCardNo: '',
  saleUserName: '',
  matchVin: '',
  orderStatusLabel: '',
  lockStatusLabel: '',
  lockTime: '',
  wholesaleBindStatus: '',
  priceAfterSubsidy: '',
  depositAmount: '',
  agentName: '',
  cooperationTypeLabel: '',
  saleDealerName: '',
  provinceName: '',
  cityName: '',
  regionName: '',
  dealerCompanyName: '',
  deliveryDealerName: '',
  materialsCode: '',
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
  wholesaleOrderStatusLabel: '',
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
      moduleKey: 'AISMC-retailOrderInfo',
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
          { props: 'preSaleOrder', label: '是否预售订单 1-是;0-否', visible: true, width: 200 },
          { props: 'carBuyerName', label: '购车人姓名', visible: true, width: 200 },
          { props: 'carBuyerPhone', label: '购车人手机号', visible: true, width: 200 },
          { props: 'idCardNo', label: '证件号码', visible: true, width: 200 },
          { props: 'saleUserName', label: '销售顾问名称', visible: true, width: 200 },
          { props: 'matchVin', label: '配车VIN码', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '零售订单状态标签', visible: true, width: 200 },
          { props: 'lockStatusLabel', label: '是否锁单 1-是;0-否', visible: true, width: 200 },
          { props: 'lockTime', label: '锁单时间', visible: true, width: 200 },
          { props: 'wholesaleBindStatus', label: '是否绑定批售 1-是;0-否', visible: true, width: 200 },
          { props: 'priceAfterSubsidy', label: '补贴后价格', visible: true, width: 200 },
          { props: 'depositAmount', label: '定金金额', visible: true, width: 200 },
          { props: 'agentName', label: '代办人姓名', visible: true, width: 200 },
          { props: 'cooperationTypeLabel', label: '合作类型 0：直营店、2：合作伙伴', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店名称', visible: true, width: 200 },
          { props: 'provinceName', label: '销售门店-省', visible: true, width: 200 },
          { props: 'cityName', label: '销售门店-市', visible: true, width: 200 },
          { props: 'regionName', label: '销售门店-大区', visible: true, width: 200 },
          { props: 'dealerCompanyName', label: '销售门店-母公司名称', visible: true, width: 200 },
          { props: 'deliveryDealerName', label: '交付门店名称', visible: true, width: 200 },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 200 },
          { props: 'modelName', label: '车型名称', visible: true, width: 200 },
          { props: 'yearTypeName', label: '年款名称', visible: true, width: 200 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'rangePowerName', label: '选配动力', visible: true, width: 200 },
          { props: 'drivingRangeName', label: '续航里程', visible: true, width: 200 },
          { props: 'exteriorName', label: '外观名称', visible: true, width: 200 },
          { props: 'interiorName', label: '内饰名称', visible: true, width: 200 },
          { props: 'wheelHubName', label: '轮毂名称', visible: true, width: 200 },
          { props: 'optionPackageName', label: '选装包名称', visible: true, width: 200 },
          { props: 'lockCarTypeLabel', label: '锁车类型 0-自动锁车;1-手动锁车', visible: true, width: 200 },
          { props: 'retailOrderCode', label: '零售订单号', visible: true, width: 200 },
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
          { props: 'orderUserId', label: '下单人ID', visible: true, width: 200 },
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
                  path: '/vehretail/orderManager/retailOrderInfo/edit',
                  query: {
                    id: row.id,
                    isEditing: true
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-retail-order-info-list {
}
</style>
