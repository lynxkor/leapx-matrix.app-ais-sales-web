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
        <el-form-item label="VIN：">
          <el-input v-model="form.materialsDesc" clearable placeholder="请输入" @blur="filterTableData"/>
        </el-form-item>
        <el-form-item label="">
          <el-button :loading="loading" size="medium" type="primary" plain class="btn-search" @click="onSubmit">查询</el-button>
          <el-button size="medium" class="btn-reset" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
      <section class="common-section">
        <div class="common-section-body">
          <div class="common-section-table">
           <LPVxeTable
            ref="tableRef"
            v-loading="loading"
            is-checkbox
            is-page
            checkboxFixed
            centralized
            :option-obj="optionObj"
            :get-config="getConfig"
            :save-or-update="saveOrUpdate"
            @paginationChange="paginationChange"
            @handleSelect="handleSelectionChange"
          >
          </LPVxeTable>
          </div>
        </div>
      </section>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { listCanSettleAccount } from '@/api/vehwholesale/fund/account/index';
import { getTableConfig, tableAddOrUpdate, getEnum } from '@/api/common';
import { plantWholesaleInStockCreateApply } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApply/index';
import { getList, vinAllocateVehicleQueryInventory } from '@/api/vehwholesale/entorder/entVehicleOrder/index';
import permissions from '@/libs/mixins/permissions';
import { LPVxeTable } from '@leapmotor/design';
const pageSize = 20;
const mockConfig = {
  data: null
};
const defaultForm = {

};
export default {
  name: 'vinAllocateVehicle',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cancelIds: {
      type: Array,
      default: () => []
    }
  },
  mixins: [permissions],
  components: {
    LPVxeTable
  },
  data () {
    return {
      title: '企业客户整车订单配车',
      moduleKey: 'AISVW-entVehicleOrder',
      loading: false,
      submitLoading: false,
      show: false,
      form: {
        ...defaultForm
      },
      tableData: [],
      originalTableData: [],
      optionObj: {
        id: 'entVehicleOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'vin', label: 'VIN码', visible: true, width: 200 },
          { props: 'materialsCode', label: '整车物料编码', visible: true, width: 200 },
          { props: 'materialsDesc', label: '物料描述', visible: true, width: 200 },
          { props: 'orderCategorLabel', label: '销售预留', visible: true, width: 200 },
          { props: 'needAutoAllocateCarLabel', label: '销售部预留类型', visible: true, width: 200 },
          { props: 'createTime', label: '整车物料预留', visible: true, width: 200 },
          { props: 'logisticsReservedLabel', label: '整车物流预留类型', visible: true, width: 200 },
          { props: 'vehicleDeliveryStatusLabel', label: '车辆交付状态', visible: true, width: 200 },
          { props: 'inboundDateTime', label: 'VDC入库时间', visible: true, width: 200 }
        ],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ],
      // 添加分页相关数据
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
    };
  },
  created () {
    this.getData();
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible;
      },
      set (val) {
        this.$emit('update:visible', val);
      }
    },
    // // 计算当前页数据
    currentTableData () {
      const start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
      const end = start + this.pagination.pageSize;
      return this.tableData.slice(start, end);
    }
  },
  methods: {
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
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
    filterTableData () {
      let filteredData = [...this.originalTableData];

      // 下拉框过滤条件
      const filters = {
        seriesId: 'seriesId',
        modelId: 'modelId'
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
    listCanSettleAccount () {
      // 这里只能查出20条
      // 厂端不允许点开查询的 但是产品坚持要可以打开在最后一步骤提交校验
      listCanSettleAccount({}).then(res => {
        this.settleAccountList = res || [];
      }).catch(err => { console.log(err); });
    },
    handleClose () {
      this.form = { ...defaultForm }; // 重置表单数据
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
    getData () {
      this.loading = true;
      this.selectionList = [];
      vinAllocateVehicleQueryInventory({
        vin: '',
        entOrderId: 1
      })
        .then(res => {
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
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
  }
};
</script>

<style lang="scss" scoped>

</style>
