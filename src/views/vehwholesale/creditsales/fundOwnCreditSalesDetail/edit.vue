<template>
  <edit-page-layout ref="editLayout" title="自有资金赊销明细" showPaneFooter>
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
        :showEditBtn="false"
      >
        <template #status>
          <!-- {{ form.creditSalesDetailCode }} -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2 v-show="_id">基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-if="isEditing || !_id">
                <el-form-item label="赊销明细编号：" prop="creditSalesDetailCode">
                  <el-input
                    placeholder="请输入赊销明细编号"
                    v-model="form.creditSalesDetailCode"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <el-input
                    placeholder="请输入母公司名称"
                    v-model="form.dealerCompanyName"
                    clearable
                    maxlength="100"
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入门店名称"
                    v-model="form.dealerName"
                    clearable
                    maxlength="100"
                  />
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  <el-input
                    placeholder="请输入VIN号"
                    v-model="form.vin"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="整车批售订单：" prop="wholesaleOrderCode">
                  <el-input
                    placeholder="请输入整车批售订单"
                    v-model="form.wholesaleOrderCode"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="企业客户整车订单：" prop="entVehorderCode">
                  <el-input
                    placeholder="请输入企业客户整车订单"
                    v-model="form.entVehorderCode"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="车辆价格：" prop="retailPrice">
                  <el-input-number
                    placeholder="请输入车辆价格"
                    v-model="form.retailPrice"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="批售价/折扣价：" prop="wholesalePrice">
                  <el-input-number
                    placeholder="请输入批售价/折扣价"
                    v-model="form.wholesalePrice"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="首付款比例%：" prop="downPaymentRatio">
                  <el-input-number
                    placeholder="请输入首付款比例"
                    v-model="form.downPaymentRatio"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="现金金额：" prop="cashAmount">
                  <el-input-number
                    placeholder="请输入现金金额"
                    v-model="form.cashAmount"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="返利金额：" prop="rebateAmount">
                  <el-input-number
                    placeholder="请输入返利金额"
                    v-model="form.rebateAmount"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="赊销金额：" prop="creditSalesAmount">
                  <el-input-number
                    placeholder="请输入赊销金额"
                    v-model="form.creditSalesAmount"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="赊销天数：" prop="creditSalesDays">
                  <el-input-number
                    placeholder="请输入赊销天数"
                    v-model="form.creditSalesDays"
                    :precision="0"
                    :step="1"
                    :min="0"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="赊销费用：" prop="creditSalesFee">
                  <el-input-number
                    placeholder="请输入赊销费用"
                    v-model="form.creditSalesFee"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="超期赊销费用：" prop="overdueFee">
                  <el-input-number
                    placeholder="请输入超期赊销费用"
                    v-model="form.overdueFee"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="违约金：" prop="penaltyFee">
                  <el-input-number
                    placeholder="请输入违约金"
                    v-model="form.penaltyFee"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="凭证编号：" prop="voucherNo">
                  <el-input
                    placeholder="请输入凭证编号"
                    v-model="form.voucherNo"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.remark"
                    clearable
                    maxlength="200"
                    type="textarea"
                    :rows="3"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="赊销明细编号：" prop="creditSalesDetailCode">
                  {{ form.creditSalesDetailCode }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <!-- <el-link type="primary" :href="`/partner/channelManagement/companyDetails?companyCode=${form.dealerCompanyCode}`" target="_blank">{{ form.dealerCompanyName }}</el-link> -->
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="资金账户编号：" prop="fundAccountCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/dealerFundAccount/edit?id=${form.fundAccountId}`" target="_blank">{{ form.fundAccountCode }}</el-link>
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">{{ form.dealerName }}</el-link>
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="整车批售订单：" prop="wholesaleOrderCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit?id=${form.wholesaleOrderCode}`" target="_blank">{{ form.wholesaleOrderCode }}</el-link>
                </el-form-item>
                <el-form-item label="企业客户整车订单：" prop="entVehorderCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/entorder/entVehicleOrder/edit?id=${form.entVehorderCode}`" target="_blank">{{ form.entVehorderCode }}</el-link>
                </el-form-item>
                <el-form-item label="车辆价格：" prop="retailPrice">
                  {{ form.retailPrice }}
                </el-form-item>
                <el-form-item label="批售价/折扣价：" prop="wholesalePrice">
                  {{ form.wholesalePrice }}
                </el-form-item>
                <el-form-item label="首付款比例%：" prop="downPaymentRatio">
                  {{ form.downPaymentRatio }}
                </el-form-item>
                <el-form-item label="现金金额：" prop="cashAmount">
                  {{ form.cashAmount }}
                </el-form-item>
                <el-form-item label="返利金额：" prop="rebateAmount">
                  {{ form.rebateAmount }}
                </el-form-item>
                <el-form-item label="赊销金额：" prop="creditSalesAmount">
                  {{ form.creditSalesAmount }}
                </el-form-item>
                <el-form-item label="赊销时间：" prop="creditSalesTime">
                  {{ form.creditSalesTime }}
                </el-form-item>
                <el-form-item label="赊销天数：" prop="creditSalesDays">
                  {{ form.creditSalesDays }}
                </el-form-item>
                <el-form-item label="还款时间：" prop="repaymentTime">
                  {{ form.repaymentTime }}
                </el-form-item>
                <el-form-item label="赊销费用：" prop="creditSalesFee">
                  {{ form.creditSalesFee }}
                </el-form-item>
                <el-form-item label="超期赊销费用：" prop="overdueFee">
                  {{ form.overdueFee }}
                </el-form-item>
                <el-form-item label="违约金：" prop="penaltyFee">
                  {{ form.penaltyFee }}
                </el-form-item>
                <el-form-item label="凭证编号：" prop="voucherNo">
                  {{ form.voucherNo }}
                </el-form-item>
                <el-form-item label="合格证赎回申请：" prop="redemptionCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/certificate/vehicleCertificateRedemption/edit?id=${form.certificateRedemptionApplyId}`" target="_blank">{{ form.redemptionCode }}</el-link>
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/creditsales/fundOwnCreditSalesDetail/index';
// import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import moment from 'moment';

const defaultForm = {
  creditSalesDetailCode: '',
  dealerCompanyName: '',
  dealerCompanyCode: '',
  dealerCode: '',
  dealerName: '',
  vin: '',
  entVehorderCode: '',
  wholesaleOrderCode: '',
  retailPrice: '',
  wholesalePrice: '',
  downPaymentRatio: '',
  cashAmount: '',
  rebateAmount: '',
  creditSalesAmount: '',
  creditSalesTime: '',
  creditSalesDays: '',
  repaymentTime: '',
  creditSalesFee: '',
  overdueFee: '',
  penaltyFee: '',
  voucherNo: '',
  certificateRedemptionApplyId: '',
  fundAccountId: '',
  remark: '',
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  modifier: '',
  status: '',
  statusDesc: '',
  entVehorderId: '',
  wholesaleOrderId: ''
};

export default {
  name: 'fundOwnCreditSalesDetailEdit',
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
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '赊销明细编号：' + this.form.creditSalesDetailCode;
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
      pageTitle: '自有资金赊销明细',
      pageType: 'edit',
      moduleKey: 'AISVW-fundOwnCreditSalesDetail',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        creditSalesDetailCode: [
          { required: true, message: '请输入赊销明细编号', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'blur' },
          { max: 100, message: '最多输入100个字符', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' },
          { max: 100, message: '最多输入100个字符', trigger: 'blur' }
        ],
        vin: [
          { required: true, message: '请输入VIN号', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ],
        wholesaleOrderCode: [
          { required: true, message: '请输入整车批售订单', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ],
        entVehorderCode: [
          { required: true, message: '请输入企业客户整车订单', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ],
        retailPrice: [
          { required: true, message: '请输入车辆价格', trigger: 'change' },
          { type: 'number', min: 0, message: '车辆价格必须大于等于0', trigger: 'change' }
        ],
        wholesalePrice: [
          { required: true, message: '请输入批售价/折扣价', trigger: 'change' },
          { type: 'number', min: 0, message: '批售价必须大于等于0', trigger: 'change' }
        ],
        downPaymentRatio: [
          { required: true, message: '请输入首付款比例', trigger: 'change' },
          { type: 'number', min: 0, max: 100, message: '首付款比例必须在0-100之间', trigger: 'change' }
        ],
        cashAmount: [
          { required: true, message: '请输入现金金额', trigger: 'change' },
          { type: 'number', min: 0, message: '现金金额必须大于等于0', trigger: 'change' }
        ],
        rebateAmount: [
          { required: true, message: '请输入返利金额', trigger: 'change' },
          { type: 'number', min: 0, message: '返利金额必须大于等于0', trigger: 'change' }
        ],
        creditSalesAmount: [
          { required: true, message: '请输入赊销金额', trigger: 'change' },
          { type: 'number', min: 0, message: '赊销金额必须大于等于0', trigger: 'change' }
        ],
        creditSalesDays: [
          { required: true, message: '请输入赊销天数', trigger: 'change' },
          { type: 'number', min: 0, message: '赊销天数必须大于等于0', trigger: 'change' }
        ],
        creditSalesFee: [
          { required: true, message: '请输入赊销费用', trigger: 'change' },
          { type: 'number', min: 0, message: '赊销费用必须大于等于0', trigger: 'change' }
        ],
        overdueFee: [
          { required: true, message: '请输入超期赊销费用', trigger: 'change' },
          { type: 'number', min: 0, message: '超期赊销费用必须大于等于0', trigger: 'change' }
        ],
        penaltyFee: [
          { required: true, message: '请输入违约金', trigger: 'change' },
          { type: 'number', min: 0, message: '违约金必须大于等于0', trigger: 'change' }
        ],
        voucherNo: [
          { required: true, message: '请输入凭证编号', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ]
      }
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
      // 提交时移除只读字段
      const submitForm = { ...this.form };
      const readOnlyFields = ['creatorName', 'createTime', 'modifierName', 'updateTime', 'fundAccountId'];
      readOnlyFields.forEach(field => {
        delete submitForm[field];
      });
      return addOrUpdate(submitForm);
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        creatorName: userInfo.userName,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
