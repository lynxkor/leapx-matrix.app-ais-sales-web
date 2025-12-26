<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="商品价格编码（系统自动生成，前缀SKU）" prop="skuPriceCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.skuPriceCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="SKU编码" prop="skuCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.skuCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="关联商品编码" prop="productCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.productCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="物料编码" prop="materialsCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.materialsCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="物料描述" prop="materialsDesc">
                <el-input
                  placeholder="请输入"
                  v-model="form.materialsDesc"
                  clearable
                />
              </el-form-item>
              <el-form-item label="购车类型（1-个人，2-企业）" prop="purchaseTypeLabel">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.purchaseTypeLabel"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="补贴前价格（保留两位小数）" prop="priceBeforeSubsidy">
                <el-input
                  placeholder="请输入"
                  v-model="form.priceBeforeSubsidy"
                  clearable
                />
              </el-form-item>
              <el-form-item label="补贴后价格（保留两位小数，&#x3D;补贴前-补贴金额）" prop="priceAfterSubsidy">
                <el-input
                  placeholder="请输入"
                  v-model="form.priceAfterSubsidy"
                  clearable
                />
              </el-form-item>
              <el-form-item label="补贴金额（保留两位小数）" prop="subsidyAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.subsidyAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="定金（保留两位小数）" prop="deposit">
                <el-input
                  placeholder="请输入"
                  v-model="form.deposit"
                  clearable
                />
              </el-form-item>
              <el-form-item label="整车价格（关联物料编码）" prop="vehiclePrice">
                <el-input
                  placeholder="请输入"
                  v-model="form.vehiclePrice"
                  clearable
                />
              </el-form-item>
              <el-form-item label="价格对比（1-一致，2-不一致，自动计算）" prop="priceCompareLabel">
                <el-input
                  placeholder="请输入"
                  v-model="form.priceCompareLabel"
                  clearable
                />
              </el-form-item>
              <el-form-item label="允许改配（1-是，0-否，默认否）" prop="allowConfigChange">
                <el-input
                  placeholder="请输入"
                  v-model="form.allowConfigChange"
                  clearable
                />
              </el-form-item>
              <el-form-item label="状态（1-可用，0-停用，默认1-可用）" prop="statusLabel">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.statusLabel"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="开始日期" prop="startTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.startTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="截止日期" prop="endTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.endTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="描述（最多100字符）" prop="description">
                <el-input
                  placeholder="请输入"
                  v-model="form.description"
                  clearable
                />
              </el-form-item>
              <el-form-item label="车系名" prop="seriesName">
                <el-input
                  placeholder="请输入"
                  v-model="form.seriesName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="车型名称" prop="modelName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modelName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建者名称" prop="creatorName">
                <el-input
                  placeholder="请输入"
                  v-model="form.creatorName"
                  clearable
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
                />
              </el-form-item>
              <el-form-item label="修改者名称" prop="modifierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifierName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改时间" prop="updateTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.updateTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="主键" prop="id">
                <el-input
                  placeholder="请输入"
                  v-model="form.id"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建者" prop="creator">
                <el-input
                  placeholder="请输入"
                  v-model="form.creator"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改者" prop="modifier">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifier"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                />
              </el-form-item>
              <el-form-item label="状态（1-可用，0-停用，默认1-可用）" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="状态变更描述" prop="statusDesc">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.statusDesc"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="关联商品信息主键id" prop="productId">
                <el-input
                  placeholder="请输入"
                  v-model="form.productId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="物料主数据主键id" prop="vehicleMaterialsId">
                <el-input
                  placeholder="请输入"
                  v-model="form.vehicleMaterialsId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="车系ID" prop="seriesId">
                <el-input
                  placeholder="请输入"
                  v-model="form.seriesId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="车型ID" prop="modelId">
                <el-input
                  placeholder="请输入"
                  v-model="form.modelId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="购车类型（1-个人，2-企业）" prop="purchaseType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.purchaseType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="允许改配（1-是，0-否，默认否）" prop="allowConfigChangeLabel">
                <el-input
                  placeholder="请输入"
                  v-model="form.allowConfigChangeLabel"
                  clearable
                />
              </el-form-item>
              <el-form-item label="价格对比（1-一致，2-不一致，自动计算）" prop="priceCompare">
                <el-input
                  placeholder="请输入"
                  v-model="form.priceCompare"
                  clearable
                />
              </el-form-item>
              <el-form-item label="数据来源，150-新销服; 10-老销服" prop="dataSource">
                <el-input
                  placeholder="请输入"
                  v-model="form.dataSource"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/productManager/productSkuPrice/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  skuPriceCode: '',
  skuCode: '',
  productCode: '',
  materialsCode: '',
  materialsDesc: '',
  purchaseTypeLabel: '',
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
  purchaseType: '',
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
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  watch: {
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
      pageTitle: '销售管理-商品管理-商品SKU价格维护管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-productManager',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        skuPriceCode: [
          { required: true, message: '请输入商品价格编码（系统自动生成，前缀SKU）', trigger: 'change' }
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
        purchaseTypeLabel: [
          { required: true, message: '请选择购车类型（1-个人，2-企业）', trigger: 'change' }
        ],
        priceBeforeSubsidy: [
          { required: true, message: '请输入补贴前价格（保留两位小数）', trigger: 'change' }
        ],
        priceAfterSubsidy: [
          { required: true, message: '请输入补贴后价格（保留两位小数，&#x3D;补贴前-补贴金额）', trigger: 'change' }
        ],
        subsidyAmount: [
          { required: true, message: '请输入补贴金额（保留两位小数）', trigger: 'change' }
        ],
        deposit: [
          { required: true, message: '请输入定金（保留两位小数）', trigger: 'change' }
        ],
        vehiclePrice: [
          { required: true, message: '请输入整车价格（关联物料编码）', trigger: 'change' }
        ],
        priceCompareLabel: [
          { required: true, message: '请输入价格对比（1-一致，2-不一致，自动计算）', trigger: 'change' }
        ],
        allowConfigChange: [
          { required: true, message: '请输入允许改配（1-是，0-否，默认否）', trigger: 'change' }
        ],
        statusLabel: [
          { required: true, message: '请选择状态（1-可用，0-停用，默认1-可用）', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入描述（最多100字符）', trigger: 'change' }
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
          { required: true, message: '请选择状态（1-可用，0-停用，默认1-可用）', trigger: 'change' }
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
        purchaseType: [
          { required: true, message: '请选择购车类型（1-个人，2-企业）', trigger: 'change' }
        ],
        allowConfigChangeLabel: [
          { required: true, message: '请输入允许改配（1-是，0-否，默认否）', trigger: 'change' }
        ],
        priceCompare: [
          { required: true, message: '请输入价格对比（1-一致，2-不一致，自动计算）', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150-新销服; 10-老销服', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    handleBack () {
      this.$router.back();
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
          this.submitLoading = true;
          addOrUpdate({ ...this.form }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            const id = this.$route.query.id;
            if (rest || !id) {
              this.resetForm(formName);
            } else {
              this.getDetailData();
            }
          }).finally(() => {
            this.submitLoading = false;
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
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
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
