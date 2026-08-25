<template>
  <div>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest" :showEditBtn="showEditBtn">
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- 提交：仅源门店用户在待提交/驳回时可见 -->
          <el-button
            v-if="canSubmit"
            size="small"
            @click="handleSubmitTransfer"
          >
            <i class="iconfont icon-lxppc-submit"></i>提交
          </el-button>
          <!-- 调出审批：状态为调出审批中且源门店权限范围内 -->
          <el-button
            v-if="canApproveOut"
            size="small"
            @click="handleApproval('outApproval')"
          >
            调出审批
          </el-button>
          <!-- 调入审批：状态为调入审批中且目标门店权限范围内 -->
          <el-button
            v-if="canApproveIn"
            size="small"
            @click="handleApproval('inApproval')"
          >
            调入审批
          </el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="整车调拨单号：" prop="transferNo">
                  <el-input placeholder="请输入" v-model="form.transferNo" clearable disabled />
                </el-form-item>
                <el-form-item label="目标门店名称：" prop="targetDealerCode">
                  <fetch-select
                    :remote-method="getDealerListByName"
                    :params="form.targetDealerName"
                    remote
                    v-model="form.targetDealerCode"
                    placeholder="请输入门店编码或名称"
                    labelKey="storeName"
                    valueKey="storeCode"
                    subLabelKey="storeCode"
                    clearable
                    filterable
                    @change="handleStoreChange"
                  />
                </el-form-item>
                <el-form-item label="目标门店仓库名称：" prop="targetDealerWarehouseCode">
                  <fetch-select
                    :options="warehouseOptions"
                    v-model="form.targetDealerWarehouseCode"
                    placeholder="请输入门店仓库编码或名称"
                    labelKey="warehouseName"
                    valueKey="warehouseCode"
                    subLabelKey="label"
                    clearable
                    filterable
                    @change="handleWarehouseChange"
                  />
                </el-form-item>
                <el-form-item label="调拨原因：" prop="reason">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehstock_transfer_reason"
                    v-model="form.reason"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input placeholder="请输入" v-model="form.remark" clearable type="textarea" maxlength="500" show-word-limit/>
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="整车调拨单号：" prop="transferNo">
                  {{ form.transferNo }}
                </el-form-item>
                <el-form-item label="目标门店名称：" prop="targetDealerName">
                  {{ form.targetDealerName }}
                </el-form-item>
                <el-form-item label="目标门店仓库名称：" prop="targetDealerWarehouseName">
                  {{ form.targetDealerWarehouseName }}
                </el-form-item>
                <el-form-item label="调拨原因：" prop="reason" style="width: 100%;">
                  {{ form.reasonLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>门店库存调拨明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <base-search
                  style="width: 300px;"
                  filterable
                  clearable
                  remote
                  :remote-method="queryListData"
                  @change="handleAddTableData"
                  value-key="id"
                  label-key="vinDesc"
                  :disabled="!(isEditing || !_id)"
                />
              </div>
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="form.storeInventoryTransferDetailList" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="vin" title="VIN" min-width="9%" />
                  <vxe-column field="transferPrice" title="调拨价格" min-width="9%">
                    <template #default="{ row }">
                      <el-input v-model="row.transferPrice" type="number" placeholder="请输入" clearable :disabled="!(isEditing || !_id)" />
                    </template>
                  </vxe-column>
                  <vxe-column field="materialsCode" title="整车物料" min-width="9%" />
                  <vxe-column field="materialsDesc" title="物料描述" min-width="9%" />
                  <vxe-column field="drivingRangeName" title="选配续航" min-width="9%" />
                  <vxe-column field="rangePowerName" title="选配动力" min-width="9%" />
                  <vxe-column field="exteriorName" title="外饰" min-width="9%" />
                  <vxe-column field="interiorName" title="内饰" min-width="9%" />
                  <vxe-column field="modelName" title="车型" min-width="9%" />
                  <vxe-column field="wheelHubName" title="选配轮毂" min-width="9%" />
                  <vxe-column field="remark" title="备注" min-width="9%" />
                  <vxe-column title="操作" width="100" fixed="right" v-if="isEditing || !_id">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)" confirm-button-text="删除" confirm-button-type="danger">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
                  </template>
                </vxe-table>
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
  <!-- 调拨审批弹窗 -->
  <ApprovalDialog ref="approvalDialog" :visible.sync="approvalVisible" :data="approvalData" @update:visible="val => approvalVisible = val" @submit="handleApprovalDone" />
</div>
</template>

<script>
import { getDetail, addOrUpdate, storeSubmit } from '@/api/vehstock/store/storeInventoryTransfer/index';
import { getList } from '@/api/vehstock/store/storeInventoryLedger/index';
import FetchSelect from '@/libs/components/FetchSelect';
import BaseSearch from '@/libs/components/BaseSearch';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgWarehouseStoreInfo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { listOrgStoreInfo, queryStoreRelation } from '@/libs/api/common';
import ApprovalDialog from './ApprovalDialog.vue';
import axios from 'axios';

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
  transferNo: '',
  sourceDealerOrgId: '',
  sourceDealerCode: '',
  sourceDealerName: '',
  sourceDealerAddress: '',
  sourceDealerWarehouseCode: '',
  sourceDealerWarehouseName: '',
  sourceDealerWarehouseAddress: '',
  targetDealerOrgId: '',
  targetDealerCode: '',
  targetDealerName: '',
  targetDealerAddress: '',
  targetDealerWarehouseCode: '',
  targetDealerWarehouseName: '',
  targetDealerWarehouseAddress: '',
  moveoutTime: '',
  moveinTime: '',
  applyTime: '',
  auditStatus: '',
  outApproval: '',
  outRemark: '',
  inApproval: '',
  inRemark: '',
  reason: '',
  storeInventoryTransferDetailList: [],
};

