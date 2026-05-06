<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="试驾车采购配置："
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <span class="status primary">{{ form.allowTestDriveWholesaleLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="物料编码：" prop="materialsId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.materialsId"
                    :params="form.materialsCode"
                    :remote-method="getVehicleMaterialsList"
                    value-key="id"
                    label-key="materialsCode"
                    @change="(val, record) => {form.materialsCode = record?.materialsCode || ''}"
                    :disabled="!!_id"
                  />
                </el-form-item>
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
                    @change="(val, record) => {form.seriesName = record?.name || ''}"
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
                <el-form-item label="允许试驾车批售：" prop="allowTestDriveWholesale">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.allowTestDriveWholesale"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  <el-input
                    type="textarea"
                    rows="4"
                    placeholder="请输入"
                    v-model="form.materialsDesc"
                    clearable
                    :disabled="!!_id"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="物料编码：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleMaterials/edit?id=' + form.materialsId)">{{ form.materialsCode }}</el-button>
                </el-form-item>
                <el-form-item label="车系：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleSeries/edit?id=' + form.seriesId)">{{ form.seriesName }}</el-button>
                </el-form-item>
                <el-form-item label="车型：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleModel/edit?id=' + form.modelId)">{{ form.modelName }}</el-button>
                </el-form-item>
                <el-form-item label="年款：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleYearType/edit?id=' + form.vehicleYearTypeId)">{{ form.vehicleYearType }}</el-button>
                </el-form-item>
                <el-form-item label="选装包：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleOptionPackage/edit?id=' + form.optionPackageId)">{{ form.optionPackageName }}</el-button>
                </el-form-item>
                <el-form-item label="允许试驾车批售：">
                  {{ form.allowTestDriveWholesaleLabel }}
                </el-form-item>
                <el-form-item label="物料描述：">
                  {{ form.materialsDesc }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleTestDrivePurchaseConf/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, vehicleSeriesList, vehicleOptionPackage, listVehicleModel, vehicleModelYearTypeRelation, vehicleMaterials } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  materialsCode: '',
  materialsDesc: '',
  seriesName: '',
  modelName: '',
  vehicleYearType: '',
  optionPackageName: '',
  allowTestDriveWholesale: '',
  allowTestDriveWholesaleLabel: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  materialsId: '',
  seriesId: '',
  modelId: '',
  vehicleYearTypeId: '',
  optionPackageId: '',
  ownerOrgId: '',
};

export default {
  name: 'wholesaleTestDrivePurchaseConfEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '试驾车采购配置：' + (this.form.materialsCode || '');
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
      pageTitle: '试驾车采购配置',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleTestDrivePurchaseConf',
      loading: false,
      submitLoading: false,
      yearTypeList: [],
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        materialsCode: [
          { required: true, message: '请选择物料编码', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请选择车系', trigger: 'change' }
        ],
        vehicleYearType: [
          { required: true, message: '请选择年款', trigger: 'change' }
        ],
        allowTestDriveWholesale: [
          { required: true, message: '请选择允许试驾车批售', trigger: 'change' }
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
    async getModelIdList (params) {
      return listVehicleModel({ modelNameLike: params, status: 1 });
    },
    async getOptionPackageList (params) {
      return vehicleOptionPackage({ optionPackageNameLike: params, status: 1 });
    },
    async getVehicleMaterialsList (params) {
      return vehicleMaterials({ materialsCodeLike: params, status: 1 });
    },
    async handleModelChange (val, record) {
      if (record) {
        this.form.modelName = record.name;
      } else {
        this.form.modelId = null;
        this.form.modelName = null;
      }
      this.yearTypeList = [];
      this.form.vehicleYearTypeId = null;
      this.form.vehicleYearType = null;
      const res = await vehicleModelYearTypeRelation({ modelIdList: [this.form.modelId], size: 1000 });
      this.yearTypeList = res.map(item => {
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
