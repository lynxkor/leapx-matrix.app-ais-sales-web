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
        <template #extraButtons>
          <el-button size="small" :loading="downloadLoading" @click="handleDownload">下载</el-button>
          <el-button
            v-if="form.reconStatusLabel === '待门店对账确认'"
            size="small"
            @click="handleConfirm"
            type="primary">确认</el-button>
          <el-button
            v-if="form.reconStatusLabel === '待门店对账确认' || form.reconStatusLabel === '门店已对账确认'"
            size="small"
            @click="handleCancel"
            type="primary">作废</el-button>
          <el-button
            v-if="form.reconStatusLabel === '已作废'"
            size="small"
            @click="handleRegenerate"
            type="primary">重新生成对账单</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>常规信息</h2>
            </div>
            <div class="common-section-body">
              <el-form
                :inline="true"
                class="form-detail"
                v-show="!(isEditing || !_id)"
              >

                <!-- 客户信息 -->
                <el-form-item label="对账单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="客户编码：" prop="customerCode">
                  {{ form.customerCode }}
                </el-form-item>
                <el-form-item label="客户名称：" prop="customerName">
                  {{ form.customerName }}
                </el-form-item>

                <!-- 对账信息 -->
                <el-form-item label="对账年月：" prop="reconYearmonth">
                  {{ form.reconYearmonth }}
                </el-form-item>
                <el-form-item label="对账状态：" prop="reconStatus">
                  {{ form.reconStatusLabel }}
                </el-form-item>

                <!-- 对账确认信息 -->
                <el-form-item label="对账确认时间：" prop="reconConfirmTime">
                  {{ form.reconConfirmTime }}
                </el-form-item>
                <el-form-item label="对账确认人：" prop="reconConfirmUserName">
                  {{ form.reconConfirmUserName }}
                </el-form-item>
                <el-form-item label="对账确认备注：" prop="reconConfirmRemark">
                  {{ form.reconConfirmRemark }}
                </el-form-item>

                <!-- 作废信息 -->
                <el-form-item label="作废原因：" prop="cancelReason">
                  {{ form.cancelReason }}
                </el-form-item>
                <el-form-item label="作废时间：" prop="cancelTime">
                  {{ form.cancelTime }}
                </el-form-item>
                <el-form-item label="作废操作人：" prop="cancelUserName">
                  {{ form.cancelUserName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>整车返利流水</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <el-form :inline="true" class="form-detail" style="display: flex; flex-wrap: nowrap; overflow-x: auto;">
                  <el-form-item label="整车返利期初账户：">
                    {{ form.vehicleRebateOpeningBalance }}
                  </el-form-item>
                  <el-form-item label="整车返利期末账户：">
                    {{ form.vehicleRebateClosingBalance }}
                  </el-form-item>
                  <el-form-item label="整车返利期间使用小计：">
                    {{ form.vehicleRebatePeriodUsage }}
                  </el-form-item>
                  <el-form-item label="整车返利期间入账小计：">
                    {{ form.vehicleRebatePeriodEntry }}
                  </el-form-item>
                </el-form>
                <div v-loading="vehicleRebateLoading">
                  <vxe-table
                    ref="vehicleRebateTableRef"
                    stripe
                    :data="vehicleRebateData"
                    show-overflow
                    resizable
                    border="inner"
                    size="medium"
                    min-height="0"
                    height="400"
                  >
                  <vxe-column field="serialNo" title="序号" min-width="30" />
                  <vxe-column field="dataCategoryLabel" title="数据分类" min-width="70" />
                  <vxe-column field="postingDate" title="过账日期" min-width="160" />
                  <vxe-column field="rebateSerialNo" title="返利流水号" min-width="180" />
                  <vxe-column field="transactionTypeLabel" title="交易类型" min-width="60" />
                  <vxe-column field="transactionAmount" title="交易金额" min-width="100" />
                  <vxe-column field="vehicleOrderNo" title="整车订单编号" min-width="200" />
                  <vxe-column field="entryVoucherNo" title="入账凭证号" min-width="200" />
                  <vxe-column field="rebateTypeLabel" title="返利类型" min-width="100" />
                  <vxe-column field="vin" title="关联VIN号" min-width="160" />
                  <vxe-column field="balance" title="余额" min-width="100" />
                  <vxe-column field="remark" title="备注" min-width="120" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{EmptyText}}</div>
                  </template>
                  </vxe-table>
                  <el-pagination
                    @size-change="handleVehicleRebateSizeChange"
                    @current-change="handleVehicleRebateCurrentChange"
                    :current-page="vehicleRebatePage.currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="vehicleRebatePage.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="vehicleRebatePage.total">
                  </el-pagination>
                </div>
              </div>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>整车现金流水</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <el-form :inline="true" class="form-detail" style="display: flex; flex-wrap: nowrap; overflow-x: auto;">
                  <el-form-item label="整车现金期初账户：">
                    {{ form.vehicleCashOpeningBalance }}
                  </el-form-item>
                  <el-form-item label="整车现金期末账户：">
                    {{ form.vehicleCashClosingBalance }}
                  </el-form-item>
                  <el-form-item label="整车现金期间使用小计：">
                    {{ form.vehicleCashPeriodUsage }}
                  </el-form-item>
                  <el-form-item label="整车现金期间入账小计：">
                    {{ form.vehicleCashPeriodEntry }}
                  </el-form-item>
                </el-form>
                <div v-loading="vehicleCashLoading">
                  <vxe-table
                    ref="vehicleCashTableRef"
                    stripe
                    :data="vehicleCashData"
                    show-overflow
                    resizable
                    border="inner"
                    size="medium"
                    min-height="0"
                    height="400"
                  >
                    <vxe-column field="serialNo" title="序号" min-width="70" />
                    <vxe-column field="invoiceDate" title="开票日期" min-width="180" />
                    <vxe-column field="salesOrderNo" title="销售订单号" min-width="190" />
                    <vxe-column field="vin" title="车架号" min-width="160" />
                    <vxe-column field="totalAmountWithTax" title="价税合计金额" min-width="120" />
                    <vxe-column field="fundTypeSend" title="资金类型(发货)" min-width="120" />
                    <vxe-column field="taxInvoiceNo" title="税务发票号" min-width="190" />
                    <vxe-column field="postingDate" title="过账日期" min-width="160" />
                    <vxe-column field="fundTypeReceive" title="资金类型(收款)" min-width="120" />
                    <vxe-column field="cashAmount" title="现金金额" min-width="100" />
                    <vxe-column field="bankDraftAmount" title="银票金额" min-width="100" />
                    <vxe-column field="otherAmount" title="其他金额" min-width="100" />
                    <vxe-column field="currentBalance" title="本期余额" min-width="100" />
                    <vxe-column field="summary" title="摘要" min-width="200" />
                    <template #empty>
                      <div class="m-vxe-table-empty-text">{{EmptyText}}</div>
                    </template>
                  </vxe-table>
                </div>
                <el-pagination
                  @size-change="handleVehicleCashSizeChange"
                  @current-change="handleVehicleCashCurrentChange"
                  :current-page="vehicleCashPage.currentPage"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="vehicleCashPage.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="vehicleCashPage.total">
                </el-pagination>
              </div>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>备件现金流水</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <el-form :inline="true" class="form-detail" style="display: flex; flex-wrap: nowrap; overflow-x: auto;">
                  <el-form-item label="备件现金期初账户：">
                    {{ form.spareCashOpeningBalance }}
                  </el-form-item>
                  <el-form-item label="备件现金期末账户：">
                    {{ form.spareCashClosingBalance }}
                  </el-form-item>
                  <el-form-item label="备件现金期间使用小计：">
                    {{ form.spareCashPeriodUsage }}
                  </el-form-item>
                  <el-form-item label="备件现金期间入账小计：">
                    {{ form.spareCashPeriodEntry }}
                  </el-form-item>
                </el-form>
                <div v-loading="spareCashLoading">
                  <vxe-table
                    ref="spareCashTableRef"
                    stripe
                    :data="spareCashData"
                    show-overflow
                    resizable
                    border="inner"
                    size="medium"
                    min-height="0"
                    height="400"
                  >
                    <vxe-column field="serialNo" title="序号" min-width="30" />
                    <vxe-column field="invoiceDate" title="开票日期" min-width="160" />
                    <vxe-column field="salesVoucher" title="销售凭证" min-width="190" />
                    <vxe-column field="deliveryReturnNo" title="出库/退货单" min-width="190" />
                    <vxe-column field="taxInvoiceNo" title="税务发票号" min-width="190" />
                    <vxe-column field="postingDate" title="过账日期" min-width="160" />
                    <vxe-column field="totalAmountWithTax" title="价税合计金额" min-width="120" />
                    <vxe-column field="cashAmount" title="现金金额" min-width="100" />
                    <vxe-column field="otherAmount" title="其他金额" min-width="100" />
                    <vxe-column field="accountsReceivableBalance" title="应收帐款余额" min-width="120" />
                    <vxe-column field="summary" title="摘要" min-width="200" />
                    <template #empty>
                      <div class="m-vxe-table-empty-text">{{EmptyText}}</div>
                    </template>
                  </vxe-table>
                </div>
                <el-pagination
                  @size-change="handleSpareCashSizeChange"
                  @current-change="handleSpareCashCurrentChange"
                  :current-page="spareCashPage.currentPage"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="spareCashPage.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="spareCashPage.total">
                </el-pagination>
              </div>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>备件返利流水</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <el-form :inline="true" class="form-detail" style="display: flex; flex-wrap: nowrap; overflow-x: auto;">
                  <el-form-item label="备件返利期初账户：">
                    {{ form.spareRebateOpeningBalance }}
                  </el-form-item>
                  <el-form-item label="备件返利期末账户：">
                    {{ form.spareRebateClosingBalance }}
                  </el-form-item>
                  <el-form-item label="备件返利期间入账小计：">
                    {{ form.spareRebatePeriodEntry }}
                  </el-form-item>
                  <el-form-item label="备件返利期间使用小计：">
                    {{ form.spareRebatePeriodUsage }}
                  </el-form-item>
                </el-form>
                <div v-loading="spareRebateLoading">
                  <vxe-table
                    ref="spareRebateTableRef"
                    stripe
                    :data="spareRebateData"
                    show-overflow
                    resizable
                    border="inner"
                    size="medium"
                    min-height="0"
                    height="400"
                  >
                    <vxe-column field="serialNo" title="序号" min-width="30" />
                    <vxe-column field="dataCategoryLabel" title="数据分类" min-width="80"/>
                    <vxe-column field="postingDate" title="过账日期" min-width="160" />
                    <vxe-column field="rebateSerialNo" title="返利流水号" min-width="200" />
                    <vxe-column field="transactionTypeLabel" title="交易类型" min-width="100" />
                    <vxe-column field="transactionAmount" title="交易金额" min-width="100" />
                    <vxe-column field="purchaseOrderNo" title="采购订单" min-width="200" />
                    <vxe-column field="deliveryNoteNo" title="出库单" min-width="200" />
                    <vxe-column field="balance" title="余额" min-width="100" />
                    <vxe-column field="remark" title="备注" min-width="120" />
                    <template #empty>
                      <div class="m-vxe-table-empty-text">{{EmptyText}}</div>
                    </template>
                  </vxe-table>
                </div>
                <el-pagination
                  @size-change="handleSpareRebateSizeChange"
                  @current-change="handleSpareRebateCurrentChange"
                  :current-page="spareRebatePage.currentPage"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="spareRebatePage.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="spareRebatePage.total">
                </el-pagination>
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, getVehicleRebateList, getSpareRebateList, getVehicleCashList, getSpareCashList, downloadStatement, confirmStatement, cancelStatement, regenerateStatement } from '@/api/datareport/fund/fundDealerStatementsLetter/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  code: '',
  customerCode: '',
  customerName: '',
  reconYearmonth: '',
  reconStatus: '',
  reconConfirmTime: '',
  reconConfirmUserId: '',
  reconConfirmUserName: '',
  reconConfirmRemark: '',
  cancelReason: '',
  cancelTime: '',
  cancelUserId: '',
  cancelUserName: ''
};

