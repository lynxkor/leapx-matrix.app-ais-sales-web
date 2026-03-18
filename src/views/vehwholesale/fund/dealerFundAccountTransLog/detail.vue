<template>
  <div class="page-common-detail m-account-translog-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>流水编号：{{ info.transLogCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>账户信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="140px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="账号编号：" prop="transLogCode">
              {{ info.transLogCode  }}
            </el-form-item>
            <el-form-item label="母公司名称：" prop="dealerCompanyName">
              {{ info.dealerCompanyName  }}
            </el-form-item>
            <el-form-item label="销售公司：" prop="saleCompanyName">
              {{ info.saleCompanyName  }}
            </el-form-item>
            <el-form-item label="资金类型：" prop="fundType">
              {{ info.fundTypeLabel }}
            </el-form-item>
            <el-form-item label="金融机构：" prop="financialOrganizationId">
              {{ info.financialOrganizationName  }}
            </el-form-item>
            <el-form-item label="公司编码：" prop="dealerComapnyCode">
              {{ info.dealerComapnyCode  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>交易信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="140px">
            <el-form-item label="交易余额：" prop="transactionAmount">
              {{ info.transactionAmount  }}
            </el-form-item>
            <el-form-item label="过账时间：" prop="transactionTime">
              {{ info.transactionTime  }}
            </el-form-item>
            <el-form-item label="交易类型：" prop="transactionType">
              {{ info.transactionTypeLabel  }}
            </el-form-item>
            <el-form-item label="VIN号：" prop="vin">
              {{ info.vin  }}
            </el-form-item>
            <el-form-item label="整车批售订单：" prop="wholesaleOrderId">
              {{ info.wholesaleOrderCode  }}
            </el-form-item>
            <el-form-item label="企业客户整车订单：" prop="entVehorderId">
              {{ info.entVehorderCode  }}
            </el-form-item>
            <el-form-item label="交车单号：" prop="deliveryOrderId">
              {{ info.deliveryOrderCode  }}
            </el-form-item>
            <el-form-item label="销售门店：" prop="deliveryOrderId">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="入账凭证号：" prop="transactionReceiptCode">
              {{ info.transactionReceiptCode  }}
            </el-form-item>
            <el-form-item label="入行项目号：" prop="transactionReceiptCode">
              {{ info.lineNo  }}
            </el-form-item>
            <el-form-item label="年度：" prop="remark">
              {{ info.yearNo  }}
            </el-form-item>
            <el-form-item label="流水编号：" prop="transLogCode">
              {{ info.transLogCode  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehwholesale/fund/accountTranslog/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'accountTranslogDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '整车资金账户交易流水',
      pageType: 'detail',
      // TIPS: 权限前缀 AISWH，根据实际情况修改
      moduleKey: 'AISWH-accountTranslog',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车资金账户交易流水', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehwholesale/fund/accountTranslog/edit',
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
