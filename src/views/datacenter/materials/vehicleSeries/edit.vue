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
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="车系名称：" prop="seriesName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesName"
                    clearable
                    maxlength="30"
                  />
                </el-form-item>
                <el-form-item label="系列名称：" prop="modelLineId">
                  <fetch-select
                    remote
                    :params="form.modelLineName"
                    :remote-method="getVehicleModelLineList"
                    v-model="form.modelLineId"
                    placeholder="请选择"
                    value-key="id"
                    label-key="name"
                    clearable
                    collapse-tags
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <el-input
                    placeholder="请输入"
                    v-model="form.statusLabel"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-input
                    placeholder="请输入"
                    v-model="form.createTime"
                    disabled
                  />
                </el-form-item>
              </el-form>

              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="车系名称：">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="系列名称：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclemodelline/edit?id=${form.modelLineId}`" target="_blank">
                    {{ form.modelLineName }}
                  </el-link>
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
import { getDetail, addOrUpdate } from '@/api/datacenter/materials/vehicleSeries/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, vehicleModelLineList } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: null,
  seriesName: '',
  modelLineName: '',
  modelLineId: '',
  status: null,
  statusLabel: '',
  creatorName: '',
  createTime: ''
};

export default {
  name: 'vehicleSeriesEdit',
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
      return '车系名称：' + (this.form.seriesName || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '销服-业务主数据-配置主数据-车系',
      pageType: 'edit',
      moduleKey: 'AISDC-vehicleSeries',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        seriesName: [
          { required: true, message: '请输入车系名称', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    // 初始化数据由 edit-base-container 的 loadDetail 处理
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async getVehicleModelLineList (val) {
      return vehicleModelLineList({ size: 1000, status: 1, modelLineNameLike: val });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
