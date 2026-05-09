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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="车型：" prop="modelName">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.modelName"
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
                <el-form-item label="车型：">
                  <el-button class="link" style="padding: 0;" @click="openWindow('/sales/datacenter/materials/vehicleModel/edit?id=' + form.modelId)" type="text">{{ form.modelName }}</el-button>
                </el-form-item>
                <el-form-item label="年款：">
                  <el-button class="link" style="padding: 0;" @click="openWindow('/sales/datacenter/materials/vehicleYearType/edit?id=' + form.vehicleYearTypeId)" type="text">{{ form.vehicleYearType }}</el-button>
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
import { getEnum, listVehicleModel, vehicleModelYearTypeRelation } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  wholesaleNoAutoCarModelConfName: '',
  modelName: '',
  vehicleYearType: '',
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
  modelId: '',
  vehicleYearTypeId: '',
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
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '不自动批售确认车型：' + (this.form.modelName || '');
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
      pageTitle: '不自动批售确认车型',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleNoAutoCarModelConf',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      yearTypeList: [],
      rules: {
        modelName: [
          { required: true, message: '请选择车型', trigger: 'change' }
        ],
        vehicleYearType: [
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
    async getModelIdList (params) {
      return listVehicleModel({ modelNameLike: params, status: 1 });
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
      const res = await vehicleModelYearTypeRelation({ modelIdList: [val], size: 1000 });
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
