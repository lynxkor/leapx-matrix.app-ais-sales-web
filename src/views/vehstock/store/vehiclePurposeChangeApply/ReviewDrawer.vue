<template>
    <div>
        <el-drawer
            :visible.sync="drawer"
            @close="handleClose"
        >
            <div style="margin-left: 12px;">
                <h1>审核记录</h1>
            </div>
            <div class="common-section-body">
              <div v-if="loadingReview" class="loading">
                正在加载审核记录...
              </div>
              <div v-else-if="!reviewData.length" class="no-data">
                暂无审核记录
              </div>
              <div v-else class="logistics-container">

                <!-- 审核记录节点 -->
                <el-timeline>
                  <el-timeline-item
                    v-for="(item, index) in reviewData"
                    :key="index"
                    :color="'#009100'"
                    :type="'info'"
                  >
                    <div class="timeline-content">
                      <strong>{{ item.name }}</strong>
                      <div class="timeline-content-title">{{item.creatorName}} {{ item.submitOn }}</div>
                      <div class="timeline-content-title">备注：{{ item.remark }}</div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { approvalRecordPage } from '@/api/common';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    drawerData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.drawer = val;
      }
    },
    drawerData (val) {
      if (val) {
        this.getApprovalInfo();
      }
    }
  },
  data () {
    return {
      drawer: false,
      reviewData: [],
      loadingReview: false, // 审核记录加载状态
    };
  },
  methods: {
    // 关闭抽屉
    handleClose () {
      this.$emit('update:visible', false);
    },
    // 审核记录分页查询接口
    async getApprovalInfo () {
      this.loadingReview = true;
      const params = {
        businessId: this.drawerData.id,
        pageNum: 1,
        pageSize: 50,
      };
      try {
        const res = await approvalRecordPage(params);
        this.reviewData = res.records || [];
      } catch (error) {
        console.error('获取审核记录失败:', error);
      } finally {
        this.loadingReview = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.common-section-body {
    margin-left: 16px;
}

.logistics-container {
  margin: 16px 0 0 16px;
}

.logistics-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
}

.label {
  font-weight: bold;
  color: #333;
}

.value {
  color: #666;
}

.timeline-content {
  strong {
    display: block;
    margin-bottom: 4px;
    color: #009100;
  }
  .timeline-content-title {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
  }
}

</style>
