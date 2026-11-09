<template>
  <el-dialog
    title="整车资金账户信息"
    :visible.sync="dialogVisible"
    width="85%"
    top="5vh"
    :close-on-click-modal="false"
    append-to-body
    @open="handleOpen"
  >
    <el-table
      v-loading="loading"
      :data="accountList"
      border
      stripe
      size="small"
      height="500"
    >
      <el-table-column label="资金类型" width="220">
        <template slot-scope="{ row }">
          <el-link
            type="primary"
            :href="`/sales/vehwholesale/fund/dealerFundAccount/edit?id=${row.id}`"
            target="_blank"
          >
            {{ row.financialOrganizationName
              ? `${row.fundTypeLabel}（${row.financialOrganizationName}）`
              : (row.fundTypeLabel || '') }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="availableBalance" label="可用余额" align="right" min-width="140" />
      <el-table-column prop="frozenBalance"  label="冻结资金" align="right" min-width="140" />
      <el-table-column prop="creditSalesLimit.availableCreditAmount" label="剩余可用额度" align="right" min-width="140" />
      <el-table-column prop="creditSalesLimit.downPaymentRatio"     label="首付款比例%" align="right" min-width="120" />
      <el-table-column prop="creditSalesLimit.creditAccountStatusLabel" label="赊销账户状态" min-width="140" />
      <el-table-column prop="creditSalesLimit.effectiveTime" label="额度生效日期" min-width="140" />
      <el-table-column prop="creditSalesLimit.expireTime"    label="额度失效日期" min-width="140" />
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getList } from '@/api/vehwholesale/fund/account/index';

// 默认最多展示 100 条 + 仅展示启用账户（status=1）
const MAX_PAGE_SIZE = 100;
const STATUS_ENABLED = 1;

export default {
  name: 'FundAccountInfoDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      loading: false,
      accountList: []
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    dialogVisible (val) {
      this.$emit('update:visible', val);
      if (val) {
        this.fetchAccountList();
      }
    }
  },
  methods: {
    handleOpen () {
      // 每次打开都重新拉，保证数据最新
      this.fetchAccountList();
    },
    fetchAccountList () {
      this.loading = true;
      getList({ status: STATUS_ENABLED, pageNum: 1, pageSize: MAX_PAGE_SIZE })
        .then(res => {
          this.accountList = (res && res.records) || [];
        })
        .catch(() => {
          this.accountList = [];
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
