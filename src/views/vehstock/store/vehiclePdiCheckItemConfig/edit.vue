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
          <span class="status primary">状态</span>
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
                <el-form-item label="PDI检查项：" prop="name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.name"
                    :disabled="isEditing"
                    maxlength="500"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="上级检查项：" prop="parentId">
                  <fetch-select
                    :remote-method="getLayerTypeList"
                    remote
                    :options="layerTypeList"
                    :params="form.parentName"
                    placeholder="请输入"
                    v-model="form.parentId"
                    value-key="id"
                    label-key="name"
                    clearable
                    filterable
                    @change="handleLayerTypeChange"
                  />
                </el-form-item>
                <el-form-item label="层级："  prop="layerType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehstock_layer_type"
                    v-model="form.layerType"
                    placeholder="请选择"
                    disabled
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="同级排序：" prop="serialno">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.serialno"
                    @input="val => form.serialno = val.replace(/[^1-9\d]|^0|e|E|\.|-|\+/g, '')"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车型：" prop="modelId">
                  <fetch-select
                    v-model="form.modelId"
                    v-bind="selectOptions"
                    :remote-method="remoteMethods.model"
                  />
                </el-form-item>
                <el-form-item label="车系：" prop="seriesId">
                  <fetch-select
                    v-model="form.seriesId"
                    v-bind="selectOptions"
                    :remote-method="remoteMethods.series"
                  />
                </el-form-item>
                <el-form-item label="检查方式：" prop="checkMode">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehstock_check_mode"
                    v-model="form.checkMode"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否图谱：" prop="isAtlas">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.isAtlas"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="图谱地址：" prop="atlasUrl">
                  <el-input
                    placeholder="请输入"
                    v-model="form.atlasUrl"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="图谱坐标top：" prop="atlasCoordTop">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.atlasCoordTop"
                    @input="val => form.atlasCoordTop = val.replace(/[^-+0-9.]|e|E|(\.\d*\.)|^(\.+)|(-+.*-+)/g, '')"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="图谱坐标left：" prop="atlasCoordLeft">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.atlasCoordLeft"
                    @input="val => form.atlasCoordLeft = val.replace(/[^-+0-9.]|e|E|(\.\d*\.)|^(\.+)|(-+.*-+)/g, '')"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="图谱坐标bottom：" prop="atlasCoordBottom">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.atlasCoordBottom"
                    @input="val => form.atlasCoordBottom = val.replace(/[^-+0-9.]|e|E|(\.\d*\.)|^(\.+)|(-+.*-+)/g, '')"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="图谱坐标right：" prop="atlasCoordRight">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.atlasCoordRight"
                    @input="val => form.atlasCoordRight = val.replace(/[^-+0-9.]|e|E|(\.\d*\.)|^(\.+)|(-+.*-+)/g, '')"
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
                <el-form-item label="生效日期：" prop="effectiveOn">
                  <el-date-picker
                    v-model="form.effectiveOn"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择生效日期"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="失效日期：" prop="expiredOn">
                  <el-date-picker
                    v-model="form.expiredOn"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择失效日期"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="PDI检查项：" prop="name">
                  {{ form.name }}
                </el-form-item>
                <el-form-item label="上级检查项：" prop="parentName">
                  {{ form.parentName }}
                </el-form-item>
                <el-form-item label="层级：" prop="layerType">
                  {{ form.layerTypeLabel }}
                </el-form-item>
                <el-form-item label="同级排序：" prop="serialno">
                  {{ form.serialno }}
                </el-form-item>
                <el-form-item label="车型：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="车系：" prop="seriesName">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="检查方式：" prop="checkMode">
                  {{ form.checkModeLabel }}
                </el-form-item>
                <el-form-item label="是否图谱：" prop="isAtlas">
                  {{ form.isAtlasLabel }}
                </el-form-item>
                <el-form-item label="图谱地址：" prop="atlasUrl">
                  {{ form.atlasUrl }}
                </el-form-item>
                <el-form-item label="图谱坐标top：" prop="atlasCoordTop">
                  {{ form.atlasCoordTop }}
                </el-form-item>
                <el-form-item label="图谱坐标left：" prop="atlasCoordLeft">
                  {{ form.atlasCoordLeft }}
                </el-form-item>
                <el-form-item label="图谱坐标bottom：" prop="atlasCoordBottom">
                  {{ form.atlasCoordBottom }}
                </el-form-item>
                <el-form-item label="图谱坐标right：" prop="atlasCoordRight">
                  {{ form.atlasCoordRight }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="生效日期：" prop="effectiveOn">
                  {{ form.effectiveOn }}
                </el-form-item>
                <el-form-item label="失效日期：" prop="expiredOn">
                  {{ form.expiredOn }}
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
import { getDetail, addOrUpdate, getList } from '@/api/vehstock/store/vehiclePdiCheckItemConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, vehicleSeriesList, listVehicleModel } from '@/api/common';
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
  name: '',
  parentId: '',
  parentName: '',
  layerType: '10',
  serialno: '',
  modelId: '',
  modelName: '',
  seriesId: '',
  seriesName: '',
  checkMode: '',
  isAtlas: '',
  atlasCoordTop: '',
  atlasCoordLeft: '',
  atlasCoordBottom: '',
  atlasCoordRight: '',
  atlasUrl: '',
  effectiveOn: '',
  expiredOn: '',
};

