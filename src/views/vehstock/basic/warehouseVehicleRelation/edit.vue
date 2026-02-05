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
              <el-form-item label="仓库配车编号" prop="code">
                <el-input
                  placeholder="系统自动生成"
                  v-model="form.code"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="整车仓库" prop="warehouseName">
                <fetch-select
                  v-model="form.warehouseName"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  :options="warehouseOptions"
                  placeholder="请选择"
                  :remote-method="serchWarehouse"
                  @change="warehouseType"
                  value-key="id"
                  label-key="warehouseName"
                />
              </el-form-item>
              <el-form-item label="仓库分类" prop="warehouseType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="vehstock_warehouse_type"
                  v-model="form.warehouseType"
                  placeholder="请选择"
                  clearable
                  filterable
                  disabled
                />
              </el-form-item>
              <el-form-item label="省" prop="provinceCode">
                <fetch-select
                  v-model="form.provinceCode"
                  placeholder="请选择"
                  :request="getProvince"
                  value-key="code"
                  label-key="name"
                  filterable
                  @change="handleChangeProvince"
                />
              </el-form-item>
              <el-form-item label="市" prop="cityCode">
                <fetch-select
                  v-model="form.cityCode"
                  placeholder="请选择"
                  :options="cityOptions"
                  value-key="code"
                  label-key="name"
                  filterable
                  @change="handleChangeCity"
                />
              </el-form-item>
              <el-form-item label="配车优先级" prop="priority">
                <el-input
                  type="number"
                  placeholder="请输入"
                  v-model="form.priority"
                  clearable
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
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
import { getDetail, addOrUpdate } from '@/api/vehstock/basic/warehouseVehicleRelation/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, pageWithPermission, getProvinceTree } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  remark: '',
  warehouseCode: '',
  provinceCode: '',
  cityCode: '',
  code: '',
  warehouseName: '',
  warehouseType: '',
  provinceName: '',
  cityName: '',
  priority: '',
  status: '',
};

export default {
  name: 'warehouseVehicleRelationEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions],
  components: {
    FetchSelect,
  },
  data () {
    return {
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      moduleKey: 'AISVS-warehouseVehicleRelation',
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      warehouseOptions: [], // 整车仓库
      provinceOptions: [], // 省
      cityOptions: [], // 市
      rules: {
        code: [
          { required: false, message: '请输入仓库配车编号', trigger: 'blur' }
        ],
        warehouseCode: [
          { required: true, message: '请输入整车仓库编码', trigger: 'blur' }
        ],
        warehouseName: [
          { required: true, message: '请输入整车仓库名称', trigger: 'blur' }
        ],
        warehouseType: [
          { required: true, message: '请选择仓库分类', trigger: 'change' }
        ],
        provinceCode: [
          { required: false, message: '请输入省编码', trigger: 'blur' }
        ],
        cityCode: [
          { required: false, message: '请输入市编码', trigger: 'blur' }
        ],
        provinceName: [
          { required: false, message: '请输入省名称', trigger: 'blur' }
        ],
        cityName: [
          { required: false, message: '请输入市名称', trigger: 'blur' }
        ],
        priority: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '' || value === null || value === undefined) {
                callback(new Error('配车优先级不能为空'));
                return;
              }

              // 转换为数字
              const numValue = Number(value);
              const strValue = value.toString();

              // 检查是否是有效数字
              if (isNaN(numValue)) {
                callback(new Error('配车优先级必须为数字'));
                return;
              }

              // 检查输入字符串和转换后的数字是否一致（防止"01"这样的输入）
              if (numValue.toString() !== strValue) {
                callback(new Error('配车优先级不能包含前导零'));
                return;
              }

              // 检查是否是正整数
              if (!Number.isInteger(numValue) || numValue <= 0) {
                callback(new Error('配车优先级必须为正整数'));
                return;
              }

              // 检查范围
              if (numValue > 99999999) {
                callback(new Error('配车优先级不能大于99999999'));
                return;
              }

              callback();
            },
            trigger: 'blur'
          }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
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
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['仓库配车关系', `${id ? '编辑' : '新建'}`]);
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
    // 选择仓库以后带出信息
    warehouseType (val, selectedOption) {
      console.log(val, selectedOption);
      this.form.warehouseCode = selectedOption?.warehouseCode || '';
      this.form.warehouseName = selectedOption?.warehouseName || '';
      this.form.warehouseType = selectedOption?.warehouseType || '';
    },
    // 搜索仓库
    async serchWarehouse (query) {
      const res = await pageWithPermission({ warehouseName: query, page: 1, size: 100 });
      this.warehouseOptions = res?.records?.map(item => {
        return {
          ...item,
          label: item.warehouseName,
          value: item.warehouseCode,
        };
      });
    },
    // 查询所有省市区
    async getProvince () {
      const res = await getProvinceTree();
      const list = res || [];
      if (this.$route.query.id) { // 编辑时对应上相对应的省 把市赋值上 直接反显
        const province = list.find(item => item.code === this.form.provinceCode);
        // 确保 cityOptions 中的每个市都有 code 和 name 字段
        this.cityOptions = province?.child?.map(city => ({
          code: city.code, // 确保有 code 字段
          name: city.name // 确保有 name 字段
        })) || [];
      };
      return list;
    },
    // 选择省以后带出市信息
    handleChangeProvince (val, selectedOption) {
      if (val) {
        this.form.provinceCode = selectedOption?.code || '';
        this.form.provinceName = selectedOption?.name || '';
        this.cityOptions = selectedOption?.child || []; // 选择省以后带出市信息
        this.form.cityCode = '';
        this.form.cityName = '';
      }
    },
    handleChangeCity (val, selectedOption) {
      if (val) {
        this.form.cityCode = selectedOption?.code || '';
        this.form.cityName = selectedOption?.name || '';
      }
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
