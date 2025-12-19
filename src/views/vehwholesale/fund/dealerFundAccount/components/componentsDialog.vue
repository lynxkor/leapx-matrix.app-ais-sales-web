<template>
  <el-dialog title="设置企业订单结算" width="1200px" :visible.sync="dialogVisible">
    <div class="page-common m-account-list">
      <el-form
        ref="form"
        :model="form"
        label-width="120px"
        :inline="true"
        size="small"
        label-position="right"
        class="ais-search-form"
      >
        <el-form-item label="母公司名称：">
          <tag-input v-model="form.dealerCompanyNames" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否允许企业订单结算：" class="long_text">
           <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.allowUseRebate"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="资金类型：">
          <fetch-select
            :request="fetchOptions"
            enumCode="vw_fundtype"
            v-model="form.fundTypes"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="金融机构：">
          <fetch-select
            :remote-method="repairItemSearch"
            remote
            reserve-keyword
            labelKey="name"
            valueKey="id"
            v-model="form.financialOrganizationIds"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
          <!-- <el-input v-model="form.allowProductionSchedule"></el-input> -->
        </el-form-item>
        <page-search-action
          v-model="show"
          :is-expandable="false"
          :loading="loading"
          @submit="onSubmit"
          @reset="onReset"
        />
        <!-- <el-form-item label=" ">
          <el-button :loading="loading" size="medium" class="btn-search" @click="submit">查询</el-button>
          <el-button size="medium" class="btn-reset" @click="reset">重置</el-button>
        </el-form-item> -->
      </el-form>
      <div class="ais-actions">
        <!--  TIPS:根据产品增删功能按钮  -->
          <span v-show="pageTpye === 'setEntOrderSettleFlag'">
            <el-button v-permission="moduleKey+'-setSettleSort'" :disabled="selectionList.length === 0" size="small" @click="setSettleSort">批量开启</el-button>
            <el-button v-permission="moduleKey+'-setSettleSort'" :disabled="selectionList.length === 0" size="small" @click="handleBatchEnable(0)">批量关闭</el-button>
            <el-button v-permission="moduleKey+'-setSettleSort'" :disabled="selectionList.length === 0" size="small" @click="setSettleSort">系数调整</el-button>
          </span>
          <span v-show="pageTpye === 'setRebateFlag'">
            <el-button v-permission="moduleKey+'-setRebateFlag'" :disabled="selectionList.length === 0" size="small" @click="setSettleSort">批量启用</el-button>
            <el-button v-permission="moduleKey+'-setRebateFlag'" :disabled="selectionList.length === 0" size="small" @click="handleBatchEnable(0)">批量停用</el-button>
          </span>
      </div>
      <section class="common-section">
        <div class="common-section-body">
          <div class="common-section-table">
            <edit-table
              ref="editTable"
              :columns="columns"
              :data="tableData"
              :show-toolbar="false"
              :show-pagination="true"
              :checkbox="true"
              :total="total"
              @checkboxChange="checkboxChange"
              @current-page-change="pageChange"
              @page-size-change="sizeChange"
            />
          </div>
        </div>
      </section>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm">确 定</el-button>
      </div>
    </div>
     <el-dialog
      width="300px"
      title="请输入调整后系数"
      :visible.sync="innerVisible"
      append-to-body>
        <div class="centered-input">
          <el-input-number
            placeholder="请输入"
            v-model="entOrderQuota"
            :min="0"
            :max="1"
            :step="0.01"
            :precision="2"
            :controls="false"
            @change="validateInput"
          />
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="entOrderQuotaCLose">取消</el-button>
        <el-button size="small" type="primary" @click="entOrderQuotaSubmit">确定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>

