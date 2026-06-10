<template>
  <edit-page-layout ref="editLayout" title="整车采购订单" showPaneFooter>
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
              <!-- 订单基本信息 -->
          <div class="form-details">
            <div>
              订单状态：{{ form.poStatusLabel }}
            </div>
            <el-divider direction="vertical"></el-divider>
            <div>
              创建时间：{{ form.createTime }}
            </div>
          </div>

          <section class="common-section">
            <div class="common-section-header">
              <h2>销售信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="销售预留：" prop="reservedLabel">
                  {{ form.reservedLabel }}
                </el-form-item>
                <el-form-item label="销售预留类型：" prop="reservedTypeLabel">
                  {{ form.reservedTypeLabel }}
                </el-form-item>
                <el-form-item label="绑定零售单：" prop="bindRetailOrderLabel">
                  {{ form.bindRetailOrderLabel }}
                </el-form-item>
                <el-form-item label="是否配车：" prop="carAllocatedLabel">
                  {{ form.carAllocatedLabel }}
                </el-form-item>
                <el-form-item label="配车时间：" prop="carAllocatedDateTime">
                  {{ form.carAllocatedDateTime }}
                </el-form-item>
                <el-form-item label="发运方式：" prop="shipViaLabel">
                  {{ form.shipViaLabel }}
                </el-form-item>
                <el-form-item label="整车订单编号：" prop="retailOrderCode">
                  <el-link v-if="form.retailOrderId" type="primary" :href="`/sales/vehretail/orderManager/retailOrderInfo/edit?id=${form.retailOrderId}`" target="_blank">{{ form.retailOrderCode }}</el-link>
                  <span v-else>{{ form.retailOrderCode }}</span>
                </el-form-item>
                <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  <el-link v-if="form.wholesaleOrderId" type="primary" :href="`/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit?id=${form.wholesaleOrderId}`" target="_blank">{{ form.wholesaleOrderCode }}</el-link>
                  <span v-else>{{ form.wholesaleOrderCode }}</span>
                </el-form-item>
                <el-form-item label="企业客户整车订单编码：" prop="entVehorderCode">
                  <el-link v-if="form.entVehorderId" type="primary" :href="`/sales/vehwholesale/entorder/entVehicleOrder/edit?id=${form.entVehorderId}`" target="_blank">{{ form.entVehorderCode }}</el-link>
                  <span v-else>{{ form.entVehorderCode }}</span>
                </el-form-item>
                <el-form-item label="VDC入库时间：" prop="inboundDateTime">
                  {{ form.inboundDateTime }}
                </el-form-item>
                <el-form-item label="VDC出库时间：" prop="outboundDateTime">
                  {{ form.outboundDateTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <section class="common-section">
            <div class="common-section-header">
              <h2>物料信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="物料编码：" prop="materialsCode">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${form.materialsCode}`" target="_blank">{{ form.materialsCode }}</el-link>
                </el-form-item>
                <el-form-item label="车系：" prop="seriesName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleSeries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName }}</el-link>
                </el-form-item>
                <el-form-item label="车型：" prop="modelName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleModel/edit?id=${form.modelId}`" target="_blank">{{ form.modelName }}</el-link>
                </el-form-item>
                <el-form-item label="选配续航：" prop="drivingRangeName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleDrivingRange/edit?id=${form.drivingRangeId}`" target="_blank">{{ form.drivingRangeName }}</el-link>
                </el-form-item>
                <el-form-item label="选配动力：" prop="rangePowerName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleRangePower/edit?id=${form.rangePowerId}`" target="_blank">{{ form.rangePowerName }}</el-link>
                </el-form-item>
                <el-form-item label="外观：" prop="exteriorName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleExterior/edit?id=${form.exteriorId}`" target="_blank">{{ form.exteriorName }}</el-link>
                </el-form-item>
                <el-form-item label="内饰：" prop="interiorName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleInterior/edit?id=${form.interiorId}`" target="_blank">{{ form.interiorName }}</el-link>
                </el-form-item>
                <el-form-item label="选配轮毂：" prop="wheelHubName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleWheelHub/edit?id=${form.wheelHubId}`" target="_blank">{{ form.wheelHubName }}</el-link>
                </el-form-item>
                <el-form-item label="电池电芯：" prop="batteryCellName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleBatteryCell/edit?id=${form.batteryCellId}`" target="_blank">{{ form.batteryCellName }}</el-link>
                </el-form-item>
                <el-form-item label="年款：" prop="yearTypeName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleYearType/edit?id=${form.yearTypeId}`" target="_blank">{{ form.yearTypeName }}</el-link>
                </el-form-item>
                <el-form-item label="选装包：" prop="optionPackageName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleOptionPackage/edit?id=${form.optionPackageId}`" target="_blank">{{ form.optionPackageName }}</el-link>
                </el-form-item>
                <el-form-item label="是否允许现车批售：" prop="allowWholesaleLabel">
                  {{ form.allowWholesaleLabel }}
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc" style="width: 100%;">
                  {{ form.materialsDesc }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <section class="common-section">
            <div class="common-section-header">
              <h2>生产信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="工厂：" prop="factory">
                  {{ form.factory }}
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`" target="_blank">{{ form.vin }}</el-link>
                </el-form-item>
                <el-form-item label="计划收车时间：" prop="planReceiveCarTime">
                  {{ form.planReceiveCarTime }}
                </el-form-item>
                <el-form-item label="公告车型：" prop="vehicleRegisteredModelName">
                  {{ form.vehicleRegisteredModelName }}
                </el-form-item>
                <el-form-item label="合格证号：" prop="certNumber">
                  {{ form.certNumber }}
                </el-form-item>
                <el-form-item label="焊装上线时间：" prop="weldingOnlineTime">
                  {{ form.weldingOnlineTime }}
                </el-form-item>
                <el-form-item label="发动机号：" prop="enginenNumber">
                  {{ form.enginenNumber }}
                </el-form-item>
                <el-form-item label="发动机型号：" prop="enginenModel">
                  {{ form.enginenModel }}
                </el-form-item>
                <el-form-item label="涂装上线时间：" prop="paintingOnlineTime">
                  {{ form.paintingOnlineTime }}
                </el-form-item>
                <el-form-item label="电机型号：" prop="motorModel">
                  {{ form.motorModel }}
                </el-form-item>
                <el-form-item label="电驱序列号(前)：" prop="electricNumberBefore">
                  {{ form.electricNumberBefore }}
                </el-form-item>
                <el-form-item label="总装上线时间：" prop="finalAssemblyOnlineTime">
                  {{ form.finalAssemblyOnlineTime }}
                </el-form-item>
                <el-form-item label="电机序列号：" prop="motorSerialNumber">
                  {{ form.motorSerialNumber }}
                </el-form-item>
                <el-form-item label="电驱序列号(后)：" prop="electricNumberAfter">
                  {{ form.electricNumberAfter }}
                </el-form-item>
                <el-form-item label="PDI上线时间：" prop="pdiOnlineTime">
                  {{ form.pdiOnlineTime }}
                </el-form-item>
                <el-form-item label="电池包编号：" prop="batteryPackNumber">
                  {{ form.batteryPackNumber }}
                </el-form-item>
                <el-form-item label="电池序列号：" prop="batterySerialNumber">
                  {{ form.batterySerialNumber }}
                </el-form-item>
                <el-form-item label="制造日期：" prop="manufacturingDate">
                  {{ form.manufacturingDate }}
                </el-form-item>
                <el-form-item label="MES订单状态：" prop="mesStatusLabel">
                  {{ form.mesStatusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <section class="common-section">
            <div class="common-section-header">
              <h2>SAP信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="SAP流水号：" prop="serNo">
                  {{ form.serNo }}
                </el-form-item>
                <el-form-item label="计划订单号：" prop="ordNo">
                  {{ form.ordNo }}
                </el-form-item>
                <el-form-item label="产销识别码：" prop="zppNo">
                  {{ form.zppNo }}
                </el-form-item>
                <el-form-item label="订单类型：" prop="orderType">
                  {{ form.orderType }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <section class="common-section">
            <div class="common-section-header">
              <h2>过点明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :show-toolbar="false"
                  :isFocusNewRow="false"
                  showPagination
                  :current="pageNum"
                  :pageSize="pageSize"
                  :total="total"
                  @page-size-change="pageSizeChange"
                  @current-page-change="currentPageChange"
                />
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
import { getDetail, vehiclePoTrack } from '@/api/vehstock/vdc/vehiclePo/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import EditTable from '@/libs/components/EditTable';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  po: '',
  poStatus: '',
  poStatusLabel: '',
  createTime: '',
  reserved: '',
  reservedLabel: '',
  reservedType: '',
  reservedTypeLabel: '',
  bindRetailOrder: '',
  bindRetailOrderLabel: '',
  carAllocated: '',
  carAllocatedLabel: '',
  carAllocatedDateTime: '',
  shipVia: '',
  shipViaLabel: '',
  retailOrderCode: '',
  wholesaleOrderCode: '',
  entVehorderCode: '',
  inboundDateTime: '',
  outboundDateTime: '',
  materialsCode: '',
  seriesName: '',
  modelName: '',
  drivingRangeName: '',
  rangePowerName: '',
  exteriorName: '',
  interiorName: '',
  wheelHubName: '',
  batteryCellName: '',
  yearTypeName: '',
  optionPackageName: '',
  allowWholesale: '',
  allowWholesaleLabel: '',
  materialsDesc: '',
  factory: '',
  vin: '',
  planReceiveCarTime: '',
  vehicleRegisteredModelName: '',
  certNumber: '',
  weldingOnlineTime: '',
  enginenNumber: '',
  enginenModel: '',
  paintingOnlineTime: '',
  motorModel: '',
  electricNumberBefore: '',
  finalAssemblyOnlineTime: '',
  motorSerialNumber: '',
  electricNumberAfter: '',
  pdiOnlineTime: '',
  batteryPackNumber: '',
  batterySerialNumber: '',
  manufacturingDate: '',
  mesStatus: '',
  mesStatusLabel: '',
  serNo: '',
  ordNo: '',
  zppNo: '',
  orderType: '',
  creatorName: '',
  updateTime: '',
  modifierName: '',
  remark: ''
};

export default {
  name: 'vehiclePoEdit',
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
    EditTable
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '订单编号：' + this.form.po;
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
    'form.id': {
      handler (val) {
        if (val) {
          this.getTable();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefaultForm();
    return {
      pageTitle: '整车采购订单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVS-vehiclePo',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      tableData: [],
      pageSize: 10,
      total: 0,
      pageNum: 1,
      columns: [
        {
          field: 'pointDate',
          title: '过点时间',
          width: '15%',
        },
        {
          field: 'code',
          title: '站点编号',
          width: '15%',
        },
        {
          field: 'site',
          title: '站点',
          width: '15%',
        },
        {
          field: 'planOrder',
          title: '计划订单号',
          width: '15%',
        },
        {
          field: 'pviNo',
          title: 'PVI单号',
          width: '15%',
        },
        {
          field: 'factory',
          title: '工厂',
          width: '15%',
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '15%',
        },
      ]
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
      // 只读页面，不需要提交功能
      return Promise.resolve();
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefaultForm () {
      return { ...defaultForm };
    },
    async getTable () {
      const { pageNum, pageSize } = this;
      if (this.form.ordNo) {
        const res = await vehiclePoTrack({ planOrder: this.form.ordNo, pageNum, pageSize });
        this.tableData = res.records || [];
        this.total = res.total || 0;
      }
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getTable();
    },
    currentPageChange (current) {
      this.pageNum = current;
      this.getTable();
    }
  }
};
</script>

<style lang="scss" scoped>
.form-details {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #6C6E6C;
  margin-top:8px;
}
</style>
