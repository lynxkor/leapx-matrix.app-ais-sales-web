<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :showBackBtn="showBackBtn"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基本信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="活动编码：" prop="activityCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.activityCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="活动名称：" prop="activityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.activityName"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="已提报数量：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.usedQuotaQty"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="额度数量：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.totalQuotaQty"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="是否锁零售单：" prop="allowLockRetail">
                  <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.allowLockRetail"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                </el-form-item>
                 <el-form-item label="是否需要自动配车" prop="needAutoAllocateCar">
                   <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.needAutoAllocateCar"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                </el-form-item>
                    <el-form-item label="指定发运方式：" prop="deliveryWay">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryWay"
                    clearable
                  />
                </el-form-item>
                 <el-form-item label="开始日期：" prop="startTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.startTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="截止日期：" prop="endTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.endTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                 <el-form-item label="备注（说明）：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                 <el-form-item label="修改者名称：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改时间：">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>

                  <!-- <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>

                 <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
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
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
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
                </el-form-item> -->
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <!-- <el-form-item label="主键：" prop="id">
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
                <el-form-item label="备注（说明）：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item> -->
                <el-form-item label="活动编码：" prop="activityCode">
                  {{ form.activityCode }}
                </el-form-item>
                <el-form-item label="活动名称：" prop="activityName">
                  {{ form.activityName }}
                </el-form-item>
                 <el-form-item label="已提报数量：" prop="usedQuotaQty">
                  {{ form.usedQuotaQty }}
                </el-form-item>
                 <el-form-item label="额度数量：" prop="totalQuotaQty">
                  {{ form.totalQuotaQty }}
                </el-form-item>
                 <el-form-item label="是否锁零售单：" prop="allowLockRetail">
                  {{ form.allowLockRetail }}
                </el-form-item>
                  <el-form-item label="是否需要自动配车" prop="needAutoAllocateCar">
                  {{ form.needAutoAllocateCar }}
                </el-form-item>
                <el-form-item label="指定发运方式：" prop="deliveryWay">
                  {{ form.deliveryWay }}
                </el-form-item>

                <el-form-item label="开始日期：" prop="startTime">
                  {{ form.startTime }}
                </el-form-item>
                <el-form-item label="截止日期：" prop="endTime">
                  {{ form.endTime }}
                </el-form-item>
                <el-form-item label="备注（说明）：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>排产活动明细</h2>
              <!-- <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button> -->
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleProdScheduleActivity/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/components/EditBaseContainer';
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
  status: '',
  statusDesc: '',
  activityCode: '',
  activityName: '',
  startTime: '',
  endTime: '',
  needAutoAllocateCar: '',
  deliveryWay: '',
  allowLockRetail: '',
  totalQuotaQty: '',
  usedQuotaQty: '',
};

export default {
  name: 'wholesaleProdScheduleActivityEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
    showBackBtn: {
      type: Boolean,
      default: true,
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
        if (val) {
          this.getDetailData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '整车批售-批售主数据-排产专项活动管理',
      pageType: 'edit',
      title: '主键：' + form.id,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleProdScheduleActivity',
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
          field: 'dealerCode',
          title: '门店编码',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'dealerName',
          title: '门店名称',
          editable: true,
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'provinceName',
          title: '省份',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'cityName',
          title: '城市',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'applyOrderCategoryLabel',
          title: '适用订单分类',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'seriesName',
          title: '车系',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'yearTypeName',
          title: '年款',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'materialsCode',
          title: '物料编码',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'materialsDesc',
          title: '物料描述',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'totalQuotaQty',
          title: '额度数量',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'usedQuotaQty',
          title: '已提报数量',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'remainQuotaQty',
          title: '剩余可用',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'createTime',
          title: '创建时间',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        // id: [
        //   { required: true, message: '请输入主键', trigger: 'change' }
        // ],
        // creator: [
        //   { required: true, message: '请输入创建者', trigger: 'change' }
        // ],
        // creatorName: [
        //   { required: true, message: '请输入创建者名称', trigger: 'change' }
        // ],
        // createTime: [
        //   { required: true, message: '请选择创建时间', trigger: 'change' }
        // ],
        // modifier: [
        //   { required: true, message: '请输入修改者', trigger: 'change' }
        // ],
        // modifierName: [
        //   { required: true, message: '请输入修改者名称', trigger: 'change' }
        // ],
        // updateTime: [
        //   { required: true, message: '请选择修改时间', trigger: 'change' }
        // ],
        // remark: [
        //   { required: true, message: '请输入备注（说明）', trigger: 'change' }
        // ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        activityCode: [
          { required: true, message: '请输入活动编码', trigger: 'change' }
        ],
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ],
        needAutoAllocateCar: [
          { required: true, message: '请输入是否需要自动配车,1:是；0：否', trigger: 'change' }
        ],
        // deliveryWay: [
        //   { required: true, message: '请输入指定发运方式', trigger: 'change' }
        // ],
        allowLockRetail: [
          { required: true, message: '请输入是否锁零售单', trigger: 'change' }
        ],
        // totalQuotaQty: [
        //   { required: true, message: '请输入额度数量', trigger: 'change' }
        // ],
        // usedQuotaQty: [
        //   { required: true, message: '请输入已提报数量', trigger: 'change' }
        // ],
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
