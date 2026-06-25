<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>{{ isEditing ? '编辑信息' : '查看信息' }}</h2>
    </div>
    <div class="common-section-body">
      <!-- 编辑模式 -->
      <el-form
        v-if="isEditing"
        :inline="true"
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="form-edit"
      >
        <el-form-item label="批售目标数：" prop="wholesaleTargetQty">
          <el-input-number
            :controls="false"
            placeholder="请输入"
            v-model="form.wholesaleTargetQty"
            clearable
            :min="0"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="批售备注：" prop="wholesaleRemark">
          <el-input
            placeholder="请输入"
            v-model="form.wholesaleRemark"
            clearable
          />
        </el-form-item>
      </el-form>
      <!-- 详情模式 -->
      <el-form v-else :inline="true" class="form-detail">
        <el-form-item label="批售目标数：">
          {{ form.wholesaleTargetQty }}
        </el-form-item>
        <el-form-item label="批售备注：">
          {{ form.wholesaleRemark }}
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WholesaleFields',
  props: {
    form: {
      type: Object,
      required: true
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>