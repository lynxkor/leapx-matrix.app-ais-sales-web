<template>
  <edit-page-layout ref="editLayout" title="金融订单详情" showPaneFooter>
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
                <el-form-item label="金融订单号：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="商城订单号：">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="分期订单号：">
                  {{ form.installmentOrderCode }}
                </el-form-item>
                <el-form-item label="金融订单状态：">
                  <span class="status-tag link">{{ form.financeOrderStatusLabel }}</span>
                </el-form-item>
                <el-form-item label="VIN码：">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="合作伙伴名称：">
                  {{ form.partnerName }}
                </el-form-item>
                <el-form-item label="基本车型：">
                  {{ form.basicCarModel }}
                </el-form-item>
                <el-form-item label="交车日期：">
                  {{ form.deliveryDate }}
                </el-form-item>
                <el-form-item label="是否贴息：">
                  {{ form.discount ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="贴息方案：">
                  {{ form.discountScheme }}
                </el-form-item>
                <el-form-item label="门店有无金融返佣：">
                  {{ form.dealerHasCommissionLabel }}
                </el-form-item>
                <el-form-item label="金融机构：">
                  {{ form.financeOrganizationName }}
                </el-form-item>
                <el-form-item label="贷款申请时间：">
                  {{ form.loanApplicationTime }}
                </el-form-item>
                <el-form-item label="放款日期：">
                  {{ form.loanDisbursementDate }}
                </el-form-item>
                <el-form-item label="所属区域和部门：">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="省：">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="数据来源：">
                  {{ form.dataSourceLabel }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="负责人：">
                  {{ form.respManName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 车主信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>车主信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="车主姓名：">
                  {{ form.carOwnerName }}
                </el-form-item>
                <el-form-item label="手机号码：">
                  {{ form.phoneNumber }}
                </el-form-item>
                <el-form-item label="证件类型：">
                  {{ form.idTypeLabel }}
                </el-form-item>
                <el-form-item label="身份证号：">
                  {{ form.idNumber }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 财务信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>财务信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="开票金额：">
                  {{ form.invoiceAmount }}
                </el-form-item>
                <el-form-item label="终端售价：">
                  {{ form.terminalPrice }}
                </el-form-item>
                <el-form-item label="首付金额（元）：">
                  {{ form.downPayment }}
                </el-form-item>
                <el-form-item label="放款金额：">
                  {{ form.loanAmount }}
                </el-form-item>
                <el-form-item label="车款贷款金额：">
                  {{ form.vehicleLoanAmount }}
                </el-form-item>
                <el-form-item label="衍生费用贷款金额：">
                  {{ form.derivativeFeeLoanAmount }}
                </el-form-item>
                <el-form-item label="贴息前利息金额：">
                  {{ form.interestBeforeDiscount }}
                </el-form-item>
                <el-form-item label="贴息前手续费金额：">
                  {{ form.handlingFeeBeforeDiscount }}
                </el-form-item>
                <el-form-item label="贴息前年化利率：">
                  {{ form.annualRateBeforeDiscount }}
                </el-form-item>
                <el-form-item label="分期期数：">
                  {{ form.installmentPeriods }}
                </el-form-item>
                <el-form-item label="贷款费率（%）：">
                  {{ form.loanRate }}
                </el-form-item>
                <el-form-item label="总利息金额：">
                  {{ form.totalInterest }}
                </el-form-item>
                <el-form-item label="厂家贴息金额：">
                  {{ form.manufacturerDiscountAmount }}
                </el-form-item>
                <el-form-item label="厂家贴息费率（%）：">
                  {{ form.manufacturerDiscountRate }}
                </el-form-item>
                <el-form-item label="客户承担利息金额：">
                  {{ form.customerBearInterest }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 审批记录 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>审批记录</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="审核时间：">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="审核意见：">
                  {{ form.auditOpinion }}
                </el-form-item>
                <el-form-item label="取消原因：">
                  {{ form.cancelReason }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <div style="padding: 20px;">
          <h3>订单概况</h3>
          <div style="margin-top: 10px; padding: 15px; background: #f5f7fa; border-radius: 4px;">
            <div><strong>金融订单号:</strong> {{ form.code || '-' }}</div>
            <div style="margin-top: 8px;"><strong>VIN码:</strong> {{ form.vin || '-' }}</div>
            <div style="margin-top: 8px;"><strong>车主姓名:</strong> {{ form.carOwnerName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>门店名称:</strong> {{ form.dealerName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>放款金额:</strong> {{ form.loanAmount || '-' }}</div>
            <div style="margin-top: 8px;"><strong>贷款申请时间:</strong> {{ form.loanApplicationTime || '-' }}</div>
          </div>
        </div>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail } from '@/api/vehretail/financeSubsidy/vrFinanceOrder/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  code: '',
  mallOrderCode: '',
  installmentOrderCode: '',
  financeOrderStatus: null,
  vin: '',
  dealerName: '',
  partnerName: '',
  basicCarModel: '',
  deliveryDate: '',
  discount: false,
  discountScheme: '',
  dealerHasCommission: false,
  financeOrganizationName: '',
  loanApplicationTime: '',
  loanDisbursementDate: '',
  regionName: '',
  provinceName: '',
  cityName: '',
  respManName: '',
  carOwnerName: '',
  phoneNumber: '',
  idType: null,
  idNumber: '',
  invoiceAmount: null,
  terminalPrice: null,
  downPayment: null,
  loanAmount: null,
  vehicleLoanAmount: null,
  derivativeFeeLoanAmount: null,
  interestBeforeDiscount: null,
  handlingFeeBeforeDiscount: null,
  annualRateBeforeDiscount: null,
  installmentPeriods: null,
  loanRate: null,
  totalInterest: null,
  manufacturerDiscountAmount: null,
  manufacturerDiscountRate: null,
  customerBearInterest: null,
  auditTime: '',
  auditOpinion: '',
  cancelReason: '',
  remark: '',
  dataSource: null,
  createTime: '',
  creatorName: '',
  modifierName: '',
  updateTime: ''
};

export default {
  name: 'vrFinanceOrderEdit',
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
      return '金融订单号：' + (this.form.code || '');
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
      pageTitle: '金融订单',
      pageType: 'edit',
      moduleKey: 'AISVR-vrFinanceOrder',
      form: { ...form },
      originalForm: { ...form }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
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
