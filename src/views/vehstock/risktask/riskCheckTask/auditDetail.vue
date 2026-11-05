<template>
  <div class="page-common-detail m-risk-check-audit-detail" v-loading="loading">
    <!-- 标题区：状态标签 + 右上角「审核」按钮（对齐 edit 页 header 形态） -->
    <section class="common-title">
      <h2>
        排查任务审核
        <span
          v-if="detail.checkStatusLabel"
          :class="['detail-status', statusClass]"
        >{{ detail.checkStatusLabel }}</span>
      </h2>
      <el-button
        v-if="showAuditBtn"
        size="small"
        type="primary"
        @click="openAuditDialog"
      >审核</el-button>
    </section>

    <!-- 审核信息：label 左 / 值右纯文本，三列流式（对齐 edit 页详情模式与
         warehouseVehicleRelation/detail 标准形态，.page-common-detail 提供三列布局） -->
    <section class="common-section">
      <div class="common-section-header">
        <h2>审核信息</h2>
      </div>
      <div class="common-section-body">
        <el-form :inline="true">
          <el-form-item label="任务编码：">{{ detail.checkTaskCode || '-' }}</el-form-item>
          <el-form-item label="任务名称：">{{ detail.taskName || '-' }}</el-form-item>
          <el-form-item label="VIN：">{{ detail.vin || '-' }}</el-form-item>
          <el-form-item label="门店名称：">{{ detail.storeName || '-' }}</el-form-item>
          <el-form-item label="提交人：">{{ detail.submitUserName || '-' }}</el-form-item>
          <el-form-item label="提交时间：">{{ detail.submitTime || '-' }}</el-form-item>
          <el-form-item label="审核人：">{{ detail.auditUserName || '-' }}</el-form-item>
          <el-form-item label="审核时间：">{{ detail.auditTime || '-' }}</el-form-item>
          <el-form-item label="审核说明：" class="form-item-full">{{ detail.auditOpinion || '-' }}</el-form-item>
        </el-form>
      </div>
    </section>

    <!-- 车辆信息：来自明细表扩展字段（明细查不到时显示 -） -->
    <section class="common-section">
      <div class="common-section-header">
        <h2>车辆信息</h2>
      </div>
      <div class="common-section-body">
        <el-form :inline="true">
          <el-form-item label="车辆类型：">{{ detail.vehicleTypeLabel || '-' }}</el-form-item>
          <el-form-item label="车型名称：">{{ detail.modelName || '-' }}</el-form-item>
          <el-form-item label="年款：">{{ detail.yearTypeName || '-' }}</el-form-item>
          <el-form-item label="外观名称：">{{ detail.exteriorName || '-' }}</el-form-item>
          <el-form-item label="内饰名称：">{{ detail.interiorName || '-' }}</el-form-item>
        </el-form>
      </div>
    </section>

    <!-- 排查结果：任务下发的排查方法 + 门店提交的排查说明 -->
    <section class="common-section">
      <div class="common-section-header">
        <h2>排查结果</h2>
      </div>
      <div class="common-section-body">
        <el-form :inline="true">
          <el-form-item label="排查方法：" class="form-item-full">{{ detail.checkMethod || '-' }}</el-form-item>
          <el-form-item label="排查说明：" class="form-item-full">{{ detail.checkResultNote || '-' }}</el-form-item>
        </el-form>
      </div>
    </section>

    <!-- 排查附件：门店提交的排查结果附件，独立成区（对齐 edit.vue「排查方法附件」section 范式） -->
    <section class="common-section">
      <div class="common-section-header">
        <h2>排查附件</h2>
      </div>
      <div class="common-section-body">
        <!-- 🔑 businessId = 排查明细ID（Resp.detailId），附件按明细维度查询
             🔑 attachType 与门店 H5 落库一致：单一常量 RISK_CHECK_ATTACH_CODE = 'vehicle_risk_task'
                （H5 configCode 与 attachType 同值，见 pdi-h5/riskCheck/VehicleDetailView.vue:180）
             🔑 本页只读回显，不传 configCode：组件跳过 getByCode，
                只按 businessId + attachType 调 attachment/list 加载文件 -->
        <AisAttachment
          v-if="detail.detailId"
          :businessId="detail.detailId"
          attachType="vehicle_risk_task"
          :readonly="true"
          emptyText="暂无附件"
        />
        <span v-else class="audit-detail-empty">暂无附件</span>
      </div>
    </section>

    <!-- 审核弹窗：审核说明始终展示、非必填；不通过时必填（G11）、≤200 字（G12） -->
    <el-dialog
      :title="auditDialogTitle"
      :visible.sync="auditDialogVisible"
      width="520px"
      append-to-body
    >
      <el-form :model="auditForm" label-width="90px" size="small">
        <el-form-item label="审核结果">
          <el-radio-group v-model="auditForm.pass">
            <el-radio :label="true">通过</el-radio>
            <el-radio :label="false">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核说明">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="200"
            show-word-limit
            v-model="auditForm.auditOpinion"
            placeholder="非必填，最多200字"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="auditDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="auditSubmitting" @click="submitAudit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import { getAuditDetail, approve } from '@/api/vehstock/risktask/riskCheckAudit/index';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const EMPTY_DETAIL = {
  id: '',
  auditRecordCode: '',
  checkTaskId: '',
  checkTaskCode: '',
  taskName: '',
  vin: '',
  storeName: '',
  storeCode: '',
  checkStatus: '',
  checkStatusLabel: '',
  // 按钮控制（后端 get 接口下发）：approveButton=true 仅当 checkStatus=审核中(60)
  buttonControl: null,
  submitUserId: '',
  submitUserName: '',
  submitTime: '',
  auditUserId: '',
  auditUserName: '',
  auditTime: '',
  auditOpinion: '',
  detailId: '',
  checkResultNote: '',
  // 车辆信息扩展（明细表，明细查不到时为 null）
  vehicleType: '',
  vehicleTypeLabel: '',
  modelName: '',
  yearTypeName: '',
  exteriorName: '',
  interiorName: '',
  // 主任务扩展
  checkMethod: ''
};

