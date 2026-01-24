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
        <el-form-item v-for="field in visibleFilterFields" :key="field.key" :label="field.label">
          <el-select
            v-model="form[field.key]"
            clearable
            filterable
            :placeholder="`请选择${field.label.slice(0, -1)}`"
            @change="filterTableData"
          >
            <el-option
              v-for="item in dropdownOptions[field.optionsKey]"
              :key="item.id"
              :label="item.name"
              :value="field.key === 'warehouseCode' ? item.code : item.id"
            />
          </el-select>
        </el-form-item>
        <template v-if="show">
          <el-form-item v-for="field in hiddenFilterFields" :key="field.key" :label="field.label">
            <el-select
              v-model="form[field.key]"
              clearable
              filterable
              :placeholder="`请选择${field.label.slice(0, -1)}`"
              @change="filterTableData"
            >
              <el-option
                v-for="item in dropdownOptions[field.optionsKey]"
                :key="item.id"
                :label="item.name"
                :value="field.key === 'warehouseCode' ? item.code : item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="物料描述：">
            <el-input v-model="form.materialsDesc" clearable placeholder="请输入" @blur="filterTableData"/>
          </el-form-item>
        </template>
        <page-search-action
          v-model="show"
          is-expandable
          :loading="loading"
          @submit="onSubmit"
          @reset="onReset"
        />
      </el-form>
      <div class="ais-actions">
        <!--  TIPS:根据产品增删功能按钮  -->
          <span>
          </span>
      </div>
      <section class="common-section">
        <div class="common-section-body">
          <div class="common-section-table"><vxe-table
            ref="table"
            :data="tableData"
            stripe
            resizable
            border="inner"
            size="medium"
            height="auto"
            width="1000px"
            min-height="300px"
            max-height="500px"
          >
            <vxe-column field="checkbox" title="补货数量" align="center" width="15%">
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
            <vxe-column field="modelName" title="车型" align="center" width="200" />
            <vxe-column field="warehouseName" title="整车仓库" align="center" width="240" />
            <vxe-column field="inventoryStatus" title="库存状态" align="center" width="140">
              <template v-slot="{ row }">
                <span>{{ row.inventoryStatus }}</span>
              </template>
            </vxe-column>
            <vxe-column field="materialsDesc" title="物料描述" align="center" width="340" />
            <vxe-column field="optionPackageName" title="选装包" align="center" width="140" />
          </vxe-table>
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
        <el-form-item label="结算资金类型：" prop="fundType">
          <el-select
            v-model="fundForm.fundType"
            clearable
            filterable
            placeholder="请选择结算资金类型"
          >
            <el-option
              v-for="item in settleAccountList"
              :key="item.fundType"
              :label="item.fundTypeLabel"
              :value="item.fundType"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>

import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { listCanSettleAccount } from '@/api/vehwholesale/fund/account/index';
import { getEnum } from '@/api/common';
import { queryPlantWholesaleInStockInventory, plantWholesaleInStockCreateApply } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApply/index';

