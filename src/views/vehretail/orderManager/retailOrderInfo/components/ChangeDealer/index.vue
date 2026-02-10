<template>
  <el-dialog
    :visible.sync="dialogShow"
    append-to-body
    :title="dialogTitle"
    width="70%"
    @close="close"
  >
    <el-form ref="dialogForm" :model="dialogForm" :rules="type === 'sales' ? rules : {}">
      <el-row>
        <el-form-item
          v-if="dataList && dataList.length > 0"
          :label="dialogTitle"
          prop="title"
        >
          <el-tooltip
            :display="dataList && dataList.length > 0"
            :content="tooltipContent"
            placement="top"
          >
            <span>{{ displayDialogData }}</span>
          </el-tooltip>
        </el-form-item>
      </el-row>
      <el-row v-show="type === 'sales'">
        <el-col :span="8">
          <el-form-item
            label="变更原因"
            prop="saleStoreChangeType"
            class="form-item-top-layout"
          >
            <fetch-select
              :request="fetchOptions"
              enumCode="vr_store_change_type"
              v-model="dialogForm.saleStoreChangeType"
              placeholder="请选择"
              clearable
              filterable
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="变更说明"
            prop="saleStoreChangeRemark"
            label-position="top"
            :rules="this.dialogForm.saleStoreChangeType === '2' ? this.rules.saleStoreChangeRemark : []"
          >
            <el-input
              v-model="dialogForm.saleStoreChangeRemark"
              :rows="2"
              maxlength="500"
              placeholder="变更说明"
              show-word-limit
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="page-common">
      <el-form
        :inline="true"
        :model="searchForm"
        size="small"
        label-position="right"
        label-width="150px"
        class="ais-search-form"
      >
        <el-form-item label="门店编码" prop="storeCode">
          <el-input v-model="searchForm.storeCode" placeholder="请输入门店编码" clearable />
        </el-form-item>
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="searchForm.storeName" placeholder="请输入门店名称" clearable />
        </el-form-item>
        <page-search-action
          v-model="showOption"
          is-expandable
          :loading="loading"
          @submit="onSubmit"
          @reset="onReset"
          width="100px"
        />
      </el-form>
      <div class="ais-actions">
      </div>
      <div
        class="ais-table-c"
      >
        <LPVxeTable
          ref="tableRef"
          v-loading="loading"
          is-radio
          is-page
          checkboxFixed
          :option-obj="optionObj"
          :get-config="getConfig"
          :save-or-update="saveOrUpdate"
          @paginationChange="paginationChange"
          @handleSelect="handleSelectionChange"
        >
          <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
        </LPVxeTable>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close"> 取消 </el-button>
      <el-button type="primary" @click="changeDealer"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, getTableConfig, tableAddOrUpdate, listOrgStoreInfo } from '@/api/common';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';

const pageSize = 20;
const mockConfig = {
  data: null
};
const defaultForm = {
  storeCode: '',
  storeName: ''
};

export default {
  name: 'ChangeDealer',
  components: {
    FetchSelect,
    LPVxeTable,
    PageSearchAction
  },
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    field: {
      type: String,
      default: 'id'
    }
  },
  data () {
    return {
      showOption: false,
      loading: false,
      dialogShow: false,
      dialogForm: {
        saleStoreChangeType: null,
        saleStoreChangeRemark: ''
      },
      searchForm: { ...defaultForm },
      rules: {
        saleStoreChangeType: [
          { required: true, message: '请选择变更原因', trigger: 'change' }
        ],
        saleStoreChangeRemark: [
          { required: true, message: '请输入变更说明', trigger: 'blur' }
        ]
      },
      clickItemId: '',
      optionObj: {
        id: 'changeDealerTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'storeCode', label: '门店编码', visible: true, width: 200 },
          { props: 'storeName', label: '门店名称', visible: true, width: 200 },
          { props: 'buildStoreType', label: '建店类型', visible: true, width: 200 },
        ],
        total: 0
      },
      type: 'sales',
      selection: {}
    };
  },
  created () {
    this.getData();
  },
  computed: {
    displayDialogData () {
      if (!this.dataList || this.dataList.length === 0) {
        return '';
      }
      // 如果只有一条数据，直接显示该字段值
      if (this.dataList.length === 1) {
        return this.dataList[0][this.field] || '';
      }
      // 如果有多条数据，显示数量
      return `共 ${this.dataList.length} 条数据`;
    },
    tooltipContent () {
      if (!this.dataList || this.dataList.length === 0) {
        return '';
      }
      return this.dataList
        .map(item => item[this.field] || '')
        .filter(value => value)
        .join(', ');
    },
    dialogTitle () {
      return this.type === 'sales' ? '更换销售门店' : '更换交付门店';
    }
  },
  methods: {
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.searchForm = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    getFormData () {
      const data = { ...this.searchForm };

      Object.keys(this.searchForm).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      return data;
    },
    getData () {
      this.loading = true;
      this.selection = {};
      const param = { ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size };
      if (this.type === 'sales') {
        param.isSales = true;
      } else {
        param.isSupportDeliver = true;
      }

      listOrgStoreInfo(param)
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
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selection = selection;
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    show (type) {
      this.type = type;
      this.dialogShow = true;
      this.getData();
    },
    close () {
      this.dialogShow = false;
      this.dialogForm = { result: '', remark: '' };
      this.selection = {};
      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate();
      });
    },
    changeDealer () {
      if (!this.selection || Object.keys(this.selection).length === 0) {
        this.$message.error('请选择更换的门店');
        return;
      }
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          // 将审核数据列表也传递给父组件
          this.$emit('changeDealer', { ...this.dialogForm, storeInfo: this.selection, dataList: this.dataList, type: this.type });
          this.close();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page-common {
  height: calc(100% - 18rem);
}
::v-deep .el-dialog {
  padding: 0 20px !important;
  height: 80rem;
}
::v-deep .el-dialog__body {
  padding: 0 20px !important;
  height: calc(100% - 12rem);
}
::v-deep .el-form-item {
  margin-bottom: 20px;
}
/* 强制 label 换行，与控件上下排列 */
.form-item-top-layout {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
/* 调整 label 与控件的间距（可选） */
.form-item-top-layout .el-form-item__label {
  margin-bottom: 8px;
  margin-right: 0 !important;  /* 清除默认右侧间距 */
}
/* 让控件占满宽度（可选） */
.form-item-top-layout .el-form-item__content {
  width: 100%;
}
</style>
