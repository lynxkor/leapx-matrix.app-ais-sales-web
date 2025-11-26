<template>
  <div class="page-common-detail m-vehicle-materials-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>整车价格：{{ info.price }}</h2>
        <el-button size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="整车价格：" prop="price">
              {{ info.price  }}
            </el-form-item>
            <el-form-item label="物料编码：" prop="materialsCode">
              {{ info.materialsCode  }}
            </el-form-item>
            <el-form-item label="物料描述：" prop="materialsDesc">
              {{ info.materialsDesc  }}
            </el-form-item>
            <el-form-item label="车型名称：" prop="modelName">
              {{ info.modelName  }}
            </el-form-item>
            <el-form-item label="外观名称：" prop="exteriorName">
              {{ info.exteriorName  }}
            </el-form-item>
            <el-form-item label="内饰名称：" prop="interiorName">
              {{ info.interiorName  }}
            </el-form-item>
            <el-form-item label="轮毂名称：" prop="wheelHubName">
              {{ info.wheelHubName  }}
            </el-form-item>
            <el-form-item label="车顶名称：" prop="roofName">
              {{ info.roofName  }}
            </el-form-item>
            <el-form-item label="选装包名称：" prop="optionPackageName">
              {{ info.optionPackageName  }}
            </el-form-item>
            <el-form-item label="电池电芯名称：" prop="batteryCellName">
              {{ info.batteryCellName  }}
            </el-form-item>
            <el-form-item label="是否允许现车批售，1：允许；0不允许：" prop="allowWholesale">
              {{ yes_no_enum_map[info.allowWholesale] }}
            </el-form-item>
            <el-form-item label="是否允许排产申请，1：允许；0不允许：" prop="allowProductionSchedule">
              {{ yes_no_enum_map[info.allowProductionSchedule] }}
            </el-form-item>
            <el-form-item label="是否允许展车批售，1：允许；0不允许：" prop="allowDisplayVehicleWholesale">
              {{ yes_no_enum_map[info.allowDisplayVehicleWholesale] }}
            </el-form-item>
            <el-form-item label="是否允许试驾车批售，1：允许；0不允许：" prop="allowTestDriveVehicleWholesale">
              {{ yes_no_enum_map[info.allowTestDriveVehicleWholesale] }}
            </el-form-item>
            <el-form-item label="是否允许企业客户销售	，1：允许；0不允许：" prop="allowCustomerSales">
              {{ yes_no_enum_map[info.allowCustomerSales] }}
            </el-form-item>
            <el-form-item label="是否允许批售确认，1：允许；0不允许：" prop="allowWholesaleConfirm">
              {{ yes_no_enum_map[info.allowWholesaleConfirm] }}
            </el-form-item>
            <el-form-item label="是否允许改配，1：允许；0不允许：" prop="allowConfigurationModify">
              {{ yes_no_enum_map[info.allowConfigurationModify] }}
            </el-form-item>
            <el-form-item label="停产状态	，1；正常生产；0：停产：" prop="discontinueStatus">
              {{ yes_no_enum_map[info.discontinueStatus] }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="备注（说明）：" prop="remark">
              {{ info.remark  }}
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
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="车型ID：" prop="modelId">
              {{ info.modelId  }}
            </el-form-item>
            <el-form-item label="外观ID：" prop="exteriorId">
              {{ info.exteriorId  }}
            </el-form-item>
            <el-form-item label="内饰ID：" prop="interiorId">
              {{ info.interiorId  }}
            </el-form-item>
            <el-form-item label="轮毂ID：" prop="wheelHubId">
              {{ info.wheelHubId  }}
            </el-form-item>
            <el-form-item label="车顶ID：" prop="roofId">
              {{ info.roofId  }}
            </el-form-item>
            <el-form-item label="选装包ID：" prop="optionPackageId">
              {{ info.optionPackageId  }}
            </el-form-item>
            <el-form-item label="电池电芯ID：" prop="batteryCellId">
              {{ info.batteryCellId  }}
            </el-form-item>
            <el-form-item label="电芯材料枚举：1：三元锂:2：硫酸铁锂：" prop="cellMaterials">
              {{ info.cellMaterials  }}
            </el-form-item>
            <el-form-item label="续航里程ID：" prop="drivingRangeId">
              {{ info.drivingRangeId  }}
            </el-form-item>
            <el-form-item label="续航里程名称：" prop="drivingRangeName">
              {{ info.drivingRangeName  }}
            </el-form-item>
            <el-form-item label="续配动力ID：" prop="rangePowerId">
              {{ info.rangePowerId  }}
            </el-form-item>
            <el-form-item label="续配动力名称：" prop="rangePowerName">
              {{ info.rangePowerName  }}
            </el-form-item>
            <el-form-item label="整车价格单位，默认人明币0：" prop="currencyCode">
              {{ info.currencyCode  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/datacenter/materials/vehicleMaterials/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
export default {
  name: 'vehicleMaterialsDetail',
  components: {
  },
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
