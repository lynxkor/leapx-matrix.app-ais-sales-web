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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="订单解绑编码：" prop="unlockReasonCode">
                  <el-input
                    v-model="form.unlockReasonCode"
                    clearable
                    placeholder="请输入"
                    maxlength="30"
                  />
                </el-form-item>
                <el-form-item label="订单解锁原因：" prop="unlockReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.unlockReason"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="门店申请选择：" prop="storeApplyStatus">
                  <fetch-select
                    v-model="form.storeApplyStatus"
                    :options="yes_no_enum"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店解锁选择：" prop="storeUnlockStatus">
                  <fetch-select
                    v-model="form.storeUnlockStatus"
                    :options="yes_no_enum"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="厂端解锁选择：" prop="factoryUnlockStatus">
                  <fetch-select
                    v-model="form.factoryUnlockStatus"
                    :options="yes_no_enum"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="需要同步APP：" prop="syncAppStatus">
                  <fetch-select
                    v-model="form.syncAppStatus"
                    :options="yes_no_enum"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="原因解释名称：" prop="reasonExplain">
                  <el-input
                    placeholder="请输入"
                    v-model="form.reasonExplain"
                    clearable
                    maxlength="100"
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <!-- <el-select
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option label="禁用" :value="0" />
                    <el-option label="启用" :value="1" />
                  </el-select> -->
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
                  <el-input
                    v-model="form.createTime"
                    disabled
                    placeholder="新增自动生成"
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="订单解绑编码：" prop="unlockReasonCode">
                  {{ form.unlockReasonCode }}
                </el-form-item>
                <el-form-item label="订单解锁原因：" prop="unlockReason">
                  {{ form.unlockReason }}
                </el-form-item>
                <el-form-item label="门店申请选择：" prop="storeApplyStatus">
                  {{ form.storeApplyStatusLabel }}
                </el-form-item>
                <el-form-item label="门店解锁选择：" prop="storeUnlockStatus">
                  {{ form.storeUnlockStatusLabel }}
                </el-form-item>
                <el-form-item label="厂端解锁选择：" prop="factoryUnlockStatus">
                  {{ form.factoryUnlockStatusLabel }}
                </el-form-item>
                <el-form-item label="需要同步APP：" prop="syncAppStatus">
                  {{ form.syncAppStatusLabel }}
                </el-form-item>
                <el-form-item label="原因解释名称：" prop="reasonExplain">
                  {{ form.reasonExplain }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusLabel">
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
import { getDetail, addOrUpdate } from '@/api/vehretail/basicConfig/retailOrderUnlockReasonConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  unlockReasonCode: '',
  unlockReason: '',
  storeApplyStatus: '',
  storeUnlockStatus: '',
  factoryUnlockStatus: '',
  syncAppStatus: '',
  reasonExplain: '',
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
  dataSource: '',
};

export default {
  name: 'retailOrderUnlockReasonConfigEdit',
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
      return '订单解绑编码：' + this.form.unlockReasonCode;
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
      pageTitle: '订单解绑原因配置管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-retailOrderUnlockReasonConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        unlockReasonCode: [
          { required: true, message: '请输入订单解绑编码', trigger: 'change' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '只能输入字母和数字', trigger: 'blur' }
        ],
        unlockReason: [
          { required: true, message: '请输入订单解锁原因', trigger: 'change' }
        ],
        storeApplyStatus: [
          { required: true, message: '请选择门店申请选择', trigger: 'change' }
        ],
        storeUnlockStatus: [
          { required: true, message: '请选择门店解锁选择', trigger: 'change' }
        ],
        factoryUnlockStatus: [
          { required: true, message: '请选择厂端解锁选择', trigger: 'change' }
        ],
        syncAppStatus: [
          { required: true, message: '请选择需要同步APP', trigger: 'change' }
        ],
        reasonExplain: [
          { required: true, message: '请输入原因解释名称', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
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
