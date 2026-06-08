<template>
  <el-dialog
    class="m-confirmdoc-dialog"
    title="取消锁车"
    width="30%"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
    :z-index="2001"
  >
  <el-form size="small" ref="form" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="申请原因：" prop="unlockReasonCode">
      <fetch-select
        style="width: 100%"
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
    <el-form-item label=" " prop="reasonExplain">
      <el-input v-model="form.reasonExplain" disabled class="unification-input" />
    </el-form-item>
    <el-form-item label="更换后配置：" prop="materialsCode" v-if="shouldShowMaterialField">
      <el-button size="small" type="primary" plain @click="showMaterialsDialog()">选择配置</el-button>
    </el-form-item>
    <el-form-item label=" " v-if="shouldShowMaterialField">
      <el-input v-model="form.materialsCode" disabled class="unification-input" readonly />
      <!-- <span>{{ form.materialsCode }}</span> -->
    </el-form-item>
    <el-form-item label="处理方式：" prop="orderHandleType" v-if="shouldShowHandleTypeField">
      <el-select v-model="form.orderHandleType" style="width: 100%">
        <el-option label="手动选择现车" :value="10" />
        <el-option label="系统自动匹配批售单" :value="20" />
      </el-select>
    </el-form-item>
    <el-form-item label="需绑定VIN号：" prop="bindVin" v-if="shouldShowVinField" :rules=" form.orderHandleType === 10 ? [{ required: true, message: '手动选择现车时，VIN必填', trigger: 'blur' }] : []">
      <el-button size="small" type="primary" plain :disabled="form.orderHandleType !== 10" @click="showVinDialog()">选择车辆</el-button>
    </el-form-item>
    <el-form-item label=" " v-if="shouldShowVinField">
      <el-input v-model="form.bindVin" disabled class="unification-input" readonly />
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
    <el-form-item label="附件上传：" v-if="form.unlockReasonCode === 'DJY004'">
      <AisAttachment
        :businessId="businessId"
        ref="attachment"
      />
    </el-form-item>
  </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" :loading="submitLoading" type="primary" @click="submit()">确定</el-button>
      </div>
    </template>

    <!-- 物料选择对话框 -->
    <MaterialsDialog
      ref="materialsDialog"
      @confirm="onMaterialsSelected"
      :row="row"
      :use-external-confirm="true"
    />
    <!-- VIN 选择对话框 -->
    <VinDialog
      ref="vinDialog"
      @confirm="onVinSelected"
      :use-external-confirm="true"
    />
  </el-dialog>
</template>

<script>

import { perUnlock, checkBeforePerUnlock, getSysConfigParamValue } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import { getList } from '@/api/vehretail/basicConfig/retailOrderUnlockReasonConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import MaterialsDialog from '../MaterialsDialog'; // 引入物料选择对话框
import VinDialog from '../VinDialog'; // 引入 VIN 选择对话框
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
    },
    accountFlag: {
      type: Boolean,
      default: null
    }
  },
  components: {
    AisAttachment,
    FetchSelect,
    MaterialsDialog,
    VinDialog
  },
  data () {
    return {
      dialogVisible: false,
      form: { ...defaultForm },
      vinForm: {},
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
    showVinDialog () {
      this.$refs.vinDialog.show(this.vinForm, this.row);
    },
    handleUnlockReasonCodeChange (val, row) {
      this.form.unlockReason = row.unlockReason;
      this.form.reasonExplain = row.reasonExplain;
      // 切换申请原因时，清空其他可能变化的字段
      this.form.materialsCode = '';
      this.form.materialsDesc = '';
      this.form.orderHandleType = null;
      this.form.bindVin = '';
      this.form.remark = '';
      this.form.orderUnlockFileReqList = [];
    },
    getList (params) {
      getList({ ...params, pageNum: 1, status: 1 }).then(res => {
        this.unlockReasonOptions = res.records;
      }).catch(() => {
      });
    },
    // 显示物料选择对话框
    async showMaterialsDialog () {
      // 校验改配次数：如果 accountFlag 为 true 且改配次数>=1，则不允许更换配置
      const res1 = await getSysConfigParamValue({ paramCode: 'veretailChangeConfigCount' });
      const veretailChangeConfigCount = res1?.paramValue !== null && res1?.paramValue !== undefined ? Number(res1.paramValue) : 1;
      if (this.accountFlag && this.row.changeConfigCount >= veretailChangeConfigCount) {
        this.$message.error('该订单改配次数已达上限');
        return;
      }
      this.$refs.materialsDialog.show();
    },
    // 物料选择确认回调
    onMaterialsSelected (material) {
      this.form.materialsDesc = material.materialsDesc;
      this.form.materialsCode = material.materialsCode;
      this.form.changeProductSkuPriceId = material.id;
    },
    // VIN 选择确认回调
    onVinSelected (vehicle) {
      this.form.bindVin = vehicle.vin;
    },
    close () {
      this.vinForm = {};
      this.dialogVisible = false;
    },
    closed () {
      this.$refs.form.resetFields();
      this.form = { ...defaultForm };
    },
    show (params, unlockReason) {
      this.dialogVisible = true;
      this.vinForm = params;
      this.getList(unlockReason);
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
            orderUnlockFileReqList: this.form.orderUnlockFileReqList,
            changeProductSkuPriceId: this.form.changeProductSkuPriceId,
          };
          console.log('params:', params);
          // 先调用弹框校验接口,根据返回的 transferVehicle 判断是否需要弹"调拨回原门店"提示
          checkBeforePerUnlock(params).then(checkRes => {
            const transferVehicle = checkRes && checkRes.transferVehicle;
            if (transferVehicle) {
              // 是调拨车辆,弹框询问是否需要调回原门店
              const originalDealerName = (checkRes && checkRes.originalDealerName) || '';
              this.$confirm(`订单车辆为自动调拨匹配，取消锁车是否自动调拨车辆回原门店（${originalDealerName}）`, '取消锁车', {
                confirmButtonText: '调拨',
                cancelButtonText: '不调拨',
                type: 'warning'
              }).then(() => {
                this.doPerUnlock({ ...params, confirmTransferBack: true });
              }).catch(() => {
                this.doPerUnlock({ ...params, confirmTransferBack: false });
              });
            } else {
              this.doPerUnlock(params);
            }
          }).catch(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    doPerUnlock (params) {
      perUnlock(params).then(res => {
        this.$message.success('取消锁车成功');
        this.$emit('refresh');
      }).finally(() => {
        this.submitLoading = false;
        this.close();
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
    // width: 215px;
  }
</style>
