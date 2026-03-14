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
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
          <el-button
            @click="openDialogShow"
            v-if="form.status === 0"
            size="small">
            交车完成
          </el-button>
          <el-button
            @click="openUploadShow1"
            v-if="form.status === 0"
            size="small">
            上传附件
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
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
                <el-form-item label="创建时间：" prop="status">
                  <el-input
                    placeholder="请输入"
                    v-model="form.createTime"
                    clearable
                    disabled
                  />
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" label-width="150px" class="form-edit">
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
                <el-form-item label="开票时间：" prop="invoiceTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.invoiceTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
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
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>订单信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit">
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
                <el-form-item label="代办人联系人：" prop="agentName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.agentName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="整车指导价：" prop="guidePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.guidePrice"
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
                <el-form-item label="订单物料编码：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="配车物料编码：" prop="allocationMaterialCode">
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
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>交付信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" label-width="150px" class="form-edit">
                <el-form-item label="交车时间：" prop="deliveryTime">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryTime"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="车辆属性：" prop="vehicleAttribute">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehicle_attribute_type"
                    v-model="form.vehicleAttribute"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="车主证件类型：" prop="idCardType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehretail_id_card_type"
                    v-model="form.orderIdCardType"
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
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>证件识别信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm3" label-width="180px" class="form-edit">
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
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>附件清单</h2>
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
              <span :class="{ 'warning-value': scope.row.isHighlighted }">
                {{ scope.row.recognizedValue }}
              </span>
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
              <span :class="{ 'warning-value': scope.row.isHighlighted }">
                {{ scope.row.checkValue }}
              </span>
                </template>
              </el-table-column>

              <!-- 比对结果列 -->
<!--              <el-table-column-->
<!--                label="比对结果"-->
<!--                width="120"-->
<!--                align="center"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-tag-->
<!--                    :type="scope.row.recognizedValue === scope.row.checkValue ? 'success' : 'danger'"-->
<!--                    size="small"-->
<!--                    effect="light"-->
<!--                  >-->
<!--                    {{ scope.row.recognizedValue === scope.row.checkValue ? '一致' : '不一致' }}-->
<!--                  </el-tag>-->
<!--                </template>-->
<!--              </el-table-column>-->
            </el-table>

            <!-- 差异项统计 -->
