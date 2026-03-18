<template>
  <el-dialog :title="title" width="1200px" :visible.sync="dialogVisible" @close="handleClose">
    <div class="page-common m-account-list">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :inline="true"
        size="small"
        label-position="right"
        class="ais-search-form"
      >
        <el-form-item label="整车仓库：">
          <el-select
            v-model="form.warehouseId"
            clearable
            filterable
            placeholder="请选择整车仓库"
            @change="filterTableData"
          >
            <el-option
              v-for="item in dropdownOptions.warehouseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料描述：">
          <el-input v-model="form.materialsDesc" clearable placeholder="请输入" @blur="filterTableData"/>
        </el-form-item>
        <template v-if="show">
        <el-form-item label="车系：">
          <el-select
            v-model="form.seriesId"
            clearable
            filterable
            placeholder="请选择车系"
            @change="filterTableData"
          >
            <el-option
              v-for="item in dropdownOptions.seriesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车型：">
          <el-select
            v-model="form.modelId"
            clearable
            filterable
            placeholder="请选择车型"
            @change="filterTableData"
          >
            <el-option
              v-for="item in dropdownOptions.modelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
          <el-form-item label="年款：">
            <el-select
              v-model="form.yearTypeId"
              clearable
              filterable
              placeholder="请选择年款"
              @change="filterTableData"
            >
              <el-option
                v-for="item in dropdownOptions.yearTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="外观：">
            <el-select
              v-model="form.exteriorId"
              clearable
              filterable
              placeholder="请选择外观"
              @change="filterTableData"
            >
              <el-option
                v-for="item in dropdownOptions.exteriorList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="内饰：">
            <el-select
              v-model="form.interiorId"
              clearable
              filterable
              placeholder="请选择内饰"
              @change="filterTableData"
            >
              <el-option
                v-for="item in dropdownOptions.interiorList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="轮毂：">
            <el-select
              v-model="form.wheelHubId"
              clearable
              filterable
              placeholder="请选择轮毂"
              @change="filterTableData"
            >
              <el-option
                v-for="item in dropdownOptions.wheelHubList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选装包：">
            <el-select
              v-model="form.optionPackageId"
              clearable
              filterable
              placeholder="请选择选装包"
              @change="filterTableData"
            >
              <el-option
                v-for="item in dropdownOptions.optionPackageList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="">
          <el-button :loading="loading" size="medium" type="primary" plain class="btn-search" @click="onSubmit">查询</el-button>
          <el-button size="medium" class="btn-reset" @click="onReset">重置</el-button>
          <span style="padding-left: 10px;" class="icon-expand curPoint" @click="toggleShow">
            {{ show ? "收起" : "展开"}}
            <i :class="show ? 'iconfont icon-lxppc-up' : 'iconfont icon-lxppc-down'"></i>
          </span>
        </el-form-item>
      </el-form>
      <!-- <div class="ais-actions">
          <span>
          </span>
      </div> -->
      <section class="common-section">
        <div class="common-section-body">
          <div class="common-section-table">
            <vxe-table
            ref="table"
            :data="currentTableData"
            stripe
            resizable
            border="inner"
            size="medium"
            height="auto"
            width="1000px"
            min-height="300px"
            max-height="400px"
          >
            <vxe-column field="checkbox" title="补货数量" align="center" width="150">
              <template v-slot="{ row }">
                <el-input-number
                  :min="0"
                  :max="999"
                  :precision="0"
                  :controls="false"
                  v-model="row.applyQty"
                  @change="handleApplyQtyChange(row, $event)"
                />
              </template>
            </vxe-column>
            <vxe-column field="modelName" title="车型" align="center" width="150" />
            <vxe-column field="warehouseName" title="整车仓库" align="center" width="120" />
            <vxe-column field="inventoryStatusLabel" title="库存状态" align="center" width="160">
              <template v-slot="{ row }">
                <span
                  :class="getInventoryStatusClass(row.inventoryStatus)"
                  :title="getInventoryStatusText(row.inventoryStatus)"
                >
                  {{ getInventoryStatusText(row.inventoryStatus) }}
                </span>
                <span class="inventory-status-red" v-if="[0, 1, '0', '1'].includes(row.inventoryStatus)">
                  ({{ row.inventoryQty || 0 }})
                </span>
              </template>
            </vxe-column>
            <vxe-column field="materialsDesc" title="物料描述" align="center" />
            <vxe-column field="optionPackageName" title="选装包" align="center" width="140" />
          </vxe-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
            style="margin-top: 20px;">
          </el-pagination>
          </div>
        </div>
      </section>
      <el-form
        ref="fundForm"
        :model="fundForm"
        :rules="fundFormRules"
        label-width="120px"
        size="small"
        class="fund-form"
      >
        <el-form-item label="结算资金类型：" prop="fundType" v-if="settleAccountList && settleAccountList.length > 0">
          <el-radio-group v-model="fundForm.fundType" class="fund-type-radios" :rules="fundFormRules.fundType">
            <el-radio
              v-for="item in settleAccountList"
              :key="item.id"
              :label="item.id"
            >
              {{ getFundTypeLabel(item) }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="no-fund-type-section" v-else>
          <p>暂无可用的结算资金类型</p>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { listCanSettleAccount } from '@/api/vehwholesale/fund/account/index';
import { getEnum } from '@/api/common';
import { queryPlantWholesaleInStockInventory, plantWholesaleInStockCreateApply } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApply/index';
import permissions from '@/libs/mixins/permissions';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  seriesId: '', // 车系ID
  modelId: '', // 车型ID
  yearTypeId: '', // 年款ID
  exteriorId: '', // 外观ID
  interiorId: '', // 内饰ID
  wheelHubId: '', // 轮毂ID
  warehouseId: '', // 整车仓库编码
  optionPackageId: '', // 选装包ID
  materialsDesc: '', // 物料描述
};
export default {
  name: 'vehicleWholesaleDialog',
  props: {
  },
  mixins: [permissions],
  components: {
    // TagInput,
    // FetchSelect,
    // PageSearchAction
  },
  data () {
    return {
      title: '厂端现车批售',
      moduleKey: 'AISVW-dealerFundAccount',
      loading: false,
      submitLoading: false,
      show: false,
      dialogVisible: false,
      form: {
        ...defaultForm
      },
      fundForm: {
        fundType: ''
      },
      fundFormRules: {
        fundType: [{ required: true, message: '请选择结算资金类型', trigger: 'change' }]
      },
      tableData: [],
      originalTableData: [],
      // 添加分页相关数据
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dropdownOptions: {
        warehouseList: [],
        seriesList: [],
        modelList: [],
        yearTypeList: [],
        exteriorList: [],
        interiorList: [],
        wheelHubList: [],
        optionPackageList: []
      },
      settleAccountList: [],
      stockStatusList: []
    };
  },
  computed: {
    filterFields () {
      return [
        { key: 'warehouseId', label: '整车仓库：', optionsKey: 'warehouseList' },
        { key: 'seriesId', label: '车系：', optionsKey: 'seriesList' },
        { key: 'modelId', label: '车型：', optionsKey: 'modelList' },
        { key: 'yearTypeId', label: '年款：', optionsKey: 'yearTypeList' },
        { key: 'exteriorId', label: '外观：', optionsKey: 'exteriorList' },
        { key: 'interiorId', label: '内饰：', optionsKey: 'interiorList' },
        { key: 'wheelHubId', label: '轮毂：', optionsKey: 'wheelHubList' },
        { key: 'optionPackageId', label: '选装包：', optionsKey: 'optionPackageList' },
      ];
    },
    // visibleFilterFields () {
    //   return this.filterFields.slice(0, 2);
    // },
    // hiddenFilterFields () {
    //   return this.filterFields.slice(2);
    // },
    // // 计算当前页数据
    currentTableData () {
      const start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
      const end = start + this.pagination.pageSize;
      return this.tableData.slice(start, end);
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1; // 切换每页显示数量时回到第一页
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val;
    },
    toggleShow () {
      this.show = !this.show;
    },
    getFundTypeLabel (item) {
      return item.fundType === 2010 ? item.fundTypeLabel + '-' + item.financialOrganizationName : item.fundTypeLabel;
    },
    filterTableData () {
      let filteredData = [...this.originalTableData];

      // 整车仓库用 warehouseName 判断
      if (this.form.warehouseId) {
        const warehouse = this.dropdownOptions.warehouseList.find(w => w.id === this.form.warehouseId);
        if (warehouse) {
          filteredData = filteredData.filter(item => item.warehouseName === warehouse.name);
        }
      }

      // 下拉框过滤条件
      const filters = {
        seriesId: 'seriesId',
        modelId: 'modelId',
        yearTypeId: 'yearTypeId',
        exteriorId: 'exteriorId',
        interiorId: 'interiorId',
        wheelHubId: 'wheelHubId',
        optionPackageId: 'optionPackageId'
      };

      // 应用下拉框筛选
      Object.entries(filters).forEach(([formKey, dataKey]) => {
        if (this.form[formKey]) {
          filteredData = filteredData.filter(item => item[dataKey] === this.form[formKey]);
        }
      });

      // 应用物料描述模糊搜索
      if (this.form.materialsDesc) {
        const searchStr = this.form.materialsDesc.toLowerCase().trim();
        filteredData = filteredData.filter(item =>
          item.materialsDesc && item.materialsDesc.toLowerCase().includes(searchStr)
        );
      }

      this.tableData = filteredData;
      this.pagination.total = filteredData.length;
      this.pagination.currentPage = 1;
    },
    handleApplyQtyChange (row, value) {
      const intValue = Math.max(0, Math.floor(value || 0));
      row.applyQty = intValue;
    },
    listCanSettleAccount () {
      // 这里只能查出20条
      // 厂端不允许点开查询的 但是产品坚持要可以打开在最后一步骤提交校验
      listCanSettleAccount({}).then(res => {
        this.settleAccountList = res || [];
      }).catch(err => { console.log(err); });
    },
    handleClose () {
      this.form = { ...defaultForm }; // 重置表单数据
      this.fundForm = { fundType: '' }; // 重置资金类型表单
      this.tableData = []; // 清空表格数据
    },
    onSubmit () {
      this.filterTableData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.fundForm = { fundType: '' };
      this.filterTableData();
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });
      if (Array.isArray(this.form.dealerCompanyNames) && this.form.dealerCompanyNames.length <= 1) {
        delete data.dealerCompanyNames;
        data.dealerCompanyNameLike = this.form.dealerCompanyNames[0] || '';
      };
      return data;
    },
    async getData () {
      this.loading = true;
      try {
        const res = await queryPlantWholesaleInStockInventory({});
        // 注意：res 是 { code, msg, data } 结构，需要取 res.data
        const data = (res?.data) || res || {};
        this.dropdownOptions = {
          warehouseList: data.warehouseList || [],
          seriesList: data.seriesList || [],
          modelList: data.modelList || [],
          yearTypeList: data.yearTypeList || [],
          exteriorList: data.exteriorList || [],
          interiorList: data.interiorList || [],
          wheelHubList: data.wheelHubList || [],
          optionPackageList: data.optionPackageList || []
        };
        // 设置表格数据
        this.originalTableData = (data.inStockInventoryDtoList || []).map(item => ({
          ...item,
          applyQty: item.applyQty || 0 // 保留用户之前输入的数据
        }));
        // this.originalTableData = mockInStockInventoryData;
        this.tableData = [...this.originalTableData];
        this.pagination.total = this.tableData.length;
        this.pagination.currentPage = 1;

        // 获取库存状态枚举
        await this.getStockStatusEnum();
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async getStockStatusEnum () {
      try {
        const response = await getEnum('vw_stock_status');
        this.stockStatusList = response || [];
        console.log('stockStatusList:', this.stockStatusList);
      } catch (error) {
        console.error('获取库存状态枚举失败:', error);
      }
    },

    async dialogshow () {
      await this.getData();
      await this.listCanSettleAccount();
      this.dialogVisible = true;
    },
    async getEnum () {
      const response = await getEnum('vw_stock_status');
      console.log('response:', response);
    },
    confirm () {
      this.dialogVisible = true;
      this.$refs.editTable.clearSelection();
      this.$emit('confirm', this.form);
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleCancel () {
      this.dialogVisible = false;
      this.handleClose();
    },
    handleSubmit () {
      this.$refs.fundForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          let params = {
            materialsList: this.tableData.filter(row => row.applyQty > 0).map(ele => {
              return {
                warehouseCode: ele.warehouseCode,
                materialDesc: ele.materialsDesc,
                applyQty: ele.applyQty
              };
            }),
            fundAccountId: this.fundForm.fundType
          };
          // console.log('params:', params);
          plantWholesaleInStockCreateApply(params).then(res => {
            this.$emit('confirm');
            this.submitLoading = false;
            this.dialogVisible = false;
          }).catch(() => {
            this.submitLoading = false;
          });
        }
      });
    },

    // 根据库存状态获取对应的文本
    getInventoryStatusText (status) {
      if (!this.stockStatusList || this.stockStatusList.length === 0) {
        return status;
      }

      const statusItem = this.stockStatusList.find(item => item.code === status + '');
      return statusItem ? statusItem.message : '';
    },

    // 根据库存状态获取对应的CSS类名
    getInventoryStatusClass (status) {
      const statusStr = status + '';
      if (statusStr === '0' || statusStr === '1') {
        return 'inventory-status-red';
      } else if (statusStr === '2') {
        return 'inventory-status-yellow';
      } else {
        return 'inventory-status-green';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.long_text {
  ::v-deep .el-form-item__label {
    line-height: 20px;
  }
  ::v-deep .el-input-number--small {
    width: 100%;
  }
}
::v-deep .el-input-number {
  width: 100%;
}
.fund-form {
  margin-top: 20px;
  padding: 10px 0;
  border-top: 1px solid #ebeef5;
}

// 库存状态颜色样式
.inventory-status-red {
  color: var(--leap-color-danger)!important;
  font-weight: bold;
}
.inventory-status-yellow {
  color: var(--leap-color-warning)!important;
  font-weight: bold;
}
.inventory-status-green {
  color: var(--leap-color-primary)!important;
  font-weight: bold;
}
.inventory-status-green {
  color: var(--leap-color-primary)!important;
  font-weight: bold;
}
.search-buttons {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.search-buttons .el-form-item {
  margin-bottom: 0;
  margin-left: 10px;
}
</style>