export default {
  name: 'fundDealerStatementsLetterEdit',
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
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '对账单号：' + this.form.code;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          // 使用容器的loadDetail方法加载详情数据，该方法内部会处理子表数据加载
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '经销商对账函',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISDR-fundDealerStatementsLetter',
      loading: false,
      submitLoading: false,
      downloadLoading: false,
      form: { ...form },
      originalForm: { ...form },
      // 整车返利对账流水数据
      vehicleRebateData: [],
      EmptyText: '暂无数据',
      vehicleRebatePage: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 备件返利对账流水数据
      spareRebateData: [],
      spareRebatePage: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 整车现金对账流水数据
      vehicleCashData: [],
      vehicleCashPage: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 备件现金对账流水数据
      spareCashData: [],
      spareCashPage: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 表格加载状态
      vehicleRebateLoading: false,
      vehicleCashLoading: false,
      spareCashLoading: false,
      spareRebateLoading: false
    };
  },
  mounted () {
    // 当进入编辑页面时，如果ID存在，通过detailRequest加载主表数据，然后加载子表数据
    // 注：主表数据加载完成后会在detailRequest中调用loadSubTableData，不需要在此处重复调用
    if (this._id) {
      // 此处无需额外处理，通过父组件edit-base-container调用detailRequest获取数据
    }
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        // 获取主表数据
        return getDetail(id).then(mainRes => {
          // 主表数据加载完成之后再加载子表数据
          this.$nextTick(() => {
            this.loadSubTableData();
          });
          return mainRes;
        });
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 加载子表数据
    loadSubTableData () {
      // 加载整车返利对账流水数据
      this.loadVehicleRebateData();
      // 加载备件返利对账流水数据
      this.loadSpareRebateData();
      // 加载整车现金对账流水数据
      this.loadVehicleCashData();
      // 加载备件现金对账流水数据
      this.loadSpareCashData();
    },
    // 加载整车返利对账流水数据
    loadVehicleRebateData () {
      this.vehicleRebateLoading = true;
      const params = {
        dealerReconLetterId: this._id,
        pageNum: this.vehicleRebatePage.currentPage,
        pageSize: this.vehicleRebatePage.pageSize,
        sortColumns: [{ column: 'serial_no', sort: 'ASC' }] // 按序号升序排列
      };
      getVehicleRebateList(params).then(res => {
        this.vehicleRebateData = res.records || [];
        this.vehicleRebatePage.total = res.total || 0;
      }).catch(error => {
        console.error('加载整车返利对账流水数据失败:', error);
        this.vehicleRebateData = [];
        this.vehicleRebatePage.total = 0;
      }).finally(() => {
        this.vehicleRebateLoading = false;
      });
    },
    // 加载备件返利对账流水数据
    loadSpareRebateData () {
      this.spareRebateLoading = true;
      const params = {
        dealerReconLetterId: this._id,
        pageNum: this.spareRebatePage.currentPage,
        pageSize: this.spareRebatePage.pageSize,
        sortColumns: [{ column: 'serial_no', sort: 'ASC' }] // 按序号升序排列
      };
      getSpareRebateList(params).then(res => {
        this.spareRebateData = res.records || [];
        this.spareRebatePage.total = res.total || 0;
      }).catch(error => {
        console.error('加载备件返利对账流水数据失败:', error);
        this.spareRebateData = [];
        this.spareRebatePage.total = 0;
      }).finally(() => {
        this.spareRebateLoading = false;
      });
    },
    // 加载整车现金对账流水数据
    loadVehicleCashData () {
      this.vehicleCashLoading = true;
      const params = {
        storeReconLetterId: this._id,
        pageNum: this.vehicleCashPage.currentPage,
        pageSize: this.vehicleCashPage.pageSize,
        sortColumns: [{ column: 'serial_no', sort: 'ASC' }] // 按序号升序排列
      };
      getVehicleCashList(params).then(res => {
        this.vehicleCashData = res.records || [];
        this.vehicleCashPage.total = res.total || 0;
      }).catch(error => {
        console.error('加载整车现金对账流水数据失败:', error);
        this.vehicleCashData = [];
        this.vehicleCashPage.total = 0;
      }).finally(() => {
        this.vehicleCashLoading = false;
      });
    },
    // 加载备件现金对账流水数据
    loadSpareCashData () {
      this.spareCashLoading = true;
      const params = {
        dealerReconLetterId: this._id,
        pageNum: this.spareCashPage.currentPage,
        pageSize: this.spareCashPage.pageSize,
        sortColumns: [{ column: 'serial_no', sort: 'ASC' }] // 按序号升序排列
      };
      getSpareCashList(params).then(res => {
        this.spareCashData = res.records || [];
        this.spareCashPage.total = res.total || 0;
      }).catch(error => {
        console.error('加载备件现金对账流水数据失败:', error);
        this.spareCashData = [];
        this.spareCashPage.total = 0;
      }).finally(() => {
        this.spareCashLoading = false;
      });
    },
    // 整车返利对账流水 - 每页数量改变
    handleVehicleRebateSizeChange (pageSize) {
      this.vehicleRebatePage.pageSize = pageSize;
      this.vehicleRebatePage.currentPage = 1; // 重置到第一页
      this.loadVehicleRebateData();
    },
    // 整车返利对账流水 - 当前页改变
    handleVehicleRebateCurrentChange (currentPage) {
      this.vehicleRebatePage.currentPage = currentPage;
      this.loadVehicleRebateData();
    },
    // 备件返利对账流水 - 每页数量改变
    handleSpareRebateSizeChange (pageSize) {
      this.spareRebatePage.pageSize = pageSize;
      this.spareRebatePage.currentPage = 1; // 重置到第一页
      this.loadSpareRebateData();
    },
    // 备件返利对账流水 - 当前页改变
    handleSpareRebateCurrentChange (currentPage) {
      this.spareRebatePage.currentPage = currentPage;
      this.loadSpareRebateData();
    },
    // 整车现金对账流水 - 每页数量改变
    handleVehicleCashSizeChange (pageSize) {
      this.vehicleCashPage.pageSize = pageSize;
      this.vehicleCashPage.currentPage = 1; // 重置到第一页
      this.loadVehicleCashData();
    },
    // 整车现金对账流水 - 当前页改变
    handleVehicleCashCurrentChange (currentPage) {
      this.vehicleCashPage.currentPage = currentPage;
      this.loadVehicleCashData();
    },
    // 备件现金对账流水 - 每页数量改变
    handleSpareCashSizeChange (pageSize) {
      this.spareCashPage.pageSize = pageSize;
      this.spareCashPage.currentPage = 1; // 重置到第一页
      this.loadSpareCashData();
    },
    // 备件现金对账流水 - 当前页改变
    handleSpareCashCurrentChange (currentPage) {
      this.spareCashPage.currentPage = currentPage;
      this.loadSpareCashData();
    },
    getDefautlForm () {
      return {
        ...defaultForm
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
    handleDownload () {
      this.downloadLoading = true;
      downloadStatement(this._id).then(blob => {
        // blob 本身就是文件数据，不是 res.data
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // 获取当前时间并格式化
        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

        link.download = `经销商对账函_${timestamp}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // 显示下载成功提示
        this.$message.success('下载成功！');
      }).catch(error => {
        console.error('下载失败:', error);
        this.$message.error('下载失败，请重试！');
      }).finally(() => {
        // 确保无论成功或失败都关闭loading状态
        this.downloadLoading = false;
      });
    },
    // 确认对账单
    handleConfirm () {
      if (!this._id) {
        this.$message.error('对账单ID不存在');
        return;
      }
      this.$prompt('确认备注', '确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入确认备注',
      }).then(({ value }) => {
        confirmStatement({ id: this._id, reconConfirmRemark: value }).then(res => {
          this.$message({
            type: 'success',
            message: '确认成功!'
          });
          // 刷新详情数据
          this.$refs.containerRef && this.$refs.containerRef.loadDetail();
        });
      });
    },
    // 作废对账单
    handleCancel () {
      if (!this._id) {
        this.$message.error('对账单ID不存在');
        return;
      }
      this.$prompt('作废原因', '作废', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入作废原因',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const inputValue = instance.inputValue;
            if (!inputValue || inputValue.trim() === '') {
              this.$message.error('作废原因不能为空！');
              return;
            }
            // 可选：去除首尾空格后保存
            instance.inputValue = inputValue.trim();
            done();
          } else {
            done();
          }
        }
      }).then(({ value }) => {
        cancelStatement({ id: this._id, cancelReason: value }).then(res => {
          this.$message.success('作废成功!');
          // 刷新详情数据
          this.$refs.containerRef && this.$refs.containerRef.loadDetail();
        });
      });
    },
    // 重新生成对账单
    handleRegenerate () {
      if (!this._id) {
        this.$message.error('对账单ID不存在');
        return;
      }
      this.$confirm('确认要重新生成对账单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 立即显示"生成中"消息
        this.$message({
          type: 'info',
          message: '对账单重新生成中...请稍后再查看...',
        });

        // 异步执行重新生成操作
        regenerateStatement(this._id).then(res => {
          this.$message({
            type: 'success',
            message: '对账单重新生成成功!'
          });
          // 刷新详情数据
          this.$refs.containerRef && this.$refs.containerRef.loadDetail();
        });
      });
    }
  }
};
</script>
