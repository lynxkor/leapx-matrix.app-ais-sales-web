<template>
  <div class="page-common m-vehicle-reservation-detail-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="车辆预留编号">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="业务编号">
        <el-input
          placeholder="请输入"
          v-model="form.bizCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="VIN"  v-show="visibleCount === 3 || show">
        <tag-input v-model="form.vinList" placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="备注">
          <el-input
            placeholder="请输入"
            v-model="form.remarkLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="库存状态">
          <fetch-select :request="fetchOptions" enumCode="vehstock_vdc_inventory_status" v-model="form.vdcInventoryStatus"
            placeholder="请选择" clearable filterable />
        </el-form-item>
        <el-form-item label="销售预留">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.reserved"
            placeholder="请选择" clearable filterable />
        </el-form-item>
        <el-form-item label="销售预留类型">
          <fetch-select :request="fetchOptions" enumCode="vehstock_reserved_type"
            v-model="form.reservedTypeList" placeholder="请选择" clearable multiple filterable />
        </el-form-item>
        <el-form-item label="整车物流预留">
          <fetch-select :request="fetchOptions" enumCode="BooleanEnum" v-model="form.logisticsReserved"
            placeholder="请选择" clearable filterable />
        </el-form-item>
        <el-form-item label="车辆交付状态">
          <fetch-select :request="fetchOptions" enumCode="vehstock_vehicle_delivery_status"
            v-model="form.vehicleDeliveryStatusList" placeholder="请选择" clearable multiple filterable />
        </el-form-item>
      <el-form-item label="VDC入库时间">
        <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.inboundDateTime" type="daterange"
          :picker-options="pickerOptions" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
        <el-form-item label="创建人">
          <el-input
            placeholder="请输入"
            v-model="form.createByName"
            clearable
          />
        </el-form-item>
        <el-form-item label="更新人">
          <el-input
            placeholder="请输入"
            v-model="form.updateByName"
            clearable
          />
        </el-form-item>
      </template>
      <page-search-action
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <!-- <el-button :loading="exportLoading" size="small" @click="exportExcel">导出</el-button> -->
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
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
    <Upload
      :visible="uploadDialogVisible"
      templateUrl=""
      uploadUrl=""
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import TagInput from '@/libs/components/TagInput';
import { getList, deleteItem, enableItem } from '@/api/vehstock/basic/vehicleReservationDetail/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import Upload from '@/libs/components/UploadDialog';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { handleBatchStatusChange, getEndOfDayString } from '@/libs/utils';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  codeLike: '', // 模糊查询
  codeList: [], // 精确查询
  bizCode: '',
  vinLike: '', // 模糊查询
  vinList: [], // 精确查询
  remarkLike: '',
  createByName: '',
  updateByName: '',
  vdcInventoryStatus: '',
  reserved: '',
  reservedType: '',
  reservedTypeList: [],
  logisticsReserved: '',
  vehicleDeliveryStatus: '',
  vehicleDeliveryStatusList: [],
  inboundDateTime: []
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
    Upload,
    FetchSelect,
    TagInput
  },
  data () {
    return {
      pageTitle: '车辆预留明细',
      pageType: 'list',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      moduleKey: 'AISVS-vehicleReservationDetail',
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      optionObj: {
        id: 'vehicleReservationDetailTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '车辆预留编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehstock/basic/vehicleReservationDetail/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'bizCode', label: '业务编号', visible: true, width: 120 },
          { props: 'vin', label: 'VIN', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${row.vin}`, '_blank'); }, type: 'primary' }] },
          { props: 'reserveTime', label: '预留时间', visible: true, width: 180 },
          { props: 'reserveNum', label: '需预留数', visible: true, align: 'right', width: 100 },
          { props: 'reservedNum', label: '已预留数', visible: true, align: 'right', width: 100 },
          { props: 'reservedLabel', label: '销售预留', visible: true, width: 120 },
          { props: 'reservedTypeLabel', label: '销售预留类型', visible: true, width: 120 },
          { props: 'logisticsReservedLabel', label: '整车物流预留', visible: true, width: 120 },
          { props: 'vehicleDeliveryStatusLabel', label: '车辆交付状态', visible: true, width: 120 },
          { props: 'vdcInventoryStatusLabel', label: '库存状态', visible: true, width: 120 },
          { props: 'inboundDateTime', label: 'VDC入库时间', visible: true, width: 180 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 120 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 120 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '删除',
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '删除',
              popconfirmTitle: '确认删除选中预留配置明细数据？',
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
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
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
        businessType: '车辆预留明细',
        dataFetchPath: '/vehstock/web/basic/vehicleReservationDetail/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(res => {
        if (res) {
          if (res.excelUrl) {
            window.location.href = res.excelUrl;
          } else {
            this.$message({
              type: 'error',
              message: '导出失败'
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

      if (this.form.inboundDateTime) {
        delete data.inboundDateTime;
        if (this.form.inboundDateTime.length > 1) {
          data.inboundDateTimeStart = this.form.inboundDateTime[0];
          data.inboundDateTimeEnd = this.form.inboundDateTime[1];
        }
      }

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = getEndOfDayString(this.form.createTime[1]);
        }
      }

      // 判断是模糊查询还是精确查询，不能同时使用
      if (Array.isArray(this.form.codeList) && this.form.codeList.length <= 1) {
        delete data.codeList;
        data.codeLike = this.form.codeList[0] || '';
      }
      if (Array.isArray(this.form.vinList) && this.form.vinList.length <= 1) {
        delete data.vinList;
        data.vinLike = this.form.vinList[0] || '';
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
    },
  }
};
</script>

<style lang="scss" scoped>
.m-vehicle-reservation-detail-list {
}
</style>
