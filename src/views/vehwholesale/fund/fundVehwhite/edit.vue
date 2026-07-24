<template>
  <edit-page-layout ref="editLayout" title="车辆白名单" showPaneFooter>
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
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="单据类型：" prop="documentTypeLabel">
                  {{ form.documentTypeLabel }}
                </el-form-item>
                <el-form-item label="整车批售订单：" prop="wholesaleOrderCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit?id=${form.wholesaleOrderId}`" target="_blank">{{form.wholesaleOrderCode}}</el-link>
                </el-form-item>
                <el-form-item label="企业客户整车订单：" prop="enterpriseOrderCode">
                  <el-link type="primary" :href="`/sales/vehwholesale/entorder/entVehicleOrder/edit?id=${form.enterpriseOrderId}`" target="_blank">{{form.enterpriseOrderCode}}</el-link>
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="parentCompanyName">
                  <!-- <el-link type="primary" :href="`/partner/channelManagement/companyDetails?companyCode=${form.parentCompanyCode}`" target="_blank">{{ form.parentCompanyName }}</el-link> -->
                  {{ form.parentCompanyName }}
                </el-form-item>
                <el-form-item label="门店：" prop="dealerName">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">{{form.dealerName}}</el-link>
                </el-form-item>
                <el-form-item label="企业客户：" prop="enterpriseCustomerName">
                  {{ form.enterpriseCustomerName }}
                </el-form-item>
                <el-form-item label="是否B端白名单：" prop="isBWhitelistLabel">
                  {{ form.isBWhitelistLabel }}
                </el-form-item>
                <el-form-item label="是否C端白名单：" prop="isCWhitelistLabel">
                  {{ form.isCWhitelistLabel }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="编号：" prop="code">
                  {{ form.code }}
                </el-form-item>
              </el-form>

              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="单据类型：" prop="documentType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="fund_order_type"
                    v-model="form.documentType"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="handleDocumentTypeChange"
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="整车批售订单：" prop="wholesaleOrderCode">
                  <fetch-select
                    filterable
                    clearable
                    v-model="form.wholesaleOrderCode"
                    placeholder="请选择整车批售订单"
                    :remote-method="getWholesaleOrderList"
                    remote
                    label-key="wholesaleOrderCode"
                    value-key="wholesaleOrderCode"
                    :disabled="!isWholesaleOrderEditable || !!_id"
                    @change="handleWholesaleOrderChange"
                  />
                </el-form-item>
                <el-form-item label="企业客户整车订单：" prop="enterpriseOrderCode">
                  <fetch-select
                    filterable
                    clearable
                    v-model="form.enterpriseOrderCode"
                    placeholder="请选择企业客户整车订单"
                    :remote-method="getEnterpriseOrderList"
                    remote
                    label-key="enterpriseOrderCode"
                    value-key="enterpriseOrderCode"
                    :disabled="!isEnterpriseOrderEditable || !!_id"
                    @change="handleEnterpriseOrderChange"
                  />
                </el-form-item>
                <el-form-item label="VIN号：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                    :disabled='true'
                  />
                </el-form-item>
                <el-form-item label="母公司名称：" prop="parentCompanyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.parentCompanyName"
                    clearable
                    :disabled='true'
                  />
                </el-form-item>
                <el-form-item label="销售门店：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                    :disabled='true'
                  />
                </el-form-item>
                <el-form-item label="企业客户：" prop="enterpriseCustomerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.enterpriseCustomerName"
                    clearable
                    :disabled='true'
                  />
                </el-form-item>
                <el-form-item label="是否B端白名单：" prop="isBWhitelist">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.isBWhitelist"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否C端白名单：" prop="isCWhitelist">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.isCWhitelist"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/fundVehwhite/index';
import { getList as getWholesaleOrderList } from '@/api/vehwholesale/wholesale/vehicleWholesaleOrder/index';
import { getList as getEnterpriseOrderList } from '@/api/vehwholesale/entorder/entVehicleOrder/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  documentType: '',
  documentTypeLabel: '',
  wholesaleOrderCode: '',
  enterpriseOrderCode: '',
  vin: '',
  parentCompanyName: '',
  dealerName: '',
  enterpriseCustomerName: '',
  isBWhitelist: '1',
  isBWhitelistLabel: '',
  isCWhitelist: '0',
  isCWhitelistLabel: '',
  createTime: '',
  code: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  dataSource: '',
  ownerOrgId: '',
};

