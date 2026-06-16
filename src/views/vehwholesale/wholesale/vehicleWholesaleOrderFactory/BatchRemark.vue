<template>
  <div>
    <el-dialog title="请输入批量编辑备注内容" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <el-input
        v-model="remark"
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
  name: 'BatchRemark',
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
      remark: ''
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
        this.remark = '';
      }
    }
  },
  methods: {
    confirmCancel () {
      if (!this.remark || this.remark.trim() === '') {
        this.$message.error('备注不能为空');
        return;
      }
      this.$emit('confirmBatchRemark', {
        idSet: this.cancelIds,
        remark: this.remark
      });
      this.dialogVisible = false;
    },
    cancel () {
      this.dialogVisible = false;
    }
  }
};
</script>
