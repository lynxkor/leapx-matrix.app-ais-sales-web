<template>
  <el-dialog
    class="m-vin-dialog"
    title="选择车辆"
    width="1400px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
    append-to-body
    :z-index="2002"
  >
    <el-form
      ref="searchForm"
      :model="searchForm"
      label-width="120px"
      :inline="true"
      size="small"
      label-position="right"
      class="ais-search-form"
    >
      <el-form-item label="VIN：">
        <el-input v-model="searchForm.vinLike" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="page-common m-account-list">
      <div class="table-container">
        <vxe-table
          ref="vinTable"
          :data="vinList"
          height="400"
          :radio-config="{ highlight: true }"
          @radio-change="handleRadioChange"
        >
          <vxe-column type="radio" width="60" align="center" />
          <vxe-column field="vin" title="VIN" width="200" show-overflow-tooltip />
          <vxe-column field="materialsDesc" title="物料描述" min-width="200" show-overflow-tooltip />
          <vxe-column field="vechicleStatusLabel" title="车辆状态" width="120" />
          <vxe-column field="moveTypeLabel" title="入库状态" width="120" />
          <vxe-column field="saleDealerName" title="销售门店" width="220" />
          <vxe-column field="parentCompanyName" title="所属母公司" width="240" />
          <vxe-column field="deliveryDealerName" title="专属交付门店" width="240" />
          <vxe-column field="dealerWarehouseName" title="门店仓库" width="240" />
        </vxe-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 10px; text-align: right;"
        />
      </div>
    </div>

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" type="primary" :disabled="!selectedRow" @click="confirmSelection">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { getList } from '@/api/vehstock/store/storeInventoryLedger/index';

const defaultSearchForm = {
  vinLike: '',
  // 固定筛选条件
  logisticStatusList: [12, 16, 20], // 已入门店库/在途/待提交 PDI
  lockStatus: 0, // 未锁定
  reservationStatus: 20 // 正常车辆
};

export default {
  name: 'VinDialog',
  props: {
    useExternalConfirm: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dialogVisible: false,
      searchForm: { ...defaultSearchForm },
      vinList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      selectedRow: null,
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
    };
  },
  methods: {
    // 打开对话框
    show () {
      this.dialogVisible = true;
      this.loadData();
    },

    // 关闭对话框
    close () {
      this.dialogVisible = false;
    },

    // 对话框关闭后的回调
    closed () {
      this.searchForm = { ...defaultSearchForm };
      this.vinList = [];
      this.selectedRow = null;
      this.currentPage = 1;
      this.total = 0;
      this.$refs.searchForm && this.$refs.searchForm.resetFields();
    },

    // 加载车辆数据
    async loadData () {
      try {
        const params = {
          ...this.searchForm,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        };

        // 过滤掉空值参数
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key];
          }
        });

        const res = await getList(params);
        this.vinList = res.records || [];
        this.total = res.total || 0;
      } catch (error) {
        this.$message.error('获取车辆列表失败');
      }
    },

    // 查询
    handleSearch () {
      this.currentPage = 1;
      this.loadData();
    },

    // 重置
    handleReset () {
      this.searchForm = { ...defaultSearchForm };
      this.currentPage = 1;
      this.loadData();
    },

    // 页大小改变
    handleSizeChange (val) {
      this.pageSize = val;
      this.loadData();
    },

    // 当前页改变
    handleCurrentChange (val) {
      this.currentPage = val;
      this.loadData();
    },

    // 单选事件
    handleRadioChange ({ row }) {
      this.selectedRow = row;
    },

    // 确认选择
    confirmSelection () {
      if (!this.selectedRow) {
        this.$message.warning('请勾选一条车辆记录');
        return;
      }
      if (this.useExternalConfirm) {
        this.$emit('confirm', this.selectedRow);
        this.close();
      } else {
        this.handleInternalSubmit();
      }
    },

    // 内部提交处理方法
    handleInternalSubmit () {
      this.$message.success('车辆选择成功');
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.m-vin-dialog {
  .table-container {
    margin-top: 20px;
  }

  ::v-deep .el-input--small {
    width: 215px;
  }

  ::v-deep .el-form-item {
    margin-bottom: 12px;
    margin-right: 15px;
  }

  .dialog-footer {
    text-align: right;
  }
}
</style>
