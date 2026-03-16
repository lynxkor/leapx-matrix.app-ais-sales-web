<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="关联交易计算比例："
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
            <span>{{ form.code }}</span>
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

                <el-form-item label="销售公司：" prop="saleCompanyId">
                   <fetch-select
                      filterable
                      clearable
                      remote
                      v-model="form.saleCompanyId"
                      :params="form.saleCompanyName"
                      :remote-method="getCompanyList"
                      value-key="id"
                      label-key="companyName"
                    />
                </el-form-item>
                 <el-form-item label="订单分类：" prop="orderCategory">
                  <fetch-select
                    :options="orderCategoryOptions"
                    v-model="form.orderCategory"
                    placeholder="请选择订单分类"
                    clearable
                    filterable
                  />
                </el-form-item>
                 <el-form-item label="关联交易价格比例(%)：" prop="txnTaxPriceRate">
                  <el-input-number
                    v-model="form.txnTaxPriceRate"
                    placeholder="请输入"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :max="100"
                    :controls="false"
                  />
                </el-form-item>
                 <el-form-item label="生效时间：" prop="effectiveTime">
                    <el-date-picker
                    type="datetime"
                    v-model="form.effectiveTime"
                     value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择额度生效日期"
                  />
                </el-form-item>
                <el-form-item label="失效时间：" prop="expireTime">
                  <el-date-picker
                    type="datetime"
                    v-model="form.expireTime"
                     value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择额度失效时间"
                  />
                </el-form-item>
                  <!-- <el-form-item label="关联交易编号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item> -->
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="销售公司：" prop="saleCompanyId">
                  {{ form.saleCompanyId }}
                </el-form-item>
                 <el-form-item label="订单分类：" prop="orderCategoryLabel">
                  {{ form.orderCategoryLabel }}
                </el-form-item>
                <el-form-item label="关联交易价格比例：" prop="txnTaxPriceRate">
                  {{ form.txnTaxPriceRate }}
                </el-form-item>
                 <el-form-item label="生效时间：" prop="effectiveTime">
                  {{ form.effectiveTime }}
                </el-form-item>
                <el-form-item label="失效时间：" prop="expireTime">
                  {{ form.expireTime }}
                </el-form-item>
                 <el-form-item label="关联交易编号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="更新时间：" prop="updateTime">
                  {{ form.updateTime }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/entorder/entTransactionTaxPriceConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList as companyList } from '@/api/vehwholesale/fund/fundSaleCompany/index';

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
  dataSource: '',
  code: '',
  saleCompanyId: '',
  orderCategory: '',
  txnTaxPriceRate: '',
  effectiveTime: '',
  expireTime: '',
};

export default {
  name: 'entTransactionTaxPriceConfigEdit',
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
      pageTitle: '关联交易计算比例',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVW-entTransactionTaxPriceConfig',
      loading: false,
      submitLoading: false,
      orderCategoryOptions: [],
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      rules: {
        saleCompanyId: [
          { required: true, message: '请输入销售公司', trigger: 'change' }
        ],
        orderCategory: [
          { required: true, message: '请输入订单分类', trigger: 'change' }
        ],
        txnTaxPriceRate: [
          { required: true, message: '请输入关联交易价格比', trigger: 'change' }
        ],
        effectiveTime: [
          { required: true, message: '请选择生效时间', trigger: 'change' }
        ],
        expireTime: [
          { required: true, message: '请选择失效时间', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.fetchOrderCategoryOptions();
    this.getCompanyList();
  },
  methods: {
    getCompanyList (query) {
      return companyList({ companyNameLike: query, status: 1 });
    },
    async fetchOrderCategoryOptions () {
      const response = await getEnum('vw_eordertype');
      this.orderCategoryOptions = response.filter(item => {
        const codeStr = String(item.code);
        return ['1', '8', '21'].includes(codeStr + '');
      }).map(item => {
        return {
          ...item,
          code: String(item.code)
        };
      });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      if (this.form.effectiveTime && new Date(this.form.expireTime) < new Date(this.form.effectiveTime)) {
        this.$message.error('失效日期不可小于生效日期，请检查！');
        return false;
      }
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
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
