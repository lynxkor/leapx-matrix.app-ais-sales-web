<template>
  <edit-page-layout ref="editLayout" title="权益大类详情" showPaneFooter>
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
          <span v-if="form.status === 1" class="status primary">启用</span>
          <span v-else class="status danger">停用</span>
        </template>
        <el-main>
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="权益编码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="权益名称：" prop="equityCategoryName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.equityCategoryName"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="申请条件：" prop="applicationConditions">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_benefit_application_condition"
                    v-model="form.applicationConditions"
                    placeholder="请选择"
                    clearable
                    filterable
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="权益编码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="权益名称：">
                  {{ form.equityCategoryName }}
                </el-form-item>
                <el-form-item label="申请条件：">
                  {{ form.applicationConditionsLabel }}
                </el-form-item>
                <el-form-item label="状态：">
                  <span :class="['status-tag', form.status === 1 ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <div style="padding: 20px;">
          <h3>权益概况</h3>
          <div style="margin-top: 10px; padding: 15px; background: #f5f7fa; border-radius: 4px;">
            <div><strong>权益编码:</strong> {{ form.code || '-' }}</div>
            <div style="margin-top: 8px;"><strong>权益名称:</strong> {{ form.equityCategoryName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>申请条件:</strong> {{ form.applicationConditions || '-' }}</div>
            <div style="margin-top: 8px;"><strong>状态:</strong> {{ yes_no_enum_map[form.status] || '-' }}</div>
            <div style="margin-top: 8px;"><strong>创建时间:</strong> {{ form.createTime || '-' }}</div>
          </div>
        </div>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/basicConfig/vrEquityCategory/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  id: '',
  creator: null,
  creatorName: '',
  createTime: '',
  modifier: null,
  modifierName: '',
  updateTime: '',
  remark: '',
  status: 1,
  statusDesc: '',
  dataSource: null,
  code: '',
  ownerOrgId: null,
  equityCategoryName: '',
  applicationConditions: null
};

export default {
  name: 'vrEquityCategoryEdit',
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
      return '权益名称：' + (this.form.equityCategoryName || '');
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
      pageTitle: '权益大类',
      pageType: 'edit',
      moduleKey: 'AISVR-vrEquityCategory',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      yes_no_enum_map: {},
      form: { ...form },
      originalForm: { ...form },
      rules: {
        code: [
          { required: true, message: '请输入权益编码', trigger: 'blur' }
        ],
        equityCategoryName: [
          { required: true, message: '请输入权益名称', trigger: 'change' }
        ],
        applicationConditions: [
          { required: true, message: '请选择申请条件', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.initEnumMaps();
  },
  methods: {
    initEnumMaps () {
      this.yes_no_enum.forEach(item => {
        this.yes_no_enum_map[item.code] = item.message;
      });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
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

<style lang="scss" scoped>
.page-common-edit {
  h3 {
    margin: 0 0 15px;
    font-size: 16px;
  }
}
</style>
