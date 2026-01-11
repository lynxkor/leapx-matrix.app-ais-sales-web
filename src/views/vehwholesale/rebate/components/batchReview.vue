<template>
  <div>
  <el-dialog
    class="batchReview-dialog"
    title=""
    width="800px"
    :visible.sync="dialogVisible"
    @close="reviewClose"
  >
    <el-form ref="SelectformRef" :model="Selectform"  :label-width="formLabelWidth">
      <el-form-item label="复审结果：" prop="passOrReject">
         <el-select v-model="Selectform.passOrReject" placeholder="请选择" clearable style="width: 100%">
            <el-option label="通过" value='1'/>
            <el-option label="驳回" value='0' />
         </el-select>
      </el-form-item>
      <el-form-item label="复审意见：" prop="opinion">
        <el-input v-model="Selectform.opinion" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer" style="text-align: center;">
        <el-button :loading="submitLoading" type="primary" @click="submit()">确 定</el-button>
        <el-button @click="reviewClose()">取 消</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    class="filter-batchReview-dialog"
    title=""
    width="800px"
    :visible.sync="filterDialogVisible"
    @close="close"
  >
    <el-form ref="filterReviewformRef" :model="filterReviewform"  :label-width="formLabelWidth">
      <el-form-item label="单据状态">
          <el-input type="text" v-model="billStatus" placeholder="请选择" style="width: 100%" disabled=""/>
      </el-form-item>
         <el-form-item label="返利类型" prop="rebateTypes">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_rebate_type"
            v-model="filterReviewform.rebateTypes"
            placeholder="请选择"
            clearable
            filterable
          />
      </el-form-item>
      <el-form-item label="初审日期" prop="auditTime" >
          <el-date-picker style="width: 100%;"
           :default-time="['00:00:00', '23:59:59']"
            v-model="filterReviewform.auditTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      <el-form-item label="业务单据号" prop="bizOrderNo">
        <el-input v-model="filterReviewform.bizOrderNo" autocomplete="off" />
      </el-form-item>
       <el-form-item label="预算科目" prop="budgetItemIds">
         <fetch-select
          filterable
          clearable
          remote
          v-model="filterReviewform.budgetItemIds"
          :remote-method="getFundBudgetItemList"
          value-key="id"
          label-key="name"
      />
      </el-form-item>
      <el-form-item label="创建人" prop="creatorName">
        <el-input v-model="filterReviewform.creatorName" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer" style="text-align: center;">
        <el-button :loading="submitLoading" type="primary" @click="reviewApp()">复审通过</el-button>
        <el-button :loading="submitLoading"  @click="reviewRej()">复审驳回</el-button>
      </div>
    </template>
  </el-dialog>

   <el-dialog
    class="audit-total-dialog"
    title=""
    width="800px"
    :visible.sync="totalDialogVisible"
    @close="reviewAppClose"
  >
    <el-form ref="reviewAllformRef" :model="reviewAllform"  :label-width="formLabelWidth">
      <p>本次复审记录数： {{ reviewNum }}, 合计核销金额：{{ reviewCount }}</p>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer" style="text-align: center;">
        <el-button :loading="submitLoading" type="primary" @click="reviewAppSure()">复审确认</el-button>
        <el-button :loading="submitLoading"  @click="reviewAppClose()">取消</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    class="review-reject-dialog"
    title=""
    width="800px"
    :visible.sync="reviewRejectlogVisible"
    @close="reviewRejectClose"
  >
   <el-form ref="rejectformRef" :model="reviewRjectform"  :label-width="formLabelWidth">
      <el-form-item label="复审结果：">
        <el-input v-model="rejectPassOrReject" autocomplete="off" disabled=""/>
      </el-form-item>
      <el-form-item label="复审意见：" prop="opinion">
        <el-input v-model="reviewRjectform.opinion" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer" style="text-align: center;">
        <el-button :loading="submitLoading" type="primary" @click="reviewRejectSubmit()">确 定</el-button>
        <el-button @click="reviewRejectClose()">取 消</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { listIdNames as fundBudgetItemList } from '@/api/vehwholesale/fund/fundBudgetItem/index';
