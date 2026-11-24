<template>
  <div>
  <el-dialog :close-on-click-modal="false" :title="title" width="75%" top="3vh" :visible.sync="dialogVisible" @close="handleClose">
    <div>
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        :inline="true"
        size="small"
        label-position="right"
        class="ais-search-form"
      >
        <el-form-item label="整车仓库：">
          <el-select
            v-model="form.warehouseIds"
            clearable
            filterable
            multiple
            collapse-tags
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
          <tag-input v-model="form.materialsDescSet" placeholder="请输入" @input="filterTableData" />
        </el-form-item>
        <template v-if="show">
        <el-form-item label="车系：">
          <el-select
            v-model="form.seriesIds"
            clearable
            filterable
            multiple
            collapse-tags
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
            v-model="form.modelIds"
            clearable
            filterable
            multiple
            collapse-tags
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
              v-model="form.yearTypeIds"
              clearable
              filterable
              multiple
              collapse-tags
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
              v-model="form.exteriorIds"
              clearable
              filterable
              multiple
              collapse-tags
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
              v-model="form.interiorIds"
              clearable
              filterable
              multiple
              collapse-tags
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
              v-model="form.wheelHubIds"
              clearable
              filterable
              multiple
              collapse-tags
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
              v-model="form.optionPackageIds"
              clearable
              filterable
              multiple
              collapse-tags
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
        <el-form-item label="" class="form-item-action">
          <el-button :loading="loading" size="small" type="primary" plain class="btn-search" @click="onSubmit">查询</el-button>
          <el-button size="small" class="btn-reset" style="font-weight: 400;" @click="onReset">重置</el-button>
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
      <div class="wholesale-tab-btns">
        <el-button size="small" :class="{ 'is-tab-active': activeTab === 'normal' }" @click="switchTab('normal')">现车批售</el-button>
        <el-button size="small" class="special-tab-btn" :class="{ 'is-tab-active': activeTab === 'special' }" @click="switchTab('special')">特供车<i class="hot-badge">Hot</i></el-button>
        <el-button size="small" class="wholesale-export-btn" :loading="exportLoading" @click="exportExcel">导出</el-button>
      </div>
      <div v-show="activeTab === 'normal'">
          <section class="common-section">
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="table"
                  :data="currentTableData"
                  stripe
                  resizable
                  border="inner"
                  size="small"
                  height="auto"
                  width="100%"
                  min-height="200px"
                  max-height="420px"
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
                  <vxe-column field="inventoryStatusText" title="库存状态" align="center" width="160">
                    <template v-slot="{ row }">
                      <span
                        :class="getInventoryStatusClass(row.inventoryStatus)"
                        :title="row.inventoryStatusText"
                      >
                        {{ row.inventoryStatusText }}
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
      </div>
      <div v-show="activeTab === 'special'">
          <section class="common-section">
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="specialTable"
                  :data="currentTableData"
                  stripe
                  resizable
                  border="inner"
                  size="small"
                  height="auto"
                  width="100%"
                  min-height="200px"
                  max-height="420px"
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
                  <vxe-column field="inventoryStatusText" title="库存状态" align="center" width="160">
                    <template v-slot="{ row }">
                      <span
                        :class="getInventoryStatusClass(row.inventoryStatus)"
                        :title="row.inventoryStatusText"
                      >
                        {{ row.inventoryStatusText }}
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
      </div>
      <el-form
        ref="fundForm"
        :model="fundForm"
        :rules="dynamicFundFormRules"
        label-width="120px"
        size="small"
        class="fund-form"
        :inline="true"
      >
        <el-form-item label="结算资金类型：" prop="fundType" v-if="settleAccountList && settleAccountList.length > 0">
          <el-select
            v-model="fundForm.fundType"
            placeholder="请选择结算资金类型"
            clearable
            filterable
            class="fund-type-select"
            @change="handleFundTypeChange"
          >
            <el-option
              v-for="item in fundTypeOptions"
              :key="item.fundType"
              :label="item.fundTypeLabel"
              :value="item.fundType"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="金融机构："
          prop="financialOrganizationId"
          v-if="['2010', '2020', '2030'].includes((fundForm.fundType || '') + '')"
        >
          <el-select
            v-model="fundForm.financialOrganizationId"
            placeholder="请选择金融机构"
            clearable
            filterable
            class="financing-org-select"
          >
            <el-option
              v-for="item in financingOrgOptions"
              :key="item.financialOrganizationId"
              :label="item.financialOrganizationName"
              :value="item.financialOrganizationId"
            />
          </el-select>
        </el-form-item>
        <div class="no-fund-type-section" v-else-if="!settleAccountList || settleAccountList.length === 0">
          <p>暂无可用的结算资金类型</p>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer" style="display: flex; justify-content: space-between; align-items: center;">
      <el-button size="small" @click="fundAccountDialogVisible = true">整车资金账户信息</el-button>
      <div>
        <el-button size="small" @click="handleCancel">取消</el-button>
        <el-button v-if="activeTab === 'normal' || activeTab === 'special'" size="small" type="primary" @click="handleSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </div>
  </el-dialog>
  <fund-account-info-dialog :visible.sync="fundAccountDialogVisible" />
  </div>
