<template>
  <el-dialog :title="title" width="1200px" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <div class="page-common">
       <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :inline="true"
        size="small"
        label-position="right"
        class="ais-search-form"
      >
        <el-form-item label="整车物料编码：" :rules="rules" ref="materialsCode">
          <el-input
            placeholder="请输入"
            v-model="form.materialsCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="标准价格：">
          <el-input-number
                  placeholder="请输入"
                  v-model="form.standardPrice"
                   :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
                />
        </el-form-item>
        <el-form-item label="企业客户补货订单：">
          <el-input v-model="form.entReplenishOrderId" clearable placeholder="请输入"/>
        </el-form-item>
         <el-form-item label="销售价格：">
            <el-input-number
                  placeholder="请输入"
                  v-model="form.salesPrice"
                  :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
                />
        </el-form-item>
        <el-form-item label="关联交易不含税价：">
            <el-input-number
                  placeholder="请输入"
                  v-model="form.relatedTxnExTaxPrice"
                   :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
                />
        </el-form-item>
        <el-form-item label="关联交易价格比例：">
            <el-input-number
                  placeholder="请输入"
                  v-model="form.relatedTxnPriceRate"
                   :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
                />
        </el-form-item>
        <el-form-item label="数量：">
          <el-input-number
                  placeholder="请输入"
                  v-model="form.qty"
                   :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
                />
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
import { getEnum } from '@/api/common';
import permissions from '@/libs/mixins/permissions';
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
  },
  data () {
    return {
      title: '企业客户补货订单明细',
      moduleKey: 'AISVW-entVehicleReplenishOrder',
      loading: false,
      submitLoading: false,
      show: false,
      form: {
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
        console.log('visible', this.visible);
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
    }
  },
  methods: {
    handleClose () {
      this.form = { ...defaultForm }; // 重置表单数据
      this.tableData = []; // 清空表格数据
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
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
      this.$emit('addConfirm', this.form);
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
      this.$refs.entOrderDetail.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
