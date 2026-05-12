<template>
  <div class="page-common m-fund-vehwhite-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="VIN号">
        <tag-input v-model="form.vinList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="整车批售订单">
        <tag-input v-model="form.wholesaleOrderCodeList" placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
      <el-form-item label="企业客户整车订单">
        <tag-input v-model="form.enterpriseOrderCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="是否B端白名单">
        <fetch-select
          :request="fetchOptions"
          enumCode="BooleanEnum"
          v-model="form.isBWhitelist"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="是否C端白名单">
        <fetch-select
          :request="fetchOptions"
          enumCode="BooleanEnum"
          v-model="form.isCWhitelist"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="创建日期">
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
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
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
import { getList, deleteItem, enableItem } from '@/api/vehwholesale/fund/fundVehwhite/index';
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

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  vin: '',
  wholesaleOrderCode: '',
  enterpriseOrderCode: '',
  wholesaleOrderCodeList: [],
  enterpriseOrderCodeList: [],
  vinList: [],
  isBWhitelist: '',
  isCWhitelist: '',
  createTime: ''
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
    Upload,
    TagInput,
    FetchSelect
  },
  data () {
    return {
      pageTitle: '整车批售-整车资金-车辆白名单管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-fundVehwhite',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: true,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'FundVehwhiteTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/fund/fundVehwhite/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerName',
            label: '门店',
            visible: true,
            width: 300,
            buttons: [{
              click: (rowIndex, row) => {
                this.openWindow('/partner/channelManagement/shopDetail?dealerCode=' + row.dealerCode);
              },
              type: 'primary'
            }]
          },
          { props: 'parentCompanyName', label: '母公司名称', visible: true, width: 300, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/companyDetails?companyCode=${row.parentCompanyCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'enterpriseCustomerName', label: '企业客户', visible: true, width: 200 },
          { props: 'vin', label: 'VIN号', visible: true, width: 200 },
          {
            props: 'wholesaleOrderCode',
            label: '整车批售订单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.openWindow('/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit?id=' + row.wholesaleOrderId);
              },
              type: 'primary'
            }]
          },
          {
            props: 'enterpriseOrderCode',
            label: '企业客户整车订单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.openWindow('/sales/vehwholesale/entorder/entVehicleOrder/edit?id=' + row.enterpriseOrderId);
              },
              type: 'primary'
            }]
          },
          { props: 'isBWhitelistLabel', label: '是否B端白名单', visible: true, width: 200 },
          { props: 'isCWhitelistLabel', label: '是否C端白名单', visible: true, width: 200 },
          { props: 'documentTypeLabel', label: '单据类型', visible: true, width: 200 },
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
                  path: '/vehwholesale/fund/fundVehwhite/edit',
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
    openWindow (url) {
      window.open(url, '_blank');
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
    handleAdd () {
      this.$router.push({
        path: '/vehwholesale/fund/fundVehwhite/edit'
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
        businessType: '整车批售-整车资金-车辆白名单管理',
        dataFetchPath: 'vw/web/fund/fundVehwhite/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车批售-整车资金-车辆白名单管理.xlsx');
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

      // 处理多选字段：如果有多个值则使用数组，如果只有一个值则转换为单个字段
      if (this.form.wholesaleOrderCodeList && this.form.wholesaleOrderCodeList.length > 0) {
        if (this.form.wholesaleOrderCodeList.length === 1) {
          delete data.wholesaleOrderCodeList;
          data.wholesaleOrderCode = this.form.wholesaleOrderCodeList[0];
        } else {
          data.wholesaleOrderCodeList = this.form.wholesaleOrderCodeList;
        }
      }

      if (this.form.enterpriseOrderCodeList && this.form.enterpriseOrderCodeList.length > 0) {
        if (this.form.enterpriseOrderCodeList.length === 1) {
          delete data.enterpriseOrderCodeList;
          data.enterpriseOrderCode = this.form.enterpriseOrderCodeList[0];
        } else {
          data.enterpriseOrderCodeList = this.form.enterpriseOrderCodeList;
        }
      }

      if (this.form.vinList && this.form.vinList.length > 0) {
        if (this.form.vinList.length === 1) {
          delete data.vinList;
          data.vin = this.form.vinList[0];
        } else {
          data.vinList = this.form.vinList;
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
    },
  }
};
</script>

<style lang="scss" scoped>
.m-fund-vehwhite-list {
}
</style>
