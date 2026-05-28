<template>
  <section class="common-section">
    <div class="common-section-header">
      <div class="ais-select-group">
        <el-form :inline="true" :model="form" size="small" label-position="right" label-width="80px" class="form-edit">
          <el-form-item label="物料编码：">
                <tag-input v-model="form.materialsCodeSet" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="物料描述：">
              <tag-input v-model="form.materialsDescSet" placeholder="请输入" />
            </el-form-item>
          <template v-if="show">
            <el-form-item label="车系：">
              <fetch-select
                v-model="form.seriesIds"
                v-bind="selectOptions"
                :remote-method="remoteMethods.series"
              />
            </el-form-item>
            <el-form-item label="车型：">
              <fetch-select
                v-model="form.modelIdSet"
                v-bind="selectOptions"
                :remote-method="remoteMethods.model"
              />
            </el-form-item>
            <el-form-item label="年款：">
              <fetch-select
                v-model="form.yearTypeIdSet"
                v-bind="selectOptions"
                :remote-method="remoteMethods.yearType"
              />
            </el-form-item>
            <el-form-item label="外观：">
              <fetch-select
                v-model="form.exteriorIdSet"
                v-bind="selectOptions"
                :remote-method="remoteMethods.exterior"
              />
            </el-form-item>
            <el-form-item label="内饰：">
              <fetch-select
                v-model="form.interiorIdSet"
                v-bind="selectOptions"
                :remote-method="remoteMethods.interior"
              />
            </el-form-item>
            <el-form-item label="车顶：">
              <fetch-select
                v-model="form.roofIdSet"
                v-bind="selectOptions"
                :remote-method="remoteMethods.roof"
              />
            </el-form-item>
            <el-form-item label="轮毂：">
              <fetch-select
                v-model="form.wheelHubIdSet"
                v-bind="selectOptions"
                :remote-method="remoteMethods.wheel"
              />
            </el-form-item>
            <el-form-item label="选装包：">
              <fetch-select
                v-model="form.optionPackageIdSet"
                v-bind="selectOptions"
                :remote-method="remoteMethods.optional"
              />
            </el-form-item>
          </template>
          <page-search-action v-model="show" is-expandable :loading="loading" @submit="onSubmit" @reset="onReset" />
        </el-form>
      </div>
    </div>
    <section class="common-section">
      <div class="common-section-body">
        <div class="common-section-table">
          <vxe-table
            ref="table"
            :data="tableData"
            stripe
            resizable
            border="inner"
            size="medium"
            width="1000px"
            min-height="300px"
            max-height="800px"
            :checkbox-config="{ checkField: 'checked' }"
          >
            <vxe-column field="checkbox" title="数量" align="center" width="140">
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
            <vxe-column
              v-for="column in columns"
              :key="column.field || column.title"
              v-bind="column"
            />
          </vxe-table>
          <el-pagination
            @size-change="sizeChange"
            @current-change="pageChange"
            :current-page="optionObj.form.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="optionObj.form.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </section>
  </section>
</template>

<script>

