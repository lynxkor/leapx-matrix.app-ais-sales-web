<!-- 期限信息展示区块（独立组件，替代 generic-detail-display） -->
<template>
  <section :id="id" class="common-section term-info-section">
    <div class="common-section-header">
      <h2>期限信息</h2>
    </div>
    <div class="common-section-body">
      <el-form :inline="true" class="form-detail">
        <el-form-item label="触发交付通知时间：">
          <span>{{ formData.deliveryNoticeTime || '' }}</span>
        </el-form-item>
        <el-form-item label="是否延期交付：">
          <span>{{ formData.deliveryDelayFlagLabel || '' }}</span>
        </el-form-item>
        <el-form-item label="是否做过交车撤回：">
          <span>{{ formData.deliveryWithdrawFlagLabel || '' }}</span>
        </el-form-item>
        <el-form-item label="状态是否回退过：">
          <span>{{ formData.statusRollbackFlagLabel || '' }}</span>
        </el-form-item>
        <el-form-item label="权益享受日期：">
          <span>{{ rightsEnjoyDateText }}</span>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TermInfoSection',
  props: {
    id: {
      type: String,
      default: 'term'
    },
    formData: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  computed: {
    /**
     * 权益享受日期：仅展示年月日（YYYY-MM-DD）
     * 后端可能返回 '2026-08-05 23:22:01' / '2026-08-05' / null / ''，统一截取前 10 位
     * 空值、null、非字符串统一显示占位符 '—'
     */
    rightsEnjoyDateText () {
      const raw = this.formData && this.formData.rightsEnjoyDate;
      if (raw === null || raw === undefined) return '';
      const text = String(raw).trim();
      if (!text) return '';
      // 仅取前 10 位日期部分（如 '2026-08-05'），丢弃时分秒
      return text.length >= 10 ? text.slice(0, 10) : text;
    }
  }
};
</script>

<style scoped lang="scss">
.term-info-section {
  margin-bottom: 20px;
  scroll-margin-top: 20px;
}
</style>
