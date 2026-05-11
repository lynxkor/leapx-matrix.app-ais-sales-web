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
          <!-- <span class="status primary">{{ form.autoAllocationEnabledLabel }}</span> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="门店编码：" prop="dealerCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.dealerCode"
                    :remote-method="getDealerListByCode"
                    value-key="storeCode"
                    label-key="storeCode"
                    @change="handleChangeDealer"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName" v-show="!!_id">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    :params="form.dealerName"
                    v-model="form.dealerName"
                    :remote-method="getDealerListByName"
                    value-key="storeCode"
                    label-key="storeName"
                    @change="handleChangeDealer"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="开启自动配车：" prop="autoAllocationEnabled">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.autoAllocationEnabled"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="开启自动结算：" prop="autoSettlementEnabled">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.autoSettlementEnabled"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="允许排产申请：" prop="productionRequestEnabled">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.productionRequestEnabled"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="允许现车批售：" prop="spotWholesaleEnabled">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.spotWholesaleEnabled"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="母公司：" prop="dealerParentOrgId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.dealerParentOrgId"
                    :params="form.dealerParentOrgName"
                    :remote-method="getDealerParentOrgList"
                    value-key="companyCode"
                    label-key="companyName"
                    @change="(val, record) => {form.dealerParentOrgName = record?.companyName || ''}"
                    :disabled="!!_id"
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="门店编码：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/partner/channelManagement/shopDetail?dealerCode=' + form.dealerCode)">{{ form.dealerCode }}</el-button>
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="开启自动配车：">
                  {{ form.autoAllocationEnabledLabel }}
                </el-form-item>
                <el-form-item label="开启自动结算：">
                  {{ form.autoSettlementEnabledLabel }}
                </el-form-item>
                <el-form-item label="允许排产申请：">
                  {{ form.productionRequestEnabledLabel }}
                </el-form-item>
                <el-form-item label="允许现车批售：">
                  {{ form.spotWholesaleEnabledLabel }}
                </el-form-item>
                <el-form-item label="母公司：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/partner/channelManagement/parentCompany/edit?dealCode=' + form.dealerParentOrgId)">{{ form.dealerParentOrgName }}</el-button>
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleDealerWholesaleConf/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, listOrgStoreInfo, getParentCompany } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  wholesaleDealerWholesaleConfName: '',
  dealerCode: '',
  dealerName: '',
  dealerParentOrgName: '',
  autoAllocationEnabled: '1',
  autoSettlementEnabled: '1',
  productionRequestEnabled: '1',
  spotWholesaleEnabled: '1',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  dealerParentOrgId: '',
  ownerOrgId: '',
};

export default {
  name: 'wholesaleDealerWholesaleConfEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '门店批售设置：' + (this.form.dealerName || '');
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
      pageTitle: '门店批售设置',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleDealerWholesaleConf',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'blur' }
        ],
        autoAllocationEnabled: [
          { required: true, message: '请选择开启自动配车', trigger: 'change' }
        ],
        autoSettlementEnabled: [
          { required: true, message: '请选择开启自动结算', trigger: 'change' }
        ],
        productionRequestEnabled: [
          { required: true, message: '请选择允许排产申请', trigger: 'change' }
        ],
        spotWholesaleEnabled: [
          { required: true, message: '请选择允许现车批售', trigger: 'change' }
        ],
      }
    };
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
    },
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
    async getDealerListByCode (params) {
      return listOrgStoreInfo({ storeCode: params, isWholesaleSale: true });
    },
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    async getDealerParentOrgList (params) {
      return getParentCompany({ parentCompanyName: params });
    },
    handleChangeDealer (val, selectedOption) {
      if (val) {
        this.form.dealerCode = selectedOption?.storeCode || '';
        this.form.dealerName = selectedOption?.storeName || '';
      }
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>
