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
        :showEditBtn="form.auditStatus === 0 || form.auditStatus === 4"
      >
        <template #status>
          <!-- {{ form.entReplenishOrderCode }} -->
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <el-button v-if ="peraddDetail && form.buttonsControls && form.buttonsControls.editButton" size="small" @click="handleAddDetail" >添加补货明细</el-button>
          <el-button v-if ="perbatchSubmitAudit && form.buttonsControls && form.buttonsControls.submitAuditButton" @click="handleCheckSubmit" :loading="handleCheckSubmitLoading">提交审批</el-button>
          <el-button v-if ="perbatchAudit && form.buttonsControls && form.buttonsControls.auditButton"  size="small" @click="handleCheckStatus" >审核</el-button>
          <el-button v-if ="perbatchCancel && form.buttonsControls && form.buttonsControls.cancelButton"  size="small" @click="handleCancel" :loading="handleCancelLoading">作废</el-button>
          <el-button v-if ="canDelete && form.buttonsControls && form.buttonsControls.deleteButton" size="small"  @click="handleDelete" :loading="handleDeleteLoading">删除</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="basicFormRef" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="订单分类：" prop="orderCategory">
                  <fetch-select
                    :options="orderCategoryOptions"
                    v-model="form.orderCategory"
                    placeholder="请选择订单分类"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="验收方式：" prop="acceptanceMethod">
                   <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_acceptance_method"
                    v-model="form.acceptanceMethod"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="销售市场：" prop="salesMarket">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_sale_market_type"
                    v-model="form.salesMarket"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="form.orderCategory === '1' || form.orderCategory === '8' || form.orderCategory === 1 || form.orderCategory === 8"
                  />
                </el-form-item>
                <el-form-item label="目的地国家：" prop="destinationCountry">
                  <fetch-select
                    :remote-method="sysCountrySearch"
                    remote
                    v-model="form.destinationCountry"
                    placeholder="请选择"
                    labelKey="name"
                    valueKey="code"
                    clearable
                    filterable
                    @change="handleDestinationCountryChange"
                  />
                </el-form-item>
                <el-form-item label="企业客户名称：" prop="entCustomerName">
                  <fetch-select
                      :remote-method="listNetworkParentCompany"
                      remote
                      v-model="form.entCustomerName"
                      placeholder="请选择"
                      labelKey="companyName"
                      valueKey="companyCode"
                      clearable
                      collapseTags
                      filterable
                      @change="(val, row) => handleChange(val, row)"
                />
                </el-form-item>
                 <el-form-item label="销售公司：" prop="saleCompanyName">
                    <fetch-select
                      filterable
                      clearable
                      remote
                      v-model="form.saleCompanyName"
                      :params="form.saleCompanyName"
                      :remote-method="getCompanyList"
                      value-key="companyName"
                      label-key="companyName"
                      @change="getFundAccountBysaleCompany"
                    />
                </el-form-item>
                 <el-form-item label="销售门店：" prop="saleDealerName">
                   <fetch-select
                      :options="saleCompanyOptions"
                      v-model="form.saleDealerName"
                      placeholder="请选择"
                      labelKey="storeName"
                      valueKey="storeId"
                      clearable
                      filterable
                      @change="getOtherInfoBysaleCompany"
                    />
                </el-form-item>
                <el-form-item label="订单金额：">
                  <el-input-number
                    placeholder="请输入订单金额"
                    v-model="form.totalAmount"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="结算资金类型：" prop="settleFundTypeLabel">
                  <fetch-select
                   :options="settleFundTypeOptions"
                    v-model="form.settleFundTypeLabel"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="clearCache"
                  />
                </el-form-item>
                 <el-form-item label="金融机构：" prop="financialOrganizationId">
                  <fetch-select
                      :options="financialOrganizationOptions"
                      labelKey="organizationName"
                      valueKey="id"
                      v-model="form.financialOrganizationId"
                      placeholder="请选择"
                      clearable
                      filterable
                      :disabled="form.settleFundType !== 2010 && form.settleFundType !== '2010'"
                    />
                </el-form-item>
                <el-form-item label="是否赊销：" prop="creditSaleFlag">
                  <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.creditSaleFlag"
                      placeholder="请选择"
                      clearable
                      filterable
                      disabled
                    />
                </el-form-item>
                <el-form-item label="订单时间：" prop="orderTime">
                  <el-date-picker
                      type="datetime"
                      v-model="form.orderTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      clearable
                      disabled
                    />
                </el-form-item>
                 <el-form-item label="销售人员：" prop="saleUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleUserName"
                    maxlength="15"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="订单备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    maxlength="150"
                    clearable
                  />
                </el-form-item>
                 <!-- <el-form-item label="创建时间：" prop="createTime">
                   <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    type="datetime"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item> -->
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                 <el-form-item label="订单分类：" prop="orderCategoryLabel">
                  {{ form.orderCategoryLabel }}
                </el-form-item>
                <el-form-item label="验收方式：" prop="acceptanceMethodLabel">
                  {{ form.acceptanceMethodLabel }}
                </el-form-item>
                <el-form-item label="销售市场：" prop="salesMarketLabel">
                  {{ form.salesMarketLabel }}
                </el-form-item>
                <el-form-item label="目的地国家：" prop="destinationCountryName">
                  {{ form.destinationCountryName }}
                </el-form-item>
                <el-form-item label="企业客户名称：" prop="entCustomerName">
                  <!-- <el-link type="primary" :href="`/service/datacenter/store/parentCompany/detail?companyCode=${form.entCustomerCode}`" target="_blank">{{ form.entCustomerName }}</el-link> -->
                  {{ form.entCustomerName }}
                </el-form-item>
                <el-form-item label="销售公司：" prop="saleCompanyName">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/fundSaleCompany/edit?id=${form.saleCompanyId}`" target="_blank">{{ form.saleCompanyName }}</el-link>
                </el-form-item>
                 <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="订单金额：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundTypeLabel">
                  {{ form.settleFundTypeLabel }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationName">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=${form.financialOrganizationId}`" target="_blank">{{ form.financialOrganizationName }}</el-link>
                </el-form-item>
                <el-form-item label="是否赊销：" prop="creditSaleFlagLabel">
                  {{ form.creditSaleFlagLabel }}
                </el-form-item>
                  <el-form-item label="订单时间：" prop="orderTime">
                  {{ form.orderTime }}
                </el-form-item>
                  <el-form-item label="销售人员：" prop="saleUserName">
                  {{ form.saleUserName }}
                </el-form-item>
                 <el-form-item label="订单备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                 <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
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
              <el-form :inline="true" :model="form" :rules="rules" ref="addressFormRef" label-width="150px" class="form-edit" v-show="isEditing || !_id">
               <el-form-item label="接车联系人：" prop="pickupContactName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pickupContactName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="接车人电话：" prop="pickupContactMobile">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pickupContactMobile"
                    clearable
                  />
                </el-form-item>

                <el-form-item label="省市区：">
                  <el-cascader
                    placeholder="请选择省市区"
                    v-model="areaCode"
                    :props="orgProps"
                    :options="areaOptions"
                    filterable
                    @change="handleChangeArea"
                    clearable>
                  </el-cascader>
                </el-form-item>
                <el-form-item label="交车地址：" prop="address">
                  <el-input
                    placeholder="请输入"
                    v-model="form.address"
                    clearable
                    maxlength="300"
                    @blur="onAddressBlur"
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                 <el-form-item label="接车联系人：" prop="pickupContactName">
                  {{ form.pickupContactName }}
                </el-form-item>
                <el-form-item label="接车联系电话：" prop="pickupContactMobile">
                  {{ form.pickupContactMobile }}
                </el-form-item>
                <el-form-item label="省份：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="城市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="区/县：" prop="districtName">
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
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                 <el-form-item label="审核状态：" prop="auditStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_ent_vehicle_replenish_order_audit_status"
                    v-model="form.auditStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="审核人：" prop="auditorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditorName"
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
                <el-form-item label="审核意见：" prop="auditOpinion">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditOpinion"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                 <el-form-item label="审核状态：" prop="auditStatusLabel">
                  {{ form.auditStatusLabel }}
                </el-form-item>
                <el-form-item label="审核人：" prop="auditorName">
                  {{ form.auditorName }}
                </el-form-item>
                <el-form-item label="审核时间：" prop="auditTime">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="审核意见：" prop="auditOpinion">
                  {{ form.auditOpinion }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="_id">
            <div class="common-section-header">
              <h2>企业客户补货订单明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                 <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :show-pagination="false"
                  :enable-single-row-save="true"
                  :options="options"
                  :current="pageNum"
                  :pageSize="pageSize"
                  :total="total"
                  @save-row-edit="saveRowEdit"
                  @remove-row="handleRemoveRow"
                  @page-size-change="pageSizeChange"
                  @current-page-change="currentPageChange"
                  :auth="{edit: isEditing, delete: isEditing}"
                >
                  <template #default="{ row, column }">
                    <template v-if="column.property === 'materialsCode' && row.materialsId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${row.materialsId}`" target="_blank">
                        {{ row.materialsCode }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'modelName' && row.modelId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleModel/edit?id=${row.modelId}`" target="_blank">
                        {{ row.modelName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'drivingRangeName' && row.drivingRangeId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleDrivingRange/edit?id=${row.drivingRangeId}`" target="_blank">
                        {{ row.drivingRangeName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'rangePowerName' && row.rangePowerId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleRangePower/edit?id=${row.rangePowerId}`" target="_blank">
                        {{ row.rangePowerName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'exteriorName' && row.exteriorId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleExterior/edit?id=${row.exteriorId}`" target="_blank">
                        {{ row.exteriorName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'interiorName' && row.interiorId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleInterior/edit?id=${row.interiorId}`" target="_blank">
                        {{ row.interiorName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'wheelHubName' && row.wheelHubId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleWheelHub/edit?id=${row.wheelHubId}`" target="_blank">
                        {{ row.wheelHubName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'batteryCellName' && row.batteryCellId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleBatteryCell/edit?id=${row.batteryCellId}`" target="_blank">
                        {{ row.batteryCellName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'yearTypeName' && row.yearTypeId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleYearType/edit?id=${row.yearTypeId}`" target="_blank">
                        {{ row.yearTypeName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'roofName' && row.roofId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleRoof/edit?id=${row.roofId}`" target="_blank">
                        {{ row.roofName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'optionPackageName' && row.optionPackageId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleOptionPackage/edit?id=${row.optionPackageId}`" target="_blank">
                        {{ row.optionPackageName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'vehicleAttribute'">
                      {{ row.vehicleAttributeLabel || getVehicleAttributeLabel(row.vehicleAttribute) }}
                    </template>
                    <template v-else>
                      {{ row[column.property] }}
                    </template>
                  </template>
                </edit-table>
              </div>
              </div>
            </div>
          </section>
          <section class="common-section" v-show="_id">
            <div class="common-section-header">
              <h2>附件上传信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <!-- 附件上传组件 -->
                <AisAttachment
                  :businessId="_id"
                  configCode="ent_vehicle_replenish_order"
                  ref="attachment"
                  :readonly="!isEditing"
                />
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
      <Upload :visible="uploadDialogVisible" templateUrl="" uploadUrl="" @close="handleUploadDialogClose" />
      <AddEntVehicleReplishOrderDetail  :visible.sync="showAddDetailDialog" ref="addEntVehicleReplishOrderDialog"
          :order-ids="[_id]"
          :orderInfo="form"
          @addConfirm="addConfirm">
      </AddEntVehicleReplishOrderDetail>
        <audit-dialog
          ref="auditRef"
          @audit="handleBatchAudit"
          :maxlength='150'
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
import { getDetail, addOrUpdate, listDealersForParentCompany, addOrUpdateDetail, batchCancel, batchSubmitAudit, batchAudit, deleteItem, getGeoLocationByFullAddress, detailDelete } from '@/api/vehwholesale/replenish/entVehicleReplenishOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, cityListByName, getProvinceTree, getParentCompany, sysCountryList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getAreaTree } from '@/utils';
import AddEntVehicleReplishOrderDetail from './addEntVehicleReplishOrderDetail.vue';
import { getList as fundGetList } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import auditDialog from '@/libs/components/auditDialog';
import Upload from '@/libs/components/UploadDialog';
import { getList as companyList } from '@/api/vehwholesale/fund/fundSaleCompany/index';
import AisAttachment from '@/libs/components/AisAttachment';
import EditTable from '@/libs/components/EditTable';
import { getList as accountList } from '@/api/vehwholesale/fund/account/index';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  settleFundTypeLabel: '',
  creatorName: '',
  createTime: new Date(),
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  entReplenishOrderCode: '',
  entCustomerCode: '',
  entCustomerName: '',
  orderCategory: '',
  acceptanceMethod: '',
  salesMarket: '',
  destinationCountry: '',
  destinationCountryName: '',
  creditSaleFlag: 0,
  totalAmount: '',
  settleFundType: '',
  financialOrganizationId: '',
  financialOrganizationName: '',
  orderTime: new Date(),
  saleDealerCode: '',
  saleDealerName: '',
  saleUserName: '',
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
  auditorName: '',
  auditorUserId: '',
  auditTime: '',
  auditOpinion: '',
  auditStatus: 0,
  saleCompanyId: '',
};

export default {
  name: 'entVehicleReplenishOrderEdit',
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
    AddEntVehicleReplishOrderDetail,
    auditDialog,
    Upload,
    AisAttachment,
    EditTable
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '企业客户补货订单：' + this.form.entReplenishOrderCode;
    },
    columns () {
      const isEdit = this.isEditing;
      const isBigCustomerDirect = this.form.orderCategory === 1 || this.form.orderCategory === '1';
      return [
        {
          field: 'qty',
          title: '数量',
          editable: isEdit, // 动态绑定编辑状态
          width: '80',
          editRender: {
            name: 'ElInput',
            props: {
              type: 'number'
            }
          }
        },
        {
          field: 'standardPrice',
          title: '标准价格',
          width: '100',
        },
        {
          field: 'salesPrice',
          title: '销售价格',
          editable: isEdit, // 动态绑定编辑状态
          width: '150',
          editRender: {
            name: 'ElInput',
            props: {
              type: 'number'
            }
          },
          cellEditChange: ({ row }) => {
            // 销售价格修改后，自动赋值给标准价格
            if (this.orderCategory === 21 || this.orderCategory === '21') {
              row.standardPrice = row.salesPrice;
            }
          }
        },
        {
          field: 'relatedTxnExTaxPrice',
          title: '关联交易不含税价',
          width: '150',
        },
        {
          field: 'vehicleAttribute',
          title: '车辆属性',
          width: '120',
          editable: isEdit && isBigCustomerDirect,
          editRender: {
            name: 'ElSelect',
            props: {
              options: this.vehicleAttributeOptions,
              placeholder: '请选择'
            }
          }
        },
        {
          field: 'materialsCode',
          title: '整车物料编码',
          width: '150',
          // formatter: (cellValue, row) => {
          //   if (!row || !row.materialsId) return cellValue || '';
          //   const url = '/sales/datacenter/materials/vehicleMaterials/edit?id=' + row.materialsId;
          //   return '<a class="link" style="color: #009100;" href="javascript:void(0);" onclick="window.open(\'' + url + '\', \'_blank\')">' + (row.materialsCode || '') + '</a>';
          // }
        },
        {
          field: 'materialsDesc',
          title: '物料描述',
          width: '100',
        },
        {
          field: 'modelName',
          title: '车型',
          width: '100',
          // formatter: (cellValue, row) => {
          //   if (!row || !row.modelId) return cellValue || '';
          //   const url = '/sales/datacenter/materials/vehicleModel/edit?id=' + row.modelId;
          //   return '<a class="link" style="color: #009100;" href="javascript:void(0);" onclick="window.open(\'' + url + '\', \'_blank\')">' + (row.modelName || '') + '</a>';
          // }
        },
        {
          field: 'drivingRangeName',
          title: '选配续航',
          width: '100',
          // formatter: (cellValue, row) => {
          //   if (!row || !row.drivingRangeId) return cellValue || '';
          //   const url = '/sales/datacenter/materials/vehicleDrivingRange/edit?id=' + row.drivingRangeId;
          //   return '<a class="link" style="color: #009100;" href="javascript:void(0);" onclick="window.open(\'' + url + '\', \'_blank\')">' + (row.drivingRangeName || '') + '</a>';
          // }
        },
        {
          field: 'rangePowerName',
          title: '选配动力',
          width: '100',
          // formatter: (cellValue, row) => {
          //   if (!row || !row.rangePowerId) return cellValue || '';
          //   const url = '/sales/datacenter/materials/vehicleRangePower/edit?id=' + row.rangePowerId;
          //   return '<a class="link" style="color: #009100;" href="javascript:void(0);" onclick="window.open(\'' + url + '\', \'_blank\')">' + (row.rangePowerName || '') + '</a>';
          // }
        },
        {
          field: 'exteriorName',
          title: '外饰风格',
          width: '100',
          // formatter: (cellValue, row) => {
          //   if (!row || !row.exteriorId) return cellValue || '';
          //   const url = '/sales/datacenter/materials/vehicleExterior/edit?id=' + row.exteriorId;
          //   return '<a class="link" style="color: #009100;" href="javascript:void(0);" onclick="window.open(\'' + url + '\', \'_blank\')">' + (row.exteriorName || '') + '</a>';
          // }
        },
        {
          field: 'interiorName',
          title: '内饰',
          width: '100',
          // formatter: (cellValue, row) => {
          //   if (!row || !row.interiorId) return cellValue || '';
          //   const url = '/sales/datacenter/materials/vehicleInterior/edit?id=' + row.interiorId;
          //   return '<a class="link" style="color: #009100;" href="javascript:void(0);" onclick="window.open(\'' + url + '\', \'_blank\')">' + (row.interiorName || '') + '</a>';
          // }
        },
        {
          field: 'wheelHubName',
          title: '选配轮毂',
          width: '100',
          // formatter: (cellValue, row) => {
          //   if (!row || !row.wheelHubId) return cellValue || '';
          //   const url = '/sales/datacenter/materials/vehicleWheelHub/edit?id=' + row.wheelHubId;
          //   return '<a class="link" style="color: #009100;" href="javascript:void(0);" onclick="window.open(\'' + url + '\', \'_blank\')">' + (row.wheelHubName || '') + '</a>';
          // }
        },
        {
          field: 'batteryCellName',
          title: '电池电芯',
          width: '100',
          // formatter: (cellValue, row) => {
          //   if (!row || !row.batteryCellId) return cellValue || '';
          //   const url = '/sales/datacenter/materials/vehicleBatteryCell/edit?id=' + row.batteryCellId;
          //   return '<a class="link" style="color: #009100;" href="javascript:void(0);" onclick="window.open(\'' + url + '\', \'_blank\')">' + (row.batteryCellName || '') + '</a>';
          // }
        },
        {
          field: 'yearTypeName',
          title: '年款',
          width: '100',
          // formatter: (cellValue, row) => {
          //   if (!row || !row.yearTypeId) return cellValue || '';
          //   const url = '/sales/datacenter/materials/vehicleYearType/edit?id=' + row.yearTypeId;
          //   return '<a class="link" style="color: #009100;" href="javascript:void(0);" onclick="window.open(\'' + url + '\', \'_blank\')">' + (row.yearTypeName || '') + '</a>';
          // }
        },
        {
          field: 'roofName',
          title: '车顶风格',
          width: '100',
          // formatter: (cellValue, row) => {
          //   if (!row || !row.roofId) return cellValue || '';
          //   const url = '/sales/datacenter/materials/vehicleRoof/edit?id=' + row.roofId;
          //   return '<a class="link" style="color: #009100;" href="javascript:void(0);" onclick="window.open(\'' + url + '\', \'_blank\')">' + (row.roofName || '') + '</a>';
          // }
        },
        {
          field: 'optionPackageName',
          title: '选装包',
          width: '80',
          // formatter: (cellValue, row) => {
          //   if (!row || !row.optionPackageId) return cellValue || '';
          //   const url = '/sales/datacenter/materials/vehicleOptionPackage/edit?id=' + row.optionPackageId;
          //   return '<a class="link" style="color: #009100;" href="javascript:void(0);" onclick="window.open(\'' + url + '\', \'_blank\')">' + (row.optionPackageName || '') + '</a>';
          // }
        }
      ];
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
    // 'form.address': {
    //   handler (newVal) {
    //     // 大客户且地址有值时，防抖调用地址解析
    //     if (newVal) {
    //       this.handleParseAddress(newVal);
    //     }
    //   },
    //   deep: true
    // },
    'form.settleFundType': {
      handler (val) {
        if (val === '2010' || val === 2010) {
          this.$set(this.rules, 'financialOrganizationId', [
            { required: true, message: '请选择金融机构', trigger: 'change' }
          ]);
          this.form.creditSaleFlag = 0;
        } else if (val === '1050' || val === 1050) {
          this.$set(this.rules, 'financialOrganizationId', []);
          this.form.creditSaleFlag = 1;
        } else if (val === '1010' || val === 1010) {
          this.form.creditSaleFlag = 0;
          this.$set(this.rules, 'financialOrganizationId', []);
        }
      },
      immediate: true
    },
    isEditing: {
      handler (newVal, oldVal) {
        // console.log('编辑状态变更:', oldVal, '->', newVal, this.defaultNewRow);
        // if (newVal) {
        //   this.defaultNewRow = { value: 1 };
        // } else {
        //   this.defaultNewRow = {};
        // }
      },
      immediate: false // 通常不需要立即执行，因为初始化时 isEditing 可能尚未稳定
    },
  },
  data () {
    const form = this.getDefautlForm();
    const routeOrderCategory = this.$route.query.orderCategory ? (this.$route.query.orderCategory) : '';
    form.orderCategory = routeOrderCategory;
    return {
      pageTitle: '企业客户补货订单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVW-entVehicleReplenishOrder',
      loading: false,
      pageNum: 1,
      pageSize: 20,
      total: 0,
      submitLoading: false,
      showAddDetailDialog: false,
      uploadDialogVisible: false,
      companyCustomerTypeName: '',
      yes_no_enum: YES_NO_ENUM,
      areaCode: [],
      orderCategoryOptions: [],
      vehicleAttributeOptions: [],
      settleFundTypeOptions: [],
      defaultNewRow: { },
      districtOptions: [],
      cityOptions: [],
      saleCompanyOptions: [],
      financialOrganizationOptions: [],
      form: { ...form },
      originalForm: { ...form },
      orgProps: {
        checkStrictly: true,
        emitPath: true,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      // 权限控制
      peraddDetail: false,
      perbatchSubmitAudit: false,
      perbatchAudit: false,
      perbatchCancel: false,
      handleCheckSubmitLoading: false,
      handleCancelLoading: false,
      handleDeleteLoading: false,
      areaOptions: getAreaTree(),
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      options: {
      },
      rules: {
        orderCategory: [
          { required: true, message: '请输入订单分类', trigger: 'change' }
        ],
        entCustomerName: [
          { required: true, message: '请输入企业客户名称', trigger: 'change' }
        ],
        saleCompanyName: [
          { required: true, message: '请输入销售公司', trigger: 'change' }
        ],
        creditSaleFlag: [
          { required: true, message: '请输入是否赊销', trigger: 'change' }
        ],
        settleFundTypeLabel: [
          { required: true, message: '请选择结算资金类型', trigger: 'change' }
        ],
        orderTime: [
          { required: true, message: '请选择订单时间', trigger: 'change' }
        ],
        pickupContactName: [
          { required: true, message: '请选择接车联系人', trigger: 'change' }
        ],
        pickupContactMobile: [
          { required: true, message: '请选择接车人电话', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请选择交车地址', trigger: 'change' }
        ],
        financialOrganizationId: []
      }
    };
  },
  mounted () {
    this.fetchOrderCategoryOptions();
    this.listNetworkParentCompany();
    this.getCompanyList();
    this.fetchVehicleAttributeOptions();
  },
  created () {
    this.initPermissions();
  },
  methods: {
    initPermissions () {
      this.peraddDetail = this.permissions.has(`${this.moduleKey}-addDetail`);
      this.perbatchSubmitAudit = this.permissions.has(`${this.moduleKey}-batchSubmitAudit`);
      this.perbatchAudit = this.permissions.has(`${this.moduleKey}-batchAudit`);
      this.perbatchCancel = this.permissions.has(`${this.moduleKey}-batchCancel`);
    },
    onAddressBlur () {
      // 地址失焦处理逻辑
      this.handleParseAddress(this.form.address);
    },
    openWindow (url) {
      window.open(url, '_blank');
    },
    getFundAccountBysaleCompany (val, row) {
      this.form.saleCompanyId = row.id;
      this.settleFundTypeOptions = [];
      this.form.settleFundType = '';
      this.form.settleFundTypeLabel = '';
      this.settleFundTypeOptions = [];
      this.financialOrganizationOptions = [];
      this.getFundAccount();
    },
    getFundAccount () {
      // if (!this.form.entCustomerName || !this.form.saleCompanyName) {
      //   return;
      // }
      const params = {
        dealerCompanyCodes: [this.form.entCustomerCode],
        allowEntOrderSettle: '1',
        saleCompanyIds: [this.form.saleCompanyId]
      };
      accountList(params).then((res) => {
        console.log('getFundAccount11111', res);
        if (res && res.records) {
          // 【新增】使用 Map 进行去重，key 为 fundType
          const uniqueMap = new Map();
          res.records.forEach(item => {
            // 只有当 Map 中不存在该 fundType 时才添加，确保保留第一条记录, 排除返利
            if (!uniqueMap.has(item.fundType) && item.fundType !== 1020) {
              uniqueMap.set(item.fundType, {
                code: item.fundType,
                message: item.fundTypeLabel
              });
            }
          });
          // 将 Map 的值转换为数组并赋值
          this.settleFundTypeOptions = Array.from(uniqueMap.values());
          console.log('this.settleFundTypeOptions', this.settleFundTypeOptions);

          // 筛选金融机构选项：fundType === 2010 且 validIfCreditSaleAccount === true
          this.financialOrganizationOptions = res.records
            .filter(item => item.fundType === 2010 && item.validIfCreditSaleAccount === true)
            .map(item => ({
              id: item.financialOrganizationId,
              organizationName: item.financialOrganizationName
            }));
        }
      }).catch(() => {
      });
    },
    formatDateTime (date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    clearCache (val, row) {
      this.form.settleFundType = row.code;
      this.form.settleFundTypeLabel = row.message;
      this.form.financialOrganizationId = '';
      this.form.financialOrganizationName = '';
      if (val === 1050) {
        this.form.creditSaleFlag = 1;
      } else {
        this.form.creditSaleFlag = 0;
      }
      console.log('clearCache', val, row);
    },
    handleChangeArea (val, row) {
      // 匹配查找对应的省市区名称和编号
      const province = this.areaOptions.find(item => item.code === val[0]);
      if (province) {
        this.form.provinceCode = province.code;
        this.form.provinceName = province.name;

        // 匹配城市
        const cityList = province.child || [];
        const city = cityList.find(item => item.code === val[1]);
        if (city) {
          this.form.cityCode = city.code;
          this.form.cityName = city.name;

          // 匹配区县
          const districtList = city.child || [];
          const district = districtList.find(item => item.code === val[2]);
          if (district) {
            this.form.districtCode = district.code;
            this.form.districtName = district.name;
          }
        }
      }
    },
    currentPageChange (pageNum) {
      this.pageNum = pageNum;
      this.detailRequest();
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.detailRequest();
    },
    handleRemoveRow (row, index, defer) {
      if (!row.id) {
        return;
      }
      detailDelete([row.id]).then((d) => {
        defer.resolve();
        this.$message.success('删除成功');
      }).catch(() => {
        defer.reject();
      });
    },
    saveRowEdit (row, defer) {
      // 折扣校验：销售价格 / 标准价格
      const salesPrice = parseFloat(row.salesPrice);
      const standardPrice = parseFloat(row.standardPrice);

      // 检查是否为有效数字，避免 NaN、Infinity 等异常
      const isSalesPriceValid = !isNaN(salesPrice) && isFinite(salesPrice) && salesPrice > 0;
      const isStandardPriceValid = !isNaN(standardPrice) && isFinite(standardPrice) && standardPrice > 0;

      if (isStandardPriceValid && isSalesPriceValid) {
        const discount = salesPrice / standardPrice;
        // 检查折扣是否为有效数字，避免溢出等异常
        if (isFinite(discount) && (discount < 0.85 || discount > 1)) {
          this.$confirm(
            '销售价格不在常规折扣0.85到1的范围内，是否继续录入',
            '提示',
            {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning'
            }
          ).then(() => {
            // 用户选择【是】，继续保存
            this.doSaveRowEdit(row, defer);
          }).catch(() => {
            // 用户选择【否】，取消保存
            defer.reject();
          });
          return;
        }
      }

      // 折扣在允许范围内，或价格无效时直接保存
      this.doSaveRowEdit(row, defer);
    },
    doSaveRowEdit (row, defer) {
      addOrUpdateDetail(row).then(id => {
        defer.resolve(id);
        this.$message.success('添加成功');
        this.$refs.containerRef.loadDetail();
        this.$emit('replace');
      }).catch(e => {
        defer.reject();
      });
    },
    // 地址解析
    handleParseAddress (val) {
      let params = {
        cityName: this.form.cityName,
        districtName: this.form.districtName,
        provinceName: this.form.provinceName,
        address: val
      };
      return getGeoLocationByFullAddress(params).then((res) => {
        if (!res) {
          console.warn('地址解析返回数据为空');
          return;
        }
        // 安全赋值经纬度
        this.form.longitude = res.longitude || '';
        this.form.latitude = res.latitude || '';
      });
    },
    getCompanyList (query) {
      return companyList({ companyNameLike: query, status: 1 });
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleUpload () {
      this.uploadDialogVisible = true;
    },
    handleBatchAudit (data) {
      let params = {
        ids: [this._id],
        audit: data.result,
        auditOpinion: data.remark
      };
      return batchAudit(params).then(() => {
        if (params.audit === 1) {
          this.$message({
            type: 'success',
            message: '审批成功'
          });
        } else if (params.audit === 0) {
          this.$message({
            type: 'success',
            message: '驳回成功'
          });
        }
        this.detailRequest();
      });
    },
    handleCheckStatus () {
      this.$refs.auditRef.auditForm.result = 1;
      this.$refs.auditRef.show();
    },
    handleCheckSubmit () {
      if (this.tableData.length === 0) {
        this.$message.error('请添加明细后提交');
        return;
      }
      this.$confirm('确认是否对数据进行提交审批?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleCheckSubmitLoading = true;
        batchSubmitAudit({
          idSet: [this._id],
        }).then(res => {
          this.$message.success('提交成功');
          if (this.$refs.containerRef) {
            this.$refs.containerRef.loadDetail();
          }
          this.detailRequest();
          this.isEditing = false;
        }).finally(() => {
          this.handleCheckSubmitLoading = false;
        });
      }).catch(() => {});
    },

    handleCancel () {
      this.$confirm('确认是否对数据进行作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleCancelLoading = true;
        batchCancel({
          idSet: [this._id],
        }).then(() => {
          this.$message.success('作废成功');
          this.$refs.containerRef.loadDetail();
        }).finally(() => {
          this.handleCancelLoading = false;
        });
      }).catch(() => {});
    },

    handleDelete () {
      const ids = [this._id];
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">此操作将永久删除, 是否继续</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        this.handleDeleteLoading = true;
        deleteItem(ids).then(() => {
          this.$router.push({
            path: '/vehwholesale/replenish/entVehicleReplenishOrder',
          });
        }).finally(() => {
          this.handleDeleteLoading = false;
        });
      }).catch(() => {});
    },
    getDistrictName (val, row) {
      this.form.districtName = row.name;
      this.form.districtCode = row.code;
    },
    handleChangeDistrict (val, selectedOption) {
      if (val) {
        this.form.cityName = selectedOption?.name;
        this.form.cityCode = selectedOption?.code;
        this.districtOptions = selectedOption?.child || [];
      }
    },
    // 选择省以后带出市信息
    handleChangeProvince (val, selectedOption) {
      if (val) {
        this.form.provinceCode = selectedOption?.code || '';
        this.form.provinceName = selectedOption?.name;
        this.cityOptions = selectedOption?.child || []; // 选择省以后带出市信息
      }
    },
    async getCityList (params) {
      return cityListByName({ cityName: params });
    },
    // 查询所有省市区
    async getProvince (params) {
      const res = await getProvinceTree();
      let list = res || [];
      if (params && params.trim()) {
        const searchText = params.trim().toLowerCase();
        list = list.filter(item => item.name && item.name.toLowerCase().includes(searchText));
      }
      return list;
    },
    async listNetworkParentCompany (query) {
      return getParentCompany({ parentCompanyName: query, pageNum: 1, pageSize: 20 });
    },
    async sysCountrySearch (query) {
      const res = await sysCountryList({ fullNameLike: query });
      return res;
    },
    handleDestinationCountryChange (val, row) {
      if (row && row.name) {
        this.form.destinationCountryName = row.name;
      } else {
        this.form.destinationCountryName = '';
      }
    },
    getOtherInfoBysaleCompany (val, row) {
      // 安全赋值门店信息
      this.form.saleDealerName = row.storeName || '';
      this.form.saleDealerCode = row.storeCode || '';
      const warehouseResp = row.storeWarehouseResp;
      if (!warehouseResp) {
        return;
      }
      const addressXy = warehouseResp.warehouseAddressXy || '';
      const xyArray = addressXy.split(',');
      // 安全赋值经纬度
      this.form.latitude = xyArray[0] || '';
      this.form.longitude = xyArray[1] || '';
      // 安全赋值省市区代码
      this.form.provinceCode = warehouseResp.provinceCode || '';
      this.form.cityCode = warehouseResp.cityCode || '';
      this.form.districtCode = warehouseResp.countyCode || '';
      // 安全赋值地址信息
      this.form.address = warehouseResp.warehouseDetailAddress || '';
      // 安全赋值联系人信息
      this.form.pickupContactName = warehouseResp.contacts || '';
      this.form.pickupContactMobile = warehouseResp.contactPhone || '';
      this.areaCode = [warehouseResp.provinceCode, warehouseResp.cityCode, warehouseResp.countyCode];
      const province = this.areaOptions.find(item => item.code === this.areaCode[0]);
      if (province) {
        this.form.provinceCode = province.code;
        this.form.provinceName = province.name;

        // 匹配城市
        const cityList = province.child || [];
        const city = cityList.find(item => item.code === this.areaCode[1]);
        if (city) {
          this.form.cityCode = city.code;
          this.form.cityName = city.name;

          // 匹配区县
          const districtList = city.child || [];
          const district = districtList.find(item => item.code === this.areaCode[2]);
          if (district) {
            this.form.districtCode = district.code;
            this.form.districtName = district.name;
          }
        }
      }
    },
    getDealersForParentCompany (val) {
      console.log('getDealersForParentCompany1111111');
      listDealersForParentCompany({ companyCode: val }).then(res => {
        this.saleCompanyOptions = res;
      });
    },
    handleChange (val, row) {
      this.form.entCustomerName = row.companyName;
      this.form.entCustomerCode = row.companyCode;
      this.companyCustomerTypeName = row.companyCustomerTypeName;
      this.form.saleDealerName = '';
      this.form.pickupContactName = '';
      this.form.pickupContactMobile = '';
      this.areaCode = [];
      this.form.address = '';
      this.form.latitude = '';
      this.form.longitude = '';
      this.getDealersForParentCompany(val);
      this.form.settleFundType = '';
      this.form.settleFundTypeLabel = '';
      this.settleFundTypeOptions = [];
      this.financialOrganizationOptions = [];
      this.getFundAccount();
    },
    async repairItemSearch (query) {
      return fundGetList({ organizationNameLike: query, status: 1 });
    },
    async fetchOrderCategoryOptions () {
      const response = await getEnum('vw_eordertype');
      this.orderCategoryOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['1', '8', '21'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    async fetchVehicleAttributeOptions () {
      const response = await getEnum('vw_vehicle_attribute');
      this.vehicleAttributeOptions = (response || []).map(item => ({
        ...item,
        value: String(item.code),
        label: item.message
      }));
    },
    getVehicleAttributeLabel (code) {
      if (code === '' || code === null || code === undefined) return '';
      const item = this.vehicleAttributeOptions.find(o => o.value === String(code));
      return item ? item.label : code;
    },
    handleAddDetail () {
      this.showAddDetailDialog = true;
    },
    addConfirm (data) {
      data.entReplenishOrderId = this.form.id;
      addOrUpdateDetail(data).then(() => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        });
        this.$refs.addEntVehicleReplishOrderDialog.handleCancel();
        this.detailRequest();
      });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          this.getDealersForParentCompany(res.entCustomerCode);
          this.form = { ...this.form, ...res };
          this.getFundAccount();
          // 设置 areaCode 并匹配省市区名称
          if (res.provinceCode && res.cityCode) {
            this.areaCode = [
              res.provinceCode,
              res.cityCode,
              res.districtCode
            ];
          }
          res.detailList = res.detailList.map(detail => ({
            ...detail,
            vehicleAttribute: detail.vehicleAttribute !== null && detail.vehicleAttribute !== undefined ? String(detail.vehicleAttribute) : '',
            materialsId: detail.vehicleMaterials?.id,
            materialsCode: detail.vehicleMaterials?.materialsCode || '',
            materialsDesc: detail.vehicleMaterials.materialsDesc || '',
            modelId: detail.vehicleMaterials?.modelId,
            modelName: detail.vehicleMaterials.modelName || '',
            seriesId: detail.vehicleMaterials?.seriesId,
            drivingRangeId: detail.vehicleMaterials?.drivingRangeId,
            drivingRangeName: detail.vehicleMaterials.drivingRangeName || '',
            rangePowerId: detail.vehicleMaterials?.rangePowerId,
            rangePowerName: detail.vehicleMaterials.rangePowerName || '',
            exteriorId: detail.vehicleMaterials?.exteriorId,
            exteriorName: detail.vehicleMaterials.exteriorName || '',
            interiorId: detail.vehicleMaterials?.interiorId,
            interiorName: detail.vehicleMaterials.interiorName || '',
            wheelHubId: detail.vehicleMaterials?.wheelHubId,
            wheelHubName: detail.vehicleMaterials.wheelHubName || '',
            batteryCellId: detail.vehicleMaterials?.batteryCellId,
            batteryCellName: detail.vehicleMaterials.batteryCellName || '',
            yearTypeId: detail.vehicleMaterials?.yearTypeId,
            yearTypeName: detail.vehicleMaterials.yearTypeName || '',
            roofId: detail.vehicleMaterials?.roofId,
            roofName: detail.vehicleMaterials.roofName || '',
            optionPackageId: detail.vehicleMaterials?.optionPackageId,
            optionPackageName: detail.vehicleMaterials.optionPackageName || '',
          }));
          this.tableData = res.detailList;
          return res;
        });
      }
    },
    submitRequest () {
      // 校验两个 form
      const basicValidate = this.$refs.basicFormRef.validate();
      const addressValidate = this.$refs.addressFormRef.validate();
      return Promise.all([basicValidate, addressValidate]).then(() => {
        if (!this.areaCode || this.areaCode.length === 0) {
          this.form.provinceCode = '';
          this.form.provinceName = '';
          this.form.cityCode = '';
          this.form.cityName = '';
          this.form.districtCode = '';
          this.form.districtName = '';
        }
        return addOrUpdate({ ...this.form });
      }).catch(() => {
        return Promise.reject(new Error('表单校验失败'));
      });
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
        ...defaultForm,
        orderTime: this.formatDateTime(new Date())
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
