<template>
  <div class="page-common m-vehicle-roof-list">
    <el-form ref="form" label-width="110px">
      <el-form-item label="车辆交付模式">
          <el-switch
            v-model="detailData.vehicleDeliveryMode"
            :active-value="1"
            :inactive-value="0"
            @change="handleChange">
          </el-switch>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/datacenter/materials/salesParameterConfig/index';
export default {
  data () {
    return {
      pageTitle: '销售参数配置',
      moduleKey: 'AISVS-salesParameterConfig',
      status: true,
      detailData: {
        vehicleDeliveryMode: 0,
        oringinalVehicleDeliveryMode: 0
      }
    };
  },
  async created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    async getData () {
      try {
        let res = await getDetail() || {};
        this.detailData = res;
        this.detailData.oringinalVehicleDeliveryMode = res?.vehicleDeliveryMode;
      } catch (e) {
        console.error(e);
      }
    },
    async handleChange (val) {
      addOrUpdate({
        id: this.detailData.id,
        vehicleDeliveryMode: val
      }).then(res => {
        this.$message.success('操作成功');
      }).catch(() => {
        this.$message.error('操作失败');
        this.detailData.vehicleDeliveryMode = this.detailData.oringinalVehicleDeliveryMode;
      });
    }
  }
};
</script>
