<template>
  <div class="page-common-detail m-wholesaleDealerTestDriveQuota-detail">
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
            <el-form-item label="门店编码：" prop="dealerCode">
              {{ info.dealerCode  }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="年款：" prop="vehicleYearType">
              {{ info.vehicleYearType  }}
            </el-form-item>
            <el-form-item label="系列：" prop="vehicleModelLine">
              {{ info.vehicleModelLine  }}
            </el-form-item>
            <el-form-item label="车系：" prop="seriesName">
              {{ info.seriesName  }}
            </el-form-item>
            <el-form-item label="累计已申请数：" prop="requestQty">
              {{ info.requestQty  }}
            </el-form-item>
            <el-form-item label="调整说明：" prop="changeDesc">
              {{ info.changeDesc  }}
            </el-form-item>
            <el-form-item label="配额数量：" prop="quotaQty">
              {{ info.quotaQty  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.statusLabel  }}
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
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="数据来源，140:新销服; 老销服:10：" prop="dataSource">
              {{ info.dataSource  }}
            </el-form-item>
            <el-form-item label="年款ID：" prop="vehicleYearTypeId">
              {{ info.vehicleYearTypeId  }}
            </el-form-item>
            <el-form-item label="系列ID：" prop="vehicleModelLineId">
              {{ info.vehicleModelLineId  }}
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
import { getDetail } from '@/api/vehwholesale/basic/wholesaleDealerTestDriveQuota/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'wholesaleDealerTestDriveQuotaDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '门店试驾车配额管理',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleDealerTestDriveQuota',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['门店试驾车配额管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehwholesale/basic/wholesaleDealerTestDriveQuota/edit',
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
