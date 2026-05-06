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
                 <el-form-item label="车系名称：" prop="seriesId">
                      <fetch-select
                          :remote-method="remoteMethods.series"
                          v-model="form.seriesId"
                          placeholder="请选择"
                          labelKey="name"
                          valueKey="id"
                          clearable
                          filterable
                          remote
                          @change="getSeriesName"
                          />
                    </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeId">
                  <fetch-select
                    :remote-method="listVehicleYearType"
                    remote
                    v-model="form.yearTypeId"
                    placeholder="请选择"
                    labelKey="name"
                    valueKey="id"
                    clearable
                    collapseTags
                    filterable
                    :options="yearTypeList"
                    @change="getYearName"
                  />
                </el-form-item>
                <el-form-item label="预售急单设置 ：" prop="preSaleUrgentStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.preSaleUrgentStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="预售锁单时间要求：" prop="preSaleLockTime">
                  <el-date-picker
                      type="datetime"
                      v-model="form.preSaleLockTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                    />
                </el-form-item>
                <el-form-item label="盲订急单设置：" prop="blindOrderUrgentStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.blindOrderUrgentStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="盲订锁单时间要求：" prop="blindOrderLockTime">
                  <el-date-picker
                      type="datetime"
                      v-model="form.blindOrderLockTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                    />
                </el-form-item>
                <el-form-item label="备注：">
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
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                      type="datetime"
                      v-model="form.createTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      disabled
                    />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="车系名称：" prop="seriesName">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="年款名称：" prop="yearTypeName">
                  {{ form.yearTypeName }}
                </el-form-item>
                <el-form-item label="预售急单设置：" prop="preSaleUrgentStatus">
                  {{ form.preSaleUrgentStatusLabel }}
                </el-form-item>
                <el-form-item label="预售锁单时间要求：" prop="preSaleLockTime">
                  {{ form.preSaleLockTime }}
                </el-form-item>
                <el-form-item label="盲订急单设置：" prop="blindOrderUrgentStatusLabel">
                  {{ form.blindOrderUrgentStatusLabel }}
                </el-form-item>
                <el-form-item label="盲订锁单时间要求：" prop="blindOrderLockTime">
                  {{ form.blindOrderLockTime }}
                </el-form-item>
                 <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
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
import { getDetail, addOrUpdate } from '@/api/vehretail/basicConfig/orderUrgentConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getEnum, vehicleSeriesList, listVehicleYearType } from '@/api/common';
const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  createTime: new Date(),
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  seriesId: '',
  seriesName: '',
  yearTypeId: '',
  yearTypeName: '',
  preSaleUrgentStatus: '',
  preSaleLockTime: '',
  blindOrderUrgentStatus: '',
  blindOrderLockTime: '',
  dataSource: '',
};

export default {
  name: 'orderUrgentConfigEdit',
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
      return '盲订急单配置：' + this.form.id;
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
    'form.preSaleUrgentStatus': {
      handler (val) {
        if (val === 1 || val === '1') {
          this.rules.preSaleLockTime = [
            { required: true, message: '请选择预售锁单时间要求', trigger: 'change' }
          ];
        } else {
          this.rules.preSaleLockTime = [];
        }
      },
      immediate: true
    },
    'form.blindOrderUrgentStatus': {
      handler (val) {
        if (val === 1 || val === '1') {
          this.rules.blindOrderLockTime = [
            { required: true, message: '请选择盲订锁单时间要求', trigger: 'change' }
          ];
        } else {
          this.rules.blindOrderLockTime = [];
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      remoteMethods: {
        series: async (query) => {
          return await vehicleSeriesList({ seriesNameLike: query, status: 1 });
        }
      },
      pageTitle: '盲订急单配置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-orderUrgentConfig',
      loading: false,
      submitLoading: false,
      yearTypeList: [],
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
      rules: {
        status: [
          { required: true, message: '请选择状态 0-禁用;1-启用', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请输入车系ID', trigger: 'change' }
        ],
        yearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' }
        ],
        preSaleUrgentStatus: [
          { required: true, message: '请选择预售急单设置 1-是;0-否', trigger: 'change' }
        ],
        preSaleLockTime: [],
        blindOrderUrgentStatus: [],
        blindOrderLockTime: [
          { required: true, message: '请选择盲订锁单时间要求', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    getSeriesName (val, obj) {
      this.form.seriesName = obj.name;
    },
    getYearName (val, obj) {
      console.log('getYearName:', val, obj);
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
