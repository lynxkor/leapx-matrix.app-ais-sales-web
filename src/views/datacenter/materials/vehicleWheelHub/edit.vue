<template>
  <edit-page-layout ref="editLayout" :title="title" showPaneFooter>
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
        :showEditBtn="true"
      >
        <template #status>
          <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form
                :inline="true"
                :model="form"
                :rules="rules"
                ref="ruleForm"
                label-width="150px"
                class="form-edit"
                v-show="isEditing || !_id"
              >
                <el-form-item label="轮毂名称：" prop="wheelHubName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wheelHubName"
                    clearable
                    maxlength="30"
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <el-input v-model="form.statusLabel" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-input
                    v-model="form.createTime"
                    disabled
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-form>

              <!-- 详情模式 -->
              <el-form
                :inline="true"
                class="form-detail"
                v-show="!(isEditing || !_id)"
              >
                <el-form-item label="轮毂名称：">
                  {{ form.wheelHubName }}
                </el-form-item>
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建人：">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/datacenter/materials/vehicleWheelHub/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import moment from 'moment';

const defaultForm = {
  wheelHubName: '',
  status: '',
  statusLabel: '',
  creatorName: '',
  createTime: '',
};

export default {
  name: 'vehicleWheelHubEdit',
  components: {
    EditPageLayout,
    EditBaseContainer
  },
  mixins: [routeGuard, permissions, commonMixins],
  data () {
    return {
      pageTitle: '轮毂',
      pageType: 'edit',
      moduleKey: 'AISDC-vehicleWheelHub',
      loading: false,
      submitLoading: false,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        wheelHubName: [
          { required: true, message: '请输入轮毂名称', trigger: 'blur' }
        ],
      },
    };
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '轮毂：' + (this.form.wheelHubName || '');
    }
  },
  async mounted () {
    if (this._id) {
      await this.loadData();
    } else {
      this.initForm();
    }
  },
  methods: {
    async detailRequest () {
      const id = this._id;
      if (id) {
        const detail = await getDetail(id);
        return detail;
      }
      return {};
    },
    async submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    async loadData () {
      this.loading = true;
      try {
        const detail = await this.detailRequest();
        this.form = { ...this.form, ...detail };
        this.originalForm = { ...detail };
      } finally {
        this.loading = false;
      }
    },
    initForm () {
      const userInfo = this.$store.state.user.userInfo;
      this.form = {
        ...defaultForm,
        ownerId: userInfo.userId,
        creatorName: userInfo.userName,
        status: 1,
        statusLabel: '启用',
        createTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>
