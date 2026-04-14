<template>
  <el-dialog
    class="order-select-dialog"
    :title="dialogTitle"
    width="1200px"
    :visible.sync="dialogVisible"
    @close="close"
    append-to-body
  >
    <div class="dialog-content">
      <div class="search-box">
        <el-input
          v-model="query"
          placeholder="请输入关键词搜索"
          clearable
          @keyup.enter.native="handleSearch"
          style="width: 300px; margin-right: 10px;margin-bottom: 10px;"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      <vxe-table
        ref="tableRef"
        :data="tableData"
        stripe
        border
        size="medium"
        height="400px"
        :radio-config="{ trigger: 'row' }"
        @radio-change="handleRadioChange"
        v-loading="loading"
        show-overflow
      >
        <vxe-column type="radio" width="50" align="center" />
        <vxe-column
          v-for="col in columns"
          :key="col.field"
          :field="col.field"
          :title="col.title"
          :width="col.width"
          show-overflow
        />
      </vxe-table>
      <div class="pagination-wrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { listWholesaleOrEntOrder } from '@/api/vehwholesale/certificate/vehicleCertificateRedemption/index';

export default {
  name: 'WholesaleOrderDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderType: {
      type: [String, Number],
      default: '10'
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      query: '',
      tableData: [],
      selectedRow: null,
      loading: false,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  computed: {
    dialogTitle () {
      return this.orderType === '10' || this.orderType === 10 ? '选择整车批售订单' : '选择企业客户整车订单';
    },
    columns () {
      if (this.orderType === '10' || this.orderType === 10) {
        return [
          { field: 'wholesaleOrderCode', title: '整车批售订单号', width: '220' },
          { field: 'orderMaterialsCode', title: '整车物料编码', width: '160' },
          { field: 'vin', title: 'VIN码', width: '180' },
          { field: 'orderMaterialsDesc', title: '物料描述', width: '300' },
          { field: 'modelName', title: '车型', width: '140' },
          { field: 'wholesalePrice', title: '批售价', width: '120' },
          { field: 'statusLabel', title: '订单状态', width: '140' },
          { field: 'orderCategoryLabel', title: '订单分类', width: '140' },
        ];
      } else {
        return [
          { field: 'entOrderCode', title: '企业客户订单号', width: '220' },
          { field: 'orderMaterialsCode', title: '整车物料编码', width: '160' },
          { field: 'vin', title: 'VIN码', width: '180' },
          { field: 'orderMaterialsDesc', title: '物料描述', width: '300' },
          { field: 'modelName', title: '车型', width: '140' },
          { field: 'salesPrice', title: '销售价格', width: '120' },
          { field: 'statusLabel', title: '订单状态', width: '140' },
          { field: 'orderCategoryLabel', title: '订单分类', width: '140' },
        ];
      }
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.query = '';
        this.pagination.pageNum = 1;
        this.selectedRow = null;
        this.loadData();
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    handleSearch () {
      this.pagination.pageNum = 1;
      this.loadData();
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val;
      this.pagination.pageNum = 1;
      this.loadData();
    },
    handleCurrentChange (val) {
      this.pagination.pageNum = val;
      this.loadData();
    },
    handleRadioChange ({ row }) {
      this.selectedRow = row;
    },
    handleConfirm () {
      if (!this.selectedRow) {
        this.$message.warning('请选择一条数据');
        return;
      }
      this.$emit('confirm', this.selectedRow);
      this.close();
    },
    loadData () {
      this.loading = true;
      const orderType = Number(this.orderType) === 10 ? 10 : 20;
      listWholesaleOrEntOrder({
        query: this.query,
        orderType: orderType,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.tableData = res.records || [];
        this.pagination.total = res.total || 0;
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.order-select-dialog {
  ::v-deep .el-dialog {
    margin-top: 80px;
  }
  .dialog-content {
    .search-box {
      display: flex;
      align-items: center;
    }
    .pagination-wrap {
      margin-top: 16px;
      text-align: right;
    }
  }
}
</style>
