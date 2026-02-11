<template>
  <div class="page-common-detail m-wholesale-vehicle-sale-model-conf-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>编码：{{ info.code }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit" type="primary" plain><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm">
            <el-form-item label="编码：" prop="code">
              {{ info.code  }}
            </el-form-item>
            <el-form-item label="车型：" prop="modelName">
              {{ info.modelName  }}
            </el-form-item>
            <el-form-item label="年款：" prop="vehicleYearType">
              {{ info.vehicleYearType  }}
            </el-form-item>
            <el-form-item label="订单分类：" prop="orderCategory">
              {{ info.orderCategoryLabel  }}
            </el-form-item>
            <el-form-item label="合作模式：" prop="cooperationMode">
              {{ info.cooperationModeLabel  }}
            </el-form-item>
            <el-form-item label="开票优惠类型：" prop="invoiceDiscountType">
              {{ info.invoiceDiscountTypeLabel  }}
            </el-form-item>
            <el-form-item label="开票系数：" prop="invoiceCoefficient">
              {{ info.invoiceCoefficient  }}
            </el-form-item>
            <el-form-item label="返利使用类型：" prop="rebateUseType">
              {{ info.rebateUseTypeLabel  }}
            </el-form-item>
            <el-form-item label="返利使用系数：" prop="rebateCoefficient">
              {{ info.rebateCoefficient  }}
            </el-form-item>
            <!-- <el-form-item label="母公司ID：" prop="dealerParentOrgId">
              {{ info.dealerParentOrgId  }}
            </el-form-item> -->
            <el-form-item label="母公司：" prop="dealerParentOrgName">
              {{ info.dealerParentOrgName  }}
            </el-form-item>
            <el-form-item label="开始日期：" prop="startDate">
              {{ info.startDate  }}
            </el-form-item>
            <el-form-item label="截止日期：" prop="endDate">
              {{ info.endDate  }}
            </el-form-item>
            <el-form-item label="提交人：" prop="submitterName">
              {{ info.submitterName  }}
            </el-form-item>
            <el-form-item label="提交时间：" prop="submitTime">
              {{ info.submitTime  }}
            </el-form-item>
            <el-form-item label="审核人：" prop="auditorName">
              {{ info.auditorName  }}
            </el-form-item>
            <el-form-item label="审核时间：" prop="auditTime">
              {{ info.auditTime  }}
            </el-form-item>
            <el-form-item label="审核状态：" prop="auditStatus">
              {{ info.auditStatusLabel  }}
            </el-form-item>
            <el-form-item label="审核意见：" prop="auditOpinion">
              {{ info.auditOpinion  }}
            </el-form-item>
            <el-form-item label="修改者名称：" prop="modifierName">
              {{ info.modifierName  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <!-- <el-form-item label="主键：" prop="id">
              {{ info.id  }}
            </el-form-item>
            <el-form-item label="创建者：" prop="creator">
              {{ info.creator  }}
            </el-form-item>
            <el-form-item label="创建者名称：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="修改者：" prop="modifier">
              {{ info.modifier  }}
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
            <el-form-item label="数据来源，140:新销服; 老销服:10：" prop="dataSource">
              {{ info.dataSource  }}
            </el-form-item>
            <el-form-item label="车型ID：" prop="modelId">
              {{ info.modelId  }}
            </el-form-item>
            <el-form-item label="年款ID：" prop="vehicleYearTypeId">
              {{ info.vehicleYearTypeId  }}
            </el-form-item>
            <el-form-item label="提交人ID：" prop="submitterUserId">
              {{ info.submitterUserId  }}
            </el-form-item>
            <el-form-item label="审核人ID：" prop="auditorUserId">
              {{ info.auditorUserId  }}
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
import { getDetail } from '@/api/vehwholesale/basic/wholesaleVehicleSaleModelConf/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'wholesaleVehicleSaleModelConfDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '整车销售模式配置管理',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleVehicleSaleModelConf',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车销售模式配置管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehwholesale/basic/wholesaleVehicleSaleModelConf/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        console.log('res', res);
        this.loading = false;
        this.info = {
          ...res,
          // 年月日时分
          startDate: res.startDate ? res.startDate.substring(0, 16) : '',
          endDate: res.endDate ? res.endDate.substring(0, 16) : '',
        };
        console.log('this.info', this.info);
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
