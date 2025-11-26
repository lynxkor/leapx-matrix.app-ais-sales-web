<template>
  <div class="page-common m-vehicle-materials-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="物料编码">
        <el-input placeholder="请输入" v-model="form.materialsCode" clearable />
      </el-form-item>
      <el-form-item label="物料描述">
        <el-input placeholder="请输入" v-model="form.materialsDesc" clearable />
      </el-form-item>
      <el-form-item label="车系" v-show="this.visibleCount === 3 || show">
        <fetch-select :options="seriesList" v-model="form.seriesIds" placeholder="请选择" clearable multiple
          @change="seriesListChange" />
      </el-form-item>
      <span v-show="show">
        <el-form-item label="车型">
          <fetch-select :options="modelList" v-model="form.modelIdSet" placeholder="请选择" clearable multiple
            @change="modelListChange" />
        </el-form-item>
        <el-form-item label="年款">
          <fetch-select :options="yearModelList" v-model="form.yearTypeIdSet" placeholder="请选择" clearable multiple />
        </el-form-item>
        <el-form-item label="外观名称">
          <el-input placeholder="请输入" v-model="form.exteriorName" clearable />
        </el-form-item>
        <el-form-item label="内饰名称">
          <el-input placeholder="请输入" v-model="form.interiorName" clearable />
        </el-form-item>
        <el-form-item label="轮毂名称">
          <el-input placeholder="请输入" v-model="form.wheelHubName" clearable />
        </el-form-item>
        <el-form-item label="车顶名称">
          <el-input placeholder="请输入" v-model="form.roofName" clearable />
        </el-form-item>
        <el-form-item label="选装包名称">
          <el-input placeholder="请输入" v-model="form.optionPackageName" clearable />
        </el-form-item>
        <el-form-item label="电池电芯名称">
          <el-input placeholder="请输入" v-model="form.batteryCellName" clearable />
        </el-form-item>
        <el-form-item label="是否允许现车批售">
          <fetch-select :options="yes_no_enum" v-model="form.allowWholesale" placeholder="请选择" clearable multiple />
        </el-form-item>
        <el-form-item label="是否允许排产申请">
          <fetch-select :options="yes_no_enum" v-model="form.allowProductionSchedule" placeholder="请选择" clearable
            multiple />
        </el-form-item>
        <el-form-item label="是否允许展车批售">
          <fetch-select :options="yes_no_enum" v-model="form.allowDisplayVehicleWholesale" placeholder="请选择" clearable
            multiple />
        </el-form-item>
        <el-form-item label="是否允许试驾车批售">
          <fetch-select :options="yes_no_enum" v-model="form.allowTestDriveVehicleWholesale" placeholder="请选择" clearable
            multiple />
        </el-form-item>
        <el-form-item label="是否允许企业客户销售	">
          <fetch-select :options="yes_no_enum" v-model="form.allowCustomerSales" placeholder="请选择" clearable multiple />
        </el-form-item>
        <el-form-item label="是否允许批售确认">
          <fetch-select :options="yes_no_enum" v-model="form.allowWholesaleConfirm" placeholder="请选择" clearable
            multiple />
        </el-form-item>
        <el-form-item label="是否允许改配">
          <fetch-select :options="yes_no_enum" v-model="form.allowConfigurationModify" placeholder="请选择" clearable
            multiple />
        </el-form-item>
        <el-form-item label="停产状态">
          <fetch-select :options="yes_no_enum" v-model="form.discontinueStatus" placeholder="请选择" clearable multiple />
        </el-form-item>
      </span>
      <page-search-action v-model="show" is-expandable :loading="loading" @submit="onSubmit" @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button size="small" @click="handleImport">导入</el-button>
      <el-button :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page checkboxFixed :option-obj="optionObj"
        :get-config="getConfig" :save-or-update="saveOrUpdate" @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange" />
    </div>
    <Upload :visible="uploadDialogVisible" templateUrl="" uploadUrl="" @close="handleUploadDialogClose" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/datacenter/materials/vehicleMaterials/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  materialsCode: '',
  materialsDesc: '',
  modelName: '',
  exteriorName: '',
  interiorName: '',
  wheelHubName: '',
  roofName: '',
  optionPackageName: '',
  batteryCellName: '',
  allowWholesale: '',
  allowProductionSchedule: '',
  allowDisplayVehicleWholesale: '',
  allowTestDriveVehicleWholesale: '',
  allowCustomerSales: '',
  allowWholesaleConfirm: '',
  allowConfigurationModify: '',
  discontinueStatus: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    Upload
  },
  data () {
    return {
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      optionObj: {
        id: 'vehicleMaterialsTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'price',
            label: '整车价格',
            visible: true,
            width: 200,
            fixed: 'left',
          },
          {
            props: 'materialsCode',
            label: '物料编码',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/materials/vehicleMaterials/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'modelName', label: '车型名称', visible: true, width: 200 },
          { props: 'exteriorName', label: '外观名称', visible: true, width: 200 },
          { props: 'interiorName', label: '内饰名称', visible: true, width: 200 },
          { props: 'wheelHubName', label: '轮毂名称', visible: true, width: 200 },
          { props: 'roofName', label: '车顶名称', visible: true, width: 200 },
          { props: 'optionPackageName', label: '选装包名称', visible: true, width: 200 },
          { props: 'batteryCellName', label: '电池电芯名称', visible: true, width: 200 },
          { props: 'allowWholesaleLabel', label: '是否允许现车批售', visible: true, width: 200 },
          { props: 'allowProductionScheduleLabel', label: '是否允许排产申请', visible: true, width: 200 },
          { props: 'allowDisplayVehicleWholesaleLabel', label: '是否允许展车批售', visible: true, width: 200 },
          { props: 'allowTestDriveVehicleWholesaleLabel', label: '是否允许试驾车批售', visible: true, width: 200 },
          { props: 'allowCustomerSalesLabel', label: '是否允许企业客户销售	', visible: true, width: 200 },
          { props: 'allowWholesaleConfirmLabel', label: '是否允许批售确认', visible: true, width: 200 },
          { props: 'allowConfigurationModifyLabel', label: '是否允许改配', visible: true, width: 200 },
          { props: 'discontinueStatusLabel', label: '停产状态', visible: true, width: 200 },
          { props: 'status', label: '状态', visible: true, width: 200 },
          { props: 'remark', label: '备注（说明）', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
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
                  path: '/datacenter/materials/vehicleMaterials/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
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
      },
      seriesList: [{
        message: '车型1',
        code: 1
      },
      {
        message: '车型2',
        code: 0
      }],
      modelList: [],
      yearModelList: []
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车主数据-整车物料管理']);
    this.getData();
  },
  methods: {
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/datacenter/materials/vehicleMaterials/edit'
      });
    },
    onSubmit () {
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        dataFetchPath: '/datacenter/datacenter/materials/vehicleMaterials/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols())
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

      const trueFalseMap = {
        true: '是',
        false: '否'
      };

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
      }).catch(() => { });
    },
    // 批量启用停用
    handleBatchEnable (status) {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm(`此操作将${status ? '启用' : '停用'}选中项，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        enableItem({
          idSet: ids,
          status
        }).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败!'
          });
        });
      });
    },
    seriesListChange (val, selectedOption) {
      console.log('seriesListChange', val, selectedOption);
    },
    modelListChange (val, selectedOption) {
      console.log('modelListChange', val, selectedOption);
    }
  }
};
</script>

<style lang="scss" scoped>
.m-vehicle-materials-list {}
</style>
