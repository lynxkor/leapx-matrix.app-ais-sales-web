<template>
  <edit-table
    ref="editTable"
    :columns="columns"
    :data="tableData"
    :defaultNewRow="defaultNewRow"
    :show-toolbar="false"
    :options="options"
    :auth="tableType === 'detail' ? {} : { edit: canAddOrUpdate, delete: canAddOrUpdate }"
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
    :actionWidth="200"
    :emptyText="_id ? '' : '新增后，即可添加'"
  >
  </edit-table>
</template>
<script>
import {
  productSaleAttributePage, // 分页
  productSaleAttributeAddOrUpdate, // 新增/编辑
  productSaleAttributeDelete // 删除
} from '@/api/vehretail/productManager/productCenter/index';
import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'attributeable',
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
  },
  components: {
    EditTable,
  },
  mixins: [permissions],
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    }
  },
  data () {
    return {
      defaultNewRow: {
        attributeSort: '',
        attributeName: '',
        attributeValue: ''
      },
      current: 1,
      pageSize: 20,
      total: 0,
      tableData: [],
      options: {
      },
      columns: [
        {
          field: 'attributeSort',
          title: '属性序号',
          width: '20%',
          editable: true,
          editRender: {
            name: 'ElInputNumber',
            props: {
              controls: false,
              precision: 0,
              min: 1,
              step: 1,
            }
          },
          rules: [
            {
              required: true,
              message: '属性序号不能为空',
              trigger: 'blur'
            }
          ]
        },
        {
          field: 'attributeName',
          title: '属性名称',
          editable: true,
          width: '30%',
          editRender: {
            name: 'ElInput',
            props: {
              maxlength: 30,
              placeholder: '请输入属性名称',
              clearable: true
            },
          },
          rules: [
            {
              required: true,
              message: '属性名称不能为空',
              trigger: 'blur'
            }
          ]
        },
        {
          field: 'attributeValue',
          title: '属性值',
          editable: true,
          width: '33%',
          editRender: {
            name: 'ElInput',
            props: {
              maxlength: 30,
              placeholder: '请输入属性名称',
              clearable: true
            }
          },
          rules: [
            {
              required: true,
              message: '属性名称不能为空',
              trigger: 'blur'
            }
          ]
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
    // 表格数据
    getDetailPageApi () {
      productSaleAttributePage({
        productId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    handleRemoveRow (row, index, defer) {
      if (!row.attributeValueId) {
        return;
      }
      productSaleAttributeDelete([row.attributeValueId]).then((d) => {
        defer.resolve();
        this.$message.success('删除成功');
      }).catch(() => {
        defer.reject();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
      // const parmas = {
      //   id: row.id,
      //   partId: row.partId, // 零件ID
      //   partQuantity: row.partQuantity, // 零件数量
      // };
      console.log('row:', row);
      // return;
      productSaleAttributeAddOrUpdate(row).then(id => {
        defer.resolve(id);
        this.$message.success('更新成功');
        this.getDetailPageApi();
        this.$emit('replace');
      }).catch(e => {
        defer.reject();
      });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getDetailPageApi();
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
