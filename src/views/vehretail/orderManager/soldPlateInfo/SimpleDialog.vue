<template>
  <el-dialog
    :title="title"
    :visible="visible"
    custom-class="ais-simple-dialog ais-attachment-dialog"
    width="1200px"
    append-to-body
    @close="handleClose"
  >
    <div class="ais-simple-dialog-content">
      <div class="attachment-grid">
        <div class="attachment-item" v-for="(item, index) in attachmentList" :key="index">
          <!-- <div class="attachment-label">{{ item.label }}<em v-if="item.required">*</em></div>
          <div class="attachment-upload"> -->
            <AisAttachment
              :businessId="_id"
              :ref="'attachment' + index"
              :configCode="item.configCode"
              :attachType="item.attachType"
              :title="item.label"
              :uploadConfig="item.uploadConfig"
            />
          <!-- </div> -->
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel" size="small">取消</el-button>
      <el-button type="primary" @click="handleConfirm" size="small">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import AisAttachment from '@/libs/components/AisAttachment/index.vue';

export default {
  name: 'SimpleDialog',
  props: {
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      title: '',
      // 附件列表配置
      attachmentList: [
        { label: '车辆销售发票', required: true, configCode: 'mcs_subsidies', attachType: '车辆销售发票' },
        { label: '车辆行驶证', required: false, configCode: 'mcs_subsidies', attachType: '车辆行驶证' },
        { label: '车辆合格证', required: true, configCode: 'mcs_subsidies', attachType: '车辆合格证' },
        { label: '车主身份证', required: true, configCode: 'mcs_subsidies', attachType: '车主身份证' },
        { label: '附件资料', required: true, configCode: 'mcs_subsidies', attachType: '附件资料' }
      ]
    };
  },
  components: {
    AisAttachment
  },
  computed: {
    _id () {
      return this.id || this.$route?.query?.id || '';
    }
  },
  methods: {
    /**
     * 打开弹框
     * @param {Object} options - 配置项
     * @param {string} options.title - 弹框标题
     * @param {string} options.width - 弹框宽度，默认 500px
     * @param {any} options.data - 传递给弹框的数据
     */
    open (options = {}) {
      this.title = options.title || '';
      this.width = options.width || '500px';
      this.visible = true;
      // 如果有数据传递，通过 $emit 通知父组件
      if (options.data) {
        this.$emit('open', options.data);
      }
    },
    /**
     * 关闭弹框
     */
    close () {
      this.visible = false;
    },
    handleClose () {
      this.$emit('close');
    },
    handleCancel () {
      this.close();
      this.$emit('cancel');
    },
    handleConfirm () {
      // 校验必填项
      const missingRequired = [];
      this.attachmentList.forEach((item, index) => {
        if (item.required) {
          const refName = 'attachment' + index;
          const fileLength = this.$refs[refName]?.[0]?.getFileList?.()?.length || 0;
          if (fileLength === 0) {
            missingRequired.push(item.label);
          }
        }
      });

      if (missingRequired.length > 0) {
        this.$message.error(`以下必填项未上传：${missingRequired.join('、')}`);
        return;
      }

      this.$emit('confirm');
    }
  }
};
</script>

<style lang="scss">
.ais-attachment-dialog {
  .ais-simple-dialog-content {
    padding: 10px 0;
  }

  .attachment-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .attachment-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #F8F7F7;
    border-radius: 4px;
    padding: 16px 20px;
    gap: 16px;

    .attachment-label {
      flex-shrink: 0;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;

      em {
        color: #f56c6c;
        font-style: normal;
        font-size: 14px;
      }
    }

    .attachment-upload {
      flex: 1;
      display: flex;
      justify-content: flex-end;

      .business-upload {
        width: auto;

        .business-upload-area {
          margin-bottom: 0;

          ::v-deep .el-upload {
            display: inline-flex;
          }

          .title {
            display: none;
          }

          .el-button {
            background-color: #fff;
            border: 1px solid var(--leap-color-primary, #00b578);
            color: var(--leap-color-primary, #00b578);
            padding: 7px 20px;
            font-size: 14px;
            border-radius: 4px;

            &:hover {
              background-color: var(--leap-color-primary, #00b578);
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
