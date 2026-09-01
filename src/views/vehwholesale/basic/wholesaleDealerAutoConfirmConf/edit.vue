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
          <!-- <span class="status primary">{{ form.openAutoConfirmLabel }}</span> -->
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
                <el-form-item label="门店名称：" prop="dealerName">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.dealerName"
                    :remote-method="getDealerListByName"
                    :params="form.dealerName"
                    value-key="storeCode"
                    label-key="storeName"
                    @change="handleChangeDealer"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="开启自动批售确认：" prop="openAutoConfirm">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.openAutoConfirm"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="门店编码：">
                  <el-link type="primary" :href="`/service/datacenter/store/store/detail?storeCode=${form.dealerCode}`" target="_blank">{{ form.dealerCode }}</el-link>
                </el-form-item>
                <el-form-item label="门店名称：">
                  <el-link type="primary" :href="`/service/datacenter/store/store/detail?storeCode=${form.dealerCode}`" target="_blank">{{ form.dealerName }}</el-link>
                </el-form-item>
                <el-form-item label="开启自动批售确认：">
                  {{ form.openAutoConfirmLabel }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleDealerAutoConfirmConf/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, listOrgStoreInfo } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  wholesaleDealerAutoConfirmConfName: '',
  dealerCode: '',
  dealerName: '',
  openAutoConfirm: '',
  openAutoConfirmLabel: '',
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
  ownerOrgId: '',
};

export default {
  name: 'wholesaleDealerAutoConfirmConfEdit',
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
      return '门店自动确认批售配置：' + (this.form.dealerName || '');
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
      pageTitle: '门店自动确认批售配置',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleDealerAutoConfirmConf',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        openAutoConfirm: [
          { required: true, message: '请选择开启自动批售确认', trigger: 'change' }
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
    async getDealerListByCode (params) {
      return listOrgStoreInfo({ storeCode: params, isWholesaleSale: true });
    },
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
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
