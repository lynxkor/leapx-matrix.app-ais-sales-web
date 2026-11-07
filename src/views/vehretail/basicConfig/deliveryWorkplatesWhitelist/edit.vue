<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题">
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
        </template>
        <template #extraButtons>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="120px" v-show="isEditing || !_id">
                <el-form-item label="用户ID：" prop="userId">
                  <el-input
                    placeholder="请输入用户ID"
                    v-model="form.userId"
                  />
                </el-form-item>
                <el-form-item label="用户姓名：" prop="userName">
                  <el-input
                    placeholder="请输入用户姓名"
                    v-model="form.userName"
                  />
                </el-form-item>
                <el-form-item label="组织名称：">
                  <el-input
                    v-model="form.mainOrgName"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="岗位（主岗）：">
                  <el-input
                    v-model="form.mainPostName"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="手机号：">
                  <el-input
                    v-model="form.mobile"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择"
                  />
                </el-form-item>
                <el-form-item label="备注：">
                  <el-input
                    type="textarea"
                    :rows="3"
                    v-model="form.remark"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="用户ID：">
                  {{ form.userId }}
                </el-form-item>
                <el-form-item label="用户姓名：">
                  {{ form.userName }}
                </el-form-item>
                <el-form-item label="组织名称：">
                  {{ form.mainOrgName }}
                </el-form-item>
                <el-form-item label="岗位（主岗）：">
                  {{ form.mainPostName }}
                </el-form-item>
                <el-form-item label="手机号：">
                  {{ form.mobile }}
                </el-form-item>
                <el-form-item label="状态：">
                  <span :class="['status-tag', form.status === 1 ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
                </el-form-item>
                <el-form-item label="备注：">
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
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/basicConfig/deliveryWorkplatesWhitelist/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  userId: '',
  userName: '',
  mainOrgCode: '',
  mainOrgName: '',
  mainPostCode: '',
  mainPostName: '',
  mobile: '',
  remark: '',
  status: 1,
  statusLabel: '启用',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  createTime: '',
  updateTime: ''
};

export default {
  name: 'deliveryWorkplatesWhitelistEdit',
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
      return '用户姓名：' + (this.form.userName || '');
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
    const form = this.getDefaultForm();
    return {
      pageTitle: '交付工牌白名单',
      pageType: 'edit',
      moduleKey: 'AISVR-deliveryWorkplatesWhitelist',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        userId: [
          { required: true, message: '请输入用户ID', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '用户ID必须为正整数', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    };
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
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefaultForm () {
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
