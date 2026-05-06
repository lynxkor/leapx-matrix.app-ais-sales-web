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
          <span>{{ form.code }}</span>
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/partner/channelManagement/parentCompany/edit?companyCode=' + form.dealerCompanyCode)">{{ form.dealerCompanyCode }}</el-button>
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="融资金融机构：" prop="fundFinancialOrganizationName">
                   <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=' + form.fundFinancialOrganizationId)">{{ form.fundFinancialOrganizationName }}</el-button>
                </el-form-item>
                <el-form-item label="融资金额：" prop="financingAmount">
                  {{ form.financingAmount }}
                </el-form-item>
                <el-form-item label="融资类型：" prop="financingType">
                  {{ form.financingTypeLabel }}
                </el-form-item>
                <el-form-item label="借据号：" prop="iouNumber">
                  {{ form.iouNumber }}
                </el-form-item>
                <el-form-item label="子票区间：" prop="subTicketRange">
                  {{ form.subTicketRange }}
                </el-form-item>
                <el-form-item label="融资申请编码：" prop="financingApplicationCode">
                  {{ form.financingApplicationCode }}
                </el-form-item>
                <el-form-item label="出账日期：" prop="accountDate">
                  {{ form.accountDate }}
                </el-form-item>
                <el-form-item label="融资开始日期：" prop="financingStartDate">
                  {{ form.financingStartDate }}
                </el-form-item>
                <el-form-item label="融资到期日期：" prop="financingExpiryDate">
                  {{ form.financingExpiryDate }}
                </el-form-item>
                <el-form-item label="业务模式：" prop="businessMode">
                  {{ form.businessModeLabel }}
                </el-form-item>
                <el-form-item label="保证金比例%：" prop="depositRatio">
                  {{ form.depositRatio }}
                </el-form-item>
                <el-form-item label="保证金金额：" prop="depositAmount">
                  {{ form.depositAmount }}
                </el-form-item>
                <el-form-item label="承兑银行名称：" prop="acceptanceBankName">
                  {{ form.acceptanceBankName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="编码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="说明：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="经销商编码：" prop="dealerCompanyCode">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/partner/channelManagement/parentCompany/edit?companyCode=' + form.dealerCompanyCode)">{{ form.dealerCompanyCode }}</el-button>
                </el-form-item>
                <el-form-item label="经销商名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/finance/bank/finBankFinancingRecord/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dealerCompanyCode: '',
  dealerCompanyName: '',
  fundFinancialOrganizationCodes: [],
  financingAmount: '',
  financingType: '',
  iouNumber: '',
  subTicketRange: '',
  accountDate: '',
  businessMode: '',
  financingStartDate: '',
  financingExpiryDate: '',
  depositRatio: '',
  depositAmount: '',
  acceptanceBankName: '',
  financingApplicationCode: '',
  status: '1',
  remark: '',
  statusDesc: '',
  createTime: '',
  creditAvailableExposure: '',
  creditOccupiedExposure: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  dataSource: '',
  ownerOrgId: '',
  fundFinancialOrganizationCode: '',
  dealerName: '',
};

export default {
  name: 'finBankFinancingRecordEdit',
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
      pageTitle: '银行融资记录',
      pageType: 'edit',
      title: '编码：' + form.code,
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-finBankFinancingRecord',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
    };
  },
  mounted () {
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
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
