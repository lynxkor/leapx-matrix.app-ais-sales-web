<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="融资申请经销商："
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <span class="status primary">{{ form.code }}</span>
        </template>
         <template #extraButtons>
          <el-button size="small" @click="genereteFinCustomerPurchaseRecord">生成采购记录</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
              <el-form-item label="母公司名称：" prop="dealerCompanyName">
                <fetch-select
                  :remote-method="getParentCompany"
                  remote
                  v-model="form.dealerCompanyName"
                  placeholder="请选择"
                  labelKey="companyName"
                  valueKey="companyName"
                  clearable
                  filterable
                  :disabled="isEditing===true"
                  @change="getDealerCompanyCode"
                  />
                </el-form-item>
                 <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="融资金融机构：" prop="fundFinancialOrganizationId">
                   <fetch-select
                      :remote-method="repairItemSearch"
                      remote
                      reserve-keyword
                      labelKey="name"
                      valueKey="id"
                      v-model="form.fundFinancialOrganizationId"
                      placeholder="请选择"
                      clearable
                      filterable
                      :disabled="isEditing===true"
                      @change="getfundFinancialOrganizationName"
                    />
                </el-form-item>
                 <el-form-item label="是否合作：" prop="isCooperation">
                  <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.isCooperation"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                </el-form-item>
                 <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="主体母公司名称：" prop="mainDealerCompanyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mainDealerCompanyName"
                    clearable
                    :disabled="isEditing===true"
                  />
                </el-form-item>
                <el-form-item label="主体公司编码：" prop="mainDealerCompanyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mainDealerCompanyCode"
                    clearable
                    :disabled="isEditing===true"
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                  type="datetime"
                  v-model="form.createTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  disabled
                />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  {{ form.dealerCompanyCode }}
                </el-form-item>
                  <el-form-item label="融资金融机构：" prop="fundFinancialOrganizationName">
                  {{ form.fundFinancialOrganizationName }}
                </el-form-item>
                <el-form-item label="是否合作：" prop="isCooperation">
                  {{ form.isCooperationLabel }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="主体母公司名称：" prop="mainDealerCompanyName">
                  {{ form.mainDealerCompanyName }}
                </el-form-item>
                <el-form-item label="主体公司编码：" prop="mainDealerCompanyCode">
                  {{ form.mainDealerCompanyCode }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/finance/apply/finFinancingApplicationDealer/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getParentCompany } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { createFinCustomerPurchaseRecord } from '@/api/vehwholesale/finance/factory/finDealerRecommendation/index';
import { listIdNames } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  createTime: new Date(),
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: 1,
  statusDesc: '',
  dataSource: '',
  code: '',
  ownerOrgId: '',
  dealerCompanyName: '',
  dealerCompanyCode: '',
  isCooperation: 1,
  fundFinancialOrganizationName: '',
  fundFinancialOrganizationId: '',
  mainDealerCompanyName: '',
  mainDealerCompanyCode: '',
};

export default {
  name: 'finFinancingApplicationDealerEdit',
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
      pageTitle: '账户管理-融资管理-融资申请经销商',
      pageType: 'edit',
      title: '主键：' + form.id,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-finFinancingApplicationDealer',
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
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'change' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'change' }
        ],
        isCooperation: [
          { required: true, message: '请输入是否合作', trigger: 'change' }
        ],
        // fundFinancialOrganizationName: [
        //   { required: true, message: '请输入融资金融机构', trigger: 'change' }
        // ],
        fundFinancialOrganizationId: [
          { required: true, message: '请输入融资金融机构ID', trigger: 'change' }
        ],
        mainDealerCompanyName: [
          { required: true, message: '请输入主体母公司名称', trigger: 'change' }
        ],
        mainDealerCompanyCode: [
          { required: true, message: '请输入主体公司编码', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    repairItemSearch (query) { return listIdNames({ organizationNameLike: query, status: 1 }); },
    genereteFinCustomerPurchaseRecord () {
      this.$confirm('是否生成一笔客户采购记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        createFinCustomerPurchaseRecord(this._id).then(() => {
          this.$message({
            type: 'success',
            message: '成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '失败!'
          });
        });
      }).catch(() => {});
    },
    async getParentCompany (query) {
      try {
        const res = await getParentCompany({ parentCompanyName: query });
        console.log(res);
        this.parentCompanyNames = res;
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    getDealerCompanyCode (dealerCompanyCode, obj) {
      this.form.dealerCompanyCode = obj.companyCode;
    },
    getfundFinancialOrganizationName (fundFinancialOrganizationName, obj) {
      this.form.fundFinancialOrganizationName = obj.name;
      console.log(obj, this.form.fundFinancialOrganizationName);
    },
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
