<template>
  <div class="page-common m-event-notify-task-list">
    <!-- 搜索表单 -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="120px"
      class="ais-search-form"
    >
      <el-form-item label="业务系统">
        <fetch-select
          :request="fetchOptions"
          enumCode="event_source_sys_enum"
          v-model="form.systemPrefix"
          @change="systemPrefixChange"
          placeholder="请选择"
          filterable
        />
      </el-form-item>
      <el-form-item label="事件类型">
        <fetch-select
          :options="eventTypeOptions"
          v-model="form.typeList"
          value-key="code"
          label-key="name"
          clearable
          filterable
          multiple
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="系统平台">
        <fetch-select
          v-model="form.targetList"
          :options="thirdTargetPlatformOptions"
          value-key="code"
          label-key="name"
          placeholder="请选择"
          clearable
          filterable
          multiple
        />
      </el-form-item>
      <el-form-item label="执行状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="event_execute_result_enum"
          v-model="form.executeResultList"
          placeholder="请选择"
          clearable
          filterable
          multiple
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="事件场景">
          <el-input
            placeholder="请输入"
            v-model="form.scene"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="业务标识编号">
          <tag-input
            placeholder="请输入"
            v-model="form.bizNoList"
            clearable
          />
        </el-form-item>
        <el-form-item label="业务关联单据">
          <tag-input
            placeholder="请输入"
            v-model="form.relatedNoList"
            clearable
          />
        </el-form-item>
        <el-form-item label="事件任务ID">
          <tag-input
            placeholder="请输入"
            v-model="form.eventNotifyIdList"
            clearable
          />
        </el-form-item>
        <el-form-item label="事件数据快照">
          <el-input
            type="text"
            placeholder="请输入"
            v-model="form.dataParam"
            clearable
          />
        </el-form-item>
        <el-form-item label="失败原因">
          <el-input
            type="text"
            placeholder="请输入"
            v-model="form.failedReason"
            clearable
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.eventAtRange"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleEventAtRangeChange"
            clearable
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

    <!-- 操作按钮 -->
    <div class="ais-actions">
<!--      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>-->
<!--      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>-->
            <el-button v-if="canDelete" size="small" @click="handleBatchExecute" :disabled="selectionList.length === 0">同步重试</el-button>
            <el-button v-if="canDelete" size="small" @click="handleBatchExecuteAsync" :disabled="selectionList.length === 0">异步重试</el-button>
            <el-button v-if="canDelete" size="small" @click="handleBatchCancel" :disabled="selectionList.length === 0">取消任务</el-button>
    </div>

    <!-- 表格 -->
    <div class="ais-table-c">
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
        :checkbox-config="{ checkMethod: checkBoxCheckMethod }"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId" :prefix="form.systemPrefix"/>
      </LPVxeTable>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import {
  deleteItem,
  findEventTypeList,
  findThirdTargetPlatformList,
  getList,
  manualCancel,
  manualExecute,
  manualExecuteAsync
} from '@/api/vehretail/event/eventNotifyTask';
import { getEnum, getTableConfig, tableAddOrUpdate } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput/index.vue';

