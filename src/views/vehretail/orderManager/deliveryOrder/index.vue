<template>
  <div class="page-common m-delivery-order-list">
    <!--  TIPS: 自行调整如下 label-width，满足 label 不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="VIN码">
         <tag-input v-model="form.vinList" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="交车状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vr_delivery_status"
          v-model="form.statusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="交车单编号" v-show="this.visibleCount === 3 || show">
        <tag-input v-model="form.deliveryOrderCodeList" clearable placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="商城订单编号">
          <tag-input v-model="form.mallOrderCodeList" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="车系名称">
          <fetch-select
            :remote-method="seriesSearch"
            remote
            reserve-keyword
            v-model="form.seriesIdList"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            clearable
            multiple
            collapseTags
            filterable
          />
        </el-form-item>
        <el-form-item label="车型名称">
          <fetch-select
            :remote-method="remoteMethods.model"
            v-model="form.modelIdList"
            v-bind="selectOptions"
          />
        </el-form-item>
        <!-- <el-form-item label="大区">
          <fetch-select
            filterable
            clearable
            remote
            multiple
            v-model="form.regionCodeList"
            :remote-method="remoteMethods.region"
            value-key="orgCode"
            label-key="orgName"
          />
        </el-form-item> -->
        <el-form-item label="省市" class="item--area">
          <el-cascader
            v-model="form.areaCodes"
            :options="areaOptions"
            :props="areaProps"
            placeholder="请选择省市"
            collapse-tags
            clearable
            filterable
            @change="handleAreaChange"
          />
        </el-form-item>
        <el-form-item label="订单交付顾问">
          <el-select
            :disabled="!form.deliveryDealerCodeList"
            v-model="form.deliveryUserId"
            filterable
            clearable
            value-key="userId"
            placeholder="请先选择交付门店"
          >
            <el-option
              v-for="item in deliveryUserOptions"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单销售门店">
          <fetch-select
            filterable
            clearable
            remote
            multiple
            collapseTags
            v-model="form.saleDealerCodeList"
            :remote-method="remoteMethods.getSaleDealer"
            value-key="storeCode"
            label-key="storeName"
          />
        </el-form-item>
        <el-form-item label="订单交付门店">
          <fetch-select
            filterable
            clearable
            remote
            multiple
            collapseTags
            v-model="form.deliveryDealerCodeList"
            :remote-method="remoteMethods.getServiceDealer"
            value-key="storeCode"
            label-key="storeName"
            @change="onDeliveryDealerChange"
          />
        </el-form-item>
        <el-form-item label="购车人信息">
          <el-input
            placeholder="请输入"
            v-model="form.carBuyerParams"
            clearable
          />
        </el-form-item>
      <el-form-item label="金融方案">
        <fetch-select
          :request="fetchOptions"
          enumCode="vr_financial_scheme"
          v-model="form.financialSchemeList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="母公司编码">
        <tag-input v-model="form.dealerCompanyCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="母公司名称">
        <tag-input v-model="form.dealerCompanyNameList" placeholder="请输入" />
      </el-form-item>
        <el-form-item label="预约提车时间">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.appointmentTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="交车日期">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.deliveryTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
         <el-form-item label="合作类型">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="ws_cooperation_type"
                  v-model="form.cooperationType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="是否员工购车">
                <fetch-select
                  :options="yes_no_enum"
                  v-model="form.isEmployeePurchase"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="门店整车订单类型">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="vr_order_type"
                  v-model="form.orderTypes"
                  placeholder="请选择"
                  clearable
                  multiple
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
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-permission="moduleKey +'-assign'" :disabled="!canAssign" size="small" @click="handleAssign">分派</el-button>
    </div>
    <div
      class="ais-table-c"
    >
      <div>
        <el-tabs v-model="tabName" @tab-click="handleClickTab">
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="待邀约交车单" name="pending"></el-tab-pane>
          <el-tab-pane label="今日待交车" name="today"></el-tab-pane>
          <el-tab-pane label="明日待交车" name="tomorrow"></el-tab-pane>
          <el-tab-pane label="剩余可交订单" name="remain"></el-tab-pane>
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
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <AssignDialog ref="assignDialog" @success="getData" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, getDetailDecryptField } from '@/api/vehretail/orderManager/deliveryOrder/index';
import { engineerList } from '@/libs/api/common';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listVehicleModel, listOrgStoreInfo, vehicleSeriesList, getRigion } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import { getAreaTree } from '@/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import AssignDialog from './components/AssignDialog.vue';
import TagInput from '@/libs/components/TagInput';
import dateranges from '@/libs/components/dateranges';
import { getTimeRangeByTypeFormat } from '@/libs/utils/time';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  deliveryOrderCode: '',
  statusList: [],
  vinList: [],
  vehicleModelName: '',
  deliveryUserId: '',
  salesStoreName: '',
  deliveryStoreName: '',
  saleDealerCodeList: [],
  deliveryDealerCodeList: [],
  carBuyerParams: '',
  appointmentTime: '',
  createTime: '',
  deliveryOrderCodeList: [],
  mallOrderCodeList: [],
  deliveryTime: [],
  areaCodes: [],
  provinceCodeList: [],
  cityCodeList: [],
  dealerCompanyCodeList: [],
  dealerCompanyNameList: [],
  cooperationType: '',
  isEmployeePurchase: '',
  orderTypes: [],
  // seriesIdList: [],
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
    AssignDialog,
    TagInput,
    dateranges
  },
  data () {
    return {
      pageTitle: '交车单',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-deliveryOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      tabName: 'all',
      deliveryUserOptions: [],
      seriesList: [],
      areaOptions: (() => {
        // 仅保留省/市两级，移除城市下的区/县子节点
        return (getAreaTree() || []).map(province => ({
          ...province,
          child: (province.child || []).map(city => {
            const { child, ...rest } = city;
            return rest;
          })
        }));
      })(),
      // el-cascader 多选配置
      areaProps: {
        multiple: true,
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        filterable: true,
        remote: true,
        multiple: true,
        reserveKeyword: true
      },
      // 远程搜索方法
      remoteMethods: {
        // 初始方法
        model: async (query) => {
          return await listVehicleModel({ modelNameLike: query, status: 1 });
        },
        getSaleDealer: async (query) => {
          return await listOrgStoreInfo({ keyword: query, isSales: true });
        },
        getServiceDealer: async (query) => {
          return await listOrgStoreInfo({ keyword: query, isSupportDeliver: true });
        },
        region: async (query) => {
          return await getRigion({ regionName: query, status: 1 });
        },
      },
      optionObj: {
        id: 'deliveryOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'deliveryOrderCode',
            label: '交车单编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/deliveryOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
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
                    id: row.retailOrderId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'statusLabel', label: '交车状态', visible: true, width: 200 },
          { props: 'appointmentTime', label: '预约提车时间', visible: true, width: 200, sortable: true },
          { props: 'vin', label: 'VIN', visible: true, width: 200, mask: true, getValue: (row) => getDetailDecryptField(row.id, 'vin') },
          { props: 'seriesName', label: '车系名称', visible: true, width: 120 },
          // { props: 'regionName', label: '大区', visible: true, width: 200 },
          { props: 'provinceName', label: '省份', visible: true, width: 200 },
          { props: 'cityName', label: '城市', visible: true, width: 200 },
          { props: 'modelName', label: '车型名称', visible: true, width: 200 },
          { props: 'carBuyerName', label: '购车人姓名', visible: false, width: 200, mask: true, getValue: (row) => getDetailDecryptField(row.id, 'carBuyerName') },
          { props: 'guidePrice', label: '整车指导价', visible: false, width: 200, align: 'right' },
          { props: 'depositAmount', label: '应收定金', visible: false, width: 200, align: 'right' },
          { props: 'receivableAmount', label: '门店应收金额', visible: false, width: 200, align: 'right' },
          { props: 'equityDeductionTotalAmount', label: '权益抵扣总额', visible: false, width: 200, align: 'right' },
          { props: 'invoiceAmount', label: '开票金额', visible: false, width: 200, align: 'right' },
          { props: 'paymentTime', label: '缴定金时间', visible: false, width: 200 },
          { props: 'lockTime', label: '锁单时间', visible: false, width: 200 },
          { props: 'deliveryNoticeTime', label: '触发交付通知时间', visible: false, width: 200 },
          { props: 'deliveryTime', label: '交车时间', visible: false, width: 200, sortable: true },
          { props: 'saleDealerName', label: '订单销售门店', visible: false, width: 200 },
          { props: 'saleDealerCode', label: '订单销售门店编码', visible: false, width: 200 },
          { props: 'saleUserName', label: '订单销售顾问', visible: false, width: 200 },
          { props: 'deliveryDealerName', label: '订单交付门店', visible: false, width: 200 },
          { props: 'deliveryDealerCode', label: '订单交付门店编码', visible: false, width: 200 },
          { props: 'deliveryUserName', label: '订单交付顾问', visible: false, width: 200 },
          { props: 'deliveryBatteryPower', label: '交车时电量', visible: false, width: 200, align: 'right' },
          { props: 'deliveryMileage', label: '交车时里程', visible: false, width: 200, align: 'right' },
          { props: 'financialSchemeLabel', label: '金融方案', visible: false, width: 120 },
          { props: 'dealerCompanyName', label: '母公司名称', visible: true, width: 240 },
          { props: 'dealerCompanyCode', label: '母公司编码', visible: true, width: 140 },
          { props: 'vehicleMaterialCode', label: '整车物料编码', visible: true, width: 240 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 240 },
          { props: 'cooperationTypeLabel', label: '合作类型', visible: true, width: 140 },
          { props: 'isEmployeePurchaseLabel', label: '是否员工购车', visible: true, width: 140 },
          { props: 'orderTypeLabel', label: '门店整车订单类型', visible: true, width: 150 },
          { props: 'createTime', label: '创建时间', visible: false, width: 200, sortable: true },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              show: (row) => {
                return row.status !== 99 && row.status !== 7 && this.permissions.has(`${this.moduleKey}-addOrUpdate`);
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/deliveryOrder/edit',
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
      },
      sortColumns: []
    };
  },
  computed: {
    // 分派按钮是否可点：至少选 1 条，且每条 status 都等于字符串 '1'（待预约）
    canAssign () {
      if (!this.selectionList || this.selectionList.length === 0) return false;
      return this.selectionList.every(item => String(item.status) === '1');
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    // 创建时间默认最近三个月（dateranges 位于 v-if="show" 内，首次挂载时不会执行 setDefault，
    // 提前在 model 上赋值，保证查询时默认带上时间段；展开后 dateranges 挂载也会再次同步）
    const { startTime, endTime } = getTimeRangeByTypeFormat('最近三个月');
    this.form.createTime = [startTime, endTime];
    this.handleClickTab();
  },
  methods: {
    // 交付门店变更时重新加载交付顾问
    async onDeliveryDealerChange () {
      this.form.deliveryUserId = '';
      this.deliveryUserOptions = [];
      const orgCodeList = this.form.deliveryDealerCodeList || [];
      if (!orgCodeList.length) return;
      const res = await engineerList({ salesConfigKey: 'deliveryUser', orgCodeList });
      this.deliveryUserOptions = res?.data || res || [];
    },
    // 排序
    handleSortChange (value) {
      const list = value || [];
      if (!list.length) {
        this.sortColumns = [];
        this.getData();
        return;
      }
      const latest = list.reduce((acc, cur) => (cur.sortTime || 0) > (acc.sortTime || 0) ? cur : acc);
      const def = this.optionObj.dataProp.find(d => d.props === latest.field) || {};
      this.sortColumns = [{
        column: def.sortField || (latest.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
        sort: (latest.order || '').toUpperCase()
      }];
      this.getData();
    },
    // Tab 切换
    handleClickTab () {
      // 切换 Tab 时清空 Tab 控制的过滤字段，避免与上一次 Tab 冲突
      this.form.statusList = [];
      delete this.form.appointmentTimeStart;
      delete this.form.appointmentTimeEnd;
      const pad = (n) => String(n).padStart(2, '0');
      const fmtDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

      if (this.tabName === 'all') {
        this.form.appointmentTime = [];
        this.form.appointmentTimeStart = '';
        this.form.appointmentTimeEnd = '';
        // 全部：不设置任何 Tab 过滤，使用默认兜底 statusList
      } else if (this.tabName === 'pending') {
        // 待邀约交车单：交车状态 = 待预约(1)
        this.form.statusList = ['1'];
        this.form.appointmentTime = [];
        this.form.appointmentTimeStart = '';
        this.form.appointmentTimeEnd = '';
      } else if (this.tabName === 'today') {
        // 今日待交车：预约提车时间为当日，且状态不等于交车完成(7)和作废(99)
        const start = new Date(); start.setHours(0, 0, 0, 0);
        const end = new Date(); end.setHours(23, 59, 59, 0);
        this.form.statusList = ['1', '2', '3', '4', '5', '6'];
        this.form.appointmentTimeStart = fmtDate(start) + ' 00:00:00';
        this.form.appointmentTimeEnd = fmtDate(end) + ' 23:59:59';
        this.form.appointmentTime = [this.form.appointmentTimeStart, this.form.appointmentTimeEnd];
      } else if (this.tabName === 'tomorrow') {
        // 明日待交车：预约提车时间为次日，且状态不等于交车完成(7)和作废(99)
        const start = new Date(); start.setDate(start.getDate() + 1); start.setHours(0, 0, 0, 0);
        const end = new Date(); end.setDate(end.getDate() + 1); end.setHours(23, 59, 59, 0);
        this.form.statusList = ['1', '2', '3', '4', '5', '6'];
        this.form.appointmentTimeStart = fmtDate(start) + ' 00:00:00';
        this.form.appointmentTimeEnd = fmtDate(end) + ' 23:59:59';
        this.form.appointmentTime = [this.form.appointmentTimeStart, this.form.appointmentTimeEnd];
      } else if (this.tabName === 'remain') {
        // 剩余可交订单：状态不等于作废(99)和交车完成(7)
        this.form.statusList = ['1', '2', '3', '4', '5', '6'];
        this.form.appointmentTime = [];
        this.form.appointmentTimeStart = '';
        this.form.appointmentTimeEnd = '';
      }
      // 切回第一页，避免停留在之前 Tab 的页码
      this.optionObj.form.page = 1;
      this.getData();
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    // 分派按钮
    handleAssign () {
      if (!this.selectionList || this.selectionList.length === 0) {
        this.$message('请选择要分派的交车单');
        return;
      }
      // 规则1：所选交车单的 status 必须全部等于字符串 '1'（待预约）
      const allStatusOne = this.selectionList.every(
        item => String(item.status) === '1'
      );
      if (!allStatusOne) {
        this.$message.warning('仅待预约状态的交车单允许分派');
        return;
      }
      // 规则2：所选交车单的 deliveryDealerCode 必须全部一致
      const firstCode = this.selectionList[0].deliveryDealerCode;
      const allSameDealer = this.selectionList.every(
        item => item.deliveryDealerCode === firstCode
      );
      if (!allSameDealer) {
        this.$message.warning('交付门店不一致不允许分派');
        return;
      }
      this.$refs.assignDialog.open(this.selectionList);
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.deliveryUserOptions = [];
      // 重置后保留创建时间默认最近三个月
      const { startTime, endTime } = getTimeRangeByTypeFormat('最近三个月');
      this.form.createTime = [startTime, endTime];
      this.sortColumns = [];
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
        businessType: '交车单',
        dataFetchPath: 'vr/web/delivery/deliveryOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '交车单.xlsx');
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
      delete data.areaCodes;
      // 交车状态 1-待预约 2-待检测 3-已检测 4-已预约 5-已收尾款 6-车联网已开通 7-交车完成 99-作废
      // 如果未选择交车状态，且没有排除状态，默认按照 1,2,3,4,5,6,7 顺序查询
      if (!data.statusList || data.statusList.length === 0) {
        data.statusList = [1, 2, 3, 4, 5, 6, 7];
      }

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }
      if (this.form.appointmentTime) {
        delete data.appointmentTime;
        if (this.form.appointmentTime.length > 1) {
          data.appointmentTimeStart = this.form.appointmentTime[0];
          data.appointmentTimeEnd = this.form.appointmentTime[1];
        }
      }
      if (Array.isArray(this.form.vinList) && this.form.vinList.length <= 1) {
        delete data.vinList;
        data.vinLike = this.form.vinList[0] || '';
      }
      if (Array.isArray(this.form.deliveryOrderCodeList) && this.form.deliveryOrderCodeList.length <= 1) {
        delete data.deliveryOrderCodeList;
        data.deliveryOrderCodeLike = this.form.deliveryOrderCodeList[0] || '';
      }
      if (Array.isArray(this.form.mallOrderCodeList) && this.form.mallOrderCodeList.length <= 1) {
        delete data.mallOrderCodeList;
        data.mallOrderCodeLike = this.form.mallOrderCodeList[0] || '';
      }

      if (this.form.deliveryTime) {
        delete data.deliveryTime;
        if (this.form.deliveryTime.length > 1) {
          data.deliveryTimeStart = this.form.deliveryTime[0];
          data.deliveryTimeEnd = this.form.deliveryTime[1];
        }
      }

      // 排序字段
      data.sortColumns = this.sortColumns;
      return data;
    },
    async seriesSearch (query) {
      try {
        const res = await vehicleSeriesList({ seriesNameLike: query });
        this.seriesList = res;
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // el-cascader 多选变更时，遍历省/市树把每个选中的 code 按层级拆分到对应数组
    handleAreaChange (selectedCodes) {
      const codes = Array.isArray(selectedCodes) ? selectedCodes : [];
      const areaTree = this.areaOptions || [];
      const provinces = new Set();
      const cities = new Set();

      areaTree.forEach(province => {
        if (codes.includes(province.code)) {
          provinces.add(province.code);
        }
        (province.child || []).forEach(city => {
          if (codes.includes(city.code)) {
            cities.add(city.code);
          }
        });
      });

      this.form.provinceCodeList = [...provinces];
      this.form.cityCodeList = [...cities];
    },
  }
};
</script>

<style lang="scss" scoped>
.m-delivery-order-list {
  // 压缩已选折叠标签的展示宽度，避免撑破 inline 表单
  ::v-deep .item--area .el-cascader__tags .el-tag {
    max-width: 80px;
    height: 22px;
    padding: 0 6px;
    font-size: 12px;
    line-height: 20px;
  }
  ::v-deep .item--area .el-cascader__tags .el-tag__close {
    top: 0;
  }
  ::v-deep .el-cascader__search-input {
    margin: 2px 0 2px 10px;
  }
}
// ::v-deep .el-cascader__search-input {
//   display: none;
// }
</style>
