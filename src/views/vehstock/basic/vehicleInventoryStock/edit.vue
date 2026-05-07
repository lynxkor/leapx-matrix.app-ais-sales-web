<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="整车库存存量定义："
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="编号：" prop="code">
                  <el-input placeholder="系统自动创建" v-model="form.code" clearable disabled />
                </el-form-item>
                <el-form-item label="最小值：" prop="quantityMin">
                  <el-input type="number" placeholder="请输入" v-model="form.quantityMin" clearable />
                </el-form-item>
                <el-form-item label="最大值：" prop="quantityMax">
                  <el-input type="number" placeholder="请输入" v-model="form.quantityMax" clearable />
                </el-form-item>
                <el-form-item label="库存存量类型：" prop="stockType">
                  <fetch-select :request="fetchOptions" enumCode="vehstock_stock_Type" v-model="form.stockType"
                    placeholder="请选择" clearable filterable />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select :request="fetchOptions" enumCode="StatusEnum" v-model="form.status" placeholder="请选择"
                    clearable filterable />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input placeholder="请输入" v-model="form.remark" clearable maxLength="500" show-word-limit
                    type="textarea" />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="编号：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="最小值：">
                  {{ form.quantityMin }}
                </el-form-item>
                <el-form-item label="最大值：">
                  {{ form.quantityMax }}
                </el-form-item>
                <el-form-item label="库存存量类型：">
                  {{ form.stockTypeLabel }}
                </el-form-item>
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehstock/basic/vehicleInventoryStock/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  quantityMin: 0,
  quantityMax: 0,
  stockType: '',
  stockTypeLabel: '',
  status: '',
  statusLabel: '',
  remark: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  statusDesc: '',
  dataSource: '',
  ownerOrgId: '',
};

export default {
  name: 'vehicleInventoryStockEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '整车库存存量定义：' + (this.form.code || '');
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    EditPageLayout,
    EditBaseContainer
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '整车库存存量定义',
      pageType: 'edit',
      moduleKey: 'AISVS-vehicleInventoryStock',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        quantityMin: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '' || value === null || value === undefined) {
                callback(new Error('最小值不能为空'));
              } else if (value < 0) {
                callback(new Error('最小值不能小于0'));
              } else if (value > 99999999) {
                callback(new Error('最小值不能大于99999999'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        quantityMax: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '' || value === null || value === undefined) {
                callback(new Error('最大值不能为空'));
              } else if (value < 0) {
                callback(new Error('最大值不能小于0'));
              } else if (value > 99999999) {
                callback(new Error('最大值不能大于99999999'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        stockType: [
          { required: true, message: '请选择库存存量类型', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
      }
    };
  },
  methods: {
    openPane () {
      this.$refs.editLayout.openPane();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
      return {};
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>
