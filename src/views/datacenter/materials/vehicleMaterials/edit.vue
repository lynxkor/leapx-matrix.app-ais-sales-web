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
          <!-- 基础信息 -->
          <section class="common-section" v-permission="moduleKey+'-checkBatteryCell'">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="160px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="物料编码：" prop="materialsCode">
                  <el-input placeholder="请输入" v-model="form.materialsCode" clearable maxlength="30" />
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc" :style="{ width: visibleCount === 3 ? '75%' : '65%' }">
                  <el-input placeholder="请输入" v-model="form.materialsDesc" clearable disabled maxlength="100" />
                </el-form-item>
                <el-form-item label="车系：" prop="seriesId">
                  <fetch-select
                    :remote-method="repairItemSearch"
                    :params="form.seriesName"
                    remote
                    reserve-keyword
                    v-model="form.seriesId"
                    placeholder="请选择"
                    labelKey="name"
                    valueKey="id"
                    clearable
                    filterable
                    @change="seriesListChange" />
                </el-form-item>
                <el-form-item label="车型：" prop="modelId">
                  <fetch-select :options="modelList" :params="form.modelName" v-model="form.modelId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable @change="modelListChange" />
                </el-form-item>
                <el-form-item label="年款：" prop="yearTypeId">
                  <fetch-select :options="yearTypeList" :params="form.yearTypeName" v-model="form.yearTypeId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable/>
                </el-form-item>
                <el-form-item label="外观：" prop="exteriorId">
                  <fetch-select
                    v-model="form.exteriorId"
                    :params="form.exteriorName"
                    v-bind="selectOptions"
                    :remote-method="remoteMethods.exterior"
                  />
                </el-form-item>
                <el-form-item label="内饰：" prop="interiorId">
                  <fetch-select
                    v-model="form.interiorId"
                    :params="form.interiorName"
                    v-bind="selectOptions"
                    :remote-method="remoteMethods.interior"
                  />
                </el-form-item>
                <el-form-item label="车顶：">
                  <fetch-select
                    v-model="form.roofId"
                    :params="form.roofName"
                    v-bind="selectOptions"
                    :remote-method="remoteMethods.roof"
                  />
                </el-form-item>
                <el-form-item label="轮毂：" prop="wheelHubId">
                  <fetch-select
                    v-model="form.wheelHubId"
                    :params="form.wheelHubName"
                    v-bind="selectOptions"
                    :remote-method="remoteMethods.wheel"
                  />
                </el-form-item>
                <el-form-item label="续航里程：" prop="drivingRangeId">
                  <fetch-select
                    v-model="form.drivingRangeId"
                    :params="form.drivingRangeName"
                    v-bind="selectOptions"
                    :remote-method="remoteMethods.drivingRange"
                  />
                </el-form-item>
                <el-form-item label="选配动力：" prop="rangePowerId">
                  <fetch-select
                    v-model="form.rangePowerId"
                    :params="form.rangePowerName"
                    v-bind="selectOptions"
                    :remote-method="remoteMethods.rangePower"
                  />
                </el-form-item>
                <el-form-item label="选装包：">
                  <fetch-select
                    v-model="form.optionPackageId"
                    v-bind="selectOptions"
                    :remote-method="remoteMethods.optional"
                  />
                </el-form-item>
                <el-form-item label="电池电芯：" prop="batteryCellId">
                  <fetch-select
                    v-model="form.batteryCellId"
                    :params="form.batteryCellName"
                    v-bind="selectOptions"
                    :remote-method="remoteMethods.battery"
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select :request="fetchOptions" enumCode="StatusEnum" v-model="form.status" placeholder="请选择" clearable disabled/>
                </el-form-item>
              </el-form>

              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" label-width="160px" v-show="!(isEditing || !_id)">
                <el-form-item label="物料编码：">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="物料描述：" :style="{ width: visibleCount === 3 ? '75%' : '65%' }">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="车系：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleseries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName }}</el-link>
                </el-form-item>
                <el-form-item label="车型：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclemodel/edit?id=${form.modelId}`" target="_blank">{{ form.modelName }}</el-link>
                </el-form-item>
                <el-form-item label="年款：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleyeartype/edit?id=${form.yearTypeId}`" target="_blank">{{ form.yearTypeName }}</el-link>
                </el-form-item>
                <el-form-item label="外观：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleexterior/edit?id=${form.exteriorId}`" target="_blank">{{ form.exteriorName }}</el-link>
                </el-form-item>
                <el-form-item label="内饰：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleinterior/edit?id=${form.interiorId}`" target="_blank">{{ form.interiorName }}</el-link>
                </el-form-item>
                <el-form-item label="车顶：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleroof/edit?id=${form.roofId}`" target="_blank">{{ form.roofName }}</el-link>
                </el-form-item>
                <el-form-item label="轮毂：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclewheelhub/edit?id=${form.wheelHubId}`" target="_blank">{{ form.wheelHubName }}</el-link>
                </el-form-item>
                <el-form-item label="续航里程：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicledrivingrange/edit?id=${form.drivingRangeId}`" target="_blank">{{ form.drivingRangeName }}</el-link>
                </el-form-item>
                <el-form-item label="选配动力：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclerangepower/edit?id=${form.rangePowerId}`" target="_blank">{{ form.rangePowerName }}</el-link>
                </el-form-item>
                <el-form-item label="选装包：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleoptionpackage/edit?id=${form.optionPackageId}`" target="_blank">{{ form.optionPackageName }}</el-link>
                </el-form-item>
                <el-form-item label="电池电芯：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclebatterycell/edit?id=${form.batteryCellId}`" target="_blank">{{ form.batteryCellName }}</el-link>
                </el-form-item>
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 价格信息 -->
          <section class="common-section" v-permission="moduleKey+'-checkPrice'">
            <div class="common-section-header">
              <h2>价格信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="160px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="整车价格：">
                  <el-input-number placeholder="请输入" v-model="form.price" clearable :controls="false"
                    :precision="2" :min="0.00" :step="0.01"/>
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" label-width="160px" v-show="!(isEditing || !_id)">
                <el-form-item label="整车价格：">
                  {{ form.price }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 属性信息 -->
          <section class="common-section" v-permission="moduleKey+'-checkProperties'">
            <div class="common-section-header">
              <h2>属性信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="170px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item
                  v-for="(item, index) in formItems"
                  :key="index"
                  :label="item.label"
                  :prop="'props.' + item.prop"
                >
                  <el-radio-group v-model="form.props[item.prop]">
                    <el-radio
                      v-for="option in yes_no_enum"
                      :key="option.code"
                      :label="option.code"
                    >
                      {{ option.message }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="停产状态：" prop="props.discontinueStatus">
                  <el-radio-group v-model="form.props.discontinueStatus">
                    <el-radio v-for="(option, index) in discontinueStatusList" :key="index" :label="option.code">{{ option.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>

              <el-form :inline="true" class="form-detail" label-width="160px" v-show="!(isEditing || !_id)">
                <el-form-item
                  v-for="(item, index) in formItemsLabel"
                  :key="index"
                  :label="item.label"
                >
                  {{ form.props[item.prop] }}
                </el-form-item>
                <el-form-item label="停产状态：">
                  {{ form.props.discontinueStatusLabel }}
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
import { getDetail, addOrUpdate } from '@/api/datacenter/materials/vehicleMaterials/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, vehicleSeriesList, vehicleModelList, vehicleExterior, vehicleInterior, vehicleWheelHub, vehicleOptionPackage, vehicleBatteryCell, vehicleRoof, vehicleDrivingRange, vehicleRangePower, vehicleModelYearTypeRelation } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import responsive from '@/libs/mixins/responsive';
import { fetchAndFormatData } from '@/libs/utils';

const defaultForm = {
  yearTypeId: '',
  price: '',
  materialsCode: '',
  materialsDesc: '',
  modelName: '',
  exteriorName: '',
  interiorName: '',
  wheelHubName: '',
  roofName: '',
  optionPackageName: '',
  batteryCellName: '',
  allowWholesale: '',
  allowProductionSchedule: '',
  allowDisplayVehicleWholesale: '',
  allowTestDriveVehicleWholesale: '',
  allowCustomerSales: '',
  allowWholesaleConfirm: '',
  allowConfigurationModify: '',
  discontinueStatus: '',
  status: 1,
  statusLabel: '',
  remark: '',
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  modifier: '',
  statusDesc: '',
  modelId: '',
  exteriorId: '',
  interiorId: '',
  wheelHubId: '',
  roofId: '',
  optionPackageId: '',
  batteryCellId: '',
  cellMaterials: '',
  drivingRangeId: '',
  drivingRangeName: '',
  rangePowerId: '',
  rangePowerName: '',
  currencyCode: '',
  props: {
    allowWholesale: false,
    allowProductionSchedule: false,
    allowDisplayVehicleWholesale: false,
    allowTestDriveVehicleWholesale: false,
    allowCustomerSales: false,
    allowWholesaleConfirm: false,
    allowConfigurationModify: false,
    discontinueStatus: 1
  }
};

export default {
  name: 'vehicleMaterialsEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    FetchSelect,
    EditPageLayout,
    EditBaseContainer
  },
  mixins: [routeGuard, permissions, commonMixins, responsive],
  data () {
    const form = this.getDefautlForm();
    return {
      moduleKey: 'AISDC-vehicleMaterials',
      pageType: 'edit',
      pageTitle: '销服-业务主数据-配置主数据-整车物料',
      discontinueStatusList: [],
      formItems: [
        { label: '是否允许现车批售：', prop: 'allowWholesale' },
        { label: '是否允许排产申请：', prop: 'allowProductionSchedule' },
        { label: '是否允许展车批售：', prop: 'allowDisplayVehicleWholesale' },
        { label: '是否允许试驾车批售：', prop: 'allowTestDriveVehicleWholesale' },
        { label: '是否允许企业客户销售：', prop: 'allowCustomerSales' },
        { label: '是否允许批售确认：', prop: 'allowWholesaleConfirm' },
        { label: '是否允许改配：', prop: 'allowConfigurationModify' }
      ],
      formItemsLabel: [
        { label: '是否允许现车批售：', prop: 'allowWholesaleLabel' },
        { label: '是否允许排产申请：', prop: 'allowProductionScheduleLabel' },
        { label: '是否允许展车批售：', prop: 'allowDisplayVehicleWholesaleLabel' },
        { label: '是否允许试驾车批售：', prop: 'allowTestDriveVehicleWholesaleLabel' },
        { label: '是否允许企业客户销售：', prop: 'allowCustomerSalesLabel' },
        { label: '是否允许批售确认：', prop: 'allowWholesaleConfirmLabel' },
        { label: '是否允许改配：', prop: 'allowConfigurationModifyLabel' }
      ],
      loading: false,
      submitLoading: false,
      yes_no_enum: [
        { message: '是', code: true },
        { message: '否', code: false }
      ],
      form: { ...form },
      originalForm: { ...form },
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      remoteMethods: {
        exterior: async (query) => {
          return await vehicleExterior({ exteriorNameLike: query });
        },
        interior: async (query) => {
          return await vehicleInterior({ interiorNameLike: query });
        },
        roof: async (query) => {
          return await vehicleRoof({ roofNameLike: query });
        },
        wheel: async (query) => {
          return await vehicleWheelHub({ wheelHubNameLike: query });
        },
        drivingRange: async (query) => {
          return await vehicleDrivingRange({ drivingRangeNameLike: query });
        },
        rangePower: async (query) => {
          return await vehicleRangePower({ rangePowerNameLike: query });
        },
        optional: async (query) => {
          return await vehicleOptionPackage({ optionPackageNameLike: query });
        },
        battery: async (query) => {
          return await vehicleBatteryCell({ batteryCellNameLike: query });
        }
      },
      rules: {
        price: [
          { required: true, message: '请输入整车价格', trigger: 'blur' }
        ],
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        yearTypeId: [
          { required: true, message: '请选择年款', trigger: 'blur' }
        ],
        seriesId: [
          { required: true, message: '请输入车系名称', trigger: 'blur' }
        ],
        modelId: [
          { required: true, message: '请输入车型名称', trigger: 'blur' }
        ],
        exteriorId: [
          { required: true, message: '请输入外观名称', trigger: 'blur' }
        ],
        interiorId: [
          { required: true, message: '请输入内饰名称', trigger: 'blur' }
        ],
        wheelHubId: [
          { required: true, message: '请输入轮毂名称', trigger: 'blur' }
        ],
        roofId: [
          { required: true, message: '请输入车顶名称', trigger: 'blur' }
        ],
        optionPackageId: [
          { required: true, message: '请输入选装包名称', trigger: 'blur' }
        ],
        batteryCellId: [
          { required: true, message: '请输入电池电芯名称', trigger: 'blur' }
        ],
        drivingRangeId:[
          { required: true, message: '请输入续航里程', trigger: 'blur' }
        ],
        rangePowerId:[
          { required: true, message: '请输入选配动力名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      seriesList: [],
      modelList: [],
      yearTypeList: [],
      yearModelList: [],
      exteriorList: [],
      interiorList: [],
      wheelHubList: [],
      optionPackageList: [],
      batteryCellList: [],
      roofList: [],
      drivingRangeList: [],
      rangePowerList: []
    };
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '物料编码：' + (this.form.materialsCode || '');
    }
  },
  mounted () {
    this.initVehicleData();
    this.fetchDiscontinueStatusOptions();
  },
  methods: {
    repairItemSearch (query) { return vehicleSeriesList({ seriesNameLike: query, status: 1 }); },
    async initVehicleData () {
      const apiConfigs = [
        { api: vehicleExterior, params: { size: 1000 }, target: 'exteriorList' },
        { api: vehicleInterior, params: { size: 1000 }, target: 'interiorList' },
        { api: vehicleWheelHub, params: { size: 1000 }, target: 'wheelHubList' },
        { api: vehicleOptionPackage, params: { size: 1000 }, target: 'optionPackageList' },
        { api: vehicleBatteryCell, params: { size: 1000 }, target: 'batteryCellList' },
        { api: vehicleRoof, params: { size: 1000 }, target: 'roofList' },
        { api: vehicleDrivingRange, params: { size: 1000 }, target: 'drivingRangeList' },
        { api: vehicleRangePower, params: { size: 1000 }, target: 'rangePowerList' }
      ];
      await Promise.all(apiConfigs.map(config =>
        fetchAndFormatData(this, config.api, config.params, config.target)
      ));
    },
    async fetchDiscontinueStatusOptions () {
      try {
        const enumData = this.$store.getters['enum/getEnum']('dc_discontinue_statusEnum');
        if (enumData) {
          this.discontinueStatusList = enumData.map(item => {
            return {
              ...item,
              code: Number(item.code)
            };
          }) || [];
          return;
        } else {
          const response = await getEnum('dc_discontinue_statusEnum');
          this.discontinueStatusList = response.map(item => {
            return {
              ...item,
              code: Number(item.code)
            };
          });
          if (response) {
            this.$store.dispatch('enum/setEnum', { code: 'dc_discontinue_statusEnum', data: response });
          }
        }
      } catch (error) {
        this.$message.error('加载停产状态选项失败，请稍后重试！');
      }
    },
    async detailRequest () {
      const id = this._id;
      if (id) {
        const detail = await getDetail(id);
        detail.status = detail.status?.toString();
        if (id) {
          this.modelList = [{ label: detail.modelName, value: detail.modelId }];
          this.yearTypeList = [{ label: detail.yearTypeName, value: detail.yearTypeId }];
        }
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
    seriesListChange (val) {
      if (val.length) {
        fetchAndFormatData(this, vehicleModelList, { seriesIdList: [val], pageSize: 1000 }, 'modelList');
        this.form.modelId = [];
        this.yearModelList = [];
        this.form.yearTypeId = [];
      } else {
        this.modelList = [];
        this.form.modelId = [];
        this.yearModelList = [];
        this.form.yearTypeId = [];
      }
    },
    async modelListChange (val) {
      const res = await vehicleModelYearTypeRelation({ modelIdList: [val], pageSize: 1000 });
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
    },
    getPropsLabel (prop) {
      const val = this.form.props?.[prop];
      if (val === true) return '是';
      if (val === false) return '否';
      return '-';
    },
    getDiscontinueStatusLabel () {
      const val = this.form.props?.discontinueStatus;
      const item = this.discontinueStatusList.find(s => s.code === val);
      return item ? item.message : '-';
    }
  }
};
</script>

<style lang="scss">
.page-common-edit {
  .el-form-item__content {
    min-width: 180px !important;
    width: 50% !important;
  }
}
</style>
