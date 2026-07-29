<template>
  <el-dialog class="m-warehouse-dialog" title="调整默认仓库" width="60%" :visible.sync="dialogVisible" @close="close">
    <el-form :inline="true" size="small" label-width="100px">
      <el-form-item label="门店：">
        <el-select v-model="currentStoreCode" placeholder="请选择门店" filterable clearable style="width: 260px" @change="handleStoreChange">
          <el-option v-for="item in storeList" :key="item.orgCode" :label="item.orgName" :value="item.orgCode" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="warehouseList" v-loading="loading" border size="small" style="width: 100%">
      <el-table-column label="是否默认仓库" width="120" align="center">
        <template slot-scope="{ row }">
          <span
            class="warehouse-radio"
            :class="{ 'is-checked': row.warehouseCode === defaultWarehouseCode, 'is-disabled': !permissions.has(`${moduleKey}-setDefaultWarehouse`) }"
            @click="handleRadioClick(row)"
          >
            <span class="warehouse-radio__inner" />
          </span>
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
      warehouseName: '',
      defaultWarehouseCode: ''
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
        const defaultItem = this.warehouseList.find(item => item.isDefault === 1);
        this.defaultWarehouseCode = defaultItem ? defaultItem.warehouseCode : '';
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
    handleRadioClick (row) {
      // 无权限时不响应
      if (!this.permissions.has(`${this.moduleKey}-setDefaultWarehouse`)) {
        return;
      }
      // 点击当前已选中的默认仓库，不做操作
      if (row.warehouseCode === this.defaultWarehouseCode) {
        return;
      }
      const content = '调整后生成的批售单按默认仓库发运，已产生的批售单需前往整车批售订单手动修改';
      this.$confirm(content, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doSetDefault(row);
      }).catch(() => {
        // 取消操作，恢复单选状态
      });
    },
    async doSetDefault (row) {
      this.$set(row, '_settingDefault', true);
      try {
        await setDefaultWarehouse(this.currentStoreCode, row.warehouseCode);
        this.$message.success('设置默认仓库成功');
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
  .warehouse-radio {
    display: inline-block;
    cursor: pointer;
    .warehouse-radio__inner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 1px solid #dcdfe6;
      border-radius: 50%;
      background-color: #fff;
      position: relative;
      &::after {
        content: '';
        display: none;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #409eff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &.is-checked .warehouse-radio__inner {
      border-color: #409eff;
      &::after {
        display: block;
      }
    }
    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
</style>
