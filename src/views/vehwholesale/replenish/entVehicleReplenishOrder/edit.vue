<template>
  <div>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="企业客户补货订单"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="form.orderCategory === 1 || form.orderCategory === 8"
      >
        <template #status>
          {{ form.replenishApplyCode }}
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <el-button  size="small" @click="handleAddDetail" >添加补货明细</el-button>
           <el-button  size="small" @click="handleCheckSubmit" >提交审批</el-button>
          <el-button  size="small" @click="handleCheckStatus" >审核</el-button>
          <el-button  size="small" @click="handleCancel" >作废</el-button>
          <!-- <el-button size="small" >附件上传</el-button> -->
          <el-button  size="small" @click="handleDelete" >删除</el-button>
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="订单分类：" prop="orderCategory">
                  <fetch-select
                    :options="orderCategoryOptions"
                    v-model="form.orderCategory"
                    placeholder="请选择订单分类"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="验收方式：" prop="acceptanceMethod">
                   <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_acceptance_method"
                    v-model="form.acceptanceMethod"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="销售市场：" prop="salesMarket">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesMarket"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="企业客户名称：" prop="entCustomerName">
                  <fetch-select
                      :remote-method="listNetworkParentCompany"
                      remote
                      v-model="form.entCustomerName"
                      placeholder="请选择"
                      labelKey="companyName"
                      valueKey="companyCode"
                      clearable
                      collapseTags
                      filterable
                      @change="(val, row) => handleChange(val, row)"
                />
                </el-form-item>
                 <el-form-item label="销售公司：" prop="saleCompanyId">
                    <fetch-select
                      filterable
                      clearable
                      remote
                      v-model="form.saleCompanyId"
                      :params="form.saleCompanyName"
                      :remote-method="getCompanyList"
                      value-key="id"
                      label-key="companyName"
                    />
                </el-form-item>
                 <el-form-item label="销售门店：" prop="saleDealerName">
                   <fetch-select
                      :options="saleCompanyOptions"
                      v-model="form.saleDealerName"
                      placeholder="销售公司"
                      labelKey="storeName"
                      valueKey="storeId"
                      clearable
                      filterable
                      @change="getOtherInfoBysaleCompany"
                    />
                </el-form-item>
                <el-form-item label="订单金额：" prop="totalAmount">
                  <el-input-number
                    placeholder="请输入订单金额"
                    v-model="form.totalAmount"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
                  />
                </el-form-item>
                 <el-form-item label="结算资金类型：" prop="settleFundType">
                  <fetch-select
                   :options="settleFundTypeOptions"
                    v-model="form.settleFundType"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="iscreditSaleFlag"
                  />
                </el-form-item>
                 <el-form-item label="金融机构：" prop="financialOrganizationId">
                  <fetch-select
                      :remote-method="repairItemSearch"
                      remote
                      reserve-keyword
                      labelKey="organizationName"
                      valueKey="organizationCode"
                      v-model="form.financialOrganizationId"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                </el-form-item>
                <el-form-item label="是否赊销：" prop="creditSaleFlag">
                  <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.creditSaleFlag"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                </el-form-item>
                <el-form-item label="订单时间：" prop="orderTime">
                  <el-date-picker
                    v-model="form.orderTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择订单时间"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="销售人员：" prop="saleUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleUserName"
                    maxlength="15"
                    clearable
                  />
                </el-form-item>
                  <el-form-item label="订单备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    maxlength="150"
                    clearable
                  />
                </el-form-item>
                 <!-- <el-form-item label="创建时间：" prop="createTime">
                   <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    type="datetime"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item> -->
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                 <el-form-item label="订单分类：" prop="orderCategoryLabel">
                  {{ form.orderCategoryLabel }}
                </el-form-item>
                <el-form-item label="验收方式：" prop="acceptanceMethodLabel">
                  {{ form.acceptanceMethodLabel }}
                </el-form-item>
                <el-form-item label="销售市场：" prop="salesMarket">
                  {{ form.salesMarket }}
                </el-form-item>
                <el-form-item label="企业客户名称：" prop="entCustomerName">
                  {{ form.entCustomerName }}
                </el-form-item>
                <el-form-item label="销售公司：" prop="saleCompanyId">
                  {{ form.saleCompanyId }}
                </el-form-item>
                 <el-form-item label="销售门店名称：" prop="saleDealerName">
                  {{ form.saleDealerName }}
                </el-form-item>
                <el-form-item label="订单金额：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="结算资金类型：" prop="settleFundTypeLabel">
                  {{ form.settleFundTypeLabel }}
                </el-form-item>
                <el-form-item label="金融机构：" prop="financialOrganizationId">
                  {{ form.financialOrganizationId }}
                </el-form-item>
                <el-form-item label="是否赊销：" prop="creditSaleFlagLabel">
                  {{ form.creditSaleFlagLabel }}
                </el-form-item>
                  <el-form-item label="订单时间：" prop="orderTime">
                  {{ form.orderTime }}
                </el-form-item>
                  <el-form-item label="销售人员名称：" prop="saleUserName">
                  {{ form.saleUserName }}
                </el-form-item>
                 <el-form-item label="订单备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                 <!-- <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item> -->
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>接车地址信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
               <el-form-item label="接车联系人：" prop="pickupContactName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pickupContactName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="接车联系电话：" prop="pickupContactMobile">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pickupContactMobile"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="省份：" prop="provinceCode">
                   <fetch-select
                      filterable
                      clearable
                      remote
                      v-model="form.provinceName"
                      :remote-method="getProvince"
                      value-key="code"
                      label-key="name"
                      @change="handleChangeProvince"
                    />
                </el-form-item>
                <el-form-item label="城市：" prop="cityCode">
                    <fetch-select
                        filterable
                        clearable
                        v-model="form.cityName"
                        :options="cityOptions"
                        value-key="code"
                        label-key="name"
                        @change="handleChangeDistrict"
                      />
                </el-form-item>
                <el-form-item label="区县编码：" prop="districtCode">
                   <fetch-select
                        filterable
                        clearable
                        v-model="form.districtCode"
                        :options="districtOptions"
                        value-key="code"
                        label-key="name"
                        @change="getDistrictName"
                      />
                </el-form-item>
                <el-form-item label="交车地址：" prop="address">
                  <el-input
                    placeholder="请输入"
                    v-model="form.address"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="经度：" prop="longitude">
                  <el-input
                    placeholder="请输入"
                    v-model="form.longitude"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维度：" prop="latitude">
                  <el-input
                    placeholder="请输入"
                    v-model="form.latitude"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                 <el-form-item label="接车联系人：" prop="pickupContactName">
                  {{ form.pickupContactName }}
                </el-form-item>
                <el-form-item label="接车联系电话：" prop="pickupContactMobile">
                  {{ form.pickupContactMobile }}
                </el-form-item>
                <el-form-item label="省份：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="城市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="区县名称：" prop="districtName">
                  {{ form.districtName }}
                </el-form-item>
                <el-form-item label="交车地址：" prop="address">
                  {{ form.address }}
                </el-form-item>
                <el-form-item label="经度：" prop="longitude">
                  {{ form.longitude }}
                </el-form-item>
                <el-form-item label="维度：" prop="latitude">
                  {{ form.latitude }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                 <el-form-item label="审核状态：" prop="auditStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_ent_vehicle_replenish_order_audit_status"
                    v-model="form.auditStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="审核人：" prop="auditorUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditorUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审核时间：" prop="auditTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.auditTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="审核意见：" prop="auditOpinion">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditOpinion"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                 <el-form-item label="审核状态：" prop="auditStatusLabel">
                  {{ form.auditStatusLabel }}
                </el-form-item>
                <el-form-item label="审核人：" prop="auditorName">
                  {{ form.auditorName }}
                </el-form-item>
                <el-form-item label="审核时间：" prop="auditTime">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="审核意见：" prop="auditOpinion">
                  {{ form.auditOpinion }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="_id">
            <div class="common-section-header">
              <h2>企业客户补货订单明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="qty" title="数量" />
                  <vxe-column field="standardPrice" title="标准价格" />
                  <vxe-column field="salesPrice" title="销售价格"  />
                  <vxe-column field="relatedTxnExTaxPrice" title="关联交易不含税价" />
                  <vxe-column field="materialsCode" title="整车物料编码" />
                  <vxe-column field="materialsDesc" title="物料描述" />
                  <vxe-column field="modelName" title="车型" />
                  <vxe-column field="drivingRangeName" title="选配续航" />
                  <vxe-column field="rangePowerName" title="选配动力" />
                  <vxe-column field="exteriorName" title="外饰风格" />
                  <vxe-column field="interiorName" title="内饰风格" />
                  <vxe-column field="wheelHubName" title="选配轮毂" />
                  <vxe-column field="batteryCellName" title="电池电芯" />
                  <vxe-column field="yearTypeName" title="年款" />
                  <vxe-column field="roofName" title="车顶风格" />
                  <vxe-column field="optionPackageName" title="选装包" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
            </div>
          </section>
          <section class="common-section" v-show="_id">
            <div class="common-section-header">
              <h2>附件上传信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <!-- 附件上传组件 -->
                <AisAttachment
                  :businessId="_id"
                  configCode="mcs_spmusedprtdestory_apply"
                  attachType="其他"
                  ref="attachment"
                />
                <!-- <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="name" title="附件名称" />
                  <vxe-column field="age" title="附件大小" />
                  <vxe-column field="email" title="附件后缀"  />
                  <vxe-column field="email" title="上传时间" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                </vxe-table> -->
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
  <Upload :visible="uploadDialogVisible" templateUrl="" uploadUrl="" @close="handleUploadDialogClose" />
  <AddEntVehicleReplishOrderDetail  :visible.sync="showAddDetailDialog"
      :order-ids="[_id]"
      :orderInfo="form"
      @addConfirm="addConfirm">
  </AddEntVehicleReplishOrderDetail>
    <audit-dialog
      ref="auditRef"
      @audit="handleBatchAudit"
      :auditDataList="[_id]"
      :field="'code'"
    />
  </div>
</template>

<script>
import { getDetail, addOrUpdate, networkParentCompanyItem, listDealersForParentCompany, addOrUpdateDetail, batchCancel, batchSubmitAudit, batchAudit, deleteItem } from '@/api/vehwholesale/replenish/entVehicleReplenishOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, cityListByName, getProvinceTree } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import AddEntVehicleReplishOrderDetail from './addEntVehicleReplishOrderDetail.vue';
import { getList as fundGetList } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import auditDialog from '@/libs/components/auditDialog';
import Upload from '@/libs/components/UploadDialog';
import { getList as companyList } from '@/api/vehwholesale/fund/fundSaleCompany/index';
import AisAttachment from '@/libs/components/AisAttachment';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  createTime: new Date(),
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  entReplenishOrderCode: '',
  entCustomerCode: '',
  entCustomerName: '',
  orderCategory: '',
  acceptanceMethod: '',
  salesMarket: '',
  creditSaleFlag: '',
  totalAmount: '',
  settleFundType: '',
  financialOrganizationId: '',
  orderTime: '',
  saleDealerCode: '',
  saleDealerName: '',
  saleUserName: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  address: '',
  fullAddress: '',
  longitude: '',
  latitude: '',
  pickupContactName: '',
  pickupContactMobile: '',
  auditorName: '',
  auditorUserId: '',
  auditTime: '',
  auditOpinion: '',
  auditStatus: 0,
  saleCompanyId: '',
};

export default {
  name: 'entVehicleReplenishOrderEdit',
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
    FetchSelect,
    AddEntVehicleReplishOrderDetail,
    auditDialog,
    Upload,
    AisAttachment
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '主键：' + this.form.id;
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
    const routeOrderCategory = this.$route.query.orderCategory ? (this.$route.query.orderCategory) : '';
    form.orderCategory = routeOrderCategory;
    return {
      pageTitle: '整车销售-企业客户订单-企业客户补货订单管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVW-entVehicleReplenishOrder',
      loading: false,
      submitLoading: false,
      showAddDetailDialog: false,
      uploadDialogVisible: false,
      yes_no_enum: YES_NO_ENUM,
      orderCategoryOptions: [],
      settleFundTypeOptions: [],
      districtOptions: [],
      cityOptions: [],
      saleCompanyOptions: [],
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      rules: {
        orderCategory: [
          { required: true, message: '请输入订单分类', trigger: 'change' }
        ],
        entCustomerName: [
          { required: true, message: '请输入企业客户名称', trigger: 'change' }
        ],
        saleCompanyId: [
          { required: true, message: '请输入销售公司', trigger: 'change' }
        ],
        creditSaleFlag: [
          { required: true, message: '请输入是否赊销', trigger: 'change' }
        ],
        totalAmount: [
          { required: true, message: '请输入订单金额', trigger: 'change' }
        ],
        settleFundType: [
          { required: true, message: '请选择结算资金类型', trigger: 'change' }
        ],
        orderTime: [
          { required: true, message: '请选择订单时间', trigger: 'change' }
        ],
        pickupContactName: [
          { required: true, message: '请选择接车联系人', trigger: 'change' }
        ],
        pickupContactMobile: [
          { required: true, message: '请选择接车人电话', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请选择交车地址', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.fetchOrderCategoryOptions();
    this.fetchSettleFundTypeOptions();
    this.listNetworkParentCompany();
    // this.getCompanyList();
  },
  methods: {
    getCompanyList (query) {
      return companyList({ companyNameLike: query, status: 1 });
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleUpload () {
      this.uploadDialogVisible = true;
    },
    handleBatchAudit (data) {
      let params = {
        ids: [this._id],
        audit: data.result,
        auditOpinion: data.remark
      };
      return batchAudit(params).then(() => {
        this.$message({
          type: 'success',
          message: '批量审核成功'
        });
        this.getData();
      });
    },
    handleCheckStatus () {
      this.$refs.auditRef.show();
    },
    handleCheckSubmit () {
      this.$confirm('确认是否对数据进行提交审批?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 提交审批接口 判断是否需要初审
        batchSubmitAudit({
          idSet: [this._id],
        }).then(res => {
          // 重新加载详情数据
          if (this.$refs.containerRef) {
            this.$refs.containerRef.loadDetail();
          }
          // 或者关闭编辑状态
          this.isEditing = false;
        });
      }).catch(() => {});
    },

    handleCancel () {
      batchCancel({
        idSet: [this._id],
      }).then(() => {
        this.$message.success('作废成功');
        this.getDetailData();
      });
    },

    handleDelete () { // 删除
      const ids = [this._id];
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
        });
      }).catch(() => {});
    },
    getDistrictName (val, row) {
      this.form.districtName = row.name;
      this.form.districtCode = row.code;
    },
    handleChangeDistrict (val, selectedOption) {
      if (val) {
        this.form.cityName = selectedOption?.name;
        this.form.cityCode = selectedOption?.code;
        this.districtOptions = selectedOption?.child || [];
      }
    },
    // 选择省以后带出市信息
    handleChangeProvince (val, selectedOption) {
      if (val) {
        this.form.provinceCode = selectedOption?.code || '';
        this.form.provinceName = selectedOption?.name;
        this.cityOptions = selectedOption?.child || []; // 选择省以后带出市信息
      }
    },
    async getCityList (params) {
      return cityListByName({ cityName: params });
    },
    // 查询所有省市区
    async getProvince (params) {
      const res = await getProvinceTree();
      let list = res || [];
      if (params && params.trim()) {
        const searchText = params.trim().toLowerCase();
        list = list.filter(item => item.name && item.name.toLowerCase().includes(searchText));
      }
      return list;
    },
    async listNetworkParentCompany (query) {
      return networkParentCompanyItem({ parentCompanyName: query, pageNum: 1, pageSize: 20 });
    },
    getOtherInfoBysaleCompany (val, row) {
      console.log(val, row);
      this.form.latitude = row.latitude;
      this.form.longitude = row.longitude;
      this.form.provinceCode = row.provinceCode;
      this.form.provinceName = row.provinceName;
      this.form.cityCode = row.cityCode;
      this.form.cityName = row.cityName;
      this.form.districtCode = row.districtCode;
      this.form.districtName = row.districtName;
      this.form.saleDealerName = row.storeName;
      this.form.saleDealerCode = row.storeCode;
      this.form.address = row.storeBuildAddress;
    },
    getDealersForParentCompany (val) {
      listDealersForParentCompany({ companyCode: val }).then(res => {
        this.saleCompanyOptions = res;
      });
    },
    handleChange (val, row) {
      console.log(val, row);
      this.form.entCustomerName = row.companyName;
      this.form.entCustomerCode = row.companyCode;
      this.getDealersForParentCompany(val);
    },
    iscreditSaleFlag (val) {
      if (val === '2010') {
        this.rules.fundFinancialOrganizationId = [
          { required: true, message: '请输入金融机构', trigger: 'change' }
        ];
        this.form.creditSaleFlag = 0;
      } else if (val === '1050') {
        this.form.creditSaleFlag = 1;
      } else if (val === '1010') {
        this.form.creditSaleFlag = 0;
      }
    },
    async repairItemSearch (query) {
      return fundGetList({ organizationNameLike: query, status: 1 });
    },
    async fetchSettleFundTypeOptions () {
      const response = await getEnum('vw_fundtype');
      this.settleFundTypeOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['1050', '1010', '2010'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    async fetchOrderCategoryOptions () {
      const response = await getEnum('vw_eordertype');
      this.orderCategoryOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['1', '8', '21'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    handleAddDetail () {
      this.showAddDetailDialog = true;
    },
    addConfirm (data) {
      data.entReplenishOrderId = this.form.id;
      addOrUpdateDetail(data).then(() => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '添加失败!'
        });
      });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          res.detailList = res.detailList.map(detail => ({
            ...detail,
            materialsDesc: detail.vehicleMaterials.materialsDesc || '',
            modelName: detail.vehicleMaterials.modelName || '',
            drivingRangeName: detail.vehicleMaterials.drivingRangeName || '',
            rangePowerName: detail.vehicleMaterials.rangePowerName || '',
            exteriorName: detail.vehicleMaterials.exteriorName || '',
            interiorName: detail.vehicleMaterials.interiorName || '',
            wheelHubName: detail.vehicleMaterials.wheelHubName || '',
            batteryCellName: detail.vehicleMaterials.batteryCellName || '',
            yearTypeName: detail.vehicleMaterials.yearTypeName || '',
            roofName: detail.vehicleMaterials.roofName || '',
            optionPackageName: detail.vehicleMaterials.optionPackageName || '',
          }));
          this.tableData = res.detailList;
          return res;
        });
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      // const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
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
