<template>
  <div>
    <el-dialog title="手动指定VIN配车" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <el-input
        v-model="vin"
        placeholder="输入VIN码"
      />
      <div slot="footer" class="dialog-footer">
        <el-button  @click="cancel()">取消</el-button>
        <el-button type="primary" @click="confirm(false)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ManualVehicle',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      vin: ''
    };
  },
  computed: {
    dialogVisible: {
      get () {
        console.log('visible', this.visible);
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
        this.vin = '';
      }
    }
  },
  methods: {
    confirm () {
      if (!this.vin || this.vin.trim() === '') {
        this.$message.error('VIN码不能为空');
        return;
      }
      this.dialogVisible = false;
    },
    cancel () {
      this.dialogVisible = false;
    }
  }
};
</script>
