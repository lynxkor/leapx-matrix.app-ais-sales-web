<template>
  <div>
    <el-dialog title="请输入批量配车说明" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <el-input
        v-model="statusDesc"
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
  name: 'BatchAllocateVehicleInput',
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
      statusDesc: ''
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
        this.statusDesc = '';
      }
    }
  },
  methods: {
    confirmCancel () {
      if (!this.statusDesc || this.statusDesc.trim() === '') {
        this.$message.error('配车说明不能为空');
        return;
      }
      this.$emit('confirmBatchAllocateVehicle', {
        idSet: this.cancelIds,
        statusDesc: this.statusDesc
      });
      this.dialogVisible = false;
    },
    cancel () {
      this.dialogVisible = false;
    }
  }
};
</script>
