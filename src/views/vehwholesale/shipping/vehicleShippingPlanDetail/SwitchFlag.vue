<template>
  <div>
    <el-dialog title="设置定时任务开关" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <el-switch
          v-model="status"
          active-color="#13ce66"
          inactive-text="任务状态"
          inactive-color="#cccccc">
        </el-switch>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm(false)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SwitchFlag',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cancelIds: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      status: false
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
        this.status = false;
      }
    }
  },
  methods: {
    confirm () {
      this.$emit('confirmSwitchFlag', {
        status: this.status ? 1 : 0
      });
      this.dialogVisible = false;
    },
    cancel () {
      this.dialogVisible = false;
    }
  }
};
</script>
