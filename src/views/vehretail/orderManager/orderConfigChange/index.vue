<template>
  <div class="page-common m-order-config-change-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="商城订单编号">
        <tag-input
          placeholder="请输入"
          v-model="form.mallOrderCodeList"
          clearable
        />
      </el-form-item>
      <el-form-item label="销售门店">
        <fetch-select
          filterable
          clearable
          multiple
          remote
          collapseTags
          v-model="form.saleDealerCodeList"
          :remote-method="getDealerListByName"
          value-key="storeCode"
          label-key="storeName"
        />
      </el-form-item>
      <el-form-item label="修改前物料编码">
        <el-input
          placeholder="请输入"
          v-model="form.materialsCodeBefore"
          clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="修改前物料描述">
          <el-input
            placeholder="请输入"
            v-model="form.materialsDescBefore"
            clearable
          />
        </el-form-item>
        <el-form-item label="修改前车型名称">
          <fetch-select
            :remote-method="remoteMethods.model"
            v-model="form.modelIdBefore"
            v-bind="selectOptions"
            @change="modelBeforeListChange"
          />
        </el-form-item>
        <el-form-item label="修改前年款名称">
          <fetch-select
            :options="yearModelBeforeList"
            v-model="form.yearTypeIdBefore"
            placeholder="请选择"
            labelKey="label"
            valueKey="value"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="修改后物料编码">
          <el-input
            placeholder="请输入"
            v-model="form.materialsCodeAfter"
            clearable
          />
        </el-form-item>
        <el-form-item label="修改后物料描述">
          <el-input
            placeholder="请输入"
            v-model="form.materialsDescAfter"
            clearable
          />
        </el-form-item>
        <el-form-item label="修改后车型名称">
          <fetch-select
            :remote-method="remoteMethods.model"
            v-model="form.modelIdAfter"
            v-bind="selectOptions"
            @change="modelAfterListChange"
          />
        </el-form-item>
        <el-form-item label="修改后年款名称">
          <fetch-select
            :options="yearModelAfterList"
            v-model="form.yearTypeIdAfter"
            placeholder="请选择"
            labelKey="label"
            valueKey="value"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.operateTime"
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
import { getList, deleteItem, enableItem } from '@/api/vehretail/orderManager/orderConfigChange/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfo, listVehicleYearType, listVehicleModel, vehicleModelYearTypeRelationDistinctYeayType } from '@/api/common';
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
  operateTime: '',
  operateUserName: '',
  saleDealerName: '',
  mallOrderCode: '',
  materialsCodeBefore: '',
  modelIdBefore: '',
  modelNameBefore: '',
  yearTypeIdBefore: '',
  yearTypeNameBefore: '',
  materialsDescBefore: '',
  materialsCodeAfter: '',
  modelIdAfter: '',
  modelNameAfter: '',
  yearTypeIdAfter: '',
  yearTypeNameAfter: '',
  materialsDescAfter: '',
  remark: '',
  mallOrderCodeList: [],
  saleDealerCodeList: [],
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
      pageTitle: '整车订单改配记录',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-retailOrderConfigChange',
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
        id: 'orderConfigChangeTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'operateTime', label: '操作时间', visible: true, width: 200 },
          { props: 'operateUserName', label: '操作人', visible: true, width: 200 },
          { props: 'saleDealerName', label: '销售门店', visible: true, width: 200 },
          { props: 'mallOrderCode', label: '商城订单编号', visible: true, width: 200 },
          { props: 'paymentTime', label: '缴定金时间', visible: true, width: 200 },
          { props: 'materialsCodeBefore', label: '修改前物料编码', visible: true, width: 200 },
          { props: 'modelNameBefore', label: '修改前车型名称', visible: true, width: 200 },
          { props: 'yearTypeNameBefore', label: '修改前年款名称', visible: true, width: 200 },
          { props: 'materialsDescBefore', label: '修改前物料描述', visible: true, width: 200 },
          { props: 'materialsCodeAfter', label: '修改后物料编码', visible: true, width: 200 },
          { props: 'modelNameAfter', label: '修改后车型名称', visible: true, width: 200 },
          { props: 'yearTypeNameAfter', label: '修改后年款名称', visible: true, width: 200 },
          { props: 'materialsDescAfter', label: '修改后物料描述', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '详情',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/orderConfigChange/edit',
                  query: {
                    id: row.id
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
      ],
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      // 远程搜索方法
      remoteMethods: {
        // 初始方法
        model: async (query) => {
          return await listVehicleModel({ modelNameLike: query });
        },
        yearType: async (query) => {
          return await listVehicleYearType({ yearTypeNameLike: query, modelId: this.form.modelId });
        },
      },
      yearModelBeforeList: [],
      yearModelAfterList: []
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    modelBeforeListChange (val) {
      this.form.yearTypeIdBefore = '';
      this.yearModelBeforeList = [];
      this.listVehicleYearType(val, 'before');
    },
    modelAfterListChange (val) {
      console.log(val);
      this.form.yearTypeIdAfter = '';
      this.yearModelAfterList = [];
      this.listVehicleYearType(val, 'after');
    },
    async listVehicleYearType (val, type) {
      const res = await vehicleModelYearTypeRelationDistinctYeayType({ modelId: val, limitSize: 50 });
      if (type === 'before') {
        this.yearModelBeforeList = res.map(item => {
          return {
            ...item,
            label: item.yearTypeName,
            value: item.yearTypeId
          };
        });
      } else if (type === 'after') {
        this.yearModelAfterList = res.map(item => {
          return {
            ...item,
            label: item.yearTypeName,
            value: item.yearTypeId
          };
        });
      }
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
        path: '/vehretail/orderManager/orderConfigChange/edit'
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
        businessType: '整车订单改配记录',
        dataFetchPath: 'vr/web/order/retailOrderConfigChange/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车订单改配记录.xlsx');
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

      if (this.form.operateTime) {
        delete data.operateTime;
        if (this.form.operateTime.length > 1) {
          data.operateTimeStart = this.form.operateTime[0];
          data.operateTimeEnd = this.form.operateTime[1];
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
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isSales: true });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-order-config-change-list {
}
</style>
