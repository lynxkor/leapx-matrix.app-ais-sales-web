<template>
  <el-dialog
    class="m-materials-dialog"
    title="选择物料配置"
    width="1200px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
    append-to-body
    :z-index="2002"
  >
      <el-form
        ref="searchForm"
        :model="searchForm"
        label-width="120px"
        :inline="true"
        size="small"
        label-position="right"
        class="ais-search-form"
      >
      <el-form-item label="车系：">
        <fetch-select
          v-model="searchForm.seriesId"
          v-bind="selectOptions"
          :remote-method="remoteMethods.series"
        />
      </el-form-item>
      <el-form-item label="车型：">
        <fetch-select
          v-model="searchForm.modelId"
          v-bind="selectOptions"
          :remote-method="remoteMethods.model"
        />
      </el-form-item>
        <el-form-item label="年款：">
          <fetch-select
            v-model="searchForm.yearTypeId"
            v-bind="selectOptions"
            :remote-method="remoteMethods.yearType"
          />
        </el-form-item>
        <el-form-item label="外观：">
          <fetch-select
            v-model="searchForm.exteriorId"
            v-bind="selectOptions"
            :remote-method="remoteMethods.exterior"
          />
        </el-form-item>
        <el-form-item label="内饰：">
          <fetch-select
            v-model="searchForm.interiorId"
            v-bind="selectOptions"
            :remote-method="remoteMethods.interior"
          />
        </el-form-item>
        <el-form-item label="车顶：">
          <fetch-select
            v-model="searchForm.roofId"
            v-bind="selectOptions"
            :remote-method="remoteMethods.roof"
          />
        </el-form-item>
        <el-form-item label="轮毂：">
          <fetch-select
            v-model="searchForm.wheelHubId"
            v-bind="selectOptions"
            :remote-method="remoteMethods.wheel"
          />
        </el-form-item>
        <el-form-item label="选装包：">
          <fetch-select
            v-model="searchForm.optionPackageId"
            v-bind="selectOptions"
            :remote-method="remoteMethods.optional"
          />
        </el-form-item>
        <el-form-item label="物料编码：">
          <el-input v-model="searchForm.materialsCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="物料描述：">
          <el-input v-model="searchForm.materialsDesc" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
          <el-button size="small" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

    <div class="page-common m-account-list">
      <div class="table-container">
        <vxe-table
          ref="materialTable"
          :data="materialList"
          height="300"
          :radio-config="{ highlight: true }"
          @radio-change="handleRadioChange"
        >
          <vxe-column type="radio" width="60" align="center"></vxe-column>
          <vxe-column field="materialsCode" title="物料编码" width="200" show-overflow-tooltip></vxe-column>
          <vxe-column field="materialsDesc" title="物料描述" min-width="360" show-overflow-tooltip></vxe-column>
          <vxe-column field="vehiclePrice" title="定价" width="120"></vxe-column>
          <vxe-column field="deposit" title="定金" width="120"></vxe-column>
          <vxe-column field="seriesName" title="车系" width="120"></vxe-column>
          <vxe-column field="modelName" title="车型" width="120"></vxe-column>
          <vxe-column field="yearTypeName" title="年款" width="100"></vxe-column>
          <vxe-column field="exteriorName" title="外观" width="120"></vxe-column>
          <vxe-column field="interiorName" title="内饰" width="120"></vxe-column>
          <vxe-column field="wheelHubName" title="轮毂" width="120"></vxe-column>
          <vxe-column field="optionPackageName" title="选装包" width="120"></vxe-column>
          <vxe-column field="roofName" title="车顶" width="120"></vxe-column>
          <!-- <vxe-column field="batteryCellName" title="电池电芯" width="120"></vxe-column> -->
        </vxe-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 10px; text-align: right;"
        />
      </div>
    </div>

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" :disabled="!selectedRow" @click="confirmSelection">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { allowConfigChangeSkuPage, changeOrderMaterials } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import {
  vehicleSeriesList,
  listVehicleModel,
  listVehicleYearType,
  vehicleExterior,
  vehicleInterior,
  vehicleWheelHub,
  vehicleOptionPackage,
  vehicleRoof,
  vehicleBatteryCell
} from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultSearchForm = {
  seriesId: '',
  modelId: '',
  yearTypeId: '',
  exteriorId: '',
  interiorId: '',
  roofId: '',
  wheelHubId: '',
  optionPackageId: '',
  materialsCode: '',
  materialsDesc: ''
};