import debounce from 'lodash.debounce';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/datacenter/materials/vehicleMaterials/index';
import { getEnum, vehicleSeriesList, listVehicleYearType, listVehicleModel, vehicleExterior, vehicleInterior, vehicleWheelHub, vehicleOptionPackage, vehicleBatteryCell, vehicleSalesVersionList, vehicleRoof } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import permissions from '@/libs/mixins/permissions';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  status: 1,
  seriesIds: [],
  materialsCodeSet: [],
  materialsDescSet: [],
  modelIdSet: [],
  yearTypeIdSet: [],
  exteriorIdSet: [],
  interiorIdSet: [],
  wheelHubIdSet: [],
  roofIdSet: [],
  optionPackageIdSet: [],
  batteryCellName: '',
  allowWholesale: '',
  allowProductionSchedule: '',
  allowDisplayVehicleWholesale: '',
  allowTestDriveVehicleWholesale: '',
  allowCustomerSales: '',
  allowWholesaleConfirm: '',
  allowConfigurationModify: '',
  discontinueStatus: ''
};
const pageSize = 20;
export default {
  name: 'AddCommercialVehicle',
  props: {
    orderCategory: {
      type: [String, Number],
      default: ''
    }
  },
  mixins: [permissions],
  components: {
    TagInput,
    FetchSelect,
    PageSearchAction
  },
  created () {
    this.dialogshow();
  },
  data () {
    return {
      title: '厂端现车批售',
      moduleKey: '',
      tableList: [],
      total: 0,
      loading: false,
      show: false,
      form: {
        ...defaultForm
      },
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      // 远程搜索方法
      remoteMethods: {
        series: async (query) => {
          return await vehicleSeriesList({ seriesNameLike: query });
        },
        // 初始方法
        model: async (query) => {
          return await this.searchModel(query);
        },
        yearType: async (query) => {
          return await listVehicleYearType({ yearTypeNameLike: query });
        },
        exterior: async (query) => {
          return await vehicleExterior({ exteriorNameLike: query });
        },
        interior: async (query) => {
          return await vehicleInterior({ interiorNameLike: query });
        },
        wheel: async (query) => {
          return await vehicleWheelHub({ wheelHubNameLike: query });
        },
        optional: async (query) => {
          return await vehicleOptionPackage({ optionPackageNameLike: query });
        },
        battery: async (query) => {
          return await vehicleBatteryCell({ batteryCellNameLike: query });
        },
        announcement: async (query) => {
          return await vehicleSalesVersionList({ registeredModelNameLike: query });
        },
        roof: async (query) => {
          return await vehicleRoof({ roofNameLike: query });
        }
      },
      columns: [
        { field: 'yearTypeName', title: '年款', width: 120 },
        { field: 'seriesName', title: '车系', width: 120 },
        { field: 'modelName', title: '车型', width: 200 },
        { field: 'optionPackageName', title: '选装包', width: 120 },
        { field: 'materialsDesc', title: '物料描述', width: 400 },
        { field: 'exteriorName', title: '外观', width: 200 },
        { field: 'interiorName', title: '内饰', width: 200 },
        { field: 'wheelHubName', title: '轮毂', width: 200 },
        { field: 'roofName', title: '车顶', width: 200 },
        { field: 'materialsCode', title: '物料编码', width: 200 },
      ],
      optionObj: {
        form: {
          page: 1,
          size: pageSize
        }
      },
      tableData: [{}]
    };
  },
  methods: {
    // 车型支持车系 ID 和 车型输入 方法
    async searchModel (query) {
      const params = {};
      if (query) {
        params.modelNameLike = query;
      }
      if (this.form.seriesIdList?.length) {
        params.seriesIds = this.form.seriesIdList;
      }

      return await listVehicleModel(params);
    },
    handleApplyQtyChange (row, value) {
      // 检查父组件传入的订单分类，如果为试驾车则最大数量为1
      let maxValue = 999; // 默认最大值
      if (this.orderCategory === '2' || this.orderCategory === 2) { // '2' 代表试驾车
        maxValue = 1;
      }

      const intValue = Math.max(0, Math.min(Math.floor(value || 0), maxValue));
      row.applyQty = intValue;

      if (row.id) {
        const existingIndex = this.tableList.findIndex(item => item.id === row.id);
        if (intValue > 0) {
          if (existingIndex >= 0) {
            // 更新现有记录
            this.$set(this.tableList, existingIndex, { ...row });
          } else {
            // 添加新记录
            this.tableList.push({ ...row });
          }
        } else {
          // 删除 applyQty 为 0 的记录
          if (existingIndex >= 0) {
            this.tableList.splice(existingIndex, 1);
          }
        }
      }
    },
    // 在获取数据后恢复 tableList 中的 applyQty 值
    restoreApplyQtyFromTableList (records) {
      return records.map(item => {
        item.materialsId = item.id;
        const existingItem = this.tableList.find(t => t.id === item.id);
        if (existingItem) {
          item.applyQty = existingItem.applyQty;
        } else {
          item.applyQty = 0;
        }
        return item;
      });
    },
    handleClose () {
      this.form = { ...defaultForm }; // 重置表单数据
      this.tableData = []; // 清空表格数据
      this.columns = []; // 清空列配置
    },
    pageChange (page) {
      this.optionObj.form.page = page;
      this.debouncedGetData();
    },
    sizeChange (size) {
      this.optionObj.form.size = size;
      this.debouncedGetData();
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });
      if (this.orderCategory) {
        delete data.orderCategory;
        const category = String(this.orderCategory);
        if (category === '0') data.allowProductionSchedule = '1';
        if (category === '20') data.allowDisplayVehicleWholesale = '1';
        if (category === '2') data.allowTestDriveVehicleWholesale = '1';
      }
      if (data.materialsCodeSet && data.materialsCodeSet.length === 1) {
        data.materialsCodeLike = data.materialsCodeSet[0];
        data.materialsCodeSet = [];
      }
      if (data.materialsDescSet && data.materialsDescSet.length === 1) {
        data.materialsDescLike = data.materialsDescSet[0];
        data.materialsDescSet = [];
      }
      return data;
    },
    getData () {
      this.loading = true;
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.tableData = this.restoreApplyQtyFromTableList(res.records);
          this.total = res.totals;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),

    dialogshow () {
      if (this.orderCategory) {
        this.getData();
      }
    },
    confirm () {
      this.$refs.editTable.clearSelection();
      this.$emit('confirm', this.form);
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
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
::v-deep .dialog-footer {
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
}
/* 输入框居中样式 */
.centered-input {
  display: flex;
  justify-content: center;
  align-items: center;
}
  ::v-deep .el-input-number {
    width: 100%;
  }
</style>