import { statTotalRebate, reviewItem } from '@/api/vehwholesale/rebate/fundVehicleRebateBillDetail/index';
export default {
  name: 'BatchReviewDialog',
  props: {
    batchReviewVisible: {
      type: Boolean,
      default: false
    },
    filterBatchReviewVisible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    FetchSelect
  },
  data () {
    return {
      dialogVisible: this.batchReviewVisible,
      filterDialogVisible: this.filterBatchReviewVisible,
      totalDialogVisible: false,
      reviewRejectlogVisible: false,
      rejectPassOrReject: '驳回',
      reviewNum: 0,
      reviewCount: 0,
      billStatus: '已初审',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      Selectform: {
        opinion: '',
        passOrReject: '',
      },
      reviewRjectform: {
        opinion: '',
        passOrReject: 0
      },
      filterReviewform: {
        billStatus: 1040
      },
      reviewAllform: {},
      submitLoading: false,
      formLabelWidth: '120px',
      selectIds: ''
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        Object.keys(this.form).forEach(key => {
          this.form[key] = this.info[key];
        });
      }
    }
  },
  methods: {
    async getFundBudgetItemList (params) {
      return fundBudgetItemList({ budgetItemNameLike: params });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    showOrHide (type, ids) {
      this.selectIds = ids;
      if (type === 'isSelect') {
        this.dialogVisible = true;
      } else {
        this.filterDialogVisible = true;
      }
    },
    reviewClose () {
      this.$refs.SelectformRef.resetFields();
      this.dialogVisible = false;
    },
    close () {
      this.dialogVisible = false;
      this.$refs.filterReviewformRef.resetFields();
      this.filterReviewform.rebateTypes = [];
      this.filterReviewform.budgetItemIds = [];
    },
    rejectClose () {
      this.reviewRejectlogVisible = false;
      this.$refs.reviewAllformRef.resetFields();
    },
    reviewRejectClose () {
      this.reviewRejectlogVisible = false;
      this.$refs.rejectformRef.resetFields();
    },
    getFormData (val) {
      const data = { ...val };
      Object.keys(val).forEach(key => {
        if (data[key] === '' || data[key] === null || (typeof data[key] === 'object' && Object.keys(data[key]).length === 0)) {
          delete data[key];
        }
      });
      if (val.auditTime) {
        delete data.auditTime;
        if (val.auditTime.length > 1) {
          data.auditTimeStart = val.auditTime[0];
          data.auditTimeEnd = val.auditTime[1];
        }
      }
      return data;
    },
    reviewApp () {
      this.totalDialogVisible = true;
      statTotalRebate({ ...this.getFormData(this.filterReviewform) }).then(res => {
        this.reviewNum = res.qty;
        this.reviewCount = res.totalRebateAmount;
      }).catch(() => {});
    },
    reviewAppClose () {
      this.totalDialogVisible = false;
    },
    reviewAppSure () {
      let approveParams = { ...this.getFormData(this.filterReviewform) };
      approveParams.passOrReject = 1;
      reviewItem(approveParams).then(res => {
        this.totalDialogVisible = false;
        this.filterDialogVisible = false;
        this.$emit('callReviewParentMethod');
        this.$message.success('批量通过成功');
      }).catch(() => {});
    },
    reviewRej () {
      this.reviewRejectlogVisible = true;
      // this.filterDialogVisible = false;
      // let approveParams = { ...this.filterReviewform };
      // approveParams.passOrReject = 1;
      // reviewItem(approveParams).then(res => {
      //   this.$message.success('批量通过成功');
      // }).catch(() => {});
    },
    reviewRejectSubmit () {
      let rejectParams = { ...this.filterReviewform, ...this.reviewRjectform };
      // rejectParams.passOrReject = 0;
      if (rejectParams.opinion === undefined || rejectParams.opinion === '' || rejectParams.opinion.length === 0) {
        this.$message({
          type: 'warning',
          message: '复审意见必填!'
        });
      } else if (rejectParams.opinion && rejectParams.opinion.length > 0) {
        reviewItem(rejectParams).then(res => {
          this.$message.success('批量通过成功');
          this.reviewRejectlogVisible = false;
        }).catch(() => {});
      }
    },
    submit () {
      let params = {
        ids: this.selectIds,
        opinion: this.Selectform.opinion,
        passOrReject: this.Selectform.passOrReject
      };
      if (params.passOrReject === '1') {
        reviewItem(params).then(res => {
          this.$message.success('批量通过成功');
          this.dialogVisible = false;
          this.$emit('callReviewParentMethod');
        }).catch(() => {});
      } else if (params.passOrReject === '0') {
        if (params.opinion.length === 0) {
          this.$message({
            type: 'warning',
            message: '复审意见必填!'
          });
        } else {
          reviewItem(params).then(res => {
            this.$message.success('批量驳回成功');
            this.dialogVisible = false;
            this.$emit('callReviewParentMethod');
          }).catch(() => {});
        }
      }
    }
  }
};
</script>

<style lang="scss">
.batchReview-dialog {
  .el-input-number {
    width: 100%;
  }
}
</style>
