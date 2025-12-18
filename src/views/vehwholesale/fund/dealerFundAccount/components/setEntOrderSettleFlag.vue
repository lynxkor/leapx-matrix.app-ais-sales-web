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
          <el-input v-model="form.allowProductionSchedule"></el-input>
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
        <el-button v-permission="moduleKey+'-setSettleSort'" :disabled="selectionList.length === 0" size="small" @click="handleBatchEnable(1)">批量开启</el-button>
        <el-button v-permission="moduleKey+'-setSettleSort'" :disabled="selectionList.length === 0" size="small" @click="handleBatchEnable(0)">批量关闭</el-button>
        <el-button size="small" @click="setSettleSort">系数调整</el-button>
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
              @handleSelect="handleSelectionChange"
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
  </el-dialog>
</template>

<script>

import debounce from 'lodash.debounce';
import EditTable from '@/libs/components/EditTable';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/vehwholesale/fund/account/index';
import { getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import permissions from '@/libs/mixins/permissions';
import TagInput from '@/libs/components/TagInput';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  dealerCompanyNames: [],
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
  mixins: [permissions],
  components: {
    TagInput,
    FetchSelect,
    EditTable,
    PageSearchAction
  },
  data () {
    return {
      moduleKey: 'AISVW-dealerFundAccount',
      total: 0,
      loading: false,
      show: false,
      dialogVisible: false,
      form: {
        ...defaultForm
      },
      columns: [
        { field: 'dealerCompanyName', title: '母公司名称', width: '30%' },
        { field: 'fundType', title: '资金类型', width: 120 },
        { field: 'financialOrganizationName', title: '金融机构', width: 120 },
        { field: 'availableBalance', title: '可用余额', width: 200 },
        { field: 'rebateAvailableBalance', title: '返利账户可用余额', width: 200 },
        { field: 'allowUseRebate', title: '是否允许使用返利', width: 200 },
        { field: 'fundAccountCode', title: '账户编号', width: 200 },
        { field: 'lastTradeTime', title: '最近交易时间', width: 200 },
        { field: 'createTime', title: '创建时间', width: 200 },
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
    pageChange (page) {
      this.optionObj.form.page = page;
      this.debouncedGetData();
    },
    sizeChange (size) {
      this.optionObj.form.size = size;
      this.debouncedGetData();
    },
    handleBatchEnable () {},
    setSettleSort () {},
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
    handleSelectionChange (selection) {
      console.log('handleSelectionChange：', selection);
      this.selectionList = selection;
    },

    dialogshow () {
      this.dialogVisible = true;
      this.getData();
    },
    confirm () {
      this.dialogVisible = true;
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
</style>
