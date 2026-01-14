<template>
  <div class="page-common-detail m-fund-vehicle-rebate-bill-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>整车返利核算单</h2>
        <!-- <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button> -->
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基本信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="返利核算单编号：" prop="rebateBillCode">
              {{ info.rebateBillCode  }}
            </el-form-item>
            <el-form-item label="母公司名称：" prop="dealerCompanyName">
              {{ info.dealerCompanyName  }}
            </el-form-item>
             <el-form-item label="门店名称：" prop="dealerName">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <!-- <el-form-item label="返利核算单明细编号: " prop="rebateBillDetailCode">
              {{ info.rebateBillDetailCode }}
            </el-form-item> -->
             <el-form-item label="周期：" prop="periodLabel">
              {{ info.periodLabel  }}
            </el-form-item>
            <el-form-item label="年度：" prop="year">
              {{ info.year  }}
            </el-form-item>
            <el-form-item label="季度：" prop="quarterLabel">
              {{ info.quarterLabel  }}
            </el-form-item>
            <el-form-item label="月度：" prop="monthLabel">
              {{ info.monthLabel  }}
            </el-form-item>
             <el-form-item label="合计核销金额：" prop="totalRebateAmount">
              {{ info.totalRebateAmount  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
        <section class="common-section">
        <div class="common-section-header">
          <h2>返利核算单明细</h2>
        </div>
        <div class="common-section-body">
          <edit-table
            ref="editTable"
            :columns="columns"
            :data="tableData"
            :show-toolbar="false"
            :show-pagination="true"
            :total="total"
            @current-page-change="pageChange"
            @page-size-change="sizeChange"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehwholesale/rebate/fundVehicleRebateBill/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditTable from '@/libs/components/EditTable';
import { getList } from '@/api/vehwholesale/rebate/fundVehicleRebateBillDetail/index';
const pageSize = 10;
export default {
  name: 'fundVehicleRebateBillDetail',
  mixins: [permissions, commonMixins],
  components: {
    EditTable
  },
  data () {
    return {
      pageTitle: '账户管理-整车返利-整车返利核算单明细管理',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-fundVehicleRebateBill',
      loading: true,
      tableData: [],
      optionObj: {
        form: {
          page: 1,
          size: pageSize
        }
      },
      total: 0,
      columns: [
        { field: 'rebateBillDetailCode', title: '返利核算单明细编号', width: 240 },
        { field: 'vin', title: 'VIN号', width: 120 },
        { field: 'bizOrderNo', title: '业务单据号', width: 160 },
        { field: 'rebateAmount', title: '核销金额', width: 200 },
        { field: 'modelName', title: '基本车型', width: 200 },
        { field: 'seriesName', title: '车系', width: 200 },
        { field: 'remark', title: '备注', width: 260 },
        { field: 'billStatusLabel', title: '单据状态', width: 200 },
        { field: 'budgetItemName', title: '预算科目', width: 200 },
        { field: 'feeSupportTypeName', title: '费用支持类型', width: 200 },
        { field: 'reviewTime', title: '复审时间', width: 200 },
        { field: 'createTime', title: '创建时间', width: 200 },
      ],
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['账户管理-整车返利-整车返利核算单明细管理', '详情']);
    this.getData();
  },
  methods: {
    pageChange (page) {
      this.optionObj.form.page = page;
      this.getList();
    },
    sizeChange (size) {
      this.optionObj.form.size = size;
      this.getList();
    },
    getList () {
      getList({ rebateBillId: this.$route.query.id, pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.tableData = res.records;
          this.total = res.total;
        }).catch(() => {
          this.tableData = [];
          this.loading = false;
        });
    },
    handleEdit () {
      this.$router.push({
        path: '/vehwholesale/rebate/fundVehicleRebateBill/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
        this.getList();
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
