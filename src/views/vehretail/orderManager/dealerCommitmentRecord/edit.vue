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
        :showEditBtn="false"
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
                <el-form-item label="承诺结果编号：" prop="recordCode">
                  <el-input
                    placeholder="系统自动生成"
                    v-model="form.recordCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="商城订单号：" prop="mallOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="ModelEnum"
                    v-model="form.modelName"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="DealerEnum"
                    v-model="form.saleDealerName"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售顾问：" prop="saleUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付顾问：" prop="deliveryUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交车时间：" prop="deliveryTime">
                  <el-date-picker
                    v-model="form.deliveryTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="承诺类型：" prop="commitmentType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="CommitmentTypeEnum"
                    v-model="form.commitmentType"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="承诺内容：" prop="commitmentContent">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="CommitmentContentEnum"
                    v-model="form.commitmentContent"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="承诺详细说明：" prop="commitmentDetailDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.commitmentDetailDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否原厂：" prop="isOriginal">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.isOriginal"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="兑现状态：" prop="fulfillStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="dealer_commitment_fulfill_status"
                    v-model="form.fulfillStatus"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="待兑现说明：" prop="pendingFulfillDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pendingFulfillDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    v-model="form.createTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="承诺结果编号：" prop="recordCode">
                  {{ form.recordCode }}
                </el-form-item>
                <el-form-item label="商城订单号：" prop="mallOrderCode">
                  {{ form.mallOrderCode }}
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  <!-- <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`" target="_blank">{{ form.vin }}</el-link> -->
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleModel/edit?id=${form.modelId}`" target="_blank">{{ form.modelName }}</el-link>
                </el-form-item>
                <el-form-item label="销售门店：" prop="saleDealerName">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.saleDealerCode}`" target="_blank">{{ form.saleDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="销售顾问：" prop="saleUserName">
                  {{ form.saleUserName }}
                </el-form-item>
                <el-form-item label="交付顾问：" prop="deliveryUserName">
                  {{ form.deliveryUserName }}
                </el-form-item>
                <el-form-item label="交车时间：" prop="deliveryTime">
                  {{ form.deliveryTime }}
                </el-form-item>
                <el-form-item label="承诺类型：" prop="commitmentType">
                  {{ form.commitmentType }}
                </el-form-item>
                <el-form-item label="承诺内容：" prop="commitmentContent">
                  {{ form.commitmentContent }}
                </el-form-item>
                <el-form-item label="承诺详细说明：" prop="commitmentDetailDesc">
                  {{ form.commitmentDetailDesc }}
                </el-form-item>
                <el-form-item label="是否原厂：" prop="isOriginal">
                  {{ form.isOriginalLabel }}
                </el-form-item>
                <el-form-item label="兑现状态：" prop="fulfillStatus">
                  <span :class="['status-tag', form.fulfillStatus === 1 ? 'primary' : 'warning']">{{ form.fulfillStatusLabel }}</span>
                </el-form-item>
                <el-form-item label="待兑现说明：" prop="fulfillDesc">
                  {{ form.fulfillDesc }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
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
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/dealerCommitmentRecord/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  recordCode: '',
  mallOrderCode: '',
  vin: '',
  modelName: '',
  saleDealerName: '',
  saleUserName: '',
  deliveryUserName: '',
  deliveryTime: '',
  commitmentType: '',
  commitmentContent: '',
  commitmentDetailDesc: '',
  isOriginal: '',
  fulfillStatus: '',
  pendingFulfillDesc: '',
  createTime: '',
};

export default {
  name: 'dealerCommitmentRecordEdit',
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
      return this.form.recordCode || '承诺结果详情';
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
      pageTitle: '承诺结果',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVR，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVR-dealerCommitmentRecord',
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
        recordCode: [
          { required: true, message: '请输入承诺结果编号', trigger: 'change' }
        ],
        mallOrderCode: [
          { required: true, message: '请输入商城订单号', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入VIN', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请选择车型名称', trigger: 'change' }
        ],
        saleDealerName: [
          { required: true, message: '请选择销售门店', trigger: 'change' }
        ],
        saleUserName: [
          { required: true, message: '请输入销售顾问', trigger: 'change' }
        ],
        deliveryUserName: [
          { required: true, message: '请输入交付顾问', trigger: 'change' }
        ],
        deliveryTime: [
          { required: true, message: '请选择交车时间', trigger: 'change' }
        ],
        commitmentType: [
          { required: true, message: '请选择承诺类型', trigger: 'change' }
        ],
        commitmentContent: [
          { required: true, message: '请选择承诺内容', trigger: 'change' }
        ],
        commitmentDetailDesc: [
          { required: true, message: '请输入承诺详细说明', trigger: 'change' }
        ],
        isOriginal: [
          { required: true, message: '请选择是否原厂', trigger: 'change' }
        ],
        fulfillStatus: [
          { required: true, message: '请选择兑现状态', trigger: 'change' }
        ],
        pendingFulfillDesc: [
          { required: true, message: '请输入待兑现说明', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
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
