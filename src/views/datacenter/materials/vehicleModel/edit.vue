<template>
  <edit-page-layout ref="editLayout" :title="title" showPaneFooter>
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
        :showEditBtn="true"
      >
        <template #status>
          <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="车型名称：" prop="modelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                    maxlength="30"
                  />
                </el-form-item>
                <el-form-item label="车系名称：" prop="seriesId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.seriesId"
                    :params="form.seriesName"
                    :remote-method="modelSearch"
                    @change="handleModelChange"
                    value-key="id"
                    label-key="seriesName"
                    placeholder="请选择"
                  />
                </el-form-item>
                <el-form-item label="系列名称：" prop="modelLineName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelLineName"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    maxlength="500"
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <el-input
                    placeholder="请输入"
                    v-model="form.statusLabel"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-input
                    placeholder="请输入"
                    v-model="form.createTime"
                    disabled
                  />
                </el-form-item>
              </el-form>

              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="车型名称：">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="车系名称：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleSeries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName }}</el-link>
                </el-form-item>
                <el-form-item label="系列名称：">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleModelLine/edit?id=${form.modelLineId}`" target="_blank">{{ form.modelLineName }}</el-link>
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建人：">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 年款信息（保持原状） -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>年款信息</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
                  :enableSingleRowSave="true"
                  @save-row-edit="saveRowEdit"
                />
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/datacenter/materials/vehicleModel/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import { getEnum, listVehicleYearType, vehicleSeriesListFull } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: null,
  modelName: '',
  seriesName: '',
  seriesId: '',
  modelLineName: '',
  modelLineId: '',
  remark: '',
  status: null,
  statusLabel: '',
  creatorName: '',
  createTime: ''
};

export default {
  name: 'vehicleModelEdit',
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
    FetchSelect,
    EditTable
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '车型名称：' + (this.form.modelName || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '销服-业务主数据-配置主数据-车型',
      pageType: 'edit',
      moduleKey: 'AISDC-vehicleModel',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        yearTypeName: ''
      },
      tableData: [],
      options: {
        yearTypeName: []
      },
      columns: [
        {
          field: 'yearTypeName',
          title: '年型名称',
          width: '20%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择年款',
              'remote-method': this.querySearchYear
            }
          },
          rules: [
            {
              required: true,
              message: '年型名称不能为空',
              trigger: 'blur'
            }
          ]
        },
        {
          field: 'creatorName',
          title: '创建人',
          editable: false,
          width: '30%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'createTime',
          title: '创建时间',
          editRender: { name: 'ElInput' }
        }
      ],
      rules: {
        modelName: [
          { required: true, message: '请输入车型名称，不可重复', trigger: 'blur' }
        ],
        seriesId: [
          { required: true, message: '请选择车系名称', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
    // 初始化数据由 edit-base-container 的 loadDetail 处理
  },
  methods: {
    async detailRequest () {
      const id = this._id;
      if (id) {
        this.listVehicleYearType();
        const detail = await getDetail(id);
        this.tableData = detail.modelYearTypeRelations || [];
        return detail;
      }
      return {};
    },
    async submitRequest () {
      const tableData = await this.handleSaveTable();
      if (!tableData || (Array.isArray(tableData) && tableData.length === 0)) {
        this.$message.error('请至少添加一条年款信息');
        return Promise.reject(new Error('请至少添加一条年款信息'));
      }
      const isDuplicate = this.checkDuplicateYearTypeId(tableData);
      if (isDuplicate) {
        this.$message.error('该年款信息已存在，请确认');
        return Promise.reject(new Error('该年款信息已存在，请确认'));
      }
      return addOrUpdate({ ...this.form, yearTypeIds: tableData });
    },
    handleModelChange (val, record) {
      if (record) {
        this.form.modelLineName = record.modelLineName;
        this.form.modelLineId = record.modelLineId;
      }
    },
    async modelSearch (query) {
      return vehicleSeriesListFull({ seriesNameLike: query, status: 1 });
    },
    querySearchYear (name) {
      listVehicleYearType({ modelIdList: this._id ? [this._id] : [], yearTypeNameLike: name, status: 1 }).then(res => {
        const list = res?.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name,
            yearTypeId: item.id,
            yearTypeName: item.name
          };
        }) || [];
        this.options.yearTypeName = list;
      });
    },
    listVehicleYearType () {
      listVehicleYearType({ modelIdList: this._id ? [this._id] : [], status: 1 }).then(res => {
        this.options.yearTypeName = res.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.id,
            yearTypeId: item.id,
            yearTypeName: item.name
          };
        });
      });
    },
    checkDuplicateYearTypeId (tableData) {
      const yearTypeIdSet = new Set();
      for (const row of tableData) {
        if (row.yearTypeId) {
          if (yearTypeIdSet.has(row.yearTypeId)) {
            return true;
          }
          yearTypeIdSet.add(row.yearTypeId);
        }
      }
      return false;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    handleAddRow () {
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    async saveRowEdit (row, defer) {
      const tableData = await this.handleSaveTable();
      const data = { ...this.form, yearTypeIds: tableData };
      addOrUpdate(data).then(id => {
        defer.resolve(id);
        this.$refs.containerRef.loadDetail();
      }).catch(() => {
        defer.reject();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
