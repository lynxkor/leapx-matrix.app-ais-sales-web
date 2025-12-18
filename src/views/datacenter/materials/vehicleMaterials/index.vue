<template>
  <div class="page-common m-vehicle-materials-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="物料编码">
         <tag-input v-model="form.materialsCodeSet" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="物料描述">
        <tag-input v-model="form.materialsDescSet" placeholder="请输入" />
      </el-form-item>
        <el-form-item label="车系" v-show="visibleCount === 3 || show">
          <fetch-select
            :remote-method="seriesSearch"
            remote
            reserve-keyword
            v-model="form.seriesIds"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            clearable
            multiple
            collapseTags
            filterable
            @change="seriesListChange" />
        </el-form-item>
      <template v-if="show">
        <el-form-item label="车型">
          <fetch-select
            :remote-method="modelSearch"
            remote
            reserve-keyword
            :options="modelList" v-model="form.modelIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable
            @change="modelListChange" />
        </el-form-item>
        <el-form-item label="年款">
          <fetch-select :options="yearModelList" v-model="form.yearTypeIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable/>
        </el-form-item>
        <el-form-item label="外观">
          <fetch-select :options="exteriorList" v-model="form.exteriorIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable/>
        </el-form-item>
        <el-form-item label="内饰">
          <fetch-select :options="interiorList" v-model="form.interiorIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags/>
        </el-form-item>
        <el-form-item label="轮毂">
          <fetch-select :options="wheelHubList" v-model="form.wheelHubIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable/>
        </el-form-item>
        <el-form-item label="选装包">
          <fetch-select :options="optionPackageList" v-model="form.optionPackageIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable/>
        </el-form-item>
        <el-form-item label="电池电芯">
          <fetch-select :options="batteryCellList" v-model="form.batteryCellIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable/>
        </el-form-item>
        <el-form-item label="车顶">
          <fetch-select :options="roofList" v-model="form.roofIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable multiple collapseTags filterable/>
        </el-form-item>
        <el-form-item label="是否允许现车批售">
          <fetch-select :options="yes_no_enum" v-model="form.allowWholesale" placeholder="请选择" clearable  />
        </el-form-item>
        <el-form-item label="是否允许排产申请">
          <fetch-select :options="yes_no_enum" v-model="form.allowProductionSchedule" placeholder="请选择" clearable
             />
        </el-form-item>
        <el-form-item label="是否允许展车批售">
          <fetch-select :options="yes_no_enum" v-model="form.allowDisplayVehicleWholesale" placeholder="请选择" clearable
             />
        </el-form-item>
        <el-form-item label="是否允许试驾车批售">
          <fetch-select :options="yes_no_enum" v-model="form.allowTestDriveVehicleWholesale" placeholder="请选择" clearable
             />
        </el-form-item>
        <el-form-item label="是否允许企业客户销售	">
          <fetch-select :options="yes_no_enum" v-model="form.allowCustomerSales" placeholder="请选择" clearable />
        </el-form-item>
        <el-form-item label="是否允许改配">
          <fetch-select :options="yes_no_enum" v-model="form.allowConfigurationModify" placeholder="请选择" clearable
             />
        </el-form-item>
        <el-form-item label="是否允许批售确认">
          <fetch-select :options="yes_no_enum" v-model="form.allowWholesaleConfirm" placeholder="请选择" clearable
             />
        </el-form-item>
        <el-form-item label="停产状态">
          <fetch-select :options="yes_no_enum" v-model="form.discontinueStatus" placeholder="请选择" clearable  />
        </el-form-item>
        <el-form-item label="状态">
           <fetch-select
          :request="fetchOptions"
          enumCode="StatusEnum"
          v-model="form.statusIncludeList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
        </el-form-item>
      </template>
      <page-search-action v-model="show" is-expandable :loading="loading" @submit="onSubmit" @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button size="small" type="primary" v-if="canAddOrUpdate" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button :loading="exportLoading" size="small" v-if="canExport" @click="exportExcel">导出</el-button>
      <!-- <el-button size="small" v-if="canDelete" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button> -->
      <el-button size="small" v-if="canEnableOrDisable" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button size="small" v-if="canEnableOrDisable" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
      <el-button size="small" v-permission="moduleKey+'-batchSetProperties'" @click="handleBatchSetAttr()" :disabled="selectionList.length === 0">批量设置属性</el-button>
      <el-button size="small" v-permission="moduleKey + '-importMaterials'" @click="handleImport('vehicleMaterialsImport')">导入物料</el-button>
      <el-button size="small" v-permission="moduleKey + '-importPrice'" @click="handleImport('vehicleMaterialsImportPrice')">导入价格</el-button>
      <el-button size="small" v-permission="moduleKey + '-importProperties'" @click="handleImport('vehicleMaterialsImportProps')">导入属性</el-button>
      <!-- <el-button :loading="exportLoading" size="small" @click="exportExcel">导出</el-button> -->
    </div>
    <div class="ais-table-c">
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page checkboxFixed :option-obj="optionObj"
        :get-config="getConfig" :save-or-update="saveOrUpdate" @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange" />
    </div>
    <Upload :visible="uploadDialogVisible" templateUrl="" uploadUrl="" @close="handleUploadDialogClose" />

    <el-dialog title="批量设置属性信息" width="400px" :visible.sync="batchSetAttrVisible">
      <div class="batchSetAttr">
        <el-row>
          <el-col :span="9">是否允许现车批售</el-col>
          <el-col :span="15">
            <el-radio-group v-model="allowWholesale">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">是否允许排产申请</el-col>
          <el-col :span="15">
            <el-radio-group v-model="allowProductionSchedule">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">是否允许批售确认</el-col>
          <el-col :span="15">
            <el-radio-group v-model="allowWholesaleConfirm">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="batchSetAttrVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmSetAttr">确 定</el-button>
      </div>
    </el-dialog>

    <Upload
      :visible="uploadDialogVisible"
      :id="importId"
      @close="handleUploadDialogClose"
    />

  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, batchUpdateProps } from '@/api/datacenter/materials/vehicleMaterials/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, vehicleSeriesList, vehicleModelList, vehicleExterior, vehicleInterior, vehicleWheelHub, vehicleOptionPackage, vehicleBatteryCell, vehicleRoof, vehicleModelYearTypeRelationDistinctYeayType } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import TagInput from '@/libs/components/TagInput';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  seriesIds: [],
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
  discontinueStatus: ''
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
    Upload
  },
  data () {
    return {
      pageTitle: '销服-业务主数据-配置主数据-整车物料',
      pageType: 'list',
      moduleKey: 'AISDC-vehicleMaterials',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      importId: '',
      optionObj: {
        id: 'vehicleMaterialsTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'modelLineName',
            label: '系列名称',
            visible: true,
            width: 200,
            fixed: 'left',
          },
          {
            props: 'seriesName',
            label: '车系名称',
            visible: true,
            width: 200,
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
          { props: 'yearTypeName', label: '年款名称', visible: true, width: 200 },
          {
            props: 'price',
            label: '整车价格',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          { props: 'exteriorName', label: '外观名称', visible: true, width: 200 },
          { props: 'interiorName', label: '内饰名称', visible: true, width: 200 },
          { props: 'wheelHubName', label: '轮毂名称', visible: true, width: 200 },
          { props: 'optionPackageName', label: '选装包名称', visible: true, width: 200 },
          { props: 'batteryCellName', label: '电池电芯名称', visible: true, width: 200 },
          { props: 'roofName', label: '车顶名称', visible: true, width: 200 },
          { props: 'allowWholesaleLabel', label: '是否允许现车批售', visible: true, width: 200 },
          { props: 'allowProductionScheduleLabel', label: '是否允许排产申请', visible: true, width: 200 },
          { props: 'allowDisplayVehicleWholesaleLabel', label: '是否允许展车批售', visible: true, width: 200 },
          { props: 'allowTestDriveVehicleWholesaleLabel', label: '是否允许试驾车批售', visible: true, width: 200 },
          { props: 'allowCustomerSalesLabel', label: '是否允许企业客户销售	', visible: true, width: 200 },
          { props: 'allowWholesaleConfirmLabel', label: '是否允许批售确认', visible: true, width: 200 },
          { props: 'allowConfigurationModifyLabel', label: '是否允许改配', visible: true, width: 200 },
          { props: 'discontinueStatusLabel', label: '停产状态', visible: true, width: 200 },
          { props: 'statusLabel', label: '状态', visible: true, width: 200 },
          { props: 'statusDesc', label: '说明', visible: true, width: 200 },
          { props: 'creatorName', label: '创建人', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'modifierName', label: '更新人', visible: true, width: 200 },
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
                  path: '/datacenter/materials/vehicleMaterials/edit',
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
      seriesList: [],
      modelList: [],
      yearModelList: [],
      exteriorList: [],
      interiorList: [],
      wheelHubList: [],
      optionPackageList: [],
      batteryCellList: [],
      roofList: [],
      batchSetAttrVisible: false,
      allowWholesale: '',
      allowProductionSchedule: '',
      allowWholesaleConfirm: '',
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
    this.getVehicleModelList();
    this.getModelYearTypeRelationsList();
    this.getVehicleExteriorList();
    this.getVehicleInteriorList();
    this.getVehicleWheelHubList();
    this.getVehicleOptionPackageList();
    this.getVehicleBatteryCellList();
    this.geVehicleRoofList();
  },
  methods: {
    seriesSearch (query) { return vehicleSeriesList({ seriesNameLike: query }); },
    async modelSearch (query) {
      if (query) {
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
      }
    },
    handleImport (importId) {
      this.importId = importId;
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
        dataFetchPath: '/datacenter/web/materials/vehicleMaterials/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols())
      }).then(async res => {
        if (res) {
          if (res.excelUrl) {
            try {
              await downloadExcel(res.excelUrl, '配置主数据-整车物料.xlsx');
            } catch (error) {
              this.$message({
                type: 'error',
                message: '文件导出失败'
              });
            }
          } else {
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

      // const trueFalseMap = {
      //   true: '是',
      //   false: '否'
      // };

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              allowWholesaleLabel: item.props?.allowWholesaleLabel,
              allowProductionScheduleLabel: item.props?.allowProductionScheduleLabel,
              allowDisplayVehicleWholesaleLabel: item.props?.allowDisplayVehicleWholesaleLabel,
              allowTestDriveVehicleWholesaleLabel: item.props?.allowTestDriveVehicleWholesaleLabel,
              allowCustomerSalesLabel: item.props?.allowCustomerSalesLabel,
              allowWholesaleConfirmLabel: item.props?.allowWholesaleConfirmLabel,
              allowConfigurationModifyLabel: item.props?.allowConfigurationModifyLabel,
              discontinueStatusLabel: item.props?.discontinueStatusLabel,
              deleteLoading: false,
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

      if (Array.isArray(this.form.materialsDescSet) && this.form.materialsDescSet.length <= 1) {
        delete data.materialsDescSet;
        data.materialsDescLike = this.form.materialsDescSet[0] || '';
      }

      if (Array.isArray(this.form.materialsCodeSet) && this.form.materialsCodeSet.length <= 1) {
        delete data.materialsCodeSet;
        data.materialsCodeLike = this.form.materialsCodeSet[0] || '';
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
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData,
        options: {
          statusName: 'status',
          requireInput: true
        }
      });
    },
    handleBatchSetAttr () {
      this.batchSetAttrVisible = true;
    },
    seriesListChange (val, selectedOption) {
      if (val.length) {
        this.getVehicleModelList(val);
      } else {
        this.modelList = [];
        this.form.modelIdSet = [];
        this.yearModelList = [];
        this.form.yearTypeIdSet = [];
        this.getVehicleModelList();
        this.getModelYearTypeRelationsList();
      }
    },
    modelListChange (val, selectedOption) {
      console.log('modelListChange', val, selectedOption);
      if (val.length) {
        this.getModelYearTypeRelationsList(val);
      } else {
        this.getModelYearTypeRelationsList();
        this.yearModelList = [];
        this.form.yearTypeIdSet = [];
      }
    },
    // async getVehicleSeriesList () {
    //   const res = await vehicleSeriesList({ size: 1000 });
    //   console.log('vehicleSeries', res);
    //   if (res.length) {
    //     const vehicleSeriesData = res.map(item => {
    //       return {
    //         ...item,
    //         label: item.name,
    //         value: item.id
    //       };
    //     });
    //     this.seriesList = vehicleSeriesData;
    //   }
    // },

    async getVehicleModelList (val) {
      const res = await vehicleModelList({ seriesIdList: val || [], size: 1000 });
      console.log('vehicleModelList', res);
      if (res.length) {
        const vehicleModelData = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.id
          };
        });
        this.modelList = vehicleModelData;
      }
    },

    async getModelYearTypeRelationsList (val) {
      const res = await vehicleModelYearTypeRelationDistinctYeayType({ modelIdList: val, size: 1000 });
      this.yearModelList = res.map(item => {
        return {
          ...item,
          label: item.yearTypeName,
          value: item.yearTypeId
        };
      });
    },

    async getVehicleExteriorList () {
      const res = await vehicleExterior({ size: 1000 });
      this.exteriorList = res.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id
        };
      });
    },

    async getVehicleInteriorList () {
      const res = await vehicleInterior({ size: 1000 });
      this.interiorList = res.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id
        };
      });
    },

    async getVehicleWheelHubList () {
      const res = await vehicleWheelHub({ size: 1000 });
      this.wheelHubList = res.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id
        };
      });
    },

    async getVehicleOptionPackageList () {
      const res = await vehicleOptionPackage({ size: 1000 });
      this.optionPackageList = res.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id
        };
      });
    },

    async getVehicleBatteryCellList () {
      const res = await vehicleBatteryCell({ size: 1000 });
      this.batteryCellList = res.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id
        };
      });
    },

    async geVehicleRoofList () {
      const res = await vehicleRoof({ size: 1000 });
      this.roofList = res.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id
        };
      });
    },

    async confirmSetAttr () {
      const ids = this.selectionList.map(item => item.id) || [];
      const params = {
        ids,
        allowWholesale: this.allowWholesale,
        allowProductionSchedule: this.allowProductionSchedule,
        allowWholesaleConfirm: this.allowWholesaleConfirm
      }; batchUpdateProps(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });

        this.batchSetAttrVisible = false;
      }).catch(() => {
        this.batchSetAttrVisible = false;
      });
      this.getData();
    }
  }
};
</script>

<style lang="scss" scoped>
.m-vehicle-materials-list {}
::v-deep .batchSetAttr{
  .el-row{
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
  }
}
</style>
