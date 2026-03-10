<template>
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
      >
        <template #status>
          {{ form.replenishApplyCode }}
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <el-button v-permission="moduleKey+'-batchConfirm'" size="small" type="primary" @click="handleAddDetail" >添加补货明细</el-button>
          <el-button v-permission="moduleKey+'-batchConfirm'" size="small" type="primary" @click="handleCheckConfirm" >提交审批</el-button>
          <el-button v-permission="moduleKey+'-batchConfirm'" size="small" type="primary" @click="handleCheckConfirm" >审核通过</el-button>
          <el-button v-permission="moduleKey+'-batchConfirm'" size="small" type="primary" @click="handleCheckConfirm" >审核驳回</el-button>
          <el-button v-permission="moduleKey+'-batchConfirm'" size="small" type="primary" @click="handleCheckConfirm" >作废</el-button>
          <el-button v-permission="moduleKey+'-batchConfirm'" size="small" type="primary" @click="handleCheckConfirm" >上传附件</el-button>
          <el-button v-permission="moduleKey+'-batchConfirm'" size="small" type="primary" @click="handleCheckConfirm" >删除</el-button>
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
                  <el-input
                    placeholder="请输入"
                    v-model="form.entCustomerName"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="销售公司：" prop="saleCompanyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleCompanyId"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                  />
                </el-form-item>

                <el-form-item label="订单金额：" prop="totalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.totalAmount"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="结算资金类型：" prop="settleFundType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.settleFundType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                 <el-form-item label="金融机构：" prop="financialOrganizationId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.financialOrganizationId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否赊销：" prop="creditSaleFlag">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creditSaleFlag"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单时间：" prop="orderTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.orderTime"
                    type="datetime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
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
                 <el-form-item label="创建时间：" prop="createTime">
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
                </el-form-item>
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
                <el-form-item label="是否赊销" prop="creditSaleFlagLabel">
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
                 <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
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
                <el-form-item label="省：" prop="provinceCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="市：" prop="cityCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="区县编码：" prop="districtCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.districtCode"
                    clearable
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
                <el-form-item label="省：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
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
                    enumCode="xxx"
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
                 <el-form-item label="审核状态：" prop="auditStatus">
                  {{ form.auditStatus }}
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
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>子表标题</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryListData"
                    remote
                    placeholder="请选择"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleAddTableData"
                  />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
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
                  <vxe-column field="name" title="数量" />
                  <vxe-column field="age" title="标准价格" />
                  <vxe-column field="email" title="销售价格"  />
                  <vxe-column field="email" title="关联交易不含税价" />
                  <vxe-column field="email" title="整车物料编码" />
                  <vxe-column field="email" title="物料描述" />
                  <vxe-column field="email" title="车型" />
                  <vxe-column field="email" title="选配续航" />
                  <vxe-column field="email" title="选配动力" />
                  <vxe-column field="email" title="外饰风格" />
                  <vxe-column field="email" title="内饰风格" />
                  <vxe-column field="email" title="选配轮毂" />
                  <vxe-column field="email" title="电池电芯" />
                  <vxe-column field="email" title="年款" />
                  <vxe-column field="email" title="车顶风格" />
                  <vxe-column field="email" title="选装包" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <AddEntVehicleReplishOrderDetail  :visible.sync="showAddDetailDialog"
      ::order-ids="[_id]"
      @addConfirm="addConfirm"></AddEntVehicleReplishOrderDetail>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehwholesale/replenish/entVehicleReplenishOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import AddEntVehicleReplishOrderDetail from './addEntVehicleReplishOrderDetail.vue';

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
  auditStatus: '',
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
    AddEntVehicleReplishOrderDetail
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
    return {
      pageTitle: '整车销售-企业客户订单-企业客户补货订单管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVW-entVehicleReplenishOrder',
      loading: false,
      submitLoading: false,
      showAddDetailDialog: false,
      yes_no_enum: YES_NO_ENUM,
      orderCategoryOptions: [],
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '数量', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '标准价格', age: 30, email: 'lisi@example.com' }
      ],
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
          { required: true, message: '请输入是否赊销，1是，0否', trigger: 'change' }
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
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.fetchOrderCategoryOptions();
  },
  methods: {
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
    addConfirm () {},
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
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
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