import debounce from 'lodash.debounce';
import EditTable from '@/libs/components/EditTable';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, setEntOrderSettleFlag } from '@/api/vehwholesale/fund/account/index';
import { listIdNames } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import { getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import permissions from '@/libs/mixins/permissions';
import TagInput from '@/libs/components/TagInput';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  setRebateFlagQuery: true,
  dealerCompanyNames: [],
  financialOrganizationIds: [],
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
  name: 'setEntOrderSettleFlag',
  props: {
    pageTpye: {
      type: String,
      default: ''
    }
  },
  mixins: [permissions],
  components: {
    TagInput,
    FetchSelect,
    EditTable,
    PageSearchAction
  },
  data () {
    return {
      entOrderQuota: null,
      moduleKey: 'AISVW-dealerFundAccount',
      total: 0,
      loading: false,
      show: false,
      dialogVisible: false,
      innerVisible: false,
      form: {
        ...defaultForm
      },
      columns: [],
      columns1: [
        { field: 'dealerCompanyName', title: '母公司名称', width: '30%' },
        { field: 'fundType', title: '资金类型', width: 120 },
        { field: 'entOrderQuota', title: '企业订单额度系数', width: 200 },
        { field: 'financialOrganizationName', title: '金融机构', width: 120 },
        { field: 'availableBalance', title: '可用余额', width: 200 },
        { field: 'rebateAvailableBalance', title: '返利账户可用余额', width: 200 },
        { field: 'allowUseRebate', title: '是否允许使用返利', width: 200 },
        { field: 'fundAccountCode', title: '账户编号', width: 200 },
        { field: 'lastTradeTime', title: '最近交易时间', width: 200 },
        { field: 'createTime', title: '创建时间', width: 200 },
      ],
      columns2: [
        { field: 'dealerCompanyName', title: '母公司名称', width: '30%' },
        { field: 'fundType', title: '资金类型', width: 120 },
        { field: 'financialOrganizationName', title: '金融机构', width: 120 },
        { field: 'availableBalance', title: '可用余额', width: 200 },
        { field: 'rebateAvailableBalance', title: '返利账户可用余额', width: 200 },
        { field: 'allowUseRebate', title: '是否允许使用返利', width: 200 },
        { field: 'fundAccountCode', title: '账户编号', width: 200 },
      ],
      optionObj: {
        form: {
          page: 1,
          size: pageSize
        }
      },
      tableData: [
      ],
      selectionList: []
    };
  },
  methods: {
    repairItemSearch (query) { return listIdNames({ seriesNameLike: query, status: 1 }); },
    entOrderQuotaSubmit () {
      let params = {
        ids: this.selectionList.map(item => item.id),
        allowEntOrderSettle: 1,
        entOrderQuota: this.entOrderQuota
      };
      setEntOrderSettleFlag(params).then(res => {
        this.$message.success('调整系数修改成功');
        this.getData();
        this.innerVisible = false;
        this.entOrderQuota = null;
      }).catch(() => {
        this.innerVisible = false;
      });
    },
    entOrderQuotaCLose () {
      this.innerVisible = false;
    },
    validateInput (value) {
      if (value > 1 || value < 0) {
        this.$message.error('请输入介于 0 和 1 之间的数值，且最多保留两位小数');
        this.form.settleSort = null; // 清空非法输入
      }
    },
    pageChange (page) {
      this.optionObj.form.page = page;
      this.debouncedGetData();
    },
    sizeChange (size) {
      this.optionObj.form.size = size;
      this.debouncedGetData();
    },
    handleBatchEnable (val) {
      let params = {
        ids: this.selectionList.map(item => item.id),
        allowEntOrderSettle: val
      };
      setEntOrderSettleFlag(params).then(res => {
        this.$message.success('批量关闭成功');
        this.getData();
      }).catch(() => {});
    },
    setSettleSort () {
      console.log('this.selectionList:', this.selectionList);
      // const allZero = this.selectionList.every(item => item.allowEntOrderSettle === 0);
      // if (allZero) {
      this.innerVisible = true;
      // } else {
      //   this.$message.error('请选择【是否允许企业订单结算】为否的账户');
      // }
    },
    onSubmit () {
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.getData();
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
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
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
    // 多选框选中数据
    checkboxChange (selection) {
      this.selectionList = selection;
    },

    dialogshow () {
      this.dialogVisible = true;
      if (this.pageTpye === 'setEntOrderSettleFlag') {
        this.columns = this.columns1;
      } else {
        this.columns = this.columns2;
      }
      this.getData();
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
    }
  }
};
</script>

<style lang="scss" scoped>
.long_text {
  ::v-deep .el-form-item__label {
    line-height: 20px;
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
</style>
