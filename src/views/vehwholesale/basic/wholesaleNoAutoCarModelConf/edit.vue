<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
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
          <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="160px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="车系：" prop="seriesId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.seriesId"
                    :params="form.seriesName"
                    :remote-method="getVehicleSeriesList"
                    value-key="id"
                    label-key="name"
                    @change="handleSeriesChange"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="车型：" prop="modelId">
                  <fetch-select
                    ref="modelSelect"
                    filterable
                    clearable
                    remote
                    v-model="form.modelId"
                    :params="form.modelName"
                    :remote-method="getModelIdList"
                    value-key="id"
                    label-key="name"
                    @change="handleModelChange"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="年款：" prop="vehicleYearTypeId" v-show="!!!_id">
                  <fetch-select
                    filterable
                    clearable
                    v-model="form.vehicleYearTypeId"
                    :options="yearTypeList"
                    value-key="value"
                    label-key="label"
                    :disabled="!!_id"
                    @change="(val, record) => {form.vehicleYearType = record?.label || ''}"
                  />
                </el-form-item>
                <el-form-item label="年款：" prop="vehicleYearTypeId" v-show="!!_id">
                  <el-input
                    :value="form.vehicleYearType"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="外观：" prop="exteriorId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.exteriorId"
                    :params="form.exteriorName"
                    :remote-method="getExteriorList"
                    value-key="id"
                    label-key="name"
                    @change="(val, record) => {form.exteriorName = record?.name || ''}"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="选装包：" prop="optionPackageId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.optionPackageId"
                    :params="form.optionPackageName"
                    :remote-method="getOptionPackageList"
                    value-key="id"
                    label-key="name"
                    @change="(val, record) => {form.optionPackageName = record?.name || ''}"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="内饰：" prop="interiorId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.interiorId"
                    :params="form.interiorName"
                    :remote-method="getInteriorList"
                    value-key="id"
                    label-key="name"
                    @change="(val, record) => {form.interiorName = record?.name || ''}"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="轮毂：" prop="wheelHubId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.wheelHubId"
                    :params="form.wheelHubName"
                    :remote-method="getWheelHubList"
                    value-key="id"
                    label-key="name"
                    @change="(val, record) => {form.wheelHubName = record?.name || ''}"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="不参与自动批售确认：" prop="noJoinAutoConfirm">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.noJoinAutoConfirm"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="车系：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleSeries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName }}</el-link>
                </el-form-item>
                <el-form-item label="车型：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleModel/edit?id=${form.modelId}`" target="_blank">{{ form.modelName }}</el-link>
                </el-form-item>
                <el-form-item label="年款：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleYearType/edit?id=${form.vehicleYearTypeId}`" target="_blank">{{ form.vehicleYearType }}</el-link>
                </el-form-item>
                <el-form-item label="外观：">
                  {{ form.exteriorName }}
                </el-form-item>
                <el-form-item label="选装包：">
                  {{ form.optionPackageName }}
                </el-form-item>
                <el-form-item label="内饰：">
                  {{ form.interiorName }}
                </el-form-item>
                <el-form-item label="轮毂：">
                  {{ form.wheelHubName }}
                </el-form-item>
                <el-form-item label="不参与自动批售确认：">
                  {{ form.noJoinAutoConfirmLabel }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleNoAutoCarModelConf/index';
import FetchSelect from '@/libs/components/FetchSelect';
import {
  getEnum,
  listVehicleModel,
  vehicleModelYearTypeRelation,
  vehicleSeriesList,
  vehicleExterior,
  vehicleInterior,
  vehicleWheelHub,
  vehicleOptionPackage
} from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  wholesaleNoAutoCarModelConfName: '',
  seriesName: '',
  modelName: '',
  vehicleYearType: '',
  exteriorName: '',
  optionPackageName: '',
  interiorName: '',
  wheelHubName: '',
  noJoinAutoConfirm: '',
  noJoinAutoConfirmLabel: '',
  status: '',
  statusLabel: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  remark: '',
  statusDesc: '',
  dataSource: '',
  seriesId: '',
  modelId: '',
  vehicleYearTypeId: '',
  exteriorId: '',
  optionPackageId: '',
  interiorId: '',
  wheelHubId: '',
  ownerOrgId: '',
};

export default {
  name: 'wholesaleNoAutoCarModelConfEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '不自动确认批售配置：' + (this.form.seriesName || this.form.modelName || '');
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    EditPageLayout,
    EditBaseContainer
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '不自动确认批售配置',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleNoAutoCarModelConf',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      yearTypeList: [],
      rules: {
        seriesId: [
          { required: true, message: '请选择车系', trigger: 'change' }
        ],
        vehicleYearTypeId: [
          { required: true, message: '请选择年款', trigger: 'change' }
        ],
        noJoinAutoConfirm: [
          { required: true, message: '请选择不参与自动批售确认', trigger: 'change' }
        ],
      }
    };
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
      return {};
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async getExteriorList (params) {
      return vehicleExterior({ exteriorNameLike: params, status: 1 });
    },
    async getOptionPackageList (params) {
      return vehicleOptionPackage({ optionPackageNameLike: params, status: 1 });
    },
    async getInteriorList (params) {
      return vehicleInterior({ interiorNameLike: params, status: 1 });
    },
    async getWheelHubList (params) {
      return vehicleWheelHub({ wheelHubNameLike: params, status: 1 });
    },
    async getModelIdList (params) {
      // 车型按已选车系过滤
      return listVehicleModel({ modelNameLike: params, status: 1, seriesId: this.form.seriesId || undefined });
    },
    async handleSeriesChange (val, record) {
      this.form.seriesName = record?.name || null;
      // 车系变化：级联清空车型与年款
      this.form.modelId = null;
      this.form.modelName = null;
      this.clearYearType();
      // 强制刷新车型下拉，避免残留未按新车系过滤的旧选项（FetchSelect 仅在未加载过时才随 focus 重载）
      this.$nextTick(() => {
        this.$refs.modelSelect?.loadRemoteMethod('');
      });
      if (!val) {
        return;
      }
      // 无现成"按车系查年款"接口：先查车系下车型，再按车型集合查年款；车系下无车型时短路，避免空 modelIdList 返回全量年款
      const modelList = await listVehicleModel({ seriesId: val, status: 1, size: 1000 });
      const modelIds = (modelList || []).map(item => item.id).filter(Boolean);
      if (!modelIds.length) {
        this.yearTypeList = [];
        return;
      }
      await this.loadYearTypeList(modelIds);
    },
    async handleModelChange (val, record) {
      this.form.modelName = record?.name || null;
      this.clearYearType();
      if (val) {
        await this.loadYearTypeList([val]);
      } else if (this.form.seriesId) {
        // 车型清空后回落到按车系查年款
        await this.handleSeriesChange(this.form.seriesId, { name: this.form.seriesName });
      }
    },
    clearYearType () {
      this.yearTypeList = [];
      this.form.vehicleYearTypeId = null;
      this.form.vehicleYearType = null;
    },
    async loadYearTypeList (modelIdList) {
      const res = await vehicleModelYearTypeRelation({ modelIdList, size: 1000 });
      this.yearTypeList = (res || []).map(item => {
        return {
          ...item,
          label: item.yearTypeName,
          value: item.yearTypeId
        };
      });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>
