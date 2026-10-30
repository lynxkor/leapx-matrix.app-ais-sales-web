<template>
  <div class="page-common m-risk-check-task-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="110px"
      class="ais-search-form"
    >
      <el-form-item label="任务编码">
        <el-input
          placeholder="请输入"
          v-model="form.checkTaskCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="任务名称">
        <el-input
          placeholder="请输入"
          v-model="form.taskName"
          clearable
        />
      </el-form-item>
      <el-form-item label="任务状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vs_risk_check_task_status"
          v-model="form.taskStatusList"
          placeholder="请选择"
          clearable
          filterable
          multiple
        />
      </el-form-item>
      <el-form-item label="是否锁车">
        <fetch-select
          :request="fetchOptions"
          enumCode="vs_risk_check_lock_flag"
          v-model="form.lockVehicleFlag"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="审核方式">
        <fetch-select
          :request="fetchOptions"
          enumCode="vs_risk_check_audit_type"
          v-model="form.auditTypeList"
          placeholder="请选择"
          clearable
          filterable
          multiple
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="form.createTime"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
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
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-permission="moduleKey+'-publish'" size="small" :disabled="!hasDraftSelected" @click="handleBatchPublish">发布</el-button>
      <el-button v-permission="moduleKey+'-addVehicle'" size="small" :disabled="selectionList.length !== 1" @click="handleAddVehicle">新增车辆</el-button>
      <el-button v-permission="moduleKey+'-importVehicle'" size="small" :disabled="selectionList.length !== 1" @click="handleImport">导入车辆</el-button>
      <el-button v-permission="moduleKey+'-end'" size="small" :disabled="selectionList.length === 0" @click="handleBatchEnd">结束任务</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
    <AddVehicleDialog
      :visible="addVehicleVisible"
      :task="currentTask"
      @close="closeAddVehicleDialog"
      @submit="getData"
    />
    <!-- T09 Excel 导入车辆：复用平台通用导入引擎（模板 code = riskCheckTaskVehicleImport），与 vehstock 其他导入页一致 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'riskCheckTaskVehicleImport'"
      :business-params="currentImportTaskId"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, endTask, publishTask } from '@/api/vehstock/risktask/riskCheckTask/index';
import { getTableConfig, tableAddOrUpdate, getEnum, exportTable } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getEndOfDayString, downloadExcel } from '@/libs/utils';
import AddVehicleDialog from './AddVehicleDialog.vue';
import Upload from '@/libs/components/UploadDialog';

