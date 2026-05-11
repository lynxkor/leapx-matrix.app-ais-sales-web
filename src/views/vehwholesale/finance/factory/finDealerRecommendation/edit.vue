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
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :dataTransform="dataTransform"
      >
        <template #status>
          <!-- <span >{{form.code}}</span> -->
        </template>
        <template #extraButtons>
          <el-button size="small" @click="handleBatchSync">推送金融机构</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  <fetch-select
                  :remote-method="getParentCompany"
                  remote
                  v-model="form.dealerCompanyName"
                  placeholder="请选择"
                  labelKey="companyName"
                  valueKey="companyName"
                  clearable
                  filterable
                  :disabled="isEditing===true"
                  @change="getDealerCompanyCode"
                  />
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCompanyCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                  <el-form-item label="推荐金融机构：" prop="recFinancialOrganizationName">
                    <fetch-select
                     :remote-method="repairItemSearch"
                      remote
                      reserve-keyword
                      labelKey="organizationName"
                      valueKey="organizationCode"
                      v-model="form.recFinancialOrganizationName"
                      placeholder="请选择"
                      clearable
                      filterable
                      :disabled="isEditing===true"
                      @change="getfundFinancialOrganizationName"
                      />
                </el-form-item>
                 <el-form-item label="推荐额度(万元)：" prop="recAmount">
                  <el-input-number
                    placeholder="请输入推荐额度"
                    v-model="form.recAmount"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :controls="false"
                  />
                </el-form-item>
                 <el-form-item label="推荐日期：" prop="recDate">
                  <el-date-picker
                     type="date"
                    v-model="form.recDate"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
                <el-form-item label="保证金比例%：" prop="depositRatio">
                  <el-input-number
                    placeholder="请输入保证金比例"
                    v-model="form.depositRatio"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :max="100"
                    :controls="false"
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                   <el-date-picker
                      v-model="form.createTime"
                      type="datetime"
                      disabled
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="同步状态：" prop="syncStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vw_sync_status"
                    v-model="form.syncStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="同步时间：" prop="syncTime">
                  <el-date-picker
                    v-model="form.syncTime"
                    :picker-options="pickerOptions"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    disabled
                  />
                </el-form-item>
                  <el-form-item label="同步结果：" prop="syncResult">
                  <el-input
                    placeholder="请输入"
                    v-model="form.syncResult"
                    disabled
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
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="说明：" prop="statusDesc">
                 <el-input
                    placeholder="请输入"
                    v-model="form.statusDesc"
                    :disabled="isEditing===true"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                 <el-form-item label="母公司名称：" prop="dealerCompanyName">
                  {{ form.dealerCompanyName }}
                </el-form-item>
                <el-form-item label="母公司编码：" prop="dealerCompanyCode">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/partner/channelManagement/parentCompany/edit?companyCode=' + form.dealerCompanyCode)">{{ form.dealerCompanyCode }}</el-button>
                </el-form-item>
                <el-form-item label="推荐金融机构：" prop="recFinancialOrganizationName">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/vehwholesale/fund/fundFinancialOrganization/edit?id=' + form.recFinancialOrganizationId)">{{ form.recFinancialOrganizationName }}</el-button>
                </el-form-item>
                <el-form-item label="推荐额度(万元)：" prop="recAmount">
                  {{ form.recAmount }}
                </el-form-item>
                <el-form-item label="推荐日期：" prop="recDate">
                  {{ form.recDate }}
                </el-form-item>
                <el-form-item label="保证金比例%：">
                  {{ form.depositRatio }}
                </el-form-item>
                  <el-form-item label="编码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="同步状态：" prop="syncStatus">
                  {{ form.syncStatusLabel }}
                </el-form-item>
                <el-form-item label="同步时间：">
                  {{ form.syncTime }}
                </el-form-item>
                  <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="同步结果：">
                  {{ form.syncResult }}
                </el-form-item>
                 <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                 <el-form-item label="说明：">
                  {{ form.statusDesc }}
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
import { getDetail, addOrUpdate, pushfinDealerRecommendationToBank } from '@/api/vehwholesale/finance/factory/finDealerRecommendation/index';
import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getParentCompany } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList as fundGetList } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';

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
  status: '1',
  statusDesc: '',
  dataSource: '',
  code: '',
  ownerOrgId: '',
  dealerCompanyName: '',
  dealerCompanyCode: '',
  recFinancialOrganizationName: '',
  recFinancialOrganizationId: '',
  recAmount: '',
  recDate: new Date(),
  depositRatio: '',
  syncStatus: '10',
  syncResult: '',
  syncTime: '',
  syncCount: '',
};

