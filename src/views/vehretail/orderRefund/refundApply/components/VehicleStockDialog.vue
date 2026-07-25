<template>
  <el-dialog
    class="vehicle-stock-dialog"
    title="可用库存车"
    :visible.sync="visible"
    width="90%"
    top="5vh"
  >
    <div class="vehicle-stock-content">
      <div class="table-container">
        <vxe-table
          ref="tableRef"
          v-loading="loading"
          :data="optionObj.dataList"
          stripe
          resizable
          border="inner"
          size="medium"
          min-height="400px"
        >
          <vxe-column
            v-for="col in optionObj.dataProp"
            :key="col.field"
            :field="col.field"
            :title="col.label"
            :width="col.width"
            :fixed="col.fixed"
          >
            <template v-slot:default="{ row }">
              <span
                v-if="col.clickable"
                class="link-text"
                @click="handleCellClick(col.clickable, row)"
              >{{ row[col.field] }}</span>
              <span v-else>{{ row[col.field] }}</span>
            </template>
          </vxe-column>
        </vxe-table>
        <div class="pagination-container">
          <el-pagination
            :current-page="optionObj.form.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="optionObj.form.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="optionObj.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getList } from '@/api/vehstock/vdc/vehicleVdcInventoryLedger/index';
import commonMixins from '@/libs/mixins/commonMixins';

const pageSize = 10;

export default {
  name: 'VehicleStockDialog',
  components: {
  },
  mixins: [commonMixins],
  data () {
    return {
      visible: false,
      loading: false,
      form: {
        materialsCode: '',
        materialsCodeList: []
      },
      optionObj: {
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { field: 'vin', label: 'VIN', width: 180, fixed: 'left', clickable: 'vin' },
          { field: 'materialsCode', label: '整车物料', width: 220 },
          { field: 'materialsDesc', label: '物料描述', width: 500 },
          { field: 'vdcInventoryStatusLabel', label: '车辆库存状态', width: 140 },
          { field: 'vehicleDeliveryStatusLabel', label: '车辆交付状态', width: 140 },
          { field: 'reservedLabel', label: '销售预留', width: 120 },
          { field: 'logisticsReservedLabel', label: '整车物流预留', width: 140 },
          { field: 'carAllocatedLabel', label: '是否配车', width: 120 },
          { field: 'createTime', label: '创建时间', width: 180 }
        ],
        total: 0
      }
    };
  },
  methods: {
    show (materialsCodeList) {
      this.visible = true;
      if (materialsCodeList) {
        this.form.materialsCodeList = materialsCodeList;
      }
      this.$nextTick(() => {
        this.getData();
      });
    },
    hide () {
      this.visible = false;
    },
    getData () {
      this.loading = true;
      const params = {
        materialsCodeList: this.form.materialsCodeList,
        pageNum: this.optionObj.form.page,
        vehicleDeliveryStatus: 3,
        vdcInventoryStatus: 3,
        carAllocated: 0,
        logisticsReserved: 0,
        reserved: 0,
        pageSize: this.optionObj.form.size
      };
      // 过滤空值
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      getList(params)
        .then(res => {
          this.optionObj.dataList = res.records || [];
          this.optionObj.total = res.total || 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSizeChange (val) {
      this.optionObj.form.size = val;
      this.optionObj.form.page = 1;
      this.getData();
    },
    handleCurrentChange (val) {
      this.optionObj.form.page = val;
      this.getData();
    },
    handleCellClick (type, row) {
      if (type === 'vin') {
        // 跳转到 VDC 库存台账详情click: (row) => {
        this.navigateToRoute({
          path: '/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit',
          query: {
            vin: row.vin
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.vehicle-stock-dialog {
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  .vehicle-stock-content {
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
  .table-container {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .pagination-container {
    margin-top: 16px;
    text-align: right;
  }
  .link-text {
    color: var(--leap-color-primary);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
