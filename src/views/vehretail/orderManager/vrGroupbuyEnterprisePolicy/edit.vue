<template>
  <edit-page-layout ref="editLayout" title="团购企业优惠政策详情" showPaneFooter>
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
                <el-form-item label="公司名称：" prop="companyId">
                  <fetch-select
                    :remote-method="queryCompanyList"
                    remote
                    v-model="form.companyId"
                    value-key="id"
                    label-key="name"
                    placeholder="请选择公司"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="车系：" prop="seriesId">
                  <fetch-select
                    :remote-method="querySeriesList"
                    remote
                    v-model="form.seriesId"
                    value-key="id"
                    label-key="name"
                    placeholder="请选择车系"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="优惠券：" prop="couponName">
                  <el-input
                    placeholder="请输入优惠券名称"
                    v-model="form.couponName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="优惠金额：" prop="discountAmount">
                  <el-input
                    type="number"
                    placeholder="请输入优惠金额"
                    v-model="form.discountAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="有效开始时间：" prop="validStartTime">
                  <el-date-picker
                    v-model="form.validStartTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item label="有效截止时间：" prop="validEndTime">
                  <el-date-picker
                    v-model="form.validEndTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
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
                <el-form-item label="车系：">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="优惠券：">
                  {{ form.couponName }}
                </el-form-item>
                <el-form-item label="优惠金额：">
                  {{ form.discountAmount }}
                </el-form-item>
                <el-form-item label="有效开始时间：">
                  {{ form.validStartTime }}
                </el-form-item>
                <el-form-item label="有效截止时间：">
                  {{ form.validEndTime }}
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
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/vrGroupbuyEnterprisePolicy/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  companyId: '',
  companyName: '',
  seriesId: '',
  seriesName: '',
  couponName: '',
  discountAmount: '',
  validStartTime: '',
  validEndTime: '',
  remark: ''
};

export default {
  name: 'vrGroupbuyEnterprisePolicyEdit',
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
      pageTitle: '整车零售-订单管理-团购企业优惠政策管理',
      pageType: 'edit',
      moduleKey: 'AISMC-vrGroupbuyEnterprisePolicy',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        companyId: [
          { required: true, message: '请选择公司名称', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请选择车系', trigger: 'change' }
        ],
        couponName: [
          { required: true, message: '请输入优惠券', trigger: 'blur' }
        ],
        discountAmount: [
          { required: true, message: '请输入优惠金额', trigger: 'blur' }
        ],
        validStartTime: [
          { required: true, message: '请选择有效开始时间', trigger: 'change' }
        ],
        validEndTime: [
          { required: true, message: '请选择有效截止时间', trigger: 'change' }
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
    queryCompanyList (queryString) {
      return new Promise(resolve => {
        // 根据实际接口实现公司列表查询
        // companyList({ companyNameLike: queryString, limitSize: 20 }).then(res => {
        //   resolve(res || []);
        // });
        resolve([]);
      });
    },
    querySeriesList (queryString) {
      return new Promise(resolve => {
        // 根据实际接口实现车系列表查询
        // seriesList({ seriesNameLike: queryString, limitSize: 20 }).then(res => {
        //   resolve(res || []);
        // });
        resolve([]);
      });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>
