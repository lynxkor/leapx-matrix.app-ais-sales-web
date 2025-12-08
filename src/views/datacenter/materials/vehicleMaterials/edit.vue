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
                <el-input placeholder="请输入" v-model="form.materialsDesc" clearable disabled/>
              </el-form-item>
              <el-form-item label="车系：" prop="seriesId">
                <fetch-select :options="seriesList" v-model="form.seriesId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable
          @change="seriesListChange" />
              </el-form-item>
              <el-form-item label="车型：" prop="modelId">
                <fetch-select :options="modelList" v-model="form.modelId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable
            @change="modelListChange" />
              </el-form-item>
              <el-form-item label="年款：" prop="yearTypeId">
                <fetch-select :options="yearTypeList" v-model="form.yearTypeId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable/>
              </el-form-item>
              <el-form-item label="外观：" prop="exteriorId">
                <fetch-select :options="exteriorList" v-model="form.exteriorId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable/>
              </el-form-item>
              <el-form-item label="内饰：" prop="interiorId">
                <fetch-select :options="interiorList" v-model="form.interiorId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable/>
              </el-form-item>
              <el-form-item label="车顶：" >
                <fetch-select :options="roofList" v-model="form.roofId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable/>
              </el-form-item>
              <el-form-item label="轮毂：" prop="wheelHubId">
                <fetch-select :options="wheelHubList" v-model="form.wheelHubId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable/>
              </el-form-item>
              <el-form-item label="续航里程：" prop="drivingRangeId">
                <fetch-select :options="drivingRangeList" v-model="form.drivingRangeId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable/>
              </el-form-item>
              <el-form-item label="选配动力：" prop="rangePowerId">
                <fetch-select :options="rangePowerList" v-model="form.rangePowerId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable/>
              </el-form-item>
              <el-form-item label="选装包：" >
                <fetch-select :options="optionPackageList" v-model="form.optionPackageId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable/>
              </el-form-item>
              <el-form-item label="电池电芯：" prop="batteryCellId">
                <fetch-select :options="batteryCellList" v-model="form.batteryCellId" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable/>
              </el-form-item>
              <el-form-item label="状态：" prop="status">
                <fetch-select :request="fetchOptions" enumCode="StatusEnum" v-model="form.status" placeholder="请选择" clearable disabled/>
              </el-form-item>
            </el-form>
          </div>
        </section>

        <section class="common-section" v-permission="moduleKey+'-checkPrice'">
          <div class="common-section-header">
            <h2>价格信息</h2>
          </div>
          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" inline>
            <el-form-item label="整车价格：" prop="price">
              <el-input-number placeholder="请输入" v-model="form.price" clearable :controls="false"
                :precision="2" :min="0.01" :step="0.01"/>
            </el-form-item>
          </el-form>
        </section>

        <section class="common-section" v-permission="moduleKey+'-checkProperties'">
          <div class="common-section-header">
            <h2>属性信息</h2>
          </div>
          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="170px" inline>
            <el-form-item
              v-for="(item, index) in formItems"
              :key="index"
              :label="item.label"
              :prop="item.prop"
            >
              <el-radio-group v-model="form.props[item.prop]">
                <el-radio
                  v-for="option in yes_no_enum"
                  :key="option.code"
                  :label="option.code"
                >
                  {{ option.message }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="停产状态：" prop="discontinueStatus">
              <el-radio-group v-model="form.props.discontinueStatus">
                <el-radio v-for="(option, index) in discontinueStatusList" :key="index" :label="option.code">{{ option.message }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" type="primary" v-if="canAddOrUpdate" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/datacenter/materials/vehicleMaterials/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, vehicleSeriesList, vehicleModelList, vehicleExterior, vehicleInterior, vehicleWheelHub, vehicleOptionPackage, vehicleBatteryCell, vehicleRoof, vehicleDrivingRange, vehicleRangePower, vehicleModelYearTypeRelation, listVehicleYearType } from '@/api/common';
// import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import { fetchAndFormatData } from '@/libs/utils';

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
  props: {
    allowWholesale: '',
    allowProductionSchedule: '',
    allowDisplayVehicleWholesale: '',
    allowTestDriveVehicleWholesale: '',
    allowCustomerSales: '',
    allowWholesaleConfirm: '',
    allowConfigurationModify: '',
    discontinueStatus: ''
  }
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
  mixins: [routeGuard, permissions],
  data () {
    return {
      moduleKey: 'AISDC-vehicleMaterials',
      discontinueStatusList: [],
      // 表单项配置
      formItems: [
        { label: '是否允许现车批售：', prop: 'allowWholesale' },
        { label: '是否允许排产申请：', prop: 'allowProductionSchedule' },
        { label: '是否允许展车批售：', prop: 'allowDisplayVehicleWholesale' },
        { label: '是否允许试驾车批售：', prop: 'allowTestDriveVehicleWholesale' },
        { label: '是否允许企业客户销售：', prop: 'allowCustomerSales' },
        { label: '是否允许批售确认：', prop: 'allowWholesaleConfirm' },
        { label: '是否允许改配：', prop: 'allowConfigurationModify' }
      ],
      loading: false,
      submitLoading: false,
      yes_no_enum: [
        { message: '是', code: true },
        { message: '否', code: false }
      ],
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        price: [
          { required: true, message: '请输入整车价格', trigger: 'blur' }
        ],
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        yearTypeId: [
          { required: true, message: '请选择年款', trigger: 'blur' }
        ],
        modelId: [
          { required: true, message: '请输入车型名称', trigger: 'blur' }
        ],
        exteriorId: [
          { required: true, message: '请输入外观名称', trigger: 'blur' }
        ],
        interiorId: [
          { required: true, message: '请输入内饰名称', trigger: 'blur' }
        ],
        wheelHubId: [
          { required: true, message: '请输入轮毂名称', trigger: 'blur' }
        ],
        roofId: [
          { required: true, message: '请输入车顶名称', trigger: 'blur' }
        ],
        optionPackageId: [
          { required: true, message: '请输入选装包名称', trigger: 'blur' }
        ],
        batteryCellId: [
          { required: true, message: '请输入电池电芯名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        modifierId: [
          { required: true, message: '请输入更改人', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请选择更改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入创建人', trigger: 'blur' }
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
        drivingRangeId: [
          { required: true, message: '请输入续航里程名称', trigger: 'blur' }
        ],
        rangePowerId: [
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
      },
      seriesList: [],
      modelList: [],
      yearTypeList: [],
      yearModelList: [],
      exteriorList: [],
      interiorList: [],
      wheelHubList: [],
      optionPackageList: [],
      batteryCellList: [],
      roofList: [],
      drivingRangeList: [],
      rangePowerList: [],
    };
  },
  mounted () {
    this.initVehicleData();
    this.fetchDiscontinueStatusOptions();
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
    async fetchDiscontinueStatusOptions () {
      try {
        const enumData = this.$store.getters['enum/getEnum']('dc_discontinue_statusEnum');
        if (enumData) {
          this.discontinueStatusList = enumData.map(item => {
            return {
              ...item,
              code: Number(item.code)
            };
          }) || [];
          return;
        } else {
          const response = await getEnum('dc_discontinue_statusEnum');
          this.discontinueStatusList = response.map(item => {
            return {
              ...item,
              code: Number(item.code)
            };
          });
          if (response) {
            // 缓存枚举数据
            this.$store.dispatch('enum/setEnum', { code: 'dc_discontinue_statusEnum', data: response });
          }
        }
      } catch (error) {
        this.$message.error('加载停产状态选项失败，请稍后重试！');
      }
    },
    async initVehicleData () {
      const apiConfigs = [
        { api: vehicleSeriesList, params: { size: 1000 }, target: 'seriesList' },
        { api: vehicleExterior, params: { size: 1000 }, target: 'exteriorList' },
        { api: vehicleInterior, params: { size: 1000 }, target: 'interiorList' },
        { api: vehicleWheelHub, params: { size: 1000 }, target: 'wheelHubList' },
        { api: vehicleOptionPackage, params: { size: 1000 }, target: 'optionPackageList' },
        { api: vehicleBatteryCell, params: { size: 1000 }, target: 'batteryCellList' },
        { api: vehicleRoof, params: { size: 1000 }, target: 'roofList' },
        { api: vehicleDrivingRange, params: { size: 1000 }, target: 'drivingRangeList' },
        { api: vehicleRangePower, params: { size: 1000 }, target: 'rangePowerList' }
      ];
      // 并发调用所有接口
      await Promise.all(apiConfigs.map(config =>
        fetchAndFormatData(this, config.api, config.params, config.target)
      ));
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['销服-业务主数据-配置主数据-整车物料', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          res.status = res.status.toString();
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
    },

    seriesListChange (val) {
      if (val.length) {
        fetchAndFormatData(this, vehicleModelList, { seriesIdList: [val], size: 1000 }, 'modelList');
      } else {
        this.modelList = [];
        this.form.modelId = [];
        this.yearModelList = [];
        this.form.yearTypeId = [];
      }
    },

    async modelListChange (val) {
      const res = await vehicleModelYearTypeRelation({ modelIdList: [val], size: 1000 });
      this.yearTypeList = res.map(item => {
        return {
          ...item,
          label: item.yearTypeName,
          value: item.yearTypeId
        };
      });
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
