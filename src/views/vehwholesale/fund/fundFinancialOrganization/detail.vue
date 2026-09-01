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
          <el-form :inline="true" ref="ruleForm" label-width="170px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="金融机构名称：" prop="organizationName">
              {{ info.organizationName  }}
            </el-form-item>
            <el-form-item label="金融机构编码：" prop="organizationCode">
              {{ info.organizationCode  }}
            </el-form-item>
            <el-form-item label="结算资金类型：" prop="settleFundType">
              {{ info.settleFundTypeLabel  }}
            </el-form-item>
            <el-form-item label="SAP资金类型编码：" prop="sapFundType">
              {{ info.sapFundType  }}
            </el-form-item>
            <el-form-item label="合格证发运方式：" prop="certificateShippingWay">
              {{ info.certificateShippingWayLabel  }}
            </el-form-item>
            <el-form-item label="是否开启银企直连：" prop="enableBankDirectConnection">
              {{ info.enableBankDirectConnectionLabel  }}
            </el-form-item>
            <el-form-item label="开启返利使用额度：" prop="rebateUsageQuota">
              {{ info.rebateUsageQuota  }}
            </el-form-item>
            <el-form-item label="是否生成采购记录：" prop="createPurchaseRecord">
              {{ info.createPurchaseRecordLabel  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.statusLabel  }}
            </el-form-item>
            <!-- <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item> -->
            <el-form-item label="创建人：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <!-- <el-form-item label="主键：" prop="id">
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
            </el-form-item> -->
          </el-form>
        </div>
      </section>

      <section class="common-section">
        <div class="common-section-header">
          <h2>金融机构-资金结算类型列表</h2>
        </div>
        <div class="common-section-body">
          <el-table
            :data="info.relList || []"
            border
            size="small"
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="55" align="center" />
            <el-table-column label="结算资金类型" min-width="180">
              <template #default="{ row }">
                {{ row.settleFundTypeLabel }}
              </template>
            </el-table-column>
            <el-table-column label="SAP资金类型编码" min-width="200">
              <template #default="{ row }">
                {{ row.sapFundType }}
              </template>
            </el-table-column>
            <el-table-column label="备注" min-width="200">
              <template #default="{ row }">
                {{ row.remark }}
              </template>
            </el-table-column>
            <template #empty>
              <div class="ais-empty-tip">暂无关联的结算资金类型</div>
            </template>
          </el-table>
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
      pageTitle: '金融机构',
      pageType: 'detail',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundFinancialOrganization',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['金融机构', '详情']);
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

<style lang="scss" scoped>
.ais-empty-tip {
  padding: 16px 0;
  color: #909399;
  font-size: 13px;
  text-align: center;
}
</style>
