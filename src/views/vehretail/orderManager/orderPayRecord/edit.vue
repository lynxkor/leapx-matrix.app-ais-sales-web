<template>
  <edit-page-layout ref="editLayout" title="订单收款记录详情" showPaneFooter>
    <template #left>
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
        <!-- 根据 type 显示不同内容 -->
        <template #status>
        </template>

        <el-main>
          <!-- 基础信息通用部分 -->
          <section class="common-section" v-if="type === 'depositRefund' || type === 'all'">
            <div class="common-section-header">
              <h2>订单收款订单</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="整车订单：" prop="retailOrderCode">
                  <el-link v-if="form.retailOrderId" type="primary" :href="`/sales/vehretail/ordermanager/retailorderinfo/edit?id=${form.retailOrderId}`" target="_blank">{{ form.retailOrderCode }}</el-link><span v-else>{{ form.retailOrderCode }}</span>
                </el-form-item>
                <el-form-item label="门店：" prop="saleDealerName">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.saleDealerCode}`" target="_blank">{{ form.saleDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="交车单：" prop="deliveryNote">
                  {{ form.deliveryNote }}
                </el-form-item>
                <el-form-item label="负责人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="商城流水号：" prop="outTradeNo">
                  {{ form.outTradeNo }}
                </el-form-item>
                <el-form-item label="收款类型：" prop="payCategory">
                  {{ form.payCategoryLabel }}
                </el-form-item>
                <el-form-item label="付款金额：" prop="paymentAmount">
                  {{ form.paymentAmount }}
                </el-form-item>
                <el-form-item label="付款时间：" prop="paymentTime">
                  {{ form.paymentTime }}
                </el-form-item>
                <el-form-item label="支付方式：" prop="paymentType">
                  {{ form.paymentTypeLabel }}
                </el-form-item>
                <el-form-item label="支付人：" prop="payerName">
                  {{ form.payerName }}
                </el-form-item>
                <el-form-item label="支付渠道：" prop="paymentWay">
                  {{ form.paymentWayLabel }}
                </el-form-item>
                <el-form-item label="支付流水号：" prop="paySerialNumber">
                  {{ form.paySerialNumber }}
                </el-form-item>
                <el-form-item label="权益类型：" prop="rightsType">
                  {{ rightsTypeLabel }}
                </el-form-item>
                <el-form-item label="权益项名称：" prop="rightsItem">
                  {{ form.rightsItem }}
                </el-form-item>
                <el-form-item label="权益项编号：" prop="rightsItemCode">
                  {{ form.rightsItemCode }}
                </el-form-item>
                <el-form-item label="权益核销码：" prop="rightsGrantCode">
                  {{ form.rightsGrantCode }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 条件渲染：定金退款 -->
          <section v-if="type === 'depositRefund' || type === 'all'" class="common-section">
            <div class="common-section-header">
              <h2>退订信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="退订申请单：" prop="refundCode">
                  {{ form.refundCode }}
                </el-form-item>
                <el-form-item label="退款结果：" prop="refundResult">
                  {{ form.refundResult }}
                </el-form-item>
                <el-form-item label="退款日期：" prop="refundTime">
                  {{ form.refundTime }}
                </el-form-item>
                <el-form-item label="退款说明：" prop="refundRemark">
                  {{ form.refundRemark }}
                </el-form-item>
                <el-form-item label="取消核销同步结果：" prop="orderCancelReason">
                  {{ form.orderCancelReason }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 条件渲染：权益核销 -->
          <section v-if="type === 'benefitWriteOff' || type === 'all'" class="common-section">
            <div class="common-section-header">
              <h2>权益核销</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item v-if="type !== 'all'" label="交车单：" prop="deliveryNote">
                  {{ form.deliveryNote }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vin">
                  <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`" target="_blank">{{ form.vin }}</el-link>
                </el-form-item>
                <el-form-item v-if="type !== 'all'" label="收款类型：" prop="payCategory">
                  {{ form.payCategoryLabel }}
                </el-form-item>
                <el-form-item v-if="type !== 'all'" label="权益类型：" prop="rightsType">
                  {{ rightsTypeLabel }}
                </el-form-item>
                <el-form-item v-if="type !== 'all'" label="付款金额：" prop="paymentAmount">
                  {{ form.paymentAmount }}
                </el-form-item>
                <el-form-item v-if="type !== 'all'" label="权益项名称：" prop="rightsItem">
                  {{ form.rightsItem }}
                </el-form-item>
                <el-form-item v-if="type !== 'all'" label="付款时间：" prop="paymentTime">
                  {{ form.paymentTime }}
                </el-form-item>
                <el-form-item v-if="type !== 'all'" label="权益项编号：" prop="rightsItemCode">
                  {{ form.rightsItemCode }}
                </el-form-item>
                <el-form-item label="收款编号：" prop="payCode">
                  {{ form.payCode }}
                </el-form-item>
                <el-form-item v-if="type !== 'all'" label="整车订单：" prop="retailOrderCode">
                  <el-link v-if="form.retailOrderId" type="primary" :href="`/sales/vehretail/ordermanager/retailorderinfo/edit?id=${form.retailOrderId}`" target="_blank">{{ form.retailOrderCode }}</el-link><span v-else>{{ form.retailOrderCode }}</span>
                </el-form-item>
                <el-form-item v-if="type !== 'all'" label="门店：" prop="saleDealerName">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.saleDealerCode}`" target="_blank">{{ form.saleDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="所属母公司：" prop="parentCompany">
                  {{ form.parentCompany }}
                </el-form-item>
                <el-form-item label="交车时间：" prop="deliveryTime">
                  {{ form.deliveryTime }}
                </el-form-item>
                <el-form-item label="交车状态：" prop="deliveryStatusLabel">
                  <span class="status-tag link">{{ form.deliveryStatusLabel }}</span>
                </el-form-item>
                <el-form-item label="缴定金时间：" prop="fundPaymentTime">
                  {{ form.fundPaymentTime }}
                </el-form-item>
                <el-form-item label="商城订单编号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item v-if="type !== 'all'" label="备注：" prop="remark">
                  {{ form.remark }}
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
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/orderPayRecord/index';
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
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '订单收款：' + this.form.id;
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
      pageTitle: '订单收款记录',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-retailOrderPayRecord',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      type: this.$route.query.type || 'depositRefund',
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
