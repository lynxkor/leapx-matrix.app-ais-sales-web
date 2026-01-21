<template>
  <div>
    <el-dialog
      title="整车库存补货申请记录审核"
      :visible.sync="dialogVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="auditForm"
        :model="form"
        :rules="rules"
        label-width="0"
        @submit.native.prevent
      >
        <div class="form-description">提供以下有关此整车库存补货申请记录审核意见</div>
        <!-- 审核结果选择 -->
        <el-form-item prop="isApprove">
          <el-select
            v-model="form.isApprove"
            placeholder="请选择审核结果"
            style="width: 100%; margin: 10px 0;"
          >
            <el-option label="通过" :value="true"></el-option>
            <el-option label="驳回" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <!-- 审核意见输入 -->
        <el-form-item prop="auditOpinion">
          <el-input
            v-model="form.auditOpinion"
            type="textarea"
            :rows="3"
            placeholder="审批意见可以输入150个中文"
            maxlength="150"
            show-word-limit
          />
        </el-form-item>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelHandel">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BatchAuditInput',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    auditIds: {
      type: Array,
      default: () => []
    },
    auditType: {
      type: String,
      default: '' // 'dealer' | 'factory'
    }
  },
  data () {
    // 自定义验证规则：驳回时必须填写意见
    const validateOpinion = (rule, value, callback) => {
      // 如果选择了驳回，意见必填
      if (this.form.isApprove === false) {
        if (!value || value.trim().length === 0) {
          callback(new Error('驳回时必须填写审批意见'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    return {
      form: {
        auditOpinion: '',
        isApprove: null
      },
      rules: {
        isApprove: [
          { required: true, message: '请选择审核结果', trigger: 'blur' }
        ],
        auditOpinion: [
          { validator: validateOpinion, trigger: 'blur' }
        ]
      }
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
        this.resetForm();
      }
    },
    // 监听审核结果变化，当选择变化时重新验证意见
    'form.isApprove' (newVal) {
      if (this.$refs.auditForm) {
        // 清除之前的验证错误
        this.$refs.auditForm.clearValidate(['auditOpinion']);
        // 如果从驳回变为通过，清除意见的错误状态
        if (newVal === true) {
          this.$refs.auditForm.clearValidate('auditOpinion');
        }
        // 如果选择了驳回，立即验证意见
        if (newVal === false && this.form.auditOpinion) {
          this.$refs.auditForm.validateField('auditOpinion');
        }
      }
    }
  },
  methods: {
    // 确认审核
    handleConfirm () {
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交数据
          this.$emit('confirm', {
            auditType: this.auditType,
            ids: this.auditIds,
            isAudit: this.form.isApprove,
            auditOpinion: this.form.auditOpinion
          });
          this.dialogVisible = false;
        } else {
          // 验证失败
          return false;
        }
      });
    },
    // 取消操作
    cancelHandel () {
      this.dialogVisible = false;
      this.resetForm();
    },
    // 重置表单
    resetForm () {
      this.form = {
        auditOpinion: '',
        isApprove: null
      };
      // 清除验证状态
      if (this.$refs.auditForm) {
        this.$nextTick(() => {
          this.$refs.auditForm.clearValidate();
        });
      }
    }
  }
};
</script>
<style scoped>
.form-description {
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.dialog-footer {
  text-align: right;
}

/* 可以添加一些自定义样式 */
.el-form-item {
  margin-bottom: 18px;
}
</style>