const defaultForm = {
  bizNo: '',
  scene: '',
  type: null,
  executeResult: null,
  systemPrefix: 'vr',
  target: '',
  status: null,
  relatedNo: '',
  eventAt: null,
  eventAtRange: null,
  createTime: null
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    TagInput,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage
  },
  data () {
    return {
      pageTitle: '事件通知任务',
      pageType: 'list',
      // 权限前缀
      moduleKey: 'AISVRTE-event',
      form: {
        ...defaultForm
      },
      selectionList: [],
      eventTypeOptions: [],
      thirdTargetPlatformOptions: [],
      show: false,
      loading: false,
      clickItemId: '',
      optionObj: {
        id: 'eventNotifyTaskTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'eventNotifyId',
            label: '事件任务ID',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/event/eventNotifyTask/edit',
                  query: {
                    id: row.id,
                    systemPrefix: this.form.systemPrefix
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'bizNo', label: '业务标识编号', visible: true, width: 150 },
          { props: 'relatedNo', label: '业务关联单据', visible: true, width: 200 },
          { props: 'executeResultLabel', label: '执行状态', visible: true, width: 100 },
          { props: 'type', label: '事件类型', visible: true, width: 200 },
          { props: 'scene', label: '事件场景描述', visible: true, width: 200 },
          { props: 'eventAt', label: '事件发生时间', visible: true, width: 180 },
          { props: 'target', label: '系统平台编码', visible: true, width: 150 },
          { props: 'targetDesc', label: '系统平台', visible: true, width: 150 },
          { props: 'failedCount', label: '失败次数', visible: true, width: 100 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 },
          { props: 'updateTime', label: '更新时间', visible: false, width: 180 },
          { props: 'failedReason', label: '失败原因', visible: true, width: 300 },
          { props: 'dataIsolationIndex', label: '数据隔离索引', visible: false, width: 150 },
          { props: 'remark', label: '备注', visible: false, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right'
          }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.findEventTypeOptions();
    this.findThirdTargetPlatformOptions();
    this.getData();
  },
  methods: {
    checkBoxCheckMethod ({ row }) {
      // executeResult 为 8 或 9 时禁用复选框
      return row.executeResult !== 8 && row.executeResult !== 9;
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleAdd () {
      this.$router.push({
        path: '/vehretail/event/eventNotifyTask/edit'
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
    getData () {
      this.loading = true;
      this.selectionList = [];
      this.optionObj.dataList = [];
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size }, this.form.systemPrefix)
        .then(res => {
          const records = res?.records || [];
          this.optionObj.dataList = records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res?.total || 0;
        }).catch(err => {
          console.error('获取事件通知任务列表失败:', err);
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

      if (this.form.eventAt) {
        delete data.eventAt;
        if (this.form.eventAt.length > 1) {
          data.eventAtStart = this.form.eventAt[0];
          data.eventAtEnd = this.form.eventAt[1];
        }
      }

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }

      if (this.selectionList.length > 0) {
        data.ids = this.selectionList.map(item => item.id);
      }

      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    systemPrefixChange (val) {
      this.form.systemPrefix = val;
      this.eventTypeOptions = [];
      this.thirdTargetPlatformOptions = [];
      this.findEventTypeOptions();
      this.findThirdTargetPlatformOptions();
      this.getData();
    },
    findEventTypeOptions () {
      findEventTypeList(this.form.systemPrefix).then(res => {
        this.$nextTick(() => {
          this.eventTypeOptions = res || [];
        });
      });
    },
    findThirdTargetPlatformOptions () {
      findThirdTargetPlatformList(this.form.systemPrefix).then(res => {
        this.$nextTick(() => {
          this.thirdTargetPlatformOptions = res || [];
        });
      });
    },
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
    handleBatchExecute () {
      // 检查所选记录
      const invalidRecords = this.selectionList.filter(item => item.executeResult === 8 && item.executeResult === 9);
      if (invalidRecords.length > 0) {
        this.$message.warning('已经完成或已取消的任务不能再次执行！');
        return;
      }
      const ids = this.selectionList.map(item => item.id);
      manualExecute({ idList: ids }, this.form.systemPrefix).then(res => {
        this.$message.success('操作成功');
        this.getData();
      });
    },
    handleBatchExecuteAsync () {
      // 检查所选记录
      const invalidRecords = this.selectionList.filter(item => item.executeResult === 8 && item.executeResult === 9);
      if (invalidRecords.length > 0) {
        this.$message.warning('已经完成或已取消的任务不能再次执行！');
        return;
      }
      const ids = this.selectionList.map(item => item.id);
      manualExecuteAsync({ idList: ids }, this.form.systemPrefix).then(res => {
        this.$message.success('操作成功');
        this.getData();
      });
    },
    handleBatchCancel () {
      // 检查所选记录
      const invalidRecords = this.selectionList.filter(item => item.executeResult === 8 && item.executeResult === 9);
      if (invalidRecords.length > 0) {
        this.$message.warning('已经完成或已取消的任务不能取消！');
        return;
      }
      const ids = this.selectionList.map(item => item.id);
      manualCancel({ idList: ids }, this.form.systemPrefix).then(res => {
        this.$message.success('取消成功');
        this.getData();
      });
    },
    handleEventAtRangeChange (timeRange) {
      if (timeRange && timeRange.length > 1) {
        this.form.createTimeStart = timeRange[0];
        this.form.createTimeEnd = timeRange[1];
      } else {
        this.form.createTimeStart = null;
        this.form.createTimeEnd = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-event-notify-task-list {
}
</style>
