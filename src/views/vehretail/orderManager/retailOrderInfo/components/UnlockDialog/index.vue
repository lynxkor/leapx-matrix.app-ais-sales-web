<template>
  <el-dialog
    class="m-confirmdoc-dialog"
    title="取消锁车"
    width="600px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <el-form size="small" ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
      <el-row>
        <el-col :span="22">
          <el-form-item label="" prop="signChannel">
            <el-select ></el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" :loading="submitLoading" type="primary" @click="submit()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>

import { unlockReasonList } from '@/api/vehretail/orderManager/retailOrderInfo/index';
const defaultForm = {
  retailOrderId: '',
  retailOrderCode: '',
  unlockReasonCode: '',
  unlockReason: '',
  materialsCode: '',
  materialsDesc: '',
  orderHandleType: null,
  bindVin: '',
  remark: '',
  orderUnlockFileReqList: []
};

export default {
  name: 'UnlockDialog',
  props: {
    serviceProxyId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: { ...defaultForm },
      rules: {
        signChannel: [
          { required: true, message: '请选择签字渠道', trigger: 'change' }
        ]
      },
      submitLoading: false,
      formLabelWidth: '0',
      unlockReasonOptions: []
    };
  },
  methods: {
    unlockReasonList () {
      unlockReasonList().then(res => {
        console.log('签字渠道:', res);
        this.unlockReasonOptions = res;
      }).catch(() => {
      });
    },
    close () {
      this.dialogVisible = false;
    },
    closed () {
      this.$refs.form.resetFields();
    },
    show () {
      this.dialogVisible = true;
      this.unlockReasonList();
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          // const params = {
          //   serviceProxyId: this.serviceProxyId,
          //   signChannel: this.form.signChannel
          // };
          // confirmToSign(params).then(res => {
          //   this.$message.success('操作成功');
          //   this.$emit('refresh');
          // }).finally(() => {
          //   this.submitLoading = false;
          // });
        }
      });
    }

  }
};
</script>
<style lang="scss" scoped>
  .m-confirmdoc-dialog{
    ::v-deep .el-radio-group{
      display: flex;
      flex-direction: column;
      .el-radio{
        margin: 8px 0;
      }
    }
  }
</style>
