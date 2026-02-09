<!-- 新建文件: src/components/GenericDetailDisplay.vue -->
<template>
  <el-form label-width="180px" :inline="true" class="form-detail">
    <el-form-item
      v-for="field in fields"
      :key="field.key"
      :label="field.label + '：'"
      :prop="field.key"
    >
      {{ formData[field.key] || '-' }}
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'GenericDetailDisplay',
  props: {
    // 表单数据对象
    formData: {
      type: Object,
      required: true,
      default: () => ({})
    },
    // 字段配置数组，每个字段包含 key 和 label
    fields: {
      type: Array,
      required: true,
      default: () => []
    }
  }
};
</script>
