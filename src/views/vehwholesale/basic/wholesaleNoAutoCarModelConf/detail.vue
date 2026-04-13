<template>
  <div class="page-common-detail m-wholesale-no-auto-car-model-conf-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>名称：{{ info.wholesaleNoAutoCarModelConfName }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit" type="primary" plain><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm">
            <el-form-item label="名称：" prop="wholesaleNoAutoCarModelConfName">
              {{ info.wholesaleNoAutoCarModelConfName  }}
            </el-form-item>
            <el-form-item label="车型：" prop="modelName">
              <el-button class="link" style="padding: 0;"
                   @click="navigateToRoute({
                      path: '/datacenter/materials/vehicleModel/detail',
                      query: {
                        id: info.modelId,
                      },
                    })"
                   type="text">{{info.modelName}}</el-button>
            </el-form-item>
            <el-form-item label="年款：" prop="vehicleYearType">
              <el-button class="link" style="padding: 0;"
                   @click="navigateToRoute({
                      path: '/datacenter/materials/vehicleYearType/detail',
                      query: {
                        id: info.vehicleYearTypeId,
                      },
                    })"
                   type="text">{{info.vehicleYearType}}</el-button>
            </el-form-item>
            <el-form-item label="不参与自动批售确认：" prop="noJoinAutoConfirm">
              {{ info.noJoinAutoConfirmLabel  }}
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
            <el-form-item label="车型ID：" prop="modelId">
              {{ info.modelId  }}
            </el-form-item>
            <el-form-item label="年款ID：" prop="vehicleYearTypeId">
              {{ info.vehicleYearTypeId  }}
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
import { getDetail } from '@/api/vehwholesale/basic/wholesaleNoAutoCarModelConf/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'wholesaleNoAutoCarModelConfDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '不自动批售确认车型',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleNoAutoCarModelConf',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['不自动批售确认车型', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehwholesale/basic/wholesaleNoAutoCarModelConf/edit',
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
