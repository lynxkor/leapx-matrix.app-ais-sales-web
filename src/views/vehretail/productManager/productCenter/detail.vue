<template>
  <div class="page-common-detail m-product-center-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>商品编码（系统自动生成：类型编号+6位流水号）：{{ info.productCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="商品编码（系统自动生成：类型编号+6位流水号）：" prop="productCode">
              {{ info.productCode  }}
            </el-form-item>
            <el-form-item label="商品名称：" prop="productName">
              {{ info.productName  }}
            </el-form-item>
            <el-form-item label="商品类型（1-整车，2-整车选装件，3-充电桩&#x2F;枪，4-备件，5-工时，6-卡券类，7-业务办理，8-施工，9-预约类）：" prop="productType">
              {{ info.productType  }}
            </el-form-item>
            <el-form-item label="购车类型（1-C端用户，2-员工，3-试乘试驾&#x2F;展车）：" prop="purchaseType">
              {{ info.purchaseType  }}
            </el-form-item>
            <el-form-item label="创建者：" prop="creator">
              {{ info.creator  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="商品状态（1-新建，2-上架，3-下架）：" prop="productStatus">
              {{ info.productStatus  }}
            </el-form-item>
            <el-form-item label="主键：" prop="id">
              {{ info.id  }}
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
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="商品类型标签：" prop="productTypeLabel">
              {{ info.productTypeLabel  }}
            </el-form-item>
            <el-form-item label="购车类型标签：" prop="purchaseTypeLabel">
              {{ info.purchaseTypeLabel  }}
            </el-form-item>
            <el-form-item label="商品状态标签：" prop="productStatusLabel">
              {{ info.productStatusLabel  }}
            </el-form-item>
            <el-form-item label="简介（最多100字符）：" prop="introduction">
              {{ info.introduction  }}
            </el-form-item>
            <el-form-item label="描述（最多100字符）：" prop="description">
              {{ info.description  }}
            </el-form-item>
            <el-form-item label="是否需要支付（1-是，0-否）：" prop="needPayStatus">
              {{ info.needPayStatus  }}
            </el-form-item>
            <el-form-item label="支付方式（1-现金，2-积分）：" prop="payMethod">
              {{ info.payMethod  }}
            </el-form-item>
            <el-form-item label="是否需要支付定金（1-是，0-否）：" prop="needDepositStatus">
              {{ info.needDepositStatus  }}
            </el-form-item>
            <el-form-item label="支付定金金额（保留两位小数）：" prop="depositAmount">
              {{ info.depositAmount  }}
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
import { getDetail } from '@/api/vehretail/productManager/productCenter/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'productCenterDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '销售管理-商品管理-商品中心管理',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-productCenter',
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
