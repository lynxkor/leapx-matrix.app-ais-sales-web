<template>
  <div class="page-common-detail m-fund-own-credit-sales-config-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>自有资金赊销配置</h2>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="母公司名称：" prop="dealerCompanyName">
              {{ info.dealerCompanyName  }}
            </el-form-item>
            <el-form-item label="母公司编码：" prop="dealerCompanyCode">
              {{ info.dealerCompanyCode  }}
            </el-form-item>
            <el-form-item label="赊销账户状态：" prop="creditAccountStatusLabel">
              {{ info.creditAccountStatusLabel  }}
            </el-form-item>
            <el-form-item label="授信额度：" prop="creditAmount">
              {{ info.creditAmount  }}
            </el-form-item>
            <el-form-item label="首付款比例%：" prop="downPaymentRatio">
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
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="配置状态：" prop="auditStatusLabel">
              {{ info.auditStatusLabel  }}
            </el-form-item>
            <el-form-item label="配置编号：" prop="configCode">
              {{ info.configCode  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>复核信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="复核人：" prop="reviewName">
              {{ info.reviewName  }}
            </el-form-item>
            <el-form-item label="复核时间：" prop="reviewTime">
              {{ info.reviewTime  }}
            </el-form-item>
            <el-form-item label="复核意见：" prop="reviewOpinion" inline=false>
              <el-input v-model="info.reviewOpinion"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <div>
      <el-container style="text-align: center;">
        <el-main>
          <el-footer height="60px">
            <el-button size="small" type="primary" @click="reviewCheck('approve')">通过</el-button>
          <el-button size="small" @click="reviewCheck('reject')">驳回</el-button>
        </el-footer>
        </el-main>
      </el-container>
      </div>
    </template>
  </div>
</template>

<script>
import { getDetail, reviewItem } from '@/api/vehwholesale/creditsales/fundOwnCreditSalesConfig/index';
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
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundOwnCreditSalesConfig',
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
    getFormData (val) {
      const data = { ...val };
      Object.keys(val).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });
      return data;
    },
    reviewCheck (type) {
      const params = {
        ids: [this.info.id],
        reviewOpinion: this.info.reviewOpinion
      };
      const reqParams = { ...this.getFormData(params) };
      if (type === 'approve') {
        reqParams.passOrReject = 1;
        reviewItem(reqParams).then(() => {
          this.$message({
            type: 'success',
            message: '复核成功!'
          });
          this.$router.push({
            name: 'fundOwnCreditSalesConfig'
          });
        }).catch(() => {});
      } else if (type === 'reject') {
        if (reqParams.reviewOpinion === '' || reqParams.reviewOpinion === null || reqParams.reviewOpinion === undefined) {
          this.$message({
            type: 'error',
            message: '请填复核意见!'
          });
        } else if (reqParams.reviewOpinion.length > 0) {
          reqParams.passOrReject = 0;
          reviewItem(reqParams).then(() => {
            this.$message({
              type: 'success',
              message: '复核成功!'
            });
            this.$router.push({
              name: 'fundOwnCreditSalesConfig'
            });
          }).catch(() => {});
        }
      }
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
