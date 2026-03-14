<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
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
              <el-form-item label="配额数" prop="changeAfterQty">
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
                  :businessId="_id"
                  attachType="配额调整说明"
                  configCode="dealer_demo_vehicle_quota_record"
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" @click="handleBack">取消</el-button>
        <el-button size="small" v-permission="'AISVW-wholesaleDealerTestDriveQuota-updateTestDriveQuota'" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, updateTestDriveQuota } from '@/api/vehwholesale/basic/wholesaleDealerTestDriveQuota/index';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  changeAfterQty: '',
  changeQty: '',
  changeDescs: '',
  changeDescFileId: '',
  id: '',
  requestQty: '',
};

export default {
  name: 'dealerDemoVehicleQuotaRecordEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    AisAttachment,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '门店试驾车配额调整记录',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-dealerDemoVehicleQuotaRecord',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        changeBeforeQty: [
          { required: true, message: '请输入变化前数量', trigger: 'blur' }
        ],
        changeAfterQty: [
          { required: true, message: '请输入变化后数量', trigger: 'blur' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['门店试驾车配额调整记录', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          const submitForm = {
            changeAfterQty: this.form.changeAfterQty,
            changeDesc: this.form.changeDescs,
            changeDescFileId: this.form.changeDescFileId,
            changeBeforeQty: this.form.quotaQty,
            relatedId: this._id,
            dealerCode: this.form.dealerCode,
            vehicleYearTypeId: this.form.vehicleYearTypeId,
            vehicleModelLineId: this.form.vehicleModelLineId
          };
          updateTestDriveQuota(submitForm).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            const id = this.$route.query.id;
            if (rest || !id) {
              this.resetForm(formName);
            } else {
              this.getDetailData();
            }
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        changeBeforeQty: defaultForm.quotaQty,
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // handleJumpAuditLog () {
    //   this.$router.push({
    //     path: '/xxx/auditLog',
    //     query: {
    //       tableCode: '',
    //       tableId: ''
    //     }
    //   });
    // },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
