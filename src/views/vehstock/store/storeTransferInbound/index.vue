<template>
  <div class="page-common m-store-transfer-inbound-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="调拨入库单号">
        <tag-input v-model="form.inboundNoList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="VIN">
        <el-input placeholder="请输入" v-model="form.vin" clearable />
      </el-form-item>
      <el-form-item label="目标门店">
        <fetch-select
          :remote-method="queryListData"
          v-model="form.targetDealerCodeList"
          remote
          collapse-tags
          multiple
          filterable
          placeholder="请选择"
          clearable
          value-key="storeCode"
          label-key="storeName"
        />
      </el-form-item>
      <el-form-item label="单据状态" v-show="this.visibleCount === 3 || show">
        <fetch-select :request="fetchOptions" enumCode="vehstock_transfer_inbound_audit_status"
          v-model="form.auditStatus" placeholder="请选择" clearable filterable />
      </el-form-item>
      <template v-if="show">
      </template>
      <page-search-action v-if="canList" v-model="show" is-expandable :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)"
        :disabled="selectionList.length === 0">批量启用</el-button> -->
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchWarehousing(0)"
        :disabled="selectionList.length === 0">入库</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page checkboxFixed centralized
        :option-obj="optionObj" :get-config="getConfig" :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange" @handleSelect="handleSelectionChange" @listSelect="handleListSelect"
        @sortChange="handleSortChange">
        <EditPage slot="centralizedViewSlot" :id="clickItemId" />
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload :visible="uploadDialogVisible" :id="'1'" @close="handleUploadDialogClose" @getData="getData" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, inboundItem } from '@/api/vehstock/store/storeTransferInbound/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import { listOrgStoreInfo } from '@/libs/api/common';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  inboundNoList: [],
  vin: '',
  targetDealerCode: '',
  auditStatus: '',
};

// 默认排序：创建时间倒序。data() 和 onReset 复用同一份常量，避免两份硬编码不一致。
const DEFAULT_SORT_COLUMNS = [
  { column: 'create_time', sort: 'DESC' }
];

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
    TagInput,
  },
  data () {
    return {
      pageTitle: '门店调拨入库',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVS-storeTransferInbound',
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
        id: 'storeTransferInboundTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'inboundNo',
            label: '调拨入库单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/store/storeTransferInbound/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'transferNo', label: '整车调拨单号', visible: true, width: 200 },
          { props: 'vin', label: 'VIN', visible: true, width: 180 },
          { props: 'sourceDealerName', label: '源门店名称', visible: true, width: 200 },
          { props: 'sourceDealerAddress', label: '源门店地址', visible: true, width: 200 },
          { props: 'targetDealerName', label: '目标门店名称', visible: true, width: 200 },
          { props: 'targetDealerAddress', label: '目标门店地址', visible: true, width: 200 },
          { props: 'moveoutTime', label: '移出时间', visible: true, width: 200, sortable: true },
          { props: 'moveinTime', label: '移入时间', visible: true, width: 200, sortable: true },
          { props: 'applyTime', label: '申请时间', visible: true, width: 200, sortable: true },
          { props: 'pdiNo', label: 'PDI单号', visible: true, width: 200 },
          { props: 'isPdiSubmitLabel', label: 'PDI是否完成提交', visible: true, width: 140 },
          { props: 'isUnusualLabel', label: '车辆是否存在异常', visible: true, width: 140 },
          { props: 'isRepairedLabel', label: '车辆异常是否修复', visible: true, width: 140 },
          { props: 'auditStatusLabel', label: '单据状态', visible: true, width: 100 },
          { props: 'auditRemark', label: '审批意见', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 160 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200, sortable: true },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 160 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '入库',
              show: (row) => {
                return row.auditStatus === 1 && this.permissions.has(`${this.moduleKey}-inbound`);
              },
              popconfirmTitle: '确认入库吗?',
              click: (rowIndex, row) => {
                inboundItem([row.id]).then(() => {
                  this.$message({
                    type: 'success',
                    message: '入库成功!'
                  });
                  // 后端入库接口同步返回成功，但状态更新存在延迟，延迟一下再查询
                  setTimeout(() => {
                    this.getData();
                  }, 800);
                });
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      sortColumns: [...DEFAULT_SORT_COLUMNS]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    // 排序
    handleSortChange (value) {
      const list = value || [];
      if (!list.length) {
        this.sortColumns = [];
        this.getData();
        return;
      }
      const latest = list.reduce((acc, cur) => (cur.sortTime || 0) > (acc.sortTime || 0) ? cur : acc);
      const def = this.optionObj.dataProp.find(item => item.props === latest.field) || {};
      this.sortColumns = [{
        column: def.sortField || (latest.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
        sort: (latest.order || '').toUpperCase()
      }];
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
        path: '/vehstock/store/storeTransferInbound/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.sortColumns = [...DEFAULT_SORT_COLUMNS];
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
        businessType: '门店调拨入库',
        dataFetchPath: 'vehstock/web/store/storeTransferInbound/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店调拨入库.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
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
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
          this.$nextTick(() => {
            this.$forceUpdate();
          });
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
      // 调拨入库单号：单值用 inboundNoLike，多值用 inboundNoList
      if (Array.isArray(this.form.inboundNoList) && this.form.inboundNoList.length <= 1) {
        delete data.inboundNoList;
        data.inboundNoLike = this.form.inboundNoList[0] || '';
      }

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
      }).catch(() => { });
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
    // 查询目标门店
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        listOrgStoreInfo({ keyword: queryString }).then(res => {
          const list = res.records || [];
          resolve(list);
        });
      });
    },
    // 批量入库
    handleBatchWarehousing () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('确定要批量入库吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        inboundItem(ids).then(() => {
          this.$message({
            type: 'success',
            message: '批量入库成功!'
          });
          // 后端入库接口同步返回成功，但状态更新存在延迟，延迟一下再查询
          setTimeout(() => {
            this.getData();
          }, 800);
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '批量入库失败!'
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-store-transfer-inbound-list {}
</style>
