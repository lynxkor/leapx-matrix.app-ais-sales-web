<template>
  <edit-page-layout ref="editLayout" title="预算科目" showPaneFooter>
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
              <h2 v-show="_id">基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="预算科目名称：" prop="budgetItemName">
                  <el-input
                    placeholder="请输入预算科目名称"
                    v-model="form.budgetItemName"
                    clearable
                    maxlength="30"
                  />
                </el-form-item>
                <el-form-item label="预算科目编码：" prop="budgetItemCode">
                  <el-input
                    placeholder="请输入预算科目编码"
                    v-model="form.budgetItemCode"
                    clearable
                    :disabled="!!_id"
                    maxlength="30"
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择状态"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.creatorName"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.createTime"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" label-width="150px" v-show="!(isEditing || !_id)">
                <el-form-item label="预算科目名称：" prop="budgetItemName">
                  {{ form.budgetItemName }}
                </el-form-item>
                <el-form-item label="预算科目编码：" prop="budgetItemCode">
                  {{ form.budgetItemCode }}
                </el-form-item>
                <el-form-item label="状态：" prop="statusLabel">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/fundBudgetItem/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import moment from 'moment';

const defaultForm = {
  budgetItemName: '',
  budgetItemCode: '',
  status: '',
  statusLabel: '',
  remark: '',
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
  id: ''
};

export default {
  name: 'fundBudgetItemEdit',
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
      return '预算科目名称：' + this.form.budgetItemName;
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
      pageTitle: '预算科目',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundBudgetItem',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        budgetItemName: [
          { required: true, message: '请输入预算科目名称', trigger: 'blur' },
          { max: 30, message: '最多输入30个字符', trigger: 'blur' }
        ],
        budgetItemCode: [
          { required: true, message: '请输入预算科目编码', trigger: 'blur' },
          { max: 30, message: '最多输入30个字符', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9_]+$/, message: '编码只能包含字母、数字和下划线', trigger: 'blur' }
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
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        creatorName: userInfo.userName,
        status: 1,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss')
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
