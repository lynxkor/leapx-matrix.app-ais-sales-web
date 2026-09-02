<template>
  <edit-page-layout ref="editLayout" title="金融机构" showPaneFooter>
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
              <h2 v-show="_id">基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="170px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="170px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="金融机构名称：" prop="organizationName">
                  <el-input
                    placeholder="请输入金融机构名称"
                    v-model="form.organizationName"
                    clearable
                    maxlength="100"
                  />
                </el-form-item>
                <el-form-item label="金融机构编码：" prop="organizationCode">
                  <el-input
                    placeholder="请输入金融机构编码"
                    v-model="form.organizationCode"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="状态：">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.statusLabel"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建人：">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.creatorName"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建时间：">
                  <el-input
                    placeholder="请输入备注"
                    v-model="form.createTime"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="金融机构名称：" prop="organizationName">
                  {{ form.organizationName }}
                </el-form-item>
                <el-form-item label="金融机构编码：" prop="organizationCode">
                  {{ form.organizationCode }}
                </el-form-item>
                <el-form-item label="状态：" prop="statusLabel">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <section class="common-section">
            <div class="common-section-header common-section-header-flex">
              <h2>金融机构-资金结算类型列表</h2>
              <div v-if="isEditing || !_id" class="common-section-actions">
                <el-button size="small" type="primary" plain @click="addRelRow">
                  <i class="iconfont icon-lxppc-plus"></i> 新增结算资金类型
                </el-button>
              </div>
            </div>
            <div class="common-section-body">
              <el-table
                :data="relTableData"
                border
                size="small"
                style="width: 100%"
                v-loading="relLoading"
              >
                <el-table-column label="序号" type="index" width="55" align="center" />
                <el-table-column label="结算资金类型" min-width="180">
                  <template #default="{ row, $index }">
                    <template v-if="isEditing || !_id">
                      <fetch-select
                        :options="fundTypeOptions"
                        enumCode="vw_fundtype"
                        v-model="row.settleFundType"
                        placeholder="请选择结算资金类型"
                        clearable
                        filterable
                        @change="(val) => onRelFieldChange($index, 'settleFundType', val)"
                      />
                    </template>
                    <template v-else>
                      {{ row.settleFundTypeLabel }}
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="SAP资金类型编码" min-width="200">
                  <template #default="{ row, $index }">
                    <template v-if="isEditing || !_id">
                      <el-input
                        v-model="row.sapFundType"
                        placeholder="请输入SAP资金类型编码"
                        clearable
                        maxlength="50"
                        @change="(val) => onRelFieldChange($index, 'sapFundType', val)"
                      />
                    </template>
                    <template v-else>
                      {{ row.sapFundType }}
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="备注" min-width="200">
                  <template #default="{ row, $index }">
                    <template v-if="isEditing || !_id">
                      <el-input
                        v-model="row.remark"
                        placeholder="请输入备注"
                        clearable
                        maxlength="500"
                        @change="(val) => onRelFieldChange($index, 'remark', val)"
                      />
                    </template>
                    <template v-else>
                      {{ row.remark }}
                    </template>
                  </template>
                </el-table-column>
                <el-table-column v-if="isEditing || !_id" label="操作" width="100" align="center" fixed="right">
                  <template #default="{ $index }">
                    <el-button type="text" size="small" @click="removeRelRow($index)">删除</el-button>
                  </template>
                </el-table-column>
                <template #empty>
                  <div class="ais-empty-tip">
                    <span v-if="isEditing || !_id">暂无数据，点击右上角"新增结算资金类型"添加</span>
                    <span v-else>暂无关联的结算资金类型</span>
                  </div>
                </template>
              </el-table>
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/fund/fundFinancialOrganization/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  organizationName: '',
  organizationCode: '',
  status: '',
  statusLabel: '',
  remark: '',
  creatorName: '',
  createTime: '',
  id: '',
  relList: []
};

