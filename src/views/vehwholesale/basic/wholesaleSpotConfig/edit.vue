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
          <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
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
                  <fetch-select
                    :request="fetchBooleanOptions"
                    enumCode="BooleanEnum"
                    v-model="form.fundCheckFlag"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="未配车作废：" prop="unallocatedCancelFlag">
                  <fetch-select
                    :request="fetchBooleanOptions"
                    enumCode="BooleanEnum"
                    v-model="form.unallocatedCancelFlag"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="未结算释放：" prop="unsettledReleaseFlag">
                  <fetch-select
                    :request="fetchBooleanOptions"
                    enumCode="BooleanEnum"
                    v-model="form.unsettledReleaseFlag"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="按序配车：" prop="seqAllocateFlag">
                  <fetch-select
                    :request="fetchBooleanOptions"
                    enumCode="BooleanEnum"
                    v-model="form.seqAllocateFlag"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" :rows="3" v-model="form.remark" clearable />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="车系：">{{ form.seriesName }}</el-form-item>
                <el-form-item label="年款：">{{ form.yearTypeName }}</el-form-item>
                <el-form-item label="资金校验：">{{ form.fundCheckFlagLabel }}</el-form-item>
                <el-form-item label="未配车作废：">{{ form.unallocatedCancelFlagLabel }}</el-form-item>
                <el-form-item label="未结算释放：">{{ form.unsettledReleaseFlagLabel }}</el-form-item>
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
import { getEnum, vehicleSeriesList, listVehicleYearType } from '@/api/common';
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
    return {
      pageTitle: '现车批售信息配置',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleSpotConfig',
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        seriesId: [{ required: true, message: '请选择车系', trigger: 'change' }],
        yearTypeId: [{ required: true, message: '请选择年款', trigger: 'change' }],
        fundCheckFlag: [{ required: true, message: '请选择资金校验', trigger: 'change' }],
        unallocatedCancelFlag: [{ required: true, message: '请选择未配车作废', trigger: 'change' }],
        unsettledReleaseFlag: [{ required: true, message: '请选择未结算释放', trigger: 'change' }],
        seqAllocateFlag: [{ required: true, message: '请选择按序配车', trigger: 'change' }]
      }
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
    async fetchBooleanOptions (code) {
      if (code) return getEnum(code);
      return [];
    },
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async getVehicleYearTypeList (params) {
      return listVehicleYearType({ yearTypeNameLike: params, status: 1 });
    }
  }
};
</script>