<!--            <div class="diff-summary mt-20" v-if="diffCount > 0">-->
<!--              <el-card shadow="hover" :body-style="{ padding: '12px 20px' }">-->
<!--                <div class="summary-content">-->
<!--                  <el-icon class="el-icon-warning-outline warning-icon"></el-icon>-->
<!--                  <span class="summary-text">共发现 <strong>{{ diffCount }}</strong> 处不一致信息，请仔细核对</span>-->
<!--                </div>-->
<!--              </el-card>-->
<!--            </div>-->

            <!-- 备注说明 -->
          </div>

          <!-- 弹框底部按钮 -->
          <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave" :disabled="!canSave">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
        </el-dialog>
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
import { getDetail, addOrUpdate, deleteItem } from '@/api/vehretail/orderManager/deliveryInvoice/index';
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
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
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
  vin: '',
  certificateNo: '',
  engineNumber: '',
  brandModel: '',
  vehiclePlaceOrigin: '',
  carBuyerName: '',
  idCardNo: '',
  vehicleAttribute: '',
  saleDealerCode: '',
  saleDealerName: '',
  deliveryDealerCode: '',
  deliveryDealerName: '',
  dataSource: '',
  orderStatus: '',
  orderSource: '',
  orderTime: '',
  orderUserId: '',
  orderUserName: '',
  idCardType: '',
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
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        status: [
          { required: false, message: '请选择整车开票状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: false, message: '请选择状态变更描述', trigger: 'change' }
        ],
        deliveryInvoiceCode: [
          { required: false, message: '请输入开票记录编码', trigger: 'change' }
        ],
        deliveryOrderId: [
          { required: false, message: '请输入交车单ID', trigger: 'change' }
        ],
        deliveryOrderCode: [
          { required: false, message: '请输入交车单编号', trigger: 'change' }
        ],
        retailOrderId: [
          { required: false, message: '请输入零售订单ID', trigger: 'change' }
        ],
        retailOrderCode: [
          { required: false, message: '请输入零售订单号', trigger: 'change' }
        ],
        invoiceCode: [
          { required: false, message: '请输入发票代码', trigger: 'change' }
        ],
        invoiceNo: [
          { required: true, message: '请输入发票号码', trigger: 'change' }
        ],
        invoiceName: [
          { required: false, message: '请输入开票名称', trigger: 'change' }
        ],
        invoiceTime: [
          { required: false, message: '请选择开票时间', trigger: 'change' }
        ],
        invoiceAmount: [
          { required: false, message: '请输入发票金额', trigger: 'change' }
        ],
        vin: [
          { required: false, message: '请输入发票VIN码', trigger: 'change' }
        ],
        certificateNo: [
          { required: false, message: '请输入发票合格证号', trigger: 'change' }
        ],
        engineNumber: [
          { required: false, message: '请输入发票发动机号', trigger: 'change' }
        ],
        brandModel: [
          { required: false, message: '请输入发票厂牌型号', trigger: 'change' }
        ],
        vehiclePlaceOrigin: [
          { required: false, message: '请输入产地', trigger: 'change' }
        ],
        carBuyerName: [
          { required: false, message: '请输入证件识别的客户姓名', trigger: 'change' }
        ],
        idCardNo: [
          { required: false, message: '请输入证件识别的证件号码', trigger: 'change' }
        ],
        vehicleAttribute: [
          { required: true, message: '请输入车辆属性', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: false, message: '请输入销售门店编码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店', trigger: 'change' }
        ],
        deliveryDealerCode: [
          { required: false, message: '请输入交付门店编码', trigger: 'change' }
        ],
        deliveryDealerName: [
          { required: true, message: '请输入交付门店', trigger: 'change' }
        ],
        dataSource: [
          { required: false, message: '请输入数据来源，150-新销服; 10-老销服', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择零售订单状态', trigger: 'change' }
        ],
        orderSource: [
          { required: true, message: '请输入订单来源', trigger: 'change' }
        ],
        orderTime: [
          { required: true, message: '请选择商城下单时间', trigger: 'change' }
        ],
        orderUserId: [
          { required: false, message: '请输入用户ID', trigger: 'change' }
        ],
        orderCarBuyerName: [
          { required: true, message: '请输入购车人姓名', trigger: 'change' }
        ],
        orderCarBuyerPhone: [
          { required: true, message: '请输入购车人手机号', trigger: 'change' }
        ],
        idCardType: [
          { required: false, message: '请选择证件类型标签', trigger: 'change' }
        ],
        agentName: [
          { required: false, message: '请输入代办人姓名', trigger: 'change' }
        ],
        agentPhone: [
          { required: false, message: '请输入代办人电话', trigger: 'change' }
        ],
        priceAfterSubsidy: [
          { required: false, message: '请输入补贴后价格', trigger: 'change' }
        ],
        materialsCode: [
          { required: true, message: '请输入订单物料编码', trigger: 'change' }
        ],
        allocationMaterialCode: [
          { required: true, message: '请输入配车物料编码', trigger: 'change' }
        ],
        deliveryVin: [
          { required: false, message: '请输入交车VIN码', trigger: 'change' }
        ],
        deliveryTime: [
          { required: false, message: '请选择交车时间', trigger: 'change' }
        ],
        matchVin: [
          { required: true, message: '请输入配车VIN码', trigger: 'change' }
        ],
        paymentTime: [
          { required: false, message: '请选择缴定金时间', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
  },
  methods: {
    openDialogShow () {
      // 比对数据
      const comparisonData = this.doComparisonData();
      if (comparisonData.length > 0) {
        this.comparisonData = comparisonData;
        this.dialogVisible = true;
      }
    },
    doComparisonData () {
      const comparisonData = [];
      // i.发票VIN=配车VIN,ii.开票名称=购车人姓名,iii.车主证件号码=证件号码,发票金额=开票金额,证件识别的客户姓名=购车人姓名,证件识别的证件号码=证件号码,车主证件类型=证件类型
      if (!this.form.vin || !this.form.matchVin || this.form.vin !== this.form.matchVin) {
        comparisonData.push({
          fieldName: '发票VIN',
          recognizedValue: this.form.vin,
          checkField: '配车VIN',
          checkValue: this.form.matchVin,
          isHighlighted: true
        });
      }
      if (!this.form.invoiceName || !this.form.orderCarBuyerName || this.form.invoiceName !== this.form.orderCarBuyerName) {
        comparisonData.push({
          fieldName: '开票名称',
          recognizedValue: this.form.invoiceName,
          checkField: '购车人姓名',
          checkValue: this.form.orderCarBuyerName,
          isHighlighted: true
        });
      }
      if (!this.form.idCardNo || !this.form.orderIdCardNo || this.form.idCardNo !== this.form.orderIdCardNo) {
        comparisonData.push({
          fieldName: '车主证件号码',
          recognizedValue: this.form.idCardNo,
          checkField: '证件号码',
          checkValue: this.form.orderIdCardNo,
        });
      }
      if (!this.form.invoiceAmount || !this.form.deliveryOrderInvoiceAmount || this.form.invoiceAmount !== this.form.deliveryOrderInvoiceAmount) {
        comparisonData.push({
          fieldName: '发票金额',
          recognizedValue: this.form.price,
          checkField: '开票金额',
          checkValue: this.form.deliveryOrderInvoiceAmount,
          isHighlighted: true
        });
      }
      if (!this.form.carBuyerName || !this.form.orderCarBuyerName || this.form.carBuyerName !== this.form.orderCarBuyerName) {
        comparisonData.push({
          fieldName: '证件识别的客户姓名',
          recognizedValue: this.form.carBuyerName,
          checkField: '购车人姓名',
          checkValue: this.form.orderCarBuyerName,
          isHighlighted: true
        });
      }
      if (!this.form.idCardNo || !this.form.orderIdCardNo || this.form.idCardNo !== this.form.orderIdCardNo) {
        comparisonData.push({
          fieldName: '证件识别的证件号码',
          recognizedValue: this.form.idCardNo,
          checkField: '证件号码',
          checkValue: this.form.orderIdCardNo,
          isHighlighted: true
        });
      }
      if (!this.form.idCardTypeLabel || !this.form.orderIdCardTypeLabel || this.form.idCardTypeLabel !== this.form.orderIdCardTypeLabel) {
        comparisonData.push({
          fieldName: '车主证件类型',
          recognizedValue: this.form.idCardTypeLabel,
          checkField: '证件类型',
          checkValue: this.form.orderIdCardTypeLabel,
        });
      }
      return comparisonData;
    },
    openDeleteShow () {
      this.$confirm('确认是否对数据进行删除?', '提示', {
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
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
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
    }
  }
};
</script>
