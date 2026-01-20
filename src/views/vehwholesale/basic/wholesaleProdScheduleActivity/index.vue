<template>
  <div class="page-common m-wholesale-prod-schedule-activity-list">
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
      <el-form-item label="创建时间">
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
      <template v-if="show">
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
        <el-form-item label="是否需要自动配车">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.needAutoAllocateCar"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="指定发运方式">
          <fetch-select
          :request="fetchOptions"
          enumCode="vehstock_ship_via"
          v-model="form.deliveryWays"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
        </el-form-item>
      </template>
        <!-- v-if="canList" -->
      <page-search-action
        v-model="show"
        is-expandable
        v-if="canList"
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>

    <div class="ais-actions">
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
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
      <el-dialog
    class="audit-total-dialog"
    title="排产专项活动明细配额调整"
    width="800px"
    :visible.sync="totalQuotaQtyDialogVisible"
    @close="changeClose"
  >
    <el-form ref="changeformRef" :model="changeform" :rules="changerules" label-width="120px">
      <el-form-item label="id：" prop="id" v-show="changeformId">
          <el-input
            placeholder="请输入"
            v-model="changeform.id"
            clearable
          />
        </el-form-item>

        <el-form-item label="调整额度数量：" prop="beforetotalQuotaQty">
          <el-input-number
            :controls="false"
            style="width: 100%;"
            placeholder="请输入"
            v-model="changeform.beforetotalQuotaQty"
            clearable
            :precision="0"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="配额数量：" prop="totalQuotaQty">
          <el-input-number
            :controls="false"
            style="width: 100%;"
            placeholder="请输入"
            v-model="changeform.totalQuotaQty"
            clearable
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="已提报数量：" prop="requestQty">
          <el-input-number
            :controls="false"
            style="width: 100%;"
            placeholder="请输入"
            v-model="changeform.requestQty"
            clearable
            :precision="0"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="剩余可用：" prop="remainQuotaQty">
          <el-input-number
            :controls="false"
            style="width: 100%;"
            placeholder="请输入"
            v-model="changeform.remainQuotaQty"
            clearable
            :precision="0"
            :disabled="true"
          />
        </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer" style="text-align: center;">
        <el-button :loading="submitLoading" type="primary" @click="changeSure()">确认</el-button>
        <el-button :loading="submitLoading"  @click="changeClose()">取消</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, getDetail, updateQuotaQty } from '@/api/vehwholesale/basic/wholesaleProdScheduleActivity/index';
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
  createTime: '',
  activityName: '',
  needAutoAllocateCar: '',
  deliveryWay: '',
  allowLockRetail: '',
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
      pageTitle: '整车批售-批售主数据-排产专项活动管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleProdScheduleActivity',
      changeId: -1,
      form: {
        ...defaultForm
      },
      changeform: {},
      changeformId: false,
      changerules: {
        changeBeforeQty: [
          { required: true, message: '请输入变化前数量', trigger: 'blur' }
        ],
        changeAfterQty: [
          { required: true, message: '请输入变化后数量', trigger: 'blur' }
        ],
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      submitLoading: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      totalQuotaQtyDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'wholesaleProdScheduleActivityTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'activityCode',
            label: '活动编码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/basic/wholesaleProdScheduleActivity/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'activityName', label: '活动名称', visible: true, width: 200 },
          { props: 'needAutoAllocateCarLabel', label: '是否需要自动配车', visible: true, width: 200 },
          { props: 'deliveryWayLabel', label: '指定发运方式', visible: true, width: 200 },
          { props: 'allowLockRetailLabel', label: '是否锁零售单', visible: true, width: 200 },
          { props: 'totalQuotaQty', label: '额度数量', visible: true, width: 200 },
          { props: 'usedQuotaQty', label: '已提报数量', visible: true, width: 200 },
          { props: 'startTime', label: '开始日期', visible: true, width: 200 },
          { props: 'endTime', label: '截止日期', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'creatorName', label: '创建人', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '配额调整',
              click: (rowIndex, row) => {
                this.changeTotalQuotaQty(row.id);
              },
              type: 'info'
            }, {
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/basic/wholesaleProdScheduleActivity/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
              show: (row) => {
                return row.usedQuotaQty === 0;
              },
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
    changeClose () {
      this.totalQuotaQtyDialogVisible = false;
    },
    changeSure () {
      this.$refs.changeformRef.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          const submitForm = {
            id: this.changeform.id,
            totalQuotaQty: this.changeform.totalQuotaQty
          };
          updateQuotaQty(submitForm).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.getData();
            this.totalQuotaQtyDialogVisible = false;
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    changeTotalQuotaQty (id) {
      this.totalQuotaQtyDialogVisible = true;
      this.changeId = id;
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.changeform, res);
          this.changeform.beforetotalQuotaQty = res.totalQuotaQty;
        });
      }
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
        path: '/vehwholesale/basic/wholesaleProdScheduleActivity/edit'
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
        businessType: '整车批售-批售主数据-排产专项活动管理',
        dataFetchPath: 'vw/web/basic/wholesaleProdScheduleActivity/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '整车批售-批售主数据-排产专项活动管理.xlsx');
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-wholesale-prod-schedule-activity-list {
}
</style>
