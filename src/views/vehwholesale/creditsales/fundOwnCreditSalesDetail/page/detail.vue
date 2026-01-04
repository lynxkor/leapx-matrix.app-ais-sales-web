<template>
  <div class="page-common-detail m-page-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>赊销明细编号：{{ info.creditSalesDetailCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="赊销明细编号：" prop="creditSalesDetailCode">
              {{ info.creditSalesDetailCode  }}
            </el-form-item>
            <el-form-item label="母公司名称：" prop="dealerCompanyName">
              {{ info.dealerCompanyName  }}
            </el-form-item>
            <el-form-item label="母公司编码：" prop="dealerCompanyCode">
              {{ info.dealerCompanyCode  }}
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              {{ info.dealerCode  }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="整车批售订单：" prop="wholesaleOrderCode">
              {{ info.wholesaleOrderCode  }}
            </el-form-item>
            <el-form-item label="企业客户整车订单：" prop="entVehorderCode">
              {{ info.entVehorderCode  }}
            </el-form-item>
            <el-form-item label="整车VIN编码：" prop="vin">
              {{ info.vin  }}
            </el-form-item>
            <el-form-item label="批售价&#x2F;折扣价：" prop="wholesalePrice">
              {{ info.wholesalePrice  }}
            </el-form-item>
            <el-form-item label="现金金额：" prop="cashAmount">
              {{ info.cashAmount  }}
            </el-form-item>
            <el-form-item label="返利金额：" prop="rebateAmount">
              {{ info.rebateAmount  }}
            </el-form-item>
            <el-form-item label="首付款比例，如0.15：" prop="downPaymentRatio">
              {{ info.downPaymentRatio  }}
            </el-form-item>
            <el-form-item label="赊销金额：" prop="creditSalesAmount">
              {{ info.creditSalesAmount  }}
            </el-form-item>
            <el-form-item label="赊销时间：" prop="creditSalesTime">
              {{ info.creditSalesTime  }}
            </el-form-item>
            <el-form-item label="赊销天数：" prop="creditSalesDays">
              {{ info.creditSalesDays  }}
            </el-form-item>
            <el-form-item label="还款时间：" prop="repaymentTime">
              {{ info.repaymentTime  }}
            </el-form-item>
            <el-form-item label="还款金额：" prop="repaymentAmount">
              {{ info.repaymentAmount  }}
            </el-form-item>
            <el-form-item label="赊销费用：" prop="creditSalesFee">
              {{ info.creditSalesFee  }}
            </el-form-item>
            <el-form-item label="合格证赎回申请ID：" prop="certificateRedemptionApplyId">
              {{ info.certificateRedemptionApplyId  }}
            </el-form-item>
            <el-form-item label="超期赊销费用：" prop="overdueFee">
              {{ info.overdueFee  }}
            </el-form-item>
            <el-form-item label="违约金：" prop="penaltyFee">
              {{ info.penaltyFee  }}
            </el-form-item>
            <el-form-item label="凭证号：" prop="voucherNo">
              {{ info.voucherNo  }}
            </el-form-item>
            <el-form-item label="创建人：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="修改人：" prop="modifierName">
              {{ info.modifierName  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="主键：" prop="id">
              {{ info.id  }}
            </el-form-item>
            <el-form-item label="创建者：" prop="creator">
              {{ info.creator  }}
            </el-form-item>
            <el-form-item label="修改者：" prop="modifier">
              {{ info.modifier  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="是否还款：" prop="repaymentFlag">
              {{ info.repaymentFlag  }}
            </el-form-item>
            <el-form-item label="企业客户整车订单ID：" prop="entVehorderId">
              {{ info.entVehorderId  }}
            </el-form-item>
            <el-form-item label="批售订单ID：" prop="wholesaleOrderId">
              {{ info.wholesaleOrderId  }}
            </el-form-item>
            <el-form-item label="关联资金账户ID：" prop="fundAccountId">
              {{ info.fundAccountId  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehwholesale/creditsales/fundOwnCreditSalesDetail/page/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'pageDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '账户管理-赊销管理-自有资金赊销明细管理',
      pageType: 'detail',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-page',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['账户管理-赊销管理-自有资金赊销明细管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail/page/edit',
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
