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
          <!-- {{ form.paymentNoticeCode }} -->
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="门店名称：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="所属母公司：" prop="dealerCompanyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyName"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="批售总金额：" prop="totalWholesaleAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.totalWholesaleAmount"
                    clearable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="待结算数：" prop="pendingSettleCount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pendingSettleCount"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="发布状态：" prop="publishStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.publishStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="发布时间：" prop="publishTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.publishTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="门店名称：" prop="saleDealerName">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.saleDealerCode}`" target="_blank">{{ form.saleDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="所属母公司：" prop="dealerCompanyName">
                  <el-link type="primary" :href="`/partner/channelManagement/companyDetails?companyCode=${form.dealerCompanyCode}`" target="_blank">{{ form.dealerCompanyName }}</el-link>
                </el-form-item>
                <el-form-item label="批售总金额：" prop="totalWholesaleAmount">
                  {{ form.totalWholesaleAmount }}
                </el-form-item>
                <el-form-item label="待结算数：" prop="pendingSettleCount">
                  {{ form.pendingSettleCount }}
                </el-form-item>
                <el-form-item label="发布状态：" prop="publishStatusLabel">
                  {{ form.publishStatusLabel }}
                </el-form-item>
                <el-form-item label="发布时间：" prop="publishTime">
                  {{ form.publishTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>批售请款通知明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="form.details"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="paymentDetailCode" title="请款明细单号" />
                  <vxe-column field="paymentNoticeCode" title="请款通知单" />
                  <vxe-column field="saleDealerName" title="门店名称">
                    <template #default="{ row }">
                      <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${row.saleDealerCode}`" target="_blank">{{ row.saleDealerName }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="materialsCode" title="物料编码">
                    <template #default="{ row }">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${row.materialsCode}`" target="_blank">{{ row.materialsCode }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="orderCategoryLabel" title="订单分类" />
                  <vxe-column field="entCustomerName" title="企业客户" />
                  <vxe-column field="entVehicleOrderCode" title="企业客户订单号">
                    <template #default="{ row }">
                      <el-link type="primary" :href="`/sales/vehwholesale/entorder/entVehicleOrder/edit?id=${row.entVehicleOrderCode}`" target="_blank">{{ row.entVehicleOrderCode }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="wholesaleOrderCode" title="批售订单号">
                    <template #default="{ row }">
                      <el-link type="primary" :href="`/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit?id=${row.wholesaleOrderCode}`" target="_blank">{{ row.wholesaleOrderCode }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="wholesalePrice" title="批售价格" align="right"/>
                  <vxe-column field="orderTime" title="订单日期" />
                  <vxe-column field="createTime" title="创建时间" />
                </vxe-table>
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
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehwholesale/wholesale/vehicleWholesalePaymentNotice/index';
import FetchSelect from '@/libs/components/FetchSelect';
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
  paymentNoticeCode: '',
  dealerCompanyCode: '',
  dealerCompanyName: '',
  saleDealerCode: '',
  saleDealerName: '',
  pendingSettleCount: '',
  totalWholesaleAmount: '',
  publishStatus: '',
  publishTime: '',
  dataSource: '',
};

export default {
  name: 'vehicleWholesalePaymentNoticeEdit',
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
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '批售请款通知管理：' + this.form.paymentNoticeCode;
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
      pageTitle: '批售请款通知管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVW-vehicleWholesalePaymentNotice',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      rules: {
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        paymentNoticeCode: [
          { required: true, message: '请输入请款通知单号，PD开头+年月日+6位流水号', trigger: 'change' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'change' }
        ],
        dealerCompanyName: [
          { required: true, message: '请输入所属母公司名称', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        pendingSettleCount: [
          { required: true, message: '请输入待结算数，默认值0，根据明细汇总', trigger: 'change' }
        ],
        totalWholesaleAmount: [
          { required: true, message: '请输入批售总金额，根据明细批售价汇总', trigger: 'change' }
        ],
        publishStatus: [
          { required: true, message: '请选择发布状态：0-草稿、1-已发布', trigger: 'change' }
        ],
        publishTime: [
          { required: true, message: '请选择发布时间', trigger: 'change' }
        ],
      }
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
    // 删除子表数据
    handleDeleteRow (index) {
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
