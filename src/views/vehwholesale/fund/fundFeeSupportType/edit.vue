<template>
  <edit-page-layout ref="editLayout" title="费用支持类型管理" showPaneFooter>
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
                <el-form-item label="费用支持类型名称：" prop="feeSupportTypeName">
                  <el-input
                    placeholder="请输入费用支持类型名称"
                    v-model="form.feeSupportTypeName"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="费用支持类型编码：" prop="feeSupportTypeCode">
                  <el-input
                    placeholder="请输入费用支持类型编码"
                    v-model="form.feeSupportTypeCode"
                    clearable
                    :disabled="!!_id"
                    maxlength="30"
                  />
                </el-form-item>
                <el-form-item label="部门类型：" prop="departmentType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_department_type"
                    v-model="form.departmentType"
                    placeholder="请选择部门类型"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态：">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.statusLabel"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建人：">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.creatorName"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建时间：">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.createTime"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="费用支持类型名称：" prop="feeSupportTypeName">
                  {{ form.feeSupportTypeName }}
                </el-form-item>
                <el-form-item label="费用支持类型编码：" prop="feeSupportTypeCode">
                  {{ form.feeSupportTypeCode }}
                </el-form-item>
                <el-form-item label="部门类型：" prop="departmentTypeLabel">
                  {{ form.departmentTypeLabel }}
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
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/fundFeeSupportType/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  feeSupportTypeName: '',
  feeSupportTypeCode: '',
  departmentType: '',
  departmentTypeLabel: '',
  remark: '',
  status: '',
  statusLabel: '',
  creatorName: '',
  createTime: '',
  id: ''
};

export default {
  name: 'fundFeeSupportTypeEdit',
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
      return '费用支持类型名称：' + this.form.feeSupportTypeName;
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
      pageTitle: '账户管理-基础配置-费用支持类型管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundFeeSupportType',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        feeSupportTypeName: [
          { required: true, message: '请输入费用支持类型名称', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ],
        feeSupportTypeCode: [
          { required: true, message: '请输入费用支持类型编码', trigger: 'blur' },
          { max: 30, message: '最多输入30个字符', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9_]+$/, message: '编码只能包含字母、数字和下划线', trigger: 'blur' }
        ],
        departmentType: [
          { required: true, message: '请选择部门类型', trigger: 'change' }
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
