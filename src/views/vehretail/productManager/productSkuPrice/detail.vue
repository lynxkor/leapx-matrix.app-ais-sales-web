<template>
  <div class="page-common-detail m-product-manager-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>商品价格编码：{{ info.skuPriceCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :model="info" ref="ruleForm" label-width="150px" inline>
            <el-form-item label="商品价格编码：">{{ info.skuPriceCode }}</el-form-item>
            <el-form-item label="SKU编码：" prop="skuCode">{{ info.skuCode }}</el-form-item>
            <el-form-item label="关联商品编码：" prop="productCode">{{ info.productCode }}</el-form-item>
            <el-form-item label="物料编码：" prop="materialsCode">{{ info.materialsCode }}</el-form-item>
            <el-form-item label="购车类型：" prop="purchaseType">{{ info.purchaseTypeLabel }}</el-form-item>
            <el-form-item label="补贴前价格：" prop="priceBeforeSubsidy">{{ info.priceBeforeSubsidy }}</el-form-item>
            <el-form-item label="补贴金额：" prop="subsidyAmount">{{ info.subsidyAmount }}</el-form-item>
            <el-form-item label="补贴后价格：" prop="priceAfterSubsidy">{{ info.priceAfterSubsidy }}</el-form-item>
            <el-form-item label="定金：" prop="deposit">{{ info.deposit }}</el-form-item>
            <el-form-item label="允许改配：" prop="allowConfigChange">{{ info.allowConfigChangeLabel }}</el-form-item>
            <el-form-item label="状态：" prop="status">{{ info.statusLabel }}</el-form-item>
            <el-form-item label="开始日期：" prop="startTime">{{ info.startTime }}</el-form-item>
            <el-form-item label="截止日期：" prop="endTime">{{ info.endTime }}</el-form-item>
            <el-form-item label="描述：" prop="description">{{ info.description }}</el-form-item>
            <el-form-item label="创建者：" prop="creator">{{ info.creatorName }}</el-form-item>
            <el-form-item label="创建时间：" prop="createTime">{{ info.createTime }}</el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">{{ info.updateTime }}</el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehretail/productManager/productSkuPrice/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'productManagerDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '销售管理-商品管理-商品SKU价格维护管理',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-productSkuPrice',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['销售管理-商品管理-商品SKU价格维护管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehretail/productManager/productSkuPrice/edit',
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
