<template>
  <el-dialog
    :visible.sync="vehicleAttributeShow"
    append-to-body
    :title="vehicleAttributeTitle"
    width="600px"
    @close="close"
  >
    <el-form ref="auditForm" :model="auditForm" :rules="rules" label-width="120px" size="small" style="padding: 10px 0">
      <el-form-item label="车辆属性：" prop="vehicleAttribute">
        <fetch-select
          :request="fetchOptions"
          enumCode="vehicle_attribute_type"
          v-model="auditForm.vehicleAttribute"
          placeholder="请选择车辆属性"
          clearable
          filterable
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" size="small"> 取消 </el-button>
      <el-button type="primary" @click="auditFun" size="small"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';

export default {
  name: 'VehicleAttributeDialog',
  props: {
    vehicleAttributeTitle: {
      type: String,
      default: '调整车辆属性'
    },
    auditDataList: {
      type: Array,
      default: () => []
    },
    field: {
      type: String,
      default: 'id'
    }
  },
  components: {
    FetchSelect
  },
  data () {
    return {
      approveSubCateShow: false,
      vehicleAttributeShow: false,
      auditForm: {
        vehicleAttribute: '',
      },
      rules: {
        vehicleAttribute: [
          { required: true, message: '请选择车辆属性', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
  },
  methods: {
    show () {
      this.vehicleAttributeShow = true;
    },
    close () {
      this.vehicleAttributeShow = false;
      this.auditForm = { vehicleAttribute: '' };
      this.$nextTick(() => {
        this.$refs.auditForm.clearValidate();
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    /**
     * 审核操作
     */
    auditFun () {
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          // 将审核数据列表也传递给父组件
          this.$emit('audit', { ...this.auditForm, auditDataList: this.auditDataList });
          this.close();
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog .el-dialog__body {
  padding: 0 20px !important;
}
::v-deep .el-form-item {
  margin-bottom: 10px;
}
</style>
