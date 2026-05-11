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
        <el-input-number
          v-if="editingRowId === row._uid"
          :step="1"
          :min="0"
          :max="999"
          :controls="false"
          v-model="row.applyQty"
          size="small"
        />
        <span v-else>{{ row.applyQty }}</span>
      </template>
    </vxe-column>
    <vxe-column
      v-if="showDelete"
      field="action"
      title="操作"
      width="120"
      fixed="right"
    >
      <template #default="{ row, rowIndex }">
        <template v-if="editingRowId === row._uid">
          <el-link type="primary" :underline="false" @click.stop="handleSave(row, rowIndex)" style="margin-right: 10px;">保存</el-link>
          <el-link type="default" :underline="false" @click.stop="handleCancelEdit">取消</el-link>
        </template>
        <template v-else>
          <el-link type="primary" :underline="false" @click.stop="handleEdit(row)" style="margin-right: 10px;">编辑</el-link>
          <el-link type="danger" :underline="false" @click="handleDelete(row, rowIndex)">删除</el-link>
        </template>
      </template>
    </vxe-column>
  </vxe-table>
</template>

<script>
export default {
  name: 'ComponentTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    showDelete: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editingRowId: null
    };
  },
  methods: {
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
      this.editingRowId = row._uid;
    },
    handleSave (row, rowIndex) {
      this.editingRowId = null;
      this.$emit('save-row', row, rowIndex);
    },
    handleCancelEdit () {
      this.editingRowId = null;
    }
  }
};
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>