export default {
  name: 'storeInventoryTransferEdit',
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
    FetchSelect,
    BaseSearch,
    ApprovalDialog,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '主键：' + this.form.id;
    },
    userInfo () {
      try {
        return JSON.parse(localStorage.getItem('userInfo') || '{}');
      } catch (e) {
        return {};
      }
    },
    allOrgCodes () {
      return [...new Set([...this.directOrgCodes, ...this.descendantOrgCodes])];
    },
    showEditBtn () {
      return (this.form.auditStatus === 1 || this.form.auditStatus === 5) && this.directOrgCodes.includes(this.form.sourceDealerCode);
    },
    canSubmit () {
      return (this.form.auditStatus === 1 || this.form.auditStatus === 5) &&
        this.permissions.has(`${this.moduleKey}-submit`) &&
        this.directOrgCodes.includes(this.form.sourceDealerCode);
    },
    canApproveOut () {
      return this.form.auditStatus === 2 &&
        this.permissions.has(`${this.moduleKey}-approveOut`) &&
        this.allOrgCodes.includes(this.form.sourceDealerCode);
    },
    canApproveIn () {
      return this.form.auditStatus === 3 &&
        this.permissions.has(`${this.moduleKey}-approveIn`) &&
        this.allOrgCodes.includes(this.form.targetDealerCode);
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
    // 'form.targetDealerCode': {
    //   handler (newVal) {
    //     if (newVal) {
    //       // 拉取仓库列表，以确保回显时能从列表中匹配到名称
    //       this.fetchWarehouseOptions(newVal, false); // 第二个参数设为 false，防止自动重置
    //     }
    //   },
    //   immediate: true
    // }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '门店库存调拨',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVS-storeInventoryTransfer',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      storeName: '', // 目标门店仓库名称
      emptyText: '若要启用此内容，请创建记录',
      warehouseOptions: [], // 门店仓库编码或名称选项
      directOrgCodes: (() => {
        // 直接从 localStorage 读取用户信息初始化（data() 中无法使用 computed）
        try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
          return (userInfo.orgPostUserList || []).map(item => item.orgCode);
        } catch (e) {
          return [];
        }
      })(), // 直接组织编码（异步通过 queryStoreRelation 扩充）
      descendantOrgCodes: [], // 子级组织编码
      approvalVisible: false, // 调拨审批弹窗
      approvalData: {},
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        targetDealerCode: [
          { required: true, message: '请选择目标门店', trigger: 'change' }
        ],
        targetDealerWarehouseCode: [
          { required: true, message: '请选择目标门店仓库', trigger: 'change' }
        ],
        targetDealerWarehouseAddress: [
          { required: true, message: '请输入目标门店仓库地址', trigger: 'change' }
        ],
        reason: [
          { required: false, message: '请输入调拨原因', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入调拨备注', trigger: 'change' }
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
        // 详情加载完成后取一次子级组织编码和门店关联关系，保证审批按钮的 show 判断可用
        this.fetchDescendantOrgCodes();
        this.fetchStoreRelation();
        return getDetail(id).then(res => {
          this.warehouseOptions = [{
            value: res.targetDealerWarehouseCode,
            warehouseCode: res.targetDealerWarehouseCode,
            // label: `${res.targetDealerWarehouseCode}-${res.targetDealerWarehouseName}`,
            warehouseName: `${res.targetDealerWarehouseName}`
          }];
          return res;
        });
      }
    },
    submitRequest () {
      const hasValidData = this.form.storeInventoryTransferDetailList.some(item => item.transferPrice);

      if (!hasValidData) {
        // 如果全为 0 或空，进入这里
        this.$message.warning('调拨价格不能为空');
        return; // 阻止下一步
      }
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      const list = this.form.storeInventoryTransferDetailList || [];
      list.splice(index, 1);
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        getList({ vinLike: queryString }).then(res => {
          const list = res.records?.map(item => ({
            ...item,
            vinDesc: item.vin + '-' + item.materialsDesc,
          })) || [];
          resolve(list);
        });
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查车辆是否符合调拨条件
      if (!(Number(record.vechicleStatus) === 12 && Number(record.lockStatus) === 0 && Number(record.reserved) === 0)) {
        this.$message.warning('车辆不符合调拨条件，请检查车辆状态是否为：已入门店库，是否预留为：否，是否匹配订单为：否！');
        return;
      }
      // 检查是否已存在
      const list = this.form.storeInventoryTransferDetailList || [];
      const exists = list.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.form.storeInventoryTransferDetailList.push(record);
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        storeInventoryTransferDetailList: []
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
    // 查询门店编码或名称
    async getDealerListByName (params) {
      return listOrgStoreInfo({ keyword: params, status: [2, 3, 4] });
    },
    // 门店编码或名称选择框回调
    handleStoreChange (val, record) {
      if (val) {
        this.form.targetDealerCode = val;
        this.form.targetDealerName = record.storeName || '';
        this.fetchWarehouseOptions(record.exclusiveDeliveryStore);
      } else {
        // 清空处理
        this.form.targetDealerCode = '';
        this.form.targetDealerName = '';
        this.form.targetDealerWarehouseCode = '';
        this.form.targetDealerWarehouseName = '';
        this.form.targetDealerWarehouseAddress = '';
        this.warehouseOptions = [];
      }
    },
    // 门店仓库编码或名称选择框回调（联动查询）
    async fetchWarehouseOptions (storeId, autoSelectFirst = true) {
      const res = await listOrgWarehouseStoreInfo({
        storeIdList: [storeId], // 门店编码
      });
      const records = res.records || [];
      this.warehouseOptions = records.map(item => ({
        ...item,
        label: `${item.warehouseCode}-${item.warehouseName}`,
      }));

      // 默认选中第一个（仅在手动切换门店时触发，回显时不触发）
      if (autoSelectFirst && records.length > 0) {
        const first = records[0];
        this.form.targetDealerWarehouseCode = first.warehouseCode || '';
        this.form.targetDealerWarehouseName = first.warehouseName || '';
        this.form.targetDealerWarehouseAddress = first.warehouseDetailAddress || '';
      }
    },
    // 门店仓库选择时触发的事件
    handleWarehouseChange (val, record) {
      this.form.targetDealerWarehouseCode = val;
      this.form.targetDealerWarehouseName = record.warehouseName || '';
      this.form.targetDealerWarehouseAddress = record.warehouseDetailAddress || '';
    },
    // 提交按钮
    handleSubmitTransfer () {
      this.$confirm('是否要提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = this._id;
        if (!id) return;
        storeSubmit(id).then(() => {
          this.$message.success('提交成功!');
          this.$emit('refresh');
          this.$refs.containerRef && this.$refs.containerRef.loadDetail();
        }).catch(() => {
          this.$message.error('提交失败!');
        });
      }).catch(() => {});
    },
    // 打开调拨审批弹窗
    handleApproval (type) {
      this.approvalData = {
        id: this._id,
        type: type
      };
      this.approvalVisible = true;
    },
    // 审批提交后刷新
    handleApprovalDone () {
      this.$refs.containerRef && this.$refs.containerRef.loadDetail();
    },
    // 获取子级组织编码
    async fetchDescendantOrgCodes () {
      const orgPostUserList = this.userInfo.orgPostUserList || [];
      const orgIds = orgPostUserList.map(item => item.orgId).filter(Boolean);
      if (orgIds.length === 0) return;

      const instance = axios.create();
      const token = this.$store.state.user.token;
      const headers = token ? {
        Authorization: 'Bearer ' + token,
        'X-CROSS-NODE-ID': localStorage.getItem('token'),
        Accepte: 'application/vnd.leapx.v2+json'
      } : {};

      try {
        const results = await Promise.all(orgIds.map(orgId =>
          instance.get(`${window.APP_AIS_WEB_CONFIG.VUE_APP_WORK_ORDER_URL}/accountService/orgInfo/findDescendant`, {
            params: { orgId },
            headers
          })
        ));

        const allCodes = results.reduce((acc, res) => {
          const data = res.data;
          const list = Array.isArray(data) ? data : (data?.data || data?.records || data?.result || data?.rows || []);
          return [...acc, ...list.map(item => item.orgCode)];
        }, []);

        this.descendantOrgCodes = [...new Set(allCodes)];
      } catch (e) {
        console.error('fetchDescendantOrgCodes error:', e);
      }
    },
    // 获取门店关联关系，扩充 directOrgCodes
    async fetchStoreRelation () {
      if (this.directOrgCodes.length === 0) return;
      try {
        const res = await queryStoreRelation({
          queryType: 1,
          storeCodes: this.directOrgCodes
        });
        const list = res?.storeCodes || [];
        if (Array.isArray(list) && list.length) {
          this.directOrgCodes = [...new Set([
            ...list.filter(Boolean),
            ...this.directOrgCodes
          ])];
        }
      } catch (e) {
        console.error('fetchStoreRelation error:', e);
      }
    }
  }
};
</script>
