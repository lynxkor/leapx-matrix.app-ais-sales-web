<template>
  <edit-page-layout ref="editLayout" title="金融产品详情" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :detailRequest="detailRequest"
      >
        <el-main>
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="金融产品名称：">
                  {{ form.financeProductName }}
                </el-form-item>
                <el-form-item label="金融产品编码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="金融机构：">
                  {{ form.financeOrganizationName }}
                </el-form-item>
                <el-form-item label="生效日期：">
                  {{ form.effectiveDate }}
                </el-form-item>
                <el-form-item label="失效日期：">
                  {{ form.expireDate }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 产品明细 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>产品明细</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="金融产品类型：">
                  {{ form.financeProductTypeLabel }}
                </el-form-item>
                <el-form-item label="金融产品状态：">
                  <span :class="['status-tag', form.financeProductStatus === 1 ? 'primary' : 'danger']">{{ form.financeProductStatusLabel }}</span>
                </el-form-item>
                <el-form-item label="付息方式：">
                  {{ form.interestPaymentMethodLabel }}
                </el-form-item>
                <el-form-item label="息费模式：">
                  {{ form.interestFeeModeLabel }}
                </el-form-item>
                <el-form-item label="最低首付比例(%)：">
                  {{ form.minDownPaymentRatio }}
                </el-form-item>
                <el-form-item label="最低尾款比例(%)：">
                  {{ form.minFinalPaymentRatio }}
                </el-form-item>
                <el-form-item label="最高首付比例(%)：">
                  {{ form.maxDownPaymentRatio }}
                </el-form-item>
                <el-form-item label="最高尾款比例(%)：">
                  {{ form.maxFinalPaymentRatio }}
                </el-form-item>
                <el-form-item label="最低分期金额(元)：">
                  {{ form.minInstallmentAmount }}
                </el-form-item>
                <el-form-item label="最高分期金额(元)：">
                  {{ form.maxInstallmentAmount }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 利率/费率及返佣率列表 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>利率/费率及返佣率列表</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="rateList"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="financeProductName" title="金融产品" min-width="150" />
                  <vxe-column field="installmentPeriods" title="分期期数" min-width="120" />
                  <vxe-column field="annualInterestRate" title="年化利率(%)" min-width="120" />
                  <vxe-column field="feeRate" title="费率(%)" min-width="120" />
                  <vxe-column field="commissionRate" title="返佣率(%)" min-width="120" />
                  <vxe-column field="createTime" title="创建时间" min-width="180" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无数据</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <div style="padding: 20px;">
          <h3>产品概况</h3>
          <div style="margin-top: 10px; padding: 15px; background: #f5f7fa; border-radius: 4px;">
            <div><strong>金融产品名称:</strong> {{ form.financeProductName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>金融产品编码:</strong> {{ form.code || '-' }}</div>
            <div style="margin-top: 8px;"><strong>金融机构:</strong> {{ form.financeOrganizationName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>生效日期:</strong> {{ form.effectiveDate || '-' }}</div>
            <div style="margin-top: 8px;"><strong>失效日期:</strong> {{ form.expireDate || '-' }}</div>
            <div style="margin-top: 8px;"><strong>金融产品状态:</strong> {{ form.financeProductStatus || '-' }}</div>
          </div>
        </div>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail } from '@/api/vehretail/financeSubsidy/vrFinanceProduct/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  creator: null,
  creatorName: '',
  createTime: '',
  modifier: null,
  modifierName: '',
  updateTime: '',
  remark: '',
  status: null,
  statusDesc: '',
  dataSource: null,
  code: '',
  ownerOrgId: null,
  financeProductName: '',
  financeOrganizationName: '',
  effectiveDate: '',
  expireDate: '',
  financeProductType: null,
  financeProductStatus: null,
  interestPaymentMethod: null,
  interestFeeMode: null,
  minDownPaymentRatio: null,
  minFinalPaymentRatio: null,
  maxDownPaymentRatio: null,
  maxFinalPaymentRatio: null,
  minInstallmentAmount: null,
  maxInstallmentAmount: null
};

export default {
  name: 'vrFinanceProductEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '金融产品编码：' + (this.form.code || '');
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
      pageTitle: '金融产品',
      pageType: 'edit',
      moduleKey: 'AISVR-vrFinanceProduct',
      form: { ...form },
      originalForm: { ...form },
      rateList: []
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          // 如果后端返回了利率列表数据，赋值给rateList
          if (res.rateList && Array.isArray(res.rateList)) {
            this.rateList = res.rateList;
          } else {
            // 如果后端没有返回，可以调用单独的API获取
            // this.getRateList(id);
            this.rateList = [];
          }
          return res;
        });
      }
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    // 如果需要单独调用获取利率列表的API，可以使用以下方法
    // getRateList (id) {
    //   // 根据实际接口调整
    //   getRateListByProductId(id).then(res => {
    //     this.rateList = res || [];
    //   });
    // }
  }
};
</script>

<style lang="scss" scoped>
.page-common-edit {
  h3 {
    margin: 0 0 15px;
    font-size: 16px;
  }
}
</style>
