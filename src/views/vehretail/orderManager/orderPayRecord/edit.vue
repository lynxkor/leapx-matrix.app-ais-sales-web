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
                <el-form-item label="商城订单号：" prop="mallOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderCode"
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
                <el-form-item label="收款编号：" prop="payCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payCode"
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
                <el-form-item label="权益类型 0-金额类;1-实物类：" prop="rightsType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.rightsType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="权益项名称：" prop="rightsItem">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rightsItem"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权益项编号：" prop="rightsItemCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rightsItemCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权益核销券码：" prop="rightsGrantCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rightsGrantCode"
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
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="商城订单号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="商城流水号：" prop="outTradeNo">
                  {{ form.outTradeNo }}
                </el-form-item>
                <el-form-item label="支付流水号：" prop="paySerialNumber">
                  {{ form.paySerialNumber }}
                </el-form-item>
                <el-form-item label="付款金额：" prop="paymentAmount">
                  {{ form.paymentAmount }}
                </el-form-item>
                <el-form-item label="付款时间：" prop="paymentTime">
                  {{ form.paymentTime }}
                </el-form-item>
                <el-form-item label="收款编号：" prop="payCode">
                  {{ form.payCode }}
                </el-form-item>
                <el-form-item label="收款类型 0-贷款;1-定金;2-尾款;3-权益抵扣;4-贷款首付款;5-定金权益;6-门店优惠;7-机动车发票其他费用;8-意向金：" prop="payCategory">
                  {{ form.payCategory }}
                </el-form-item>
                <el-form-item label="支付方式 1010-微信;1020-支付宝;1030-POS刷卡;1040-银行转账;1050-按揭;1060-权益;1070-现金;1080-抖音支付：" prop="paymentType">
                  {{ form.paymentType }}
                </el-form-item>
                <el-form-item label="支付渠道 1010-付呗;1020-直连：" prop="paymentWay">
                  {{ form.paymentWay }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
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
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="零售订单ID：" prop="retailOrderId">
                  {{ form.retailOrderId }}
                </el-form-item>
                <el-form-item label="零售订单号：" prop="retailOrderCode">
                  {{ form.retailOrderCode }}
                </el-form-item>
                <el-form-item label="支付人：" prop="payerName">
                  {{ form.payerName }}
                </el-form-item>
                <el-form-item label="支付人手机号：" prop="payerPhone">
                  {{ form.payerPhone }}
                </el-form-item>
                <el-form-item label="权益类型 0-金额类;1-实物类：" prop="rightsType">
                  {{ form.rightsType }}
                </el-form-item>
                <el-form-item label="权益项名称：" prop="rightsItem">
                  {{ form.rightsItem }}
                </el-form-item>
                <el-form-item label="权益项编号：" prop="rightsItemCode">
                  {{ form.rightsItemCode }}
                </el-form-item>
                <el-form-item label="权益核销券码：" prop="rightsGrantCode">
                  {{ form.rightsGrantCode }}
                </el-form-item>
                <el-form-item label="数据来源，150-新销服; 10-老销服：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>区块标题</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
                />
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
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/orderPayRecord/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  mallOrderCode: '',
  outTradeNo: '',
  paySerialNumber: '',
  paymentAmount: '',
  paymentTime: '',
  payCode: '',
  payCategory: '',
  paymentType: '',
  paymentWay: '',
  status: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  statusDesc: '',
  retailOrderId: '',
  retailOrderCode: '',
  payerName: '',
  payerPhone: '',
  rightsType: '',
  rightsItem: '',
  rightsItemCode: '',
  rightsGrantCode: '',
  dataSource: '',
};

export default {
  name: 'orderPayRecordEdit',
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
    EditTable,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '：' + this.form.id;
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
      pageTitle: '订单收款记录管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-orderPayRecord',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        mallOrderCode: [
          { required: true, message: '请输入商城订单号', trigger: 'change' }
        ],
        outTradeNo: [
          { required: true, message: '请输入商城流水号', trigger: 'change' }
        ],
        paySerialNumber: [
          { required: true, message: '请输入支付流水号', trigger: 'change' }
        ],
        paymentAmount: [
          { required: true, message: '请输入付款金额', trigger: 'change' }
        ],
        paymentTime: [
          { required: true, message: '请选择付款时间', trigger: 'change' }
        ],
        payCode: [
          { required: true, message: '请输入收款编号', trigger: 'change' }
        ],
        payCategory: [
          { required: true, message: '请输入收款类型 0-贷款;1-定金;2-尾款;3-权益抵扣;4-贷款首付款;5-定金权益;6-门店优惠;7-机动车发票其他费用;8-意向金', trigger: 'change' }
        ],
        paymentType: [
          { required: true, message: '请选择支付方式 1010-微信;1020-支付宝;1030-POS刷卡;1040-银行转账;1050-按揭;1060-权益;1070-现金;1080-抖音支付', trigger: 'change' }
        ],
        paymentWay: [
          { required: true, message: '请输入支付渠道 1010-付呗;1020-直连', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
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
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        retailOrderId: [
          { required: true, message: '请输入零售订单ID', trigger: 'change' }
        ],
        retailOrderCode: [
          { required: true, message: '请输入零售订单号', trigger: 'change' }
        ],
        payerName: [
          { required: true, message: '请输入支付人', trigger: 'change' }
        ],
        payerPhone: [
          { required: true, message: '请输入支付人手机号', trigger: 'change' }
        ],
        rightsType: [
          { required: true, message: '请选择权益类型 0-金额类;1-实物类', trigger: 'change' }
        ],
        rightsItem: [
          { required: true, message: '请输入权益项名称', trigger: 'change' }
        ],
        rightsItemCode: [
          { required: true, message: '请输入权益项编号', trigger: 'change' }
        ],
        rightsGrantCode: [
          { required: true, message: '请输入权益核销券码', trigger: 'change' }
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
