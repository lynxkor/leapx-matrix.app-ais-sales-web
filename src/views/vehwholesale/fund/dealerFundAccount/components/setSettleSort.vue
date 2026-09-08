<template>
  <el-dialog :title="title" width="75%" :visible.sync="dialogVisible">
    <el-form :inline="true" size="small" class="company-filter">
      <el-form-item label="母公司">
        <el-select
          v-model="selectedCompanyCode"
          placeholder="请选择母公司"
          filterable
          :disabled="parentCompanyList.length === 0"
          @change="handleCompanyChange"
        >
          <el-option
            v-for="item in parentCompanyList"
            :key="item.dealerCompanyCode"
            :label="item.dealerCompanyName"
            :value="item.dealerCompanyCode"
          />
        </el-select>
      </el-form-item>
      <span v-if="parentCompanyList.length === 0" class="company-empty-tip">未查询到挂靠母公司</span>
    </el-form>
    <section class="common-section">
      <div class="common-section-body">
        <div class="common-section-table">
          <expand-table
            ref="expandTable"
            :columns="columns"
            :data="tableData"
            :auth="{
              add: false,
              edit: false,
              delete: false,
            }"
            :dragSort=" true"
            :dynamicButtons="dynamicButtons"
            :show-toolbar="false"
          />
        </div>
      </div>
    </section>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="confirm" :loading="submitLoading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import expandTable from '@/libs/components/expandTable';
