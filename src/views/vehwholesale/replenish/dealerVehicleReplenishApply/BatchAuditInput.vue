<template>
  <div>
    <el-dialog title="整车补货申请厂端审批" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <el-input
        v-model="auditOpinion"
        type="textarea"
        :rows="3"
        placeholder="审批意见可以输入150个中文"
        maxlength="150"
        show-word-limit
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAudit">取消</el-button>
        <el-button type="primary"  @click="factoryApproval">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { factoryApproval } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApply/index';
export default {
  name: 'BatchAuditInput',
  data () {
    return {
      dialogVisible: false,
      auditOpinion: '',
      auditIds: [],
      isApprove: true
    };
  },
  methods: {
    openDialog (data) {
      this.auditIds = data.ids;
      this.auditOpinion = '';
      this.dialogVisible = true;
      this.isApprove = data.isApprove;
    },
    cancelAudit () {
      this.dialogVisible = false;
      this.auditOpinion = '';
    },
    factoryApproval () {
      if (this.isApprove === false && !this.auditOpinion) {
        this.$message({
          type: 'error',
          message: '驳回时审批意见不能为空'
        });
        return;
      }
      return factoryApproval({
        ids: this.auditIds,
        isAudit: this.isApprove,
        auditOpinion: this.auditOpinion
      }).then(() => {
        this.$message({
          type: 'success',
          message: '成功'
        });
        this.getData();
      }).finally(() => {
        this.dialogVisible = false;
        this.auditOpinion = '';
      });
    },
  }
};
</script>
