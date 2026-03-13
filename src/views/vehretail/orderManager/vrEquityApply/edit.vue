<template>
  <edit-page-layout ref="editLayout" title="订单权益申请详情" showPaneFooter>
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
      >
        <template #status>
          <span v-if="form.auditStatus === 10" class="status">草稿</span>
          <span v-else-if="form.auditStatus === 20" class="status warning">驳回</span>
          <span v-else-if="form.auditStatus === 30" class="status">已提交</span>
          <span v-else-if="form.auditStatus === 40" class="status">已初审</span>
          <span v-else-if="form.auditStatus === 60" class="status success">已终审</span>
          <span v-else-if="form.auditStatus === 70" class="status danger">作废</span>
        </template>
        <template #extraButtons>
          <el-button v-if="canEditDraft && canAddOrUpdate" size="small" @click="handleCancel">作废</el-button>
          <el-button v-if="canSubmitApproval" size="small" type="primary" @click="handleSubmitApproval">提交审批</el-button>
          <el-button v-if="canFirstAudit" size="small" type="primary" @click="handleFirstAudit">初审</el-button>
          <el-button v-if="canAudit" size="small" type="primary" @click="handleAudit">审核</el-button>
          <el-button v-if="canRecall" size="small" @click="handleRecall">审核撤回</el-button>
        </template>
        <el-main>
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="订单权益申请单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="商城订单号：" prop="mallOrderNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车订单编号：" prop="vehicleOrderNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleOrderNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="原车VIN号：" prop="originalVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalVin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权益大类：" prop="equityCategoryName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="equity_category"
                    v-model="form.equityCategoryId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="置换类型：" prop="replacementType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="mcs_replacetype"
                    v-model="form.replacementType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="优惠金额：" prop="discountAmount">
                  <el-input-number
                    v-model="form.discountAmount"
                    :precision="2"
                    :step="0.01"
                    placeholder="请输入"
                  />
                </el-form-item>
                <el-form-item label="其他品牌：" prop="otherBrand">
                  <el-input
                    placeholder="请输入"
                    v-model="form.otherBrand"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="订单权益申请单号：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="商城订单号：">
                  <el-link type="primary" @click="handleViewStoreDetail">{{ form.mallOrderNo }}</el-link>
                </el-form-item>
                <el-form-item label="整车订单编号：">
                  {{ form.vehicleOrderNo }}
                </el-form-item>
                <el-form-item label="原车VIN号：">
                  <el-link type="primary" @click="handleViewVehicleDetail">{{ form.originalVin }}</el-link>
                </el-form-item>
                <el-form-item label="权益大类：">
                  {{ form.equityCategoryName }}
                </el-form-item>
                <el-form-item label="置换类型：">
                  {{ getEnumLabel('mcs_replacetype', form.replacementType) }}
                </el-form-item>
                <el-form-item label="优惠金额：">
                  {{ form.discountAmount }}
                </el-form-item>
                <el-form-item label="其他品牌：">
                  {{ form.otherBrand }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="提交人：">
                  {{ form.submitterName }}
                </el-form-item>
                <el-form-item label="提交时间：">
                  {{ form.submitTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 附件材料 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>附件材料</h2>
            </div>
            <div class="common-section-body">
              <el-upload
                class="upload-demo"
                action=""
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false"
              >
                <el-button size="small" type="primary" slot="trigger">选择文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </div>
          </section>

          <!-- 订单信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>订单信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="orderForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="商城订单编号：" prop="mallOrderNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="缴定金时间：" prop="depositTime">
                  <el-date-picker
                    v-model="form.depositTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                  />
                </el-form-item>
                <el-form-item label="锁单时间：" prop="lockTime">
                  <el-date-picker
                    v-model="form.lockTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                  />
                </el-form-item>
                <el-form-item label="代办联系人：" prop="agentContact">
                  <el-input
                    placeholder="请输入"
                    v-model="form.agentContact"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="购车人姓名：" prop="buyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.buyerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="用户ID：" prop="buyerUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.buyerUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="购车人手机号码：" prop="buyerPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.buyerPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="购车人证件类型：" prop="buyerIdType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="id_type"
                    v-model="form.buyerIdType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="购车人证件号码：" prop="buyerIdNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.buyerIdNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下单人ID：" prop="orderUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合作类型：" prop="cooperationType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="cooperation_type"
                    v-model="form.cooperationType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="所属区域：" prop="regionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityName"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="商城订单编号：">
                  {{ form.mallOrderNo }}
                </el-form-item>
                <el-form-item label="缴定金时间：">
                  {{ form.depositTime }}
                </el-form-item>
                <el-form-item label="锁单时间：">
                  {{ form.lockTime }}
                </el-form-item>
                <el-form-item label="代办联系人：">
                  {{ form.agentContact }}
                </el-form-item>
                <el-form-item label="购车人姓名：">
                  {{ form.buyerName }}
                </el-form-item>
                <el-form-item label="用户ID：">
                  {{ form.buyerUserId }}
                </el-form-item>
                <el-form-item label="购车人手机号码：">
                  {{ form.buyerPhone }}
                </el-form-item>
                <el-form-item label="购车人证件类型：">
                  {{ form.buyerIdType }}
                </el-form-item>
                <el-form-item label="购车人证件号码：">
                  {{ form.buyerIdNumber }}
                </el-form-item>
                <el-form-item label="下单人ID：">
                  {{ form.orderUserId }}
                </el-form-item>
                <el-form-item label="销售门店：">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="合作类型：">
                  {{ getEnumLabel('cooperation_type', form.cooperationType) }}
                </el-form-item>
                <el-form-item label="所属区域：">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="省：">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：">
                  {{ form.cityName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 订单物料信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>订单物料信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="materialsForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="订单物料码：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="基本车系：" prop="seriesName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="基本车型：" prop="modelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆年型：" prop="vehicleYearType">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleYearType"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="选装包：" prop="optionPackageName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.optionPackageName"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="订单物料码：">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="物料描述：">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="基本车系：">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="基本车型：">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="车辆年型：">
                  {{ form.vehicleYearType }}
                </el-form-item>
                <el-form-item label="选装包：">
                  {{ form.optionPackageName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 放发信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>发放信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="issueForm" label-width="150px" class="form-edit" v-show="isEditing || !_id || canEditIssue">
                <el-form-item label="是否发放：" prop="isIssued">
                  <fetch-select
                    :options="yes_no_enum"
                    v-model="form.isIssued"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="预计发放日期：" prop="expectedIssueDate">
                  <el-date-picker
                    v-model="form.expectedIssueDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item label="发放类型：" prop="issueType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="issue_type"
                    v-model="form.issueType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id || canEditIssue)">
                <el-form-item label="是否发放：">
                  {{ yes_no_enum_map[form.isIssued] }}
                </el-form-item>
                <el-form-item label="预计发放日期：">
                  {{ form.expectedIssueDate }}
                </el-form-item>
                <el-form-item label="发放类型：">
                  {{ getEnumLabel('issue_type', form.issueType) }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 跨月权益 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>跨月权益</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="原权益享受日期：">
                  {{ form.originalBenefitDate }}
                </el-form-item>
                <el-form-item label="变更后权益日期：">
                  {{ form.changedBenefitDate }}
                </el-form-item>
                <el-form-item label="OA流程编号：">
                  {{ form.oaProcessNo }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 原车车主信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>原车车主信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="原车车主姓名：">
                  {{ form.originalOwnerName }}
                </el-form-item>
                <el-form-item label="原车车主手机号：">
                  {{ form.originalOwnerPhone }}
                </el-form-item>
                <el-form-item label="原车主证件类型：">
                  {{ form.originalOwnerIdType }}
                </el-form-item>
                <el-form-item label="原车主证件号码：">
                  {{ form.originalOwnerIdNumber }}
                </el-form-item>
                <el-form-item label="原车物料码：">
                  {{ form.originalMaterialsCode }}
                </el-form-item>
                <el-form-item label="基本车型：">
                  {{ form.originalModelName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 审批信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="初审人：">
                  {{ form.firstAuditorName }}
                </el-form-item>
                <el-form-item label="初审时间：">
                  {{ form.firstAuditTime }}
                </el-form-item>
                <el-form-item label="初审意见：">
                  {{ form.firstAuditOpinion }}
                </el-form-item>
                <el-form-item label="审核人：">
                  {{ form.auditorName }}
                </el-form-item>
                <el-form-item label="审核时间：">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="审核意见：">
                  {{ form.auditOpinion }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <div style="padding: 20px;">
          <h3>申请概况</h3>
          <div style="margin-top: 10px; padding: 15px; background: #f5f7fa; border-radius: 4px;">
            <div><strong>申请单号:</strong> {{ form.code || '-' }}</div>
            <div style="margin-top: 8px;"><strong>申请状态:</strong> {{ getAuditStatusLabel(form.auditStatus) }}</div>
            <div style="margin-top: 8px;"><strong>商城订单:</strong> {{ form.mallOrderNo || '-' }}</div>
            <div style="margin-top: 8px;"><strong>权益大类:</strong> {{ form.equityCategoryName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>置换类型:</strong> {{ getEnumLabel('mcs_replacetype', form.replacementType) || '-' }}</div>
            <div style="margin-top: 8px;"><strong>优惠金额:</strong> {{ form.discountAmount || '-' }}</div>
            <div style="margin-top: 8px;"><strong>销售门店:</strong> {{ form.saleDealerName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>提交时间:</strong> {{ form.submitTime || '-' }}</div>
          </div>
        </div>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/vrEquityApply/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  creator: null,
  creatorName: '',
  createTime: '',
  modifier: null,
  modifierName: '',
  updateTime: '',
  remark: '',
  status: null,
  statusDesc: '',
  dataSource: null,
  code: '',
  ownerOrgId: null,
  mallOrderNo: '',
  vehicleOrderNo: '',
  originalVin: '',
  equityCategoryId: null,
  equityCategoryName: '',
  replacementType: null,
  discountAmount: null,
  otherBrand: '',
  submitterUserId: '',
  submitterName: '',
  submitTime: '',
  depositTime: '',
  lockTime: '',
  agentContact: '',
  buyerName: '',
  buyerUserId: '',
  buyerPhone: '',
  buyerIdType: null,
  buyerIdNumber: '',
  orderUserId: '',
  saleDealerName: '',
  saleDealerCode: '',
  cooperationType: null,
  regionName: '',
  provinceName: '',
  cityName: '',
  materialsCode: '',
  materialsDesc: '',
  seriesName: '',
  seriesId: '',
  modelName: '',
  modelId: '',
  vehicleYearType: '',
  vehicleYearTypeId: '',
  optionPackageName: '',
  optionPackageId: '',
  isIssued: null,
  expectedIssueDate: '',
  issueType: null,
  originalBenefitDate: '',
  changedBenefitDate: '',
  oaProcessNo: '',
  originalOwnerName: '',
  originalOwnerId: '',
  originalOwnerPhone: '',
  originalOwnerIdType: null,
  originalOwnerIdNumber: '',
  originalMaterialsCode: '',
  originalModelName: '',
  originalModelId: '',
  firstAuditorName: '',
  firstAuditorUserId: '',
  firstAuditTime: '',
  firstAuditOpinion: '',
  auditorName: '',
  auditorUserId: '',
  auditTime: '',
  auditOpinion: '',
  auditStatus: null
};

export default {
  name: 'vrEquityApplyEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '订单权益申请单号：' + (this.form.code || '');
    },
    canEditDraft () {
      // 草稿或驳回状态下可以作废
      return this.form.auditStatus === 10 || this.form.auditStatus === 20;
    },
    canSubmitApproval () {
      // 草稿或驳回状态下可以提交审批
      return (this.form.auditStatus === 10 || this.form.auditStatus === 20) && this.isEditing;
    },
    canFirstAudit () {
      // 已提交状态下显示初审
      return this.form.auditStatus === 30;
    },
    canAudit () {
      // 已初审状态下显示审核
      return this.form.auditStatus === 40;
    },
    canRecall () {
      // 已终审状态下可以撤回
      return this.form.auditStatus === 60;
    },
    canEditIssue () {
      // 只有已终审状态才能编辑发放信息
      return this.form.auditStatus === 60;
    }
  },
  watch: {
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
      pageTitle: '整车零售-订单管理-订单权益申请管理',
      pageType: 'edit',
      moduleKey: 'AISVR-vrEquityApply',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      yes_no_enum_map: {},
      form: { ...form },
      originalForm: { ...form },
      fileList: [],
      rules: {
        code: [
          { required: true, message: '请输入订单权益申请单号', trigger: 'change' }
        ],
        mallOrderNo: [
          { required: true, message: '请输入商城订单号', trigger: 'change' }
        ],
        vehicleOrderNo: [
          { required: true, message: '请输入整车订单编号', trigger: 'change' }
        ],
        originalVin: [
          { required: true, message: '请输入原车VIN号', trigger: 'change' }
        ],
        equityCategoryId: [
          { required: true, message: '请选择权益大类', trigger: 'change' }
        ],
        replacementType: [
          { required: true, message: '请选择置换类型', trigger: 'change' }
        ],
        discountAmount: [
          { required: true, message: '请输入优惠金额', trigger: 'change' }
        ],
        buyerName: [
          { required: true, message: '请输入购车人姓名', trigger: 'change' }
        ],
        buyerPhone: [
          { required: true, message: '请输入购车人手机号码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店', trigger: 'change' }
        ],
        materialsCode: [
          { required: true, message: '请输入订单物料码', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
    this.initEnumMaps();
  },
  methods: {
    initEnumMaps () {
      this.yes_no_enum.forEach(item => {
        this.yes_no_enum_map[item.code] = item.message;
      });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    handleViewStoreDetail () {
      // 跳转到门店详情
      // this.$router.push({ path: '/store/management/storeDetail', query: { id: xxx } });
      this.$message.info('跳转门店详情功能待实现');
    },
    handleViewVehicleDetail () {
      // 跳转到车辆档案详情
      // this.$router.push({ path: '/vehicle/archive/detail', query: { vin: this.form.originalVin } });
      this.$message.info('跳转车辆档案详情功能待实现');
    },
    handleCancel () {
      this.$confirm('确认要作废此申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用作废API
        // cancelItem({ id: this.form.id }).then(() => {
        //   this.$message.success('作废成功');
        //   this.$refs.containerRef.loadDetail();
        // });
        this.$message.success('作废成功');
      });
    },
    handleSubmitApproval () {
      this.$confirm('确认要提交审批吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用提交审批API
        // submitApproval({ id: this.form.id }).then(() => {
        //   this.$message.success('提交成功');
        //   this.$refs.containerRef.loadDetail();
        // });
        this.$message.success('提交成功');
      });
    },
    handleFirstAudit () {
      // 初审功能待实现
      this.$message.info('初审功能待实现');
    },
    handleAudit () {
      // 审核功能待实现
      this.$message.info('审核功能待实现');
    },
    handleRecall () {
      this.$confirm('撤回后将无法恢复，请确认是否撤回', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用审核撤回API
        // recallApproval({ id: this.form.id }).then(() => {
        //   this.$message.success('撤回成功');
        //   this.$refs.containerRef.loadDetail();
        // });
        this.$message.success('撤回成功');
      });
    },
    handlePreview (file) {
      console.log(file);
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    getEnumLabel (enumCode, value) {
      // 根据enumCode获取对应的枚举映射
      return value;
    },
    getAuditStatusLabel (status) {
      const statusMap = {
        10: '草稿',
        20: '驳回',
        30: '已提交',
        40: '已初审',
        60: '已终审',
        70: '作废'
      };
      return statusMap[status] || '-';
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
.page-common-edit {
  h3 {
    margin: 0 0 15px;
    font-size: 16px;
  }
}
</style>
