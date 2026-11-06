<template>
  <el-dialog
    :visible.sync="visible"
    title="新增收款记录"
    width="1400px"
    :close-on-click-modal="false"
    class="payment-record-dialog"
  >
    <div class="dialog-content" v-loading="loading">
      <el-table :data="tableData" border>
          <el-table-column label="收款类型" width="180">
            <template slot-scope="{ row }">
              <span>{{ row.payCategoryLabel }}</span>
            </template>
          </el-table-column>
          <el-table-column label="付款金额" width="180">
            <template slot-scope="{ row }">
              <el-input-number
                v-model="row.paymentAmount"
                placeholder="请输入"
                :precision="2"
                :step="0.01"
                :min="0"
                :controls="false"
                style="width: 100%;"
              />
            </template>
          </el-table-column>
          <el-table-column label="付款时间" width="210">
            <template slot-scope="{ row }">
              <el-date-picker
                v-model="row.paymentTime"
                type="datetime"
                placeholder="请选择"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 180px;"
              />
            </template>
          </el-table-column>
          <el-table-column label="支付方式" width="190">
            <template slot-scope="{ row }">
              <fetch-select
                :request="fetchOptions"
                enumCode="vr_payment_type"
                v-model="row.paymentType"
                placeholder="请选择"
                clearable
                filterable
              />
            </template>
          </el-table-column>
          <el-table-column label="支付人" width="180">
            <template slot-scope="{ row }">
              <el-input
                v-model="row.payerName"
                placeholder="请输入"
                clearable
              />
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="200">
            <template slot-scope="{ row }">
              <el-input
                v-model="row.remark"
                placeholder="请输入"
                clearable
              />
            </template>
          </el-table-column>
        </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addPayRecord } from '@/api/vehretail/orderManager/deliveryOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';

export default {
  name: 'PaymentRecordDialog',
  components: {
    FetchSelect
  },
  props: {
    // 订单 ID
    orderId: {
      type: [String, Number],
      default: ''
    },
    deliveryOrderId: {
      type: [String, Number],
      default: ''
    },
    // 金融方案
    financePlan: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      loading: false,
      submitLoading: false,
      tableData: []
    };
  },
  methods: {
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 打开对话框
    open () {
      this.visible = true;
      this.$nextTick(() => {
        this.initTableData();
      });
    },
    // 关闭对话框
    close () {
      this.visible = false;
      this.tableData = [];
    },
    // 初始化表格数据
    initTableData () {
      // 收款类型： 0-贷款;1-定金;2-尾款;3-权益抵扣;4-贷款首付款;5-定金权益;6-门店优惠;7-机动车发票其他费用;8-意向金
      // 全款购车：仅展示尾款、机动车发票其他费用、门店优惠
      // 分期购车：展示贷款首付款、贷款、机动车发票其他费用、门店优惠
      const isFullPayment = this.financePlan === '1010' || this.financePlan === 1010;

      if (isFullPayment) {
        this.tableData = [
          { payCategory: 2, payCategoryLabel: '尾款', paymentAmount: '', paymentTime: '', paymentType: '', payerName: '', remark: '' },
          { payCategory: 7, payCategoryLabel: '机动车发票其他费用', paymentAmount: '', paymentTime: '', paymentType: '', payerName: '', remark: '' },
          { payCategory: 6, payCategoryLabel: '门店优惠', paymentAmount: '', paymentTime: '', paymentType: '', payerName: '', remark: '' }
        ];
      } else {
        this.tableData = [
          { payCategory: 4, payCategoryLabel: '贷款首付款', paymentAmount: '', paymentTime: '', paymentType: '', payerName: '', remark: '' },
          { payCategory: 0, payCategoryLabel: '贷款', paymentAmount: '', paymentTime: '', paymentType: '', payerName: '', remark: '' },
          { payCategory: 7, payCategoryLabel: '机动车发票其他费用', paymentAmount: '', paymentTime: '', paymentType: '', payerName: '', remark: '' },
          { payCategory: 6, payCategoryLabel: '门店优惠', paymentAmount: '', paymentTime: '', paymentType: '', payerName: '', remark: '' }
        ];
      }
    },
    // 取消
    handleCancel () {
      this.close();
    },
    // 提交
    async handleSubmit () {
      // 过滤出填写了数据的行（只要有任意字段有值就认为填写了数据）
      const filledRows = this.tableData.filter(row => {
        return row.paymentAmount || row.paymentTime || row.paymentType || row.payerName || row.remark;
      });

      // 手动校验：有数据的行必须填写付款金额
      for (const row of filledRows) {
        if (!row.paymentAmount) {
          this.$message.error('请输入付款金额');
          return;
        }
        if (Number(row.paymentAmount) <= 0) {
          this.$message.error('付款金额必须大于 0');
          return;
        }
      }

      if (filledRows.length === 0) {
        this.$message.error('请至少填写一条收款记录');
        return;
      }

      this.submitLoading = true;

      // 转换 paymentType 为数值类型
      const params = {
        deliveryOrderId: this.deliveryOrderId,
        payRecordList: filledRows.map(row => ({
          ...row,
          paymentType: row.paymentType ? Number(row.paymentType) : ''
        }))
      };

      try {
        await addPayRecord(params);
        this.$message.success('保存成功');
        this.close();
        this.$emit('refresh');
      } finally {
        // 业务校验失败时接口会 reject，无论成败都要复位 loading，避免按钮一直转圈
        this.submitLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-table__row {
  position: relative;
  padding-bottom: 20px;
}

::v-deep .el-table__cell {
  padding-bottom: 20px !important;
}

::v-deep .el-input-number .el-input__inner {
  padding-right: 10px;
}
</style>
