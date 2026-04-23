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
                  <el-button class="link" style="padding: 0;"
                   @click="navigateToRoute({
                      path: '/vehwholesale/fund/fundFinancialOrganization/detail',
                      query: {
                        id: form.fundFinancialOrganizationId,
                      },
                    })"
                   type="text">{{ form.fundFinancialOrganizationName }}</el-button>
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  {{ form.dealerCompanyCode }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="经销商编码：" prop="dealerCode">
                  <el-button class="link" style="padding: 0;"
                   @click="navigateToRoute({
                      path: '/partner/channelManagement/shopDetail',
                      query: {
                        dealerCode: form.dealerCode,
                      },
                    })"
                   type="text">{{form.dealerCode}}</el-button>
                </el-form-item>
                <el-form-item label="经销商名称：" prop="dealerName">
                  <el-button class="link" style="padding: 0;"
                   @click="navigateToRoute({
                      path: '/partner/channelManagement/shopDetail',
                      query: {
                        dealerCode: form.dealerCode,
                      },
                    })"
                   type="text">{{form.dealerName}}</el-button>
                </el-form-item>
                <el-form-item label="统一社会信用代码：" prop="unifiedSocialCreditCode">
                  {{ form.unifiedSocialCreditCode }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
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
                <el-form-item label="车辆状态：" prop="vehicleStatus">
                  {{ form.vehicleStatusLabel }}
                </el-form-item>
                <el-form-item label="融资数据来源：" prop="financingDataSource">
                  {{ form.financingDataSourceLabel }}
                </el-form-item>
                <el-form-item label="融资金额：" prop="financingAmount">
                  {{ form.financingAmount }}
                </el-form-item>
                <el-form-item label="含税价格：" prop="taxIncludedPrice">
                  {{ form.taxIncludedPrice }}
                </el-form-item>
                <el-form-item label="订单号：" prop="orderCode">
                  {{ form.orderCode }}
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialsCode">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="发车日期：" prop="shipmentDate">
                  {{ form.shipmentDate }}
                </el-form-item>
                <el-form-item label="收车日期：" prop="receiveDate">
                  {{ form.receiveDate }}
                </el-form-item>
                <el-form-item label="同步状态：" prop="syncStatus">
                  {{ form.syncStatusLabel }}
                </el-form-item>
                <el-form-item label="同步结果：" prop="syncResult">
                  {{ form.syncResult }}
                </el-form-item>
                <el-form-item label="同步时间：" prop="syncTime">
                  {{ form.syncTime }}
                </el-form-item>
                <el-form-item label="推送次数：" prop="syncCount">
                  {{ form.syncCount }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/finance/factory/finVehicleStatusRecord/index';
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
  orderCode: '',
  vehiclestatus: '1',
  vin: '',
  financingAmount: '',
  taxIncludedPrice: '',
  dealerCompanyCode: '',
  dealerCompanyName: '',
  dealerCode: '',
  dealerName: '',
  unifiedSocialCreditCode: '',
  fundFinancialOrganizationCodes: [],
  materialsCode: '',
  materialsDesc: '',
  shipmentDate: '',
  receiveDate: '',
  syncStatus: '',
  syncResult: '',
  syncCount: '',
  createTime: '',
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
  name: 'finVehicleStatusRecordEdit',
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
      pageTitle: '车辆状态记录',
      pageType: 'edit',
      title: '编码：' + form.code,
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-finVehicleStatusRecord',
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
