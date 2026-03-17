<template>
  <el-dialog
    :title="title"
    :visible="visible"
    custom-class="ais-simple-dialog"
    :width="width"
    append-to-body
    @close="handleClose"
  >
    <div class="ais-simple-dialog-content">
                <AisAttachment
                  :businessId="_id"
                  ref="attachment"
                  configCode="mcs_activationmodelsetting"
                  attachType="功能演示视频"
                  title="车辆信息"
                  type="card"
                />
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
      width: '80%'
    };
  },
  components: {
    AisAttachment
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
      this.$emit('confirm');
    }
  }
};
</script>

<style lang="scss">
</style>
