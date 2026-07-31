<template>
  <el-dialog
    class="m-confirmdoc-dialog"
    :title="isBatch ? '批量取消锁车' : '取消锁车'"
    width="30%"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
    :z-index="2001"
  >
  <div v-if="isBatch" class="batch-tip">
    <i class="el-icon-info"></i>
    本次将对 <b>{{ batchList.length }}</b> 条订单执行取消锁车操作（仅厂端可用，最多 30 条）。
  </div>
  <el-form size="small" ref="form" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="申请原因：" prop="unlockReasonCode">
      <fetch-select
        style="width: 100%"
        v-model="form.unlockReasonCode"
        :options="isBatch ? batchUnlockReasonOptions : unlockReasonOptions"
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
      <el-select v-model="form.orderHandleType" style="width: 100%" @change="handleOrderHandleTypeChange">
        <el-option label="手动选择现车" :value="10" />
        <el-option label="系统自动匹配批售单" :value="20" />
      </el-select>
    </el-form-item>
    <el-form-item label="需绑定VIN号：" prop="bindVin" v-if="shouldShowVinField" :rules=" form.orderHandleType === 10 || form.unlockReasonCode === 'DJY001' ? [{ required: true, message: '手动选择现车时，VIN必填', trigger: 'blur' }] : []">
      <el-button size="small" type="primary" plain :disabled="form.orderHandleType !== 10 && form.unlockReasonCode !== 'DJY001'" @click="showVinDialog()">选择车辆</el-button>
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

