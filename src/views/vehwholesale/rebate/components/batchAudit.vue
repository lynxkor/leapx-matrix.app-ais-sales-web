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
      <el-form-item label="初审结果1：" prop="passOrReject">
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
      <div class="dialog-footer" >
        <el-button :loading="submitLoading" type="primary" @click="submit()">确 定</el-button>
        <el-button @click="close()">取 消</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    class="filter-batchAudit-dialog"
    title="批量初审"
    width="800px"
    :visible.sync="filterDialogVisible"
    @close="filterClose"
  >
  <h3>筛选初审数据</h3>
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
      <el-form-item label-width="40px" v-show="filterResult">
        <div class="filter-result-container">
          <span class="result-text">{{ filterResult }}</span>
          <el-button
            type="text"
            size="small"
            @click="AuditApp()"
            class="refresh-btn"
            v-if="filterResult"
          >
            <i class="el-icon-refresh"></i>
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <h3>初审结果</h3>
     <el-form ref="auditformRef" :model="Auditform"  :label-width="formLabelWidth" :rules="resultRules">
      <el-form-item label="初审结果" prop="passOrReject">
         <el-radio-group v-model="Auditform.passOrReject" @change="handleRadioChange">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="0">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
         :prop="Auditform.passOrReject === 0 ? 'opinion' : ''"
      >
        <template #label>
          <span v-html="Auditform.passOrReject === 0 ? '<span style=\'color: red\'>*</span> 初审意见' : '初审意见'"></span>
        </template>
        <el-input
          v-model="Auditform.opinion"
          :rows="4"
          placeholder="初审意见"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button :loading="submitLoading"  @click="filterClose()">取消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="auditConfirm()">确认</el-button>
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
      rejectlogVisible: false,
      filterResult: '',
      auditNum: 0,
      auditCount: 0,
      billStatus: '待审核',
      rejectPassOrReject: '驳回',
      resultRules: {
        passOrReject: [
          { required: true, message: '请选择初审结果', trigger: 'blur' }
        ],
        opinion: [
          {
            validator: (rule, value, callback) => {
              if (this.Auditform.passOrReject === 0) {
                if (!value || value.trim() === '') {
                  callback(new Error('初审意见为必填项'));
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
      Auditform: {
        opinion: '',
        passOrReject: '',
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
      formLabelWidth: '100px',
      selectIds: ''
    };
  },
  watch: {
  },
  methods: {
    handleRadioChange (value) {
      if (value === 1) {
        this.$refs.auditformRef.clearValidate('opinion');
        this.AuditApp();
      } else if (value === 0) {
        this.filterResult = '';
        this.$refs.auditformRef.validateField('opinion');
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
    filterClose () {
      this.filterDialogVisible = false;
      this.$refs.filterFormRef.resetFields();
      this.$refs.auditformRef.resetFields();
      this.filterForm.rebateType = '';
      this.filterForm.budgetItemId = '';
      this.Auditform.opinion = '';
      this.filterResult = '';
    },
    close () {
      this.dialogVisible = false;
      this.$refs.SelectformRef.resetFields();
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
    AuditApp () {
      statTotalRebate({ ...this.getFormData(this.filterForm) }).then(res => {
        this.filterResult = `筛选初审记录数：${res.qty}, 合计核销金额：${res.totalRebateAmount}`;
      }).catch(() => {});
    },
    auditConfirm () {
      this.$refs.auditformRef.validate((valid) => {
        if (valid) {
          let params = { ...this.filterForm, ...this.Auditform };
          auditItem({ ...this.getFormData(params) }).then(res => {
            this.$message.success('批量初审成功');
            this.filterClose();
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

<style lang="scss" scoped>
.batchAudit-dialog {
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
