<template>
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
    <div class="ais-table-c">
      <!-- 订单信息变更申请分页表格 -->
      <component-table
        ref="orderChangeTableRef"
        :tableConfig="orderChangeTableConfig"
        :columns="orderChangeColumns"
        :extraParams="orderChangeExtraParams"
        :apiMethod="getOrderChangeList"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/vehretail/orderRefund/orderChange/index';
import { getEnum, getTableConfig, tableAddOrUpdate } from '@/api/common';
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

const pageSize = 20;
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
      // 订单信息变更申请表格配置
      orderChangeTableConfig: {
        title: '订单信息变更申请'
      },
      orderChangeColumns: [
        { field: 'changeApplyCode', title: '订单变更申请编号', width: 200, align: 'center' },
        { field: 'applyStatusLabel', title: '申请状态', width: 120, align: 'center' },
        { field: 'changeTypeLabel', title: '变更类型', width: 120, align: 'center' },
        { field: 'changeReason', title: '变更原因', width: 150, align: 'center' },
        { field: 'changeExplain', title: '变更说明', width: 200, align: 'center' },
        { field: 'deliveryStatusLabel', title: '是否完成交车', width: 120, align: 'center' },
        { field: 'createTime', title: '创建时间', width: 180, align: 'center' }
      ],
      orderChangeExtraParams: {}
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/vehretail/orderRefund/changeApply/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
      this.refreshOrderChangeTable();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.orderChangeExtraParams = {};
      this.getData();
      this.$nextTick(() => {
        this.refreshOrderChangeTable();
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
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
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }
      if (this.selectionList.length > 0) {
        data.ids = this.selectionList.map(item => item.id);
      }

      return data;
    },
    async fetchOptions (code) {
      if (code) {
        if (code === 'vehretail_order_change_apply_status') {
          // 对结果进行过滤
          let res = [];
          res = await getEnum(code);
          return res.filter(item => !(item.code === '1025' || item.code === '1027'));
        } else {
          return getEnum(code);
        }
      }
      return [];
    },
    // 获取订单信息变更申请列表（供 ComponentTable 使用）
    getOrderChangeList (params) {
      // 将搜索条件合并到请求参数中
      const searchParams = this.getFormData();
      return getList({ ...searchParams, ...params });
    },
    // 刷新订单信息变更申请表格
    refreshOrderChangeTable () {
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
