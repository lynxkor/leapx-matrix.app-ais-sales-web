
<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        v-loading="uploadLoading"
        element-loading-text="附件上传中，请稍候..."
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
          <el-button v-if="canAddSoldPlateInfo && form.status === 1" size="small" @click="handleSoldPlateInfo">添加上牌信息</el-button>
          <el-button v-if="canVehicleAttribute && form.status === 1" size="small" @click="openAdjustVehicleAttribute">调整车辆属性</el-button>
<!--          <el-button v-if="form.status === 0" size="small" @click="handleAttachment">添加附件</el-button>-->
          <el-button v-if="canVehicleSubmit && form.status === 0" size="small" :loading="submitLoading" @click="handleSubmit">提交</el-button>
<!--          <el-button v-if="form.status === 0" size="small" @click="handleCancel">作废</el-button>-->
<!--          <el-button v-if="form.status === 1" size="small" @click="handleRevoke">撤回</el-button>-->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>车辆信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="180px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="180px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="VIN码：" prop="vin">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.vin"
                    :remote-method="vehicleProfileSearch"
                    @change="vehicleProfileChange"
                    value-key="vin"
                    label-key="vin"
                    placeholder="请选择VIN码"
                    :disabled="form.id && form.id.length > 0"
                  />
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.modelName"
                    :remote-method="vehicleModelSearch"
                    :params="form.modelName"
                    @change="vehicleModelChange"
                    value-key="id"
                    label-key="name"
                    placeholder="请选择"
                  />
                </el-form-item>
                <el-form-item label="车辆属性：" prop="vehicleAttribute">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehicle_attribute_type"
                    v-model="form.vehicleAttribute"
                    placeholder="请选择车辆属性"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="车辆用途：" prop="vehiclePurpose">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehicle_purpose_type"
                    v-model="form.vehiclePurpose"
                    @change="vehiclePurposeChange"
                    placeholder="请选择车辆用途"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="公告车型：" prop="vehicleSalesVersionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleSalesVersionName"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="产地：" prop="vehicleProductArea">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleProductArea"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发动机号：" prop="enginenNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.enginenNumber"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合格证号：" prop="certificateNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.certificateNo"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店库存台账：" prop="storeInventoryId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.storeInventoryVin"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车批售单号：" prop="wholesaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleOrderCode"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="证件识别的客户姓名：" prop="ocrCarBuyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ocrCarBuyerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="证件识别的证件号码：" prop="ocrIdCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ocrIdCardNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发票发动机号：" prop="invoiceEnginenNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceEnginenNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发票合格证号：" prop="invoiceCertificateNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceCertificateNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发票产地：" prop="invoiceProductionPlace">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceProductionPlace"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发票VIN号：" prop="invoiceVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceVin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发票厂牌型号：" prop="brandModel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.brandModel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="作废说明：" prop="cancelRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="提交时间：" prop="createTime">
                  <el-input
                    placeholder="请输入"
                    v-model="form.createTime"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="终端状态">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="special_vehicle_sales_report_status"
                    v-model="form.status"
                    placeholder="请选择状态"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="VIN码：" prop="vin">
                  <!-- <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`" target="_blank">{{ form.vin }}</el-link> -->
                   {{ form.vin }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleModel/edit?id=${form.modelId}`" target="_blank">{{ form.modelName }}</el-link>
                </el-form-item>
                <el-form-item label="车辆属性：" prop="vehicleAttribute">
                  {{ form.vehicleAttributeLabel }}
                </el-form-item>
                <el-form-item label="车辆用途：" prop="vehiclePurpose">
                  {{ form.vehiclePurposeLabel }}
                </el-form-item>
                <el-form-item label="公告车型：" prop="vehicleSalesVersionName">
                  {{ form.vehicleSalesVersionName }}
                </el-form-item>
                <el-form-item label="产地：" prop="vehicleProductArea">
                  {{ form.vehicleProductArea }}
                </el-form-item>
                <el-form-item label="发动机号：" prop="enginenNumber">
                  {{ form.enginenNumber }}
                </el-form-item>
                <el-form-item label="合格证号：" prop="certificateNo">
                  {{ form.certificateNo }}
                </el-form-item>
                <el-form-item label="门店库存台账：" prop="storeInventoryId">
                  <el-link v-if="form.storeInventoryId" type="primary" :href="`/sales/vehstock/store/storeInventoryLedger/edit?id=${form.storeInventoryId}`" target="_blank">{{ form.storeInventoryVin }}</el-link><span v-else>{{ form.storeInventoryVin }}</span>
                </el-form-item>
                <el-form-item label="整车批售单号：" prop="wholesaleOrderCode">
                  <el-link v-if="form.wholesaleOrderId" type="primary" :href="`/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit?id=${form.wholesaleOrderId}`" target="_blank">{{ form.wholesaleOrderCode }}</el-link><span v-else>{{ form.wholesaleOrderCode }}</span>
                </el-form-item>
                <el-form-item label="证件识别的客户姓名：" prop="ocrCarBuyerName">
                  {{ form.ocrCarBuyerName }}
                </el-form-item>
                <el-form-item label="证件识别的证件号码：" prop="ocrIdCardNo">
                  {{ form.ocrIdCardNo }}
                </el-form-item>
                <el-form-item label="发票发动机号：" prop="invoiceEnginenNumber">
                  {{ form.invoiceEnginenNumber }}
                </el-form-item>
                <el-form-item label="发票合格证号：" prop="invoiceCertificateNo">
                  {{ form.invoiceCertificateNo }}
                </el-form-item>
                <el-form-item label="发票产地：" prop="invoiceProductionPlace">
                  {{ form.invoiceProductionPlace }}
                </el-form-item>
                <el-form-item label="发票VIN号：" prop="invoiceVin">
                  {{ form.invoiceVin }}
                </el-form-item>
                <el-form-item label="发票厂牌型号：" prop="brandModel">
                  {{ form.brandModel }}
                </el-form-item>
                <el-form-item label="作废说明：" prop="cancelRemark">
                  {{ form.cancelRemark }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="终端状态：" prop="status">
                  <span class="status-tag link">{{ form.statusLabel }}</span>
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
          <section class="common-section">
            <div class="common-section-header">
              <h2>车主信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" label-width="180px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="车主姓名：" prop="carBuyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carBuyerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车主手机号码：" prop="carBuyerPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carBuyerPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车主证件类型：" prop="idCardType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="form.idCardType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="车主证件号码：" prop="idCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.idCardNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车主详细地址：" prop="address">
                  <el-input
                    placeholder="请输入"
                    v-model="form.address"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail1" v-show="!(isEditing || !_id)">
                <el-form-item label="车主姓名：" prop="carBuyerName">
                  {{ form.carBuyerName }}
                </el-form-item>
                <el-form-item label="车主手机号码：" prop="carBuyerPhone">
                  {{ form.carBuyerPhone }}
                </el-form-item>
                <el-form-item label="车主证件类型：" prop="idCardType">
                  {{ form.idCardTypeLabel }}
                </el-form-item>
                <el-form-item label="车主证件号码：" prop="idCardNo">
                  {{ form.idCardNo }}
                </el-form-item>
                <el-form-item label="车主详细地址：" prop="address">
                  {{ form.address }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>销售信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="180px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="销售门店：" prop="saleDealerCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.saleDealerCode"
                    :remote-method="saleDealerSearch"
                    :params="form.saleDealerName"
                    @change="handleSaleDealerChange"
                    value-key="storeCode"
                    label-key="storeName"
                    placeholder="请选择"
                  />
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.deliveryDealerCode"
                    :remote-method="deliveryDealerSearch"
                    :params="form.deliveryDealerName"
                    @change="handleDeliveryDealerChange"
                    value-key="storeCode"
                    label-key="storeName"
                    placeholder="请选择"
                  />
                </el-form-item>
                <el-form-item label="专属服务门店：" prop="exclusiveServiceStoreCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.exclusiveServiceStoreCode"
                    :remote-method="exclusiveServiceStoreSearch"
                    :params="form.exclusiveServiceStoreName"
                    @change="handleExclusiveServiceStoreChange"
                    value-key="storeCode"
                    label-key="storeName"
                    placeholder="请选择"
                  />
                </el-form-item>
                <el-form-item label="发票号码：" prop="invoiceNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="开票日期：" prop="invoiceDate">
                  <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    v-model="form.invoiceDate"
                    placeholder="请选日期"
                  />
                </el-form-item>
                <el-form-item label="发票金额：" prop="invoiceAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceAmount"
                    disabled
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail1" v-show="!(isEditing || !_id)">
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-link type="primary" :href="`/service/datacenter/store/store/detail?storeCode=${form.saleDealerCode}`" target="_blank">{{ form.saleDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerName">
                  <el-link type="primary" :href="`/service/datacenter/store/store/detail?storeCode=${form.deliveryDealerCode}`" target="_blank">{{ form.deliveryDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="专属服务门店：" prop="exclusiveServiceStoreName">
                  {{ form.exclusiveServiceStoreName }}
                </el-form-item>
                <el-form-item label="发票号码：" prop="invoiceNo">
                  {{ form.invoiceNo }}
                </el-form-item>
                <el-form-item label="开票日期：" prop="invoiceDate">
                  {{ form.invoiceDate }}
                </el-form-item>
                <el-form-item label="发票金额：" prop="invoiceAmount">
                  {{ form.invoiceAmount }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>附件材料(证件和发票必填)</h2>
            </div>
            <div class="common-section-body">
              <AisAttachment
                v-show="isEditing"
                v-for="item in attachmentList" :key="item.attachType"
                :businessId="_id"
                :ref="el => registerAttachmentRef(el, item.attachType)"
                :configCode="item.configCode"
                :attachType="item.attachType"
                :title="item.label"
                :uploadConfig="item.uploadConfig"
                :readonly="form.status === 20 || !isEditing"
                type="card"
                @upload-loading-change="handleUploadLoadingChange($event)"
              />
              <AttachmentList
                v-show="!isEditing"
                :business-id="_id"
                :config-code="'mcs_specialcarsalesreport'"
                type="card"
                :readonly="true"
                onlyShowUnclassifiedType
              />
              <!-- 上传附件弹框 (通过 ref 调用组件内部方法打开) -->
<!--              <simple-dialog :_id="_id" :readonly="!(form.status === 0 && isEditing)" :attachType="'mcs_specialcarsalesreport'" ref="uploadDialogRef"/>-->
            </div>
          </section>
          <vehicle-attribute-dialog
            ref="vehicleAttributeRef"
            @audit="handleAdjustVehicleAttribute"/>
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
import {
  addOrUpdate,
  adjustVehicleAttribute,
  cancelReport,
  effectiveVinValidate,
  getDetail,
  revokeReport,
  submitReport
} from '@/api/vehretail/orderManager/specialVehicleSalesReport';
import { getList as getStoreInventory } from '@/api/vehstock/store/storeInventoryLedger/index';
import { getByVin as getVdcInventory } from '@/api/vehstock/vdc/vehicleVdcInventoryLedger/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getDealerDetailByCode, getEnum, listOrgStoreInfo, listVehicleModel } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList as getVehicleProfileList } from '@/api/datacenter/vehicle/vehicleProfile/index.js';
import VehicleAttributeDialog from '@/views/vehretail/orderManager/specialVehicleSalesReport/vehicleAttributeDialog';
import { generateSoldPlateInfoByVin, getEffectiveByVin } from '@/api/vehretail/orderManager/soldPlateInfo';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import { getByCode } from '@/libs/api/attachment/index';
import { validateAttachments } from '@/libs/utils';
import AttachmentList from '@/libs/components/AttachmentList/index.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: null,
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: 0,
  statusDesc: '',
  specialReportCode: '',
  vin: '',
  modelId: '',
  modelName: '',
  vehicleAttribute: '',
  vehiclePurpose: '',
  vehicleSalesVersionId: '',
  vehicleSalesVersionName: '',
  vehicleProductArea: '',
  enginenNumber: '',
  certificateNo: '',
  storeInventoryId: '',
  wholesaleOrderCode: '',
  ocrCarBuyerName: '',
  ocrIdCardNo: '',
  invoiceEnginenNumber: '',
  invoiceCertificateNo: '',
  invoiceProductionPlace: '',
  invoiceVin: '',
  brandModel: '',
  cancelRemark: '',
  submitTime: '',
  carBuyerName: '',
  carBuyerPhone: '',
  idCardType: '',
  idCardNo: '',
  address: '',
  saleOrgId: '',
  saleDealerCode: '',
  saleDealerName: '',
  deliveryOrgId: '',
  deliveryDealerCode: '',
  deliveryDealerName: '',
  exclusiveServiceStoreId: '',
  exclusiveServiceStoreCode: '',
  exclusiveServiceStoreName: '',
  invoiceNo: '',
  invoiceDate: null,
  invoiceAmount: '',
  documentCode: '',
  dataSource: '',
  reservationStatus: null,
  storeInventoryVin: null
};

export default {
  name: 'specialVehicleSalesReportEdit',
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
    AttachmentList,
    EditPageLayout,
    EditBaseContainer,
    VehicleAttributeDialog,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '主键：' + this.form.id;
    },
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
      pageTitle: '特殊车辆销售提报',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVRFDI-specialVehicleSalesReport',
      // 按钮权限
      canAddSoldPlateInfo: false, // 添加上牌信息
      canVehicleAttribute: false, // 调整车辆属性
      canVehicleSubmit: false, // 车辆提交
      loading: false,
      submitLoading: false,
      uploadOperate: false,
      uploadLoading: false,
      uploadLoadingCounter: 0,
      // 附件组件实例映射：key 为 attachType，value 为组件 ref，避免使用数组下标
      attachmentRefs: {},
      // 附件列表配置
      attachmentList: [
        { label: '车辆合格证', required: true, configCode: 'mcs_specialcarsalesreport', attachType: '车辆合格证' },
        { label: '车主身份证件', required: true, configCode: 'mcs_specialcarsalesreport', attachType: '车主身份证件' },
        { label: '车辆销售发票', required: true, configCode: 'mcs_specialcarsalesreport', attachType: '车辆销售发票' },
        { label: '附件资料', required: true, configCode: 'mcs_specialcarsalesreport', attachType: '附件资料' }
      ],
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
          { required: false, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: false, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: false, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: false, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: false, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: false, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: false, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择终端状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: false, message: '请选择状态变更描述', trigger: 'change' }
        ],
        specialReportCode: [
          { required: false, message: '请输入特殊车辆销售提报编号', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型', trigger: 'change' }
        ],
        modelName: [
          { required: false, message: '请输入车型名称', trigger: 'change' }
        ],
        vehicleAttribute: [
          { required: true, message: '请输入车辆属性', trigger: 'change' }
        ],
        vehiclePurpose: [
          { required: true, message: '请输入车辆用途', trigger: 'change' }
        ],
        vehicleSalesVersionId: [
          { required: false, message: '请输入公告车型ID', trigger: 'change' }
        ],
        vehicleSalesVersionName: [
          { required: false, message: '请输入公告车型名称', trigger: 'change' }
        ],
        vehicleProductArea: [
          { required: false, message: '请输入产地', trigger: 'change' }
        ],
        enginenNumber: [
          { required: false, message: '请输入发动机号', trigger: 'change' }
        ],
        certificateNo: [
          { required: false, message: '请输入合格证号', trigger: 'change' }
        ],
        storeInventoryId: [
          { required: false, message: '请输入门店库存台账', trigger: 'change' }
        ],
        wholesaleOrderCode: [
          { required: false, message: '请输入整车批售单号', trigger: 'change' }
        ],
        ocrCarBuyerName: [
          { required: false, message: '请输入证件识别的客户姓名', trigger: 'change' }
        ],
        ocrIdCardNo: [
          { required: false, message: '请输入证件识别的证件号码', trigger: 'change' }
        ],
        invoiceEnginenNumber: [
          { required: false, message: '请输入发票发动机号', trigger: 'change' }
        ],
        invoiceCertificateNo: [
          { required: false, message: '请输入发票合格证号', trigger: 'change' }
        ],
        invoiceProductionPlace: [
          { required: false, message: '请输入发票产地', trigger: 'change' }
        ],
        invoiceVin: [
          { required: false, message: '请输入发票VIN号', trigger: 'change' }
        ],
        brandModel: [
          { required: false, message: '请输入发票厂牌型号', trigger: 'change' }
        ],
        cancelRemark: [
          { required: false, message: '请输入作废说明', trigger: 'change' }
        ],
        submitTime: [
          { required: false, message: '请选择提交时间', trigger: 'change' }
        ],
        carBuyerName: [
          { required: false, message: '请输入车主姓名', trigger: 'change' }
        ],
        carBuyerPhone: [
          { required: true, message: '请输入车主手机号码', trigger: 'change' }
        ],
        idCardType: [
          {
            required: false,
            message: '请选择车主证件类型：身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20',
            trigger: 'change'
          }
        ],
        idCardNo: [
          { required: false, message: '请输入车主证件号码', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入车主详细地址', trigger: 'change' }
        ],
        saleOrgId: [
          { required: false, message: '请输入销售门店ID', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店', trigger: 'change' }
        ],
        saleDealerName: [
          { required: false, message: '请输入销售门店', trigger: 'change' }
        ],
        deliveryOrgId: [
          { required: false, message: '请输入交付门店', trigger: 'change' }
        ],
        deliveryDealerCode: [
          { required: true, message: '请输入交付门店', trigger: 'change' }
        ],
        deliveryDealerName: [
          { required: false, message: '请输入交付门店', trigger: 'change' }
        ],
        exclusiveServiceStoreId: [
          { required: false, message: '请输入专属服务门店ID', trigger: 'change' }
        ],
        exclusiveServiceStoreCode: [
          { required: true, message: '请输入专属服务门店', trigger: 'change' }
        ],
        exclusiveServiceStoreName: [
          { required: false, message: '请输入专属服务门店', trigger: 'change' }
        ],
        invoiceNo: [
          { required: false, message: '请输入发票号码', trigger: 'change' }
        ],
        invoiceDate: [
          { required: true, message: '请选择开票日期', trigger: 'change' }
        ],
        invoiceAmount: [
          { required: false, message: '请输入发票金额', trigger: 'change' }
        ],
        documentCode: [
          { required: false, message: '请输入单据编号', trigger: 'change' }
        ],
        dataSource: [
          { required: false, message: '请输入数据来源，150-新销服; 10-老销服', trigger: 'change' }
        ],
      }
    };
  },
  created () {
    this.initPermissions();
  },
  mounted () {
    this.loadAttachmentConfig();
  },
  methods: {
    // 初始化权限
    initPermissions () {
      this.canAddSoldPlateInfo = this.permissions.has(`${this.moduleKey}-addSoldPlateInfo`);
      this.canVehicleAttribute = this.permissions.has(`${this.moduleKey}-vehicleAttribute`);
      this.canVehicleSubmit = this.permissions.has(`${this.moduleKey}-submit`);
    },
    // 注册/注销附件组件实例 ref：以 attachType 作为 key
    // 避免使用数组下标，访问时可通过 this.attachmentRefs['车辆销售发票'] 直接拿到组件实例
    registerAttachmentRef (el, attachType) {
      if (el) {
        this.attachmentRefs[attachType] = el;
      } else {
        delete this.attachmentRefs[attachType];
      }
    },
    // 为 validateAttachments 构造 refs 映射：key 形如 attachment0/1/2/3，值为包裹组件实例的数组
    // 说明：validateAttachments 默认按 ${refNamePrefix}${index}（即 attachment+下标）去 refs 取组件，
    // 而本组件把 ref 存进了 this.attachmentRefs（key 是中文 attachType），所以这里做一次转换。
    buildValidateAttachmentRefs () {
      const refs = {};
      this.attachmentList.forEach((item, index) => {
        const comp = this.attachmentRefs[item.attachType];
        if (comp) {
          refs[`attachment${index}`] = [comp];
        }
      });
      return refs;
    },
    // 附件上传loading变化
    handleUploadLoadingChange (loading) {
      if (loading) {
        this.uploadLoadingCounter++;
        this.uploadLoading = true;
      } else {
        this.uploadLoadingCounter--;
        if (this.uploadLoadingCounter <= 0) {
          this.uploadLoadingCounter = 0;
          this.uploadLoading = false;
          // 上传全部完成后刷新详情数据
          setTimeout(() => {
            this.$refs.containerRef?.loadDetail();
          }, 300);
        }
      }
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    async submitRequest () {
      if (this.form.id) {
        // 附件必填与数量上下限校验，逻辑统一在 @/libs/utils -> validateAttachments
        const { valid, errors } = validateAttachments({
          attachmentList: this.attachmentList,
          refs: this.buildValidateAttachmentRefs()
        });
        if (!valid) {
          this.$message.error(errors.join('；'));
          return Promise.reject(new Error('附件校验未通过'));
        }
      }
      const res = await addOrUpdate({ ...this.form });
      // 保存成功后强制刷新浏览器当前页面
      window.location.reload();
      return res;
    },
    // 初始化时调用 getByCode 获取附件配置，覆盖 attachmentList 中的 required/maxNum/minNum
    async loadAttachmentConfig () {
      try {
        const configRes = await getByCode({ configCode: 'mcs_specialcarsalesreport' });
        // 说明：getByCode 接口经 api.jsonPost 封装的两次 .data 取值后，
        // 拿到的就是后端的 data 字段本体（顶层是 configCode/configName/detailList，没有再包一层 code/data）。
        // 因此 detailList 直接挂在 configRes 上，不需要再 .data。
        const detailList = configRes?.detailList || [];
        this.attachmentList = this.attachmentList.map(item => {
          const detail = detailList.find(d => d.attachType === item.attachType);
          if (!detail) return item;
          return {
            ...item,
            required: String(detail.required) === '1',
            maxNum: Number(detail.maxNum) || 0,
            minNum: Number(detail.minNum) || 0
          };
        });
      } catch (e) {
        console.error('附件配置加载失败，沿用本地默认配置:', e);
      }
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

    // 添加上牌信息
    handleSoldPlateInfo () {
      getEffectiveByVin(this.form.vin).then(res => {
        if (res) {
          this.$router.push({
            path: '/vehretail/orderManager/soldPlateInfo/edit',
            query: {
              id: res.id
            }
          });
        } else {
          // 新增
          generateSoldPlateInfoByVin(this.form.vin).then(res => {
            this.$message.success('添加已售车辆上牌资料成功');
            this.reloadDetail();
          });
        }
      });
    },
    // 添加附件
    handleAttachment () {
      this.uploadOperate = true;
    },
    compareAttachFields () {
      let differentFields = '';
      if (!this.form.ocrCarBuyerName || !this.form.carBuyerName || this.form.ocrCarBuyerName !== this.form.carBuyerName) {
        differentFields += '证件识别的客户姓名与车主姓名<br>';
      }
      if (!this.form.ocrIdCardNo || !this.form.idCardNo || this.form.ocrIdCardNo !== this.form.idCardNo) {
        differentFields += '证件识别的证件号码与车主证件号码<br>';
      }
      if (!this.form.invoiceCertificateNo || !this.form.certificateNo || this.form.invoiceCertificateNo !== this.form.certificateNo) {
        differentFields += '发票合格证号与合格证号<br>';
      }
      if (!this.form.invoiceEnginenNumber || !this.form.enginenNumber || this.form.invoiceEnginenNumber !== this.form.enginenNumber) {
        differentFields += '发票发动机号与发动机号<br>';
      }
      return differentFields;
    },
    // 提交操作
    async handleSubmit () {
      // 附件必填与数量上下限校验，逻辑统一在 @/libs/utils -> validateAttachments
      const { valid, errors } = validateAttachments({
        attachmentList: this.attachmentList,
        refs: this.buildValidateAttachmentRefs()
      });
      if (!valid) {
        this.$message.error(errors.join('；'));
        return Promise.reject(new Error('附件校验未通过'));
      }
      // 仅当"车辆销售发票"附件有值时，开票日期才必填
      const invoiceAttachment = this.attachmentRefs['车辆销售发票'];
      const invoiceFileList = invoiceAttachment?.getFileList?.() || [];
      if (invoiceFileList.length > 0 && !this.form.invoiceDate) {
        this.$message.error('开票日期为空，不允许提交');
        return Promise.reject(new Error('开票日期为空，不允许提交'));
      }
      // 确保门店库存信息已加载
      if (this.form.vin && !this.form.reservationStatus) {
        await this.refreshStoreInventoryLedger(this.form.vin);
      }
      // 试乘试驾车校验
      if (this.form.reservationStatus === 10 && this.form.vehiclePurpose !== 30) {
        this.$confirm(
          '该车辆为试驾车，车辆用途请选择试乘试驾车',
          '试乘试驾车校验提醒',
          {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            showCancelButton: false,
            type: 'warning'
          }
        );
        return;
      }
      // 字段校验
      const differentFields = this.compareAttachFields();
      if (differentFields.length > 0) {
        const differentPrefix = '以下字段不一致，请重新确认<br><br>';
        this.$confirm(
          differentPrefix + differentFields,
          '附件识别字段校验提醒',
          {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            showCancelButton: false,
            type: 'warning'
          }
        );
        return;
      }
      this.$confirm(`确定要提交【${this.form.specialReportCode || this.form.id}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitLoading = true;
        submitReport({ id: this.form.id }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          // 重新加载详情
          this.$refs.containerRef.loadDetail();
        }).finally(() => {
          this.submitLoading = false;
        });
      }).catch(() => {
        // 用户取消操作
      });
    },

    // 作废操作
    handleCancel () {
      this.$prompt('请输入作废说明', '作废说明', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: '作废说明不能为空且不能超过200个字符',
        inputPlaceholder: '请输入作废说明'
      }).then(({ value }) => {
        cancelReport({
          id: this.form.id,
          remark: value
        }).then(() => {
          this.$message({
            type: 'success',
            message: '作废成功!'
          });
          // 重新加载详情
          this.$refs.containerRef.loadDetail();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message || '作废失败!'
          });
        });
      }).catch(() => {
        // 用户取消操作
      });
    },

    // 撤回操作
    handleRevoke () {
      this.$prompt('请输入撤回说明', '撤回说明', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: '撤回说明不能为空且不能超过200个字符',
        inputPlaceholder: '请输入撤回说明'
      }).then(({ value }) => {
        revokeReport({
          id: this.form.id,
          remark: value
        }).then(() => {
          this.$message({
            type: 'success',
            message: '撤回成功!'
          });
          // 重新加载详情
          this.$refs.containerRef.loadDetail();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message || '撤回失败!'
          });
        });
      }).catch(() => {
        // 用户取消操作
      });
    },

    // 调整车辆属性操作
    openAdjustVehicleAttribute () {
      this.$refs.vehicleAttributeRef.show();
    },
    handleAdjustVehicleAttribute (auditForm) {
      const vehicleAttribute = auditForm.vehicleAttribute;
      adjustVehicleAttribute({
        id: this.form.id,
        vehicleAttribute: vehicleAttribute
      }).then(() => {
        this.$message({
          type: 'success',
          message: '调整车辆属性成功!'
        });
        // 重新加载详情
        this.$refs.containerRef.loadDetail();
      });
    },

    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async vehicleModelSearch (val) {
      const params = {
        modelNameLike: val,
        pageSize: 100
      };
      return await listVehicleModel(params);
    },
    vehicleModelChange (val, selectedOption) {
      this.form.modelId = val ? selectedOption.id : null;
      this.form.modelName = val ? selectedOption.name : null;
    },
    async vehicleProfileSearch (val) {
      const params = {
        searchVin: val,
        isSaleDateNull: true,
        pageSize: 100
      };
      return await getVehicleProfileList(params);
    },
    vehicleProfileChange (val, selectedOption) {
      // console.log(JSON.stringify(selectedOption));
      this.clearForm();
      if (val) {
        // 校验是否已存在记录
        effectiveVinValidate(val).then(res => {
          this.refreshVehicleProfileInfo(val, selectedOption);
        });
      }
    },
    clearForm () {
      this.form.reservationStatus = null;
      this.form.storeInventoryVin = null;
      // 清空表单
      this.$refs.ruleForm.resetFields();
      this.$refs.ruleForm1.resetFields();
      this.$refs.ruleForm2.resetFields();
    },
    refreshVehicleProfileInfo (val, selectedOption) {
      this.form.vin = val;
      this.form.modelId = selectedOption.vehicleModelId;
      this.form.modelName = selectedOption.vehicleModelName;
      this.form.vehicleAttribute = selectedOption.usageType;
      this.form.vehicleSalesVersionId = selectedOption.carSaleSversionId;
      this.form.vehicleSalesVersionName = selectedOption.carSalesVersionName;
      this.form.enginenNumber = selectedOption.enginenNumber;
      this.form.certificateNo = selectedOption.certNumber;
      this.form.carBuyerName = selectedOption.vehicleProfileOwnerResp.ownerName;
      this.form.carBuyerPhone = selectedOption.vehicleProfileOwnerResp.mobilephone;
      this.form.idCardType = selectedOption.vehicleProfileOwnerResp.idcardType;
      this.form.idCardNo = selectedOption.vehicleProfileOwnerResp.idcardNo;
      this.form.address = selectedOption.vehicleProfileOwnerResp.homeAddress;
      // this.form.saleDealerCode = selectedOption.salesDealerCode;
      // this.form.saleDealerName = selectedOption.salesDealerName;
      // this.form.deliveryDealerCode = selectedOption.deliveryDealerCode;
      // this.form.deliveryDealerName = selectedOption.deliveryDealerName;
      // this.form.exclusiveServiceStoreCode = selectedOption.vehicleProfileServiceResp.serviceDealerCode ? selectedOption.vehicleProfileServiceResp.serviceDealerCode + '' : '';
      // this.form.exclusiveServiceStoreName = selectedOption.vehicleProfileServiceResp.serviceDealerName ? selectedOption.vehicleProfileServiceResp.serviceDealerName : '';
      // 获取门店库存信息
      if (this.form.vin) {
        this.refreshStoreInventoryLedger(this.form.vin);
        // 车辆产地 VDC库存中获取
        this.vehicleProductAreaRender(this.form.vin);
      }
    },
    // 返回 Promise，便于在 handleSubmit 中 await，确保 reservationStatus 已同步赋值
    refreshStoreInventoryLedger (vin) {
      return getStoreInventory({
        vinLike: this.form.vin,
        vechicleStatusList: [11, 12, 13, 16, 20, 25],
        pageSize: 1
      }).then(res => {
        if (res.total > 0) {
          // if (res.records[0].reservationStatus !== 10) {
          //   this.$message.error('非试驾车的批售车辆，不允许提报!');
          //   this.clearForm();
          // } else {
          this.form.storeInventoryId = res.records[0].id;
          this.form.reservationStatus = res.records[0].reservationStatus;
          this.form.wholesaleOrderCode = res.records[0].wholesaleOrderCode;
          this.form.storeInventoryVin = this.form.vin;
          if (this.form.reservationStatus === 10) {
            this.form.vehiclePurpose = 30;
          }
          // this.form.saleDealerCode = res.records[0].saleDealerCode;
          // this.form.saleDealerName = res.records[0].saleDealerName;
          // this.form.deliveryDealerCode = res.records[0].deliveryDealerCode;
          // this.form.deliveryDealerName = res.records[0].deliveryDealerName;
          if (res.records[0].saleDealerCode) {
            // 渲染销售门店 -> 然后渲染专属服务门店
            this.saleDealerRender(res.records[0].saleDealerCode);
          }
          if (res.records[0].deliveryDealerCode) {
            // 交付门店
            this.deliveryDealerRender(res.records[0].deliveryDealerCode);
          }
          // }
        }
      });
    },
    vehicleProductAreaRender (vin) {
      getVdcInventory(vin).then(res => {
        if (res) {
          this.form.vehicleProductArea = res.productarea;
        }
        return res;
      });
    },
    vehiclePurposeChange (val) {
      console.log(val);
      if (val) {
        if (this.form.reservationStatus === 10 && Number(val) !== 30) {
          this.$message.error('该车辆' + this.form.vin + '车辆类型为试驾车,车辆用途必须选择试驾车!');
          this.form.vehiclePurpose = null;
        } else {
          if (val === 30) {
            this.$message.error('该车辆的车辆类型不是试驾车，请核实!');
            this.form.vehiclePurpose = null;
          }
        }
      }
    },
    saleDealerChangeRender (code) {
      if (!code) {
        return;
      }
      getDealerDetailByCode(code)
        .then(res => {
          if (res) {
            this.form.saleDealerCode = res.storeCode;
            this.form.saleDealerName = res.storeName;
            if (res.exclusiveDeliveryStoreCode) {
              this.deliveryDealerChangeRender(res.exclusiveDeliveryStoreCode);
            }
          }
        });
    },
    saleDealerRender (code) {
      if (!code) {
        return;
      }
      getDealerDetailByCode(code)
        .then(res => {
          if (res) {
            this.form.saleDealerCode = res.storeCode;
            this.form.saleDealerName = res.storeName;
            if (res.exclusiveServiceStoreCode) {
              this.exclusiveServiceStoreRender(res.exclusiveServiceStoreCode);
            }
          }
        });
    },
    // 销售门店搜索并回显
    saleDealerSearch  (val) {
      const params = {
        isSales: true,
        keyword: val,
        size: 100
      };
      return listOrgStoreInfo(params);
    },
    handleSaleDealerChange (val, selectedOption) {
      this.form.salesDealerCode = '';
      this.form.saleDealerName = '';
      if (val) {
        this.form.salesDealerCode = selectedOption.storeCode;
        this.saleDealerChangeRender(selectedOption.storeCode);
      }
    },
    deliveryDealerChangeRender (code) {
      if (!code) {
        return;
      }
      getDealerDetailByCode(code)
        .then(res => {
          if (res) {
            this.form.deliveryDealerCode = res.storeCode;
            this.form.deliveryDealerName = res.storeName;
            if (res.exclusiveServiceStoreCode) {
              this.exclusiveServiceStoreRender(res.exclusiveServiceStoreCode);
            }
          }
        });
    },
    deliveryDealerRender (code) {
      if (!code) {
        return;
      }
      getDealerDetailByCode(code)
        .then(res => {
          if (res) {
            this.form.deliveryDealerCode = res.storeCode;
            this.form.deliveryDealerName = res.storeName;
          }
        });
    },
    deliveryDealerSearch (val) {
      const params = {
        size: 100,
        keyword: val
      };
      return listOrgStoreInfo(params);
    },
    handleDeliveryDealerChange (val, selectedOption) {
      this.form.deliveryDealerCode = '';
      this.form.deliveryDealerName = '';
      if (val) {
        this.form.deliveryDealerCode = selectedOption.storeCode;
        this.deliveryDealerChangeRender(selectedOption.storeCode);
      }
    },
    exclusiveServiceStoreRender (code) {
      if (!code) {
        return;
      }
      getDealerDetailByCode(code)
        .then(res => {
          if (res) {
            this.form.exclusiveServiceStoreCode = res.storeCode;
            this.form.exclusiveServiceStoreName = res.storeName;
          }
        });
    },
    exclusiveServiceStoreSearch (val) {
      const params = {
        keyword: val,
        size: 100
      };
      return listOrgStoreInfo(params);
    },
    handleExclusiveServiceStoreChange (val, selectedOption) {
      this.form.exclusiveServiceStoreCode = '';
      this.form.exclusiveServiceStoreName = '';
      if (val) {
        this.form.exclusiveServiceStoreCode = selectedOption.storeCode;
        this.form.exclusiveServiceStoreName = selectedOption.storeName;
      }
    }
  }
};
</script>
