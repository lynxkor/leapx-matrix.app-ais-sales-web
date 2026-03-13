<template>
  <edit-page-layout ref="editLayout" title="金融方案详情" showPaneFooter>
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
                <el-form-item label="金融方案名称：" prop="financePlanName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.financePlanName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="金融方案编码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    :disabled="_id"
                  />
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="dataSourceEnum"
                    v-model="form.dataSource"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="金融方案类型：" prop="financePlanType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vrFinancePlanTypeEnum"
                    v-model="form.financePlanType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="金融产品状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="common_status_enum"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="优先级：" prop="priority">
                  <el-input-number
                    v-model="form.priority"
                    :min="0"
                    :max="999999"
                    placeholder="请输入优先级"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="金融方案名称：">
                  {{ form.financePlanName }}
                </el-form-item>
                <el-form-item label="金融方案编码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="数据来源：">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="金融方案类型：">
                  {{ form.financePlanType }}
                </el-form-item>
                <el-form-item label="金融产品状态：">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="优先级：">
                  {{ form.priority }}
                </el-form-item>
                <el-form-item label="最近更新时间：">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>金融方案-适用车型</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryVehicleList"
                    remote
                    placeholder="请选择适用车型"
                    clearable
                    value-key="id"
                    label-key="modelName"
                    @change="handleAddVehicleData"
                  />
                  <el-button type="primary" size="small" @click="handleAddVehicle">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="vehicleTableRef"
                  stripe
                  :data="vehicleTableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="financeProductName" title="金融产品" min-width="15%" />
                  <vxe-column field="applicableModels" title="适用车型" min-width="20%">
                    <template #default="{ row }">
                      <span @click="goToVehicleDetail(row.applicableModelId)" style="color: var(--leap-color-primary); cursor: pointer;">{{ row.applicableModels }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="modelName" title="车型名称" min-width="20%" />
                  <vxe-column field="createTime" title="创建时间" min-width="20%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteVehicleRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>金融方案-适用金融产品</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryProductList"
                    remote
                    placeholder="请选择金融产品"
                    clearable
                    value-key="id"
                    label-key="productName"
                    @change="handleAddProductData"
                  />
                  <el-button type="primary" size="small" @click="handleAddProduct">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="productTableRef"
                  stripe
                  :data="productTableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="financePlanName" title="金融方案" min-width="10%" />
                  <vxe-column field="financeProductName" title="金融产品" min-width="15%">
                    <template #default="{ row }">
                      <span @click="goToProductDetail(row.productId)" style="color: var(--leap-color-primary); cursor: pointer;">{{ row.financeProductName }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="financeProductCode" title="金融产品编码" min-width="15%" />
                  <vxe-column field="financeOrganizationName" title="金融机构" min-width="10%" />
                  <vxe-column field="financeOrganizationCode" title="金融机构编码" min-width="10%" />
                  <vxe-column field="installmentPeriods" title="分期期数" min-width="8%" />
                  <vxe-column field="isDefaultProduct" title="默认金融产品" min-width="8%">
                    <template #default="{ row }">
                      {{ yes_no_enum_map[row.isDefaultProduct] }}
                    </template>
                  </vxe-column>
                  <vxe-column field="defaultDownPaymentRatio" title="默认首付比例(%)" min-width="10%" />
                  <vxe-column field="defaultFinalPaymentRatio" title="默认尾款比例(%)" min-width="10%" />
                  <vxe-column field="createTime" title="创建时间" min-width="10%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteProductRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
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
        <div style="padding: 20px;">
          <h3>产品概况</h3>
          <div style="margin-top: 10px; padding: 15px; background: #f5f7fa; border-radius: 4px;">
            <div><strong>金融方案名称:</strong> {{ form.financePlanName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>金融方案编码:</strong> {{ form.code || '-' }}</div>
            <div style="margin-top: 8px;"><strong>金融方案类型:</strong> {{ form.financePlanType || '-' }}</div>
            <div style="margin-top: 8px;"><strong>优先级:</strong> {{ form.priority || '-' }}</div>
            <div style="margin-top: 8px;"><strong>数据来源:</strong> {{ form.dataSource || '-' }}</div>
            <div style="margin-top: 8px;"><strong>金融产品状态:</strong> {{ form.status || '-' }}</div>
          </div>
        </div>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/financeSubsidy/vrFinancePlan/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM, YES_NO_ENUM_MAP } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  creator: null,
  creatorName: '',
  createTime: '',
  modifier: null,
  modifierName: '',
  updateTime: '',
  remark: '',
  status: 1, // 默认启用
  statusDesc: '',
  dataSource: '',
  code: '',
  ownerOrgId: null,
  financePlanName: '',
  financePlanType: '',
  priority: 0
};

export default {
  name: 'vrFinancePlanEdit',
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
      return '金融方案编码：' + (this.form.code || '');
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
      pageTitle: '整车零售-金融补贴-金融方案管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVR，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVR-vrFinancePlan',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      yes_no_enum_map: YES_NO_ENUM_MAP,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      vehicleTableData: [],
      productTableData: [],
      rules: {
        financePlanName: [
          { required: true, message: '请输入金融方案名称', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入金融方案编码', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        financePlanType: [
          { required: true, message: '请选择金融方案类型', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          // 如果后端返回了子表数据，赋值给对应的表格
          if (res.vehicleList && Array.isArray(res.vehicleList)) {
            this.vehicleTableData = res.vehicleList;
          } else {
            this.vehicleTableData = [];
          }

          if (res.productList && Array.isArray(res.productList)) {
            this.productTableData = res.productList;
          } else {
            this.productTableData = [];
          }

          return res;
        });
      }
    },
    submitRequest () {
      // 合并表单数据和子表数据
      const formData = {
        ...this.form,
        vehicleList: this.vehicleTableData,
        productList: this.productTableData
      };
      return addOrUpdate(formData);
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除适用车型数据
    handleDeleteVehicleRow (index) {
      this.vehicleTableData.splice(index, 1);
    },
    // 删除适用金融产品数据
    handleDeleteProductRow (index) {
      this.productTableData.splice(index, 1);
    },
    // 查询适用车型列表
    queryVehicleList (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口获取车型列表
        resolve([]);
      });
    },
    // 查询金融产品列表
    queryProductList (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口获取金融产品列表
        resolve([]);
      });
    },
    // 新增适用车型数据
    handleAddVehicleData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.vehicleTableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      this.vehicleTableData.push(record);
    },
    // 新增适用金融产品数据
    handleAddProductData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.productTableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      this.productTableData.push(record);
    },
    // 添加适用车型
    handleAddVehicle() {
      // 实现添加适用车型的逻辑
    },
    // 添加适用金融产品
    handleAddProduct() {
      // 实现添加适用金融产品的逻辑
    },
    // 跳转到车型详情
    goToVehicleDetail(vehicleId) {
      // 实现跳转到车型详情页面的逻辑
      this.$router.push({
        path: '/vehretail/basicConfig/partVehModel/detail',
        query: { id: vehicleId }
      });
    },
    // 跳转到金融产品详情
    goToProductDetail(productId) {
      // 实现跳转到金融产品详情页面的逻辑
      this.$router.push({
        path: '/vehretail/financeSubsidy/vrFinanceProduct/detail',
        query: { id: productId }
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