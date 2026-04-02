<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="整车退车明细"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          {{ form.returnOrderCode }}
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <el-button  size="small"  @click="handelConfirmOutbound">确认出库</el-button>
          <el-button  size="small"  @click="handelConfirmVdcInbound">确认入库</el-button>
          <el-button  size="small"  @click="handleDel">删除</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                 <el-form-item label="退车明细单号：" prop="backOrderDetailCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.backOrderDetailCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="退车订单编号：" prop="backOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.backOrderCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
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
                 <el-form-item label="车辆处理状态：" prop="status">
                  <el-input
                    placeholder="请输入"
                    v-model="form.statusLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="大区：" prop="regionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyName"
                    clearable
                    disabled
                  />
                </el-form-item>
                  <el-form-item label="批售订单编号：" prop="wholesaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleOrderCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="车系名称：" prop="seriesId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesId"
                    clearable
                    disabled
                  />
                </el-form-item>
                  <el-form-item label="企业客户整车订单号：" prop="entOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.entOrderCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="是否实车返厂：" prop="actualVehicleReturn">
                  <fetch-select
                    :request="fetchOptions"
                    enum-code="BooleanEnum"
                    v-model="form.actualVehicleReturn"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                 <el-form-item label="原批售价格：" prop="originalWholesalePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalWholesalePrice"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="退车价格：" prop="returnPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnPrice"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="原开票价格：" prop="originalInvoicePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalInvoicePrice"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="原返利使用金额：" prop="originalRebateAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalRebateAmount"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="退车返利金额：" prop="returnRebateAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnRebateAmount"
                    clearable
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
                 <el-form-item label="门店出库确认人：" prop="storeOutboundConfirmer">
                  <el-input
                    placeholder="请输入"
                    v-model="form.storeOutboundConfirmer"
                    clearable
                    disabled
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
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="VDC入库确认人：" prop="vdcInboundConfirmer">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vdcInboundConfirmer"
                    clearable
                    disabled
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
                    disabled
                  />
                </el-form-item>
                <el-form-item label="销售部预留：" prop="salesDeptReserve">
                 <fetch-select
                    :request="fetchOptions"
                    enum-code="BooleanEnum"
                    v-model="form.salesDeptReserve"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="整车物流预留：" prop="vehicleLogisticsReserve">
                  <fetch-select
                    :request="fetchOptions"
                    enum-code="BooleanEnum"
                    v-model="form.vehicleLogisticsReserve"
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
                    maxlength="150"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="退车明细单号：" prop="backOrderDetailCode">
                  {{ form.backOrderDetailCode }}
                </el-form-item>
                <el-form-item label="退车订单编号：" prop="backOrderCode">
                  {{ form.backOrderCode }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="车辆处理状态：" prop="statusLabel">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="批售订单编号：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
                </el-form-item>
                <el-form-item label="车系名称：" prop="seriesName">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="企业客户整车订单号：" prop="entOrderCode">
                  {{ form.entOrderCode }}
                </el-form-item>
                <el-form-item label="是否实车返厂：" prop="actualVehicleReturnLabel">
                  {{ form.actualVehicleReturnLabel }}
                </el-form-item>
                <el-form-item label="原批售价格：" prop="originalWholesalePrice">
                  {{ form.originalWholesalePrice }}
                </el-form-item>
                <el-form-item label="退车价格：" prop="returnPrice">
                  {{ form.returnPrice }}
                </el-form-item>
                <el-form-item label="原开票价格：" prop="originalInvoicePrice">
                  {{ form.originalInvoicePrice }}
                </el-form-item>
                <el-form-item label="原返利使用金额：" prop="originalRebateAmount">
                  {{ form.originalRebateAmount }}
                </el-form-item>
                <el-form-item label="退车返利金额：" prop="returnRebateAmount">
                  {{ form.returnRebateAmount }}
                </el-form-item>
                <el-form-item label="车型:" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="门店出库确认人：" prop="storeOutboundConfirmer">
                  {{ form.storeOutboundConfirmer }}
                </el-form-item>
                <el-form-item label="门店出库确认时间：" prop="storeOutboundTime">
                  {{ form.storeOutboundTime }}
                </el-form-item>
                <el-form-item label="VDC 入库确认人：" prop="vdcInboundConfirmer">
                  {{ form.vdcInboundConfirmer }}
                </el-form-item>
                <el-form-item label="VDC 入库确认时间：" prop="vdcInboundTime">
                  {{ form.vdcInboundTime }}
                </el-form-item>
                <el-form-item label="销售部预留：" prop="salesDeptReserveLabel">
                  {{ form.salesDeptReserveLabel }}
                </el-form-item>
                <el-form-item label="整车物流预留：" prop="vehicleLogisticsReserveLabel">
                  {{ form.vehicleLogisticsReserveLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
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
import { getDetail, addOrUpdate, confirmVdcInbound, confirmOutbound, deleteItem, edit } from '@/api/vehwholesale/back/vehicleBackOrderDetail/index';
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
      pageTitle: '整车退车车辆明细管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVW-vehicleBackOrderDetail',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
      ],
      rules: {
      }
    };
  },
  mounted () {
  },
  methods: {
    handleDel () {
      const ids = [this._id];
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">此操作将永久删除, 是否继续</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        deleteItem({
          idSet: ids
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getData();
        });
      }).catch(() => {});
    },
    handelConfirmOutbound () {
      this.$confirm('确认是否出库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirmOutbound({
          idSet: [this._id],
        }).then(() => {
          this.$message.success('提交成功');
          this.detailRequest();
        });
      }).catch(() => {});
    },
    handelConfirmVdcInbound () {
      this.$confirm('确认是否入库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirmVdcInbound({
          idSet: [this._id],
        }).then(() => {
          this.$message.success('提交成功');
          this.detailRequest();
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
      return edit({ ...this.form });
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
