<template>
  <el-dialog
    :visible.sync="auditShow"
    append-to-body
    title="允许零售锁单"
    width="560px"
    @close="close"
  >
    <el-form ref="auditForm" :model="auditForm" :rules="rules" label-width="120px" size="small" style="padding: 10px 0">
      <el-form-item
        v-if="auditDataList && auditDataList.length > 0"
        :label="auditDataList && auditDataList.length > 1 ? '允许零售锁单' : '允许零售锁单'"
        prop="auditor"
      >
        <el-tooltip
          :display="auditDataList && auditDataList.length > 0"
          :content="tooltipContent"
          placement="top"
        >
          <span>{{ displayAuditData }}</span>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        label="允许零售锁单"
        prop="result"
      >
        <el-radio-group v-model="auditForm.result">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" size="small"> 取消 </el-button>
      <el-button type="primary" @click="auditFun" size="small"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AuditDialog',
  props: {
    auditDataList: {
      type: Array,
      default: () => []
    },
    field: {
      type: String,
      default: 'id'
    },
    maxlength: {
      type: Number,
      default: 500
    }
  },
  data () {
    return {
      auditShow: false,
      auditForm: {
        result: '',
        remark: ''
      },
      rules: {
        result: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    displayAuditData () {
      if (!this.auditDataList || this.auditDataList.length === 0) {
        return '';
      }
      // 如果只有一条数据，直接显示该字段值
      if (this.auditDataList.length === 1) {
        return this.auditDataList[0][this.field] || '';
      }
      // 如果有多条数据，显示数量
      return `共 ${this.auditDataList.length} 条数据`;
    },
    tooltipContent () {
      if (!this.auditDataList || this.auditDataList.length === 0) {
        return '';
      }
      return this.auditDataList
        .map(item => item[this.field] || '')
        .filter(value => value)
        .join(', ');
    }
  },
  methods: {
    show () {
      this.auditShow = true;
    },
    close () {
      this.auditShow = false;
      this.auditForm = { result: '', remark: '' };
      this.$nextTick(() => {
        this.$refs.auditForm.clearValidate();
      });
    },
    /**
     * 审核操作
     */
    auditFun () {
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          // 将审核数据列表也传递给父组件
          this.$emit('audit', { ...this.auditForm, auditDataList: this.auditDataList });
          this.close();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog .el-dialog__body {
  padding: 0 20px !important;
}
::v-deep .el-form-item {
  margin-bottom: 10px;
}
</style>
