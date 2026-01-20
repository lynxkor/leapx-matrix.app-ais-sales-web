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
                <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.replenishApplyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店编码">
                  <fetch-select
                    filterable
                    clearable
                    multiple
                    remote
                    collapseTags
                    v-model="form.saleDealerCodes"
                    :remote-method="getDealerListByName"
                    value-key="storeCode"
                    label-key="storeName"
                    @change="handleDealerChange"
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审核状态：" prop="auditStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.auditStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="所属大区：" prop="regionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
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
                <el-form-item label="专项活动：" prop="prodScheduleActivityId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.prodScheduleActivityId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车系组合：" prop="serials">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serials"
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
                <el-form-item label="申请总数量：" prop="applyTotalQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyTotalQty"
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
                <el-form-item label="申请原因：" prop="applyReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyReason"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店审核时间：" prop="auditTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.auditTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.settleFundType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="金融机构ID：" prop="financialOrganizationId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.financialOrganizationId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店仓库名称：" prop="dealerWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerWarehouseName"
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
                <el-form-item label="备注（说明）：" prop="remark">
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
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
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
                <el-form-item label="门店仓库编码：" prop="dealerWarehouseCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerWarehouseCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="大区ID：" prop="regionCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请类别：" prop="applyCategory">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyCategory"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店审核人：" prop="auditorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店审核人：" prop="auditorUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditorUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审核意见：" prop="auditOpinion">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditOpinion"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="厂端审核人：" prop="reviewName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.reviewName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="厂端审核人：" prop="reviewUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.reviewUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="厂端审核时间：" prop="reviewTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.reviewTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="厂端审核意见：" prop="reviewOpinion">
                  <el-input
                    placeholder="请输入"
                    v-model="form.reviewOpinion"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权限：" prop="permission">
                  <el-input
                    placeholder="请输入"
                    v-model="form.permission"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                  {{ form.replenishApplyCode }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="审核状态：" prop="auditStatus">
                  {{ form.auditStatus }}
                </el-form-item>
                <el-form-item label="所属大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="批售方式：" prop="wholesaleWay">
                  {{ form.wholesaleWay }}
                </el-form-item>
                <el-form-item label="专项活动：" prop="prodScheduleActivityId">
                  {{ form.prodScheduleActivityId }}
                </el-form-item>
                <el-form-item label="车系组合：" prop="serials">
                  {{ form.serials }}
                </el-form-item>
                <el-form-item label="订单分类：" prop="orderCategory">
                  {{ form.orderCategory }}
                </el-form-item>
                <el-form-item label="申请总数量：" prop="applyTotalQty">
                  {{ form.applyTotalQty }}
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  {{ form.applyTime }}
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  {{ form.applyReason }}
                </el-form-item>
                <el-form-item label="门店审核时间：" prop="auditTime">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundType">
                  {{ form.settleFundType }}
                </el-form-item>
                <el-form-item label="金融机构ID：" prop="financialOrganizationId">
                  {{ form.financialOrganizationId }}
                </el-form-item>
                <el-form-item label="门店仓库名称：" prop="dealerWarehouseName">
                  {{ form.dealerWarehouseName }}
                </el-form-item>
                <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
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
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="备注（说明）：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="交付门店编码：" prop="deliveryDealerCode">
                  {{ form.deliveryDealerCode }}
                </el-form-item>
                <el-form-item label="门店仓库编码：" prop="dealerWarehouseCode">
                  {{ form.dealerWarehouseCode }}
                </el-form-item>
                <el-form-item label="大区ID：" prop="regionCode">
                  {{ form.regionCode }}
                </el-form-item>
                <el-form-item label="申请类别：" prop="applyCategory">
                  {{ form.applyCategory }}
                </el-form-item>
                <el-form-item label="门店审核人：" prop="auditorName">
                  {{ form.auditorName }}
                </el-form-item>
                <el-form-item label="门店审核人：" prop="auditorUserId">
                  {{ form.auditorUserId }}
                </el-form-item>
                <el-form-item label="审核意见：" prop="auditOpinion">
                  {{ form.auditOpinion }}
                </el-form-item>
                <el-form-item label="厂端审核人：" prop="reviewName">
                  {{ form.reviewName }}
                </el-form-item>
                <el-form-item label="厂端审核人：" prop="reviewUserId">
                  {{ form.reviewUserId }}
                </el-form-item>
                <el-form-item label="厂端审核时间：" prop="reviewTime">
                  {{ form.reviewTime }}
                </el-form-item>
                <el-form-item label="厂端审核意见：" prop="reviewOpinion">
                  {{ form.reviewOpinion }}
                </el-form-item>
                <el-form-item label="权限：" prop="permission">
                  {{ form.permission }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApply/index';
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
  replenishApplyCode: '',
  saleDealerName: '',
  auditStatus: '',
  regionName: '',
  wholesaleWay: '',
  prodScheduleActivityId: '',
  serials: '',
  orderCategory: '',
  applyTotalQty: '',
  applyTime: '',
  applyReason: '',
  auditTime: '',
  settleFundType: '',
  financialOrganizationId: '',
  dealerWarehouseName: '',
  deliveryDealerName: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  saleDealerCode: '',
  deliveryDealerCode: '',
  dealerWarehouseCode: '',
  regionCode: '',
  applyCategory: '',
  auditorName: '',
  auditorUserId: '',
  auditOpinion: '',
  reviewName: '',
  reviewUserId: '',
  reviewTime: '',
  reviewOpinion: '',
  permission: '',
};

export default {
  name: 'vehwholesale/replenish/dealerVehicleReplenishApplyEdit',
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
      pageTitle: '整车批售-批售主数据-整车门店补货申请管理',
      pageType: 'edit',
      title: '整车补货单号：' + form.replenishApplyCode,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-dealerVehicleReplenishApply',
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
        replenishApplyCode: [
          { required: true, message: '请输入整车补货单号', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        auditStatus: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        regionName: [
          { required: true, message: '请输入所属大区', trigger: 'change' }
        ],
        wholesaleWay: [
          { required: true, message: '请输入批售方式', trigger: 'change' }
        ],
        prodScheduleActivityId: [
          { required: true, message: '请输入专项活动', trigger: 'change' }
        ],
        serials: [
          { required: true, message: '请输入车系组合', trigger: 'change' }
        ],
        orderCategory: [
          { required: true, message: '请输入订单分类', trigger: 'change' }
        ],
        applyTotalQty: [
          { required: true, message: '请输入申请总数量', trigger: 'change' }
        ],
        applyTime: [
          { required: true, message: '请选择申请时间', trigger: 'change' }
        ],
        applyReason: [
          { required: true, message: '请输入申请原因', trigger: 'change' }
        ],
        auditTime: [
          { required: true, message: '请选择门店审核时间', trigger: 'change' }
        ],
        settleFundType: [
          { required: true, message: '请选择结算资金类型', trigger: 'change' }
        ],
        financialOrganizationId: [
          { required: true, message: '请输入金融机构ID', trigger: 'change' }
        ],
        dealerWarehouseName: [
          { required: true, message: '请输入门店仓库名称', trigger: 'change' }
        ],
        deliveryDealerName: [
          { required: true, message: '请输入交付门店名称', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
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
          { required: true, message: '请输入备注（说明）', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        deliveryDealerCode: [
          { required: true, message: '请输入交付门店编码', trigger: 'change' }
        ],
        dealerWarehouseCode: [
          { required: true, message: '请输入门店仓库编码', trigger: 'change' }
        ],
        regionCode: [
          { required: true, message: '请输入大区ID', trigger: 'change' }
        ],
        applyCategory: [
          { required: true, message: '请输入申请类别', trigger: 'change' }
        ],
        auditorName: [
          { required: true, message: '请输入门店审核人', trigger: 'change' }
        ],
        auditorUserId: [
          { required: true, message: '请输入门店审核人', trigger: 'change' }
        ],
        auditOpinion: [
          { required: true, message: '请输入审核意见', trigger: 'change' }
        ],
        reviewName: [
          { required: true, message: '请输入厂端审核人', trigger: 'change' }
        ],
        reviewUserId: [
          { required: true, message: '请输入厂端审核人', trigger: 'change' }
        ],
        reviewTime: [
          { required: true, message: '请选择厂端审核时间', trigger: 'change' }
        ],
        reviewOpinion: [
          { required: true, message: '请输入厂端审核意见', trigger: 'change' }
        ],
        permission: [
          { required: true, message: '请输入权限', trigger: 'change' }
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
