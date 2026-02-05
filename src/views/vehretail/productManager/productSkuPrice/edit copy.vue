<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-edit">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" inline>
              <el-form-item label="商品价格编码">
                <el-input
                  placeholder="请输入"
                  v-model="form.skuPriceCode"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="SKU编码" prop="skuCode">
                <fetch-select
                  v-bind="selectOptions"
                  :remote-method="remoteMethods"
                  @change="skuCodeSelect"
                  v-model="form.skuCode"
                />
                <!-- <el-input
                  placeholder="请输入"
                  v-model="form.skuCode"
                  clearable
                  :disabled="!!_id"
                /> -->
              </el-form-item>
              <el-form-item label="商品编码" prop="productCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.productCode"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="整车物料" prop="materialsCode">
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
                <!-- <el-input
                  placeholder="请输入"
                  v-model="form.materialsCode"
                  clearable
                /> -->
              </el-form-item>
              <el-form-item label="购车类型" prop="purchaseType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="purchase_type_pc"
                  v-model="form.purchaseType"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="补贴前价格" prop="priceBeforeSubsidy">
                <el-input-number placeholder="请输入" v-model="form.priceBeforeSubsidy" clearable :controls="false"
                  :precision="2" :min="0.00" :step="0.01"/>
                <!-- <el-input
                  placeholder="请输入"
                  v-model="form.priceBeforeSubsidy"
                  clearable
                /> -->
              </el-form-item>
              <el-form-item label="补贴金额" prop="subsidyAmount">
                <el-input-number placeholder="请输入" v-model="form.subsidyAmount" clearable :controls="false"
                  :precision="2" :min="0.00" :step="0.01"/>
                <!-- <el-input
                  placeholder="请输入"
                  v-model="form.subsidyAmount"
                  clearable
                /> -->
              </el-form-item>
              <el-form-item label="补贴后价格" prop="priceAfterSubsidy">
                <el-input
                  placeholder="请输入"
                  v-model="form.priceAfterSubsidy"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="定金" prop="deposit">
                <el-input-number placeholder="请输入" v-model="form.deposit" clearable :controls="false"
                :precision="2" :min="0.00" :step="0.01"/>
                <!-- <el-input
                  placeholder="请输入"
                  v-model="form.deposit"
                  clearable
                /> -->
              </el-form-item>
              <el-form-item label="允许改配" prop="allowConfigChange">
                <fetch-select :options="yes_no_enum" v-model="form.allowConfigChange" placeholder="请选择" clearable  />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="StatusEnum"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="开始日期" prop="startTime">
                <el-date-picker
                  type="datetime"
                  v-model="form.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
              <el-form-item label="截止日期" prop="endTime">
                <el-date-picker
                  type="datetime"
                  v-model="form.endTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  placeholder="请输入"
                  v-model="form.description"
                  clearable
                  maxlength="100"
                />
              </el-form-item>
              <el-form-item label="创建者" prop="creator">
                <el-input
                  placeholder="请输入"
                  v-model="form.creatorName"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.createTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  disabled
                />
              </el-form-item>
              <el-form-item label="修改时间">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.updateTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  disabled
                />
              </el-form-item>
            </el-form>
          </div>
          <div>
            <h1>通用模版</h1>
          </div>
          <ais-attachment-form
            ref="attachmentForm"
            :business-id="$route.query.id"
            attach-type="mcs_techniacalrepair"
          />
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" @click="handleBack">取消</el-button>
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate, getProductSkuBySkuCode } from '@/api/vehretail/productManager/productSkuPrice/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import moment from 'moment';
import { getList } from '@/api/datacenter/materials/vehicleMaterials/index';
import AisAttachmentForm from '@/libs/components/AisAttachmentForm';

const defaultForm = {
  // 多选时字段有变化，自行修复1
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
};

