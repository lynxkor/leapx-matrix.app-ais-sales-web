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
        <el-main>
          <!-- 基本信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基本信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="返利核算单明细编号：">
                  {{ form.rebateBillDetailCode }}
                </el-form-item>
                <el-form-item label="母公司名称：">
                  <!-- <el-link type="primary" :href="`/partner/channelManagement/companyDetails?companyCode=${form.dealerCompanyCode}`" target="_blank">{{ form.dealerCompanyName }}</el-link> -->
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">{{ form.dealerName }}</el-link>
                </el-form-item>
                <el-form-item label="返利核算单编号：">
                  <el-link type="primary" :href="`/sales/vehwholesale/rebate/fundVehicleRebateBill/edit?id=${form.rebateBillId}`" target="_blank">{{ form.rebateBillCode }}</el-link>
                </el-form-item>
                <el-form-item label="单据状态：">
                  {{ form.billStatusLabel }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 返利信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>返利信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="返利类型：">
                  {{ form.rebateTypeLabel }}
                </el-form-item>
                <el-form-item label="核销金额：">
                  {{ form.rebateAmount }}
                </el-form-item>
                <el-form-item label="业务单据号：">
                  {{ form.bizOrderNo }}
                </el-form-item>
                <el-form-item label="VIN号：">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="车系：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleSeries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName }}</el-link>
                </el-form-item>
                <el-form-item label="基本车型：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleModel/edit?id=${form.modelId}`" target="_blank">{{ form.modelName }}</el-link>
                </el-form-item>
                <el-form-item label="交车单号：">
                  <el-link type="primary" :href="`/sales/vehretail/orderManager/deliveryOrder/edit?id=${form.deliveryOrderId}`" target="_blank">{{ form.deliveryOrderCode }}</el-link>
                </el-form-item>
                <el-form-item label="预算科目：">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/fundBudgetItem/edit?id=${form.budgetItemId}`" target="_blank">{{ form.budgetItemName }}</el-link>
                </el-form-item>
                <el-form-item label="费用支持类型：">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/fundFeeSupportType/edit?id=${form.feeSupportTypeId}`" target="_blank">{{ form.feeSupportTypeName }}</el-link>
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
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 审核信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>审核信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="初审人：">
                  {{ form.auditorName }}
                </el-form-item>
                <el-form-item label="初审时间：">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="初审意见：">
                  {{ form.auditOpinion }}
                </el-form-item>
                <el-form-item label="复审人：">
                  {{ form.reviewName }}
                </el-form-item>
                <el-form-item label="复审时间：">
                  {{ form.reviewTime }}
                </el-form-item>
                <el-form-item label="复审意见：">
                  {{ form.reviewOpinion }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail } from '@/api/vehwholesale/rebate/fundVehicleRebateBillDetail/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  rebateBillDetailCode: '',
  dealerCompanyName: '',
  dealerCode: '',
  dealerName: '',
  rebateBillCode: '',
  rebateBillId: '',
  billStatusLabel: '',
  createTime: '',
  rebateTypeLabel: '',
  rebateAmount: '',
  bizOrderNo: '',
  vin: '',
  seriesId: '',
  seriesName: '',
  modelId: '',
  modelName: '',
  deliveryOrderCode: '',
  budgetItemName: '',
  budgetItemId: '',
  feeSupportTypeName: '',
  feeSupportTypeId: '',
  periodLabel: '',
  year: '',
  quarterLabel: '',
  monthLabel: '',
  remark: '',
  auditorName: '',
  auditTime: '',
  auditOpinion: '',
  reviewName: '',
  reviewTime: '',
  reviewOpinion: ''
};

export default {
  name: 'fundVehicleRebateBillDetailEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '整车返利核算单明细',
      pageType: 'edit',
      moduleKey: 'AISVW-fundVehicleRebateBillDetail',
      form: { ...form },
      originalForm: { ...form }
    };
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '整车返利核算单明细：' + (this.form.rebateBillDetailCode || '');
    }
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
    },
    async detailRequest () {
      const id = this._id;
      if (id) {
        const res = await getDetail(id);
        if (res) {
          this.form.budgetItemId = res.budgetItemId || res.budget_item_id || '';
          this.form.feeSupportTypeId = res.feeSupportTypeId || res.fee_support_type_id || '';
        }
        return res;
      }
      return {};
    },
    getDefautlForm () {
      return { ...defaultForm };
    }
  }
};
</script>

<style lang="scss">
</style>
