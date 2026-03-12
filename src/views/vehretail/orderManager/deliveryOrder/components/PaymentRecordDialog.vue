<template>
  <el-dialog
    :visible.sync="visible"
    title="新增收款记录"
    width="1400px"
    :close-on-click-modal="false"
    class="payment-record-dialog"
  >
    <div class="dialog-content" v-loading="loading">
      <el-form :model="formData" :rules="formRules" ref="paymentForm">
        <el-table :data="tableData" border>
          <el-table-column label="收款类型" width="180">
            <template slot-scope="{ row }">
              <span>{{ row.paymentTypeLabel }}</span>
            </template>
          </el-table-column>
          <el-table-column label="付款金额" width="180">
            <template slot-scope="{ row, $index }">
              <el-form-item :prop="'paymentAmount_' + $index" label="" :rules="getPaymentAmountRules(row)">
                <el-input-number
                  v-model="row.paymentAmount"
                  placeholder="请输入"
                  :precision="2"
                  :step="0.01"
                  :min="0"
                  :controls="false"
                  style="width: 100%;"
                />
              </el-form-item>
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
                v-model="row.payCategory"
                placeholder="请选择"
                clearable
                filterable
              />
            </template>
          </el-table-column>
          <el-table-column label="支付人" width="180">
            <template slot-scope="{ row }">
              <el-input
                v-model="row.payer"
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
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
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
    // 金融方案
    financePlan: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      loading: false,
      submitLoading: false,
      tableData: [],
      formData: {},
      formRules: {}
    };
  },
  watch: {
    // 深度监听 tableData 变化，当用户填写数据时处理校验
    tableData: {
      handler (newVal) {
        // 使用 setTimeout 确保在 DOM 更新后清除校验
        setTimeout(() => {
          newVal.forEach((row, index) => {
            // 检查当前行是否有任意字段有值
            const hasAnyData = row.paymentAmount || row.paymentTime || row.payCategory || row.payer || row.remark;

            if (this.$refs.paymentForm) {
              const prop = 'paymentAmount_' + index;
              if (hasAnyData && row.paymentAmount) {
                // 当行内有数据且付款金额有值时，清除校验错误
                this.$refs.paymentForm.clearValidate([prop]);
              } else if (!hasAnyData) {
                // 当行内没有任何数据时，也清除校验错误
                this.$refs.paymentForm.clearValidate([prop]);
              }
            }
          });
        }, 0);
      },
      deep: true
    }
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
        if (this.$refs.paymentForm) {
          this.$refs.paymentForm.clearValidate();
        }
        this.initTableData();
      });
    },
    // 关闭对话框
    close () {
      this.visible = false;
      this.tableData = [];
      this.formData = {};
      this.formRules = {};
    },
    // 初始化表格数据
    initTableData () {
      // 全款购车：仅展示尾款、机动车发票其他费用、门店优惠
      // 分期购车：展示贷款首付款、贷款、机动车发票其他费用、门店优惠
      const isFullPayment = this.financePlan === '1010';

      if (isFullPayment) {
        this.tableData = [
          { paymentType: '1010', paymentTypeLabel: '尾款', paymentAmount: '', paymentTime: '', payCategory: '', payer: '', remark: '' },
          { paymentType: '1040', paymentTypeLabel: '机动车发票其他费用', paymentAmount: '', paymentTime: '', payCategory: '', payer: '', remark: '' },
          { paymentType: '1050', paymentTypeLabel: '门店优惠', paymentAmount: '', paymentTime: '', payCategory: '', payer: '', remark: '' }
        ];
      } else {
        this.tableData = [
          { paymentType: '1020', paymentTypeLabel: '贷款首付款', paymentAmount: '', paymentTime: '', payCategory: '', payer: '', remark: '' },
          { paymentType: '1030', paymentTypeLabel: '贷款', paymentAmount: '', paymentTime: '', payCategory: '', payer: '', remark: '' },
          { paymentType: '1040', paymentTypeLabel: '机动车发票其他费用', paymentAmount: '', paymentTime: '', payCategory: '', payer: '', remark: '' },
          { paymentType: '1050', paymentTypeLabel: '门店优惠', paymentAmount: '', paymentTime: '', payCategory: '', payer: '', remark: '' }
        ];
      }

      // 初始化 formData 和 formRules
      this.tableData.forEach((row, index) => {
        this.formData[`paymentAmount_${index}`] = row.paymentAmount;
        this.formData[`paymentTime_${index}`] = row.paymentTime;
        this.formData[`payCategory_${index}`] = row.payCategory;
        this.formData[`payer_${index}`] = row.payer;
        this.formData[`remark_${index}`] = row.remark;
      });
    },
    // 获取付款金额校验规则（动态绑定，只校验有数据的行）
    getPaymentAmountRules (row) {
      return [{
        validator: (rule, value, callback) => {
          // 检查当前行是否有其他字段填写了数据
          const hasOtherData = row.paymentTime || row.payCategory || row.payer || row.remark;

          if (!value && !hasOtherData) {
            // 当前行没有任何数据，不校验
            callback();
          } else if (!value && hasOtherData) {
            // 当前行有其他数据但付款金额为空，需要校验
            callback(new Error('请输入付款金额'));
          } else if (value !== '' && value !== undefined && Number(value) <= 0) {
            callback(new Error('付款金额必须大于 0'));
          } else {
            // 有值且大于 0，校验通过
            callback();
          }
        },
        trigger: ['input', 'change', 'blur']
      }];
    },
    // 取消
    handleCancel () {
      this.close();
    },
    // 提交
    async handleSubmit () {
      try {
        await this.$refs.paymentForm.validate();
        this.submitLoading = true;

        // 过滤出填写了数据的行（只要有任意字段有值就认为填写了数据）
        const filledRows = this.tableData.filter(row => {
          return row.paymentAmount || row.paymentTime || row.payCategory || row.payer || row.remark;
        });

        // 模拟提交
        const params = {
          orderId: this.orderId,
          paymentRecords: filledRows
        };
        console.log('提交参数:', params);
        // await submitPaymentRecord(params);

        await new Promise(resolve => setTimeout(resolve, 500));

        this.$message.success('保存成功');
        this.close();
        this.$emit('refresh');
      } catch (error) {
        if (error !== false) {
          console.error('保存收款记录失败:', error);
          this.$message.error('请填写付款金额');
        }
      } finally {
        this.submitLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 0;

  // .el-form-item__error {
  //   position: absolute;
  //   top: 28px;
  //   left: 0;
  //   white-space: nowrap;
  //   z-index: 1;
  // }
}

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
