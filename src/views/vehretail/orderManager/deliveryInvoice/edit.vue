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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="配车VIN码：">
                  <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.matchVin}`" target="_blank">{{ form.matchVin }}</el-link>
                </el-form-item>
                <el-form-item label="销售门店：">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.saleDealerCode}`" target="_blank">{{ form.saleDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="交付门店：">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.deliveryDealerCode}`" target="_blank">{{ form.deliveryDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="整车订单：">
                  <el-link v-if="form.retailOrderId" type="primary" :href="`/sales/vehretail/orderManager/retailOrderInfo/edit?id=${form.retailOrderId}`" target="_blank">{{ form.retailOrderCode }}</el-link><span v-else>{{ form.retailOrderCode }}</span>
                </el-form-item>
                <el-form-item label="交车单：">
                  {{ form.deliveryOrderCode }}
                </el-form-item>
                <el-form-item label="整车开票状态：">
                  <span class="status-tag link">{{ form.statusLabel }}</span>
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
                <el-form-item label="开票日期：" prop="invoiceTime">
                  <el-date-picker
                    type="date"
                    v-model="form.invoiceTime"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
                <el-form-item label="发票证件号：" prop="invoiceCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceCardNo"
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="发票代码：">
                  {{ form.invoiceCode }}
                </el-form-item>
                <el-form-item label="发票号码：">
                  {{ form.invoiceNo }}
                </el-form-item>
                <el-form-item label="开票名称：">
                  {{ form.invoiceName }}
                </el-form-item>
                <el-form-item label="开票日期：">
                  {{ form.invoiceTime }}
                </el-form-item>
                <el-form-item label="发票证件号：">
                  {{ form.invoiceCardNo }}
                </el-form-item>
                <el-form-item label="开票金额：">
                  {{ form.deliveryOrderInvoiceAmount }}
                </el-form-item>
                <el-form-item label="发票金额：">
                  {{ form.invoiceAmount }}
                </el-form-item>
                <el-form-item label="发票VIN码：">
                  <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`" target="_blank">{{ form.vin }}</el-link>
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="整车订单状态：">
                  <span class="status-tag link">{{ form.orderStatusLabel }}</span>
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
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${form.materialsCode}`" target="_blank">{{ form.materialsCode }}</el-link>
                </el-form-item>
                <el-form-item label="配车物料码：">
                  {{ form.allocationMaterialCode }}
                </el-form-item>
                <el-form-item label="销售门店：">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.saleDealerCode}`" target="_blank">{{ form.saleDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="交付门店：">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.deliveryDealerCode}`" target="_blank">{{ form.deliveryDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="交车VIN码：">
                  <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.deliveryVin}`" target="_blank">{{ form.deliveryVin }}</el-link>
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
                  <el-select v-model="form.vehicleAttribute">
                    <el-option
                      v-for="item in vehicleAttributeSelector"
                      :key="item.code"
                      :label="item.message"
                      :value="item.code"
                      :disabled="item.disabled"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="车主证件类型：" prop="carIdCardType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="form.carIdCardType"
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="交车时间：">
                  {{ form.deliveryTime }}
                </el-form-item>
                <el-form-item label="车辆属性：">
                  {{ form.vehicleAttributeLabel }}
                </el-form-item>
                <el-form-item label="车主证件类型：">
                  {{ form.carIdCardTypeLabel }}
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="证件识别的客户姓名：">
                  {{ form.carBuyerName }}
                </el-form-item>
                <el-form-item label="证件识别的证件号码：">
                  {{ form.idCardNo }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
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
                  @upload-loading-change="handleUploadLoadingChange($event)"
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
                  <!-- 车主证件类型使用下拉选择框 -->
                  <fetch-select
                    v-if="scope.row.fieldKey === 'carIdCardType'"
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="scope.row.recognizedValue"
                    placeholder="请选择"
                    size="small"
                    clearable
                    filterable
                    :class="{ 'warning-value': scope.row.isHighlighted }"
                  />
                  <!-- 其他字段使用普通输入框 -->
                  <el-input
                    v-else
                    v-model="scope.row.recognizedValue"
                    size="small"
                    :disabled="scope.row.disabled"
                    :class="{ 'warning-value': scope.row.isHighlighted }"
                  />
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
                  <span v-if="scope.row.isLabel" :class="{ 'warning-value': scope.row.isHighlighted }">
                    {{ scope.row.checkValueLabel }}
                  </span>
                  <span v-else :class="{ 'warning-value': scope.row.isHighlighted }">
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
  addOrUpdate,
  checkUpload,
  confirmUploadNew,
  deleteItem,
  getDetail
} from '@/api/vehretail/orderManager/deliveryInvoice/index';
import { getByCode } from '@/libs/api/attachment/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { validateAttachments } from '@/libs/utils';

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
  invoiceCardNo: null,
  vin: '',
  certificateNo: '',
  engineNumber: '',
  brandModel: '',
  vehiclePlaceOrigin: '',
  carBuyerName: '',
  idCardNo: '',
  vehicleAttribute: null,
  saleDealerCode: '',
  saleDealerName: '',
  deliveryDealerCode: '',
  deliveryDealerName: '',
  dataSource: 150,
  orderStatus: '',
  orderSource: '',
  orderTime: '',
  orderUserId: '',
  orderUserName: '',
  carIdCardType: '',
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
      uploadLoading: false,
      uploadLoadingCounter: 0,
      // 车辆属性 1-家用 2-营运 4-B级车 10-J级车 20-J1级车 30-专车 60-报废灭失
      vehicleAttributeSelector: [
        { code: 1, message: '家用' },
        { code: 2, message: '营运' },
        { code: 4, message: 'B级车', disabled: true },
        { code: 10, message: 'J级车', disabled: true },
        { code: 20, message: 'J1级车', disabled: true },
        { code: 30, message: '专车', disabled: true },
        { code: 60, message: '报废灭失', disabled: true }
      ],
      // 附件列表配置
      attachmentList: [
        { label: '车主身份证件', configCode: 'mcs_vehnetwork', attachType: '车主身份证件' },
        { label: '车辆销售发票', configCode: 'mcs_vehnetwork', attachType: '车辆销售发票' },
        { label: '车辆合格证', configCode: 'mcs_vehnetwork', attachType: '车辆合格证' },
        { label: '尾款支付凭证', configCode: 'mcs_vehnetwork', attachType: '尾款支付凭证' },
        { label: '销售合同', configCode: 'mcs_vehnetwork', attachType: '销售合同' },
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
        // 仅保留实际生效的 required:true 规则；required:false 的不会触发校验，对应字段多为 disabled 输入或后端自动回填
        status: [{ required: true, message: '请选择整车开票状态', trigger: 'change' }],
        deliveryOrderCode: [{ required: true, message: '请输入交车单', trigger: 'change' }],
        invoiceNo: [{ required: true, message: '请输入发票号码', trigger: 'change' }],
        invoiceTime: [{ required: true, message: '请选择开票日期', trigger: 'change' }],
        vehicleAttribute: [{ required: true, message: '请输入车辆属性', trigger: 'change' }],
        saleDealerName: [{ required: true, message: '请输入销售门店', trigger: 'change' }],
        deliveryDealerName: [{ required: true, message: '请输入交付门店', trigger: 'change' }],
        orderStatus: [{ required: true, message: '请选择零售订单状态', trigger: 'change' }],
        depositAmount: [{ required: true, message: '请输入定金金额', trigger: 'change' }],
        orderSource: [{ required: true, message: '请输入订单来源', trigger: 'change' }],
        orderTime: [{ required: true, message: '请选择商城下单时间', trigger: 'change' }],
        orderCarBuyerName: [{ required: true, message: '请输入购车人姓名', trigger: 'change' }],
        orderCarBuyerPhone: [{ required: true, message: '请输入购车人手机号', trigger: 'change' }],
        carIdCardType: [{ required: true, message: '请选择车主证件类型', trigger: 'change' }],
        materialsCode: [{ required: true, message: '请输入订单物料编码', trigger: 'change' }],
        allocationMaterialCode: [{ required: true, message: '请输入配车物料编码', trigger: 'change' }],
        matchVin: [{ required: true, message: '请输入配车VIN码', trigger: 'change' }]
      }
    };
  },
  mounted () {
    this.loadAttachmentConfig();
  },
  methods: {
    // 初始化时调用 getByCode 获取附件配置，覆盖 attachmentList 中的 required/maxNum/minNum
    async loadAttachmentConfig () {
      try {
        const configRes = await getByCode({ configCode: 'mcs_vehnetwork' });
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
    // 附件上传前判断
    handleBeforeUploadClick (index, { allow, openFileDialog: _openFileDialog }) {
      checkUpload(this.form.id).then(res => {
        allow(true);
      }).catch(() => {
        allow(false); // 直接阻止上传
      });
    },
    handleConfirmUpload () {
      const validateFailed = this.comparisonData.some(item => !item.eqCheckIgnore && item.recognizedValue !== item.checkValue);
      if (validateFailed) {
        this.$message.warning('识别信息与校验信息不一致,请重新确认！');
      } else {
        const uploadConfirm = {
          id: this.form.id
        };
        this.comparisonData.forEach(item => {
          uploadConfirm[item.fieldKey] = item.recognizedValue;
        });
        confirmUploadNew(uploadConfirm).then(res => {
          this.dialogVisible = false;
          // 重新加载详情数据
          this.reloadDetail();
        });
      }
    },
    openDialogShow () {
      // 确认时间
      const warnMsg = (this.form.invoiceTime ? '系统中的开票日期' + this.form.invoiceTime : '系统中的开票日期为空') + '，请确认是否正确；若正确，请点击继续交车；若不正确，请点击取消并修改。';
      this.$confirm(warnMsg, '操作提醒', {
        confirmButtonText: '继续交车',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 比对数据
        const comparisonData = this.doComparisonData();
        this.comparisonData = comparisonData;
        this.dialogVisible = true;
      }).catch(() => {
      });
    },
    doComparisonData () {
      const comparisonData = [];
      // i.发票VIN=配车VIN,ii.开票名称=购车人姓名,iii.发票证件号=证件号码,发票金额=开票金额,证件识别的客户姓名=购车人姓名,证件识别的证件号码=证件号码,车主证件类型=证件类型
      // 固定7行，不根据判空条件限制
      comparisonData.push({
        fieldKey: 'vin',
        fieldName: '发票VIN',
        recognizedValue: this.form.vin,
        checkField: '配车VIN',
        checkValue: this.form.matchVin,
        isHighlighted: !this.form.vin || !this.form.matchVin || this.form.vin !== this.form.matchVin,
        disabled: false
      });
      comparisonData.push({
        fieldKey: 'invoiceName',
        fieldName: '开票名称',
        recognizedValue: this.form.invoiceName,
        checkField: '购车人姓名',
        checkValue: this.form.orderCarBuyerName,
        isHighlighted: !this.form.invoiceName || !this.form.orderCarBuyerName || this.form.invoiceName !== this.form.orderCarBuyerName,
        disabled: false
      });
      comparisonData.push({
        fieldKey: 'carBuyerName',
        fieldName: '证件识别的客户姓名',
        recognizedValue: this.form.carBuyerName,
        checkField: '购车人姓名',
        checkValue: this.form.orderCarBuyerName,
        isHighlighted: !this.form.carBuyerName || !this.form.orderCarBuyerName || this.form.carBuyerName !== this.form.orderCarBuyerName,
        disabled: false
      });
      comparisonData.push({
        fieldKey: 'carIdCardType',
        fieldName: '车主证件类型',
        recognizedValue: this.form.carIdCardType,
        recognizedValueLabel: this.form.carIdCardTypeLabel,
        checkField: '证件类型',
        checkValue: this.form.orderIdCardType,
        checkValueLabel: this.form.orderIdCardTypeLabel,
        eqCheckIgnore: true,
        isLabel: true,
        isHighlighted: !this.form.carIdCardType || !this.form.orderIdCardType || this.form.carIdCardType !== this.form.orderIdCardType,
        disabled: false
      });
      comparisonData.push({
        fieldKey: 'carIdCardNo',
        fieldName: '发票证件号',
        recognizedValue: this.form.invoiceCardNo,
        checkField: '证件号码',
        checkValue: this.form.orderIdCardNo,
        isHighlighted: !this.form.invoiceCardNo || !this.form.orderIdCardNo || this.form.invoiceCardNo !== this.form.orderIdCardNo,
        disabled: false
      });
      comparisonData.push({
        fieldKey: 'idCardNo',
        fieldName: '证件识别的证件号码',
        recognizedValue: this.form.idCardNo,
        checkField: '证件号码',
        checkValue: this.form.orderIdCardNo,
        isHighlighted: !this.form.idCardNo || !this.form.orderIdCardNo || this.form.idCardNo !== this.form.orderIdCardNo,
        disabled: false
      });
      comparisonData.push({
        fieldKey: 'invoiceAmount',
        fieldName: '发票金额',
        recognizedValue: this.form.invoiceAmount,
        checkField: '开票金额',
        checkValue: this.form.deliveryOrderInvoiceAmount,
        isHighlighted: !this.form.invoiceAmount || !this.form.deliveryOrderInvoiceAmount || this.form.invoiceAmount !== this.form.deliveryOrderInvoiceAmount,
        disabled: true
      });
      comparisonData.push({
        fieldKey: 'brandModel',
        fieldName: '发票厂牌型号',
        recognizedValue: this.form.brandModel,
        checkField: '公告车型',
        checkValue: this.form.carSalesVersionName,
        isHighlighted: !this.form.brandModel || !this.form.carSalesVersionName || this.form.brandModel !== this.form.carSalesVersionName,
        disabled: true
      });
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
    async submitRequest () {
      if (this.form.id) {
        // 附件必填与数量上下限校验，逻辑统一在 @/libs/utils -> validateAttachments
        const { valid, errors } = validateAttachments({
          attachmentList: this.attachmentList,
          refs: this.$refs
        });
        if (!valid) {
          this.$message.error(errors.join('；'));
          throw new Error('附件校验未通过');
        }
      }
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
    },
    reloadDetail () {
      this.$message.success('操作成功');
      if (this.$refs.containerRef) {
        this.$refs.containerRef.loadDetail();
      }
      // 或者关闭编辑状态
      this.isEditing = false;
    }
  }
};
</script>
