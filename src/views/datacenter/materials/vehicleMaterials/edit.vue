<template>
  <div class="page-common-edit">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" inline>
              <el-form-item label="物料编码：" prop="materialsCode">
                <el-input placeholder="请输入" v-model="form.materialsCode" clearable />
              </el-form-item>
              <el-form-item label="物料描述：" prop="materialsDesc">
                <el-input placeholder="请输入" v-model="form.materialsDesc" clearable />
              </el-form-item>
              <el-form-item label="车系：" prop="modelName">
                <el-input placeholder="请输入" v-model="form.modelName" clearable />
              </el-form-item>
              <el-form-item label="车型：" prop="modelName">
                <el-input placeholder="请输入" v-model="form.modelName" clearable />
              </el-form-item>
              <el-form-item label="年款：" prop="modelName">
                <el-input placeholder="请输入" v-model="form.modelName" clearable />
              </el-form-item>
              <el-form-item label="外观：" prop="exteriorName">
                <el-input placeholder="请输入" v-model="form.exteriorName" clearable />
              </el-form-item>
              <el-form-item label="内饰：" prop="interiorName">
                <el-input placeholder="请输入" v-model="form.interiorName" clearable />
              </el-form-item>
              <el-form-item label="车顶：" prop="roofName">
                <el-input placeholder="请输入" v-model="form.roofName" clearable />
              </el-form-item>
              <el-form-item label="轮毂：" prop="wheelHubName">
                <el-input placeholder="请输入" v-model="form.wheelHubName" clearable />
              </el-form-item>
              <el-form-item label="续航里程：" prop="drivingRangeName">
                <el-input placeholder="请输入" v-model="form.drivingRangeName" clearable />
              </el-form-item>
              <el-form-item label="续配动力：" prop="rangePowerName">
                <el-input placeholder="请输入" v-model="form.rangePowerName" clearable />
              </el-form-item>

              <el-form-item label="选配动力：" prop="optionPackageName">
                <el-input placeholder="请输入" v-model="form.optionPackageName" clearable />
              </el-form-item>
              <el-form-item label="选装包：" prop="optionPackageName">
                <el-input placeholder="请输入" v-model="form.optionPackageName" clearable />
              </el-form-item>
              <el-form-item label="电池电芯：" prop="batteryCellName">
                <el-input placeholder="请输入" v-model="form.batteryCellName" clearable />
              </el-form-item>
              <el-form-item label="状态：" prop="status">
                <fetch-select :request="fetchOptions" enumCode="StatusEnum" v-model="form.status" placeholder="请选择"
                  clearable multiple />
              </el-form-item>
            </el-form>
          </div>
        </section>

        <section class="common-section">
          <div class="common-section-header">
            <h2>价格信息</h2>
          </div>
          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" inline>
            <el-form-item label="整车价格：" prop="price">
              <el-input placeholder="请输入" v-model="form.price" clearable />
            </el-form-item>
          </el-form>
        </section>

        <section class="common-section">
          <div class="common-section-header">
            <h2>属性信息</h2>
          </div>
          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="170px" inline>
            <el-form-item label="是否允许现车批售：" prop="allowWholesale">
              <el-radio-group v-model="form.allowWholesale">
                <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否允许排产申请：" prop="allowProductionSchedule">
              <el-radio-group v-model="form.allowProductionSchedule">
                <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否允许展车批售：" prop="allowDisplayVehicleWholesale">
              <el-radio-group v-model="form.allowDisplayVehicleWholesale">
                <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否允许试驾车批售：" prop="allowTestDriveVehicleWholesale">
              <el-radio-group v-model="form.allowTestDriveVehicleWholesale">
                <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否允许企业客户销售	：" prop="allowCustomerSales">
              <el-radio-group v-model="form.allowCustomerSales">
                <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否允许批售确认：" prop="allowWholesaleConfirm">
              <el-radio-group v-model="form.allowWholesaleConfirm">
                <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否允许改配：" prop="allowConfigurationModify">
              <el-radio-group v-model="form.allowConfigurationModify">
                <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="停产状态：" prop="discontinueStatus">
              <el-radio-group v-model="form.discontinueStatus">
                <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/datacenter/materials/vehicleMaterials/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';

const defaultForm = {
  // 多选时字段有变化，自行修复
  price: '',
  materialsCode: '',
  materialsDesc: '',
  modelName: '',
  exteriorName: '',
  interiorName: '',
  wheelHubName: '',
  roofName: '',
  optionPackageName: '',
  batteryCellName: '',
  allowWholesale: '',
  allowProductionSchedule: '',
  allowDisplayVehicleWholesale: '',
  allowTestDriveVehicleWholesale: '',
  allowCustomerSales: '',
  allowWholesaleConfirm: '',
  allowConfigurationModify: '',
  discontinueStatus: '',
  status: '',
  remark: '',
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  modifier: '',
  statusDesc: '',
  modelId: '',
  exteriorId: '',
  interiorId: '',
  wheelHubId: '',
  roofId: '',
  optionPackageId: '',
  batteryCellId: '',
  cellMaterials: '',
  drivingRangeId: '',
  drivingRangeName: '',
  rangePowerId: '',
  rangePowerName: '',
  currencyCode: '',
};

export default {
  name: 'vehicleMaterialsEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    FetchSelect,
  },
  data () {
    return {
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        price: [
          { required: true, message: '请输入整车价格', trigger: 'blur' }
        ],
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        materialsDesc: [
          { required: true, message: '请输入物料描述', trigger: 'blur' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'blur' }
        ],
        exteriorName: [
          { required: true, message: '请输入外观名称', trigger: 'blur' }
        ],
        interiorName: [
          { required: true, message: '请输入内饰名称', trigger: 'blur' }
        ],
        wheelHubName: [
          { required: true, message: '请输入轮毂名称', trigger: 'blur' }
        ],
        roofName: [
          { required: true, message: '请输入车顶名称', trigger: 'blur' }
        ],
        optionPackageName: [
          { required: true, message: '请输入选装包名称', trigger: 'blur' }
        ],
        batteryCellName: [
          { required: true, message: '请输入电池电芯名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        cellMaterials: [
          { required: true, message: '请输入电芯材料枚举：', trigger: 'blur' }
        ],
        drivingRangeName: [
          { required: true, message: '请输入续航里程名称', trigger: 'blur' }
        ],
        rangePowerName: [
          { required: true, message: '请输入续配动力名称', trigger: 'blur' }
        ],
        currencyCode: [
          { required: true, message: '请输入整车价格单位', trigger: 'blur' }
        ],
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  beforeRouteLeave (to, from, next) {
    if (JSON.stringify(this.form) === JSON.stringify(this.originalForm)) {
      next();
    } else {
      this.$confirm('确定要放弃修改吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next();
      }).catch(() => {
        next(false);
      });
    }
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车主数据-整车物料管理', `${id ? '编辑' : '新建'}`]);
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
      this.form = { ...defaultForm };
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

<style lang="scss">
.page-common-edit {
  .el-form-item__content {
    min-width: 180px !important;
    width: 50% !important;
  }
}
</style>
