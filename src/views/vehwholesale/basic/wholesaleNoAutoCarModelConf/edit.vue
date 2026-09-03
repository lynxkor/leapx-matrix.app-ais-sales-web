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
                    filterable
                    clearable
                    remote
                    v-model="form.modelId"
                    :params="form.modelName"
                    :remote-method="getModelIdList"
                    :options="modelList"
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
  listVehicleYearType,
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
      modelList: [],
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
  created () {
    this.getYearTypeList();
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
    // 车型远程搜索：结果同步写入 modelList 驱动下拉选项（供车系联动刷新）
    async getModelIdList (params) {
      const res = await listVehicleModel({ modelNameLike: params, status: 1, seriesId: this.form.seriesId || undefined });
      this.modelList = res || [];
      return res;
    },
    /**
     * 车系联动车型：车系变化时清空已选车型，并按新车系刷新车型下拉选项
     */
    handleSeriesChange (val, record) {
      this.form.seriesName = record?.name || null;
      this.form.modelId = null;
      this.form.modelName = null;
      this.getModelIdList('');
    },
    handleModelChange (val, record) {
      this.form.modelName = record?.name || null;
    },
    // 年款固定接口获取，不随车系/车型联动
    async getYearTypeList () {
      const res = await listVehicleYearType({ pageSize: 50 });
      this.yearTypeList = (res || []).map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id
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
