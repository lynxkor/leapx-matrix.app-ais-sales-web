<template>
  <div>
    <el-dialog title="取消结算" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
        <el-form ref="SelectformRef" :model="Selectform"  >
          <el-form-item label="取消结算类型：" prop="passOrReject">
            <fetch-select
              :request="fetchOptions"
              enumCode="vw_wholesale_order_cancel_settle_type"
              v-model="Selectform.cancelSettleType"
              placeholder="请选择"
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
  name: 'BatchCancelSettleInput',
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
      Selectform: {
        cancelSettleType: '20'
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
        this.Selectform.cancelSettleType = this.Selectform.cancelSettleType || '20';
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
      this.$emit('batchCancelSettle', {
        cancelSettleType: this.Selectform.cancelSettleType
      });
      this.dialogVisible = false;
    },
    cancel () {
      this.dialogVisible = false;
    }
  }
};
</script>
