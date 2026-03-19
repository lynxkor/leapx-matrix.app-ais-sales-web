<template>
  <div class="page-common m-special-vehicle-sales-report-list">
    <!-- 查询条件 -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="120px"
      class="ais-search-form"
    >
      <template v-if="show">
        <el-form-item label="特殊车辆销售提报编号">
          <el-input v-model="form.specialReportCode" placeholder="请输入特殊车辆销售提报编号" clearable />
        </el-form-item>
        <el-form-item label="VIN码">
          <el-input v-model="form.vin" placeholder="请输入VIN码" clearable />
        </el-form-item>
        <el-form-item label="车型名称">
          <el-input v-model="form.modelName" placeholder="请输入车型名称" clearable />
        </el-form-item>
        <el-form-item label="车辆属性">
          <el-select v-model="form.vehicleAttribute" placeholder="请选择车辆属性" clearable>
            <el-option label="家用" :value="1"></el-option>
            <el-option label="营运" :value="2"></el-option>
            <el-option label="B级车" :value="4"></el-option>
            <el-option label="J级车" :value="10"></el-option>
            <el-option label="J1级车" :value="20"></el-option>
            <el-option label="专车" :value="30"></el-option>
            <el-option label="报废灭失" :value="60"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆用途">
          <el-select v-model="form.vehiclePurpose" placeholder="请选择车辆用途" clearable>
            <el-option label="私家车" :value="10"></el-option>
            <el-option label="公户车" :value="20"></el-option>
            <el-option label="试乘试驾车" :value="30"></el-option>
            <el-option label="大客户用车" :value="40"></el-option>
            <el-option label="营运-预约出租客运" :value="50"></el-option>
            <el-option label="其他" :value="100"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车主姓名">
          <el-input v-model="form.carBuyerName" placeholder="请输入车主姓名" clearable />
        </el-form-item>
        <el-form-item label="车主手机号码">
          <el-input v-model="form.carBuyerPhone" placeholder="请输入车主手机号码" clearable />
        </el-form-item>
        <el-form-item label="销售门店名称">
          <el-input v-model="form.saleDealerName" placeholder="请输入销售门店名称" clearable />
        </el-form-item>
        <el-form-item label="交付门店名称">
          <el-input v-model="form.deliveryDealerName" placeholder="请输入交付门店名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态" clearable>
            <el-option label="草稿" :value="0"></el-option>
            <el-option label="已提交" :value="1"></el-option>
            <el-option label="作废" :value="20"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="form.submitTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
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
      <!-- 页面顶部操作按钮 -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button size="small" @click="refreshData">刷新</el-button>

      <!-- 批量操作按钮 -->
      <el-button
        v-if="canDelete"
        size="small"
        @click="handleBatchDelete"
        :disabled="selectedDraftRecords.length === 0">批量删除</el-button>
      <el-button
        v-if="canBatchCancel"
        size="small"
        @click="handleBatchCancel"
        :disabled="selectedDraftRecords.length === 0">批量作废</el-button>
      <el-button
        v-if="canBatchRevoke"
        size="small"
        @click="handleBatchRevoke"
        :disabled="selectedSubmittedRecords.length === 0">批量撤回</el-button>
    </div>
    <div class="ais-table-c">
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

    <!-- 作废确认弹窗 -->
    <el-dialog
      title="作废说明"
      :visible.sync="cancelDialogVisible"
      width="500px"
      :before-close="handleCancelDialogClose">
      <el-form :model="cancelForm" ref="cancelFormRef" :rules="cancelRules">
        <el-form-item label="作废说明" prop="remark">
          <el-input
            v-model="cancelForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入作废说明"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelDialogClose">取 消</el-button>
        <el-button type="primary" @click="confirmCancel">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 撤回确认弹窗 -->
    <el-dialog
      title="撤回说明"
      :visible.sync="revokeDialogVisible"
      width="500px"
      :before-close="handleRevokeDialogClose">
      <el-form :model="revokeForm" ref="revokeFormRef" :rules="revokeRules">
        <el-form-item label="撤回说明" prop="remark">
          <el-input
            v-model="revokeForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入撤回说明"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleRevokeDialogClose">取 消</el-button>
        <el-button type="primary" @click="confirmRevoke">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 调整车辆属性弹窗 -->
    <el-dialog
      title="调整车辆属性"
      :visible.sync="adjustDialogVisible"
      width="500px"
      :before-close="handleAdjustDialogClose">
      <el-form :model="adjustForm" ref="adjustFormRef" :rules="adjustRules">
        <el-form-item label="车辆属性" prop="vehicleAttribute">
          <el-select v-model="adjustForm.vehicleAttribute" placeholder="请选择车辆属性">
            <el-option label="家用" :value="1"></el-option>
            <el-option label="营运" :value="2"></el-option>
            <el-option label="B级车" :value="4"></el-option>
            <el-option label="J级车" :value="10"></el-option>
            <el-option label="J1级车" :value="20"></el-option>
            <el-option label="专车" :value="30"></el-option>
            <el-option label="报废灭失" :value="60"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAdjustDialogClose">取 消</el-button>
        <el-button type="primary" @click="confirmAdjust">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, submitReport, cancelReport, revokeReport, batchCancelReports, batchRevokeReports, adjustVehicleAttribute } from '@/api/vehretail/orderManager/specialVehicleSalesReport/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
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
    EditPage
  },
  data () {
    return {
      pageTitle: '特殊车辆销售提报管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVRFDI-specialVehicleSalesReport',
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
      // Dialog visibility
      cancelDialogVisible: false,
      revokeDialogVisible: false,
      adjustDialogVisible: false,
      // Forms for dialogs
      cancelForm: {
        remark: '',
        id: null
      },
      revokeForm: {
        remark: '',
        id: null
      },
      adjustForm: {
        vehicleAttribute: null,
        id: null
      },
      // Rules for forms
      cancelRules: {
        remark: [
          { required: true, message: '请输入作废说明', trigger: 'blur' },
          { max: 200, message: '作废说明不能超过200个字符', trigger: 'blur' }
        ]
      },
      revokeRules: {
        remark: [
          { required: true, message: '请输入撤回说明', trigger: 'blur' },
          { max: 200, message: '撤回说明不能超过200个字符', trigger: 'blur' }
        ]
      },
      adjustRules: {
        vehicleAttribute: [
          { required: true, message: '请选择车辆属性', trigger: 'change' }
        ]
      },
      optionObj: {
        id: 'specialVehicleSalesReportTable',
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
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehretail/orderManager/specialVehicleSalesReport/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'specialReportCode',
            label: '特殊车辆销售提报编号',
            visible: true,
            width: 180
          },
          {
            props: 'vin',
            label: 'VIN码',
            visible: true,
            width: 180
          },
          {
            props: 'modelName',
            label: '车型名称',
            visible: true,
            width: 120
          },
          {
            props: 'vehicleAttribute',
            label: '车辆属性',
            visible: true,
            width: 120,
            formatter: ({ cellValue }) => {
              const attributeMap = {
                1: '家用',
                2: '营运',
                4: 'B级车',
                10: 'J级车',
                20: 'J1级车',
                30: '专车',
                60: '报废灭失'
              };
              return attributeMap[cellValue] || cellValue;
            }
          },
          {
            props: 'vehiclePurpose',
            label: '车辆用途',
            visible: true,
            width: 150,
            formatter: ({ cellValue }) => {
              const purposeMap = {
                10: '私家车',
                20: '公户车',
                30: '试乘试驾车',
                40: '大客户用车',
                50: '营运-预约出租客运',
                100: '其他'
              };
              return purposeMap[cellValue] || cellValue;
            }
          },
          {
            props: 'carBuyerName',
            label: '车主姓名',
            visible: true,
            width: 120
          },
          {
            props: 'carBuyerPhone',
            label: '车主手机号码',
            visible: true,
            width: 150
          },
          {
            props: 'saleDealerName',
            label: '销售门店名称',
            visible: true,
            width: 150
          },
          {
            props: 'deliveryDealerName',
            label: '交付门店名称',
            visible: true,
            width: 150
          },
          {
            props: 'exclusiveServiceStoreName',
            label: '专属服务门店名称',
            visible: true,
            width: 150
          },
          {
            props: 'status',
            label: '状态',
            visible: true,
            width: 100,
            formatter: ({ cellValue }) => {
              const statusMap = {
                0: '草稿',
                1: '已提交',
                20: '作废'
              };
              return statusMap[cellValue] || cellValue;
            }
          },
          {
            props: 'submitTime',
            label: '提交时间',
            visible: true,
            width: 160
          },
          {
            props: 'createTime',
            label: '创建时间',
            visible: true,
            width: 160
          },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 200,
            buttons: []
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
  computed: {
    // 权限控制
    canBatchCancel () {
      return this.hasPermission(`${this.moduleKey}:batchCancel`);
    },
    canBatchRevoke () {
      return this.hasPermission(`${this.moduleKey}:batchRevocation`);
    },
    canAdjustVehicleAttribute () {
      return this.hasPermission(`${this.moduleKey}:vehicleAttribute`);
    },
    canSubmit () {
      return this.hasPermission(`${this.moduleKey}:submit`);
    }
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
        path: '/vehretail/orderManager/specialVehicleSalesReport/edit'
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
        businessType: '特殊车辆销售提报管理',
        dataFetchPath: 'vehretail/web/orderManager/specialVehicleSalesReport/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '特殊车辆销售提报管理.xlsx');
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
            // Determine which operations are available based on status
            const status = item.status;
            let buttons = [];

            if (status === 0) { // 草稿状态
              buttons = [
                {
                  name: '编辑',
                  click: (rowIndex, row) => {
                    this.$router.push({
                      path: '/vehretail/orderManager/specialVehicleSalesReport/edit',
                      query: {
                        id: row.id,
                        isEditing: true
                      }
                    });
                  },
                  type: 'info'
                },
                {
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
                },
                {
                  name: '提交',
                  click: (rowIndex, row) => {
                    this.handleSubmit(row);
                  },
                  type: 'primary'
                },
                {
                  name: '作废',
                  click: (rowIndex, row) => {
                    this.handleCancelSingle(row);
                  },
                  type: 'warning'
                }
              ];
            } else if (status === 1) { // 已提交状态
              buttons = [
                {
                  name: '查看',
                  click: (rowIndex, row) => {
                    this.$router.push({
                      path: '/vehretail/orderManager/specialVehicleSalesReport/edit',
                      query: {
                        id: row.id
                      }
                    });
                  },
                  type: 'info'
                },
                {
                  name: '撤回',
                  click: (rowIndex, row) => {
                    this.handleRevokeSingle(row);
                  },
                  type: 'warning'
                },
                {
                  name: '调整车辆属性',
                  click: (rowIndex, row) => {
                    this.handleAdjustSingle(row);
                  },
                  type: 'success'
                }
              ];
            } else if (status === 20) { // 作废状态
              buttons = [
                {
                  name: '查看',
                  click: (rowIndex, row) => {
                    this.$router.push({
                      path: '/vehretail/orderManager/specialVehicleSalesReport/edit',
                      query: {
                        id: row.id
                      }
                    });
                  },
                  type: 'info'
                }
              ];
            }

            return {
              ...item,
              deleteLoading: false,
              operate: buttons
            };
          });

          // Update the table configuration to reflect the new buttons
          const operateColumnIndex = this.optionObj.dataProp.findIndex(col => col.props === 'operate');
          if (operateColumnIndex !== -1) {
            this.optionObj.dataProp[operateColumnIndex].buttons = [];
          }

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
        if (data[key] === '' || data[key] === null || data[key] === undefined) {
          delete data[key];
        }
      });

      // Handle date range for submitTime
      if (this.form.submitTime && Array.isArray(this.form.submitTime) && this.form.submitTime.length > 1) {
        data.submitTimeStart = this.form.submitTime[0];
        data.submitTimeEnd = this.form.submitTime[1];
        delete data.submitTime;
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
    },

    // 获取选中的草稿记录
    get selectedDraftRecords () {
      return this.selectionList.filter(item => item.status === 0);
    },

    // 获取选中的已提交记录
    get selectedSubmittedRecords () {
      return this.selectionList.filter(item => item.status === 1);
    },

    // 刷新数据
    refreshData () {
      this.getData();
    },

    // 提交单个报告
    handleSubmit (row) {
      this.$confirm(`确定要提交【${row.specialReportCode || row.id}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submitReport({ id: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getData();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message || '提交失败!'
          });
        });
      }).catch(() => {
        // 用户取消操作
      });
    },

    // 单个作废操作
    handleCancelSingle (row) {
      this.cancelForm.id = row.id;
      this.cancelForm.remark = '';
      this.cancelDialogVisible = true;
    },

    // 单个撤回操作
    handleRevokeSingle (row) {
      this.revokeForm.id = row.id;
      this.revokeForm.remark = '';
      this.revokeDialogVisible = true;
    },

    // 单个调整车辆属性操作
    handleAdjustSingle (row) {
      this.adjustForm.id = row.id;
      this.adjustForm.vehicleAttribute = row.vehicleAttribute;
      this.adjustDialogVisible = true;
    },

    // 打开批量作废对话框
    handleBatchCancel () {
      this.cancelForm.id = null; // 表示是批量操作
      this.cancelForm.remark = '';
      this.cancelDialogVisible = true;
    },

    // 打开批量撤回对话框
    handleBatchRevoke () {
      this.revokeForm.id = null; // 表示是批量操作
      this.revokeForm.remark = '';
      this.revokeDialogVisible = true;
    },

    // 关闭作废对话框
    handleCancelDialogClose () {
      this.cancelDialogVisible = false;
      this.$refs.cancelFormRef && this.$refs.cancelFormRef.resetFields();
    },

    // 关闭撤回对话框
    handleRevokeDialogClose () {
      this.revokeDialogVisible = false;
      this.$refs.revokeFormRef && this.$refs.revokeFormRef.resetFields();
    },

    // 关闭调整车辆属性对话框
    handleAdjustDialogClose () {
      this.adjustDialogVisible = false;
      this.$refs.adjustFormRef && this.$refs.adjustFormRef.resetFields();
    },

    // 确认作废操作
    confirmCancel () {
      this.$refs.cancelFormRef.validate(valid => {
        if (!valid) {
          return;
        }

        let apiCall;
        if (this.cancelForm.id) {
          // 单个作废
          apiCall = cancelReport({
            id: this.cancelForm.id,
            remark: this.cancelForm.remark
          });
        } else {
          // 批量作废
          const ids = this.selectedDraftRecords.map(item => item.id);
          apiCall = batchCancelReports({
            ids: ids,
            remark: this.cancelForm.remark
          });
        }

        apiCall.then(() => {
          this.$message({
            type: 'success',
            message: '作废成功!'
          });
          this.handleCancelDialogClose();
          this.getData();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message || '作废失败!'
          });
        });
      });
    },

    // 确认撤回操作
    confirmRevoke () {
      this.$refs.revokeFormRef.validate(valid => {
        if (!valid) {
          return;
        }

        let apiCall;
        if (this.revokeForm.id) {
          // 单个撤回
          apiCall = revokeReport({
            id: this.revokeForm.id,
            remark: this.revokeForm.remark
          });
        } else {
          // 批量撤回
          const ids = this.selectedSubmittedRecords.map(item => item.id);
          apiCall = batchRevokeReports({
            ids: ids,
            remark: this.revokeForm.remark
          });
        }

        apiCall.then(() => {
          this.$message({
            type: 'success',
            message: '撤回成功!'
          });
          this.handleRevokeDialogClose();
          this.getData();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message || '撤回失败!'
          });
        });
      });
    },

    // 确认调整车辆属性操作
    confirmAdjust () {
      this.$refs.adjustFormRef.validate(valid => {
        if (!valid) {
          return;
        }

        adjustVehicleAttribute({
          id: this.adjustForm.id,
          vehicleAttribute: this.adjustForm.vehicleAttribute
        }).then(() => {
          this.$message({
            type: 'success',
            message: '调整车辆属性成功!'
          });
          this.handleAdjustDialogClose();
          this.getData();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message || '调整车辆属性失败!'
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-special-vehicle-sales-report-list {
}
</style>
