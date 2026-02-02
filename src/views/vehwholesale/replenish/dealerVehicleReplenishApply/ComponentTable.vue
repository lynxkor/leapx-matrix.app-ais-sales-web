<template>
  <vxe-table
    ref="table"
    :data="tableData"
    stripe
    resizable
    border="inner"
    size="medium"
    height="auto"
    min-height="200px"
    max-height="600px"
    width="1000px"
    :checkbox-config="{ checkField: 'checked' }"
  >
    <vxe-column
      v-for="column in columns"
      :key="column.field || column.title"
      v-bind="column"
    />
    <vxe-column
      v-if="showDelete"
      field="action"
      title="操作"
      width="80"
      fixed="right"
    >
      <template #default="{ row, rowIndex }">
        <el-button type="text" size="small" @click="handleDelete(row, rowIndex)">删除</el-button>
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
    }
  }
};
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>
