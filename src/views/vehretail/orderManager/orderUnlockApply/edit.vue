<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :form.sync="form"
        :isEditing.sync="canEditing"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="form.applyStatus === 1010 || form.applyStatus === 1040"
      >
        <template #extraButtons>
          <el-button v-permission="moduleKey+'-voided'" size="small" @click="handleBatchVoided" v-if="form.applyStatus === 1010 || form.applyStatus === 1040">作废</el-button>
          <el-button v-permission="moduleKey+'-submit'" size="small" @click="handleBatchSubmit" v-if="form.applyStatus === 1010 || form.applyStatus === 1040">提交</el-button>
          <el-button v-permission="moduleKey+'-audit'" size="small" @click="handleBatchAudit" v-if="form.applyStatus === 1020">审核</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>锁车解绑信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="canEditing">
                <el-form-item label="申请单号：" prop="unlockApplyCode">
                  <el-input
                    v-model="form.unlockApplyCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="申请单状态：" prop="applyStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_order_unlock_apply_status"
                    v-model="form.applyStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.applyTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="申请人：" prop="applyUserName">
                  <el-input
                    v-model="form.applyUserName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="整车订单号：" prop="retailOrderCode">
                  <fetch-select
                    :remote-method="findCanUnlockOrderList"
                    :params="form.retailOrderCode"
                    remote
                    reserve-keyword
                    v-model="form.retailOrderId"
                    placeholder="请选择"
                    clearable
                    filterable
                    value-key="id"
                    label-key="retailOrderCode"
                    @change="handleRetailOrderCodeChange"
                    subLabelKey="mallOrderCode"
                  />
                </el-form-item>
                <el-form-item label="订单处理方式：" prop="orderHandleType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_order_unlock_handle_type"
                    v-model="form.orderHandleType"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="订单解锁原因：" prop="unlockReasonCode">
                  <fetch-select
                    :remote-method="unlockReasonSearch"
                    :params="form.unlockReason"
                    remote
                    reserve-keyword
                    v-model="form.unlockReasonCode"
                    placeholder="请选择"
                    clearable
                    filterable
                    value-key="code"
                    label-key="name"
                    @change="(val, record) => {form.unlockReason = record?.name || ''}"
                  />
                </el-form-item>
                <el-form-item label="新配置物料编码：" prop="materialsCode">
                  <el-input
                    v-model="form.materialsCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="需要绑定VIN号：" prop="bindVin">
                  <el-input
                    v-model="form.bindVin"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="申请说明：" prop="applyDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyDesc"
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
                <el-form-item label="审核人：" prop="auditUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditUserName"
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
                <el-form-item label="申请原因：" prop="applyReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyReason"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="商城订单号：" prop="mallOrderCode">
                  <el-input
                    v-model="form.mallOrderCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-input
                    v-model="form.saleDealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="购车人姓名：" prop="carBuyerName">
                  <el-input
                    v-model="form.carBuyerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="购车人证件号码：" prop="idCardNo">
                  <el-input
                    v-model="form.idCardNo"
                    clearable
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
                <el-form-item label="锁车时间：" prop="lockTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.lockTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  <el-input
                    v-model="form.vin"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  <el-input
                    v-model="form.wholesaleOrderCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="解绑方式：" prop="unlockType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_order_unlock_type"
                    v-model="form.unlockType"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="解绑时订单状态：" prop="orderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_order_status"
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="车辆是否预留：" prop="carReserveStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.carReserveStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="是否自动生成：" prop="autoGenerateStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.autoGenerateStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="退订申请单号：" prop="refundApplyCode">
                  <el-input
                    v-model="form.refundApplyCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="OA流程编号：" prop="oaProcessCode">
                  <el-input
                    v-model="form.oaProcessCode"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!canEditing">
                <el-form-item label="申请单号：" prop="unlockApplyCode">
                  {{ form.unlockApplyCode }}
                </el-form-item>
                <el-form-item label="申请单状态：" prop="applyStatus">
                  <span class="status-tag link">{{ form.applyStatusLabel }}</span>
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  {{ form.applyTime }}
                </el-form-item>
                <el-form-item label="申请人：" prop="applyUserName">
                  {{ form.applyUserName }}
                </el-form-item>
                <el-form-item label="整车订单号：" prop="retailOrderCode">
                  <el-link v-if="form.retailOrderId" type="primary" :href="`/sales/vehretail/ordermanager/retailorderinfo/edit?id=${form.retailOrderId}`" target="_blank">{{ form.retailOrderCode }}</el-link><span v-else>{{ form.retailOrderCode }}</span>
                </el-form-item>
                <el-form-item label="订单处理方式：" prop="orderHandleType">
                  {{ form.orderHandleTypeLabel }}
                </el-form-item>
                <el-form-item label="订单解锁原因：" prop="unlockReason">
                  {{ form.unlockReason }}
                </el-form-item>
                <el-form-item label="新配置物料编码：" prop="materialsCode">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclematerials/edit?id=${form.materialsCode}`" target="_blank">{{ form.materialsCode }}</el-link>
                </el-form-item>
                <el-form-item label="需要绑定VIN号：" prop="bindVin">
                  {{ form.bindVin }}
                </el-form-item>
                <el-form-item label="申请说明：" prop="applyDesc">
                  {{ form.applyDesc }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="审核时间：" prop="auditTime">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="审核人：" prop="auditUserName">
                  {{ form.auditUserName }}
                </el-form-item>
                <el-form-item label="审核意见：" prop="auditRemark">
                  {{ form.auditRemark }}
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  {{ form.applyReason }}
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="销售门店：" prop="salesDealerName">
                  {{ form.salesDealerName }}
                </el-form-item>
                <el-form-item label="购车人姓名：" prop="carBuyerName">
                  {{ form.carBuyerName }}
                </el-form-item>
                <el-form-item label="购车人证件号码：" prop="idCardNo">
                  {{ form.idCardNo }}
                </el-form-item>
                <el-form-item label="缴定金时间：" prop="paymentTime">
                  {{ form.paymentTime }}
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`" target="_blank">{{ form.vin }}</el-link>
                </el-form-item>
                <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  <el-link v-if="form.wholesaleOrderId" type="primary" :href="`/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit?id=${form.wholesaleOrderId}`" target="_blank">{{ form.wholesaleOrderCode }}</el-link><span v-else>{{ form.wholesaleOrderCode }}</span>
                </el-form-item>
                <el-form-item label="解绑方式：" prop="unlockType">
                  {{ form.unlockTypeLabel }}
                </el-form-item>
                <el-form-item label="解绑时订单状态：" prop="orderStatus">
                  <span class="status-tag link">{{ form.orderStatusLabel }}</span>
                </el-form-item>
                <el-form-item label="车辆是否预留：" prop="carReserveStatus">
                  <span :class="['status-tag', form.carReserveStatus ? 'primary' : 'link']">{{ form.carReserveStatusLabel }}</span>
                </el-form-item>
                <el-form-item label="是否自动生成：" prop="autoGenerateStatus">
                  <span :class="['status-tag', form.autoGenerateStatus ? 'primary' : 'link']">{{ form.autoGenerateStatusLabel }}</span>
                </el-form-item>
                <el-form-item label="退订申请单号：" prop="refundApplyCode">
                  {{ form.refundApplyCode }}
                </el-form-item>
                <el-form-item label="OA流程编号：" prop="oaProcessCode">
                  {{ form.oaProcessCode }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="!isAdding">
            <div class="common-section-header">
              <h2>关联附件</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <!--附件上传组件 -->
                <AisAttachment
                  :businessId="_id"
                  ref="attachment"
                  configCode="mcs_unstockvin"
                  attachType="附件资料"
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
    <audit-dialog
      ref="auditDialogRef"
      field="unlockApplyCode"
      :auditDataList="dataList"
      @audit="handleUnlkockApplyAudit"
    />
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, batchVoidedApply, submitApply, auditApply } from '@/api/vehretail/orderManager/orderUnlockApply/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getOptionList } from '@/api/vehretail/basicConfig/retailOrderUnlockReasonConfig/index';
import { findCanUnlockOrderList, getDetail as getRetailOrderDetail } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import auditDialog from '@/libs/components/auditDialog';

