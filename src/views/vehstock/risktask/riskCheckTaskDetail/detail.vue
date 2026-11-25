<template>
  <div class="page-common-detail m-risk-check-task-detail-info" v-loading="loading">
    <section class="common-title">
      <h2>排查任务明细详情</h2>
      <div class="title-actions">
        <!-- 审核日志：平台公共能力（$auditLog），recordId = 排查明细主键（本页 $route.query.id） -->
        <el-button v-if="canLog" size="small" @click="handleJumpAuditLog">审核日志</el-button>
        <el-button size="small" @click="goBack">返回</el-button>
      </div>
    </section>

    <!-- 车辆信息：原「任务与车辆」+「门店与库存」合并为同一分组，字段全部来自
         VehicleRiskCheckTaskDetailResp；*Label 由后端 @DictEnumType 动态生成，禁止手写 Label 字段 -->
    <section class="common-section">
      <div class="common-section-header">
        <h2>车辆信息</h2>
      </div>
      <div class="common-section-body">
        <el-form :inline="true">
          <el-form-item label="任务编码：">
            <!-- 跳任务详情：id 取 checkTaskId（任务主键），与列表页/审核页四处跳转写法一致 -->
            <el-link v-if="detail.checkTaskId" type="primary" @click="goTaskDetail">{{ detail.checkTaskCode || '-' }}</el-link>
            <span v-else>{{ detail.checkTaskCode || '-' }}</span>
          </el-form-item>
          <el-form-item label="VIN：">{{ detail.vin || '-' }}</el-form-item>
          <el-form-item label="车辆类型：">{{ detail.vehicleTypeLabel || '-' }}</el-form-item>
          <el-form-item label="车系：">{{ detail.seriesName || '-' }}</el-form-item>
          <el-form-item label="车型：">{{ detail.modelName || '-' }}</el-form-item>
          <el-form-item label="年款：">{{ detail.yearTypeName || '-' }}</el-form-item>
          <el-form-item label="外观：">{{ detail.exteriorName || '-' }}</el-form-item>
          <el-form-item label="内饰：">{{ detail.interiorName || '-' }}</el-form-item>
          <el-form-item label="物料编码：">{{ detail.materialsCode || '-' }}</el-form-item>
          <el-form-item label="销售门店：">{{ detail.saleDealerName || '-' }}</el-form-item>
          <el-form-item label="交付门店：">{{ detail.deliveryDealerName || '-' }}</el-form-item>
          <el-form-item label="车辆库存状态：">{{ detail.vehicleStatusLabel || detail.vehicleStatus || '-' }}</el-form-item>
          <!-- 是否匹配订单来自门店库存台账 lock_status，后端 @DictEnumType(BooleanEnum) 下发 bindRetailOrderLabel -->
          <el-form-item label="是否匹配订单：">{{ detail.bindRetailOrderLabel || '-' }}</el-form-item>
          <!-- 物料描述内容较长，置于车辆库存状态之后并独占一行，避免挤压后续字段 -->
          <el-form-item label="物料描述：" class="form-item-full">{{ detail.materialsDesc || '-' }}</el-form-item>
        </el-form>
      </div>
    </section>

    <section class="common-section">
      <div class="common-section-header">
        <h2>排查状态</h2>
      </div>
      <div class="common-section-body">
        <el-form :inline="true">
          <el-form-item label="排查状态：">{{ detail.checkStatusLabel || '-' }}</el-form-item>
          <el-form-item label="锁定状态：">{{ detail.lockStatusLabel || '-' }}</el-form-item>
          <el-form-item label="锁定时间：">{{ detail.lockTime || '-' }}</el-form-item>
          <el-form-item label="排查时间：">{{ detail.checkTime || '-' }}</el-form-item>
          <!-- 审核说明在审核记录表 audit_opinion，由后端 get 接口按 任务ID + VIN 补查回显 -->
          <el-form-item label="审核说明：" class="form-item-full">{{ detail.auditOpinion || '-' }}</el-form-item>
        </el-form>
      </div>
    </section>

    <section class="common-section">
      <div class="common-section-header">
        <h2>排查结果</h2>
      </div>
      <div class="common-section-body">
        <el-form :inline="true">
          <!-- 排查方法在主任务表 check_method，由后端 get 接口补查回显 -->
          <el-form-item label="排查方法：" class="form-item-full">{{ detail.checkMethod || '-' }}</el-form-item>
          <el-form-item label="排查说明：" class="form-item-full">{{ detail.checkResultNote || '-' }}</el-form-item>
        </el-form>
      </div>
    </section>

    <section class="common-section">
      <div class="common-section-header">
        <h2>排查附件</h2>
      </div>
      <div class="common-section-body">
        <!-- 🔑 businessId = 排查明细ID；attachType 与门店 H5 落库口径一致
             （风险排查附件统一标识 vehicle_risk_task，configCode 与 attachType 同值）。
             🔑 本页只读回显，不传 configCode：组件只按 businessId + attachType 加载文件 -->
        <AisAttachment
          v-if="detail.id"
          :businessId="detail.id"
          attachType="vehicle_risk_task"
          :readonly="true"
          emptyText="暂无附件"
        />
        <span v-else>暂无附件</span>
      </div>
    </section>
  </div>
