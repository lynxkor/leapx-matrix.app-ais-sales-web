<template>
  <div class="page-common-detail m-vehicle-materials-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="物料编码：" prop="materialsCode">
              {{ info.materialsCode  }}
            </el-form-item>
            <el-form-item label="物料描述：" prop="materialsDesc">
              {{ info.materialsDesc  }}
            </el-form-item>
            <el-form-item label="车系：" prop="modelName">
              {{ info.seriesName  }}
            </el-form-item>
            <el-form-item label="车型：" prop="modelName">
              {{ info.modelName  }}
            </el-form-item>
            <el-form-item label="年款：" prop="modelName">
              {{ info.yearModelName  }}
            </el-form-item>
            <el-form-item label="外观：" prop="exteriorName">
              {{ info.exteriorName  }}
            </el-form-item>
            <el-form-item label="内饰：" prop="interiorName">
              {{ info.interiorName  }}
            </el-form-item>
            <el-form-item label="车顶：" prop="roofName">
              {{ info.roofName  }}
            </el-form-item>
            <el-form-item label="轮毂：" prop="wheelHubName">
              {{ info.wheelHubName  }}
            </el-form-item>
            <el-form-item label="续航里程：" prop="drivingRangeName">
              {{ info.drivingRangeName  }}
            </el-form-item>
            <el-form-item label="选配动力：" prop="rangePowerName">
              {{ info.rangePowerName  }}
            </el-form-item>
            <el-form-item label="选装包：" prop="optionPackageName">
              {{ info.optionPackageName  }}
            </el-form-item>
            <el-form-item label="电池电芯：" prop="batteryCellName">
              {{ info.batteryCellName  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.status === 1 ? '启用' : '停用'  }}
            </el-form-item>
          </el-form>
        </div>
      </section>

      <section class="common-section">
          <div class="common-section-header">
            <h2>价格信息</h2>
          </div>
          <el-form ref="ruleForm" label-width="120px" inline>
            <el-form-item label="整车价格：">
              {{ info.price  }}
            </el-form-item>
          </el-form>
        </section>

        <section class="common-section">
          <div class="common-section-header">
            <h2>属性信息</h2>
          </div>
          <el-form ref="ruleForm" label-width="170px" inline>
            <el-form-item label="是否允许现车批售：">
              {{ yes_no_enum_map[info.allowWholesale] }}
            </el-form-item>
            <el-form-item label="是否允许排产申请：" prop="allowProductionSchedule">
              {{ yes_no_enum_map[info.allowProductionSchedule] }}
            </el-form-item>
            <el-form-item label="是否允许展车批售：" prop="allowDisplayVehicleWholesale">
              {{ yes_no_enum_map[info.allowDisplayVehicleWholesale] }}
            </el-form-item>
            <el-form-item label="是否允许试驾车批售：" prop="allowTestDriveVehicleWholesale">
              {{ yes_no_enum_map[info.allowTestDriveVehicleWholesale] }}
            </el-form-item>
            <el-form-item label="是否允许企业客户销售：" prop="allowCustomerSales">
              {{ yes_no_enum_map[info.allowCustomerSales] }}
            </el-form-item>
            <el-form-item label="是否允许批售确认：" prop="allowWholesaleConfirm">
              {{ yes_no_enum_map[info.allowWholesaleConfirm] }}
            </el-form-item>
            <el-form-item label="是否允许改配：" prop="allowConfigurationModify">
              {{ yes_no_enum_map[info.allowConfigurationModify] }}
            </el-form-item>
            <el-form-item label="停产状态：">
              {{ yes_no_enum_map[info.discontinueStatus] }}
            </el-form-item>
          </el-form>
        </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/datacenter/materials/vehicleMaterials/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'vehicleMaterialsDetail',
  components: {
  },
  mixins: [permissions],
  data () {
    return {
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车主数据-整车物料管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/datacenter/materials/vehicleMaterials/edit',
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

<style lang="scss">
.page-common-edit {
  .el-form-item__content {
    min-width: 180px !important;
    width: 50% !important;
  }
}
</style>
