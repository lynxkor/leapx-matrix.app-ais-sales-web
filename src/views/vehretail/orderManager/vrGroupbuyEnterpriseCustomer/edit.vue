<template>
  <edit-page-layout ref="editLayout" title="团购企业客户详情" showPaneFooter>
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
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="公司名称：" prop="companyName">
                  <el-input
                    placeholder="请输入公司名称"
                    v-model="form.companyName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="公司编号：" prop="companyCode">
                  <el-input
                    placeholder="请输入公司编号"
                    v-model="form.companyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否合作：" prop="isCooperation">
                  <el-radio-group v-model="form.isCooperation">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="团购企业类型：" prop="enterpriseType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="groupbuy_enterprise_type"
                    v-model="form.enterpriseType"
                    placeholder="请选择团购企业类型"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="联系人：" prop="contactPerson">
                  <el-input
                    placeholder="请输入联系人姓名"
                    v-model="form.contactPerson"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="联系人手机号码：" prop="contactPhone">
                  <el-input
                    placeholder="请输入联系人手机号码"
                    v-model="form.contactPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入备注"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="公司名称：">
                  {{ form.companyName }}
                </el-form-item>
                <el-form-item label="公司编号：">
                  {{ form.companyCode }}
                </el-form-item>
                <el-form-item label="是否合作：">
                  {{ yes_no_enum_map[form.isCooperation] }}
                </el-form-item>
                <el-form-item label="团购企业类型：">
                  {{ form.enterpriseType }}
                </el-form-item>
                <el-form-item label="联系人：">
                  {{ form.contactPerson }}
                </el-form-item>
                <el-form-item label="联系人手机号码：">
                  {{ form.contactPhone }}
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
        <section class="common-section">
          <div class="common-section-header">
            <h2>基本信息</h2>
          </div>
          <div class="common-section-body">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="编码">
                {{ form.code }}
              </el-descriptions-item>
              <el-descriptions-item label="创建人">
                {{ form.creatorName }}
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ form.createTime }}
              </el-descriptions-item>
              <el-descriptions-item label="修改人">
                {{ form.modifierName }}
              </el-descriptions-item>
              <el-descriptions-item label="修改时间">
                {{ form.updateTime }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </section>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/vrGroupbuyEnterpriseCustomer/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  companyName: '',
  companyCode: '',
  isCooperation: '',
  enterpriseType: '',
  contactPerson: '',
  contactPhone: '',
  remark: ''
};

export default {
  name: 'vrGroupbuyEnterpriseCustomerEdit',
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
      return '公司名称：' + (this.form.companyName || '');
    },
    yes_no_enum_map () {
      return Object.fromEntries(this.yes_no_enum.map(item => [item.code, item.message]));
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
      pageTitle: '整车零售-订单管理-团购企业客户管理',
      pageType: 'edit',
      moduleKey: 'AISVR-vrGroupbuyEnterpriseCustomer',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        companyCode: [
          { required: true, message: '请输入公司编号', trigger: 'blur' }
        ],
        isCooperation: [
          { required: true, message: '请选择是否合作', trigger: 'change' }
        ],
        enterpriseType: [
          { required: true, message: '请选择团购企业类型', trigger: 'change' }
        ],
        contactPerson: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系人手机号码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    openPane () {
      this.$refs.editLayout.openPane();
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
    }
  }
};
</script>
