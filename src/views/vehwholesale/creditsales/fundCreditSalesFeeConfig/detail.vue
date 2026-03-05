<template>
  <div class="page-common-detail m-fund-credit-sales-fee-config-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>赊销咨费设置</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基本信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">

            <el-form-item label="车系：" prop="seriesName">
              {{ info.seriesName  }}
            </el-form-item>
            <el-form-item label="年款：" prop="yearTypeName">
              {{ info.yearTypeName  }}
            </el-form-item>
            <el-form-item label="首付款比例%：" prop="downPaymentRatio">
              {{ info.downPaymentRatio  }}
            </el-form-item>
            <el-form-item label="是否使用返利：" prop="useRebateLabel">
              {{ info.useRebateLabel  }}
            </el-form-item>
            <el-form-item label="使用天数下限：" prop="minUsageDays">
              {{ info.minUsageDays  }}
            </el-form-item>
            <el-form-item label="使用天数上限：" prop="maxUsageDays">
              {{ info.maxUsageDays  }}
            </el-form-item>
            <el-form-item label="赊销费用：" prop="creditSalesFee">
              {{ info.creditSalesFee  }}
            </el-form-item>
            <el-form-item label="有效开始日期：" prop="effectiveStartTime">
              {{ info.effectiveStartTime  }}
            </el-form-item>
            <el-form-item label="有效结束日期：" prop="effectiveEndTime">
              {{ info.effectiveEndTime  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
              </el-form-item>
           <el-form-item label="记录编号：" prop="creditSalesFeeConfigCode">
              {{ info.creditSalesFeeConfigCode  }}
            </el-form-item>
            <el-form-item label="创建人：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.statusLabel  }}
            </el-form-item>
            <!-- <el-form-item label="修改人：" prop="modifierName">
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
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="车系ID：" prop="seriesId">
              {{ info.seriesId  }}
            </el-form-item>
            <el-form-item label="年款ID：" prop="yearTypeId">
              {{ info.yearTypeId  }}
            </el-form-item> -->
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehwholesale/creditsales/fundCreditSalesFeeConfig/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'fundCreditSalesFeeConfigDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '赊销资费设置',
      pageType: 'detail',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundCreditSalesFeeConfig',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['赊销资费设置', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehwholesale/creditsales/fundCreditSalesFeeConfig/edit',
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