export default {
  name: 'vehiclePdiCheckItemConfigEdit',
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
    // EditTable,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
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
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '整车PDI检查项配置',
      pageType: 'edit',
      title: '主键：' + form.id,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-vehiclePdiCheckItemConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      layerTypeList: [], // 新增编辑页面上级检查项
      defaultNewRow: {
        name: '',
      },
      // 提取公共配置
      selectOptions: {
        placeholder: '请选择',
        labelKey: 'name',
        valueKey: 'id',
        clearable: true,
        multiple: false,
        collapseTags: true,
        filterable: true,
        remote: true,
        reserveKeyword: true
      },
      // 远程搜索方法
      remoteMethods: {
        series: async (query) => {
          return await vehicleSeriesList({ seriesNameLike: query });
        },
        model: async (query) => {
          return await this.searchModel(query);
        },
      },
      rules: {
        name: [
          { required: true, message: '请输入PDI检查项', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value && value.includes(' ')) {
                callback(new Error('不能包含空格'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        parentId: [
          { required: false, message: '请输入上级检查项id', trigger: 'change' }
        ],
        layerType: [
          { required: true, message: '请选择层级', trigger: 'change' }
        ],
        serialno: [
          { required: false, message: '请输入同级排序', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback();
              }
              if (!/^[1-9]\d*$/.test(value)) {
                callback(new Error('请输入正整数（仅允许数字，且不能以0开头）'));
              } else {
                callback();
              }
            },
            trigger: ['blur', 'change'],
          }
        ],
        modelId: [
          { required: false, message: '请输入车型ID', trigger: 'change' }
        ],
        seriesId: [
          { required: false, message: '请输入车系ID', trigger: 'change' }
        ],
        checkMode: [
          { required: false, message: '请输入检查方式', trigger: 'change' }
        ],
        isAtlas: [
          { required: false, message: '请输入是否图谱', trigger: 'change' }
        ],
        atlasUrl: [
          { required: false, message: '请输入图谱地址', trigger: 'change' }
        ],
        atlasCoordTop: [
          { required: false, message: '请输入图谱坐标top', trigger: 'change' }
        ],
        atlasCoordLeft: [
          { required: false, message: '图谱坐标left', trigger: 'change' }
        ],
        atlasCoordBottom: [
          { required: false, message: '图谱坐标bottom', trigger: 'change' }
        ],
        atlasCoordRight: [
          { required: false, message: '图谱坐标right', trigger: 'change' }
        ],
        status: [
          { required: false, message: '请选择状态', trigger: 'change' }
        ],
        effectiveOn: [
          { required: true, message: '请输入生效日期', trigger: 'change' }
        ],
        expiredOn: [
          { required: true, message: '请输入失效日期', trigger: 'change' }
        ],
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
      if (this.form.expiredOn && new Date(this.form.expiredOn) < new Date(this.form.effectiveOn)) {
        this.$message.error('失效日期不可小于生效日期，请检查！');
        return false;
      }
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
    },
    // 车型支持车系 ID 和 车型输入 方法
    async searchModel (query) {
      const params = {};

      if (query) {
        params.modelNameLike = query;
      }

      if (this.form.seriesIdList?.length) {
        params.seriesIds = this.form.seriesIdList;
      }

      return await listVehicleModel(params);
    },
    // 获取上级检查项
    async getLayerTypeList (keyword) {
      try {
        const res = await getList({ pageNum: 1, pageSize: 50, layerTypeList: ['20', '10'], nameLike: keyword });
        this.layerTypeList = res.records;
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 上级检查项改变 联动层级
    handleLayerTypeChange (value, selectedOption) {
      if (selectedOption && Number(selectedOption.layerType) === 10) {
        this.form.layerType = '20';
      } else if (selectedOption && Number(selectedOption.layerType) === 20) {
        this.form.layerType = '30';
      } else {
        this.form.layerType = '10';
      }
    },
  }
};
</script>
