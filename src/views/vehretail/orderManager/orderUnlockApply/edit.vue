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
          <span class="status primary">状态</span>
        </template>
        <template #extraButtons>
          <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="申请单号：" prop="unlockApplyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.unlockApplyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请单状态 1010-草稿;1020-已提交;1025-已初审;1027-待终审;1030-已通过;1040-已驳回;1050-已作废：" prop="applyStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.applyStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="购车人姓名：" prop="carBuyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carBuyerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="购车人证件号码：" prop="idCardNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.idCardNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyReason"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="OA流程编号：" prop="oaProcessCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.oaProcessCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="新配置物料编码：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单解锁原因：" prop="unlockReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.unlockReason"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
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
                <el-form-item label="退订申请单号：" prop="refundApplyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundApplyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否自动生成 1-是;0-否：" prop="autoGenerateStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.autoGenerateStatus"
                    placeholder="请选择"
                    clearable
                    filterable
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
                  />
                </el-form-item>
                <el-form-item label="审核人名称：" prop="auditUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审核意见：" prop="auditRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="解绑方式 10-门店申请;20-取消锁车;30-退订自动解绑;40-车辆入库自动解绑;50-订单解除自动解绑;60-OA申请：" prop="unlockType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.unlockType"
                    placeholder="请选择"
                    clearable
                    filterable
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
                <el-form-item label="状态：" prop="status">
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
                <el-form-item label="零售订单ID：" prop="retailOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderId"
                    clearable
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
                  />
                </el-form-item>
                <el-form-item label="申请人ID：" prop="applyUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请人名称：" prop="applyUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单处理方式 10-暂不处理;20-手动选择现车;30-系统自动匹配批售单：" prop="orderHandleType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderHandleType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="订单解绑原因编码：" prop="unlockReasonCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.unlockReasonCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="需要绑定VIN号：" prop="bindVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.bindVin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请说明：" prop="applyDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyDesc"
                    clearable
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
                  />
                </el-form-item>
                <el-form-item label="审核人ID：" prop="auditUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditUserId"
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
                <el-form-item label="解绑时订单状态：" prop="orderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="车辆是否预留 0-否;1-是：" prop="carReserveStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.carReserveStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="车辆处理方式 5-绑定指定订单号;10-预留锁定;20-释放至库存：" prop="carHandleType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.carHandleType"
                    placeholder="请选择"
                    clearable
                    filterable
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
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="申请单号：" prop="unlockApplyCode">
                  {{ form.unlockApplyCode }}
                </el-form-item>
                <el-form-item label="申请单状态 1010-草稿;1020-已提交;1025-已初审;1027-待终审;1030-已通过;1040-已驳回;1050-已作废：" prop="applyStatus">
                  {{ form.applyStatus }}
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  {{ form.retailOrderCode }}
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="购车人姓名：" prop="carBuyerName">
                  {{ form.carBuyerName }}
                </el-form-item>
                <el-form-item label="购车人证件号码：" prop="idCardNo">
                  {{ form.idCardNo }}
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  {{ form.applyReason }}
                </el-form-item>
                <el-form-item label="OA流程编号：" prop="oaProcessCode">
                  {{ form.oaProcessCode }}
                </el-form-item>
                <el-form-item label="新配置物料编码：" prop="materialsCode">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="订单解锁原因：" prop="unlockReason">
                  {{ form.unlockReason }}
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="锁车时间：" prop="lockTime">
                  {{ form.lockTime }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="退订申请单号：" prop="refundApplyCode">
                  {{ form.refundApplyCode }}
                </el-form-item>
                <el-form-item label="是否自动生成 1-是;0-否：" prop="autoGenerateStatus">
                  {{ form.autoGenerateStatus }}
                </el-form-item>
                <el-form-item label="缴定金时间：" prop="paymentTime">
                  {{ form.paymentTime }}
                </el-form-item>
                <el-form-item label="审核人名称：" prop="auditUserName">
                  {{ form.auditUserName }}
                </el-form-item>
                <el-form-item label="审核意见：" prop="auditRemark">
                  {{ form.auditRemark }}
                </el-form-item>
                <el-form-item label="解绑方式 10-门店申请;20-取消锁车;30-退订自动解绑;40-车辆入库自动解绑;50-订单解除自动解绑;60-OA申请：" prop="unlockType">
                  {{ form.unlockType }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
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
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="零售订单ID：" prop="retailOrderId">
                  {{ form.retailOrderId }}
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  {{ form.applyTime }}
                </el-form-item>
                <el-form-item label="申请人ID：" prop="applyUserId">
                  {{ form.applyUserId }}
                </el-form-item>
                <el-form-item label="申请人名称：" prop="applyUserName">
                  {{ form.applyUserName }}
                </el-form-item>
                <el-form-item label="订单处理方式 10-暂不处理;20-手动选择现车;30-系统自动匹配批售单：" prop="orderHandleType">
                  {{ form.orderHandleType }}
                </el-form-item>
                <el-form-item label="订单解绑原因编码：" prop="unlockReasonCode">
                  {{ form.unlockReasonCode }}
                </el-form-item>
                <el-form-item label="需要绑定VIN号：" prop="bindVin">
                  {{ form.bindVin }}
                </el-form-item>
                <el-form-item label="申请说明：" prop="applyDesc">
                  {{ form.applyDesc }}
                </el-form-item>
                <el-form-item label="审核时间：" prop="auditTime">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="审核人ID：" prop="auditUserId">
                  {{ form.auditUserId }}
                </el-form-item>
                <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
                </el-form-item>
                <el-form-item label="解绑时订单状态：" prop="orderStatus">
                  {{ form.orderStatus }}
                </el-form-item>
                <el-form-item label="车辆是否预留 0-否;1-是：" prop="carReserveStatus">
                  {{ form.carReserveStatus }}
                </el-form-item>
                <el-form-item label="车辆处理方式 5-绑定指定订单号;10-预留锁定;20-释放至库存：" prop="carHandleType">
                  {{ form.carHandleType }}
                </el-form-item>
                <el-form-item label="数据来源，150-新销服; 10-老销服：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>区块标题</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
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
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/orderUnlockApply/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  unlockApplyCode: '',
  applyStatus: '',
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
  autoGenerateStatus: '',
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
  orderHandleType: '',
  unlockReasonCode: '',
  bindVin: '',
  applyDesc: '',
  auditTime: '',
  auditUserId: '',
  wholesaleOrderCode: '',
  orderStatus: '',
  carReserveStatus: '',
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
    EditTable,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
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
      pageTitle: '订单锁车解绑申请记录管理',
      pageType: 'edit',
      title: '申请单号：' + form.unlockApplyCode,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-orderUnlockApply',
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
        unlockApplyCode: [
          { required: true, message: '请输入申请单号', trigger: 'change' }
        ],
        applyStatus: [
          { required: true, message: '请选择申请单状态 1010-草稿;1020-已提交;1025-已初审;1027-待终审;1030-已通过;1040-已驳回;1050-已作废', trigger: 'change' }
        ],
        retailOrderCode: [
          { required: true, message: '请输入零售订单号', trigger: 'change' }
        ],
        mallOrderCode: [
          { required: true, message: '请输入商城订单编号', trigger: 'change' }
        ],
        carBuyerName: [
          { required: true, message: '请输入购车人姓名', trigger: 'change' }
        ],
        idCardNo: [
          { required: true, message: '请输入购车人证件号码', trigger: 'change' }
        ],
        applyReason: [
          { required: true, message: '请输入申请原因', trigger: 'change' }
        ],
        oaProcessCode: [
          { required: true, message: '请输入OA流程编号', trigger: 'change' }
        ],
        materialsCode: [
          { required: true, message: '请输入新配置物料编码', trigger: 'change' }
        ],
        unlockReason: [
          { required: true, message: '请输入订单解锁原因', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入VIN号', trigger: 'change' }
        ],
        lockTime: [
          { required: true, message: '请选择锁车时间', trigger: 'change' }
        ],
        submitTime: [
          { required: true, message: '请选择提交时间', trigger: 'change' }
        ],
        refundApplyCode: [
          { required: true, message: '请输入退订申请单号', trigger: 'change' }
        ],
        autoGenerateStatus: [
          { required: true, message: '请选择是否自动生成 1-是;0-否', trigger: 'change' }
        ],
        paymentTime: [
          { required: true, message: '请选择缴定金时间', trigger: 'change' }
        ],
        auditUserName: [
          { required: true, message: '请输入审核人名称', trigger: 'change' }
        ],
        auditRemark: [
          { required: true, message: '请输入审核意见', trigger: 'change' }
        ],
        unlockType: [
          { required: true, message: '请选择解绑方式 10-门店申请;20-取消锁车;30-退订自动解绑;40-车辆入库自动解绑;50-订单解除自动解绑;60-OA申请', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
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
        retailOrderId: [
          { required: true, message: '请输入零售订单ID', trigger: 'change' }
        ],
        applyTime: [
          { required: true, message: '请选择申请时间', trigger: 'change' }
        ],
        applyUserId: [
          { required: true, message: '请输入申请人ID', trigger: 'change' }
        ],
        applyUserName: [
          { required: true, message: '请输入申请人名称', trigger: 'change' }
        ],
        orderHandleType: [
          { required: true, message: '请选择订单处理方式 10-暂不处理;20-手动选择现车;30-系统自动匹配批售单', trigger: 'change' }
        ],
        unlockReasonCode: [
          { required: true, message: '请输入订单解绑原因编码', trigger: 'change' }
        ],
        bindVin: [
          { required: true, message: '请输入需要绑定VIN号', trigger: 'change' }
        ],
        applyDesc: [
          { required: true, message: '请输入申请说明', trigger: 'change' }
        ],
        auditTime: [
          { required: true, message: '请选择审核时间', trigger: 'change' }
        ],
        auditUserId: [
          { required: true, message: '请输入审核人ID', trigger: 'change' }
        ],
        wholesaleOrderCode: [
          { required: true, message: '请输入批售订单号', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择解绑时订单状态', trigger: 'change' }
        ],
        carReserveStatus: [
          { required: true, message: '请选择车辆是否预留 0-否;1-是', trigger: 'change' }
        ],
        carHandleType: [
          { required: true, message: '请选择车辆处理方式 5-绑定指定订单号;10-预留锁定;20-释放至库存', trigger: 'change' }
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
