<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="车辆合格证赎回："
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="form.buttonControl && form.buttonControl.edit"
      >
        <template #status>
          <span>{{ form.redemptionCode }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if = "form.buttonControl && form.buttonControl.submitRedeem"  size="small" @click="handleSubmit">提交赎回</el-button>
          <el-button v-if = "form.buttonControl && form.buttonControl.submitRedeemAgain" size="small" @click="handleSubmitAgain">重新提交赎回</el-button>
          <el-button v-if = "form.buttonControl && form.buttonControl.confirmReceive" size="small" @click="handleconfirmSign">签收合格证</el-button>
          <el-button v-if = "form.buttonControl && form.buttonControl.delete" size="small" @click="handleDel">删除</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>订单信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="wholesaleRules" ref="wholesaleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="整车批售订单号：" prop="wholesaleOrderCode" :rules="orderCategory == '10' ? wholesaleRules.wholesaleOrderCode : []">
                  <el-tooltip :disabled="!form.wholesaleOrderCode" :content="form.wholesaleOrderCode" placement="top">
                    <el-input
                      style="width: 70%;"
                      placeholder="请选择"
                      v-model="form.wholesaleOrderCode"
                      clearable
                      readonly
                      disabled
                    />
                  </el-tooltip>
                   <el-button size="small" @click="openWholesaleDialog" :disabled="orderCategory !== '10'">选择</el-button>
                </el-form-item>
                <el-form-item label="企业客户整车订单：" prop="entVehicleOrderCode" :rules="orderCategory == '20' ? wholesaleRules.entVehicleOrderCode : []">
                  <el-tooltip :disabled="!form.entVehicleOrderCode" :content="form.entVehicleOrderCode" placement="top">
                    <el-input
                      style="width: 70%;"
                      placeholder="请选择"
                      v-model="form.entVehicleOrderCode"
                      clearable
                      readonly
                      disabled
                    />
                  </el-tooltip>
                  <el-button size="small" @click="openEntDialog" :disabled="orderCategory !== '20'">选择</el-button>
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyName"
                    clearable
                    disabled
                  />
                   <!-- <fetch-select
                      filterable
                      clearable
                      remote
                      v-model="form.dealerCompanyName"
                      :params="form.dealerParentOrgName"
                      :remote-method="getDealerParentOrgList"
                      value-key="companyCode"
                      label-key="companyName"
                      disabled
                    /> -->
                </el-form-item>
                  <el-form-item label="销售门店名称：" prop="saleDealerName">
                    <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                    disabled
                  />
                    <!-- <fetch-select
                        filterable
                        clearable
                        remote
                        collapseTags
                        v-model="form.saleDealerName"
                        :remote-method="getDealerListByName"
                        value-key="storeCode"
                        label-key="storeName"
                        disabled
                      /> -->

                </el-form-item>
                    <el-form-item label="VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="整车物料：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="车系名称：" prop="seriesName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="整车批售订单号：" prop="wholesaleOrderCode">
                  <el-tooltip :disabled="!form.wholesaleOrderCode" :content="form.wholesaleOrderCode" placement="top">
                    <span>{{ form.wholesaleOrderCode }}</span>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="企业客户整车订单号：" prop="entVehicleOrderCode">
                  <el-tooltip :disabled="!form.entVehicleOrderCode" :content="form.entVehicleOrderCode" placement="top">
                    <span>{{ form.entVehicleOrderCode }}</span>
                  </el-tooltip>
                </el-form-item>
                  <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                    <el-form-item label="整车物料：" prop="materialsCode">
                  {{ form.materialsCode }}
                </el-form-item>
                    <el-form-item label="车系名称：" prop="seriesName">
                      <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleSeries/edit?id=' + form.seriesId)">{{ form.seriesName }}</el-button>
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleModel/edit?id=' + form.modelId)">{{ form.modelName }}</el-button>
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
           <section class="common-section">
            <div class="common-section-header">
              <h2>状态信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
               <el-form-item label="合格证状态：" prop="certificateStatus">
                 <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_certificate_redemption_status"
                    v-model="form.certificateStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="赊销结算状态：" prop="creditSettleStatus">
                   <fetch-select
                      :request="fetchOptions"
                      enumCode="vw_credit_status"
                      v-model="form.creditSettleStatus"
                      placeholder="请选择"
                      clearable
                      filterable
                      disabled
                    />
                </el-form-item>
                <el-form-item label="合同SAP状态：" prop="syncSapMsg">
                  <el-input
                    placeholder="请输入"
                    v-model="form.syncSapMsg"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="合格证状态：" prop="certificateStatusLabel">
                  {{ form.certificateStatusLabel }}
                </el-form-item>
                <el-form-item label="赊销结算状态：" prop="creditSettleStatusLabel">
                  {{ form.creditSettleStatusLabel }}
                </el-form-item>
                <el-form-item label="合同SAP状态：" prop="syncSapMsg">
                  {{ form.syncSapMsg }}
                </el-form-item>
              </el-form>
            </div>
          </section>
           <section class="common-section">
            <div class="common-section-header">
              <h2>赊销信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                 <el-form-item label="资金结算类型：" prop="settleFundTypeLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.settleFundTypeLabel"
                    clearable
                    disabled
                  />
                </el-form-item>

                 <el-form-item label="车辆售价：" prop="vehiclePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehiclePrice"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售价：" prop="salePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salePrice"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="首付款比例：" prop="downPaymentRatio">
                  <el-input
                    placeholder="请输入"
                    v-model="form.downPaymentRatio"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="首付款金额：" prop="downPaymentAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.downPaymentAmount"
                    clearable
                     disabled
                  />
                </el-form-item>
                <el-form-item label="赊销欠款金额：" prop="creditDebtAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creditDebtAmount"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="赊销日期：" prop="creditTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.creditTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="还款日期：" prop="repaymentTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.repaymentTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="赊销天数：" prop="creditDays">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creditDays"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="赊销费用：" prop="creditFee">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creditFee"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="超期赊销费用：" prop="overdueCreditFee">
                  <el-input
                    placeholder="请输入"
                    v-model="form.overdueCreditFee"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="违约金：" prop="penaltyAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.penaltyAmount"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="凭证编号：" prop="voucherCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.voucherCode"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="资金结算类型：" prop="settleFundTypeLabel">
                  {{ form.settleFundTypeLabel }}
                </el-form-item>
                <el-form-item label="车辆售价：" prop="vehiclePrice">
                  {{ form.vehiclePrice }}
                </el-form-item>
                <el-form-item label="销售价：" prop="salePrice">
                  {{ form.salePrice }}
                </el-form-item>
                <el-form-item label="首付款比例：" prop="downPaymentRatio">
                  {{ form.downPaymentRatio }}
                </el-form-item>
                <el-form-item label="首付款金额：" prop="downPaymentAmount">
                  {{ form.downPaymentAmount }}
                </el-form-item>
                <el-form-item label="赊销欠款金额：" prop="creditDebtAmount">
                  {{ form.creditDebtAmount }}
                </el-form-item>
                <el-form-item label="赊销日期：" prop="creditTime">
                  {{ form.creditTime }}
                </el-form-item>
                <el-form-item label="还款日期：" prop="repaymentTime">
                  {{ form.repaymentTime }}
                </el-form-item>
                <el-form-item label="赊销天数：" prop="creditDays">
                  {{ form.creditDays }}
                </el-form-item>
                <el-form-item label="赊销费用：" prop="creditFee">
                  {{ form.creditFee }}
                </el-form-item>
                <el-form-item label="超期赊销费用：" prop="overdueCreditFee">
                  {{ form.overdueCreditFee }}
                </el-form-item>
                <el-form-item label="违约金：" prop="penaltyAmount">
                  {{ form.penaltyAmount }}
                </el-form-item>
                <el-form-item label="凭证编号：" prop="voucherCode">
                  {{ form.voucherCode }}
                </el-form-item>
              </el-form>
            </div>
          </section>
           <section class="common-section">
            <div class="common-section-header">
              <h2>邮寄信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="收件人：" prop="receiverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverName"
                    clearable
                    maxlength="15"
                    :disabled="!isEditing"
                  />
                </el-form-item>
                <el-form-item label="收件人手机：" prop="receiverPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverPhone"
                    clearable
                    :disabled="!isEditing"
                  />
                </el-form-item>
                 <el-form-item label="省市区：" prop="areaCode">
                  <el-cascader
                    placeholder="请选择省市区"
                    v-model="areaCode"
                    :props="orgProps"
                    :options="areaOptions"
                    filterable
                    @change="handleChangeArea"
                    :disabled="!isEditing"
                    clearable>
                  </el-cascader>
                </el-form-item>
                <el-form-item label="收件地址：" prop="receiverAddress">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverAddress"
                    clearable
                    maxlength="300"
                    :disabled="!isEditing"
                  />
                </el-form-item>
                <el-form-item label="快递单号：" prop="expressCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.expressCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="快递照片链接地址：" prop="expressPhotoUrl">
                  <el-input
                    placeholder="请输入"
                    v-model="form.expressPhotoUrl"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="合格证照片链接地址：" prop="certificatePhotoUrl">
                  <el-input
                    placeholder="请输入"
                    v-model="form.certificatePhotoUrl"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="收件人：" prop="receiverName">
                  {{ form.receiverName }}
                </el-form-item>
                <el-form-item label="收件人手机：" prop="receiverPhone">
                  {{ form.receiverPhone }}
                </el-form-item>
                 <el-form-item label="省份：" prop="receiverProvinceName">
                  {{ form.receiverProvinceName }}
                </el-form-item>
                <el-form-item label="城市：" prop="receiverCityName">
                  {{ form.receiverCityName }}
                </el-form-item>
                 <el-form-item label="区/县：" prop="receiverDistrictName">
                  {{ form.receiverDistrictName }}
                </el-form-item>
                <el-form-item label="收件地址：" prop="receiverAddress">
                  {{ form.receiverAddress }}
                </el-form-item>
                <el-form-item label="快递单号：" prop="expressCode">
                  {{ form.expressCode }}
                </el-form-item>
                <el-form-item label="快递照片链接地址：" prop="expressPhotoUrl">
                  {{ form.expressPhotoUrl }}
                </el-form-item>
                <el-form-item label="合格证照片链接地址：" prop="certificatePhotoUrl">
                  {{ form.certificatePhotoUrl }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
  <WholesaleOrderDialog
    :visible.sync="orderDialogVisible"
    :orderType="orderDialogType"
    @confirm="handleOrderSelect"
  />
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, deleteItem, submit, listWholesaleOrEntOrder, getLatestReceiverAddress, batchconfirmSign } from '@/api/vehwholesale/certificate/vehicleCertificateRedemption/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import WholesaleOrderDialog from './WholesaleOrderDialog.vue';
import { getEnum, getParentCompany, listOrgStoreInfo } from '@/api/common';
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
  redemptionCode: '',
  dealerCompanyCode: '',
  dealerCompanyName: '',
  saleDealerCode: '',
  saleDealerName: '',
  creditSettleStatus: '10',
  certificateStatus: '10',
  vin: '',
  seriesId: '',
  seriesName: '',
  modelId: '',
  modelName: '',
  settleFundType: '',
  vehiclePrice: '',
  salePrice: '',
  downPaymentRatio: '',
  downPaymentAmount: '',
  creditDebtAmount: '',
  settleSuccessTime: '',
  creditTime: '',
  repaymentTime: '',
  creditDays: '',
  creditFee: '',
  overdueCreditFee: '',
  penaltyAmount: '',
  voucherCode: '',
  wholesaleOrderCode: '',
  entVehicleOrderCode: '',
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
  expressCode: '',
  expressPhotoUrl: '',
  certificatePhotoUrl: '',
  dataSource: '',
};

