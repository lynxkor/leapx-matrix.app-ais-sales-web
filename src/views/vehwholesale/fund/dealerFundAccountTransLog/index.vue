<template>
  <div class="page-common m-account-translog-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="过账时间">
        <dateranges
          v-model="form.transactionTime"
          :setDefault="true"
          deftTime="最近一周"
          ref="transactionTime"/>
        <!-- <el-date-picker
         :default-time="['00:00:00', '23:59:59']"
          v-model="form.transactionTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        /> -->
      </el-form-item>
      <el-form-item label="母公司名称">
        <tag-input v-model="form.dealerCompanyNames" placeholder="请输入" />
        <!-- <el-input
          placeholder="请输入"
          v-model="form.dealerCompanyName"
          clearable
        /> -->
      </el-form-item>
      <!-- <el-form-item label="流水编号">
        <el-input
          placeholder="请输入"
          v-model="form.transLogCode"
          clearable
        />
      </el-form-item> -->
      <el-form-item label="资金类型"  v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="vw_fundtype"
          v-model="form.fundTypes"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="金融机构">
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
        <el-form-item label="母公司编码">
          <tag-input v-model="form.dealerComapnyCodes" placeholder="请输入" />
          <!-- <el-input
            placeholder="请输入"
            v-model="form.dealerComapnyCode"
            clearable
          /> -->
        </el-form-item>
        <el-form-item label="交易类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_transaction_type"
            v-model="form.transactionTypes"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="VIN号">
          <tag-input v-model="form.vins" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="整车批售订单">
          <tag-input v-model="form.wholesaleOrderCodes" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="企业客户整车订单">
          <tag-input v-model="form.entVehorderCodes" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="交车单">
          <tag-input v-model="form.deliveryOrderCodes" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="入账凭证号">
          <tag-input v-model="form.transactionReceiptCodes" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            placeholder="请输入"
            v-model="form.remark"
            clearable
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
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button> -->
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
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehwholesale/fund/accountTranslog/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import dateranges from '@/libs/components/dateranges';
import TagInput from '@/libs/components/TagInput';
import { listIdNames } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  dealerCompanyNames: [],
  dealerComapnyCodes: [],
  transLogCode: '',
  fundTypes: [],
  financialOrganizationId: '',
  transactionTypes: [],
  transactionAmount: '',
  transactionTime: [],
  transactionReceiptCode: '',
  remark: '',
  vin: '',
  vins: [],
  transactionReceiptCodes: [],
  deliveryOrderIds: [],
  entVehorderIds: [],
  wholesaleOrderIds: [],
  // vins: [],
  wholesaleOrderId: '',
  deliveryOrderId: '',
  dealerName: '',
  dealerCompanyName: '',
  dealerComapnyCode: '',
  fundAccountId: '',
  createTime: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    TagInput,
    dateranges,
    PageSearchAction,
    LPVxeTable,
    FetchSelect
  },
  data () {
    return {
      pageTitle: '整车资金账户交易流水',
      pageType: 'list',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-dealerFundAccountTransLog',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      optionObj: {
        id: 'accountTranslogTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'transLogCode',
            label: '流水编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/fund/dealerFundAccountTransLog/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'fundTypeLabel', label: '资金类型', visible: true, width: 100 },
          {
            props: 'financialOrganizationName',
            label: '金融机构',
            visible: true,
            width: 100,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/fund/fundFinancialOrganization/detail',
                  query: {
                    id: row.financialOrganizationId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'transactionTypeLabel', label: '交易类型', visible: true, width: 100 },
          { props: 'transactionAmount', label: '交易金额', visible: true, width: 100 },
          { props: 'transactionTime', label: '过账时间', visible: true, width: 200 },
          { props: 'transactionReceiptCode', label: '交易凭证号', visible: true, width: 200 },
          { props: 'lineNo', label: '行项目号', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'vin', label: '整车VIN编码', visible: true, width: 200 },
          {
            props: 'wholesaleOrderCode',
            label: '整车批售订单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit?id=${row.wholesaleOrderId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'entVehorderCode',
            label: '企业客户整车订单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/vehwholesale/entorder/entVehicleOrder/edit?id=${row.entVehorderId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'deliveryOrderCode', label: '交车单', visible: true, width: 200 },
          {
            props: 'dealerName',
            label: '门店名称',
            visible: true,
            width: 240,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/partner/channelManagement/shopDetail',
                  query: {
                    dealerCode: row.dealerCode,
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dealerCompanyName', label: '母公司名称', visible: true, width: 260 },
          { props: 'dealerComapnyCode', label: '母公司编码', visible: true, width: 150 },
          { props: 'fundAccountCode', label: '账户编号', visible: true, width: 200 },
          { props: 'saleCompanyName', label: '销售公司', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 }
        ],
        total: 0
      }
    };
  },
  async created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    await this.transactionTypes();
    this.getData();
  },
  methods: {
    async transactionTypes () {
      try {
        const res = await getEnum('vw_transaction_type');
        console.log('transactionTypes:', res);
        const codes = res
          .map(item => item.code)
          .filter(code => code !== '2' && code !== '5');
        this.form.transactionTypes = codes;
      } catch (error) {
        console.log('transactionTypes error:', error);
      }
    },
    repairItemSearch (query) { return listIdNames({ organizationNameLike: query, status: 1 }); },
    handleAdd () {
      this.$router.push({
        path: '/vehwholesale/fund/dealerFundAccountTransLog/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '整车资金账户交易流水',
        dataFetchPath: '/vw/web/fund/dealerFundAccountTransLog/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车资金账户交易流水.xlsx');
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
      if (this.form.transactionTime && this.form.transactionTime.length === 2) {
        data.transactionTimeStart = this.form.transactionTime[0];
        data.transactionTimeEnd = this.form.transactionTime[1];
        delete data.transactionTime;
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
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">此操作将永久删除, 是否继续</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
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
.m-account-translog-list {
}
</style>
