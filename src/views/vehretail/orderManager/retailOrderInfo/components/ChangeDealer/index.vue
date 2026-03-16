<template>
  <el-dialog
    :visible.sync="dialogShow"
    append-to-body
    :title="dialogTitle"
    width="40%"
    @close="close"
  >
    <el-form ref="dialogForm" :model="dialogForm" :rules="type === 'sales' ? rules : {}" label-position="left">
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
        <el-form-item
          label="变更原因"
          prop="saleStoreChangeType"
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
      </el-row>
      <el-row v-show="type === 'sales'">
        <el-form-item
          label="变更说明"
          prop="saleStoreChangeRemark"
          label-position="left"
          :rules="this.dialogForm.saleStoreChangeType === '2' ? this.rules.saleStoreChangeRemark : []"
        >
          <el-input
            v-model="dialogForm.saleStoreChangeRemark"
            :rows="4"
            maxlength="500"
            placeholder="变更说明"
            show-word-limit
            type="textarea"
            style="width: 60%"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item
          label="更换门店"
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
            <span class="store-status">{{ dialogForm.statusName || '' }}</span>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close"> 取消 </el-button>
      <el-button type="primary" @click="changeDealer"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, tableAddOrUpdate, listOrgStoreInfo } from '@/api/common';

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
        saleStoreChangeType: null,
        saleStoreChangeRemark: '',
        storeCode: '',
        storeName: '',
        statusName: '',
      },
      rules: {
        saleStoreChangeType: [
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
        this.dialogForm.statusName = obj.statusName;
      } else {
        // 清空选择时，清空所有相关变量
        this.dialogForm.storeCode = '';
        this.dialogForm.storeName = '';
        this.dialogForm.statusName = '';
      }
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
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
</style>
