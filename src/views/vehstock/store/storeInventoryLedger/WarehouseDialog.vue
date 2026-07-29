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
      <el-table-column prop="isDefaultLabel" label="是否默认" width="100" align="center">
        <template slot-scope="{ row }">
          <el-tag v-if="row.isDefault === 1" type="success" size="mini">默认</el-tag>
          <el-tag v-else type="info" size="mini">非默认</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.isDefault !== 1 && permissions.has(`${moduleKey}-setDefaultWarehouse`)"
            type="text"
            size="small"
            :loading="row._settingDefault"
            @click="handleSetDefault(row)"
          >设为默认</el-button>
          <span v-else-if="row.isDefault !== 1" style="color: #999">无权限</span>
          <span v-else style="color: #999">已默认</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehouseCode" label="仓库编码" width="160" />
      <el-table-column prop="warehouseName" label="仓库名称" min-width="160" />
      <el-table-column prop="provinceName" label="省" width="100" />
      <el-table-column prop="cityName" label="市" width="100" />
      <el-table-column prop="countyName" label="区" width="100" />
      <el-table-column prop="warehouseDetailAddress" label="地址" min-width="200" show-overflow-tooltip />
      <el-table-column prop="contacts" label="联系人" width="120" />
      <el-table-column prop="contactPhone" label="电话号码" width="140" />
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
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'WarehouseDialog',
  mixins: [permissions],
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
      warehouseList: [],
      moduleKey: 'AISVS-storeInventoryLedger',
      warehouseName: ''
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
        this.warehouseName = '';
        this.fetchWarehouseList(true);
      } else {
        this.warehouseList = [];
      }
    },
    handleSearch () {
      if (!this.currentStoreCode) {
        this.$message.warning('请先选择门店');
        return;
      }
      this.fetchWarehouseList();
    },
    handleReset () {
      this.warehouseName = '';
      if (this.currentStoreCode) {
        this.fetchWarehouseList();
      }
    },
    async fetchWarehouseList (checkDefault = false) {
      this.loading = true;
      try {
        const res = await listWarehouse(this.currentStoreCode, this.warehouseName || undefined);
        this.warehouseList = (res || []).map(item => ({
          ...item,
          _settingDefault: false
        }));
        // 切换门店时校验默认仓库是否存在
        if (checkDefault) {
          const hasDefault = this.warehouseList.some(item => item.isDefault === 1);
          if (!hasDefault) {
            this.$message.warning('当前门店未设置默认仓库');
          }
        }
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
      this.warehouseName = '';
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
