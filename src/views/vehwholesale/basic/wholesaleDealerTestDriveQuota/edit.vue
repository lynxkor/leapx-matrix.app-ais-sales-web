<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="门店试驾车配额："
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
                <el-form-item label="门店编码：" prop="dealerCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.dealerCode"
                    :remote-method="getDealerListByCode"
                    value-key="storeCode"
                    label-key="storeCode"
                    @change="handleChangeDealer"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.dealerName"
                    :remote-method="getDealerListByName"
                    value-key="storeCode"
                    label-key="storeName"
                    @change="handleChangeDealer"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="年款：" prop="vehicleYearTypeId">
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
                <el-form-item label="系列：" prop="vehicleModelLineId">
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
                <el-form-item label="车系：" prop="seriesId">
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
                <el-form-item label="累计已申请数：" prop="requestQty">
                  <el-input-number
                    :controls="false"
                    placeholder="请输入"
                    v-model="form.requestQty"
                    clearable
                    :precision="0"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="配额数量：" prop="quotaQty">
                  <el-input-number
                    :controls="false"
                    placeholder="请输入"
                    v-model="form.quotaQty"
                    clearable
                    :precision="0"
                  />
                </el-form-item>
                <el-form-item label="调整说明：" prop="changeDesc">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="form.changeDesc"
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
                <el-form-item label="门店编码：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/partner/channelManagement/shopDetail?dealerCode=' + form.dealerCode)">{{ form.dealerCode }}</el-button>
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="年款：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleYearType/edit?id=' + form.vehicleYearTypeId)">{{ form.vehicleYearType }}</el-button>
                </el-form-item>
                <el-form-item label="系列：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleModelLine/edit?id=' + form.vehicleModelLineId)">{{ form.vehicleModelLine }}</el-button>
                </el-form-item>
                <el-form-item label="车系：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleSeries/edit?id=' + form.seriesId)">{{ form.seriesName }}</el-button>
                </el-form-item>
                <el-form-item label="累计已申请数：">
                  {{ form.requestQty }}
                </el-form-item>
                <el-form-item label="配额数量：">
                  {{ form.quotaQty }}
                </el-form-item>
                <el-form-item label="调整说明：">
                  {{ form.changeDesc }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleDealerTestDriveQuota/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, listOrgStoreInfo, listVehicleYearType, vehicleModelLineList, vehicleSeriesList } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  dealerCode: '',
  dealerName: '',
  vehicleYearType: '',
  vehicleModelLine: '',
  seriesName: '',
  requestQty: '0',
  changeDesc: '',
  quotaQty: '0',
  status: '',
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
  ownerOrgId: '',
};

export default {
  name: 'wholesaleDealerTestDriveQuotaEdit',
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
      return '门店试驾车配额：' + (this.form.dealerName || '');
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
      pageTitle: '门店试驾车配额',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleDealerTestDriveQuota',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      vehicleSeriesOptions: [],
      rules: {
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        vehicleYearType: [
          { required: true, message: '请选择年款', trigger: 'change' }
        ],
        quotaQty: [
          { required: true, message: '请输入配额数量', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
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
    async getDealerListByCode (params) {
      return listOrgStoreInfo({ storeCode: params, isWholesaleSale: true });
    },
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    handleChangeDealer (val, selectedOption) {
      if (val) {
        this.form.dealerCode = selectedOption?.storeCode || '';
        this.form.dealerName = selectedOption?.storeName || '';
      }
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
