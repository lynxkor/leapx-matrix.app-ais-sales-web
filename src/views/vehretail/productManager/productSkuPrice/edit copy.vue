<template>
  <!-- <div class="container"> -->
    <!-- 场景1：查看模式（只展示，不能操作） -->
    <!-- <div class="section">
      <h3>查看模式</h3>
      <ais-upload
        :business-id="123"
        attach-type="contract"
        :value="editFiles"
        :show-upload="false"
        :editable="false"
        :disabled="true"
      />
    </div> -->

    <!-- 场景2：编辑模式（可上传和操作） -->
    <!-- <div v-for="configItem in uploadConfigs" :key="configItem.id" class="section">
      <h3>{{ configItem.attachType }}</h3>
      <ais-upload
        v-model="fileLists[configItem.attachType]"
        :business-id="$route.query.id"
        :attach-type="configItem.attachType"
        :show-upload="true"
        :editable="true"
        :disabled="false"
        :upload-config="getUploadConfig(configItem)"
      />
    </div> -->
  <div class="page-common-edit">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <el-form ref="attachmentForm" :model="form" :rules="formRules" label-width="160px" inline>
                <el-form-item v-for="configItem in uploadConfigs" :key="configItem.id"
                  :label="configItem.attachType + '：'"
                  :prop="`files_${configItem.attachType}`"
                  :required="configItem.required === '1'"
                >
                  <ais-upload
                    v-model="fileLists[configItem.attachType]"
                    :business-id="$route.query.id"
                    :attach-type="configItem.attachType"
                    :show-upload="true"
                    :editable="true"
                    :disabled="false"
                    :upload-config="getUploadConfig(configItem)"
                  />
                </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" type="primary" @click="submitForm">保存</el-button>
        <el-button size="small" @click="resetForm">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
    <!-- 场景3：只使用文件展示组件 -->
    <!-- <div class="section">
      <h3>只展示组件</h3>
      <file-display
        :file-list="editFiles"
        :editable="false"
        :view-only="true"
        @preview="handlePreview"
        @download="handleDownload"
      />
    </div> -->
  <!-- </div> -->
</template>

<script>
import AisUpload from '@/components/AisUpload';
// import FileDisplay from '@/components/FileDisplay';
import { attachmentMixin } from '@/mixins/attachmentMixin.js';

export default {
  name: 'App',
  components: {
    AisUpload,
    // FileDisplay
  },
  mixins: [attachmentMixin],

  data () {
    return {
      // 表单数据
      form: {},
      // 表单验证规则
      formRules: {},
      uploadConfigs: [],
      fileLists: {},
      shouldSyncFileLists: true,
      // 查看模式的文件列表
      viewFiles: [
        {
          name: '合同文件.pdf',
          url: '/files/contract.pdf',
          fileType: 'file',
          size: 2048000,
          attachmentId: 1
        },
        {
          name: '产品图片.jpg',
          url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          fileType: 'image',
          size: 512000,
          attachmentId: 2
        }
      ],
      // 编辑模式的文件列表
      editFiles: [
        {
          name: '合同文件.pdf',
          url: '/files/contract.pdf',
          fileType: 'file',
          size: 2048000,
          attachmentId: 1
        },
        {
          name: '产品图片1.jpg',
          url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          fileType: 'image',
          size: 512000,
          attachmentId: 2
        },
        {
          name: '产品图片2.jpg',
          url: 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
          fileType: 'image',
          size: 512000,
          attachmentId: 2
        },
        {
          name: '产品图片3.jpg',
          url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
          fileType: 'image',
          size: 512000,
          attachmentId: 2
        },
        {
          name: '产品图片4.jpg',
          url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          fileType: 'image',
          size: 512000,
          attachmentId: 2
        },
        {
          name: '演示视频.mp4',
          url: '/files/demo.mp4',
          fileType: 'video',
          size: 10485760,
          attachmentId: 3
        }
      ],

      // 只展示的文件列表
      displayFiles: [
        {
          name: '演示视频.mp4',
          url: '/files/demo.mp4',
          fileType: 'video',
          size: 10485760,
          attachmentId: 3
        }
      ],
    };
  },
  // 监听fileLists变化，同步到表单数据
  watch: {
    fileLists: {
      handler (newVal) {
        // 只有在需要同步的时候才执行
        if (!this.shouldSyncFileLists) return;
        this.uploadConfigs.forEach(configItem => {
          const fieldName = `files_${configItem.attachType}`;
          this.form[fieldName] = newVal[configItem.attachType] || [];
        });
      },
      deep: true
    }
  },
  created () {
    // 使用通用方法初始化数据
    this.initAttachmentData(
      'mcs_techniacalrepair',
      this.$route.query.id,
      () => {
        // 成功回调（可选）
        console.log('附件数据初始化成功');
        this.initFormAndRules();
      },
      (error) => {
        // 错误回调（可选）
        console.log('附件数据初始化失败:', error);
      }
    );
  },

  methods: {
    // 使用混入中的方法处理文件列表变化
    handleFileListChange (newFileList, configItem) {
      this.handleFileListChange(newFileList, configItem, this.$refs.attachmentForm);
    },

    // 提交表单
    async submitForm () {
      const isValid = await this.submitAttachmentForm(this.$refs.attachmentForm, (fileLists) => {
        // 提交成功回调
        console.log('表单验证通过，准备提交数据');
        console.log('文件列表:', fileLists);
      });
      return isValid;
    },

    // 重置表单
    resetForm () {
      this.shouldSyncFileLists = false;
      this.resetAttachmentForm(this.$refs.attachmentForm);
      // 在下一个tick重新启用同步
      this.$nextTick(() => {
        this.shouldSyncFileLists = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.section {
  margin-bottom: 40px;
  padding: 24px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fff;

  h3 {
    margin-bottom: 20px;
    color: #303133;
    border-left: 4px solid #409eff;
    padding-left: 12px;
  }
}
</style>
