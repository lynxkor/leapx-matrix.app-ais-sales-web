<template>
  <div class="page-common-detail m-fund-own-credit-sales-detail-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>自有资金赊销明细</h2>
        <!-- <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button> -->
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基本信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">

            <!-- // 自有资金赊销额度的编号 -->
            <el-form-item label="赊销账户编号：" prop="fundAccountCode">
              {{ info.fundAccountCode  }}
            </el-form-item>
            <el-form-item label="母公司名称：" prop="dealerCompanyName">
              {{ info.dealerCompanyName  }}
            </el-form-item>
            <el-form-item label="资金账户编号：" prop="fundAccountId">
              <!-- 整车资金账户的编号 -->
              {{ info.fundAccountId  }}
            </el-form-item>
            <el-form-item label="赊销明细编号：" prop="creditSalesDetailCode">
              {{ info.creditSalesDetailCode  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="结算资金类型：" prop="fundTypeLabel">
              {{ info.fundTypeLabel  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="VIN号：" prop="vin">
              {{ info.vin  }}
            </el-form-item>
            <el-form-item label="整车批售订单：" prop="wholesaleOrderCode">
              {{ info.wholesaleOrderCode  }}
            </el-form-item>
            <el-form-item label="企业客户整车订单：" prop="entVehorderCode">
              {{ info.entVehorderCode  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>赊销信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="车辆价格：" prop="retailPrice">
              {{ info.retailPrice  }}
            </el-form-item>
            <el-form-item label="批售价/折扣价：" prop="wholesalePrice">
              {{ info.wholesalePrice  }}
            </el-form-item>
            <el-form-item label="首付款比例：" prop="downPaymentRatio">
              {{ info.downPaymentRatio  }}
            </el-form-item>
            <el-form-item label="现金金额：" prop="cashAmount">
              {{ info.cashAmount  }}
            </el-form-item>
            <el-form-item label="返利金额：" prop="rebateAmount">
              {{ info.rebateAmount  }}
            </el-form-item>
            <el-form-item label="赊销金额：" prop="creditSalesAmount">
              {{ info.creditSalesAmount  }}
            </el-form-item>
            <el-form-item label="赊销时间：" prop="creditSalesTime">
              {{ info.creditSalesTime  }}
            </el-form-item>
            <el-form-item label="还款时间：" prop="repaymentTime">
              {{ info.repaymentTime  }}
            </el-form-item>
            <el-form-item label="赊销天数：" prop="creditSalesDays">
              {{ info.creditSalesDays  }}
            </el-form-item>
            <el-form-item label="赊销费用：" prop="creditSalesFee">
              {{ info.creditSalesFee  }}
            </el-form-item>
            <el-form-item label="超期赊销费用：" prop="overdueFee">
              {{ info.overdueFee  }}
            </el-form-item>
            <el-form-item label="违约金：" prop="penaltyFee">
              {{ info.penaltyFee  }}
            </el-form-item>
            <el-form-item label="凭证编号：" prop="voucherNo">
              {{ info.voucherNo  }}
            </el-form-item>
            <el-form-item label="合格证赎回申请：" prop="certificateRedemptionApplyId">
              {{ info.certificateRedemptionApplyId  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehwholesale/creditsales/fundOwnCreditSalesDetail/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'fundOwnCreditSalesDetailDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '自有资金赊销明细',
      pageType: 'detail',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundOwnCreditSalesDetail',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['自有资金赊销明细', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
