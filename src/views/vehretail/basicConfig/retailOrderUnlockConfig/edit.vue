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
        </template>
        <template #extraButtons>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" v-show="isEditing || !_id">
                <el-form-item label="配置编码：">
                  <el-input
                    placeholder="新增自动生成"
                    v-model="form.unlockConfigCode"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelId">
                  <fetch-select
                    :remote-method="remoteMethods.model"
                    v-model="form.modelId"
                    v-bind="selectOptions"
                    @change="modelListChange"
                  />
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeId">
                  <fetch-select :options="yearModelList" v-model="form.yearTypeIdSet" placeholder="请选择" labelKey="label" valueKey="value" clearable filterable/>
                  <!-- <fetch-select
                    :remote-method="remoteMethods.yearType"
                    v-model="form.yearTypeId"
                    v-bind="selectOptions"
                  /> -->
                </el-form-item>
                <el-form-item label="订单状态" prop="orderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_order_status"
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    clearable
                    multiple
                    filterable
                  />
                </el-form-item>
                <el-form-item label="允许门店取消锁车：" prop="allowUnlockStatus">
                  <fetch-select
                    :options="yes_no_enum"
                    v-model="form.allowUnlockStatus"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="允许门店手工配车：" prop="allowManualCarStatus">
                  <fetch-select
                    :options="yes_no_enum"
                    v-model="form.allowManualCarStatus"
                    placeholder="请选择"
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
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-input v-model="form.createTime" disabled placeholder="新增自动生成" />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="配置编码：">
                  {{ form.unlockConfigCode }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeName">
                  {{ form.yearTypeName }}
                </el-form-item>
                <el-form-item label="订单状态" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="允许门店取消锁车：">
                  {{ form.allowUnlockStatusLabel }}
                </el-form-item>
                <el-form-item label="允许门店手工配车：">
                  {{ form.allowManualCarStatusLabel }}
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
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/basicConfig/retailOrderUnlockConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listVehicleModel, vehicleModelYearTypeRelationDistinctYeayType } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  unlockConfigCode: '',
  modelName: '',
  yearTypeName: '',
  orderStatus: '',
  allowUnlockStatus: '',
  allowManualCarStatus: '',
  statusLabel: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  modelId: '',
  yearTypeId: '',
  dataSource: '',
};

export default {
  name: 'retailOrderUnlockConfigEdit',
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
      return '配置编码：' + this.form.unlockConfigCode;
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
      pageTitle: '订单解绑配车配置管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-retailOrderUnlockConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      yearModelList: [],
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      // 远程搜索方法
      remoteMethods: {
        // 初始方法
        model: async (query) => {
          return await listVehicleModel({ modelNameLike: query });
        }
      },
      rules: {
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
        ],
        yearTypeName: [
          { required: true, message: '请选择年款名称', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ],
        allowUnlockStatus: [
          { required: true, message: '请选择允许门店取消锁车', trigger: 'change' }
        ],
        allowManualCarStatus: [
          { required: true, message: '请选择允许门店手工配车', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.listVehicleYearType();
  },
  methods: {
    modelListChange (val) {
      this.form.yearTypeId = '';
      this.yearModelList = [];
      this.listVehicleYearType(val);
    },
    async listVehicleYearType (val) {
      const res = await vehicleModelYearTypeRelationDistinctYeayType({ modelId: val, limitSize: 50 });
      this.yearModelList = res.map(item => {
        return {
          ...item,
          label: item.yearTypeName,
          value: item.yearTypeId
        };
      });
    },
    // async listVehicleYearType () {
    //   const res = await listVehicleYearType({ limitSize: 50 });
    //   console.log('vehicleModelYearTypeRelationDistinctYeayType', res);
    //   this.yearModelList = res.map(item => {
    //     return {
    //       ...item,
    //       label: item.name,
    //       value: item.id
    //     };
    //   });
    // },
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
