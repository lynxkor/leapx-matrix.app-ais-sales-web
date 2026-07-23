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
          <!-- <span>{{ form.code }}</span> -->
        </template>
        <template #extraButtons>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  <el-link type="primary" :href="`/partner/channelManagement/companyDetails?companyCode=${form.dealerCompanyCode}`" target="_blank">{{ form.dealerCompanyCode }}</el-link>
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <el-link type="primary" :href="`/partner/channelManagement/companyDetails?companyCode=${form.dealerCompanyCode}`" target="_blank">{{ form.dealerCompanyName }}</el-link>
                </el-form-item>
                <el-form-item label="融资金融机构：" prop="fundFinancialOrganizationName">
                   <el-link type="primary" :href="`/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=${form.fundFinancialOrganizationId}`" target="_blank">{{ form.fundFinancialOrganizationName }}</el-link>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                  <el-form-item label="编号：" prop="code">
                    {{ form.code }}
                </el-form-item>
                <el-form-item label="说明：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>车辆信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="VIN号：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="还款日期：" prop="repaymentDate">
                  {{ form.repaymentDate }}
                </el-form-item>
                <el-form-item label="车辆状态：" prop="vehicleStatus">
                  {{ form.vehicleStatusLabel }}
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialsCode">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${form.materialsCode}`" target="_blank">{{ form.materialsCode }}</el-link>
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="整车批售订单：" prop="wholesaleOrderCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit?id=${form.wholesaleOrderCode}`" target="_blank">{{ form.wholesaleOrderCode }}</el-link>
                </el-form-item>
                <el-form-item label="企业客户整车订单：" prop="customerOrderCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/entorder/entVehicleOrder/edit?id=${form.customerOrderCode}`" target="_blank">{{ form.customerOrderCode }}</el-link>
                </el-form-item>
                <el-form-item label="还款车辆记录编号：" prop="vehicleRepaymentRecordCode">
                  {{ form.vehicleRepaymentRecordCode }}
                </el-form-item>
                <!-- <el-form-item label="经销商名称：" prop="dealerCompanyName">
                  <el-link type="primary" :href="`/partner/channelManagement/companyDetails?companyCode=${form.dealerCompanyCode}`" target="_blank">{{ form.dealerCompanyName }}</el-link>
                </el-form-item> -->
                <el-form-item label="经销商名称：" prop="dealerName">
                  {{ form.dealerName }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/finance/bank/finBankVehicleRepaymentRecord/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  materialsCode: '',
  materialsId: '',
  code: '',
  dealerCompanyCode: '',
  dealerCompanyName: '',
  fundFinancialOrganizationCodes: [],
  vin: '',
  repaymentDate: '',
  materialsDesc: '',
  wholesaleOrderCode: '',
  customerOrderCode: '',
  vehiclestatus: '1',
  vehicleRepaymentRecordCode: '',
  dealerName: '',
  status: '1',
  statusDesc: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  dataSource: '',
  ownerOrgId: '',
  fundFinancialOrganizationCode: '',
};

export default {
  name: 'finBankVehicleRepaymentRecordEdit',
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
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '银行车辆还款记录：' + (this.form.code || '');
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
      pageTitle: '银行还款车辆记录',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-finBankVehicleRepaymentRecord',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
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
