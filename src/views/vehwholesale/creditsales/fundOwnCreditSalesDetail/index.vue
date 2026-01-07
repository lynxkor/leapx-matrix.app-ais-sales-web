<template>
  <div class="page-common m-fund-own-credit-sales-detail-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
    <el-form-item label="母公司名称">
      <tag-input v-model="form.dealerCompanyCodes" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="创建时间">
        <dateranges
          v-model="form.createTime"
          :setDefault="true"
          deftTime="最近一月"
        />
      <!-- <el-date-picker
        :default-time="['00:00:00', '23:59:59']"
        v-model="form.createTime"
        type="daterange"
        :picker-options="pickerOptions"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      /> -->
    </el-form-item>
    <template v-if="show">
      <el-form-item label="VIN">
      <tag-input v-model="form.vins" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="门店名称">
      <tag-input v-model="form.dealerNames" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="整车批售订单">
        <tag-input v-model="form.wholesaleOrderCodes" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="企业客户整车订单">
        <tag-input v-model="form.entVehorderCodes" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="赊销天数下限">
          <el-input
            placeholder="请输入"
            v-model="form.mincreditSalesDays"
            clearable
          />
        </el-form-item>
        <el-form-item label="赊销天数上限">
          <el-input
            placeholder="请输入"
            v-model="form.maxcreditSalesDays"
            clearable
          />
        </el-form-item>
        <el-form-item label="是否还款">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.useRebate"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="StatusEnum"
            v-model="form.statusInclude"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
      </template>
      <page-search-action
        v-if="canList"
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button> -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
    </div>
    <div
      class="ais-table-c"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-page
        checkboxFixed
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @listSelect="handleListSelect"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehwholesale/creditsales/fundOwnCreditSalesDetail/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getParentCompany } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import dateranges from '@/libs/components/dateranges';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  id: '',
  creator: '',
  createTime: [],
  statusInclude: '1'
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    dateranges,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload,
    TagInput
  },
  data () {
    return {
      pageTitle: '账户管理-赊销管理-自有资金赊销明细管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundOwnCreditSalesDetail',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'fundOwnCreditSalesDetailTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'creditSalesDetailCode',
            label: '赊销明细编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dealerCompanyName', label: '母公司名称', visible: true, width: 200 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'wholesaleOrderCode', label: '整车批售订单', visible: true, width: 200 },
          { props: 'entVehorderId', label: '企业客户整车订单ID', visible: true, width: 200 },
          { props: 'vin', label: '整车VIN编码', visible: true, width: 200 },
          { props: 'wholesalePrice', label: '批售价/折扣价', visible: true, width: 200 },
          { props: 'cashAmount', label: '现金金额', visible: true, width: 200 },
          { props: 'rebateAmount', label: '返利金额', visible: true, width: 200 },
          { props: 'downPaymentRatio', label: '首付款比例%', visible: true, width: 200 },
          { props: 'creditSalesAmount', label: '赊销金额', visible: true, width: 200 },
          { props: 'creditSalesTime', label: '赊销时间', visible: true, width: 200 },
          { props: 'creditSalesDays', label: '赊销天数', visible: true, width: 200 },
          { props: 'repaymentTime', label: '还款时间', visible: true, width: 200 },
          { props: 'creditSalesFee', label: '赊销费用', visible: true, width: 200 },
          { props: 'certificateRedemptionApplyId', label: '合格证赎回申请', visible: true, width: 200 },
          { props: 'overdueFee', label: '超期赊销费用', visible: true, width: 200 },
          { props: 'penaltyFee', label: '违约金', visible: true, width: 200 },
          { props: 'voucherNo', label: '凭证号', visible: true, width: 200 },
          { props: 'creatorName', label: '创建人', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'modifierName', label: '更新人', visible: true, width: 200 },
          { props: 'updateTime', label: '更新时间', visible: true, width: 200 },
          // { props: 'creatorName', label: '创建者名称', visible: true, width: 200 },
          // { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          // { props: 'remark', label: '备注（说明）', visible: true, width: 200 },
          // { props: 'status', label: '状态', visible: true, width: 200 },
          // { props: 'statusDesc', label: '状态变更描述', visible: true, width: 200 },
          // { props: 'dealerCompanyCode', label: '母公司编码', visible: true, width: 200 },
          // { props: 'dealerCode', label: '门店编码', visible: true, width: 200 },
          // { props: 'repaymentFlag', label: '是否还款', visible: true, width: 200 },
          // { props: 'repaymentAmount', label: '还款金额', visible: true, width: 200 },
          // { props: 'wholesaleOrderId', label: '批售订单ID', visible: true, width: 200 },
          // { props: 'fundAccountId', label: '关联资金账户ID', visible: true, width: 200 },
          // {
          //   props: 'operate',
          //   label: '操作',
          //   type: 'operate',
          //   visible: true,
          //   fixed: 'right',
          //   buttons: [{
          //     name: '编辑',
          //     click: (rowIndex, row) => {
          //       this.$router.push({
          //         path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail/edit',
          //         query: {
          //           id: row.id
          //         }
          //       });
          //     },
          //     type: 'info'
          //   }, {
          //     name: '删除',
          //     popconfirmTitle: '此操作将永久删除, 是否继续?',
          //     click: (rowIndex, row) => {
          //       deleteItem([row.id]).then(() => {
          //         this.$message({
          //           type: 'success',
          //           message: '删除成功!'
          //         });
          //         this.getData();
          //       }).catch(() => {
          //         this.$message({
          //           type: 'error',
          //           message: '删除失败!'
          //         });
          //       });
          //     },
          //     type: 'danger'
          //   }]
          // }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail/edit'
      });
    },
    onSubmit () {
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.form.createTime = [];
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: '账户管理-赊销管理-自有资金赊销明细管理',
        dataFetchPath: 'vehwholesale/web/creditsales/fundOwnCreditSalesDetail/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '账户管理-赊销管理-自有资金赊销明细管理.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$message({
            type: 'info',
            message: '请前往导出列表中查询导出结果'
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }

      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(ids).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        });
      }).catch(() => {});
    },
    async getParentCompany (query) {
      try {
        return await getParentCompany({ parentCompanyName: query });
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
      // const ids = this.selectionList.map(item => item.id) || [];
      // this.$confirm(`此操作将${status ? '启用' : '停用'}选中项，是否继续?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   enableItem({
      //     idSet: ids,
      //     status
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '操作成功!'
      //     });
      //     this.getData();
      //   }).catch(() => {
      //     this.$message({
      //       type: 'error',
      //       message: '操作失败!'
      //     });
      //   });
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-fund-own-credit-sales-detail-list {
}
</style>