</template>

<script>

import { listCanSettleAccount } from '@/api/vehwholesale/fund/account/index';
import { getEnum, exportTable } from '@/api/common';
import { downloadExcel } from '@/libs/utils';
import { queryPlantWholesaleInStockInventory, plantWholesaleInStockCreateApply } from '@/api/vehwholesale/replenish/dealerVehicleReplenishApply/index';
import permissions from '@/libs/mixins/permissions';
import FundAccountInfoDialog from './FundAccountInfoDialog.vue';
import TagInput from '@/libs/components/TagInput';
const defaultForm = {
  // TIPS:多选字段统一用复数命名，值为数组
  seriesIds: [], // 车系ID
  modelIds: [], // 车型ID
  yearTypeIds: [], // 年款ID
  exteriorIds: [], // 外观ID
  interiorIds: [], // 内饰ID
  wheelHubIds: [], // 轮毂ID
  warehouseIds: [], // 整车仓库编码
  optionPackageIds: [], // 选装包ID
  materialsDescSet: [], // 物料描述（多关键词）
};
export default {
  name: 'vehicleWholesaleDialog',
  props: {
  },
  mixins: [permissions],
  components: {
    FundAccountInfoDialog,
    TagInput
    // FetchSelect,
    // PageSearchAction
  },
  data () {
    return {
      title: '厂端现车批售',
      moduleKey: 'AISVW-dealerFundAccount',
      loading: false,
      submitLoading: false,
      exportLoading: false,
      show: false,
      dialogVisible: false,
      form: {
        ...defaultForm
      },
      fundForm: {
        fundType: '',
        financialOrganizationId: ''
      },
      fundFormRules: {
        fundType: [{ required: true, message: '请选择结算资金类型', trigger: 'change' }],
        financialOrganizationId: [{ required: true, message: '请选择金融机构', trigger: 'change' }]
      },
      tableData: [],
      originalTableData: [],
      specialSupplyTableData: [],
      specialSupplyOriginalData: [],
      activeTab: 'normal',
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
      // 二级弹框：整车资金账户信息
      fundAccountDialogVisible: false
    };
  },
  computed: {
    filterFields () {
      return [
        { key: 'warehouseIds', label: '整车仓库：', optionsKey: 'warehouseList' },
        { key: 'seriesIds', label: '车系：', optionsKey: 'seriesList' },
        { key: 'modelIds', label: '车型：', optionsKey: 'modelList' },
        { key: 'yearTypeIds', label: '年款：', optionsKey: 'yearTypeList' },
        { key: 'exteriorIds', label: '外观：', optionsKey: 'exteriorList' },
        { key: 'interiorIds', label: '内饰：', optionsKey: 'interiorList' },
        { key: 'wheelHubIds', label: '轮毂：', optionsKey: 'wheelHubList' },
        { key: 'optionPackageIds', label: '选装包：', optionsKey: 'optionPackageList' },
      ];
    },
    // visibleFilterFields () {
    //   return this.filterFields.slice(0, 2);
    // },
    // hiddenFilterFields () {
    //   return this.filterFields.slice(2);
    // },
    activeTableData () {
      return this.activeTab === 'special' ? this.specialSupplyTableData : this.tableData;
    },
    // // 计算当前页数据
    currentTableData () {
      const start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
      const end = start + this.pagination.pageSize;
      return this.activeTableData.slice(start, end);
    },
    // 资金类型下拉：按 fundType 去重，只显示本名
    fundTypeOptions () {
      const map = new Map();
      for (const item of this.settleAccountList || []) {
        const ft = item.fundType;
        if (ft === undefined || ft === null || map.has(ft)) continue;
        map.set(ft, { fundType: ft, fundTypeLabel: item.fundTypeLabel || '' });
      }
      return Array.from(map.values());
    },
    // 金融机构下拉：当前 fundType 下按 financialOrganizationId 去重
    financingOrgOptions () {
      const ft = this.fundForm.fundType;
      if (ft === undefined || ft === null || ft === '') return [];
      const map = new Map();
      for (const item of this.settleAccountList || []) {
        if (item.fundType !== ft) continue;
        const orgId = item.financialOrganizationId;
        if (!orgId || map.has(orgId)) continue;
        map.set(orgId, {
          financialOrganizationId: orgId,
          financialOrganizationName: item.financialOrganizationName || ''
        });
      }
      return Array.from(map.values());
    },
    // 金融机构校验：仅 2010/2020/2030 时必填
    dynamicFundFormRules () {
      const ftKey = (this.fundForm.fundType || '') + '';
      const needOrg = ['2010', '2020', '2030'].includes(ftKey);
      return {
        fundType: this.fundFormRules.fundType,
        financialOrganizationId: needOrg ? this.fundFormRules.financialOrganizationId : []
      };
    }
  },
  methods: {
    // 厂端现车批售弹框导出：走通用导出按页拉取库存生成 xlsx，筛选条件与弹框一致
    exportExcel () {
      this.exportLoading = true;
      // 前端表单字段 -> 后端分页查询字段（后端按 ID/编码过滤，选装包按ID、物料描述按关键词在内存过滤，口径与弹框一致）
      const reqParams = {
        isSpecialSupply: this.activeTab === 'special' ? 1 : 0,
        seriesIdList: this.form.seriesIds,
        modelIds: this.form.modelIds,
        yearTypeIds: this.form.yearTypeIds,
        exteriorIds: this.form.exteriorIds,
        interiorIds: this.form.interiorIds,
        wheelHubIds: this.form.wheelHubIds,
        optionPackageIds: this.form.optionPackageIds,
        materialsDescSet: this.form.materialsDescSet,
        warehouseCodeList: (this.form.warehouseIds || []).map(id => {
          const w = (this.dropdownOptions.warehouseList || []).find(item => item.id === id);
          return w ? w.warehouseCode || w.code || w.id : id;
        })
      };
      exportTable({
        businessType: '厂端现车批售',
        dataFetchPath: 'vw/web/replenish/dealerVehicleReplenishApply/pagePlantWholesaleInStockInventoryForExport',
        reqParams,
        titleMap: {
          applyQty: '补货数量',
          modelName: '车型',
          warehouseName: '整车仓库',
          inventoryStatusText: '库存状态',
          materialsDesc: '物料描述',
          optionPackageName: '选装包'
        },
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '厂端现车批售.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
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
    handleFundTypeChange (val) {
      // 切换资金类型时清空已选金融机构，避免上个类型残留
      this.fundForm.financialOrganizationId = '';
    },
    switchTab (tab) {
      this.activeTab = tab;
      this.handleTabClick();
    },
    handleTabClick () {
      this.pagination.currentPage = 1;
      this.pagination.total = this.activeTableData.length;
    },
    filterTableData () {
      const source = this.activeTab === 'special' ? this.specialSupplyOriginalData : this.originalTableData;
      let filteredData = [...source];

      // 整车仓库多选：由选中 id 反查 name，按 warehouseName 命中（表格行无 warehouseId）
      if (this.form.warehouseIds && this.form.warehouseIds.length) {
        const names = this.dropdownOptions.warehouseList
          .filter(w => this.form.warehouseIds.includes(w.id))
          .map(w => w.name);
        filteredData = filteredData.filter(item => names.includes(item.warehouseName));
      }

      // 下拉框过滤条件：formKey(复数数组) -> dataKey(行字段)，同字段 OR、字段间 AND
      const filters = {
        seriesIds: 'seriesId',
        modelIds: 'modelId',
        yearTypeIds: 'yearTypeId',
        exteriorIds: 'exteriorId',
        interiorIds: 'interiorId',
        wheelHubIds: 'wheelHubId',
        optionPackageIds: 'optionPackageId'
      };

      // 应用下拉框多选筛选
      Object.entries(filters).forEach(([formKey, dataKey]) => {
        const values = this.form[formKey];
        if (values && values.length) {
          filteredData = filteredData.filter(item => values.includes(item[dataKey]));
        }
      });

      // 应用物料描述多关键词匹配（命中任一即保留，OR）
      if (this.form.materialsDescSet && this.form.materialsDescSet.length) {
        const keywords = this.form.materialsDescSet
          .map(k => String(k).toLowerCase().trim())
          .filter(Boolean);
        if (keywords.length) {
          filteredData = filteredData.filter(item =>
            item.materialsDesc && keywords.some(k => item.materialsDesc.toLowerCase().includes(k))
          );
        }
      }

      if (this.activeTab === 'special') {
        this.specialSupplyTableData = filteredData;
      } else {
        this.tableData = filteredData;
      }
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
      this.fundForm = { fundType: '', financialOrganizationId: '' }; // 重置资金类型表单
      this.tableData = []; // 清空表格数据
      this.specialSupplyTableData = [];
      this.specialSupplyOriginalData = [];
      this.activeTab = 'normal';
      this.pagination = { currentPage: 1, pageSize: 10, total: 0 };
    },
    onSubmit () {
      this.filterTableData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.fundForm = { fundType: '', financialOrganizationId: '' };
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
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async dialogshow () {
      await this.getData();
      await this.getSpecialSupplyData();
      await this.listCanSettleAccount();
      this.dialogVisible = true;
    },
    // 特供车 tab：复用现车批售聚合分组查询，仅加「是否特供车=是」过滤
    async getSpecialSupplyData () {
      try {
        const res = await queryPlantWholesaleInStockInventory({ isSpecialSupply: 1 });
        const data = (res?.data) || res || {};
        this.specialSupplyOriginalData = (data.inStockInventoryDtoList || []).map(item => ({
          ...item,
          applyQty: item.applyQty || 0
        }));
        this.specialSupplyTableData = [...this.specialSupplyOriginalData];
        if (this.activeTab === 'special') {
          this.pagination.total = this.specialSupplyTableData.length;
          this.pagination.currentPage = 1;
        }
      } catch (error) {
        console.error('加载特供车数据失败:', error);
      }
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
        if (!valid) {
          this.$message.error('请完成表单填写');
          return;
        }

        // 按 (fundType, financialOrganizationId) 在 settleAccountList 中反查 fundAccountId
        const ft = this.fundForm.fundType;
        const orgId = this.fundForm.financialOrganizationId || '';
        const ftKey = (ft || '') + '';
        const needOrg = ['2010', '2020', '2030'].includes(ftKey);
        const matched = (this.settleAccountList || []).find(acc => {
          if (acc.fundType !== ft) return false;
          if (needOrg) return acc.financialOrganizationId === orgId;
          return true;
        });
        if (!matched || !matched.id) {
          this.$message.error('未找到对应的结算账户，请重新选择');
          return;
        }

        // 首次提交参数：默认不校验其他账户
        const baseParams = {
          materialsList: this.activeTableData.filter(row => row.applyQty > 0).map(ele => ({
            warehouseCode: ele.warehouseCode,
            materialDesc: ele.materialsDesc,
            applyQty: ele.applyQty
          })),
          fundAccountId: matched.id
        };

        // 异步提交（fire-and-forget，内部用 submitRequest 控制 loading/状态）
        this.submitRequest(baseParams, false);
      });
    },

    /**
     * 提交厂端现车批售补货申请
     * @param {Object} params 请求参数
     * @param {boolean} isRetry 是否为二次重试（带 checkOtherAccountBalance=true）
     */
    async submitRequest (params, isRetry) {
      this.submitLoading = true;
      try {
        const ajaxRes = await plantWholesaleInStockCreateApply(params);
        // 兼容写法参考同文件 getData：jsonPost 已双层解包，ajaxRes 通常就是业务 Resp；为兼容旧 ajaxRes 形态保留 .data 优先
        const resp = (ajaxRes && ajaxRes.data) || ajaxRes || {};

        // 1) 业务成功：关闭弹框 + 通知父组件刷新
        if (resp.success === true) {
          this.$emit('confirm');
          this.dialogVisible = false;
          return;
        }

        // 2) 已重试过仍失败：弹错误 toast 后关闭弹框（用户已二次决策，不再追问）
        if (isRetry) {
          this.$message.error(resp.message || '提交失败');
          this.dialogVisible = false;
          return;
        }

        // 3) 首次失败：弹 是/否 让用户决定是否校验其他账户
        try {
          await this.$confirm(resp.message || '校验失败，是否继续校验其他账户？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          });
          // 选「是」：仅重试 1 次，参数追加 checkOtherAccountBalance=true
          await this.submitRequest({ ...params, checkOtherAccountBalance: true }, true);
        } catch (_) {
          // 选「否」或点 X 关闭：不做事，弹框保留让用户调整结算资金类型
        }
      } catch (err) {
        // axios 拦截器对非 20xx 已弹过 toast，这里只记录
        console.error('提交补货申请失败:', err);
      } finally {
        this.submitLoading = false;
      }
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
// 查询表单 flex 布局 + 按钮组靠右（对齐全局 .page-common .ais-search-form / form-item-action 范式，弹框内需本文件自补）
::v-deep .ais-search-form {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .el-form-item.form-item-action {
    margin-left: auto;
    margin-top: auto;
  }
}
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
  .el-input__inner {
    text-align: center;
  }
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
::v-deep .el-dialog__body {
  padding: 20px 20px 0 20px;
  max-height: 460px;
}
::v-deep .el-form-item__label {
  padding-right: 0;
}

// 厂端现车批售弹框：按钮式切换（现车批售 / 特供车）
.wholesale-tab-btns {
  display: flex;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 12px;
  .el-button + .el-button {
    margin-left: 12px;
  }
  // 导出按钮靠右，与 tab 按钮同一行
  .wholesale-export-btn {
    margin-left: auto;
  }
  .el-button {
    &:hover {
      color: var(--leap-color-primary);
      border-color: var(--leap-color-primary);
      background: #fff;
    }
    &.is-tab-active,
    &.is-tab-active:hover {
      color: #fff;
      background: var(--leap-color-primary);
      border-color: var(--leap-color-primary);
      font-weight: 600;
    }
  }
}
// 特供车按钮：红字 + 右上 Hot 角标
.special-tab-btn {
  position: relative;
  color: var(--leap-color-danger);
  font-weight: 500;
  &:hover {
    color: var(--leap-color-danger);
  }
  &.is-tab-active,
  &.is-tab-active:hover {
    color: #fff;
  }
  .hot-badge {
    position: absolute;
    top: -8px;
    right: -12px;
    padding: 0 5px;
    height: 16px;
    line-height: 16px;
    border-radius: 8px;
    background: var(--leap-color-danger);
    color: #fff;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    white-space: nowrap;
  }
}
</style>
