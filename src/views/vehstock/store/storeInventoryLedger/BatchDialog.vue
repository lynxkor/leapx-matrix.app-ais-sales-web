<template>
    <el-dialog class="m-start-work-dialog" :title="titleName" width="50%" :visible.sync="dialogVisible" @close="close">
        <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item prop="desc">
                <el-input v-model="form.desc" type="textarea" :rows="5" maxlength="500" placeholder="请输入" show-word-limit
                    clearable />
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" :loading="submitLoading" type="primary" @click="submit">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { batchReserve, batchCancelReserve, outbound } from '@/api/vehstock/store/storeInventoryLedger/index';
export default {
  name: 'batchDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    selectionId: {
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  data () {
    return {
      dialogVisible: this.visible,
      selectedRows: [],
      titleName: '请输入批量预留的说明', // 弹窗标题
      submitLoading: false,
      form: {
        desc: '' // 说明
      },
      rules: {
        desc: []
      }
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    name (val) {
      if (val === 'reserve') {
        this.titleName = '请输入批量预留的说明';
        this.rules.desc = [
          { required: true, message: '请输入说明', trigger: 'blur' }
        ];
      } else if (val === 'cancelReserve') {
        this.titleName = '请输入取消解除预留的说明';
        this.rules.desc = [];
      } else if (val === 'car') {
        this.titleName = '请输入运损车出库的说明';
        this.rules.desc = [];
      }
    },
  },
  methods: {
    close () {
      this.form.desc = '';
      this.$refs.formRef && this.$refs.formRef.resetFields();
      this.$emit('close');
    },
    async submit (row) {
      // 仅批量预留（reserve）需要校验
      if (this.name === 'reserve') {
        const valid = await this.$refs.formRef.validate().catch(() => false);
        if (!valid) return;
      }
      // 定义映射关系
      const apiMap = {
        reserve: { fn: batchReserve, descKey: 'reserveDesc' },
        cancelReserve: { fn: batchCancelReserve, descKey: 'cancelReserveDesc' },
        car: { fn: outbound, descKey: 'remark' },
      };
      // 获取当前配置（默认使用 reserve）
      const config = apiMap[this.name] || apiMap.reserve;
      // 构建参数
      const params = {
        ids: this.selectionId,
        [config.descKey]: this.form.desc
      };

      try {
        await config.fn(params);
        this.form.desc = '';
        this.$emit('submit');
      } catch (error) {
        console.error('批量操作失败:', error);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.m-start-work-dialog {

    ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
    ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis>.vxe-cell,
    ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
        padding: 8px 12px !important;
    }

    .start-work-content {
        .time-section {
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e8e8e8;

            .el-form {
                .el-form-item {
                    margin-bottom: 0;
                }
            }
        }

        .table-section {
            margin-top: 15px;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}

.action-button {
    margin: 0 5px;
    cursor: pointer;

    &.btn-edit {
        color: #4C4CD6;
    }
}
</style>
