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
                <el-form-item label="地区公告编号：" prop="code">
                  <el-input
                    placeholder="系统自动创建"
                    v-model="form.code"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="城市名称：" prop="cityCode">
                  <fetch-select
                    v-model="form.cityCode"
                    placeholder="请选择"
                    :request="getCity"
                    value-key="areaCode"
                    label-key="areaName"
                    filterable
                    @change="handleChangeCity"
                  />
                </el-form-item>
                <el-form-item label="销售公告车型名称：" prop="registeredModelName">
                  <fetch-select
                    v-model="form.vehicleRegisteredModelId"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    :options="modelOptions"
                    placeholder="请选择"
                    :remote-method="serchModel"
                    @change="handleChangeModel"
                    value-key="id"
                    label-key="name"
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    maxLength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="地区公告编号：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="城市名称：">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="销售公告车型名称：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleRegisteredModel/edit?id=${form.vehicleRegisteredModelId}`" target="_blank">{{ form.registeredModelName }}</el-link>
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
                <el-form-item label="更改人：">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="更改时间：">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
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
import { getDetail, addOrUpdate } from '@/api/vehstock/basic/regionNoticeDirectory/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, cityPage, vehicleSalesVersionList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  cityCode: '',
  cityName: '',
  registeredModelName: '',
  vehicleRegisteredModelId: null,
  status: '',
  statusLabel: '',
  remark: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  statusDesc: '',
  dataSource: '',
  ownerOrgId: '',
};

export default {
  name: 'regionNoticeDirectoryEdit',
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
      return '地区公告编号：' + (this.form.code || '');
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
      pageTitle: '地区对应公告目录',
      pageType: 'edit',
      moduleKey: 'AISVS-regionNoticeDirectory',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      options: [],
      modelOptions: [],
      rules: {
        cityCode: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        registeredModelName: [
          { required: true, message: '请选择销售公告车型名称', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
      }
    };
  },
  methods: {
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
    async getCity () {
      const params = {
        page: 1,
        size: -1
      };
      const res = await cityPage(params);
      return res.records || [];
    },
    async serchModel (query) {
      const res = await vehicleSalesVersionList({ registeredModelNameLike: query, size: 100 });
      this.modelOptions = res?.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id,
        };
      }) || [];
    },
    handleChangeCity (val, selectedOption) {
      this.form.cityName = selectedOption?.areaName || '';
    },
    handleChangeModel (val) {
      const item = this.modelOptions.find(item => item.value === val);
      if (item) {
        this.form.vehicleRegisteredModelId = item.value;
        this.form.registeredModelName = item.name;
      }
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>
