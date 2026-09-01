<template>
  <edit-page-layout ref="editLayout" :title="title" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :detailRequest="detailRequest"
        :showEditBtn="false"
      >
        <template #status>
          <span class="status primary">{{ form.billStatusLabel }}</span>
        </template>
        <el-main>
          <!-- 基本信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基本信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="返利核算单编号：">
                  {{ form.rebateBillCode }}
                </el-form-item>
                <el-form-item label="母公司名称：">
                  <!-- <el-link type="primary" :href="`/service/datacenter/store/parentCompany/detail?companyCode=${form.dealerCompanyCode}`" target="_blank">{{ form.dealerCompanyName }}</el-link> -->
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  <el-link type="primary" :href="`/service/datacenter/store/store/detail?storeCode=${form.dealerCode}`" target="_blank">{{ form.dealerName }}</el-link>
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="周期：">
                  {{ form.periodLabel }}
                </el-form-item>
                <el-form-item label="年度：">
                  {{ form.year }}
                </el-form-item>
                <el-form-item label="季度：">
                  {{ form.quarterLabel }}
                </el-form-item>
                <el-form-item label="月度：">
                  {{ form.monthLabel }}
                </el-form-item>
                <el-form-item label="合计核销金额：">
                  {{ formatAmount(form.totalRebateAmount) }}
                </el-form-item>
                <el-form-item label="返利类型：">
                  {{ form.rebateTypeLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 整车返利核算单明细 -->
              <ComponentTable
                :table-config="{ title: '整车返利核算单明细' }"
                :columns="tableColumns"
                :api-method="getList"
                :extra-params="{ rebateBillId: _id }"
              >
                <template #rebateBillDetailCode="{ row }">
                  <el-link type="success" target="_blank" :href="`/sales/vehwholesale/rebate/fundVehicleRebateBillDetail/edit?id=${row.id}`">{{ row.rebateBillDetailCode }}</el-link>
                </template>
                <template #modelName="{ row }">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleModel/edit?id=${row.modelId}`" target="_blank">{{ row.modelName }}</el-link>
                </template>
                <template #seriesName="{ row }">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleSeries/edit?id=${row.seriesId}`" target="_blank">{{ row.seriesName }}</el-link>
                </template>
                <template #budgetItemName="{ row }">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/fundBudgetItem/edit?id=${row.budgetItemId}`" target="_blank">{{ row.budgetItemName }}</el-link>
                </template>
                <template #feeSupportTypeName="{ row }">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/fundFeeSupportType/edit?id=${row.feeSupportTypeId}`" target="_blank">{{ row.feeSupportTypeName }}</el-link>
                </template>
                <template #rebateAmount="{ row }">
                  {{ formatAmount(row.rebateAmount) }}
                </template>
              </ComponentTable>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail } from '@/api/vehwholesale/rebate/fundVehicleRebateBill/index';
import { getList } from '@/api/vehwholesale/rebate/fundVehicleRebateBillDetail/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import ComponentTable from '@/libs/components/ComponentTable/index.vue';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { formatAmount as fmtAmount } from '@/libs/utils';

const defaultForm = {
  rebateBillCode: '',
  dealerCompanyName: '',
  dealerCode: '',
  dealerName: '',
  createTime: '',
  periodLabel: '',
  year: '',
  quarterLabel: '',
  monthLabel: '',
  totalRebateAmount: '',
  rebateTypeLabel: '',
  billStatusLabel: ''
};

export default {
  name: 'fundVehicleRebateBillEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    ComponentTable
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '整车返利核算单',
      pageType: 'edit',
      moduleKey: 'AISVW-fundVehicleRebateBill',
      form: { ...form },
      originalForm: { ...form },
      tableColumns: [
        { field: 'rebateBillDetailCode', title: '整车返利核算单明细编号', width: '200', slots: { default: 'rebateBillDetailCode' } },
        { field: 'vin', title: 'VIN号', width: '170' },
        { field: 'bizOrderNo', title: '业务单据号', width: '180' },
        { field: 'rebateAmount', title: '核销金额', width: '100', slots: { default: 'rebateAmount' } },
        { field: 'modelName', title: '基本车型', width: '180', slots: { default: 'modelName' } },
        { field: 'seriesName', title: '车系', width: '120', slots: { default: 'seriesName' } },
        { field: 'remark', title: '备注', width: '320' },
        { field: 'billStatusLabel', title: '单据状态', width: '100' },
        { field: 'budgetItemName', title: '预算科目', width: '140', slots: { default: 'budgetItemName' } },
        { field: 'feeSupportTypeName', title: '费用支持类型', width: '120', slots: { default: 'feeSupportTypeName' } },
        { field: 'reviewTime', title: '复审时间', width: '160' },
        { field: 'createTime', title: '创建时间', width: '160' }
      ]
    };
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '整车返利核算单：' + (this.form.rebateBillCode || '');
    }
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
    },
    async detailRequest () {
      const id = this._id;
      if (id) {
        const detail = await getDetail(id);
        return detail;
      }
      return {};
    },
    getList (params) {
      return getList(params);
    },
    getDefautlForm () {
      return { ...defaultForm };
    },
    formatAmount (value) {
      return fmtAmount(value);
    }
  }
};
</script>

<style lang="scss">
</style>
