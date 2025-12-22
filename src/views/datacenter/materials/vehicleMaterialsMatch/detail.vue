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
            <el-form-item v-for="(item, index) in materialsLabel" :key="index" :label="item.label" :class="item.class">{{ info.materials[item.prop] || '' }}</el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>可配物料信息</h2>
        </div>
        <el-form label-width="120px" inline>
          <el-form-item v-for="(item, index) in materialsLabel" :key="index" :label="item.label" :class="item.class">{{ info.matchMaterials[item.prop] || '' }}</el-form-item>
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
        { label: '车系：', prop: 'modelName', class: '' },
        { label: '车型：', prop: 'modelName', class: '' },
        { label: '年款：', prop: 'modelName', class: '' },
        { label: '外观：', prop: 'exteriorName', class: '' },
        { label: '内饰：', prop: 'interiorName', class: '' },
        { label: '车顶：', prop: 'roofName', class: '' },
        { label: '轮毂：', prop: 'wheelHubName', class: '' },
        { label: '选装包：', prop: 'optionPackageName', class: '' },
        { label: '电池电芯：', prop: 'batteryCellName', class: '' }
      ],
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['销服-业务主数据-配置主数据-物料配车关系', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/datacenter/materials/vehicleMaterialsMatch/edit',
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
