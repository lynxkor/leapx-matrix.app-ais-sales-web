<template>
  <edit-page-layout ref="editLayout" title="交付周期信息配置" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="编号：" prop="cycleConfigCode">
                  <el-input
                    placeholder="请输入编号（仅限字母和数字）"
                    v-model="form.cycleConfigCode"
                    clearable
                    :disabled="!!_id"
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="配置信息：" prop="configInfo">
                  <el-input
                    placeholder="请输入配置信息"
                    v-model="form.configInfo"
                    clearable
                    maxlength="100"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="text"
                    placeholder="请输入备注"
                    v-model="form.remark"
                    clearable
                    maxlength="100"
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime" v-if="_id">
                  <el-date-picker
                    v-model="form.createTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="创建时间"
                    disabled
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
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="编号：" prop="cycleConfigCode">
                  {{ form.cycleConfigCode }}
                </el-form-item>
                <el-form-item label="配置信息：" prop="configInfo">
                  {{ form.configInfo }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime" v-if="form.createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="状态：" prop="statusLabel">
                  {{ form.statusLabel }}
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
import { getDetail, addOrUpdate } from '@/api/vehretail/basicConfig/deliveryCycleConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  cycleConfigCode: '',
  configInfo: '',
  remark: '',
  createTime: '',
  status: 1,
  statusLabel: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  dataSource: ''
};

export default {
  name: 'deliveryCycleConfigEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
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
      return '编号：' + this.form.cycleConfigCode;
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
      pageTitle: '交付周期信息配置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-deliveryCycleConfig',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        cycleConfigCode: [
          { required: true, message: '请输入编号', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]+$/, message: '编号只能包含字母和数字', trigger: 'blur' }
        ],
        configInfo: [
          { required: true, message: '请输入配置信息', trigger: 'blur' },
          { max: 100, message: '最多输入100位', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
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
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      return {
        ...defaultForm,
        status: 1
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
