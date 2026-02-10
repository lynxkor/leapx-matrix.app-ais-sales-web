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
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.yearTypeName"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="外观名称：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.exteriorName"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="内饰名称：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.interiorName"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="轮毂名称：" >
                  <el-input
                    placeholder="请输入"
                    v-model="form.wheelHubName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="选装包名称：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.optionPackageName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="排产天数：" prop="productionDays">
                  <el-input
                    placeholder="请输入"
                    v-model="form.productionDays"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="BUFF天数：" prop="buffDays">
                  <el-input
                    placeholder="请输入"
                    v-model="form.buffDays"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
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
                    filterable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态 0-禁用;1-启用：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="车型ID：" prop="modelId">
                  {{ form.modelId }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="年款ID：" prop="yearTypeId">
                  {{ form.yearTypeId }}
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeName">
                  {{ form.yearTypeName }}
                </el-form-item>
                <el-form-item label="外观ID：" prop="exteriorId">
                  {{ form.exteriorId }}
                </el-form-item>
                <el-form-item label="外观名称：" prop="exteriorName">
                  {{ form.exteriorName }}
                </el-form-item>
                <el-form-item label="内饰ID：" prop="interiorId">
                  {{ form.interiorId }}
                </el-form-item>
                <el-form-item label="内饰名称：" prop="interiorName">
                  {{ form.interiorName }}
                </el-form-item>
                <el-form-item label="轮毂ID：" prop="wheelHubId">
                  {{ form.wheelHubId }}
                </el-form-item>
                <el-form-item label="轮毂名称：" prop="wheelHubName">
                  {{ form.wheelHubName }}
                </el-form-item>
                <el-form-item label="选装包ID：" prop="optionPackageId">
                  {{ form.optionPackageId }}
                </el-form-item>
                <el-form-item label="选装包名称：" prop="optionPackageName">
                  {{ form.optionPackageName }}
                </el-form-item>
                <el-form-item label="排产天数：" prop="productionDays">
                  {{ form.productionDays }}
                </el-form-item>
                <el-form-item label="BUFF天数：" prop="buffDays">
                  {{ form.buffDays }}
                </el-form-item>
                <el-form-item label="数据来源，150-新销服; 10-老销服：" prop="dataSource">
                  {{ form.dataSource }}
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
import { getDetail, addOrUpdate } from '@/api/vehretail/basicConfig/productionOfflineConfig/index';
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
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: 1,
  statusDesc: '',
  modelId: '',
  modelName: '',
  yearTypeId: '',
  yearTypeName: '',
  exteriorId: '',
  exteriorName: '',
  interiorId: '',
  interiorName: '',
  wheelHubId: '',
  wheelHubName: '',
  optionPackageId: '',
  optionPackageName: '',
  productionDays: '',
  buffDays: '',
  dataSource: '',
};

export default {
  name: 'productionOfflineConfigEdit',
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
      pageTitle: '排产下线时效管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-productionOfflineConfig',
      loading: false,
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
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
        ],
        yearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' }
        ],
        yearTypeName: [
          { required: true, message: '请选择年款名称', trigger: 'change' }
        ],
        exteriorId: [
          { required: true, message: '请输入外观ID', trigger: 'change' }
        ],
        exteriorName: [
          { required: true, message: '请输入外观名称', trigger: 'change' }
        ],
        interiorId: [
          { required: true, message: '请输入内饰ID', trigger: 'change' }
        ],
        interiorName: [
          { required: true, message: '请输入内饰名称', trigger: 'change' }
        ],
        wheelHubId: [
          { required: true, message: '请输入轮毂ID', trigger: 'change' }
        ],
        wheelHubName: [
          { required: true, message: '请输入轮毂名称', trigger: 'change' }
        ],
        optionPackageId: [
          { required: true, message: '请输入选装包ID', trigger: 'change' }
        ],
        optionPackageName: [
          { required: true, message: '请输入选装包名称', trigger: 'change' }
        ],
        productionDays: [
          { required: true, message: '请输入排产天数', trigger: 'change' }
        ],
        buffDays: [
          { required: true, message: '请输入BUFF天数', trigger: 'change' }
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
