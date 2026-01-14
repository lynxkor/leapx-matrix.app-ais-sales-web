<template>
  <div>
  <el-dialog
    class="batchAudit-dialog"
    title=""
    width="800px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <el-form ref="SelectformRef" :model="Selectform"  :label-width="formLabelWidth">
      <el-form-item label="初审结果：" prop="passOrReject">
         <el-select v-model="Selectform.passOrReject" placeholder="请选择" clearable style="width: 100%">
            <el-option label="通过" value='1'/>
            <el-option label="驳回" value='0' />
         </el-select>
      </el-form-item>
      <el-form-item label="初审意见：" prop="opinion">
        <el-input v-model="Selectform.opinion" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer" style="text-align: center;">
        <el-button :loading="submitLoading" type="primary" @click="submit()">确 定</el-button>
        <el-button @click="close()">取 消</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    class="filter-batchAudit-dialog"
    title=""
    width="800px"
    :visible.sync="filterDialogVisible"
    @close="filterClose"
  >
    <el-form ref="filterFormRef" :model="filterForm"  :label-width="formLabelWidth">
      <el-form-item label="单据状态">
        <el-input v-model="billStatus" placeholder="单据状态" style="width: 100%" disabled/>
      </el-form-item >
         <el-form-item label="返利类型" prop="rebateType" >
          <fetch-select
            style="width: 100%"
            :request="fetchOptions"
            enumCode="vw_rebate_type"
            v-model="filterForm.rebateType"
            placeholder="请选择"
            clearable
            filterable
          />
      </el-form-item>
      <el-form-item label="创建日期" prop="createTime" >
          <el-date-picker style="width: 100%;"
           :default-time="['00:00:00', '23:59:59']"
            v-model="filterForm.createTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      <el-form-item label="业务单据号" prop="bizOrderNo">
        <el-input v-model="filterForm.bizOrderNo" autocomplete="off" />
      </el-form-item>
       <el-form-item label="预算科目" prop="budgetItemIds">
         <fetch-select
          style="width: 100%"
          filterable
          clearable
          remote
          v-model="filterForm.budgetItemId"
          :remote-method="getFundBudgetItemList"
          value-key="id"
          label-key="name"
      />
      </el-form-item>
      <el-form-item label="创建人" prop="creatorName">
        <el-input v-model="filterForm.creatorName" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer" style="text-align: center;">
        <el-button :loading="submitLoading" type="primary" @click="AuditApp()">初审通过</el-button>
        <el-button :loading="submitLoading"  @click="AuditRej()">初审驳回</el-button>
      </div>
    </template>
  </el-dialog>

   <el-dialog
    class="audit-total-dialog"
    title=""
    width="800px"
    :visible.sync="totalDialogVisible"
    @close="AuditAppClose"
  >
    <el-form ref="Allform" :model="Allform"  :label-width="formLabelWidth">
      <p>本次初审记录数： {{ auditNum }}, 合计核销金额：{{ auditCount }}</p>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer" style="text-align: center;">
        <el-button :loading="submitLoading" type="primary" @click="AuditAppSure()">初审确认</el-button>
        <el-button :loading="submitLoading"  @click="AuditAppClose()">取消</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    class="audit-reject-dialog"
    title=""
    width="800px"
    :visible.sync="rejectlogVisible"
    @close="rejectClose"
  >
   <el-form ref="rejectformRef" :model="rejectform"  :label-width="formLabelWidth">
      <el-form-item label="初审结果：">
        <el-input v-model="rejectPassOrReject" autocomplete="off" disabled=""/>
      </el-form-item>
      <el-form-item label="初审意见：" prop="opinion">
        <el-input v-model="rejectform.opinion" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer" style="text-align: center;">
        <el-button :loading="submitLoading" type="primary" @click="rejectSubmit()">确 定</el-button>
        <el-button @click="rejectClose()">取 消</el-button>
      </div>
    </template>
  </el-dialog>

  </div>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { listIdNames as fundBudgetItemList } from '@/api/vehwholesale/fund/fundBudgetItem/index';