export default {
  name: 'productManagerEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    AisAttachmentForm,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
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
        if (val) {
          this.getDetailData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'skuCode',
        valueKey: 'skuCode',
        clearable: true,
        // multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      fileList: [],
      pageTitle: '销售管理-商品管理-商品SKU价格维护',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-productSkuPrice',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        skuPriceCode: [
          { required: true, message: '请输入商品价格编码', trigger: 'change' }
        ],
        skuCode: [
          { required: true, message: '请输入SKU编码', trigger: 'change' }
        ],
        productCode: [
          { required: true, message: '请输入关联商品编码', trigger: 'change' }
        ],
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
        ],
        materialsDesc: [
          { required: true, message: '请输入物料描述', trigger: 'change' }
        ],
        purchaseType: [
          { required: true, message: '请选择购车类型', trigger: 'change' }
        ],
        priceBeforeSubsidy: [
          { required: true, message: '请输入补贴前价格', trigger: 'change' }
        ],
        priceAfterSubsidy: [
          { required: true, message: '请输入补贴后价格', trigger: 'change' }
        ],
        subsidyAmount: [
          { required: true, message: '请输入补贴金额', trigger: 'change' }
        ],
        deposit: [
          { required: true, message: '请输入定金', trigger: 'change' }
        ],
        vehiclePrice: [
          { required: true, message: '请输入整车价格', trigger: 'change' }
        ],
        priceCompareLabel: [
          { required: true, message: '请输入价格对比', trigger: 'change' }
        ],
        allowConfigChange: [
          { required: true, message: '请输入允许改配', trigger: 'change' }
        ],
        statusLabel: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'change' }
        ],
        seriesName: [
          { required: true, message: '请输入车系名', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        productId: [
          { required: true, message: '请输入关联商品信息主键id', trigger: 'change' }
        ],
        vehicleMaterialsId: [
          { required: true, message: '请输入物料主数据主键id', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请输入车系ID', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        allowConfigChangeLabel: [
          { required: true, message: '请输入允许改配', trigger: 'change' }
        ],
        priceCompare: [
          { required: true, message: '请输入价格对比', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    remoteMethods (query) { return getProductSkuBySkuCode({ skuCodeLike: query || '', pageSize: 20 }); },
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
    repairItemSearch (query) { return getList({ nammaterialsCodeLikeeLike: query, size: 20, status: 1 }); },
    calculatePriceAfterSubsidy () {
      const { priceBeforeSubsidy, subsidyAmount } = this.form;
      if (typeof priceBeforeSubsidy === 'number' && typeof subsidyAmount === 'number') {
        this.form.priceAfterSubsidy = (priceBeforeSubsidy - subsidyAmount).toFixed(2);
      } else {
        this.form.priceAfterSubsidy = null; // 如果输入无效，清空补贴后价格
      }
    },
    handleBack () {
      // this.$router.back();
      let newPath = this.$route.path.replace(/\/edit$/, '');
      this.$router.push(newPath);
    },
    getDetailData () {
      const id = this._id;
      if (!this.id) {
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['销售管理-商品管理-商品SKU价格维护管理', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 先验证附件表单
          this.$refs.attachmentForm.validate((attachmentValid) => {
            if (attachmentValid) {
              this.submitLoading = true;
              // 合并附件数据到主表单
              const attachmentData = this.$refs.attachmentForm.getAttachmentData();
              addOrUpdate({
                ...this.form,
                attachmentFiles: attachmentData
              }).then(res => {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                const id = this.$route.query.id;
                if (rest || !id) {
                  this.resetForm(formName);
                  // 获取新增的 id
                  const currentPath = this.$route.path;
                  this.$router.push({
                    path: currentPath,
                    query: { id: res }
                  });
                } else {
                  this.getDetailData();
                }
              }).finally(() => {
                this.submitLoading = false;
              });
            }
          });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        creator: userInfo.userId,
        creatorName: userInfo.userName,
        status: 1,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
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
</style>
