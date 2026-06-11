<template>
    <el-dialog class="m-start-work-dialog" :title="titleName" width="50%" :visible.sync="dialogVisible" @close="close">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="审批：" prop="auditStatus">
                <el-radio v-model="form.auditStatus" :label="1">通过</el-radio>
                <el-radio v-model="form.auditStatus" :label="2">驳回</el-radio>
            </el-form-item>
            <el-form-item label="退回至：" v-if="name === 'headquarters' && form.auditStatus === 2" prop="auditStatusBack">
                <el-radio v-model="form.auditStatusBack" :label="1">提交人</el-radio>
                <el-radio v-model="form.auditStatusBack" :label="2">零售经理审</el-radio>
                <el-radio v-model="form.auditStatusBack" :label="3">大区审</el-radio>
            </el-form-item>
            <el-form-item label="审批意见：" prop="auditOpinion">
                <el-input v-model="form.approvalOpinion" type="textarea" :rows="3" maxlength="500" placeholder="请输入" show-word-limit
                clearable />
            </el-form-item>
            <el-form-item label="上传文件：">
                <el-upload
                    class="upload-demo"
                    action="#"
                    :http-request="customUploadRequest"
                    :before-remove="beforeRemove"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                    accept=".xlsx, .xls, .doc, .docx, .pdf, .png, .jpg, .jpeg"
                    :headers=uploadHeaders
                    >
                    <el-button
                        size="small"
                        type="primary"
                        :loading="uploadLoading"
                        :disabled="uploadLoading"
                        >
                        {{ uploadLoading ? '上传中...' : '点击上传' }}
                    </el-button>
                    <div slot="tip" class="el-upload__tip">只能上传.xlsx,.xls,.doc,.docx,.pdf,.png,.jpg,.jpeg文件，且不超过20MB</div>
                </el-upload>
            </el-form-item>
        </el-form>

        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" @click="close">取消</el-button>
                <el-button size="small" :loading="submitLoading" type="primary" @click="submit">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { approveByRetailManager, approveByAreaManager, approveByHeadquarters } from '@/api/vehstock/store/vehiclePurposeChangeApply/index';
import { uploadFile } from '@/libs/api/attachment';

export default {
  name: 'ApprovalDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    approvalId: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      uploadHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      fileList: [],
      dialogVisible: this.visible,
      uploadLoading: false,
      form: {
        approvalOpinion: '',
        auditStatus: null,
        auditStatusBack: null,
        file: ''
      },
      titleName: '零售经理审批', // 弹窗标题
      submitLoading: false,
      rules: {
        auditStatus: [{ required: true, message: '请选择审批', trigger: 'change' }],
        auditStatusBack: [{ required: true, message: '请选择退回至', trigger: 'change' }],
      }
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    'form.auditStatus' (val) {
      if (val === 1) {
        this.form.auditStatusBack = null;
      }
    },
    name (val) {
      if (val === 'retail') {
        this.titleName = '零售经理审批';
      } else if (val === 'region') {
        this.titleName = '大区经理审批';
      } else if (val === 'headquarters') {
        this.titleName = '总部审批';
      }
    },
  },
  methods: {
    close () {
      this.form = {
        approvalOpinion: '',
        auditStatus: null,
        auditStatusBack: null,
      };
      this.$emit('close');
    },
    async submit () {
      if (!this.form.auditStatus) {
        this.$message.warning('请选择审批');
        return;
      }
      if (this.name === 'headquarters' && this.form.auditStatus === 2) {
        if (!this.form.auditStatusBack) {
          this.$message.warning('请选择退回至');
          return;
        }
      }
      this.submitLoading = true;
      // 定义映射关系
      const apiMap = {
        retail: { fn: approveByRetailManager },
        region: { fn: approveByAreaManager },
        headquarters: { fn: approveByHeadquarters },
      };
      // 获取当前配置（默认使用 retail
      const config = apiMap[this.name] || apiMap.retail;
      // 构建参数
      const params = {
        id: this.approvalId,
        ...this.form,
      };

      try {
        await config.fn(params);
        this.close();
        this.$emit('submit');
      } catch (error) {
        console.error('操作失败:', error);
      } finally {
        this.submitLoading = false;
      }
    },
    // 上传前的文件校验
    beforeUpload (file) {
      const isValidType = /\.(xlsx|xls|doc|docx|pdf|png|jpg|jpeg)$/i.test(file.name);
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isValidType) {
        this.$message.error('只能上传 .xlsx, .xls, .doc, .docx, .pdf, .png, .jpg, .jpeg 文件!');
        return false;
      }
      if (!isLt20M) {
        this.$message.error('文件大小不能超过 20MB!');
        return false;
      }
      // 开始上传，显示加载状态
      this.uploadLoading = true;
      return true;
    },
    async customUploadRequest (options) {
      const { file } = options;
      const formData = new FormData();
      formData.append('file', file);
      const uploadResult = await uploadFile(formData);
      this.form.file = uploadResult.data.url;
    },
    // 上传成功后的处理
    handleSuccess (res, file) {
      this.uploadLoading = false;
      // const excelModelUrl = file.response?.data?.url;
      // 直接赋值
      // this.form.excelModelUrl = excelModelUrl;

      this.$message.success('上传成功');
    },
    beforeRemove (file, fileList) {
      this.uploadLoading = false;
      this.form.file = '';
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    handleError () {
      this.uploadLoading = false;
      this.$message.error('上传失败，请重试');
    },

    // 上传时校验
    handleExceed () {
      this.$message.warning('当前限制选择 1 个文件');
    }
  }
};
</script>

<style lang="scss" scoped>
.m-start-work-dialog {

    ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
    ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis>.vxe-cell,
    ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
        padding: 8px 12px !important;
    }

    .start-work-content {
        .time-section {
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e8e8e8;

            .el-form {
                .el-form-item {
                    margin-bottom: 0;
                }
            }
        }

        .table-section {
            margin-top: 15px;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}

.action-button {
    margin: 0 5px;
    cursor: pointer;

    &.btn-edit {
        color: #4C4CD6;
    }
}
</style>
