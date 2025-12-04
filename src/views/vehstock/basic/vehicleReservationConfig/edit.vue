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
              <el-form-item label="车辆预留编号" prop="code">
                <el-input
                  placeholder="系统自动创建"
                  v-model="form.code"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="vehstock_reservation_type"
                  v-model="form.type"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="业务编号" prop="bizCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.bizCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="需预留数" prop="reserveNum">
                <el-input
                  placeholder="请输入"
                  v-model="form.reserveNum"
                  clearable
                />
              </el-form-item>
              <el-form-item label="已预留数" prop="reservedNum">
                <el-input
                  placeholder="请输入"
                  v-model="form.reservedNum"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否映射其他物料" prop="isRelatedMatch">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="BooleanEnum"
                  v-model="form.isRelatedMatch"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="截取预留起始位" prop="reserveStartPos">
                <el-input
                  placeholder="请输入"
                  v-model="form.reserveStartPos"
                  clearable
                />
              </el-form-item>
              <el-form-item label="截取预留截止位" prop="reserveEndPos">
                <el-input
                  placeholder="请输入"
                  v-model="form.reserveEndPos"
                  clearable
                />
              </el-form-item>
              <el-form-item label="VIN截取预留值" prop="reserveCutValue">
                <el-input
                  placeholder="请输入"
                  v-model="form.reserveCutValue"
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
              <el-form-item label="备注" prop="remark">
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
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehstock/basic/vehicleReservationConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  bizCode: '',
  reserveNum: '',
  reservedNum: '',
  reserveStartPos: '',
  reserveEndPos: '',
  reserveCutValue: '',
  isRelatedMatch: '',
  type: '',
  code: '',
};

export default {
  name: 'vehicleReservationConfigEdit',
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
      moduleKey: 'AISVS-vehicleReservationConfig',
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: false, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: false, message: '请选择状态变更描述', trigger: 'change' }
        ],
        bizCode: [
          { required: false, message: '请输入业务编号', trigger: 'blur' }
        ],
        reserveNum: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '' || value === null || value === undefined) {
                callback(new Error('需预留数不能为空'));
              } else if (value < 0) {
                callback(new Error('需预留数不能小于0'));
              } else if (value > 99999999) {
                callback(new Error('需预留数不能大于99999999'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        reservedNum: [
          { required: false, message: '请输入已预留数', trigger: 'blur' }
        ],
        reserveStartPos: [
          {
            required: false,
            validator: (rule, value, callback) => {
              if (value < 1) {
                callback(new Error('截取预留起始位不能小于1'));
              } else if (value > 50) {
                callback(new Error('截取预留起始位不能大于50'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        reserveEndPos: [
          {
            required: false,
            validator: (rule, value, callback) => {
              if (value < 1) {
                callback(new Error('截取预留截止位不能小于1'));
              } else if (value > 50) {
                callback(new Error('截取预留截止位不能大于50'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        reserveCutValue: [
          { required: false, message: '请输入截取预留值', trigger: 'blur' }
        ],
        isRelatedMatch: [
          { required: false, message: '请输入是否映射其他物料 BooleanEnum ', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        code: [
          { required: false, message: '请输入车辆预留编号', trigger: 'blur' }
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['车辆预留配置', `${id ? '编辑' : '新建'}`]);
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