export default {
  name: 'fundVehwhiteEdit',
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
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '车辆白名单：' + (this.form.code || '');
    },
    isWholesaleOrderEditable () {
      return this.form.documentType === '1' || this.form.documentType === 1;
    },
    isEnterpriseOrderEditable () {
      return this.form.documentType === '2' || this.form.documentType === 2;
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
      pageTitle: '车辆白名单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISVW，根据实际情况修改
      moduleKey: 'AISVW-fundVehwhite',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        documentType: [
          { required: true, message: '请选择单据类型', trigger: 'change' }
        ],
        wholesaleOrderCode: [
          {
            required: true,
            message: '请输入整车批售订单',
            trigger: 'blur',
            validator: (rule, value, callback) => {
              // 根据单据类型决定是否必填
              if (this.form.documentType === '1' || this.form.documentType === 1) {
                // 如果单据类型是整车批售订单，则必须填写整车批售订单
                if (!value) {
                  callback(new Error('请输入整车批售订单'));
                } else {
                  callback();
                }
              } else {
                // 否则不需要必填
                callback();
              }
            }
          }
        ],
        enterpriseOrderCode: [
          {
            required: true,
            message: '请输入企业客户整车订单',
            trigger: 'blur',
            validator: (rule, value, callback) => {
              // 根据单据类型决定是否必填
              if (this.form.documentType === '2' || this.form.documentType === 2) {
                // 如果单据类型是企业客户整车订单，则必须填写企业客户整车订单
                if (!value) {
                  callback(new Error('请输入企业客户整车订单'));
                } else {
                  callback();
                }
              } else {
                // 否则不需要必填
                callback();
              }
            }
          }
        ],
        vin: [
          { required: false, message: '请输入VIN号', trigger: 'blur' }
        ],
        parentCompanyName: [
          { required: false, message: '请输入母公司名称', trigger: 'blur' }
        ],
        dealerName: [
          { required: false, message: '请输入门店', trigger: 'blur' }
        ],
        enterpriseCustomerName: [
          { required: false, message: '请输入企业客户', trigger: 'blur' }
        ],
        isBWhitelist: [
          { required: true, message: '请选择是否B端白名单', trigger: 'change' }
        ],
        isCWhitelist: [
          { required: true, message: '请选择是否C端白名单', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
  },
  methods: {
    openWindow (url) {
      window.open(url, '_blank');
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          // 加载详情后触发文档类型变化处理
          if (res && res.documentType) {
            this.handleDocumentTypeChange(res.documentType);
          }
          return res;
        });
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    handleDocumentTypeChange (value) {
      // 根据单据类型清空对应的订单字段和相关信息
      if (value !== '1' && value !== 1) {
        // 如果不是整车批售订单类型，则清空整车批售订单字段和相关信息
        this.form.wholesaleOrderCode = '';
        this.form.parentCompanyName = '';
        this.form.dealerName = '';
      }
      if (value !== '2' && value !== 2) {
        // 如果不是企业客户整车订单类型，则清空企业客户整车订单字段和相关信息
        this.form.enterpriseOrderCode = '';
        this.form.enterpriseCustomerName = '';
      }

      // 清空VIN信息
      this.form.vin = '';
    },
    // 监听整车批售订单选择变化
    async handleWholesaleOrderChange (selectedValue, response) {
      if (!selectedValue) {
        // 如果清空选择，清空相关信息
        this.form.parentCompanyName = '';
        this.form.parentCompanyCode = '';
        this.form.dealerName = '';
        this.form.dealerCode = '';
        this.form.vin = '';
        return;
      }

      if (response) {
        // 带出母公司名称和销售门店信息
        this.form.wholesaleOrderId = response.id || '';
        this.form.parentCompanyName = response.dealerCompanyName || '';
        this.form.parentCompanyCode = response.dealerCompanyCode || '';
        this.form.dealerName = response.saleDealerName || '';
        this.form.dealerCode = response.saleDealerCode || '';
        this.form.vin = response.vin;
      }
    },
    // 监听企业客户整车订单选择变化
    async handleEnterpriseOrderChange (selectedValue, response) {
      if (!selectedValue) {
        // 如果清空选择，清空相关信息
        this.form.enterpriseCustomerName = '';
        this.form.enterpriseCustomerCode = '';
        this.form.vin = '';
        return;
      }

      // 根据选择的订单获取详细信息
      if (response) {
        // 带出企业客户信息
        this.form.enterpriseOrderId = response.id || '';
        this.form.enterpriseCustomerCode = response.entCustomerCode || '';
        this.form.enterpriseCustomerName = response.entCustomerName || '';
        this.form.vin = response.vin;
      }
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async getWholesaleOrderList (query) {
      // 获取整车批售订单列表，带模糊搜索
      const params = {
        wholesaleOrderCodeLike: query,
        pageNum: 1,
        pageSize: 20,
        orderStatus: 3
      };
      try {
        const response = await getWholesaleOrderList(params);
        // 将数据格式转换为下拉选项所需格式
        return Array.isArray(response.records) ? response.records.map(item => ({
          ...item,
          wholesaleOrderCode: item.wholesaleOrderCode
        })) : [];
      } catch (error) {
        console.error('获取整车批售订单列表失败:', error);
        return [];
      }
    },
    async getEnterpriseOrderList (query) {
      // 获取企业客户整车订单列表，带模糊搜索
      const params = {
        entOrderCodeLike: query,
        pageNum: 1,
        pageSize: 20,
        orderStatuses: [9, 51],
        orderSyncStatus: 1
      };
      try {
        const response = await getEnterpriseOrderList(params);
        // 将数据格式转换为下拉选项所需格式
        return Array.isArray(response.records) ? response.records.map(item => ({
          ...item,
          enterpriseOrderCode: item.entOrderCode
        })) : [];
      } catch (error) {
        console.error('获取企业客户整车订单列表失败:', error);
        return [];
      }
    }
  }
};
</script>
