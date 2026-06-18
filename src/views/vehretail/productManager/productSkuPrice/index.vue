<template>
  <div class="page-common m-product-manager-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="商品价格编码">
        <tag-input v-model="form.skuPriceCodeList" placeholder="请输入" />
        <!-- <el-input
          placeholder="请输入"
          v-model="form.skuPriceCode"
          clearable
        /> -->
      </el-form-item>
      <el-form-item label="SKU编码">
        <tag-input v-model="form.skuCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="商品编码"  v-show="this.visibleCount === 3 || show">
        <tag-input v-model="form.productCodeList" placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="车系">
          <fetch-select
            v-bind="selectOptions"
            :remote-method="remoteMethods.series"
            v-model="form.seriesId"
          />
        </el-form-item>
        <el-form-item label="车型">
          <fetch-select
            v-bind="selectOptions"
            :remote-method="remoteMethods.model"
            v-model="form.modelId"
          />
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input
            placeholder="请输入"
            v-model="form.materialsCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="物料描述">
          <el-input
            placeholder="请输入"
            v-model="form.materialsDesc"
            clearable
          />
        </el-form-item>
        <el-form-item label="允许改配">
          <fetch-select :options="yes_no_enum" v-model="form.allowConfigChange" placeholder="请选择" clearable  />
        </el-form-item>
        <el-form-item label="价格对比">
          <fetch-select
            :request="fetchOptions"
            enumCode="price_compare"
            v-model="form.priceCompare"
            placeholder="请选择"
            clearable
            filterable
          />
          <!-- <el-input
            placeholder="请输入"
            v-model="form.priceCompareLabel"
            clearable
          /> -->
        </el-form-item>
        <el-form-item label="购车类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="purchase_type_pc"
            v-model="form.purchaseType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="StatusEnum"
            v-model="form.status"
            placeholder="请选择"
            clearable
          />
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.startTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.endTime"
            type="daterange"
            unlink-panels
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
            unlink-panels
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
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
      <el-button v-permission="moduleKey+'-batchUpdateAllowConfigChange'" size="small" @click="handleBatchUpdateAllowConfigChange" :disabled="selectionList.length === 0">设置允许改配</el-button>
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
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      id="productSkuPriceImport"
      @close="handleUploadDialogClose"
    />
    <!-- 设置允许改配弹窗 -->
    <el-dialog
      title="设置允许改配"
      :visible.sync="allowConfigChangeDialog.visible"
      width="400px"
      :close-on-click-modal="false"
      @close="handleAllowConfigChangeDialogClose"
    >
      <el-form label-width="120px">
        <el-form-item label="是否允许改配">
          <el-radio-group v-model="allowConfigChangeDialog.allowConfigChange">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allowConfigChangeDialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="allowConfigChangeDialog.loading" @click="confirmBatchUpdateAllowConfigChange">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, batchUpdateAllowConfigChange } from '@/api/vehretail/productManager/productSkuPrice/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, vehicleSeriesList, listVehicleModel } from '@/api/common';
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
  skuPriceCode: '',
  skuPriceCodeList: [],
  skuCodeList: [],
  productCodeList: [],
  skuCode: '',
  productCode: '',
  materialsCode: '',
  materialsDesc: '',
  purchaseTypeLabel: '',
  priceBeforeSubsidy: '',
  priceAfterSubsidy: '',
  subsidyAmount: '',
  deposit: '',
  vehiclePrice: '',
  priceCompareLabel: '',
  allowConfigChange: '',
  statusLabel: '',
  startTime: '',
  endTime: '',
  description: '',
  seriesName: '',
  modelName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
  startTimeStart: '',
  startTimeEnd: '',
  endTimeStart: '',
  endTimeEnd: '',
  createTimeStart: '',
  createTimeEnd: ''
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
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        // multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      // 远程搜索方法
      remoteMethods: {
        series: async (query) => {
          return await vehicleSeriesList({ seriesNameLike: query });
        },
        model: async (query) => {
          return await listVehicleModel({ modelNameLike: query });
        },
      },
      pageTitle: '商品SKU价格维护',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-productSkuPrice',
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
      allowConfigChangeDialog: {
        visible: false,
        loading: false,
        allowConfigChange: 1
      },
      optionObj: {
        id: 'productManagerTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'skuPriceCode',
            label: '商品价格编码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/productManager/productSkuPrice/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'skuCode', label: 'SKU编码', visible: true, width: 180 },
          { props: 'productCode', label: '商品编码', visible: true, width: 120, align: 'left', buttons: [{ click: (rowIndex, row) => { window.open(`/sales/vehretail/productManager/productCenter/edit?id=${row.productId}`, '_blank'); }, type: 'primary' }] },
          { props: 'materialsCode', label: '物料编码', visible: true, width: 160, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleMaterials/edit?id=${row.vehicleMaterialsId}`, '_blank'); }, type: 'primary' }] },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 300, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleMaterials/edit?id=${row.vehicleMaterialsId}`, '_blank'); }, type: 'primary' }] },
          { props: 'purchaseTypeLabel', label: '购车类型', visible: true, width: 100 },
          { props: 'priceBeforeSubsidy', label: '补贴前价格', visible: true, width: 120, align: 'right' },
          { props: 'priceAfterSubsidy', label: '补贴后价格', visible: true, width: 120, align: 'right' },
          { props: 'subsidyAmount', label: '补贴金额', visible: true, width: 100, align: 'right' },
          { props: 'deposit', label: '定金', visible: true, width: 100, align: 'right' },
          { props: 'vehiclePrice', label: '整车价格', visible: true, width: 100, align: 'right' },
          { props: 'priceCompareLabel', label: '价格对比', visible: true, width: 100 },
          { props: 'allowConfigChangeLabel', label: '允许改配', visible: true, width: 100 },
          { props: 'statusLabel', label: '状态', visible: true, width: 80 },
          { props: 'startTime', label: '开始日期', visible: true, width: 150 },
          { props: 'endTime', label: '截止日期', visible: true, width: 150 },
          { props: 'description', label: '描述', visible: true, width: 260 },
          { props: 'seriesName', label: '车系', visible: true, width: 120, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleSeries/edit?id=${row.seriesId}`, '_blank'); }, type: 'primary' }] },
          { props: 'modelName', label: '车型', visible: true, width: 120, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/datacenter/materials/vehicleModel/edit?id=${row.modelId}`, '_blank'); }, type: 'primary' }] },
          { props: 'creatorName', label: '创建者', visible: true, width: 120 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          // { props: 'modifierName', label: '修改者', visible: true, width: 200 },
          { props: 'updateTime', label: '更新时间', visible: true, width: 200 },
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
                  path: '/vehretail/productManager/productSkuPrice/edit',
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
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
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
        path: '/vehretail/productManager/productSkuPrice/edit'
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
        businessType: '商品SKU价格维护管理',
        dataFetchPath: '/vr/web/product/productSkuPrice/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '商品SKU价格维护管理.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirm(
            '正在导入中，是否要跳转"系统管理-文件管理-导入任务"中查看？',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            window.open('/service/excelManagement/commonDataProcessExcelImportTask', '_blank');
          }).catch(() => {});
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
          this.optionObj.dataList = (res?.records || []).map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res?.total || 0;
        }).catch(err => {
          console.error(err);
          this.optionObj.dataList = [];
          this.optionObj.total = 0;
          this.$message.error('查询失败，请稍后重试');
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
      if (this.form.startTime) {
        delete data.startTime;
        if (this.form.startTime.length > 1) {
          data.startTimeStart = this.form.startTime[0];
          data.startTimeEnd = this.form.startTime[1];
        }
      }
      if (this.form.endTime) {
        delete data.endTime;
        if (this.form.endTime.length > 1) {
          data.endTimeStart = this.form.endTime[0];
          data.endTimeEnd = this.form.endTime[1];
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
    // 设置允许改配
    handleBatchUpdateAllowConfigChange () {
      if (this.selectionList.length === 0) {
        return;
      }
      this.allowConfigChangeDialog.visible = true;
    },
    // 确认设置允许改配
    confirmBatchUpdateAllowConfigChange () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.allowConfigChangeDialog.loading = true;
      batchUpdateAllowConfigChange({
        ids,
        allowConfigChange: this.allowConfigChangeDialog.allowConfigChange
      }).then(() => {
        this.$message({
          type: 'success',
          message: '设置成功!'
        });
        this.allowConfigChangeDialog.visible = false;
        this.getData();
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '设置失败!'
        });
      }).finally(() => {
        this.allowConfigChangeDialog.loading = false;
      });
    },
    // 关闭设置允许改配弹窗
    handleAllowConfigChangeDialogClose () {
      this.allowConfigChangeDialog.allowConfigChange = 1;
      this.allowConfigChangeDialog.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.m-product-manager-list {
}
</style>
