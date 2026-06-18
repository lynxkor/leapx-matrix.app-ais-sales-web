<template>
  <div class="page-common m-product-center-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="商品编码">
        <tag-input v-model="form.productCodeList" placeholder="请输入" />
        <!-- <el-input
          placeholder="请输入"
          v-model="form.productCode"
          clearable
        /> -->
      </el-form-item>
      <el-form-item label="商品名称">
        <tag-input v-model="form.productNameList" placeholder="请输入" />
        <!-- <el-input
          placeholder="请输入"
          v-model="form.productName"
          clearable
        /> -->
      </el-form-item>
      <el-form-item label="商品状态"  v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="product_status"
          v-model="form.productStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <template v-if="show">
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
      <ButtonGroup maxWidth="85%" collapseDirection="left">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
        <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量上架</el-button>
        <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(2)" :disabled="selectionList.length === 0">批量下架</el-button>
        <el-button v-if="canImport" size="small" @click="handleImport('productInfoImport')">导入</el-button>
        <el-button v-permission="moduleKey+'-saleAttributeimport'" size="small" @click="handleImport('productSaleAttributeImport')">订购属性导入</el-button>
        <el-button v-permission="moduleKey+'-skuimport'" size="small" @click="saleAttributeImport('productSaleAttributeImport')">物料价格导入</el-button>
        <el-button v-if="canExport" :loading="infoLoading" size="small" @click="exportExcel('productInfoImport')">导出</el-button>
        <el-button v-permission="moduleKey+'-saleAttributeexport'" :loading="saleAttributeLoading" size="small" @click="saleAttributeExportExcel" :disabled="selectionList.length === 0">订购属性导出</el-button>
        <el-button v-permission="moduleKey+'-skuexport'" :loading="skuPriceLoading" size="small" @click="exportExcel('productSkuPriceImport')" :disabled="selectionList.length === 0">商品定价导出</el-button>
        <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      </ButtonGroup>
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
      v-if="uploadDialogVisible"
      :visible="uploadDialogVisible"
      :id="currentImportType"
      @close="handleUploadDialogClose"
    />
    <sale-attribute-upload
      v-if="saleAttributeVisible"
      :visible="saleAttributeVisible"
      :id="currentImportType"
      @close="saleAttributeVisible = false"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, productSaleAttributeExport } from '@/api/vehretail/productManager/productCenter/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import saleAttributeUpload from './saleAttributeUpload.vue';
import ButtonGroup from '@/libs/components/ButtonGroup';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对1
  productCode: '',
  productName: '',
  productType: '',
  purchaseType: '',
  creator: '',
  updateTime: '',
  createTime: '',
  productStatusList: [],
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    TagInput,
    saleAttributeUpload,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload,
    ButtonGroup
  },
  data () {
    return {
      exportExcelData: {
        productInfoImport: {
          businessType: '商品中心管理',
          title: '商品中心管理',
          dataFetchPath: '/vr/web/product/productInfo/page',
          loading: 'infoLoading'
        },
        productSkuPriceImport: {
          businessType: '商品SKU价格维护管理',
          title: '商品SKU价格维护管理',
          dataFetchPath: '/vr/web/product/productSku/page',
          loading: 'skuPriceLoading'
        },
      },
      currentImportType: '',
      pageTitle: '商品中心',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-productInfo',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      infoLoading: false,
      saleAttributeLoading: false,
      skuPriceLoading: false,
      uploadDialogVisible: false,
      saleAttributeVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'productCenterTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'productCode',
            label: '商品编码',
            visible: true,
            width: 150,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/productManager/productCenter/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'productName', label: '商品名称', visible: true, width: 180 },
          { props: 'productTypeLabel', label: '商品类型', visible: true, width: 150 },
          { props: 'purchaseTypeLabel', label: '购车类型', visible: true, width: 150 },
          { props: 'productStatusLabel', label: '商品状态', visible: true, width: 120 },
          { props: 'creatorName', label: '创建者', visible: true, width: 140 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
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
                  path: '/vehretail/productManager/productCenter/edit',
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
    saleAttributeImport () {
      this.saleAttributeVisible = true;
    },
    handleImport (importType) {
      this.currentImportType = importType;
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/vehretail/productManager/productCenter/edit'
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
    saleAttributeExportExcel () {
      this.saleAttributeLoading = true;
      let params = this.selectionList.map(ele => ele.productCode);
      productSaleAttributeExport(params).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '订购属性导出.xlsx');
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
        this.saleAttributeLoading = false;
      });
    },
    exportExcel (type) {
      this[this.exportExcelData[type].loading] = true;
      exportTable({
        businessType: this.exportExcelData[type].businessType,
        dataFetchPath: this.exportExcelData[type].dataFetchPath,
        reqParams: type === 'productInfoImport' ? this.getFormData() : { productIds: this.selectionList.map(ele => ele.id) },
        titleMap: type === 'productInfoImport' ? Object.fromEntries(this.$refs.tableRef.getVisibleCols())
          : {
            productCode: '商品编码',
            skuCode: 'SKU编码',
            saleAttribute: '销售属性',
            marketGuidePrice: '市场指导价',
            materialsCode: '物料编码',
            statusLabel: '状态'
          },
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, this.exportExcelData[type].title);
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
        this[this.exportExcelData[type].loading] = false;
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
    handleBatchShelfChange ({ selectionList, targetStatus, apiFunc, refreshFunc }) {
      const statusText = { 1: '上架', 2: '下架' }[targetStatus] || (targetStatus === 1 ? '上架' : '下架');
      if (!selectionList?.length) {
        this.$message.warning('请先选择要操作的数据!');
        return;
      }
      const hasInvalidItem = selectionList.some(item => item.status === targetStatus);
      if (hasInvalidItem) {
        const allInvalid = selectionList.every(item => item.status === targetStatus);
        this.$message.warning(
          allInvalid
            ? `选中的数据已经是${statusText}状态，无需重复操作！`
            : `选中的数据中存在${statusText}状态的数据，无法批量${statusText}！`
        );
        return;
      }
      this.$confirm(`此操作将${statusText}选中项，是否继续?`, '提示', {
        type: 'warning'
      })
        .then(() => apiFunc({
          idSet: selectionList.map(item => item.id),
          productStatus: targetStatus
        }))
        .then(() => {
          this.$message.success('操作成功!');
          refreshFunc?.();
        })
        .catch(err => {
          if (err !== 'cancel') {
            this.$message.error('操作失败!');
          }
        });
    },
    // 批量启用停用
    handleBatchEnable (status) {
      this.handleBatchShelfChange({
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
.m-product-center-list {
}
</style>
