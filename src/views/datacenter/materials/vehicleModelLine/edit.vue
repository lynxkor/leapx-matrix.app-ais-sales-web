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
          <!-- 基本信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基本信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="系列名称：" prop="modelLineName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelLineName"
                    clearable
                    maxlength="30"
                  />
                </el-form-item>
                <el-form-item label="品牌名称：" prop="brandId">
                  <fetch-select
                    :params="form.brandName"
                    v-model="form.brandId"
                    placeholder="请选择"
                    :remote-method="repairItemSearch"
                    remote
                    value-key="id"
                    label-key="brandName"
                    clearable
                    collapseTags
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
                <el-form-item label="说明：" prop="statusDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.statusDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  <el-input
                    v-model="form.creatorName"
                    placeholder="请输入"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-input
                    v-model="form.createTime"
                    placeholder="请输入"
                    disabled
                  />
                </el-form-item>
              </el-form>

              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="系列名称：">
                  {{ form.modelLineName }}
                </el-form-item>
                <el-form-item label="品牌名称：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclebrand/edit?id=${form.brandId}`" target="_blank">
                    {{ form.brandName }}
                  </el-link>
                </el-form-item>
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="说明：">
                  {{ form.statusDesc }}
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
import { getDetail, addOrUpdate } from '@/api/datacenter/materials/vehicleModelLine/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, vehicleBrandNameList } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: null,
  modelLineName: '',
  brandName: '',
  brandId: '',
  status: null,
  statusLabel: '',
  statusDesc: '',
  creatorName: '',
  createTime: ''
};

export default {
  name: 'vehicleModelLineEdit',
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
      return '系列名称：' + (this.form.modelLineName || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '销服-业务主数据-配置主数据-系列',
      pageType: 'edit',
      moduleKey: 'AISDC-vehicleModelLine',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        modelLineName: [
          { required: true, message: '请输入系列名称', trigger: 'blur' }
        ],
        brandId: [
          { required: true, message: '请选择品牌名称', trigger: 'change' }
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
    async repairItemSearch (query) {
      return vehicleBrandNameList({ size: 1000, status: 1, brandNameLike: query });
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
