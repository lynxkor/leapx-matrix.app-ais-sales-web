<template>
  <div class="page-common m-vehicle-shipping-plan-detail-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="发运明细">
        <tag-input v-model="form.shippingPlanDetailCodes" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="承运记录编码">
        <tag-input v-model="form.carrierRecordCodes" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="VIN码">
        <tag-input v-model="form.vins" placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
          <el-form-item label="大区">
          <fetch-select
            filterable
            clearable
            remote
            multiple
            v-model="form.regionCodes"
            :remote-method="getRegionList"
            value-key="orgCode"
            label-key="orgName"
          />
        </el-form-item>
        <el-form-item label="销售门店">
          <fetch-select
            filterable
            clearable
            multiple
            remote
            collapseTags
            v-model="form.saleDealerCodes"
            :remote-method="getDealerListByName"
            value-key="storeCode"
            label-key="storeName"
          />
          </el-form-item>

          <el-form-item label="企业客户名称">
          <fetch-select
            filterable
            clearable
            multiple
            remote
            collapseTags
            v-model="form.entCustomerCodes"
            :remote-method="listNetworkParentCompany"
            labelKey="companyName"
            valueKey="companyCode"
          />
          <!-- <tag-input v-model="form.saleDealerCodes" placeholder="请输入" /> -->
        </el-form-item>
        <el-form-item label="车系">
         <fetch-select
            :remote-method="remoteMethods.series"
            v-model="form.seriesIds"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            clearable
            filterable
            multiple
            remote
            />
        </el-form-item>
        <el-form-item label="数据来源">
          <fetch-select
            :request="fetchOptions"
            enumCode="vehretail_data_source"
            v-model="form.dataSource"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="合格证发运方式">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_deliverytype"
            v-model="form.certificateShippingWaies"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="金融机构">
           <fetch-select
              :remote-method="repairItemSearch"
                remote
                multiple
                reserve-keyword
                labelKey="name"
                valueKey="id"
                v-model="form.financialOrganizationIds"
                placeholder="请选择"
                clearable
                filterable
            />
        </el-form-item>
        <el-form-item label="是否发运">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.shipped"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="批售方式">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_wholesale_way"
            v-model="form.wholesaleWaies"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="合作类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="ws_cooperation_type"
            v-model="form.cooperateTypes"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="指定发运方式">
          <fetch-select
            :request="fetchOptions"
            enumCode="vehstock_ship_via"
            v-model="form.deliveryWaies"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="发运方式">
          <fetch-select
            :request="fetchOptions"
            enumCode="vehstock_ship_via"
            v-model="form.actualDeliveryWaies"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="订单分类">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_order_category"
            v-model="form.orderCategories"
            placeholder="请选择"
            clearable
            multiple
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
            filterable
          />
        </el-form-item>
      <el-form-item label="同步状态">
         <fetch-select
            :request="fetchOptions"
            enumCode="vw_sync_status"
            v-model="form.syncStatuses"
            placeholder="请选择"
            clearable
            filterable
            multiple
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
      <el-button v-if="canAddOrUpdate" size="small"  :loading="createShipLoading" @click="handleaAdOrUpdate">
        创建发运计划
      </el-button>
      <el-button v-permission="moduleKey+'-setSwitch'" size="small" @click="handleSwitch">
        设置定时任务开关
      </el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
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
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
      @getData="getData"
    />

    <SwitchFlag
      :visible.sync="showSwitchFlageDialog"
      :status="switchFlagStatus"
      @confirmSwitchFlag="timeSwitchFlag"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, addOrUpdateItem, setSwitchItem, getSwitchItem } from '@/api/vehwholesale/shipping/vehicleShippingPlanDetail/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, vehicleSeriesList, getRigion, listOrgStoreInfo, getParentCompany } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import SwitchFlag from './SwitchFlag.vue';
