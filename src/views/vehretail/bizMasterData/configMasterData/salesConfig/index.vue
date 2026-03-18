<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>销售顾问配置</h2>
             <div>
              <el-button v-show="showEditBtn" size="small" @click="showEditBtn = !showEditBtn">取消</el-button>
              <el-button v-show="showEditBtn" size="small" type="primary" @click="save">保存</el-button>
              <el-button v-show="!showEditBtn" size="small" type="primary" @click="editSalesConfig">编辑</el-button>
              <!-- <el-button size="small" type="primary" @click="showDialog">附件弹框</el-button> -->
             </div>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="formData" :rules="rules" ref="ruleForm2" label-width="160px" class="form-edit">
                <el-form-item label="销售顾问配置" prop="saleDeliveryUserConfigName">
                    <fetch-select
                      ref="saleUserSelect"
                      :remote-method="listConfig"
                      remote
                      v-model="formData.saleDeliveryUserConfigName"
                      placeholder="请选择"
                      labelKey="authorityName"
                      valueKey="authorityCode"
                      clearable
                      collapseTags
                      filterable
                      multiple
                      :disabled="!showEditBtn"
                      @change="(val, row) => handleChange(val, row, 'saleUser')"
                    />
                </el-form-item>
                <el-form-item label="交付顾问配置" prop="deliveryUserConfigName">
                  <fetch-select
                      ref="deliveryUserSelect"
                      :remote-method="listConfig"
                      remote
                      v-model="formData.deliveryUserConfigName"
                      placeholder="请选择"
                      labelKey="authorityName"
                      valueKey="authorityCode"
                      clearable
                      collapseTags
                      filterable
                      multiple
                      :disabled="!showEditBtn"
                      @change="(val, row) => handleChange(val, row, 'deliveryUser')"
                    />
                </el-form-item>
                <el-form-item label="交付衍生工程师配置" prop="deliveryDeriveConfigName">
                  <fetch-select
                      ref="deliveryDeriveSelect"
                      :remote-method="listConfig"
                      remote
                      v-model="formData.deliveryDeriveConfigName"
                      placeholder="请选择"
                      labelKey="authorityName"
                      valueKey="authorityCode"
                      clearable
                      collapseTags
                      filterable
                      multiple
                      :disabled="!showEditBtn"
                      @change="(val, row) => handleChange(val, row, 'deliveryDerive')"
                    />
                </el-form-item>
              </el-form>
            </div>
          </section>
           <section class="common-section">
            <div class="common-section-header">
              <h2>交付配置</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="formData" :rules="rules" ref="ruleForm" label-width="160px" class="form-edit">
                <el-form-item label="赊销车辆是否还款：" prop="creditStatus">
                  <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="formData.creditStatus"
                      placeholder="请选择"
                      clearable
                      filterable
                      :disabled="!showEditBtn"
                      @change="(val, row) => handleChange(val, row, 'credit')"
                    />
                </el-form-item>
                <el-form-item label="融资车辆是否还款：" prop="financeStatus">
                  <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="formData.financeStatus"
                      placeholder="请选择"
                      clearable
                      filterable
                      :disabled="!showEditBtn"
                      @change="(val, row) => handleChange(val, row, 'finance')"
                    />
                </el-form-item>
                <el-form-item label="手机号注册校验：" prop="phoneRegisterStatus">
                 <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="formData.phoneRegisterStatus"
                      placeholder="请选择"
                      clearable
                      filterable
                      :disabled="!showEditBtn"
                      @change="(val, row) => handleChange(val, row, 'phoneRegister')"
                    />
                </el-form-item>
                  <el-form-item label="交车单分派通知：" prop="deliveryAssignmentStatus">
                     <fetch-select
                      ref="deliveryAssignmentSelect"
                      :remote-method="listConfig"
                      remote
                      v-model="formData.deliveryAssignmentStatus"
                      placeholder="请选择"
                      labelKey="authorityName"
                      valueKey="authorityCode"
                      clearable
                      collapseTags
                      filterable
                      :disabled="!showEditBtn"
                      multiple
                      @change="(val, row) => handleChange(val, row, 'deliveryAssignment')"
                    />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <!-- <AttachedFilesDialog ref="attachedFilesDialog"/> -->
        </el-main>
    </template>
  </edit-page-layout>
</template>

