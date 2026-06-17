<template>
  <el-dialog title="批量车辆类型转换" width="50%" :visible.sync="dialogVisible" @close="close">
    <el-form label-width="120px" size="small">
      <el-form-item label="申请类型" required>
        <el-select v-model="applicationType" placeholder="请选择" clearable filterable>
          <el-option label="商品车申请转展车" :value="1" />
          <el-option label="展车申请转商品车" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注说明">
        <el-input v-model="remark" type="textarea" :rows="3" maxlength="500" placeholder="请输入备注说明" show-word-limit clearable />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" :loading="submitLoading" type="primary" @click="submit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { batchConvertType } from '@/api/vehstock/store/storeInventoryLedger/index';

export default {
  name: 'ConvertTypeDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectionId: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      applicationType: '',
      remark: ''
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    }
  },
  methods: {
    close () {
      this.applicationType = '';
      this.remark = '';
      this.$emit('close');
    },
    async submit () {
      if (!this.applicationType) {
        this.$message.warning('请选择申请类型');
        return;
      }
      this.submitLoading = true;
      try {
        await batchConvertType({
          ids: this.selectionId,
          applicationType: this.applicationType,
          remark: this.remark
        });
        this.$message.success('批量车辆类型转换成功');
        this.close();
        this.$emit('submit');
      } catch (error) {
        console.error('批量车辆类型转换失败:', error);
      } finally {
        this.submitLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
