<template>
  <div>
    <el-dialog title="取消配车" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
        <el-form ref="SelectformRef" :model="Selectform"  >
      <el-form-item label="取消配车类型：" prop="passOrReject">
         <el-select v-model="Selectform.passOrReject" placeholder="请选择" clearable style="width: 100%">
            <el-option label="通过" value='1'/>
            <el-option label="驳回" value='0' />
         </el-select>
      </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="cancel()">取消</el-button>
        <el-button type="primary" @click="confirmCancel(false)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BatchCancelSettleInput',
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
      statusDesc: '',
      Selectform: {
        passOrReject: '',
      },
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
      this.$emit('batchCancelSettle', {
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
