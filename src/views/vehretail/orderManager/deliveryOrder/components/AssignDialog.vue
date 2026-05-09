<template>
  <el-dialog
    :visible.sync="visible"
    title="分派交车单"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      label-position="left"
    >
      <el-form-item label="订单交付顾问：" prop="deliveryUserId">
        <fetch-select
          stlye="height: 32px;"
          v-model="form.deliveryUserId"
          clearable
          filterable
          :options="advisorList"
          @change="checkOverDeliveryCapacity"
          value-key="userId"
          label-key="username"
        />
      </el-form-item>
    </el-form>
    <slot name="footer">
      <div slot="footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </div>
    </slot>
  </el-dialog>
</template>

<script>
import { assign, checkOverDeliveryCapacity } from '@/api/vehretail/orderManager/deliveryOrder';
import { engineerList } from '@/libs/api/common';
import FetchSelect from '@/libs/components/FetchSelect';

export default {
  name: 'AssignDialog',
  components: {
    FetchSelect
  },
  data () {
    return {
      visible: false,
      submitLoading: false,
      form: {
        deliveryUserId: '',
        deliveryUserName: '',
        retailOrderId: '',
      },
      rules: {
        deliveryUserId: [
          { required: true, message: '请选择订单交付顾问', trigger: 'change' }
        ]
      },
      advisorList: []
    };
  },
  methods: {
    checkOverDeliveryCapacity (val, row) {
      const params = {
        deliveryDealerCode: this.form.deliveryDealerCode,
        deliveryUserId: this.form.deliveryUserId
      };
      this.form.deliveryUserName = row.username;
      checkOverDeliveryCapacity(params).then(res => {
        if (res) {
          this.$message.warning('已分派订单超过人员承载数量，请增加交付工程师或调整人员承载数量');
        }
      }).catch(() => {});
    },
    /**
     * 打开弹窗
     * @param {Array} selectedRows - 选中的行数据
     */
    open (selectedRows) {
      this.form.deliveryDealerCode = selectedRows[0].deliveryDealerCode;
      this.form.retailOrderId = selectedRows[0].retailOrderId;
      this.visible = true;
      this.getAdvisorList();
    },
    /**
     * 获取交付顾问列表
     */
    async getAdvisorList () {
      try {
        const res = await engineerList({ salesConfigKey: 'saleUser', orgCodeList: [this.form.deliveryDealerCode] });
        this.advisorList = res.map(ele => {
          return {
            ...ele,
            userId: ele.userId + ''
          };
        });
      } catch (error) {
        console.error('获取交付顾问列表失败:', error);
        this.advisorList = [];
      }
    },
    /**
     * 关闭弹窗
     */
    handleClose () {
      this.visible = false;
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      this.form = {
        deliveryUserId: '',
        deliveryUserName: '',
        retailOrderId: '',
      };
    },
    /**
     * 提交
     */
    handleSubmit () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        this.submitLoading = true;
        try {
          await assign({
            retailOrderId: this.form.retailOrderId,
            deliveryUserName: this.form.deliveryUserName,
            deliveryUserId: this.form.deliveryUserId
          });
          this.$message({
            type: 'success',
            message: '分派成功'
          });
          this.handleClose();
          // 回调父组件刷新列表
          this.$emit('success');
        } catch (error) {
          console.error('分派失败:', error);
        } finally {
          this.submitLoading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  height: 32px;
}
</style>
