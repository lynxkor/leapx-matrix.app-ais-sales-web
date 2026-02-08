<template>
  <div class="component-table">
    <vxe-table
      ref="table"
      :data="tableData"
      stripe
      resizable
      border="inner"
      size="medium"
      height="auto"
      min-height="200px"
      max-height="300px"
      width="1000px"
      :loading="loading"
      :checkbox-config="{ checkField: 'checked' }"
    >
      <vxe-column
        v-for="column in columns"
        :key="column.field || column.title"
        v-bind="column"
      />
    </vxe-table>

    <!-- 分页组件 -->
    <div v-if="showPagination" :style="{ textAlign: paginationAlign }">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="paginationLayout"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentTable',
  props: {
    // API方法，接收参数并返回Promise
    apiMethod: {
      type: Function,
      default: null
    },
    columns: {
      type: Array,
      default: () => []
    },
    // 控制是否显示分页
    showPagination: {
      type: Boolean,
      default: true
    },
    // 额外的参数对象
    extraParams: {
      type: Object,
      default: () => ({})
    },
    // 分页相关配置
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100]
    },
    paginationLayout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    paginationAlign: {
      type: String,
      default: 'left'
    }
  },
  data () {
    return {
      tableData: [],
      total: 0,
      loading: false,
      currentPage: 1,
      pageSize: 10
    };
  },
  watch: {
    // 监听额外参数变化，重新加载数据
    extraParams: {
      handler () {
        this.loadData();
      },
      deep: true
    },
    // 监听API方法变化，当API方法改变时重新加载数据
    apiMethod () {
      if (this.apiMethod) {
        this.loadData();
      }
    }
  },
  created () {
    // console.log('1111:', this.$route.query);
    if (this.apiMethod) {
      this.loadData();
    }
  },
  methods: {
    // 加载数据
    async loadData () {
      // 如果没有API方法，则不执行加载
      if (!this.apiMethod) {
        return;
      }
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize,
          ...this.extraParams
        };

        const response = await this.apiMethod(params);
        this.tableData = response.data || [];
        this.total = response.total || response.count || 0;
      } catch (error) {
        console.error('Failed to load data:', error);
        this.tableData = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
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
    // 处理每页数量变化
    handleSizeChange (val) {
      this.pageSize = val;
      this.loadData();
    },
    // 处理当前页变化
    handleCurrentChange (val) {
      this.currentPage = val;
      this.loadData();
    },
    // 刷新数据的方法，供外部调用
    refresh () {
      this.loadData();
    },
    // 供外部设置当前页的方法
    setCurrentPage (page) {
      this.currentPage = page;
      this.loadData();
    },
    // 供外部设置页面大小的方法
    setPageSize (size) {
      this.pageSize = size;
      this.loadData();
    }
  }
};
</script>

<style scoped lang="scss">
/* .component-table {
  position: relative;
} */
</style>
