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
        <el-main>
          <!-- 物料信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>物料信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="物料编码：" prop="materials.materialsCode">
                  <fetch-select
                    :options="materialsList"
                    v-model="form.materials.materialsCode"
                    placeholder="请选择"
                    labelKey="materialsCode"
                    valueKey="materialsCode"
                    :remoteMethod="debouncedMaterialsMethod"
                    @change="materialsSelect"
                    remote
                    clearable
                    filterable/>
                </el-form-item>
                <el-form-item
                  v-for="(field, index) in formFields"
                  :key="index"
                  :label="field.label"
                >
                  <el-input
                    placeholder="请输入"
                    v-model="form.materials[field.key]"
                    disabled
                  />
                </el-form-item>
              </el-form>

              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="物料编码：">
                  <el-link v-if="form.materials?.materialsCode" type="primary" :href="`/sales/datacenter/materials/vehiclematerials/edit?id=${form.materials.materialsCode}`" target="_blank">
                    {{ form.materials?.materialsCode }}
                  </el-link>
                  <span v-else>{{ form.materials?.materialsCode }}</span>
                </el-form-item>
                <el-form-item
                  v-for="(field, index) in formFields"
                  :key="index"
                  :label="field.label"
                >
                  <el-link v-if="getMatchHref(field.key)" type="primary" :href="getMatchHref(field.key)" target="_blank">
                    {{ form.materials[field.key.replace('Id', 'Name')] || form.materials[field.key] || '' }}
                  </el-link>
                  <el-link v-else-if="field.key === 'materialsDesc' && form.materials?.materialsCode" type="primary" :href="`/sales/datacenter/materials/vehiclematerials/edit?id=${form.materials.materialsCode}`" target="_blank">
                    {{ form.materials[field.key] || '' }}
                  </el-link>
                  <span v-else>{{ form.materials[field.key] || '' }}</span>
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 可配物料信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>可配物料信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="可配物料编码：" prop="matchMaterials.materialsCode">
                  <fetch-select
                    :options="matchMaterialsList"
                    v-model="form.matchMaterials.materialsCode"
                    placeholder="请选择"
                    labelKey="materialsCode"
                    valueKey="materialsCode"
                    :remoteMethod="debouncedMatchMaterialsMethod"
                    @change="matchMaterialsSelect"
                    remote
                    clearable
                    filterable/>
                </el-form-item>
                <el-form-item
                  v-for="(field, index) in formFields1"
                  :key="index"
                  :label="field.label"
                >
                  <el-input
                    placeholder="请输入"
                    v-model="form.matchMaterials[field.key]"
                    disabled
                  />
                </el-form-item>
              </el-form>

              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="可配物料编码：">
                  <el-link v-if="form.matchMaterials?.materialsCode" type="primary" :href="`/sales/datacenter/materials/vehiclematerials/edit?id=${form.matchMaterials.materialsCode}`" target="_blank">
                    {{ form.matchMaterials?.materialsCode }}
                  </el-link>
                  <span v-else>{{ form.matchMaterials?.materialsCode }}</span>
                </el-form-item>
                <el-form-item
                  v-for="(field, index) in formFields1"
                  :key="index"
                  :label="field.label"
                >
                  <el-link v-if="getMatchMaterialsHref(field.key)" type="primary" :href="getMatchMaterialsHref(field.key)" target="_blank">
                    {{ form.matchMaterials[field.key.replace('Id', 'Name')] || form.matchMaterials[field.key] || '' }}
                  </el-link>
                  <el-link v-else-if="field.key === 'materialsDesc' && form.matchMaterials?.materialsCode" type="primary" :href="`/sales/datacenter/materials/vehiclematerials/edit?id=${form.matchMaterials.materialsCode}`" target="_blank">
                    {{ form.matchMaterials[field.key] || '' }}
                  </el-link>
                  <span v-else>{{ form.matchMaterials[field.key] || '' }}</span>
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 属性信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>属性信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm3" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
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
import { getDetail, addOrUpdate } from '@/api/datacenter/materials/vehicleMaterialsMatch/index';
import { getList } from '@/api/datacenter/materials/vehicleMaterials/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { debounce } from '@/libs/utils/index';

const defaultForm = {
  materialsId: '',
  matchMaterialsId: '',
  status: 1,
  statusLabel: '',
  materials: {
    materialsCode: '',
    materialsDesc: '',
    seriesId: '',
    seriesName: '',
    modelId: '',
    modelName: '',
    yearTypeId: '',
    yearTypeName: '',
    exteriorId: '',
    exteriorName: '',
    interiorId: '',
    interiorName: '',
    roofId: '',
    roofName: '',
    wheelHubId: '',
    wheelHubName: '',
    optionPackageId: '',
    optionPackageName: '',
    batteryCellId: '',
    batteryCellName: ''
  },
  matchMaterials: {
    materialsCode: '',
    materialsDesc: '',
    seriesId: '',
    seriesName: '',
    modelId: '',
    modelName: '',
    yearTypeId: '',
    yearTypeName: '',
    exteriorId: '',
    exteriorName: '',
    interiorId: '',
    interiorName: '',
    roofId: '',
    roofName: '',
    wheelHubId: '',
    wheelHubName: '',
    optionPackageId: '',
    optionPackageName: '',
    batteryCellId: '',
    batteryCellName: ''
  }
};

