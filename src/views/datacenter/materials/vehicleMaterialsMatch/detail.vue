<template>
  <div class="page-common-detail m-vehicle-materials-match-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>记录单号: {{ info.matchCode }}</h2>
        <el-button size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>物料信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item v-for="(item, index) in materialsLabel" :key="index" :label="item.label" :class="item.class">
              <el-link v-if="getMatchHref(item)" type="primary" :href="getMatchHref(item)" target="_blank">{{ info.materials[item.prop.replace('Id', 'Name')] || '' }}</el-link>
              <span v-else>{{ info.materials[item.prop] || '' }}</span>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>可配物料信息</h2>
        </div>
        <el-form label-width="120px" inline>
          <el-form-item v-for="(item, index) in materialsLabel" :key="index" :label="item.label" :class="item.class">
              <el-link v-if="getMatchMaterialsHref(item)" type="primary" :href="getMatchMaterialsHref(item)" target="_blank">{{ info.matchMaterials[item.prop.replace('Id', 'Name')] || '' }}</el-link>
              <span v-else>{{ info.matchMaterials[item.prop] || '' }}</span>
            </el-form-item>
        </el-form>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>属性信息</h2>
        </div>
        <el-form label-width="120px" inline>
          <el-form-item label="状态：" prop="status">
            {{ info.status === 1 ? '启用' : '停用'  }}
          </el-form-item>
        </el-form>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/datacenter/materials/vehicleMaterialsMatch/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
export default {
  name: 'vehicleMaterialsMatchDetail',
  components: {
  },
  data () {
    return {
      loading: true,
      info: {},
      materialsLabel: [
        { label: '物料编码：', prop: 'materialsCode', class: '' },
        { label: '物料描述：', prop: 'materialsDesc', class: '' },
        { label: '车系：', prop: 'seriesId', class: '' },
        { label: '车型：', prop: 'modelId', class: '' },
        { label: '年款：', prop: 'yearTypeId', class: '' },
        { label: '外观：', prop: 'exteriorId', class: '' },
        { label: '内饰：', prop: 'interiorId', class: '' },
        { label: '车顶：', prop: 'roofId', class: '' },
        { label: '轮毂：', prop: 'wheelHubId', class: '' },
        { label: '选装包：', prop: 'optionPackageId', class: '' },
        { label: '电池电芯：', prop: 'batteryCellId', class: '' }
      ],
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['物料可配关系', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/datacenter/materials/vehicleMaterialsMatch/edit',
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
    },
    getMatchMaterialsHref (item) {
      const prop = item.prop;
      if (!prop.endsWith('Id')) return null;
      const id = this.info.matchMaterials[prop];
      if (!id) return null;
      const routeMap = {
        seriesId: '/datacenter/materials/vehicleSeries/detail',
        modelId: '/datacenter/materials/vehicleModel/detail',
        yearTypeId: '/datacenter/materials/vehicleYearType/detail',
        exteriorId: '/datacenter/materials/vehicleExterior/detail',
        interiorId: '/datacenter/materials/vehicleInterior/detail',
        roofId: '/datacenter/materials/vehicleRoof/detail',
        wheelHubId: '/datacenter/materials/vehicleWheelHub/detail',
        optionPackageId: '/datacenter/materials/vehicleOptionPackage/detail',
        batteryCellId: '/datacenter/materials/vehicleBatteryCell/detail'
      };
      return routeMap[prop] ? `${routeMap[prop]}?id=${id}` : null;
    },
    getMatchHref (item) {
      const prop = item.prop;
      if (!prop.endsWith('Id')) return null;
      const id = this.info.materials[prop];
      if (!id) return null;
      const routeMap = {
        seriesId: '/datacenter/materials/vehicleSeries/detail',
        modelId: '/datacenter/materials/vehicleModel/detail',
        yearTypeId: '/datacenter/materials/vehicleYearType/detail',
        exteriorId: '/datacenter/materials/vehicleExterior/detail',
        interiorId: '/datacenter/materials/vehicleInterior/detail',
        roofId: '/datacenter/materials/vehicleRoof/detail',
        wheelHubId: '/datacenter/materials/vehicleWheelHub/detail',
        optionPackageId: '/datacenter/materials/vehicleOptionPackage/detail',
        batteryCellId: '/datacenter/materials/vehicleBatteryCell/detail'
      };
      return routeMap[prop] ? `${routeMap[prop]}?id=${id}` : null;
    }
  }
};
</script>
