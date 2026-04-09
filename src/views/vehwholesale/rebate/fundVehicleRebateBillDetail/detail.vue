<template>
  <div class="page-common-detail m-fund-vehicle-rebate-bill-detail-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>整车返利核算单明细: {{ info.rebateBillDetailCode  }}</h2>
        <!-- <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button> -->
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基本信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="返利核算单明细编号：" prop="rebateBillDetailCode">
              {{ info.rebateBillDetailCode  }}
            </el-form-item>
            <el-form-item label="母公司名称：" prop="dealerCompanyName">
              {{ info.dealerCompanyName  }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              <el-button class="link" style="padding: 0;"
                   @click="navigateToRoute({
                      path: '/partner/channelManagement/shopDetail',
                      query: {
                        dealerCode: info.dealerCode,
                      },
                    })"
                   type="text">{{info.dealerName}}</el-button>
            </el-form-item>
            <el-form-item label="返利核算单编号: " prop="rebateBillCode">
              <el-button class="link" style="padding: 0;"
                   @click="navigateToRoute({
                      path: '/vehwholesale/rebate/fundVehicleRebateBill/detail',
                      query: {
                        id: info.rebateBillId,
                      },
                    })"
                   type="text">{{info.rebateBillCode}}</el-button>
            </el-form-item>
            <el-form-item label="单据状态：" prop="billStatus">
              {{ info.billStatusLabel  }}
            </el-form-item>
             <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>返利信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="返利类型：" prop="rebateTypeLabel">
              {{ info.rebateTypeLabel  }}
            </el-form-item>
            <el-form-item label="核销金额：" prop="rebateAmount">
              {{ info.rebateAmount  }}
            </el-form-item>
            <el-form-item label="业务单据号：" prop="bizOrderNo">
              {{ info.bizOrderNo  }}
            </el-form-item>
            <el-form-item label="VIN号：" prop="vin">
              {{ info.vin  }}
            </el-form-item>
            <el-form-item label="车系：" prop="seriesName">
              {{ info.seriesName  }}
            </el-form-item>
             <el-form-item label="基本车型：" prop="modelName">
              {{ info.modelName  }}
            </el-form-item>
            <el-form-item label="交车单号：" prop="deliveryOrderCode">
              {{ info.deliveryOrderCode  }}
            </el-form-item>
             <el-form-item label="预算科目：" prop="budgetItemName">
              {{ info.budgetItemName  }}
            </el-form-item>
            <el-form-item label="费用支持类型：" prop="feeSupportTypeName">
              {{ info.feeSupportTypeName  }}
            </el-form-item>
             <el-form-item label="周期：" prop="periodLabel">
              {{ info.periodLabel  }}
            </el-form-item>
            <el-form-item label="年度：" prop="year">
              {{ info.year  }}
            </el-form-item>
            <el-form-item label="季度：" prop="quarterLabel">
              {{ info.quarterLabel  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
             <el-form-item label="月度：" prop="monthLabel">
              {{ info.monthLabel  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>审核信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="初审人：" prop="auditorName">
              {{ info.auditorName  }}
            </el-form-item>
            <el-form-item label="初审时间：" prop="auditTime">
              {{ info.auditTime  }}
            </el-form-item>
            <el-form-item label="初审意见：" prop="auditOpinion">
              {{ info.auditOpinion  }}
            </el-form-item>
            <el-form-item label="复审人：" prop="reviewName">
              {{ info.reviewName  }}
            </el-form-item>
            <el-form-item label="复审时间：" prop="reviewTime">
              {{ info.reviewTime  }}
            </el-form-item>
            <el-form-item label="复审意见：" prop="reviewOpinion">
              {{ info.reviewOpinion  }}
            </el-form-item>
          </el-form>
        </div>
      </section>

    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehwholesale/rebate/fundVehicleRebateBillDetail/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'fundVehicleRebateBillDetailDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '整车返利核算单明细',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-fundVehicleRebateBillDetail',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车返利核算单明细', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehwholesale/rebate/fundVehicleRebateBillDetail/edit',
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
