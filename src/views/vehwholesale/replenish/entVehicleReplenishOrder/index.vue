<template>
  <div class="page-common m-ent-vehicle-replenish-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="企业客户名称">
        <fetch-select
              :remote-method="listNetworkParentCompany"
              remote
              v-model="form.entCustomerCodes"
              placeholder="请选择"
              labelKey="companyName"
              valueKey="companyCode"
              clearable
              collapseTags
              filterable
              multiple
        />
      </el-form-item>
      <el-form-item label="销售公司">
        <fetch-select
            filterable
            clearable
            remote
            multiple
            v-model="form.saleCompanyIds"
            :params="form.saleCompanyName"
            :remote-method="getCompanyList"
            value-key="id"
            label-key="companyName"
          />
        </el-form-item>
           <el-form-item label="审核状态" v-show="this.visibleCount === 3 || show">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_ent_vehicle_replenish_order_audit_status"
            v-model="form.auditStatuses"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
      <template v-if="show">
         <el-form-item label="订单分类">
           <fetch-select
              :options="orderCategoryOptions"
              v-model="form.orderCategories"
              placeholder="请选择订单分类"
              clearable
              multiple
              filterable
            />
      </el-form-item>
       <el-form-item label="结算资金类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_fundtype"
            v-model="form.settleFundTypes"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
         <el-form-item label="金融机构">
           <fetch-select
            :remote-method="repairItemSearch"
            remote
            multiple
            reserve-keyword
            labelKey="organizationName"
            valueKey="organizationCode"
            v-model="form.fundFinancialOrganizationCodes"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="订单时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.orderTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="验收方式">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_acceptance_method"
            v-model="form.acceptanceMethods"
            placeholder="请选择"
            clearable
            multiple
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
        <el-dropdown trigger="click" style="margin: 0 10px;" @command="handleAdd">
        <el-button size="small" type="primary" @click="showDropdown">
          {{ dropdownLoading ? '加载中...' : '企业客户补货订单' }}
          <i class="iconfont icon-lxppc-down" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in validatedOrderategoryList"
            :key="index"
            :command="item.code">
            {{ item.message }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button> -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
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
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, networkParentCompanyItem, listDealersForParentCompany } from '@/api/vehwholesale/replenish/entVehicleReplenishOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import { getList as fundGetList } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import { getList as companyList } from '@/api/vehwholesale/fund/fundSaleCompany/index';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  entCustomerName: '',
  orderCategory: '',
  acceptanceMethod: '',
  settleFundTypes: ['1010'],
  financialOrganizationId: '',
  orderTime: '',
  auditStatus: '',
  saleCompanyId: '',
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
    EditPage,
    Upload
  },
  data () {
    return {
      pageTitle: '企业客户补货订单',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-entVehicleReplenishOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      orderCategoryOptions: [],
      orderategoryList: [],
      validatedOrderategoryList: [],
      saleCompanyOptions: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      dropdownLoading: false,
      clickItemId: '',
      optionObj: {
        id: 'entVehicleReplenishOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'entReplenishOrderCode',
            label: '企业客户补货订单编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/replenish/entVehicleReplenishOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'entCustomerName', label: '企业客户名称', visible: true, width: 200 },
          { props: 'saleCompanyId', label: '销售公司', visible: true, width: 200 },
          { props: 'orderCategoryLabel', label: '订单分类', visible: true, width: 200 },
          { props: 'settleFundTypeLabel', label: '结算资金类型', visible: true, width: 200 },
          { props: 'financialOrganizationId', label: '金融机构', visible: true, width: 200 },
          { props: 'orderTime', label: '订单时间', visible: true, width: 200 },
          { props: 'pickupContactName', label: '接车联系人', visible: true, width: 200 },
          { props: 'pickupContactMobile', label: '接车联系电话', visible: true, width: 200 },
          { props: 'provinceName', label: '省', visible: true, width: 200 },
          { props: 'cityName', label: '市', visible: true, width: 200 },
          { props: 'districtName', label: '区县名称', visible: true, width: 200 },
          { props: 'address', label: '交车地址', visible: true, width: 200 },
          { props: 'longitude', label: '经度', visible: true, width: 200 },
          { props: 'latitude', label: '维度', visible: true, width: 200 },
          { props: 'remark', label: '订单备注', visible: true, width: 200 },
          { props: 'auditorName', label: '审核人', visible: true, width: 200 },
          { props: 'auditTime', label: '审核时间', visible: true, width: 200 },
          { props: 'auditStatusLabel', label: '审核状态', visible: true, width: 200 },
          { props: 'auditOpinion', label: '审核意见', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/replenish/entVehicleReplenishOrder/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '删除',
              popconfirmTitle: '此操作将永久删除, 是否继续?',
              click: (rowIndex, row) => {
                deleteItem([row.id]).then(() => {
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
              },
              type: 'danger'
            }]
          }
        ],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.fetchOrderCategoryOptions();
    this.getData();
    this.listNetworkParentCompany();
    this.getCompanyList();
  },
  methods: {
    getCompanyList (query) {
      return companyList({ companyNameLike: query, status: 1 });
    },
    async showDropdown () {
      this.dropdownLoading = true;
      try {
        // 又不要校验了
        // await createRequestValid();
        this.dropdownLoading = false;
        this.validatedOrderategoryList = [...this.orderCategoryOptions];
      } catch (error) {
        this.dropdownLoading = false;
        this.validatedOrderategoryList = [];
      }
    },
    async listNetworkParentCompany (query) {
      return networkParentCompanyItem({ parentCompanyName: query, pageNum: 1, pageSize: 20 });
    },
    async fetchOrderCategoryOptions () {
      const response = await getEnum('vw_eordertype');
      this.orderCategoryOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['1', '8', '21'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    async repairItemSearch (query) {
      return fundGetList({ organizationNameLike: query, status: 1 });
    },
    // 排序
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
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd (code) {
      this.$router.push({
        path: '/vehwholesale/replenish/entVehicleReplenishOrder/edit',
        query: {
          orderCategory: code
        }
      });
    },
    onSubmit () {
      console.log('onSubmit', this.form);
      if (this.form.settleFundTypes.length > 0 && this.form.settleFundTypes.includes('2010') && this.form.fundFinancialOrganizationCodes.length === 0) {
        return this.$message({
          type: 'error',
          message: '结算资金类型选择【融资】，金融机构必填!'
        });
      }
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
        businessType: '整车销售-企业客户订单-企业客户补货订单管理',
        dataFetchPath: 'vw/web/replenish/entVehicleReplenishOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '企业客户补货订单管理.xlsx');
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

      // 订单时间
      if (this.form.orderTime) {
        delete data.orderTime;
        if (this.form.orderTime.length > 1) {
          data.orderTimeStart = this.form.orderTime[0];
          data.orderTimeEnd = this.form.orderTime[1];
        }
      }
      // 排序字段
      data.sortColumns = this.sortColumns;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-ent-vehicle-replenish-order-list {
}
</style>
