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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="编码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="融资数据来源：" prop="financingDataSource">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_financing_data_source"
                    v-model="form.syncStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车联网里程（公里）：" prop="vehicleNetworkMileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleNetworkMileage"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否人车绑定：" prop="isVehicleBound">
                  <el-input
                    placeholder="请输入"
                    v-model="form.isVehicleBound"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="绑车日期：" prop="bindingDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.bindingDate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="融资金融机构：" prop="fundFinancialOrganizationName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.fundFinancialOrganizationName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="同步状态：" prop="syncStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_sync_status"
                    v-model="form.syncStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="同步结果：" prop="syncResult">
                  <el-input
                    placeholder="请输入"
                    v-model="form.syncResult"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="推送次数：" prop="syncCount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.syncCount"
                    clearable
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
                <el-form-item label="交车日期：" prop="deliveryDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="实车位置经度：" prop="actualLongitude">
                  <el-input
                    placeholder="请输入"
                    v-model="form.actualLongitude"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="实车位置纬度：" prop="actualLatitude">
                  <el-input
                    placeholder="请输入"
                    v-model="form.actualLatitude"
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
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="备注（说明）：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ownerOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="融资金融机构ID：" prop="fundFinancialOrganizationId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.fundFinancialOrganizationId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="同步时间：" prop="syncTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.syncTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="编码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="融资数据来源：" prop="financingDataSource">
                  {{ form.financingDataSource }}
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="车联网里程（公里）：" prop="vehicleNetworkMileage">
                  {{ form.vehicleNetworkMileage }}
                </el-form-item>
                <el-form-item label="是否人车绑定：" prop="isVehicleBound">
                  {{ form.isVehicleBound }}
                </el-form-item>
                <el-form-item label="绑车日期：" prop="bindingDate">
                  {{ form.bindingDate }}
                </el-form-item>
                <el-form-item label="融资金融机构：" prop="fundFinancialOrganizationName">
                  {{ form.fundFinancialOrganizationName }}
                </el-form-item>
                <el-form-item label="同步状态：" prop="syncStatus">
                  {{ form.syncStatus }}
                </el-form-item>
                <el-form-item label="同步结果：" prop="syncResult">
                  {{ form.syncResult }}
                </el-form-item>
                <el-form-item label="推送次数：" prop="syncCount">
                  {{ form.syncCount }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="交车日期：" prop="deliveryDate">
                  {{ form.deliveryDate }}
                </el-form-item>
                <el-form-item label="实车位置经度：" prop="actualLongitude">
                  {{ form.actualLongitude }}
                </el-form-item>
                <el-form-item label="实车位置纬度：" prop="actualLatitude">
                  {{ form.actualLatitude }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
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
                <el-form-item label="备注（说明）：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  {{ form.ownerOrgId }}
                </el-form-item>
                <el-form-item label="融资金融机构ID：" prop="fundFinancialOrganizationId">
                  {{ form.fundFinancialOrganizationId }}
                </el-form-item>
                <el-form-item label="同步时间：" prop="syncTime">
                  {{ form.syncTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>区块标题</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
                />
              </div>
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/finance/factory/finVehicleBindingMileageRecord/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  financingDataSource: '',
  vin: '',
  vehicleNetworkMileage: '',
  isVehicleBound: '',
  bindingDate: '',
  fundFinancialOrganizationIds: [],
  syncstatus: '1',
  syncResult: '',
  syncCount: '',
  createTime: '',
  deliveryDate: '',
  actualLongitude: '',
  actualLatitude: '',
  status: '1',
  statusDesc: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  dataSource: '',
  ownerOrgId: '',
  fundFinancialOrganizationId: '',
  syncTime: '',
};

export default {
  name: 'finVehicleBindingMileageRecordEdit',
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
    EditTable,
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
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '账户管理-车厂融资信息-车辆绑车及里程记录管理',
      pageType: 'edit',
      title: '编码：' + form.code,
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-finVehicleBindingMileageRecord',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        code: [
          { required: true, message: '请输入编码', trigger: 'change' }
        ],
        financingDataSource: [
          { required: true, message: '请输入融资数据来源', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入VIN号', trigger: 'change' }
        ],
        vehicleNetworkMileage: [
          { required: true, message: '请输入车联网里程（公里）', trigger: 'change' }
        ],
        isVehicleBound: [
          { required: true, message: '请输入是否人车绑定', trigger: 'change' }
        ],
        bindingDate: [
          { required: true, message: '请输入绑车日期', trigger: 'change' }
        ],
        fundFinancialOrganizationName: [
          { required: true, message: '请输入融资金融机构', trigger: 'change' }
        ],
        syncStatus: [
          { required: true, message: '请选择同步状态', trigger: 'change' }
        ],
        syncResult: [
          { required: true, message: '请输入同步结果', trigger: 'change' }
        ],
        syncCount: [
          { required: true, message: '请输入推送次数', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        deliveryDate: [
          { required: true, message: '请输入交车日期', trigger: 'change' }
        ],
        actualLongitude: [
          { required: true, message: '请输入实车位置经度', trigger: 'change' }
        ],
        actualLatitude: [
          { required: true, message: '请输入实车位置纬度', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注（说明）', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
        ],
        fundFinancialOrganizationId: [
          { required: true, message: '请输入融资金融机构ID', trigger: 'change' }
        ],
        syncTime: [
          { required: true, message: '请选择同步时间', trigger: 'change' }
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