export default {
  name: 'vehicleCertificateRedemptionEdit',
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
    FetchSelect,
    WholesaleOrderDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '主键：' + this.form.id;
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
    },
    'form.orderCategory': {
      handler (val) {
        console.log('orderCategory', val);
        // 整车批售 12  1050  1010
        if (val === '12') {
          this.rules.financialOrganizationId = [
            { required: true, message: '请输入金融机构', trigger: 'change' }
          ];
          this.form.creditSaleFlag = 0;
        } else if (val === '1050') {
          this.rules.financialOrganizationId = [];
          this.form.creditSaleFlag = 1;
        } else if (val === '1010') {
          this.form.creditSaleFlag = 0;
          this.rules.financialOrganizationId = [];
        }
      },
      immediate: true
    },
  },
  data () {
    const form = this.getDefautlForm();
    const routeOrderCategory = this.$route.query.orderCategory ? (this.$route.query.orderCategory) : '';
    form.orderCategory = routeOrderCategory;
    return {
      pageTitle: '车辆合格证赎回',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVW-vehicleCertificateRedemption',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      orderCategory: routeOrderCategory,
      areaCode: [],
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      wholesaleOrderCodeList: [],
      entVehicleOrderCodeList: [],
      orgProps: {
        checkStrictly: true,
        emitPath: true,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      areaOptions: JSON.parse(localStorage.areaTree),
      tableData: [
      ],
      orderDialogVisible: false,
      orderDialogType: '10',
      wholesaleRules: {
        wholesaleOrderCode: [
          { required: true, message: '请选择整车批售订单号', trigger: 'change' }
        ],
        entVehicleOrderCode: [
          { required: true, message: '请选择企业客户整车订单', trigger: 'change' }
        ]
      },
      rules: {
        certificateStatus: [
          { required: true, message: '请选择合格证状态', trigger: ['change', 'blur'] }
        ],
        creditSettleStatus: [
          { required: true, message: '请选择赊销结算状态', trigger: ['change', 'blur'] }
        ],
        vehiclePrice: [
          { required: true, message: '请输入车辆售价', trigger: 'change' }
        ],
        salePrice: [
          { required: true, message: '请输入销售价', trigger: 'change' }
        ],
        receiverName: [
          { required: true, message: '请输入收件人', trigger: 'change' }
        ],
        receiverPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号', trigger: 'blur' }
        ],
        receiverAddress: [
          { required: true, message: '请输入收件地址', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
    },
    otherentOrderCode (val, row) {
      this.form.dealerCompanyName = row.entCustomerName || '';
      this.form.dealerCompanyCode = row.entCustomerCode || '';
      this.form.saleDealerCode = row.saleDealerCode || '';
      this.form.saleDealerName = row.saleDealerName || '';
      this.form.vin = row.vin || '';
      this.form.materialsCode = row.orderMaterialsCode || '';
      this.form.modelId = row.modelId || '';
      this.form.modelName = row.modelName || '';
      this.form.seriesId = row.seriesId || '';
      this.form.seriesName = row.seriesName || '';
      this.form.settleFundTypeLabel = row.settleFundTypeLabel || '';
      this.form.vehiclePrice = row.salesPrice || '';
      this.form.salePrice = row.salesPrice || '';
      this.form.creditDebtAmount = row.creditSalesAmount || '';

      // 整车批售订单：来源【整车批售订单】的【结算成功时间】企业客户订单：来源【企业客户整车订单】的【结算成功时间 ?? 结算时间
      this.form.creditTime = row.settleTime || '';
      this.form.downPaymentRatio = row.downPaymentRatio || 0;
      this.form.downPaymentAmount = row.downPaymentAmount || 0;
      getLatestReceiverAddress({
        orderType: this.form.orderCategory,
        query: val
      }).then((res) => {
        this.form.receiverName = res.receiverName;
        this.form.receiverPhone = res.receiverPhone;
        this.form.receiverProvinceCode = res.receiverProvinceCode;
        this.form.receiverProvinceName = res.receiverProvinceName;
        this.form.receiverCityCode = res.receiverCityCode;
        this.form.receiverCityName = res.receiverCityName;
        this.form.receiverDistrictCode = res.receiverDistrictCode;
        this.form.receiverDistrictName = res.receiverCityName;
        this.form.receiverAddress = res.receiverAddress;
        this.areaCode = [res.receiverProvinceCode, res.receiverCityCode, res.receiverDistrictCode].filter(Boolean);
        console.log('this.areaCode', this.areaCode);
      });
    },
    otherwholesaleOrderInfo (val, row) {
      this.form.dealerCompanyName = row.dealerCompanyName || '';
      this.form.dealerCompanyCode = row.dealerCompanyCode || '';
      this.form.saleDealerCode = row.saleDealerCode || '';
      this.form.saleDealerName = row.saleDealerName || '';
      this.form.vin = row.vin || '';
      this.form.materialsCode = row.orderMaterialsCode || '';
      this.form.modelId = row.modelId || '';
      this.form.modelName = row.modelName || '';
      this.form.seriesId = row.seriesId || '';
      this.form.seriesName = row.seriesName || '';
      this.form.settleFundTypeLabel = row.settleFundTypeLabel || '';
      this.form.vehiclePrice = row.retailPrice || row.salesPrice || '';
      this.form.salePrice = row.wholesalePrice || '';
      this.form.creditDebtAmount = row.creditSalesAmount || '';
      // 整车批售订单：来源【整车批售订单】的【结算成功时间】企业客户订单：来源【企业客户整车订单】的【结算成功时间 ?? 结算时间
      this.form.creditTime = row.settleTime || '';
      this.form.downPaymentRatio = row.downPaymentRatio || 0;
      this.form.downPaymentAmount = row.downPaymentAmount || 0;
      getLatestReceiverAddress({
        orderType: this.form.orderCategory,
        query: val
      }).then((res) => {
        this.form.receiverName = res.receiverName;
        this.form.receiverPhone = res.receiverPhone;
        this.form.receiverProvinceCode = res.receiverProvinceCode;
        this.form.receiverProvinceName = res.receiverProvinceName;
        this.form.receiverCityCode = res.receiverCityCode;
        this.form.receiverCityName = res.receiverCityName;
        this.form.receiverDistrictCode = res.receiverDistrictCode;
        this.form.receiverDistrictName = res.receiverCityName;
        this.form.receiverAddress = res.receiverAddress;
        this.areaCode = [res.receiverProvinceCode, res.receiverCityCode, res.receiverDistrictCode].filter(Boolean);
        console.log('this.areaCode', this.areaCode);
      });
    },
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    async getDealerParentOrgList (params) {
      return getParentCompany({ parentCompanyName: params });
    },
    openWholesaleDialog () {
      this.orderDialogType = '10';
      this.orderDialogVisible = true;
    },
    openEntDialog () {
      this.orderDialogType = '20';
      this.orderDialogVisible = true;
    },
    handleOrderSelect (row) {
      if (this.orderDialogType === '10') {
        this.form.wholesaleOrderCode = row.wholesaleOrderCode;
        this.otherwholesaleOrderInfo(row.wholesaleOrderCode, row);
      } else {
        this.form.entVehicleOrderCode = row.entOrderCode;
        this.otherentOrderCode(row.entOrderCode, row);
      }
    },
    getwholesaleOrderCodeList (query) {
      try {
        listWholesaleOrEntOrder({ query: query, orderType: 10, pageSize: 20 }).then(res => {
          this.wholesaleOrderCodeList = res.wholesaleOrderRespList;
        });
      } catch (error) {
        console.error('Error fetching :', error);
      }
    },

    getentVehicleOrderCodeList (query) {
      try {
        listWholesaleOrEntOrder({ query: query, orderType: 20, pageSize: 20 }).then(res => {
          this.entVehicleOrderCodeList = res.entVehicleOrderRespList;
        });
      } catch (error) {
        console.error('Error fetching :', error);
      }
    },
    handleChangeArea (val, row) {
      // 匹配查找对应的省市区名称和编号
      const province = this.areaOptions.find(item => item.code === val[0]);
      if (province) {
        this.form.receiverProvinceCode = province.code;
        this.form.receiverProvinceName = province.name;

        // 匹配城市
        const cityList = province.child || [];
        const city = cityList.find(item => item.code === val[1]);
        if (city) {
          this.form.receiverCityCode = city.code;
          this.form.receiverCityName = city.name;

          // 匹配区县
          const districtList = city.child || [];
          const district = districtList.find(item => item.code === val[2]);
          if (district) {
            this.form.receiverDistrictCode = district.code;
            this.form.receiverDistrictName = district.name;
          }
        }
      }
    },
    handleSubmit () {
      this.$confirm('确认提交赎回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submit({
          idSet: [this._id],
        }).then(() => {
          this.$message.success('提交成功');
          this.$refs.containerRef.loadDetail();
        });
      }).catch(() => {});
    },
    handleSubmitAgain () {
      this.$confirm('确认重新提交赎回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submit({
          idSet: [this._id],
        }).then(() => {
          this.$message.success('提交成功');
          this.$refs.containerRef.loadDetail();
        });
      }).catch(() => {});
    },
    handleconfirmSign () {
      const ids = [this._id];
      this.$confirm('此操作将签收合格证, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchconfirmSign({
          idSet: ids,
        }).then(() => {
          this.$message.success('签收合格证成功');
          this.$refs.containerRef.loadDetail();
        });
      }).catch(() => {});
    },
    handleDel () {
      const ids = [this._id];
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">此操作将永久删除, 是否继续</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        deleteItem({
          idSet: ids
        }).then(() => {
          this.$router.push({
            path: '/vehwholesale/certificate/vehicleCertificateRedemption',
          });
        });
      }).catch(() => {});
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          this.areaCode = [res.receiverProvinceCode, res.receiverCityCode, res.receiverDistrictCode];
          console.log('res', this.areaCode);
          return res;
        });
      }
    },
    async submitRequest () {
      const orderCategory = this.orderCategory || this.form.orderCategory;
      // 校验基础信息表单
      const ruleFormValid = await this.$refs.ruleForm.validate().catch(() => false);
      if (!ruleFormValid) {
        throw new Error('基础信息表单校验失败');
      }
      const wholesaleFormValid = await this.$refs.wholesaleForm.validate().catch(() => false);
      if (!wholesaleFormValid) {
        const message = orderCategory === '10' ? '整车批售订单号' : '企业客户订单号';
        throw new Error(message + '校验失败');
      }
      if (!this.areaCode || this.areaCode.length === 0) {
        this.form.receiverProvinceCode = '';
        this.form.receiverProvinceName = '';
        this.form.receiverCityCode = '';
        this.form.receiverCityName = '';
        this.form.receiverDistrictCode = '';
        this.form.receiverDistrictName = '';
      }
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      // const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
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
