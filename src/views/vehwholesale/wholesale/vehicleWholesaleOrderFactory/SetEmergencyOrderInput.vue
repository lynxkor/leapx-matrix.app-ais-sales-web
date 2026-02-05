<template>
  <div>
    <el-dialog title="请输入急单备注" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <el-input
        v-model="emergencyOrderRemark"
        type="textarea"
        :rows="3"
        placeholder="输入内容"
      />
      <div slot="footer" class="dialog-footer">
        <el-button  @click="cancel()">取消</el-button>
        <el-button type="primary" @click="confirmEmergency(false)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SetEmergencyOrderInput',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    emergencyIds: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      emergencyOrderRemark: ''
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
        this.emergencyOrderRemark = '';
      }
    }
  },
  methods: {
    confirmEmergency () {
      if (!this.emergencyOrderRemark || this.emergencyOrderRemark.trim() === '') {
        this.$message.error('急单备注不能为空');
        return;
      }
      this.$emit('confirm', {
        emergencyOrder: 1,
        ids: this.emergencyIds,
        emergencyOrderRemark: this.emergencyOrderRemark
      });
      this.dialogVisible = false;
    },
    cancel () {
      this.dialogVisible = false;
    }
  }
};
</script>