import { perUnlock, checkBeforePerUnlock, getSysConfigParamValue, batchUnlock } from '@/api/vehretail/orderManager/retailOrderInfo/index';
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
      unlockReasonOptions: [],
      batchList: [],
      mode: 'single'
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
    },
    isBatch () {
      return this.mode === 'batch';
    },
    batchUnlockReasonOptions () {
      return (this.unlockReasonOptions || []).filter(item => item.unlockReasonCode === 'DJY099');
    }
  },
  methods: {
    showVinDialog () {
      const params = {
        materialsCode: this.shouldShowMaterialField ? this.form.materialsCode : this.vinForm.materialsCode,
        saleDealerCode: this.vinForm.saleDealerCode
      };
      this.$refs.vinDialog.show(params, this.row);
    },
    handleUnlockReasonCodeChange (val, row) {
      if (this.mode === 'batch') {
        if (val !== 'DJY099') {
          this.$message.error('批量取消锁车只支持申请原因为特殊情况');
          this.$nextTick(() => {
            this.form.unlockReasonCode = 'DJY099';
          });
          return;
        }
        // val === 'DJY099' 时，正常同步原因说明
        const target = (this.unlockReasonOptions || []).find(item => item.unlockReasonCode === 'DJY099');
        if (target) {
          this.form.unlockReason = target.unlockReason;
          this.form.reasonExplain = target.reasonExplain;
        }
        return;
      }
      this.form.unlockReason = row.unlockReason;
      this.form.reasonExplain = row.reasonExplain;
      // 切换申请原因时，清空其他可能变化的字段
      this.form.materialsCode = '';
      this.form.materialsDesc = '';
      this.form.orderHandleType = null;
      this.form.bindVin = '';
      this.form.remark = '';
      this.form.orderUnlockFileReqList = [];
      // 重置受影响的字段校验态，避免沿用旧值留下的红字提示
      if (this.$refs.form) {
        this.$refs.form.clearValidate([
          'materialsCode',
          'orderHandleType',
          'bindVin',
          'remark'
        ]);
      }
    },
    // 处理方式变更时，清空已绑定的VIN号
    handleOrderHandleTypeChange () {
      this.form.bindVin = '';
      // 清空 VIN 后，同步重置其校验状态，避免沿用旧值留下的红字提示
      if (this.$refs.form) {
        this.$refs.form.clearValidate(['bindVin']);
      }
    },
    // 物料（更换后配置）变更：清空依赖物料的下游字段
    handleMaterialsChange () {
      // 下游字段均依赖当前物料，物料一变全部失效
      this.form.orderHandleType = null;
      this.form.bindVin = '';
      if (this.$refs.form) {
        this.$refs.form.clearValidate(['orderHandleType', 'bindVin']);
      }
    },
    getList (params) {
      return new Promise((resolve) => {
        getList({ ...params, pageNum: 1, status: 1 }).then(res => {
          this.unlockReasonOptions = (res && res.records) || [];
          resolve(this.unlockReasonOptions);
        }).catch(() => {
          resolve([]);
        });
      });
    },
    // 显示物料选择对话框
    async showMaterialsDialog () {
      // 校验改配次数：如果 accountFlag 为 true 且改配次数>=1，则不允许更换配置
      const res1 = await getSysConfigParamValue({ paramCode: 'veretailChangeConfigCount' });
      const veretailChangeConfigCount = res1?.paramValue !== null && res1?.paramValue !== undefined ? Number(res1.paramValue) : 1;
      if (this.accountFlag && this.row.changeConfigCount >= veretailChangeConfigCount) {
        this.$message.error('该订单改配置次数已达上限');
        return;
      }
      this.$refs.materialsDialog.show();
    },
    // 物料选择确认回调
    onMaterialsSelected (material) {
      const prevCode = this.form.materialsCode;
      this.form.materialsDesc = material.materialsDesc;
      this.form.materialsCode = material.materialsCode;
      this.form.changeProductSkuPriceId = material.id;
      // 物料实际变更时，级联清理下游字段（处理方式、已绑 VIN）
      if (prevCode !== material.materialsCode) {
        this.handleMaterialsChange();
      }
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
      this.batchList = [];
      this.mode = 'single';
    },
    show (params, unlockReason) {
      this.dialogVisible = true;
      this.mode = (params && params.mode) || 'single';
      this.batchList = (params && params.list) || [];
      this.vinForm = params;
      this.getList(unlockReason).then((records) => {
        if (this.mode === 'batch') {
          // 等待 getList 异步加载完成后再校验 DJY099 是否存在
          const target = (records || []).find(item => item.unlockReasonCode === 'DJY099');
          if (target) {
            this.form.unlockReasonCode = 'DJY099';
            this.form.unlockReason = target.unlockReason;
            this.form.reasonExplain = target.reasonExplain;
          } else {
            this.$message.error('申请原因为特殊情况的配置缺失，无法执行批量取消锁车');
            this.submitLoading = false;
          }
        }
      });
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.submitLoading = true;
        if (this.mode === 'batch') {
          this.doBatchUnlock();
        } else {
          this.doSingleUnlock();
        }
      });
    },
    doSingleUnlock () {
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
      // 先调用弹框校验接口,根据返回的 transferVehicle 判断是否需要弹"调拨回原门店"提示
      checkBeforePerUnlock(params).then(checkRes => {
        const transferVehicle = checkRes && checkRes.transferVehicle;
        if (transferVehicle) {
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
    },
    doBatchUnlock () {
      // 批量：直接调 batchUnlock，跳过 checkBeforePerUnlock
      const params = this.batchList.map(item => ({
        retailOrderId: item.id,
        retailOrderCode: item.retailOrderCode,
        remark: this.form.remark
      }));
      if (!params.length) {
        this.$message.warning('未选择任何订单');
        this.submitLoading = false;
        return;
      }
      batchUnlock(params).then(() => {
        this.$message.success('批量取消锁车成功');
        this.$emit('refresh');
      }).catch(() => {
        this.$message.error('批量取消锁车失败，请稍后重试');
      }).finally(() => {
        this.submitLoading = false;
        this.close();
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
  .batch-tip {
    padding: 0 20px 12px;
    color: #E6A23C;
    font-size: 12px;
  }
</style>
