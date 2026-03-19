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
          <el-button v-if="canSubmit && form.status === 0" size="small" @click="handleSubmit">提交</el-button>
          <el-button v-if="canCancel && form.status === 0" size="small" @click="handleCancel">作废</el-button>
          <el-button v-if="canRevoke && form.status === 1" size="small" @click="handleRevoke">撤回</el-button>
          <el-button v-if="canAdjustVehicleAttribute && form.status === 1" size="small" @click="handleAdjustVehicleAttribute">调整车辆属性</el-button>
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
                <el-form-item label="终端状态 0-草稿 1-已提交 20-作废：" prop="status">
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
                <el-form-item label="特殊车辆销售提报编号：" prop="specialReportCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.specialReportCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
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
                <el-form-item label="车辆属性 1-家用 2-营运 4-B级车 10-J级车 20-J1级车 30-专车 60-报废灭失：" prop="vehicleAttribute">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleAttribute"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆用途 10-私家车 20-公户车 30-试乘试驾车 40-大客户用车 50-营运-预约出租客运 100-其他：" prop="vehiclePurpose">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehiclePurpose"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="公告车型ID：" prop="vehicleSalesVersionId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleSalesVersionId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="公告车型名称：" prop="vehicleSalesVersionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleSalesVersionName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="产地：" prop="vehicleProductArea">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleProductArea"
                    clearable
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
                <el-form-item label="门店库存台账：" prop="storeInventoryId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.storeInventoryId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车批售单号：" prop="wholesaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleOrderCode"
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
                <el-form-item label="提交时间：" prop="submitTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.submitTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
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
                <el-form-item label="车主证件类型：身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20：" prop="idCardType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
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
                <el-form-item label="销售门店ID：" prop="saleOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleOrgId"
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
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付门店ID：" prop="deliveryOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付门店编码：" prop="deliveryDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="专属服务门店ID：" prop="exclusiveServiceStoreId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.exclusiveServiceStoreId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="专属服务门店编码：" prop="exclusiveServiceStoreCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.exclusiveServiceStoreCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="专属服务门店名称：" prop="exclusiveServiceStoreName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.exclusiveServiceStoreName"
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
                    clearable
                  />
                </el-form-item>
                <el-form-item label="单据编号：" prop="documentCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.documentCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据来源，150-新销服; 10-老销服：" prop="dataSource">
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
                <el-form-item label="终端状态 0-草稿 1-已提交 20-作废：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="特殊车辆销售提报编号：" prop="specialReportCode">
                  {{ form.specialReportCode }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="车型ID：" prop="modelId">
                  {{ form.modelId }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="车辆属性 1-家用 2-营运 4-B级车 10-J级车 20-J1级车 30-专车 60-报废灭失：" prop="vehicleAttribute">
                  {{ form.vehicleAttribute }}
                </el-form-item>
                <el-form-item label="车辆用途 10-私家车 20-公户车 30-试乘试驾车 40-大客户用车 50-营运-预约出租客运 100-其他：" prop="vehiclePurpose">
                  {{ form.vehiclePurpose }}
                </el-form-item>
                <el-form-item label="公告车型ID：" prop="vehicleSalesVersionId">
                  {{ form.vehicleSalesVersionId }}
                </el-form-item>
                <el-form-item label="公告车型名称：" prop="vehicleSalesVersionName">
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
                <el-form-item label="车主姓名：" prop="carBuyerName">
                  {{ form.carBuyerName }}
                </el-form-item>
                <el-form-item label="车主手机号码：" prop="carBuyerPhone">
                  {{ form.carBuyerPhone }}
                </el-form-item>
                <el-form-item label="车主证件类型：身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20：" prop="idCardType">
                  {{ form.idCardType }}
                </el-form-item>
                <el-form-item label="车主证件号码：" prop="idCardNo">
                  {{ form.idCardNo }}
                </el-form-item>
                <el-form-item label="车主详细地址：" prop="address">
                  {{ form.address }}
                </el-form-item>
                <el-form-item label="销售门店ID：" prop="saleOrgId">
                  {{ form.saleOrgId }}
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="交付门店ID：" prop="deliveryOrgId">
                  {{ form.deliveryOrgId }}
                </el-form-item>
                <el-form-item label="交付门店编码：" prop="deliveryDealerCode">
                  {{ form.deliveryDealerCode }}
                </el-form-item>
                <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="专属服务门店ID：" prop="exclusiveServiceStoreId">
                  {{ form.exclusiveServiceStoreId }}
                </el-form-item>
                <el-form-item label="专属服务门店编码：" prop="exclusiveServiceStoreCode">
                  {{ form.exclusiveServiceStoreCode }}
                </el-form-item>
                <el-form-item label="专属服务门店名称：" prop="exclusiveServiceStoreName">
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
                <el-form-item label="单据编号：" prop="documentCode">
                  {{ form.documentCode }}
                </el-form-item>
                <el-form-item label="数据来源，150-新销服; 10-老销服：" prop="dataSource">
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
import { getDetail, addOrUpdate, submitReport, cancelReport, revokeReport, adjustVehicleAttribute } from '@/api/vehretail/orderManager/specialVehicleSalesReport/index';
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
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '主键：' + this.form.id;
    },
    // 权限控制
    canSubmit () {
      return this.hasPermission(`${this.moduleKey}:submit`);
    },
    canCancel () {
      return this.hasPermission(`${this.moduleKey}:cancel`);
    },
    canRevoke () {
      return this.hasPermission(`${this.moduleKey}:revocation`);
    },
    canAdjustVehicleAttribute () {
      return this.hasPermission(`${this.moduleKey}:vehicleAttribute`);
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
          { required: true, message: '请选择终端状态 0-草稿 1-已提交 20-作废', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        specialReportCode: [
          { required: true, message: '请输入特殊车辆销售提报编号', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
        ],
        vehicleAttribute: [
          { required: true, message: '请输入车辆属性 1-家用 2-营运 4-B级车 10-J级车 20-J1级车 30-专车 60-报废灭失', trigger: 'change' }
        ],
        vehiclePurpose: [
          { required: true, message: '请输入车辆用途 10-私家车 20-公户车 30-试乘试驾车 40-大客户用车 50-营运-预约出租客运 100-其他', trigger: 'change' }
        ],
        vehicleSalesVersionId: [
          { required: true, message: '请输入公告车型ID', trigger: 'change' }
        ],
        vehicleSalesVersionName: [
          { required: true, message: '请输入公告车型名称', trigger: 'change' }
        ],
        vehicleProductArea: [
          { required: true, message: '请输入产地', trigger: 'change' }
        ],
        enginenNumber: [
          { required: true, message: '请输入发动机号', trigger: 'change' }
        ],
        certificateNo: [
          { required: true, message: '请输入合格证号', trigger: 'change' }
        ],
        storeInventoryId: [
          { required: true, message: '请输入门店库存台账', trigger: 'change' }
        ],
        wholesaleOrderCode: [
          { required: true, message: '请输入整车批售单号', trigger: 'change' }
        ],
        ocrCarBuyerName: [
          { required: true, message: '请输入证件识别的客户姓名', trigger: 'change' }
        ],
        ocrIdCardNo: [
          { required: true, message: '请输入证件识别的证件号码', trigger: 'change' }
        ],
        invoiceEnginenNumber: [
          { required: true, message: '请输入发票发动机号', trigger: 'change' }
        ],
        invoiceCertificateNo: [
          { required: true, message: '请输入发票合格证号', trigger: 'change' }
        ],
        invoiceProductionPlace: [
          { required: true, message: '请输入发票产地', trigger: 'change' }
        ],
        invoiceVin: [
          { required: true, message: '请输入发票VIN号', trigger: 'change' }
        ],
        brandModel: [
          { required: true, message: '请输入发票厂牌型号', trigger: 'change' }
        ],
        cancelRemark: [
          { required: true, message: '请输入作废说明', trigger: 'change' }
        ],
        submitTime: [
          { required: true, message: '请选择提交时间', trigger: 'change' }
        ],
        carBuyerName: [
          { required: true, message: '请输入车主姓名', trigger: 'change' }
        ],
        carBuyerPhone: [
          { required: true, message: '请输入车主手机号码', trigger: 'change' }
        ],
        idCardType: [
          { required: true, message: '请选择车主证件类型：身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20', trigger: 'change' }
        ],
        idCardNo: [
          { required: true, message: '请输入车主证件号码', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入车主详细地址', trigger: 'change' }
        ],
        saleOrgId: [
          { required: true, message: '请输入销售门店ID', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        deliveryOrgId: [
          { required: true, message: '请输入交付门店ID', trigger: 'change' }
        ],
        deliveryDealerCode: [
          { required: true, message: '请输入交付门店编码', trigger: 'change' }
        ],
        deliveryDealerName: [
          { required: true, message: '请输入交付门店名称', trigger: 'change' }
        ],
        exclusiveServiceStoreId: [
          { required: true, message: '请输入专属服务门店ID', trigger: 'change' }
        ],
        exclusiveServiceStoreCode: [
          { required: true, message: '请输入专属服务门店编码', trigger: 'change' }
        ],
        exclusiveServiceStoreName: [
          { required: true, message: '请输入专属服务门店名称', trigger: 'change' }
        ],
        invoiceNo: [
          { required: true, message: '请输入发票号码', trigger: 'change' }
        ],
        invoiceDate: [
          { required: true, message: '请选择开票日期', trigger: 'change' }
        ],
        invoiceAmount: [
          { required: true, message: '请输入发票金额', trigger: 'change' }
        ],
        documentCode: [
          { required: true, message: '请输入单据编号', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150-新销服; 10-老销服', trigger: 'change' }
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
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([this.tableData[index].id]).then(res => {
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

    // 提交操作
    handleSubmit () {
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
    handleAdjustVehicleAttribute () {
      this.$prompt('请输入新的车辆属性值', '调整车辆属性', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.form.vehicleAttribute,
        inputPattern: /^\d+$/,
        inputErrorMessage: '请输入有效的数字',
        inputPlaceholder: '请输入车辆属性值（如：1-家用 2-营运 4-B级车 10-J级车 20-J1级车 30-专车 60-报废灭失）'
      }).then(({ value }) => {
        adjustVehicleAttribute({
          id: this.form.id,
          vehicleAttribute: parseInt(value)
        }).then(() => {
          this.$message({
            type: 'success',
            message: '调整车辆属性成功!'
          });
          // 重新加载详情
          this.$refs.containerRef.loadDetail();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message || '调整车辆属性失败!'
          });
        });
      }).catch(() => {
        // 用户取消操作
      });
    },

    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
