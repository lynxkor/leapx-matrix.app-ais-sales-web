<template>
  <edit-page-layout ref="editLayout" :title="pannelTitle" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑表单 -->
              <el-form :inline="true"
                       :model="form"
                       :rules="rules"
                       colmuns="2"
                       ref="ruleForm"
                       label-width="150px"
                       class="form-edit"
                       v-show="isEditing || !_id"
              >
                <el-form-item label="事件任务ID：" prop="eventNotifyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.eventNotifyId"
                    :disabled="!!_id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="业务标识编号：" prop="bizNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.bizNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="事件场景描述：" prop="scene">
                  <el-input
                    placeholder="请输入"
                    v-model="form.scene"
                    maxlength="50"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item label="事件类型：" prop="type">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="event_notify_task_type"
                    v-model="form.type"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="事件发生时间：" prop="eventAt">
                  <el-date-picker
                    v-model="form.eventAt"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="业务关联单据：" prop="relatedNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.relatedNo"
                    maxlength="128"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据隔离索引：" prop="dataIsolationIndex">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataIsolationIndex"
                    maxlength="20"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item label="目标平台：" prop="target">
                  <el-input
                    placeholder="请输入"
                    v-model="form.target"
                    maxlength="50"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item label="执行结果：" prop="executeResult">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="ExecuteResultEnum"
                    v-model="form.executeResult"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="失败次数：" prop="failedCount">
                  <el-input-number
                    v-model="form.failedCount"
                    :min="0"
                    :precision="0"
                    placeholder="请输入"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="失败原因：" prop="failedReason">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="form.failedReason"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="事件数据快照：" prop="dataParam">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入"
                    v-model="form.dataParam"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="拓展字段1：" prop="extend1">
                  <el-input
                    placeholder="请输入"
                    v-model="form.extend1"
                    maxlength="125"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item label="拓展字段2：" prop="extend2">
                  <el-input
                    placeholder="请输入"
                    v-model="form.extend2"
                    maxlength="125"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态描述：" prop="statusDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.statusDesc"
                    maxlength="20"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="form.remark"
                    maxlength="500"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-form>

              <!-- 详情展示 -->
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="事件任务ID：" prop="eventNotifyId">
                  {{ form.eventNotifyId }}
                </el-form-item>
                <el-form-item label="业务标识编号：" prop="bizNo">
                  {{ form.bizNo }}
                </el-form-item>
                <el-form-item label="事件场景描述：" prop="scene">
                  {{ form.scene }}
                </el-form-item>
                <el-form-item label="事件类型：" prop="typeLabel">
                  {{ form.type }}
                </el-form-item>
                <el-form-item label="事件发生时间：" prop="eventAt">
                  {{ form.eventAt }}
                </el-form-item>
                <el-form-item label="业务关联单据：" prop="relatedNo">
                  {{ form.relatedNo }}
                </el-form-item>
                <el-form-item label="数据隔离索引：" prop="dataIsolationIndex">
                  {{ form.dataIsolationIndex }}
                </el-form-item>
                <el-form-item label="目标平台：" prop="target">
                  {{ form.target }}
                </el-form-item>
                <el-form-item label="执行结果：" prop="executeResultLabel">
                  {{ form.executeResultLabel }}
                </el-form-item>
                <el-form-item label="失败次数：" prop="failedCount">
                  {{ form.failedCount }}
                </el-form-item>
                <el-form-item label="失败原因：" prop="failedReason">
                  {{ form.failedReason }}
                </el-form-item>
                <el-form-item label="事件数据快照：" prop="dataParam">
                  {{ form.dataParam }}
                </el-form-item>
                <el-form-item label="拓展字段1：" prop="extend1">
                  {{ form.extend1 }}
                </el-form-item>
                <el-form-item label="拓展字段2：" prop="extend2">
                  {{ form.extend2 }}
                </el-form-item>
                <el-form-item label="数据参数快照：" prop="dataParam">
                  {{ form.dataParam }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="版本号：" prop="version">
                  {{ form.version }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { addOrUpdate, getDetail } from '@/api/vehretail/event/eventNotifyTask';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: null,
  eventNotifyId: '',
  bizNo: '',
  scene: '',
  type: null,
  typeLabel: '',
  eventAt: null,
  relatedNo: '',
  dataIsolationIndex: '',
  target: '',
  executeResult: 0,
  executeResultLabel: '',
  failedCount: 0,
  failedReason: '',
  dataParam: '',
  extend1: '',
  extend2: '',
  status: 1,
  statusLabel: '',
  statusDesc: '',
  version: 0,
  creator: null,
  creatorName: '',
  createTime: '',
  modifier: null,
  modifierName: '',
  updateTime: '',
  remark: ''
};

export default {
  name: 'eventNotifyTaskEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '业务标识编号：' + (this.form.bizNo || '');
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '事件通知任务',
      pageType: 'edit',
      // 权限前缀
      moduleKey: 'AISVRTE-event',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      pannelTitle: '',
      rules: {
        eventNotifyId: [
          {
            required: true,
            message: '请输入事件任务ID',
            trigger: 'change'
          }
        ],
        bizNo: [
          {
            required: true,
            message: '请输入业务标识编号',
            trigger: 'change'
          }
        ],
        scene: [
          {
            required: true,
            message: '请输入事件场景描述',
            trigger: 'change'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择事件类型',
            trigger: 'change'
          }
        ],
        relatedNo: [
          {
            required: true,
            message: '请输入业务关联单据',
            trigger: 'change'
          }
        ],
        status: [
          {
            required: true,
            message: '请选择状态',
            trigger: 'change'
          }
        ]
      }
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id, this.$route.query.systemPrefix);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
