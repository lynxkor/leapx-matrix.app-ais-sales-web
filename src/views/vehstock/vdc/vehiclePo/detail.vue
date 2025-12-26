<template>
  <div class="page-common-detail m-vehiclePo-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>主键：{{ info.id }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i
            class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="160px">
            <el-form-item label="订单编号：" prop="po" style="font-weight: bold">
              {{ info.po }}
            </el-form-item>
            <el-form-item label="订单状态：" prop="poStatus">
              {{ info.poStatusLabel }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>销售信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="160px">
            <el-form-item label="销售预留：" prop="reserved">
              {{ info.reservedLabel }}
            </el-form-item>
            <el-form-item label="销售预留类型：" prop="reservedType">
              {{ info.reservedTypeLabel }}
            </el-form-item>
            <el-form-item label="绑定零售单：" prop="bindRetailOrder">
              {{ info.bindRetailOrderLabel }}
            </el-form-item>
            <el-form-item label="是否配车：" prop="carAllocated">
              {{ info.carAllocatedLabel }}
            </el-form-item>
            <el-form-item label="配车时间：" prop="carAllocatedDateTime">
              {{ info.carAllocatedDateTime }}
            </el-form-item>
            <el-form-item label="发运方式：" prop="shipVia">
              {{ info.shipViaLabel }}
            </el-form-item>
            <el-form-item label="整车订单编号：" prop="retailOrderCode">
              {{ info.retailOrderCode }}
            </el-form-item>
            <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
              {{ info.wholesaleOrderCode }}
            </el-form-item>
            <el-form-item label="企业客户整车订单编码：" prop="entVehorderCode">
              {{ info.entVehorderCode }}
            </el-form-item>
            <el-form-item label="VDC入库时间：" prop="inboundDateTime">
              {{ info.inboundDateTime }}
            </el-form-item>
            <el-form-item label="VDC出库时间：" prop="outboundDateTime">
              {{ info.outboundDateTime }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>生产信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="160px">
            <el-form-item label="物料编码：" prop="materialsCode">
              {{ info.materialsCode }}
            </el-form-item>
            <el-form-item label="车系：" prop="seriesName">
              {{ info.seriesName }}
            </el-form-item>
            <el-form-item label="车型：" prop="modelName">
              {{ info.modelName }}
            </el-form-item>
            <el-form-item label="物料描述：" prop="materialsDesc">
              {{ info.materialsDesc }}
            </el-form-item>
            <el-form-item label="选配续航：" prop="drivingRangeName">
              {{ info.drivingRangeName }}
            </el-form-item>
            <el-form-item label="选配动力：" prop="rangePowerName">
              {{ info.rangePowerName }}
            </el-form-item>
            <el-form-item label="外观：" prop="exteriorName">
              {{ info.exteriorName }}
            </el-form-item>
            <el-form-item label="内饰：" prop="interiorName">
              {{ info.interiorName }}
            </el-form-item>
            <el-form-item label="选配轮毂：" prop="wheelHubName">
              {{ info.wheelHubName }}
            </el-form-item>
            <el-form-item label="电池电芯：" prop="batteryCellName">
              {{ info.batteryCellName }}
            </el-form-item>
            <el-form-item label="年款：" prop="yearTypeName">
              {{ info.yearTypeName }}
            </el-form-item>
            <el-form-item label="选装包：" prop="optionPackageName">
              {{ info.optionPackageName }}
            </el-form-item>
            <el-form-item label="是否允许现车批售：" prop="allowWholesale">
              {{ info.allowWholesaleLabel }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>物料信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="160px">
            <el-form-item label="工厂：" prop="factory">
              {{ info.factory }}
            </el-form-item>
            <el-form-item label="VIN：" prop="vin">
              {{ info.vin }}
            </el-form-item>
            <el-form-item label="计划收车时间：" prop="planReceiveCarTime">
              {{ info.planReceiveCarTime }}
            </el-form-item>
            <el-form-item label="公告车型：" prop="vehicleRegisteredModelName">
              {{ info.vehicleRegisteredModelName }}
            </el-form-item>
            <el-form-item label="合格证号：" prop="certNumber">
              {{ info.certNumber }}
            </el-form-item>
            <el-form-item label="焊装上线时间：" prop="weldingOnlineTime">
              {{ info.weldingOnlineTime }}
            </el-form-item>
            <el-form-item label="发动机号：" prop="enginenNumber">
              {{ info.enginenNumber }}
            </el-form-item>
            <el-form-item label="发动机型号：" prop="enginenModel">
              {{ info.enginenModel }}
            </el-form-item>
            <el-form-item label="涂装上线时间：" prop="paintingOnlineTime">
              {{ info.paintingOnlineTime }}
            </el-form-item>
            <el-form-item label="电机型号：" prop="motorModel">
              {{ info.motorModel }}
            </el-form-item>
            <el-form-item label="电驱序列号(前)：" prop="electricNumberBefore">
              {{ info.electricNumberBefore }}
            </el-form-item>
            <el-form-item label="总装上线时间：" prop="finalAssemblyOnlineTime">
              {{ info.finalAssemblyOnlineTime }}
            </el-form-item>
            <el-form-item label="电机序列号：" prop="motorSerialNumber">
              {{ info.motorSerialNumber }}
            </el-form-item>
            <el-form-item label="电驱序列号(后)：" prop="electricNumberAfter">
              {{ info.electricNumberAfter }}
            </el-form-item>
            <el-form-item label="PDI上线时间：" prop="pdiOfflineTime">
              {{ info.pdiOnlineTime }}
            </el-form-item>
            <el-form-item label="电池包编号：" prop="batteryPackNumber">
              {{ info.batteryPackNumber }}
            </el-form-item>
            <el-form-item label="电池序列号：" prop="batterySerialNumber">
              {{ info.batterySerialNumber }}
            </el-form-item>
            <el-form-item label="制造日期：" prop="manufacturingDate">
              {{ info.manufacturingDate }}
            </el-form-item>
            <el-form-item label="MES订单状态：" prop="mesStatus">
              {{ info.mesStatusLabel }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>SAP信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="160px">
            <el-form-item label="SAP流水号：" prop="serNo">
              {{ info.serNo }}
            </el-form-item>
            <el-form-item label="计划订单号：" prop="ordNo">
              {{ info.ordNo }}
            </el-form-item>
            <el-form-item label="产销识别码：" prop="zppNo">
              {{ info.zppNo }}
            </el-form-item>
            <el-form-item label="订单类型：" prop="orderType">
              {{ info.orderType }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>过点明细</h2>
        </div>
        <div class="common-section-body">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="pointDate" label="过点时间" width="220">
            </el-table-column>
            <el-table-column prop="code" label="站点编号" width="220">
            </el-table-column>
            <el-table-column prop="site" label="站点" width="220">
            </el-table-column>
            <el-table-column prop="planOrder" label="计划订单号" width="220">
            </el-table-column>
            <el-table-column prop="pviNo" label="PVI单号" width="220">
            </el-table-column>
            <el-table-column prop="factory" label="工厂" width="220">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="220">
            </el-table-column>
          </el-table>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail, vehiclePoTrack } from '@/api/vehstock/vdc/vehiclePo/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'vehiclePoDetail',
  mixins: [permissions, commonMixins],
  components: {},
  data () {
    return {
      pageTitle: '整车采购订单',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-vehiclePo',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP,
      tableData: []
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车采购订单', '详情']);
    this.getData();
    this.getTable();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehstock/vdc/vehiclePo/edit',
        query: {
          id: this.$route.query.id,
        },
      });
    },
    getData () {
      getDetail(this.$route.query.id)
        .then((res) => {
          this.loading = false;
          this.info = res;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    async getTable () {
      const res = await vehiclePoTrack({ planOrder: this.info.ordNo });
      this.tableData = res || [];
    }
  },
};
</script>
