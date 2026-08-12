<template>
  <el-dialog
    class="financial-order-dialog"
    title="金融订单列表"
    :visible.sync="visible"
    width="60%"
    top="5vh"
  >
    <div class="financial-order-content">
      <div class="table-container">
        <vxe-table
          ref="tableRef"
          v-loading="loading"
          :data="optionObj.dataList"
          stripe
          resizable
          border="inner"
          size="medium"
          min-height="400px"
          :checkbox-config="{ checkField: 'checked' }"
        >
          <vxe-column
            v-for="col in optionObj.dataProp"
            :key="col.field"
            :field="col.field"
            :title="col.label"
            :width="col.width"
          >
            <template v-slot:default="{ row }">
              <span
                v-if="col.clickable"
                class="link-text"
                @click="handleCellClick(col.clickable, row)"
              >{{ row[col.field] }}</span>
              <span v-else>{{ row[col.field] }}</span>
            </template>
          </vxe-column>
        </vxe-table>
        <div class="pagination-container">
          <el-pagination
            :current-page="optionObj.form.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="optionObj.form.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="optionObj.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getList } from '@/api/vehretail/financeSubsidy/vrFinanceOrder/index';

const pageSize = 20;

export default {
  name: 'FinancialOrderDialog',
  components: {
  },
  data () {
    return {
      visible: false,
      loading: false,
      form: {
        mallOrderCode: ''
      },
      optionObj: {
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { field: 'code', label: '金融订单号', width: 180, clickable: 'financeOrder' },
          { field: 'financeOrderStatusLabel', label: '金融订单状态', width: 120 },
          { field: 'financeOrganizationName', label: '金融机构', width: 150, clickable: 'financeOrganization' },
          { field: 'cancelReason', label: '取消原因', width: 150 },
          { field: 'installmentOrderCode', label: '分期订单号', width: 180 },
          { field: 'createTime', label: '创建时间', width: 180 }
        ],
        total: 0
      }
    };
  },
  methods: {
    show (mallOrderCode) {
      this.visible = true;
      if (mallOrderCode) {
        this.form.mallOrderCode = mallOrderCode;
      }
      this.$nextTick(() => {
        this.getData();
      });
    },
    hide () {
      this.visible = false;
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = {
        mallOrderCode: ''
      };
      this.optionObj.form.page = 1;
      this.getData();
    },
    getData () {
      this.loading = true;
      const params = {
        mallOrderCode: this.form.mallOrderCode,
        pageNum: this.optionObj.form.page,
        pageSize: this.optionObj.form.size
      };
      // 过滤空值
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      getList(params)
        .then(res => {
          this.optionObj.dataList = res.records || [];
          this.optionObj.total = res.total || 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSizeChange (val) {
      this.optionObj.form.size = val;
      this.optionObj.form.page = 1;
      this.getData();
    },
    handleCurrentChange (val) {
      this.optionObj.form.page = val;
      this.getData();
    },
    handleCellClick (type, row) {
      if (type === 'financeOrder') {
        // 跳转到金融订单详情
        this.$router.push({
          path: '/vehretail/financeSubsidy/vrFinanceOrder/edit',
          query: {
            id: row.id
          }
        });
      } else if (type === 'financeOrganization') {
        // 跳转到金融机构详情
        this.$router.push({
          path: '/vehretail/financeSubsidy/vrFinanceOrganization/edit',
          query: {
            id: row.financeOrganizationId
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.financial-order-dialog {
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  .financial-order-content {
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
  .ais-search-form {
    border-bottom: 1px solid var(--leap-color-default-light-4);
    padding-bottom: 4px;
  }
  .table-container {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .pagination-container {
    margin-top: 16px;
    text-align: right;
  }
  .link-text {
    color: var(--leap-color-primary);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
