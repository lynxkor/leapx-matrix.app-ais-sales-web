<template>
  <edit-page-layout ref="editLayout" title="团购企业优惠政策详情" showPaneFooter>
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
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="公司名称：" prop="companyId">
                  <fetch-select
                    :remote-method="queryCompanyList"
                    remote
                    v-model="form.companyId"
                    :params="form.companyName"
                    value-key="id"
                    label-key="name"
                    placeholder="请选择公司"
                    clearable
                    filterable
                    @change="(val, record) => {form.companyName = record?.name || ''}"
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
                  />
                </el-form-item>
                <el-form-item label="优惠券：" prop="couponName">
                  <el-input
                    placeholder="请输入优惠券名称"
                    v-model="form.couponName"
                    clearable
                    maxlength="100"
                  />
                </el-form-item>
                <el-form-item label="优惠金额：" prop="discountAmount">
                  <el-input
                    type="number"
                    placeholder="请输入优惠金额"
                    v-model="form.discountAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="有效开始时间：" prop="validStartTime">
                  <el-date-picker
                    v-model="form.validStartTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item label="有效截止时间：" prop="validEndTime">
                  <el-date-picker
                    v-model="form.validEndTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入备注"
                    v-model="form.remark"
                    clearable
                    maxlength="1000"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="公司名称：">
                  {{ form.companyName }}
                </el-form-item>
                <el-form-item label="车系：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleseries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName }}</el-link>
                </el-form-item>
                <el-form-item label="优惠券：">
                  {{ form.couponName }}
                </el-form-item>
                <el-form-item label="优惠金额：">
                  {{ form.discountAmount }}
                </el-form-item>
                <el-form-item label="有效开始时间：">
                  {{ form.validStartTime }}
                </el-form-item>
                <el-form-item label="有效截止时间：">
                  {{ form.validEndTime }}
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
        <section class="common-section">
          <div class="common-section-header">
            <h2>基本信息</h2>
          </div>
          <div class="common-section-body">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="编码">
                {{ form.code }}
              </el-descriptions-item>
              <el-descriptions-item label="创建人">
                {{ form.creatorName }}
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ form.createTime }}
              </el-descriptions-item>
              <el-descriptions-item label="修改人">
                {{ form.modifierName }}
              </el-descriptions-item>
              <el-descriptions-item label="修改时间">
                {{ form.updateTime }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </section>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/vrGroupbuyEnterprisePolicy/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { vehicleSeriesList } from '@/api/common';
import { getSelect } from '@/api/vehretail/orderManager/vrGroupbuyEnterpriseCustomer/index';

const defaultForm = {
  companyId: '',
  companyName: '',
  seriesId: '',
  seriesName: '',
  couponName: '',
  discountAmount: '',
  validStartTime: '',
  validEndTime: '',
  remark: ''
};

export default {
  name: 'vrGroupbuyEnterprisePolicyEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '公司名称：' + (this.form.companyName || '');
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();

    // 验证优惠金额格式
    const validateDiscountAmount = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入优惠金额'));
        return;
      }

      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        callback(new Error('请输入有效的数字'));
        return;
      }

      if (numValue < 0.00 || numValue > 100000000000.00) {
        callback(new Error('输入一个介于 0.00 到 100,000,000,000.00 之间的值'));
        return;
      }

      // 检查是否为两位小数
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        callback(new Error('优惠金额最多保留两位小数'));
        return;
      }

      callback();
    };

    // 验证时间范围
    const validateTimeRange = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择有效截止时间'));
        return;
      }

      if (this.form.validStartTime && value <= this.form.validStartTime) {
        callback(new Error('【有效开始日期】必须小于【有效截止日期】'));
        return;
      }

      callback();
    };

    return {
      pageTitle: '团购企业优惠政策',
      pageType: 'edit',
      moduleKey: 'AISVR-vrGroupbuyEnterprisePolicy',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        companyId: [
          { required: true, message: '请选择公司名称', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请选择车系', trigger: 'change' }
        ],
        couponName: [
          { required: true, message: '请输入优惠券名称', trigger: 'change' }
        ],
        discountAmount: [
          { validator: validateDiscountAmount, trigger: 'blur', required: true }
        ],
        validStartTime: [
          { required: true, message: '请选择有效开始时间', trigger: 'change' }
        ],
        validEndTime: [
          { validator: validateTimeRange, trigger: 'change', required: true }
        ],
      }
    };
  },
  methods: {
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
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async queryCompanyList (params) {
      const res = await getSelect({ companyName: params, limitSize: 10, isCooperation: 1 });
      return res || [];
    }
  }
};
</script>
