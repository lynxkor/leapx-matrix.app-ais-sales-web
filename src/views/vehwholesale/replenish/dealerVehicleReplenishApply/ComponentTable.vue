<template>
  <vxe-table
    ref="table"
    :data="tableData"
    stripe
    resizable
    border="inner"
    size="medium"
    max-height="600px"
    width="1000px"
    :checkbox-config="{ checkField: 'checked' }"
    @cell-click="handleCellClick"
  >
    <vxe-column
      v-for="column in columns"
      :key="column.field || column.title"
      v-bind="column"
    >
      <template v-if="column.slots?.default" #default="{ row }">
        <slot :name="column.slots.default" :row="row" />
      </template>
      <template v-else-if="column.field === 'applyQty'" #default="{ row }">
        <!-- 申请数量：仅 canEdit（permission.edit）行可编辑 -->
        <el-input-number
          v-if="isEditing(row) && canEdit"
          :step="1"
          :min="0"
          :max="999"
          :controls="false"
          v-model="row.applyQty"
          size="small"
          class="cell-input-number"
        />
        <span v-else>{{ row.applyQty }}</span>
      </template>
      <template v-else-if="column.field === 'invoiceDiscountTypeLabel'" #default="{ row }">
        <!-- 开票类型：编辑态 fetch-select（enumCode=vw_invoice_type），绑定 invoiceDiscountType；展示仍走 invoiceDiscountTypeLabel -->
        <fetch-select
          v-if="isEditing(row) && canEditDetail"
          :request="fetchInvoiceTypeOptions"
          enumCode="vw_invoice_type"
          v-model="row.invoiceDiscountType"
          placeholder="请选择开票类型"
          clearable
          filterable
          size="small"
          class="cell-fetch-select"
        />
        <span v-else>{{ row.invoiceDiscountTypeLabel }}</span>
      </template>
      <template v-else-if="column.field === 'invoiceCoefficient'" #default="{ row }">
        <!-- 开票系数：仅 canEditDetail（permission.editDetail）行可编辑。只允许输入数字和小数点 -->
        <el-input
          v-if="isEditing(row) && canEditDetail"
          :value="row.invoiceCoefficient"
          size="small"
          placeholder="请输入开票系数"
          maxlength="20"
          class="cell-input invoice-coefficient-input"
          @input="(val) => handleInvoiceCoefficientInput(row, val)"
          @keyup.native="(e) => sanitizeInvoiceCoefficientDom(e, row)"
          @blur="(e) => sanitizeInvoiceCoefficientDom(e, row)"
        />
        <span v-else>{{ row.invoiceCoefficient }}</span>
      </template>
    </vxe-column>
    <vxe-column
      v-if="hasActionColumn"
      field="action"
      title="操作"
      width="160"
      fixed="right"
    >
      <template #default="{ row, rowIndex }">
        <template v-if="isEditing(row)">
          <el-link type="primary" :underline="false" @click.stop="handleSave(row, rowIndex)" style="margin-right: 10px;">保存</el-link>
          <el-link type="default" :underline="false" @click.stop="handleCancelEdit" style="margin-right: 10px;">取消</el-link>
        </template>
        <template v-else>
          <el-link v-if="canEdit || canEditDetail" type="primary" :underline="false" @click.stop="handleEdit(row)" style="margin-right: 10px;">编辑</el-link>
          <el-link v-if="canDelete" type="danger" :underline="false" @click="handleDelete(row, rowIndex)">删除</el-link>
        </template>
      </template>
    </vxe-column>
  </vxe-table>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';

export default {
  name: 'ComponentTable',
  components: { FetchSelect },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    // 是否显示操作列（任一权限开启即显示）
    showDelete: {
      type: Boolean,
      default: false
    },
    // 编辑/保存/取消按钮 + 申请数量可编辑 (form.permission.edit && _id && perEdit)
    canEdit: {
      type: Boolean,
      default: false
    },
    // 开票类型与开票系数可编辑 ((form.permission.edit || form.permission.editDetail) && _id && perEdit)
    canEditDetail: {
      type: Boolean,
      default: false
    },
    // 删除按钮 (form.permission.edit && _id && perEdit)
    canDelete: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editingRowId: null
    };
  },
  computed: {
    // 兼容旧调用：showDelete 为 true 时等同于 canEdit + canDelete
    hasActionColumn () {
      if (this.showDelete) return true;
      return this.canEdit || this.canEditDetail || this.canDelete;
    }
  },
  methods: {
    isEditing (row) {
      return this.editingRowId === row._uid;
    },
    // 获取选中的行数据
    getSelection () {
      return this.$refs.table ? this.$refs.table.getCheckboxRecords() : [];
    },
    // 清除选中状态
    clearSelection () {
      if (this.$refs.table) {
        this.$refs.table.clearCheckboxRow();
        this.$refs.table.clearCheckboxReserve();
      }
    },
    handleDelete (row, rowIndex) {
      this.$emit('delete-row', row, rowIndex);
    },
    handleEdit (row) {
      this.editingRowId = row._uid;
    },
    handleCellClick ({ row }) {
      // 行级权限：可编辑（applyQty）或可改明细（invoice）均允许进入编辑态
      if (this.canEdit || this.canEditDetail) {
        this.editingRowId = row._uid;
      }
    },
    handleSave (row, rowIndex) {
      this.editingRowId = null;
      this.$emit('save-row', row, rowIndex);
    },
    handleCancelEdit () {
      this.editingRowId = null;
    },
    // 开票类型枚举：fetch-select :request 签名 (params) => Promise<records>
    async fetchInvoiceTypeOptions () {
      const list = await getEnum('vw_invoice_type');
      return (list || []).map(item => ({
        ...item,
        code: String(item.code)
      }));
    },
    // 开票系数：仅允许输入数字与单个小数点。空值允许通过（不会回填）。在 input 事件中先清洗再回写 v-model，保证数据源也干净。
    handleInvoiceCoefficientInput (row, val) {
      if (val === '' || val === null || val === undefined) {
        // 用户清空时直接置为空字符串，避免出现 0 之类的回填
        if (row.invoiceCoefficient !== '') row.invoiceCoefficient = '';
        return;
      }
      const sanitized = String(val)
        // 1) 去除所有非数字/小数点字符
        .replace(/[^\d.]/g, '')
        // 2) 仅保留第一个小数点
        .replace(/(\..*)\./g, '$1');
      if (row.invoiceCoefficient !== sanitized) row.invoiceCoefficient = sanitized;
    },
    // DOM 兜底：处理中文/输入法/粘贴 等场景（避开 v-model 时序不一致问题），从原始 input 元素读取值后清洗并写回 ref 与数据。
    sanitizeInvoiceCoefficientDom (event, row) {
      const el = event && event.target;
      if (!el || el.tagName !== 'INPUT') return;
      const raw = el.value;
      const sanitized = String(raw).replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
      if (sanitized !== raw) {
        el.value = sanitized;
        if (row.invoiceCoefficient !== sanitized) {
          row.invoiceCoefficient = sanitized;
          // 触发 input 事件以便以 :value 绑定的组件刷新显示
          this.$nextTick(() => { /* v-model 已经是响应式，无需手动 dispatch */ });
        }
      }
    }
  }
};
</script>

<style scoped>
/* 让单元格内的 fetch-select / input-number / input 与单元格紧凑贴合 */
.cell-fetch-select,
.cell-input-number,
.cell-input {
  width: 100%;
}
.cell-input-number >>> .el-input__inner,
.cell-input >>> .el-input__inner {
  text-align: left;
}
</style>
