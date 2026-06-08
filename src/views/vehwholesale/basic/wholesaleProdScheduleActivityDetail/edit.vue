<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :showEditBtn="false"
        :showBackBtn="showBackBtn"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- {{ form.activityCode }} -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
                    maxlength = '150'
                    placeholder="请输入(最多150个字符)"
                    v-model="form.remark"
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
                </el-form-item>
                <el-form-item label="排产活动ID：" prop="scheduleActivityId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.scheduleActivityId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店编码（组织code同网发门店编码）：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店名称（组织名称同网发门店名称）：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车系ID：" prop="seriesId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车系名称：" prop="seriesName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.seriesName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="系列ID：" prop="modelLineId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelLineId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="系列名称：" prop="modelLineName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelLineName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物料ID：" prop="materialsId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.materialsCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="适用订单分类：" prop="applyOrderCategory">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyOrderCategory"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="额度数量：" prop="totalQuotaQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.totalQuotaQty"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="已提报数量：" prop="usedQuotaQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.usedQuotaQty"
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
                <el-form-item label="年款ID：" prop="yearTypeId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.yearTypeId"
                    placeholder="请选择"
                    clearable
                    filterable
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
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="活动编码：" prop="activityCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/basic/wholesaleProdScheduleActivity/edit?id=${form.scheduleActivityId}`" target="_blank">{{ form.activityCode }}</el-link>
                </el-form-item>
                <el-form-item label="活动名称：" prop="activityName">
                  {{ form.activityName }}
                </el-form-item>
                 <el-form-item label="车系名称：" prop="seriesName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleseries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName }}</el-link>
                </el-form-item>
                  <el-form-item label="允许锁零售单：" prop="allowLockRetailLabel">
                  {{ form.allowLockRetailLabel }}
                </el-form-item>
                <el-form-item label="开始日期：" prop="startTime">
                  {{ form.startTime }}
                </el-form-item>
                <el-form-item label="截至日期：" prop="endTime">
                  {{ form.endTime }}
                </el-form-item>
                  <el-form-item label="门店编码：" prop="dealerCode">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">{{ form.dealerCode }}</el-link>
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="省份：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="城市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                  <el-form-item label="适用订单分类：" prop="applyOrderCategoryLabel">
                  {{ form.applyOrderCategoryLabel }}
                </el-form-item>
                <el-form-item label="系列名称：" prop="modelLineName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclemodelline/edit?id=${form.modelLineId}`" target="_blank">{{ form.modelLineName }}</el-link>
                </el-form-item>
                  <el-form-item label="年款名称：" prop="yearTypeName">
                     <el-link type="primary" :href="`/sales/datacenter/materials/vehicleyeartype/edit?id=${form.yearTypeId}`" target="_blank">{{ form.yearTypeName }}</el-link>
                </el-form-item>
                  <el-form-item label="物料编码：" prop="materialsCode">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclematerials/edit?id=${form.materialsId}`" target="_blank">{{ form.materialsCode }}</el-link>
                </el-form-item>
                  <el-form-item label="物料描述：" prop="materialsDesc">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="额度数量：" prop="totalQuotaQty">
                  {{ form.totalQuotaQty }}
                </el-form-item>
                <el-form-item label="已提报数量：" prop="usedQuotaQty">
                  {{ form.usedQuotaQty }}
                </el-form-item>
                 <el-form-item label="剩余可用：" prop="remainQuotaQty">
                  {{ form.remainQuotaQty }}
                </el-form-item>
                   <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <!-- <section class="common-section">
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
          </section> -->
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleProdScheduleActivityDetail/index';
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
  status: '',
  statusDesc: '',
  scheduleActivityId: '',
  dealerCode: '',
  dealerName: '',
  dealerId: '',
  seriesId: '',
  seriesName: '',
  modelLineId: '',
  modelLineName: '',
  materialsId: '',
  materialsCode: '',
  applyOrderCategory: '',
  totalQuotaQty: '',
  usedQuotaQty: '',
  ownerOrgId: '',
  yearTypeId: '',
  yearTypeName: '',
};

export default {
  name: 'wholesaleProdScheduleActivityDetailEdit',
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
    FetchSelect,
    EditBaseContainer,
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '排产专项活动明细：' + (this.form.activityDetailCode || '');
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
      pageTitle: '排产专项活动明细',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleProdScheduleActivityDetail',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [],
      rules: {
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
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
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        scheduleActivityId: [
          { required: true, message: '请输入排产活动ID', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码（组织code同网发门店编码）', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称（组织名称同网发门店名称）', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请输入车系ID', trigger: 'change' }
        ],
        seriesName: [
          { required: true, message: '请输入车系名称', trigger: 'change' }
        ],
        modelLineId: [
          { required: true, message: '请输入系列ID', trigger: 'change' }
        ],
        modelLineName: [
          { required: true, message: '请输入系列名称', trigger: 'change' }
        ],
        materialsId: [
          { required: true, message: '请输入物料ID', trigger: 'change' }
        ],
        materialsCode: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
        ],
        applyOrderCategory: [
          { required: true, message: '请输入适用订单分类', trigger: 'change' }
        ],
        totalQuotaQty: [
          { required: true, message: '请输入额度数量', trigger: 'change' }
        ],
        usedQuotaQty: [
          { required: true, message: '请输入已提报数量', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
        ],
        yearTypeId: [
          { required: true, message: '请选择年款ID', trigger: 'change' }
        ],
        yearTypeName: [
          { required: true, message: '请选择年款名称', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.detailRequest();
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          if (res.dealerId) {
            this.form.dealerId = res.dealerId;
          }
          return res;
        });
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
