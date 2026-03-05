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
                <el-form-item label="项目：" prop="itemName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.itemName"
                    clearable
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="层级：" prop="level">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_level"
                    v-model="form.level"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="handleLevelChange"
                  />
                </el-form-item>
                <el-form-item label="上级项目：" prop="parentItem">
                  <fetch-select
                    ref="parentItemSelect"
                    :remote-method="remoteMethods.listParentForOption"
                    :params="form.parentItem"
                    v-model="form.parentItem"
                    placeholder="请选择"
                    clearable
                    filterable
                    remote
                    labelKey="itemName"
                    valueKey="id"
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
                  <fetch-select
                    :options="yearModelList"
                    v-model="form.yearTypeId"
                    placeholder="请选择"
                    labelKey="label"
                    valueKey="value"
                    clearable
                    filterable
                    @change="getYearName"
                  />
                </el-form-item>
                <el-form-item label="选装包名称：" prop="optionPackageId">
                  <fetch-select
                    v-model="form.optionPackageId"
                    clearable
                    filterable
                    remote
                    label-key="name"
                    value-key="id"
                    :remote-method="remoteMethods.optional"
                    @change="getOptionalName"
                  />
                </el-form-item>
                <el-form-item label="检查方式：" prop="checkMethod">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_check_method"
                    v-model="form.checkMethod"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="同级排序：" prop="sameLevelSort">
                  <el-input
                    placeholder="请输入"
                    v-model="form.sameLevelSort"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="生效日期：" prop="effectiveDate">
                  <el-date-picker
                    v-model="form.effectiveDate"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择生效日期"
                  />
                </el-form-item>
                <el-form-item label="失效日期：" prop="invalidDate">
                  <el-date-picker
                    v-model="form.invalidDate"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择失效日期"
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="项目：" prop="itemName">
                  {{ form.itemName }}
                </el-form-item>
                <el-form-item label="层级：" prop="level">
                  {{ form.levelLabel }}
                </el-form-item>
                <el-form-item label="上级项目：" prop="parentItem">
                  {{ form.parentItemName }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeName">
                  {{ form.yearTypeName }}
                </el-form-item>
                <el-form-item label="选装包名称：" prop="optionPackageName">
                  {{ form.optionPackageName }}
                </el-form-item>
                <el-form-item label="检查方式：" prop="checkMethod">
                  {{ form.checkMethodLabel }}
                </el-form-item>
                <el-form-item label="同级排序：" prop="sameLevelSort">
                  {{ form.sameLevelSort }}
                </el-form-item>
                <el-form-item label="生效日期：" prop="effectiveDate">
                  {{ form.effectiveDate }}
                </el-form-item>
                <el-form-item label="失效日期：" prop="invalidDate">
                  {{ form.invalidDate }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
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
import { getDetail, addOrUpdate, listParentForOption } from '@/api/vehretail/basicConfig/deliveryConfirmItemConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listVehicleYearType, listVehicleModel, vehicleModelYearTypeRelationDistinctYeayType, vehicleOptionPackage } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  parentItem: '',
  itemName: '',
  level: '',
  checkMethod: '',
  sameLevelSort: '',
  modelName: '',
  yearTypeName: '',
  optionPackageName: '',
  effectiveDate: '',
  invalidDate: '',
  createTime: '',
  status: 1,
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  statusDesc: '',
  modelId: '',
  yearTypeId: '',
  optionPackageId: '',
  dataSource: '',
};

export default {
  name: 'deliveryConfirmItemConfigEdit',
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
      return '项目：' + this.form.itemName;
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
      pageTitle: '交车确认项配置管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVR-deliveryConfirmItemConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        itemName: [
          { required: true, message: '请输入项目名称', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请输入层级 10-一级 20-二级 30-三级', trigger: 'change' }
        ],
        checkMethod: [
          { required: true, message: '请输入检查方式 5-子项 10-只展示 15-门店勾选', trigger: 'change' }
        ],
        sameLevelSort: [
          { required: true, message: '请输入同级排序', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
        ],
        yearTypeName: [
          { required: true, message: '请选择年款名称', trigger: 'change' }
        ],
        effectiveDate: [
          { required: true, message: '请选择生效日期', trigger: 'change' }
        ],
        invalidDate: [
          { required: true, message: '请选择失效日期', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态 1-启用 0-禁用', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        yearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' }
        ],
      },
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
        },
        yearType: async (query) => {
          return await listVehicleYearType({ yearTypeNameLike: query, modelId: this.form.modelId });
        },
        optional: async (query) => {
          return await vehicleOptionPackage({ optionPackageNameLike: query });
        },
        listParentForOption: async (query) => {
          return await listParentForOption({ level: this.form.level, itemName: query });
        },
      },
      yearModelList: [],
    };
  },
  mounted () {
  },
  methods: {
    handleLevelChange (val) {
      this.form.parentItem = '';
      this.$refs.parentItemSelect.loadRemoteMethod();
    },
    getOptionalName (val, obj) {
      this.form.optionPackageName = obj.name;
    },
    getYearName (val, obj) {
      this.form.yearTypeName = obj.label;
    },
    modelListChange (val, obj) {
      this.form.modelName = obj.name;
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
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
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
