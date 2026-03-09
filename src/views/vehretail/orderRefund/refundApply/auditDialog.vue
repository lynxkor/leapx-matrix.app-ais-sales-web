<template>
  <el-dialog
    :visible.sync="auditShow"
    append-to-body
    :title="auditTitle"
    width="600px"
    @close="close"
  >
    <el-form ref="auditForm" :model="auditForm" :rules="rules" label-width="120px" size="small" style="padding: 10px 0">
      <el-form-item
        v-if="auditDataList && auditDataList.length > 0"
        :label="auditDataList && auditDataList.length > 1 ? '批量审核数据' : '审核数据'"
        prop="auditor"
      >
        <el-tooltip
          :display="auditDataList && auditDataList.length > 0"
          :content="tooltipContent"
          placement="top"
        >
          <span>{{ displayAuditData }}</span>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        label="审核结果"
        prop="result"
      >
        <el-radio-group v-model="auditForm.result">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="0">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-show="auditType === 'approve' && auditForm.result === 1"
        :rules="auditType === 'approve' ? rules.refundBank: []"
        label="原因二级分类："
        prop="subCateCode">
        <fetch-select
          v-bind="selectSubCategoryOptions"
          :remote-method="changeSubCategorySearch"
          v-model="auditForm.subCateCode"
          @change="changeSubCategoryChange"
        />
      </el-form-item>
      <el-form-item
        label="审核意见"
        prop="content"
        :rules="auditForm.result !== 1 ? rules.content : []"
      >
        <el-input
          v-model="auditForm.content"
          :rows="4"
          maxlength="500"
          placeholder="请输入审核意见"
          show-word-limit
          type="textarea"
        />
      </el-form-item>
      <el-form-item
        v-if="auditType === 'preApprove'"
        label="特殊备注"
        prop="remark"
      >
        <el-input
          v-model="auditForm.remark"
          :rows="4"
          maxlength="500"
          placeholder="请输入特殊备注"
          show-word-limit
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" size="small"> 取消 </el-button>
      <el-button type="primary" @click="auditFun" size="small"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { fetchSubCategoryList } from '@/api/vehretail/orderRefund/subCategory';

export default {
  name: 'RefundApplyAuditDialog',
  props: {
    auditType: {
      type: String,
      default: 'approve'
    },
    mainCateCode: {
      type: String,
      default: ''
    },
    auditTitle: {
      type: String,
      default: '审批'
    },
    auditDataList: {
      type: Array,
      default: () => []
    },
    field: {
      type: String,
      default: 'id'
    }
  },
  components: {
    FetchSelect
  },
  data () {
    return {
      selectSubCategoryOptions: {
        placeholder: '请选择',
        labelKey: 'subCateName',
        valueKey: 'subCateCode',
        clearable: true,
        // multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      auditShow: false,
      auditForm: {
        result: '',
        content: '',
        remark: '',
        cateCode: '',
        subCateCode: '',
        subCateName: ''
      },
      rules: {
        result: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ],
        subCateCode: [
          { required: true, message: '请选择二级分类', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    displayAuditData () {
      if (!this.auditDataList || this.auditDataList.length === 0) {
        return '';
      }
      // 如果只有一条数据，直接显示该字段值
      if (this.auditDataList.length === 1) {
        return this.auditDataList[0][this.field] || '';
      }
      // 如果有多条数据，显示数量
      return `共 ${this.auditDataList.length} 条数据`;
    },
    tooltipContent () {
      if (!this.auditDataList || this.auditDataList.length === 0) {
        return '';
      }
      return this.auditDataList
        .map(item => item[this.field] || '')
        .filter(value => value)
        .join(', ');
    }
  },
  methods: {
    show () {
      this.auditShow = true;
    },
    close () {
      this.auditShow = false;
      this.auditForm = { result: '', content: '' };
      this.$nextTick(() => {
        this.$refs.auditForm.clearValidate();
      });
    },
    /**
     * 审核操作
     */
    auditFun () {
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          // 将审核数据列表也传递给父组件
          this.$emit('audit', { ...this.auditForm, auditDataList: this.auditDataList });
          this.close();
        }
      });
    },
    async changeSubCategorySearch () {
      return fetchSubCategoryList({
        pageSize: 1000,
        cateCode: this.mainCateCode
      });
    },
    changeSubCategoryChange (val, selectedOption) {
      this.auditForm.subCateCode = val ? selectedOption.subCateCode : '';
      this.auditForm.subCateName = val ? selectedOption.subCateName : '';
    },
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog .el-dialog__body {
  padding: 0 20px !important;
}
::v-deep .el-form-item {
  margin-bottom: 10px;
}
</style>
