<template>
  <div class="page-common m-dealer-commitment-record-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="100px"
      class="ais-search-form"
    >
      <el-form-item label="商城订单号">
        <tag-input
          placeholder="请输入"
          v-model="form.mallOrderCodeList"
          clearable
        />
      </el-form-item>
      <el-form-item label="VIN">
        <tag-input v-model="form.vinList" placeholder="请输入VIN" clearable />
      </el-form-item>
      <el-form-item label="车型名称">
        <fetch-select
          filterable
          clearable
          remote
          reserve-keyword
          v-model="form.modelId"
          :remote-method="vehicleModelSearch"
          :params="form.modelId"
          value-key="id"
          label-key="name"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="销售门店">
        <fetch-select
          filterable
          clearable
          remote
          v-model="form.saleDealerCode"
          :remote-method="saleDealerSearch"
          value-key="storeCode"
          label-key="storeName"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="兑现状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="dealer_commitment_fulfill_status"
          v-model="form.fulfillStatus"
          placeholder="请选择"
          clearable
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.createTimeRange"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleCreateTimeChange"
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
      <!--  TIPS:根据产品增删功能按钮  -->
<!--      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>-->
<!--      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>-->
<!--      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>-->
<!--      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>-->
<!--      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>-->
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
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehretail/orderManager/dealerCommitmentRecord/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listVehicleModel, listOrgStoreInfo } from '@/api/common';
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
  mallOrderCode: '',
  vinList: [],
  modelId: '',
  saleDealerCode: '',
  fulfillStatus: '',
  createTimeRange: '',
  createTimeStart: null,
  createTimeEnd: null,
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    TagInput,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload
  },
  data () {
    return {
      pageTitle: '承诺结果',
      pageType: 'list',
      // TIPS: 权限前缀 AISVR，根据实际情况修改
      moduleKey: 'AISVR-dealerCommitmentRecord',
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
        id: 'dealerCommitmentRecordTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'id',
            label: '主键',
            visible: false,
            width: 200
          },
          {
            props: 'recordCode',
            label: '承诺结果编号',
            visible: true,
            width: 180,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/dealerCommitmentRecord/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'mallOrderCode', label: '商城订单号', visible: true, width: 180 },
          { props: 'vin', label: 'VIN', visible: true, width: 160 },
          { props: 'modelName', label: '车型名称', visible: true, width: 160 },
          { props: 'saleDealerName', label: '销售门店', visible: true, width: 160 },
          { props: 'saleUserName', label: '销售顾问', visible: true, width: 120 },
          { props: 'deliveryUserName', label: '交付顾问', visible: true, width: 120 },
          { props: 'deliveryTime', label: '交车时间', visible: true, width: 160 },
          { props: 'commitmentType', label: '承诺类型', visible: true, width: 160 },
          { props: 'commitmentContent', label: '承诺内容', visible: true, width: 200 },
          { props: 'commitmentDetailDesc', label: '承诺详细说明', visible: true, width: 200 },
          { props: 'isOriginalLabel', label: '是否原厂', visible: true, width: 120 },
          { props: 'fulfillStatusLabel', label: '兑现状态', visible: true, width: 120 },
          { props: 'fulfillDesc', label: '待兑现说明', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 160 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [
              // {
              //   name: '编辑',
              //   click: (rowIndex, row) => {
              //     this.$router.push({
              //       path: '/vehretail/orderManager/dealerCommitmentRecord/edit',
              //       query: {
              //         id: row.id,
              //         isEditing: true
              //       }
              //     });
              //   },
              //   type: 'info'
              // }
            ]
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
        path: '/vehretail/orderManager/dealerCommitmentRecord/edit'
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
        businessType: '承诺结果',
        dataFetchPath: '/vr/web/order/dealerCommitmentRecord/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '承诺结果.xlsx');
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

      if (this.form.createTimeRange) {
        delete data.createTimeRange;
        if (this.form.createTimeRange.length > 1) {
          data.createTimeStart = this.form.createTimeRange[0];
          data.createTimeEnd = this.form.createTimeRange[1];
        }
      }
      // VIN列表处理
      if (this.form.vinList && this.form.vinList.length > 0) {
        data.vinList = this.form.vinList;
      } else {
        delete data.vinList;
      }
      // 删除废弃字段
      delete data.vin;
      delete data.modelCode;
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
    vehicleModelSearch (val) {
      const params = {
        modelNameLike: val,
        pageSize: 100
      };
      return listVehicleModel(params);
    },
    async saleDealerSearch (val) {
      // 查询有销售能力的门店，根据实际需求调用接口
      const params = {
        keyword: val,
        isSales: true,
        pageSize: 1000
      };
      // 返回一个 Promise，实际项目中替换为真实接口
      return await listOrgStoreInfo(params);
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
    handleCreateTimeChange (createTime) {
      if (createTime && createTime.length > 1) {
        this.form.createTimeStart = createTime[0];
        this.form.createTimeEnd = createTime[1];
      } else {
        this.form.createTimeStart = null;
        this.form.createTimeEnd = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-dealer-commitment-record-list {
}
</style>
