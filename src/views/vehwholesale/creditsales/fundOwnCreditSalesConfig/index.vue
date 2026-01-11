<template>
  <div class="page-common m-fund-own-credit-sales-config-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="120px"
      class="ais-search-form"
    >
      <!-- <el-form-item label="主键">
        <el-input
          placeholder="请输入"
          v-model="form.id"
          clearable
        />
      </el-form-item> -->
      <el-form-item label="母公司名称">
        <tag-input v-model="form.dealerCompanyNames" placeholder="请输入" />
      </el-form-item>
       <el-form-item label="配置时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.configTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

      <template v-if="show">
         <el-form-item label="配置状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="ve_credit_sales_config_audit_status"
            v-model="form.auditStatuses"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="母公司编码" >
          <tag-input v-model="form.dealerCompanyCodes" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="复核时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.reviewTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="赊销账户状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_fund_own_credit_sales_limit_status"
            v-model="form.creditAccountStatus"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <!-- <el-form-item label="备注">
          <el-input
            placeholder="请输入"
            v-model="form.remark"
            clearable
          />
        </el-form-item>
        <el-form-item label="复核意见">
          <el-input
            placeholder="请输入"
            v-model="form.reviewOpinion"
            clearable
          />
        </el-form-item>
        <el-form-item label="修改人">
          <el-input
            placeholder="请输入"
            v-model="form.modifierName"
            clearable
          />
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.updateTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item> -->
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
      <!-- <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button> -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button> -->
      <!-- <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button> -->
      <!-- <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
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
      :id="'1'"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, submitItem, cancelItem } from '@/api/vehwholesale/creditsales/fundOwnCreditSalesConfig/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getParentCompany } from '@/api/common';
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
  id: '',
  dealerCompanyName: '',
  dealerCompanyCode: '',
  creditAccountStatus: '',
  creditAmount: '',
  creatorName: '',
  createTime: '',
  auditStatus: '',
  remark: '',
  reviewOpinion: '',
  modifierName: '',
  updateTime: '',
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
      pageTitle: '账户管理-赊销管理-自有资金赊销配置管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundOwnCreditSalesConfig',
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
        id: 'fundOwnCreditSalesConfigTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'configCode',
            label: '配置编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/creditsales/fundOwnCreditSalesConfig/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dealerCompanyCode', label: '母公司编码', visible: true, width: 200 },
          { props: 'dealerCompanyName', label: '母公司名称', visible: true, width: 200 },
          { props: 'creditAccountStatusLabel', label: '赊销账户状态', visible: true, width: 200 },
          { props: 'creditAmount', label: '授信额度', visible: true, width: 200 },
          { props: 'downPaymentRatio', label: '首付款比例%', visible: true, width: 200 },
          { props: 'effectiveTime', label: '额度生效日期', visible: true, width: 200 },
          { props: 'expireTime', label: '额度失效日期', visible: true, width: 200 },
          { props: 'configUserName', label: '配置人', visible: true, width: 200 },
          { props: 'configTime', label: '配置时间', visible: true, width: 200 },
          { props: 'auditStatusLabel', label: '配置状态', visible: true, width: 200 },
          { props: 'reviewName', label: '复核人', visible: true, width: 200 },
          { props: 'reviewTime', label: '复核时间', visible: true, width: 200 },
          { props: 'reviewOpinion', label: '复核意见', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          // { props: 'creatorName', label: '创建人', visible: true, width: 200 },
          // { props: 'auditStatusLabel', label: '配置状态', visible: true, width: 200 },
          // { props: 'modifierName', label: '修改人', visible: true, width: 200 },
          // { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              show: (row) => {
                return row.auditStatus === 0 || row.auditStatus === 2;
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/creditsales/fundOwnCreditSalesConfig/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '提交',
              show: (row) => {
                return row.auditStatus === 0 || row.auditStatus === 2;
              },
              // popconfirmTitle: '是否对配置编号为' + row.configCode + '的数据进行提交?',
              click: (rowIndex, row) => {
                this.handleSubmit(rowIndex, row.id, row.configCode);
                // submitItem({
                //   idSet: [row.id]
                // }).then(() => {
                //   this.$message({
                //     type: 'success',
                //     message: '作废成功!'
                //   });
                //   this.getData();
                // }).catch(() => {
                //   this.$message({
                //     type: 'error',
                //     message: '作废失败!'
                //   });
                // });
              },
              type: 'info'
            }, {
              name: '复核',
              show: (row) => {
                return row.auditStatus === 1;
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/creditsales/fundOwnCreditSalesConfig/review',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '作废',
              show: (row) => {
                return row.auditStatus === 0 || row.auditStatus === 2;
              },
              // popconfirmTitle: '是否对配置编号为' + row.configCode + '的数据进行作废?',
              click: (rowIndex, row) => {
                this.handleCancel(rowIndex, row.id, row.configCode);
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
        path: '/vehwholesale/creditsales/fundOwnCreditSalesConfig/edit'
      });
    },
    onSubmit () {
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
      exportTable({
        businessType: '账户管理-赊销管理-自有资金赊销配置管理',
        dataFetchPath: '/vw/web/creditsales/fundOwnCreditSalesConfig/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '账户管理-赊销管理-自有资金赊销配置管理.xlsx');
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
        if (data[key] === '' || data[key] === null || (typeof data[key] === 'object' && Object.keys(data[key]).length === 0)) {
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

      if (this.form.configTime) {
        delete data.configTime;
        if (this.form.configTime.length > 1) {
          data.configTimeStart = this.form.configTime[0];
          data.configTimeEnd = this.form.configTime[1];
        }
      }

      if (this.form.reviewTime) {
        delete data.reviewTime;
        if (this.form.reviewTime.length > 1) {
          data.reviewTimeStart = this.form.reviewTime[0];
          data.reviewTimeEnd = this.form.reviewTime[1];
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
    handleSubmit (ind, id, configCode) {
      this.$confirm('是否对配置编号为' + configCode + '的数据进行提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submitItem({ idSet: [id] }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '提交失败!'
          });
        });
      }).catch(() => {});
    },
    handleCancel (ind, id, configCode) {
      this.$confirm('是否对配置编号为' + configCode + '的数据进行作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelItem({ idSet: [id] }).then(() => {
          this.$message({
            type: 'success',
            message: '作废成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '作废失败!'
          });
        });
      }).catch(() => {});
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
    },
    async getParentCompany (query) {
      try {
        return await getParentCompany({ parentCompanyName: query });
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.m-fund-own-credit-sales-config-list {
}
</style>
