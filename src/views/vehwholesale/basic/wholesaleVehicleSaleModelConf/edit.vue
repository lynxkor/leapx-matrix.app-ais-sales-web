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
          <!-- <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="车型：" prop="modelId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.modelId"
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
                <el-form-item label="订单分类：" prop="orderCategory">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_order_category"
                    v-model="form.orderCategory"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="合作模式：" prop="cooperationMode">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="ws_cooperation_mode"
                    v-model="form.cooperationMode"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="开票优惠类型：" prop="invoiceDiscountType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_invoice_type"
                    v-model="form.invoiceDiscountType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="开票系数：" prop="invoiceCoefficient">
                  <el-input-number
                    :controls="false"
                    placeholder="请输入"
                    v-model="form.invoiceCoefficient"
                    clearable
                    style="width: 100%;"
                    :min="0"
                    :max="100"
                    :precision="4"
                  />
                </el-form-item>
                <el-form-item label="返利使用类型：" prop="rebateUseType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_rebate_use_type"
                    v-model="form.rebateUseType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="返利使用系数：" prop="rebateCoefficient">
                  <el-input-number
                    :controls="false"
                    style="width: 100%;"
                    placeholder="请输入"
                    v-model="form.rebateCoefficient"
                    clearable
                    :min="0"
                    :max="100"
                    :precision="4"
                  />
                </el-form-item>
                <el-form-item label="母公司：" prop="dealerParentOrgId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.dealerParentOrgId"
                    :remote-method="getDealerParentOrgList"
                    value-key="companyCode"
                    label-key="companyName"
                    :param="form.dealerParentOrgName"
                    @change="(val, record) => {form.dealerParentOrgName = record?.companyName || ''}"
                  />
                </el-form-item>
                <el-form-item label="开始日期：" prop="startDate">
                  <el-date-picker
                    v-model="form.startDate"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    type="datetime"
                  />
                </el-form-item>
                <el-form-item label="截止日期：" prop="endDate">
                  <el-date-picker
                    v-model="form.endDate"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    type="datetime"
                    default-time="23:59:59"
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="车型：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclemodel/edit?id=${form.modelId}`" target="_blank">{{ form.modelName }}</el-link>
                </el-form-item>
                <el-form-item label="年款：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleyeartype/edit?id=${form.vehicleYearTypeId}`" target="_blank">{{ form.vehicleYearType }}</el-link>
                </el-form-item>
                <el-form-item label="订单分类：">
                  {{ form.orderCategoryLabel }}
                </el-form-item>
                <el-form-item label="合作模式：">
                  {{ form.cooperationModeLabel }}
                </el-form-item>
                <el-form-item label="开票优惠类型：">
                  {{ form.invoiceDiscountTypeLabel }}
                </el-form-item>
                <el-form-item label="开票系数：">
                  {{ form.invoiceCoefficient }}
                </el-form-item>
                <el-form-item label="返利使用类型：">
                  {{ form.rebateUseTypeLabel }}
                </el-form-item>
                <el-form-item label="返利使用系数：">
                  {{ form.rebateCoefficient }}
                </el-form-item>
                <el-form-item label="母公司：">
                  {{ form.dealerParentOrgName }}
                </el-form-item>
                <el-form-item label="开始日期：">
                  {{ form.startDate }}
                </el-form-item>
                <el-form-item label="截止日期：">
                  {{ form.endDate }}
                </el-form-item>
                <el-form-item label="提交人：">
                  {{ form.submitterName }}
                </el-form-item>
                <el-form-item label="提交时间：">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="审核人：">
                  {{ form.auditorName }}
                </el-form-item>
                <el-form-item label="审核时间：">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="审核状态：">
                  {{ form.auditStatusLabel }}
                </el-form-item>
                <el-form-item label="审核意见：">
                  {{ form.auditOpinion }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleVehicleSaleModelConf/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, vehicleModelYearTypeRelationDistinctYeayType, getParentCompany, listVehicleModel } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  modelName: '',
  vehicleYearType: '',
  orderCategory: '',
  orderCategoryLabel: '',
  cooperationMode: '',
  cooperationModeLabel: '',
  invoiceDiscountType: '',
  invoiceDiscountTypeLabel: '',
  invoiceCoefficient: '',
  rebateUseType: '',
  rebateUseTypeLabel: '',
  rebateCoefficient: '',
  dealerParentOrgId: '',
  dealerParentOrgName: '',
  startDate: '',
  endDate: '',
  submitterName: '',
  submitTime: '',
  auditorName: '',
  auditTime: '',
  auditStatus: '',
  auditStatusLabel: '',
  auditOpinion: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  remark: '',
  status: '',
  statusLabel: '',
  statusDesc: '',
  dataSource: '',
  modelId: '',
  vehicleYearTypeId: '',
  submitterUserId: '',
  auditorUserId: '',
  ownerOrgId: '',
};

export default {
  name: 'wholesaleVehicleSaleModelConfEdit',
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
      return '整车销售模式配置：' + (this.form.code || '');
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
      pageTitle: '整车销售模式配置',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleVehicleSaleModelConf',
      loading: false,
      submitLoading: false,
      yearTypeList: [],
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        modelId: [
          { required: true, message: '请选择车型', trigger: 'change' }
        ],
        vehicleYearTypeId: [
          { required: true, message: '请选择年款', trigger: 'change' }
        ],
        orderCategory: [
          { required: true, message: '请选择订单分类', trigger: 'change' }
        ],
        cooperationMode: [
          { required: true, message: '请选择合作模式', trigger: 'change' }
        ],
        invoiceDiscountType: [
          { required: true, message: '请选择开票优惠类型', trigger: 'change' }
        ],
        invoiceCoefficient: [
          { required: true, message: '请输入开票系数', trigger: 'blur' }
        ],
        rebateUseType: [
          { required: true, message: '请选择返利使用类型', trigger: 'change' }
        ],
        rebateCoefficient: [
          { required: true, message: '请输入返利使用系数', trigger: 'blur' }
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
        return getDetail(id).then(res => {
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
    async getDealerParentOrgList (params) {
      return getParentCompany({ parentCompanyName: params });
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
      const res = await vehicleModelYearTypeRelationDistinctYeayType({ modelIdList: [val], size: 1000 });
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
