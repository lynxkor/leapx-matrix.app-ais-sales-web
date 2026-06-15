<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <div class="page-common m-order-change-list">
      <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
      <el-form
        :inline="true"
        :model="form"
        size="small"
        label-position="right"
        label-width="180px"
        class="ais-search-form"
      >
        <el-form-item label="手机号：">
          <el-input v-model="form.phone" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="VIN：" >
          <el-input v-model="form.vin" placeholder="请输入" />
        </el-form-item>
        <page-search-action
          v-if="canList"
          v-model="show"
          is-expandable
          :loading="loading"
          @submit="onSubmit"
          @reset="onReset"
        />
      </el-form>
      <edit-base-container>
        <el-main ref="scrollContainer">
          <component-table
            ref="orderChangeTableRef"
            :tableConfig="orderChangeTableConfig"
            :columns="orderChangeColumns"
            :extraParams="orderChangeExtraParams"
            :apiMethod="getRetailOrderInfoList"
          />
        </el-main>
      </edit-base-container>
    </div>
  </edit-page-layout>
</template>

<script>
import debounce from 'lodash.debounce';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { fastSearchPage as retailOrderInfofastSearchPage } from '@/api/vehretail/orderManager/retailOrderInfo/index';
import { getTableConfig } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ComponentTable from '@/libs/components/ComponentTable';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  phone: null,
  vin: null
};

// const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    ComponentTable
  },
  data () {
    return {
      selectReasonOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'code',
        clearable: true,
        // multiple: true,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true,
      },
      pageTitle: '订单车辆聚合查询',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVRROCA-retailOrderChangeApply',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      // 门店整车订单
      orderChangeTableConfig: {
        title: '门店整车订单'
      },
      orderChangeColumns: [
        { field: 'mallOrderCode', title: '商城订单编号', width: 200, align: 'center' },
        { field: 'matchFields', title: '查询匹配字段', width: 300, align: 'center' }
      ],
      orderChangeExtraParams: {}
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    onSubmit () {
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.orderChangeExtraParams = {};
      this.getData();
      // this.$nextTick(() => {
      //   this.refreshRetailOrderTable();
      // });
    },
    getData () {
      this.loading = true;
      this.refreshRetailOrderTable();
      this.loading = false;
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
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
    getFormData () {
      const data = { ...this.form };
      return data;
    },
    // 获取订单信息变更申请列表（供 ComponentTable 使用）
    getRetailOrderInfoList (params) {
      // 将搜索条件合并到请求参数中
      const searchParams = this.getFormData();
      return retailOrderInfofastSearchPage({ ...searchParams, ...params });
    },
    // 刷新订单信息变更申请表格
    refreshRetailOrderTable () {
      if (this.$refs.orderChangeTableRef) {
        this.orderChangeExtraParams = this.getFormData();
        this.$refs.orderChangeTableRef.refresh();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-order-change-list {
}
</style>
