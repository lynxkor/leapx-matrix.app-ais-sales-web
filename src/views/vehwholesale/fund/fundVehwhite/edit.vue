<template>
  <edit-page-layout ref="editLayout" title="车辆白名单" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
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
          <span>{{ form.code }}</span>
        </template>
        <template #extraButtons>
          <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="单据类型：" prop="documentTypeLabel">
                  {{ form.documentTypeLabel }}
                </el-form-item>
                <el-form-item label="整车批售订单：" prop="wholesaleOrderCode">
                  {{ form.wholesaleOrderCode }}
                </el-form-item>
                <el-form-item label="企业客户整车订单：" prop="enterpriseOrderCode">
                  {{ form.enterpriseOrderCode }}
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="parentCompanyName">
                  {{ form.parentCompanyName }}
                </el-form-item>
                <el-form-item label="门店：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="企业客户：" prop="enterpriseCustomerName">
                  {{ form.enterpriseCustomerName }}
                </el-form-item>
                <el-form-item label="是否B端白名单：" prop="isBWhitelistLabel">
                  {{ form.isBWhitelistLabel }}
                </el-form-item>
                <el-form-item label="是否C端白名单：" prop="isCWhitelistLabel">
                  {{ form.isCWhitelistLabel }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="编号：" prop="code">
                  {{ form.code }}
                </el-form-item>
              </el-form>

              <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" v-show="isEditing || !_id">
                <el-form-item label="单据类型：" prop="documentType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="fund_order_type"
                    v-model="form.documentType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="整车批售订单：" prop="wholesaleOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="企业客户整车订单：" prop="enterpriseOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.enterpriseOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="母公司名称：" prop="parentCompanyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.parentCompanyName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="企业客户：" prop="enterpriseCustomerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.enterpriseCustomerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否B端白名单：" prop="isBWhitelist">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.isBWhitelist"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否C端白名单：" prop="isCWhitelist">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.isCWhitelist"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="编号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/fundVehwhite/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  documentType: '',
  documentTypeLabel: '',
  wholesaleOrderCode: '',
  enterpriseOrderCode: '',
  vin: '',
  parentCompanyName: '',
  dealerName: '',
  enterpriseCustomerName: '',
  isBWhitelist: '',
  isBWhitelistLabel: '',
  isCWhitelist: '',
  isCWhitelistLabel: '',
  createTime: '',
  code: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  dataSource: '',
  ownerOrgId: '',
};

export default {
  name: 'fundVehwhiteEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '编号：' + (this.form.code || '');
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
      pageTitle: '车辆白名单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundVehwhite',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        documentType: [
          { required: true, message: '请选择单据类型', trigger: 'change' }
        ],
        wholesaleOrderCode: [
          { required: true, message: '请输入整车批售订单', trigger: 'blur' }
        ],
        enterpriseOrderCode: [
          { required: true, message: '请输入企业客户整车订单', trigger: 'blur' }
        ],
        vin: [
          { required: true, message: '请输入VIN号', trigger: 'blur' }
        ],
        parentCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店', trigger: 'blur' }
        ],
        enterpriseCustomerName: [
          { required: true, message: '请输入企业客户', trigger: 'blur' }
        ],
        isBWhitelist: [
          { required: true, message: '请选择是否B端白名单', trigger: 'change' }
        ],
        isCWhitelist: [
          { required: true, message: '请选择是否C端白名单', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
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
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
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
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
