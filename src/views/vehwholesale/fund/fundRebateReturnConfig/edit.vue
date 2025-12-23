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
              <!-- <el-form-item label="编码" prop="rebateReturnConfigCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.rebateReturnConfigCode"
                  clearable
                />
              </el-form-item> -->
              <el-form-item label="返利类型" prop="rebateType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="vw_rebate_type"
                  v-model="form.rebateType"
                  placeholder="请选择"
                  clearable
                  filterable
                  :disabled="!!id"
                />
              </el-form-item>
              <el-form-item label="车系名称" prop="vehicleSeriesId">
                 <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.vehicleSeriesId"
                  :params="form.vehicleSeriesName"
                  :remote-method="getVehicleSeriesList"
                  value-key="id"
                  label-key="name"
                  :disabled="!!id"
              />
              </el-form-item>
              <el-form-item label="预算科目" prop="budgetItemId">
                <!-- <el-input
                  placeholder="请输入"
                  v-model="form.budgetItemId"
                  clearable
                /> -->
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.budgetItemId"
                  :params="form.budgetItemName"
                  :remote-method="getFundBudgetItemList"
                  value-key="id"
                  label-key="name"
              />
              </el-form-item>
              <el-form-item label="费用支持类型" prop="feeSupportTypeId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.feeSupportTypeId"
                  :remote-method="getFeeSuportTypeList"
                  value-key="id"
                  label-key="name"
              />
              </el-form-item>
              <el-form-item label="有效开始日期" prop="effectiveStartTime">
                  <el-date-picker
                    type="date"
                    v-model="form.effectiveStartTime"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择有效开始日期"
                  />
                <!-- <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.effectiveStartTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                /> -->

              </el-form-item>
              <el-form-item label="有效截止日期" prop="effectiveEndTime">
                 <el-date-picker
                    type="date"
                    v-model="form.effectiveEndTime"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择有效截止日期"
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
                  enumCode="StatusEnum"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                  filterable
                  disabled
                />
              </el-form-item>
              <!-- <el-form-item label="状态变更描述" prop="statusDesc">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.statusDesc"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item> -->
              <el-form-item label="创建者名称" prop="creatorName">
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
              <!-- <el-form-item label="主键" prop="id">
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
              <el-form-item label="车系ID" prop="vehicleSeriesId">
                <el-input
                  placeholder="请输入"
                  v-model="form.vehicleSeriesId"
                  clearable
                />
              </el-form-item> -->
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/fundRebateReturnConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, vehicleSeriesList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import moment from 'moment';
import { listIdNames as fundBudgetItemList } from '@/api/vehwholesale/fund/fundBudgetItem/index';
import { listIdNames as fundFeeSuportTypeList } from '@/api/vehwholesale/fund/fundFeeSupportType/index';

const defaultForm = {
  // 多选时字段有变化，自行修复
  rebateReturnConfigCode: '',
  rebateType: '',
  vehicleSeriesName: '',
  budgetItemId: '',
  feeSupportTypeId: '',
  effectiveStartTime: '',
  effectiveEndTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  vehicleSeriesId: '',
};

export default {
  name: 'fundRebateReturnConfigEdit',
  // 集中视图预留
  props: {
    // id: {
    //   type: [String, Number],
    //   default: null
    // }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    const validateDateRange = (rule, value, callback) => {
      const { effectiveStartTime, effectiveEndTime } = this.form;
      // 1. 校验截止日期必填
      if (!effectiveEndTime) {
        return callback(new Error('请选择截止日期'));
      }

      // 2. 转换为时间戳（兼容日期/日期时间格式）
      const getTimeStamp = (dateStr) => {
        if (!dateStr) return 0;
        return new Date(dateStr).getTime();
      };
      const startTime = getTimeStamp(effectiveStartTime);
      const endTime = getTimeStamp(effectiveEndTime);
      // 当日时间戳（23:59:59）：避免选当日提示超限
      const todayEnd = new Date();
      todayEnd.setHours(0, 0, 0, 0);
      const todayEndTime = todayEnd.getTime();

      // 3. 校验开始日期 ≤ 截止日期
      if (effectiveStartTime && startTime > endTime) {
        return callback(new Error('开始日期不能晚于截止日期'));
      }

      // 4. 校验截止日期 ≤ 当日
      if (endTime < todayEndTime) {
        return callback(new Error('截止日期不能晚于当日'));
      }

      // 所有校验通过
      callback();
    };
    return {
      id: this.$route.query.id,
      pageTitle: '账户管理-基础配置-返利自动返还设置管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundRebateReturnConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        rebateReturnConfigCode: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ],
        rebateType: [
          { required: true, message: '请选择返利类型', trigger: 'change' }
        ],
        vehicleSeriesName: [
          { required: true, message: '请输入车系名称', trigger: 'blur' }
        ],
        budgetItemId: [
          { required: true, message: '请输入预算科目', trigger: 'blur' }
        ],
        feeSupportTypeId: [
          { required: true, message: '请选择费用支持类型', trigger: 'change' }
        ],
        effectiveStartTime: [
          { required: true, message: '请选择有效开始日期', trigger: 'change' }
        ],
        effectiveEndTime: [
          { required: true, message: '请选择有效结束日期', trigger: 'change' },
          { validator: validateDateRange, trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注（说明）', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
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
        vehicleSeriesId: [
          { required: true, message: '请输入车系ID', trigger: 'blur' }
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['账户管理-基础配置-返利自动返还设置管理', `${id ? '编辑' : '新建'}`]);
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
        // ownerId: userInfo.userId,
        status: 1,
        creatorName: userInfo.userName,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss')
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
    async getFundBudgetItemList (params) {
      return fundBudgetItemList({ budgetItemNameLike: params, status: 1 });
    },
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async getFeeSuportTypeList (params) {
      return fundFeeSuportTypeList({ budgetItemNameLike: params, status: 1 });
    },

  }
};
</script>
