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
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="门店编码" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.saleDealerName"
                    :remote-method="getDealerListByName"
                    value-key="storeCode"
                    label-key="storeName"
                    @change="handleChangeDealer"
                  />
                </el-form-item>
                <el-form-item label="订单分类：" prop="orderCategory">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="ws_order_category"
                    v-model="form.orderCategory"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="handleChangeOrderCategory"
                  />
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.deliveryDealerCode"
                    :remote-method="getDeliveryDealerByDealerCode"
                    value-key="storeCode"
                    label-key="storeName"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="批售方式：" prop="wholesaleWay">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_wholesale_way"
                    v-model="form.wholesaleWay"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item
                  label="专项活动："
                  prop="prodScheduleActivityId"
                  v-show="isShowActivity"
                >
                  <fetch-select
                    :remote-method="prodScheduleActivitySearch"
                    remote
                    reserve-keyword
                    labelKey="name"
                    valueKey="id"
                    v-model="form.prodScheduleActivityId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item
                  label="申请类别："
                  prop="applyCategory"
                  v-show="isShowApplyCategory"
                  :rules="form.orderCategory === '2' ? rules.applyCategory: []"
                >
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_replenish_apply_type"
                    v-model="form.applyCategory"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="门店仓库：" prop="dealerWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerWarehouseName"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="审核状态：" prop="auditStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_replenish_audit_status"
                    v-model="form.auditStatus"
                    placeholder="请选择"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item
                  label="金融机构ID："
                  prop="financialOrganizationId"
                  :rules="form.settleFundType==='2010' ? rules.financialOrganizationId: []"
                  v-show="isShowFinancialOrganization"
                >
                  <fetch-select
                    :remote-method="repairItemSearch"
                    remote
                    reserve-keyword
                    labelKey="name"
                    valueKey="id"
                    v-model="form.financialOrganizationId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否赊销：" prop="isSheXiao">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.isSheXiao"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_fundtype"
                    v-model="form.settleFundType"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="handleChangeFundType"
                  />
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyReason"
                    clearable
                    maxlength="150"
                  />
                </el-form-item>
                <el-form-item label="申请总数量：" prop="applyTotalQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyTotalQty"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="仓库编码：" prop="dealerWarehouseCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerWarehouseCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="仓库地址：" prop="dealerWarehouseAddress">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerWarehouseAddress"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="审批时间：" prop="auditTime">
                  <el-date-picker
                    v-model="form.auditTime"
                    type="datetime"
                    placeholder="请选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="true"
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
import { getEnum, getDealerDetailByCode, getRigion, listOrgStoreInfo } from '@/api/common';
import { listIdNames as listFinancialOrganization } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import { listIdNames as listWholesaleProdScheduleActivity } from '@/api/vehwholesale/basic/wholesaleProdScheduleActivity/index';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  replenishApplyCode: '',
  saleDealerName: '',
  auditStatus: '1',
  regionName: '',
  wholesaleWay: '10',
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
  isSheXiao: 0,
  dealerWarehouseAddress: '',
};

export default {
  name: 'dealerVehicleReplenishApplyEdit',
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
      isShowActivity: false,
      isShowApplyCategory: false,
      isShowFinancialOrganization: false,
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
          { required: false, message: '请输入专项活动', trigger: 'change' }
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
          { required: false, message: '请选择审核时间', trigger: 'change' }
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
        isSheXiao: [
          { required: false, message: '请选择是否赊销', trigger: 'change' }
        ],
        dealerWarehouseAddress: [
          { required: true, message: '请输入仓库地址', trigger: 'change' }
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
    },
    handleChangeDealer (val, record) {
      this.form.saleDealerCode = record?.storeCode || '';
      this.form.regionCode = record?.regionCode || '';
      this.form.regionName = record?.region || '';
      getDealerDetailByCode(this.form.saleDealerCode).then(response => {
        this.form.deliveryDealerCode = response?.exclusiveDeliveryStoreCode || '';
        this.form.deliveryDealerName = response?.exclusiveDeliveryStoreName || '';
      }).catch(error => {
        // 错误处理逻辑
        console.error('请求失败:', error);
      });
      if (this.form.deliveryDealerCode) {
        getDealerDetailByCode(this.form.deliveryDealerCode).then(response => {
          this.form.dealerWarehouseCode = response?.storeWarehouseResp?.warehouseCode || '';
          this.form.dealerWarehouseAddress = response?.storeWarehouseResp?.warehouseDetailAddress || '';
          this.form.dealerWarehouseName = response?.storeWarehouseResp?.warehouseName || '';
        }).catch(error => {
          // 错误处理逻辑
          console.error('请求失败:', error);
        });
      }
    },
    handleChangeOrderCategory (val) {
      if (val === '2') {
        this.isShowApplyCategory = true;
        this.isShowActivity = false;
        this.form.prodScheduleActivityId = '';
      } else if (val === '1' || val === '3') {
        this.isShowApplyCategory = false;
        this.isShowActivity = true;
        this.form.applyCategory = '';
      } else {
        this.isShowApplyCategory = false;
        this.isShowActivity = false;
        this.form.applyCategory = '';
        this.form.prodScheduleActivityId = '';
      }
    },
    handleChangeFundType (val) {
      if (val === '2010') {
        this.isShowFinancialOrganization = true;
      } else {
        this.isShowFinancialOrganization = false;
        this.form.financialOrganizationId = '';
      }
      if (val === '1050') {
        this.form.isSheXiao = 1;
      }
    },
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    async getRegionList (params) {
      return getRigion({ orgName: params });
    },
    async repairItemSearch (query) {
      return listFinancialOrganization({ organizationNameLike: query, status: 1 });
    },
    async prodScheduleActivitySearch (query) {
      return listWholesaleProdScheduleActivity({ activityNameLike: query, status: 1, valid: true });
    },
  }
};
</script>
