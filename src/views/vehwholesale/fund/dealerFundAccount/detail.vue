<template>
  <div class="page-common-detail m-account-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>账户编号：{{ info.fundAccountCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="160px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="账户编号：" prop="fundAccountCode">
              {{ info.fundAccountCode  }}
            </el-form-item>
            <el-form-item label="母公司名称：" prop="dealerCompanyName">
              {{ info.dealerCompanyName  }}
            </el-form-item>
            <el-form-item label="资金类型：" prop="fundType">
              {{ info.fundTypeLabel }}
            </el-form-item>
            <el-form-item label="金融机构：" prop="financialOrganizationName">
              {{ info.financialOrganizationName  }}
            </el-form-item>
            <el-form-item label="母公司编码：" prop="dealerCompanyCode">
              <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/partner/channelManagement/parentCompany/edit?id=' + info.dealerCompanyCode)">{{ info.dealerCompanyCode }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>余额信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="160px">
            <el-form-item label="可用余额：" prop="availableBalance">
              {{ info.availableBalance  }}
            </el-form-item>
            <el-form-item label="冻结余额：" prop="frozenBalance">
              {{ info.frozenBalance  }}
            </el-form-item>
            <el-form-item label="最近交易时间：" prop="lastTradeTime">
              {{ latestTransLog.transactionTime  }}
            </el-form-item>
            <el-form-item label="累计充值金额：" prop="totalRechargeAmount">
              {{ info.totalRechargeAmount  }}
            </el-form-item>
            <el-form-item label="累计结算金额：" prop="totalSettleAmount">
              {{ info.totalSettleAmount  }}
            </el-form-item>
            <el-form-item label="最近交易金额：" prop="lastTradeTime">
              {{ latestTransLog.transactionAmount  }}
            </el-form-item>
            <el-form-item label="最近交易类型：" prop="lastTradeTime">
              {{ latestTransLog.transactionTypeLabel  }}
            </el-form-item>
            <el-form-item label="最近交易描述：" prop="lastTradeTime">
              {{ latestTransLog.remark  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>余额信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="160px">
            <el-form-item label="是否允许使用返利：" prop="allowUseRebate">
              {{ info.allowUseRebateLabel  }}
            </el-form-item>
            <el-form-item label="是否允许企业订单结算：" prop="allowEntOrderSettle">
              {{ info.allowEntOrderSettleLabel  }}
            </el-form-item>
            <el-form-item label="企业订单额度系数：" prop="entOrderQuota">
              {{ info.entOrderQuota  }}
            </el-form-item>
            <el-form-item label="资金结算顺序：" prop="settleSort">
              {{ info.settleSort  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>账户流水</h2>
        </div>
        <div class="common-section-body">
          <edit-table
            ref="editTable"
            :columns="columns"
            :data="tableData"
            :show-toolbar="false"
            :show-pagination="true"
            :total="total"
            @current-page-change="pageChange"
            @page-size-change="sizeChange"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehwholesale/fund/account/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditTable from '@/libs/components/EditTable';
import { getList } from '@/api/vehwholesale/fund/accountTranslog/index';

const pageSize = 10;
export default {
  name: 'accountDetail',
  mixins: [permissions, commonMixins],
  components: {
    EditTable
  },
  data () {
    return {
      pageTitle: '整车资金账户',
      pageType: 'detail',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-account',
      loading: true,
      info: {},
      latestTransLog: {},
      yes_no_enum_map: YES_NO_ENUM_MAP,
      columns: [
        { field: 'transLogCode', title: '流水编号', width: 240 },
        { field: 'transactionTypeLabel', title: '交易类型', width: 120 },
        { field: 'transactionAmount', title: '交易金额', width: 160 },
        { field: 'transactionTime', title: '过账时间', width: 200 },
        { field: 'transactionTime', title: '入账凭证时间', width: 200 },
        { field: 'lineNo', title: '行项目号', width: 200 },
        { field: 'remark', title: '备注', width: 260 },
        { field: 'vin', title: 'VIN码', width: 200 },
        { field: 'wholesaleOrderCode', title: '整车补货订单', width: 200 },
        { field: 'entVehorderCode', title: '企业客户整车订单', width: 200 },
        { field: 'deliveryOrderCode', title: '交车单', width: 200 },
        { field: 'dealerName', title: '门店', width: 200 },
        { field: 'createTime', title: '创建时间', width: 200 },
      ],
      optionObj: {
        form: {
          page: 1,
          size: pageSize
        }
      },
      total: 0,
      tableData: [],
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车资金账户', '详情']);
    this.getData();
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
    },
    pageChange (page) {
      this.optionObj.form.page = page;
      this.getList();
    },
    sizeChange (size) {
      this.optionObj.form.size = size;
      this.getList();
    },
    getList () {
      getList({ fundAccountId: this.$route.query.id, pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.tableData = res.records;
          this.total = res.total;
        }).catch(() => {
          this.tableData = [];
          this.loading = false;
        });
    },
    handleEdit () {
      this.$router.push({
        path: '/vehwholesale/fund/account/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
        this.latestTransLog = res.latestTransLog ?? {};
        this.getList();
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