export default {
  name: 'MaterialsDialog',
  props: {
    useExternalConfirm: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: null
    }
  },
  components: {
    FetchSelect
  },
  data () {
    return {
      dialogVisible: false,
      searchForm: { ...defaultSearchForm },
      materialList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      selectedRow: null, // 修改为单选模式
      seriesOptions: [],
      modelOptions: [],
      yearTypeOptions: [],
      exteriorOptions: [],
      interiorOptions: [],
      wheelHubOptions: [],
      optionPackageOptions: [],
      roofOptions: [],
      batteryCellOptions: [],
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        multiple: false,
        collapseTags: false,
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
        roof: async (query) => {
          return await vehicleRoof({ roofNameLike: query });
        }
      },
    };
  },
  methods: {
    // 车型支持车系 ID 和 车型输入 方法
    async searchModel (query) {
      const params = {};
      if (query) {
        params.modelNameLike = query;
      }
      if (this.searchForm.seriesId) {
        params.seriesId = this.searchForm.seriesId;
      }

      return await listVehicleModel(params);
    },
    // 打开对话框
    show () {
      this.dialogVisible = true;
      console.log('MaterialsDialog show, this.row:', this.row, 'depositAmount:', this.row?.depositAmount);
      this.$nextTick(() => {
        this.loadData();
      });
      // this.loadDropdownOptions();
    },

    // 关闭对话框
    close () {
      this.dialogVisible = false;
    },

    // 对话框关闭后的回调
    closed () {
      this.searchForm = { ...defaultSearchForm };
      this.materialList = [];
      this.selectedRow = null;
      this.currentPage = 1;
      this.total = 0;
      this.$refs.searchForm && this.$refs.searchForm.resetFields();
    },
    // 加载物料数据
    async loadData () {
      try {
        const params = {
          ...this.searchForm,
          deposit: this.row?.depositAmount || null,
          paymentTime: this.row?.paymentTime || null,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        };

        // 过滤掉空值参数
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key];
          }
        });

        const res = await allowConfigChangeSkuPage(params);
        this.materialList = res.records || [];
        this.total = res.totals || 0;
      } catch (error) {
        this.$message.error('获取物料列表失败');
      }
    },

    // 查询
    handleSearch () {
      this.currentPage = 1;
      this.loadData();
    },

    // 重置
    handleReset () {
      this.searchForm = { ...defaultSearchForm };
      this.currentPage = 1;
      this.loadData();
    },

    // 页大小改变
    handleSizeChange (val) {
      this.pageSize = val;
      this.loadData();
    },

    // 当前页改变
    handleCurrentChange (val) {
      this.currentPage = val;
      this.loadData();
    },

    // 单选事件
    handleRadioChange ({ row }) {
      this.selectedRow = row;
    },

    // 确认选择
    confirmSelection () {
      if (!this.selectedRow) {
        this.$message.warning('请勾选一条物料记录');
        return;
      }
      if (this.useExternalConfirm) {
        this.$emit('confirm', this.selectedRow);
        this.close();
      } else {
        // 组件内部处理提交逻辑
        this.handleInternalSubmit();
      }
    },

    // 内部提交处理方法
    async handleInternalSubmit () {
      // 这里可以添加内部提交逻辑
      // 例如调用某个 API 接口保存选择的物料
      const params = {
        orderInfoId: this.row.id,
        changeProductSkuPriceId: this.selectedRow.id,
      };
      await changeOrderMaterials(params);

      // 显示成功消息
      this.$message.success('物料选择成功');

      // 关闭对话框
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.m-materials-dialog {
  .table-container {
    margin-top: 20px;
  }

  ::v-deep .el-input--small {
    width: 215px;
  }
  ::v-deep .el-form-item {
    margin-bottom: 12px;
    margin-right: 15px;
  }

  .dialog-footer {
    text-align: right;
  }
}
</style>
