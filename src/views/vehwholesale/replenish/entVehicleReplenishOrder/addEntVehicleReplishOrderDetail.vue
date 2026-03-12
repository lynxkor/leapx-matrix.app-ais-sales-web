<template>
  <el-dialog :title="title" width="1200px" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <div class="page-common">
       <el-form
        ref="form"
        :model="materialsform"
        label-width="150px"
        :inline="true"
        size="small"
        label-position="right"
        class="ais-search-form"
      >
        <el-form-item label="整车物料编码：" :rules="rules" ref="materialsCode">
          <fetch-select
            filterable
            clearable
            remote
            v-model="materialsform.materialsCode"
            :remote-method="getVehicleMaterialsList"
            value-key="id"
            label-key="materialsCode"
            @change="materialsSelect"
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
                />
        </el-form-item>
        <el-form-item label="企业客户补货订单：">
          <el-input v-model="materialsform.entReplenishOrderId" clearable placeholder="请输入"/>
        </el-form-item>
         <el-form-item label="销售价格：">
            <el-input-number
                  placeholder="请输入"
                  v-model="materialsform.salesPrice"
                  :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
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
                    :disabled="isType"
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
                    :disabled="isType"
                />
        </el-form-item>
        <el-form-item label="数量：">
          <el-input-number
                  placeholder="请输入"
                  v-model="materialsform.qty"
                   :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
                />
        </el-form-item>
        <el-form-item label="销售市场：">
          <el-input v-model="materialsform.salesMarket" clearable placeholder="请输入" :disabled="isType"/>
        </el-form-item>

      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getEnum, vehicleMaterials } from '@/api/common';
import permissions from '@/libs/mixins/permissions';
import FetchSelect from '@/libs/components/FetchSelect';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
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
          { required: true, message: '请输入销售价格', trigger: 'change' }
        ],
        qty: [
          { required: true, message: '请输入数量', trigger: 'change' }
        ],
      },

      tableData: [],
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
        this.vin = '';
      }
    },
    orderInfo (val) {
      if (val) {
        if (val.orderCategory === 1 || val.orderCategory === 8) {
          this.isType = true;
        } else if (this.orderInfo.orderCategory === 21) {
          this.isType = false;
        }
      }
    }
  },
  created () {
    this.getEnum();
    this.getVehicleMaterialsList();
  },
  methods: {
    async getVehicleMaterialsList (params) {
      return vehicleMaterials({ materialsCodeLike: params, status: 1 });
    },
    materialsSelect (val, row) {
      this.materialsform.materialsId = row.id;
      if (this.orderInfo.orderCategory === 1 || this.orderInfo.status === 8) {
        this.materialsform.standardPrice = this.orderInfo.price;
      } else if (this.orderInfo.orderCategory === 21) {
        this.materialsform.standardPrice = row.standardPrice;
      }
    },
    handleClose () {
      this.materialsform = { ...defaultForm }; // 重置表单数据
      this.tableData = []; // 清空表格数据
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
    },
    handleSubmit () {
      this.$emit('addConfirm', this.materialsform);
      // this.$refs.entOrderDetail.validate((valid) => {
      //   if (valid) {
      //     this.submitLoading = true;
      //   }
      // });
    },
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-input-number {
  width: 100%;
}
</style>