import { statTotalRebate, auditItem } from '@/api/vehwholesale/rebate/fundVehicleRebateBillDetail/index';
export default {
  name: 'BatchAuditDialog',
  props: {
    batchAuditVisible: {
      type: Boolean,
      default: false
    },
    filterBatchAuditVisible: {
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
      dialogVisible: this.batchAuditVisible,
      filterDialogVisible: this.filterBatchAuditVisible,
      totalDialogVisible: false,
      rejectlogVisible: false,
      auditNum: 0,
      auditCount: 0,
      billStatus: '待审核',
      rejectPassOrReject: '驳回',
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
      filterForm: {
        creatorName: '',
        billStatus: 1020,
        createTime: [],
        budgetItemId: '',
        bizOrderNo: '',
        rebateType: ''
      },
      rejectform: {
        opinion: '',
        passOrReject: 0,
      },
      Allform: {},
      submitLoading: false,
      formLabelWidth: '120px',
      selectIds: ''
    };
  },
  watch: {
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
    filterClose () {
      this.filterDialogVisible = false;
      this.$refs.filterFormRef.resetFields();
      this.filterForm.rebateType = '';
      this.filterForm.budgetItemId = '';
    },
    close () {
      this.dialogVisible = false;
      this.$refs.SelectformRef.resetFields();
    },
    rejectClose () {
      this.$refs.rejectformRef.resetFields();
      this.rejectlogVisible = false;
    },
    getFormData (val) {
      const data = { ...val };
      Object.keys(val).forEach(key => {
        if (data[key] === '' || data[key] === null || (typeof data[key] === 'object' && Object.keys(data[key]).length === 0)) {
          delete data[key];
        }
      });
      if (val.createTime) {
        delete data.createTime;
        if (val.createTime.length > 1) {
          data.createTimeStart = val.createTime[0];
          data.createTimeEnd = val.createTime[1];
        }
      }
      return data;
    },
    rejectSubmit () {
      let rejectParams = { ...this.filterForm, ...this.rejectform };
      // rejectParams.passOrReject = 0;
      auditItem({ ...this.getFormData(rejectParams) }).then(res => {
        this.$message.success('批量初审成功');
        this.filterDialogVisible = false;
        this.rejectlogVisible = false;
      }).catch(() => {});
    },
    AuditApp () {
      statTotalRebate({ ...this.getFormData(this.filterForm) }).then(res => {
        this.auditNum = res.qty;
        this.auditCount = res.totalRebateAmount;
        this.totalDialogVisible = true;
      }).catch(() => {});
    },
    AuditAppClose () {
      this.totalDialogVisible = false;
    },
    AuditAppSure () {
      this.filterForm.passOrReject = 1;
      auditItem({ ...this.getFormData(this.filterForm) }).then(res => {
        this.$message.success('批量初审成功');
        this.totalDialogVisible = false;
        this.filterDialogVisible = false;
        this.$emit('callParentMethod');
      }).catch(() => {});
    },
    AuditRej () {
      this.rejectlogVisible = true;
    },
    submit () {
      let params = {
        ids: this.selectIds,
        opinion: this.Selectform.opinion,
        passOrReject: this.Selectform.passOrReject
      };
      if (params.passOrReject === '1') {
        auditItem(params).then(res => {
          this.$message.success('批量初审成功');
          this.$refs.SelectformRef.resetFields();
          this.dialogVisible = false;
          this.$emit('callParentMethod');
        }).catch(() => {});
      } else if (params.passOrReject === '0') {
        if (params.opinion.length === 0) {
          this.$message({
            type: 'warning',
            message: '初审意见必填!'
          });
        } else {
          auditItem(params).then(res => {
            this.$message.success('批量驳回成功');
            this.$refs.SelectformRef.resetFields();
            this.dialogVisible = false;
            this.$emit('callParentMethod');
          }).catch(() => {});
        }
      }
    }

  }
};
</script>

<style lang="scss">
.batchAudit-dialog {
  .el-input-number {
    width: 100%;
  }
}
</style>
