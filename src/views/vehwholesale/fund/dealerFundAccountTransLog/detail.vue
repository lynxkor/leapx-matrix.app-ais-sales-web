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
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="流水编号：" prop="transLogCode">
              {{ info.transLogCode  }}
            </el-form-item>
            <el-form-item label="资金类型：" prop="fundType">
              {{ info.fundType  }}
            </el-form-item>
            <el-form-item label="金融机构ID：" prop="financialOrganizationId">
              {{ info.financialOrganizationId  }}
            </el-form-item>
            <el-form-item label="交易类型：" prop="transactionType">
              {{ info.transactionType  }}
            </el-form-item>
            <el-form-item label="交易金额：" prop="transactionAmount">
              {{ info.transactionAmount  }}
            </el-form-item>
            <el-form-item label="过账时间（交易时间）：" prop="transactionTime">
              {{ info.transactionTime  }}
            </el-form-item>
            <el-form-item label="交易凭证号：" prop="transactionReceiptCode">
              {{ info.transactionReceiptCode  }}
            </el-form-item>
            <el-form-item label="备注（说明）：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="整车VIN编码：" prop="vin">
              {{ info.vin  }}
            </el-form-item>
            <el-form-item label="批售订单ID：" prop="wholesaleOrderId">
              {{ info.wholesaleOrderId  }}
            </el-form-item>
            <el-form-item label="交车单ID：" prop="deliveryOrderId">
              {{ info.deliveryOrderId  }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="母公司名称：" prop="dealerCompanyName">
              {{ info.dealerCompanyName  }}
            </el-form-item>
            <el-form-item label="母公司编码：" prop="dealerComapnyCode">
              {{ info.dealerComapnyCode  }}
            </el-form-item>
            <el-form-item label="整车资金账户ID：" prop="fundAccountId">
              {{ info.fundAccountId  }}
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
            <el-form-item label="状态：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              {{ info.dealerCode  }}
            </el-form-item>
            <el-form-item label="交易前-可用余额：" prop="availableBalanceBefore">
              {{ info.availableBalanceBefore  }}
            </el-form-item>
            <el-form-item label="交易前-冻结余额：" prop="frozenBalanceBefore">
              {{ info.frozenBalanceBefore  }}
            </el-form-item>
            <el-form-item label="企业客户整车订单ID：" prop="entVehorderId">
              {{ info.entVehorderId  }}
            </el-form-item>
            <el-form-item label="版本号，来自资金账户的版本号：" prop="version">
              {{ info.version  }}
            </el-form-item>
            <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
              {{ info.ownerOrgId  }}
            </el-form-item>
            <el-form-item label="业务幂等ID：" prop="bizIdempotentId">
              {{ info.bizIdempotentId  }}
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
      pageTitle: '账户管理-整车资金-整车资金账户交易流水管理',
      pageType: 'detail',
      // TIPS: 权限前缀 AISWH，根据实际情况修改
      moduleKey: 'AISWH-accountTranslog',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['账户管理-整车资金-整车资金账户交易流水管理', '详情']);
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
