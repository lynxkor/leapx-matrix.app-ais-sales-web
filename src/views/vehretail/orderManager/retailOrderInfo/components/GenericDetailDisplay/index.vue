<!-- 新建文件: src/components/GenericDetailDisplay.vue -->
<template>
  <section id="car-owner" class="common-section">
    <div class="common-section-header">
      <h2>{{ title }}</h2>
    </div>
    <div class="common-section-body">
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
    </div>
  </section>
</template>

<script>
export default {
  name: 'GenericDetailDisplay',
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
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
