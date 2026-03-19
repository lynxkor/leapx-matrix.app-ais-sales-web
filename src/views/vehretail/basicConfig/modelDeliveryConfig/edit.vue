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
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="车型名称：" prop="modelName">
                   <fetch-select
                      :remote-method="remoteMethods.model"
                      v-model="form.modelId"
                      placeholder="请选择"
                      clearable
                      label-key="name"
                      value-key="id"
                      filterable
                      remote
                      @change="getModelName"
                    />
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeName">
                  <fetch-select
                    :remote-method="listVehicleYearType"
                    remote
                    v-model="form.yearTypeId"
                    placeholder="请选择"
                    label-key="name"
                    value-key="id"
                    clearable
                    collapse-tags
                    filterable
                    :options="yearTypeList"
                     @change="getYearName"
                  />
                </el-form-item>
                 <el-form-item label="城市：" >
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.cityName"
                    :remote-method="getCityList"
                    value-key="areaName"
                    label-key="areaName"
                    @change="getCityCode"
                  />
                </el-form-item>
                 <el-form-item label="是否开启交付：" prop="openDeliveryStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.openDeliveryStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="开启交付日期："  prop="openDeliveryDate" >
                 <el-date-picker
                    v-model="form.openDeliveryDate"
                    type="date"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择开启交付日期时间"
                  />
                </el-form-item>
                <el-form-item label="未开启交付文案：" prop="noOpenDeliveryText">
                  <el-input
                    placeholder="请输入"
                    v-model="form.noOpenDeliveryText"
                    clearable
                    maxlength="100"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    maxlength="100"
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
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeName">
                  {{ form.yearTypeName }}
                </el-form-item>
                <el-form-item label="城市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="是否开启交付：" prop="openDeliveryStatus">
                  {{ form.openDeliveryStatusLabel }}
                </el-form-item>
                <el-form-item label="开启交付日期：" prop="openDeliveryDate">
                  {{ form.openDeliveryDate }}
                </el-form-item>
                <el-form-item label="未开启交付文案：" prop="noOpenDeliveryText">
                  {{ form.noOpenDeliveryText }}
                </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
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
import { getDetail, addOrUpdate } from '@/api/vehretail/basicConfig/modelDeliveryConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listVehicleModel, listVehicleYearType, cityListByName } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

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
  cityCode: '',
  cityName: '',
  modelId: '',
  modelName: '',
  yearTypeId: '',
  yearTypeName: '',
  openDeliveryStatus: '',
  openDeliveryDate: '',
  noOpenDeliveryText: '',
  dataSource: '',
};

export default {
  name: 'modelDeliveryConfigEdit',
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
      return '车型交付配置：' + this.form.id;
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
    },
    'form.openDeliveryStatus' (newVal) {
      console.log(newVal);
      this.$refs.ruleForm.clearValidate('openDeliveryDate');
      if (newVal === '1') {
        this.rules.openDeliveryDate[0].required = true;
      } else {
        this.rules.openDeliveryDate[0].required = false;
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField('openDeliveryDate');
      });
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      remoteMethods: {
        model: async (query) => {
          return await listVehicleModel({ modelNameLike: query });
        },
      },
      pageTitle: '车型交付配置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-modelDeliveryConfig',
      loading: false,
      yearTypeList: [],
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
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
        status: [
          { required: true, message: '请选择状态 0-禁用;1-启用', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型', trigger: 'change' }
        ],
        yearTypeName: [
          { required: true, message: '请选择年款', trigger: 'change' }
        ],
        openDeliveryStatus: [
          { required: true, message: '请选择是否开启交付 1-是;0-否', trigger: 'change' }
        ],
        openDeliveryDate: [
          {
            required: true,
            message: '请选择开启交付日期',
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.form.openDeliveryStatus === '1' && !value) {
                callback(new Error('请选择开启交付日期'));
              } else {
                callback();
              }
            },
          },
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    getCityCode (val, obj) {
      this.form.cityCode = obj.areaCode;
    },
    async getCityList (params) {
      return cityListByName({ cityName: params });
    },
    getModelName (val, obj) {
      this.form.modelName = obj.name;
    },
    getYearName (val, obj) {
      this.form.yearTypeName = obj.name;
    },
    async listVehicleYearType (query) {
      try {
        const res = await listVehicleYearType({ yearTypeNameLike: query });
        this.yearTypeList = res;
        return res;
      } catch (error) {
        console.error('Error fetching model list:', error);
      }
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      console.log('submitRequest');
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
