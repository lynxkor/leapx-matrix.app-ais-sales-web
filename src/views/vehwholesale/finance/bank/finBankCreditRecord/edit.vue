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
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  {{ form.dealerCompanyCode }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="融资金融机构：" prop="fundFinancialOrganizationName">
                  {{ form.fundFinancialOrganizationName }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="编号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="经销商名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>额度信息</h2>
            </div>
            <div class="common-section-body">
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="授信额度：" prop="creditLimit">
                  {{ form.creditLimit }}
                </el-form-item>
                <el-form-item label="已用额度：" prop="usedLimit">
                  {{ form.usedLimit }}
                </el-form-item>
                <el-form-item label="剩余可用额度：" prop="availableLimit">
                  {{ form.availableLimit }}
                </el-form-item>
                <el-form-item label="批复敞口额度：" prop="wholesaleExposureLimit">
                  {{ form.wholesaleExposureLimit }}
                </el-form-item>
                <el-form-item label="占用敞口额度：" prop="occupiedExposureLimit">
                  {{ form.occupiedExposureLimit }}
                </el-form-item>
                <el-form-item label="可用敞口额度：" prop="usedExposureLimit">
                  {{ form.usedExposureLimit }}
                </el-form-item>
                <el-form-item label="最高授信额度：" prop="maxCreditLimit">
                  {{ form.maxCreditLimit }}
                </el-form-item>
                <el-form-item label="保证金比例%：" prop="depositRatio">
                  {{ form.depositRatio }}
                </el-form-item>
                <el-form-item label="额度生效日期：" prop="limitEffectiveDate">
                  {{ form.limitEffectiveDate }}
                </el-form-item>
                <el-form-item label="额度失效日期：" prop="limitExpiryDate">
                  {{ form.limitExpiryDate }}
                </el-form-item>
                <el-form-item label="业务模式：" prop="businessMode">
                  {{ form.businessModeLabel }}
                </el-form-item>
                <el-form-item label="授信记录编码：" prop="creditRecordCode">
                  {{ form.creditRecordCode }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/finance/bank/finBankCreditRecord/index';
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
  fundFinancialOrganizationIds: [],
  fundFinancialOrganizationId: '',
  creditLimit: '',
  usedLimit: '',
  availableLimit: '',
  wholesaleExposureLimit: '',
  occupiedExposureLimit: '',
  usedExposureLimit: '',
  maxCreditLimit: '',
  depositRatio: '',
  limitEffectiveDate: '',
  limitExpiryDate: '',
  businessMode: '',
  remark: '',
  creditRecordCode: '',
  status: '1',
  statusDesc: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  dataSource: '',
  ownerOrgId: '',
};

export default {
  name: 'bankEdit',
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
      pageTitle: '账户管理-银行融资信息-银行授信记录管理',
      pageType: 'edit',
      title: '编码：' + form.code,
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-finBankCreditRecord',
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
