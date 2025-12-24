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
              <el-form-item label="车型" prop="modelName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modelName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="年款" prop="vehicleYearType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.vehicleYearType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="订单���类" prop="orderCategory">
                <el-input
                  placeholder="请输入"
                  v-model="form.orderCategory"
                  clearable
                />
              </el-form-item>
              <el-form-item label="合作模式" prop="cooperationMode">
                <el-input
                  placeholder="请输入"
                  v-model="form.cooperationMode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="开票优惠类型" prop="invoiceDiscountType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.invoiceDiscountType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="开票系数" prop="invoiceCoefficient">
                <el-input
                  placeholder="请输入"
                  v-model="form.invoiceCoefficient"
                  clearable
                />
              </el-form-item>
              <el-form-item label="返利使用类型" prop="rebateUseType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.rebateUseType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="返利使用系数" prop="rebateCoefficient">
                <el-input
                  placeholder="请输入"
                  v-model="form.rebateCoefficient"
                  clearable
                />
              </el-form-item>
              <el-form-item label="母公司ID" prop="dealerParentOrgId">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerParentOrgId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="母公司" prop="dealerParentOrgName">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerParentOrgName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="开始日期" prop="startDate">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.startDate"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="截止日期" prop="endDate">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.endDate"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="提交人" prop="submitterName">
                <el-input
                  placeholder="请输入"
                  v-model="form.submitterName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="提交时间" prop="submitTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.submitTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="审核人" prop="auditorName">
                <el-input
                  placeholder="请输入"
                  v-model="form.auditorName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="审核时间" prop="auditTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.auditTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="审核状态" prop="auditStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.auditStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="审核意见" prop="auditOpinion">
                <el-input
                  placeholder="请输入"
                  v-model="form.auditOpinion"
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
              <el-form-item label="数据来源，140:新销服; 老销服:10" prop="dataSource">
                <el-input
                  placeholder="请输入"
                  v-model="form.dataSource"
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
              <el-form-item label="年款ID" prop="vehicleYearTypeId">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.vehicleYearTypeId"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="提交人ID" prop="submitterUserId">
                <el-input
                  placeholder="请输入"
                  v-model="form.submitterUserId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="审核人ID" prop="auditorUserId">
                <el-input
                  placeholder="请输入"
                  v-model="form.auditorUserId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级" prop="ownerOrgId">
                <el-input
                  placeholder="请输入"
                  v-model="form.ownerOrgId"
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleVehicleSaleModelConf/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
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
          { required: true, message: '请输入订单���类', trigger: 'blur' }
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
          { required: true, message: '请输入母公司ID', trigger: 'blur' }
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
    }
  }
};
</script>
