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
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="收款记录ID：" prop="payRecordId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payRecordId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收款编号：" prop="payCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零售订单ID：" prop="retailOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="商城订单号：" prop="mallOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收款类型 0-贷款;1-定金;2-尾款;3-权益抵扣;4-贷款首付款;5-定金权益;6-门店优惠;7-机动车发票其他费用;8-意向金：" prop="payCategory">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payCategory"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="付款金额：" prop="paymentAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.paymentAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="付款时间：" prop="paymentTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.paymentTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="支付方式 1010-微信;1020-支付宝;1030-POS刷卡;1040-银行转账;1050-按揭;1060-权益;1070-现金;1080-抖音支付：" prop="paymentType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.paymentType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="支付渠道 1010-付呗;1020-直连：" prop="paymentWay">
                  <el-input
                    placeholder="请输入"
                    v-model="form.paymentWay"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="支付人：" prop="payerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="支付人手机号：" prop="payerPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payerPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="商城流水号：" prop="outTradeNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.outTradeNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="支付流水号：" prop="paySerialNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.paySerialNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退款时间：" prop="refundTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.refundTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="退款结果：" prop="refundResult">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundResult"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退款说明：" prop="refundRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据来源，150-新销服; 10-老销服：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="收款记录ID：" prop="payRecordId">
                  {{ form.payRecordId }}
                </el-form-item>
                <el-form-item label="收款编号：" prop="payCode">
                  {{ form.payCode }}
                </el-form-item>
                <el-form-item label="零售订单ID：" prop="retailOrderId">
                  {{ form.retailOrderId }}
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  <el-link v-if="form.retailOrderId" type="primary" :href="`/sales/vehretail/orderManager/retailOrderInfo/edit?id=${form.retailOrderId}`" target="_blank">{{ form.retailOrderCode }}</el-link><span v-else>{{ form.retailOrderCode }}</span>
                </el-form-item>
                <el-form-item label="商城订单号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="销售门店编码：" prop="saleDealerCode">
                  {{ form.saleDealerCode }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.saleDealerCode}`" target="_blank">{{ form.saleDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="收款类型 0-贷款;1-定金;2-尾款;3-权益抵扣;4-贷款首付款;5-定金权益;6-门店优惠;7-机动车发票其他费用;8-意向金：" prop="payCategory">
                  {{ form.payCategory }}
                </el-form-item>
                <el-form-item label="付款金额：" prop="paymentAmount">
                  {{ form.paymentAmount }}
                </el-form-item>
                <el-form-item label="付款时间：" prop="paymentTime">
                  {{ form.paymentTime }}
                </el-form-item>
                <el-form-item label="支付方式 1010-微信;1020-支付宝;1030-POS刷卡;1040-银行转账;1050-按揭;1060-权益;1070-现金;1080-抖音支付：" prop="paymentType">
                  {{ form.paymentType }}
                </el-form-item>
                <el-form-item label="支付渠道 1010-付呗;1020-直连：" prop="paymentWay">
                  {{ form.paymentWay }}
                </el-form-item>
                <el-form-item label="支付人：" prop="payerName">
                  {{ form.payerName }}
                </el-form-item>
                <el-form-item label="支付人手机号：" prop="payerPhone">
                  {{ form.payerPhone }}
                </el-form-item>
                <el-form-item label="商城流水号：" prop="outTradeNo">
                  {{ form.outTradeNo }}
                </el-form-item>
                <el-form-item label="支付流水号：" prop="paySerialNumber">
                  {{ form.paySerialNumber }}
                </el-form-item>
                <el-form-item label="退款时间：" prop="refundTime">
                  {{ form.refundTime }}
                </el-form-item>
                <el-form-item label="退款结果：" prop="refundResult">
                  {{ form.refundResult }}
                </el-form-item>
                <el-form-item label="退款说明：" prop="refundRemark">
                  {{ form.refundRemark }}
                </el-form-item>
                <el-form-item label="数据来源，150-新销服; 10-老销服：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
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
                  <vxe-column field="name" title="名称" min-width="30%" />
                  <vxe-column field="age" title="年龄" min-width="30%" />
                  <vxe-column field="email" title="邮箱" min-width="30%" />
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
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/orderRefund/payRefundRecord/index';
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
  payRecordId: '',
  payCode: '',
  retailOrderId: '',
  retailOrderCode: '',
  mallOrderCode: '',
  saleDealerCode: '',
  saleDealerName: '',
  payCategory: '',
  paymentAmount: '',
  paymentTime: '',
  paymentType: '',
  paymentWay: '',
  payerName: '',
  payerPhone: '',
  outTradeNo: '',
  paySerialNumber: '',
  refundTime: '',
  refundResult: '',
  refundRemark: '',
  dataSource: '',
};

export default {
  name: 'orderPayRefundRecordEdit',
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
      pageTitle: '订单退订退款记录管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISMC-payRefundRecord',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        payRecordId: [
          { required: true, message: '请输入收款记录ID', trigger: 'change' }
        ],
        payCode: [
          { required: true, message: '请输入收款编号', trigger: 'change' }
        ],
        retailOrderId: [
          { required: true, message: '请输入零售订单ID', trigger: 'change' }
        ],
        retailOrderCode: [
          { required: true, message: '请输入零售订单号', trigger: 'change' }
        ],
        mallOrderCode: [
          { required: true, message: '请输入商城订单号', trigger: 'change' }
        ],
        saleDealerCode: [
          { required: true, message: '请输入销售门店编码', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        payCategory: [
          { required: true, message: '请输入收款类型 0-贷款;1-定金;2-尾款;3-权益抵扣;4-贷款首付款;5-定金权益;6-门店优惠;7-机动车发票其他费用;8-意向金', trigger: 'change' }
        ],
        paymentAmount: [
          { required: true, message: '请输入付款金额', trigger: 'change' }
        ],
        paymentTime: [
          { required: true, message: '请选择付款时间', trigger: 'change' }
        ],
        paymentType: [
          { required: true, message: '请选择支付方式 1010-微信;1020-支付宝;1030-POS刷卡;1040-银行转账;1050-按揭;1060-权益;1070-现金;1080-抖音支付', trigger: 'change' }
        ],
        paymentWay: [
          { required: true, message: '请输入支付渠道 1010-付呗;1020-直连', trigger: 'change' }
        ],
        payerName: [
          { required: true, message: '请输入支付人', trigger: 'change' }
        ],
        payerPhone: [
          { required: true, message: '请输入支付人手机号', trigger: 'change' }
        ],
        outTradeNo: [
          { required: true, message: '请输入商城流水号', trigger: 'change' }
        ],
        paySerialNumber: [
          { required: true, message: '请输入支付流水号', trigger: 'change' }
        ],
        refundTime: [
          { required: true, message: '请选择退款时间', trigger: 'change' }
        ],
        refundResult: [
          { required: true, message: '请输入退款结果', trigger: 'change' }
        ],
        refundRemark: [
          { required: true, message: '请输入退款说明', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150-新销服; 10-老销服', trigger: 'change' }
        ],
      }
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
