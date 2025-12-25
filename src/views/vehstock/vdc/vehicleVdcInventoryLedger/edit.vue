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
              <el-form-item label="销售预留" prop="reserved">
                <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.reserved" placeholder="请选择"
                  clearable filterable />
              </el-form-item>
              <el-form-item label="销售预留类型" prop="reservedType">
                <fetch-select :request="fetchOptions" enumCode="vehstock_reserved_type" v-model="form.reservedType"
                  placeholder="请选择" clearable filterable />
              </el-form-item>
              <el-form-item label="销售备注" prop="salesRemark">
                <el-input placeholder="请输入" v-model="form.salesRemark" clearable />
              </el-form-item>
              <el-form-item label="特殊预留备注" prop="specialReserveRemark">
                <el-input placeholder="请输入" v-model="form.specialReserveRemark" clearable />
              </el-form-item>
              <el-form-item label="允许锁零售单" prop="allowLockRetail">
                <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.allowLockRetail"
                  placeholder="请选择" clearable filterable />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')"
          :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehstock/vdc/vehicleVdcInventoryLedger/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  reserved: '',
  reservedType: '',
  salesRemark: '',
  specialReserveRemark: '',
  allowLockRetail: '',
};

export default {
  name: 'vehicleVdcInventoryLedgerEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: 'VDC库存台账',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-vehicleVdcInventoryLedger',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        reserved: [
          { required: true, message: '请输入销售预留', trigger: 'blur' }
        ],
        reservedType: [
          { required: true, message: '请选择销售预留类型', trigger: 'change' }
        ],
        allowLockRetail: [
          { required: true, message: '请输入允许锁零售单', trigger: 'blur' }
        ],
        salesRemark: [
          { required: true, message: '请输入销售备注', trigger: 'blur' }
        ],
        specialReserveRemark: [
          { required: true, message: '请输入特殊预留备注', trigger: 'blur' }
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['VDC库存台账', `${id ? '编辑' : '新建'}`]);
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
          addOrUpdate({ ...this.form }).then(res => {
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
        ...defaultForm
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
