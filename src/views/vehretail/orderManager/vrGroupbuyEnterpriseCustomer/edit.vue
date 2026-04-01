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
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="公司编号：" prop="companyCode">
                  <el-input
                    placeholder="请输入公司编号"
                    v-model="form.companyCode"
                    clearable
                    maxlength="50"
                    :disabled="_id"
                  />
                </el-form-item>
                <el-form-item label="是否合作：" prop="isCooperation">
                  <fetch-select
                    :options="yes_no_enum"
                    v-model="form.isCooperation"
                    placeholder="请选择是否合作"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="团购企业类型：" prop="groupCompanyType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_group_company_type"
                    v-model="form.groupCompanyType"
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
                    maxlength="50"
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
                    maxlength="1000"
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
                  {{ form.isCooperationLabel }}
                </el-form-item>
                <el-form-item label="团购企业类型：">
                  {{ form.groupCompanyTypeLabel }}
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
  groupCompanyType: '',
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

    // 验证手机号格式
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        // 如果值为空且不是必填项，则不显示错误
        callback();
        return;
      }

      // 手机号正则表达式：支持中国大陆手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(value)) {
        callback(new Error('请输入正确的手机号码格式'));
        return;
      }

      callback();
    };

    return {
      pageTitle: '团购企业客户',
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
          { required: false, message: '请选择是否合作', trigger: 'change' }
        ],
        groupCompanyType: [
          { required: false, message: '请选择团购企业类型', trigger: 'change' }
        ],
        contactPerson: [
          { required: false, message: '请输入联系人', trigger: 'blur' }
        ],
        contactPhone: [
          { validator: validatePhone, trigger: 'blur', required: false }
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
