<template>
  <el-form :model="form" ref="formRef" :rules="rules" label-position="right" label-width="120px" :inline="true">
    <el-form-item label="SKU编码">
      <el-input v-model="form.skuCode" placeholder="请输入SKU编码" disabled />
    </el-form-item>
    <el-form-item label="销售属性" prop="saleAttribute">
      <el-select
        v-model="form.saleAttribute"
        multiple
        placeholder="请输入销售属性"
        @change="handleSaleAttributeChange">
        <el-option-group
          v-for="group in options"
          :key="group.saleAttributeId"
          :label="group.attributeName">
          <el-option
            v-for="item in group.attributeValues"
            :key="item.attributeValueId"
            :label="item.attributeValue"
            :value="item.attributeValueId">
          </el-option>
        </el-option-group>
      </el-select>
    </el-form-item>
    <el-form-item label="市场指导价" prop="marketGuidePrice">
      <el-input-number
        v-model="form.marketGuidePrice"
        :precision="2"
        :min="0"
        placeholder="请输入市场指导价"
        clearable :controls="false" />
    </el-form-item>
    <el-form-item label="物料编码" prop="materialsCode">
      <el-input v-model="form.materialsCode" placeholder="请输入物料编码" />
    </el-form-item>
    <el-form-item>
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button size="small" type="primary" :loading="submitLoading" @click="handleSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  productSkuAddOrUpdate, // 新增/编辑
  getSaleAttributeGroupList // 下来查询
} from '@/api/vehretail/productManager/productCenter/index';

const defaultForm = {
  skuCode: '',
  productCode: '',
  saleAttribute: [],
  marketGuidePrice: null,
  materialsCode: '',
  productId: '',
  saleAttributeJson: ''
};
export default {
  name: 'pricingForm',
  props: {
    productCode: {
      type: String,
      default: ''
    },
    parms: {
      type: Object,
      default: () => ({})

    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      options: [],
      submitLoading: false,
      form: {
        ...form
      },
      rules: {
        productCode: [{ required: true, message: '请输入SKU编码', trigger: 'blur' }],
        saleAttribute: [{ required: true, message: '请输入销售属性', trigger: 'blur' }],
        marketGuidePrice: [{ required: true, message: '请输入市场指导价', trigger: 'blur' }],
        materialsCode: [{ required: true, message: '请输入物料编码', trigger: 'blur' }]
      }
    };
  },
  watch: {
    parms: {
      handler (newVal) {
        if (newVal && Object.keys(newVal).length > 0) {
          const updatedParms = { ...newVal };
          if (typeof updatedParms.saleAttribute === 'string') {
            updatedParms.saleAttributeJson = JSON.parse(updatedParms.saleAttributeJson);
            // updatedParms.saleAttribute = updatedParms.saleAttribute.split('+');
            updatedParms.saleAttribute = updatedParms.saleAttributeJson.map(ele => ele.attributeValues[0].attributeValueId);
          }
          this.form = { ...this.form, ...updatedParms };
        } else {
          this.form = this.getDefautlForm();
        }
      },
      immediate: true
    }
  },
  created () {},
  mounted () {
    this.openForm();
  },
  methods: {
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    handleSaleAttributeChange (selectedValues) {
      const selectedMap = {};
      let hasConflict = false; // 标记是否出现冲突
      this.options.forEach(group => {
        group.attributeValues.forEach(item => {
          if (selectedValues.includes(item.attributeValueId)) {
            if (!selectedMap[group.saleAttributeId]) {
              selectedMap[group.saleAttributeId] = item.attributeValueId;
            } else {
              // Remove the newly selected value if another is already selected for this group
              this.form.saleAttribute = this.form.saleAttribute.filter(
                val => val !== item.attributeValueId
              );
              hasConflict = true; // 标记冲突
            }
          }
        });
      });

      if (hasConflict) {
        this.$message.warning('每个分组只能选择一个属性值，请重新选择。');
      }
    },
    openForm () {
      console.log('getSaleAttributeGroupList:');
      getSaleAttributeGroupList({ productId: this.$route.query.id }).then(res => {
        console.log('res:', res);
        // 按 attributeName 分组，将相同属性名的数据合并到同一组
        const groupedMap = new Map();
        res.forEach(item => {
          const key = item.attributeName;
          if (!groupedMap.has(key)) {
            groupedMap.set(key, {
              attributeName: item.attributeName,
              saleAttributeId: item.saleAttributeId,
              attributeValues: []
            });
          }
          // 合并 attributeValues
          groupedMap.get(key).attributeValues.push(...item.attributeValues);
        });
        this.options = Array.from(groupedMap.values());
        console.log('options:', this.options);
      }).catch(() => {
      });
    },
    handleSubmit () {
      this.submitLoading = true;
      // 添加校验逻辑：确保每个分组都选择了值
      const allGroupsSelected = this.options.every(group => {
        return group.attributeValues.some(item =>
          this.form.saleAttribute.includes(item.attributeValueId)
        );
      });

      if (!allGroupsSelected) {
        this.submitLoading = false;
        this.$message.error('请确保每个分组都选择了一个属性值');
        return;
      }
      // 原有的表单校验逻辑
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          // 数据处理：创建新的变量，避免修改原始数据
          const matchedAttributes = this.options.map(group => {
            const matchedValues = group.attributeValues.filter(item =>
              this.form.saleAttribute.includes(item.attributeValueId)
            );
            return {
              productId: group.productId,
              productCode: group.productCode,
              attributeSort: group.attributeSort,
              attributeName: group.attributeName,
              attributeValues: matchedValues
            };
          }).filter(group => group.attributeValues.length > 0);
          // 按照 attributeSort 排序
          matchedAttributes.forEach(group => {
            group.attributeValues.sort((a, b) => a.attributeSort - b.attributeSort);
          });
          // 生成 saleAttributeJson
          const saleAttributeJson = JSON.stringify(matchedAttributes);
          // const saleAttributeJson = matchedAttributes;
          // 拼接 saleAttribute
          const saleAttribute = matchedAttributes
            .map(group => group.attributeValues.map(item => item.attributeValue).join('+'))
            .join('+');
          // 提交前更新表单数据
          const submitData = {
            ...this.form,
            productCode: this.productCode,
            productId: this.$route.query.id,
            saleAttributeJson,
            saleAttribute
          };
          console.log('submitData:', submitData);
          productSkuAddOrUpdate(submitData).then(res => {
            this.$emit('submit');
          }).catch(() => {
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          this.submitLoading = false;
          this.$message.error('请检查表单输入');
        }
      });
    },
    handleCancel () {
      this.$emit('cancel');
      this.form = this.getDefautlForm();
    }
  }
};
</script>
