<template>
  <el-dialog title="新增排查车辆" width="50%" :visible.sync="dialogVisible" @close="close">
    <el-form label-width="120px" size="small">
      <el-form-item label="排查任务" required>
        <el-input :value="taskCode" disabled placeholder="系统自动带出" />
      </el-form-item>
      <el-form-item label="车辆VIN码" required>
        <el-input
          v-model="vinText"
          type="textarea"
          :rows="8"
          placeholder="请输入车辆VIN码，支持换行/逗号/空格分隔，单次最多200辆"
          clearable
        />
        <div class="vin-tip">已识别 {{ vinList.length }} 辆（上限 200 辆）</div>
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
import { addVehicle } from '@/api/vehstock/risktask/riskCheckTask/index';

export default {
  name: 'AddVehicleDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 当前选中的任务行
    task: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      vinText: ''
    };
  },
  computed: {
    taskCode () {
      return this.task.checkTaskCode || '';
    },
    // VIN 归一化：去空白 + 转大写 + 去重
    vinList () {
      return Array.from(new Set(
        this.vinText
          .split(/[\s,，;；\n\r\t]+/)
          .map(item => item.trim().toUpperCase())
          .filter(item => item !== '')
      ));
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    }
  },
  methods: {
    close () {
      this.vinText = '';
      this.$emit('close');
    },
    async submit () {
      if (this.vinList.length === 0) {
        this.$message.warning('请输入车辆VIN码');
        return;
      }
      if (this.vinList.length > 200) {
        this.$message.warning('单次最多新增200辆车');
        return;
      }
      this.submitLoading = true;
      try {
        const res = await addVehicle({
          checkTaskId: this.task.id,
          vinList: this.vinList
        });
        this.$message.success(`新增成功，共${res || this.vinList.length}辆车!`);
        this.close();
        this.$emit('submit');
      } catch (error) {
        console.error('新增排查车辆失败:', error);
      } finally {
        this.submitLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.vin-tip {
  color: #909399;
  font-size: 12px;
  line-height: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
