<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="主键" prop="id">
                <el-input
                  placeholder="请输入"
                  v-model="form.id"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建者" prop="creator">
                <el-input
                  placeholder="请输入"
                  v-model="form.creator"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建者名称" prop="creatorName">
                <el-input
                  placeholder="请输入"
                  v-model="form.creatorName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.createTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="修改者" prop="modifier">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifier"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改者名称" prop="modifierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifierName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改时间" prop="updateTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.updateTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="StatusEnum"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="VDC入库时间" prop="inboundDateTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.inboundDateTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="产销识别码" prop="zppNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.zppNo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="VIN" prop="vin">
                <el-input
                  placeholder="请输入"
                  v-model="form.vin"
                  clearable
                />
              </el-form-item>
              <el-form-item label="订单状态" prop="poStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="vehstock_po_status"
                  v-model="form.poStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="销售预留" prop="reserved">
                <el-input
                  placeholder="请输入"
                  v-model="form.reserved"
                  clearable
                />
              </el-form-item>
              <el-form-item label="销售预留类型" prop="reservedType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="vehstock_reserved_type"
                  v-model="form.reservedType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="是否配车" prop="carAllocated">
                <el-input
                  placeholder="请输入"
                  v-model="form.carAllocated"
                  clearable
                />
              </el-form-item>
              <el-form-item label="物料编码" prop="materialsCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.materialsCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="物料描述" prop="materialsDesc">
                <el-input
                  placeholder="请输入"
                  v-model="form.materialsDesc"
                  clearable
                />
              </el-form-item>
              <el-form-item label="电池电芯ID" prop="batteryCellId">
                <el-input
                  placeholder="请输入"
                  v-model="form.batteryCellId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="电池电芯名称" prop="batteryCellName">
                <el-input
                  placeholder="请输入"
                  v-model="form.batteryCellName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="公告车型ID" prop="vehicleRegisteredModelId">
                <el-input
                  placeholder="请输入"
                  v-model="form.vehicleRegisteredModelId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="公告车型名称" prop="vehicleRegisteredModelName">
                <el-input
                  placeholder="请输入"
                  v-model="form.vehicleRegisteredModelName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="订单编号" prop="po">
                <el-input
                  placeholder="请输入"
                  v-model="form.po"
                  clearable
                />
              </el-form-item>
              <el-form-item label="VDC出库时间" prop="outboundDateTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.outboundDateTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="MES订单状态" prop="mesStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="vehstock_mes_status"
                  v-model="form.mesStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="配车时间" prop="carAllocatedDateTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.carAllocatedDateTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="SAP流水号" prop="serNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.serNo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="计划订单号" prop="ordNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.ordNo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="PVI单号" prop="pviNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.pviNo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="车系ID" prop="seriesId">
                <el-input
                  placeholder="请输入"
                  v-model="form.seriesId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="车系名称" prop="seriesName">
                <el-input
                  placeholder="请输入"
                  v-model="form.seriesName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="车型ID" prop="modelId">
                <el-input
                  placeholder="请输入"
                  v-model="form.modelId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="车型名称" prop="modelName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modelName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="选配动力ID" prop="rangePowerId">
                <el-input
                  placeholder="请输入"
                  v-model="form.rangePowerId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="选配动力名称" prop="rangePowerName">
                <el-input
                  placeholder="请输入"
                  v-model="form.rangePowerName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="续航里程ID" prop="drivingRangeId">
                <el-input
                  placeholder="请输入"
                  v-model="form.drivingRangeId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="续航里程名称" prop="drivingRangeName">
                <el-input
                  placeholder="请输入"
                  v-model="form.drivingRangeName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="外观ID" prop="exteriorId">
                <el-input
                  placeholder="请输入"
                  v-model="form.exteriorId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="外观名称" prop="exteriorName">
                <el-input
                  placeholder="请输入"
                  v-model="form.exteriorName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="内饰ID" prop="interiorId">
                <el-input
                  placeholder="请输入"
                  v-model="form.interiorId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="内饰名称" prop="interiorName">
                <el-input
                  placeholder="请输入"
                  v-model="form.interiorName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="年款ID" prop="yearTypeId">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.yearTypeId"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="年款名称" prop="yearTypeName">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.yearTypeName"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="选配轮毂ID" prop="wheelHubId">
                <el-input
                  placeholder="请输入"
                  v-model="form.wheelHubId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="选配轮毂名称" prop="wheelHubName">
                <el-input
                  placeholder="请输入"
                  v-model="form.wheelHubName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="选装包ID" prop="optionPackageId">
                <el-input
                  placeholder="请输入"
                  v-model="form.optionPackageId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="选装包名称" prop="optionPackageName">
                <el-input
                  placeholder="请输入"
                  v-model="form.optionPackageName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否允许现车批售 BooleanEnum ，1：允许；0不允许" prop="allowWholesale">
                <el-radio-group v-model="form.allowWholesale">
                  <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="绑定零售单 BooleanEnum（0:否,1:是）" prop="bindRetailOrder">
                <el-input
                  placeholder="请输入"
                  v-model="form.bindRetailOrder"
                  clearable
                />
              </el-form-item>
              <el-form-item label="发运方式" prop="shipVia">
                <el-input
                  placeholder="请输入"
                  v-model="form.shipVia"
                  clearable
                />
              </el-form-item>
              <el-form-item label="整车订单ID" prop="retailOrderId">
                <el-input
                  placeholder="请输入"
                  v-model="form.retailOrderId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="整车订单编号" prop="retailOrderCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.retailOrderCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="批售订单ID" prop="wholesaleOrderId">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesaleOrderId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="批售订单号" prop="wholesaleOrderCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesaleOrderCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="企业客户整车订单ID" prop="entVehorderId">
                <el-input
                  placeholder="请输入"
                  v-model="form.entVehorderId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="企业客户整车订单编码" prop="entVehorderCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.entVehorderCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="订单类型" prop="orderType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.orderType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="计划收车时间" prop="planReceiveCarTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.planReceiveCarTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="焊装上线时间" prop="weldingOnlineTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.weldingOnlineTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="焊装下线时间" prop="weldingOfflineTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.weldingOfflineTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="涂装上线时间" prop="paintingOnlineTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.paintingOnlineTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="涂装下线时间" prop="paintingOfflineTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.paintingOfflineTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="总装上线时间" prop="finalAssemblyOnlineTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.finalAssemblyOnlineTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="总装下线时间" prop="finalAssemblyOfflineTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.finalAssemblyOfflineTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="PDI上线时间" prop="pdiOnlineTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.pdiOnlineTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="PDI下线时间" prop="pdiOfflineTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.pdiOfflineTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="制造日期" prop="manufacturingDate">
                <el-input
                  placeholder="请输入"
                  v-model="form.manufacturingDate"
                  clearable
                />
              </el-form-item>
              <el-form-item label="工厂" prop="factory">
                <el-input
                  placeholder="请输入"
                  v-model="form.factory"
                  clearable
                />
              </el-form-item>
              <el-form-item label="合格证号" prop="certNumber">
                <el-input
                  placeholder="请输入"
                  v-model="form.certNumber"
                  clearable
                />
              </el-form-item>
              <el-form-item label="发动机号" prop="enginenNumber">
                <el-input
                  placeholder="请输入"
                  v-model="form.enginenNumber"
                  clearable
                />
              </el-form-item>
              <el-form-item label="发动机型号" prop="enginenModel">
                <el-input
                  placeholder="请输入"
                  v-model="form.enginenModel"
                  clearable
                />
              </el-form-item>
              <el-form-item label="电机型号" prop="motorModel">
                <el-input
                  placeholder="请输入"
                  v-model="form.motorModel"
                  clearable
                />
              </el-form-item>
              <el-form-item label="电机序列号" prop="motorSerialNumber">
                <el-input
                  placeholder="请输入"
                  v-model="form.motorSerialNumber"
                  clearable
                />
              </el-form-item>
              <el-form-item label="电驱序列号" prop="electricNumberBefore">
                <el-input
                  placeholder="请输入"
                  v-model="form.electricNumberBefore"
                  clearable
                />
              </el-form-item>
              <el-form-item label="电驱序列号" prop="electricNumberAfter">
                <el-input
                  placeholder="请输入"
                  v-model="form.electricNumberAfter"
                  clearable
                />
              </el-form-item>
              <el-form-item label="电池包编号" prop="batteryPackNumber">
                <el-input
                  placeholder="请输入"
                  v-model="form.batteryPackNumber"
                  clearable
                />
              </el-form-item>
              <el-form-item label="电池序列号" prop="batterySerialNumber">
                <el-input
                  placeholder="请输入"
                  v-model="form.batterySerialNumber"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" @click="handleBack">取消</el-button>
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehstock/vdc/vehiclePo/index';
import FetchSelect from '@/libs/components/FetchSelect';
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
  inboundDateTime: '',
  zppNo: '',
  vin: '',
  poStatus: '',
  reserved: '',
  reservedType: '',
  carAllocated: '',
  materialsCode: '',
  materialsDesc: '',
  batteryCellId: '',
  batteryCellName: '',
  vehicleRegisteredModelId: '',
  vehicleRegisteredModelName: '',
  po: '',
  outboundDateTime: '',
  mesStatus: '',
  carAllocatedDateTime: '',
  serNo: '',
  ordNo: '',
  pviNo: '',
  seriesId: '',
  seriesName: '',
  modelId: '',
  modelName: '',
  rangePowerId: '',
  rangePowerName: '',
  drivingRangeId: '',
  drivingRangeName: '',
  exteriorId: '',
  exteriorName: '',
  interiorId: '',
  interiorName: '',
  yearTypeId: '',
  yearTypeName: '',
  wheelHubId: '',
  wheelHubName: '',
  optionPackageId: '',
  optionPackageName: '',
  allowWholesale: '',
  bindRetailOrder: '',
  shipVia: '',
  retailOrderId: '',
  retailOrderCode: '',
  wholesaleOrderId: '',
  wholesaleOrderCode: '',
  entVehorderId: '',
  entVehorderCode: '',
  orderType: '',
  planReceiveCarTime: '',
  weldingOnlineTime: '',
  weldingOfflineTime: '',
  paintingOnlineTime: '',
  paintingOfflineTime: '',
  finalAssemblyOnlineTime: '',
  finalAssemblyOfflineTime: '',
  pdiOnlineTime: '',
  pdiOfflineTime: '',
  manufacturingDate: '',
  factory: '',
  certNumber: '',
  enginenNumber: '',
  enginenModel: '',
  motorModel: '',
  motorSerialNumber: '',
  electricNumberBefore: '',
  electricNumberAfter: '',
  batteryPackNumber: '',
  batterySerialNumber: '',
};

