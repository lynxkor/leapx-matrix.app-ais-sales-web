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
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- {{ form.activityCode }} -->
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
                <!-- 允许锁零售单：选择【否】时，下方【允许锁零售节点】自动默认为【门店收车】(值=10)；选择【是】时清空节点 -->
                 <el-form-item label="允许锁零售单：" prop="allowLockRetail">
                  <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.allowLockRetail"
                      placeholder="请选择"
                      clearable
                      filterable
                      @change="handleAllowLockRetailChange"
                    />
                </el-form-item>
                <!-- 允许锁零售节点：受【允许锁零售单】联动控制，非必填 -->
                <el-form-item label="允许锁零售节点：" prop="allowLockNode">
                  <fetch-select
                      :request="fetchOptions"
                      enumCode="vw_allow_lock_node_type"
                      v-model="form.allowLockNode"
                      placeholder="请选择"
                      clearable
                      filterable
                      @change="handleAllowLockNodeChange"
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
                <!-- 是否二网：补货申请选择本活动时，按此值锁定该单的是否二网（下游同步零小跑用） -->
                <el-form-item label="是否二网：" prop="secondDealerFlag">
                  <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.secondDealerFlag"
                      placeholder="请选择是否二网"
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
                    type="datetime"
                    v-model="form.startTime"
                     value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择开始日期"
                  />
                </el-form-item>
                <el-form-item label="截止日期：" prop="endTime">
                  <el-date-picker
                    type="datetime"
                    v-model="form.endTime"
                     value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                    placeholder="请选择当前时间之后的日期"
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
                <el-form-item label="创建者名称：" v-show="_id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                    disabled
                  />
                </el-form-item>
                  <el-form-item label="创建时间：" >
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
                 <el-form-item label="允许锁零售单：" prop="allowLockRetailLabel">
                  {{ form.allowLockRetailLabel }}
                </el-form-item>
                 <el-form-item label="允许锁零售节点：" prop="allowLockNodeLabel">
                  {{ form.allowLockNodeLabel }}
                </el-form-item>
                  <el-form-item label="是否需要自动配车：" prop="needAutoAllocateCarLabel">
                  {{ form.needAutoAllocateCarLabel }}
                </el-form-item>
                <el-form-item label="是否二网：">
                  {{ secondDealerFlagLabel }}
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
                <!-- 按钮靠右对齐 -->
                <el-form-item label="" class="form-item-btns" style="text-align: right;">
                  <el-button size="small" type="primary" plain @click="handleQuery">查询</el-button>
                  <el-button size="small" @click="handleClear" style="margin-left: 8px">重置</el-button>
                </el-form-item>
              </el-form>
              <div class="ais-actions">
                 <el-form>
                  <el-form-item label="">
                    <el-button v-if='canImport' size="small" @click="handleAddDetail" style="margin-left: 15px;">新增</el-button>
                    <el-button v-if ='canImport' size="small" @click="handleAddRow" style="margin-left: 15px;">活动明细导入</el-button>
                    <el-button v-if ='perupdateQuotaQty' size="small" :disabled="selectionList.length === 0" @click="handleChangeQty" style="margin-left: 15px;">配额调整</el-button>
                  </el-form-item>
                </el-form>
              </div>
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
                  :checkbox="true"
                  :options="options"
                  :current="pageNum"
                  :pageSize="pageSize"
                  :total="total"
                  @save-row-edit="saveRowEdit"
                  @remove-row="handleRemoveRow"
                  @page-size-change="pageSizeChange"
                  @current-page-change="currentPageChange"
                  @checkboxChange="handleCheckboxChange"
                  :auth="{edit: isEditing, delete: isEditing}"
                >
                  <template #default="{ row, column }">
                    <template v-if="column.property === 'activityDetailCode' && row.id">
                      <el-link type="primary" :href="`/sales/vehwholesale/basic/wholesaleProdScheduleActivityDetail/edit?id=${row.id}`" target="_blank">
                        {{ row.activityDetailCode }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'dealerCode' && row.dealerCode">
                      <el-link type="primary" :href="`/service/datacenter/store/store/detail?storeCode=${row.dealerCode}`" target="_blank">
                        {{ row.dealerCode }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'dealerName' && row.dealerCode">
                      <el-link type="primary" :href="`/service/datacenter/store/store/detail?storeCode=${row.dealerCode}`" target="_blank">
                        {{ row.dealerName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'seriesName' && row.seriesId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleSeries/edit?id=${row.seriesId}`" target="_blank">
                        {{ row.seriesName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'modelLineName' && row.modelLineId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleModelLine/edit?id=${row.modelLineId}`" target="_blank">
                        {{ row.modelLineName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'yearTypeName' && row.yearTypeId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleYearType/edit?id=${row.yearTypeId}`" target="_blank">
                        {{ row.yearTypeName }}
                      </el-link>
                    </template>
                    <template v-else-if="column.property === 'materialsCode' && row.materialsId">
                      <el-link type="primary" :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${row.materialsId}`" target="_blank">
                        {{ row.materialsCode }}
                      </el-link>
                    </template>
                    <template v-else-if="column.formatter">
                      {{ column.formatter(row[column.field], row, column) }}
                    </template>
                    <template v-else>
                      {{ row[column.field] }}
                    </template>
                  </template>
                </edit-table>
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
     <el-dialog class="audit-total-dialog" title="排产专项活动明细配额调整" width="600px" :visible.sync="totalQuotaQtyDialogVisible"
      @close="changeClose">
      <el-form ref="changeformRef" :model="changeform" label-width="120px" size="small">
        <el-form-item label="修改配额数量：" prop="totalQuotaQty">
          <el-input-number :controls="false" style="width: 100%;" placeholder="请输入" v-model="changeform.totalQuotaQty"
            clearable :precision="0" :min="0" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer" style="text-align: center;">
          <el-button :loading="submitLoading" @click="changeClose()" size="small">取消</el-button>
          <el-button :loading="submitLoading" type="primary" @click="changeSure()" size="small">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleProdScheduleActivity/index';
import { getList, addOrUpdate as addOrUpdateDetail, deleteItem, updateTotalQuotaQty } from '@/api/vehwholesale/basic/wholesaleProdScheduleActivityDetail/index';
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
  // 是否二网：默认「否」，与后端 DDL DEFAULT 0 保持一致（不传 null，避免存量列被写成 NULL）
  secondDealerFlag: 0,
  deliveryWay: '',
  allowLockRetail: '',
  allowLockNode: ''
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
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '排产专项活动：' + (this.form.activityCode || '');
    },
    // 「是否二网」后端未挂字典注解，不会自动补 Label，这里用 YES_NO_ENUM 翻译；存量 NULL 按「否」展示
    secondDealerFlagLabel () {
      const match = this.yes_no_enum.find(enumItem => enumItem.code === String(this.form.secondDealerFlag ?? 0));
      return match ? match.message : '';
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

      if (new Date(this.form.endTime).getTime() <= Date.now()) {
        return callback(new Error('请选择当前时间之后的日期！'));
      }

      // 2. 转换为时间戳（兼容日期/日期时间格式）
      const getTimeStamp = (dateStr) => {
        if (!dateStr) return 0;
        return new Date(dateStr).getTime();
      };
      const effstartTime = getTimeStamp(startTime);
      const effendTime = getTimeStamp(endTime);
      // 3. 校验开始日期 ≤ 截止日期
      if (startTime && effstartTime > effendTime) {
        return callback(new Error('开始日期不能晚于截止日期'));
      }
      callback();
    };
    return {
      pageTitle: '排产专项活动',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-wholesaleProdScheduleActivity',
      loading: false,
      submitLoading: false,
      uploadDialogVisible: false,
      changeform: {},
      totalQuotaQtyDialogVisible: false,
      perupdateQuotaQty: false,
      yes_no_enum: YES_NO_ENUM,
      generateCode: '',
      detailForm: { ...detailForm },
      form: { ...form },
      originalForm: { ...form },
      pageNum: 1,
      pageSize: 20,
      total: 0,
      selectionList: [],
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
      pickerOptions: {
        disabledDate (time) {
          // time 是日期面板渲染的日期零点
          // new Date() 获取当前实时时间
          return time.getTime() < Date.now();
        }
      },
      columns: [
        {
          field: 'activityDetailCode',
          title: '活动明细编码',
          width: '150',
        },
        {
          field: 'dealerCode',
          title: '门店编码',
          width: '150',
        },
        {
          field: 'dealerName',
          title: '门店名称',
          width: '180',
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
          field: 'modelLineName',
          title: '系列',
          width: '120'
        },
        {
          field: 'seriesName',
          title: '车系',
          width: '120',
        },
        {
          field: 'yearTypeName',
          title: '年款',
          width: '120',
        },
        {
          field: 'materialsCode',
          title: '物料编码',
          width: '180',
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
          align: 'right',
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
          width: '120',
          align: 'right'
        },
        {
          field: 'remainQuotaQty',
          title: '剩余可用',
          width: '120',
          align: 'right'
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
        secondDealerFlag: [
          { required: true, message: '请选择是否二网', trigger: 'change' }
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
        allowLockNode: [
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
  created () {
    this.initPermissions();
  },
  methods: {
    initPermissions () {
      this.perupdateQuotaQty = this.permissions.has(`${this.moduleKey}-updateQuotaQty`);
    },
    handleAllowLockRetailChange (val) {
      // BooleanEnum：1=是，0=否（FetchSelect 会将数字 code 转成字符串，所以需兼容 '0'/'1'）
      // 选择【是】时节点默认不选为空，非必填；选择【否】时默认【门店收车】(值=10)
      if (val === 1 || val === '1' || val === true || val === 'true') {
        this.form.allowLockNode = '';
      } else {
        this.form.allowLockNode = 10;
      }
    },
    handleAllowLockNodeChange (val) {
      // 显式同步节点值，确保清空操作能正确写入 form（避免 v-model 未及时同步导致旧值提交）
      this.form.allowLockNode = (val === null || val === undefined) ? '' : val;
    },
    changeSure () {
      const ids = this.selectionList.map(item => item.id) || [];
      const submitForm = {
        scheduleActivityId: this.form.id,
        idSet: ids,
        updateTotalQuotaQty: this.changeform.totalQuotaQty
      };
      console.log(submitForm);
      updateTotalQuotaQty(submitForm).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        });
        // 清空选中状态，避免下次编辑仍带选中的明细ID
        this.selectionList = [];
        if (this.$refs.editTable && this.$refs.editTable.clearSelection) {
          this.$refs.editTable.clearSelection();
        }
        this.changeform = { totalQuotaQty: '' };
        this.getList();
        this.getDetailData();
        this.totalQuotaQtyDialogVisible = false;
      });
    },
    changeClose () {
      this.totalQuotaQtyDialogVisible = false;
    },
    handleChangeQty () {
      this.changeform = { totalQuotaQty: '' };
      this.totalQuotaQtyDialogVisible = true;
    },
    getDetailData () {
      const id = this._id;
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, this.normalizeDetail(res));
          Object.assign(this.originalForm, this.normalizeDetail(res));
        });
      }
    },
    // 查询方法
    handleQuery () {
      this.pageNum = 1; // 重置到第一页
      this.getList();
      this.getDetailData();
    },
    // 多选框选中数据
    handleCheckboxChange (selection) {
      this.selectionList = selection;
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
        return getDetail(id).then(res => this.normalizeDetail(res));
      }
    },
    /**
     * 详情兜底：存量行的 second_dealer_flag 为 NULL（DDL 默认值不改写存量），统一按「否」处理
     */
    normalizeDetail (res) {
      if (res && (res.secondDealerFlag === null || res.secondDealerFlag === undefined)) {
        res.secondDealerFlag = 0;
      }
      return res;
    },
    submitRequest () {
      // 后端约定：空值传 null 而非空串
      const submitForm = { ...this.form };
      if (submitForm.allowLockRetail === '') submitForm.allowLockRetail = null;
      if (submitForm.allowLockNode === '') submitForm.allowLockNode = null;
      // 是否二网：清空或存量 NULL 一律按「否」提交，不写 NULL
      submitForm.secondDealerFlag = Number(submitForm.secondDealerFlag) || 0;
      // submitForm 去除两个额度数量
      delete submitForm.totalQuotaQty;
      delete submitForm.usedQuotaQty;
      delete submitForm.remainQuotaQty;
      return addOrUpdate(submitForm);
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 详情表格相关数据
    handleAddRow () {
      this.uploadDialogVisible = true;
    },
    // 新增活动明细：跳转到明细编辑页，携带活动ID
    handleAddDetail () {
      if (!this._id) {
        this.$message.warning('请先保存当前排产活动');
        return;
      }
      const url = `/sales/vehwholesale/basic/wholesaleProdScheduleActivityDetail/edit?scheduleActivityId=${this._id}`;
      window.open(url, '_blank');
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
  .form-edit {
    display: flex;
    flex-wrap: wrap;
  }
  .form-item-btns {
    margin-left: auto;
  }
</style>
