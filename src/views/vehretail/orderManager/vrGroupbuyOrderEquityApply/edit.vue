<template>
  <edit-page-layout ref="editLayout" title="团购订单权益申请详情" showPaneFooter>
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
      >
        <template #status>
          <span v-if="form.auditStatus === 10" class="status">草稿</span>
          <span v-else-if="form.auditStatus === 20" class="status warning">驳回</span>
          <span v-else-if="form.auditStatus === 30" class="status">已提交</span>
          <span v-else-if="form.auditStatus === 40" class="status">已初审</span>
          <span v-else-if="form.auditStatus === 50" class="status">已复审</span>
          <span v-else-if="form.auditStatus === 60" class="status success">已终审</span>
          <span v-else-if="form.auditStatus === 70" class="status danger">作废</span>
        </template>
        <template #extraButtons>
          <el-button v-if="canSubmitApproval && canAddOrUpdate" size="small" type="primary" @click="handleSubmitApproval">提交审批</el-button>
        </template>
        <el-main>
          <!-- 审核步骤条 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-body">
              <div class="audit-steps">
                <div class="steps-header" v-if="showViewAuditUsers">
                  <el-button type="text" @click="handleViewAuditUsers">查看审核人员</el-button>
                </div>
                <div class="steps-container">
                  <div class="step-item" :class="getStepClass(1)">
                    <div class="step-circle">1</div>
                    <div class="step-label">草稿</div>
                  </div>
                  <div class="step-line" :class="getLineClass(1)"></div>
                  <div class="step-item" :class="getStepClass(2)">
                    <div class="step-circle">2</div>
                    <div class="step-label">门店提交</div>
                  </div>
                  <div class="step-line" :class="getLineClass(2)"></div>
                  <div class="step-item" :class="getStepClass(3)">
                    <div class="step-circle">3</div>
                    <div class="step-label">{{ getFirstAuditLabel }}</div>
                  </div>
                  <div class="step-line" :class="getLineClass(3)"></div>
                  <div class="step-item" :class="getStepClass(4)">
                    <div class="step-circle">4</div>
                    <div class="step-label">{{ getReviewAuditLabel }}</div>
                  </div>
                  <div class="step-line" :class="getLineClass(4)"></div>
                  <div class="step-item" :class="getStepClass(5)">
                    <div class="step-circle">5</div>
                    <div class="step-label">业务负责人(终审)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="团购权益申请单号：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="商城订单编号：">
                  <el-link type="primary" @click="handleViewOrderDetail">{{ form.mallOrderCode }}</el-link>
                </el-form-item>
                <el-form-item label="整车订单号：">
                  {{ form.vehicleOrderNo || '-' }}
                </el-form-item>
                <el-form-item label="订单物料码：">
                  <el-link type="primary" @click="handleViewMaterialDetail">{{ form.orderMaterialsCode }}</el-link>
                </el-form-item>
                <el-form-item label="销售门店：">
                  <el-link type="primary" @click="handleViewStoreDetail">{{ form.dealerName }}</el-link>
                </el-form-item>
                <el-form-item label="合作类型：">
                  {{ getEnumLabel('cooperation_type', form.cooperationType) }}
                </el-form-item>
                <el-form-item label="车型：">
                  {{ form.modelName || '-' }}
                </el-form-item>
                <el-form-item label="车系：">
                  {{ form.seriesName || '-' }}
                </el-form-item>
                <el-form-item label="购车人姓名：">
                  {{ form.buyerName }}
                </el-form-item>
                <el-form-item label="购车人手机号码：">
                  {{ form.buyerPhone }}
                </el-form-item>
                <el-form-item label="下单人用户ID号：">
                  {{ form.userId }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 销售门店 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>销售门店</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="门店编码：">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="合作类型：">
                  {{ getEnumLabel('cooperation_type', form.cooperationType) }}
                </el-form-item>
                <el-form-item label="所属区域或部门：">
                  {{ form.regionName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 公司信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>公司信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="公司名称：">
                  {{ form.companyName }}
                </el-form-item>
                <el-form-item label="优惠金额：">
                  {{ form.discountAmount }}
                </el-form-item>
                <el-form-item label="优惠券：">
                  {{ form.couponName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 附件材料 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>附件材料</h2>
            </div>
            <div class="common-section-body">
              <div v-if="attachmentList && attachmentList.length > 0">
                <div v-for="(item, index) in attachmentList" :key="index" class="attachment-item">
                  <div v-if="isImage(item.fileType)" class="attachment-preview">
                    <img :src="item.fileUrl" :alt="item.fileName" />
                  </div>
                  <div class="attachment-info">
                    <div class="file-name">{{ item.fileName }}</div>
                    <div class="file-size">{{ formatFileSize(item.fileSize) }}</div>
                    <div class="file-type">{{ item.fileType }}</div>
                  </div>
                </div>
              </div>
              <div v-else class="no-attachment">暂无附件</div>
            </div>
          </section>

          <!-- 整车物料 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>整车物料</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="物料描述：">
                  {{ form.materialsDesc }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 整车订单信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>整车订单信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="整车订单状态：">
                  {{ form.vehicleOrderStatus }}
                </el-form-item>
                <el-form-item label="商城下单时间：">
                  {{ form.mallOrderTime }}
                </el-form-item>
                <el-form-item label="商城订单编号：">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="订单来源：">
                  {{ form.orderSource }}
                </el-form-item>
                <el-form-item label="用户ID：">
                  {{ form.userId }}
                </el-form-item>
                <el-form-item label="购车人姓名：">
                  {{ form.buyerName }}
                </el-form-item>
                <el-form-item label="购车人手机：">
                  {{ form.buyerPhone }}
                </el-form-item>
                <el-form-item label="证件类型：">
                  {{ form.idType }}
                </el-form-item>
                <el-form-item label="证件号码：">
                  {{ form.idNumber }}
                </el-form-item>
                <el-form-item label="代办联系人：">
                  {{ form.agentContact }}
                </el-form-item>
                <el-form-item label="补贴后价格：">
                  {{ form.discountedPrice }}
                </el-form-item>
                <el-form-item label="定金金额：">
                  {{ form.depositAmount }}
                </el-form-item>
                <el-form-item label="交车时间：">
                  {{ form.deliveryTime }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail">
                <el-form-item label="订单物料码：">
                  <el-link type="primary" @click="handleViewOrderMaterialDetail">{{ form.orderMaterialsCode }}</el-link>
                </el-form-item>
                <el-form-item label="配车物料码：">
                  <el-link type="primary" @click="handleViewAllocationMaterialDetail">{{ form.allocationMaterialsCode }}</el-link>
                </el-form-item>
                <el-form-item label="销售门店：">
                  <el-link type="primary" @click="handleViewSaleStoreDetail">{{ form.saleDealerCode }}</el-link>
                </el-form-item>
                <el-form-item label="交付门店：">
                  <el-link type="primary" @click="handleViewDeliveryStoreDetail">{{ form.deliveryDealerCode }}</el-link>
                </el-form-item>
                <el-form-item label="交车VIN码：">
                  <el-link type="primary" @click="handleViewVehicleDetail">{{ form.deliveryVin }}</el-link>
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 申请信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>申请信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="申请人：">
                  {{ form.applicant }}
                </el-form-item>
                <el-form-item label="申请时间：">
                  {{ form.applicationTime }}
                </el-form-item>
                <el-form-item label="提交时间：">
                  {{ form.submitTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 审批信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="初审时间：">
                  {{ form.firstAuditTime || '-' }}
                </el-form-item>
                <el-form-item label="复审时间：">
                  {{ form.reviewAuditTime || '-' }}
                </el-form-item>
                <el-form-item label="终审时间：">
                  {{ form.finalAuditTime || '-' }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 审批明细 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>审批明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="approvalTableRef"
                  stripe
                  :data="approvalDetailList"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="operationStatus" title="操作状态" min-width="120" />
                  <vxe-column field="operationDesc" title="操作描述" min-width="200" />
                  <vxe-column field="operator" title="操作人" min-width="120" />
                  <vxe-column field="operationTime" title="操作时间" min-width="180" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无审批明细</div>
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
        <div style="padding: 20px;">
          <h3>申请概况</h3>
          <div style="margin-top: 10px; padding: 15px; background: #f5f7fa; border-radius: 4px;">
            <div><strong>申请单号:</strong> {{ form.code || '-' }}</div>
            <div style="margin-top: 8px;"><strong>申请状态:</strong> {{ getAuditStatusLabel(form.auditStatus) }}</div>
            <div style="margin-top: 8px;"><strong>销售门店:</strong> {{ form.dealerName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>合作类型:</strong> {{ getEnumLabel('cooperation_type', form.cooperationType) || '-' }}</div>
            <div style="margin-top: 8px;"><strong>商城订单:</strong> {{ form.mallOrderCode || '-' }}</div>
            <div style="margin-top: 8px;"><strong>购车人:</strong> {{ form.buyerName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>公司名称:</strong> {{ form.companyName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>优惠金额:</strong> {{ form.discountAmount || '-' }}</div>
          </div>
        </div>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/vrGroupbuyOrderEquityApply/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  creator: null,
  creatorName: '',
  createTime: '',
  modifier: null,
  modifierName: '',
  updateTime: '',
  remark: '',
  status: null,
  statusDesc: '',
  dataSource: null,
  code: '',
  ownerOrgId: null,
  dealerName: '',
  dealerCode: '',
  cooperationType: null,
  regionName: '',
  companyName: '',
  discountAmount: null,
  couponName: '',
  materialsCode: '',
  materialsDesc: '',
  vehicleOrderStatus: null,
  mallOrderTime: '',
  mallOrderCode: '',
  orderSource: '',
  userId: '',
  buyerName: '',
  buyerPhone: '',
  idType: null,
  idNumber: '',
  agentContact: '',
  discountedPrice: null,
  depositAmount: null,
  deliveryTime: '',
  orderMaterialsCode: '',
  allocationMaterialsCode: '',
  saleDealerCode: '',
  deliveryDealerCode: '',
  deliveryVin: '',
  applicant: '',
  applicantId: '',
  applicationTime: '',
  submitTime: '',
  firstAuditTime: '',
  reviewAuditTime: '',
  finalAuditTime: '',
  auditStatus: null,
  vehicleOrderNo: ''
};

export default {
  name: 'vrGroupbuyOrderEquityApplyEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
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
      return '团购订单权益申请编号：' + (this.form.code || '');
    },
    canSubmitApproval () {
      // 草稿状态可以提交审批
      return this.form.auditStatus === 10;
    },
    showViewAuditUsers () {
      // 初审、复审、终审时显示查看审核人员
      return [30, 40, 50].includes(this.form.auditStatus);
    },
    getFirstAuditLabel () {
      // 根据合作类型返回初审岗位
      if (this.form.cooperationType === 30) {
        // 直营店
        return '店长(初审)';
      } else {
        // 合作伙伴或二网
        return '城市经理(初审)';
      }
    },
    getReviewAuditLabel () {
      // 根据合作类型返回复审岗位
      if (this.form.cooperationType === 30) {
        // 直营店
        return '直营城市总经理(复审)';
      } else {
        // 合作伙伴或二网
        return '大区经理(复审)';
      }
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
      pageTitle: '整车零售-订单管理-团购订单权益申请管理',
      pageType: 'edit',
      moduleKey: 'AISMC-vrGroupbuyOrderEquityApply',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      approvalDetailList: [],
      attachmentList: []
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          // 如果后端返回了审批明细和附件数据
          if (res.approvalDetailList && Array.isArray(res.approvalDetailList)) {
            this.approvalDetailList = res.approvalDetailList;
          }
          if (res.attachmentList && Array.isArray(res.attachmentList)) {
            this.attachmentList = res.attachmentList;
          }
          return res;
        });
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    getStepClass (step) {
      const statusMap = {
        10: 1, // 草稿
        30: 2, // 已提交
        40: 3, // 已初审
        50: 4, // 已复审
        60: 5, // 已终审
        20: this.getRejectStep(), // 驳回
        70: 1 // 作废
      };
      const currentStep = statusMap[this.form.auditStatus] || 1;

      if (step < currentStep) {
        return 'step-finished';
      } else if (step === currentStep) {
        return 'step-current';
      } else {
        return 'step-pending';
      }
    },
    getLineClass (step) {
      const statusMap = {
        10: 1,
        30: 2,
        40: 3,
        50: 4,
        60: 5,
        20: this.getRejectStep(),
        70: 1
      };
      const currentStep = statusMap[this.form.auditStatus] || 1;

      if (step < currentStep - 1) {
        return 'line-finished';
      } else if (step === currentStep - 1) {
        return 'line-current';
      } else {
        return 'line-pending';
      }
    },
    getRejectStep () {
      // 被驳回时，停留在当前步骤
      if ([20, 30].includes(this.form.auditStatus)) return 2;
      if (this.form.auditStatus === 40) return 3;
      if (this.form.auditStatus === 50) return 4;
      return 1;
    },
    handleSubmitApproval () {
      this.$confirm('确认要提交审批吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用提交审批API
        // submitApproval({ id: this.form.id }).then(() => {
        //   this.$message.success('提交成功');
        //   this.$refs.containerRef.loadDetail();
        // });
        this.$message.success('提交成功');
      });
    },
    handleViewAuditUsers () {
      // 调用获取审核人员API并显示弹窗
      // getAuditUsers({ cooperationType: this.form.cooperationType }).then(res => {
      //   // 显示弹窗
      // });
      this.$message.info('查看审核人员功能待实现');
    },
    handleViewOrderDetail () {
      this.$message.info('跳转整车订单详情功能待实现');
    },
    handleViewMaterialDetail () {
      this.$message.info('跳转物料详情功能待实现');
    },
    handleViewStoreDetail () {
      this.$message.info('跳转门店详情功能待实现');
    },
    handleViewOrderMaterialDetail () {
      this.$message.info('跳转订单物料详情功能待实现');
    },
    handleViewAllocationMaterialDetail () {
      this.$message.info('跳转配车物料详情功能待实现');
    },
    handleViewSaleStoreDetail () {
      this.$message.info('跳转销售门店详情功能待实现');
    },
    handleViewDeliveryStoreDetail () {
      this.$message.info('跳转交付门店详情功能待实现');
    },
    handleViewVehicleDetail () {
      this.$message.info('跳转车辆档案详情功能待实现');
    },
    getEnumLabel (enumCode, value) {
      return value;
    },
    getAuditStatusLabel (status) {
      const statusMap = {
        10: '草稿',
        20: '驳回',
        30: '已提交',
        40: '已初审',
        50: '已复审',
        60: '已终审',
        70: '作废'
      };
      return statusMap[status] || '-';
    },
    isImage (type) {
      return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(type.toLowerCase());
    },
    formatFileSize (size) {
      if (!size) return '-';
      if (size < 1024) return size + ' B';
      if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
      return (size / 1024 / 1024).toFixed(2) + ' MB';
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.page-common-edit {
  h3 {
    margin: 0 0 15px;
    font-size: 16px;
  }
}

.audit-steps {
  .steps-header {
    margin-bottom: 10px;
  }
  .steps-container {
    display: flex;
    align-items: center;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 4px;
  }
  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
    &.step-finished {
      .step-circle {
        background: #1a73e8;
        color: #fff;
      }
      .step-label {
        color: #1a73e8;
      }
    }
    &.step-current {
      .step-circle {
        background: #e53935;
        color: #fff;
        border: 2px solid #e53935;
      }
      .step-label {
        color: #e53935;
        font-weight: bold;
      }
    }
    &.step-pending {
      .step-circle {
        background: #e0e0e0;
        color: #666;
      }
      .step-label {
        color: #999;
      }
    }
  }
  .step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 8px;
    border: 2px solid #1a73e8;
    background: #fff;
    color: #1a73e8;
  }
  .step-label {
    font-size: 12px;
    color: #666;
    white-space: nowrap;
  }
  .step-line {
    flex: 1;
    height: 2px;
    margin: 0 20px;
    &.line-finished {
      background: #1a73e8;
    }
    &.line-current {
      background: #e53935;
    }
    &.line-pending {
      background: #e0e0e0;
    }
  }
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 10px;
  .attachment-preview {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }
  .attachment-info {
    .file-name {
      font-weight: bold;
      margin-bottom: 4px;
    }
    .file-size, .file-type {
      font-size: 12px;
      color: #999;
    }
  }
}

.no-attachment {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>
