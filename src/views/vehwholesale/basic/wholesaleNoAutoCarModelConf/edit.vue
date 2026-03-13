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
              <el-form-item label="车型" prop="modelName">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.modelName"
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
              <el-form-item label="不参与自动批售确认" prop="noJoinAutoConfirm">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="BooleanEnum"
                  v-model="form.noJoinAutoConfirm"
                  placeholder="请选择"
                  clearable
                  filterable
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleNoAutoCarModelConf/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, listVehicleModel, vehicleModelYearTypeRelation } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  wholesaleNoAutoCarModelConfName: '',
  modelName: '',
  vehicleYearType: '',
  noJoinAutoConfirm: '',
  status: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  remark: '',
  statusDesc: '',
  dataSource: '',
  modelId: '',
  vehicleYearTypeId: '',
  ownerOrgId: '',
};

export default {
  name: 'wholesaleNoAutoCarModelConfEdit',
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
      pageTitle: '不自动批售确认车型',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleNoAutoCarModelConf',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      yearTypeList: [],
      rules: {
        wholesaleNoAutoCarModelConfName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        modelName: [
          { required: true, message: '请输入车型', trigger: 'blur' }
        ],
        vehicleYearType: [
          { required: true, message: '请选择年款', trigger: 'change' }
        ],
        noJoinAutoConfirm: [
          { required: true, message: '请输入不参与自动批售确认', trigger: 'blur' }
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
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，140:新销服; 老销服:10', trigger: 'blur' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'blur' }
        ],
        vehicleYearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' }
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
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['不自动批售确认车型', `${id ? '编辑' : '新建'}`]);
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
      const res = await vehicleModelYearTypeRelation({ modelIdList: [val], size: 1000 });
      this.yearTypeList = res.map(item => {
        return {
          ...item,
          label: item.yearTypeName,
          value: item.yearTypeId
        };
      });
    },
  }
};
</script>
