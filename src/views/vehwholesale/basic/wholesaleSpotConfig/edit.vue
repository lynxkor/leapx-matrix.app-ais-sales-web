<template>
  <edit-page-layout ref="editLayout" title="现车批售信息配置" showPaneFooter>
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
          <!-- 状态文案取后端 @DictEnumType 生成的 statusLabel；新增态无详情接口，用 status 兜底 -->
          <span :class="['status', form.status === 1 ? 'primary' : 'danger']">{{ form.statusLabel || (form.status === 1 ? '启用' : '停用') }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑 / 新增模式 -->
              <el-form
                :inline="true"
                :model="form"
                :rules="rules"
                ref="ruleForm"
                label-width="120px"
                class="form-edit"
                v-show="isEditing || !_id"
              >
                <el-form-item label="车系：" prop="seriesId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.seriesId"
                    :params="form.seriesName"
                    :remote-method="getVehicleSeriesList"
                    value-key="id"
                    label-key="name"
                    :disabled="!!_id"
                    @change="(val, record) => { form.seriesName = record?.name || ''; }"
                  />
                </el-form-item>
                <el-form-item label="年款：" prop="yearTypeId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.yearTypeId"
                    :params="form.yearTypeName"
                    :remote-method="getVehicleYearTypeList"
                    value-key="id"
                    label-key="name"
                    :disabled="!!_id"
                    @change="(val, record) => { form.yearTypeName = record?.name || ''; }"
                  />
                </el-form-item>
                <el-form-item label="资金校验：" prop="fundCheckFlag">
                  <el-select
                    v-model="form.fundCheckFlag"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="opt in booleanOptions"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="未配车作废：" prop="unallocatedCancelFlag">
                  <el-select
                    v-model="form.unallocatedCancelFlag"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="opt in booleanOptions"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="未结算释放资源：" prop="unsettledReleaseFlag">
                  <el-select
                    v-model="form.unsettledReleaseFlag"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="opt in booleanOptions"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="按序配车：" prop="seqAllocateFlag">
                  <el-select
                    v-model="form.seqAllocateFlag"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="opt in booleanOptions"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value"
                    />
                  </el-select>
                </el-form-item>
                <!-- 状态：新增默认「启用」，新增/编辑均只读，启停统一由列表页「启用/停用」按钮控制 -->
                <el-form-item label="状态：" prop="status">
                  <el-select
                    v-model="form.status"
                    disabled
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="opt in statusOptions"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" :rows="3" v-model="form.remark" clearable />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="车系：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleSeries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName }}</el-link>
                </el-form-item>
                <el-form-item label="年款：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleYearType/edit?id=${form.yearTypeId}`" target="_blank">{{ form.yearTypeName }}</el-link>
                </el-form-item>
                <el-form-item label="资金校验：">{{ form.fundCheckFlagLabel }}</el-form-item>
                <el-form-item label="未配车作废：">{{ form.unallocatedCancelFlagLabel }}</el-form-item>
                <el-form-item label="未结算释放资源：">{{ form.unsettledReleaseFlagLabel }}</el-form-item>
                <el-form-item label="按序配车：">{{ form.seqAllocateFlagLabel }}</el-form-item>
                <el-form-item label="状态：">{{ form.statusLabel }}</el-form-item>
                <el-form-item label="备注：">{{ form.remark }}</el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleSpotConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { vehicleSeriesList, listVehicleYearType } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  seriesId: '',
  seriesName: '',
  yearTypeId: '',
  yearTypeName: '',
  fundCheckFlag: '',
  unallocatedCancelFlag: '',
  unsettledReleaseFlag: '',
  seqAllocateFlag: '',
  status: 1,
  remark: ''
};

export default {
  name: 'wholesaleSpotConfigEdit',
  props: {
    id: { type: [String, Number], default: null }
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '现车批售信息配置：' + (this.form.seriesName || '') + (this.form.yearTypeName ? ' / ' + this.form.yearTypeName : '');
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: { FetchSelect, EditPageLayout, EditBaseContainer },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '现车批售信息配置',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleSpotConfig',
      form: { ...form },
      originalForm: { ...form },
      rules: {
        seriesId: [{ required: true, message: '请选择车系', trigger: 'change' }],
        yearTypeId: [{ required: true, message: '请选择年款', trigger: 'change' }],
        fundCheckFlag: [{ required: true, message: '请选择资金校验', trigger: 'change' }],
        unallocatedCancelFlag: [{ required: true, message: '请选择未配车作废', trigger: 'change' }],
        unsettledReleaseFlag: [{ required: true, message: '请选择未结算释放资源', trigger: 'change' }],
        seqAllocateFlag: [{ required: true, message: '请选择按序配车', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      // 4 个开关统一是/否下拉，value 与后端 Boolean 字段一一对应
      booleanOptions: [
        { value: true, label: '是' },
        { value: false, label: '否' }
      ],
      // 状态：1 启用 0 停用（编辑时只读，由列表「启用/停用」按钮改）
      statusOptions: [
        { value: 1, label: '启用' },
        { value: 0, label: '停用' }
      ]
    };
  },
  methods: {
    detailRequest () {
      if (this._id) return getDetail(this._id);
      return {};
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async getVehicleYearTypeList (params) {
      return listVehicleYearType({ yearTypeNameLike: params, status: 1 });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>
