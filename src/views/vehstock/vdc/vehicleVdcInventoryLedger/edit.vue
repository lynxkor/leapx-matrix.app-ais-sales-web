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
                  clearable filterable @change="reservedChange" />
              </el-form-item>
              <el-form-item label="销售预留类型" prop="reservedType">
                <el-select v-model="form.reservedType" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
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
import { getDetail, batchEdit } from '@/api/vehstock/vdc/vehicleVdcInventoryLedger/index';
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
      allOptions: [], // 固定不变的原始数据源
      options: [], // 动态显示的选项
      rules: {
        reserved: [
          { required: true, message: '请输入销售预留', trigger: 'change' }
        ],
        reservedType: [
          { required: true, message: '请选择销售预留类型', trigger: 'change' }
        ],
        allowLockRetail: [
          { required: true, message: '请输入允许锁零售单', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  watch: {
    '$route.query.id': {
      handler (newVal, oldVal) {
        if (!newVal) {
          this.rules.reserved[0].required = false;
          this.rules.reservedType[0].required = false;
          this.rules.allowLockRetail[0].required = false;
          this.salesType();
        }
      },
      immediate: true
    }
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
          if (this.$route.query.id) {
            this.salesType();
          }
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          const id = this.$route.query.id;
          if (!id) {
            let list = JSON.parse(localStorage.getItem('selectedIds'));
            this.form.ids = list;
          } else {
            this.form.ids = [id];
          }
          batchEdit({ ...this.form }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            if (rest || !id) {
              this.resetForm(formName);
              localStorage.removeItem('selectedIds');
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
    },
    // 销售预留类型接口枚举
    async salesType () {
      const res = await getEnum('vehstock_reserved_type');
      this.allOptions = res.map(item => {
        return {
          label: item.message,
          value: Number(item.code)
        };
      });
      if (Number(this.form.reserved) === 0) {
        // 当 销售预留 为 否 时，只显示可售
        this.options = this.allOptions.filter(option => option.value === 1);
      } else {
        // 当 销售预留 不为 否 时，不显示可售
        this.options = this.allOptions.filter(option => option.value !== 1);
      };
    },
    // 点击销售预留改变预留类型值
    reservedChange () {
      this.form.reservedType = '';
      if (Number(this.form.reserved) === 0) {
        // 当 销售预留 为 否 时，只显示可售
        this.options = this.allOptions.filter(option => option.value === 1);
      } else {
        // 当 销售预留 不为 否 时，不显示可售
        this.options = this.allOptions.filter(option => option.value !== 1);
      }
    }
  }
};
</script>
