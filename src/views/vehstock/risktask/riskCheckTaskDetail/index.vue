<template>
  <div class="page-common m-risk-check-task-detail-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="110px"
      class="ais-search-form"
    >
      <el-form-item label="任务编码">
        <tag-input v-model="form.checkTaskCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="VIN码">
        <tag-input v-model="form.vinList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="车辆类型">
        <fetch-select
          :options="vehicleCategoryOptions"
          labelKey="label"
          valueKey="value"
          v-model="form.vehicleType"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="排查状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vs_risk_check_status"
          v-model="form.checkStatusList"
          placeholder="请选择"
          clearable
          filterable
          multiple
        />
      </el-form-item>
      <el-form-item label="车辆库存状态">
        <el-select v-model="form.vehicleStatus" placeholder="请选择" clearable filterable>
          <el-option
            v-for="item in vehicleStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="锁定状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vs_risk_check_lock_status"
          v-model="form.lockStatus"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="销售门店">
        <tag-input v-model="form.saleDealerNameList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="交付门店">
        <tag-input v-model="form.deliveryDealerNameList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="车机版本号">
        <tag-input v-model="form.vehicleSystemVersionList" placeholder="请输入" />
      </el-form-item>
      <page-search-action
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
      <!-- 🔑 LPVxeTable 必传 :get-config / :save-or-update，否则表格不挂载 -->
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-page
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getDetailList, cancelCheck, unlockVehicle } from '@/api/vehstock/risktask/riskCheckTaskDetail/index';
import { getTableConfig, tableAddOrUpdate, getEnum, exportTable } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { downloadExcel } from '@/libs/utils';

