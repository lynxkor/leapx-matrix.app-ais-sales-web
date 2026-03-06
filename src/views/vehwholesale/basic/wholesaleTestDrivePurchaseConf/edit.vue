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
              <el-form-item label="物料编码" prop="materialsId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.materialsId"
                  :params="form.materialsCode"
                  :remote-method="getVehicleMaterialsList"
                  value-key="id"
                  label-key="materialsCode"
                  @change="(val, record) => {form.materialsCode = record?.materialsCode || ''}"
                  :disabled="!!_id"
                />
              </el-form-item>
              <el-form-item label="车系" prop="seriesId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.seriesId"
                  :params="form.seriesName"
                  :remote-method="getVehicleSeriesList"
                  value-key="id"
                  label-key="name"
                  @change="(val, record) => {form.seriesName = record?.name || ''}"
                  :disabled="!!_id"
                />
              </el-form-item>
              <el-form-item label="车型" prop="modelId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.modelId"
                  :params="form.modelName"
                  :remote-method="getModelIdList"
                  value-key="id"
                  label-key="name"
                  @change="handleModelChange"
                  :disabled="!!_id"
                />
              </el-form-item>
              <el-form-item label="年款" prop="vehicleYearTypeId" v-show = "!!!_id">
                <fetch-select
                  filterable
                  clearable
                  v-model="form.vehicleYearTypeId"
                  :options="yearTypeList"
                  value-key="value"
                  label-key="label"
                  :disabled="!!_id"
                  @change="(val, record) => {form.vehicleYearType = record?.label || ''}"
                />
              </el-form-item>
              <el-form-item label="年款" prop="vehicleYearTypeId" v-show = "!!_id">
                <el-input
                  :value="form.vehicleYearType"
                  :disabled="!!_id"
                />
              </el-form-item>
              <el-form-item label="选装包" prop="optionPackageId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.optionPackageId"
                  :params="form.optionPackageName"
                  :remote-method="getOptionPackageList"
                  value-key="id"
                  label-key="name"
                  @change="(val, record) => {form.optionPackageName = record?.name || ''}"
                  :disabled="!!_id"
                />
              </el-form-item>
              <el-form-item label="允许试驾车批售" prop="allowTestDriveWholesale">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="BooleanEnum"
                  v-model="form.allowTestDriveWholesale"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="物料描述" prop="materialsDesc">
                <el-input
                  type="textarea"
                  rows="4"
                  placeholder="请输入"
                  v-model="form.materialsDesc"
                  clearable
                  :disabled="!!_id"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" @click="handleBack">取消</el-button>
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleTestDrivePurchaseConf/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, vehicleSeriesList, vehicleOptionPackage, listVehicleModel, vehicleModelYearTypeRelation, vehicleMaterials } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  materialsCode: '',
  materialsDesc: '',
  seriesName: '',
  modelName: '',
  vehicleYearType: '',
  optionPackageName: '',
  allowTestDriveWholesale: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  materialsId: '',
  seriesId: '',
  modelId: '',
  vehicleYearTypeId: '',
  optionPackageId: '',
  ownerOrgId: '',
};

export default {
  name: 'wholesaleTestDrivePurchaseConfEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '试驾车采购配置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleTestDrivePurchaseConf',
      loading: false,
      yearTypeList: [],
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        materialsDesc: [
          { required: false, message: '请输入物料描述', trigger: 'blur' }
        ],
        seriesName: [
          { required: true, message: '请输入车系', trigger: 'blur' }
        ],
        modelName: [
          { required: false, message: '请输入车型', trigger: 'blur' }
        ],
        vehicleYearType: [
          { required: true, message: '请选择年款', trigger: 'change' }
        ],
        optionPackageName: [
          { required: false, message: '请输入选装包', trigger: 'blur' }
        ],
        allowTestDriveWholesale: [
          { required: true, message: '请输入允许试驾车批售', trigger: 'blur' }
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
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，140:新销服; 老销服:10', trigger: 'blur' }
        ],
        materialsId: [
          { required: true, message: '请输入物料ID', trigger: 'blur' }
        ],
        seriesId: [
          { required: true, message: '请输入车系ID', trigger: 'blur' }
        ],
        modelId: [
          { required: false, message: '请输入车型ID', trigger: 'blur' }
        ],
        vehicleYearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' }
        ],
        optionPackageId: [
          { required: false, message: '请输入选装包ID', trigger: 'blur' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'blur' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    handleBack () {
      // this.$router.back();
      let newPath = this.$route.path.replace(/\/edit$/, '');
      this.$router.push(newPath);
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['试驾车采购配置', `${id ? '编辑' : '新建'}`]);
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
              const currentPath = this.$route.path;
              this.$router.push({
                path: currentPath,
                query: { id: res }
              });
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
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async getModelIdList (params) {
      return listVehicleModel({ modelNameLike: params, status: 1 });
    },
    async handleModelChange (val, record) {
      if (record) {
        this.form.modelName = record.name;
      } else {
        this.form.modelId = null;
        this.form.modelName = null;
      }
      this.yearTypeList = [];
      this.form.vehicleYearTypeId = null;
      this.form.vehicleYearType = null;
      const res = await vehicleModelYearTypeRelation({ modelIdList: [this.form.modelId], size: 1000 });
      return res.map(item => {
        return {
          ...item,
          label: item.yearTypeName,
          value: item.yearTypeId
        };
      });
    },
    async getOptionPackageList (params) {
      return vehicleOptionPackage({ optionPackageNameLike: params, status: 1 });
    },
    async getVehicleMaterialsList (params) {
      return vehicleMaterials({ materialsCodeLike: params, status: 1 });
    },
  }
};
</script>
