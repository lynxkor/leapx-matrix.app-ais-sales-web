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
        :showEditBtn="form.status === 0"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
          <el-button
            @click="openDialogShow"
            v-if="form.status === 0"
            size="small">
            确认上传
          </el-button>
          <el-button
            @click="openDeleteShow"
            v-if="form.status === 0"
            v-permission="moduleKey + '-delete'"
            size="small">
            删除
          </el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="配车VIN码：" prop="matchVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.matchVin"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="整车订单：" prop="retailOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="交车单：" prop="deliveryOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryOrderCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="整车开票状态：" prop="status">
                  <el-input
                    placeholder="请输入"
                    v-model="form.statusLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-input
                    placeholder="请输入"
                    v-model="form.createTime"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="180px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="配车VIN码：">
                  {{ form.matchVin }}
                </el-form-item>
                <el-form-item label="销售门店：">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="交付门店：">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="整车订单：">
                  {{ form.retailOrderCode }}
                </el-form-item>
                <el-form-item label="交车单：">
                  {{ form.deliveryOrderCode }}
                </el-form-item>
                <el-form-item label="整车开票状态：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>发票信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="发票代码：" prop="invoiceCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发票号码：" prop="invoiceNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="开票名称：" prop="invoiceName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="开票时间：" prop="invoiceTime">
                  <el-date-picker
                    type="date"
                    v-model="form.invoiceTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item label="车主证件号码：" prop="orderIdCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderIdCardNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="开票金额：" prop="deliveryOrderInvoiceAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryOrderInvoiceAmount"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="发票金额：" prop="invoiceAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceAmount"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="发票VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发票合格证号：" prop="certificateNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.certificateNo"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="发票发动机号：" prop="engineNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.engineNumber"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="发票厂牌型号：" prop="brandModel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.brandModel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="产地：" prop="vehiclePlaceOrigin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehiclePlaceOrigin"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="180px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="发票代码：">
                  {{ form.invoiceCode }}
                </el-form-item>
                <el-form-item label="发票号码：">
                  {{ form.invoiceNo }}
                </el-form-item>
                <el-form-item label="开票名称：">
                  {{ form.invoiceName }}
                </el-form-item>
                <el-form-item label="开票时间：">
                  {{ form.invoiceTime }}
                </el-form-item>
                <el-form-item label="车主证件号码：">
                  {{ form.orderIdCardNo }}
                </el-form-item>
                <el-form-item label="开票金额：">
                  {{ form.deliveryOrderInvoiceAmount }}
                </el-form-item>
                <el-form-item label="发票金额：">
                  {{ form.invoiceAmount }}
                </el-form-item>
                <el-form-item label="发票VIN码：">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="发票合格证号：">
                  {{ form.certificateNo }}
                </el-form-item>
                <el-form-item label="发票发动机号：">
                  {{ form.engineNumber }}
                </el-form-item>
                <el-form-item label="发票厂牌型号：">
                  {{ form.brandModel }}
                </el-form-item>
                <el-form-item label="产地：">
                  {{ form.vehiclePlaceOrigin }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>订单信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="整车订单状态：" prop="orderStatus">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderStatusLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="商城下单时间：" prop="orderTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.orderTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="商城订单号：" prop="mallOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="订单来源：" prop="orderSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderSource"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="用户ID：" prop="orderUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderUserId"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="购车人姓名：" prop="orderCarBuyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderCarBuyerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="购车人手机号：" prop="orderCarBuyerPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderCarBuyerPhone"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="证件类型：" prop="orderIdCardType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="form.orderIdCardType"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="证件号码：" prop="orderIdCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderIdCardNo"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="代办联系人：" prop="agentName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.agentName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="补贴后价格：" prop="priceAfterSubsidy">
                  <el-input
                    placeholder="请输入"
                    v-model="form.priceAfterSubsidy"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="定金金额：" prop="depositAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.depositAmount"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="订单物料码：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="配车物料码：" prop="allocationMaterialCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.allocationMaterialCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="交车VIN码：" prop="deliveryVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryVin"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="交车时间：" prop="deliveryTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.deliveryTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="180px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="整车订单状态：">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="商城下单时间：">
                  {{ form.orderTime }}
                </el-form-item>
                <el-form-item label="商城订单号：">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="订单来源：">
                  {{ form.orderSource }}
                </el-form-item>
                <el-form-item label="用户ID：">
                  {{ form.orderUserId }}
                </el-form-item>
                <el-form-item label="购车人姓名：">
                  {{ form.orderCarBuyerName }}
                </el-form-item>
                <el-form-item label="购车人手机号：">
                  {{ form.orderCarBuyerPhone }}
                </el-form-item>
                <el-form-item label="证件类型：">
                  {{ form.orderIdCardTypeLabel }}
                </el-form-item>
                <el-form-item label="证件号码：">
                  {{ form.orderIdCardNo }}
                </el-form-item>
                <el-form-item label="代办联系人：">
                  {{ form.agentName }}
                </el-form-item>
                <el-form-item label="补贴后价格：">
                  {{ form.priceAfterSubsidy }}
                </el-form-item>
                <el-form-item label="定金金额：">
                  {{ form.depositAmount }}
                </el-form-item>
                <el-form-item label="订单物料码：">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="配车物料码：">
                  {{ form.allocationMaterialCode }}
                </el-form-item>
                <el-form-item label="销售门店：">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="交付门店：">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="交车VIN码：">
                  {{ form.deliveryVin }}
                </el-form-item>
                <el-form-item label="交车时间：">
                  {{ form.deliveryTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>交付信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="交车时间：" prop="deliveryTime">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryTime"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="车辆属性：" prop="vehicleAttribute">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehicle_attribute_type"
                    v-model="form.vehicleAttribute"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="车主证件类型：" prop="orderIdCardType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="form.orderIdCardType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="180px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="交车时间：">
                  {{ form.deliveryTime }}
                </el-form-item>
                <el-form-item label="车辆属性：">
                  {{ form.vehicleAttributeLabel }}
                </el-form-item>
                <el-form-item label="车主证件类型：">
                  {{ form.idCardTypeLabel }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>证件识别信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm3" label-width="180px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="证件识别的客户姓名：" prop="carBuyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carBuyerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="证件识别的证件号码：" prop="idCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.idCardNo"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="180px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="证件识别的客户姓名：">
                  {{ form.carBuyerName }}
                </el-form-item>
                <el-form-item label="证件识别的证件号码：">
                  {{ form.idCardNo }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>附件清单</h2>
            </div>
            <div class="common-section-body">
                <AisAttachment
                  v-for="(item, index) in attachmentList" :key="index"
                  :businessId="_id"
                  :ref="'attachment' + index"
                  :configCode="item.configCode"
                  :attachType="item.attachType"
                  :title="item.label"
                  :uploadConfig="item.uploadConfig"
                  :readonly="form.status === 99 || !isEditing"
                  type="card"
                  @before-upload-click="handleBeforeUploadClick(index, $event)"
                />
            </div>
          </section>
        </el-main>
        <!-- 比对确认弹框 -->
        <el-dialog
          title="附件识别字段错误"
          :visible.sync="dialogVisible"
          width="60%"
          class="comparison-dialog"
        >
          <div class="comparison-content">
            <!-- 比对说明 -->
            <!-- 比对表格 -->
            <el-table
              :data="comparisonData"
              style="width: 100%"
              border
              stripe
              :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
            >
              <!-- 识别字段列 -->
              <el-table-column
                prop="fieldName"
                label="识别字段"
                width="270"
                align="center"
              >
              </el-table-column>
              <!-- 识别信息列 -->
              <el-table-column
                prop="recognizedValue"
                label="识别信息"
                width="270"
                align="center"
              >
                <template slot-scope="scope">
              <span :class="{ 'warning-value': scope.row.isHighlighted }">
                {{ scope.row.recognizedValue }}
              </span>
                </template>
              </el-table-column>
              <!-- 检验字段列 -->
              <el-table-column
                prop="checkField"
                label="检验字段"
                width="270"
                align="center"
              >
              </el-table-column>
              <!-- 校验信息列 -->
              <el-table-column
                prop="checkValue"
                label="校验信息"
                width="270"
                align="center"
              >
                <template slot-scope="scope">
              <span :class="{ 'warning-value': scope.row.isHighlighted }">
                {{ scope.row.checkValue }}
              </span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 弹框底部按钮 -->
          <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirmUpload">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
        </el-dialog>
        <!-- 上传附件弹框 (通过 ref 调用组件内部方法打开) -->
<!--        <simple-dialog ref="uploadDialogRef" @confirm="handleUploadConfirm" :id="_id"></simple-dialog>-->
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
import {
  getDetail,
  addOrUpdate,
  deleteItem,
  confirmUpload,
  checkUpload
} from '@/api/vehretail/orderManager/deliveryInvoice/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

// import AisAttachment from '@/libs/components/AisAttachment/index.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: 1010,
  statusDesc: '',
  deliveryInvoiceCode: '',
  deliveryOrderId: '',
  deliveryOrderCode: '',
  retailOrderId: '',
  retailOrderCode: '',
  invoiceCode: '',
  invoiceNo: '',
  invoiceName: '',
  invoiceTime: '',
  invoiceAmount: '',
  vin: '',
  certificateNo: '',
  engineNumber: '',
  brandModel: '',
  vehiclePlaceOrigin: '',
  carBuyerName: '',
  idCardNo: '',
  vehicleAttribute: '',
  saleDealerCode: '',
  saleDealerName: '',
  deliveryDealerCode: '',
  deliveryDealerName: '',
  dataSource: '',
  orderStatus: '',
  orderSource: '',
  orderTime: '',
  orderUserId: '',
  orderUserName: '',
  idCardType: '',
  agentName: '',
  agentPhone: '',
  depositAmount: '',
  priceAfterSubsidy: '',
  materialsCode: '',
  discontinueStatus: '',
  materialsDesc: '',
  allocationMaterialCode: '',
  deliveryVin: '',
  deliveryTime: '',
  rangePowerName: '',
  exteriorName: '',
  interiorName: '',
  wheelHubName: '',
  yearTypeName: '',
  optionPackageName: '',
  matchVin: '',
  paymentTime: '',
  saleUserName: '',
  createTime: '',
};

export default {
  name: 'deliveryInvoiceEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    AisAttachment,
    EditPageLayout,
    EditBaseContainer,
    FetchSelect,
    // SimpleDialog,
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
      dialogVisible: false,
      comparisonData: [],
      pageTitle: '整车开票记录',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVRFDI-deliveryInvoice',
      loading: false,
      submitLoading: false,
      // 附件列表配置
      attachmentList: [
        { label: '车主身份证件', required: true, configCode: 'mcs_vehnetwork', attachType: '车主身份证件' },
        { label: '车辆销售发票', required: true, configCode: 'mcs_vehnetwork', attachType: '车辆销售发票' },
        { label: '车辆合格证', required: true, configCode: 'mcs_vehnetwork', attachType: '车辆合格证' },
        { label: '尾款支付凭证', required: true, configCode: 'mcs_vehnetwork', attachType: '尾款支付凭证' },
        { label: '销售合同', required: true, configCode: 'mcs_vehnetwork', attachType: '销售合同' },
        { label: '交车仪式照片', required: false, configCode: 'mcs_vehnetwork', attachType: '交车仪式照片' },
        { label: '贷款证明', required: false, configCode: 'mcs_vehnetwork', attachType: '贷款证明' },
        { label: '交车确认书', required: false, configCode: 'mcs_vehnetwork', attachType: '交车确认书' }
      ],
      yes_no_enum: YES_NO_ENUM,
      uploadCheckPassed: false, // 上传校验是否通过
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        status: [
          { required: true, message: '请选择整车开票状态', trigger: 'change' }
        ],
        deliveryInvoiceCode: [
          { required: false, message: '请输入开票记录编码', trigger: 'change' }
        ],
        deliveryOrderId: [
          { required: false, message: '请输入交车单ID', trigger: 'change' }
        ],
        deliveryOrderCode: [
          { required: true, message: '请输入交车单', trigger: 'change' }
        ],
        retailOrderId: [
          { required: false, message: '请输入零售订单ID', trigger: 'change' }
        ],
        retailOrderCode: [
          { required: false, message: '请输入零售订单号', trigger: 'change' }
        ],
        invoiceCode: [
          { required: false, message: '请输入发票代码', trigger: 'change' }
        ],
        invoiceNo: [
          { required: true, message: '请输入发票号码', trigger: 'change' }
        ],
        invoiceName: [
          { required: false, message: '请输入开票名称', trigger: 'change' }
        ],
        invoiceTime: [
          { required: false, message: '请选择开票时间', trigger: 'change' }
        ],
        invoiceAmount: [
          { required: false, message: '请输入发票金额', trigger: 'change' }
        ],
        vin: [
          { required: false, message: '请输入发票VIN码', trigger: 'change' }
        ],
        certificateNo: [
          { required: false, message: '请输入发票合格证号', trigger: 'change' }
        ],
        engineNumber: [
          { required: false, message: '请输入发票发动机号', trigger: 'change' }
        ],
        brandModel: [
          { required: false, message: '请输入发票厂牌型号', trigger: 'change' }
        ],
        vehiclePlaceOrigin: [
          { required: false, message: '请输入产地', trigger: 'change' }
        ],
        carBuyerName: [
          { required: false, message: '请输入证件识别的客户姓名', trigger: 'change' }
        ],
        idCardNo: [
          { required: false, message: '请输入证件识别的证件号码', trigger: 'change' }
        ],
        vehicleAttribute: [
          { required: true, message: '请输入车辆属性', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: false, message: '请输入销售门店编码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店', trigger: 'change' }
        ],
        deliveryDealerCode: [
          { required: false, message: '请输入交付门店编码', trigger: 'change' }
        ],
        deliveryDealerName: [
          { required: true, message: '请输入交付门店', trigger: 'change' }
        ],
        dataSource: [
          { required: false, message: '请输入数据来源，150-新销服; 10-老销服', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择零售订单状态', trigger: 'change' }
        ],
        depositAmount: [
          { required: true, message: '请输入定金金额', trigger: 'change' }
        ],
        orderSource: [
          { required: true, message: '请输入订单来源', trigger: 'change' }
        ],
        orderTime: [
          { required: true, message: '请选择商城下单时间', trigger: 'change' }
        ],
        orderUserId: [
          { required: false, message: '请输入用户ID', trigger: 'change' }
        ],
        orderCarBuyerName: [
          { required: true, message: '请输入购车人姓名', trigger: 'change' }
        ],
        orderCarBuyerPhone: [
          { required: true, message: '请输入购车人手机号', trigger: 'change' }
        ],
        idCardType: [
          { required: false, message: '请选择证件类型标签', trigger: 'change' }
        ],
        orderIdCardType: [
          { required: true, message: '请选择车主证件类型', trigger: 'change' }
        ],
        agentName: [
          { required: false, message: '请输入代办姓名', trigger: 'change' }
        ],
        agentPhone: [
          { required: false, message: '请输入代办人电话', trigger: 'change' }
        ],
        priceAfterSubsidy: [
          { required: false, message: '请输入补贴后价格', trigger: 'change' }
        ],
        materialsCode: [
          { required: true, message: '请输入订单物料编码', trigger: 'change' }
        ],
        allocationMaterialCode: [
          { required: true, message: '请输入配车物料编码', trigger: 'change' }
        ],
        deliveryVin: [
          { required: false, message: '请输入交车VIN码', trigger: 'change' }
        ],
        deliveryTime: [
          { required: false, message: '请选择交车时间', trigger: 'change' }
        ],
        matchVin: [
          { required: true, message: '请输入配车VIN码', trigger: 'change' }
        ],
        paymentTime: [
          { required: false, message: '请选择缴定金时间', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
  },
  methods: {
    // 附件上传前判断
    handleBeforeUploadClick (index, { allow, openFileDialog: _openFileDialog }) {
      checkUpload(this.form.id).then(res => {
        allow(true);
      }).catch(() => {
        allow(false); // 直接阻止上传
      });
    },
    handleConfirmUpload () {
      if (this.doComparisonData().length > 0) {
        this.$message.warning('识别信息与校验信息不一致,请重新确认！');
      } else {
        confirmUpload(this.form.id).then(res => {
          this.$message.success('交车完成成功');
          // 重新加载详情数据
          this.reloadDetail();
        });
      }
    },
    openDialogShow () {
      // 确认时间
      const warnMsg = '系统中的开票日期' + this.form.invoiceTime + '，请确认是否正确；若正确，请点击继续交车；若不正确，请点击取消并修改。';
      this.$confirm(warnMsg, '操作提醒', {
        confirmButtonText: '继续交车',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 比对数据
        const comparisonData = this.doComparisonData();
        if (comparisonData.length > 0) {
          this.comparisonData = comparisonData;
          this.dialogVisible = true;
        }
      }).catch(() => {
      });
    },
    doComparisonData () {
      const comparisonData = [];
      // i.发票VIN=配车VIN,ii.开票名称=购车人姓名,iii.车主证件号码=证件号码,发票金额=开票金额,证件识别的客户姓名=购车人姓名,证件识别的证件号码=证件号码,车主证件类型=证件类型
      if (!this.form.vin || !this.form.matchVin || this.form.vin !== this.form.matchVin) {
        comparisonData.push({
          fieldName: '发票VIN',
          recognizedValue: this.form.vin,
          checkField: '配车VIN',
          checkValue: this.form.matchVin,
          isHighlighted: true
        });
      }
      if (!this.form.invoiceName || !this.form.orderCarBuyerName || this.form.invoiceName !== this.form.orderCarBuyerName) {
        comparisonData.push({
          fieldName: '开票名称',
          recognizedValue: this.form.invoiceName,
          checkField: '购车人姓名',
          checkValue: this.form.orderCarBuyerName,
          isHighlighted: true
        });
      }
      if (!this.form.carBuyerName || !this.form.orderCarBuyerName || this.form.carBuyerName !== this.form.orderCarBuyerName) {
        comparisonData.push({
          fieldName: '证件识别的客户姓名',
          recognizedValue: this.form.carBuyerName,
          checkField: '购车人姓名',
          checkValue: this.form.orderCarBuyerName,
          isHighlighted: true
        });
      }
      if (!this.form.idCardTypeLabel || !this.form.orderIdCardTypeLabel || this.form.idCardTypeLabel !== this.form.orderIdCardTypeLabel) {
        comparisonData.push({
          fieldName: '车主证件类型',
          recognizedValue: this.form.vpIdCardTypeLabel,
          checkField: '证件类型',
          checkValue: this.form.orderIdCardTypeLabel,
        });
      }
      if (!this.form.idCardNo || !this.form.orderIdCardNo || this.form.idCardNo !== this.form.orderIdCardNo) {
        comparisonData.push({
          fieldName: '车主证件号码',
          recognizedValue: this.form.vpIdCardNo,
          checkField: '证件号码',
          checkValue: this.form.orderIdCardNo,
        });
      }
      if (!this.form.idCardNo || !this.form.orderIdCardNo || this.form.idCardNo !== this.form.orderIdCardNo) {
        comparisonData.push({
          fieldName: '证件识别的证件号码',
          recognizedValue: this.form.idCardNo,
          checkField: '证件号码',
          checkValue: this.form.orderIdCardNo,
          isHighlighted: true
        });
      }
      if (!this.form.invoiceAmount || !this.form.deliveryOrderInvoiceAmount || this.form.invoiceAmount !== this.form.deliveryOrderInvoiceAmount) {
        comparisonData.push({
          fieldName: '发票金额',
          recognizedValue: this.form.price,
          checkField: '开票金额',
          checkValue: this.form.deliveryOrderInvoiceAmount,
          isHighlighted: true
        });
      }
      return comparisonData;
    },
    handleUploadConfirm () {
      // 点击保存按钮的回调
      this.$message.success('保存成功');
    },
    handleUploadDialogClose () {
      // 弹框关闭后的回调
    },
    openDeleteShow () {
      this.$confirm('确认是否删除该整车开票记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 作废接口
        const deleteByIds = [this.form.id];
        deleteItem(deleteByIds).then(res => {
          this.$message.success('删除成功');
          // 重新加载详情数据
          this.$router.push({
            path: '/vehretail/orderManager/deliveryInvoice'
          });
        });
      }).catch(() => {});
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
