<template>
  <div class="page-common-detail m-fund-financial-organization-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>金融机构名称：{{ info.organizationName }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="金融机构名称：" prop="organizationName">
              {{ info.organizationName  }}
            </el-form-item>
            <el-form-item label="金融机构编码：" prop="organizationCode">
              {{ info.organizationCode  }}
            </el-form-item>
            <el-form-item label="资金结算类型，仅包含：现金、融资、赊销-零跑：" prop="settleFundType">
              {{ info.settleFundType  }}
            </el-form-item>
            <el-form-item label="SAP资金类型编码：" prop="sapFundType">
              {{ info.sapFundType  }}
            </el-form-item>
            <el-form-item label="合格证发运方式：" prop="certificateShippingWay">
              {{ info.certificateShippingWay  }}
            </el-form-item>
            <el-form-item label="是否开启银企直连：" prop="enableBankDirectConnection">
              {{ info.enableBankDirectConnection  }}
            </el-form-item>
            <el-form-item label="开启返利使用额度：" prop="rebateUsageQuota">
              {{ info.rebateUsageQuota  }}
            </el-form-item>
            <el-form-item label="是否是否生成采购记录：" prop="createPurchaseRecord">
              {{ info.createPurchaseRecord  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="创建者名称：" prop="creatorName">
              {{ info.creatorName  }}
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
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'fundFinancialOrganizationDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '账户管理-基础配置-金融机构管理',
      pageType: 'detail',
      // TIPS: 权限前缀 AISWH，根据实际情况修改
      moduleKey: 'AISWH-fundFinancialOrganization',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['账户管理-基础配置-金融机构管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehwholesale/fund/fundFinancialOrganization/edit',
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
