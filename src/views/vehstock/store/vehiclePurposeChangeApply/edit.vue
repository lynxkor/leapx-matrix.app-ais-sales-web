<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest" :showEditBtn="false">
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="申请单号：" prop="applyNo">
                  <el-input placeholder="请输入" v-model="form.applyNo" clearable disabled />
                </el-form-item>
                <el-form-item label="申请门店：" prop="dealerCode">
                  <el-select v-model="form.dealerCode" placeholder="请选择" clearable filterable collapse-tags>
                    <el-option v-for="item in applyStoreCodeList" :key="item.orgCode" :label="item.orgName" :value="item.orgCode">
                      <span style="float: left">{{ item.orgName }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.orgCode }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="申请人：" prop="creatorName">
                  <el-input placeholder="请输入" v-model="form.creatorName" clearable disabled />
                </el-form-item>
                <el-form-item label="用途变更类型：" prop="changeType">
                  <fetch-select :request="fetchOptions" enumCode="vehstock_change_type" v-model="form.changeType"
                    placeholder="请选择" clearable filterable />
                </el-form-item>
                <el-form-item label="申请说明：" prop="applyDesc">
                  <el-input placeholder="请输入" v-model="form.applyDesc" clearable />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="申请单号：" prop="applyNo">
                  {{ form.applyNo }}
                </el-form-item>
                <el-form-item label="申请门店：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="申请人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="用途变更类型：" prop="changeType">
                  {{ form.changeTypeLabel || '' }}
                </el-form-item>
                <el-form-item label="申请说明：" prop="applyDesc">
                  {{ form.applyDesc }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>明细信息</h2>
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
                <vxe-table ref="tableRef" stripe :data="form.vinList" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="vin" title="VIN" min-width="7%" />
                  <vxe-column field="poentryOn" title="入库时间" min-width="7%" />
                  <vxe-column field="reservedLabel" title="原是否预留" min-width="7%" />
                  <vxe-column field="changedReservedLabel" title="变更后是否预留" min-width="140" />
                  <vxe-column field="materialsCode" title="整车物料" min-width="7%" />
                  <vxe-column field="materialsDesc" title="物料描述" min-width="7%" />
                  <vxe-column field="drivingRangeName" title="选配续航" min-width="7%" />
                  <vxe-column field="rangePowerName" title="选配动力" min-width="7%" />
                  <vxe-column field="exteriorName" title="外饰" min-width="7%" />
                  <vxe-column field="interiorName" title="内饰" min-width="7%" />
                  <vxe-column field="modelName" title="车型" min-width="7%" />
                  <vxe-column field="wheelHubName" title="选配轮毂" min-width="7%" />
                  <vxe-column field="remark" title="备注" min-width="7%" />
                  <vxe-column field="createTime" title="创建时间" min-width="7%" />
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
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehstock/store/vehiclePurposeChangeApply/index';
import { getList } from '@/api/vehstock/store/storeInventoryLedger/index';
import FetchSelect from '@/libs/components/FetchSelect';
import BaseSearch from '@/libs/components/BaseSearch';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getApplyUserStoreList, getLoginUser } from '@/libs/api/common';

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
  applyNo: '',
  ownerOrgId: '',
  dealerCode: '',
  dealerName: '',
  applyStatus: '',
  vin: '',
  modelId: '',
  modelName: '',
  changeType: '',
  originalOrderType: '',
  originalReserved: '',
  originalReservedType: '',
  changedReserved: '',
  changedReservedType: '',
  stockInTime: '',
  applyDesc: '',
};

export default {
  name: 'vehiclePurposeChangeApplyEdit',
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
    BaseSearch
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '主键：' + this.form.id;
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
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '车辆用途变更申请',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVS-vehiclePurposeChangeApply',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      applyStoreCodeList: (this.$store.state.user.userInfo.orgPostUserList || []).filter(item => item.orgType === '1060'),
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        applyNo: [
          { required: false, message: '请输入申请单号', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入申请门店编码', trigger: 'change' }
        ],
        applyUser: [
          { required: true, message: '请输入申请人', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    if (!this._id) {
      this.getLoginUser();
    }
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      const vinList = this.form.vinList.map(item => item.vin);
      return addOrUpdate({ ...this.form, vinList });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      // const item = this.form.vinList[index];
      this.form.vinList.splice(index, 1);
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
        getList({ vin: queryString }).then(res => {
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

      // 检查是否已存在
      const exists = this.form.vinList.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      record.changedReservedLabel = this.form.changeType === '1' ? '是' : '否';
      this.form.vinList.push(record);
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        vinList: [],
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
    // 查询申请人门店 get请求
    async getDealerDetailByCode () {
      const res = await getApplyUserStoreList();
      return res || [];
    },
    async getLoginUser () {
      const res = await getLoginUser();
      this.form.creatorName = res?.username || '';
      this.form.creator = res?.userId || '';
    },
  }
};
</script>
