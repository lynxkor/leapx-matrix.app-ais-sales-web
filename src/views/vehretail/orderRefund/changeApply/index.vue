<template>
  <div class="page-common m-order-change-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="180px"
      class="ais-search-form"
    >
      <el-form-item label="申请编号">
        <tag-input v-model="form.changeApplyCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="商城订单编号"  v-show="this.visibleCount === 3 || show">
        <tag-input v-model="form.mallOrderCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="订单销售门店">
        <tag-input v-model="form.saleDealerNameList" placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="申请状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="vehretail_order_change_apply_status"
            v-model="form.applyStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="原购车人手机号码">
          <tag-input v-model="form.originalBuyerPhoneList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="变更后购车人手机号码">
          <tag-input v-model="form.newBuyerPhoneList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="变更原因">
          <fetch-select
            v-bind="selectReasonOptions"
            :remote-method="changeReasonSearch"
            v-model="form.changeReasonCode"
          />
        </el-form-item>
        <el-form-item label="缴定金时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.paymentTimeRange"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handlePaymentTimeChange"
          />
        </el-form-item>
        <el-form-item label="交车时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.deliveryTimeRange"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDeliveryTimeChange"
          />
        </el-form-item>
        <el-form-item label="基本车型">
          <el-input
            placeholder="请输入"
            v-model="form.modelName"
            clearable
          />
        </el-form-item>
        <el-form-item label="变更类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vehretail_order_change_type"
            v-model="form.changeType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="变更说明">
          <el-input v-model="form.changeExplain" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="门店整车订单">
          <tag-input v-model="form.retailOrderCodeList" placeholder="请输入" />
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
<!--      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>-->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
<!--      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>-->
<!--      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>-->
<!--      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>-->
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
import { deleteItem, enableItem, getList } from '@/api/vehretail/orderRefund/orderChange/index';
import { exportTable, getEnum, getTableConfig, tableAddOrUpdate } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel, handleBatchStatusChange } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import { fetchReasonLabelList } from '@/api/vehretail/orderRefund/changeReason';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  changeApplyCode: '',
  retailOrderCode: '',
  mallOrderCode: '',
  saleDealerCode: '',
  paymentTimeStart: null,
  paymentTimeEnd: null,
  deliveryTimeStart: '',
  deliveryTimeEnd: '',
  modelId: '',
  applyStatus: '',
  changeType: '',
  changeReason: '',
  originalBuyerPhone: '',
  newBuyerPhone: '',
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
      selectReasonOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'code',
        clearable: true,
        // multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true,
      },
      pageTitle: '订单信息变更申请',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVRROCA-retailOrderChangeApply',
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
        id: 'orderChangeTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'changeApplyCode',
            label: '申请编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderRefund/changeApply/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'mallOrderCode', label: '商城订单编号', visible: true, width: 200 },
          // { props: 'retailOrderCode', label: '门店整车订单', visible: false, width: 200 },
          // { props: 'saleDealerCode', label: '销售门店编码', visible: false, width: 200 },
          { props: 'saleDealerName', label: '订单销售门店', visible: true, width: 200 },
          { props: 'paymentTime', label: '缴定金时间', visible: true, width: 200 },
          { props: 'deliveryTime', label: '交车时间', visible: true, width: 200 },
          // { props: 'modelId', label: '车型ID', visible: false, width: 200 },
          { props: 'modelName', label: '基本车型', visible: true, width: 200 },
          { props: 'applyStatusLabel', label: '申请状态', visible: true, width: 200 },
          { props: 'changeTypeLabel', label: '变更类型', visible: true, width: 200 },
          { props: 'changeReason', label: '变更原因', visible: true, width: 200 },
          { props: 'changeExplain', label: '变更说明', visible: true, width: 200 },
          { props: 'originalBuyerName', label: '原购车人名称', visible: true, width: 200 },
          { props: 'originalBuyerPhone', label: '原购车人手机号码', visible: true, width: 200 },
          { props: 'originalIdCardNo', label: '原购车人证件号码', visible: true, width: 200 },
          { props: 'originalIdCardTypeLabel', label: '原购车人证件类型', visible: true, width: 200 },
          { props: 'originalAgentName', label: '原代办人', visible: true, width: 200 },
          // { props: 'originalSaleDealerCode', label: '原销售门店编码', visible: false, width: 200 },
          { props: 'originalSaleDealerName', label: '原销售门店', visible: true, width: 200 },
          { props: 'deliveryStatusLabel', label: '是否完成交车', visible: true, width: 200 },
          { props: 'newBuyerName', label: '变更后购车人姓名', visible: true, width: 200 },
          { props: 'newBuyerPhone', label: '变更后购车人手机号码', visible: true, width: 200 },
          { props: 'newIdCardNo', label: '变更后购车人证件号码', visible: true, width: 200 },
          { props: 'newIdCardTypeLabel', label: '变更后购车人证件类型', visible: true, width: 200 },
          { props: 'newAgentName', label: '变更后代办人', visible: true, width: 200 },
          // { props: 'newSaleDealerCode', label: '变更后销售门店编码', visible: false, width: 200 },
          { props: 'newSaleDealerName', label: '变更后销售门店', visible: true, width: 200 },
          // { props: 'originalOrderStatusLabel', label: '原整车订单状态', visible: false, width: 200 },
          // { props: 'originalMaterialsCode', label: '原订单物料码', visible: false, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
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
              //       path: '/vehretail/orderRefund/changeApply/edit',
              //       query: {
              //         id: row.id
              //       }
              //     });
              //   },
              //   type: 'info'
              // }
            ]
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
        path: '/vehretail/orderRefund/changeApply/edit'
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
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '订单信息变更申请',
        dataFetchPath: '/vr/web/order/retailOrderChangeApply/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '订单信息变更申请.xlsx');
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
      if (this.selectionList.length > 0) {
        data.ids = this.selectionList.map(item => item.id);
      }

      return data;
    },
    async fetchOptions (code) {
      if (code) {
        if (code === 'vehretail_order_change_apply_status') {
          // 对结果进行过滤
          let res = [];
          res = await getEnum(code);
          return res.filter(item => !(item.code === '1025' || item.code === '1027'));
        } else {
          return getEnum(code);
        }
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
    handlePaymentTimeChange (paymentTime) {
      if (paymentTime && paymentTime.length > 1) {
        this.form.paymentTimeStart = paymentTime[0];
        this.form.paymentTimeEnd = paymentTime[1];
      } else {
        this.form.paymentTimeStart = null;
        this.form.paymentTimeEnd = null;
      }
    },
    handleDeliveryTimeChange (deliveryTime) {
      if (deliveryTime && deliveryTime.length > 1) {
        this.form.deliveryTimeStart = deliveryTime[0];
        this.form.deliveryTimeEnd = deliveryTime[1];
      } else {
        this.form.deliveryTimeStart = null;
        this.form.deliveryTimeEnd = null;
      }
    },
    async changeReasonSearch (val) {
      const params = {
        pageSize: 1000,
        changeName: val,
        changeType: this.form.changeType
      };
      return await fetchReasonLabelList(params);
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
.m-order-change-list {
}
</style>
