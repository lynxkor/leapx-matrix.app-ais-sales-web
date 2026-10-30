<template>
  <edit-page-layout ref="editLayout" title="车辆排查任务" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :dataTransform="transformDetail"
      >
        <template #status>
          <span :class="['status', form.taskStatus === 110 ? 'danger' : 'primary']">{{ form.taskStatusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="任务编码：" prop="checkTaskCode">
                  <el-input
                    placeholder="系统自动创建"
                    v-model="form.checkTaskCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="任务名称：" prop="taskName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.taskName"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="系统版本号：" prop="vehicleSystemVersion" v-if="showSystemVersion">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleSystemVersion"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="排查原因：" prop="checkReason">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.checkReason"
                    clearable
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item label="排查方法：" prop="checkMethod">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.checkMethod"
                    clearable
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="任务编码：">{{ form.checkTaskCode }}</el-form-item>
                <el-form-item label="任务名称：">{{ form.taskName }}</el-form-item>
                <el-form-item label="任务状态：">{{ form.taskStatusLabel }}</el-form-item>
                <el-form-item label="系统版本号：">{{ form.vehicleSystemVersion }}</el-form-item>
                <el-form-item label="排查原因：">{{ form.checkReason }}</el-form-item>
                <el-form-item label="排查方法：">{{ form.checkMethod }}</el-form-item>
                <el-form-item label="车辆数量：">{{ form.totalVehicleCount }}</el-form-item>
                <el-form-item label="完成数量：">{{ form.finishedVehicleCount }}</el-form-item>
                <el-form-item label="剩余数量：">{{ form.remainVehicleCount }}</el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>任务设置</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="是否锁车：" prop="lockVehicleFlag">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vs_risk_check_lock_flag"
                    v-model="form.lockVehicleFlag"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="审核方式：" prop="auditType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vs_risk_check_audit_type"
                    v-model="form.auditType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="任务要求：" prop="taskRequirement">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.taskRequirement"
                    clearable
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="是否锁车：">{{ form.lockVehicleFlagLabel }}</el-form-item>
                <el-form-item label="审核方式：">{{ form.auditTypeLabel }}</el-form-item>
                <el-form-item label="任务要求：">{{ form.taskRequirement }}</el-form-item>
              </el-form>
            </div>
          </section>
          <!-- 推送配置（多行表格，每行 4 项必填，后端 G22 拦截） -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>推送配置</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式：表格多行编辑，可删除任意行 -->
              <div v-show="isEditing || !_id">
                <el-form :model="form" :rules="rules" ref="ruleForm3">
                  <el-table :data="form.pushConfigList" border size="small" class="push-config-table">
                    <el-table-column label="序号" type="index" width="64" align="center" />
                    <el-table-column label="车辆状态范围" min-width="200">
                      <template slot-scope="scope">
                        <el-form-item
                          label-width="0"
                          :prop="'pushConfigList.' + scope.$index + '.vehicleStatusList'"
                          :rules="pushConfigRules.vehicleStatusList"
                        >
                          <fetch-select
                            class="push-config-select"
                            :options="vehicleStatusOptions"
                            labelKey="label"
                            valueKey="value"
                            v-model="scope.row.vehicleStatusList"
                            placeholder="请选择车辆状态"
                            clearable
                            filterable
                            multiple
                            :collapse-tags="false"
                            wrap-tags
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="车辆类型范围" min-width="170">
                      <template slot-scope="scope">
                        <el-form-item
                          label-width="0"
                          :prop="'pushConfigList.' + scope.$index + '.vehicleCategoryList'"
                          :rules="pushConfigRules.vehicleCategoryList"
                        >
                          <fetch-select
                            class="push-config-select"
                            :options="vehicleCategoryOptions"
                            labelKey="label"
                            valueKey="value"
                            v-model="scope.row.vehicleCategoryList"
                            placeholder="请选择车辆类型"
                            clearable
                            filterable
                            multiple
                            :collapse-tags="false"
                            wrap-tags
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="门店分类" min-width="140">
                      <template slot-scope="scope">
                        <el-form-item
                          label-width="0"
                          :prop="'pushConfigList.' + scope.$index + '.storeCategory'"
                          :rules="pushConfigRules.storeCategory"
                        >
                          <fetch-select
                            class="push-config-select"
                            :request="fetchOptions"
                            enumCode="vs_risk_check_store_category"
                            v-model="scope.row.storeCategory"
                            placeholder="请选择门店分类"
                            clearable
                            filterable
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="推送对象" min-width="200">
                      <template slot-scope="scope">
                        <el-form-item
                          label-width="0"
                          :prop="'pushConfigList.' + scope.$index + '.pushUserRoleList'"
                          :rules="pushConfigRules.pushUserRoleList"
                        >
                          <fetch-select
                            class="push-config-select"
                            :options="pushUserRoleOptions"
                            labelKey="label"
                            valueKey="value"
                            v-model="scope.row.pushUserRoleList"
                            placeholder="请选择推送对象"
                            clearable
                            filterable
                            multiple
                            :collapse-tags="false"
                            wrap-tags
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="88" align="center">
                      <template slot-scope="scope">
                        <el-button type="text" class="push-config-remove" @click="removePushConfigRow(scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                    <template slot="empty">
                      <span class="push-config-empty">暂无推送配置，请点击下方「新增配置」添加</span>
                    </template>
                  </el-table>
                </el-form>
                <div class="push-config-footer">
                  <el-button type="primary" plain size="small" icon="el-icon-plus" @click="addPushConfigRow">新增配置</el-button>
                  <span class="push-config-tip">每行一条独立规则：车辆「状态 + 类型」同时命中才推送；可删除任意行，仅保存表格中最终剩余的配置</span>
                </div>
              </div>
              <!-- 详情模式：只读表格 -->
              <el-table
                :data="form.pushConfigList"
                border
                size="small"
                class="push-config-table"
                v-show="!(isEditing || !_id)"
              >
                <el-table-column label="序号" type="index" width="64" align="center" />
                <el-table-column label="车辆状态范围" min-width="200">
                  <template slot-scope="scope">{{ statusText(scope.row.vehicleStatusList) }}</template>
                </el-table-column>
                <el-table-column label="车辆类型范围" min-width="170">
                  <template slot-scope="scope">{{ categoryText(scope.row.vehicleCategoryList) }}</template>
                </el-table-column>
                <el-table-column label="门店分类" min-width="140">
                  <template slot-scope="scope">{{ storeCategoryText(scope.row.storeCategory) }}</template>
                </el-table-column>
                <el-table-column label="推送对象" min-width="200">
                  <template slot-scope="scope">{{ (scope.row.pushUserRoleList || []).join('、') }}</template>
                </el-table-column>
              </el-table>
            </div>
          </section>
          <!-- 排查方法附件 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>排查方法附件</h2>
            </div>
            <div class="common-section-body">
              <!-- 🔑 两步交互（参考 vehretail soldPlateInfo/edit 实名认证信息附件上传）：
                   附件按 businessId（任务ID）关联单据，新建时还没有任务ID无法上传，
                   所以第 1 步先「保存」创建任务拿到ID，第 2 步进入编辑态才能上传附件。 -->
              <AisAttachment
                :businessId="_id"
                configCode="vehicle_risk_check_task"
                attachType="其他"
                :readonly="!_id || !isEditing"
              />
            </div>
          </section>
          <!-- TODO(T20/T22)：明细列表、审核记录组件 -->
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, update } from '@/api/vehstock/risktask/riskCheckTask/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

/**
 * 车辆状态选项：复用现网字典 vehstock_vechicle_status，但只允许选排查范围内的 5 个
 * 🔑 字典 key 错拼 `vechicle` 照抄，不修正
 */
const VEHICLE_STATUS_OPTIONS = [
  { value: '11', label: '在途' },
  { value: '20', label: '待提交PDI' },
  { value: '25', label: 'PDI待修复' },
  { value: '12', label: '已入门店库' },
  { value: '16', label: '调拨在途' }
];

/**
 * 推送对象（用户角色）选项
 * 🔑 存中文角色名（DDL 注释 + 后端 fillPushConfig 不做码值转换）
 * ⚠️ 角色编码待产品提供（unknowns #95），「保障工程师」是否等同「保养工程师」待确认（#94）
 */
const PUSH_USER_ROLE_OPTIONS = [
  { value: '销售经理', label: '销售经理' },
  { value: '交付经理', label: '交付经理' },
  { value: '交付工程师', label: '交付工程师' },
  { value: '保障工程师', label: '保障工程师' }
];

/**
 * 车辆类型选项：与后端 VehicleCategoryEnum 1:1（1商品车 3展车 10试驾车）
 * 🔑 用静态 options 而非 enumCode，保证与后端 Integer 码值回显时类型一致（多选 el-select 严格相等匹配）
 */
const VEHICLE_CATEGORY_OPTIONS = [
  { value: '1', label: '商品车' },
  { value: '3', label: '展车' },
  { value: '10', label: '试驾车' }
];

const VEHICLE_CATEGORY_LABEL = {
  1: '商品车',
  3: '展车',
  10: '试驾车'
};

/**
 * 门店分类中文映射（后端 RiskCheckStoreCategoryEnum）
 * 🔑 行级配置没有回填 Optional 字段，中文只能前端映射
 */
const STORE_CATEGORY_LABEL = {
  10: '销售门店',
  60: '交付门店'
};

/**
 * 单行推送配置工厂
 * 🔑 必须是工厂函数：defaultForm 会被浅拷贝复用，直接写数组字面量会多实例共享引用
 */
const createPushConfigRow = () => ({
  vehicleStatusList: [],
  vehicleCategoryList: [],
  storeCategory: '',
  pushUserRoleList: []
});

/**
 * 行级校验规则（表格内 el-form-item 用 :rules 单独挂载）
 */
const PUSH_CONFIG_RULES = {
  vehicleStatusList: [
    { required: true, type: 'array', min: 1, message: '请选择车辆状态范围', trigger: 'change' }
  ],
  vehicleCategoryList: [
    { required: true, type: 'array', min: 1, message: '请选择车辆类型范围', trigger: 'change' }
  ],
  storeCategory: [
    { required: true, message: '请选择门店分类', trigger: 'change' }
  ],
  pushUserRoleList: [
    { required: true, type: 'array', min: 1, message: '请选择推送对象', trigger: 'change' }
  ]
};

const defaultForm = {
  id: '',
  checkTaskCode: '',
  taskName: '',
  taskStatus: 10,
  taskStatusLabel: '',
  checkReason: '',
  checkMethod: '',
  taskRequirement: '',
  vehicleSystemVersion: '',
  lockVehicleFlag: '',
  lockVehicleFlagLabel: '',
  auditType: '',
  auditTypeLabel: '',
  // 推送配置（多行表格，每行 4 字段必填，后端 G22 拦截）
  pushConfigList: [],
  totalVehicleCount: 0,
  finishedVehicleCount: 0,
  remainVehicleCount: 0
};

export default {
  name: 'riskCheckTaskEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '车辆排查任务：' + (this.form.checkTaskCode || '');
    },
    // 🔑 仅自动审核(60)时展示并必填系统版本号（后端 G21）
    showSystemVersion () {
      return Number(this.form.auditType) === 60;
    },
    vehicleStatusOptions () {
      return VEHICLE_STATUS_OPTIONS;
    },
    vehicleCategoryOptions () {
      return VEHICLE_CATEGORY_OPTIONS;
    },
    pushUserRoleOptions () {
      return PUSH_USER_ROLE_OPTIONS;
    },
    pushConfigRules () {
      return PUSH_CONFIG_RULES;
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    EditPageLayout,
    EditBaseContainer,
    AisAttachment
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '车辆排查任务',
      pageType: 'edit',
      moduleKey: 'AISVS-risktask-riskCheckTask',
      loading: false,
      submitLoading: false,
      form,
      // 🔑 必须各自调用工厂：浅拷贝会让 form / originalForm 共享同一个 pushConfigList 数组引用，
      //    导致增删行时路由拦截的脏检查失效
      originalForm: this.getDefautlForm(),
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        checkReason: [
          { required: true, message: '请输入排查原因', trigger: 'blur' }
        ],
        checkMethod: [
          { required: true, message: '请输入排查方法', trigger: 'blur' }
        ],
        taskRequirement: [
          { required: true, message: '请输入任务要求', trigger: 'blur' }
        ],
        lockVehicleFlag: [
          { required: true, message: '请选择是否锁车', trigger: 'change' }
        ],
        auditType: [
          { required: true, message: '请选择审核方式', trigger: 'change' }
        ],
        // 🔑 仅自动审核时系统版本号必填（后端 G21）
        vehicleSystemVersion: [
          {
            validator: (rule, value, callback) => {
              if (this.showSystemVersion && !value) {
                callback(new Error('自动审核任务必须填写系统版本号'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
        // 🔑 推送配置 4 项的行级校验挂在表格内的 el-form-item（见 PUSH_CONFIG_RULES），
        //    顶层 rules 只保留「至少 1 行」的兜底提示（在 submitRequest 中拦截）
      }
    };
  },
  methods: {
    openPane () {
      this.$refs.editLayout.openPane();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
      return {};
    },
    /**
     * 详情回显转换：推送配置是 JSON 数组（每行一条规则），逐行归一化后直接给表格
     */
    transformDetail (res) {
      const data = { ...(res || {}) };
      data.pushConfigList = this.normalizePushConfigList(data.pushConfigList);
      return data;
    },
    /**
     * 归一化推送配置行：补缺失字段 + 多值码值统一转字符串
     * 🔑 多选 el-select 回显按「严格相等」匹配 option.value，
     *    后端传 Integer（11/1/10），前端静态 options 的 value 是字符串，必须转成字符串才回显得出
     */
    normalizePushConfigList (list) {
      const rows = Array.isArray(list) ? list : [];
      if (!rows.length) {
        return [createPushConfigRow()];
      }
      return rows.map(row => {
        const item = row || {};
        return {
          vehicleStatusList: this.splitToArray(item.vehicleStatusList).map(String),
          vehicleCategoryList: this.splitToArray(item.vehicleCategoryList).map(String),
          storeCategory: item.storeCategory === null || item.storeCategory === undefined ? '' : item.storeCategory,
          pushUserRoleList: this.splitToArray(item.pushUserRoleList)
        };
      });
    },
    // 逗号串 / 单值 → 数组（兼容后端早期逗号串存储）
    splitToArray (value) {
      if (Array.isArray(value)) {
        return value;
      }
      if (value === null || value === undefined || value === '') {
        return [];
      }
      return String(value)
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
    },
    // 新增一行推送配置
    addPushConfigRow () {
      this.form.pushConfigList.push(createPushConfigRow());
      this.clearPushConfigValidate();
    },
    // 删除任意一行（不限制最后一行，保存时由 submitRequest 兜底校验至少 1 行）
    removePushConfigRow (index) {
      this.form.pushConfigList.splice(index, 1);
      this.clearPushConfigValidate();
    },
    /**
     * 清空推送配置表格的校验态
     * 🔑 el-form-item 的 prop 带行索引（pushConfigList.0.xxx），增删行会让索引位移，
     *    残留的报错红字会错位显示到别的行上，所以增删后统一清一次
     */
    clearPushConfigValidate () {
      this.$nextTick(() => {
        if (this.$refs.ruleForm3) {
          this.$refs.ruleForm3.clearValidate();
        }
      });
    },
    // 详情区文案：车辆状态码值 → 中文
    statusText (list) {
      const map = {};
      VEHICLE_STATUS_OPTIONS.forEach(item => {
        map[item.value] = item.label;
      });
      return (list || []).map(item => map[String(item)] || item).join('、');
    },
    // 详情区文案：车辆类型码值 → 中文
    categoryText (list) {
      return (list || []).map(item => VEHICLE_CATEGORY_LABEL[String(item)] || item).join('、');
    },
    // 详情区文案：门店分类码值 → 中文
    storeCategoryText (code) {
      return STORE_CATEGORY_LABEL[String(code)] || code || '';
    },
    submitRequest () {
      // 🔑 表格可以整行删空，提交前兜底「至少 1 行」（对齐后端 G22）
      if (!Array.isArray(this.form.pushConfigList) || !this.form.pushConfigList.length) {
        this.$message.warning('请至少配置一条推送配置');
        return Promise.reject(new Error('请至少配置一条推送配置'));
      }
      // 🔑 只提交表格中最终剩余的行，删除的行不进参
      const params = {
        ...this.form,
        pushConfigList: this.form.pushConfigList
      };
      // 新建走 addOrUpdate（POST），编辑走 update（PUT）
      if (this._id) {
        // 🔑 id 以 _id 为准：新建保存后 form.id 要等详情回查才回填
        return update({ ...params, id: this._id });
      }
      // 🔑 第 1 步：创建任务，返回任务ID（容器用它 replace 路由，带上 ?id=xxx）
      //    注意：此处不要提前写 this.form.id —— 会让容器的 this.id 提前为真，
      //    容器将走「编辑」分支而不再把ID同步到路由
      return addOrUpdate(params);
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    getDefautlForm () {
      return {
        ...defaultForm,
        // 🔑 新建默认给一行，且必须新造数组（defaultForm 是模块级常量）
        pushConfigList: [createPushConfigRow()]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.push-config-table {
  margin-bottom: 12px;
  border-radius: 4px;
  overflow: hidden; // 让 border 表格的圆角真正生效

  // ---- 表头：浅灰底 + 加粗，和内容行拉开层次 ----
  ::v-deep .el-table__header-wrapper th {
    height: 44px;
    padding: 0;
    background-color: #f5f7fa;
    color: #303133;
    font-size: 13px;
    font-weight: 600;
  }

  // ---- 单元格：上下留白 + 垂直居中，保证行高稳定 ----
  ::v-deep td {
    padding: 9px 0;
    vertical-align: middle;
  }

  ::v-deep .cell {
    padding: 0 12px;
  }

  // ---- 行悬浮高亮，方便横向对齐某一行的四列 ----
  ::v-deep .el-table__body tr:hover > td {
    background-color: var(--leap-color-primary-light-9);
  }

  // ---- 表格内嵌表单：去掉默认下边距；校验提示改为占据行内空间，避免盖住下一行 ----
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }

  ::v-deep .el-form-item__error {
    position: static;
    padding-top: 4px;
    font-size: 12px;
    line-height: 1.2;
  }

  // ---- 下拉框铺满单元格，选中文字不再被压缩 ----
  ::v-deep .el-select {
    width: 100%;
  }

  // ---- 多选展示全部选中值并自动换行 ----
  // 1) 覆盖 FetchSelect 组件内强制的 flex-wrap: nowrap（加 !important 保证优先级）
  // 2) 给右侧箭头图标让位，tags 在剩余宽度内换行
  // 3) el-select 在 filterable 下会按 tags 实际高度自动撑高输入框（resetInputHeight），行高随之增长
  ::v-deep .push-config-select .el-select__tags {
    flex-wrap: wrap !important;
    white-space: normal;
    max-width: calc(100% - 30px);
  }

  // tag 内容不做省略，保证每个选中值完整可见
  ::v-deep .el-select__tags-text {
    max-width: none;
  }

  // 换行后的 tag 行距紧凑一些
  ::v-deep .push-config-select .el-tag {
    margin-top: 2px;
    margin-bottom: 2px;
  }
}

.push-config-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.push-config-tip {
  font-size: 12px;
  color: #909399;
  line-height: 20px;
}

.push-config-empty {
  display: block;
  padding: 16px 0;
  font-size: 12px;
  color: #909399;
}

.push-config-remove {
  color: #f56c6c;

  &:hover {
    color: #e64242;
  }
}
</style>
