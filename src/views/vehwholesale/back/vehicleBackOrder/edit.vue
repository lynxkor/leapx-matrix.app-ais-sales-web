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
        :showEditBtn="form.auditStatus === 10 || form.auditStatus === 20"
      >
        <template #status>
         <!-- {{ form.backOrderCode }} -->
        </template>
        <template #extraButtons>
          <!--  v-if = "canAddOrUpdate && form.buttonControl && form.buttonControl.addVehicleButton"  -->
          <el-button v-if = "peraddOrUpdateDetail && form.buttonControl && form.buttonControl.addVehicleButton" size="small"  @click="handelAdd">添加车辆</el-button>
          <el-button v-if = "persubmitAudit && form.buttonControl && form.buttonControl.submitButton" size="small"  :loading="submitLoading" @click="handelSubmit">提交</el-button>
          <el-button v-if = "peraudit && form.buttonControl && form.buttonControl.auditButton" size="small"  :loading="auditLoading" @click="handleAudit">审核</el-button>
          <el-button v-if = "percancel && form.buttonControl && form.buttonControl.canceledButton" size="small"  :loading="cancelLoading" @click="handelCancel">作废</el-button>
          <el-button v-if = "canImport && form.buttonControl && form.buttonControl.importVehicleButton" size="small"  @click="handleImport">导入车辆</el-button>
          <el-button v-if = "canDelete && form.buttonControl && form.buttonControl.deleteButton" size="small"  :loading="deleteLoading" @click="handelDel">删除</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                 <el-form-item label="单据类型：" prop="orderType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_vehicle_back_order_type"
                    v-model="form.orderType"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                  </el-form-item>
                   <el-form-item label="经销商：">
                    <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.dealerCompanyName"
                    :remote-method="listNetworkParentCompany"
                     labelKey="companyName"
                    valueKey="companyCode"
                    @change="getdealerCompanyCode"
                    :disabled="form.orderCategory === '20' || isEditing"
                  />
                </el-form-item>
                 <el-form-item label="企业客户名称：">
                  <fetch-select
                      :remote-method="listNetworkParentCompany"
                      remote
                      v-model="form.entCustomerName"
                      placeholder="请选择"
                      labelKey="companyName"
                      valueKey="companyCode"
                      clearable
                      filterable
                      @change="getentCustomerName"
                      :disabled="form.orderCategory === '10' || isEditing"
                />

                </el-form-item>
                 <el-form-item label="大区：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
                    clearable
                    maxlength="150"
                    disabled
                  />
                  <!-- <fetch-select
                      filterable
                      clearable
                      remote
                      v-model="form.regionCode"
                      :remote-method="getRegionList"
                      value-key="orgCode"
                      label-key="orgName"
                      @change="getRegionrName"
                      disabled
                    /> -->
                </el-form-item>
                <el-form-item label="退车类型：" prop="backType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_vehicle_back_type"
                    v-model="form.backType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                  <el-form-item label="退车订单状态：" prop="auditStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_vehicle_back_order_audit_status"
                    v-model="form.auditStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>

                <el-form-item label="退车备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    maxlength="150"
                  />
                </el-form-item>
                <el-form-item label="审核人：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditorName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="审核时间：">
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
                <el-form-item label="退车审核说明：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditOpinion"
                    clearable
                    maxlength="50"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="退车日期：">
                  <el-date-picker
                    v-model="form.backTime"
                    :picker-options="pickerOptions"
                    type="date"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
               <el-form-item label="退车订单号：" prop="backOrderCode">
                  {{ form.backOrderCode }}
                </el-form-item>
                <el-form-item label="单据类型：" prop="orderTypeLabel">
                  {{ form.orderTypeLabel }}
                </el-form-item>
                 <el-form-item label="经销商：" prop="dealerCompanyName">
                  <el-link type="primary" :href="`/partner/channelManagement/companyDetails?companyCode=${form.dealerCompanyCode}`" target="_blank">{{ form.dealerCompanyName }}</el-link>
                </el-form-item>
                 <el-form-item label="企业客户名称：" prop="entCustomerName">
                  <el-link type="primary" :href="`/partner/channelManagement/companyDetails?companyCode=${form.entCustomerCode}`" target="_blank">{{ form.entCustomerName }}</el-link>
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                   <el-form-item label="退车类型：" prop="backTypeLabel">
                  {{ form.backTypeLabel }}
                </el-form-item>
                  <el-form-item label="退车订单状态：" prop="auditStatusLabel">
                  {{ form.auditStatusLabel }}
                </el-form-item>
                <el-form-item label="退车备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="审核人：" prop="auditorName">
                  {{ form.auditorName }}
                </el-form-item>
                <el-form-item label="审核时间：" prop="auditTime">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="退车审核说明：" prop="auditOpinion">
                  {{ form.auditOpinion }}
                </el-form-item>
                <el-form-item label="退车日期：" prop="backTime">
                  {{ form.backTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>退车车辆明细</h2>
            </div>
               <div class="common-section-body">
              <div class="common-section-table">
                 <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :show-pagination="true"
                  :enable-single-row-save="true"
                  :options="options"
                  :current="pageNum"
                  :pageSize="pageSize"
                  :total="total"
                  @save-row-edit="saveRowEdit"
                  @remove-row="handleRemoveRow"
                  @page-size-change="pageSizeChange"
                  @current-page-change="currentPageChange"
                  :auth="{edit: isEditing, delete: isEditing}"
                >
                   <template #default="{ row, column }">
                    <template v-if="column.property === 'backOrderDetailCode' && row.backOrderDetailCode">
                      <el-link type="primary" :href="`/sales/vehwholesale/back/vehicleBackOrderDetail/edit?id=${row.backOrderDetailCode}`" target="_blank">{{ row.backOrderDetailCode }}</el-link>
                    </template>
                    <template v-else-if="column.property === 'saleDealerName' && row.saleDealerCode">
                      <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${row.saleDealerCode}`" target="_blank">{{ row.saleDealerName }}</el-link>
                    </template>
                    <template v-else-if="column.property === 'wholesaleOrderCode' && row.wholesaleOrderCode">
                      <el-link type="primary" :href="`/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit?id=${row.wholesaleOrderCode}`" target="_blank">{{ row.wholesaleOrderCode }}</el-link>
                    </template>
                    <template v-else-if="column.property === 'entOrderCode' && row.entOrderCode">
                      <el-link type="primary" :href="`/sales/vehwholesale/entorder/entVehicleOrder/edit?id=${row.entOrderCode}`" target="_blank">{{ row.entOrderCode }}</el-link>
                    </template>
                    <template v-else-if="column.property === 'actualVehicleReturn'">
                      <fetch-select
                        v-if="isEditing"
                        :request="fetchOptions"
                        enumCode="BooleanEnum"
                        v-model="row.actualVehicleReturn"
                        placeholder="请选择"
                        clearable
                        filterable
                      />
                      <span v-else>{{ row.actualVehicleReturnLabel }}</span>
                    </template>
                    <template v-else-if="column.property === 'salesDeptReserve'">
                      <fetch-select
                        v-if="isEditing"
                        :request="fetchOptions"
                        enumCode="BooleanEnum"
                        v-model="row.salesDeptReserve"
                        placeholder="请选择"
                        clearable
                        filterable
                      />
                      <span v-else>{{ row.salesDeptReserveLabel }}</span>
                    </template>
                    <template v-else-if="column.property === 'vehicleLogisticsReserve'">
                      <fetch-select
                        v-if="isEditing"
                        :request="fetchOptions"
                        enumCode="BooleanEnum"
                        v-model="row.vehicleLogisticsReserve"
                        placeholder="请选择"
                        clearable
                        filterable
                      />
                      <span v-else>{{ row.vehicleLogisticsReserveLabel }}</span>
                    </template>
                    <template v-else-if="column.property === 'returnPrice'">
                      <el-input
                        v-if="isEditing"
                        v-model="row.returnPrice"
                        placeholder="请输入"
                        clearable
                        type="text"
                      />
                      <span v-else>{{ row.returnPrice }}</span>
                    </template>
                    <template v-else-if="column.property === 'remark'">
                      <el-input
                        v-if="isEditing"
                        v-model="row.remark"
                        placeholder="请输入"
                        clearable
                        type="text"
                      />
                      <span v-else>{{ row.remark }}</span>
                    </template>
                    <template v-else-if="column.formatter">
                      {{ column.formatter(row[column.field], row, column) }}
                    </template>
                    <template v-else>
                      {{ row[column.field] }}
                    </template>
                  </template>
                </edit-table>
              </div>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>附件上传信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <!-- 附件上传组件 -->
                <AisAttachment
                  :businessId="_id"
                  configCode="vehicle_back_order"
                  ref="attachment"
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
    <Upload
      :visible="uploadDialogVisible"
      id='import'
      :businessParams="_id"
      @close="handleUploadDialogClose"
      @getData="loadDetail"
    />
    <audit-dialog
      ref="auditRef"
      @audit="handleBatchAudit"
      :maxlength='150'
    />
     <vinAllocateVehicle :visible.sync="showvinAllocateVehicleDialog" ref="vinAllocateVehicleDialog" :id="_id"
      @confirm="vinConfirm"
      >
    </vinAllocateVehicle>
  </edit-page-layout>
</template>

<script>
import { deleteItem, audit, cancel, getDetail, addOrUpdate, submitAudit } from '@/api/vehwholesale/back/vehicleBackOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import EditTable from '@/libs/components/EditTable';
import { getEnum, listOrgStoreInfo, getRigion, getParentCompany } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
// import EditTable from '@/libs/components/EditTable';
import Upload from '@/libs/components/UploadDialog';
import auditDialog from '@/libs/components/auditDialog';
import vinAllocateVehicle from './vinAllocateVehicle.vue';
import { addOrUpdate as detailAddOrUpdate, deleteItem as detailDeleteItem, edit, getList as getDetailList } from '@/api/vehwholesale/back/vehicleBackOrderDetail/index';
import AisAttachment from '@/libs/components/AisAttachment';
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
  auditStatus: '10',
  statusDesc: '',
  dataSource: '',
  returnOrderCode: '',
  dealerCompanyName: '',
  dealerCompanyCode: '',
  entCustomerCode: '',
  entCustomerName: '',
  returnTime: '',
  regionCode: '',
  regionName: '',
  returnType: '',
  orderType: '',
  auditorName: '',
  auditorUserId: '',
  auditTime: '',
  auditOpinion: '',
};

export default {
  name: 'vehicleBackOrderEdit',
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
    Upload,
    auditDialog,
    vinAllocateVehicle,
    AisAttachment,
    EditTable
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '整车退车订单：' + this.form.backOrderCode;
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
    },
    'form.orderType': {
      handler (val) {
        // 根据单据类型动态设置必填项
        if (val === '10') {
          this.$set(this.rules, 'dealerCompanyName', [
            { required: true, message: '请选择经销商', trigger: 'change' }
          ]);
          this.$delete(this.rules, 'entCustomerName');
        } else if (val === '20') {
          this.$set(this.rules, 'entCustomerName', [
            { required: true, message: '请输入企业客户名称', trigger: 'change' }
          ]);
          this.$delete(this.rules, 'dealerCompanyName');
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    const routeOrderCategory = this.$route.query.orderCategory ? (this.$route.query.orderCategory) : '';
    form.orderCategory = routeOrderCategory;
    form.orderType = routeOrderCategory;
    return {
      pageTitle: '整车退车订单管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVW-vehicleBackOrder',
      loading: false,
      uploadDialogVisible: false,
      showvinAllocateVehicleDialog: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      fileData: [], // 附件数据
      form: { ...form },
      originalForm: { ...form },
      backOrderCodeDetail: '',
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      defaultNewRow: {
        totalQuotaQty: '',
      },
      pageNum: 1,
      pageSize: 20,
      total: 0,
      options: {
        BooleanEnum: []
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // 权限控制
      persubmitAudit: false,
      peraudit: false,
      percancel: false,
      peraddOrUpdateDetail: false,
      // loading状态
      auditLoading: false,
      cancelLoading: false,
      deleteLoading: false,
      rules: {
        orderType: [
          { required: true, message: '请选择单据类型', trigger: 'change' }
        ],
        entCustomerName: [
          { required: true, message: '请输入企业客户名称', trigger: 'change' }
        ],
        backType: [
          { required: true, message: '请选择退车类型', trigger: 'change' }
        ],
        auditStatus: [
          { required: true, message: '请选择退车订单状态', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
      },
      columns: [
        {
          field: 'backOrderDetailCode',
          title: '退车明细单号',
          width: '120'
        },
        {
          field: 'backOrderCode',
          title: '退车订单号',
          width: '200'
        },
        {
          field: 'vin',
          title: 'VIN',
          width: '100'
        },
        {
          field: 'processStatusLabel',
          title: '车辆处理状态',
          width: '150'
        },
        {
          field: 'saleDealerName',
          title: '门店名称',
          width: '120'
        },
        {
          field: 'wholesaleOrderCode',
          title: '整车批售订单号',
          width: '200'
        },
        {
          field: 'entOrderCode',
          title: '企业客户整车订单号',
          width: '200'
        },
        {
          field: 'actualVehicleReturn',
          title: '是否实车返厂',
          width: '150'
        },
        {
          field: 'salesDeptReserve',
          title: '销售部预留',
          width: '150',
        },
        {
          field: 'vehicleLogisticsReserve',
          title: '整车物流预留',
          width: '120',
        },
        {
          field: 'originalWholesalePrice',
          title: '原批售价格',
          width: '120'
        },
        {
          field: 'originalRebateAmount',
          title: '原返利使用金额',
          width: '200'
        },
        {
          field: 'originalInvoicePrice',
          title: '原开票价格',
          width: '200'
        },
        {
          field: 'returnPrice',
          title: '退车价格',
          width: '200',
          editable: true,
          editRender: {
            name: 'ElInput',
            props: {
              type: 'Sring'
            }
          },
        },
        {
          field: 'returnInvoiceAmount',
          title: '退车开票金额',
          width: '200'
        },
        {
          field: 'remark',
          title: '备注说明',
          width: '200',
          editable: true,
          editRender: {
            name: 'ElInput',
            props: {
              type: 'Sring'
            }
          },
        },
        {
          field: 'storeOutboundConfirmer',
          title: '门店出库确认人',
          width: '200'
        },
        {
          field: 'storeOutboundTime',
          title: '门店出库确认时间',
          width: '200'
        },
        {
          field: 'vdcInboundConfirmer',
          title: 'VDC入库确认人',
          width: '200'
        },
        {
          field: 'vdcInboundTime',
          title: 'VDC入库确认时间',
          width: '200'
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '200'
        },
      ],
    };
  },
  mounted () {
    this.fetchBooleanEnum();
    setTimeout(() => {
      if (this._id && this.backOrderCodeDetail) {
        this.getDetailListData();
      }
    }, 1000);
  },
  created () {
    this.initPermissions();
  },
  methods: {
    initPermissions () {
      this.persubmitAudit = this.permissions.has(`${this.moduleKey}-submitAudit`); // 提交
      this.peraudit = this.permissions.has(`${this.moduleKey}-audit`); // 审核
      this.percancel = this.permissions.has(`${this.moduleKey}-cancel`); // 作废
      this.peraddOrUpdateDetail = this.permissions.has(`${this.moduleKey}-addOrUpdateDetail`); // 添加车辆
    },
    openWindow (url) {
      window.open(url, '_blank');
    },
    getRegionrName (val, row) {
      this.form.regionName = row.orgName;
    },
    handleSaveRow (row) {
      if (row.actualVehicleReturn === null || row.actualVehicleReturn === undefined || row.actualVehicleReturn === '') {
        this.$message.error('是否实车返厂不能为空');
        return;
      }
      if (row.salesDeptReserve === null || row.salesDeptReserve === undefined || row.salesDeptReserve === '') {
        this.$message.error('销售部预留不能为空');
        return;
      }
      if (row.vehicleLogisticsReserve === null || row.vehicleLogisticsReserve === undefined || row.vehicleLogisticsReserve === '') {
        this.$message.error('整车物流预留”不能为空');
        return;
      }
      const params = {
        id: row.id,
        actualVehicleReturn: row.actualVehicleReturn,
        salesDeptReserve: row.salesDeptReserve,
        vehicleLogisticsReserve: row.vehicleLogisticsReserve,
        remark: row.remark,
      };
      edit(params).then(() => {
        this.$message.success('保存成功');
        // 刷新详情以获取最新数据
        this.$refs.containerRef.loadDetail();
        this.getDetailListData();
      }).catch(() => {
        this.$message.error('保存失败');
      });
    },

    // 删除单行数据
    handleDeleteRowData (row) {
      // 如果是新增未保存的行（没有ID），直接从数组移除
      if (!row.id) {
        const index = this.tableData.indexOf(row);
        if (index > -1) {
          this.tableData.splice(index, 1);
        }
        return;
      }
      this.$confirm('确认删除该条明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        detailDeleteItem({
          idSet: [row.id]
        }).then(() => {
          this.$message.success('删除成功');
          // 刷新详情以获取最新数据
          this.$refs.containerRef.loadDetail();
          this.getDetailListData();
        }).catch(() => {
          this.$message.error('删除失败');
        });
      }).catch(() => {});
    },
    async fetchBooleanEnum () {
      const response = await getEnum('BooleanEnum');
      this.options.BooleanEnum = response.map(item => ({
        label: item.message,
        value: item.code
      }));
    },
    handleOrderTypeChange (val) {
      if (val === '10') {
        this.form.entCustomerName = '';
        this.form.entCustomerCode = '';
      } else if (val === '20') {
        // 企业客户整车订单：清空经销商
        this.form.dealerCompanyName = '';
        this.form.dealerCompanyCode = '';
      }
    },
    vinConfirm (data) {
      const params = {
        vehicleBackOrderId: this._id,
        items: data,
      };
      detailAddOrUpdate(params).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功'
        });
        this.$refs.containerRef.loadDetail();
        this.getDetailListData();
        this.showvinAllocateVehicleDialog = false;
      });
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handelAdd () {
      this.$refs.vinAllocateVehicleDialog.getData();
      this.showvinAllocateVehicleDialog = true;
    },
    handelCancel () {
      this.$confirm('确认是否对数据进行作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cancelLoading = true;
        cancel({
          idSet: [this._id],
        }).then(() => {
          this.$message.success('提交成功');
          this.$refs.containerRef.loadDetail();
        }).finally(() => {
          this.cancelLoading = false;
        });
      }).catch(() => {});
    },
    handelSubmit () {
      const allFiles = this.$refs.attachment.getFileList();
      if (allFiles.length === 0) {
        this.$message.warning('必须有附件才能操作提交!');
        return;
      }
      this.$confirm('确认是否对数据进行提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitLoading = true;
        submitAudit({
          idSet: [this._id],
        }).then(() => {
          this.$message.success('提交成功');
          this.$refs.containerRef.loadDetail();
        }).finally(() => {
          this.submitLoading = false;
        });
      }).catch(() => {});
    },
    handleBatchAudit (data) {
      this.auditLoading = true;
      let params = {
        idSet: [this._id],
        audit: data.result,
        opinion: data.remark
      };
      return audit(params).then(() => {
        if (params.audit === 1) {
          this.$message({
            type: 'success',
            message: '审批成功'
          });
        } else if (params.audit === 0) {
          this.$message({
            type: 'success',
            message: '驳回成功'
          });
        }
        this.$refs.containerRef.loadDetail();
      }).finally(() => {
        this.auditLoading = false;
      });
    },
    handleAudit () {
      this.$refs.auditRef.show();
      this.$refs.auditRef.auditForm.result = 1;
    },
    handelDel () {
      const ids = this._id;
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">此操作将永久删除, 是否继续</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        this.deleteLoading = true;
        deleteItem(
          { idSet: [ids] }
        ).then(() => {
          this.$router.push({
            path: '/vehwholesale/back/vehicleBackOrder',
          });
          this.getData();
        }).finally(() => {
          this.deleteLoading = false;
        });
      }).catch(() => {});
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    async getRegionList (params) {
      return getRigion({ orgName: params });
    },
    getdealerCompanyCode (val, row) {
      this.form.dealerCompanyName = row.companyName;
      this.form.dealerCompanyCode = row.companyCode;
      this.form.regionCode = row.regionCode;
      this.form.regionName = row.regionName;
    },
    async getDealerListByName (params) {
      return await listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    getentCustomerName (val, row) {
      this.form.entCustomerName = row.companyName;
      this.form.entCustomerCode = row.companyCode;
      this.form.regionCode = row.regionCode;
      this.form.regionName = row.regionName;
    },
    async listNetworkParentCompany (query) {
      return getParentCompany({ parentCompanyName: query });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getDetailListData();
    },
    currentPageChange (pageNum) {
      this.pageNum = pageNum;
      this.getDetailListData();
    },
    getDetailListData () {
      getDetailList({
        backOrderCode: this.backOrderCodeDetail,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.tableData = res.records;
        this.total = res.totals;
      }).catch(() => {});
    },
    handleRemoveRow (row, index, defer) {
      if (!row.id) {
        return;
      }
      detailDeleteItem({
        idSet: [row.id]
      }).then((d) => {
        defer.resolve();
        this.$message.success('删除成功');
        this.$refs.containerRef.loadDetail();
      }).catch(() => {
        defer.reject();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
      edit(row).then(id => {
        defer.resolve(id);
        this.$message.success('更新成功');
        this.$refs.containerRef.loadDetail();
      }).catch(e => {
        defer.reject();
      });
    },
    loadDetail () {
      this.$refs.containerRef.loadDetail();
      this.getDetailListData();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          this.backOrderCodeDetail = res.backOrderCode;
          return res;
        });
      }
    },
    submitRequest () {
      // 遍历明细，检查必填字段
      if (this._id && this.form.details && this.form.details.length > 0) {
        for (let i = 0; i < this.form.details.length; i++) {
          const row = this.form.details[i];
          // 检查是否实车返厂
          if (row.actualVehicleReturn === null || row.actualVehicleReturn === undefined || row.actualVehicleReturn === '') {
            this.$message.error(`第 ${i + 1} 条明细的“是否实车返厂”不能为空`);
            return;
          }
          // 检查销售部预留
          if (row.salesDeptReserve === null || row.salesDeptReserve === undefined || row.salesDeptReserve === '') {
            this.$message.error(`第 ${i + 1} 条明细的“销售部预留”不能为空`);
            return;
          }
          // 检查整车物流预留
          if (row.vehicleLogisticsReserve === null || row.vehicleLogisticsReserve === undefined || row.vehicleLogisticsReserve === '') {
            this.$message.error(`第 ${i + 1} 条明细的“整车物流预留”不能为空`);
            return;
          }
        }
      }

      return addOrUpdate({ ...this.form }).then(() => {
        this.loadDetail();
      }).finally(() => {});
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
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
