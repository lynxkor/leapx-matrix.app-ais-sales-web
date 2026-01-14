<template>
  <div class="container">
    <!-- 场景1：查看模式（只展示，不能操作） -->
    <div class="section">
      <h3>查看模式</h3>
      <ais-upload
        :business-id="123"
        attach-type="contract"
        :value="editFiles"
        :show-upload="false"
        :editable="false"
        :disabled="true"
      />
    </div>

    <!-- 场景2：编辑模式（可上传和操作） -->
    <div class="section">
      <h3>编辑模式</h3>
      <ais-upload
        v-model="editFiles"
        :business-id="456"
        attach-type="invoice"
        :show-upload="true"
        :editable="true"
        :upload-config="uploadConfig"
        @success="handleUploadSuccess"
        @rename="handleFileRename"
        @delete="handleFileDelete"
      />
    </div>

    <!-- 场景3：只使用文件展示组件 -->
    <div class="section">
      <h3>只展示组件</h3>
      <file-display
        :file-list="editFiles"
        :editable="false"
        :view-only="true"
        @preview="handlePreview"
        @download="handleDownload"
      />
    </div>
  </div>
</template>

<script>
import AisUpload from '@/components/AisUpload';
import FileDisplay from '@/components/FileDisplay';

export default {
  name: 'App',
  components: {
    AisUpload,
    FileDisplay
  },

  data () {
    return {
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

      // 上传配置
      uploadConfig: {
        multiple: true,
        limit: 5,
        accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
        buttonText: '上传附件',
        buttonType: 'success',
        buttonIcon: 'el-icon-upload2',
        beforeUpload: (file) => {
          const isLt10M = file.size / 1024 / 1024 < 10;
          if (!isLt10M) {
            this.$message.error('上传文件大小不能超过 10MB!');
            return false;
          }
          return true;
        }
      }
    };
  },

  methods: {
    handleUploadSuccess (response, file) {
      console.log('上传成功:', file);
    },

    handleFileRename ({ oldName, newName }) {
      console.log(`文件重命名: ${oldName} -> ${newName}`);
    },

    handleFileDelete ({ file }) {
      console.log('删除文件:', file.name);
    },

    handlePreview (file) {
      console.log('预览文件:', file.name);
    },

    handleDownload (file) {
      console.log('下载文件:', file.name);
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
