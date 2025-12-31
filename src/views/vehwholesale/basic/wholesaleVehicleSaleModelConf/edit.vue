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
              <el-form-item label="车型" prop="modelId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.modelId"
                  :remote-method="getModelIdList"
                  value-key="id"
                  label-key="name"
                  @change="modelListChange"
                  :disabled="!!_id"
                />
              </el-form-item>
              <el-form-item label="年款" prop="vehicleYearTypeId">
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
              <el-form-item label="订单分类" prop="orderCategory">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="ws_order_category"
                  v-model="form.orderCategory"
                  placeholder="请选择"
                  clearable
                  filterable
                  :disabled="!!_id"
                />
              </el-form-item>
              <el-form-item label="合作模式" prop="cooperationMode">
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
              <el-form-item label="开票优惠类型" prop="invoiceDiscountType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="ws_invoice_discount_type"
                  v-model="form.invoiceDiscountType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="开票系数" prop="invoiceCoefficient">
                <el-input-number
                  placeholder="请输入"
                  v-model="form.invoiceCoefficient"
                  clearable
                  :precision="4"
                />
              </el-form-item>
              <el-form-item label="返利使用类型" prop="rebateUseType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="ws_rebate_use_type"
                  v-model="form.rebateUseType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="返利使用系数" prop="rebateCoefficient">
                <el-input-number
                  placeholder="请输入"
                  v-model="form.rebateCoefficient"
                  clearable
                  :precision="4"
                />
              </el-form-item>
              <el-form-item label="母公司" prop="dealerParentOrgId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.dealerParentOrgId"
                  :remote-method="getDealerParentOrgList"
                  value-key="companyCode"
                  label-key="companyName"
                  @change="(val, record) => {form.dealerParentOrgName = record?.companyName || ''}"
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
                  type="datetime"
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleVehicleSaleModelConf/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, vehicleModelYearTypeRelationDistinctYeayType, getParentCompany, listVehicleModel } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  modelName: '',
  vehicleYearType: '',
  orderCategory: '',
  cooperationMode: '',
  invoiceDiscountType: '',
  invoiceCoefficient: '',
  rebateUseType: '',
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
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '整车批售-批售主数据-整车销售模式配置管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleVehicleSaleModelConf',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        modelName: [
          { required: true, message: '请输入车型', trigger: 'blur' }
        ],
        vehicleYearType: [
          { required: true, message: '请选择年款', trigger: 'change' }
        ],
        orderCategory: [
          { required: true, message: '请输入订单分类', trigger: 'blur' }
        ],
        cooperationMode: [
          { required: true, message: '请输入合作模式', trigger: 'blur' }
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
        dealerParentOrgId: [
          { required: false, message: '请输入母公司ID', trigger: 'blur' }
        ],
        dealerParentOrgName: [
          { required: true, message: '请输入母公司', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ],
        submitterName: [
          { required: true, message: '请输入提交人', trigger: 'blur' }
        ],
        submitTime: [
          { required: true, message: '请选择提交时间', trigger: 'change' }
        ],
        auditorName: [
          { required: true, message: '请输入审核人', trigger: 'blur' }
        ],
        auditTime: [
          { required: true, message: '请选择审核时间', trigger: 'change' }
        ],
        auditStatus: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        auditOpinion: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，140:新销服; 老销服:10', trigger: 'blur' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'blur' }
        ],
        vehicleYearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' }
        ],
        submitterUserId: [
          { required: true, message: '请输入提交人ID', trigger: 'blur' }
        ],
        auditorUserId: [
          { required: true, message: '请输入审核人ID', trigger: 'blur' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'blur' }
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
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车批售-批售主数据-整车销售模式配置管理', `${id ? '编辑' : '新建'}`]);
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
    // handleJumpAuditLog () {
    //   this.$router.push({
    //     path: '/xxx/auditLog',
    //     query: {
    //       tableCode: '',
    //       tableId: ''
    //     }
    //   });
    // },
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
    async modelListChange (val, record) {
      this.form.modelName = record?.name || '';
      const res = await vehicleModelYearTypeRelationDistinctYeayType({ modelIdList: [val], size: 1000 });
      this.yearTypeList = res.map(item => {
        return {
          ...item,
          label: item.yearTypeName,
          value: item.yearTypeId
        };
      });
    }
  }
};
</script>
