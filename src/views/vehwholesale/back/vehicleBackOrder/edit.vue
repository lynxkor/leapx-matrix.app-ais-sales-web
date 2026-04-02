<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="整车退车订单:"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="form.status === 10 || form.status === 20"
      >
        <template #status>
         {{ form.backOrderCode }}
        </template>
        <template #extraButtons>
          <el-button    :disabled="!form.buttonControl.addVehicleButton" size="small"  @click="handelAdd">添加车辆</el-button>
          <el-button   :disabled="!form.buttonControl.submitButton" size="small"  @click="handelSubmit">提交</el-button>
          <el-button   :disabled="!form.buttonControl.auditButton" size="small"  @click="handleAudit">审核</el-button>
          <el-button   :disabled="!form.buttonControl.canceledButton" size="small"  @click="handelCancel">作废</el-button>
          <el-button   :disabled="!form.buttonControl.importVehicleButton" size="small"  @click="handleImport">导入车辆</el-button>
          <el-button   :disabled="!form.buttonControl.deleteButton" size="small"  @click="handelDel">删除</el-button>
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
                  <fetch-select
                      filterable
                      clearable
                      remote
                      v-model="form.regionCode"
                      :remote-method="getRegionList"
                      value-key="orgCode"
                      label-key="orgName"
                      :disabled="isEditing"
                    />
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
                  <el-form-item label="退车订单状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_vehicle_back_order_audit_status"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>

                <el-form-item label="退车备注：">
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
               <el-form-item label="退车订单号：" prop="returnOrderCode">
                  {{ form.returnOrderCode }}
                </el-form-item>
                <el-form-item label="单据类型：" prop="orderTypeLabel">
                  {{ form.orderTypeLabel }}
                </el-form-item>
                 <el-form-item label="经销商：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                 <el-form-item label="企业客户名称：" prop="entCustomerName">
                  {{ form.entCustomerName }}
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                   <el-form-item label="退车类型：" prop="backTypeLabel">
                  {{ form.backTypeLabel }}
                </el-form-item>
                  <el-form-item label="退车订单状态：" prop="statusLabel">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="退车备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="审核人：" prop="auditorName">
                  {{ form.auditorName }}
                </el-form-item>
                <el-form-item label="审核人：" prop="auditorUserId">
                  {{ form.auditorUserId }}
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
                  :data="form.details"
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
                />
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
                  attachType="其他"
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
      @getData="detailRequest"
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
import { getEnum, listOrgStoreInfo, getRigion } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditTable from '@/libs/components/EditTable';
import { networkParentCompanyItem } from '@/api/vehwholesale/replenish/entVehicleReplenishOrder/index';
import Upload from '@/libs/components/UploadDialog';
import auditDialog from '@/libs/components/auditDialog';
import vinAllocateVehicle from './vinAllocateVehicle.vue';
import { addOrUpdate as detailAddOrUpdate, deleteItem as detailDeleteItem } from '@/api/vehwholesale/back/vehicleBackOrderDetail/index';
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
  status: '10',
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
    EditTable,
    Upload,
    auditDialog,
    vinAllocateVehicle,
    AisAttachment
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
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
      ],
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
        status: [
          { required: true, message: '请选择退车订单状态', trigger: 'change' }
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
          field: 'statusLabel',
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
          field: 'actualVehicleReturnLabel',
          title: '是否实车返厂',
          width: '150'
        },
        {
          field: 'salesDeptReserveLabel',
          title: '销售部预留',
          width: '150',
          editable: true,
          editRender: {
            name: 'FetchSelect',
            props: {
              enumCode: 'BooleanEnum',
              placeholder: '请选择',
              clearable: true,
              filterable: true,
              request: this.fetchOptions
            }
          },
        },
        {
          field: 'vehicleLogisticsReserveLabel',
          title: '整车物流预留',
          width: '120',
          editable: true,
          editRender: {
            name: 'FetchSelect',
            props: {
              enumCode: 'BooleanEnum',
              placeholder: '请选择',
              clearable: true,
              filterable: true,
              request: this.fetchOptions
            }
          },
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
              type: 'number'
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
  },
  methods: {
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
          message: '提交成功'
        });
        this.$refs.containerRef.loadDetail();
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
        cancel({
          idSet: [this._id],
        }).then(() => {
          this.$message.success('提交成功');
          this.$refs.containerRef.loadDetail();
        });
      }).catch(() => {});
    },
    handelSubmit () {
      const allFiles = this.$refs.attachment.getFileList();
      console.log('总附件数:', allFiles.length);
      if (allFiles.length === 0) {
        this.$message.warning('必须有附件才能操作提交!');
        return;
      }
      this.$confirm('确认是否对数据进行提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submitAudit({
          idSet: [this._id],
        }).then(() => {
          this.$message.success('提交成功');
          this.$refs.containerRef.loadDetail();
        });
      }).catch(() => {});
    },
    handleBatchAudit (data) {
      let params = {
        idSet: [this._id],
        audit: data.result,
        opinion: data.remark
      };
      return audit(params).then(() => {
        this.$message({
          type: 'success',
          message: '审核提交成功'
        });
        this.$refs.containerRef.loadDetail();
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
        deleteItem(
          { idSet: [ids] }
        ).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getData();
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
      console.log('getdealerCompanyCode', val, row);
      this.form.dealerCompanyName = row.companyName;
      this.form.dealerCompanyCode = row.companyCode;
    },
    async getDealerListByName (params) {
      return await listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    getentCustomerName (val, row) {
      this.form.entCustomerName = row.companyName;
      this.form.entCustomerCode = row.companyCode;
    },
    async listNetworkParentCompany (query) {
      return networkParentCompanyItem({ parentCompanyName: query, pageNum: 1, pageSize: 20 });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      // this.getList();
    },
    currentPageChange (pageNum) {
      this.pageNum = pageNum;
      // this.getList();
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
        this.getDetailData();
      }).catch(() => {
        defer.reject();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
      const params = {
        vehicleBackOrderId: this._id,
        items: [row]
      };
      detailAddOrUpdate(params).then(id => {
        defer.resolve(id);
        this.$message.success('更新成功');
        this.getDetailData();
      }).catch(e => {
        defer.reject();
      });
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
