<template>
  <edit-page-layout ref="editLayout" title="商品SKU价格维护" showPaneFooter>
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
        :dataTransform="dataTransform"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2 v-show="_id">基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑表单 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="商品价格编码：" prop="skuPriceCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.skuPriceCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="SKU编码：" prop="skuCode">
                  <fetch-select
                    v-bind="selectOptions"
                    :remote-method="remoteMethods"
                    @change="skuCodeSelect"
                    v-model="form.skuCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="商品编码：" prop="productCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.productCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="整车物料：" prop="materialsCode">
                  <fetch-select
                    v-model="form.materialsCode"
                    placeholder="请选择"
                    optionKey="id"
                    labelKey="materialsCode"
                    valueKey="materialsCode"
                    :remoteMethod="repairItemSearch"
                    @change="materialsSelect"
                    remote
                    clearable
                    filterable/>
                </el-form-item>
                <el-form-item label="购车类型：" prop="purchaseType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="purchase_type_pc"
                    v-model="form.purchaseType"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="补贴前价格：" prop="priceBeforeSubsidy">
                  <el-input-number placeholder="请输入" v-model="form.priceBeforeSubsidy" clearable :controls="false"
                    :precision="2" :min="0.00" :step="0.01"/>
                </el-form-item>
                <el-form-item label="补贴金额：" prop="subsidyAmount">
                  <el-input-number placeholder="请输入" v-model="form.subsidyAmount" clearable :controls="false"
                    :precision="2" :min="0.00" :step="0.01"/>
                </el-form-item>
                <el-form-item label="补贴后价格：" prop="priceAfterSubsidy">
                  <el-input
                    placeholder="请输入"
                    v-model="form.priceAfterSubsidy"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="定金：" prop="deposit">
                  <el-input-number placeholder="请输入" v-model="form.deposit" clearable :controls="false"
                  :precision="2" :min="0.00" :step="0.01"/>
                </el-form-item>
                <el-form-item label="允许改配：" prop="allowConfigChange">
                  <fetch-select :options="yes_no_enum" v-model="form.allowConfigChange" placeholder="请选择" clearable  />
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
                <el-form-item label="开始日期：" prop="startTime">
                  <el-date-picker
                    type="datetime"
                    v-model="form.startTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item label="截止日期：" prop="endTime">
                  <el-date-picker
                    type="datetime"
                    v-model="form.endTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item label="描述：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.description"
                    clearable
                    maxlength="100"
                  />
                </el-form-item>
              </el-form>

              <!-- 详情展示 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="商品价格编码：">
                  {{ form.skuPriceCode }}
                </el-form-item>
                <el-form-item label="SKU编码：">
                  {{ form.skuCode }}
                </el-form-item>
                <el-form-item label="商品编码：">
                  <el-link type="primary" :href="`/sales/vehretail/productManager/productCenter/edit?id=${form.productId}`" target="_blank">
                    {{ form.productCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="整车物料：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${form.vehicleMaterialsId}`" target="_blank">
                    {{ form.materialsCode }}
                  </el-link>
                </el-form-item>
                 <el-form-item label="物料描述：">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="购车类型：">
                  {{ form.purchaseTypeLabel }}
                </el-form-item>
                <el-form-item label="补贴前价格：">
                  {{ formatMoney(form.priceBeforeSubsidy) }}
                </el-form-item>
                <el-form-item label="补贴金额：">
                  {{ formatMoney(form.subsidyAmount) }}
                </el-form-item>
                <el-form-item label="补贴后价格：">
                  {{ formatMoney(form.priceAfterSubsidy) }}
                </el-form-item>
                <el-form-item label="定金：">
                  {{ formatMoney(form.deposit) }}
                </el-form-item>
                <el-form-item label="允许改配：">
                  {{ form.allowConfigChangeLabel }}
                </el-form-item>
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="开始日期：">
                  {{ form.startTime }}
                </el-form-item>
                <el-form-item label="截止日期：">
                  {{ form.endTime }}
                </el-form-item>
                <el-form-item label="描述：">
                  {{ form.description }}
                </el-form-item>
                <el-form-item label="创建者：">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：">
                  {{ form.updateTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，可添加辅助信息或操作面板 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, getProductSkuBySkuCode } from '@/api/vehretail/productManager/productSkuPrice/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList } from '@/api/datacenter/materials/vehicleMaterials/index';

const defaultForm = {
  skuPriceCode: '',
  skuCode: '',
  productCode: '',
  materialsCode: '',
  materialsDesc: '',
  purchaseType: '',
  priceBeforeSubsidy: '',
  priceAfterSubsidy: '',
  subsidyAmount: '',
  deposit: '',
  vehiclePrice: '',
  priceCompareLabel: '',
  allowConfigChange: '',
  statusLabel: '',
  startTime: '',
  endTime: '',
  description: '',
  seriesName: '',
  modelName: '',
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  modifier: '',
  remark: '',
  status: '',
  statusDesc: '',
  productId: '',
  vehicleMaterialsId: '',
  seriesId: '',
  modelId: '',
  allowConfigChangeLabel: '',
  priceCompare: '',
  dataSource: '',
  purchaseTypeLabel: ''
};

export default {
  name: 'productManagerEdit',
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
      return '商品价格编码：' + this.form.skuPriceCode;
    }
  },
  watch: {
    'form.priceBeforeSubsidy': {
      handler (newVal) {
        this.calculatePriceAfterSubsidy();
      },
      immediate: true
    },
    'form.subsidyAmount': {
      handler (newVal) {
        this.calculatePriceAfterSubsidy();
      },
      immediate: true
    },
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
    return {
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'skuCode',
        valueKey: 'skuCode',
        clearable: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      pageTitle: '商品SKU价格维护',
      pageType: 'edit',
      moduleKey: 'AISVR-productSkuPrice',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        skuCode: [
          { required: true, message: '请输入SKU编码', trigger: 'change' }
        ],
        productCode: [
          { required: true, message: '请输入关联商品编码', trigger: 'change' }
        ],
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
        ],
        purchaseType: [
          { required: true, message: '请选择购车类型', trigger: 'change' }
        ],
        priceBeforeSubsidy: [
          { required: true, message: '请输入补贴前价格', trigger: 'change' }
        ],
        subsidyAmount: [
          { required: true, message: '请输入补贴金额', trigger: 'change' }
        ],
        deposit: [
          { required: true, message: '请输入定金', trigger: 'change' }
        ],
        allowConfigChange: [
          { required: true, message: '请选择允许改配', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (!this.id) {
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['商品SKU价格维护管理', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    remoteMethods (query) {
      return getProductSkuBySkuCode({ skuCodeLike: query || '', pageSize: 20 });
    },
    materialsSelect (val, row) {
      if (val) {
        this.form.vehicleMaterialsId = row.id;
      } else {
        this.form.vehicleMaterialsId = '';
      }
    },
    skuCodeSelect (val, row) {
      if (val) {
        this.form.productId = row.productId;
        this.form.productCode = row.productCode;
      } else {
        this.form.productId = '';
        this.form.productCode = '';
      }
    },
    repairItemSearch (query) {
      if (!query || query.length < 2) {
        return [];
      }
      return getList({ materialsCodeLike: query, pageSize: 20, status: 1 });
    },
    calculatePriceAfterSubsidy () {
      const { priceBeforeSubsidy, subsidyAmount } = this.form;
      if (typeof priceBeforeSubsidy === 'number' && typeof subsidyAmount === 'number') {
        this.form.priceAfterSubsidy = (priceBeforeSubsidy - subsidyAmount).toFixed(2);
      } else {
        this.form.priceAfterSubsidy = null;
      }
    },
    // 详情接口数据归一化:金额字段统一转为 number,便于后续计算与展示
    dataTransform (data) {
      const moneyFields = ['priceBeforeSubsidy', 'subsidyAmount', 'priceAfterSubsidy', 'deposit'];
      const result = { ...data };
      moneyFields.forEach((key) => {
        if (result[key] === '' || result[key] === null || result[key] === undefined) {
          result[key] = 0;
        } else {
          const num = Number(result[key]);
          result[key] = Number.isNaN(num) ? 0 : num;
        }
      });
      return result;
    },
    // 金额格式化:始终保留两位小数,字符串/数字都安全
    formatMoney (val) {
      if (val === '' || val === null || val === undefined) return '0.00';
      const num = Number(val);
      return Number.isNaN(num) ? '0.00' : num.toFixed(2);
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
<style lang="scss" scoped>
  ::v-deep .el-input-number {
    width: 100%;
  }
  .form-edit, .form-detail {
    width: 100%;
  }
</style>
