<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" show-pane-footer>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :is-editing.sync="isEditing"
        :form.sync="form"
        :original-form.sync="originalForm"
        :submit-request="submitRequest"
        :detail-request="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extra-buttons>
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
              <el-form
                :inline="true"
                :model="form"
                :rules="rules"
                ref="ruleForm"
                label-width="150px"
                class="form-edit"
                v-show="isEditing || !_id"
              >
                <el-form-item label="车型名称：" prop="modelName">
                  <fetch-select
                    :remote-method="remoteMethods.model"
                    v-model="form.modelId"
                    placeholder="请选择"
                    clearable
                    label-key="name"
                    value-key="id"
                    filterable
                    remote
                    @change="getModelName"
                  />
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeId">
                  <fetch-select
                    :remote-method="listVehicleYearType"
                    remote
                    v-model="form.yearTypeId"
                    placeholder="请选择"
                    label-key="name"
                    value-key="id"
                    clearable
                    filterable
                    :options="yearTypeList"
                    @change="getYearName"
                  />
                </el-form-item>
                <el-form-item label="外观名称：">
                  <fetch-select
                    v-model="form.exteriorId"
                    clearable
                    filterable
                    remote
                    label-key="name"
                    value-key="id"
                    :remote-method="remoteMethods.exterior"
                    @change="getExteriorName"
                  />
                </el-form-item>
                <el-form-item label="内饰名称：">
                  <fetch-select
                    v-model="form.interiorId"
                    clearable
                    filterable
                    remote
                    label-key="name"
                    value-key="id"
                    :remote-method="remoteMethods.interior"
                    @change="getInteriorName"
                  />
                </el-form-item>
                <el-form-item label="轮毂名称：">
                  <fetch-select
                    v-model="form.wheelHubId"
                    clearable
                    filterable
                    remote
                    label-key="name"
                    value-key="id"
                    :remote-method="remoteMethods.wheel"
                    @change="getWheelName"
                  />
                </el-form-item>
                <el-form-item label="选装包名称：">
                  <fetch-select
                    v-model="form.optionPackageId"
                    clearable
                    filterable
                    remote
                    label-key="name"
                    value-key="id"
                    :remote-method="remoteMethods.optional"
                    @change="getOptionalName"
                  />
                </el-form-item>
                <el-form-item label="排产天数：" prop="productionDays">
                  <el-input
                    placeholder="请输入"
                    v-model="form.productionDays"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="BUFF天数：" prop="buffDays">
                  <el-input
                    placeholder="请输入"
                    v-model="form.buffDays"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enum-code="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-form>
              <el-form
                label-width="150px"
                :inline="true"
                class="form-detail"
                v-show="!(isEditing || !_id)"
              >
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeName">
                  {{ form.yearTypeName }}
                </el-form-item>
                <el-form-item label="外观名称：" prop="exteriorName">
                  {{ form.exteriorName }}
                </el-form-item>
                <el-form-item label="内饰名称：" prop="interiorName">
                  {{ form.interiorName }}
                </el-form-item>
                <el-form-item label="轮毂名称：" prop="wheelHubName">
                  {{ form.wheelHubName }}
                </el-form-item>
                <el-form-item label="选装包名称：" prop="optionPackageName">
                  {{ form.optionPackageName }}
                </el-form-item>
                <el-form-item label="排产天数：" prop="productionDays">
                  {{ form.productionDays }}
                </el-form-item>
                <el-form-item label="BUFF天数：" prop="buffDays">
                  {{ form.buffDays }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态 0-禁用;1-启用：" prop="status">
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
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
} from '@/api/vehretail/basicConfig/productionOfflineConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import {
  getEnum,
  listVehicleModel,
  vehicleExterior,
  vehicleInterior,
  vehicleWheelHub,
  vehicleOptionPackage,
  listVehicleYearType,
} from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: 1,
  statusDesc: '',
  modelId: '',
  modelName: '',
  yearTypeId: '',
  yearTypeName: '',
  exteriorId: '',
  exteriorName: '',
  interiorId: '',
  interiorName: '',
  wheelHubId: '',
  wheelHubName: '',
  optionPackageId: '',
  optionPackageName: '',
  productionDays: '',
  buffDays: '',
  dataSource: '',
};

export default {
  name: 'productionOfflineConfigEdit',
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '排产下线时效：' + this.form.id;
    },
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true,
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      remoteMethods: {
        model: async (query) => {
          return await listVehicleModel({ modelNameLike: query });
        },
        exterior: async (query) => {
          return await vehicleExterior({ exteriorNameLike: query });
        },
        interior: async (query) => {
          return await vehicleInterior({ interiorNameLike: query });
        },
        wheel: async (query) => {
          return await vehicleWheelHub({ wheelHubNameLike: query });
        },
        optional: async (query) => {
          return await vehicleOptionPackage({ optionPackageNameLike: query });
        },
      },
      pageTitle: '排产下线时效',
      pageType: 'edit',
      moduleKey: 'AISVR-productionOfflineConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      yearTypeList: [],
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      options: {},
      rules: {
        status: [
          { required: true, message: '请选择状态 0-禁用;1-启用', trigger: 'change' },
        ],
        modelName: [
          { required: true, message: '请输入车型', trigger: 'change' },
        ],
        yearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' },
        ],
        productionDays: [
          { required: true, message: '请输入排产天数', trigger: 'change' },
        ],
        buffDays: [
          { required: true, message: '请输入BUFF天数', trigger: 'change' },
        ],
      },
    };
  },
  mounted () {},
  methods: {
    getExteriorName (val, obj) {
      this.form.exteriorName = obj.name;
    },
    getInteriorName (val, obj) {
      this.form.interiorName = obj.name;
    },
    getWheelName (val, obj) {
      this.form.wheelHubName = obj.name;
    },
    getOptionalName (val, obj) {
      this.form.optionPackageName = obj.name;
    },
    getYearName (val, obj) {
      this.form.yearTypeName = obj.name;
    },
    getModelName (val, obj) {
      this.form.modelName = obj.name;
    },
    async listVehicleYearType (query) {
      try {
        const res = await listVehicleYearType({ yearTypeNameLike: query });
        this.yearTypeList = res;
        return res;
      } catch (error) {
        console.error('Error fetching model list:', error);
      }
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
    handleAddRow () {
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then((data) => {
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    getDefautlForm () {
      return {
        ...defaultForm,
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  },
};
</script>
