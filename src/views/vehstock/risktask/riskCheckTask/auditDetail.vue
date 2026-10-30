<template>
  <div class="page-common m-risk-check-audit-detail">
    <div class="ais-actions audit-detail-actions">
      <el-button
        v-if="showAuditBtn"
        size="small"
        type="primary"
        @click="openAuditDialog"
      >审核</el-button>
      <el-button size="small" @click="goBack">返回</el-button>
    </div>

    <section class="common-section">
      <div class="common-section-header">
        <h2>审核信息</h2>
      </div>
      <div class="common-section-body">
        <el-form
          :model="detail"
          size="small"
          label-position="right"
          label-width="110px"
          class="audit-detail-form"
        >
          <el-form-item label="VIN码">
            <el-input v-model="detail.vin" disabled placeholder="-" />
          </el-form-item>
          <el-form-item label="任务名称">
            <el-input v-model="detail.taskName" disabled placeholder="-" />
          </el-form-item>
          <el-form-item label="门店名称">
            <el-input v-model="detail.storeName" disabled placeholder="-" />
          </el-form-item>
          <el-form-item label="提交人">
            <el-input v-model="detail.submitUserName" disabled placeholder="-" />
          </el-form-item>
          <el-form-item label="提交时间">
            <el-input v-model="detail.submitTime" disabled placeholder="-" />
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="detail.auditUserName" disabled placeholder="-" />
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="detail.auditOpinion" disabled placeholder="-" />
          </el-form-item>
          <el-form-item label="审核时间">
            <el-input v-model="detail.auditTime" disabled placeholder="-" />
          </el-form-item>
        </el-form>
      </div>
    </section>

    <section class="common-section">
      <div class="common-section-header">
        <h2>附件信息</h2>
      </div>
      <div class="common-section-body">
        <AisAttachment
          v-if="detail.detailId"
          :businessId="detail.detailId"
          configCode="vehicle_risk_check_task_detail"
          attachType="其他"
          :readonly="true"
        />
        <span v-else class="audit-detail-empty">暂无附件</span>
      </div>
    </section>
  </div>
</template>

<script>
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import { getAuditDetail } from '@/api/vehstock/risktask/riskCheckAudit/index';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const EMPTY_DETAIL = {
  id: '',
  vin: '',
  taskName: '',
  storeName: '',
  checkStatus: '',
  checkStatusLabel: '',
  submitUserId: '',
  submitUserName: '',
  submitTime: '',
  auditUserId: '',
  auditUserName: '',
  auditTime: '',
  auditOpinion: '',
  detailId: '',
  checkResultNote: ''
};

export default {
  mixins: [permissions, commonMixins],
  components: {
    AisAttachment
  },
  data () {
    return {
      pageTitle: '排查任务审核详情',
      moduleKey: 'AISVS-riskCheckAudit',
      loading: false,
      detail: { ...EMPTY_DETAIL }
    };
  },
  computed: {
    // 🔑 G8：仅 check_status=60 审核中可审核；110 已排查 / 160 已驳回 不显示
    showAuditBtn () {
      return Number(this.detail.checkStatus) === 60 &&
        this.permissions.has(this.moduleKey + '-approve');
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
    // 打开审核弹窗（弹窗组件由 T26 提供；T25 期间为桩方法）
    // T26 联调：接入 AuditDialog 组件，审核成功后重新 getData() 刷新（60→110/160，按钮消失），不关闭页面
    openAuditDialog () {
      this.$message.info('审核弹窗将在 T26 联调后可用');
    },
    // 返回：从列表详情入口进的可回到列表；直接输 URL 进的回任务列表兜底
    goBack () {
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push({ path: '/vehstock/risktask/riskCheckTask' });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-risk-check-audit-detail {
  .audit-detail-actions {
    margin-bottom: 12px;
  }
  .audit-detail-form {
    .el-form-item {
      width: 30%;
      min-width: 280px;
      margin-right: 3%;
    }
  }
  .audit-detail-empty {
    color: #999;
  }
}
</style>
