<template>
  <edit-page-layout ref="editLayout" title="金融机构" showPaneFooter>
    <template #left>
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
              <h2 v-show="_id">基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="170px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="170px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="金融机构名称：" prop="organizationName">
                  <el-input
                    placeholder="请输入金融机构名称"
                    v-model="form.organizationName"
                    clearable
                    maxlength="100"
                  />
                </el-form-item>
                <el-form-item label="金融机构编码：" prop="organizationCode">
                  <el-input
                    placeholder="请输入金融机构编码"
                    v-model="form.organizationCode"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundType">
                  <fetch-select
                    :options="fundTypeOptions"
                    enumCode="vw_fundtype"
                    v-model="form.settleFundType"
                    placeholder="请选择结算资金类型"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="SAP资金类型编码：" prop="sapFundType">
                  <el-input
                    placeholder="请输入SAP资金类型编码"
                    v-model="form.sapFundType"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="合格证发运方式：" prop="certificateShippingWay">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_deliverytype"
                    v-model="form.certificateShippingWay"
                    placeholder="请选择合格证发运方式"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否开启银企直连：" prop="enableBankDirectConnection">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.enableBankDirectConnection"
                    placeholder="请选择是否开启银企直连"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="开启返利使用额度：" prop="rebateUsageQuota">
                  <el-input-number
                    placeholder="请输入开启返利使用额度"
                    v-model="form.rebateUsageQuota"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
                  />
                </el-form-item>
                <el-form-item label="是否生成采购记录：" prop="createPurchaseRecord">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.createPurchaseRecord"
                    placeholder="请选择是否生成采购记录"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态：">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.statusLabel"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建人：">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.creatorName"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建时间：">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.createTime"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="金融机构名称：" prop="organizationName">
                  {{ form.organizationName }}
                </el-form-item>
                <el-form-item label="金融机构编码：" prop="organizationCode">
                  {{ form.organizationCode }}
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundTypeLabel">
                  {{ form.settleFundTypeLabel }}
                </el-form-item>
                <el-form-item label="SAP资金类型编码：" prop="sapFundType">
                  {{ form.sapFundType }}
                </el-form-item>
                <el-form-item label="合格证发运方式：" prop="certificateShippingWayLabel">
                  {{ form.certificateShippingWayLabel }}
                </el-form-item>
                <el-form-item label="是否开启银企直连：" prop="enableBankDirectConnectionLabel">
                  {{ form.enableBankDirectConnectionLabel }}
                </el-form-item>
                <el-form-item label="开启返利使用额度：" prop="rebateUsageQuota">
                  {{ formatAmount(form.rebateUsageQuota) }}
                </el-form-item>
                <el-form-item label="是否生成采购记录：" prop="createPurchaseRecordLabel">
                  {{ form.createPurchaseRecordLabel }}
                </el-form-item>
                <el-form-item label="状态：" prop="statusLabel">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { formatAmount as fmtAmount } from '@/libs/utils';

const defaultForm = {
  organizationName: '',
  organizationCode: '',
  settleFundType: '',
  settleFundTypeLabel: '',
  sapFundType: '',
  certificateShippingWay: '',
  certificateShippingWayLabel: '',
  enableBankDirectConnection: '',
  enableBankDirectConnectionLabel: '',
  rebateUsageQuota: '',
  createPurchaseRecord: '',
  createPurchaseRecordLabel: '',
  status: '',
  statusLabel: '',
  remark: '',
  creatorName: '',
  createTime: '',
  id: ''
};

export default {
  name: 'fundFinancialOrganizationEdit',
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
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '金融机构名称：' + this.form.organizationName;
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
      pageTitle: '金融机构',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundFinancialOrganization',
      loading: false,
      submitLoading: false,
      fundTypeOptions: [],
      shippingWayOptions: [],
      enableBankDirectConnectionOptions: [],
      createPurchaseRecordOptions: [],
      statusOptions: [],
      // yes_no_enum_map: YES_NO_ENUM_MAP,
      isEditing: false,
      isDetail: false,
      isAdd: false,
      isEdit: false,
      isDelete: false,
      isImport: false,

      form: { ...form },
      originalForm: { ...form },
      rules: {
        organizationName: [
          { required: true, message: '请输入金融机构名称', trigger: 'blur' },
          { max: 100, message: '最多输入100个字符', trigger: 'blur' }
        ],
        organizationCode: [
          { required: true, message: '请输入金融机构编码', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9_]+$/, message: '编码只能包含字母、数字和下划线', trigger: 'blur' }
        ],
        settleFundType: [
          { required: true, message: '请选择结算资金类型', trigger: 'change' }
        ],
        sapFundType: [
          { required: true, message: '请输入SAP资金类型编码', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ],
        certificateShippingWay: [
          { required: true, message: '请选择合格证发运方式', trigger: 'change' }
        ],
        enableBankDirectConnection: [
          { required: true, message: '请选择是否开启银企直连', trigger: 'change' }
        ],
        rebateUsageQuota: [
          { required: true, message: '请输入开启返利使用额度', trigger: 'blur' },
          { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的金额格式', trigger: 'blur' }
        ],
        createPurchaseRecord: [
          { required: true, message: '请选择是否生成采购记录', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
    this.fetchsettleFundTypeOptions();
  },
  methods: {
    async fetchsettleFundTypeOptions () {
      const response = await getEnum('vw_fundtype');
      this.fundTypeOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['1010', '1050', '2010'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      // 提交时移除只读字段
      const submitForm = { ...this.form };
      delete submitForm.creatorName;
      delete submitForm.createTime;
      delete submitForm.statusLabel;
      delete submitForm.settleFundTypeLabel;
      delete submitForm.certificateShippingWayLabel;
      delete submitForm.enableBankDirectConnectionLabel;
      delete submitForm.createPurchaseRecordLabel;
      return addOrUpdate(submitForm);
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    formatAmount (value) {
      return fmtAmount(value);
    }
  }
};
</script>
