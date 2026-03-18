<template>
  <el-dialog :title="title" width="1200px" :visible.sync="dialogVisible" @close="handleClose">
    <div class="page-common m-account-list">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :inline="true"
        size="small"
        label-position="right"
        class="ais-search-form"
      >
        <el-form-item label="VIN：">
          <el-input v-model="vinCode" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="">
          <el-button :loading="loading" size="medium" type="primary" plain class="btn-search" @click="onSubmit">查询</el-button>
          <el-button size="medium" class="btn-reset" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
      <section class="common-section">
        <div class="common-section-body">
          <div class="common-section-table">
            <vxe-table
            ref="table"
            :data="tableData"
            stripe
            resizable
            border="inner"
            size="medium"
            height="auto"
            width="1000px"
            min-height="300px"
            max-height="400px"
            @checkbox-change="handleCheckboxChange"
            @checkbox-all="handleCheckboxAll"
          >
            <vxe-column type="checkbox" width="50" fixed="left" />
            <vxe-column field="vin" title="VIN" align="center" width="150" />
            <vxe-column field="materialsCode" title="整车物料编码" align="center" width="120" />
            <vxe-column field="materialsDesc" title="物料描述" align="center"  width="150"/>
            <vxe-column field="reservedLabel" title="销售预留" align="center" width="150" />
            <vxe-column field="reservedTypeLabel" title="销售预留类型" align="center" width="150" />
            <vxe-column field="logisticsReservedLabel" title="整车物流预留" align="center" width="150" />
            <vxe-column field="vehicleDeliveryStatusLabel" title="车辆交付状态" align="center"  width="150"/>
            <vxe-column field="inboundDateTime" title="VDC入库时间" align="center" width="150" />
          </vxe-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
            style="margin-top: 20px;">
          </el-pagination>
          </div>
        </div>
      </section>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { listCanSettleAccount } from '@/api/vehwholesale/fund/account/index';
import { vinAllocateVehicleQueryInventory } from '@/api/vehwholesale/entorder/entVehicleOrder/index';
import permissions from '@/libs/mixins/permissions';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
};

export default {
  name: 'vinAllocateVehicle',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  mixins: [permissions],
  components: {
    // TagInput,
    // FetchSelect,
    // PageSearchAction
  },
  data () {
    return {
      title: '企业客户整车订单',
      moduleKey: 'AISVW-entVehicleOrder',
      loading: false,
      submitLoading: false,
      show: false,
      form: {
        ...defaultForm
      },
      fundForm: {
        fundType: ''
      },
      vinCode: '',
      tableData: [
      ],
      // 添加分页相关数据
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible;
      },
      set (val) {
        this.$emit('update:visible', val);
      }
    },
    // // 计算当前页数据
    currentTableData () {
      const start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
      const end = start + this.pagination.pageSize;
      return this.tableData.slice(start, end);
    }
  },
  created () {
    this.getData();
  },
  methods: {
    // 单选框变化
    handleCheckboxChange ({ records }) {
      this.selectedRows = records;
      console.log('选中的行:', this.selectedRows);
    },
    // 全选框变化
    handleCheckboxAll ({ records }) {
      this.selectedRows = records;
      console.log('全选的行:', this.selectedRows);
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1; // 切换每页显示数量时回到第一页
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val;
    },
    toggleShow () {
      this.show = !this.show;
    },
    listCanSettleAccount () {
      // 厂端不允许点开查询的 但是产品坚持要可以打开在最后一步骤提交校验
      listCanSettleAccount({}).then(res => {
      }).catch(err => { console.log(err); });
    },
    handleClose () {
      this.form = { ...defaultForm }; // 重置表单数据
      this.tableData = []; // 清空表格数据
    },
    onSubmit () {
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.fundForm = { fundType: '' };
    },
    async getData () {
      this.loading = true;
      try {
        const res = await vinAllocateVehicleQueryInventory({
          entOrderId: this._id
        });
        const data = res || {};
        // 设置表格数据
        this.tableData = res.records;
        this.pagination.total = this.tableData.length;
        this.pagination.currentPage = 1;
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async dialogshow () {
      await this.getData();
      await this.listCanSettleAccount();
      this.dialogVisible = true;
    },
    confirm () {
      this.dialogVisible = true;
      this.$refs.editTable.clearSelection();
      this.$emit('confirm', this.form);
    },
    handleCancel () {
      this.dialogVisible = false;
      this.handleClose();
    },
    handleSubmit () {
      if (this.selectedRows.length !== 1) {
        this.$message.error('请选择一条数据！');
        return;
      }
      this.dialogVisible = true;
      this.$emit('confirm', this.selectedRows[0].vin);
    },
  }
};
</script>

<style lang="scss" scoped>

</style>