import { getList, setSettleSort } from '@/api/vehwholesale/fund/account/index';
import { getEnum } from '@/api/common';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  dealerCompanyNames: [],
  financialOrganizationId: '',
  dealerCompanyNameLike: '',
  fundAccountCode: '',
  dealerCompanyCode: '',
  dealerCompanyName: '',
  fundType: '',
  financialOrganizationName: '',
  settleSort: '',
  allowUseRebate: '',
  allowEntOrderSettle: '',
  entOrderQuota: '',
  availableBalance: '',
  frozenBalance: '',
  totalRechargeAmount: '',
  totalSettleAmount: '',
  lastTradeTime: '',
  saleCompanyId: '',
  createTime: '',
  setRebateFlagQuery: true,
};
const pageSize = 20;
export default {
  name: 'setSettleSort',
  props: {
    pageTpye: {
      type: String,
      default: ''
    },
    dealerCompanyName: {
      type: String
    }
  },
  components: {
    expandTable
  },
  data () {
    return {
      title: '设置结算资金顺序',
      entOrderQuota: null,
      moduleKey: 'AISVW-dealerFundAccount',
      total: 0,
      loading: false,
      submitLoading: false,
      show: false,
      dialogVisible: false,
      innerVisible: false,
      // 母公司下拉筛选项：key=dealerCompanyCode, value=dealerCompanyName
      parentCompanyList: [],
      // 当前选中的母公司编码
      selectedCompanyCode: '',
      // 当前用户全部资金账户（用于按母公司筛选）
      allRecords: [],
      form: {
        ...defaultForm
      },
      columns: [
        { field: 'fundTypeLabel', title: '资金类型', width: 120 },
        // { field: 'settleSort', title: '顺序', width: 120 },
        { field: 'financialOrganizationName', title: '金融机构', width: 120 },
        { field: 'availableBalance', title: '可用余额', width: 160 },
        { field: 'dealerCompanyName', title: '母公司名称', width: 260 },
        { field: 'fundAccountCode', title: '账户编号', width: 260 },
      ],
      dynamicButtons: [
        {
          label: '上移',
          disabled: (row, rowIndex) => rowIndex === 0, // 第一行禁用
          onClick: (row, rowIndex) => {
            this.moveRow(rowIndex, 'up'); // 调用上移方法
          },
          class: 'btn-move-up', // 自定义样式类
        },
        {
          label: '下移',
          disabled: (row, rowIndex) => rowIndex === this.tableData.length - 1,
          onClick: (row, rowIndex) => {
            this.moveRow(rowIndex, 'down'); // 调用下移方法
          },
          class: 'btn-move-down', // 自定义样式类
        }
      ],
      optionObj: {
        form: {
          page: 1,
          size: pageSize
        }
      },
      tableData: [{ fundType: '11' }, { fundType: '22' }],
      fundTypeList: [],
      selectionList: []
    };
  },
  methods: {
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.expandTable.saveAll().then(data => {
          // vxe 的 dragSort 只重排其内部 tableData，不会回写到绑定的 :data，
          // 因此直接读取 vxe 当前“视觉顺序”作为最终提交顺序，确保拖拽生效
          const vxeTable = this.$refs.expandTable && this.$refs.expandTable.$refs.editTable;
          const ordered = (vxeTable && vxeTable.getTableData && vxeTable.getTableData().tableData) || data || [];
          resolve(ordered);
        }).catch(error => {
          reject(error);
        });
      });
    },
    moveRow (index, direction) {
      const data = [...this.tableData]; // 复制表格数据
      if (direction === 'up' && index > 0) {
      // 上移：与上一行交换位置
        [data[index], data[index - 1]] = [data[index - 1], data[index]];
      } else if (direction === 'down' && index < data.length - 1) {
      // 下移：与下一行交换位置
        [data[index], data[index + 1]] = [data[index + 1], data[index]];
      }

      this.tableData = data; // 更新表格数据
    },
    // 分页拉取当前用户的全部资金账户（避免单页截断导致母公司去重不全）
    async fetchAllRecords () {
      const all = [];
      let pageNum = 1;
      const size = 200;
      const fundTypes = [1010, 1050, 2010, 2020, 2030];
      while (true) {
        const res = await getList({ pageNum, pageSize: size, fundTypes: fundTypes, status: 1 });
        const records = (res && res.records) || [];
        all.push(...records);
        const total = (res && res.total) || 0;
        if (records.length === 0 || all.length >= total) break;
        if (pageNum > 20) break; // 安全上限，防止异常死循环
        pageNum++;
      }
      return all;
    },
    // 根据全部记录去重得到母公司下拉，并默认选中第一个
    buildParentCompanyOptions (records) {
      const map = new Map();
      (records || []).forEach(item => {
        const code = item.dealerCompanyCode;
        if (code !== null && code !== undefined && code !== '' && !map.has(code)) {
          map.set(code, item.dealerCompanyName);
        }
      });
      return Array.from(map, ([dealerCompanyCode, dealerCompanyName]) => ({ dealerCompanyCode, dealerCompanyName }));
    },
    // 按当前选中的母公司筛选并排序展示
    filterTableData () {
      const list = (this.allRecords || []).filter(item => item.dealerCompanyCode === this.selectedCompanyCode);
      this.tableData = list.sort((a, b) => {
        const settleSortA = a.settleSort !== null && a.settleSort !== undefined && a.settleSort !== '' ? Number(a.settleSort) : Infinity;
        const settleSortB = b.settleSort !== null && b.settleSort !== undefined && b.settleSort !== '' ? Number(b.settleSort) : Infinity;
        return settleSortA - settleSortB;
      });
    },
    handleCompanyChange () {
      this.filterTableData();
    },
    // 拖拽结束后，将 vxe 内部顺序同步回本地 tableData，
    // 保证后续“上移/下移”按钮与保存顺序口径一致（vxe 不会自动回写 :data）
    onRowDragEnd (params) {
      const idx = (params && params._index) || {};
      const oldIndex = idx.oldIndex;
      const newIndex = idx.newIndex;
      if (oldIndex === null || oldIndex === undefined || newIndex === null || newIndex === undefined || oldIndex === newIndex) return;
      const arr = [...this.tableData];
      if (oldIndex < 0 || oldIndex >= arr.length || newIndex < 0 || newIndex >= arr.length) return;
      const [moved] = arr.splice(oldIndex, 1);
      arr.splice(newIndex, 0, moved);
      this.tableData = arr;
    },
    // 给内部 vxe-table 绑定拖拽结束事件（事件名为 row-dragend，由 vxe 内部 $emit）
    bindDragEvent () {
      const et = this.$refs.expandTable && this.$refs.expandTable.$refs.editTable;
      if (et && et.$on) {
        et.$off('row-dragend', this.onRowDragEnd);
        et.$on('row-dragend', this.onRowDragEnd);
      }
    },
    // 需要防抖场景时使用
    async dialogshow () {
      this.dialogVisible = true;
      this.loading = true;
      try {
        const records = await this.fetchAllRecords();
        this.allRecords = records;
        this.parentCompanyList = this.buildParentCompanyOptions(records);
        // 默认选中第一个；若只有一个母公司则即为该母公司
        this.selectedCompanyCode = this.parentCompanyList.length ? this.parentCompanyList[0].dealerCompanyCode : '';
        this.filterTableData();
      } catch (err) {
        console.error('查询资金账户列表失败:', err);
        this.allRecords = [];
        this.parentCompanyList = [];
        this.selectedCompanyCode = '';
        this.tableData = [];
      } finally {
        this.loading = false;
        // 弹窗挂载后给内部 vxe-table 绑定拖拽结束事件，保证拖动顺序可回写
        this.$nextTick(this.bindDragEvent);
      }
    },
    async confirm (formName, rest = false) {
      try {
        const tableData = await this.handleSaveTable();
        console.log('tableData:', tableData);// 校验 tableData 中的 yearTypeId 是否有重复
        // 增加空值判断：如果 tableData 为空或空数组，禁止提交
        if (!tableData || (Array.isArray(tableData) && tableData.length === 0)) {
          this.$message({
            message: '请至少有一条数据提交',
            type: 'error'
          });
          return;
        }
        this.submitLoading = true;
        const settleSortItems = tableData.map((ele, index) => {
          return {
            id: ele.id,
            settleSort: index + 1
          };
        });
        setSettleSort({ settleSortItems: settleSortItems }).then(res => {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.dialogVisible = false;
          this.$refs.expandTable.clearSelection();
          this.$emit('confirm', this.form);
        }).finally(() => {
          this.submitLoading = false;
        });
      } catch (error) {
        console.log(error);
      }
    },
    // confirm () {
    //   this.dialogVisible = true;
    //   this.$refs.expandTable.clearSelection();
    //   this.$emit('confirm', this.form);
    // },
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
.action-button {
  cursor: pointer;
  &.is-disabled {
    cursor: not-allowed; // 禁用状态下的鼠标样式
    color: #ccc; // 禁用状态下的文字颜色
    pointer-events: none; // 禁止点击事件
  }
}
.company-filter {
  margin-bottom: 8px;
}
.company-empty-tip {
  color: #999;
  font-size: 13px;
  margin-left: 8px;
}
.header-title {
  font-size: 14px;
  font-weight: normal;
  padding-bottom: 20px;
  color: var(--leap-color-default-light-1);
}
</style>
