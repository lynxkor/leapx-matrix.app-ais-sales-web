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
          <el-button v-if="form.status === 1" size="small" @click="handleSoldPlateInfo">添加上牌信息</el-button>
          <el-button v-if="form.status === 1" size="small" @click="openAdjustVehicleAttribute">调整车辆属性</el-button>
          <el-button v-if="form.status === 0" size="small" @click="handleAttachment">添加附件</el-button>
          <el-button v-if="form.status === 0" size="small" @click="handleSubmit">提交</el-button>
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
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
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
                    v-model="form.storeInventoryId"
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
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
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
                  {{ form.storeInventoryId }}
                </el-form-item>
                <el-form-item label="整车批售单号：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
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
                  {{ form.statusLabel }}
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
                  <el-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.saleDealerCode"
                    :loading="saleDealerLoading"
                    :remote-method="(query) => { saleDealerSearch(1, query) }"
                    placeholder="请选择"
                    @change="handleSaleDealerChange"
                  >
                    <el-option
                      v-for="item of saleDealerList"
                      :key="item.storeCode"
                      :value="item.storeCode"
                      :label="item.storeName"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerCode">
                  <el-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.deliveryDealerCode"
                    :loading="deliveryDealerLoading"
                    :remote-method="(query) => { deliveryDealerSearch(1, query) }"
                    placeholder="请选择"
                    @change="handleDeliveryDealerChange"
                  >
                    <el-option
                      v-for="item of deliveryDealerList"
                      :key="item.storeCode"
                      :value="item.storeCode"
                      :label="item.storeName"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="专属服务门店：" prop="exclusiveServiceStoreCode">
                  <el-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.exclusiveServiceStoreCode"
                    :loading="exclusiveServiceStoreLoading"
                    :remote-method="(query) => { exclusiveServiceStoreSearchSearch(1, query) }"
                    @change="handleExclusiveServiceStoreChange"
                  >
                    <el-option
                      v-for="item of exclusiveServiceStoreList"
                      :key="item.storeCode"
                      :value="item.storeCode"
                      :label="item.storeName"
                    />
                  </el-select>
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
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.invoiceDate"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
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
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerName">
                  {{ form.deliveryDealerName }}
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm3" label-width="180px" class="form-edit" v-show="isEditing || !_id">
              </el-form>
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
import { getDetail, addOrUpdate, submitReport, cancelReport, revokeReport, adjustVehicleAttribute } from '@/api/vehretail/orderManager/specialVehicleSalesReport/index';
import { getList as getStoreInventory } from '@/api/vehstock/store/storeInventoryLedger/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList as getVehicleProfileList } from '@/api/datacenter/vehicle/vehicleProfile/index.js';
import VehicleAttributeDialog from '@/views/vehretail/orderManager/specialVehicleSalesReport/vehicleAttributeDialog';
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
  invoiceDate: '',
  invoiceAmount: '',
  documentCode: '',
  dataSource: '',
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
      pageTitle: '特殊车辆销售提报管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVRFDI-specialVehicleSalesReport',
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
          { required: false, message: '请输入车型ID', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
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
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: false, message: '请输入销售门店', trigger: 'change' }
        ],
        deliveryOrgId: [
          { required: false, message: '请输入交付门店ID', trigger: 'change' }
        ],
        deliveryDealerCode: [
          { required: true, message: '请输入交付门店编码', trigger: 'change' }
        ],
        deliveryDealerName: [
          { required: false, message: '请输入交付门店', trigger: 'change' }
        ],
        exclusiveServiceStoreId: [
          { required: false, message: '请输入专属服务门店ID', trigger: 'change' }
        ],
        exclusiveServiceStoreCode: [
          { required: false, message: '请输入专属服务门店编码', trigger: 'change' }
        ],
        exclusiveServiceStoreName: [
          { required: true, message: '请输入专属服务门店', trigger: 'change' }
        ],
        invoiceNo: [
          { required: false, message: '请输入发票号码', trigger: 'change' }
        ],
        invoiceDate: [
          { required: false, message: '请选择开票日期', trigger: 'change' }
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
      },
      // 交付门店
      saleDealerLoading: false,
      saleDealerList: [],
      // 交付门店
      deliveryDealerLoading: false,
      deliveryDealerList: [],
      // 交付门店
      exclusiveServiceStoreLoading: false,
      exclusiveServiceStoreList: []
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
    },
    // 添加附件
    handleAttachment () {
    },
    compareAttachFields () {
      let differentFields = '';
      if (!this.form.ocrCarBuyerName || !this.form.carBuyerName || this.form.ocrCarBuyerName !== this.form.carBuyerName) {
        differentFields += '证件识别的客户姓名与车主姓名<br>';
      }
      if (!this.form.ocrCarBuyerIdCardNo || !this.form.carBuyerIdCardNo || this.form.ocrCarBuyerIdCardNo !== this.form.carBuyerIdCardNo) {
        differentFields += '证件识别的证件号码与车主证件号码<br>';
      }
      if (!this.form.invoiceCertificateNo || !this.form.certificateNo || this.form.invoiceCertificateNo !== this.form.certificateNo) {
        differentFields += '发票合格证号与合格证号<br>';
      }
      if (!this.form.invoiceEnginenNumber || !this.form.enginenNumber || this.form.invoiceEnginenNumber !== this.form.enginenNumber) {
        differentFields += '发票发动机号与发动机号<br>';
      }
      if (!this.form.invoiceProductionPlace || !this.form.vehicleProductArea || this.form.invoiceProductionPlace !== this.form.vehicleProductArea) {
        differentFields += '发票产地号与产地';
      }
      return differentFields;
    },
    // 提交操作
    handleSubmit () {
      // 试乘试驾车校验
      let vehicleTypeValidateFailed = false;
      getStoreInventory({
        vinLike: this.form.vin,
        pageSize: 1
      }).then(res => {
        // console.log(JSON.stringify(res));
        if (res.total > 0) {
          vehicleTypeValidateFailed = res.records[0].reservationStatus === 10 && this.form.vehiclePurpose !== 30;
        }
      });
      if (vehicleTypeValidateFailed) {
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
        submitReport({ id: this.form.id }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          // 重新加载详情
          this.$refs.containerRef.loadDetail();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message || '提交失败!'
          });
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
    async vehicleProfileSearch (val) {
      const params = {
        searchVin: val,
        pageSize: 100
      };
      return await getVehicleProfileList(params);
    },
    vehicleProfileChange (val, selectedOption) {
      this.refreshVehicleProfileInfo(val, selectedOption);
    },
    refreshVehicleProfileInfo (val, selectedOption) {
      this.form.modelId = val ? selectedOption.vehicleModelId : '';
      this.form.modelName = val ? selectedOption.vehicleModelName : '';
      this.form.vehicleAttribute = val ? selectedOption.usageType : '';
      this.form.vehicleSalesVersionId = val ? selectedOption.carSaleSversionId : '';
      this.form.vehicleSalesVersionName = val ? selectedOption.carSalesVersionName : '';
      this.form.vehicleProductArea = val ? selectedOption.vehiclePlaceOrigin : '';
      this.form.enginenNumber = val ? selectedOption.enginenNumber : '';
      this.form.certificateNo = val ? selectedOption.certNumber : '';
      this.form.carBuyerName = val ? selectedOption.vehicleProfileOwnerResp.ownerName : '';
      this.form.carBuyerPhone = val ? selectedOption.vehicleProfileOwnerResp.mobilephone : '';
      this.form.idCardType = val ? selectedOption.vehicleProfileOwnerResp.idCardType : '';
      this.form.idCardNo = val ? selectedOption.vehicleProfileOwnerResp.idcardNo : '';
      this.form.address = val ? selectedOption.vehicleProfileOwnerResp.homeAddress : '';
      this.form.salesDealerCode = val ? selectedOption.salesDealerCode : null;
      this.form.saleDealerName = val ? selectedOption.saleDealerName : null;
      this.form.deliveryDealerCode = val ? selectedOption.deliveryDealerCode : null;
      this.form.deliveryDealerName = val ? selectedOption.deliveryDealerName : null;
      this.form.exclusiveServiceStoreCode = val ? selectedOption.vehicleProfileServiceResp.serviceDealerCode : null;
      this.form.exclusiveServiceStoreName = val ? selectedOption.vehicleProfileServiceResp.serviceDealerName : null;
      this.saleDealerSearch(2);
    },
    saleDealerSearch  (type, query) {
      this.saleDealerLoading = true;
      const params = {
        isSales: true,
        keyword: type === 1 ? query : this.form.deliveryDealerCode,
        pageSize: 100
      };
      listOrgStoreInfo(params).then(res => {
        this.saleDealerList = type === 1 ? res.records : [...this.saleDealerList, ...res.records];
        if (type === 2) {
          this.handleStoreChange(res.records[0], true);
        }
      }).finally(() => {
        this.saleDealerLoading = false;
      });
    },
    deliveryDealerSearch (type, query) {
      this.deliveryDealerLoading = true;
      const params = {
        pageSize: 100,
        keyword: type === 1 ? query : this.form.deliveryDealerCode
      };
      listOrgStoreInfo(params).then(res => {
        this.deliveryDealerList = type === 1 ? res.records : [...this.deliveryDealerList, ...res.records];
      }).finally(() => {
        this.deliveryDealerLoading = false;
      });
    },
    exclusiveServiceStoreSearchSearch (type, query) {
      this.exclusiveServiceStoreLoading = true;
      const params = {
        pageSize: 100,
        keyword: type === 1 ? query : this.form.exclusiveServiceStoreCode
      };
      listOrgStoreInfo(params).then(res => {
        this.exclusiveServiceStoreList = type === 1 ? res.records : [...this.exclusiveServiceStoreList, ...res.records];
      }).finally(() => {
        this.exclusiveServiceStoreLoading = false;
      });
    },
    handleSaleDealerChange (val) {
      const selectItem = this.saleDealerList.find(item => item.storeCode === val);
      if (selectItem) {
        this.handleStoreChange(selectItem, false);
        this.form.salesDealerCode = selectItem.storeCode;
        this.form.saleDealerName = selectItem.storeName;
      } else {
        this.form.salesDealerCode = '';
        this.form.saleDealerName = '';
      }
    },
    handleDeliveryDealerChange (val) {
      const selectItem = this.deliveryDealerList.find(item => item.storeCode === val);
      if (selectItem) {
        this.form.deliveryDealerCode = selectItem.storeCode;
        this.form.deliveryDealerName = selectItem.storeName;
      } else {
        this.form.deliveryDealerCode = '';
        this.form.deliveryDealerName = '';
      }
    },
    handleExclusiveServiceStoreChange (val) {
      const selectItem = this.exclusiveServiceStoreList.find(item => item.storeCode === val);
      if (selectItem) {
        this.form.exclusiveServiceStoreId = selectItem.storeId;
        this.form.exclusiveServiceStoreCode = selectItem.storeCode;
        this.form.exclusiveServiceStoreName = selectItem.storeName;
      } else {
        this.form.exclusiveServiceStoreId = '';
        this.form.exclusiveServiceStoreCode = '';
        this.form.exclusiveServiceStoreName = '';
      }
    },
    handleStoreChange (item, defaultLoad) {
      // item 是不是交付是不是服务
      // 交付
      if (item.isSupportDeliver) {
        this.form.deliveryDealerCode = item.storeCode;
        this.form.deliveryDealerName = item.storeName;
        this.deliveryDealerSearch(2);
      }
      // 服务
      if (item.isSupportRescue) {
        this.form.exclusiveServiceStoreId = item.storeId;
        this.form.exclusiveServiceStoreCode = item.storeCode;
        this.form.exclusiveServiceStoreName = item.storeName;
        this.exclusiveServiceStoreSearchSearch(2);
      }
      if (defaultLoad && !item.isSupportDeliver) {
        this.deliveryDealerSearch(2);
      }
      if (defaultLoad && !item.isSupportRescue) {
        this.exclusiveServiceStoreSearchSearch(2);
      }
    }
  }
};
</script>
