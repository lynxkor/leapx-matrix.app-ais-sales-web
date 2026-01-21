<template>
  <div>
    <el-dialog title="整车补货申请厂端审批" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <el-input
        v-model="auditOpinion"
        type="textarea"
        :rows="3"
        placeholder="审批意见可以输入150个中文"
        maxlength="150"
        show-word-limit
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmAudit(false)">确认</el-button>
        <el-button type="primary" @click="cancelAudit()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AuditInput',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    auditIds: {
      type: Array,
      default: () => []
    },
    isApprove: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      auditOpinion: ''
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible;
      },
      set (val) {
        this.$emit('update:visible', val);
      }
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.auditOpinion = '';
      }
    }
  },
  methods: {
    confirmAudit () {
      // 触发审核确认事件，传递审核结果和意见
      if (this.isApprove === false) {
        if (!this.auditOpinion || this.auditOpinion.trim() === '') {
          this.$message.error('驳回时审批意见不能为空');
          return;
        }
      }
      this.$emit('confirm', {
        isAudit: this.isApprove,
        ids: this.auditIds,
        auditOpinion: this.auditOpinion
      });
      this.dialogVisible = false;
    },
    cancelAudit () {
      this.dialogVisible = false;
    }
  }
};
</script>
