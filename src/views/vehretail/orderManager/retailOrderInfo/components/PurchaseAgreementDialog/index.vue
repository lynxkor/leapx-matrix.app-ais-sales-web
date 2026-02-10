<!-- 新建文件: src/views/vehretail/orderManager/retailOrderInfo/components/PurchaseAgreementDialog.vue -->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    width="70%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :modal-append-to-body="true"
  >
    <div class="agreement-container" v-html="content"></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'PurchaseAgreementDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '购车协议'
    }
  },
  data () {
    return {
      dialogVisible: false
    };
  },
  methods: {
    handleClose () {
      this.dialogVisible = false;
    },
    handleConfirm () {
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.agreement-container {
  max-height: 60vh;
  overflow-y: auto;
  line-height: 1.5;
  padding: 10px;

  p {
    margin: 5px 0;
    line-height: 1.6;
  }

  strong, b {
    font-weight: bold;
  }

  u {
    text-decoration: underline;
  }

  br {
    display: block;
    content: "";
    margin: 5px 0;
  }
}
</style>
