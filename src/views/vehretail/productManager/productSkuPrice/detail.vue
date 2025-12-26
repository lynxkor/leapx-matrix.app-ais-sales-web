<template>
  <div class="page-common-detail m-product-manager-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>商品价格编码（系统自动生成，前缀SKU）：{{ info.skuPriceCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="商品价格编码（系统自动生成，前缀SKU）：" prop="skuPriceCode">
              {{ info.skuPriceCode  }}
            </el-form-item>
            <el-form-item label="SKU编码：" prop="skuCode">
              {{ info.skuCode  }}
            </el-form-item>
            <el-form-item label="关联商品编码：" prop="productCode">
              {{ info.productCode  }}
            </el-form-item>
            <el-form-item label="物料编码：" prop="materialsCode">
              {{ info.materialsCode  }}
            </el-form-item>
            <el-form-item label="物料描述：" prop="materialsDesc">
              {{ info.materialsDesc  }}
            </el-form-item>
            <el-form-item label="购车类型（1-个人，2-企业）：" prop="purchaseTypeLabel">
              {{ info.purchaseTypeLabel  }}
            </el-form-item>
            <el-form-item label="补贴前价格（保留两位小数）：" prop="priceBeforeSubsidy">
              {{ info.priceBeforeSubsidy  }}
            </el-form-item>
            <el-form-item label="补贴后价格（保留两位小数，&#x3D;补贴前-补贴金额）：" prop="priceAfterSubsidy">
              {{ info.priceAfterSubsidy  }}
            </el-form-item>
            <el-form-item label="补贴金额（保留两位小数）：" prop="subsidyAmount">
              {{ info.subsidyAmount  }}
            </el-form-item>
            <el-form-item label="定金（保留两位小数）：" prop="deposit">
              {{ info.deposit  }}
            </el-form-item>
            <el-form-item label="整车价格（关联物料编码）：" prop="vehiclePrice">
              {{ info.vehiclePrice  }}
            </el-form-item>
            <el-form-item label="价格对比（1-一致，2-不一致，自动计算）：" prop="priceCompareLabel">
              {{ info.priceCompareLabel  }}
            </el-form-item>
            <el-form-item label="允许改配（1-是，0-否，默认否）：" prop="allowConfigChange">
              {{ info.allowConfigChange  }}
            </el-form-item>
            <el-form-item label="状态（1-可用，0-停用，默认1-可用）：" prop="statusLabel">
              {{ info.statusLabel  }}
            </el-form-item>
            <el-form-item label="开始日期：" prop="startTime">
              {{ info.startTime  }}
            </el-form-item>
            <el-form-item label="截止日期：" prop="endTime">
              {{ info.endTime  }}
            </el-form-item>
            <el-form-item label="描述（最多100字符）：" prop="description">
              {{ info.description  }}
            </el-form-item>
            <el-form-item label="车系名：" prop="seriesName">
              {{ info.seriesName  }}
            </el-form-item>
            <el-form-item label="车型名称：" prop="modelName">
              {{ info.modelName  }}
            </el-form-item>
            <el-form-item label="创建者名称：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="修改者名称：" prop="modifierName">
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
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="状态（1-可用，0-停用，默认1-可用）：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="关联商品信息主键id：" prop="productId">
              {{ info.productId  }}
            </el-form-item>
            <el-form-item label="物料主数据主键id：" prop="vehicleMaterialsId">
              {{ info.vehicleMaterialsId  }}
            </el-form-item>
            <el-form-item label="车系ID：" prop="seriesId">
              {{ info.seriesId  }}
            </el-form-item>
            <el-form-item label="车型ID：" prop="modelId">
              {{ info.modelId  }}
            </el-form-item>
            <el-form-item label="购车类型（1-个人，2-企业）：" prop="purchaseType">
              {{ info.purchaseType  }}
            </el-form-item>
            <el-form-item label="允许改配（1-是，0-否，默认否）：" prop="allowConfigChangeLabel">
              {{ info.allowConfigChangeLabel  }}
            </el-form-item>
            <el-form-item label="价格对比（1-一致，2-不一致，自动计算）：" prop="priceCompare">
              {{ info.priceCompare  }}
            </el-form-item>
            <el-form-item label="数据来源，150-新销服; 10-老销服：" prop="dataSource">
              {{ info.dataSource  }}
            </el-form-item>
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
      moduleKey: 'AISMC-productSkuPrice',
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
        path: '/vehretail/productManager/edit',
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
