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
                <el-form-item label="订单状态：" prop="status">
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
                <el-form-item label="合格证赎回编号：" prop="redemptionCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.redemptionCode"
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
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售��店名称：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="赊销结算状态：" prop="creditSettleStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.creditSettleStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="合格证状态：" prop="certificateStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.certificateStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车系ID：" prop="seriesId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车系名称：" prop="seriesName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车型ID：" prop="modelId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="资金结算类型：" prop="settleFundType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.settleFundType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="车辆售价（零售价）：" prop="vehiclePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehiclePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售价（批售价）：" prop="salePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="首付款比例：" prop="downPaymentRatio">
                  <el-input
                    placeholder="请输入"
                    v-model="form.downPaymentRatio"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="首付款金额：" prop="downPaymentAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.downPaymentAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="赊销欠款金额：" prop="creditDebtAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creditDebtAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算成功时间：" prop="settleSuccessTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.settleSuccessTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
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
                  />
                </el-form-item>
                <el-form-item label="赊销天数（还款时间-结算时间）：" prop="creditDays">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creditDays"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="赊销费用（90天赊销天费用）：" prop="creditFee">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creditFee"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="超期赊销费用（超期天数*6%&#x2F;365*赊销欠款）：" prop="overdueCreditFee">
                  <el-input
                    placeholder="请输入"
                    v-model="form.overdueCreditFee"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="违约金（超期天数*万分之五*赊销欠款）：" prop="penaltyAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.penaltyAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="凭证编号（SAP退车返款接口凭证号）：" prop="voucherCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.voucherCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车批售订单号：" prop="wholesaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="企业客户整车订单号：" prop="entVehicleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.entVehicleOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收件人：" prop="receiverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收件人手机：" prop="receiverPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收件地址：" prop="receiverAddress">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverAddress"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="快递单号：" prop="expressCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.expressCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="快递照片链接地址：" prop="expressPhotoUrl">
                  <el-input
                    placeholder="请输入"
                    v-model="form.expressPhotoUrl"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合格证照片链接地址：" prop="certificatePhotoUrl">
                  <el-input
                    placeholder="请输入"
                    v-model="form.certificatePhotoUrl"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="订单状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="合格证赎回编号：" prop="redemptionCode">
                  {{ form.redemptionCode }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  {{ form.dealerCompanyCode }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="销售��店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="赊销结算状态：" prop="creditSettleStatus">
                  {{ form.creditSettleStatus }}
                </el-form-item>
                <el-form-item label="合格证状态：" prop="certificateStatus">
                  {{ form.certificateStatus }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="车系ID：" prop="seriesId">
                  {{ form.seriesId }}
                </el-form-item>
                <el-form-item label="车系名称：" prop="seriesName">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="车型ID：" prop="modelId">
                  {{ form.modelId }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="资金结算类型：" prop="settleFundType">
                  {{ form.settleFundType }}
                </el-form-item>
                <el-form-item label="车辆售价（零售价）：" prop="vehiclePrice">
                  {{ form.vehiclePrice }}
                </el-form-item>
                <el-form-item label="销售价（批售价）：" prop="salePrice">
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
                <el-form-item label="结算成功时间：" prop="settleSuccessTime">
                  {{ form.settleSuccessTime }}
                </el-form-item>
                <el-form-item label="赊销日期：" prop="creditTime">
                  {{ form.creditTime }}
                </el-form-item>
                <el-form-item label="还款日期：" prop="repaymentTime">
                  {{ form.repaymentTime }}
                </el-form-item>
                <el-form-item label="赊销天数（还款时间-结算时间）：" prop="creditDays">
                  {{ form.creditDays }}
                </el-form-item>
                <el-form-item label="赊销费用（90天赊销天费用）：" prop="creditFee">
                  {{ form.creditFee }}
                </el-form-item>
                <el-form-item label="超期赊销费用（超期天数*6%&#x2F;365*赊销欠款）：" prop="overdueCreditFee">
                  {{ form.overdueCreditFee }}
                </el-form-item>
                <el-form-item label="违约金（超期天数*万分之五*赊销欠款）：" prop="penaltyAmount">
                  {{ form.penaltyAmount }}
                </el-form-item>
                <el-form-item label="凭证编号（SAP退车返款接口凭证号）：" prop="voucherCode">
                  {{ form.voucherCode }}
                </el-form-item>
                <el-form-item label="整车批售订单号：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
                </el-form-item>
                <el-form-item label="企业客户整车订单号：" prop="entVehicleOrderCode">
                  {{ form.entVehicleOrderCode }}
                </el-form-item>
                <el-form-item label="收件人：" prop="receiverName">
                  {{ form.receiverName }}
                </el-form-item>
                <el-form-item label="收件人手机：" prop="receiverPhone">
                  {{ form.receiverPhone }}
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
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>子表标题</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryListData"
                    remote
                    placeholder="请选择"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleAddTableData"
                  />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="name" title="名称" min-width="30%" />
                  <vxe-column field="age" title="年龄" min-width="30%" />
                  <vxe-column field="email" title="邮箱" min-width="30%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
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
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehwholesale/certificate/vehicleCertificateRedemption/index';
import FetchSelect from '@/libs/components/FetchSelect';
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
  redemptionCode: '',
  dealerCompanyCode: '',
  dealerCompanyName: '',
  saleDealerCode: '',
  saleDealerName: '',
  creditSettleStatus: '',
  certificateStatus: '',
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
    FetchSelect
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
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVW-vehicleCertificateRedemption',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
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
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        redemptionCode: [
          { required: true, message: '请输入合格证赎回编号', trigger: 'change' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'change' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售��店名称', trigger: 'change' }
        ],
        creditSettleStatus: [
          { required: true, message: '请选择赊销结算状态', trigger: 'change' }
        ],
        certificateStatus: [
          { required: true, message: '请选择合格证状态', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请输入车系ID', trigger: 'change' }
        ],
        seriesName: [
          { required: true, message: '请输入车系名称', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
        ],
        settleFundType: [
          { required: true, message: '请选择资金结算类型', trigger: 'change' }
        ],
        vehiclePrice: [
          { required: true, message: '请输入车辆售价（零售价）', trigger: 'change' }
        ],
        salePrice: [
          { required: true, message: '请输入销售价（批售价）', trigger: 'change' }
        ],
        downPaymentRatio: [
          { required: true, message: '请输入首付款比例', trigger: 'change' }
        ],
        downPaymentAmount: [
          { required: true, message: '请输入首付款金额', trigger: 'change' }
        ],
        creditDebtAmount: [
          { required: true, message: '请输入赊销欠款金额', trigger: 'change' }
        ],
        settleSuccessTime: [
          { required: true, message: '请选择结算成功时间', trigger: 'change' }
        ],
        creditTime: [
          { required: true, message: '请选择赊销日期', trigger: 'change' }
        ],
        repaymentTime: [
          { required: true, message: '请选择还款日期', trigger: 'change' }
        ],
        creditDays: [
          { required: true, message: '请输入赊销天数（还款时间-结算时间）', trigger: 'change' }
        ],
        creditFee: [
          { required: true, message: '请输入赊销费用（90天赊销天费用）', trigger: 'change' }
        ],
        overdueCreditFee: [
          { required: true, message: '请输入超期赊销费用（超期天数*6%&#x2F;365*赊销欠款）', trigger: 'change' }
        ],
        penaltyAmount: [
          { required: true, message: '请输入违约金（超期天数*万分之五*赊销欠款）', trigger: 'change' }
        ],
        voucherCode: [
          { required: true, message: '请输入凭证编号（SAP退车返款接口凭证号）', trigger: 'change' }
        ],
        wholesaleOrderCode: [
          { required: true, message: '请输入整车批售订单号', trigger: 'change' }
        ],
        entVehicleOrderCode: [
          { required: true, message: '请输入企业客户整车订单号', trigger: 'change' }
        ],
        receiverName: [
          { required: true, message: '请输入收件人', trigger: 'change' }
        ],
        receiverPhone: [
          { required: true, message: '请输入收件人手机', trigger: 'change' }
        ],
        receiverAddress: [
          { required: true, message: '请输入收件地址', trigger: 'change' }
        ],
        expressCode: [
          { required: true, message: '请输入快递单号', trigger: 'change' }
        ],
        expressPhotoUrl: [
          { required: true, message: '请输入快递照片链接地址', trigger: 'change' }
        ],
        certificatePhotoUrl: [
          { required: true, message: '请输入合格证照片链接地址', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
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
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
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
