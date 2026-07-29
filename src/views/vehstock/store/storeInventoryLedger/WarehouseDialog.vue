<template>
  <el-dialog class="m-warehouse-dialog" title="仓库管理" width="60%" :visible.sync="dialogVisible" @close="close">
    <el-form :inline="true" size="small" label-width="100px">
      <el-form-item label="门店：">
        <el-select v-model="currentStoreCode" placeholder="请选择门店" filterable clearable style="width: 260px" @change="handleStoreChange">
          <el-option v-for="item in storeList" :key="item.orgCode" :label="item.orgName" :value="item.orgCode" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="warehouseList" v-loading="loading" border size="small" style="width: 100%">
      <el-table-column prop="warehouseCode" label="仓库编码" width="160" />
      <el-table-column prop="warehouseName" label="仓库名称" min-width="200" />
      <el-table-column prop="isDefaultLabel" label="是否默认" width="100" align="center">
        <template slot-scope="{ row }">
          <el-tag v-if="row.isDefault === 1" type="success" size="mini">默认</el-tag>
          <el-tag v-else type="info" size="mini">非默认</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.isDefault !== 1"
            type="text"
            size="small"
            :loading="row._settingDefault"
            @click="handleSetDefault(row)"
          >设为默认</el-button>
          <span v-else style="color: #999">已默认</span>
        </template>
      </el-table-column>
    </el-table>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { listWarehouse, setDefaultWarehouse } from '@/api/vehstock/store/storeInventoryLedger/index';

export default {
  name: 'WarehouseDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      loading: false,
      currentStoreCode: '',
      storeList: [],
      warehouseList: []
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.initStoreList();
      }
    }
  },
  methods: {
    initStoreList () {
      const userInfo = this.$store.state.user.userInfo;
      this.storeList = (userInfo.orgPostUserList || []).filter(item => item.orgType === '1060');
      // 如果只有一个门店，自动选中并查询
      if (this.storeList.length === 1) {
        this.currentStoreCode = this.storeList[0].orgCode;
        this.fetchWarehouseList();
      } else {
        this.currentStoreCode = '';
        this.warehouseList = [];
      }
    },
    handleStoreChange (val) {
      if (val) {
        this.fetchWarehouseList();
      } else {
        this.warehouseList = [];
      }
    },
    async fetchWarehouseList () {
      this.loading = true;
      try {
        const res = await listWarehouse(this.currentStoreCode);
        this.warehouseList = (res || []).map(item => ({
          ...item,
          _settingDefault: false
        }));
      } catch (e) {
        console.error('查询仓库信息失败:', e);
        this.warehouseList = [];
      } finally {
        this.loading = false;
      }
    },
    async handleSetDefault (row) {
      this.$set(row, '_settingDefault', true);
      try {
        await setDefaultWarehouse(this.currentStoreCode, row.warehouseCode);
        this.$message.success('设置默认仓库成功');
        // 刷新列表
        await this.fetchWarehouseList();
      } catch (e) {
        console.error('设置默认仓库失败:', e);
      } finally {
        this.$set(row, '_settingDefault', false);
      }
    },
    close () {
      this.currentStoreCode = '';
      this.warehouseList = [];
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.m-warehouse-dialog {
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
