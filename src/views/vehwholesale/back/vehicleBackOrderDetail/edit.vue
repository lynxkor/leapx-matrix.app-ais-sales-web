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
                <el-form-item label="车辆处理状态：" prop="status">
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
                <el-form-item label="退车明细单号：" prop="returnOrderDetailCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnOrderDetailCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退车订单编号：" prop="returnOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="批售订单编号：" prop="wholesaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="企业客户整车订单号：" prop="entOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.entOrderCode"
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
                <el-form-item label="大区ID：" prop="regionCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
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
                <el-form-item label="是否实车返厂：1-是、0-否：" prop="actualVehicleReturn">
                  <el-input
                    placeholder="请输入"
                    v-model="form.actualVehicleReturn"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售部预留：1-是、0-否：" prop="salesDeptReserve">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesDeptReserve"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车物流预留：1-是、0-否：" prop="vehicleLogisticsReserve">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleLogisticsReserve"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyName"
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
                <el-form-item label="原批售价格：" prop="originalWholesalePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalWholesalePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="原返利使用金额：" prop="originalRebateAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalRebateAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="原开票价格：" prop="originalInvoicePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalInvoicePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退车价格：" prop="returnPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnPrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退车返利金额：" prop="returnRebateAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnRebateAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退车开票金额：" prop="returnInvoiceAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnInvoiceAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店出库确认人：" prop="storeOutboundConfirmerId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.storeOutboundConfirmerId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店出库确认人：" prop="storeOutboundConfirmer">
                  <el-input
                    placeholder="请输入"
                    v-model="form.storeOutboundConfirmer"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店出库确认时间：" prop="storeOutboundTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.storeOutboundTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="VDC入库确认人：" prop="vdcInboundConfirmer">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vdcInboundConfirmer"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="VDC入库确认人：" prop="vdcInboundConfirmerId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vdcInboundConfirmerId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="VDC入库确认时间：" prop="vdcInboundTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.vdcInboundTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ownerOrgId"
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
                <el-form-item label="车辆处理状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="退车明细单号：" prop="returnOrderDetailCode">
                  {{ form.returnOrderDetailCode }}
                </el-form-item>
                <el-form-item label="退车订单编号：" prop="returnOrderCode">
                  {{ form.returnOrderCode }}
                </el-form-item>
                <el-form-item label="批售订单编号：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
                </el-form-item>
                <el-form-item label="企业客户整车订单号：" prop="entOrderCode">
                  {{ form.entOrderCode }}
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="大区ID：" prop="regionCode">
                  {{ form.regionCode }}
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialsCode">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="是否实车返厂：1-是、0-否：" prop="actualVehicleReturn">
                  {{ form.actualVehicleReturn }}
                </el-form-item>
                <el-form-item label="销售部预留：1-是、0-否：" prop="salesDeptReserve">
                  {{ form.salesDeptReserve }}
                </el-form-item>
                <el-form-item label="整车物流预留：1-是、0-否：" prop="vehicleLogisticsReserve">
                  {{ form.vehicleLogisticsReserve }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  {{ form.dealerCompanyCode }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="车型ID：" prop="modelId">
                  {{ form.modelId }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="原批售价格：" prop="originalWholesalePrice">
                  {{ form.originalWholesalePrice }}
                </el-form-item>
                <el-form-item label="原返利使用金额：" prop="originalRebateAmount">
                  {{ form.originalRebateAmount }}
                </el-form-item>
                <el-form-item label="原开票价格：" prop="originalInvoicePrice">
                  {{ form.originalInvoicePrice }}
                </el-form-item>
                <el-form-item label="退车价格：" prop="returnPrice">
                  {{ form.returnPrice }}
                </el-form-item>
                <el-form-item label="退车返利金额：" prop="returnRebateAmount">
                  {{ form.returnRebateAmount }}
                </el-form-item>
                <el-form-item label="退车开票金额：" prop="returnInvoiceAmount">
                  {{ form.returnInvoiceAmount }}
                </el-form-item>
                <el-form-item label="门店出库确认人：" prop="storeOutboundConfirmerId">
                  {{ form.storeOutboundConfirmerId }}
                </el-form-item>
                <el-form-item label="门店出库确认人：" prop="storeOutboundConfirmer">
                  {{ form.storeOutboundConfirmer }}
                </el-form-item>
                <el-form-item label="门店出库确认时间：" prop="storeOutboundTime">
                  {{ form.storeOutboundTime }}
                </el-form-item>
                <el-form-item label="VDC入库确认人：" prop="vdcInboundConfirmer">
                  {{ form.vdcInboundConfirmer }}
                </el-form-item>
                <el-form-item label="VDC入库确认人：" prop="vdcInboundConfirmerId">
                  {{ form.vdcInboundConfirmerId }}
                </el-form-item>
                <el-form-item label="VDC入库确认时间：" prop="vdcInboundTime">
                  {{ form.vdcInboundTime }}
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  {{ form.ownerOrgId }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/back/vehicleBackOrderDetail/index';
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
  returnOrderDetailCode: '',
  returnOrderCode: '',
  wholesaleOrderCode: '',
  entOrderCode: '',
  saleDealerCode: '',
  saleDealerName: '',
  regionCode: '',
  regionName: '',
  vin: '',
  materialsCode: '',
  materialsDesc: '',
  actualVehicleReturn: '',
  salesDeptReserve: '',
  vehicleLogisticsReserve: '',
  dealerCompanyCode: '',
  dealerCompanyName: '',
  modelId: '',
  modelName: '',
  originalWholesalePrice: '',
  originalRebateAmount: '',
  originalInvoicePrice: '',
  returnPrice: '',
  returnRebateAmount: '',
  returnInvoiceAmount: '',
  storeOutboundConfirmerId: '',
  storeOutboundConfirmer: '',
  storeOutboundTime: '',
  vdcInboundConfirmer: '',
  vdcInboundConfirmerId: '',
  vdcInboundTime: '',
  ownerOrgId: '',
};

export default {
  name: 'vehicleBackOrderDetailEdit',
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
      pageTitle: '整车批售-批售管理-整车退车车辆明细管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISMC-vehicleBackOrderDetail',
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
          { required: true, message: '请选择车辆处理状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        returnOrderDetailCode: [
          { required: true, message: '请输入退车明细单号', trigger: 'change' }
        ],
        returnOrderCode: [
          { required: true, message: '请输入退车订单编号', trigger: 'change' }
        ],
        wholesaleOrderCode: [
          { required: true, message: '请输入批售订单编号', trigger: 'change' }
        ],
        entOrderCode: [
          { required: true, message: '请输入企业客户整车订单号', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        regionCode: [
          { required: true, message: '请输入大区ID', trigger: 'change' }
        ],
        regionName: [
          { required: true, message: '请输入大区', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
        ],
        materialsDesc: [
          { required: true, message: '请输入物料描述', trigger: 'change' }
        ],
        actualVehicleReturn: [
          { required: true, message: '请输入是否实车返厂：1-是、0-否', trigger: 'change' }
        ],
        salesDeptReserve: [
          { required: true, message: '请输入销售部预留：1-是、0-否', trigger: 'change' }
        ],
        vehicleLogisticsReserve: [
          { required: true, message: '请输入整车物流预留：1-是、0-否', trigger: 'change' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'change' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
        ],
        originalWholesalePrice: [
          { required: true, message: '请输入原批售价格', trigger: 'change' }
        ],
        originalRebateAmount: [
          { required: true, message: '请输入原返利使用金额', trigger: 'change' }
        ],
        originalInvoicePrice: [
          { required: true, message: '请输入原开票价格', trigger: 'change' }
        ],
        returnPrice: [
          { required: true, message: '请输入退车价格', trigger: 'change' }
        ],
        returnRebateAmount: [
          { required: true, message: '请输入退车返利金额', trigger: 'change' }
        ],
        returnInvoiceAmount: [
          { required: true, message: '请输入退车开票金额', trigger: 'change' }
        ],
        storeOutboundConfirmerId: [
          { required: true, message: '请输入门店出库确认人', trigger: 'change' }
        ],
        storeOutboundConfirmer: [
          { required: true, message: '请输入门店出库确认人', trigger: 'change' }
        ],
        storeOutboundTime: [
          { required: true, message: '请选择门店出库确认时间', trigger: 'change' }
        ],
        vdcInboundConfirmer: [
          { required: true, message: '请输入VDC入库确认人', trigger: 'change' }
        ],
        vdcInboundConfirmerId: [
          { required: true, message: '请输入VDC入库确认人', trigger: 'change' }
        ],
        vdcInboundTime: [
          { required: true, message: '请选择VDC入库确认时间', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
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
