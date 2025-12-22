<template>
  <el-dialog :title="title" width="1000px" :visible.sync="dialogVisible">
    <div class="page-common m-account-list">
      <h3 class="header-title">母公司名称:</h3>
      <section class="common-section">
        <div class="common-section-body">
          <div class="common-section-table">
            <expand-table
              ref="expandTable"
              :columns="columns"
              :data="tableData"
              :dynamicButtons="dynamicButtons"
              :show-toolbar="false"
            />
          </div>
        </div>
      </section>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm" :loading="submitLoading">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>

import debounce from 'lodash.debounce';
import expandTable from '@/libs/components/expandTable';
import { getList, setEntOrderSettleFlag, setSettleSort } from '@/api/vehwholesale/fund/account/index';
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
  createTime: ''
};
const pageSize = 20;
export default {
  name: 'setSettleSort',
  props: {
    pageTpye: {
      type: String,
      default: ''
    },
    parentOrg: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    expandTable
  },
  data () {
    return {
      title: '设置结算顺序',
      entOrderQuota: null,
      moduleKey: 'AISVW-dealerFundAccount',
      total: 0,
      loading: false,
      submitLoading: false,
      show: false,
      dialogVisible: false,
      innerVisible: false,
      form: {
        ...defaultForm
      },
      columns: [
        { field: 'fundTypeLabel', title: '资金类型', width: 120 },
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
          resolve(data);
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
    setEntOrderSettleFlag (val) {
      let params = {
        ids: this.selectionList.map(item => item.id),
        allowEntOrderSettle: val
      };
      setEntOrderSettleFlag(params).then(res => {
        this.$message.success('批量关闭成功');
        this.getData();
      }).catch(() => {});
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });
      return data;
    },
    getData () {
      this.loading = true;
      this.selectionList = [];
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.tableData = res.records;
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),

    dialogshow () {
      this.dialogVisible = true;
      this.getData();
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
            settleSort: index
          };
        });
        setSettleSort({ settleSortItems: settleSortItems }).then(res => {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.dialogVisible = true;
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
.header-title {
  padding-bottom: 20px;
}
</style>