export default {
  name: 'finDealerRecommendationEdit',
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
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '经销商推荐函：' + (this.form.code || '');
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
      pageTitle: '经销商推荐函',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-finDealerRecommendation',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
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
      columns: [],
      rules: {
        dealerCompanyName: [
          { required: true, message: '请输入母公司名称', trigger: 'change' }
        ],
        dealerCompanyCode: [
          { required: true, message: '请输入母公司编码', trigger: 'change' }
        ],
        recFinancialOrganizationName: [
          { required: true, message: '请输入推荐金融机构', trigger: 'change' }
        ],
        recAmount: [
          { required: true, message: '请输入推荐额度', trigger: 'change' }
        ],
        recDate: [
          { required: true, message: '请选择推荐日期', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        // code: [
        //   { required: true, message: '请输入编码', trigger: 'change' }
        // ],
      }
    };
  },
  mounted () {
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
    },
    handleBatchSync () {
      const validSyncStatus = this.form.syncStatus === 40 || this.form.syncStatus === 10;
      console.log(!validSyncStatus, this.form.status !== 0);
      if (!validSyncStatus || this.form.status === 0) {
        this.$message({
          type: 'error',
          message: '同步失败或未同步的可用数据才能同步，请确认'
        });
        return;
      }
      // 二次确认弹框
      this.$confirm('确定要对选中的数据执行同步操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          idSet: [this._id],
        };
        pushfinDealerRecommendationToBank(params).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功'
          });
          this.$refs.containerRef.loadDetail();
        });
      }).catch(() => {});
    },
    getfundFinancialOrganizationName (fundFinancialOrganizationName, obj) {
      this.form.recFinancialOrganizationName = obj.organizationName;
      this.form.recFinancialOrganizationId = obj.id;
      this.form.fundFinancialOrganizationName = obj.organizationName;
    },
    repairItemSearch (query) { return fundGetList({ organizationNameLike: query, status: 1 }); },
    async getParentCompany (query) {
      try {
        const res = await getParentCompany({ parentCompanyName: query });
        this.parentCompanyNames = res;
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    getDealerCompanyCode (dealerCompanyCode, obj) {
      this.form.dealerCompanyCode = obj.companyCode;
    },
    formatIsoToDatetime (isoTime) {
      if (!isoTime) return '';
      return new Date(isoTime).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '-');
    },

    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          console.log('接口返回的原始数据:', res);
          return res;
        });
      }
    },
    submitRequest () {
      let params = {
        ...this.form,
        createTime: this.formatIsoToDatetime(this.form.createTime),
        recDate: this.formatIsoToDatetime(this.form.recDate)
      };
      return addOrUpdate(params);
      // return addOrUpdate({ ...this.form });
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
    dataTransform (data) {
      // 处理接口返回的数据，确保格式与 defaultForm 一致
      // 避免 el-input-number 等组件导致的数据格式变化
      return {
        ...data,
        recAmount: data.recAmount !== undefined && data.recAmount !== null ? Number(data.recAmount) : '',
        depositRatio: data.depositRatio !== undefined && data.depositRatio !== null ? Number(data.depositRatio) : '',
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
