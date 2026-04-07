<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="排产专项活动："
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          {{ form.activityCode }}
        </template>
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
                    disabled
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
                  <el-input-number
                      :controls="false"
                      style="width: 100%;"
                      placeholder="请输入"
                       v-model="form.usedQuotaQty"
                      clearable
                      disabled
                      :precision="0"
                    />
                </el-form-item>
                <el-form-item label="额度数量：">
                  <el-input-number
                      :controls="false"
                      style="width: 100%;"
                      placeholder="请输入"
                       v-model="form.totalQuotaQty"
                      clearable
                      disabled
                      :precision="0"
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
                 <el-form-item label="是否需要自动配车：" prop="needAutoAllocateCar">
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
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehstock_ship_via"
                    v-model="form.deliveryWay"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                 <el-form-item label="开始日期：" prop="startTime">
                  <el-date-picker
                    type="date"
                    v-model="form.startTime"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择开始日期"
                  />
                </el-form-item>
                <el-form-item label="截止日期：" prop="endTime">
                  <el-date-picker
                    type="date"
                    v-model="form.endTime"
                    value-format="yyyy-MM-dd"
                    placeholder="请选日期"
                  />
                </el-form-item>
                 <el-form-item label="备注（说明）：">
                  <el-input
                    maxlength = '150'
                    placeholder="请输入(最多150个字符)"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                    disabled
                  />
                </el-form-item>
                  <el-form-item label="创建时间：">
                    <el-date-picker
                    type="datetime"
                    v-model="form.createTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    disabled
                  />
                </el-form-item>
                 <el-form-item label="修改者名称：" v-show="_id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="修改时间：" v-show="_id">
                  <el-date-picker
                    type="datetime"
                    v-model="form.updateTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    disabled
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
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
                 <el-form-item label="是否锁零售单：" prop="allowLockRetailLabel">
                  {{ form.allowLockRetailLabel }}
                </el-form-item>
                  <el-form-item label="是否需要自动配车：" prop="needAutoAllocateCarLabel">
                  {{ form.needAutoAllocateCarLabel }}
                </el-form-item>
                <el-form-item label="指定发运方式：" prop="deliveryWayLabel">
                  {{ form.deliveryWayLabel }}
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
          <section class="common-section" v-if="!!_id">
            <div class="common-section-header">
              <h2>排产活动明细</h2>
            </div>
            <div>
              <el-form :inline="true" :model="detailForm" label-width="150px" class="form-edit">
                <el-form-item label="门店编码：">
                  <tag-input v-model="detailForm.dealerCodes" placeholder="请输入" style="margin-top:4px"/>
                </el-form-item>
                <el-form-item label="门店名称：">
                  <tag-input v-model="detailForm.dealerNames" placeholder="请输入" style="margin-top:4px"/>
                </el-form-item>
                <el-form-item label="">
                  <el-button size="small" @click="handleAddRow" style="margin-left: 5px;">活动明细导入</el-button>
                </el-form-item>
                <el-form-item label=" ">
                  <el-button size="small" type="primary" @click="handleQuery">查询</el-button>
                  <el-button size="small" @click="handleClear">清空</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :show-pagination="true"
                  :enable-single-row-save="true"
                  :options="options"
                  :current="pageNum"
                  :pageSize="pageSize"
                  :total="total"
                  @save-row-edit="saveRowEdit"
                  @remove-row="handleRemoveRow"
                  @page-size-change="pageSizeChange"
                  @current-page-change="currentPageChange"
                  :auth="{edit: isEditing, delete: isEditing}"
                />
              </div>
            </div>
            <!-- TIPS: 填入项目id即可 -->
            <Upload
              :visible="uploadDialogVisible"
              id='detailImportExcel'
              :businessParams="_id"
              @getData="handleQuery"
              @close="uploadDialogVisible = false"
            />
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
import { getList, addOrUpdate as addOrUpdateDetail, deleteItem } from '@/api/vehwholesale/basic/wholesaleProdScheduleActivityDetail/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, loginUserGet } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import Upload from '@/libs/components/UploadDialog';
import TagInput from '@/libs/components/TagInput';

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
    TagInput,
    Upload,
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
    const detailForm = {};
    const validateTotalQuotaQty = (rule, value, callback) => {
      const { totalQuotaQty, usedQuotaQty } = this.form;
      if (totalQuotaQty < usedQuotaQty) {
        return callback(new Error('额度数量不能小于已提报数量'));
      }
      callback();
    };
    const validateUsedQuotaQty = (rule, value, callback) => {
      const { totalQuotaQty, usedQuotaQty } = this.form;
      console.log(totalQuotaQty, usedQuotaQty);
      if (totalQuotaQty < usedQuotaQty) {
        return callback(new Error('已提报数量不能大于额度数量'));
      }
      callback();
    };
    const validateDateRange = (rule, value, callback) => {
      const { startTime, endTime } = this.form;
      // 1. 校验截止日期必填
      if (!endTime) {
        return callback(new Error('请选择截止日期'));
      }

      // 2. 转换为时间戳（兼容日期/日期时间格式）
      const getTimeStamp = (dateStr) => {
        if (!dateStr) return 0;
        return new Date(dateStr).getTime();
      };
      const effstartTime = getTimeStamp(startTime);
      const effendTime = getTimeStamp(endTime);
      // 当日时间戳（23:59:59）：避免选当日提示超限
      const todayEnd = new Date();
      todayEnd.setHours(0, 0, 0, 0);
      // const todayEndTime = todayEnd.getTime();

      // 3. 校验开始日期 ≤ 截止日期
      if (startTime && effstartTime > effendTime) {
        return callback(new Error('开始日期不能晚于截止日期'));
      }
      callback();
    };
    return {
      pageTitle: '排产专项活动',
      pageType: 'edit',
      title: '主键：' + form.id,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleProdScheduleActivity',
      loading: false,
      submitLoading: false,
      uploadDialogVisible: false,
      yes_no_enum: YES_NO_ENUM,
      generateCode: '',
      detailForm: { ...detailForm },
      form: { ...form },
      originalForm: { ...form },
      pageNum: 1,
      pageSize: 20,
      total: 0,
      defaultNewRow: {
        totalQuotaQty: '',
      },
      tableData: [
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
          width: '120'
        },
        {
          field: 'dealerName',
          title: '门店名称',
          width: '200'
        },
        {
          field: 'provinceName',
          title: '省份',
          width: '100'
        },
        {
          field: 'cityName',
          title: '城市',
          width: '100'
        },
        {
          field: 'applyOrderCategoryLabel',
          title: '适用订单分类',
          width: '120'
        },
        {
          field: 'seriesName',
          title: '车系',
          width: '100'
        },
        {
          field: 'yearTypeName',
          title: '年款',
          width: '100'
        },
        {
          field: 'materialsCode',
          title: '物料编码',
          width: '150'
        },
        {
          field: 'materialsDesc',
          title: '物料描述',
          width: '300'
        },
        {
          field: 'totalQuotaQty',
          title: '额度',
          width: '120',
          editable: true,
          editRender: {
            name: 'ElInput',
            props: {
              type: 'number'
            }
          },
          rules: [
            { required: true, message: '额度数量不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'usedQuotaQty',
          title: '已提报数量',
          width: '120'
        },
        {
          field: 'remainQuotaQty',
          title: '剩余可用',
          width: '120'
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '200'
        },
      ],
      rules: {
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择截止日期', trigger: 'change' },
          { validator: validateDateRange, trigger: 'change' }
        ],
        needAutoAllocateCar: [
          { required: true, message: '请输入是否需要自动配车', trigger: 'change' }
        ],
        // deliveryWay: [
        //   { required: true, message: '请输入指定发运方式', trigger: 'change' }
        // ],
        allowLockRetail: [
          { required: true, message: '请输入是否锁零售单', trigger: 'change' }
        ],
        totalQuotaQty: [
          { required: true, message: '请输入额度数量', trigger: 'change' },
          { validator: validateTotalQuotaQty, trigger: 'change' }
        ],
        usedQuotaQty: [
          { required: true, message: '请输入已提报数量', trigger: 'change' },
          { validator: validateUsedQuotaQty, trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    if (this._id) {
      this.getList();
    }
  },
  methods: {
    getDetailData () {
      const id = this._id;
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    // 查询方法
    handleQuery () {
      this.pageNum = 1; // 重置到第一页
      this.getList();
      this.getDetailData();
    },
    // 清空方法
    handleClear () {
      this.detailForm.dealerCodes = [];
      this.detailForm.dealerNames = [];
      this.pageNum = 1;
      this.getList();
    },
    handleRemoveRow (row, index, defer) {
      if (!row.id) {
        return;
      }
      if (row.usedQuotaQty > 0) {
        this.$message.error('排产专项活动已提报数量大于0, 不允许删除');
        this.getList();
      } else {
        deleteItem([row.id]).then((d) => {
          defer.resolve();
          this.$message.success('删除成功');
          this.getDetailData();
          this.getList();
        }).catch(() => {
          defer.reject();
        });
      }
    },
    // 行保存
    saveRowEdit (row, defer) {
      if (row.totalQuotaQty < row.usedQuotaQty) {
        this.$message.error(`额度数量不能低于已提报数量！当前已提报数量为 ${row.usedQuotaQty}`);
        defer.reject();
        return;
      }
      // const parmas = {
      //   id: row.id,
      //   partId: row.partId, // 零件ID
      //   partQuantity: row.partQuantity, // 零件数量
      // };
      // return;
      addOrUpdateDetail(row).then(id => {
        defer.resolve(id);
        this.$message.success('更新成功');
        this.getDetailData();
        this.getList();
        this.$emit('replace');
      }).catch(e => {
        defer.reject();
      });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getList();
    },
    currentPageChange (pageNum) {
      this.pageNum = pageNum;
      this.getList();
    },
    getList () {
      getList({
        ...this.detailForm,
        scheduleActivityId: this._id,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.tableData = res.records;
        this.total = res.totals;
      }).catch(() => {
      });
    },
    getLoginUser () {
      if (!this.id) {
        loginUserGet().then(res => {
          this.form.creatorName = res.userName;
        }).catch(() => {});
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
      this.uploadDialogVisible = true;
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

<style lang="scss" scoped>
  ::v-deep .tag-input {
    line-height: 32px;
  }
</style>
