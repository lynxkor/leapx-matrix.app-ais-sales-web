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
              <el-form-item label="商品编码（系统自动生成：类型编号+6位流水号）" prop="productCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.productCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="商品名称" prop="productName">
                <el-input
                  placeholder="请输入"
                  v-model="form.productName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="商品类型（1-整车，2-整车选装件，3-充电桩&#x2F;枪，4-备件，5-工时，6-卡券类，7-业务办理，8-施工，9-预约类）" prop="productType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.productType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="购车类型（1-C端用户，2-员工，3-试乘试驾&#x2F;展车）" prop="purchaseType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.purchaseType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="创建者" prop="creator">
                <el-input
                  placeholder="请输入"
                  v-model="form.creator"
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
              <el-form-item label="商品状态（1-新建，2-上架，3-下架）" prop="productStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.productStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="主键" prop="id">
                <el-input
                  placeholder="请输入"
                  v-model="form.id"
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
              <el-form-item label="修改者" prop="modifier">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifier"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改者名称" prop="modifierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifierName"
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
              <el-form-item label="状态" prop="status">
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
              <el-form-item label="商品类型标签" prop="productTypeLabel">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.productTypeLabel"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="购车类型标签" prop="purchaseTypeLabel">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.purchaseTypeLabel"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="商品状态标签" prop="productStatusLabel">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.productStatusLabel"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="简介（最多100字符）" prop="introduction">
                <el-input
                  placeholder="请输入"
                  v-model="form.introduction"
                  clearable
                />
              </el-form-item>
              <el-form-item label="描述（最多100字符）" prop="description">
                <el-input
                  placeholder="请输入"
                  v-model="form.description"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否需要支付（1-是，0-否）" prop="needPayStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.needPayStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="支付方式（1-现金，2-积分）" prop="payMethod">
                <el-input
                  placeholder="请输入"
                  v-model="form.payMethod"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否需要支付定金（1-是，0-否）" prop="needDepositStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.needDepositStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="支付定金金额（保留两位小数）" prop="depositAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.depositAmount"
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
import { getDetail, addOrUpdate } from '@/api/vehretail/productManager/productCenter/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  productCode: '',
  productName: '',
  productType: '',
  purchaseType: '',
  creator: '',
  updateTime: '',
  createTime: '',
  productStatus: '',
  id: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  statusDesc: '',
  productTypeLabel: '',
  purchaseTypeLabel: '',
  productStatusLabel: '',
  introduction: '',
  description: '',
  needPayStatus: '',
  payMethod: '',
  needDepositStatus: '',
  depositAmount: '',
  dataSource: '',
};

export default {
  name: 'productCenterEdit',
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
      pageTitle: '销售管理-商品管理-商品中心管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-productCenter',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        productCode: [
          { required: true, message: '请输入商品编码（系统自动生成：类型编号+6位流水号）', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请输入商品名称', trigger: 'change' }
        ],
        productType: [
          { required: true, message: '请选择商品类型（1-整车，2-整车选装件，3-充电桩&#x2F;枪，4-备件，5-工时，6-卡券类，7-业务办理，8-施工，9-预约类）', trigger: 'change' }
        ],
        purchaseType: [
          { required: true, message: '请选择购车类型（1-C端用户，2-员工，3-试乘试驾&#x2F;展车）', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        productStatus: [
          { required: true, message: '请选择商品状态（1-新建，2-上架，3-下架）', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
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
        productTypeLabel: [
          { required: true, message: '请选择商品类型标签', trigger: 'change' }
        ],
        purchaseTypeLabel: [
          { required: true, message: '请选择购车类型标签', trigger: 'change' }
        ],
        productStatusLabel: [
          { required: true, message: '请选择商品状态标签', trigger: 'change' }
        ],
        introduction: [
          { required: true, message: '请输入简介（最多100字符）', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入描述（最多100字符）', trigger: 'change' }
        ],
        needPayStatus: [
          { required: true, message: '请选择是否需要支付（1-是，0-否）', trigger: 'change' }
        ],
        payMethod: [
          { required: true, message: '请输入支付方式（1-现金，2-积分）', trigger: 'change' }
        ],
        needDepositStatus: [
          { required: true, message: '请选择是否需要支付定金（1-是，0-否）', trigger: 'change' }
        ],
        depositAmount: [
          { required: true, message: '请输入支付定金金额（保留两位小数）', trigger: 'change' }
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
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['销售管理-商品管理-商品中心管理', `${id ? '详情' : '新建'}`]);
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