const defaultForm = {
  checkTaskCode: '',
  taskName: '',
  taskStatusList: [],
  lockVehicleFlag: '',
  auditTypeList: [],
  createTime: []
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
    AddVehicleDialog,
    Upload
  },
  data () {
    return {
      pageTitle: '车辆排查任务',
      pageType: 'list',
      form: {
        ...defaultForm
      },
      selectionList: [],
      moduleKey: 'AISVS-risktask-riskCheckTask',
      show: false,
      loading: false,
      exportLoading: false,
      // 新增车辆弹窗
      addVehicleVisible: false,
      currentTask: {},
      // T09 Excel 导入弹窗
      uploadDialogVisible: false,
      currentImportTaskId: '',
      optionObj: {
        id: 'riskCheckTaskTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'checkTaskCode',
            label: '任务编码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/risktask/riskCheckTask/edit',
                  query: {
                    id: row.id,
                    isEditing: false
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'taskName', label: '任务名称', visible: true, minWidth: 180 },
          { props: 'taskStatusLabel', label: '任务状态', visible: true, width: 100 },
          { props: 'lockVehicleFlagLabel', label: '是否锁车', visible: true, width: 100 },
          { props: 'auditTypeLabel', label: '审核方式', visible: true, width: 120 },
          { props: 'totalVehicleCount', label: '车辆数量', visible: true, align: 'right', width: 100 },
          { props: 'finishedVehicleCount', label: '完成数量', visible: true, align: 'right', width: 100 },
          { props: 'remainVehicleCount', label: '剩余数量', visible: true, align: 'right', width: 100 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 140 },
          { props: 'createTime', label: '创建时间', visible: true, width: 170 },
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
                  path: '/vehstock/risktask/riskCheckTask/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '车辆清单',
              click: (rowIndex, row) => {
                this.goDetail(row);
              },
              type: 'primary'
            }, {
              name: '审核',
              // 🔑 审核列表（人工审核才有待审记录）
              show: (row) => Number(row.auditType) === 10,
              click: (rowIndex, row) => {
                this.goAudit(row);
              },
              type: 'primary'
            }, {
              name: '发布',
              // 🔑 仅草稿(10)的任务可发布
              show: (row) => Number(row.taskStatus) === 10,
              click: (rowIndex, row) => {
                this.handlePublish([row.id]);
              },
              type: 'primary'
            }, {
              name: '结束任务',
              // 🔑 仅进行中(60)的任务可结束
              show: (row) => Number(row.taskStatus) === 60,
              click: (rowIndex, row) => {
                this.handleEnd([row.id]);
              },
              type: 'primary'
            }, {
              name: '删除',
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '删除',
              popconfirmTitle: '此操作将永久删除, 是否继续?',
              click: (rowIndex, row) => {
                this.handleDelete([row.id]);
              },
              type: 'danger'
            }]
          }
        ],
        total: 0
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  computed: {
    // 勾选项中是否存在草稿状态（只有草稿可发布）
    hasDraftSelected () {
      return this.selectionList.some(item => Number(item.taskStatus) === 10);
    }
  },
  methods: {
    /**
     * 操作列按钮按权限过滤（覆盖 permissions mixin 的同名方法，追加本模块专属权限点）
     * 🔑 覆盖 mixin 的 fixTableConfig：本页需额外按 `end` 权限点过滤「结束任务」按钮
     */
    fixTableConfig () {
      const operate = this.optionObj?.dataProp?.find(item => item.props === 'operate');
      if (!operate) {
        return;
      }
      if (!operate.buttons) {
        operate.buttons = [];
      }
      if (!this.canAddOrUpdate) {
        operate.buttons = operate.buttons.filter(item => item.name !== '编辑');
      }
      if (!this.canDelete) {
        operate.buttons = operate.buttons.filter(item => item.name !== '删除');
      }
      if (!this.canLog) {
        operate.buttons = operate.buttons.filter(item => item.name !== '日志');
      }
      // 本模块专属：结束任务
      if (!this.permissions.has(`${this.moduleKey}-end`)) {
        operate.buttons = operate.buttons.filter(item => item.name !== '结束任务');
      }
      // 本模块专属：发布
      if (!this.permissions.has(`${this.moduleKey}-publish`)) {
        operate.buttons = operate.buttons.filter(item => item.name !== '发布');
      }
      // 本模块专属：审核
      if (!this.permissions.has(`${this.moduleKey}-audit-page`)) {
        operate.buttons = operate.buttons.filter(item => item.name !== '审核');
      }
      if (operate.buttons.length === 0) {
        this.optionObj.dataProp = this.optionObj.dataProp.filter(item => item.props !== 'operate');
      }
      if (!this.canDetail) {
        delete this.optionObj.dataProp[0].buttons;
      }
    },
    handleAdd () {
      this.$router.push({
        path: '/vehstock/risktask/riskCheckTask/edit'
      });
    },
    // 进入车辆清单页（T10）
    goDetail (row) {
      this.$router.push({
        path: '/vehstock/risktask/riskCheckTask/detail',
        query: {
          checkTaskId: row.id,
          checkTaskCode: row.checkTaskCode
        }
      });
    },
    // 进入审核列表页（T14）
    goAudit (row) {
      this.$router.push({
        path: '/vehstock/risktask/riskCheckTask/audit',
        query: {
          checkTaskId: row.id,
          checkTaskCode: row.checkTaskCode
        }
      });
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
      this.selectionList = [];
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = (res && res.records) || [];
          this.optionObj.total = res?.total || 0;
        }).catch(err => {
          console.error('车辆排查任务列表查询失败:', err);
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
          data.createTimeEnd = getEndOfDayString(this.form.createTime[1]);
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
    // 发布任务（单行/批量共用）
    handlePublish (ids) {
      if (!ids || ids.length === 0) {
        return;
      }
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">发布后任务进入进行中，可新增车辆，是否继续</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        // 后端逐条校验草稿态，这里只提交草稿行
        const draftIds = this.selectionList
          .filter(item => Number(item.taskStatus) === 10)
          .map(item => item.id);
        const submitIds = draftIds.length > 0 ? draftIds : ids;
        const tasks = submitIds.map(id => Promise.resolve(publishTask({ checkTaskId: id })));
        Promise.all(tasks).then(() => {
          this.$message({
            type: 'success',
            message: '发布成功!'
          });
          this.getData();
        }).catch(() => {});
      }).catch(() => {});
    },
    // 批量发布
    handleBatchPublish () {
      const ids = this.selectionList
        .filter(item => Number(item.taskStatus) === 10)
        .map(item => item.id);
      this.handlePublish(ids);
    },
    // 结束任务（单行/批量共用）
    handleEnd (ids) {
      if (!ids || ids.length === 0) {
        return;
      }
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">结束后任务不可再新增车辆或结束，未完成车辆将统一解锁，是否继续</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        endTask({ ids }).then(() => {
          this.$message({
            type: 'success',
            message: '结束成功!'
          });
          this.getData();
        }).catch(() => {});
      }).catch(() => {});
    },
    handleDelete (ids) {
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
        this.handleDelete(ids);
      }).catch(() => {});
    },
    // 导出（通用导出：dataFetchPath 指向本页分页接口）
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '风险车辆排查任务',
        dataFetchPath: 'vehstock/web/risktask/riskCheckTask/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '风险车辆排查任务.xlsx');
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
    // 结束任务（支持批量）
    handleBatchEnd () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.handleEnd(ids);
    },
    // 新增车辆（弹窗批量输入 VIN）
    handleAddVehicle () {
      if (this.selectionList.length !== 1) {
        return;
      }
      this.currentTask = this.selectionList[0];
      this.addVehicleVisible = true;
    },
    // 关闭新增车辆弹窗
    closeAddVehicleDialog () {
      this.addVehicleVisible = false;
      this.currentTask = {};
    },
    // T09 Excel 导入车辆（走平台通用导入引擎，仅允许选中 1 个任务；checkTaskId 经 businessParams 透传给后端处理器）
    handleImport () {
      if (this.selectionList.length !== 1) {
        return;
      }
      this.currentImportTaskId = this.selectionList[0].id;
      this.uploadDialogVisible = true;
    },
    // 导入弹窗关闭（成功/取消均触发；列表已通过 @getData 刷新）
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
      this.currentImportTaskId = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.m-risk-check-task-list {
}
</style>
