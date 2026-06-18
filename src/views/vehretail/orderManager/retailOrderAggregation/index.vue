<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
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
        <el-form-item label="手机号：">
          <el-input v-model="form.phone" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="VIN：" >
          <el-input v-model="form.vin" placeholder="请输入" />
        </el-form-item>
        <page-search-action
          v-model="show"
          is-expandable
          :loading="loading"
          @submit="onSubmit"
          @reset="onReset"
        />
      </el-form>
      <edit-base-container
        ref="containerRef"
        :id="'1'"
        :showEditBtn="false"
        :isEditing="false"
        :canLog="false"
      >
        <el-main ref="scrollContainer">
          <component-table
            ref="retailOrderInfoTableRef"
            :tableConfig="retailOrderInfoTableConfig"
            :columns="retailOrderInfoColumns"
            :extraParams="retailOrderInfoExtraParams"
            :apiMethod="getRetailOrderInfoList"
          />
          <component-table
            ref="entVehicleOrderTableRef"
            :tableConfig="entVehicleOrderTableConfig"
            :columns="entVehicleOrderColumns"
            :extraParams="entVehicleOrderExtraParams"
            :apiMethod="getEntVehicleOrderList"
          />
          <component-table
            ref="vehicleProfileTableRef"
            :tableConfig="vehicleProfileTableConfig"
            :columns="vehicleProfileColumns"
            :extraParams="vehicleProfileExtraParams"
            :apiMethod="getVehicleProfileList"
          />
        </el-main>
      </edit-base-container>
    </div>
  </edit-page-layout>
</template>

<script>
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { fastSearchPage as retailOrderInfoFastSearchPage } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import { fastSearchVehicleProfilePage } from '@/api/datacenter/vehicle/vehicleProfile/index.js';
import { fastSearchPage as entVehicleOrderFastSearchPage } from '@/api/vehwholesale/entorder/entVehicleOrder/index.js';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import ComponentTable from '@/libs/components/ComponentTable';

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    EditBaseContainer,
    EditPageLayout,
    ComponentTable
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
      pageTitle: '订单车辆聚合查询',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-retailOrderAggregation',
      form: {
        phone: null,
        vin: null
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      // 门店整车订单
      retailOrderInfoTableConfig: {
        title: '门店整车订单'
      },
      retailOrderInfoColumns: [
        { field: 'mallOrderCode', title: '商城订单编号', width: 200, align: 'center' },
        { field: 'matchFields', title: '查询匹配字段', width: 300, align: 'center' }
      ],
      retailOrderInfoExtraParams: {},
      // 车辆档案
      vehicleProfileTableConfig: {
        title: '车辆档案'
      },
      vehicleProfileColumns: [
        { field: 'vin', title: 'VIN号', width: 200, align: 'center' },
        { field: 'matchedFields', title: '查询匹配字段', width: 300, align: 'center' }
      ],
      vehicleProfileExtraParams: {},
      // 企业客户订单
      entVehicleOrderTableConfig: {
        title: '企业客户订单'
      },
      entVehicleOrderColumns: [
        { field: 'entOrderCode', title: '企业订单编号', width: 200, align: 'center' },
        { field: 'matchedFields', title: '查询匹配字段', width: 300, align: 'center' }
      ],
      entVehicleOrderExtraParams: {}
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    // this.getData();
  },
  methods: {
    onSubmit () {
      const searchParams = this.getFormData();
      if (!searchParams.phone && !searchParams.vin) {
        this.$message.warning('请至少输入一个查询条件');
      }
      this.getData();
    },
    onReset () {
      this.retailOrderInfoExtraParams = {};
      this.entVehicleOrderExtraParams = {};
      this.vehicleProfileExtraParams = {};
      this.getData();
    },
    getData () {
      this.loading = true;
      this.refreshRetailOrderTable();
      this.refreshEntVehicleOrderTable();
      this.refreshVehicleProfileTable();
      this.loading = false;
    },
    getFormData () {
      return { ...this.form };
    },
    // 获取订单信息变更申请列表（供 ComponentTable 使用）
    getRetailOrderInfoList (params) {
      // 将搜索条件合并到请求参数中
      const searchParams = this.getFormData();
      if (!searchParams.phone && !searchParams.vin) {
        return [];
      }
      return retailOrderInfoFastSearchPage(searchParams);
    },
    // 刷新订单信息变更申请表格
    refreshRetailOrderTable () {
      if (this.$refs.retailOrderInfoTableRef) {
        this.$refs.retailOrderInfoTableRef.refresh();
      }
    },
    // 获取订单信息变更申请列表（供 ComponentTable 使用）
    getVehicleProfileList (params) {
      // 将搜索条件合并到请求参数中
      const searchParams = this.getFormData();
      if (!searchParams.phone && !searchParams.vin) {
        return [];
      }
      return fastSearchVehicleProfilePage(searchParams);
    },
    // 刷新订单信息变更申请表格
    refreshVehicleProfileTable () {
      if (this.$refs.vehicleProfileTableRef) {
        this.$refs.vehicleProfileTableRef.refresh();
      }
    },
    // 获取企业客户订单列表（供 ComponentTable 使用）
    getEntVehicleOrderList (params) {
      // 将搜索条件合并到请求参数中
      const searchParams = this.getFormData();
      if (!searchParams.phone && !searchParams.vin) {
        return [];
      }
      return entVehicleOrderFastSearchPage(searchParams);
    },
    // 刷新企业客户订单表格
    refreshEntVehicleOrderTable () {
      if (this.$refs.entVehicleOrderTableRef) {
        this.$refs.entVehicleOrderTableRef.refresh();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-order-change-list {
}
</style>
