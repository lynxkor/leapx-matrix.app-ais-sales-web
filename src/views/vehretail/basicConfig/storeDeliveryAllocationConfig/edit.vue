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
                <el-form-item label="配置编号：" prop="allocationConfigCode">
                  <el-input
                    v-model="form.allocationConfigCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="交付门店：" prop="deliveryDealerCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.deliveryDealerCode"
                    :remote-method="getDealerListByName"
                    :param="form.deliveryDealerName"
                    value-key="storeCode"
                    label-key="storeName"
                    @change="handleDeliveryDealerChange"
                  />
                </el-form-item>
                <el-form-item label="是否开启自动分派：" prop="autoAllocationStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.autoAllocationStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="自动分派方式：" prop="autoAllocationType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vr_auto_allocation_type"
                    v-model="form.autoAllocationType"
                    placeholder="请选择"
                    clearable
                    filterable
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
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="配置编号：" prop="allocationConfigCode">
                  {{ form.allocationConfigCode }}
                </el-form-item>
                <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="是否开启自动分派：" prop="autoAllocationStatus">
                  {{ form.autoAllocationStatusLabel }}
                </el-form-item>
                <el-form-item label="自动分派方式：" prop="autoAllocationType">
                  {{ form.autoAllocationTypeLabel }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id) && form.autoAllocationType === 10" v-for="(group, index) in saleEngineerCapacityList" :key="index">
            <div class="common-section-header">
              <h2>{{ group.saleDealerName }}</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="group.data"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="autoAssignSort" title="排序" min-width="30%" />
                  <vxe-column field="deliveryUserName" title="交付工程师" min-width="30%" />
                  <vxe-column field="monthlyDeliveryCapacity" title="月度交付承载数量" min-width="30%" />
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
import { getDetail, addOrUpdate } from '@/api/vehretail/basicConfig/storeDeliveryAllocationConfig/index';
import { getByAllocationConfigId } from '@/api/vehretail/basicConfig/storeDeliveryEngineerRelation/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  allocationConfigCode: '',
  deliveryDealerName: '',
  autoAllocationStatus: '',
  autoAllocationType: '',
  status: 1,
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  statusDesc: '',
  deliveryOrgId: '',
  deliveryDealerCode: '',
  dataSource: '',
};

export default {
  name: 'storeDeliveryAllocationConfigEdit',
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
      return '配置编号：' + this.form.allocationConfigCode;
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
      pageTitle: '门店交付分派配置管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVR-storeDeliveryAllocationConfig',
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
        deliveryDealerName: [
          { required: true, message: '请输入交付门店名称', trigger: 'change' }
        ],
        autoAllocationStatus: [
          { required: true, message: '请选择是否开启自动分派 1-是 0-否', trigger: 'change' }
        ],
        autoAllocationType: [
          { required: true, message: '请选择自动分派方式 5-按交付工程师 10-按销售门店', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态 1-启用 0-禁用', trigger: 'change' }
        ],
      },
      saleEngineerCapacityList: [],
    };
  },
  mounted () {
  },
  methods: {
    handleDeliveryDealerChange (val, obj) {
      this.form.deliveryOrgId = obj.storeId;
      this.form.deliveryDealerName = obj.storeName;
    },
    async getDealerListByName (params) {
      return listOrgStoreInfo({ storeName: params, isSupportDeliver: true });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        getByAllocationConfigId(id).then(res => {
          if (!res) {
            this.saleEngineerCapacityList = [];
            return;
          }
          this.saleEngineerCapacityList = this.groupBySaleDealerCode(res);
          console.log(this.saleEngineerCapacityList);
        });
        return getDetail(id);
      }
    },
    // 按saleDealerCode分组
    groupBySaleDealerCode (list) {
      // 先按saleDealerCode分组为对象
      const groupedObj = list.reduce((groups, item) => {
        const key = item.saleDealerCode || '未分组';
        if (!groups[key]) {
          groups[key] = {
            saleDealerCode: item.saleDealerCode,
            saleDealerName: item.saleDealerName || '未分组',
            data: []
          };
        }
        groups[key].data.push(item);
        return groups;
      }, {});

      // 对每个分组内的数据按autoAssignSort排序
      Object.values(groupedObj).forEach(group => {
        group.data.sort((a, b) => {
          // 按autoAssignSort升序排序，处理null/undefined情况
          const sortA = a.autoAssignSort || 0;
          const sortB = b.autoAssignSort || 0;
          return sortA - sortB;
        });
      });

      // 转换为数组
      return Object.values(groupedObj);
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