// 🔑 本页是「跨任务全量明细」视图：不传 checkTaskId（后端 Param 已改为选填），
//    由 GatewayImpl 的 @DataPermission(SUBORDINATE) 按门店可见范围收窄。
// 🔑 5 个文本条件统一走 TagInput 数组：单个 = 长度 1、批量 = N 个，后端按 IN 精准。
//    · 销售/交付门店按门店中文名称匹配（复用后端已有的 *DealerNameList）
//    · 车机版本号例外：单个走 vehicleSystemVersion（LIKE 模糊），批量走 vehicleSystemVersionList（IN 精准）
const defaultForm = {
  checkTaskCodeList: [],
  vinList: [],
  vehicleType: '',
  checkStatusList: [],
  vehicleStatus: '',
  lockStatus: '',
  saleDealerNameList: [],
  deliveryDealerNameList: [],
  vehicleSystemVersionList: []
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
    TagInput
  },
  data () {
    return {
      pageTitle: '排查任务明细',
      pageType: 'list',
      form: {
        ...defaultForm
      },
      // 🔑 独立二级菜单权限前缀，与 RiskCheckTaskDetailResource.sql 的 resourceTag 一致
      moduleKey: 'AISVS-riskCheckTaskDetail',
      show: false,
      loading: false,
      exportLoading: false,
      // 🔑 车辆库存状态复用台账字典 vehstock_vechicle_status（key 照抄错拼，不修正）
      vehicleStatusOptions: [
        { label: '在途', value: 11 },
        { label: '待提交PDI', value: 20 },
        { label: 'PDI待修复', value: 25 },
        { label: '已入门店库', value: 12 },
        { label: '销售出库', value: 13 },
        { label: '调拨在途', value: 16 },
        { label: '作废', value: 99 }
      ],
      // 🔑 车辆类型硬编码：与后端 ReservationStatusEnum 1:1（1商品车 3展车 10试驾车），字典 vs_vehicle_category
      vehicleCategoryOptions: [
        { label: '商品车', value: 1 },
        { label: '展车', value: 3 },
        { label: '试驾车', value: 10 }
      ],
      optionObj: {
        // 🔑 必须与其他页面错开：riskCheckTaskDetailTable 已被「排查任务管理-车辆排查清单」占用，
        //    共用会抢同一份用户表头配置。
        id: 'riskCheckTaskDetailAllTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        // 🔑 LPVxeTable 列定义只认 width（minWidth 不透传给 vxe-column，会退化成 auto 宽）
        dataProp: [
          {
            // 第一列 VIN：链接跳明细详情页，query.id = 明细 row.id
            props: 'vin',
            label: 'VIN码',
            visible: true,
            width: 190,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.goDetail(row);
              },
              type: 'primary'
            }]
          },
          {
            // 第二列任务编码：链接跳任务详情页，query.id 必须取 checkTaskId（任务主键），
            // 不能用明细 row.id；isEditing=false 与同域三处跳转写法一致
            props: 'checkTaskCode',
            label: '任务编码',
            visible: true,
            width: 190,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.goTaskDetail(row);
              },
              type: 'primary'
            }]
          },
          { props: 'vehicleTypeLabel', label: '车辆类型', visible: true, width: 100 },
          { props: 'modelName', label: '车型', visible: true, width: 150 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 170 },
          { props: 'saleDealerName', label: '销售门店', visible: true, width: 150 },
          { props: 'deliveryDealerName', label: '交付门店', visible: true, width: 150 },
          { props: 'vehicleStatusLabel', label: '库存状态', visible: true, width: 110 },
          { props: 'bindRetailOrderLabel', label: '是否匹配订单', visible: true, width: 110 },
          { props: 'checkStatusLabel', label: '排查状态', visible: true, width: 100 },
          { props: 'lockStatusLabel', label: '锁定状态', visible: true, width: 100 },
          { props: 'vehicleSystemVersion', label: '车机版本号', visible: true, width: 130 },
          { props: 'checkResultNote', label: '排查说明', visible: true, width: 170 },
          { props: 'checkTime', label: '排查时间', visible: true, width: 170 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '取消排查',
              // 🔑 G9：已排查(110) 的车辆不能取消排查
              show: (row) => Number(row.checkStatus) !== 110,
              click: (rowIndex, row) => {
                this.handleCancelCheck(row);
              },
              type: 'info'
            }, {
              name: '车辆解锁',
              // 🔑 G10：已解锁(0) 不重复操作
              show: (row) => Number(row.lockStatus) === 1,
              click: (rowIndex, row) => {
                this.handleUnlockVehicle(row);
              },
              type: 'primary'
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
    /**
     * 覆盖 permissions mixin 的同名方法：本页权限点全部挂在独立二级菜单下。
     * 🔑 第一列「VIN」链接 = 明细详情入口，第二列「任务编码」链接 = 任务详情入口；
     *    无 -detail 权限点则两个链接一并移除，退化为纯文本。
     */
    fixTableConfig () {
      if (!this.canDetail) {
        delete this.optionObj.dataProp[0].buttons;
        delete this.optionObj.dataProp[1].buttons;
      }
      const operate = this.optionObj?.dataProp?.find(item => item.props === 'operate');
      if (!operate) {
        return;
      }
      if (!operate.buttons) {
        operate.buttons = [];
      }
      if (!this.permissions.has(`${this.moduleKey}-cancelCheck`)) {
        operate.buttons = operate.buttons.filter(item => item.name !== '取消排查');
      }
      if (!this.permissions.has(`${this.moduleKey}-unlockVehicle`)) {
        operate.buttons = operate.buttons.filter(item => item.name !== '车辆解锁');
      }
      if (operate.buttons.length === 0) {
        this.optionObj.dataProp = this.optionObj.dataProp.filter(item => item.props !== 'operate');
      }
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.getData();
    },
    getData () {
      this.loading = true;
      // 🔑 不带 checkTaskId：跨任务全量明细（后端按数据权限收窄）
      getDetailList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = (res && res.records) || [];
          this.optionObj.total = res?.total || 0;
        }).catch(err => {
          console.error('排查任务明细查询失败:', err);
          this.optionObj.dataList = [];
          this.optionObj.total = 0;
        }).finally(() => {
          this.loading = false;
        });
    },
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
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
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        const value = data[key];
        // 空数组与空串一样不下传，避免后端收到空 IN 条件
        if (value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
          delete data[key];
        }
      });
      // 🔑 车机版本号：单个值走 vehicleSystemVersion（后端 LIKE 模糊），多个值走 List（后端 IN 精准）。
      //    其余 4 个字段无论单个/批量都按数组走 IN 精准，与任务列表 checkTaskCodeList 范式一致。
      const versionList = data.vehicleSystemVersionList;
      if (versionList && versionList.length === 1) {
        data.vehicleSystemVersion = versionList[0];
        delete data.vehicleSystemVersionList;
      }
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 明细详情入口：路由挂在列表路径下，面包屑首级点击才能正确回跳本列表
    goDetail (row) {
      this.$router.push({
        path: '/vehstock/risktask/riskCheckTaskDetail/detail',
        query: { id: row.id }
      });
    },
    // 任务详情入口：id 必须取 checkTaskId（任务主键），不是明细 row.id
    goTaskDetail (row) {
      this.$router.push({
        path: '/vehstock/risktask/riskCheckTask/edit',
        query: { id: row.checkTaskId, isEditing: false }
      });
    },
    // 取消排查（G9）
    // 🔑 后端契约：checkTaskId 必填（@NotEmpty），detailIds 为数组（单行也传数组）
    handleCancelCheck (row) {
      this.$confirm('取消排查后该车辆将退出本次排查任务，是否继续', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelCheck({ checkTaskId: row.checkTaskId, detailIds: [row.id] }).then(() => {
          this.$message({ type: 'success', message: '取消排查成功!' });
          this.getData();
        }).catch(() => {});
      }).catch(() => {});
    },
    // 车辆解锁（G10）
    // 🔑 后端契约：detailIds 为数组（单行也传数组）
    handleUnlockVehicle (row) {
      this.$confirm('解锁后该车辆可正常交车，是否继续', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unlockVehicle({ detailIds: [row.id] }).then(() => {
          this.$message({ type: 'success', message: '解锁成功!' });
          this.getData();
        }).catch(() => {});
      }).catch(() => {});
    },
    // 导出（通用导出：dataFetchPath 指向本页分页接口，不带 checkTaskId）
    exportExcel () {
      this.exportLoading = true;
      const reqParams = { ...this.getFormData() } || {};
      exportTable({
        businessType: '排查任务明细',
        dataFetchPath: 'vehstock/web/risktask/riskCheckTaskDetail/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '排查任务明细.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
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
    }
  }
};
</script>
