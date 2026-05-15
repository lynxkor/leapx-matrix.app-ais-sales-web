<template>
  <el-dialog
    :visible.sync="dialogShow"
    append-to-body
    :title="dialogTitle"
    width="40%"
    @close="close"
  >
    <el-form ref="dialogForm" :model="dialogForm" :rules="type === 'sales' ? rules : {}" label-width="100px">
      <el-row v-show="type === 'sales'">
        <el-form-item
          label="变更原因:"
          prop="changeReason"
        >
          <fetch-select
            :remote-method="fetchReasonOptions"
            remote
            v-model="dialogForm.changeReason"
            placeholder="请选择"
            clearable
            filterable
            value-key="code"
            label-key="name"
            @change="handleChangeReason"
          />
        </el-form-item>
      </el-row>
      <el-row v-show="type === 'sales'">
        <el-form-item
          label="变更说明:"
          prop="saleStoreChangeRemark"
          label-position="left"
          :rules="isRemarkRequired ? rules.saleStoreChangeRemark : []"
        >
          <el-input
            v-model="dialogForm.saleStoreChangeRemark"
            :rows="4"
            maxlength="500"
            placeholder="变更说明:"
            show-word-limit
            type="textarea"
            style="width: 60%"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item
          label="更换门店:"
          prop="storeCode"
        >
          <fetch-select
            :remote-method="getData"
            remote
            v-model="dialogForm.storeCode"
            placeholder="请选择"
            clearable
            filterable
            value-key="storeCode"
            label-key="storeName"
            @change="handleStoreCodeChange"
            sub-label-key="storeCode"
          />
        </el-form-item>
      </el-row>
      <!-- 选中门店信息展示 -->
      <el-row>
        <el-col :span="24">
          <div class="selected-store-info">
            <span class="store-name">{{ dialogForm.storeName || '' }}</span>
            <span class="store-code">{{ dialogForm.storeCode || '' }}</span>
            <span class="store-status">{{ dialogForm.cooperationTypeLabel || '' }}</span>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close"> 取消 </el-button>
      <el-button size="small" type="primary" @click="changeDealer"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { tableAddOrUpdate, listOrgStoreInfo } from '@/api/common';
import { fetchReasonLabelList } from '@/api/vehretail/orderRefund/changeReason';

export default {
  name: 'ChangeDealer',
  components: {
    FetchSelect,
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
      dialogShow: false,
      dialogForm: {
        changeReasonCode: '',
        changeReason: '',
        saleStoreChangeRemark: '',
        storeCode: '',
        storeName: '',
        cooperationTypeLabel: '',
      },
      rules: {
        changeReason: [
          { required: true, message: '请选择变更原因', trigger: 'change' }
        ],
        saleStoreChangeRemark: [
          { required: true, message: '请输入变更说明', trigger: 'blur' }
        ],
        storeCode: [
          { required: true, message: '请选择更换门店', trigger: 'change' }
        ],
      },
      type: 'sales',
    };
  },
  created () {
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
    },
    isRemarkRequired () {
      return this.dialogForm.changeReason && this.dialogForm.changeReason.includes('其他');
    }
  },
  methods: {
    getData (keyword) {
      this.selection = {};
      const param = { keyword: keyword };
      if (this.type === 'sales') {
        param.isSales = true;
      } else {
        param.isSupportDeliver = true;
      }

      return listOrgStoreInfo(param);
    },
    handleStoreCodeChange (val, obj) {
      if (val && obj) {
        this.dialogForm.storeCode = obj.storeCode;
        this.dialogForm.storeName = obj.storeName;
        this.dialogForm.cooperationTypeLabel = obj.cooperationTypeLabel;
      } else {
        // 清空选择时，清空所有相关变量
        this.dialogForm.storeCode = '';
        this.dialogForm.storeName = '';
        this.dialogForm.cooperationTypeLabel = '';
      }
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    fetchReasonOptions (keyword) {
      const res = fetchReasonLabelList({ changeReason: keyword, changeType: 30 });
      return res || [];
    },
    handleChangeReason (val, obj) {
      if (val && obj) {
        this.dialogForm.changeReason = obj.name;
        this.dialogForm.changeReasonCode = obj.code;
      } else {
        this.dialogForm.changeReason = '';
        this.dialogForm.changeReasonCode = '';
      }
    },
    show (type) {
      this.type = type;
      this.dialogShow = true;
      this.getData();
      this.fetchReasonOptions();
    },
    close () {
      this.dialogShow = false;
      this.dialogForm = {
        changeReasonCode: '',
        changeReason: '',
        saleStoreChangeRemark: '',
        storeCode: '',
        storeName: '',
        cooperationTypeLabel: '',
      };
      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate();
      });
    },
    changeDealer () {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          // 将审核数据列表也传递给父组件
          this.$emit('changeDealer', { ...this.dialogForm, storeCode: this.dialogForm.storeCode, dataList: this.dataList, type: this.type });
          this.close();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/* 选中门店信息展示样式 */
.selected-store-info {
  background-color: #F8F8F8;
  border: 1px solid #e1f3d8;
  border-radius: 4px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
  min-height: 40px;

  .store-name {
    font-size: 14px;
    color: #303133;
    font-weight: 500;
  }

  .store-code {
    font-size: 14px;
    color: #303133;
    font-weight: 500;
  }

  .store-status {
    font-size: 14px;
    color: #303133;
    font-weight: 500;
  }
}

/* 下拉选项样式 */
.store-option {
  padding: 8px 10px;

  .store-option-name {
    font-size: 14px;
    color: #303133;
    margin-bottom: 4px;
  }

  .store-option-code {
    font-size: 12px;
    color: #909399;
  }
}
::v-deep .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
</style>
