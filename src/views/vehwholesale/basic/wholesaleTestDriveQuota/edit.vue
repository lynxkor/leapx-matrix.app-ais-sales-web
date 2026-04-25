<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="试驾车默认配额："
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <span class="status primary">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="年款" prop="vehicleYearTypeId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.vehicleYearTypeId"
                    :params="form.vehicleYearType"
                    :remote-method="getVehicleYearTypeList"
                    value-key="id"
                    label-key="name"
                    :disabled="!!_id"
                    @change="(val, record) => {form.vehicleYearType = record?.name || ''}"
                  />
                </el-form-item>
                <el-form-item label="系列" prop="vehicleModelLineId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.vehicleModelLineId"
                    :params="form.vehicleModelLine"
                    :remote-method="getVehicleModelLineList"
                    value-key="id"
                    label-key="name"
                    :disabled="!!_id"
                    @change="handleVehicleModelLineChange"
                  />
                </el-form-item>
                <el-form-item label="车系" prop="seriesId">
                  <fetch-select
                    filterable
                    clearable
                    :options="vehicleSeriesOptions"
                    v-model="form.seriesId"
                    value-key="id"
                    label-key="name"
                    :disabled="!!_id"
                    @change="(val, record) => {form.seriesName = record?.name || ''}"
                  />
                </el-form-item>
                <el-form-item label="数量" prop="quantity">
                  <el-input-number
                    :controls="false"
                    placeholder="请输入"
                    v-model="form.quantity"
                    clearable
                    min="0"
                    :precision="0"
                  />
                </el-form-item>
                <el-form-item label="建店类型" prop="mcDealerType">
                  <el-cascader
                    v-model="form.mcDealerType"
                    :options="shopTypeList"
                    :props="{
                        multiple: false,
                        emitPath: false
                      }"
                    collapse-tags
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="城市" prop="cityCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.cityCode"
                    :remote-method="getCityList"
                    value-key="areaCode"
                    label-key="areaName"
                    :disabled="!!_id"
                    @change="(val, record) => {form.cityName = record?.areaName || ''}"
                  />
                </el-form-item>
                <el-form-item label="开始日期" prop="startDate">
                  <el-date-picker
                    v-model="form.startDate"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    type="datetime"
                  />
                </el-form-item>
                <el-form-item label="截止日期" prop="endDate">
                  <el-date-picker
                    v-model="form.endDate"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    default-time="23:59:59"
                    type="datetime"
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="年款：">
                  {{ form.vehicleYearType }}
                </el-form-item>
                <el-form-item label="系列：">
                  {{ form.vehicleModelLine }}
                </el-form-item>
                <el-form-item label="车系：">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="数量：">
                  {{ form.quantity }}
                </el-form-item>
                <el-form-item label="建店类型：">
                  {{ form.mcDealerTypeLabel }}
                </el-form-item>
                <el-form-item label="城市：">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="开始日期：">
                  {{ form.startDate }}
                </el-form-item>
                <el-form-item label="截止日期：">
                  {{ form.endDate }}
                </el-form-item>
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleTestDriveQuota/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, vehicleSeriesList, vehicleModelLineList, listVehicleYearType, cityListByName, getBuildType } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  vehicleYearType: '',
  vehicleModelLine: '',
  seriesName: '',
  quantity: '',
  mcDealerType: '',
  mcDealerTypeLabel: '',
  cityName: '',
  startDate: '',
  endDate: '',
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
  vehicleYearTypeId: '',
  vehicleModelLineId: '',
  seriesId: '',
  cityCode: '',
  ownerOrgId: '',
};

export default {
  name: 'wholesaleTestDriveQuotaEdit',
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
      return '试驾车默认配额：' + (this.form.vehicleYearType || '');
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
      pageTitle: '试驾车默认配额',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleTestDriveQuota',
      loading: false,
      submitLoading: false,
      shopTypeList: [],
      vehicleSeriesOptions: [],
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        vehicleYearTypeId: [
          { required: true, message: '请选择年款', trigger: 'change' }
        ],
        vehicleModelLineId: [
          { required: true, message: '请选择系列', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请选择车系', trigger: 'change' }
        ],
        quantity: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        mcDealerType: [
          { required: true, message: '请选择建店类型', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.fetchShopTypeEnum();
  },
  methods: {
    openPane () {
      this.$refs.editLayout.openPane();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          res.mcDealerType = res.mcDealerType + '';
          res.startDate = res.startDate ? res.startDate + ':00' : '';
          res.endDate = res.endDate ? res.endDate + ':00' : '';
          return res;
        });
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
    async getVehicleModelLineList (params) {
      return vehicleModelLineList({ modelLineNameLike: params, status: 1 });
    },
    async getVehicleYearTypeList (params) {
      return listVehicleYearType({ yearTypeNameLike: params, status: 1 });
    },
    async getCityList (params) {
      return cityListByName({ cityName: params });
    },
    async getBuildTypeList () {
      return getBuildType({ status: 1 });
    },
    fetchShopTypeEnum () {
      getBuildType().then(res => {
        this.shopTypeList = res;
      });
    },
    async handleVehicleModelLineChange (val, record) {
      this.form.vehicleModelLine = record?.name || '';
      this.form.seriesName = '';
      this.form.seriesId = '';
      this.vehicleSeriesOptions = [];

      try {
        const response = await this.getVehicleSeriesListByModelLineId(val);
        this.vehicleSeriesOptions = response || [];

        if (record) {
          this.form.vehicleModelLine = record.name;
          this.form.vehicleModelLineId = record.id;
        }
      } catch (error) {
        console.error('获取车系列表失败:', error);
        this.vehicleSeriesOptions = [];
      }
    },
    async getVehicleSeriesListByModelLineId (modelLineId) {
      if (!modelLineId) {
        return [];
      }
      const response = await vehicleSeriesList({
        modelLineId: modelLineId,
        status: 1
      });
      return response.data || response || [];
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>
