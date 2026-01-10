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
              <el-form-item label="车系" prop="seriesName">
                <el-input
                  placeholder="请输入"
                  v-model="form.seriesName"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="年款" prop="yearTypeName">
                <el-input
                  placeholder="请输入"
                  v-model="form.yearTypeName"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="首付款比例%" prop="downPaymentRatio">
                <el-input
                  placeholder="请输入"
                  v-model="form.downPaymentRatio"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="是否使用返利" prop="useRebate">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="BooleanEnum"
                  v-model="form.useRebate"
                  placeholder="请选择"
                  clearable
                  disabled
                  filterable
                />
              </el-form-item>
              <el-form-item label="使用天数下限" prop="minUsageDays">
                <el-input-number placeholder="请输入" v-model="form.minUsageDays" clearable :controls="false"
                :precision="0" :min="0" :step="1"  />
              </el-form-item>
              <el-form-item label="使用天数上限" prop="maxUsageDays">
                <el-input-number placeholder="请输入" v-model="form.maxUsageDays" clearable :controls="false"
                :precision="0" :min="0" :step="1"  />
              </el-form-item>
              <el-form-item label="赊销费用" prop="creditSalesFee">
                <el-input-number placeholder="请输入" v-model="form.creditSalesFee" clearable :controls="false"
                :precision="2" :min="0" :step="0.01"  />
              </el-form-item>
              <el-form-item label="有效开始日期" prop="effectiveStartTime">
                <el-date-picker
                  v-model="form.effectiveStartTime"
                  :picker-options="pickerOptions"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item label="有效结束日期" prop="effectiveEndTime">
                <el-date-picker
                  v-model="form.effectiveEndTime"
                  :picker-options="pickerOptions"
                   type="date"
                   value-format="yyyy-MM-dd"
                   placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item label="备注">
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
              <el-form-item label="创建人" prop="creatorName">
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
              <!-- <el-form-item label="修改人" prop="modifierName">
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
              <el-form-item label="车系ID" prop="seriesId">
                <el-input
                  placeholder="请输入"
                  v-model="form.seriesId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="年款ID" prop="yearTypeId">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.yearTypeId"
                  placeholder="请选择"
                  clearable
                  filterable
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/creditsales/fundCreditSalesFeeConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  creditSalesFeeConfigCode: '',
  seriesName: '',
  yearTypeName: '',
  downPaymentRatio: '',
  useRebate: '',
  minUsageDays: '',
  maxUsageDays: '',
  creditSalesFee: '',
  effectiveStartTime: '',
  effectiveEndTime: '',
  remark: '',
  status: '',
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  modifier: '',
  statusDesc: '',
  seriesId: '',
  yearTypeId: '',
};

export default {
  name: 'fundCreditSalesFeeConfigEdit',
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
      pageTitle: '账户管理-赊销管理-赊销资费设置管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundCreditSalesFeeConfig',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        // creditSalesFeeConfigCode: [
        //   { required: true, message: '请输入记录编号', trigger: 'change' }
        // ],
        seriesName: [
          { required: true, message: '请输入车系名称', trigger: 'change' }
        ],
        yearTypeName: [
          { required: true, message: '请选择年款名称', trigger: 'change' }
        ],
        downPaymentRatio: [
          { required: true, message: '请输入首付款比例%', trigger: 'change' }
        ],
        useRebate: [
          { required: true, message: '请输入是否使用返利', trigger: 'change' }
        ],
        minUsageDays: [
          { required: true, message: '请输入使用天数下限', trigger: 'change' }
        ],
        maxUsageDays: [
          { required: true, message: '请输入使用天数上限', trigger: 'change' }
        ],
        creditSalesFee: [
          { required: true, message: '请输入赊销费用', trigger: 'change' }
        ],
        effectiveStartTime: [
          { required: true, message: '请选择有效开始日期', trigger: 'change' }
        ],
        effectiveEndTime: [
          { required: true, message: '请选择有效结束日期', trigger: 'change' }
        ],
        // remark: [
        //   { required: false, message: '请输入备注', trigger: 'change' }
        // ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        // creatorName: [
        //   { required: true, message: '请输入创建人', trigger: 'change' }
        // ],
        // createTime: [
        //   { required: true, message: '请选择创建时间', trigger: 'change' }
        // ],
        // modifierName: [
        //   { required: true, message: '请输入修改人', trigger: 'change' }
        // ],
        // updateTime: [
        //   { required: true, message: '请选择修改时间', trigger: 'change' }
        // ],
        // id: [
        //   { required: true, message: '请输入主键', trigger: 'change' }
        // ],
        // creator: [
        //   { required: true, message: '请输入创建者', trigger: 'change' }
        // ],
        // modifier: [
        //   { required: true, message: '请输入修改者', trigger: 'change' }
        // ],
        // statusDesc: [
        //   { required: true, message: '请选择状态变更描述', trigger: 'change' }
        // ],
        // seriesId: [
        //   { required: true, message: '请输入车系ID', trigger: 'change' }
        // ],
        // yearTypeId: [
        //   { required: true, message: '请选择年款ID', trigger: 'change' }
        // ],
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
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['账户管理-赊销管理-赊销资费设置管理', `${id ? '详情' : '新建'}`]);
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
          const startDate = new Date(this.form.effectiveStartTime);
          const endDate = new Date(this.form.effectiveEndTime);
          if (startDate > endDate) {
            this.$message({
              message: '有效结束日期必须大于有效开始日期',
              type: 'error'
            });
          } else if (this.form.minUsageDays > this.form.maxUsageDays) {
            this.$message({
              message: '使用天数下限必须小于使用天数上限',
              type: 'error'
            });
          } else {
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

<style lang="scss" scoped>
  ::v-deep .el-input-number {
    width: 100%;
  }
</style>
