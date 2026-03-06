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
          {{ form.replenishApplyDetailCode }}
        </template>
        <!-- <template #extraButtons>
          <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button>
        </template> -->
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
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="所属大区：" prop="regionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="专项活动名称：" prop="prodScheduleActivity">
                  <el-input
                    placeholder="请输入"
                    v-model="form.prodScheduleActivity"
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
                <el-form-item label="车系名称：" prop="seriesName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesName"
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
                <el-form-item label="订单分类：" prop="orderCategory">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderCategory"
                    clearable
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
                <el-form-item label="金融机构名称：" prop="financialOrganization">
                  <el-input
                    placeholder="请输入"
                    v-model="form.financialOrganization"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请数量：" prop="applyQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyQty"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车补货明细单号：" prop="replenishApplyDetailCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.replenishApplyDetailCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsDesc"
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
                <el-form-item label="开票优惠类型：" prop="invoiceDiscountType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.invoiceDiscountType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="开票系数：" prop="invoiceCoefficient">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceCoefficient"
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
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
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
                <el-form-item label="专项活动：" prop="prodScheduleActivityId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.prodScheduleActivityId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车系ID：" prop="seriesId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesId"
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
                <el-form-item label="金融机构ID：" prop="financialOrganizationId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.financialOrganizationId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物料ID：" prop="materialsId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsId"
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
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="整车补货单号：" prop="replenishApplyCode">
                  {{ form.replenishApplyCode }}
                </el-form-item>
                <el-form-item label="审核状态：" prop="auditStatus">
                  {{ form.auditStatusLabel }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="所属大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="批售方式：" prop="wholesaleWayLabel">
                  {{ form.wholesaleWayLabel }}
                </el-form-item>
                <el-form-item label="专项活动名称：" prop="prodScheduleActivity">
                  {{ form.prodScheduleActivity }}
                </el-form-item>
                <el-form-item label="申请类别：" prop="applyCategory">
                  {{ form.applyCategoryLabel }}
                </el-form-item>
                <el-form-item label="车系名称：" prop="seriesName">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="订单分类：" prop="orderCategory">
                  {{ form.orderCategoryLabel }}
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundType">
                  {{ form.settleFundTypeLabel }}
                </el-form-item>
                <el-form-item label="金融机构名称：" prop="financialOrganization">
                  {{ form.financialOrganization }}
                </el-form-item>
                <el-form-item label="申请数量：" prop="applyQty">
                  {{ form.applyQty }}
                </el-form-item>
                <el-form-item label="整车补货明细单号：" prop="replenishApplyDetailCode">
                  {{ form.replenishApplyDetailCode }}
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialsCode">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  {{ form.applyTime }}
                </el-form-item>
                <el-form-item label="审核时间：" prop="auditTime">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="开票优惠类型：" prop="invoiceDiscountType">
                  {{ form.invoiceDiscountTypeLabel }}
                </el-form-item>
                <el-form-item label="开票系数：" prop="invoiceCoefficient">
                  {{ form.invoiceCoefficient }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApplyDetail/index';
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
  replenishApplyCode: '',
  auditStatus: '',
  saleDealerName: '',
  regionName: '',
  prodScheduleActivity: '',
  applyCategory: '',
  seriesName: '',
  modelName: '',
  orderCategory: '',
  settleFundType: '',
  financialOrganization: '',
  applyQty: '',
  replenishApplyDetailCode: '',
  materialsCode: '',
  materialsDesc: '',
  applyTime: '',
  auditTime: '',
  invoiceDiscountType: '',
  invoiceCoefficient: '',
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
  saleDealerCode: '',
  regionCode: '',
  prodScheduleActivityId: '',
  seriesId: '',
  modelId: '',
  financialOrganizationId: '',
  materialsId: '',
  applyReason: '',
};

export default {
  name: 'dealerVehicleReplenishApplyDetailEdit',
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
    // EditTable,
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
      pageTitle: '整车门店补货申请明细',
      pageType: 'edit',
      title: '整车补货单号：' + form.replenishApplyCode,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-dealerVehicleReplenishApplyDetail',
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
        auditStatus: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        regionName: [
          { required: true, message: '请输入所属大区', trigger: 'change' }
        ],
        prodScheduleActivity: [
          { required: true, message: '请输入专项活动名称', trigger: 'change' }
        ],
        applyCategory: [
          { required: true, message: '请输入申请类别', trigger: 'change' }
        ],
        seriesName: [
          { required: true, message: '请输入车系名称', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
        ],
        orderCategory: [
          { required: true, message: '请输入订单分类', trigger: 'change' }
        ],
        settleFundType: [
          { required: true, message: '请选择结算资金类型', trigger: 'change' }
        ],
        financialOrganization: [
          { required: true, message: '请输入金融机构名称', trigger: 'change' }
        ],
        applyQty: [
          { required: true, message: '请输入申请数量', trigger: 'change' }
        ],
        replenishApplyDetailCode: [
          { required: true, message: '请输入整车补货明细单号', trigger: 'change' }
        ],
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
        ],
        materialsDesc: [
          { required: true, message: '请输入物料描述', trigger: 'change' }
        ],
        applyTime: [
          { required: true, message: '请选择申请时间', trigger: 'change' }
        ],
        auditTime: [
          { required: true, message: '请选择审核时间', trigger: 'change' }
        ],
        invoiceDiscountType: [
          { required: true, message: '请选择开票优惠类型', trigger: 'change' }
        ],
        invoiceCoefficient: [
          { required: true, message: '请输入开票系数', trigger: 'change' }
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
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        regionCode: [
          { required: true, message: '请输入大区ID', trigger: 'change' }
        ],
        prodScheduleActivityId: [
          { required: true, message: '请输入专项活动', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请输入车系ID', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        financialOrganizationId: [
          { required: true, message: '请输入金融机构ID', trigger: 'change' }
        ],
        materialsId: [
          { required: true, message: '请输入物料ID', trigger: 'change' }
        ],
        applyReason: [
          { required: true, message: '请输入申请原因', trigger: 'change' }
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
