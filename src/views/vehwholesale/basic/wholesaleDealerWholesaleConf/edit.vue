<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <!-- <el-form-item label="名称" prop="wholesaleDealerWholesaleConfName">
                <el-input
                  placeholder="请输入"
                  v-model="form.wholesaleDealerWholesaleConfName"
                  clearable
                />
              </el-form-item> -->
              <el-form-item label="门店编码" prop="dealerCode">
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
              <el-form-item label="门店名称" prop="dealerName" v-show="!!_id">
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
              <el-form-item label="开启自动配车" prop="autoAllocationEnabled">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="BooleanEnum"
                  v-model="form.autoAllocationEnabled"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="开启自动结算" prop="autoSettlementEnabled">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="BooleanEnum"
                  v-model="form.autoSettlementEnabled"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="允许排产申请" prop="productionRequestEnabled">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="BooleanEnum"
                  v-model="form.productionRequestEnabled"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="允许现车批售" prop="spotWholesaleEnabled">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="BooleanEnum"
                  v-model="form.spotWholesaleEnabled"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="母公司" prop="dealerParentOrgId">
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
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" @click="handleBack">取消</el-button>
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleDealerWholesaleConf/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, listOrgStoreInfo, getParentCompany } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
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
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '门店批售设置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleDealerWholesaleConf',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        wholesaleDealerWholesaleConfName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        dealerParentOrgName: [
          { required: false, message: '请输入母公司', trigger: 'blur' }
        ],
        autoAllocationEnabled: [
          { required: true, message: '请输入开启自动配车', trigger: 'blur' }
        ],
        autoSettlementEnabled: [
          { required: true, message: '请输入开启自动结算', trigger: 'blur' }
        ],
        productionRequestEnabled: [
          { required: true, message: '请输入允许排产申请', trigger: 'blur' }
        ],
        spotWholesaleEnabled: [
          { required: true, message: '请输入允许现车批售', trigger: 'blur' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，140:新销服; 老销服:10', trigger: 'blur' }
        ],
        dealerParentOrgId: [
          { required: false, message: '请输入母公司ID', trigger: 'blur' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'blur' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['门店批售设置', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          addOrUpdate({ ...this.form }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            const id = this.$route.query.id;
            if (rest || !id) {
              this.resetForm(formName);
            } else {
              this.getDetailData();
            }
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // handleJumpAuditLog () {
    //   this.$router.push({
    //     path: '/xxx/auditLog',
    //     query: {
    //       tableCode: '',
    //       tableId: ''
    //     }
    //   });
    // },
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
    async getDealerParentOrgList (params) {
      return getParentCompany({ companyName: params });
    }
  }
};
</script>
