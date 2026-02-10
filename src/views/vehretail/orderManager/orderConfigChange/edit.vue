<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="改配操作时间：" prop="operateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.operateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="改配操作人名称：" prop="operateUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.operateUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改前物料编码：" prop="materialsCodeBefore">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCodeBefore"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改前车型名称：" prop="modelNameBefore">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelNameBefore"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改前年款名称：" prop="yearTypeNameBefore">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.yearTypeNameBefore"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="修改前物料描述：" prop="materialsDescBefore">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsDescBefore"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改后物料编码：" prop="materialsCodeAfter">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCodeAfter"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改后车型名称：" prop="modelNameAfter">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelNameAfter"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改后年款名称：" prop="yearTypeNameAfter">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.yearTypeNameAfter"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="修改后物料描述：" prop="materialsDescAfter">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsDescAfter"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="零售订单ID：" prop="retailOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店组织ID：" prop="saleOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="改配操作人ID：" prop="operateUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.operateUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改前车系ID：" prop="seriesIdBefore">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesIdBefore"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改前车系名称：" prop="seriesNameBefore">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesNameBefore"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改前车型ID：" prop="modelIdBefore">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelIdBefore"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改前年款ID：" prop="yearTypeIdBefore">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.yearTypeIdBefore"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="修改后车系ID：" prop="seriesIdAfter">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesIdAfter"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改后车系名称：" prop="seriesNameAfter">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesNameAfter"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改后车型ID：" prop="modelIdAfter">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelIdAfter"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改后年款ID：" prop="yearTypeIdAfter">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.yearTypeIdAfter"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="数据来源，150-新销服; 10-老销服：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="操作时间：" prop="operateTime">
                  {{ form.operateTime }}
                </el-form-item>
                <el-form-item label="操作人：" prop="operateUserName">
                  {{ form.operateUserName }}
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="缴定金时间：" prop="paymentTime">
                  {{ form.paymentTime }}
                </el-form-item>
                <el-form-item label="修改前物料编码：" prop="materialsCodeBefore">
                  {{ form.materialsCodeBefore }}
                </el-form-item>
                <el-form-item label="修改前车型名称：" prop="modelNameBefore">
                  {{ form.modelNameBefore }}
                </el-form-item>
                <el-form-item label="修改前年款名称：" prop="yearTypeNameBefore">
                  {{ form.yearTypeNameBefore }}
                </el-form-item>
                <el-form-item label="修改前物料描述：" prop="materialsDescBefore">
                  {{ form.materialsDescBefore }}
                </el-form-item>
                <el-form-item label="修改后物料编码：" prop="materialsCodeAfter">
                  {{ form.materialsCodeAfter }}
                </el-form-item>
                <el-form-item label="修改后车型名称：" prop="modelNameAfter">
                  {{ form.modelNameAfter }}
                </el-form-item>
                <el-form-item label="修改后年款名称：" prop="yearTypeNameAfter">
                  {{ form.yearTypeNameAfter }}
                </el-form-item>
                <el-form-item label="修改后物料描述：" prop="materialsDescAfter">
                  {{ form.materialsDescAfter }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/orderConfigChange/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  operateTime: '',
  operateUserName: '',
  saleDealerName: '',
  mallOrderCode: '',
  materialsCodeBefore: '',
  modelNameBefore: '',
  yearTypeNameBefore: '',
  materialsDescBefore: '',
  materialsCodeAfter: '',
  modelNameAfter: '',
  yearTypeNameAfter: '',
  materialsDescAfter: '',
  remark: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  status: '',
  statusDesc: '',
  retailOrderId: '',
  retailOrderCode: '',
  saleOrgId: '',
  saleDealerCode: '',
  operateUserId: '',
  seriesIdBefore: '',
  seriesNameBefore: '',
  modelIdBefore: '',
  yearTypeIdBefore: '',
  seriesIdAfter: '',
  seriesNameAfter: '',
  modelIdAfter: '',
  yearTypeIdAfter: '',
  dataSource: '',
};

export default {
  name: 'orderConfigChangeEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '订单改配信息管理详情';
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '订单改配信息管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-retailOrderConfigChange',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        operateTime: [
          { required: true, message: '请选择改配操作时间', trigger: 'change' }
        ],
        operateUserName: [
          { required: true, message: '请输入改配操作人名称', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        mallOrderCode: [
          { required: true, message: '请输入商城订单编号', trigger: 'change' }
        ],
        materialsCodeBefore: [
          { required: true, message: '请输入修改前物料编码', trigger: 'change' }
        ],
        modelNameBefore: [
          { required: true, message: '请输入修改前车型名称', trigger: 'change' }
        ],
        yearTypeNameBefore: [
          { required: true, message: '请选择修改前年款名称', trigger: 'change' }
        ],
        materialsDescBefore: [
          { required: true, message: '请输入修改前物料描述', trigger: 'change' }
        ],
        materialsCodeAfter: [
          { required: true, message: '请输入修改后物料编码', trigger: 'change' }
        ],
        modelNameAfter: [
          { required: true, message: '请输入修改后车型名称', trigger: 'change' }
        ],
        yearTypeNameAfter: [
          { required: true, message: '请选择修改后年款名称', trigger: 'change' }
        ],
        materialsDescAfter: [
          { required: true, message: '请输入修改后物料描述', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        retailOrderId: [
          { required: true, message: '请输入零售订单ID', trigger: 'change' }
        ],
        retailOrderCode: [
          { required: true, message: '请输入零售订单号', trigger: 'change' }
        ],
        saleOrgId: [
          { required: true, message: '请输入销售门店组织ID', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        operateUserId: [
          { required: true, message: '请输入改配操作人ID', trigger: 'change' }
        ],
        seriesIdBefore: [
          { required: true, message: '请输入修改前车系ID', trigger: 'change' }
        ],
        seriesNameBefore: [
          { required: true, message: '请输入修改前车系名称', trigger: 'change' }
        ],
        modelIdBefore: [
          { required: true, message: '请输入修改前车型ID', trigger: 'change' }
        ],
        yearTypeIdBefore: [
          { required: true, message: '请选择修改前年款ID', trigger: 'change' }
        ],
        seriesIdAfter: [
          { required: true, message: '请输入修改后车系ID', trigger: 'change' }
        ],
        seriesNameAfter: [
          { required: true, message: '请输入修改后车系名称', trigger: 'change' }
        ],
        modelIdAfter: [
          { required: true, message: '请输入修改后车型ID', trigger: 'change' }
        ],
        yearTypeIdAfter: [
          { required: true, message: '请选择修改后年款ID', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150-新销服; 10-老销服', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
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
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
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
