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
              <el-form-item label="编号" prop="wholesaleSaleTargetTrackingCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesaleSaleTargetTrackingCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="年" prop="year">
                <el-input
                  placeholder="请输入"
                  v-model="form.year"
                  clearable
                />
              </el-form-item>
              <el-form-item label="月" prop="month">
                <el-input
                  placeholder="请输入"
                  v-model="form.month"
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
              <el-form-item label="合作类型" prop="cooperationType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.cooperationType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="门店编码" prop="dealerCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="门店名称" prop="dealerName">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="大区" prop="regionName">
                <el-input
                  placeholder="请输入"
                  v-model="form.regionName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="省份" prop="provinceName">
                <el-input
                  placeholder="请输入"
                  v-model="form.provinceName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="城市" prop="cityName">
                <el-input
                  placeholder="请输入"
                  v-model="form.cityName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="车系" prop="seriesName">
                <el-input
                  placeholder="请输入"
                  v-model="form.seriesName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="新增缴定订单数" prop="newOrderQty">
                <el-input
                  placeholder="请输入"
                  v-model="form.newOrderQty"
                  clearable
                />
              </el-form-item>
              <el-form-item label="新增锁单目标数" prop="newLockTargetQty">
                <el-input
                  placeholder="请输入"
                  v-model="form.newLockTargetQty"
                  clearable
                />
              </el-form-item>
              <el-form-item label="净增锁单目标数" prop="netLockTargetQty">
                <el-input
                  placeholder="请输入"
                  v-model="form.netLockTargetQty"
                  clearable
                />
              </el-form-item>
              <el-form-item label="批售考核目标数" prop="wholesaleAssessmentTargetQty">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesaleAssessmentTargetQty"
                  clearable
                />
              </el-form-item>
              <el-form-item label="交付目标数" prop="deliveryTargetQty">
                <el-input
                  placeholder="请输入"
                  v-model="form.deliveryTargetQty"
                  clearable
                />
              </el-form-item>
              <el-form-item label="批售目标数" prop="wholesaleTargetQty">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesaleTargetQty"
                  clearable
                />
              </el-form-item>
              <el-form-item label="已确认数量" prop="confirmedQty">
                <el-input
                  placeholder="请输入"
                  v-model="form.confirmedQty"
                  clearable
                />
              </el-form-item>
              <el-form-item label="批售备注" prop="wholesaleRemark">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesaleRemark"
                  clearable
                />
              </el-form-item>
              <el-form-item label="零售备注" prop="retailRemark">
                <el-input
                  placeholder="请输入"
                  v-model="form.retailRemark"
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
              <el-form-item label="大区ID" prop="regionId">
                <el-input
                  placeholder="请输入"
                  v-model="form.regionId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="省份code" prop="provinceCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.provinceCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="城市code" prop="cityCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.cityCode"
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleSaleTargetTracking/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  wholesaleSaleTargetTrackingCode: '',
  year: '',
  month: '',
  dealerParentOrgId: '',
  dealerParentOrgName: '',
  cooperationType: '',
  dealerCode: '',
  dealerName: '',
  regionName: '',
  provinceName: '',
  cityName: '',
  seriesName: '',
  newOrderQty: '',
  newLockTargetQty: '',
  netLockTargetQty: '',
  wholesaleAssessmentTargetQty: '',
  deliveryTargetQty: '',
  wholesaleTargetQty: '',
  confirmedQty: '',
  wholesaleRemark: '',
  retailRemark: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  regionId: '',
  provinceCode: '',
  cityCode: '',
  seriesId: '',
  ownerOrgId: '',
};

export default {
  name: 'wholesaleSaleTargetTrackingEdit',
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
      pageTitle: '整车批售-批售主数据-销售目标跟踪管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-wholesaleSaleTargetTracking',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        wholesaleSaleTargetTrackingCode: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ],
        year: [
          { required: true, message: '请输入年', trigger: 'blur' }
        ],
        month: [
          { required: true, message: '请输入月', trigger: 'blur' }
        ],
        dealerParentOrgId: [
          { required: true, message: '请输入母公司ID', trigger: 'blur' }
        ],
        dealerParentOrgName: [
          { required: true, message: '请输入母公司', trigger: 'blur' }
        ],
        cooperationType: [
          { required: true, message: '请选择合作类型', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        regionName: [
          { required: true, message: '请输入大区', trigger: 'blur' }
        ],
        provinceName: [
          { required: true, message: '请输入省份', trigger: 'blur' }
        ],
        cityName: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ],
        seriesName: [
          { required: true, message: '请输入车系', trigger: 'blur' }
        ],
        newOrderQty: [
          { required: true, message: '请输入新增缴定订单数', trigger: 'blur' }
        ],
        newLockTargetQty: [
          { required: true, message: '请输入新增锁单目标数', trigger: 'blur' }
        ],
        netLockTargetQty: [
          { required: true, message: '请输入净增锁单目标数', trigger: 'blur' }
        ],
        wholesaleAssessmentTargetQty: [
          { required: true, message: '请输入批售考核目标数', trigger: 'blur' }
        ],
        deliveryTargetQty: [
          { required: true, message: '请输入交付目标数', trigger: 'blur' }
        ],
        wholesaleTargetQty: [
          { required: true, message: '请输入批售目标数', trigger: 'blur' }
        ],
        confirmedQty: [
          { required: true, message: '请输入已确认数量', trigger: 'blur' }
        ],
        wholesaleRemark: [
          { required: true, message: '请输入批售备注', trigger: 'blur' }
        ],
        retailRemark: [
          { required: true, message: '请输入零售备注', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
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
        regionId: [
          { required: true, message: '请输入大区ID', trigger: 'blur' }
        ],
        provinceCode: [
          { required: true, message: '请输入省份code', trigger: 'blur' }
        ],
        cityCode: [
          { required: true, message: '请输入城市code', trigger: 'blur' }
        ],
        seriesId: [
          { required: true, message: '请输入车系ID', trigger: 'blur' }
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
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车批售-批售主数据-销售目标跟踪管理', `${id ? '编辑' : '新建'}`]);
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
