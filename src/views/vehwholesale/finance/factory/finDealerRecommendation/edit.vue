<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="经销商推荐函："
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <span class="status primary">{{form.code}}</span>
        </template>
        <template #extraButtons>
          <el-button size="small">推送金融机构</el-button>
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
                  <el-form-item label="推荐金融机构：" prop="recFinancialOrganizationName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.recFinancialOrganizationName"
                    clearable
                    :disabled="isEditing===true"
                  />
                </el-form-item>
                 <el-form-item label="推荐额度：" prop="recAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.recAmount"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="推荐日期：" prop="recDate">
                  <el-date-picker
                     type="date"
                    v-model="form.recDate"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
                <el-form-item label="保证金比例%：" prop="depositRatio">
                  <el-input
                    placeholder="请输入"
                    v-model="form.depositRatio"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                   <el-date-picker
                      v-model="form.createTime"
                      type="datetime"
                      disabled
                      placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="同步状态：" prop="syncStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_sync_status"
                    v-model="form.syncStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="isEditing===true"
                  />
                </el-form-item>
                 <el-form-item label="同步时间：" prop="syncTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.syncTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :disabled="isEditing===true"
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
                    :disabled="isEditing===true"
                  />
                </el-form-item>
                  <el-form-item label="同步结果：" prop="syncResult">
                  <el-input
                    placeholder="请输入"
                    v-model="form.syncResult"
                    :disabled="isEditing===true"
                    clearable
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
                 <el-form-item label="状态变更描述：" prop="statusDesc">
                 <el-input
                    placeholder="请输入"
                    v-model="form.statusDesc"
                    :disabled="isEditing===true"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="备注（说明）：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    :disabled="isEditing===true"
                    clearable
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
                <el-form-item label="推荐金融机构：" prop="recFinancialOrganizationName">
                  {{ form.recFinancialOrganizationName }}
                </el-form-item>
                <el-form-item label="推荐额度：" prop="recAmount">
                  {{ form.recAmount }}
                </el-form-item>
                <el-form-item label="推荐日期：" prop="recDate">
                  {{ form.recDate }}
                </el-form-item>
                <el-form-item label="保证金比例%：" prop="depositRatio">
                  {{ form.depositRatio }}
                </el-form-item>
                  <el-form-item label="编码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="同步状态：" prop="syncStatus">
                  {{ form.syncStatusLabel }}
                </el-form-item>
                <el-form-item label="同步时间：" prop="syncTime">
                  {{ form.syncTime }}
                </el-form-item>
                  <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="同步结果：" prop="syncResult">
                  {{ form.syncResult }}
                </el-form-item>
                 <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                 <el-form-item label="备注（说明）：" prop="remark">
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/finance/factory/finDealerRecommendation/index';
import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getParentCompany } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

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
  status: '1',
  statusDesc: '',
  dataSource: '',
  code: '',
  ownerOrgId: '',
  dealerCompanyName: '',
  dealerCompanyCode: '',
  recFinancialOrganizationName: '',
  recFinancialOrganizationId: '',
  recAmount: '',
  recDate: new Date(),
  depositRatio: '',
  syncStatus: '10',
  syncResult: '',
  syncTime: '',
  syncCount: '',
};

export default {
  name: 'finDealerRecommendationEdit',
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
      pageTitle: '账户管理-车厂融资信息-经销商推荐函管理',
      pageType: 'edit',
      title: '主键：' + form.id,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-finDealerRecommendation',
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
      columns: [],
      rules: {
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'change' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'change' }
        ],
        recFinancialOrganizationName: [
          { required: true, message: '请输入推荐金融机构', trigger: 'change' }
        ],
        recAmount: [
          { required: true, message: '请输入推荐额度', trigger: 'change' }
        ],
        recDate: [
          { required: true, message: '请选择推荐日期', trigger: 'change' }
        ],
        depositRatio: [
          { required: true, message: '请输入保证金比例%', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注（说明）', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        // code: [
        //   { required: true, message: '请输入编码', trigger: 'change' }
        // ],
      }
    };
  },
  mounted () {
  },
  methods: {
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