// import FetchSelect from '@/libs/components/FetchSelect';
import permissions from '@/libs/mixins/permissions';
// import TagInput from '@/libs/components/TagInput';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  seriesId: '', // 车系ID
  modelId: '', // 车型ID
  yearTypeId: '', // 年款ID
  exteriorId: '', // 外观ID
  interiorId: '', // 内饰ID
  wheelHubId: '', // 轮毂ID
  warehouseCode: '', // 整车仓库编码
  optionPackageId: '', // 选装包ID
  materialsDesc: '', // 物料描述
};
// 测试数据
const mockInStockInventoryData = [
  {
    seriesId: '9C9D922E-0543-EE11-B13B-CAB212903EA5',
    modelId: '101',
    yearTypeId: '2023',
    exteriorId: 'red',
    interiorId: 'C298D93A-6ACA-F011-B0B8-D75101E5D01E',
    wheelHubId: 'hub1',
    warehouseCode: 'WH001',
    optionPackageId: 'pkg1',
    materialsDesc: '豪华版红色轿车配黑色内饰',
    modelName: '奥迪A4',
    warehouseName: '上海仓库',
    inventoryStatus: '在库',
    optionPackageName: '豪华包',
    applyQty: 0
  },
  {
    seriesId: '9C9D922E-0543-EE11-B13B-CAB212903EA5',
    modelId: '102',
    yearTypeId: '2023',
    exteriorId: 'F75370E5-21A5-EE11-B156-E3C14957A562',
    interiorId: 'C298D93A-6ACA-F011-B0B8-D75101E5D01Ebeige',
    wheelHubId: 'hub2',
    warehouseCode: 'WH001',
    optionPackageId: 'pkg2',
    materialsDesc: '标准版白色SUV配米色内饰',
    modelName: '奥迪Q5',
    warehouseName: '上海仓库',
    inventoryStatus: '在途',
    optionPackageName: '舒适包',
    applyQty: 0
  },
  {
    seriesId: '2',
    modelId: '2187156E-CB55-EE11-B144-ADA35F92B08E',
    yearTypeId: '2024',
    exteriorId: 'F75370E5-21A5-EE11-B156-E3C14957A562',
    interiorId: 'black',
    wheelHubId: 'hub3',
    warehouseCode: 'WH002',
    optionPackageId: 'pkg1',
    materialsDesc: '运动版黑色轿车配全黑内饰',
    modelName: '宝马3系',
    warehouseName: '北京仓库',
    inventoryStatus: '在库',
    optionPackageName: '运动包',
    applyQty: 0
  },
  {
    seriesId: '2',
    modelId: '2187156E-CB55-EE11-B144-ADA35F92B08E',
    yearTypeId: '2024',
    exteriorId: 'blue',
    interiorId: 'white',
    wheelHubId: 'hub1',
    warehouseCode: 'WH002',
    optionPackageId: 'pkg3',
    materialsDesc: '旗舰版蓝色SUV配白色内饰',
    modelName: '宝马X5',
    warehouseName: '北京仓库',
    inventoryStatus: '预留',
    optionPackageName: '旗舰包',
    applyQty: 0
  },
  {
    seriesId: '3',
    modelId: '301',
    yearTypeId: '2023',
    exteriorId: 'F75370E5-21A5-EE11-B156-E3C14957A562',
    interiorId: 'gray',
    wheelHubId: 'hub2',
    warehouseCode: 'WH003',
    optionPackageId: 'pkg2',
    materialsDesc: '经典版银色轿车配灰色内饰',
    modelName: '奔驰C级',
    warehouseName: '广州仓库',
    inventoryStatus: '在库',
    optionPackageName: '经典包',
    applyQty: 0
  }
];
export default {
  name: 'vehicleWholesaleDialog',
  props: {
  },
  mixins: [permissions],
  components: {
    // TagInput,
    // FetchSelect,
    PageSearchAction
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
      settleAccountList: []
    };
  },
  computed: {
    filterFields () {
      return [
        { key: 'seriesId', label: '车系：', optionsKey: 'seriesList' },
        { key: 'modelId', label: '车型：', optionsKey: 'modelList' },
        { key: 'yearTypeId', label: '年款：', optionsKey: 'yearTypeList' },
        { key: 'exteriorId', label: '外观：', optionsKey: 'exteriorList' },
        { key: 'interiorId', label: '内饰：', optionsKey: 'interiorList' },
        { key: 'wheelHubId', label: '轮毂：', optionsKey: 'wheelHubList' },
        { key: 'optionPackageId', label: '选装包：', optionsKey: 'optionPackageList' },
        { key: 'warehouseCode', label: '整车仓库：', optionsKey: 'warehouseList' }
      ];
    },
    visibleFilterFields () {
      return this.filterFields.slice(0, 3);
    },
    hiddenFilterFields () {
      return this.filterFields.slice(3);
    }
  },
  methods: {
    filterTableData () {
      let filteredData = [...this.originalTableData];

      // 下拉框过滤条件
      const filters = {
        seriesId: 'seriesId',
        modelId: 'modelId',
        yearTypeId: 'yearTypeId',
        exteriorId: 'exteriorId',
        interiorId: 'interiorId',
        wheelHubId: 'wheelHubId',
        optionPackageId: 'optionPackageId',
        warehouseCode: 'warehouseCode'
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
    },
    handleApplyQtyChange (row, value) {
      const intValue = Math.max(0, Math.floor(value || 0));
      row.applyQty = intValue;
    },
    listCanSettleAccount () {
      listCanSettleAccount({}).then(res => {
        console.log('listCanSettleAccount:', res);
        this.settleAccountList = res || [];
      }).catch(err => { console.log(err); });
    },
    queryPlantWholesaleInStockInventory () {
      queryPlantWholesaleInStockInventory({}).then(res => {
        console.log('queryPlantWholesaleInStockInventory:', res);
        this.tableData = [{
          inventoryStatus: '1'
        }, {
          inventoryStatus: '2'
        }];
        // this.tableData = res.inStockInventoryDtoList;
        console.log('this.tableData:', this.tableData);
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
        console.log('res:', res);
        const data = res || {};
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
        // this.originalTableData = data.inStockInventoryDtoList || [];
        this.originalTableData = mockInStockInventoryData;
        this.tableData = [...this.originalTableData];
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },

    dialogshow () {
      this.getData();
      this.listCanSettleAccount();
      this.getEnum();
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
          let materialsList = this.tableData.filter(row => row.applyQty > 0);
          let params = {
            fundAccountId: this.fundForm.fundType,
            materialsList: materialsList.map(ele => {
              return {
                warehouseCode: ele.warehouseCode,
                materialDesc: ele.materialDesc,
                applyQty: ele.applyQty
              };
            })
          };
          plantWholesaleInStockCreateApply(params).then(res => {
            this.submitLoading = false;
            this.dialogVisible = false;
            this.$emit('callParentMethod');
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
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
</style>
