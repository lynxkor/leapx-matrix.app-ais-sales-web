<template>
  <expand-table
    ref="editTable"
    :dynamic-buttons="isReadOnly ? [] : dynamicButtons"
    :columns="columns"
    :data="tableData"
    :defaultNewRow="defaultNewRow"
    :show-toolbar="false"
    :checkbox="!isReadOnly"
    :options="options"
    :auth="isReadOnly ? {} : { delete: canAddOrUpdate }"
    :isFocusNewRow="false"
    :enableSingleRowSave="true"
    :showPagination="true"
    :current="current"
    :pageSize="pageSize"
    :total="total"
    @save-row-edit="saveRowEdit"
    @remove-row="handleRemoveRow"
    @page-size-change="pageSizeChange"
    @current-page-change="currentPageChange"
    @checkboxChange="checkboxChange"
    :actionWidth="200"
    :emptyText="_id ? '' : '新增后，即可添加'"
  >
  </expand-table>
</template>
<script>
import {
  productSkuPage, // 分页
  productSkuAddOrUpdate, // 新增/编辑
  productSkuDelete // 删除
} from '@/api/vehretail/productManager/productCenter/index';
import expandTable from '@/libs/components/expandTable';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'pricingTable',
  props: {
    moduleKey: {
      type: String,
    },
    tableType: {
      type: String,
    },
    id: {
      type: String,
    },
    // 只读模式：商品状态为 1 时禁用编辑/删除/勾选
    readonly: {
      type: Boolean,
      default: false
    }
  },
  components: {
    expandTable,
  },
  mixins: [permissions],
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    },
    // readonly 优先级高于 tableType
    isReadOnly () {
      return this.readonly || this.tableType === 'detail';
    }
  },
  data () {
    return {
      // 动态按钮配置
      dynamicButtons: [
        {
          label: '编辑',
          class: 'btn-edit',
          onClick: (row, rowIndex) => {
            this.handleEdit(row, rowIndex);
          },
        }
      ],
      defaultNewRow: {
        partId: '',
        partCode: '',
        partName: '',
        purchasePrice: '',
        partQuantity: '',
      },
      current: 1,
      pageSize: 20,
      total: 0,
      tableData: [],
      options: {
      },
      columns: [
        {
          field: 'skuCode',
          title: 'SKU编码',
          width: 150,
          editable: false,
        },
        {
          field: 'saleAttribute',
          title: '销售属性',
          editable: false,
        },
        {
          field: 'marketGuidePrice',
          title: '市场指导价',
          editable: false,
          align: 'right',
          width: 220,
        },
        {
          field: 'materialsCode',
          title: '物料编码',
          editable: false,
          width: 200,
        },
        {
          field: 'statusLabel',
          title: '状态',
          editable: false,
          width: 120,
        },
      ],
      selectedRow: {},
    };
  },
  watch: {
    id: {
      handler (val) {
        this.getDetailPageApi();
      }
    }
  },
  mounted () {
    this.getDetailPageApi();
  },
  beforeDestroy () {
  },
  methods: {
    handleEdit (row, rowIndex) {
      this.$emit('replace', row, rowIndex);
    },
    // 表格数据
    getDetailPageApi () {
      productSkuPage({
        productId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    handleRemoveRow (row, index) {
      if (!row.id) {
        return;
      }
      productSkuDelete([row.id]).then(() => {
        this.$message.success('删除成功');
        this.getDetailPageApi();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
      // const parmas = {
      //   id: row.id,
      //   partId: row.partId, // 零件ID
      //   partQuantity: row.partQuantity, // 零件数量
      // };
      // return;
      productSkuAddOrUpdate(row).then(id => {
        defer.resolve(id);
        this.$message.success('更新成功');
        this.getDetailPageApi();
      }).catch(e => {
        defer.reject();
      });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getDetailPageApi();
    },
    checkboxChange (selection) {
      this.$emit('checkboxChange', selection);
    },
    currentPageChange (current) {
      this.current = current;
      this.getDetailPageApi();
    },
    // -------------
    handleAdd (newItem) {
      this.$refs.editTable.addRow(newItem);
    },
    onReplace (row, rowIndex) {
      this.selectedRow = row;
      this.$emit('replace', row, rowIndex);
    }
  },
};

</script>
<style lang="scss" scoped>
  .action-button{
    margin: 0 5px;
    cursor: pointer;
    &.btn-edit{
      color:#4C4CD6;
    }
    &.active{
      text-decoration: underline;
    }
  }
</style>
