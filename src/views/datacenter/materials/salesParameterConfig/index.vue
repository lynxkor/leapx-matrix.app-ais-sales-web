<template>
  <div class="page-common m-vehicle-roof-list">
    <el-form ref="form" label-width="110px">
      <el-form-item label="车辆交付模式">
          <el-switch
            v-model="detailData.vehicleDeliveryMode"
            active-color="#13ce66"
            inactive-color="#cccccc"
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
      detailData: {}
    };
  },
  async created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    let res = await getDetail();
    this.detailData = res;
    console.log('1111', this.detailData);
  },
  methods: {
    async handleChange (val) {
      const originalValue = this.detailData.vehicleDeliveryMode;
      try {
        let res = addOrUpdate(
          {
            id: this.detailData.id,
            vehicleDeliveryMode: val
          }
        );
        if (res) {
          this.$message.success('操作成功');
          this.$emit('update:vehicleDeliveryMode', val);
        }
      } catch (error) {
        this.$message.error('操作失败');
        this.$emit('update:vehicleDeliveryMode', originalValue);
      }
    }
  }
};
</script>
