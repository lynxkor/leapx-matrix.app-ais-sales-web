<template>
  <el-dialog class="m-start-work-dialog" title="批量选择门店" width="80%" :visible.sync="dialogVisible" @close="close">
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="门店编码">
        <fetch-select :remote-method="getDealerListByName" remote v-model="form.dealerCodeList" placeholder="请输入门店编码或名称"
          labelKey="storeName" valueKey="storeCode" subLabelKey="storeCode" clearable multiple collapseTags
          filterable />
      </el-form-item>
      <page-search-action v-model="show" is-expandable :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <!-- 数据表格 -->
    <div class="table-section">
      <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium"
        :checkbox-config="{ checkField: 'checked' }" @checkbox-change="handleSelectionChange"
        @checkbox-all="handleSelectionChange">
        <vxe-column type="checkbox" width="60" align="center" />
        <vxe-column field="partCode" title="备件编码" />
        <vxe-column field="partName" title="备件名称" />
        <vxe-column field="unPurchaseReason" title="不可采购原因" />
      </vxe-table>
    </div>

    <!-- 底部按钮 -->
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" :loading="exportLoading">导 出</el-button>
        <el-button size="small" @click="close">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { downloadExcel } from '@/libs/utils';
import { exportTable, listOrgStoreInfo } from '@/api/common';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import FetchSelect from '@/libs/components/FetchSelect';

export default {
  name: 'StoreInformationDialog',
  components: {
    PageSearchAction,
    FetchSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    purchaseList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      tableData: [],
      exportLoading: false,
      form: {},
      show: false,
      loading: false,
      selectedRows: []
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    purchaseList (val) {
      if (val) {
        this.tableData = val;
      }
    }
  },
  methods: {
    onSubmit () {
      this.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form.page = 1;
      this.form.pageSize = 20;
      this.getData();
    },
    handleSelectionChange ({ records }) {
      this.selectedRows = records;
    },
    close () {
      this.$emit('close');
    },
    // 查询门店编码或名称
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params });
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
