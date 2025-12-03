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
              <el-form-item label="编号" prop="code">
                <el-input placeholder="系统自动创建" v-model="form.code" clearable disabled />
              </el-form-item>
              <el-form-item label="最小值" prop="quantityMin">
                <el-input type="number" placeholder="请输入" v-model="form.quantityMin" clearable />
              </el-form-item>
              <el-form-item label="最大值" prop="quantityMax">
                <el-input type="number" placeholder="请输入" v-model="form.quantityMax" clearable />
              </el-form-item>
              <el-form-item label="库存存量类型" prop="stockType">
                <fetch-select :request="fetchOptions" enumCode="vehstock_stock_Type" v-model="form.stockType"
                  placeholder="请选择" clearable filterable />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <fetch-select :request="fetchOptions" enumCode="StatusEnum" v-model="form.status" placeholder="请选择"
                  clearable filterable />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input placeholder="请输入" v-model="form.remark" clearable maxLength="500" show-word-limit
                  type="textarea" />
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
import { getDetail, addOrUpdate } from '@/api/vehstock/basic/vehicleInventoryStock/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  quantityMin: 0,
  quantityMax: 0,
  stockType: '',
  status: '',
  remark: '',
};

export default {
  name: 'vehicleInventoryStockEdit',
  // 集中视图预留，不建议使用
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
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        code: [
          { required: false, message: '请输入编号', trigger: 'blur' }
        ],
        quantityMin: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '' || value === null || value === undefined) {
                callback(new Error('最小值不能为空'));
              } else if (value < 0) {
                callback(new Error('最小值不能小于0'));
              } else if (value > 99999999) {
                callback(new Error('最小值不能大于99999999'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        quantityMax: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '' || value === null || value === undefined) {
                callback(new Error('最大值不能为空'));
              } else if (value < 0) {
                callback(new Error('最大值不能小于0'));
              } else if (value > 99999999) {
                callback(new Error('最大值不能大于99999999'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        stockType: [
          { required: true, message: '请选择库存存量类型', trigger: 'change' }
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
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车库存存量定义', `${id ? '编辑' : '新建'}`]);
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
