<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="客户采购记录:"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="false"
      >
        <template #status>
          <span>{{ form.code }}</span>
        </template>
        <!-- <template #extraButtons>
          <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button>
        </template> -->
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
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
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="编码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ownerOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据月份：" prop="dataMonth">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataMonth"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="金额合计：" prop="totalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.totalAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="融资金融机构：" prop="fundFinancialOrganizationName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.fundFinancialOrganizationName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="融资金融机构ID：" prop="fundFinancialOrganizationCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.fundFinancialOrganizationCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="经销商编码：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="经销商名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="统一社会信用代码：" prop="unifiedSocialCreditCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.unifiedSocialCreditCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合作时间：" prop="cooperationDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cooperationDate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否有固定经营场所：" prop="hasFixedBusinessPremises">
                  <el-input
                    placeholder="请输入"
                    v-model="form.hasFixedBusinessPremises"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="固定经营场所：" prop="fixedBusinessPremises">
                  <el-input
                    placeholder="请输入"
                    v-model="form.fixedBusinessPremises"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="同步状态：" prop="syncStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.syncStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="同步结果：" prop="syncResult">
                  <el-input
                    placeholder="请输入"
                    v-model="form.syncResult"
                    clearable
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
                  />
                </el-form-item>
                <el-form-item label="推送次数：" prop="syncCount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.syncCount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="融资数据来源：" prop="financingDataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.financingDataSource"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  {{ form.dealerCompanyCode }}
                </el-form-item>
                <el-form-item label="经销商名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                 <el-form-item label="经销商编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="统一社会信用代码：" prop="unifiedSocialCreditCode">
                  {{ form.unifiedSocialCreditCode }}
                </el-form-item>
                <el-form-item label="是否有固定经营场所：" prop="hasFixedBusinessPremises">
                  {{ form.hasFixedBusinessPremisesLabel }}
                </el-form-item>
                 <el-form-item label="固定经营场所：" prop="fixedBusinessPremises">
                  {{ form.fixedBusinessPremises }}
                </el-form-item>
                <el-form-item label="合作时间：" prop="cooperationDate">
                  {{ form.cooperationDate }}
                </el-form-item>
                <el-form-item label="融资金融机构：" prop="fundFinancialOrganizationName">
                  {{ form.fundFinancialOrganizationName }}
                </el-form-item>
                <el-form-item label="编码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>金额信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="金额合计：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="数据月份：" prop="dataMonth">
                  {{ form.dataMonth }}
                </el-form-item>
                <el-form-item label="融资数据来源：" prop="financingDataSource">
                  {{ form.financingDataSourceLabel }}
                </el-form-item>
                    <el-form-item label="同步状态：" prop="syncStatus">
                  {{ form.syncStatusLabel }}
                </el-form-item>
                  <el-form-item label="同步结果：" prop="syncResult">
                  {{ form.syncResult }}
                </el-form-item>
                <el-form-item label="同步时间：" prop="syncTime">
                  {{ form.syncTime }}
                </el-form-item>
                <el-form-item label="推送次数：" prop="syncCount">
                  {{ form.syncCount }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>明细记录</h2>
              <!-- <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button> -->
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="form.detailList"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :auth="{edit: false, delete: false}"
                />
              </div>
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/finance/factory/finCustomerPurchaseRecord/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

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
  dataSource: '',
  code: '',
  ownerOrgId: '',
  dataMonth: '',
  totalAmount: '',
  dealerCompanyCode: '',
  dealerCompanyCodes: '',
  dealerCompanyCodeLike: '',
  fundFinancialOrganizationName: '',
  fundFinancialOrganizationCode: '',
  fundFinancialOrganizationCodes: '',
  dealerCompanyName: '',
  dealerCompanyNames: '',
  dealerCompanyNameLike: '',
  dealerCode: '',
  dealerName: '',
  unifiedSocialCreditCode: '',
  cooperationDate: '',
  hasFixedBusinessPremises: '',
  fixedBusinessPremises: '',
  syncStatus: '',
  syncResult: '',
  syncTime: '',
  syncCount: '',
  financingDataSource: '',
};

export default {
  name: 'finCustomerPurchaseRecordEdit',
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
    EditTable,
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
      pageTitle: '客户采购记录',
      pageType: 'edit',
      title: '主键：' + form.id,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-finCustomerPurchaseRecord',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'code',
          title: '明细编号'
        },
        {
          field: 'dataMonth',
          title: '数据月份',
        },
        {
          field: 'amount',
          title: '金额',
        },
        {
          field: 'createTime',
          title: '创建时间'
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
        dataMonth: [
          { required: true, message: '请输入数据月份', trigger: 'change' }
        ],
        totalAmount: [
          { required: true, message: '请输入金额合计', trigger: 'change' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'change' }
        ],
        fundFinancialOrganizationName: [
          { required: true, message: '请输入融资金融机构', trigger: 'change' }
        ],
        fundFinancialOrganizationCode: [
          { required: true, message: '请输入融资金融机构ID', trigger: 'change' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入经销商编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入经销商名称', trigger: 'change' }
        ],
        unifiedSocialCreditCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'change' }
        ],
        cooperationDate: [
          { required: true, message: '请输入合作时间', trigger: 'change' }
        ],
        hasFixedBusinessPremises: [
          { required: true, message: '请输入是否有固定经营场所', trigger: 'change' }
        ],
        fixedBusinessPremises: [
          { required: true, message: '请输入固定经营场所', trigger: 'change' }
        ],
        syncStatus: [
          { required: true, message: '请选择同步状态', trigger: 'change' }
        ],
        syncResult: [
          { required: true, message: '请输入同步结果', trigger: 'change' }
        ],
        syncTime: [
          { required: true, message: '请选择同步时间', trigger: 'change' }
        ],
        syncCount: [
          { required: true, message: '请输入推送次数', trigger: 'change' }
        ],
        financingDataSource: [
          { required: true, message: '请输入融资数据来源', trigger: 'change' }
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
