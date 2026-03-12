<template>
  <div>
    <el-dialog title="请输入作废声明" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <el-input
        v-model="cancelRemark"
        type="textarea"
        :rows="3"
        placeholder="输入内容"
      />
      <div slot="footer" class="dialog-footer">
        <el-button  @click="cancel()">取消</el-button>
        <el-button type="primary" @click="confirmCancel(false)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BatchCancelInput',
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
      cancelRemark: ''
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
        this.cancelRemark = '';
      }
    }
  },
  methods: {
    confirmCancel () {
      if (!this.cancelRemark || this.cancelRemark.trim() === '') {
        this.$message.error('作废声明不能为空');
        return;
      }
      this.$emit('confirm', {
        ids: this.cancelIds,
        cancelRemark: this.cancelRemark
      });
      this.dialogVisible = false;
    },
    cancel () {
      this.dialogVisible = false;
    }
  }
};
</script>