export default {
  name: 'vehiclePoEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '整车采购订单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-vehiclePo',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        inboundDateTime: [
          { required: true, message: '请选择VDC入库时间', trigger: 'change' }
        ],
        zppNo: [
          { required: true, message: '请输入产销识别码', trigger: 'blur' }
        ],
        vin: [
          { required: true, message: '请输入VIN', trigger: 'blur' }
        ],
        poStatus: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ],
        reserved: [
          { required: true, message: '请输入销售预留', trigger: 'blur' }
        ],
        reservedType: [
          { required: true, message: '请选择销售预留类型', trigger: 'change' }
        ],
        carAllocated: [
          { required: true, message: '请输入是否配车', trigger: 'blur' }
        ],
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        materialsDesc: [
          { required: true, message: '请输入物料描述', trigger: 'blur' }
        ],
        batteryCellId: [
          { required: true, message: '请输入电池电芯ID', trigger: 'blur' }
        ],
        batteryCellName: [
          { required: true, message: '请输入电池电芯名称', trigger: 'blur' }
        ],
        vehicleRegisteredModelId: [
          { required: true, message: '请输入公告车型ID', trigger: 'blur' }
        ],
        vehicleRegisteredModelName: [
          { required: true, message: '请输入公告车型名称', trigger: 'blur' }
        ],
        po: [
          { required: true, message: '请输入订单编号', trigger: 'blur' }
        ],
        outboundDateTime: [
          { required: true, message: '请选择VDC出库时间', trigger: 'change' }
        ],
        mesStatus: [
          { required: true, message: '请选择MES订单状态', trigger: 'change' }
        ],
        carAllocatedDateTime: [
          { required: true, message: '请选择配车时间', trigger: 'change' }
        ],
        serNo: [
          { required: true, message: '请输入SAP流水号', trigger: 'blur' }
        ],
        ordNo: [
          { required: true, message: '请输入计划订单号', trigger: 'blur' }
        ],
        pviNo: [
          { required: true, message: '请输入PVI单号', trigger: 'blur' }
        ],
        seriesId: [
          { required: true, message: '请输入车系ID', trigger: 'blur' }
        ],
        seriesName: [
          { required: true, message: '请输入车系名称', trigger: 'blur' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'blur' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'blur' }
        ],
        rangePowerId: [
          { required: true, message: '请输入选配动力ID', trigger: 'blur' }
        ],
        rangePowerName: [
          { required: true, message: '请输入选配动力名称', trigger: 'blur' }
        ],
        drivingRangeId: [
          { required: true, message: '请输入续航里程ID', trigger: 'blur' }
        ],
        drivingRangeName: [
          { required: true, message: '请输入续航里程名称', trigger: 'blur' }
        ],
        exteriorId: [
          { required: true, message: '请输入外观ID', trigger: 'blur' }
        ],
        exteriorName: [
          { required: true, message: '请输入外观名称', trigger: 'blur' }
        ],
        interiorId: [
          { required: true, message: '请输入内饰ID', trigger: 'blur' }
        ],
        interiorName: [
          { required: true, message: '请输入内饰名称', trigger: 'blur' }
        ],
        yearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' }
        ],
        yearTypeName: [
          { required: true, message: '请选择年款名称', trigger: 'change' }
        ],
        wheelHubId: [
          { required: true, message: '请输入选配轮毂ID', trigger: 'blur' }
        ],
        wheelHubName: [
          { required: true, message: '请输入选配轮毂名称', trigger: 'blur' }
        ],
        optionPackageId: [
          { required: true, message: '请输入选装包ID', trigger: 'blur' }
        ],
        optionPackageName: [
          { required: true, message: '请输入选装包名称', trigger: 'blur' }
        ],
        bindRetailOrder: [
          { required: true, message: '请输入绑定零售单 BooleanEnum（0:否,1:是）', trigger: 'blur' }
        ],
        shipVia: [
          { required: true, message: '请输入发运方式', trigger: 'blur' }
        ],
        retailOrderId: [
          { required: true, message: '请输入整车订单ID', trigger: 'blur' }
        ],
        retailOrderCode: [
          { required: true, message: '请输入整车订单编号', trigger: 'blur' }
        ],
        wholesaleOrderId: [
          { required: true, message: '请输入批售订单ID', trigger: 'blur' }
        ],
        wholesaleOrderCode: [
          { required: true, message: '请输入批售订单号', trigger: 'blur' }
        ],
        entVehorderId: [
          { required: true, message: '请输入企业客户整车订单ID', trigger: 'blur' }
        ],
        entVehorderCode: [
          { required: true, message: '请输入企业客户整车订单编码', trigger: 'blur' }
        ],
        orderType: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        planReceiveCarTime: [
          { required: true, message: '请选择计划收车时间', trigger: 'change' }
        ],
        weldingOnlineTime: [
          { required: true, message: '请选择焊装上线时间', trigger: 'change' }
        ],
        weldingOfflineTime: [
          { required: true, message: '请选择焊装下线时间', trigger: 'change' }
        ],
        paintingOnlineTime: [
          { required: true, message: '请选择涂装上线时间', trigger: 'change' }
        ],
        paintingOfflineTime: [
          { required: true, message: '请选择涂装下线时间', trigger: 'change' }
        ],
        finalAssemblyOnlineTime: [
          { required: true, message: '请选择总装上线时间', trigger: 'change' }
        ],
        finalAssemblyOfflineTime: [
          { required: true, message: '请选择总装下线时间', trigger: 'change' }
        ],
        pdiOnlineTime: [
          { required: true, message: '请选择PDI上线时间', trigger: 'change' }
        ],
        pdiOfflineTime: [
          { required: true, message: '请选择PDI下线时间', trigger: 'change' }
        ],
        manufacturingDate: [
          { required: true, message: '请输入制造日期', trigger: 'blur' }
        ],
        factory: [
          { required: true, message: '请输入工厂', trigger: 'blur' }
        ],
        certNumber: [
          { required: true, message: '请输入合格证号', trigger: 'blur' }
        ],
        enginenNumber: [
          { required: true, message: '请输入发动机号', trigger: 'blur' }
        ],
        enginenModel: [
          { required: true, message: '请输入发动机型号', trigger: 'blur' }
        ],
        motorModel: [
          { required: true, message: '请输入电机型号', trigger: 'blur' }
        ],
        motorSerialNumber: [
          { required: true, message: '请输入电机序列号', trigger: 'blur' }
        ],
        electricNumberBefore: [
          { required: true, message: '请输入电驱序列号', trigger: 'blur' }
        ],
        electricNumberAfter: [
          { required: true, message: '请输入电驱序列号', trigger: 'blur' }
        ],
        batteryPackNumber: [
          { required: true, message: '请输入电池包编号', trigger: 'blur' }
        ],
        batterySerialNumber: [
          { required: true, message: '请输入电池序列号', trigger: 'blur' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车采购订单', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          addOrUpdate({ ...this.form }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            const id = this.$route.query.id;
            if (rest || !id) {
              this.resetForm(formName);
            } else {
              this.getDetailData();
            }
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
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
    // handleJumpAuditLog () {
    //   this.$router.push({
    //     path: '/xxx/auditLog',
    //     query: {
    //       tableCode: '',
    //       tableId: ''
    //     }
    //   });
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
