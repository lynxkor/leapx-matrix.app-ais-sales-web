<template>
  <!-- eslint-disable vue/no-mutating-props -->
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
        <el-form-item label="新增缴定订单数：" prop="newOrderQty">
          <el-input-number
            :controls="false"
            placeholder="请输入"
            v-model="form.newOrderQty"
            clearable
            :min="0"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="新增锁单目标数：" prop="newLockTargetQty">
          <el-input-number
            :controls="false"
            placeholder="请输入"
            v-model="form.newLockTargetQty"
            clearable
            :min="0"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="净增锁单目标数：" prop="netLockTargetQty">
          <el-input-number
            :controls="false"
            placeholder="请输入"
            v-model="form.netLockTargetQty"
            clearable
            :min="0"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="批售考核目标数：" prop="wholesaleAssessmentTargetQty">
          <el-input-number
            :controls="false"
            placeholder="请输入"
            v-model="form.wholesaleAssessmentTargetQty"
            clearable
            :min="0"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="交付目标数：" prop="deliveryTargetQty">
          <el-input-number
            :controls="false"
            placeholder="请输入"
            v-model="form.deliveryTargetQty"
            clearable
            :min="0"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="零售备注：" prop="retailRemark">
          <el-input
            placeholder="请输入"
            v-model="form.retailRemark"
            clearable
          />
        </el-form-item>
      </el-form>
      <!-- 详情模式 -->
      <el-form v-else :inline="true" class="form-detail">
        <el-form-item label="新增缴定订单数：">
          {{ form.newOrderQty }}
        </el-form-item>
        <el-form-item label="新增锁单目标数：">
          {{ form.newLockTargetQty }}
        </el-form-item>
        <el-form-item label="净增锁单目标数：">
          {{ form.netLockTargetQty }}
        </el-form-item>
        <el-form-item label="批售考核目标数：">
          {{ form.wholesaleAssessmentTargetQty }}
        </el-form-item>
        <el-form-item label="交付目标数：">
          {{ form.deliveryTargetQty }}
        </el-form-item>
        <el-form-item label="零售备注：">
          {{ form.retailRemark }}
        </el-form-item>
      </el-form>
    </div>
  </section>
  <!-- eslint-enable vue/no-mutating-props -->
</template>

<script>
export default {
  name: 'RetailFields',
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
