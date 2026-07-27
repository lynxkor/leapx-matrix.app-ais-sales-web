<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest" :showEditBtn="false" >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- 入库：与列表行内按钮同条件（auditStatus=1 且有 inbound 权限） -->
          <el-button v-if="canInbound" size="small" @click="handleInboundClick">入库</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="调拨入库单号：" prop="inboundNo">
                  {{ form.inboundNo }}
                </el-form-item>
                <el-form-item label="整车调拨单号：" prop="transferNo">
                  {{ form.transferNo }}
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="源门店编码：" prop="sourceDealerCode">
                  {{ form.sourceDealerCode }}
                </el-form-item>
                <el-form-item label="源门店名称：" prop="sourceDealerName">
                  {{ form.sourceDealerName }}
                </el-form-item>
                <el-form-item label="源门店地址：" prop="sourceDealerAddress">
                  {{ form.sourceDealerAddress }}
                </el-form-item>
                <el-form-item label="源门店仓库编码：" prop="sourceDealerWarehouseCode">
                  {{ form.sourceDealerWarehouseCode }}
                </el-form-item>
                <el-form-item label="源门店仓库名称：" prop="sourceDealerWarehouseName">
                  {{ form.sourceDealerWarehouseName }}
                </el-form-item>
                <el-form-item label="源门店仓库地址：" prop="sourceDealerWarehouseAddress">
                  {{ form.sourceDealerWarehouseAddress }}
                </el-form-item>
                <el-form-item label="目标门店编码：" prop="targetDealerCode">
                  {{ form.targetDealerCode }}
                </el-form-item>
                <el-form-item label="目标门店名称：" prop="targetDealerName">
                 {{ form.targetDealerName }}
                </el-form-item>
                <el-form-item label="目标门店地址：" prop="targetDealerAddress">
                  {{ form.targetDealerAddress }}
                </el-form-item>
                <el-form-item label="目标门店仓库编码：" prop="targetDealerWarehouseCode">
                  {{ form.targetDealerWarehouseCode }}
                </el-form-item>
                <el-form-item label="目标门店仓库名称：" prop="targetDealerWarehouseName">
                  {{ form.targetDealerWarehouseName }}
                </el-form-item>
                <el-form-item label="目标门店仓库地址：" prop="targetDealerWarehouseAddress">
                  {{ form.targetDealerWarehouseAddress }}
                </el-form-item>
                <el-form-item label="移出时间：" prop="moveoutTime">
                  {{ form.moveoutTime }}
                </el-form-item>
                <el-form-item label="移入时间：" prop="moveinTime">
                  {{ form.moveinTime }}
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  {{ form.applyTime }}
                </el-form-item>
                <el-form-item label="PDI单号：" prop="pdiNo">
                  {{ form.pdiNo }}
                </el-form-item>
                <el-form-item label="PDI是否完成提交：" prop="pdiNo">
                  {{ form.isPdiSubmitLabel }}
                </el-form-item>
                <el-form-item label="车辆是否存在异常：" prop="pdiNo">
                  {{ form.isUnusuallabel }}
                </el-form-item>
                <el-form-item label="车辆异常是否修复：" prop="pdiNo">
                  {{ form.isRepairedLabel }}
                </el-form-item>
                <el-form-item label="单据状态：" prop="auditStatus">
                  {{ form.auditStatusLabel }}
                </el-form-item>
                <el-form-item label="审批意见：" prop="auditRemark">
                  {{ form.auditRemark }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
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
import { getDetail, addOrUpdate, inboundItem } from '@/api/vehstock/store/storeTransferInbound/index';
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
  inboundNo: '',
  transferId: '',
  transferNo: '',
  vin: '',
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
  pdiNo: '',
  auditStatus: '',
  auditRemark: '',
};

export default {
  name: 'storeTransferInboundEdit',
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
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '主键：' + this.form.id;
    },
    // 入库按钮显示条件：与列表行内按钮保持一致
    canInbound () {
      return this.form.auditStatus === 1 &&
        this.permissions.has(`${this.moduleKey}-inbound`);
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
      pageTitle: '门店调拨入库',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVS-storeTransferInbound',
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
    // 入库按钮点击：弹通用确认弹窗，确认后调入库接口
    handleInboundClick () {
      const id = this._id;
      if (!id) return;
      this.$confirmExport(null, { message: '确认入库吗?', title: '提示', type: 'warning' }).then(() => {
        inboundItem([id]).then(() => {
          this.$message.success('入库成功!');
          // 后端入库接口同步返回成功，但状态更新存在延迟，延迟一下再查询
          setTimeout(() => {
            this.$refs.containerRef && this.$refs.containerRef.loadDetail();
          }, 800);
        });
      }).catch(() => { });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      // const item = this.tableData[index];
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
