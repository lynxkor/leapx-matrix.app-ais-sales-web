<template>
  <vxe-table
    ref="table"
    :data="tableData"
    stripe
    resizable
    border="inner"
    size="medium"
    height="auto"
    width="1000px"
    :checkbox-config="{ checkField: 'checked' }"
  >
    <vxe-column
      v-for="column in columns"
      :key="column.field || column.title"
      v-bind="column"
    />
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
    }
  }
};
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>
