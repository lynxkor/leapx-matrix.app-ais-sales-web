<template>
  <div class="page-common-detail m-product-center-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>商品编码：{{ info.productCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :model="info" ref="ruleForm" label-width="150px" inline>
            <el-form-item label="商品编码：">{{ info.productCode }}</el-form-item>
            <el-form-item label="商品名称：" prop="productName">{{ info.productName }}</el-form-item>
            <el-form-item label="商品类型：" prop="productType">{{ info.productTypeLabel }}</el-form-item>
            <el-form-item label="购车类型：" prop="purchaseType">{{ info.purchaseTypeLabel }}</el-form-item>
            <el-form-item label="商品状态：" prop="productStatus">{{ info.productStatusLabel }}</el-form-item>
            <el-form-item label="是否需要支付：" prop="needPayStatus">{{ info.needPayStatusLabel }}</el-form-item>
            <el-form-item label="支付方式：" prop="payMethod">{{ info.payMethodLabel }}</el-form-item>
            <el-form-item label="支付定金金额：" prop="depositAmount">{{ info.depositAmount }}</el-form-item>
            <el-form-item label="是否需要支付定金：" prop="needDepositStatus">{{ info.needDepositStatus }}</el-form-item>
            <el-form-item label="简介：" prop="introduction">{{ info.introduction }}</el-form-item>
            <el-form-item label="描述：" prop="description">{{ info.description }}</el-form-item>
            <el-form-item label="创建者：" prop="creator">{{ info.creatorName }}</el-form-item>
            <el-form-item label="创建时间：" prop="createTime">{{ info.createTime }}</el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">{{ info.updateTime }}</el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>订购属性</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-table">
            <attributeable-table
              :tableType="'detail'"
              :moduleKey="moduleKey"
              ref="attributeable"
              @replace="replace"
              :id="id" />
          </div>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>商品定价</h2>
        </div>
        <div class="common-section-body">
            <pricing-table
              :tableType="'detail'"
              :module-key="moduleKey"
              ref="pricing"
              :id="id"
              @replace="updateReplace"
              @checkboxChange="checkboxChange" />
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehretail/productManager/productCenter/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import attributeableTable from './attributeable.vue';
import pricingTable from './pricing.vue';

export default {
  name: 'productCenterDetail',
  mixins: [permissions, commonMixins],
  components: {
    attributeableTable,
    pricingTable
  },
  data () {
    return {
      pageTitle: '销售管理-商品管理-商品中心',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-productInfo',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['销售管理-商品管理-商品中心管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehretail/productManager/productCenter/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail({ productId: this.$route.query.id }).then(res => {
        this.loading = false;
        this.info = res;
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
