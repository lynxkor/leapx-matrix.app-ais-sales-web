<template>
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="调整前配额数" prop="quotaQty">
                <el-input-number
                  :controls="false"
                  placeholder="请输入"
                  v-model="form.quotaQty"
                  clearable
                  :precision="0"
                  :disabled="true"
                />
              </el-form-item>
              <el-form-item label="调整后配额数" prop="changeAfterQty">
                <el-input-number
                  :controls="false"
                  placeholder="请输入"
                  v-model="form.changeAfterQty"
                  clearable
                  :precision="0"
                />
              </el-form-item>
              <el-form-item label="调整说明" prop="changeDescs">
                <el-input
                  placeholder="请输入"
                  v-model="form.changeDescs"
                  clearable
                />
              </el-form-item>
              <el-form-item label="累计已申请数" prop="requestQty">
                <el-input-number
                  :controls="false"
                  placeholder="请输入"
                  v-model="form.requestQty"
                  clearable
                  :precision="0"
                  :disabled="true"
                />
              </el-form-item>
              <el-form-item label="附件说明" prop="changeDescFileId">
                <AisAttachment
                  ref="attachment"
                  :uploadConfig="{ maxNum: 1 }"
                  :noEcho="false"
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" @click="handleBack">取消</el-button>
        <el-button size="small" v-permission="'AISVW-wholesaleDealerTestDriveQuota-updateTestDriveQuota'" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { updateTestDriveQuota } from '@/api/vehwholesale/basic/wholesaleDealerTestDriveQuota/index';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';

const defaultForm = {
  changeAfterQty: '',
  changeQty: '',
  changeDescs: '',
  changeDescFileId: '',
  id: '',
  requestQty: '',
  quotaQty: 0, // 调整前配额数量
  dealerCode: '',
  vehicleYearTypeId: '',
  vehicleModelLineId: '',
  seriesId: '',
  dealerName: ''
};

export default {
  name: 'QuotaEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
    initialQuotaQty: {
      type: Number,
      default: 0
    },
    initialRequestQty: {
      type: Number,
      default: 0
    },
    initialDealerCode: {
      type: String,
      default: ''
    },
    initialDealerName: {
      type: String,
      default: ''
    },
    initialVehicleYearTypeId: {
      type: String,
      default: ''
    },
    initialVehicleModelLineId: {
      type: String,
      default: ''
    },
    initialSeriesId: {
      type: String,
      default: ''
    }
  },
  components: {
    AisAttachment,
  },
  computed: {
    _id () {
      return this.id || this.form.id;
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  data () {
    return {
      pageTitle: '门店试驾车配额调整',
      pageType: 'edit',
      moduleKey: 'AISVW-dealerDemoVehicleQuotaRecord',
      loading: false,
      submitLoading: false,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        changeAfterQty: [
          { required: true, message: '请输入变化后数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '数量必须大于等于0', trigger: 'blur' }
        ],
        changeDescs: [
          { required: true, message: '请输入调整说明', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    this.initializeFormData();
  },
  methods: {
    handleBack () {
      this.$emit('close');
    },
    initializeFormData () {
      // 使用props传入的数据初始化表单
      this.form = {
        ...this.form,
        id: this.id,
        quotaQty: this.initialQuotaQty || 0,
        requestQty: this.initialRequestQty || 0,
        changeAfterQty: this.initialQuotaQty || 0, // 默认调整后配额等于调整前配额
        dealerCode: this.initialDealerCode,
        dealerName: this.initialDealerName,
        vehicleYearTypeId: this.initialVehicleYearTypeId,
        vehicleModelLineId: this.initialVehicleModelLineId,
        seriesId: this.initialSeriesId
      };

      // 同步到原始表单
      Object.assign(this.originalForm, this.form);
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          const files = this.$refs.attachment.getAttachment();
          const fileData = files[0];
          const fileDto = (fileData) ? {
            fileId: fileData.fileId,
            fileName: fileData.fileName,
            fileUrl: fileData.fileUrl,
            fileSize: fileData.fileSize,
            fileType: fileData.fileType,
            attachType: '配额调整说明',
            configCode: 'dealer_demo_vehicle_quota_record'
          } : null;

          const submitForm = {
            changeAfterQty: this.form.changeAfterQty,
            changeDesc: this.form.changeDescs,
            changeDescFileId: this.form.changeDescFileId,
            changeBeforeQty: this.form.quotaQty, // 调整前配额
            relatedId: this._id,
            dealerCode: this.form.dealerCode,
            dealerName: this.form.dealerName,
            vehicleYearTypeId: this.form.vehicleYearTypeId,
            vehicleModelLineId: this.form.vehicleModelLineId,
            seriesId: this.form.seriesId,
            file: fileDto
          };

          updateTestDriveQuota(submitForm).then(res => {
            this.$message.success('保存成功');
            this.$emit('close');
          }).catch(error => {
            this.$message.error(error.message || '保存失败');
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    }
  }
};
</script>
