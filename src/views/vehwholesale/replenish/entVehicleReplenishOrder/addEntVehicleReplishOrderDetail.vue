<template>
  <el-dialog :title="title" width="1000px" :visible.sync="dialogVisible" :before-close="handleClose">
    <div class="page-common">
      <el-form
        ref="materialsForm"
        :model="materialsform"
        label-width="150px"
        :inline="true"
        size="small"
        label-position="right"
        class="ais-search-form three-col-form"
        :rules="rules"
      >
        <el-form-item label="整车物料编码：" prop="materialsCode">
          <fetch-select
            filterable
            clearable
            remote
            v-model="materialsform.materialsCode"
            :remote-method="getVehicleMaterialsList"
            value-key="id"
            label-key="materialsCode"
            @change="materialsSelect"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="标准价格：">
          <el-input-number
            placeholder="请输入"
            v-model="materialsform.standardPrice"
            :precision="2"
            :step="0.01"
            :min="0"
            :controls="false"
            disabled
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="企业客户补货订单：">
          <el-input
            v-model="materialsform.entReplenishOrderId"
            placeholder="请输入"
            disabled
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="销售价格：" prop="salesPrice">
          <el-input-number
            placeholder="请输入"
            v-model="materialsform.salesPrice"
            :precision="2"
            :step="0.01"
            :min="0"
            :controls="false"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="关联交易不含税价：">
          <el-input-number
            placeholder="请输入"
            v-model="materialsform.relatedTxnExTaxPrice"
            :precision="2"
            :step="0.01"
            :min="0"
            :controls="false"
            disabled
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="关联交易价格比例：">
          <el-input-number
            placeholder="请输入"
            v-model="materialsform.relatedTxnPriceRate"
            :precision="2"
            :step="0.01"
            :min="0"
            :controls="false"
            disabled
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="数量：" prop="qty">
          <el-input-number
            placeholder="请输入"
            v-model="materialsform.qty"
            :step="1"
            :min="0"
            :controls="false"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getEnum, vehicleMaterials } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { getList as taxGetList } from '@/api/vehwholesale/entorder/entTransactionTaxPriceConfig/index';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  materialsCode: '',
  standardPrice: '',
  salesPrice: '',
  materialsId: '',
  qty: 1,
  relatedTxnExTaxPrice: '',
  relatedTxnPriceRate: '',
};
export default {
  name: 'AddEntVehicleReplishOrderDetail',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderInfo: {
      type: Object,
      default: null
    }
  },
  components: {
    FetchSelect,
  },
  data () {
    const validateGreaterThanZero = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        callback(new Error('请输入有效值'));
      } else if (Number(value) < 0) {
        callback(new Error('值必须大于 0'));
      } else {
        callback();
      }
    };
    return {
      title: '企业客户补货订单明细',
      moduleKey: 'AISVW-entVehicleReplenishOrder',
      loading: false,
      submitLoading: false,
      isType: false,
      show: false,
      materialsform: {
        ...defaultForm
      },
      rules: {
        materialsCode: [
          { required: true, message: '请输入整车物料编码', trigger: 'change' }
        ],
        standardPrice: [
          { required: true, message: '请输入标准价格', trigger: 'change' }
        ],
        entReplenishOrderId: [
          { required: true, message: '请输入企业客户补货定单', trigger: 'change' }
        ],
        salesPrice: [
          { required: true, message: '请输入销售价格', trigger: 'change' },
          { validator: validateGreaterThanZero, trigger: 'blur' }
        ],
        qty: [
          { required: true, message: '请输入数量', trigger: 'change' },
          { validator: validateGreaterThanZero, trigger: 'blur' }
        ],
      },
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
        this.$nextTick(() => {
          if (this.$refs.materialsForm) {
            this.$refs.materialsForm.clearValidate();
          }
          // 先重置表单
          this.materialsform = { ...defaultForm };
          // 重置后立即根据当前的 orderInfo 赋值，防止竞态条件
          if (this.orderInfo) {
            this.materialsform.entReplenishOrderId = this.orderInfo.entReplenishOrderCode;
            if (this.orderInfo.orderCategory === 1 || this.orderInfo.orderCategory === 8) {
              this.isType = true;
            } else if (this.orderInfo.orderCategory === 21) {
              this.isType = false;
            }
          }
        });
      }
    },
    // 新增监听：当销售价格变化且订单分类为 21 时，同步标准价格
    'materialsform.salesPrice': {
      handler (newVal) {
        if (this.orderInfo && this.orderInfo.orderCategory === 21) {
          this.materialsform.standardPrice = newVal;
          this.getTaxPrice();
        }
      },
      immediate: true // 初始化时也执行一次
    }
  },
  created () {
    this.getEnum();
    this.getVehicleMaterialsList();
    this.materialsform = { ...defaultForm };
  },
  methods: {
    getTaxPrice () {
      taxGetList(
        { saleCompanyId: this.orderInfo.saleCompanyId }
      ).then((d) => {
        this.materialsform.relatedTxnPriceRate = d.records[0].txnTaxPriceRate;
        if (this.materialsform.salesPrice && this.materialsform.relatedTxnPriceRate) {
          console.log('计算税率');
          this.materialsform.relatedTxnExTaxPrice = (this.materialsform.salesPrice * (1 - this.materialsform.relatedTxnPriceRate / 100) / (1.13)).toFixed(2);
        }
      }).catch(() => {
      });
    },
    async getVehicleMaterialsList (params) {
      return vehicleMaterials({ materialsCodeLike: params, status: 1, pageSize: 20, allowCustomerSales: true });
    },
    materialsSelect (val, row) {
      this.materialsform.materialsId = row.id;
      if (this.orderInfo.orderCategory === 1 || this.orderInfo.orderCategory === 8) {
        this.materialsform.standardPrice = row.price;
      }
    },
    handleClose () {
      this.handleCancel();
    },
    getFormData () {
      const data = { ...this.materialsform };
      Object.keys(this.materialsform).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });
      return data;
    },
    async dialogshow () {
      await this.getData();
    },
    async getEnum () {
      const response = await getEnum('vw_stock_status');
      console.log('response:', response);
    },
    confirm () {
      this.$refs.editTable.clearSelection();
      this.$emit('addConfirm', this.materialsform);
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleCancel () {
      this.dialogVisible = false;
      this.materialsform.materialsCode = '';
      this.materialsform.standardPrice = '';
      this.materialsform.salesPrice = '';
      this.materialsform.materialsId = '';
      this.materialsform.qty = '';
    },
    handleSubmit () {
      this.$refs.materialsForm.validate((valid) => {
        if (valid) {
          this.$emit('addConfirm', this.materialsform);
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
// 强制 el-form-item 宽度，实现一行三个
.three-col-form {
  ::v-deep .el-form-item {
    width: 48%;
    margin-right: 2%; // 可选：调整间距
  }

  ::v-deep .el-input,
  ::v-deep .el-input-number,
  ::v-deep .el-select {
    width: 100%;
  }
  ::v-deep .fetch-select {
    width: 100%;
  }
}
</style>