</template>

<script>
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import permissions from '@/libs/mixins/permissions';
import { getDetailInfo } from '@/api/vehstock/risktask/riskCheckTaskDetail/index';

const EMPTY_DETAIL = {
  id: '',
  checkTaskId: '',
  checkTaskCode: '',
  vin: '',
  vehicleType: '',
  vehicleTypeLabel: '',
  seriesName: '',
  modelName: '',
  yearTypeName: '',
  exteriorName: '',
  interiorName: '',
  materialsCode: '',
  materialsDesc: '',
  saleDealerName: '',
  deliveryDealerName: '',
  vehicleStatus: '',
  vehicleStatusLabel: '',
  bindRetailOrder: '',
  bindRetailOrderLabel: '',
  checkStatus: '',
  checkStatusLabel: '',
  lockStatus: '',
  lockStatusLabel: '',
  lockTime: '',
  checkTime: '',
  checkMethod: '',
  checkResultNote: '',
  auditOpinion: ''
};

export default {
  // canLog 来自 permissions mixin：permissions.has(moduleKey + '-auditLog')
  mixins: [permissions],
  components: {
    AisAttachment
  },
  data () {
    return {
      pageTitle: '排查任务明细',
      pageType: 'detail',
      moduleKey: 'AISVS-riskCheckTaskDetail',
      loading: false,
      detail: { ...EMPTY_DETAIL }
    };
  },
  created () {
    // 🔑 首级文案与列表页 pageTitle 对齐；点击首级回跳由路由父级路径决定
    //    （AisPageTitle.handleClick 写死去路径末段，详情页必须挂列表路径下）
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['排查任务明细', '详情']);
    this.getData();
  },
  methods: {
    // 审核日志：平台弹窗按 recordId 查询 Canal 采集的业务表字段变更记录
    handleJumpAuditLog () {
      this.$auditLog.show({ id: this.$route.query.id });
    },
    getData () {
      const id = this.$route.query.id;
      if (!id) {
        this.$message.error('缺少排查车辆明细ID');
        return;
      }
      this.loading = true;
      getDetailInfo({ id })
        .then(res => {
          this.detail = { ...EMPTY_DETAIL, ...(res || {}) };
        })
        .catch(err => {
          console.error('排查任务明细详情查询失败:', err);
          this.$message.error('查询失败');
          this.detail = { ...EMPTY_DETAIL };
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 任务编码跳任务详情：id 取 checkTaskId（任务主键），不是明细 id；带 isEditing=false
    goTaskDetail () {
      this.$router.push({
        path: '/vehstock/risktask/riskCheckTask/edit',
        query: { id: this.detail.checkTaskId, isEditing: false }
      });
    },
    goBack () {
      this.$router.push({ path: '/vehstock/risktask/riskCheckTaskDetail' });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-risk-check-task-detail-info {
  // 标题区右侧按钮组：.common-title 是 flex + space-between，按钮须包一层作为单个 flex item
  // element-ui 的 .el-button + .el-button 自带 10px 左边距，无需额外 gap
  .title-actions {
    display: flex;
    align-items: center;
  }

  // 长文本字段（排查方法 / 排查说明 / 审核说明）独占一行；.page-common-detail 已提供 form-item-full{width:100%}
  // 🔑 content 是 el-form-item 内部节点，scoped 需 ::v-deep 才能命中
  ::v-deep .el-form-item.form-item-full .el-form-item__content {
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>
