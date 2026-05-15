<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="false"
      >
        <template #status>
           <!-- {{ form.vin }} -->
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                 <el-form-item label="VIN码：" prop="vin">
                  <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`" target="_blank">{{ form.vin }}</el-link>
                </el-form-item>
                 <el-form-item label="操作类型：" prop="operateTypeLabel">
                  {{ form.operateTypeLabel }}
                </el-form-item>
                <el-form-item label="取消配车时间：" prop="cancelAllocateTime">
                  {{ form.cancelAllocateTime }}
                </el-form-item>
                <el-form-item label="取消配车说明：" prop="cancelAllocateRemark">
                  {{ form.cancelAllocateRemark }}
                </el-form-item>
                 <el-form-item label="取消配车类型：" prop="cancelAllocateVehicleTypeLabel">
                  {{ form.cancelAllocateVehicleTypeLabel }}
                </el-form-item>
                 <el-form-item label="取消结算时间：" prop="cancelSettleTime">
                  {{ form.cancelSettleTime }}
                </el-form-item>
                <el-form-item label="取消结算类型：" prop="cancelSettleTypeLabel">
                  {{ form.cancelSettleTypeLabel }}
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.saleDealerCode}`" target="_blank">{{ form.saleDealerName }}</el-link>
                </el-form-item>
                 <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <el-link type="primary" :href="`/partner/channelManagement/companyDetails?companyCode=${form.dealerCompanyCode}`" target="_blank">{{ form.dealerCompanyName }}</el-link>
                </el-form-item>
                <el-form-item label="合作类型：" prop="cooperateTypeLabel">
                  {{ form.cooperateTypeLabel }}
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundTypeLabel">
                  {{ form.settleFundTypeLabel }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationName">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=${form.financialOrganizationId}`" target="_blank">{{ form.financialOrganizationName }}</el-link>
                </el-form-item>
                <el-form-item label="订单物料编码：" prop="orderMaterialsCode">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclematerials/edit?id=${form.orderMaterialsCode}`" target="_blank">{{ form.orderMaterialsCode }}</el-link>
                </el-form-item>
                <el-form-item label="配车物料码：" prop="materialsCode">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclematerials/edit?id=${form.materialsCode}`" target="_blank">{{ form.materialsCode }}</el-link>
                </el-form-item>
                <el-form-item label="VIN码：" prop="vin">
                  <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`" target="_blank">{{ form.vin }}</el-link>
                </el-form-item>
                <el-form-item label="批售订单号：" prop="wholesaleOrderCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit?id=${form.wholesaleOrderCode}`" target="_blank">{{ form.wholesaleOrderCode }}</el-link>
                </el-form-item>
                 <el-form-item label="零售订单号：" prop="retailOrderCode">
                  {{ form.retailOrderCode }}
                </el-form-item>
                <el-form-item label="结算时间：" prop="settleTime">
                  {{ form.settleTime }}
                </el-form-item>
                <el-form-item label="配车时间：" prop="allocateTime">
                  {{ form.allocateTime }}
                </el-form-item>
                 <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/wholesale/vehicleWholesaleOrderRecord/index';
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
  dataSource: '',
  operateType: '',
  cancelAllocateTime: '',
  cancelAllocateVehicleType: '',
  cancelSettleTime: '',
  cancelSettleType: '',
  saleDealerCode: '',
  saleDealerName: '',
  dealerCompanyName: '',
  dealerCompanyCode: '',
  wholesaleOrderCode: '',
  mallOrderCode: '',
  retailOrderCode: '',
  materialsId: '',
  materialsCode: '',
  materialsDesc: '',
  orderMaterialsCode: '',
  orderMaterialsId: '',
  allocateTime: '',
  settleTime: '',
  vin: '',
  cooperateType: '',
  settleFundType: '',
  financialOrganizationId: '',
  purchaseOrderId: '',
  purchaseOrderCode: '',
  sapSerialCode: '',
};

export default {
  name: 'vehicleWholesaleOrderRecordEdit',
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
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '配车结算记录：' + this.form.vin;
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
      pageTitle: '批售配车结算记录',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVW-vehicleWholesaleOrderRecord',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
    };
  },
  mounted () {
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
    },
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
