<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
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
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>销售顾问配置</h2>
             <div>
              <el-button size="small" type="primary" @click="editSalesConfig">编辑</el-button>
             </div>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="170px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="销售顾问配置：" prop="saleDeliveryUserConfigName">
                    <fetch-select
                      :remote-method="listConfig"
                      remote
                      v-model="form.saleDeliveryUserConfigName"
                      placeholder="请选择"
                      labelKey="authorityName"
                      valueKey="authorityCode"
                      clearable
                      collapseTags
                      filterable
                      multiple
                      :options="configList"
                    />
                </el-form-item>
                <el-form-item label="交付顾问配置：" prop="deliveryUserConfigName">
                  <fetch-select
                      :remote-method="listConfig"
                      remote
                      v-model="form.deliveryUserConfigName"
                      placeholder="请选择"
                      labelKey="authorityName"
                      valueKey="authorityCode"
                      clearable
                      collapseTags
                      filterable
                      multiple
                      :options="configList"
                    />
                </el-form-item>
                <el-form-item label="交付衍生工程师配置：" prop="deliveryDeriveConfigName">
                  <fetch-select
                      :remote-method="listConfig"
                      remote
                      v-model="form.deliveryDeriveConfigName"
                      placeholder="请选择"
                      labelKey="authorityName"
                      valueKey="authorityCode"
                      clearable
                      collapseTags
                      filterable
                      multiple
                      :options="configList"
                    />
                </el-form-item>
              </el-form>
            </div>
          </section>
           <section class="common-section">
            <div class="common-section-header">
              <h2>交付配置</h2>
             <div>
              <el-button size="small">取消</el-button>
              <el-button size="small" type="primary" @click="save">保存</el-button>
             </div>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="formStatus" :rules="rules2" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="赊销车辆是否还款：" prop="creditStatus">
                  <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="formStatus.creditStatus"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                </el-form-item>
                <el-form-item label="融资车辆是否还款：" prop="financeStatus">
                  <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="formStatus.financeStatus"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                </el-form-item>
                <el-form-item label="手机号注册校验：" prop="phoneRegisterStatus">
                 <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="formStatus.phoneRegisterStatus"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                </el-form-item>
                  <el-form-item label="交车单分派通知：" prop="deliveryAssignmentStatus">
                     <fetch-select
                      :remote-method="listConfig"
                      remote
                      v-model="formStatus.deliveryAssignmentStatus"
                      placeholder="请选择"
                      labelKey="authorityName"
                      valueKey="authorityCode"
                      clearable
                      collapseTags
                      filterable
                      multiple
                      :options="configList"
                    />
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, getsalesConfig } from '@/api/vehretail/bizMasterData/configMasterData/salesConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
// import { Divider } from '@leapmotor/element-ui';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  salesUserConfig: '',
  salesUserPostCodes: '',
  deliveryUserConfig: '',
  deliveryUserPostCodes: '',
  dataSource: '',
};

export default {
  name: 'salesConfigEdit',
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
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '：' + this.form.id;
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
      pageTitle: '销售参数配置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-salesConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      configList: [],
      form: { ...form },
      formStatus: {},
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      rules: {
        saleDeliveryUserConfigName: [
          { required: true, message: '请选择销售顾问配置', trigger: 'change' }
        ],
        deliveryUserConfigName: [
          { required: true, message: '请选择交付顾问配置', trigger: 'change' }
        ],
        deliveryDeriveConfigName: [
          { required: true, message: '请选择交付衍生工程师配置', trigger: 'change' }
        ]
      },
      rules2: {
        financeStatus: [
          { required: true, message: '请选择融资车辆是否还款', trigger: 'change' }
        ],
        creditStatus: [
          { required: true, message: '请选择赊销车辆是否还款', trigger: 'change' }
        ],
        phoneRegisterStatus: [
          { required: true, message: '请选择手机号注册校验', trigger: 'change' }
        ],
        deliveryAssignmentStatus: [
          { required: true, message: '交车单分派通知', trigger: 'blur' }
        ],
      }
    };
  },
  mounted () {
    this.listConfig();
  },
  methods: {
    async listConfig (query) {
      try {
        const res = await getsalesConfig({ yearTypeNameLike: query, pageNum: 1, pageSize: 20 });
        this.configList = res.records;
        return res.records;
      } catch (error) {
        console.error('Error fetching model list:', error);
      }
    },
    save () {
      let params = [
        {
          salesConfigGroup: 'deliveryConfig',
          salesConfigKey: 'credit',
          salesConfigName: '赊销车辆是否还款',
          salesConfigType: 'single',
          saleConfigValue: [{ roleCode: 'xxxx', roleName: '销售顾问' }]
        },
        {
          salesConfigGroup: 'deliveryConfig',
          salesConfigKey: 'delivfinanceeryUser',
          salesConfigName: '融资车辆是否还款',
          salesConfigType: 'single',
          saleConfigValue: [{ roleCode: 'xxxx', roleName: '销售顾问' }]
        },
        {
          salesConfigGroup: 'deliveryConfig',
          salesConfigKey: 'phoneRegister',
          salesConfigName: '手机号注册校验',
          salesConfigType: 'single',
          saleConfigValue: [{ roleCode: 'xxxx', roleName: '销售顾问' }]
        },
        {
          salesConfigGroup: 'deliveryConfig',
          salesConfigKey: 'deliveryAssignment',
          salesConfigName: '交车单分派通知',
          salesConfigType: 'single',
          saleConfigValue: [{ roleCode: 'xxxx', roleName: '销售顾问' }]
        },
      ];
      addOrUpdate(params).then(() => {
        this.$message({
          type: 'success',
          message: '成功!'
        });
        this.getData();
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '失败!'
        });
      });
    },

    changeFormat (val) {
      const transformedList = val.map(authorityCode => {
        const selectedItem = this.configList.find(item => item.authorityCode === authorityCode);
        return {
          roleName: selectedItem ? selectedItem.authorityName : '',
          roleCode: authorityCode
        };
      });
      return transformedList;
    },
    editSalesConfig () {
      let params = [
        {
          salesConfigGroup: 'saleDeliveryUserConfig',
          salesConfigKey: 'saleUser',
          salesConfigName: '销售顾问配置',
          salesConfigType: 'multiple',
          saleConfigValue: JSON.stringify(this.changeFormat(this.form.saleDeliveryUserConfigName))
        },
        {
          salesConfigGroup: 'saleDeliveryUserConfig',
          salesConfigKey: 'deliveryUser',
          salesConfigName: '交付顾问配置',
          salesConfigType: 'multiple',
          saleConfigValue: JSON.stringify(this.changeFormat(this.form.deliveryUserConfigName))
        },
        {
          salesConfigGroup: 'saleDeliveryUserConfig',
          salesConfigKey: 'deliveryDerive',
          salesConfigName: '交付衍生工程师配置',
          salesConfigType: 'multiple',
          saleConfigValue: JSON.stringify(this.changeFormat(this.form.deliveryDeriveConfigName))
        },
      ];
      addOrUpdate(params).then(() => {
        this.$message({
          type: 'success',
          message: '成功!'
        });
        this.getData();
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '失败!'
        });
      });
    },
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
