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
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="账户编号：" prop="fundAccountCode">
              {{ info.fundAccountCode  }}
            </el-form-item>
            <el-form-item label="母公司编码：" prop="dealerCompanyCode">
              {{ info.dealerCompanyCode  }}
            </el-form-item>
            <el-form-item label="母公司名称：" prop="dealerCompanyName">
              {{ info.dealerCompanyName  }}
            </el-form-item>
            <el-form-item label="资金类型：" prop="fundType">
              {{ info.fundType  }}
            </el-form-item>
            <el-form-item label="金融机构名称：" prop="financialOrganizationName">
              {{ info.financialOrganizationName  }}
            </el-form-item>
            <el-form-item label="资金结算顺序：" prop="settleSort">
              {{ info.settleSort  }}
            </el-form-item>
            <el-form-item label="是否允许客户使用返利,1:允许，0不允许：" prop="allowUseRebate">
              {{ info.allowUseRebate  }}
            </el-form-item>
            <el-form-item label="是否允许企业订单结算,1:允许，0不允许：" prop="allowEntOrderSettle">
              {{ info.allowEntOrderSettle  }}
            </el-form-item>
            <el-form-item label="企业订单额度系数：" prop="entOrderQuota">
              {{ info.entOrderQuota  }}
            </el-form-item>
            <el-form-item label="可用余额：" prop="availableBalance">
              {{ info.availableBalance  }}
            </el-form-item>
            <el-form-item label="冻结余额：" prop="frozenBalance">
              {{ info.frozenBalance  }}
            </el-form-item>
            <el-form-item label="累计充值金额：" prop="totalRechargeAmount">
              {{ info.totalRechargeAmount  }}
            </el-form-item>
            <el-form-item label="累计结算金额：" prop="totalSettleAmount">
              {{ info.totalSettleAmount  }}
            </el-form-item>
            <el-form-item label="最近交易时间：" prop="lastTradeTime">
              {{ info.lastTradeTime  }}
            </el-form-item>
            <el-form-item label="销售公司：" prop="saleCompanyId">
              {{ info.saleCompanyId  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="主键：" prop="id">
              {{ info.id  }}
            </el-form-item>
            <el-form-item label="创建者：" prop="creator">
              {{ info.creator  }}
            </el-form-item>
            <el-form-item label="创建者名称：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="修改者：" prop="modifier">
              {{ info.modifier  }}
            </el-form-item>
            <el-form-item label="修改者名称：" prop="modifierName">
              {{ info.modifierName  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="备注（说明）：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="母公司ID：" prop="dealerCompanyId">
              {{ info.dealerCompanyId  }}
            </el-form-item>
            <el-form-item label="金融机构ID：" prop="financialOrganizationId">
              {{ info.financialOrganizationId  }}
            </el-form-item>
            <el-form-item label="版本号：" prop="version">
              {{ info.version  }}
            </el-form-item>
            <el-form-item label="返利账户可用余额,：" prop="rebateAvailableBalance">
              {{ info.rebateAvailableBalance  }}
            </el-form-item>
          </el-form>
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

export default {
  name: 'accountDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '账户管理-整车资金-整车资金账户管理',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-account',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['账户管理-整车资金-整车资金账户管理', '详情']);
    this.getData();
  },
  methods: {
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
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
