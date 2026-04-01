<template>
  <div>
    <el-dialog
      title="设置定时任务开关"
      :visible.sync="dialogVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-switch
        v-model="localStatus"
        active-color="#13ce66"
        inactive-color="#cccccc"
        active-text="开启"
        inactive-text="关闭"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
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
    status: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      localStatus: false
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
    // 监听父组件传递的 status 变化
    status: {
      handler (val) {
        this.localStatus = val;
      },
      immediate: true
    }
  },
  methods: {
    confirm () {
      this.$emit('confirmSwitchFlag', {
        status: this.localStatus ? 1 : 0
      });
      this.dialogVisible = false;
    },
    cancel () {
      // 重置为父组件传递的状态
      this.localStatus = this.status;
      this.dialogVisible = false;
    }
  }
};
</script>
