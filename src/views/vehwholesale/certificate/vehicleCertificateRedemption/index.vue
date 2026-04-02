<template>
  <div class="page-common m-vehicle-certificate-redemption-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
     <el-form-item label="母公司名称"  >
      <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.dealerCompanyNames"
                  :remote-method="getDealerParentOrgList"
                  value-key="companyCode"
                  label-key="companyName"
                  multiple
                />
      </el-form-item>
       <el-form-item label="赊销结算状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_credit_status"
            v-model="form.creditSettleStatuses"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
          <el-form-item label="销售门店" v-show="this.visibleCount === 3 || show">
            <fetch-select
              filterable
              clearable
              remote
              collapseTags
              v-model="form.saleDealerCodes"
              :remote-method="getDealerListByName"
              value-key="storeCode"
              label-key="storeName"
              multiple
            />
        </el-form-item>
      <template v-if="show">
       <el-form-item label="VIN码">
         <tag-input v-model="form.vins" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="合格证状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_certificate_redemption_status"
            v-model="form.certificateStatuses"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="赊销日期">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.creditTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="合格证赎回编号">
          <tag-input v-model="form.redemptionCodes" placeholder="请输入" />
      </el-form-item>
        <el-form-item label="车系">
            <fetch-select
            filterable
            clearable
            remote
            collapseTags
            v-model="form.seriesIds"
            :remote-method="getVehicleSeriesList"
            value-key="id"
            label-key="label"
            multiple
          />
        </el-form-item>
        <el-form-item label="车型">
          <fetch-select
            filterable
            clearable
            remote
            collapseTags
            v-model="form.modelIds"
            :remote-method="getVehicleModelList"
            value-key="id"
            label-key="label"
            multiple
          />
        </el-form-item>
        <el-form-item label="还款日期">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.repaymentTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
         <el-form-item label="创建时间">
        <el-date-picker
         :default-time="['00:00:00', '23:59:59']"
          v-model="form.createTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
          {{ dropdownLoading ? '加载中...' : '车辆合格证赎回' }}
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
      <el-button v-if="canDelete" size="small" @click="handleconfirmSign" :disabled="selectionList.length === 0">签收合格证</el-button>
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
import { getList, deleteItem, enableItem, batchconfirmSign } from '@/api/vehwholesale/certificate/vehicleCertificateRedemption/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getParentCompany, listOrgStoreInfo, vehicleSeriesList, vehicleModelList } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  createTime: '',
  redemptionCode: '',
  dealerCompanyName: '',
  saleDealerName: '',
  creditSettleStatus: '',
  certificateStatus: '',
  vin: '',
  seriesId: '',
  modelId: '',
  creditTime: '',
  repaymentTime: '',
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
      pageTitle: '车辆合格证赎回',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-vehicleCertificateRedemption',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      dropdownLoading: false,
      validatedOrderategoryList: [],
      clickItemId: '',
      optionObj: {
        id: 'vehicleCertificateRedemptionTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'redemptionCode',
            label: '合格证赎回编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/certificate/vehicleCertificateRedemption/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dealerCompanyName', label: '母公司名称', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店名称', visible: true, width: 200 },
          { props: 'creditSettleStatusLabel', label: '赊销结算状态', visible: true, width: 200 },
          { props: 'certificateStatusLabel', label: '合格证状态', visible: true, width: 200 },
          { props: 'vin', label: 'VIN码', visible: true, width: 200 },
          { props: 'seriesName', label: '车系名称', visible: true, width: 200 },
          { props: 'modelName', label: '车型名称', visible: true, width: 200 },
          { props: 'vehiclePrice', label: '车辆售价（零售价）', visible: true, width: 200 },
          { props: 'settleFundTypeLabel', label: '资金结算类型', visible: true, width: 200 },
          { props: 'downPaymentRatio', label: '首付款比例', visible: true, width: 200 },
          { props: 'downPaymentAmount', label: '首付款金额', visible: true, width: 200 },
          { props: 'creditDebtAmount', label: '赊销欠款金额', visible: true, width: 200 },
          { props: 'creditTime', label: '赊销日期', visible: true, width: 200 },
          { props: 'repaymentTime', label: '还款日期', visible: true, width: 200 },
          { props: 'creditDays', label: '赊销天数', visible: true, width: 200 },
          { props: 'wholesaleOrderCode', label: '整车批售订单号', visible: true, width: 200 },
          { props: 'entVehicleOrderCode', label: '企业客户整车订单号', visible: true, width: 200 },
          { props: 'receiverName', label: '收件人', visible: true, width: 200 },
          { props: 'receiverPhone', label: '收件人手机', visible: true, width: 200 },
          { props: 'receiverAddress', label: '收件地址', visible: true, width: 200 },
          { props: 'expressCode', label: '快递单号', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
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
                  path: '/vehwholesale/certificate/vehicleCertificateRedemption/edit',
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
                deleteItem({
                  idSet: [row.id]
                }
                ).then(() => {
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
    this.getData();
    this.fetchOrderCategoryOptions();
    this.getVehicleSeriesList();
    this.getVehicleModelList();
  },
  methods: {
    // 获取车辆系列列表
    async getVehicleSeriesList (query = '') {
      try {
        const res = await vehicleSeriesList({
          seriesNameLike: query,
          limitSize: 1000
        });
        this.seriesList = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.name // 使用name作为value，因为v-model绑定的是name字段
          };
        });
        return this.seriesList;
      } catch (error) {
        console.error('获取车辆系列列表失败:', error);
        return [];
      }
    },

    // 获取车型列表
    async getVehicleModelList (query = '') {
      try {
        const res = await vehicleModelList({
          modelNameLike: query,
          limitSize: 1000
        });
        this.modelList = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.name // 使用name作为value，因为v-model绑定的是name字段
          };
        });
        return this.modelList;
      } catch (error) {
        console.error('获取车型列表失败:', error);
        return [];
      }
    },
    async fetchOrderCategoryOptions () {
      const response = await getEnum('vw_vehicle_back_order_type');
      this.orderCategoryOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['10', '20'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
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
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    async getDealerParentOrgList (params) {
      return getParentCompany({ parentCompanyName: params });
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
        path: '/vehwholesale/certificate/vehicleCertificateRedemption/edit',
        query: {
          orderCategory: code
        }
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
        businessType: '新页面',
        dataFetchPath: 'vw/web/certificate/vehicleCertificateRedemption/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '新页面.xlsx');
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

      // 赊销日期
      if (this.form.creditTime) {
        delete data.creditTime;
        if (this.form.creditTime.length > 1) {
          data.creditTimeStart = this.form.creditTime[0];
          data.creditTimeEnd = this.form.creditTime[1];
        }
      }
      // 还款日期
      if (this.form.repaymentTime) {
        delete data.repaymentTime;
        if (this.form.repaymentTime.length > 1) {
          data.repaymentTimeStart = this.form.repaymentTime[0];
          data.repaymentTimeEnd = this.form.repaymentTime[1];
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
    handleconfirmSign () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将批量签收合格证, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchconfirmSign({
          idSet: ids,
        }).then(() => {
          this.$message.success('提交成功');
          this.getData();
        });
      }).catch(() => {});
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
.m-vehicle-certificate-redemption-list {
}
</style>