export default {
  name: 'fundFinancialOrganizationEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.form.id || this.$route.query.id;
    },
    title () {
      return '金融机构名称：' + this.form.organizationName;
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
    'form.relList': {
      handler () {
        this.initRelTableData();
      },
      immediate: true
    },
    isEditing (val) {
      // 编辑状态变化时，重新初始化关联关系列表（用于取消编辑后还原）
      if (!val) {
        this.initRelTableData();
      }
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '金融机构',
      pageType: 'edit',
      moduleKey: 'AISVW-fundFinancialOrganization',
      loading: false,
      submitLoading: false,
      fundTypeOptions: [],
      isEditing: false,
      isDetail: false,
      isAdd: false,
      isEdit: false,
      isDelete: false,
      isImport: false,

      form: { ...form },
      originalForm: { ...form },
      relTableData: [],
      relLoading: false,
      rules: {
        organizationName: [
          { required: true, message: '请输入金融机构名称', trigger: 'blur' },
          { max: 100, message: '最多输入100个字符', trigger: 'blur' }
        ],
        organizationCode: [
          { required: true, message: '请输入金融机构编码', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9_]+$/, message: '编码只能包含字母、数字和下划线', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    this.fetchSettleFundTypeOptions();
  },
  methods: {
    async fetchSettleFundTypeOptions () {
      try {
        const response = await getEnum('vw_fundtype');
        const list = (response && response.data) || response || [];
        this.fundTypeOptions = list
          .filter(item => ['2010', '2020', '2030'].includes(String(item.code)))
          .map(item => ({ ...item, code: String(item.code) }));
      } catch (e) {
        this.fundTypeOptions = [];
      }
    },
    initRelTableData () {
      const relList = (this.form && this.form.relList) || [];
      this.relTableData = relList.map(item => this.formatRelRow(item));
    },
    formatRelRow (raw) {
      const fundTypeOpt = this.fundTypeOptions.find(o => String(o.code) === String(raw.settleFundType));
      return {
        id: raw.id || '',
        settleFundType: raw.settleFundType !== null && raw.settleFundType !== undefined ? String(raw.settleFundType) : '',
        settleFundTypeLabel: raw.settleFundTypeLabel || (fundTypeOpt ? fundTypeOpt.message : ''),
        sapFundType: raw.sapFundType || '',
        remark: raw.remark || ''
      };
    },
    addRelRow () {
      this.relTableData.push({
        id: '',
        settleFundType: '',
        settleFundTypeLabel: '',
        sapFundType: '',
        remark: ''
      });
    },
    removeRelRow (index) {
      this.relTableData.splice(index, 1);
    },
    onRelFieldChange (index, field, val) {
      // 占位：可以在这里触发额外校验或联动
      if (field === 'settleFundType') {
        const opt = this.fundTypeOptions.find(o => String(o.code) === String(val));
        this.$set(this.relTableData[index], 'settleFundTypeLabel', opt ? opt.message : '');
      }
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
      return Promise.resolve();
    },
    submitRequest () {
      const submitForm = { ...this.form };
      delete submitForm.creatorName;
      delete submitForm.createTime;
      delete submitForm.statusLabel;
      // 同步最新的关联关系表格数据
      submitForm.relList = this.relTableData.map(row => ({
        id: row.id || undefined,
        settleFundType: row.settleFundType ? Number(row.settleFundType) : null,
        sapFundType: row.sapFundType || '',
        remark: row.remark || '',
        organizationId: submitForm.id || undefined
      }));
      return addOrUpdate(submitForm);
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      return JSON.parse(JSON.stringify(defaultForm));
    }
  }
};
</script>

<style lang="scss" scoped>
.common-section-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.common-section-actions {
  display: flex;
  gap: 8px;
}
.ais-empty-tip {
  padding: 16px 0;
  color: #909399;
  font-size: 13px;
  text-align: center;
}
</style>
