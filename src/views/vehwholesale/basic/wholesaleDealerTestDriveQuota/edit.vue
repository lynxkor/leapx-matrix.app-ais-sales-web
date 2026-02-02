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
              <el-form-item label="门店名称" prop="dealerName">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.dealerName"
                  :remote-method="getDealerListByName"
                  value-key="storeCode"
                  label-key="storeName"
                  @change="handleChangeDealer"
                  :disabled="!!_id"
                />
              </el-form-item>
              <el-form-item label="年款" prop="vehicleYearTypeId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.vehicleYearTypeId"
                  :params="form.vehicleYearType"
                  :remote-method="getVehicleYearTypeList"
                  value-key="id"
                  label-key="name"
                  :disabled="!!_id"
                  @change="(val, record) => {form.vehicleYearType = record?.name || ''}"
                />
              </el-form-item>
              <el-form-item label="系列" prop="vehicleModelLineId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.vehicleModelLineId"
                  :params="form.vehicleModelLine"
                  :remote-method="getVehicleModelLineList"
                  value-key="id"
                  label-key="name"
                  :disabled="!!_id"
                  @change="(val, record) => {form.vehicleModelLine = record?.name || ''}"
                />
              </el-form-item>
              <el-form-item label="车系" prop="seriesId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.seriesId"
                  :remote-method="getVehicleSeriesList"
                  value-key="id"
                  label-key="name"
                  :disabled="!!_id"
                  @change="(val, record) => {form.seriesName = record?.name || ''}"
                />
              </el-form-item>
              <el-form-item label="累计已申请数" prop="requestQty">
                <el-input-number
                  :controls="false"
                  placeholder="请输入"
                  v-model="form.requestQty"
                  clearable
                  :precision="0"
                  disabled
                />
              </el-form-item>
              <el-form-item label="配额数量" prop="quotaQty">
                <el-input-number
                  :controls="false"
                  placeholder="请输入"
                  v-model="form.quotaQty"
                  clearable
                  :precision="0"
                />
              </el-form-item>
              <el-form-item label="调整说明" prop="changeDesc">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入"
                  v-model="form.changeDesc"
                  clearable
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="StatusEnum"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleDealerTestDriveQuota/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, listOrgStoreInfo, listVehicleYearType, vehicleModelLineList, vehicleSeriesList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  dealerCode: '',
  dealerName: '',
  vehicleYearType: '',
  vehicleModelLine: '',
  seriesName: '',
  requestQty: '0',
  changeDesc: '',
  quotaQty: '0',
  status: '',
  modifierName: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  remark: '',
  statusDesc: '',
  dataSource: '',
  vehicleYearTypeId: '',
  vehicleModelLineId: '',
  seriesId: '',
  ownerOrgId: '',
};

export default {
  name: 'wholesaleDealerTestDriveQuotaEdit',
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
      pageTitle: '整车批售-批售主数据-门店试驾车配额管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleDealerTestDriveQuota',
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
        vehicleYearType: [
          { required: true, message: '请选择年款', trigger: 'change' }
        ],
        vehicleModelLine: [
          { required: true, message: '请输入系列', trigger: 'blur' }
        ],
        seriesName: [
          { required: true, message: '请输入车系', trigger: 'blur' }
        ],
        requestQty: [
          { required: true, message: '请输入累计已申请数', trigger: 'blur' }
        ],
        changeDesc: [
          { required: false, message: '请输入调整说明', trigger: 'blur' }
        ],
        quotaQty: [
          { required: true, message: '请输入配额数量', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
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
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，140:新销服; 老销服:10', trigger: 'blur' }
        ],
        vehicleYearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' }
        ],
        vehicleModelLineId: [
          { required: true, message: '请输入系列ID', trigger: 'blur' }
        ],
        seriesId: [
          { required: false, message: '请输入车系ID', trigger: 'blur' }
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
    handleBack () {
      // this.$router.back();
      let newPath = this.$route.path.replace(/\/edit$/, '');
      this.$router.push(newPath);
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车批售-批售主数据-门店试驾车配额管理', `${id ? '编辑' : '新建'}`]);
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
              const currentPath = this.$route.path;
              this.$router.push({
                path: currentPath,
                query: { id: res }
              });
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
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    async getVehicleModelLineList (params) {
      return vehicleModelLineList({ modelLineNameLike: params, status: 1 });
    },
    async getVehicleYearTypeList (params) {
      return listVehicleYearType({ yearTypeNameLike: params, status: 1 });
    }
  }
};
</script>