<script>
import { getRawList, addOrUpdate, getsalesConfig } from '@/api/vehretail/bizMasterData/configMasterData/salesConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
// import AttachedFilesDialog from './attachedFilesDialog.vue';
// Deleted: import commonMixins from '@/libs/mixins/commonMixins';
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
  // Deleted: mixins: [routeGuard, permissions, commonMixins],
  mixins: [routeGuard, permissions],
  components: {
    // AttachedFilesDialog,
    EditPageLayout,
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
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '销售参数配置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-salesConfig',
      loading: false,
      submitLoading: false,
      showEditBtn: false,
      yes_no_enum: YES_NO_ENUM,
      configList: [],
      // 统一使用formData对象
      formData: {},
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // 存储从getRawList获取的原始数据
      rawConfigData: [],
      originalConfigData: [], // 存储查询后原始数据的快照（用于取消时恢复和提交时比对）
      // 存储用户修改过的配置（key: salesConfigKey, value: saleConfigValue）
      modifiedConfigMap: {},
      rules: {
        saleDeliveryUserConfigName: [
          { required: true, message: '请选择销售顾问配置', trigger: 'change' }
        ],
        deliveryUserConfigName: [
          { required: true, message: '请选择交付顾问配置', trigger: 'change' }
        ],
        deliveryDeriveConfigName: [
          { required: true, message: '请选择交付衍生工程师配置', trigger: 'change' }
        ],
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
    this.getRawList();
  },
  beforeDestroy () {
  },
  methods: {
    // 处理fetch-select的change事件
    handleChange (val, row, configKey) {
      console.log('handleChange - val:', val);
      console.log('handleChange - row:', row);
      console.log('handleChange - configKey:', configKey);
      // 找到对应的配置项
      const configItem = this.rawConfigData.find(item => item.salesConfigKey === configKey);
      if (!configItem) return;
      // 处理多选和单选的情况
      let roleData = [];
      if (Array.isArray(val)) {
        // 多选情况：val 是选中的 value 数组（所有选中项）
        roleData = val.map(v => {
          const option = Array.isArray(row) ? row.find(opt => opt.authorityCode === v) : null;
          return {
            roleName: option ? option.authorityName : '',
            roleCode: v
          };
        });
      } else if (val !== undefined && val !== null && val !== '') {
        // 单选情况（BooleanEnum 等）
        roleData = [{
          roleName: val === '1' || val === true || val === '是' ? '是' : '否',
          roleCode: val
        }];
      }
      // 更新 rawConfigData 中的 saleConfigValue
      configItem.saleConfigValue = JSON.stringify(roleData);
      console.log('更新后的 saleConfigValue:', configItem.saleConfigValue);
    },
    getRawList () {
      getRawList().then(res => {
        console.log('getRawList:', res);
        if (!res || res.length === 0) {
          this.rawConfigData = [
            {
              salesConfigGroup: 'saleDeliveryUserConfig',
              salesConfigKey: 'saleUser',
              salesConfigName: '销售顾问配置',
              salesConfigType: 'multiple',
              saleConfigValue: ''
            },
            {
              salesConfigGroup: 'saleDeliveryUserConfig',
              salesConfigKey: 'deliveryUser',
              salesConfigName: '交付顾问配置',
              salesConfigType: 'multiple',
              saleConfigValue: ''
            },
            {
              salesConfigGroup: 'saleDeliveryUserConfig',
              salesConfigKey: 'deliveryDerive',
              salesConfigName: '交付衍生工程师配置',
              salesConfigType: 'multiple',
              saleConfigValue: ''
            },
            {
              salesConfigGroup: 'deliveryConfig',
              salesConfigKey: 'credit',
              salesConfigName: '赊销车辆是否还款',
              salesConfigType: 'single',
              saleConfigValue: JSON.stringify([{ roleCode: '', roleName: '' }])
            },
            {
              salesConfigGroup: 'deliveryConfig',
              salesConfigKey: 'finance',
              salesConfigName: '融资车辆是否还款',
              salesConfigType: 'single',
              saleConfigValue: JSON.stringify([{ roleCode: '', roleName: '' }])
            },
            {
              salesConfigGroup: 'deliveryConfig',
              salesConfigKey: 'phoneRegister',
              salesConfigName: '手机号注册校验',
              salesConfigType: 'single',
              saleConfigValue: JSON.stringify([{ roleCode: '', roleName: '' }])
            },
            {
              salesConfigGroup: 'deliveryConfig',
              salesConfigKey: 'deliveryAssignment',
              salesConfigName: '交车单分派通知',
              salesConfigType: 'multiple',
              saleConfigValue: ''
            }
          ];
        } else {
          this.rawConfigData = res;
        }
        // 保存原始数据快照，用于取消时恢复和提交时比对
        this.originalConfigData = JSON.parse(JSON.stringify(this.rawConfigData));
        // 初始化formData用于表单验证
        this.initFormData();
        // 下一帧加载远程选项，用于回显已选择的数据
        this.$nextTick(() => {
          if (this.$refs.saleUserSelect) {
            this.$refs.saleUserSelect.loadRemoteMethod();
          }
          if (this.$refs.deliveryUserSelect) {
            this.$refs.deliveryUserSelect.loadRemoteMethod();
          }
          if (this.$refs.deliveryDeriveSelect) {
            this.$refs.deliveryDeriveSelect.loadRemoteMethod();
          }
          if (this.$refs.deliveryAssignmentSelect) {
            this.$refs.deliveryAssignmentSelect.loadRemoteMethod();
          }
        });
      }).catch(() => {});
    },
    async listConfig (query) {
      return getsalesConfig({ authorityName: query, pageNum: 1, pageSize: 20 });
    },
    // 初始化formData用于表单验证规则
    initFormData () {
      this.formData = {
        saleDeliveryUserConfigName: this.getConfigValue('saleUser'),
        deliveryUserConfigName: this.getConfigValue('deliveryUser'),
        deliveryDeriveConfigName: this.getConfigValue('deliveryDerive'),
        creditStatus: this.getConfigValue('credit'),
        financeStatus: this.getConfigValue('finance'),
        phoneRegisterStatus: this.getConfigValue('phoneRegister'),
        deliveryAssignmentStatus: this.getConfigValue('deliveryAssignment')
      };
    },
    // 根据salesConfigKey获取对应的值用于表单绑定
    getConfigValue (configKey) {
      const item = this.rawConfigData.find(i => i.salesConfigKey === configKey);
      if (!item) return '';

      try {
        const configValue = JSON.parse(item.saleConfigValue);
        if (item.salesConfigType === 'multiple') {
          return configValue.map(role => role.roleCode);
        } else {
          return configValue[0]?.roleCode || '';
        }
      } catch (e) {
        console.error('Error parsing config value:', e);
        return '';
      }
    },
    // 封装表单校验为 Promise
    validateForm (refName) {
      return new Promise((resolve) => {
        this.$refs[refName].validate((valid) => {
          resolve(valid);
        });
      });
    },
    async save () {
      // 并行校验两个表单
      const [valid1, valid2] = await Promise.all([
        this.validateForm('ruleForm2'),
        this.validateForm('ruleForm')
      ]);
      if (!valid1 || !valid2) {
        return; // 任一表单校验失败则不提交
      }

      try {
        await addOrUpdate(this.rawConfigData);
        this.$message({
          type: 'success',
          message: '成功!'
        });
        this.showEditBtn = !this.showEditBtn;
        this.getRawList();
      } catch (error) {
        this.$message({
          type: 'error',
          message: '失败!'
        });
      }
    },
    showDialog () {
      this.$refs.attachedFilesDialog.show();
    },
    editSalesConfig () {
      // 如果是点击编辑按钮（从 false 变为 true），需要保存当前原始数据快照
      if (!this.showEditBtn) {
        this.showEditBtn = !this.showEditBtn;
      } else {
        // 如果是点击取消按钮（从 true 变为 false），需要恢复原始数据
        this.cancelEdit();
      }
    },
    // 取消编辑，恢复原始数据
    cancelEdit () {
      // 恢复原始数据
      this.rawConfigData = JSON.parse(JSON.stringify(this.originalConfigData));
      // 重新初始化 formData
      this.initFormData();
      // 重新加载远程选项，用于回显已选择的数据
      this.$nextTick(() => {
        if (this.$refs.saleUserSelect) {
          this.$refs.saleUserSelect.loadRemoteMethod();
        }
        if (this.$refs.deliveryUserSelect) {
          this.$refs.deliveryUserSelect.loadRemoteMethod();
        }
        if (this.$refs.deliveryDeriveSelect) {
          this.$refs.deliveryDeriveSelect.loadRemoteMethod();
        }
        if (this.$refs.deliveryAssignmentSelect) {
          this.$refs.deliveryAssignmentSelect.loadRemoteMethod();
        }
      });
      // 关闭编辑模式
      this.showEditBtn = !this.showEditBtn;
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

<style lang="scss" scoped>
.common-section{
  margin: 16px 0;
  // border-bottom: 1px solid var(--leap-color-default-light-4);
  &-header{
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2{
      font-size: 16px;
      color: var(--leap-color-default-dark-1);
      cursor: pointer;
      padding-left: 5px;
      // &::before {
      //   content: "\e651";
      //   font-family: 'iconfont';
      //   font-weight: 500;
      //   display: inline;
      //   font-size: 16px;
      // }
      .btns{
        padding-left: 16px;
        padding-top: 12px;
      }
    }
    &.fold{
      margin-bottom: 0;
      h2::before {
        content: "\e64a";
      }
    }
    .iconfont {
      font-size: 14px;
      margin-right: 4px;
    }
  }
  &-body{
    padding-left: 16px;
    &.not-commit{
      color: var(--leap-color-default-light-2);
    }
  }
  &:last-child{
    border-bottom: none;
  }
}
</style>
