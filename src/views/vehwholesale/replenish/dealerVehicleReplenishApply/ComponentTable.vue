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
      default: () => [
        { field: 'serviceProxyNo', title: '接车施工单', width: '200' },
        { field: 'warrantyNo', title: '保修申请单', width: '200' },
        { field: 'oldPartUniqueCode', title: '旧件唯一码', width: '200' },
        { field: 'dealerName', title: '门店名称', width: '200' },
        { field: 'dealerStatusLabel', title: '门店库存状态', width: '140' },
        { field: 'isMainPartLabel', title: '是否主因零部件', width: '200' },
        { field: 'vin', title: 'VIN', width: '140' },
        { field: 'oldPartSupplierName', title: '零件供应商', width: '200' },
        { field: 'mainPartSupplierName', title: '主因件供应商', width: '150' },
        { field: 'oldPartCode', title: '旧件编码', width: '120' },
        { field: 'oldPartName', title: '旧件名称', width: '150' },
        { field: 'partCode', title: '换上零件编码', width: '200' },
        { field: 'partName', title: '换上零件名称', width: '220' },
        { field: 'oldPartCode', title: '入库旧件编码', width: '200' },
        { field: 'oemStatus', title: '主机厂库存状态', width: '120' },
        { field: 'dealerOutTime', title: '门店出库时间', width: '180' },
        { field: 'returnOrderNo', title: '门店回运单号', width: '120' },
        { field: 'oemCheckTime', title: '主机厂验收时间', width: '180' },
        { field: 'oemOutboundOrderNo', title: '主机厂出库单', width: '140' },
        { field: 'oemOutTime', title: '主机厂出库时间', width: '180' },
        { field: 'returnTypeLabel', title: '旧件返回类型', width: '120' },
        { field: 'remark', title: '备注', width: '120' },
        { field: 'checkRemark', title: '验收备注', width: '120' }
      ]
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
