<template>
  <div class="page-common-detail m-fund-own-credit-sales-config-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>主键：{{ info.id }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="主键：" prop="id">
              {{ info.id  }}
            </el-form-item>
            <el-form-item label="母公司名称：" prop="dealerCompanyName">
              {{ info.dealerCompanyName  }}
            </el-form-item>
            <el-form-item label="母公司编码：" prop="dealerCompanyCode">
              {{ info.dealerCompanyCode  }}
            </el-form-item>
            <el-form-item label="赊销账户状态：" prop="creditAccountStatus">
              {{ info.creditAccountStatus  }}
            </el-form-item>
            <el-form-item label="授信额度：" prop="creditAmount">
              {{ info.creditAmount  }}
            </el-form-item>
            <el-form-item label="首付款比例，如0.15：" prop="downPaymentRatio">
              {{ info.downPaymentRatio  }}
            </el-form-item>
            <el-form-item label="额度生效日期：" prop="effectiveTime">
              {{ info.effectiveTime  }}
            </el-form-item>
            <el-form-item label="额度失效日期：" prop="expireTime">
              {{ info.expireTime  }}
            </el-form-item>
            <el-form-item label="创建人：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="配置状态：" prop="auditStatus">
              {{ info.auditStatus  }}
            </el-form-item>
            <el-form-item label="复核人人：" prop="reviewName">
              {{ info.reviewName  }}
            </el-form-item>
            <el-form-item label="复核时间：" prop="reviewTime">
              {{ info.reviewTime  }}
            </el-form-item>
            <el-form-item label="备注（说明）：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="复核意见：" prop="reviewOpinion">
              {{ info.reviewOpinion  }}
            </el-form-item>
            <el-form-item label="修改人：" prop="modifierName">
              {{ info.modifierName  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="创建者：" prop="creator">
              {{ info.creator  }}
            </el-form-item>
            <el-form-item label="修改者：" prop="modifier">
              {{ info.modifier  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="复核人ID：" prop="reviewUserId">
              {{ info.reviewUserId  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehwholesale/creditsales/fundOwnCreditSalesConfig/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'fundOwnCreditSalesConfigDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '账户管理-赊销管理-自有资金赊销配置管理',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-fundOwnCreditSalesConfig',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['账户管理-赊销管理-自有资金赊销配置管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehwholesale/creditsales/fundOwnCreditSalesConfig/edit',
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
