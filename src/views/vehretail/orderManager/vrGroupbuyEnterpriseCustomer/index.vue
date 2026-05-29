<template>
  <div class="page-common m-vr-groupbuy-enterprise-customer-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="公司名称">
        <el-input
          placeholder="请输入"
          v-model="form.companyName"
          clearable
        />
      </el-form-item>
      <el-form-item label="是否合作">
        <fetch-select
          :options="yes_no_enum"
          v-model="form.isCooperation"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="团购企业类型">
        <fetch-select
          :request="fetchOptions"
          enumCode="vr_group_company_type"
          v-model="form.groupCompanyType"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="联系人">
          <el-input
            placeholder="请输入"
            v-model="form.contactPerson"
            clearable
          />
        </el-form-item>
        <el-form-item label="联系人手机号码">
          <el-input
            placeholder="请输入"
            v-model="form.contactPhone"
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
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, getDecryptField } from '@/api/vehretail/orderManager/vrGroupbuyEnterpriseCustomer/index';
import { getTableConfig, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  companyName: '',
  isCooperation: '',
  groupCompanyType: '',
  contactPerson: '',
  contactPhone: ''
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
      pageTitle: '团购企业客户',
      pageType: 'list',
      moduleKey: 'AISVR-vrGroupbuyEnterpriseCustomer',
      form: {
        ...defaultForm
      },
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      yes_no_enum: YES_NO_ENUM,
      optionObj: {
        id: 'vrGroupbuyEnterpriseCustomerTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'companyName',
            label: '公司名称',
            visible: true,
            width: 240,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/vrGroupbuyEnterpriseCustomer/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'isCooperationLabel', label: '是否合作', visible: true, width: 120 },
          { props: 'contactPerson', label: '联系人', visible: true, width: 120, mask: true, getValue: (row) => getDecryptField(row.id, 'contactPerson') },
          { props: 'contactPhone', label: '联系人手机号码', visible: true, width: 150, mask: true, getValue: (row) => getDecryptField(row.id, 'contactPhone') },
          { props: 'groupCompanyTypeLabel', label: '团购企业类型', visible: true, width: 150 },
          { props: 'remark', label: '备注', visible: true, width: 150 },
          { props: 'creatorName', label: '创建人', visible: true, width: 120 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180, fixed: 'right', sortable: true }
        ],
        total: 0
      },
      sortColumns: [
        {
          column: 'create_time',
          sort: 'DESC'
        }
      ]
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
        path: '/vehretail/orderManager/vrGroupbuyEnterpriseCustomer/edit'
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
        businessType: '团购企业客户',
        dataFetchPath: 'vehretail/web/orderManager/vrGroupbuyEnterpriseCustomer/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '团购企业客户.xlsx');
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
    },
  }
};
</script>
<style lang="scss" scoped>
.m-vr-groupbuy-enterprise-customer-list {
}
</style>
