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
      >
        <template #status>
          <span>{{ form.code }}</span>
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
                <el-form-item label="编码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="融资金融机构：" prop="fundFinancialOrganizationName">
                   <el-link type="primary" :href="`/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=${form.fundFinancialOrganizationId}`" target="_blank">{{ form.fundFinancialOrganizationName }}</el-link>
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="经销商名称：" prop="dealerName">
                  <!-- <el-link type="primary" :href="`/service/datacenter/store/parentCompany/detail?companyCode=${form.dealerCode}`" target="_blank">{{ form.dealerName }}</el-link> -->
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="经销商编码：" prop="dealerCode">
                  <!-- <el-link type="primary" :href="`/service/datacenter/store/parentCompany/detail?companyCode=${form.dealerCode}`" target="_blank">{{ form.dealerCode }}</el-link> -->
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="统一社会信用代码：" prop="unifiedSocialCreditCode">
                  {{ form.unifiedSocialCreditCode }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel  }}
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
                  <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`" target="_blank">{{ form.vin }}</el-link>
                </el-form-item>
                <el-form-item label="融资数据来源：" prop="financingDataSource">
                  {{ form.financingDataSourceLabel }}
                </el-form-item>
                <el-form-item label="是否人车绑定：" prop="isVehicleBound">
                  {{ form.isVehicleBoundLabel }}
                </el-form-item>
                <el-form-item label="绑车日期：" prop="bindingDate">
                  {{ form.bindingDate }}
                </el-form-item>
                <el-form-item label="车联网里程（公里）：" prop="vehicleNetworkMileage">
                  {{ form.vehicleNetworkMileage }}
                </el-form-item>
                <el-form-item label="交车日期：" prop="deliveryDate">
                  {{ form.deliveryDate }}
                </el-form-item>
                <el-form-item label="终端订单号：" prop="orderCode">
                  {{ form.orderCode }}
                </el-form-item>
                <el-form-item label="实车位置经度：" prop="actualLongitude">
                  {{ form.actualLongitude }}
                </el-form-item>
                <el-form-item label="实车位置纬度：" prop="actualLatitude">
                  {{ form.actualLatitude }}
                </el-form-item>
                <el-form-item label="同步状态：" prop="syncStatus">
                  {{ form.syncStatusLabel }}
                </el-form-item>
                <el-form-item label="推送次数：" prop="syncCount">
                  {{ form.syncCount }}
                </el-form-item>
                <el-form-item label="同步时间：" prop="syncTime">
                  {{ form.syncTime }}
                </el-form-item>
                <el-form-item label="同步结果：" prop="syncResult">
                  {{ form.syncResult }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/finance/factory/finVehicleBindingMileageRecord/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  financingDataSource: '',
  vin: '',
  vehicleNetworkMileage: '',
  isVehicleBound: '',
  bindingDate: '',
  fundFinancialOrganizationCodes: [],
  syncStatus: '',
  syncResult: '',
  syncCount: '',
  createTime: '',
  deliveryDate: '',
  actualLongitude: '',
  actualLatitude: '',
  status: '1',
  statusDesc: '',
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
  syncTime: '',
};

export default {
  name: 'finVehicleBindingMileageRecordEdit',
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
      pageTitle: '车辆绑车及里程记录',
      pageType: 'edit',
      title: '编码：' + form.code,
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-finVehicleBindingMileageRecord',
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
