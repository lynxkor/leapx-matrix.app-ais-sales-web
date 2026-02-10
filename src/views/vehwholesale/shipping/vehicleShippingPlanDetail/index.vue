<template>
  <div class="page-common m-vehicle-shipping-plan-detail-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="发运明细">
        <tag-input v-model="form.shippingPlanDetailCodes" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="承运记录编码">
        <tag-input v-model="form.carrierRecordCodes" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="VIN码">
        <tag-input v-model="form.vins" placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="大区">
          <tag-input v-model="form.regionNames" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="销售门店">
          <tag-input v-model="form.saleDealerCodes" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="车系ID">
          <el-input
            placeholder="请输入"
            v-model="form.seriesId"
            clearable
          />
        </el-form-item>
        <el-form-item label="数据来源">
          <el-input
            placeholder="请输入"
            v-model="form.dataSource"
            clearable
          />
        </el-form-item>
        <el-form-item label="合格证发运方式">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_deliverytype"
            v-model="form.certificateShippingWay"
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
                labelKey="name"
                valueKey="id"
                v-model="form.fundFinancialOrganizationIds"
                placeholder="请选择"
                clearable
                filterable
            />
        </el-form-item>
        <el-form-item label="是否发运">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.shipped"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="批售方式">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_wholesale_way"
            v-model="form.wholesaleWays"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="合作类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="ws_cooperation_type"
            v-model="form.cooperateType"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="指定发运方式">
          <fetch-select
            :request="fetchOptions"
            enumCode="vehstock_ship_via"
            v-model="form.deliveryWay"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="订单分类">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_order_category"
            v-model="form.orderCategory"
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
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd">
        创建发运计划
      </el-button>
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd">
        设置定时任务开关
      </el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
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
import { getList, deleteItem, enableItem } from '@/api/vehwholesale/shipping/vehicleShippingPlanDetail/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import { listIdNames } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  dataSource: '',
  shippingPlanDetailCode: '',
  shipped: '',
  vin: '',
  financialOrganizationId: '',
  seriesId: '',
  certificateShippingWay: '',
  orderCategory: '',
  saleDealerCode: '',
  deliveryWay: '',
  cooperateType: '',
  actualDeliveryWay: '',
  regionName: '',
  carrierRecordCode: ''
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
    Upload,
    TagInput
  },
  data () {
    return {
      pageTitle: '发运计划明细',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-vehicleShippingPlanDetail',
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
        id: 'vehicleShippingPlanDetailTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'shippingPlanDetailCode',
            label: '发运计划明细编码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/shipping/vehicleShippingPlanDetail/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dataSourceLabel', label: '数据来源', visible: true, width: 200 },
          { props: 'shippedLabel', label: '是否发运', visible: true, width: 200 },
          { props: 'vin', label: 'VIN码', visible: true, width: 200 },
          { props: 'vehicleWarehouseName', label: '整车仓库', visible: true, width: 200 },
          { props: 'needSyncWmsLabel', label: '是否需要同步WMS', visible: true, width: 200 },
          { props: 'certificatePledgedLabel', label: '合格证是否质押', visible: true, width: 200 },
          { props: 'certificateShippingWayLabel', label: '合格证发运方式', visible: true, width: 200 },
          { props: 'financialOrganizationId', label: '金融机构ID', visible: true, width: 200 },
          { props: 'wholesaleWayLabel', label: '批售方式', visible: true, width: 200 },
          { props: 'cooperateTypeLabel', label: '合作类型', visible: true, width: 200 },
          { props: 'deliveryWayLabel', label: '指定发运方式', visible: true, width: 200 },
          { props: 'actualDeliveryWayLabel', label: '指定发运方式', visible: true, width: 200 },
          { props: 'orderCategoryLabel', label: '订单分类', visible: true, width: 200 },
          { props: 'provinceName', label: '省', visible: true, width: 200 },
          { props: 'cityName', label: '城市', visible: true, width: 200 },
          { props: 'districtName', label: '区县名称', visible: true, width: 200 },
          { props: 'longitude', label: '经度', visible: true, width: 200 },
          { props: 'latitude', label: '维度', visible: true, width: 200 },
          { props: 'address', label: '交车地址', visible: true, width: 200 },
          { props: 'pickupContactName', label: '接车联系人', visible: true, width: 200 },
          { props: 'pickupContactMobile', label: '接车联系电话', visible: true, width: 200 },
          { props: 'regionName', label: '大区', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店名称', visible: true, width: 200 },
          // { props: 'vehicleWarehouseName', label: '门店仓库', visible: true, width: 200 },
          // { props: 'vehicleWarehouseName', label: '交付门店（待定）', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'carrierRecordCode', label: '承运记录编码', visible: true, width: 200 },
          { props: 'entCustomerName', label: '企业客户名称', visible: true, width: 200 },
          // { props: 'entCustomerName', label: '企业下单时间（待定）', visible: true, width: 200 },
          { props: 'materialsId', label: '物料描述', visible: true, width: 200 },
          // { props: 'materialsId', label: '选配续航', visible: true, width: 200 },
          // { props: 'materialsId', label: '选配动力', visible: true, width: 200 },
          // { props: 'materialsId', label: '外饰风格', visible: true, width: 200 },
          // { props: 'materialsId', label: '内饰风格', visible: true, width: 200 },
          { props: 'seriesName', label: '车型名称xx', visible: true, width: 200 },
          // { props: 'seriesName', label: '车系名称', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
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
          //         path: '/vehwholesale/shipping/vehicleShippingPlanDetail/edit',
          //         query: {
          //           id: row.id,
          //           isEditing: true
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
    this.getData();
  },
  methods: {
    repairItemSearch (query) { return listIdNames({ organizationNameLike: query, status: 1 }); },
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
    handleAdd () {
      this.$router.push({
        path: '/vehwholesale/shipping/vehicleShippingPlanDetail/edit'
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
        businessType: '发运计划明细',
        dataFetchPath: 'vw/web/shipping/vehicleShippingPlanDetail/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '发运计划明细.xlsx');
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
.m-vehicle-shipping-plan-detail-list {
}
</style>
