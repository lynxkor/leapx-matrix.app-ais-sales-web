<template>
  <el-dialog
    :visible.sync="cancelShow"
    append-to-body
    :title="cancelTitle"
    width="600px"
    @close="close"
  >
    <el-form ref="auditForm" :model="auditForm" :rules="rules" label-width="120px" size="small" style="padding: 10px 0">
      <el-form-item label="作废说明：" prop="cancelRemark">
        <el-input v-model="auditForm.cancelRemark" placeholder="请输入作废说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" size="small"> 取消 </el-button>
      <el-button type="primary" @click="auditFun" size="small"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';

export default {
  name: 'CancelDialog',
  props: {
    cancelTitle: {
      type: String,
      default: '调整作废说明'
    },
    auditDataList: {
      type: Array,
      default: () => []
    },
    field: {
      type: String,
      default: 'id'
    }
  },
  components: {
    FetchSelect
  },
  data () {
    return {
      approveSubCateShow: false,
      cancelShow: false,
      auditForm: {
        cancelRemark: '',
      },
      rules: {
        cancelRemark: [
          { required: true, message: '请输入作废说明', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
  },
  methods: {
    show () {
      this.cancelShow = true;
    },
    close () {
      this.cancelShow = false;
      this.auditForm = { cancelRemark: '' };
      this.$nextTick(() => {
        this.$refs.auditForm.clearValidate();
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
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
    },
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
