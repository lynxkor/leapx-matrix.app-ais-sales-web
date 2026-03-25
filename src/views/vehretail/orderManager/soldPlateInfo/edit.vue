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
              <h2>基本信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
                    placeholder="请选择"
                    :disabled="form.id && form.id.length > 0"
                  />
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.modelId"
                    :remote-method="vehicleModelSearch"
                    :params="form.modelName"
                    @change="vehicleModelChange"
                    value-key="id"
                    label-key="name"
                    placeholder="请选择"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="门店：" prop="saleDealerCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.saleDealerCode"
                    :remote-method="saleDealerSearch"
                    :params="form.saleDealerName"
                    @change="saleDealerChange"
                    value-key="storeCode"
                    label-key="storeName"
                    placeholder="请选择"
                  />
                </el-form-item>
                <el-form-item label="车主姓名：" prop="carBuyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carBuyerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车主电话：" prop="carBuyerPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carBuyerPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="证件类型：" prop="idCardType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="form.idCardType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="证件号码：" prop="idCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.idCardNo"
                    clearable
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
                <el-form-item label="公告车型：" prop="carSalesVersionId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.carSalesVersionId"
                    :remote-method="vehicleSalesVersionSearch"
                    :params="form.carSalesVersionName"
                    @change="vehicleSalesVersionChange"
                    value-key="id"
                    label-key="name"
                    placeholder="请选择"
                  />
                </el-form-item>
                <el-form-item label="产地：" prop="vehiclePlaceOrigin">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehicle_place_origin"
                    v-model="form.vehiclePlaceOrigin"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="发动机号：" prop="enginenNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.enginenNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合格证号：" prop="certificateNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.certificateNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车开票记录：" prop="invoiceRecordCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceRecordCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="特殊车辆销售提报：" prop="specialReportCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.specialReportCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-input
                    placeholder="请输入"
                    v-model="form.updateTime"
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
              <el-form :inline="true" class="form-detail" label-width="150px" v-show="!(isEditing || !_id)">
                <el-form-item label="VIN码：">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="车型名称：">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="门店：">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="车主姓名：">
                  {{ form.carBuyerName }}
                </el-form-item>
                <el-form-item label="车主电话：">
                  {{ form.carBuyerPhone }}
                </el-form-item>
                <el-form-item label="证件类型：">
                  {{ form.idCardTypeName || form.idCardType }}
                </el-form-item>
                <el-form-item label="证件号码：">
                  {{ form.idCardNo }}
                </el-form-item>
                <el-form-item label="车辆用途：">
                  {{ form.vehiclePurposeName || form.vehiclePurpose }}
                </el-form-item>
                <el-form-item label="公告车型：">
                  {{ form.carSalesVersionName }}
                </el-form-item>
                <el-form-item label="产地：">
                  {{ form.vehiclePlaceOriginLabel }}
                </el-form-item>
                <el-form-item label="发动机号：">
                  {{ form.enginenNumber }}
                </el-form-item>
                <el-form-item label="合格证号：">
                  {{ form.certificateNo }}
                </el-form-item>
                <el-form-item label="整车开票记录：">
                  {{ form.invoiceRecordCode }}
                </el-form-item>
                <el-form-item label="特殊车辆销售提报：">
                  {{ form.specialReportCode }}
                </el-form-item>
                <el-form-item label="修改时间：">
                  {{ form.updateTime }}
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="发票VIN号：" prop="invoiceVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceVin"
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
                <el-form-item label="发票号码：" prop="invoiceNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="开票日期：" prop="invoiceTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.invoiceTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="开票金额：" prop="invoiceAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发票产地：" prop="invoiceVehiclePlaceOrigin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceVehiclePlaceOrigin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发票厂牌型号：" prop="invoiceBrandModel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceBrandModel"
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
                <el-form-item label="发票发动机号：" prop="invoiceEngineNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceEngineNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发票证件类型：" prop="ocrIdCardType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="form.ocrIdCardType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="发票证件号码：" prop="ocrIdCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ocrIdCardNo"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" label-width="150px" v-show="!(isEditing || !_id)">
                <el-form-item label="发票VIN号：">
                  {{ form.invoiceVin }}
                </el-form-item>
                <el-form-item label="开票名称：">
                  {{ form.invoiceName }}
                </el-form-item>
                <el-form-item label="发票号码：">
                  {{ form.invoiceNo }}
                </el-form-item>
                <el-form-item label="开票日期：">
                  {{ form.invoiceTime }}
                </el-form-item>
                <el-form-item label="开票金额：">
                  {{ form.invoiceAmount }}
                </el-form-item>
                <el-form-item label="发票产地：">
                  {{ form.invoiceVehiclePlaceOrigin }}
                </el-form-item>
                <el-form-item label="发票厂牌型号：">
                  {{ form.invoiceBrandModel }}
                </el-form-item>
                <el-form-item label="发票合格证号：">
                  {{ form.invoiceCertificateNo }}
                </el-form-item>
                <el-form-item label="发票发动机号：">
                  {{ form.invoiceEngineNumber }}
                </el-form-item>
                <el-form-item label="发票证件类型：">
                  {{ form.ocrIdCardTypeLabel }}
                </el-form-item>
                <el-form-item label="发票证件号码：">
                  {{ form.ocrIdCardNo }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>行驶证信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="行驶证VIN号：" prop="drivingLicenseVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.drivingLicenseVin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="行驶证所有人：" prop="drivingLicenseOwner">
                  <el-input
                    placeholder="请输入"
                    v-model="form.drivingLicenseOwner"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车牌号码：" prop="plateNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.plateNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="上牌日期：" prop="plateDate">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.plateDate"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="上牌省份：" prop="provinceCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceCode"
                    clearable
                  />
                </el-form-item>
<!--                <el-form-item label="上牌省份：" prop="provinceName">-->
<!--                  <el-input-->
<!--                    placeholder="请输入"-->
<!--                    v-model="form.provinceName"-->
<!--                    clearable-->
<!--                  />-->
<!--                </el-form-item>-->
                <el-form-item label="上牌城市：" prop="cityCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityCode"
                    clearable
                  />
                </el-form-item>
<!--                <el-form-item label="上牌城市：" prop="cityName">-->
<!--                  <el-input-->
<!--                    placeholder="请输入"-->
<!--                    v-model="form.cityName"-->
<!--                    clearable-->
<!--                  />-->
<!--                </el-form-item>-->
                <el-form-item label="上牌区/县：" prop="districtCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.districtCode"
                    clearable
                  />
                </el-form-item>
<!--                <el-form-item label="上牌区/县：" prop="districtName">-->
<!--                  <el-input-->
<!--                    placeholder="请输入"-->
<!--                    v-model="form.districtName"-->
<!--                    clearable-->
<!--                  />-->
<!--                </el-form-item>-->
                <el-form-item label="车辆注册地址：" prop="vehicleRegisterAddress">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleRegisterAddress"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="行驶证编号：" prop="drivingLicenseNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.drivingLicenseNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="行驶证品牌型号：" prop="drivingLicenseBrandModel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.drivingLicenseBrandModel"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" label-width="150px" v-show="!(isEditing || !_id)">
                <el-form-item label="行驶证VIN号：">
                  {{ form.drivingLicenseVin }}
                </el-form-item>
                <el-form-item label="行驶证所有人：">
                  {{ form.drivingLicenseOwner }}
                </el-form-item>
                <el-form-item label="车牌号码：">
                  {{ form.plateNo }}
                </el-form-item>
                <el-form-item label="上牌日期：">
                  {{ form.plateDate }}
                </el-form-item>
                <el-form-item label="上牌省份：">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="上牌城市：">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="上牌区/县：">
                  {{ form.districtName }}
                </el-form-item>
                <el-form-item label="车辆注册地址：">
                  {{ form.vehicleRegisterAddress }}
                </el-form-item>
                <el-form-item label="行驶证编号：">
                  {{ form.drivingLicenseNumber }}
                </el-form-item>
                <el-form-item label="行驶证品牌型号：">
                  {{ form.drivingLicenseBrandModel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
          <div class="common-section-header">
            <h2>审核信息</h2>
          </div>
          <div class="common-section-body">
            <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm3" label-width="150px" class="form-edit" v-show="isEditing || !_id">
              <el-form-item label="提交时间：" prop="submitTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.submitTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  disabled
                />
              </el-form-item>
              <el-form-item label="提交人：" prop="submitUser">
                <el-input
                  placeholder="请输入"
                  v-model="form.submitUser"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="审核时间：" prop="auditTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.auditTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  disabled
                />
              </el-form-item>
              <el-form-item label="审核人：" prop="auditUser">
                <el-input
                  placeholder="请输入"
                  v-model="form.auditUser"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="撤回时间：" prop="withdrawTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.withdrawTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  disabled
                />
              </el-form-item>
              <el-form-item label="撤回人：" prop="withdrawUser">
                <el-input
                  placeholder="请输入"
                  v-model="form.withdrawUser"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="审核意见：" prop="auditRemark">
                <el-input
                  placeholder="请输入"
                  v-model="form.auditRemark"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="审核状态：" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="vehretail_order_change_apply_status"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                  filterable
                  disabled
                />
              </el-form-item>
              <el-form-item label="是否自动审核：" prop="autoAuditStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="BooleanEnum"
                  v-model="form.autoAuditStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
            </el-form>
            <el-form :inline="true" class="form-detail" label-width="150px" v-show="!(isEditing || !_id)">
              <el-form-item label="提交时间：">
                {{ form.submitTime }}
              </el-form-item>
              <el-form-item label="提交人：">
                {{ form.submitUser }}
              </el-form-item>
              <el-form-item label="审核时间：">
                {{ form.auditTime }}
              </el-form-item>
              <el-form-item label="审核人：">
                {{ form.auditUser }}
              </el-form-item>
              <el-form-item label="撤回时间：">
                {{ form.withdrawTime }}
              </el-form-item>
              <el-form-item label="撤回人：">
                {{ form.withdrawUser }}
              </el-form-item>
              <el-form-item label="审核意见：">
                {{ form.auditRemark }}
              </el-form-item>
              <el-form-item label="审核状态：">
                {{ form.auditStatusLabel }}
              </el-form-item>
              <el-form-item label="是否自动审核：">
                {{ form.autoAuditStatusLabel}}
              </el-form-item>
            </el-form>
          </div>
        </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>附件材料(请上传发票、行驶证、有效身份证件并以中文命名)</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleFormAtt" label-width="180px" class="form-edit" v-show="isEditing || !_id">
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
import { getDetail, addOrUpdate, effectiveVinValidate } from '@/api/vehretail/orderManager/soldPlateInfo/index';
import { getEffectiveByVin as getDeliveryInvoiceByVin } from '@/api/vehretail/orderManager/deliveryInvoice/index';
import { getEffectiveByVin as getSpecialSalesReportByVin } from '@/api/vehretail/orderManager/specialVehicleSalesReport/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listStoreInfo, listVehicleModel, vehicleSalesVersionList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList as getVehicleProfileList } from '@/api/datacenter/vehicle/vehicleProfile';

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
  status: 1010,
  statusDesc: '',
  soldPlateCode: '',
  deliveryOrderId: '',
  retailOrderId: '',
  retailOrderCode: '',
  soldPlateSource: '',
  vin: '',
  modelId: '',
  modelName: '',
  saleOrgId: '',
  saleDealerCode: '',
  saleDealerName: '',
  carBuyerName: '',
  carBuyerPhone: '',
  idCardType: '',
  idCardNo: '',
  vehiclePurpose: '',
  carSaleSversionId: '',
  carSalesVersionName: '',
  vehiclePlaceOrigin: '',
  enginenNumber: '',
  certificateNo: '',
  invoiceRecordCode: '',
  specialReportCode: '',
  drivingLicenseVin: '',
  drivingLicenseOwner: '',
  plateNo: '',
  plateDate: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  vehicleRegisterAddress: '',
  drivingLicenseNumber: '',
  drivingLicenseBrandModel: '',
  invoiceVin: '',
  invoiceName: '',
  invoiceNo: '',
  invoiceTime: '',
  invoiceAmount: '',
  invoiceVehiclePlaceOrigin: '',
  invoiceBrandModel: '',
  invoiceCertificateNo: '',
  invoiceEngineNumber: '',
  ocrIdCardType: '',
  ocrIdCardNo: '',
  submitTime: '',
  submitUserId: '',
  submitUser: '',
  auditTime: '',
  auditUserId: '',
  auditUser: '',
  withdrawTime: '',
  withdrawUserId: '',
  withdrawUser: '',
  auditRemark: '',
  autoAuditStatus: 0,
  dataSource: '',
};

export default {
  name: 'soldPlateInfoEdit',
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
      pageTitle: '已售上牌车辆资料管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVRFDI-soldPlateInfo',
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
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: false, message: '请选择状态变更描述', trigger: 'change' }
        ],
        soldPlateCode: [
          { required: false, message: '请输入整车上牌记录编号', trigger: 'change' }
        ],
        deliveryOrderId: [
          { required: false, message: '请输入交车单ID', trigger: 'change' }
        ],
        retailOrderId: [
          { required: false, message: '请输入零售订单ID', trigger: 'change' }
        ],
        retailOrderCode: [
          { required: false, message: '请输入零售订单号', trigger: 'change' }
        ],
        soldPlateSource: [
          { required: false, message: '请输入已售上牌资料来源 report-特殊销售提报 delivery-交车单 plate-已售上牌新增', trigger: 'change' }
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
        saleOrgId: [
          { required: false, message: '请输入门店id', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: false, message: '请输入门店编码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        carBuyerName: [
          { required: true, message: '请输入车主姓名', trigger: 'change' }
        ],
        carBuyerPhone: [
          { required: true, message: '请输入车主电话', trigger: 'change' }
        ],
        idCardType: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        idCardNo: [
          { required: true, message: '请输入证件号码', trigger: 'change' }
        ],
        vehiclePurpose: [
          { required: true, message: '请输入车辆用途', trigger: 'change' }
        ],
        carSaleSversionId: [
          { required: false, message: '请输入公告车型ID', trigger: 'change' }
        ],
        carSalesVersionName: [
          { required: false, message: '请输入公告车型名称', trigger: 'change' }
        ],
        vehiclePlaceOrigin: [
          { required: true, message: '请输入产地', trigger: 'change' }
        ],
        enginenNumber: [
          { required: false, message: '请输入发动机号', trigger: 'change' }
        ],
        certificateNo: [
          { required: false, message: '请输入合格证号', trigger: 'change' }
        ],
        invoiceRecordCode: [
          { required: false, message: '请输入整车开票记录编号', trigger: 'change' }
        ],
        specialReportCode: [
          { required: false, message: '请输入特殊车辆销售提报编号', trigger: 'change' }
        ],
        drivingLicenseVin: [
          { required: false, message: '请输入行驶证VIN号', trigger: 'change' }
        ],
        drivingLicenseOwner: [
          { required: false, message: '请输入行驶证所有人', trigger: 'change' }
        ],
        plateNo: [
          { required: false, message: '请输入车牌号码', trigger: 'change' }
        ],
        plateDate: [
          { required: false, message: '请选择上牌日期', trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: '请输入上牌省份', trigger: 'change' }
        ],
        provinceName: [
          { required: true, message: '请输入上牌省份', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请输入上牌城市', trigger: 'change' }
        ],
        cityName: [
          { required: true, message: '请输入上牌城市', trigger: 'change' }
        ],
        districtCode: [
          { required: true, message: '请输入上牌区/县', trigger: 'change' }
        ],
        districtName: [
          { required: true, message: '请输入上牌区/县', trigger: 'change' }
        ],
        vehicleRegisterAddress: [
          { required: false, message: '请输入车辆注册地址', trigger: 'change' }
        ],
        drivingLicenseNumber: [
          { required: false, message: '请输入行驶证编号', trigger: 'change' }
        ],
        drivingLicenseBrandModel: [
          { required: false, message: '请输入行驶证品牌型号', trigger: 'change' }
        ],
        submitTime: [
          { required: false, message: '请选择提交审核时间', trigger: 'change' }
        ],
        submitUserId: [
          { required: false, message: '请输入提交人id', trigger: 'change' }
        ],
        submitUser: [
          { required: false, message: '请输入提交人', trigger: 'change' }
        ],
        auditTime: [
          { required: false, message: '请选择审核时间', trigger: 'change' }
        ],
        auditUserId: [
          { required: false, message: '请输入审核人id', trigger: 'change' }
        ],
        auditUser: [
          { required: false, message: '请输入审核人', trigger: 'change' }
        ],
        withdrawTime: [
          { required: false, message: '请选择撤回时间', trigger: 'change' }
        ],
        withdrawUserId: [
          { required: false, message: '请输入撤回人id', trigger: 'change' }
        ],
        withdrawUser: [
          { required: false, message: '请输入撤回人', trigger: 'change' }
        ],
        auditRemark: [
          { required: false, message: '请输入审核意见', trigger: 'change' }
        ],
        autoAuditStatus: [
          { required: false, message: '请选择是否自动审核', trigger: 'change' }
        ],
        dataSource: [
          { required: false, message: '请输入数据来源，150-新销服; 10-老销服', trigger: 'change' }
        ],
        invoiceVin: [
          { required: false, message: '请输入发票VIN号', trigger: 'change' }
        ],
        invoiceName: [
          { required: false, message: '请输入开票名称', trigger: 'change' }
        ],
        invoiceNo: [
          { required: false, message: '请输入发票号码', trigger: 'change' }
        ],
        invoiceTime: [
          { required: false, message: '请选择开票日期', trigger: 'change' }
        ],
        invoiceAmount: [
          { required: false, message: '请输入开票金额', trigger: 'change' }
        ],
        invoiceVehiclePlaceOrigin: [
          { required: false, message: '请输入发票产地', trigger: 'change' }
        ],
        invoiceBrandModel: [
          { required: false, message: '请输入发票厂牌型号', trigger: 'change' }
        ],
        invoiceCertificateNo: [
          { required: false, message: '请输入发票合格证号', trigger: 'change' }
        ],
        invoiceEngineNumber: [
          { required: false, message: '请输入发票发动机号', trigger: 'change' }
        ],
        ocrIdCardType: [
          { required: false, message: '请选择发票证件类型', trigger: 'change' }
        ],
        ocrIdCardNo: [
          { required: false, message: '请输入发票证件号码', trigger: 'change' }
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
    },
    vehicleProfileSearch (val) {
      const params = {
        searchVin: val,
        pageSize: 100
      };
      return getVehicleProfileList(params);
    },
    vehicleProfileChange (val, selectedOption) {
      let clearForm = true;
      if (val) {
        // 校验是否已存在记录
        effectiveVinValidate(val).then(res => {
          clearForm = false;
          this.refreshVehicleProfileInfo(val, selectedOption);
          // 获取关联整车开票
          // 获取关联特殊车辆提报
        });
      }
      if (clearForm) {
        // 清空表单
        this.$refs.ruleForm.resetFields();
        this.$refs.ruleForm1.resetFields();
        this.$refs.ruleForm2.resetFields();
        this.$refs.ruleForm3.resetFields();
      }
    },
    refreshVehicleProfileInfo (val, selectedOption) {
      this.form.vin = val ? selectedOption.vin : '';
      this.form.vehiclePlaceOrigin = val ? selectedOption.vehiclePlaceOrigin : '';
      this.form.carBuyerName = val ? selectedOption.vehicleProfileOwnerResp.ownerName : '';
      this.form.carBuyerPhone = val ? selectedOption.vehicleProfileOwnerResp.mobilephone : '';
      this.form.idCardType = val ? selectedOption.vehicleProfileOwnerResp.idcardType : '';
      this.form.idCardNo = val ? selectedOption.vehicleProfileOwnerResp.idcardNo : '';
      this.form.vehiclePurpose = val ? selectedOption.usageType : '';
      this.form.enginenNumber = val ? selectedOption.enginenNumber : '';
      this.form.certificateNo = val ? selectedOption.certNumber : '';
      this.form.carSaleSversionId = val ? selectedOption.carSaleSversionId : '';
      this.form.carSalesVersionName = val ? selectedOption.carSalesVersionName : '';
      if (selectedOption.salesDealerCode) {
        this.form.saleDealerCode = val ? selectedOption.salesDealerCode : null;
        this.form.saleDealerName = val ? selectedOption.salesDealerName : null;
        this.saleDealerSearch(selectedOption.salesDealerName);
      }
      if (selectedOption.vehicleModelName) {
        this.form.modelId = val ? selectedOption.vehicleModelId : '';
        this.form.modelName = val ? selectedOption.vehicleModelName : '';
        this.vehicleModelSearch(selectedOption.vehicleModelName);
      }
    },
    vehicleModelSearch (val) {
      const params = {
        modelNameLike: val,
        pageSize: 100
      };
      return listVehicleModel(params);
    },
    vehicleModelChange (val, selectedOption) {
      this.form.modelId = val ? selectedOption.id : null;
      this.form.modelName = val ? selectedOption.name : null;
    },
    // 公告车型
    vehicleSalesVersionSearch (val) {
      const params = {
        registeredModelNameLike: val,
        pageSize: 100
      };
      return vehicleSalesVersionList(params);
    },
    vehicleSalesVersionChange (val, selectedOption) {
      this.form.carSalesVersionId = val ? selectedOption.id : null;
      this.form.carSalesVersionName = val ? selectedOption.name : null;
    },
    saleDealerSearch (val) {
      const params = {
        keyword: val,
        size: 100
      };
      return listStoreInfo(params);
    },
    saleDealerChange (val, selectedOption) {
      // this.form.saleOrgId = val ? selectedOption.storeId : null;
      this.form.saleDealerCode = val ? selectedOption.storeCode : null;
      this.form.saleDealerName = val ? selectedOption.storeName : null;
    }
  }
};
</script>