export default {
  name: 'vehicleMaterialsMatchEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
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
      pageType: 'edit',
      pageTitle: '物料可配关系',
      moduleKey: 'AISDC-vehicleMaterialsMatch',
      formFields: [
        { label: '物料描述：', key: 'materialsDesc' },
        { label: '车系：', key: 'seriesName' },
        { label: '车型：', key: 'modelName' },
        { label: '年款：', key: 'yearTypeName' },
        { label: '外观：', key: 'exteriorName' },
        { label: '内饰：', key: 'interiorName' },
        { label: '车顶：', key: 'roofName' },
        { label: '轮毂：', key: 'wheelHubName' },
        { label: '选装包：', key: 'optionPackageName' },
        { label: '电池电芯：', key: 'batteryCellName' }
      ],
      formFields1: [
        { label: '物料描述：', key: 'materialsDesc' },
        { label: '车系：', key: 'seriesName' },
        { label: '车型：', key: 'modelName' },
        { label: '年款：', key: 'yearTypeName' },
        { label: '外观：', key: 'exteriorName' },
        { label: '内饰：', key: 'interiorName' },
        { label: '车顶：', key: 'roofName' },
        { label: '轮毂：', key: 'wheelHubName' },
        { label: '选装包：', key: 'optionPackageName' },
        { label: '电池电芯：', key: 'batteryCellName' }
      ],
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        'materials.materialsCode': [
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        'matchMaterials.materialsCode': [
          { required: true, message: '请输入可配物料编码', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      materialsList: [],
      matchMaterialsList: []
    };
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '记录单号：' + (this.form.matchCode || '');
    }
  },
  created () {
    this.debouncedMaterialsMethod = debounce(this.materialsMethod, 300);
    this.debouncedMatchMaterialsMethod = debounce(this.matchMaterialsMethod, 300);
  },
  beforeDestroy () {
    if (this.debouncedMaterialsMethod?.cancel) this.debouncedMaterialsMethod.cancel();
    if (this.debouncedMatchMaterialsMethod?.cancel) this.debouncedMatchMaterialsMethod.cancel();
  },
  methods: {
    async detailRequest () {
      const id = this._id;
      if (id) {
        const detail = await getDetail(id);
        if (!detail.materials) {
          detail.materials = { ...defaultForm.materials };
        }
        if (!detail.matchMaterials) {
          detail.matchMaterials = { ...defaultForm.matchMaterials };
        }
        return detail;
      }
      return {};
    },
    async submitRequest () {
      const params = {
        id: this.form.id,
        materialsId: this.form.materials.id || this.form.materialsId,
        matchMaterialsId: this.form.matchMaterials.id || this.form.matchMaterialsId,
        status: this.form.status
      };
      return addOrUpdate(params);
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async materialsMethod (query) {
      const res = await getList({ materialsCodeLike: query, pageSize: 20, status: 1, statusIncludeList: ['1'] });
      this.materialsList = res.records || [];
    },
    async matchMaterialsMethod (query) {
      const res = await getList({ materialsCodeLike: query, pageSize: 20, status: 1, statusIncludeList: ['1'] });
      this.matchMaterialsList = res.records || [];
    },
    materialsSelect (val, query) {
      if (val && query) {
        this.form.materials = { ...query };
      } else {
        this.form.materials = { ...defaultForm.materials };
      }
    },
    matchMaterialsSelect (val, query) {
      if (val && query) {
        this.form.matchMaterials = { ...query };
      } else {
        this.form.matchMaterials = { ...defaultForm.matchMaterials };
      }
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    getMatchHref (key) {
      if (!key.endsWith('Id') && !key.endsWith('Name')) return null;
      const idKey = key.replace('Name', 'Id');
      const id = this.form.materials?.[idKey];
      if (!id) return null;
      const routeMap = {
        seriesId: '/sales/datacenter/materials/vehicleseries/edit',
        modelId: '/sales/datacenter/materials/vehiclemodel/edit',
        yearTypeId: '/sales/datacenter/materials/vehicleyeartype/edit',
        exteriorId: '/sales/datacenter/materials/vehicleexterior/edit',
        interiorId: '/sales/datacenter/materials/vehicleinterior/edit',
        roofId: '/sales/datacenter/materials/vehicleroof/edit',
        wheelHubId: '/sales/datacenter/materials/vehiclewheelhub/edit',
        optionPackageId: '/sales/datacenter/materials/vehicleoptionpackage/edit',
        batteryCellId: '/sales/datacenter/materials/vehiclebatterycell/edit'
      };
      return routeMap[idKey] ? `${routeMap[idKey]}?id=${id}` : null;
    },
    getMatchMaterialsHref (key) {
      if (!key.endsWith('Id') && !key.endsWith('Name')) return null;
      const idKey = key.replace('Name', 'Id');
      const id = this.form.matchMaterials?.[idKey];
      if (!id) return null;
      const routeMap = {
        seriesId: '/sales/datacenter/materials/vehicleseries/edit',
        modelId: '/sales/datacenter/materials/vehiclemodel/edit',
        yearTypeId: '/sales/datacenter/materials/vehicleyeartype/edit',
        exteriorId: '/sales/datacenter/materials/vehicleexterior/edit',
        interiorId: '/sales/datacenter/materials/vehicleinterior/edit',
        roofId: '/sales/datacenter/materials/vehicleroof/edit',
        wheelHubId: '/sales/datacenter/materials/vehiclewheelhub/edit',
        optionPackageId: '/sales/datacenter/materials/vehicleoptionpackage/edit',
        batteryCellId: '/sales/datacenter/materials/vehiclebatterycell/edit'
      };
      return routeMap[idKey] ? `${routeMap[idKey]}?id=${id}` : null;
    }
  }
};
</script>

<style lang="scss">
</style>
