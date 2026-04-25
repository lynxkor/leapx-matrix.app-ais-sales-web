<template>
  <div class="page-common-detail m-wholesale-sale-target-tracking-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>编号：{{ info.wholesaleSaleTargetTrackingCode }}</h2>
        <div>
          <el-button v-if="canAddOrUpdate" size="small" @click="handleWholesaleEdit" type="primary" plain><i class="iconfont icon-lxppc-edit"></i>批售编辑</el-button>
          <el-button v-if="canAddOrUpdate" size="small" @click="handleRetailEdit" type="primary" plain><i class="iconfont icon-lxppc-edit"></i>零售编辑</el-button>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm">
            <el-form-item label="编号：" prop="wholesaleSaleTargetTrackingCode">
              {{ info.wholesaleSaleTargetTrackingCode  }}
            </el-form-item>
            <el-form-item label="年：" prop="year">
              {{ info.year  }}
            </el-form-item>
            <el-form-item label="月：" prop="month">
              {{ info.month  }}
            </el-form-item>
            <!-- <el-form-item label="母公司ID：" prop="dealerParentOrgId">
              {{ info.dealerParentOrgId  }}
            </el-form-item> -->
            <el-form-item label="母公司：" prop="dealerParentOrgName">
              {{ info.dealerParentOrgName  }}
            </el-form-item>
            <el-form-item label="合作类型：" prop="cooperationType">
              {{ info.cooperationTypeLabel  }}
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              {{ info.dealerCode  }}
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
            <el-form-item label="大区：" prop="regionName">
              {{ info.regionName  }}
            </el-form-item>
            <el-form-item label="省份：" prop="provinceName">
              {{ info.provinceName  }}
            </el-form-item>
            <el-form-item label="城市：" prop="cityName">
              {{ info.cityName  }}
            </el-form-item>
            <el-form-item label="车系：" prop="seriesName">
              <el-button class="link" style="padding: 0;"
                   @click="navigateToRoute({
                      path: '/datacenter/materials/vehicleSeries/detail',
                      query: {
                        id: info.seriesId,
                      },
                    })"
                   type="text">{{info.seriesName}}</el-button>
            </el-form-item>
            <el-form-item label="新增缴定订单数：" prop="newOrderQty">
              {{ info.newOrderQty  }}
            </el-form-item>
            <el-form-item label="新增锁单目标数：" prop="newLockTargetQty">
              {{ info.newLockTargetQty  }}
            </el-form-item>
            <el-form-item label="净增锁单目标数：" prop="netLockTargetQty">
              {{ info.netLockTargetQty  }}
            </el-form-item>
            <el-form-item label="批售考核目标数：" prop="wholesaleAssessmentTargetQty">
              {{ info.wholesaleAssessmentTargetQty  }}
            </el-form-item>
            <el-form-item label="交付目标数：" prop="deliveryTargetQty">
              {{ info.deliveryTargetQty  }}
            </el-form-item>
            <el-form-item label="批售目标数：" prop="wholesaleTargetQty">
              {{ info.wholesaleTargetQty  }}
            </el-form-item>
            <el-form-item label="已确认数量：" prop="confirmedQty">
              {{ info.confirmedQty  }}
            </el-form-item>
            <el-form-item label="批售备注：" prop="wholesaleRemark">
              {{ info.wholesaleRemark  }}
            </el-form-item>
            <el-form-item label="零售备注：" prop="retailRemark">
              {{ info.retailRemark  }}
            </el-form-item>
            <!-- <el-form-item label="创建者名称：" prop="creatorName">
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
            </el-form-item> -->
            <el-form-item label="修改者名称：" prop="modifierName">
              {{ info.modifierName  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <!-- <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="数据来源，140:新销服; 老销服:10：" prop="dataSource">
              {{ info.dataSource  }}
            </el-form-item>
            <el-form-item label="大区ID：" prop="regionId">
              {{ info.regionId  }}
            </el-form-item>
            <el-form-item label="省份code：" prop="provinceCode">
              {{ info.provinceCode  }}
            </el-form-item>
            <el-form-item label="城市code：" prop="cityCode">
              {{ info.cityCode  }}
            </el-form-item>
            <el-form-item label="车系ID：" prop="seriesId">
              {{ info.seriesId  }}
            </el-form-item>
            <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
              {{ info.ownerOrgId  }}
            </el-form-item> -->
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehwholesale/basic/wholesaleSaleTargetTracking/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'wholesaleSaleTargetTrackingDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '销售目标跟踪',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleSaleTargetTracking',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['销售目标跟踪', '详情']);
    this.getData();
  },
  methods: {
    handleWholesaleEdit () {
      this.$router.push({
        path: '/vehwholesale/basic/wholesalesaletargettracking/wholesaleEdit',
        query: {
          id: this.$route.query.id,
          isEditing: true
        }
      });
    },
    handleRetailEdit () {
      this.$router.push({
        path: '/vehwholesale/basic/wholesalesaletargettracking/retailEdit',
        query: {
          id: this.$route.query.id,
          isEditing: true
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
