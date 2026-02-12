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
        :showEditBtn="false"
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
              <el-form
                :inline="true"
                :model="form"
                :rules="rules"
                ref="ruleForm"
                label-width="150px"
                class="form-edit"
                v-show="isEditing || !_id"
              >
                <el-form-item label="VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车仓库名称：" prop="vehicleWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单分类：" prop="orderCategory">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderCategory"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合格证是否质押：" prop="certificatePledged">
                  <el-input
                    placeholder="请输入"
                    v-model="form.certificatePledged"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合格证发运方式：" prop="certificateShippingWay">
                  <el-input
                    placeholder="请输入"
                    v-model="form.certificateShippingWay"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="金融机构ID：" prop="financialOrganizationId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.financialOrganizationId"
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
                <el-form-item label="大区：" prop="regionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否发运：" prop="shipped">
                  <el-input
                    placeholder="请输入"
                    v-model="form.shipped"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="批售方式：" prop="wholesaleWay">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleWay"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合作类型：" prop="cooperateType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.cooperateType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="指定发运方式：" prop="deliveryWay">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryWay"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="指定发运方式,来源WMS接口【车辆出库状态同步】的发运方式：" prop="actualDeliveryWay">
                  <el-input
                    placeholder="请输入"
                    v-model="form.actualDeliveryWay"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发运计划明细编码：" prop="shippingPlanDetailCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.shippingPlanDetailCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店仓库xx：" prop="vehicleWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付门店xx：" prop="vehicleWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收获时间xx：" prop="vehicleWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否需要同步WMS：" prop="needSyncWms">
                  <el-input
                    placeholder="请输入"
                    v-model="form.needSyncWms"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="企业整车订单号：" prop="entVehicleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.entVehicleOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="承运记录编码：" prop="carrierRecordCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carrierRecordCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="作废人：" prop="cancelUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="作废时间：" prop="cancelTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.cancelTime"
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
              </el-form>
              <el-form
                label-width="150px"
                :inline="true"
                class="form-detail"
                v-show="!(isEditing || !_id)"
              >
                <el-form-item label="VIN码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="整车仓库名称：" prop="vehicleWarehouseName">
                  {{ form.vehicleWarehouseName }}
                </el-form-item>
                <el-form-item label="订单分类：" prop="orderCategory">
                  {{ form.orderCategory }}
                </el-form-item>
                <el-form-item label="合格证是否质押：" prop="certificatePledged">
                  {{ form.certificatePledged }}
                </el-form-item>
                <el-form-item label="合格证发运方式：" prop="certificateShippingWay">
                  {{ form.certificateShippingWay }}
                </el-form-item>
                <el-form-item label="金融机构ID：" prop="financialOrganizationId">
                  {{ form.financialOrganizationId }}
                </el-form-item>
                <el-form-item label="车系名称：" prop="seriesName">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="是否发运" prop="shipped">
                  {{ form.shipped }}
                </el-form-item>
                <el-form-item label="批售方式：" prop="wholesaleWay">
                  {{ form.wholesaleWay }}
                </el-form-item>
                <el-form-item label="合作类型：" prop="cooperateType">
                  {{ form.cooperateType }}
                </el-form-item>
                <el-form-item label="指定发运方式：" prop="deliveryWay">
                  {{ form.deliveryWay }}
                </el-form-item>
                <el-form-item label="指定发运方式：" prop="actualDeliveryWay">
                  {{ form.actualDeliveryWay }}
                </el-form-item>
                <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
                </el-form-item>
                <el-form-item label="发运计划明细编码：" prop="shippingPlanDetailCode">
                  {{ form.shippingPlanDetailCode }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="门店仓库：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="交付门店：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="收货时间：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="是否需要同步WMS：" prop="needSyncWms">
                  {{ form.needSyncWms }}
                </el-form-item>
                <el-form-item label="承运记录编码：" prop="carrierRecordCode">
                  {{ form.carrierRecordCode }}
                </el-form-item>
                <el-form-item label="作废人：" prop="cancelUserName">
                  {{ form.cancelUserName }}
                </el-form-item>
                <el-form-item label="作废时间：" prop="cancelTime">
                  {{ form.cancelTime }}
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>接车地址信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form
                :inline="true"
                :model="form"
                :rules="rules"
                ref="ruleForm"
                label-width="150px"
                class="form-edit"
                v-show="isEditing || !_id"
              >
                <el-form-item label="接车联系人：" prop="pickupContactName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pickupContactName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="接车联系电话：" prop="pickupContactMobile">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pickupContactMobile"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="区县名称：" prop="districtName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.districtName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交车地址：" prop="address">
                  <el-input
                    placeholder="请输入"
                    v-model="form.address"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="经度：" prop="longitude">
                  <el-input
                    placeholder="请输入"
                    v-model="form.longitude"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维度：" prop="latitude">
                  <el-input
                    placeholder="请输入"
                    v-model="form.latitude"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form
                label-width="150px"
                :inline="true"
                class="form-detail"
                v-show="!(isEditing || !_id)"
              >
                <el-form-item label="接车联系人：" prop="pickupContactName">
                  {{ form.pickupContactName }}
                </el-form-item>
                <el-form-item label="接车联系电话：" prop="pickupContactMobile">
                  {{ form.pickupContactMobile }}
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="区县名称：" prop="districtName">
                  {{ form.districtName }}
                </el-form-item>
                <el-form-item label="交车地址：" prop="address">
                  {{ form.address }}
                </el-form-item>
                <el-form-item label="经度：" prop="longitude">
                  {{ form.longitude }}
                </el-form-item>
                <el-form-item label="维度：" prop="latitude">
                  {{ form.latitude }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>整车仓库信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form
                :inline="true"
                :model="form"
                :rules="rules"
                ref="ruleForm"
                label-width="150px"
                class="form-edit"
                v-show="isEditing || !_id"
              >
                <el-form-item label="整车仓库名称：" prop="vehicleWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车仓库编码：" prop="vehicleWarehouseCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车工厂：" prop="vehicleWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否冻结：" prop="vehicleWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="仓库分类：" prop="vehicleWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="仓库地址：" prop="vehicleWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="省份：" prop="vehicleWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="城市：" prop="vehicleWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="区县：" prop="vehicleWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleWarehouseName"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form
                label-width="150px"
                :inline="true"
                class="form-detail"
                v-show="!(isEditing || !_id)"
              >
                <el-form-item label="整车仓库名称：" prop="vehicleWarehouseName">
                  {{ form.vehicleWarehouseName }}
                </el-form-item>
                <el-form-item label="整车仓库编码：" prop="vehicleWarehouseCode">
                  {{ form.vehicleWarehouseCode }}
                </el-form-item>
                <el-form-item label="整车工厂：" prop="vehicleWarehouseCode">
                  {{ form.vehicleWarehouseCode }}
                </el-form-item>
                <el-form-item label="是否冻结：" prop="vehicleWarehouseName">
                  {{ form.vehicleWarehouseName }}
                </el-form-item>
                <el-form-item label="仓库分类：" prop="vehicleWarehouseCode">
                  {{ form.vehicleWarehouseCode }}
                </el-form-item>
                <el-form-item label="仓库地址：" prop="vehicleWarehouseName">
                  {{ form.vehicleWarehouseName }}
                </el-form-item>
                <el-form-item label="省份：" prop="vehicleWarehouseCode">
                  {{ form.vehicleWarehouseCode }}
                </el-form-item>
                <el-form-item label="城市：" prop="vehicleWarehouseName">
                  {{ form.vehicleWarehouseName }}
                </el-form-item>
                <el-form-item label="区县：" prop="vehicleWarehouseName">
                  {{ form.vehicleWarehouseName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>整车信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form
                :inline="true"
                :model="form"
                :rules="rules"
                ref="ruleForm"
                label-width="150px"
                class="form-edit"
                v-show="isEditing || !_id"
              >
                <el-form-item label="VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="席位代码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆库存状态：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆交付状态：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库日期：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库日期：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form
                label-width="150px"
                :inline="true"
                class="form-detail"
                v-show="!(isEditing || !_id)"
              >
                <el-form-item label="VIN码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="席位代码：" prop="vehicleWarehouseCode">
                  {{ form.vehicleWarehouseCode }}
                </el-form-item>
                <el-form-item label="车辆库存状态：" prop="vehicleWarehouseName">
                  {{ form.vehicleWarehouseName }}
                </el-form-item>
                <el-form-item label="车辆交付状态：" prop="financialOrganizationId">
                  {{ form.financialOrganizationId }}
                </el-form-item>
                <el-form-item label="入库日期：" prop="needSyncWms">
                  {{ form.needSyncWms }}
                </el-form-item>
                <el-form-item label="出库日期：" prop="materialsId">
                  {{ form.materialsId }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>物料信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form
                :inline="true"
                :model="form"
                :rules="rules"
                ref="ruleForm"
                label-width="150px"
                class="form-edit"
                v-show="isEditing || !_id"
              >
                <el-form-item label="车系名称：" prop="seriesName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesName"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form
                label-width="150px"
                :inline="true"
                class="form-detail"
                v-show="!(isEditing || !_id)"
              >
                <el-form-item label="车系名称：" prop="seriesName">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="车型：" prop="certificatePledged">
                  {{ form.certificatePledged }}
                </el-form-item>
                <el-form-item label="物料描述：" prop="certificateShippingWay">
                  {{ form.certificateShippingWay }}
                </el-form-item>
                <el-form-item label="选配续航：" prop="orderCategory">
                  {{ form.orderCategory }}
                </el-form-item>
                <el-form-item label="选配动力：" prop="wholesaleWay">
                  {{ form.wholesaleWay }}
                </el-form-item>
                <el-form-item label="外饰风格：" prop="saleCompanyId">
                  {{ form.saleCompanyId }}
                </el-form-item>
                <el-form-item label="内饰风格：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="选配轮毂：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="选装包：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
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
import { getDetail, addOrUpdateItem } from '@/api/vehwholesale/shipping/vehicleShippingPlanDetail/index';
import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
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
  dataSource: '',
  shippingPlanDetailCode: '',
  shipped: '',
  vin: '',
  vehicleWarehouseCode: '',
  vehicleWarehouseName: '',
  financialOrganizationId: '',
  needSyncWms: '',
  materialsId: '',
  seriesId: '',
  seriesName: '',
  certificatePledged: '',
  certificateShippingWay: '',
  orderCategory: '',
  wholesaleWay: '',
  saleCompanyId: '',
  saleDealerCode: '',
  saleDealerName: '',
  wholesaleOrderCode: '',
  entVehicleOrderCode: '',
  deliveryWay: '',
  cooperateType: '',
  actualDeliveryWay: '',
  regionCode: '',
  regionName: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  address: '',
  fullAddress: '',
  longitude: '',
  latitude: '',
  pickupContactName: '',
  pickupContactMobile: '',
  cancelUserName: '',
  cancelUserId: '',
  cancelTime: '',
  cancelDesc: '',
  carrierRecordCode: '',
  entCustomerName: '',
  entCustomerCode: '',
};

export default {
  name: 'vehicleShippingPlanDetailEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
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
      return '发运计划明细：' + this.form.id;
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
      pageTitle: '发运计划明细',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-vehicleShippingPlanDetail',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: ''
      },
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
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
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
        shippingPlanDetailCode: [
          { required: true, message: '请输入发运计划明细编码', trigger: 'change' }
        ],
        shipped: [
          { required: true, message: '请输入是否发运', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        vehicleWarehouseCode: [
          { required: true, message: '请输入整车仓库编码', trigger: 'change' }
        ],
        vehicleWarehouseName: [
          { required: true, message: '请输入整车仓库名称', trigger: 'change' }
        ],
        financialOrganizationId: [
          { required: true, message: '请输入金融机构ID', trigger: 'change' }
        ],
        needSyncWms: [
          { required: true, message: '请输入是否需要同步WMS', trigger: 'change' }
        ],
        materialsId: [
          { required: true, message: '请输入物料ID', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请输入车系ID', trigger: 'change' }
        ],
        seriesName: [
          { required: true, message: '请输入车系名称', trigger: 'change' }
        ],
        certificatePledged: [
          { required: true, message: '请输入合格证是否质押', trigger: 'change' }
        ],
        certificateShippingWay: [
          { required: true, message: '请输入合格证发运方式', trigger: 'change' }
        ],
        orderCategory: [
          { required: true, message: '请输入订单分类', trigger: 'change' }
        ],
        wholesaleWay: [
          { required: true, message: '请输入批售方式', trigger: 'change' }
        ],
        saleCompanyId: [
          { required: true, message: '请输入销售公司', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        wholesaleOrderCode: [
          { required: true, message: '请输入批售订单号', trigger: 'change' }
        ],
        entVehicleOrderCode: [
          { required: true, message: '请输入企业整车订单号', trigger: 'change' }
        ],
        deliveryWay: [
          { required: true, message: '请输入指定发运方式', trigger: 'change' }
        ],
        cooperateType: [
          { required: true, message: '请选择合作类型', trigger: 'change' }
        ],
        actualDeliveryWay: [
          { required: true, message: '请输入指定发运方式,来源WMS接口【车辆出库状态同步】的发运方式', trigger: 'change' }
        ],
        regionCode: [
          { required: true, message: '请输入所属大区', trigger: 'change' }
        ],
        regionName: [
          { required: true, message: '请输入大区', trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: '请输入省code', trigger: 'change' }
        ],
        provinceName: [
          { required: true, message: '请输入省', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请输入市code', trigger: 'change' }
        ],
        cityName: [
          { required: true, message: '请输入市', trigger: 'change' }
        ],
        districtCode: [
          { required: true, message: '请输入区&#x2F;县编码', trigger: 'change' }
        ],
        districtName: [
          { required: true, message: '请输入区&#x2F;县名称', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入交车地址', trigger: 'change' }
        ],
        fullAddress: [
          { required: true, message: '请输入省市区+详细地址', trigger: 'change' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'change' }
        ],
        latitude: [
          { required: true, message: '请输入维度', trigger: 'change' }
        ],
        pickupContactName: [
          { required: true, message: '请输入接车联系人', trigger: 'change' }
        ],
        pickupContactMobile: [
          { required: true, message: '请输入接车联系电话', trigger: 'change' }
        ],
        cancelUserName: [
          { required: true, message: '请输入作废人', trigger: 'change' }
        ],
        cancelUserId: [
          { required: true, message: '请输入作废人', trigger: 'change' }
        ],
        cancelTime: [
          { required: true, message: '请选择作废时间', trigger: 'change' }
        ],
        cancelDesc: [
          { required: true, message: '请输入取消说明', trigger: 'change' }
        ],
        carrierRecordCode: [
          { required: true, message: '请输入承运记录编码', trigger: 'change' }
        ],
        entCustomerName: [
          { required: true, message: '请输入企业客户名称', trigger: 'change' }
        ],
        entCustomerCode: [
          { required: true, message: '请输入企业客户编码', trigger: 'change' }
        ]
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
      return addOrUpdateItem({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
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
