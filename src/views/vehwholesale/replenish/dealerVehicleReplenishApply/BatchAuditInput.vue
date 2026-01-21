<template>
  <div>
    <el-dialog title="整车销售模式配置审批" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <el-input
        v-model="auditOpinion"
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
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
  name: 'BatchAuditInput',
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
