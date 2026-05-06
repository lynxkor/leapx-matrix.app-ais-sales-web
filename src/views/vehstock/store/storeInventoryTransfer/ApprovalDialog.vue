<template>
    <el-dialog class="m-start-work-dialog"  title="调拨审批" width="500px" :visible.sync="dialogVisible" @close="close">
      <el-form :model="form" inline :rules="rules" label-position="right" label-width="120px">
        <el-form-item :label="data.type === 'outApproval' ? '调出审批' : '调入审批'">
            <fetch-select :request="fetchOptions" enumCode="vehstock_audit_status" v-model="form.approval"
            placeholder="请选择" clearable filterable />
        </el-form-item>
        <el-form-item :label="data.type === 'outApproval' ? '调出意见' : '调入意见'">
          <el-input v-model="form.remark" type="textarea" maxlength="500" show-word-limit  placeholder="请输入" />
        </el-form-item>
      </el-form>

      <!-- 底部按钮 -->
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button size="small" type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
          <el-button size="small" @click="close">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </template>

<script>
import { getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { approveOut, approveIn } from '@/api/vehstock/store/storeInventoryTransfer/index';

export default {
  name: 'ApprovalDialog',
  components: {
    FetchSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dialogVisible: false,
      submitLoading: false,
      form: {
        approval: '',
        remark: '',
      },
      rules: {
        approval: [{ required: true, message: '请选择审批', trigger: 'change' }],
      }
    };
  },
  watch: {
    visible (val) {
      if (val) {
        this.dialogVisible = val;
      }
    },
  },
  methods: {
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    close () {
      this.dialogVisible = false;
      this.$emit('update:visible', false);
    },
    async handleSubmit () {
      this.submitLoading = true;
      const params = {
        id: this.data.id,
      };

      if (this.data.type === 'outApproval') {
        params.outApproval = this.form.approval;
        params.outRemark = this.form.remark;
      } else {
        params.inApproval = this.form.approval;
        params.inRemark = this.form.remark;
      }

      const api = this.data.type === 'outApproval' ? approveOut : approveIn;
      try {
        await api(params);
        this.submitLoading = false;
        this.form = {};
        this.$message({
          message: '审批成功',
          type: 'success'
        });
        this.close();
        this.$emit('submit');
      } catch (err) {
        this.submitLoading = false;
        this.form = {};
      }
    }

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
