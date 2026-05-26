<template>
  <div>
  <el-dialog
    class="filter-batchReview-dialog"
    title="筛选复审数据"
    width="800px"
    :visible.sync="filterDialogVisible"
    @close="close"
  >
   <h3>筛选复审结果</h3>
    <el-form ref="filterReviewformRef" :model="filterReviewform"  :label-width="formLabelWidth">
      <el-form-item label="单据状态">
          <el-input type="text" v-model="billStatus" placeholder="请选择" style="width: 100%" disabled=""/>
      </el-form-item>
         <el-form-item label="返利类型" prop="rebateType">
          <fetch-select
            style="width: 100%"
            :request="fetchOptions"
            enumCode="vw_rebate_type"
            v-model="filterReviewform.rebateType"
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
            unlink-panels
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
       <el-form-item label="预算科目" prop="budgetItemId">
         <fetch-select
          filterable
          style="width: 100%"
          clearable
          remote
          v-model="filterReviewform.budgetItemId"
          :remote-method="getFundBudgetItemList"
          value-key="id"
          label-key="name"
      />
      </el-form-item>
      <el-form-item label="创建人" prop="creatorName">
        <el-input v-model="filterReviewform.creatorName" autocomplete="off" />
      </el-form-item>
       <el-form-item label-width="40px" v-show="filterResult">
        <div class="filter-result-container">
          <span class="result-text">{{ filterResult }}</span>
          <el-button
            type="text"
            size="small"
            @click="reviewApp()"
            class="refresh-btn"
            v-if="filterResult"
          >
            <i class="el-icon-refresh"></i>
          </el-button>
        </div>
      </el-form-item>
    </el-form>
      <h3>复审结果</h3>
     <el-form ref="reviewformRef" :model="reviewform"  :label-width="formLabelWidth" :rules="resultRules">
      <el-form-item label="复审结果" prop="passOrReject">
         <el-radio-group v-model="reviewform.passOrReject" @change="handleRadioChange">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="0">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
         :prop="reviewform.passOrReject === 0 ? 'opinion' : ''"
      >
        <template #label>
          <span v-html="reviewform.passOrReject === 0 ? '<span style=\'color: red\'>*</span> 初审意见' : '初审意见'"></span>
        </template>
        <el-input
          v-model="reviewform.opinion"
          :rows="4"
          placeholder="复审意见"
          type="textarea"
        />
      </el-form-item>
    </el-form>

    <template v-slot:footer>
      <div class="dialog-footer" >
        <el-button :loading="submitLoading"  @click="close()">取消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="reviewConfirm()">确认</el-button>
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
      reviewRejectlogVisible: false,
      rejectPassOrReject: '驳回',
      billStatus: '已初审',
      filterResult: '',
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
      reviewform: {
        opinion: '',
        passOrReject: ''
      },
      Selectform: {
        opinion: '',
        passOrReject: '',
      },
      filterReviewform: {
        billStatus: 1040,
        rebateTyp: '',
        auditTime: [],
        bizOrderNo: '',
        budgetItemId: '',
        creatorName: ''
      },
      resultRules: {
        passOrReject: [
          { required: true, message: '请选择复审结果', trigger: 'blur' }
        ],
        opinion: [
          {
            validator: (rule, value, callback) => {
              if (this.reviewform.passOrReject === 0) {
                if (!value || value.trim() === '') {
                  callback(new Error('复审意见为必填项'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: ['blur', 'change']
          }
        ]
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
    handleRadioChange (value) {
      if (value === 1) {
        this.$refs.reviewformRef.clearValidate('opinion');
        this.reviewApp();
      } else if (value === 0) {
        this.filterResult = '';
        this.$refs.reviewformRef.validateField('opinion');
      }
    },
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
      this.filterDialogVisible = false;
      this.$refs.filterReviewformRef.resetFields();
      this.filterReviewform.rebateType = '';
      this.filterReviewform.budgetItemId = '';
      this.$refs.reviewformRef.resetFields();
      this.filterResult = '';
      this.reviewform.opinion = '';
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
      statTotalRebate({ ...this.getFormData(this.filterReviewform) }).then(res => {
        this.filterResult = `筛选复审记录数：${res.qty}, 合计核销金额：${res.totalRebateAmount}`;
      }).catch(() => {});
    },
    reviewRej () {
      this.reviewRejectlogVisible = true;
      // this.filterDialogVisible = false;
      // let approveParams = { ...this.filterReviewform };
      // approveParams.passOrReject = 1;
      // reviewItem(approveParams).then(res => {
      //   this.$message.success(复审成功');
      // }).catch(() => {});
    },
    reviewConfirm () {
      this.$refs.reviewformRef.validate((valid) => {
        if (valid) {
          let params = { ...this.filterReviewform, ...this.reviewform };
          reviewItem({ ...this.getFormData(params) }).then(res => {
            this.$message.success('批量复审成功');
            this.close();
            this.$emit('callParentMethod');
          }).catch(() => {});
        } else {
          this.$message.error('请完成必填项填写！');
          return false;
        }
      });
    },
    submit () {
      let params = {
        ids: this.selectIds,
        opinion: this.Selectform.opinion,
        passOrReject: this.Selectform.passOrReject
      };
      if (params.passOrReject === '1') {
        reviewItem(params).then(res => {
          this.$message.success('批量复审成功');
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

<style lang="scss" scoped>
.filter-batchReview-dialog {
  ::v-deep {
    .el-dialog__body {
      max-height: 560px;
      overflow-y: auto;
    }
    .el-form-item {
      margin-bottom: 10px;
      .el-input__inner,
      .el-select__inner {
        height: 32px;
        line-height: 32px;
      }
      .el-textarea__inner {
        min-height: 32px !important;
        height: 32px;
      }
    }
    .el-date-editor {
      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .el-input-number {
    width: 100%;
  }
}
.filter-result-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--leap-color-default-light-5);
  border: 1px dashed var(--leap-color-default-light-3);
  border-radius: 4px;
}

.result-text {
  font-size: 14px;
  color: var(--leap-color-default-light-1);
  line-height: 1.5;
}

.refresh-btn {
  padding: 0;
  margin-left: 10px;
  color: var(--leap-color-primary);
  cursor: pointer;
  &:hover {
    color: var(--leap-color-primary-light-3);
  }
}
</style>
