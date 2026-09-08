<template>
  <edit-page-layout ref="editLayout" title="资金账户月度余额" showPaneFooter>
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
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="记录编号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="parentCompanyName">
                  <!-- <el-link type="primary" :href="`/service/datacenter/store/parentCompany/detail?companyCode=${form.parentCompanyCode}`" target="_blank">{{ form.parentCompanyName }}</el-link> -->
                  {{ form.parentCompanyName }}
                </el-form-item>
                <el-form-item label="年份：" prop="year">
                  {{ form.year }}
                </el-form-item>
                <el-form-item label="月份：" prop="month">
                  {{ form.month }}
                </el-form-item>
                <el-form-item label="本期期初：" prop="periodBeginBalance">
                  {{ formatAmount(form.periodBeginBalance) }}
                </el-form-item>
                <el-form-item label="本期期末：" prop="periodEndBalance">
                  {{ formatAmount(form.periodEndBalance) }}
                </el-form-item>
                <el-form-item label="本期使用金额：" prop="periodUseAmount">
                  {{ formatAmount(form.periodUseAmount) }}
                </el-form-item>
                <el-form-item label="本期入账金额：" prop="periodEntryAmount">
                  {{ formatAmount(form.periodEntryAmount) }}
                </el-form-item>
                <el-form-item label="账户类型：" prop="accountType">
                  {{ form.accountTypeLabel }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financeOrganizationName">
                   <el-link type="primary" :href="`/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=${form.financeOrganizationId}`" target="_blank">{{ form.financeOrganizationName }}</el-link>
                </el-form-item>
                <el-form-item label="合作类型：" prop="cooperationType">
                  {{ form.cooperationTypeLabel }}
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
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/fundAccountMonthBalance/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { formatAmount as fmtAmount } from '@/libs/utils';

const defaultForm = {
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: 1,
  statusDesc: '',
  dataSource: '',
  code: '',
  ownerOrgId: '',
  parentCompanyCode: '',
  parentCompanyName: '',
  year: '',
  month: '',
  periodBeginBalance: '',
  periodEndBalance: '',
  periodUseAmount: '',
  periodEntryAmount: '',
  accountType: '',
  financeOrganizationId: '',
  financeOrganizationCode: '',
  financeOrganizationName: '',
  cooperationType: ''
};

export default {
  name: 'fundAccountMonthBalanceEdit',
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
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '资金账户月度余额：' + (this.form.code || '');
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
      pageTitle: '资金账户月度余额',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundAccountMonthBalance',
      loading: false,
      submitLoading: false,
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    formatAmount (value) {
      return fmtAmount(value);
    },
  }
};
</script>
