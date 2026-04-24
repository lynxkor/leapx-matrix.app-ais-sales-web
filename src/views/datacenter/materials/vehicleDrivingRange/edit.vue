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
          <span class="status primary">{{ form.statusLabel }}</span>
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
                <el-form-item label="续航里程名称：" prop="drivingRangeName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.drivingRangeName"
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
                label-width="150px"
              >
                <el-form-item label="续航里程名称：">
                  {{ form.drivingRangeName }}
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
import { getDetail, addOrUpdate } from '@/api/datacenter/materials/vehicleDrivingRange/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import moment from 'moment';

const defaultForm = {
  drivingRangeName: '',
  status: '',
  statusLabel: '',
  creatorName: '',
  createTime: '',
};

export default {
  name: 'vehicleDrivingRangeEdit',
  components: {
    EditPageLayout,
    EditBaseContainer,
  },
  mixins: [routeGuard, permissions, commonMixins],
  data () {
    return {
      pageTitle: '销服-业务主数据-配置主数据-续航里程',
      pageType: 'edit',
      moduleKey: 'AISDC-vehicleDrivingRange',
      loading: false,
      submitLoading: false,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        drivingRangeName: [
          { required: true, message: '请输入续航里程名称', trigger: 'blur' }
        ],
      },
    };
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '续航里程：' + (this.form.drivingRangeName || '');
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
