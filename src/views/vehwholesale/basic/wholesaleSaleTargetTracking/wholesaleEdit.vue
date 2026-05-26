<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
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
          <span class="status primary">{{ form.cooperationTypeLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="年：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.year"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="月：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.month"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="母公司：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerParentOrgName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="大区：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="省份：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="城市：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="门店编码：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="门店名称：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="车系：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="合作类型：">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="ws_cooperation_type"
                    v-model="form.cooperationType"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="批售目标数：" prop="wholesaleTargetQty">
                  <el-input-number
                    :controls="false"
                    placeholder="请输入"
                    v-model="form.wholesaleTargetQty"
                    clearable
                    :min="0"
                    :precision="0"
                  />
                </el-form-item>
                <el-form-item label="批售备注：" prop="wholesaleRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleRemark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="年：">
                  {{ form.year }}
                </el-form-item>
                <el-form-item label="月：">
                  {{ form.month }}
                </el-form-item>
                <el-form-item label="母公司：">
                  {{ form.dealerParentOrgName }}
                </el-form-item>
                <el-form-item label="大区：">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="省份：">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="城市：">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="门店编码：">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="车系：">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="合作类型：">
                  {{ form.cooperationTypeLabel }}
                </el-form-item>
                <el-form-item label="批售目标数：">
                  {{ form.wholesaleTargetQty }}
                </el-form-item>
                <el-form-item label="批售备注：">
                  {{ form.wholesaleRemark }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleSaleTargetTracking/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  wholesaleSaleTargetTrackingCode: '',
  year: '',
  month: '',
  dealerParentOrgId: '',
  dealerParentOrgName: '',
  cooperationType: '',
  cooperationTypeLabel: '',
  dealerCode: '',
  dealerName: '',
  regionName: '',
  provinceName: '',
  cityName: '',
  seriesName: '',
  newOrderQty: '',
  newLockTargetQty: '',
  netLockTargetQty: '',
  wholesaleAssessmentTargetQty: '',
  deliveryTargetQty: '',
  wholesaleTargetQty: '',
  confirmedQty: '',
  wholesaleRemark: '',
  retailRemark: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  regionId: '',
  provinceCode: '',
  cityCode: '',
  seriesId: '',
  ownerOrgId: '',
};

export default {
  name: 'wholesaleSaleTargetTrackingWholesaleEdit',
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
      return '销售目标跟踪（批售）：' + (this.form.wholesaleSaleTargetTrackingCode || '');
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
      pageTitle: '销售目标跟踪',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleSaleTargetTracking',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        wholesaleTargetQty: [
          { required: false, message: '请输入批售目标数', trigger: 'blur' }
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
