<template>
  <edit-page-layout ref="editLayout" title="赊销资费设置" showPaneFooter>
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
          <!-- {{ form.creditSalesFeeConfigCode }} -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2 v-show="_id">基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="车系：" prop="seriesName">
                  <el-input
                    placeholder="请输入车系"
                    v-model="form.seriesName"
                    clearable
                    maxlength="50"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="年款：" prop="yearTypeName">
                  <el-input
                    placeholder="请输入年款"
                    v-model="form.yearTypeName"
                    clearable
                    maxlength="50"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="首付款比例%：" prop="downPaymentRatio">
                  <el-input-number
                    placeholder="请输入首付款比例"
                    v-model="form.downPaymentRatio"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :max="100"
                    :controls="false"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="是否使用返利：" prop="useRebate">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.useRebate"
                    placeholder="请选择是否使用返利"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="使用天数下限：" prop="minUsageDays">
                  <el-input-number
                    placeholder="请输入使用天数下限"
                    v-model="form.minUsageDays"
                    :precision="0"
                    :step="1"
                    :min="0"
                    :controls="false"
                  />
                </el-form-item>
                <el-form-item label="使用天数上限：" prop="maxUsageDays">
                  <el-input-number
                    placeholder="请输入使用天数上限"
                    v-model="form.maxUsageDays"
                    :precision="0"
                    :step="1"
                    :min="0"
                    :controls="false"
                  />
                </el-form-item>
                <el-form-item label="赊销费用：" prop="creditSalesFee">
                  <el-input-number
                    placeholder="请输入赊销费用"
                    v-model="form.creditSalesFee"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
                  />
                </el-form-item>
                <el-form-item label="有效开始日期：" prop="effectiveStartTime">
                  <el-date-picker
                    v-model="form.effectiveStartTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择有效开始日期"
                  />
                </el-form-item>
                <el-form-item label="有效结束日期：" prop="effectiveEndTime">
                  <el-date-picker
                    v-model="form.effectiveEndTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择有效结束日期"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.remark"
                    clearable
                    maxlength="200"
                    type="textarea"
                    :rows="1"
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
                <el-form-item label="记录编号：" prop="creditSalesFeeConfigCode">
                  {{ form.creditSalesFeeConfigCode }}
                </el-form-item>
                <el-form-item label="车系：" prop="seriesName">
                    <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleSeries/edit?id=' + form.seriesId)">{{form.seriesName}}</el-button>
                </el-form-item>
                <el-form-item label="年款：" prop="yearTypeName">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleYearType/edit?id=' + form.yearTypeId)">{{form.yearTypeName}}</el-button>
                </el-form-item>
                <el-form-item label="首付款比例%：" prop="downPaymentRatio">
                  {{ form.downPaymentRatio }}
                </el-form-item>
                <el-form-item label="是否使用返利：" prop="useRebateLabel">
                  {{ form.useRebateLabel }}
                </el-form-item>
                <el-form-item label="使用天数下限：" prop="minUsageDays">
                  {{ form.minUsageDays }}
                </el-form-item>
                <el-form-item label="使用天数上限：" prop="maxUsageDays">
                  {{ form.maxUsageDays }}
                </el-form-item>
                <el-form-item label="赊销费用：" prop="creditSalesFee">
                  {{ form.creditSalesFee }}
                </el-form-item>
                <el-form-item label="有效开始日期：" prop="effectiveStartTime">
                  {{ form.effectiveStartTime }}
                </el-form-item>
                <el-form-item label="有效结束日期：" prop="effectiveEndTime">
                  {{ form.effectiveEndTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="状态：" prop="statusLabel">
                  {{ form.statusLabel }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/creditsales/fundCreditSalesFeeConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import moment from 'moment';

const defaultForm = {
  creditSalesFeeConfigCode: '',
  seriesName: '',
  yearTypeName: '',
  downPaymentRatio: '',
  useRebate: '',
  useRebateLabel: '',
  minUsageDays: 0,
  maxUsageDays: 0,
  creditSalesFee: '',
  effectiveStartTime: '',
  effectiveEndTime: '',
  remark: '',
  status: 1,
  statusLabel: '',
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  modifier: '',
  statusDesc: '',
  seriesId: '',
  yearTypeId: ''
};

export default {
  name: 'fundCreditSalesFeeConfigEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '记录编号：' + this.form.creditSalesFeeConfigCode;
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

    // 自定义校验规则
    const validateDateRange = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择额度失效日期'));
        return;
      }

      // 获取当前日期的零点时间，用于比较日期部分
      const now = new Date();
      const currentDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // 获取失效日期的零点时间
      const expireDay = new Date(value);
      expireDay.setHours(0, 0, 0, 0);

      // 1. 验证失效日期必须大于当前日期
      if (expireDay <= currentDay) {
        callback(new Error('失效日期必须大于当前日期'));
        return;
      }

      // 2. 验证失效日期必须大于生效日期
      if (this.form.effectiveTime) {
        const effectiveDay = new Date(this.form.effectiveTime);
        effectiveDay.setHours(0, 0, 0, 0);
        if (expireDay <= effectiveDay) {
          callback(new Error('失效日期必须大于生效日期'));
          return;
        }
      }

      callback();
    };

    const validateUsageDays = (rule, value, callback) => {
      if (value !== undefined && this.form.maxUsageDays !== undefined && value > this.form.maxUsageDays) {
        callback(new Error('使用天数下限必须小于使用天数上限'));
        return;
      }
      callback();
    };

    return {
      pageTitle: '赊销资费设置',
      pageType: 'edit',
      moduleKey: 'AISVW-fundCreditSalesFeeConfig',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        seriesName: [
          { required: true, message: '请输入车系名称', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ],
        yearTypeName: [
          { required: true, message: '请输入年款名称', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ],
        downPaymentRatio: [
          { required: true, message: '请输入首付款比例', trigger: 'change' },
          { type: 'number', min: 0, max: 100, message: '首付款比例必须在0-100之间', trigger: 'change' }
        ],
        useRebate: [
          { required: true, message: '请选择是否使用返利', trigger: 'change' }
        ],
        minUsageDays: [
          { required: true, message: '请输入使用天数下限', trigger: 'change' },
          { type: 'number', min: 0, message: '使用天数下限必须大于等于0', trigger: 'change' },
          { validator: validateUsageDays, trigger: 'change' }
        ],
        maxUsageDays: [
          { required: true, message: '请输入使用天数上限', trigger: 'change' },
          { type: 'number', min: 0, message: '使用天数上限必须大于等于0', trigger: 'change' }
        ],
        creditSalesFee: [
          { required: true, message: '请输入赊销费用', trigger: 'change' },
          { type: 'number', min: 0, message: '赊销费用必须大于等于0', trigger: 'change' }
        ],
        effectiveStartTime: [
          { required: true, message: '请选择有效开始日期', trigger: 'change' }
        ],
        effectiveEndTime: [
          { required: true, message: '请选择有效结束日期', trigger: 'change' },
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
      // const readOnlyFields = ['creatorName', 'createTime', 'modifierName', 'updateTime',
      //   'seriesName', 'yearTypeName', 'downPaymentRatio', 'useRebateLabel',
      //   'statusLabel', 'creditSalesFeeConfigCode'];
      // readOnlyFields.forEach(field => {
      //   delete submitForm[field];
      // });

      // 验证日期范围
      const startDate = new Date(this.form.effectiveStartTime);
      const endDate = new Date(this.form.effectiveEndTime);
      if (startDate > endDate) {
        this.$message({
          message: '有效结束日期必须大于有效开始日期',
          type: 'error'
        });
        return Promise.reject(new Error('有效结束日期必须大于有效开始日期'));
      }

      // 验证天数范围
      if (this.form.minUsageDays > this.form.maxUsageDays) {
        this.$message({
          message: '使用天数下限必须小于使用天数上限',
          type: 'error'
        });
        return Promise.reject(new Error('使用天数下限必须小于使用天数上限'));
      }

      return addOrUpdate(submitForm);
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        creatorName: userInfo.userName,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
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
::v-deep .el-input-number {
  width: 100%;
}
</style>
