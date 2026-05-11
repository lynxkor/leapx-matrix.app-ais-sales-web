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
                <el-form-item label="仓库配车编号：" prop="code">
                  <el-input
                    placeholder="系统自动生成"
                    v-model="form.code"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="整车仓库：" prop="warehouseName">
                  <fetch-select
                    v-model="form.warehouseCode"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    :options="warehouseOptions"
                    placeholder="请选择"
                    :remote-method="serchWarehouse"
                    @change="warehouseType"
                    value-key="warehouseCode"
                    label-key="warehouseName"
                  />
                </el-form-item>
                <el-form-item label="仓库分类：" prop="warehouseType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehstock_warehouse_type"
                    v-model="form.warehouseType"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="省：" prop="provinceCode">
                  <fetch-select
                    v-model="form.provinceCode"
                    placeholder="请选择"
                    :request="getProvince"
                    value-key="code"
                    label-key="name"
                    filterable
                    @change="handleChangeProvince"
                  />
                </el-form-item>
                <el-form-item label="市：" prop="cityCode">
                  <fetch-select
                    v-model="form.cityCode"
                    placeholder="请选择"
                    :options="cityOptions"
                    value-key="code"
                    label-key="name"
                    filterable
                    @change="handleChangeCity"
                  />
                </el-form-item>
                <el-form-item label="配车优先级：" prop="priority">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.priority"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="仓库配车编号：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="整车仓库：">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="仓库分类：">
                  {{ form.warehouseTypeLabel }}
                </el-form-item>
                <el-form-item label="省：">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="配车优先级：">
                  {{ form.priority }}
                </el-form-item>
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
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
import { getDetail, addOrUpdate } from '@/api/vehstock/basic/warehouseVehicleRelation/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, page, getProvinceTree } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  remark: '',
  warehouseCode: '',
  provinceCode: '',
  cityCode: '',
  code: '',
  warehouseName: '',
  warehouseType: '',
  warehouseTypeLabel: '',
  provinceName: '',
  cityName: '',
  priority: '',
  status: '',
  statusLabel: '',
  creatorName: '',
  createTime: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  statusDesc: '',
  dataSource: '',
  ownerOrgId: '',
};

export default {
  name: 'warehouseVehicleRelationEdit',
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
      return '仓库配车关系：' + (this.form.code || '');
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
      pageTitle: '仓库配车关系',
      pageType: 'edit',
      moduleKey: 'AISVS-warehouseVehicleRelation',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      warehouseOptions: [],
      provinceOptions: [],
      cityOptions: [],
      rules: {
        warehouseName: [
          { required: true, message: '请选择整车仓库', trigger: 'change' }
        ],
        warehouseType: [
          { required: true, message: '请选择仓库分类', trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: '请选择省', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请选择市', trigger: 'change' }
        ],
        priority: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '' || value === null || value === undefined) {
                callback(new Error('配车优先级不能为空'));
                return;
              }
              const numValue = Number(value);
              const strValue = value.toString();
              if (isNaN(numValue)) {
                callback(new Error('配车优先级必须为数字'));
                return;
              }
              if (numValue.toString() !== strValue) {
                callback(new Error('配车优先级不能包含前导零'));
                return;
              }
              if (!Number.isInteger(numValue) || numValue <= 0) {
                callback(new Error('配车优先级必须为正整数'));
                return;
              }
              if (numValue > 99999999) {
                callback(new Error('配车优先级不能大于99999999'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
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
    async serchWarehouse (query) {
      const res = await page({ warehouseName: query, page: 1, size: 100 });
      this.warehouseOptions = res?.records?.map(item => {
        return {
          ...item,
          label: item.warehouseName,
          value: item.warehouseCode,
        };
      }) || [];
    },
    async getProvince () {
      const res = await getProvinceTree();
      const list = res || [];
      if (this.$route.query.id) {
        const province = list.find(item => item.code === this.form.provinceCode);
        this.cityOptions = province?.child?.map(city => ({
          code: city.code,
          name: city.name
        })) || [];
      };
      return list;
    },
    warehouseType (val, selectedOption) {
      this.form.warehouseCode = selectedOption?.warehouseCode || '';
      this.form.warehouseName = selectedOption?.warehouseName || '';
      this.form.warehouseType = selectedOption?.warehouseType || '';
    },
    handleChangeProvince (val, selectedOption) {
      if (val) {
        this.form.provinceCode = selectedOption?.code || '';
        this.form.provinceName = selectedOption?.name || '';
        this.cityOptions = selectedOption?.child || [];
        this.form.cityCode = '';
        this.form.cityName = '';
      }
    },
    handleChangeCity (val, selectedOption) {
      if (val) {
        this.form.cityCode = selectedOption?.code || '';
        this.form.cityName = selectedOption?.name || '';
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
