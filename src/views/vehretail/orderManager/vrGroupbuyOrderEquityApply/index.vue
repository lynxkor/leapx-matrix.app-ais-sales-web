<template>
  <div class="page-common m-vr-groupbuy-order-equity-apply-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="商城订单号">
        <el-input
          placeholder="请输入"
          v-model="form.mallOrderCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="订单物料码">
        <el-input
          placeholder="请输入"
          v-model="form.orderMaterialsCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="车型">
        <el-input
          placeholder="请输入"
          v-model="form.modelName"
          clearable
        />
      </el-form-item>
      <el-form-item label="车系">
        <el-input
          placeholder="请输入"
          v-model="form.seriesName"
          clearable
        />
      </el-form-item>
      <el-form-item label="销售门店">
        <el-input
          placeholder="请输入"
          v-model="form.dealerName"
          clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="申请单状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="groupbuy_audit_status"
            v-model="form.auditStatus"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="合作类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="cooperation_type"
            v-model="form.cooperationType"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input
            placeholder="请输入"
            v-model="form.companyName"
            clearable
          />
        </el-form-item>
        <el-form-item label="购车人手机号">
          <el-input
            placeholder="请输入"
            v-model="form.buyerPhone"
            clearable
          />
        </el-form-item>
        <el-form-item label="购车人姓名">
          <el-input
            placeholder="请输入"
            v-model="form.buyerName"
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
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-page
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        @paginationChange="paginationChange"
        @listSelect="handleListSelect"
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/vehretail/orderManager/vrGroupbuyOrderEquityApply/index';
import { getTableConfig, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  mallOrderCode: '',
  orderMaterialsCode: '',
  modelName: '',
  seriesName: '',
  dealerName: '',
  auditStatus: '',
  cooperationType: '',
  companyName: '',
  buyerPhone: '',
  buyerName: ''
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage
  },
  data () {
    return {
      pageTitle: '整车零售-订单管理-团购订单权益申请管理',
      pageType: 'list',
      moduleKey: 'AISVR-vrGroupbuyOrderEquityApply',
      form: {
        ...defaultForm
      },
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      optionObj: {
        id: 'vrGroupbuyOrderEquityApplyTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '团购订单权益申请编号',
            visible: true,
            width: 220,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/vrGroupbuyOrderEquityApply/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'auditStatusLabel', label: '申请单状态', visible: true, width: 120 },
          { props: 'dealerName', label: '销售门店', visible: true, width: 150 },
          { props: 'cooperationTypeLabel', label: '合作类型', visible: true, width: 120 },
          { props: 'regionName', label: '所属区域或部门', visible: true, width: 150 },
          { props: 'applicant', label: '申请人', visible: true, width: 120 },
          { props: 'applicationTime', label: '申请日期', visible: true, width: 180 },
          { props: 'mallOrderCode', label: '商城订单号', visible: true, width: 200 },
          { props: 'orderMaterialsCode', label: '订单物料码', visible: true, width: 200 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'buyerName', label: '购车人姓名', visible: true, width: 120 },
          { props: 'buyerPhone', label: '购车人手机号', visible: true, width: 150 },
          { props: 'userId', label: '下单人ID', visible: true, width: 150 },
          { props: 'companyName', label: '公司名称', visible: true, width: 150 },
          { props: 'modelName', label: '车型', visible: true, width: 120 },
          { props: 'seriesName', label: '车系', visible: true, width: 120 },
          { props: 'couponName', label: '优惠券', visible: true, width: 120 },
          { props: 'discountAmount', label: '优惠金额', visible: true, width: 120 },
          { props: 'submitTime', label: '提交日期', visible: true, width: 180 },
          { props: 'firstAuditTime', label: '初审时间', visible: true, width: 180 },
          { props: 'reviewAuditTime', label: '复审时间', visible: true, width: 180 },
          { props: 'finalAuditTime', label: '终审时间', visible: true, width: 180 },
          { props: 'remark', label: '备注', visible: true, width: 150 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 150,
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/vrGroupbuyOrderEquityApply/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      sortColumns: []
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleAdd () {
      this.$router.push({
        path: '/vehretail/orderManager/vrGroupbuyOrderEquityApply/edit'
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
      exportTable({
        businessType: '整车零售-订单管理-团购订单权益申请管理',
        dataFetchPath: 'vehretail/web/orderManager/vrGroupbuyOrderEquityApply/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车零售-订单管理-团购订单权益申请管理.xlsx');
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
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });
      data.sortColumns = this.sortColumns;
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.m-vr-groupbuy-order-equity-apply-list {
}
</style>
