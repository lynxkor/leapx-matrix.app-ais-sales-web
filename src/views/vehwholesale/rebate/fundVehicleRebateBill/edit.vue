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
              <el-form-item label="备注（说明）" prop="remark">
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
              <el-form-item label="返利核算单明细编号" prop="rebateBillDetailCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.rebateBillDetailCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="母公司名称" prop="dealerCompanyName">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCompanyName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="母公司编码" prop="dealerCompanyCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCompanyCode"
                  clearable
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
              <el-form-item label="周期" prop="period">
                <el-input
                  placeholder="请输入"
                  v-model="form.period"
                  clearable
                />
              </el-form-item>
              <el-form-item label="年度" prop="year">
                <el-input
                  placeholder="请输入"
                  v-model="form.year"
                  clearable
                />
              </el-form-item>
              <el-form-item label="月度" prop="month">
                <el-input
                  placeholder="请输入"
                  v-model="form.month"
                  clearable
                />
              </el-form-item>
              <el-form-item label="季度" prop="quarter">
                <el-input
                  placeholder="请输入"
                  v-model="form.quarter"
                  clearable
                />
              </el-form-item>
              <el-form-item label="返利类型" prop="rebateType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.rebateType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="VIN" prop="vin">
                <el-input
                  placeholder="请输入"
                  v-model="form.vin"
                  clearable
                />
              </el-form-item>
              <el-form-item label="业务单据号" prop="bizOrderNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.bizOrderNo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="核销金额" prop="rebateAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.rebateAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="预提金额" prop="accruedAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.accruedAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="基本车型" prop="modelName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modelName"
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
              <el-form-item label="车系ID" prop="seriesId">
                <el-input
                  placeholder="请输入"
                  v-model="form.seriesId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="车系名称" prop="seriesName">
                <el-input
                  placeholder="请输入"
                  v-model="form.seriesName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否已入账，0否：1：是" prop="posted">
                <el-input
                  placeholder="请输入"
                  v-model="form.posted"
                  clearable
                />
              </el-form-item>
              <el-form-item label="预算科目ID" prop="budgetItemId">
                <el-input
                  placeholder="请输入"
                  v-model="form.budgetItemId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="费用支持类型ID" prop="feeSupportTypeId">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.feeSupportTypeId"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="审核人" prop="auditorName">
                <el-input
                  placeholder="请输入"
                  v-model="form.auditorName"
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
              <el-form-item label="审核意见" prop="auditOpinion">
                <el-input
                  placeholder="请输入"
                  v-model="form.auditOpinion"
                  clearable
                />
              </el-form-item>
              <el-form-item label="复审人" prop="reviewName">
                <el-input
                  placeholder="请输入"
                  v-model="form.reviewName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="复审人ID" prop="reviewUserId">
                <el-input
                  placeholder="请输入"
                  v-model="form.reviewUserId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="复审时间" prop="reviewTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.reviewTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="复审意见" prop="reviewOpinion">
                <el-input
                  placeholder="请输入"
                  v-model="form.reviewOpinion"
                  clearable
                />
              </el-form-item>
              <el-form-item label="审核状态" prop="billStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.billStatus"
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
              <el-form-item label="整车返利核算单ID" prop="rebateBillId">
                <el-input
                  placeholder="请输入"
                  v-model="form.rebateBillId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="交车单编码" prop="deliveryOrderCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.deliveryOrderCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="交车单ID" prop="deliveryOrderId">
                <el-input
                  placeholder="请输入"
                  v-model="form.deliveryOrderId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="批售订单ID" prop="wholesaleOrderId">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesaleOrderId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="批售订单编码" prop="wholesaleOrderCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesaleOrderCode"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/rebate/fundVehicleRebateBill/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  rebateBillDetailCode: '',
  dealerCompanyName: '',
  dealerCompanyCode: '',
  dealerCode: '',
  dealerName: '',
  period: '',
  year: '',
  month: '',
  quarter: '',
  rebateType: '',
  vin: '',
  bizOrderNo: '',
  rebateAmount: '',
  accruedAmount: '',
  modelName: '',
  modelId: '',
  seriesId: '',
  seriesName: '',
  posted: '',
  budgetItemId: '',
  feeSupportTypeId: '',
  auditorName: '',
  auditorUserId: '',
  auditTime: '',
  auditOpinion: '',
  reviewName: '',
  reviewUserId: '',
  reviewTime: '',
  reviewOpinion: '',
  billStatus: '',
  dataSource: '',
  rebateBillId: '',
  deliveryOrderCode: '',
  deliveryOrderId: '',
  wholesaleOrderId: '',
  wholesaleOrderCode: '',
};

export default {
  name: 'fundVehicleRebateBillEdit',
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
      pageTitle: '整车返利核算单明细',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-fundVehicleRebateBill',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注（说明）', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        rebateBillDetailCode: [
          { required: true, message: '请输入返利核算单明细编号', trigger: 'change' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'change' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        period: [
          { required: true, message: '请输入周期', trigger: 'change' }
        ],
        year: [
          { required: true, message: '请输入年度', trigger: 'change' }
        ],
        month: [
          { required: true, message: '请输入月度', trigger: 'change' }
        ],
        quarter: [
          { required: true, message: '请输入季度', trigger: 'change' }
        ],
        rebateType: [
          { required: true, message: '请选择返利类型', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入VIN', trigger: 'change' }
        ],
        bizOrderNo: [
          { required: true, message: '请输入业务单据号', trigger: 'change' }
        ],
        rebateAmount: [
          { required: true, message: '请输入核销金额', trigger: 'change' }
        ],
        accruedAmount: [
          { required: true, message: '请输入预提金额', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入基本车型', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请输入车系ID', trigger: 'change' }
        ],
        seriesName: [
          { required: true, message: '请输入车系名称', trigger: 'change' }
        ],
        posted: [
          { required: true, message: '请输入是否已入账', trigger: 'change' }
        ],
        budgetItemId: [
          { required: true, message: '请输入预算科目ID', trigger: 'change' }
        ],
        feeSupportTypeId: [
          { required: true, message: '请选择费用支持类型ID', trigger: 'change' }
        ],
        auditorName: [
          { required: true, message: '请输入审核人', trigger: 'change' }
        ],
        auditorUserId: [
          { required: true, message: '请输入审核人ID', trigger: 'change' }
        ],
        auditTime: [
          { required: true, message: '请选择审核时间', trigger: 'change' }
        ],
        auditOpinion: [
          { required: true, message: '请输入审核意见', trigger: 'change' }
        ],
        reviewName: [
          { required: true, message: '请输入复审人', trigger: 'change' }
        ],
        reviewUserId: [
          { required: true, message: '请输入复审人ID', trigger: 'change' }
        ],
        reviewTime: [
          { required: true, message: '请选择复审时间', trigger: 'change' }
        ],
        reviewOpinion: [
          { required: true, message: '请输入复审意见', trigger: 'change' }
        ],
        billStatus: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源', trigger: 'change' }
        ],
        rebateBillId: [
          { required: true, message: '请输入整车返利核算单ID', trigger: 'change' }
        ],
        deliveryOrderCode: [
          { required: true, message: '请输入交车单编码', trigger: 'change' }
        ],
        deliveryOrderId: [
          { required: true, message: '请输入交车单ID', trigger: 'change' }
        ],
        wholesaleOrderId: [
          { required: true, message: '请输入批售订单ID', trigger: 'change' }
        ],
        wholesaleOrderCode: [
          { required: true, message: '请输入批售订单编码', trigger: 'change' }
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
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车返利核算单明细', `${id ? '详情' : '新建'}`]);
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
