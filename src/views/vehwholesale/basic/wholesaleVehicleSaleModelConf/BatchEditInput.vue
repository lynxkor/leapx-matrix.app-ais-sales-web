<template>
  <div>
    <el-dialog title="整车销售模式配置(批量)信息" :visible.sync="dialogVisible" width="700px" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
        <el-form-item label="开票优惠类型" prop="invoiceDiscountType">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_invoice_type"
            v-model="form.invoiceDiscountType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="开票系数" prop="invoiceCoefficient">
          <el-input-number
                  :controls="false"
            placeholder="请输入"
            v-model="form.invoiceCoefficient"
            clearable
            :precision="4"
          />
        </el-form-item>
        <el-form-item label="返利使用类型" prop="rebateUseType">
          <fetch-select
            :request="fetchOptions"
            enumCode="ws_rebate_use_type"
            v-model="form.rebateUseType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="返利使用系数" prop="rebateCoefficient">
          <el-input-number
                  :controls="false"
            placeholder="请输入"
            v-model="form.rebateCoefficient"
            clearable
            :precision="4"
          />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetime"
          />
        </el-form-item>
        <el-form-item label="截止日期" prop="endDate">
          <el-date-picker
            v-model="form.endDate"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetime"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="save('ruleForm')" :loading="submitLoading">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';

export default {
  name: 'BatchEditInput',
  components: {
    FetchSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editIds: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      submitLoading: false,
      form: {
        invoiceDiscountType: '',
        invoiceCoefficient: null,
        rebateUseType: '',
        rebateCoefficient: null,
        startDate: '',
        endDate: ''
      },
      rules: {
        modelName: [
          { required: true, message: '请输入车型', trigger: 'blur' }
        ],
        vehicleYearType: [
          { required: true, message: '请选择年款', trigger: 'change' }
        ],
        orderCategory: [
          { required: true, message: '请输入订单分类', trigger: 'blur' }
        ],
        cooperationMode: [
          { required: true, message: '请输入合作模式', trigger: 'blur' }
        ],
        invoiceDiscountType: [
          { required: true, message: '请选择开票优惠类型', trigger: 'change' }
        ],
        invoiceCoefficient: [
          { required: true, message: '请输入开票系数', trigger: 'blur' }
        ],
        rebateUseType: [
          { required: true, message: '请选择返利使用类型', trigger: 'change' }
        ],
        rebateCoefficient: [
          { required: true, message: '请输入返利使用系数', trigger: 'blur' }
        ],
        dealerParentOrgId: [
          { required: false, message: '请输入母公司ID', trigger: 'blur' }
        ],
        dealerParentOrgName: [
          { required: true, message: '请输入母公司', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ],
        submitterName: [
          { required: true, message: '请输入提交人', trigger: 'blur' }
        ],
        submitTime: [
          { required: true, message: '请选择提交时间', trigger: 'change' }
        ],
        auditorName: [
          { required: true, message: '请输入审核人', trigger: 'blur' }
        ],
        auditTime: [
          { required: true, message: '请选择审核时间', trigger: 'change' }
        ],
        auditStatus: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        auditOpinion: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，140:新销服; 老销服:10', trigger: 'blur' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'blur' }
        ],
        vehicleYearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' }
        ],
        submitterUserId: [
          { required: true, message: '请输入提交人ID', trigger: 'blur' }
        ],
        auditorUserId: [
          { required: true, message: '请输入审核人ID', trigger: 'blur' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'blur' }
        ],
      }
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible;
      },
      set (val) {
        this.$emit('update:visible', val);
      }
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.form = {
          invoiceDiscountType: '',
          invoiceCoefficient: null,
          rebateUseType: '',
          rebateCoefficient: null,
          startDate: '',
          endDate: ''
        };
      }
    }
  },
  methods: {
    cancel () {
      this.dialogVisible = false;
    },
    save (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          this.$emit('confirm', {
            // 传递批量编辑的ID和参数
            ids: this.editIds,
            ...this.form
          });
          this.submitLoading = false;
          this.dialogVisible = false;
        }
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>
