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
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="form.applyStatus === 1010"
      >
        <template #extraButtons>
          <el-button
            @click="openCancelShow"
            v-if="form.applyStatus === 1010 || form.applyStatus === 1050"
            v-permission="moduleKey + '-cancel'"
            size="small">
            作废
          </el-button>
          <el-button
            @click="openCommitShow"
            v-if="form.applyStatus === 1010 || form.applyStatus === 1050"
            v-permission="moduleKey + '-commit'">
            提交审批
          </el-button>
          <el-button
            @click="openAuditShow"
            v-permission="moduleKey + '-approve'"
            v-if="form.applyStatus === 1"
          >
            审批
          </el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="180px" class="form-edit"
                       v-show="isEditing || !_id">
                <el-form-item label="订单变更申请编号：" prop="changeApplyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.changeApplyCode"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  <fetch-select
                    v-bind="selectOptions"
                    :remote-method="retailOrderSearch"
                    v-model="form.mallOrderCode"
                    @change="retailOrderChange"
                    :disabled="form.changeApplyCode"
                  />
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderCode"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="变更类型：" prop="changeType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_order_change_type"
                    v-model="form.changeType"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="变更原因：" prop="changeReason">
                  <fetch-select
                    v-bind="selectReasonOptions"
                    :remote-method="changeReasonSearch"
                    v-model="form.changeReasonCode"
                    @change="changeReasonChange"
                  />
                </el-form-item>
                <el-form-item label="变更说明：" prop="changeExplain">
                  <el-input
                    placeholder="请输入"
                    v-model="form.changeExplain"
                    type="textarea"
                    maxlength="200"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item label="负责人：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="180px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="订单变更申请编号：" prop="changeApplyCode">
                  {{ form.changeApplyCode }}
                </el-form-item>
                <el-form-item label="零售订单ID：" prop="retailOrderId">
                  {{ form.retailOrderId }}
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  {{ form.retailOrderCode }}
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="变更类型：" prop="changeType">
                  {{ form.changeTypeLabel }}
                </el-form-item>
                <el-form-item label="变更原因：" prop="changeReason">
                  {{ form.changeReason }}
                </el-form-item>
                <el-form-item label="变更说明：" prop="changeExplain">
                  {{ form.changeExplain }}
                </el-form-item>
                <el-form-item label="申请状态：" prop="applyStatus">
                  {{ form.applyStatusLabel }}
                </el-form-item>
                <el-form-item label="负责人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  {{ form.dataSourceLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>原订单信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" label-width="180px" class="form-edit"
                       v-show="isEditing || !_id">
                <el-form-item label="原购车人名称：" prop="originalBuyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalBuyerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="原购车人手机号码：" prop="originalBuyerPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalBuyerPhone"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="原证件类型：" prop="originalIdCardType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="form.originalIdCardType"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="原购车人证件号码：" prop="originalIdCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalIdCardNo"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="原代办人：" prop="originalAgentName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalAgentName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="原销售门店编码：" prop="originalSaleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalSaleDealerCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="原销售门店名称：" prop="originalSaleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalSaleDealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="原整车订单状态：" prop="originalOrderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_order_status"
                    v-model="form.originalOrderStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="原订单物料码：" prop="originalMaterialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalMaterialsCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="是否完成交车：" prop="deliveryStatus">
                  <el-select
                    placeholder="请选择"
                    v-model="form.deliveryStatus"
                    clearable
                    filterable
                    disabled
                  >
                    <el-option
                      v-for="item in yes_no_enum"
                      :key="Number(item.code)"
                      :label="item.message"
                      :value="Number(item.code)"
                    />
                  </el-select>
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
                <el-form-item label="缴定金时间：" prop="paymentTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.paymentTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="180px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="原购车人名称：" prop="originalBuyerName">
                  {{ form.originalBuyerName }}
                </el-form-item>
                <el-form-item label="原购车人手机号码：" prop="originalBuyerPhone">
                  {{ form.originalBuyerPhone }}
                </el-form-item>
                <el-form-item label="原证件类型：" prop="originalIdCardType">
                  {{ form.originalIdCardTypeLabel }}
                </el-form-item>
                <el-form-item label="原购车人证件号码：" prop="originalIdCardNo">
                  {{ form.originalIdCardNo }}
                </el-form-item>
                <el-form-item label="原代办人：" prop="originalAgentName">
                  {{ form.originalAgentName }}
                </el-form-item>
                <el-form-item label="原销售门店编码：" prop="originalSaleDealerCode">
                  {{ form.originalSaleDealerCode }}
                </el-form-item>
                <el-form-item label="原销售门店名称：" prop="originalSaleDealerName">
                  {{ form.originalSaleDealerName }}
                </el-form-item>
                <el-form-item label="原整车订单状态：" prop="originalOrderStatus">
                  {{ form.originalOrderStatusLabel }}
                </el-form-item>
                <el-form-item label="原订单物料码：" prop="originalMaterialsCode">
                  {{ form.originalMaterialsCode }}
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="缴定金时间：" prop="paymentTime">
                  {{ form.paymentTime }}
                </el-form-item>
                <el-form-item label="是否完成交车：" prop="deliveryStatus">
                  {{ form.deliveryStatusLabel }}
                </el-form-item>
                <el-form-item label="交车时间：" prop="deliveryTime">
                  {{ form.deliveryTime }}
                </el-form-item>
                <el-form-item label="车型ID：" prop="modelId">
                  {{ form.modelId }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>变更后订单信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="180px" class="form-edit"
                       v-show="isEditing || !_id">
                <el-form-item label="变更后购车人姓名：" prop="newBuyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.newBuyerName"
                    type="text"
                    maxlength="20"
                    show-word-limit
                    clearable
                    :disabled="form.originalOrderStatus === 9"
                  />
                </el-form-item>
                <el-form-item label="变更后购车人手机号码：" prop="newBuyerPhone">
                  <el-input
                    type="pho"
                    placeholder="请输入"
                    v-model="form.newBuyerPhone"
                    :disabled="form.originalOrderStatus === 9"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="变更后购车人证件类型：" prop="newIdCardType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="form.newIdCardType"
                    placeholder="请选择"
                    :disabled="form.originalOrderStatus === 9"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="变更后购车人证件号码：" prop="newIdCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.newIdCardNo"
                    type="textarea"
                    maxlength="100"
                    show-word-limit
                    :disabled="form.originalOrderStatus === 9"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="变更后代办人：" prop="newAgentName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.newAgentName"
                    type="text"
                    maxlength="20"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item label="变更后销售门店：" prop="newSaleDealerCode">
                  <fetch-select
                    filterable
                    clearable
                    disabled
                    remote
                    collapseTags
                    v-model="form.newSaleDealerCode"
                    :remote-method="getDealerListByCode"
                    value-key="storeCode"
                    label-key="storeName"
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="180px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="变更后购车人姓名：" prop="newBuyerName">
                  {{ form.newBuyerName }}
                </el-form-item>
                <el-form-item label="变更后购车人手机号码：" prop="newBuyerPhone">
                  {{ form.newBuyerPhone }}
                </el-form-item>
                <el-form-item label="变更后购车人证件类型：" prop="newIdCardType">
                  {{ form.newIdCardTypeLabel }}
                </el-form-item>
                <el-form-item label="变更后购车人证件号码：" prop="newIdCardNo">
                  {{ form.newIdCardNo }}
                </el-form-item>
                <el-form-item label="变更后代办人：" prop="newAgentName">
                  {{ form.newAgentName }}
                </el-form-item>
                <el-form-item label="变更后销售门店编码：" prop="newSaleDealerCode">
                  {{ form.newSaleDealerCode }}
                </el-form-item>
                <el-form-item label="变更后销售门店名称：" prop="newSaleDealerName">
                  {{ form.newSaleDealerName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>附件材料</h2>
            </div>
            <div class="common-section-table">
              <!--附件上传组件 -->
              <AisAttachment
                :businessId="_id"
                :readonly="!(isEditing || !_id)"
                configCode="mcs_vehorderapplylog"
                attachType="订单信息变更申请附件"
              />
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>申请记录</h2>
            </div>
            <div class="common-section-body">
              <el-form label-width="180px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="申请人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="申请时间：" prop="createTime">
                {{ form.createTime }}
              </el-form-item>
                <el-form-item label="提交人ID：" prop="submitUserId">
                  {{ form.submitUserId }}
                </el-form-item>
                <el-form-item label="提交人姓名：" prop="submitUserName">
                  {{ form.submitUserName }}
                </el-form-item>
                <el-form-item label="提交审批时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>审批记录</h2>
            </div>
            <div class="common-section-body">
              <el-form label-width="180px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="审核人ID：" prop="auditorId">
                  {{ form.auditorId }}
                </el-form-item>
                <el-form-item label="审核人姓名：" prop="auditorName">
                  {{ form.auditorName }}
                </el-form-item>
                <el-form-item label="审核时间：" prop="auditTime">
                  {{ form.auditTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header" v-show="!(isEditing || !_id)">
              <h2>审批明细</h2>
            </div>
            <div>
              <el-table :data="form.logList" style="width: 60%" v-show="!(isEditing || !_id)">
                <el-table-column
                  prop="creatorName"
                  label="操作人"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="operateStatusLabel"
                  label="操作状态">
                </el-table-column>
                <el-table-column
                  prop="operateExplain"
                  label="操作描述">
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="创建时间"
                  width="180">
                </el-table-column>
              </el-table>
            </div>
        </section>
          <audit-dialog
            ref="auditRef"
            @audit="handleAudit"
          />
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
    <div class="page-common-edit">
    </div>
  </edit-page-layout>
</template>

<script>
import { addOrUpdate, cancel, getDetail, submit } from '@/api/vehretail/orderRefund/orderChange/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import auditDialog from '@/libs/components/auditDialog/index.vue';
import { getEnum, listOrgStoreInfo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList as retailOrderPage } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import { fetchReasonLabelList } from '@/api/vehretail/orderRefund/changeReason';

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
  changeApplyCode: null,
  retailOrderId: '',
  retailOrderCode: '',
  mallOrderCode: '',
  saleOrgId: '',
  saleDealerCode: '',
  saleDealerName: '',
  paymentTime: '',
  deliveryTime: '',
  modelId: '',
  modelName: '',
  applyStatus: '',
  changeType: 0,
  changeReason: '',
  changeExplain: '',
  originalBuyerName: '',
  originalBuyerPhone: '',
  originalIdCardType: null,
  originalIdCardNo: '',
  originalAgentName: '',
  originalSaleDealerCode: '',
  originalSaleDealerName: '',
  deliveryStatus: 0,
  originalOrderStatus: null,
  originalMaterialsCode: '',
  newBuyerName: '',
  newBuyerPhone: '',
  newIdCardType: null,
  newIdCardNo: '',
  newAgentName: '',
  newSaleDealerCode: '',
  newSaleDealerName: '',
  submitUserId: '',
  submitUserName: '',
  submitTime: '',
  auditorId: '',
  auditorName: '',
  auditTime: '',
  dataSource: 150,
  logList: []
};

export default {
  name: 'orderChangeEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    // EditTable,
    AisAttachment,
    FetchSelect,
    auditDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true,
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'mallOrderCode',
        valueKey: 'mallOrderCode',
        clearable: true,
        // multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true,
      },
      selectReasonOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'code',
        clearable: true,
        // multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true,
      },
      pageTitle: '订单信息变更申请管理',
      pageType: 'edit',
      title: '主键：' + form.id,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVRROCA-retailOrderChangeApply',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      rules: {
        id: [
          {
            required: false,
            message: '请输入主键',
            trigger: 'change',
          },
        ],
        creator: [
          {
            required: false,
            message: '请输入创建者',
            trigger: 'change',
          },
        ],
        creatorName: [
          {
            required: false,
            message: '请输入创建者名称',
            trigger: 'change',
          },
        ],
        createTime: [
          {
            required: false,
            message: '请选择创建时间',
            trigger: 'change',
          },
        ],
        modifier: [
          {
            required: false,
            message: '请输入修改者',
            trigger: 'change',
          },
        ],
        modifierName: [
          {
            required: false,
            message: '请输入修改者名称',
            trigger: 'change',
          },
        ],
        updateTime: [
          {
            required: false,
            message: '请选择修改时间',
            trigger: 'change',
          },
        ],
        remark: [
          {
            required: false,
            message: '请输入备注',
            trigger: 'change',
          },
        ],
        status: [
          {
            required: false,
            message: '请选择状态',
            trigger: 'change',
          },
        ],
        statusDesc: [
          {
            required: false,
            message: '请选择状态变更描述',
            trigger: 'change',
          },
        ],
        changeApplyCode: [
          {
            required: false,
            message: '请输入订单信息变更申请编号',
            trigger: 'change',
          },
        ],
        retailOrderId: [
          {
            required: true,
            message: '请输入零售订单ID',
            trigger: 'change',
          },
        ],
        retailOrderCode: [
          {
            required: true,
            message: '请输入零售订单号',
            trigger: 'change',
          },
        ],
        mallOrderCode: [
          {
            required: true,
            message: '请输入商城订单编号',
            trigger: 'change',
          },
        ],
        saleOrgId: [
          {
            required: false,
            message: '请输入销售门店组织ID',
            trigger: 'change',
          },
        ],
        saleDealerCode: [
          {
            required: false,
            message: '请输入销售门店编码',
            trigger: 'change',
          },
        ],
        saleDealerName: [
          {
            required: false,
            message: '请输入销售门店名称',
            trigger: 'change',
          },
        ],
        paymentTime: [
          {
            required: false,
            message: '请选择缴定金时间',
            trigger: 'change',
          },
        ],
        deliveryTime: [
          {
            required: false,
            message: '请选择交车时间',
            trigger: 'change',
          },
        ],
        modelId: [
          {
            required: false,
            message: '请输入车型ID',
            trigger: 'change',
          },
        ],
        modelName: [
          {
            required: false,
            message: '请输入车型名称',
            trigger: 'change',
          },
        ],
        applyStatus: [
          {
            required: false,
            message: '请选择申请状态：0-草稿、1-已提交、2-已通过、3-驳回、4-已作废',
            trigger: 'change',
          },
        ],
        changeType: [
          {
            required: true,
            message: '请选择变更类型：0-变更购车人、1-变更销售门店',
            trigger: 'change',
          },
        ],
        changeReason: [
          {
            required: true,
            message: '请输入变更原因',
            trigger: 'change',
          },
        ],
        changeExplain: [
          {
            required: true,
            message: '请输入变更说明',
            trigger: 'change',
          },
        ],
        originalBuyerName: [
          {
            required: true,
            message: '请输入原购车人名称',
            trigger: 'change',
          },
        ],
        originalBuyerPhone: [
          {
            required: false,
            message: '请输入原购车人手机号码',
            trigger: 'change',
          },
        ],
        originalIdCardType: [
          {
            required: false,
            message: '请选择原证件类型：身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20',
            trigger: 'change',
          },
        ],
        originalIdCardNo: [
          {
            required: false,
            message: '请输入原购车人证件号码',
            trigger: 'change',
          },
        ],
        originalAgentName: [
          {
            required: true,
            message: '请输入原代办人',
            trigger: 'change',
          },
        ],
        originalSaleDealerCode: [
          {
            required: false,
            message: '请输入原销售门店编码',
            trigger: 'change',
          },
        ],
        originalSaleDealerName: [
          {
            required: false,
            message: '请输入原销售门店名称',
            trigger: 'change',
          },
        ],
        deliveryStatus: [
          {
            required: true,
            message: '请选择是否完成交车：0-否、1-是',
            trigger: 'change',
          },
        ],
        originalOrderStatus: [
          {
            required: true,
            message: '请选择原整车订单状态：3-订单确认;5-生产中;30-待门店向工厂付款;40-车辆发运准备中;6-车辆在途;7-等待交车;9-交车完成;10-退订中;15-退款中;99-作废',
            trigger: 'change',
          },
        ],
        originalMaterialsCode: [
          {
            required: true,
            message: '请输入原订单物料码',
            trigger: 'change',
          },
        ],
        newBuyerName: [
          {
            required: false,
            message: '请输入变更后购车人姓名',
            trigger: 'change',
          },
        ],
        newBuyerPhone: [
          {
            required: false,
            message: '请输入变更后购车人手机号码',
            trigger: 'change',
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码格式',
            trigger: 'blur'
          }
        ],
        newIdCardType: [
          {
            required: false,
            message: '请选择变更后购车人证件类型 身份证-1, 护照-2, 驾驶证-3, 港澳来往内地通行证-4, 军官证-5, 组织机构代码-6, 统一社会信用代码-7, 台湾通行证-20',
            trigger: 'change',
          },
        ],
        newIdCardNo: [
          {
            required: false,
            message: '请输入变更后购车人证件号码',
            trigger: 'change',
          },
        ],
        newAgentName: [
          {
            required: false,
            message: '请输入变更后代办人',
            trigger: 'change',
          },
        ],
        newSaleDealerCode: [
          {
            required: false,
            message: '请输入变更后销售门店编码',
            trigger: 'change',
          },
        ],
        newSaleDealerName: [
          {
            required: false,
            message: '请输入变更后销售门店名称',
            trigger: 'change',
          },
        ],
        submitUserId: [
          {
            required: false,
            message: '请输入提交人ID（执行提交审批的用户ID）',
            trigger: 'change',
          },
        ],
        submitUserName: [
          {
            required: false,
            message: '请输入提交人姓名',
            trigger: 'change',
          },
        ],
        submitTime: [
          {
            required: false,
            message: '请选择提交审批时间',
            trigger: 'change',
          },
        ],
        auditorId: [
          {
            required: false,
            message: '请输入审核人ID（最后一次审批的用户ID，变更销售门店为空）',
            trigger: 'change',
          },
        ],
        auditorName: [
          {
            required: false,
            message: '请输入审核人姓名（最后一次审批的用户姓名，变更销售门店为空）',
            trigger: 'change',
          },
        ],
        auditTime: [
          {
            required: false,
            message: '请选择审核时间（最后一次审批时间，变更销售门店为系统通过时间）',
            trigger: 'change',
          },
        ],
        dataSource: [
          {
            required: true,
            message: '请输入数据来源，150-新销服; 10-老销服',
            trigger: 'change',
          },
        ],
      },
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
      // 变更信息不能全部为空
      if (!this.form.newBuyerName && !this.form.newBuyerPhone && !this.form.newIdCardType && !this.form.newIdCardNo && !this.form.newAgentName) {
        this.$message.error('变更信息不能全部为空');
        return;
      }
      return addOrUpdate({ ...this.form });
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
        ...defaultForm,
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
    async getDealerListByCode (params) {
      return listOrgStoreInfo({
        storeCode: params,
        isWholesaleSale: true,
      });
    },
    async retailOrderSearch (val) {
      const params = {
        pageSize: 1000,
        orderStatusExcludeList: [0, 99],
        mallOrderCodeLike: val,
      };
      return await retailOrderPage(params);
    },
    retailOrderChange (val, selectedOption) {
      this.form.retailOrderId = val ? selectedOption.id : '';
      this.form.retailOrderCode = val ? selectedOption.retailOrderCode : '';
      this.form.mallOrderCode = val ? selectedOption.mallOrderCode : '';
      this.form.saleOrgId = val ? selectedOption.saleOrgId : '';
      this.form.saleDealerCode = val ? selectedOption.saleDealerCode : '';
      this.form.saleDealerName = val ? selectedOption.saleDealerName : '';
      this.form.modelId = val ? selectedOption.modelId : '';
      this.form.modelName = val ? selectedOption.modelName : '';
      this.form.originalBuyerName = val ? selectedOption.orderUserName : '';
      this.form.originalBuyerPhone = val ? selectedOption.orderUserPhone : '';
      this.form.originalIdCardType = val ? selectedOption.idCardType : 1;
      this.form.originalIdCardNo = val ? selectedOption.idCardNo : '';
      this.form.originalAgentName = val ? selectedOption.agentName : '';
      this.form.originalSaleDealerCode = val ? selectedOption.saleDealerCode : '';
      this.form.originalSaleDealerName = val ? selectedOption.saleDealerName : '';
      this.form.originalMaterialsCode = val ? selectedOption.materialsCode : '';
      this.form.paymentTime = val ? selectedOption.paymentTime : '';
      this.form.deliveryTime = val ? selectedOption.deliveryTime : '';
      this.form.deliveryStatus = val && selectedOption.deliveryTime ? 1 : 0;
      this.form.dataSource = val ? selectedOption.dataSource : null;
      this.form.originalOrderStatus = val ? selectedOption.orderStatus : null;
    },
    async changeReasonSearch (val) {
      const params = {
        pageSize: 1000,
        changeType: this.form.changeType
      };
      return await fetchReasonLabelList(params);
    },
    changeReasonChange (val, selectedOption) {
      this.form.changeReasonCode = val ? selectedOption.code : '';
      this.form.changeReason = val ? selectedOption.name : '';
    },
    openCancelShow () {
      this.$confirm('确认是否对数据进行作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 作废接口
        cancel(this.form);
      }).catch(() => {});
    },
    openCommitShow () {
      this.$confirm('确认是否对数据进行提交审批?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 提交审批接口
        submit(this.form);
      }).catch(() => {});
    },
    openAuditShow () {
      this.$refs.auditRef.show();
    },
    // 提交审批结果
    handleAudit (auditForm) {
      this.$message.info(JSON.stringify(auditForm));
      auditForm.changeApplyId = this.form.id;
      auditForm.changeApplyCode = this.form.changeApplyCode;
      submit(auditForm);
    }
  },
};
</script>
