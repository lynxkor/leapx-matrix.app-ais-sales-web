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
              <el-form-item label="地区公告编号：" prop="code">
                <el-input
                  placeholder="请输入"
                  v-model="form.code"
                  clearable
                  disabled
                />
              </el-form-item>
              <!-- <el-form-item label="城市名称：" prop="cityCode">
                <el-select
                  v-model="form.cityCode"
                  filterable
                  placeholder="请选择"
                  @change="handleChangeCity"
                  >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="城市名称：" prop="cityCode">
                <fetch-select
                  v-model="form.cityCode"
                  placeholder="请选择"
                  :request="getCity"
                  value-key="areaCode"
                  label-key="areaName"
                  filterable
                  @change="handleChangeCity"
                />
              </el-form-item>
              <el-form-item label="销售公告车型名称：" prop="registeredModelName">
                <fetch-select
                  v-model="form.registeredModelName"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  :options="modelOptions"
                  placeholder="请选择"
                  :remote-method="serchModel"
                  @change="handleChangeModel"
                  value-key="id"
                  label-key="registeredModelName"
                />
              </el-form-item>
              <!-- <el-form-item label="销售公告车型名称：" prop="vehicleSalesVersionName">
                <fetch-select
                  v-model="form.vehicleSalesVersionName"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  placeholder="请选择"
                  :remote-method="serchModel"
                  @change="handleChangeModel"
                />
              </el-form-item> -->
              <el-form-item label="状态：" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="StatusEnum"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备注：" prop="remark">
                <el-input
                  type="textarea"
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                  maxLength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-form>
          </div>
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
import { getDetail, addOrUpdate } from '@/api/vehicleinventory/basic/regionNoticeDirectory/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, cityPage, vehicleSalesVersionList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  cityCode: '',
  cityName: '',
  registeredModelName: '',
  vehicleRegisteredModelId: null,
  status: '',
  remark: '',
};

export default {
  name: 'regionNoticeDirectoryEdit',
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
      options: [],
      modelOptions: [],
      rules: {
        code: [
          { required: true, message: '请输入地区公告编号', trigger: 'blur' }
        ],
        cityName: [
          { required: true, message: '请输入城市名称', trigger: 'blur' }
        ],
        vehicleSalesVersionName: [
          { required: true, message: '请输入销售公告车型名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' }
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
    this.getCity();
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['新页面', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(async res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    // 城市下拉
    async getCity () {
      const params = {
        page: 1,
        size: -1
      };
      const res = await cityPage(params);
      const list = res.records || [];
      return list;
      // this.options = list.map(item => {
      //   return {
      //     ...item,
      //     label: item.areaName,
      //     value: item.areaCode
      //   };
      // });
    },
    // 公告销售车型
    async serchModel (query) {
      const res = await vehicleSalesVersionList({ name: query, size: 100 });
      this.modelOptions = res?.map(item => {
        return {
          ...item,
          label: item.registeredModelName,
          value: item.id,
        };
      });
    },
    // 选择以后城市改变
    handleChangeCity (val, selectedOption) {
      this.form.cityName = selectedOption.areaName;
      // const item = this.options.find(item => item.value === val);
      // if (item) {
      //   this.form.cityName = item.label;
      // }
    },
    // 销售公告车型名称改变
    handleChangeModel (val) {
      const item = this.modelOptions.find(item => item.value === val);
      if (item) {
        this.form.vehicleRegisteredModelId = item.value;
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
  }
};
</script>
