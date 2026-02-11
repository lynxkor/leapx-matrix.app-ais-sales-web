<template>
  <el-dialog
    class="m-confirmdoc-dialog"
    title="取消锁车"
    width="500px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
    :z-index="2001"
  >
  <el-form size="small" ref="form" :model="form" :rules="rules" label-position="right" label-width="140px">
    <el-form-item label="申请原因：" prop="unlockReasonCode">
      <fetch-select
        v-model="form.unlockReasonCode"
        :options="unlockReasonOptions"
        placeholder="请选择"
        clearable
        filterable
        :labelKey="'unlockReason'"
        :valueKey="'unlockReasonCode'"
        @change="handleUnlockReasonCodeChange"
      />
    </el-form-item>
    <el-form-item label="原因解释说明：" prop="reasonExplain">
      <el-input v-model="form.reasonExplain" disabled class="unification-input" />
    </el-form-item>
    <el-form-item label="更换后配置：" prop="materialsCode" v-if="shouldShowMaterialField">
      <el-input v-model="form.materialsCode" class="unification-input" readonly />
      <el-button size="small" type="primary" @click="showMaterialsDialog()">选择配置</el-button>
    </el-form-item>
    <el-form-item label="处理方式：" prop="orderHandleType" v-if="shouldShowHandleTypeField">
      <el-select v-model="form.orderHandleType">
        <el-option label="手动选择现车" :value="20" />
        <el-option label="系统自动匹配批售单" :value="30" />
      </el-select>
    </el-form-item>
    <el-form-item label="需绑定VIN号：" prop="bindVin" v-if="shouldShowVinField">
      <el-input v-model="form.bindVin" class="unification-input" readonly />
      <el-button size="small" type="primary" @click="showVinDialog()">选择车辆</el-button>
    </el-form-item>
    <el-form-item label="备注：" prop="remark">
      <el-input
        v-model="form.remark"
        maxlength="500"
        type="textarea"
        show-word-limit
        clearable
        class="unification-input" />
    </el-form-item>
    <el-form-item label="附件上传：">
      <AisAttachment
        :businessId="businessId"
        ref="attachment"
      />
    </el-form-item>
  </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" :loading="submitLoading" type="primary" @click="submit()">确 定</el-button>
      </div>
    </template>

    <!-- 物料选择对话框 -->
    <MaterialsDialog
      ref="materialsDialog"
      @confirm="onMaterialsSelected"
      :use-external-confirm="true"
    />
  </el-dialog>
</template>

<script>

import { unlockReasonList, perUnlock } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import FetchSelect from '@/libs/components/FetchSelect';
import MaterialsDialog from '../MaterialsDialog'; // 引入物料选择对话框
import AisAttachment from '@/libs/components/AisAttachment/index.vue';

const defaultForm = {
  retailOrderId: '',
  retailOrderCode: '',
  unlockReasonCode: '',
  unlockReason: '',
  materialsCode: '',
  materialsDesc: '',
  orderHandleType: null,
  bindVin: '',
  remark: '',
  orderUnlockFileReqList: []
};

export default {
  name: 'UnlockDialog',
  props: {
    businessId: {
      type: [String, Number],
      default: ''
    },
    row: {
      type: Object,
      default: null
    }
  },
  components: {
    AisAttachment,
    FetchSelect,
    MaterialsDialog
  },
  data () {
    return {
      dialogVisible: false,
      form: { ...defaultForm },
      rules: {
        unlockReasonCode: [
          { required: true, message: '请选择申请原因', trigger: 'change' }
        ],
        unlockReason: [
          { required: true, message: '请输入原因解释说明', trigger: 'blur' },
          { min: 1, max: 200, message: '原因解释说明长度在1到200个字符之间', trigger: 'blur' }
        ],
        materialsCode: [
          { required: true, message: '请选择更换后配置', trigger: 'blur' }
        ],
        orderHandleType: [
          { required: true, message: '请选择处理方式', trigger: 'change' }
        ],
        bindVin: [
          { required: false, message: '请输入VIN码', trigger: 'blur' },
          { pattern: /^[A-Z0-9]{17}$/, message: '请输入正确的VIN码格式（17位字母和数字）', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' },
          { min: 0, max: 500, message: '备注长度不能超过500个字符', trigger: 'blur' }
        ]
      },
      submitLoading: false,
      unlockReasonOptions: []
    };
  },
  computed: {
    // 根据申请原因判断是否显示更换后配置字段
    shouldShowMaterialField () {
      return this.form.unlockReasonCode === 'DJY003'; // 用户要求更换配置
    },
    // 根据申请原因判断是否显示处理方式字段
    shouldShowHandleTypeField () {
      return ['DJY002', 'DJY003'].includes(this.form.unlockReasonCode); // 用户要求更换配置/用户要求更换同配置车辆
    },
    // 根据申请原因判断是否显示VIN号字段
    shouldShowVinField () {
      return ['DJY001', 'DJY002', 'DJY003'].includes(this.form.unlockReasonCode); // 更换同配置现车，提前交车 / 用户要求更换配置 / 用户要求更换同配置车辆
    }
  },
  methods: {
    handleUnlockReasonCodeChange (val, row) {
      this.form.unlockReason = row.unlockReason;
      this.form.reasonExplain = row.reasonExplain;
    },
    unlockReasonList () {
      unlockReasonList().then(res => {
        this.unlockReasonOptions = res;
      }).catch(() => {
      });
    },
    // 显示物料选择对话框
    showMaterialsDialog () {
      this.$refs.materialsDialog.show();
    },
    // 物料选择确认回调
    onMaterialsSelected (material) {
      this.form.materialsCode = material.materialsCode;
      this.form.materialsDesc = material.materialsDesc;
    },
    close () {
      this.dialogVisible = false;
    },
    closed () {
      this.$refs.form.resetFields();
      this.form = { ...defaultForm };
    },
    show () {
      this.dialogVisible = true;
      this.unlockReasonList();
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          const params = {
            retailOrderId: this.businessId,
            retailOrderCode: this.row.retailOrderCode,
            unlockReasonCode: this.form.unlockReasonCode,
            unlockReason: this.form.unlockReason,
            materialsCode: this.form.materialsCode,
            materialsDesc: this.form.materialsDesc,
            orderHandleType: this.form.orderHandleType,
            bindVin: this.form.bindVin,
            remark: this.form.remark,
            orderUnlockFileReqList: this.form.orderUnlockFileReqList
          };
          console.log('params:', params);
          perUnlock(params).then(res => {
            this.$message.success('取消锁车成功');
            this.$emit('refresh');
          }).finally(() => {
            this.submitLoading = false;
            this.close();
          });
        }
      });
    }

  }
};
</script>
<style lang="scss" scoped>
  .m-confirmdoc-dialog{
    ::v-deep .el-radio-group{
      display: flex;
      flex-direction: column;
      .el-radio{
        margin: 8px 0;
      }
    }
  }
  .unification-input{
    width: 215px;
  }
</style>
