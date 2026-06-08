<template>
  <div class="page-common m-wholesale-prod-schedule-activity-detail-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
     <el-form-item label="活动名称">
        <tag-input v-model="form.activityNames" placeholder="请输入" />
      </el-form-item>
      <!-- <el-form-item label="活动编码">
        <tag-input v-model="form.activityCodes" placeholder="请输入" />
      </el-form-item> -->
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
       <el-form-item label="门店名称" v-show="this.visibleCount === 3 || show">
        <tag-input v-model="form.dealerNames" placeholder="请输入" />
      </el-form-item>
      <!-- <el-form-item label="排产活动ID">
        <el-input
          placeholder="请输入"
          v-model="form.scheduleActivityId"
          clearable
        />
      </el-form-item>
      <el-form-item label="车系ID"  v-show="this.visibleCount === 3 || show">
        <el-input
          placeholder="请输入"
          v-model="form.seriesId"
          clearable
        />
      </el-form-item> -->
      <template v-if="show">
        <el-form-item label="车系">
        <fetch-select
            :remote-method="seriesSearch"
            remote
            v-model="form.seriesIds"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            clearable
            multiple
            collapseTags
            filterable
            :options="seriesList"
             />
      </el-form-item>
       <el-form-item label="系列">

        <fetch-select remote
        :params="form.modelLineName"
        :remote-method="getVehicleModelLineList"
         v-model="form.modelLineIds" placeholder="请选择" value-key="id" label-key="name" multiple clearable collapseTags filterable/>

          <!-- <fetch-select
            :remote-method="modelSearch"
            remote
            reserve-keyword
            :options="modelList" v-model="form.modelLineIds" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable
            /> -->
        </el-form-item>
        <el-form-item label="物料编码">
          <tag-input v-model="form.materialsCodes" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否锁零售单">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.allowLockRetail"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
      </template>
        <!-- v-if="canList" -->
      <page-search-action
        v-model="show"
        v-if="canList"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button> -->
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
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/vehwholesale/basic/wholesaleProdScheduleActivityDetail/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, vehicleSeriesList, vehicleModelList, vehicleModelLineList } from '@/api/common';
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
  scheduleActivityId: '',
  seriesId: '',
  modelLineId: '',
  materialsCode: '',
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
      pageTitle: '排产专项活动明细',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleProdScheduleActivityDetail',
      form: {
        ...defaultForm
      },
      selectionList: [],
      modelList: [],
      seriesList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'wholesaleProdScheduleActivityDetailTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'activityDetailCode',
            label: '活动明细编码',
            visible: true,
            width: 150,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/basic/wholesaleProdScheduleActivityDetail/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'activityName',
            label: '活动名称',
            visible: true,
            width: 150,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/vehwholesale/basic/wholesaleProdScheduleActivity/edit?id=${row.scheduleActivityId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'modelLineName',
            label: '系列',
            visible: true,
            width: 120,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehiclemodelline/edit?id=${row.modelLineId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'deliveryWayLabel', label: '指定发运方式', visible: true, width: 140 },
          { props: 'allowLockRetailLabel', label: '是否锁零售单', visible: true, width: 140 },
          { props: 'startTime', label: '开始日期', visible: true, width: 160 },
          { props: 'endTime', label: '截止日期', visible: true, width: 160 },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 150,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 180 },
          { props: 'provinceName', label: '省份', visible: true, width: 100 },
          { props: 'cityName', label: '城市', visible: true, width: 100 },
          { props: 'applyOrderCategoryLabel', label: '适用订单分类', visible: true, width: 150 },
          {
            props: 'seriesName',
            label: '车系',
            visible: true,
            width: 120,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleseries/edit?id=${row.seriesId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'yearTypeName',
            label: '年款名称',
            visible: true,
            width: 120,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleyeartype/edit?id=${row.yearTypeId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'materialsCode',
            label: '物料编码',
            visible: true,
            width: 160,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehiclematerials/edit?id=${row.materialsId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 300 },
          { props: 'totalQuotaQty', label: '额度数量', visible: true, width: 120, align: 'right' },
          { props: 'usedQuotaQty', label: '已提报数量', visible: true, width: 120, align: 'right' },
          { props: 'remainQuotaQty', label: '剩余可用', visible: true, width: 120, align: 'right' },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '日志',
              click: (rowIndex, row) => {
                this.$auditLog.show({ id: row.id });
              },
              type: 'info'
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
    async getVehicleModelLineList (val) {
      const res = await vehicleModelLineList({ size: 1000, modelLineNameLike: val });
      return res;
    },
    async seriesSearch (query) {
      try {
        const res = await vehicleSeriesList({ seriesNameLike: query });
        this.seriesList = res;
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async modelSearch (query) {
      // if (query) {
      let params = {
        modelNameLike: query || '',
        seriesIdList: this.form.seriesIds || []
      };
      let res = await vehicleModelList(params);
      if (res.length) {
        const vehicleModelData = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.id
          };
        });
        this.modelList = vehicleModelData;
      } else {
        this.modelList = [];
      }
      // }
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
        path: '/vehwholesale/basic/wholesaleProdScheduleActivityDetail/edit'
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
        businessType: '排产专项活动明细',
        dataFetchPath: 'vw/web/basic/wholesaleProdScheduleActivityDetail/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '排产专项活动明细.xlsx');
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
              dealerId: item.dealerId || '',
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-wholesale-prod-schedule-activity-detail-list {
}
</style>
