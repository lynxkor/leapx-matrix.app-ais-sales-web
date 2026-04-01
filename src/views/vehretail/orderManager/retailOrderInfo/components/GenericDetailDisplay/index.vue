<!-- 新建文件: src/components/GenericDetailDisplay.vue -->
<template>
  <section :id="id" class="common-section">
    <div class="common-section-header" :data-section="sectionKey">
      <h2>{{ title }}</h2>
    </div>
    <div class="common-section-body">
    <el-form :label-width="labelWidth" :inline="true" class="form-detail">
      <el-form-item
        v-for="field in fields"
        :key="field.key"
        :label="field.label + '：'"
        :prop="field.key"
      >
        {{ formData[field.key] || '' }}
      </el-form-item>
    </el-form>
    </div>
  </section>
</template>

<script>
export default {
  name: 'GenericDetailDisplay',
  props: {
    id: {
      type: String,
      default: ''
    },
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
    },
    // 标签宽度
    labelWidth: {
      type: [String, Number],
      default: '180px'
    },
    // section 标识
    sectionKey: {
      type: String,
      default: ''
    }
  }
};
</script>
