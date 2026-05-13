<template>
  <edit-page-layout ref="editLayout" title="返利自动返还设置" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2 v-show="_id">余额信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="返利类型：" prop="rebateType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_rebate_type"
                    v-model="form.rebateType"
                    placeholder="请选择返利类型"
                    clearable
                    filterable
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="车系名称：" prop="vehicleSeriesId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.vehicleSeriesId"
                    :params="form.vehicleSeriesName"
                    :remote-method="getVehicleSeriesList"
                    value-key="id"
                    label-key="name"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="预算科目：" prop="budgetItemId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.budgetItemId"
                    :params="form.budgetItemName"
                    :remote-method="getFundBudgetItemList"
                    value-key="id"
                    label-key="name"
                  />
                </el-form-item>
                <el-form-item label="费用支持类型：" prop="feeSupportTypeId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.feeSupportTypeId"
                    :remote-method="getFeeSuportTypeList"
                    value-key="id"
                    label-key="name"
                  />
                </el-form-item>
                <el-form-item label="有效开始日期：" prop="effectiveStartTime">
                  <el-date-picker
                    type="date"
                    v-model="form.effectiveStartTime"
                    value-format="yyyy-MM-dd"
                    placeholder="请选日期"
                  />
                </el-form-item>
                <el-form-item label="有效截止日期：" prop="effectiveEndTime">
                  <el-date-picker
                    type="date"
                    v-model="form.effectiveEndTime"
                    value-format="yyyy-MM-dd"
                    placeholder="请选日期"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    style="width: 300px"
                  />
                </el-form-item>
                <el-form-item label="状态：">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.statusLabel"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建人：">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.creatorName"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建时间：">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.createTime"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="返利类型：" prop="rebateTypeLabel">
                  {{ form.rebateTypeLabel }}
                </el-form-item>
                <el-form-item label="车系名称：" prop="vehicleSeriesName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleSeries/edit?id=${form.vehicleSeriesId}`" target="_blank">{{ form.vehicleSeriesName }}</el-link>
                </el-form-item>
                <el-form-item label="预算科目：" prop="budgetItemName">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/fundBudgetItem/edit?id=${form.budgetItemId}`" target="_blank">{{ form.budgetItemName }}</el-link>
                </el-form-item>
                <el-form-item label="费用支持类型：" prop="feeSupportTypeName">
                  <el-link type="primary" :href="`/sales/vehwholesale/fund/fundFeeSupportType/edit?id=${form.feeSupportTypeId}`" target="_blank">{{ form.feeSupportTypeName }}</el-link>
                </el-form-item>
                <el-form-item label="有效开始日期：" prop="effectiveStartTime">
                  {{ form.effectiveStartTime }}
                </el-form-item>
                <el-form-item label="有效截止日期：" prop="effectiveEndTime">
                  {{ form.effectiveEndTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：" prop="statusLabel">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/fundRebateReturnConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, vehicleSeriesList } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import moment from 'moment';
import { listIdNames as fundBudgetItemList } from '@/api/vehwholesale/fund/fundBudgetItem/index';
import { listIdNames as fundFeeSuportTypeList } from '@/api/vehwholesale/fund/fundFeeSupportType/index';

const defaultForm = {
  rebateReturnConfigCode: '',
  rebateType: '',
  rebateTypeLabel: '',
  vehicleSeriesName: '',
  budgetItemId: '',
  budgetItemName: '',
  feeSupportTypeId: '',
  feeSupportTypeName: '',
  effectiveStartTime: '',
  effectiveEndTime: '',
  remark: '',
  status: '',
  statusLabel: '',
  statusDesc: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  vehicleSeriesId: '',
};

export default {
  name: 'fundRebateReturnConfigEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect,
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '编码：' + this.form.rebateReturnConfigCode;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    const validateDateRange = (rule, value, callback) => {
      const { effectiveStartTime, effectiveEndTime } = this.form;
      // 1. 校验截止日期必填
      if (!effectiveEndTime) {
        return callback(new Error('请选择截止日期'));
      }

      // 2. 转换为时间戳（兼容日期/日期时间格式）
      const getTimeStamp = (dateStr) => {
        if (!dateStr) return 0;
        return new Date(dateStr).getTime();
      };
      const startTime = getTimeStamp(effectiveStartTime);
      const endTime = getTimeStamp(effectiveEndTime);
      // 当日时间戳（23:59:59）：避免选当日提示超限
      const todayEnd = new Date();
      todayEnd.setHours(0, 0, 0, 0);
      const todayEndTime = todayEnd.getTime();

      // 3. 校验开始日期 ≤ 截止日期
      if (effectiveStartTime && startTime > endTime) {
        return callback(new Error('开始日期不能晚于截止日期'));
      }

      // 4. 校验截止日期 ≤ 当日
      if (endTime < todayEndTime) {
        return callback(new Error('截止日期不能晚于当日'));
      }

      // 所有校验通过
      callback();
    };
    return {
      pageTitle: '返利自动返还设置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundRebateReturnConfig',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        rebateType: [
          { required: true, message: '请选择返利类型', trigger: 'change' }
        ],
        vehicleSeriesId: [
          { required: true, message: '请选择车系名称', trigger: 'change' }
        ],
        budgetItemId: [
          { required: true, message: '请选择预算科目', trigger: 'change' }
        ],
        feeSupportTypeId: [
          { required: true, message: '请选择费用支持类型', trigger: 'change' }
        ],
        effectiveStartTime: [
          { required: true, message: '请选择有效开始日期', trigger: 'change' }
        ],
        effectiveEndTime: [
          { required: true, message: '请选择有效截止日期', trigger: 'change' },
          { validator: validateDateRange, trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      // 提交时移除只读字段
      const submitForm = { ...this.form };
      delete submitForm.creatorName;
      delete submitForm.createTime;
      delete submitForm.statusLabel;
      delete submitForm.rebateTypeLabel;
      delete submitForm.budgetItemName;
      delete submitForm.feeSupportTypeName;
      delete submitForm.vehicleSeriesName;
      return addOrUpdate(submitForm);
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        status: 1,
        creatorName: userInfo.userName,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async getFundBudgetItemList (params) {
      return fundBudgetItemList({ budgetItemNameLike: params, status: 1 });
    },
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async getFeeSuportTypeList (params) {
      return fundFeeSuportTypeList({ feeSupportTypeNameLike: params, status: 1 });
    },
  }
};
</script>