import { listIdNames } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  dataSource: '',
  shippingPlanDetailCode: '',
  shipped: '',
  vin: '',
  financialOrganizationId: '',
  seriesId: '',
  certificateShippingWay: '',
  orderCategory: '',
  saleDealerCode: '',
  deliveryWay: '',
  cooperateType: '',
  actualDeliveryWay: '',
  regionName: '',
  carrierRecordCode: '',
  createTime: '',
  status: 1,
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
    TagInput,
    SwitchFlag
  },
  data () {
    return {
      remoteMethods: {
        series: async (query) => {
          return await vehicleSeriesList({ seriesNameLike: query, status: 1 });
        }
      },
      pageTitle: '发运计划明细',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-vehicleShippingPlanDetail',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      createShipLoading: false,
      uploadDialogVisible: false,
      showSwitchFlageDialog: false,
      switchFlagStatus: false,
      clickItemId: '',
      optionObj: {
        id: 'vehicleShippingPlanDetailTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'shippingPlanDetailCode',
            label: '发运计划明细编码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/vehwholesale/shipping/vehicleShippingPlanDetail/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dataSourceLabel', label: '数据来源', visible: true, width: 120 },
          { props: 'shippedLabel', label: '是否发运', visible: true, width: 120 },
          {
            props: 'vin',
            label: 'VIN码',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.vehicleVdcInventory?.id) {
                  window.open(`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?id=${row.vehicleVdcInventory.id}`, '_blank');
                }
              },
              type: 'primary'
            }]
          },
          { props: 'vehicleWarehouseName', label: '整车仓库', visible: true, width: 180 },
          { props: 'needSyncWmsLabel', label: '是否需要同步WMS', visible: true, width: 210 },
          { props: 'syncStatusLabel', label: '同步状态', visible: true, width: 150 },
          // { props: 'syncRemark', label: 'WMS同步结果', visible: true, width: 200 },
          { props: 'certificatePledgedLabel', label: '合格证是否质押', visible: true, width: 210 },
          { props: 'certificateShippingWayLabel', label: '合格证发运方式', visible: true, width: 240 },
          {
            props: 'organizationName',
            label: '金融机构',
            visible: true,
            width: 180,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=${row.financialOrganizationId}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          { props: 'wholesaleWayLabel', label: '批售方式', visible: true, width: 150 },
          { props: 'cooperateTypeLabel', label: '合作类型', visible: true, width: 150 },
          { props: 'deliveryWayLabel', label: '指定发运方式', visible: true, width: 180 },
          { props: 'actualDeliveryWayLabel', label: '发运方式', visible: true, width: 150 },
          { props: 'orderCategoryLabel', label: '订单分类', visible: true, width: 150 },
          { props: 'provinceName', label: '省份', visible: true, width: 120 },
          { props: 'cityName', label: '城市', visible: true, width: 120 },
          { props: 'districtName', label: '区县', visible: true, width: 120 },
          { props: 'longitude', label: '经度', visible: true, width: 120 },
          { props: 'latitude', label: '维度', visible: true, width: 120 },
          { props: 'address', label: '交车地址', visible: true, width: 200 },
          { props: 'pickupContactName', label: '接车人', visible: true, width: 150 },
          { props: 'pickupContactMobile', label: '接车人电话', visible: true, width: 180 },
          { props: 'regionName', label: '大区', visible: true, width: 120 },
          {
            props: 'saleDealerName',
            label: '销售门店名称',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.saleDealerCode) {
                  window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.saleDealerCode}`, '_blank');
                }
              },
              type: 'primary'
            }]
          },
          { props: 'dealerWarehouseName', label: '门店仓库', visible: true, width: 180 },
          { props: 'deliveryDealerName', label: '交付门店', visible: true, width: 150 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'carrierRecordCode', label: '承运记录编码', visible: true, width: 180 },
          { props: 'entCustomerName', label: '企业客户', visible: true, width: 150 },
          { props: 'entCustomerOrderTime', label: '企业下单时间', visible: true, width: 180 },
          {
            props: 'materialsDesc',
            label: '物料描述',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleMaterials/edit?id=${row.materialsId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'drivingRangeName',
            label: '选配续航',
            visible: true,
            width: 150,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/sales/datacenter/materials/vehicleDrivingRange/edit?id=${row.drivingRangeId}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          {
            props: 'rangePowerName',
            label: '选配动力',
            visible: true,
            width: 150,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/sales/datacenter/materials/vehicleRangePower/edit?id=${row.rangePowerId}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          {
            props: 'exteriorName',
            label: '外饰风格',
            visible: true,
            width: 150,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/sales/datacenter/materials/vehicleExterior/edit?id=${row.exteriorId}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          {
            props: 'interiorName',
            label: '内饰风格',
            visible: true,
            width: 150,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/sales/datacenter/materials/vehicleInterior/edit?id=${row.interiorId}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          {
            props: 'modelName',
            label: '车型名称',
            visible: true,
            width: 150,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleModel/edit?id=${row.modelId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'seriesName',
            label: '车系名称',
            visible: true,
            width: 150,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleSeries/edit?id=${row.seriesId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'wheelHubName',
            label: '选配轮毂',
            visible: true,
            width: 150,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/sales/datacenter/materials/vehicleWheelHub/edit?id=${row.wheelHubId}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          {
            props: 'optionPackageName',
            label: '选装包',
            visible: true,
            width: 120,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/sales/datacenter/materials/vehicleOptionPackage/edit?id=${row.optionPackageId}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          { props: 'statusLabel', label: '状态', visible: true, width: 90 },
          { props: 'creatorName', label: '创建者', visible: true, width: 120 },
          { props: 'createTime', label: '创建时间', visible: true, width: 160 },
          // {
          //   props: 'operate',
          //   label: '操作',
          //   type: 'operate',
          //   visible: true,
          //   fixed: 'right',
          //   buttons: [{
          //     name: '编辑',
          //     click: (rowIndex, row) => {
          //       this.$router.push({
          //         path: '/vehwholesale/shipping/vehicleShippingPlanDetail/edit',
          //         query: {
          //           id: row.id,
          //           isEditing: true
          //         }
          //       });
          //     },
          //     type: 'info'
          //   }, {
          //     name: '删除',
          //     popconfirmTitle: '此操作将永久删除, 是否继续?',
          //     click: (rowIndex, row) => {
          //       deleteItem([row.id]).then(() => {
          //         this.$message({
          //           type: 'success',
          //           message: '删除成功!'
          //         });
          //         this.getData();
          //       }).catch(() => {
          //         this.$message({
          //           type: 'error',
          //           message: '删除失败!'
          //         });
          //       });
          //     },
          //     type: 'danger'
          //   }]
          // }
        ],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ],
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
    async listNetworkParentCompany (query) {
      return getParentCompany({ parentCompanyName: query });
    },
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isSales: true });
    },
    async getRegionList (params) {
      return getRigion({ orgName: params });
    },
    handleaAdOrUpdate () {
      this.createShipLoading = true;
      addOrUpdateItem({}).then(() => {
        this.$message({
          type: 'success',
          message: '创建发运计划成功!'
        });
        this.getData();
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '创建发运计划失败!'
        });
      }).finally(() => {
        this.createShipLoading = false;
      });
    },
    handleSwitch () {
      getSwitchItem().then((res) => {
        console.log('timeSwitchFlag', res);
        this.showSwitchFlageDialog = true;
        this.switchFlagStatus = res === '1';
      });
    },
    timeSwitchFlag (data) {
      setSwitchItem({
        status: data.status
      }).then(() => {
        this.$message({
          type: 'success',
          message: '设置定时任务开关成功!'
        });
        this.getData();
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '设置定时任务开关失败!'
        });
      });
    },
    repairItemSearch (query) { return listIdNames({ organizationNameLike: query, status: 1 }); },
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
        path: '/vehwholesale/shipping/vehicleShippingPlanDetail/edit'
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
        businessType: '发运计划明细',
        dataFetchPath: 'vw/web/shipping/vehicleShippingPlanDetail/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '发运计划明细.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
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
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              drivingRangeName: item.vehicleMaterials?.drivingRangeName || '',
              rangePowerName: item.vehicleMaterials?.rangePowerName || '',
              exteriorName: item.vehicleMaterials?.exteriorName || '',
              interiorName: item.vehicleMaterials?.interiorName || '',
              wheelHubName: item.vehicleMaterials?.wheelHubName || '',
              modelName: item.vehicleMaterials?.modelName || '',
              modelId: item.vehicleMaterials?.modelId || '',
              materialsDesc: item.vehicleMaterials?.materialsDesc || '',
              materialsId: item.vehicleMaterials?.id || '',
              drivingRangeId: item.vehicleMaterials?.drivingRangeId || '',
              rangePowerId: item.vehicleMaterials?.rangePowerId || '',
              exteriorId: item.vehicleMaterials?.exteriorId || '',
              interiorId: item.vehicleMaterials?.interiorId || '',
              wheelHubId: item.vehicleMaterials?.wheelHubId || '',
              optionPackageName: item.vehicleMaterials?.optionPackageName || '',
              optionPackageId: item.vehicleMaterials?.optionPackageId || '',
              organizationName: item.financialOrganization?.organizationName || '',
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
.m-vehicle-shipping-plan-detail-list {
}
</style>
