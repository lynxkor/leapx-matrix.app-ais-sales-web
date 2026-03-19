<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest">
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
                <el-form-item label="整车调拨单号：" prop="transferNo">
                  <el-input placeholder="请输入" v-model="form.transferNo" clearable />
                </el-form-item>
                <el-form-item label="目标门店编码：" prop="targetDealerCode">
                  <el-input placeholder="请输入" v-model="form.targetDealerCode" clearable />
                </el-form-item>
                <el-form-item label="目标门店仓库编码：" prop="targetDealerWarehouseCode">
                  <el-input placeholder="请输入" v-model="form.targetDealerWarehouseCode" clearable />
                </el-form-item>
                <el-form-item label="目标门店仓库名称：" prop="targetDealerWarehouseName">
                  <el-input placeholder="请输入" v-model="form.targetDealerWarehouseName" clearable />
                </el-form-item>
                <el-form-item label="目标门店仓库地址：" prop="targetDealerWarehouseAddress">
                  <el-input placeholder="请输入" v-model="form.targetDealerWarehouseAddress" clearable />
                </el-form-item>
                <el-form-item label="调拨原因：" prop="reason">
                  <el-input placeholder="请输入" v-model="form.reason" clearable />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input placeholder="请输入" v-model="form.remark" clearable />
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
                <el-form-item label="调拨原因：" prop="reason">
                  {{ form.reason }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>子表标题</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select style="width: 300px;" :remote-method="queryListData" remote placeholder="请选择" clearable
                    value-key="id" label-key="name" @change="handleAddTableData" />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="tableData" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="name" title="名称" min-width="30%" />
                  <vxe-column field="age" title="年龄" min-width="30%" />
                  <vxe-column field="email" title="邮箱" min-width="30%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
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
import { getDetail, addOrUpdate } from '@/api/vehstock/store/storeInventoryTransfer/index';
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
  storeInventoryTransferDetailList: '',
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
    FetchSelect
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
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '门店库存调拨管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISMC-storeInventoryTransfer',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        targetDealerCode: [
          { required: true, message: '请输入目标门店编码', trigger: 'change' }
        ],
        targetDealerWarehouseCode: [
          { required: true, message: '请输入目标门店仓库编码', trigger: 'change' }
        ],
        targetDealerWarehouseName: [
          { required: true, message: '请输入目标门店仓库名称', trigger: 'change' }
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
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
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
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
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
