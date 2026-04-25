<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="批售目标默认配额："
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <span class="status primary">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="车系：" prop="seriesId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.seriesId"
                    :params="form.seriesName"
                    :remote-method="getVehicleSeriesList"
                    value-key="id"
                    label-key="name"
                    :disabled="!!_id"
                    @change="(val, record) => {form.seriesName = record?.name || ''}"
                  />
                </el-form-item>
                <el-form-item label="批售目标数：" prop="wholesaleTargetQty">
                  <el-input-number
                    :controls="false"
                    placeholder="请输入"
                    v-model="form.wholesaleTargetQty"
                    clearable
                    :min="0"
                    :precision="0"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="车系：">
                  {{ form.seriesName }}
                </el-form-item>
                <el-form-item label="批售目标数：">
                  {{ form.wholesaleTargetQty }}
                </el-form-item>
                <el-form-item label="备注：">
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleTargetDefaultQuota/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, vehicleSeriesList } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  wholesaleTargetDefaultQuotaName: '',
  seriesName: '',
  wholesaleTargetQty: 0,
  remark: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  status: '',
  statusLabel: '',
  statusDesc: '',
  dataSource: '',
  seriesId: '',
  ownerOrgId: '',
};

export default {
  name: 'wholesaleTargetDefaultQuotaEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '批售目标默认配额：' + (this.form.seriesName || '');
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    EditPageLayout,
    EditBaseContainer
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '批售目标默认配额',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleTargetDefaultQuota',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        seriesId: [
          { required: true, message: '请选择车系', trigger: 'change' }
        ],
        wholesaleTargetQty: [
          { required: true, message: '请输入批售目标数', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    openPane () {
      this.$refs.editLayout.openPane();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
      return {};
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async getVehicleSeriesList (params) {
      return vehicleSeriesList({ seriesNameLike: params, status: 1 });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>
