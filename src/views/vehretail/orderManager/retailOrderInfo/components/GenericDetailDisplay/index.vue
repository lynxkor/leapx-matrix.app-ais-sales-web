<!-- 新建文件: src/components/GenericDetailDisplay.vue -->
<template>
  <section :id="id" class="common-section">
    <div class="common-section-header" :data-section="sectionKey">
      <h2>{{ title }}</h2>
    </div>
    <div class="common-section-body">
    <el-form :inline="true" class="form-detail">
      <el-form-item
        v-for="field in fields"
        :key="field.key"
        :label="field.label + '：'"
        :prop="field.key"
        :class="field.class"
      >
        <a v-if="field.download" class="el-link el-link--primary" :href="formData[field.key]" target="_blank" download>{{ formData[field.key] }}</a>
        <el-link
          v-else-if="field.link"
          type="primary"
          :href="getLinkUrl(field)"
          :target="field.target || '_blank'"
        >{{ formData[field.key] || '' }}</el-link>
        <span v-else>{{ formData[field.key] || '' }}</span>
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
  },
  methods: {
    getLinkUrl (field) {
      if (!field.link) return '';
      // paramKey: 指定 formData 中的字段作为参数值
      // paramName: 指定 URL 参数名（默认为 id）
      let url = field.link;
      if (field.paramKey) {
        const paramName = field.paramName || 'id';
        const paramValue = this.formData[field.paramKey];
        if (paramValue) {
          url += `?${paramName}=${paramValue}`;
        }
      }
      return url;
    }
  }
};
</script>
