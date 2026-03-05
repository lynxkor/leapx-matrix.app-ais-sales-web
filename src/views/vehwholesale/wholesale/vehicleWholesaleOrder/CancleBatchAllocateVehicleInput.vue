<template>
  <div>
    <el-dialog title="取消配车" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
         <el-form ref="SelectformRef" :model="Selectform"  >
          <el-form-item label="取消配车类型：" prop="passOrReject">
            <fetch-select
              :request="fetchOptions"
              enumCode="vw_wholesale_order_cancel_allocate_vehicle_type"
              v-model="Selectform.cancelAllocateVehicleType"
              placeholder="请选择"
              clearable
              filterable
            />
          </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="cancel()">取消</el-button>
        <el-button type="primary" @click="confirmCancel(false)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
export default {
  name: 'CancleBatchAllocateVehicleInput',
  components: {
    FetchSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cancelIds: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      statusDesc: '',
      Selectform: {
        cancelAllocateVehicleType: '',
      },
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible;
      },
      set (val) {
        this.$emit('update:visible', val);
      }
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.Selectform.cancelAllocateVehicleType = '';
      }
    }
  },
  methods: {
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    confirmCancel () {
      this.$emit('cancleBatchAllocateVehicle', {
        cancelAllocateVehicleType: this.Selectform.cancelAllocateVehicleType
      });
      this.dialogVisible = false;
    },
    cancel () {
      this.dialogVisible = false;
    }
  }
};
</script>