const defaultForm = {
  // 多选时字段有变化，自行修复
  unlockApplyCode: '',
  applyStatus: 1010,
  retailOrderCode: '',
  mallOrderCode: '',
  carBuyerName: '',
  idCardNo: '',
  applyReason: '',
  oaProcessCode: '',
  materialsCode: '',
  unlockReason: '',
  vin: '',
  lockTime: '',
  submitTime: '',
  refundApplyCode: '',
  autoGenerateStatus: 0,
  paymentTime: '',
  auditUserName: '',
  auditRemark: '',
  unlockType: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  retailOrderId: '',
  applyTime: '',
  applyUserId: '',
  applyUserName: '',
  orderHandleType: 10,
  unlockReasonCode: '',
  bindVin: '',
  applyDesc: '',
  auditTime: '',
  auditUserId: '',
  wholesaleOrderCode: '',
  orderStatus: '',
  carReserveStatus: 0,
  carHandleType: '',
  dataSource: '',
};

export default {
  name: 'orderUnlockApplyEdit',
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
    AisAttachment,
    auditDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    isAdding () {
      return this.$route.query.isAdding;
    },
    title () {
      return '申请单号：' + this.form.unlockApplyCode;
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
      pageTitle: '锁车解绑申请',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-orderUnlockApply',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        retailOrderCode: [
          { required: true, message: '请输入零售订单号', trigger: 'change' }
        ],
        orderHandleType: [
          { required: true, message: '请选择订单处理方式 10-暂不处理;20-手动选择现车;30-系统自动匹配批售单', trigger: 'change' }
        ],
        unlockReasonCode: [
          { required: true, message: '请输入订单解绑原因编码', trigger: 'change' }
        ],
        applyDesc: [
          { required: true, message: '请输入申请说明', trigger: 'change' }
        ],
      },
      canEditing: true,
      dataList: []
    };
  },
  mounted () {
  },
  created () {
    const id = this.$route.query.needAddId;
    const isAdding = this.$route.query.isAdding === 'true';
    const isEditing = this.$route.query.isEditing === 'true';
    this.canEditing = isAdding || (isEditing && (this.form.applyStatus === 1040 || this.form.applyStatus === 1010));
    if (id && isAdding) {
      getRetailOrderDetail(id).then(res => {
        // 直接更新表单数据
        this.form.retailOrderId = res.id || '';
        this.form.retailOrderCode = res.retailOrderCode || '';
        this.form.mallOrderCode = res.mallOrderCode || '';
        this.form.saleDealerName = res.saleDealerName || '';
        this.form.saleDealerCode = res.saleDealerCode || '';
        this.form.carBuyerName = res.carOwner.carBuyerName || '';
        this.form.idCardNo = res.carOwner.idCardNo || '';
        this.form.paymentTime = res.orderFund.paymentTime || '';
        this.form.lockTime = res.lockTime || '';
        this.form.vin = res.matchVin || '';
        this.form.wholesaleOrderCode = res.wholesaleOrderCode || '';
        this.form.orderStatus = res.orderStatus || '';
        this.form.orderStatusLabel = res.orderStatusLabel || '';
        this.form.unlockReason = '车辆质量问题';
        this.form.unlockReasonCode = 'DJY006';
      });
    }
  },
  methods: {
    handleUnlkockApplyAudit (data) {
      const ids = data.auditDataList.map(item => item.id) || [];
      let reqParams = {
        ids,
        auditStatus: data.result,
        auditRemark: data.remark
      };
      auditApply(reqParams).then((res) => {
        this.$refs.containerRef.loadDetail();
      });
    },
    handleBatchSubmit () {
      const selectionList = [this.form];
      // 弹窗确认
      this.$confirm('确认提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = selectionList.map(item => item.id) || [];
        submitApply(ids).then(res => {
          this.$refs.containerRef.loadDetail();
        });
      });
    },
    handleBatchAudit () {
      this.dataList = [this.form];
      this.$refs.auditDialogRef.show();
    },
    handleBatchVoided () {
      const selectionList = [this.form];
      // 只有草稿状态 和 已驳回状态的申请单才能作废 选择项中包含不是草稿状态 或者 已驳回的申请单时，提示用户
      const validIds = selectionList.filter(item => item.applyStatus === 1010 || item.applyStatus === 1040).map(item => item.id) || [];
      if (validIds.length !== selectionList.length) {
        this.$message({
          type: 'error',
          message: '只能作废草稿状态和已驳回状态的申请单!'
        });
        return;
      }
      const ids = selectionList.map(item => item.id) || [];
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">此操作将作废对应申请单, 是否继续?</div>';
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'ais-leave-tips',
        dangerouslyUseHTMLString: true,
        showClose: false
      }).then(() => {
        batchVoidedApply(ids).then(() => {
          this.$message({
            type: 'success',
            message: '作废成功!'
          });
          this.$refs.containerRef.loadDetail();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '作废失败!'
          });
        });
      }).catch(() => {});
    },
    handleRetailOrderCodeChange (val) {
      if (!val) {
        return;
      }
      this.form.retailOrderCode = val;
      getRetailOrderDetail(val).then(res => {
        this.form.retailOrderId = res.id || '';
        this.form.retailOrderCode = res.retailOrderCode || '';
        this.form.mallOrderCode = res.mallOrderCode || '';
        this.form.saleDealerName = res.saleDealerName || '';
        this.form.saleDealerCode = res.saleDealerCode || '';
        this.form.carBuyerName = res.carOwner.carBuyerName || '';
        this.form.idCardNo = res.carOwner.idCardNo || '';
        this.form.paymentTime = res.orderFund.paymentTime || '';
        this.form.lockTime = res.lockTime || '';
        this.form.vin = res.matchVin || '';
        this.form.wholesaleOrderCode = res.wholesaleOrderCode || '';
        this.form.orderStatus = res.orderStatus || '';
        this.form.orderStatusLabel = res.orderStatusLabel || '';
      });
    },
    async findCanUnlockOrderList (params) {
      return findCanUnlockOrderList({ retailOrderCode: params });
    },
    async unlockReasonSearch (params) {
      const isAdding = this.$route.query.isAdding === 'true';
      if (isAdding) {
        return getOptionList({ searchKey: params, storeApplyStatus: 1 });
      } else {
        return getOptionList({ searchKey: params });
      }
    },
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
