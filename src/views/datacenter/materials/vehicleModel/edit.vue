<template>
  <!-- TIPS: 如果填写项小于15项，使用类名page-common-add替换page-common-edit -->
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项小于15项，去掉 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form  :model="form" :rules="rules" ref="ruleForm" label-width="80px">
              <el-form-item label="车型名称" prop="modelName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modelName"
                  clearable
                />
              </el-form-item>
              <!-- <el-form-item label="年型名称" prop="yearTypeName">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.yearTypeName"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item> -->
              <el-form-item label="车系名称" prop="seriesName">
                <el-input
                  placeholder="请输入"
                  v-model="form.seriesName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="系列名称" prop="modelLineName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modelLineName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
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
              <!-- <el-form-item label="状态变更描述" prop="statusDesc">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.statusDesc"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item> -->
              <el-form-item label="创建人" prop="creatorName">
                <el-input
                  placeholder="请输入"
                  v-model="form.creatorName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  v-model="form.createTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                />
              </el-form-item>
              <!-- <el-form-item label="修改者名称" prop="modifierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifierName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改时间" prop="updateTime">
                <el-date-picker
                  v-model="form.updateTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                />
              </el-form-item>
              <el-form-item label="主键" prop="id">
                <el-input
                  placeholder="请输入"
                  v-model="form.id"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建者" prop="creator">
                <el-input
                  placeholder="请输入"
                  v-model="form.creator"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改者" prop="modifier">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifier"
                  clearable
                />
              </el-form-item>
              <el-form-item label="车系ID" prop="seriesId">
                <el-input
                  placeholder="请输入"
                  v-model="form.seriesId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="系列ID" prop="modelLineId">
                <el-input
                  placeholder="请输入"
                  v-model="form.modelLineId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="年型ID" prop="yearTypeId">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.yearTypeId"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="年款-车型-关系列表" prop="modelYearTypeRelations">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.modelYearTypeRelations"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item> -->
            </el-form>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>年款信息</h2>
            <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <edit-table
                ref="editTable"
                :columns="columns"
                :data="tableData"
                :defaultNewRow="defaultNewRow"
                :show-toolbar="false"
                :options="options"
                :auth="{edit: canAddOrUpdate, delete: canDelete}"
              />
            </div>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button>
        <!-- <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
        <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/datacenter/materials/vehicleModel/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import { getEnum, listVehicleYearType } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';

const defaultForm = {
  // 多选时字段有变化，自行修复
  modelName: '',
  yearTypeName: '',
  seriesName: '',
  modelLineName: '',
  remark: '',
  status: '',
  statusDesc: '',
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  modifier: '',
  seriesId: '',
  modelLineId: '',
  yearTypeId: '',
  modelYearTypeRelations: '',
};

export default {
  name: 'vehicleModelEdit',
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
    EditTable
  },
  data () {
    const form = this.getDefautlForm();
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISDC-vehicleModel',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [],
      options: {
        yearTypeName: [
        ]
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'yearTypeName',
          title: '年型名称',
          width: '20%',
          editable: true,
          editRender: { name: 'ElSelect' },
          rules: [
            {
              required: true,
              message: '年型名称不能为空',
              trigger: 'blur'
            }
          ]
        },
        {
          field: 'creatorName',
          title: '创建人',
          editable: false,
          width: '30%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'createTime',
          title: '创建时间',
          // width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        modelName: [
          { required: true, message: '请输入车型名称，不可重复', trigger: 'blur' }
        ],
        yearTypeName: [
          { required: true, message: '请选择年型名称', trigger: 'change' }
        ],
        seriesName: [
          { required: true, message: '请输入车系名称', trigger: 'blur' }
        ],
        modelLineName: [
          { required: true, message: '请输入系列名称', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' }
        ]
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
    listVehicleYearType () {
      listVehicleYearType({ modelIdList: [this.id || this.$route.query.id] }).then(res => {
        console.log('listVehicleYearType:', res);
        this.options.yearTypeName = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.id
          };
        });
      });
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['新页面', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
          this.tableData = res.modelYearTypeRelations;
          this.listVehicleYearType();
        }).catch(() => {});
      }
    },
    async submitForm (formName, rest = false) {
      try {
        const tableData = await this.handleSaveTable();
        console.log('tableData:', tableData);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            // TIPS: customKey 根据接口格式修改
            addOrUpdate({ ...this.form, yearTypeIds: tableData }).then(res => {
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
      } catch (error) {
        console.log(error);
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        ownerId: userInfo.userId,
        creatorName: userInfo.userName,
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
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
