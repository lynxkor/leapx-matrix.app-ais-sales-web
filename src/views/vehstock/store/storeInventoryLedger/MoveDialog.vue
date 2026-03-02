<template>
    <el-dialog class="m-start-work-dialog" title="请选择门店仓库" width="50%" :visible.sync="dialogVisible" @close="close">
        <el-form ref="form" :model="form" label-width="80px" size="small">
            <el-form-item label="门店仓库：">
                <el-select v-model="form.warehouseCode" placeholder="请选择门店" filterable remote reserve-keyword
                    :remote-method="remoteMethod" size="small" style="width:100%" @change="handleOrgChange">
                    <el-option v-for="item in warehouseList" :key="item.warehouseCode" :label="item.warehouseName"
                        :value="item.warehouseCode"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" :loading="submitLoading" type="primary" @click="submit">确 定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { move } from '@/api/vehstock/store/storeInventoryLedger/index';
import { listOrgWarehouseStoreInfo } from '@/api/common';

export default {
  name: 'batchDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectionId: {
      type: Array,
      default: () => {
        return [];
      }
    },
    saleDealerCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      selectedRows: [],
      submitLoading: false,
      form: {
        warehouseCode: '',
        warehouseName: '',
        warehouseDetailAddress: ''
      },
      warehouseList: []
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    saleDealerCode (val) {
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    getData () {
      return this.remoteMethod();
    },
    async remoteMethod (query) {
      // 如果没传 query (即 getData 调用时)，使用默认的 saleDealerCode
      const keyword = query !== undefined ? query : this.saleDealerCode;

      const res = await listOrgWarehouseStoreInfo({
        keyword,
        pageNum: 1,
        pageSize: 50
      });
      this.warehouseList = res.records || []; // 防止 records 为 undefined
    },
    close () {
      this.form.warehouseCode = '';
      this.$emit('close');
    },
    handleOrgChange (val) {
      // 当选择门店时，更新门店仓库信息
      const selected = this.warehouseList.find(item => item.warehouseCode === val);
      if (selected) {
        this.form.warehouseName = selected.warehouseName;
        this.form.warehouseDetailAddress = selected.warehouseDetailAddress;
      }
    },
    async submit () {
      if (!this.form.warehouseCode) {
        this.$message.error('请选择门店！');
        return;
      };

      const params = {
        ids: this.selectionId,
        dealerWarehouseCode: this.form.warehouseCode,
        dealerWarehouseName: this.form.warehouseName,
        dealerWarehouseAddress: this.form.warehouseDetailAddress
      };

      await move(params);
      this.form.warehouseCode = '';
      this.$emit('submit');
    },
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
