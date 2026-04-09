<template>
  <div class="page-common m-wholesale-sale-target-tracking-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="年">
        <el-date-picker
          v-model="form.year"
          type="year"
          placeholder="选择年份"
          format="yyyy"
          value-format="yyyy"
          clearable
        />
      </el-form-item>
      <el-form-item label="月">
        <el-date-picker
          v-model="form.month"
          type="month"
          placeholder="选择月份"
          format="MM月"
          value-format="MM"
          clearable
        />
      </el-form-item>
      <el-form-item label="母公司"  v-show="this.visibleCount === 3 || show">
        <fetch-select
          filterable
          clearable
          remote
          multiple
          v-model="form.dealerParentOrgIds"
          :remote-method="getDealerParentOrgList"
          value-key="companyCode"
          label-key="companyName"
        />
      </el-form-item>
    <template v-if="show">
      <el-form-item label="大区">
        <fetch-select
          filterable
          clearable
          remote
          v-model="form.regionId"
          :remote-method="getRegionList"
          value-key="orgCode"
          label-key="orgName"
        />
      </el-form-item>
      <el-form-item label="省份">
        <fetch-select
          filterable
          clearable
          remote
          v-model="form.provinceCode"
          :remote-method="getProvince"
          value-key="code"
          label-key="name"
          @change="handleChangeProvince"
        />
      </el-form-item>
      <el-form-item label="城市">
        <fetch-select
          filterable
          clearable
          v-model="form.cityCode"
          :options="cityOptions"
          value-key="code"
          label-key="name"
        />
      </el-form-item>
      <el-form-item label="门店编码">
        <fetch-select
          filterable
          clearable
          multiple
          remote
          collapseTags
          v-model="form.dealerCodes"
          :remote-method="getDealerListByCode"
          value-key="storeCode"
          label-key="storeCode"
          @change="handleChangeDealer"
        />
      </el-form-item>
      <el-form-item label="门店名称">
        <fetch-select
          filterable
          clearable
          multiple
          remote
          collapseTags
          v-model="form.dealerNames"
          :remote-method="getDealerListByName"
          value-key="storeName"
          label-key="storeName"
          @change="handleChangeDealer"
        />
      </el-form-item>
      <el-form-item label="车系">
        <fetch-select
          filterable
          clearable
          multiple
          remote
          collapseTags
          v-model="form.seriesIds"
          :remote-method="getVehicleSeriesList"
          value-key="id"
          label-key="name"
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
      <el-button v-permission="moduleKey+'-importExcelByWholesale'" size="small" @click="handleImportWholesale">批售导入</el-button>
      <el-button v-permission="moduleKey+'-importExcelByRetail'" size="small" @click="handleImportRetail">零售导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
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
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisibleRetail"
      :id="'SaleTargetTrackingImportByRetail'"
      @close="handleUploadDialogCloseRetail"
    />
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisibleWholesale"
      :id="'SaleTargetTrackingImportByWholesale'"
      @close="handleUploadDialogCloseWholesale"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehwholesale/basic/wholesaleSaleTargetTracking/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getProvinceTree, getRigion, listOrgStoreInfo, vehicleSeriesList, getParentCompany } from '@/api/common';
// import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  year: '',
  month: '',
  dealerParentOrgIds: [],
  dealerCodes: [],
  dealerNames: [],
  regionId: '',
  provinceCode: '',
  cityCode: '',
  seriesIds: [],
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
    Upload,
  },
  data () {
    return {
      pageTitle: '销售目标跟踪',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleSaleTargetTracking',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisibleRetail: false,
      uploadDialogVisibleWholesale: false,
      cityOptions: [], // 市
      optionObj: {
        id: 'wholesaleSaleTargetTrackingTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'wholesaleSaleTargetTrackingCode',
            label: '编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/basic/wholesaleSaleTargetTracking/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'year', label: '年', visible: true, width: 200 },
          { props: 'month', label: '月', visible: true, width: 200 },
          { props: 'dealerParentOrgName', label: '母公司', visible: true, width: 200 },
          { props: 'cooperationTypeLabel', label: '合作类型', visible: true, width: 200 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 200 },
          {
            props: 'dealerName',
            label: '门店名称',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.navigateToRoute({
                  path: '/partner/channelManagement/shopDetail',
                  query: {
                    dealerCode: row.dealerCode
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'regionName', label: '大区', visible: true, width: 200 },
          { props: 'provinceName', label: '省份', visible: true, width: 200 },
          { props: 'cityName', label: '城市', visible: true, width: 200 },
          {
            props: 'seriesName',
            label: '车系',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/materials/vehicleSeries/detail',
                  query: {
                    id: row.seriesId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'newOrderQty', label: '新增缴定订单数', visible: true, width: 200 },
          { props: 'newLockTargetQty', label: '新增锁单目标数', visible: true, width: 200 },
          { props: 'netLockTargetQty', label: '净增锁单目标数', visible: true, width: 200 },
          { props: 'wholesaleAssessmentTargetQty', label: '批售考核目标数', visible: true, width: 200 },
          { props: 'deliveryTargetQty', label: '交付目标数', visible: true, width: 200 },
          { props: 'wholesaleTargetQty', label: '批售目标数', visible: true, width: 200 },
          { props: 'confirmedQty', label: '已确认数量', visible: true, width: 200 },
          { props: 'wholesaleRemark', label: '批售备注', visible: true, width: 200 },
          { props: 'retailRemark', label: '零售备注', visible: true, width: 200 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '批售编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/basic/wholesalesaletargettracking/wholesaleEdit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            },
            {
              name: '零售编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/basic/wholesalesaletargettracking/retailEdit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '日志',
              click: (rowIndex, row) => {
                this.$auditLog.show({ id: row.id });
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleImportWholesale () {
      this.uploadDialogVisibleWholesale = true;
    },
    handleImportRetail () {
      this.uploadDialogVisibleRetail = true;
    },
    handleUploadDialogCloseWholesale () {
      this.uploadDialogVisibleWholesale = false;
    },
    handleUploadDialogCloseRetail () {
      this.uploadDialogVisibleRetail = false;
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
        businessType: '销售目标跟踪',
        dataFetchPath: '/vw/web/basic/wholesaleSaleTargetTracking/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '销售目标跟踪.xlsx');
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
    },
    async getDealerParentOrgList (params) {
      return getParentCompany({ parentCompanyName: params });
    },
    async getRegionList (params) {
      return getRigion({ orgName: params });
    },
    // 查询所有省市区
    async getProvince (params) {
      const res = await getProvinceTree();
      let list = res || [];
      if (params && params.trim()) {
        const searchText = params.trim().toLowerCase();
        list = list.filter(item => item.name && item.name.toLowerCase().includes(searchText));
      }
      return list;
    },
    // 选择省以后带出市信息
    handleChangeProvince (val, selectedOption) {
      if (val) {
        this.form.provinceCode = selectedOption?.code || '';
        this.cityOptions = selectedOption?.child || []; // 选择省以后带出市信息
        this.form.cityCode = '';
      }
    },
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async getDealerListByCode (params) {
      return listOrgStoreInfo({ storeCode: params, isWholesaleSale: true });
    },
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-wholesale-sale-target-tracking-list {
}
</style>
