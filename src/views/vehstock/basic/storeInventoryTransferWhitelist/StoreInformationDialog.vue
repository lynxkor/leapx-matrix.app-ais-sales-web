<template>
  <el-dialog class="m-start-work-dialog" title="批量选择门店" width="80%" :visible.sync="dialogVisible" @close="close">
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="门店编码">
        <fetch-select :remote-method="getDealerListByName" remote v-model="form.storeName" placeholder="请输入门店编码或名称"
          labelKey="storeName" valueKey="storeCode" subLabelKey="storeCode" clearable
          filterable />
      </el-form-item>
      <page-search-action v-model="show" :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <!-- 数据表格 -->
    <div class="table-section">
      <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium"
        :checkbox-config="{ checkField: 'checked' }" @checkbox-change="handleSelectionChange"
        @checkbox-all="handleSelectionChange">
        <vxe-column type="checkbox" width="60" align="center" />
        <vxe-column field="storeCode" title="备件编码" min-width="15%" />
        <vxe-column field="storeName" title="备件名称" min-width="15%" />
        <vxe-column field="storeCode" title="门店编码" min-width="15%" />
        <vxe-column field="storeName" title="门店名称" min-width="15%" />
        <vxe-column field="region" title="区域" min-width="15%" />
        <vxe-column field="provinceName" title="省" min-width="15%" />
        <vxe-column field="cityName" title="市" min-width="15%" />
        <vxe-column field="remark" title="备注" min-width="15%" />
      </vxe-table>
    </div>

    <!-- 底部按钮 -->
    <template v-slot:footer>
      <div class="dialog-footer">
        <!-- <el-button size="small" type="success" :loading="submitLoading" @click="submitRequest">确定</el-button> -->
        <el-button size="small" @click="close">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { listOrgStoreInfo } from '@/libs/api/common';
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
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      tableData: [],
      exportLoading: false,
      form: {
        storeName: '',
        page: 1,
        pageSize: 20,
        total: 0,
      },
      show: false,
      loading: false,
      selectedRows: []
    };
  },
  watch: {
    visible (val) {
      if (val) {
        this.dialogVisible = val;
        this.getData();
      }
    },
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
      this.$emit('update:visible', false);
    },
    // 查询门店编码或名称
    async getDealerListByName (params) {
      return listOrgStoreInfo({ keyword: params });
    },
    async getData () {
      const res = await listOrgStoreInfo(this.form);
      this.tableData = res.records || [];
      this.form.total = res.total || 0;
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
