<template>
  <div class="component-table-container">
    <el-dialog title="整车账户余额" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <section class="common-section" >
      <div class="common-section-header" :data-section="sectionKey" >
        <!-- <h2>{{ tableConfig.title }}</h2> -->
      </div>
      <div class="common-section-body">
        <div class="common-section-table">
          <div class="component-table">
            {{ tableDataExternal }}
            <vxe-table
              ref="table"
              :data="tableDataExternal"
              stripe
              resizable
              border="inner"
              size="medium"
              height="auto"
              min-height="200px"
              max-height="300px"
              width="1000px"
              :checkbox-config="{ checkField: 'checked' }"
            >
              <vxe-column
                v-for="column in columns"
                :key="column.field || column.title"
                :width="column.width"
                :align="column.align || 'center'"
                :field="column.field "
                :title="column.title"
              >
                <template v-slot:default="slotData">
                  <slot :name="column.slots?.default" v-bind="slotData" />
                </template>
              </vxe-column>
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
        </div>
      </div>
    </section>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'ComponentTable',
  props: {
    tableConfig: {
      type: Object,
      default: () => {}
    },
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
    visible: {
      type: Boolean,
      default: false
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
    },
    // 外部传入的数据
    tableDataExternal: {
      type: Array,
      default: null
    },
    // section 标识
    sectionKey: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      internalTableData: [],
      total: 0,
      loading: false,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    // 计算属性：优先使用外部传入的数据，否则使用内部数据
    tableData () {
      return this.tableDataExternal !== null && this.tableDataExternal !== undefined
        ? this.tableDataExternal
        : this.internalTableData;
    },
    dialogVisible: {
      get () {
        return this.visible;
      },
      set (val) {
        this.$emit('update:visible', val);
      }
    }
  },
  watch: {
    // 监听额外参数变化，重新加载数据
    extraParams: {
      handler () {
        // 只有当没有外部传入数据时才重新加载
        if (this.tableDataExternal === null || this.tableDataExternal === undefined) {
          this.loadData();
        }
      },
      deep: true
    },
    // 监听API方法变化，当API方法改变时重新加载数据
    apiMethod () {
      if (this.apiMethod && (this.tableDataExternal === null || this.tableDataExternal === undefined)) {
        this.loadData();
      }
    },
    // 监听外部传入的数据变化
    tableDataExternal: {
      handler (newVal) {
        if (newVal !== null && newVal !== undefined) {
          // 当外部传入新数据时，更新内部数据
          this.internalTableData = newVal;
        }
      },
      deep: true
    }
  },
  created () {
    // 如果有外部数据则使用外部数据，否则加载内部数据
    if (this.tableDataExternal === null || this.tableDataExternal === undefined) {
      if (this.apiMethod) {
        this.loadData();
      }
    } else {
      this.internalTableData = this.tableDataExternal;
    }
  },
  methods: {
    // 加载数据
    async loadData () {
      // 如果没有API方法或者已有外部数据，则不执行加载
      if (!this.apiMethod || (this.tableDataExternal !== null && this.tableDataExternal !== undefined)) {
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
        console.log('Response:', response);
        this.internalTableData = response.data || response.records || response || [];
        this.total = response.totals || response.count || 0;
      } catch (error) {
        console.error('Failed to load data:', error);
        this.internalTableData = [];
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
      // 只有当没有外部传入数据时才重新加载
      if (this.tableDataExternal === null || this.tableDataExternal === undefined) {
        this.loadData();
      }
    },
    // 处理当前页变化
    handleCurrentChange (val) {
      this.currentPage = val;
      // 只有当没有外部传入数据时才重新加载
      if (this.tableDataExternal === null || this.tableDataExternal === undefined) {
        this.loadData();
      }
    },
    // 刷新数据的方法，供外部调用
    refresh () {
      // 只有当没有外部传入数据时才重新加载
      if (this.tableDataExternal === null || this.tableDataExternal === undefined) {
        this.loadData();
      }
    },
    // 供外部设置当前页的方法
    setCurrentPage (page) {
      this.currentPage = page;
      // 只有当没有外部传入数据时才重新加载
      if (this.tableDataExternal === null || this.tableDataExternal === undefined) {
        this.loadData();
      }
    },
    // 供外部设置页面大小的方法
    setPageSize (size) {
      this.pageSize = size;
      // 只有当没有外部传入数据时才重新加载
      if (this.tableDataExternal === null || this.tableDataExternal === undefined) {
        this.loadData();
      }
    },
    // 获取内部数据的方法（用于外部访问）
    getInternalData () {
      return this.internalTableData;
    }
  }
};
</script>

<style scoped lang="scss">
/* .component-table {
  position: relative;
} */
</style>
