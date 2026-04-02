<template>
  <div class="page-common m-vr-groupbuy-enterprise-policy-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="公司名称">
        <fetch-select
          :remote-method="queryCompanyList"
          remote
          v-model="form.companyId"
          :params="form.companyName"
          value-key="id"
          label-key="name"
          placeholder="请选择公司"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="车系">
        <fetch-select
          filterable
          clearable
          remote
          v-model="form.seriesId"
          :params="form.seriesName"
          :remote-method="getVehicleSeriesList"
          value-key="id"
          label-key="name"
        />
      </el-form-item>
      <el-form-item label="优惠券">
        <el-input
          placeholder="请输入"
          v-model="form.couponName"
          clearable
        />
      </el-form-item>
      <el-form-item label="有效开始时间">
        <el-date-picker
         :default-time="['00:00:00', '23:59:59']"
          v-model="form.validStartTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="有效截止时间">
        <el-date-picker
         :default-time="['00:00:00', '23:59:59']"
          v-model="form.validEndTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <page-search-action
        v-if="canList"
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
import { getList } from '@/api/vehretail/orderManager/vrGroupbuyEnterprisePolicy/index';
import { getTableConfig, exportTable, vehicleSeriesList } from '@/api/common';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import FetchSelect from '@/libs/components/FetchSelect';
import { getSelect } from '@/api/vehretail/orderManager/vrGroupbuyEnterpriseCustomer/index';

const defaultForm = {
  companyName: '',
  seriesName: '',
  couponName: '',
  validStartTime: '',
  validEndTime: ''
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
    EditPage,
    FetchSelect
  },
  data () {
    return {
      pageTitle: '团购企业优惠政策',
      pageType: 'list',
      moduleKey: 'AISVR-vrGroupbuyEnterprisePolicy',
      form: {
        ...defaultForm
      },
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      optionObj: {
        id: 'vrGroupbuyEnterprisePolicyTable',
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
                  path: '/vehretail/orderManager/vrGroupbuyEnterprisePolicy/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'seriesName',
            label: '车系',
            visible: true,
            width: 150,
            buttons: [{
              click: (rowIndex, row) => {
                this.navigateToRoute({
                  path: '/datacenter/materials/vehicleSeries/detail',
                  query: {
                    id: row.seriesId
                  }
                }, true);
              },
              type: 'primary'
            }]
          },
          { props: 'couponName', label: '优惠券', visible: true, width: 150 },
          { props: 'discountAmount', label: '优惠金额', visible: true, width: 120 },
          { props: 'validStartTime', label: '有效开始时间', visible: true, width: 180 },
          { props: 'validEndTime', label: '有效截止时间', visible: true, width: 180 },
          { props: 'creatorName', label: '负责人', visible: true, width: 120 },
          { props: 'remark', label: '备注', visible: true, width: 150 },
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
        path: '/vehretail/orderManager/vrGroupbuyEnterprisePolicy/edit'
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
        businessType: '团购企业优惠政策',
        dataFetchPath: 'vehretail/web/orderManager/vrGroupbuyEnterprisePolicy/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '团购企业优惠政策.xlsx');
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

      if (this.form.validStartTime) {
        delete data.validStartTime;
        if (this.form.validStartTime.length > 1) {
          data.validStartTimeStart = this.form.validStartTime[0];
          data.validStartTimeEnd = this.form.validStartTime[1];
        }
      }
      if (this.form.validEndTime) {
        delete data.validEndTime;
        if (this.form.validEndTime.length > 1) {
          data.validEndTimeStart = this.form.validEndTime[0];
          data.validEndTimeEnd = this.form.validEndTime[1];
        }
      }

      data.sortColumns = this.sortColumns;
      return data;
    },
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async queryCompanyList (params) {
      const res = await getSelect({ companyName: params, limitSize: 10 });
      return res || [];
    }
  }
};
</script>

<style lang="scss" scoped>
.m-vr-groupbuy-enterprise-policy-list {
}
</style>
