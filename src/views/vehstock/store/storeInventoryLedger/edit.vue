<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest">
        <template #status>
          <span class="status primary">状态</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="VIN：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="车辆状态：" prop="vechicleStatus">
                  {{ form.vechicleStatusLabel }}
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerName">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="出库时间：" prop="moveoutDate">
                  {{ form.moveoutDate }}
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="交付门店编码：" prop="deliveryDealerCode">
                  {{ form.deliveryDealerCode }}
                </el-form-item>
                <el-form-item label="仓库编码：" prop="dealerWarehouseCode">
                  {{ form.dealerWarehouseCode }}
                </el-form-item>
                <el-form-item label="仓库名称：" prop="dealerWarehouseName">
                  {{ form.dealerWarehouseName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="仓库地址：" prop="dealerWarehouseAddress">
                  {{ form.dealerWarehouseAddress }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>

                <el-form-item label="是否匹配订单：" prop="lockStatus">
                  {{ form.lockStatusLabel }}
                </el-form-item>
                <el-form-item label="匹配时间：" prop="lockTime">
                  {{ form.lockTime }}
                </el-form-item>
                <el-form-item label="车辆类型：" prop="reservationStatus">
                  {{ form.reservationStatusLabel }}
                </el-form-item>
                <el-form-item label="是否预留：" prop="reserved">
                  {{ form.reservedLabel }}
                </el-form-item>
                <el-form-item label="预留说明：" prop="reserveDesc">
                  {{ form.reserveDesc }}
                </el-form-item>
                <el-form-item label="预留时间：" prop="salesReservedOn">
                  {{ form.salesReservedOn }}
                </el-form-item>
                <el-form-item label="解除预留说明：" prop="cancelReserveDesc">
                  {{ form.cancelReserveDesc }}
                </el-form-item>
                <el-form-item label="预留操作人：" prop="reserveUser">
                  {{ form.reserveUser }}
                </el-form-item>
                <el-form-item label="解除预留时间：" prop="salesCancelReservedOn">
                  {{ form.salesCancelReservedOn }}
                </el-form-item>
                <el-form-item label="解除预留操作人：" prop="cancelReservedUser">
                  {{ form.cancelReservedUser }}
                </el-form-item>

                <el-form-item label="承运记录编码：" prop="carrierOrderDetailId">
                  {{ form.carrierOrderDetailId }}
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  {{ form.retailOrderCode }}
                </el-form-item>
                <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
                </el-form-item>
                <el-form-item label="是否还款：" prop="isRepaid">
                  {{ form.isRepaidLabel }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financeOrgName">
                  {{ form.financeOrgName }}
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settlementFundType">
                  {{ form.settlementFundType }}
                </el-form-item>
                <el-form-item label="交车单号：" prop="deliverOrderId">
                  {{ form.deliverOrderId }}
                </el-form-item>
                <el-form-item label="赊销合格证快递单号：" prop="invoiceExpressNo">
                  {{ form.invoiceExpressNo }}
                </el-form-item>

                <el-form-item label="物流到店日期：" prop="vehicleArrivalOn">
                  {{ form.vehicleArrivalOn }}
                </el-form-item>
                <el-form-item label="车辆物流状态" prop="logisticStatus">
                  {{ form.logisticStatusLabel }}
                </el-form-item>
                <el-form-item label="收车确认时间：" prop="receivedOn">
                  {{ form.receivedOn }}
                </el-form-item>
                <el-form-item label="要求收车截止时间：" prop="receivedLatestDate">
                  {{ form.receivedLatestDate }}
                </el-form-item>
                <el-form-item label="收车确认是否超时：" prop="isReceivedTimeLy">
                  {{ form.isReceivedTimeLyLabel }}
                </el-form-item>
                <el-form-item label="收车确认人：" prop="receivedBy">
                  {{ form.receivedBy }}
                </el-form-item>
                <el-form-item label="收车车联网电量（%）：" prop="receivedElectricity">
                  {{ form.receivedElectricity }}
                </el-form-item>
                <el-form-item label="收车车联网里程：" prop="receivedMileage">
                  {{ form.receivedMileage }}
                </el-form-item>
                <el-form-item label="PDI提交时间：" prop="pdiSubmitOn">
                  {{ form.pdiSubmitOn }}
                </el-form-item>
                <el-form-item label="PDI提交截止时间：" prop="pdiLatestDate">
                  {{ form.pdiLatestDate }}
                </el-form-item>
                <el-form-item label="PDI提交是否超时：" prop="isPdiTimely">
                  {{ form.isPdiTimelyLabel }}
                </el-form-item>
                <el-form-item label="是否提交PDI：" prop="isPdi">
                  {{ form.isPdiLabel }}
                </el-form-item>
                <el-form-item label="PDI提交人：" prop="pdiSubmitBy">
                  {{ form.pdiSubmitBy }}
                </el-form-item>
                <el-form-item label="最新PDI提交时间：" prop="lastPdiOn">
                  {{ form.lastPdiOn }}
                </el-form-item>
                <el-form-item label="采购入库时间：" prop="poentryOn">
                  {{ form.poentryOn }}
                </el-form-item>
                <el-form-item label="要求入库截止日期：" prop="inboundLatestDate">
                  {{ form.inboundLatestDate }}
                </el-form-item>
                <el-form-item label="入库是否及时：" prop="inboundTimeLy">
                  {{ form.inboundTimeLyLabel }}
                </el-form-item>
                <el-form-item label="入库车机版本号：" prop="vehicleVersion">
                  {{ form.vehicleVersion }}
                </el-form-item>
                <el-form-item label="入库版本升级时间：" prop="vehicleVersionUpOn">
                  {{ form.vehicleVersionUpOn }}
                </el-form-item>
                <el-form-item label="入库时间：" prop="moveinDate">
                  {{ form.moveinDate }}
                </el-form-item>
                <el-form-item label="入库类型：" prop="moveType">
                  {{ form.moveTypeLabel }}
                </el-form-item>
                <el-form-item label="出库时间：" prop="moveoutDate">
                  {{ form.moveoutDate }}
                </el-form-item>
                <el-form-item label="出库类型：" prop="moveoutType">
                  {{ form.moveoutTypeLabel }}
                </el-form-item>

                <el-form-item label="实车交车标识：" prop="vehdeLiveried">
                  {{ form.vehdeLiveriedLabel }}
                </el-form-item>
                <el-form-item label="标识来源：" prop="syncSource">
                  {{ form.syncSourceLabel }}
                </el-form-item>
                <el-form-item label="标识记录日期：" prop="vehdeLiveriedOn">
                  {{ form.vehdeLiveriedOn }}
                </el-form-item>
                <el-form-item label="车联网里程：" prop="vehMiles">
                  {{ form.vehMiles }}
                </el-form-item>
                <el-form-item label="是否异常车辆：" prop="isFenceCrossed">
                  {{ form.isFenceCrossedLabel }}
                </el-form-item>
                <el-form-item label="车辆异常类型：" prop="fenceCrossedType">
                  {{ form.fenceCrossedTypeLabel }}
                </el-form-item>
                <el-form-item label="车辆电量：" prop="electricity">
                  {{ form.electricity }}
                </el-form-item>
                <el-form-item label="电量获取时间：" prop="electricityOn">
                  {{ form.electricityOn }}
                </el-form-item>
                <el-form-item label="异常记录时间：" prop="fenceCrossedOn">
                  {{ form.fenceCrossedOn }}
                </el-form-item>

                <el-form-item label="调拨单号：" prop="dealerCarTransferCode">
                  {{ form.dealerCarTransferCode }}
                </el-form-item>
                <el-form-item label="调出门店名称：" prop="sourceDealerName">
                  {{ form.sourceDealerName }}
                </el-form-item>
                <el-form-item label="调出时间：" prop="moveoutOn">
                  {{ form.moveoutOn }}
                </el-form-item>
                <el-form-item label="调入门店名称：" prop="targetDealerName">
                  {{ form.targetDealerName }}
                </el-form-item>
                <el-form-item label="调入时间：" prop="moveinOn">
                  {{ form.moveinOn }}
                </el-form-item>

                <el-form-item label="物料编码：" prop="materialsCode">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="车系：" prop="seriesName">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="车型：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="续航里程：" prop="drivingRangeName">
                  {{ form.drivingRangeName }}
                </el-form-item>
                <el-form-item label="选配动力：" prop="rangePowerName">
                  {{ form.rangePowerName }}
                </el-form-item>
                <el-form-item label="外观：" prop="exteriorName">
                  {{ form.exteriorName }}
                </el-form-item>
                <el-form-item label="内饰：" prop="interiorName">
                  {{ form.interiorName }}
                </el-form-item>
                <el-form-item label="选配轮毂：" prop="wheelHubName">
                  {{ form.wheelHubName }}
                </el-form-item>
                <el-form-item label="电池电芯：" prop="batteryCellName">
                  {{ form.batteryCellName }}
                </el-form-item>
                <el-form-item label="年款：" prop="optionPackageName">
                  {{ form.optionPackageName }}
                </el-form-item>
                <el-form-item label="选装包：" prop="yearTypeName">
                  {{ form.yearTypeName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>区块标题</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i
                  class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table ref="editTable" :columns="columns" :data="tableData" :defaultNewRow="defaultNewRow"
                  :show-toolbar="false" :options="options" :auth="{ edit: canAddOrUpdate, delete: canDelete }" />
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehstock/store/storeInventoryLedger/index';
// import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  vin: '',
  vechicleStatus: '',
  materialsDesc: '',
  moveoutDate: '',
  moveoutType: '',
  moveType: '',
  logisticStatus: '',
  vehicleArrivalOn: '',
  inboundLatestDate: '',
  reserved: '',
  reserveDesc: '',
  reservationStatus: '',
  lockStatus: '',
  lockTime: '',
  isRepaid: '',
  financeOrgName: '',
  settlementFundType: '',
  vehdeLiveried: '',
  syncSource: '',
  isFenceCrossed: '',
  fenceCrossedType: '',
  vehdeLiveriedOn: '',
  ownerOrgId: '',
  saleDealerCode: '',
  saleDealerName: '',
  deliveryDealerCode: '',
  deliveryDealerName: '',
  poentryDealerCode: '',
  poentryDealerName: '',
  poentryOn: '',
  inboundTimeLy: '',
  materialsCode: '',
  seriesId: '',
  seriesName: '',
  modelId: '',
  modelName: '',
  exteriorId: '',
  exteriorName: '',
  interiorId: '',
  interiorName: '',
  wheelHubId: '',
  wheelHubName: '',
  optionPackageId: '',
  optionPackageName: '',
  moveinDate: '',
  receivedById: '',
  receivedBy: '',
  receivedOn: '',
  receivedplatform: '',
  regionCode: '',
  regionName: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  dealerWarehouseCode: '',
  dealerWarehouseName: '',
  dealerWarehouseAddress: '',
  salesReservedOn: '',
  reserveUserId: '',
  reserveUser: '',
  cancelReserveDesc: '',
  salesCancelReservedOn: '',
  cancelReservedUserId: '',
  cancelReservedUser: '',
  carrierOrderDetailId: '',
  retailOrderId: '',
  retailOrderCode: '',
  wholesaleOrderId: '',
  wholesaleOrderCode: '',
  receivedLatestDate: '',
  isReceivedTimeLy: '',
  receivedElectricity: '',
  receivedMileage: '',
  pdiSubmitOn: '',
  pdiLatestDate: '',
  isPdiTimely: '',
  isPdi: '',
  pdiSubmitById: '',
  pdiSubmitBy: '',
  lastPdiOn: '',
  vehicleVersion: '',
  vehicleVersionUpOn: '',
  vehMiles: '',
  electricity: '',
  electricityOn: '',
  fenceCrossedOn: '',
  dealerCarTransferCode: '',
  sourceDealerCode: '',
  sourceDealerName: '',
  moveoutOn: '',
  targetDealerCode: '',
  targetDealerName: '',
  moveinOn: '',
};

export default {
  name: 'storeInventoryLedgerEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    EditTable,
    // FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '门店库存台账',
      pageType: 'edit',
      title: '主键：' + form.id,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-storeInventoryLedger',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
