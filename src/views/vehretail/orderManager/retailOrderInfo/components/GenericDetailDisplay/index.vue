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
        <LPEncrypted
          v-if="field.encrypted && formData.id"
          :value.sync="encryptedDisplay[field.key]"
          :decryptMethod="() => decryptMethod(field.key)"
          :key="field.key"
        >
          <a v-if="field.download" class="el-link el-link--primary" :href="displayValue(field)" target="_blank" download>{{ displayValue(field) }}</a>
          <el-link
            v-else-if="field.link"
            type="primary"
            :href="getLinkUrl(field)"
            :target="field.target || '_blank'"
          >{{ displayValue(field) }}</el-link>
          <el-link
            v-else-if="field.eventName"
            type="primary"
            :underline="false"
            @click="handleFieldClick(field)"
          >{{ displayValue(field) }}</el-link>
          <span v-else>{{ displayValue(field) }}</span>
        </LPEncrypted>
        <a v-else-if="field.download" class="el-link el-link--primary" :href="displayValue(field)" target="_blank" download>{{ displayValue(field) }}</a>
        <el-link
          v-else-if="field.link"
          type="primary"
          :href="getLinkUrl(field)"
          :target="field.target || '_blank'"
        >{{ displayValue(field) }}</el-link>
        <el-link
          v-else-if="field.eventName"
          type="primary"
          :underline="false"
          @click="handleFieldClick(field)"
        >{{ displayValue(field) }}</el-link>
        <span v-else>{{ displayValue(field) }}</span>
      </el-form-item>
    </el-form>
    </div>
  </section>
</template>

<script>
import LPEncrypted from '@/libs/components/LPEncrypted';

export default {
  name: 'GenericDetailDisplay',
  components: {
    LPEncrypted
  },
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
    },
    // 字段解密方法（由父组件传入），参数 (id, field)，返回 Promise<string>
    getDetailDecryptField: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      // 用于承载加密字段的本地显示值，规避直接修改 prop
      encryptedDisplay: {}
    };
  },
  watch: {
    formData: {
      handler (val) {
        // 同步 formData 中的加密字段到本地 display
        const next = {};
        this.fields.forEach(f => {
          if (f.encrypted) {
            next[f.key] = val && val[f.key] !== undefined ? val[f.key] : '';
          }
        });
        this.encryptedDisplay = next;
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getLinkUrl (field) {
      if (!field.link) return '';
      let url = field.link;
      if (field.paramKey) {
        const paramName = field.paramName || 'id';
        // 加密字段优先使用解密后的本地展示值，避免链接携带密文
        const paramValue = field.encrypted
          ? (this.encryptedDisplay[field.paramKey] || this.formData[field.paramKey])
          : this.formData[field.paramKey];
        if (paramValue) {
          url += `?${paramName}=${paramValue}`;
        }
      }
      return url;
    },
    // 字段点击事件：按 field.paramKey 取 formData 中的 id 抛出，由父组件决定如何处理（如打开弹框）
    handleFieldClick (field) {
      const id = field && field.paramKey ? this.formData[field.paramKey] : null;
      this.$emit('field-click', id);
    },
    displayValue (field) {
      if (field.encrypted) {
        const v = this.encryptedDisplay[field.key];
        return v === undefined || v === null ? '' : v;
      }
      const v = this.formData && this.formData[field.key];
      return v === undefined || v === null ? '' : v;
    },
    // 字段解密方法：由父组件通过 prop 注入具体的解密实现
    decryptMethod (field) {
      if (typeof this.getDetailDecryptField === 'function') {
        return this.getDetailDecryptField(this.formData.id, field);
      }
      return Promise.resolve(this.encryptedDisplay[field] || '');
    }
  }
};
</script>