export default {
  mixins: [permissions, commonMixins],
  components: {
    AisAttachment
  },
  data () {
    return {
      pageTitle: '排查任务审核',
      pageType: 'detail',
      moduleKey: 'AISVS-riskCheckAudit',
      loading: false,
      detail: { ...EMPTY_DETAIL },
      // 审核弹窗
      auditDialogVisible: false,
      auditSubmitting: false,
      auditForm: {
        auditRecordId: '',
        pass: true,
        auditOpinion: ''
      }
    };
  },
  computed: {
    // 🔑 后端按审核记录状态算出的按钮可见性（get 接口填充）；缺省 {} 避免空指针（对齐 edit.vue buttonControl 先例）
    buttonControl () {
      return (this.detail && this.detail.buttonControl) || {};
    },
    // 🔑 G8：可见 = 有权限 AND 后端允许（后端 canApprove 同源：仅 checkStatus=审核中(60) 才 true）；
    //    110 已排查 / 160 已驳回 后端返回 false，按钮不渲染。前端不再重判状态，杜绝规则漂移
    showAuditBtn () {
      return !!this.buttonControl.approveButton &&
        this.permissions.has(this.moduleKey + '-approve');
    },
    // 标题旁状态标签配色：60 审核中→warning / 110 已排查→success / 160 已驳回→danger
    statusClass () {
      const map = { 60: 'warning', 110: 'success', 160: 'danger' };
      return map[Number(this.detail.checkStatus)] || 'success';
    },
    auditDialogTitle () {
      return this.auditForm.pass ? '审核通过' : '审核不通过';
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['风险车辆排查', '排查任务审核']);
    this.getData();
  },
  methods: {
    getData () {
      const id = this.$route.query.id;
      if (!id) {
        this.$message.error('缺少审核记录ID');
        return;
      }
      this.loading = true;
      getAuditDetail({ id })
        .then(res => {
          this.detail = { ...EMPTY_DETAIL, ...(res || {}) };
        })
        .catch(err => {
          console.error('排查任务审核详情查询失败:', err);
          this.$message.error('查询失败');
          this.detail = { ...EMPTY_DETAIL };
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 打开审核弹窗（逻辑对齐 audit.vue 的审核列表页）
    openAuditDialog () {
      this.auditForm = {
        auditRecordId: this.detail.id,
        pass: true,
        auditOpinion: ''
      };
      this.auditDialogVisible = true;
    },
    // 提交审核
    submitAudit () {
      // 🔑 G11：不通过时审核说明必填
      if (!this.auditForm.pass && !this.auditForm.auditOpinion) {
        this.$message({ type: 'warning', message: '请填写审核说明' });
        return;
      }
      // 🔑 G12：审核说明 ≤200 字
      if (this.auditForm.auditOpinion && this.auditForm.auditOpinion.length > 200) {
        this.$message({ type: 'warning', message: '审核说明不能超过200字' });
        return;
      }
      this.auditSubmitting = true;
      approve({ ...this.auditForm }).then(() => {
        this.$message({ type: 'success', message: '审核成功!' });
        this.auditDialogVisible = false;
        // 🔑 审核后刷新：60 → 110/160，审核按钮消失，审核人/审核时间/审核说明回填
        this.getData();
      }).catch(() => {}).finally(() => {
        this.auditSubmitting = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-risk-check-audit-detail {
  // 标题旁排查状态标签（对齐 EditBaseHeader 的 .status 配色）
  .detail-status {
    display: inline-block;
    padding: 2px 10px;
    line-height: 20px;
    font-size: 12px;
    margin-left: 6px;
    border-radius: 4px;
    vertical-align: middle;

    &.warning {
      color: var(--leap-color-warning);
      background: #FAF6EA;
    }
    &.success {
      color: var(--leap-color-primary);
      background: #E6F4E6;
    }
    &.danger {
      color: var(--leap-color-danger);
      background: #F8E8E8;
    }
  }

  // 长文本字段（审核说明/排查方法/排查说明）独占一行，
  // .page-common-detail 已提供 form-item-full{width:100%} 布局；
  // 🔑 content 是 el-form-item 内部节点，scoped 需 ::v-deep 才能命中
  ::v-deep .el-form-item.form-item-full .el-form-item__content {
    white-space: pre-wrap;
    word-break: break-all;
  }

  .audit-detail-empty {
    color: var(--leap-color-default-light-1);
    font-size: 14px;
    line-height: 32px;
  }
}
</style>
