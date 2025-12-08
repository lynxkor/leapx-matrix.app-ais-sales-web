<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-edit">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" inline>
              <!-- B1087R1TCNLJHAG0292 -->
              <el-form-item label="物料编码：" prop="materialsCode">
                <fetch-select
                :options="materialsList"
                v-model="form.materials.materialsCode"
                placeholder="请选择"
                optionKey="id"
                labelKey="materialsCode"
                valueKey="materialsCode"
                :remoteMethod="debouncedMaterialsMethod"
                @change="materialsSelect"
                remote
                clearable
                filterable/>
              </el-form-item>
              <el-form-item
                v-for="(field, index) in formFields"
                :key="index"
                :label="field.label"
              >
                <el-input
                  placeholder="请输入"
                  v-model="form.materials[field.key]"
                  :disabled="field.disabled"
                />
              </el-form-item>
            </el-form>
          </div>
        </section>

        <section class="common-section">
          <div class="common-section-header">
            <h2>可配物料信息</h2>
          </div>
          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" inline>
            <el-form-item label="可配物料编码：" prop="matchMaterialsCode">
              <fetch-select
                :options="matchMaterialsList"
                v-model="form.matchMaterials.materialsCode"
                placeholder="请选择"
                optionKey="id"
                labelKey="materialsCode"
                valueKey="materialsCode"
                :remoteMethod="debouncedMatchMaterialsMethod"
                @change="matchMaterialsSelect"
                remote
                clearable
                filterable/>
            </el-form-item>
            <el-form-item
              v-for="(field, index) in formFields1"
              :key="index"
              :label="field.label"
            >
              <el-input
                placeholder="请输入"
                v-model="form.matchMaterials[field.key]"
                :disabled="field.disabled"
              />
            </el-form-item>
          </el-form>
        </section>

        <section class="common-section">
          <div class="common-section-header">
            <h2>属性信息</h2>
          </div>
          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" inline>
            <el-form-item label="状态：" prop="status">
              <fetch-select
                :request="fetchOptions"
                enumCode="StatusEnum"
                v-model="form.status"
                placeholder="请选择"
                clearable
                filterable
              />
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
import { getDetail, addOrUpdate, vehicleMaterialsMatchList } from '@/api/datacenter/materials/vehicleMaterialsMatch/index';
import { getList } from '@/api/datacenter/materials/vehicleMaterials/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import { debounce } from '@/libs/utils/index';

const defaultForm = {
  // 多选时字段有变化，自行修复
  materialsId: '',
  status: ''
};

export default {
  name: 'vehicleMaterialsMatchEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      formFields: [
        { label: '物料描述：', key: 'materialsDesc', disabled: true },
        { label: '车系：', key: 'seriesName', disabled: true },
        { label: '车型：', key: 'modelName', disabled: true },
        { label: '年款：', key: 'yearTypeName', disabled: true },
        { label: '外观：', key: 'exteriorName', disabled: true },
        { label: '内饰：', key: 'interiorName', disabled: true },
        { label: '车顶：', key: 'roofName', disabled: true },
        { label: '轮毂：', key: 'wheelHubName', disabled: true },
        { label: '选装包：', key: 'optionPackageName', disabled: true },
        { label: '电池电芯：', key: 'batteryCellName', disabled: true }
      ],
      formFields1: [
        { label: '物料描述：', key: 'materialsDesc', disabled: false },
        { label: '车系：', key: 'seriesName', disabled: true },
        { label: '车型：', key: 'modelName', disabled: true },
        { label: '年款：', key: 'yearTypeName', disabled: true },
        { label: '外观：', key: 'exteriorName', disabled: true },
        { label: '内饰：', key: 'interiorName', disabled: true },
        { label: '车顶：', key: 'roofName', disabled: true },
        { label: '轮毂：', key: 'wheelHubName', disabled: true },
        { label: '选装包：', key: 'optionPackageName', disabled: true },
        { label: '电池电芯：', key: 'batteryCellName', disabled: true }
      ],
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        materialsDesc: [
          { required: true, message: '请输入物料名称', trigger: 'blur' }
        ],
        matchMaterialsCode: [
          { required: true, message: '请输入可配物料编码', trigger: 'blur' }
        ],
        matchMaterialsDesc: [
          { required: true, message: '请输入可配物料名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注（说明）', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'blur' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'blur' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        matchCode: [
          { required: true, message: '请输入记录单号', trigger: 'blur' }
        ],
        materialsId: [
          { required: true, message: '请输入物料ID', trigger: 'blur' }
        ],
        matchMaterialsId: [
          { required: true, message: '请输入可配物料ID', trigger: 'blur' }
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
      },
      materialsList: [],
      matchMaterialsList: []
    };
  },
  created () {
    // 使用 debounce 包装原始方法
    this.debouncedMaterialsMethod = debounce(this.materialsMethod, 300);
    this.debouncedMatchMaterialsMethod = debounce(this.matchMaterialsMethod, 300);
  },
  beforeDestroy () {
    // 清除防抖函数，避免内存泄漏
    this.debouncedMaterialsMethod.cancel();
    this.debouncedMatchMaterialsMethod.cancel();
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['销服-业务主数据-配置主数据-物料配车关系', `${id ? '编辑' : '新建'}`]);
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
      const vehicleMaterials = {
        matchMaterials: {
          materialsCode: ''
        },
        materials: {
          materialsCode: ''
        },
        materialsId: '',
        materialsCode: '',
        materialsDesc: '',
        modelName: '',
        seriesName: '',
        yearTypeName: '',
        exteriorName: '',
        interiorName: '',
        wheelHubName: '',
        roofName: '',
        optionPackageName: '',
        batteryCellName: ''
      };

      return {
        ...defaultForm,
        ...vehicleMaterials
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
    async materialsMethod (query) {
      const res = await getList({ materialsCodeLike: query, size: 20, statusIncludeList: ['1'] });
      this.materialsList = res.records;
      console.log('materialsCodeRemoteMethod', res);
    },
    async matchMaterialsMethod (query) {
      const res = await getList({ materialsCodeLike: query, size: 20, statusIncludeList: ['1'] });
      this.matchMaterialsList = res.records;
      console.log('matchMaterialsMethod', res);
    },
    async materialsMatchCodeRemoteMethod (query) {
      console.log('query', query);
      const res = await vehicleMaterialsMatchList({ size: 10000, materialsCode: query });
      console.log('res', res);
    },
    materialsSelect (val, query) {
      if (val) {
        this.form.materials = query;
      } else {
        this.materialsCode = [];
      }
    },
    matchMaterialsSelect (val, query) {
      if (val) {
        this.form.matchMaterials = query;
      } else {
        this.matchMaterialsList = [];
      }
    }
  }
};
</script>
