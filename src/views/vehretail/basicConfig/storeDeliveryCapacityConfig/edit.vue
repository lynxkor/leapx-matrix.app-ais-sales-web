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
        </template>
        <template #extraButtons>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="承载力配置编码：" prop="deliveryConfigCode">
                  <el-input
                    placeholder="系统自动生成"
                    v-model="form.deliveryConfigCode"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerCode">
                 <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.deliveryDealerCode"
                    :remote-method="getDealerListByName"
                    :params="form.deliveryDealerName"
                    value-key="storeCode"
                    label-key="storeName"
                    @change="handleDeclearChange"
                  />
                </el-form-item>
                <el-form-item label="交付工程师：" prop="deliveryUserId">
                  <fetch-select
                    remote
                    filterable
                    clearable
                    :remote-method="querySearchAsync"
                    v-model="form.deliveryUserId"
                    :params="form.deliveryUserName"
                    placeholder="请选择"
                    value-key="userId"
                    label-key="username"
                     @change="handleUserChange"
                  />
                </el-form-item>
                <el-form-item label="自动分派排序：" prop="autoAssignSort">
                  <el-input
                    type="number"
                    placeholder="系统自动分配"
                    v-model="form.autoAssignSort"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="月度交付承载数量：" prop="monthlyDeliveryCapacity">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.monthlyDeliveryCapacity"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-input
                    v-model="form.createTime"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="承载力配置编码：" prop="deliveryConfigCode">
                  {{ form.deliveryConfigCode }}
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerName">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="交付工程师：" prop="deliveryUserName">
                  {{ form.deliveryUserName }}
                </el-form-item>
                <el-form-item label="自动分派排序：" prop="autoAssignSort">
                  {{ form.autoAssignSort }}
                </el-form-item>
                <el-form-item label="月度交付承载数量：" prop="monthlyDeliveryCapacity">
                  {{ form.monthlyDeliveryCapacity }}
                </el-form-item>
                <el-form-item label="状态：" prop="statusLabel">
                  {{ form.statusLabel }}
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
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/basicConfig/storeDeliveryCapacityConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfo, getUserByNameOrNo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  deliveryConfigCode: '',
  deliveryDealerCode: '',
  deliveryDealerName: '',
  deliveryUserId: '',
  deliveryUserName: '',
  autoAssignSort: '',
  monthlyDeliveryCapacity: '',
  status: 1,
  createTime: ''
};

const status_enum = [
  { code: 0, message: '禁用' },
  { code: 1, message: '启用' }
];

export default {
  name: 'StoreDeliveryCapacityConfigEdit',
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
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '承载力配置编码：' + this.form.deliveryConfigCode || '-';
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
    return {
      pageTitle: '门店交付承载力配置',
      pageType: 'edit',
      moduleKey: 'AISVR-storeDeliveryCapacityConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      status_enum: status_enum,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        deliveryDealerCode: [
          { required: true, message: '请选择交付门店', trigger: 'change' }
        ],
        deliveryUserId: [
          { required: true, message: '请选择交付工程师', trigger: 'change' }
        ],
        monthlyDeliveryCapacity: [
          { required: true, message: '请输入月度交付承载数量', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          if (res && res.deliveryUserId !== null && res.deliveryUserId !== undefined) {
            res.deliveryUserId = String(res.deliveryUserId);
          }
          return res;
        }).catch(() => {});
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleDealerChange (val) {
      // 门店变化时，可以清空工程师或执行其他逻辑
      this.form.deliveryUserId = '';
      this.form.deliveryUserName = '';
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async getDealerListByName (params) {
      return await listOrgStoreInfo({ storeName: params, isWholesaleSale: true });
    },
    querySearchAsync (queryString) {
      return getUserByNameOrNo({ name: queryString });
    },
    handleDeclearChange (val, record) { if (record) { this.form.deliveryDealerName = record.storeName; } },
    handleUserChange (val, record) { if (record) { this.form.deliveryUserName = record.username; } }
  }
};
</script>
