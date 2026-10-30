<template>
  <div class="page-common m-risk-check-detail-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="110px"
      class="ais-search-form"
    >
      <el-form-item label="VIN码">
        <el-input
          placeholder="请输入"
          v-model="form.vin"
          clearable
        />
      </el-form-item>
      <el-form-item label="车辆类型">
        <fetch-select
          :request="fetchOptions"
          enumCode="vs_vehicle_category"
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
        <el-input placeholder="请输入" v-model="form.saleDealerCode" clearable />
      </el-form-item>
      <el-form-item label="交付门店">
        <el-input placeholder="请输入" v-model="form.deliveryDealerCode" clearable />
      </el-form-item>
      <el-form-item label="车机版本号">
        <el-input placeholder="请输入" v-model="form.vehicleSystemVersion" clearable />
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
      <el-button
        v-permission="moduleKey+'-detail-oneClickRemind'"
        size="small"
        :disabled="!checkTaskId"
        @click="handleOneClickRemind"
      >一键提醒</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button size="small" @click="goBack">返回</el-button>
    </div>
    <div class="ais-table-c">
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
import { getDetailList, cancelCheck, unlockVehicle, oneClickRemind } from '@/api/vehstock/risktask/riskCheckTaskDetail/index';
import { getTableConfig, tableAddOrUpdate, getEnum, exportTable } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { downloadExcel } from '@/libs/utils';

const defaultForm = {
  vin: '',
  vehicleType: '',
  checkStatusList: [],
  vehicleStatus: '',
  lockStatus: '',
  saleDealerCode: '',
  deliveryDealerCode: '',
  vehicleSystemVersion: ''
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
    FetchSelect
  },
  data () {
    return {
      pageTitle: '车辆排查清单',
      pageType: 'list',
      form: {
        ...defaultForm
      },
      moduleKey: 'AISVS-risktask-riskCheckTask',
      show: false,
      loading: false,
      exportLoading: false,
      checkTaskId: this.$route.query.checkTaskId || '',
      checkTaskCode: this.$route.query.checkTaskCode || '',
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
      optionObj: {
        id: 'riskCheckTaskDetailTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'vin', label: 'VIN码', visible: true, minWidth: 190, fixed: 'left' },
          { props: 'vehicleTypeLabel', label: '车辆类型', visible: true, width: 100 },
          { props: 'modelName', label: '车型', visible: true, minWidth: 140 },
          { props: 'materialsDesc', label: '物料描述', visible: true, minWidth: 160 },
          { props: 'saleDealerName', label: '销售门店', visible: true, minWidth: 140 },
          { props: 'deliveryDealerName', label: '交付门店', visible: true, minWidth: 140 },
          { props: 'vehicleStatus', label: '库存状态', visible: true, width: 110 },
          { props: 'checkStatusLabel', label: '排查状态', visible: true, width: 100 },
          { props: 'lockStatusLabel', label: '锁定状态', visible: true, width: 100 },
          { props: 'vehicleSystemVersion', label: '车机版本号', visible: true, minWidth: 130 },
          { props: 'checkResultNote', label: '排查说明', visible: true, minWidth: 160 },
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
     * 操作列按钮按权限过滤（覆盖 permissions mixin 的同名方法）
     * 🔑 本模块专属权限点：cancelCheck / unlockVehicle
     */
    fixTableConfig () {
      const operate = this.optionObj?.dataProp?.find(item => item.props === 'operate');
      if (!operate) {
        return;
      }
      if (!operate.buttons) {
        operate.buttons = [];
      }
      if (!this.permissions.has(`${this.moduleKey}-detail-cancelCheck`)) {
        operate.buttons = operate.buttons.filter(item => item.name !== '取消排查');
      }
      if (!this.permissions.has(`${this.moduleKey}-detail-unlockVehicle`)) {
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
      getDetailList({ ...this.getFormData(), checkTaskId: this.checkTaskId, pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = (res && res.records) || [];
          this.optionObj.total = res?.total || 0;
        }).catch(err => {
          console.error('车辆排查清单查询失败:', err);
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
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 取消排查（G9）
    handleCancelCheck (row) {
      this.$confirm('取消排查后该车辆将退出本次排查任务，是否继续', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelCheck({ detailId: row.id }).then(() => {
          this.$message({ type: 'success', message: '取消排查成功!' });
          this.getData();
        }).catch(() => {});
      }).catch(() => {});
    },
    // 车辆解锁（G10）
    handleUnlockVehicle (row) {
      this.$confirm('解锁后该车辆可正常交车，是否继续', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unlockVehicle({ detailId: row.id }).then(() => {
          this.$message({ type: 'success', message: '解锁成功!' });
          this.getData();
        }).catch(() => {});
      }).catch(() => {});
    },
    // 一键提醒
    handleOneClickRemind () {
      if (!this.checkTaskId) {
        return;
      }
      oneClickRemind({ checkTaskId: this.checkTaskId }).then(count => {
        this.$message({ type: 'success', message: `提醒已发送，待排查车辆 ${count || 0} 辆` });
      }).catch(() => {});
    },
    // 返回任务列表
    goBack () {
      this.$router.push({ path: '/vehstock/risktask/riskCheckTask' });
    },
    // 导出（通用导出：dataFetchPath 指向本页分页接口）
    exportExcel () {
      this.exportLoading = true;
      const reqParams = { ...this.getFormData(), checkTaskId: this.checkTaskId } || {};
      exportTable({
        businessType: '风险车辆排查清单',
        dataFetchPath: 'vehstock/web/risktask/riskCheckTaskDetail/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '风险车辆排查清单.xlsx');
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

<style lang="scss" scoped>
.m-risk-check-detail-list {
}
</style>
