<template>
  <edit-page-layout ref="editLayout" title="建店类型承载力配置" showPaneFooter>
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
        </template>
        <template #extraButtons>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="180px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="承载力配置编码：" prop="buildConfigCode">
                  <el-input
                    placeholder="系统自动生成"
                    v-model="form.buildConfigCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="建店类型：" prop="buildStoreType">
                   <el-cascader
                      v-model="form.buildStoreType"
                      :options="shopTypeList"
                      :props="{
                          multiple: false,
                          emitPath: false
                        }"
                      collapse-tags
                      clearable
                    />
                </el-form-item>
                <el-form-item label="单人月度交付承载力：" prop="singleMonthDeliveryCapacity">
                  <el-input
                    v-model="form.singleMonthDeliveryCapacity"
                    placeholder="请输入正整数"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择状态"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime" v-if="_id">
                  <el-date-picker
                    v-model="form.createTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="创建时间"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="承载力配置编码：" prop="buildConfigCode">
                  {{ form.buildConfigCode }}
                </el-form-item>
                <el-form-item label="建店类型：" prop="buildStoreTypeLabel">
                  {{ form.buildStoreTypeLabel }}
                </el-form-item>
                <el-form-item label="单人月度交付承载力：" prop="singleMonthDeliveryCapacity">
                  {{ form.singleMonthDeliveryCapacity }}
                </el-form-item>
                <el-form-item label="状态：" prop="statusLabel">
                  <span :class="['status-tag', form.status === 1 ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime" v-if="form.createTime">
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
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/basicConfig/storeBuildCapacityConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getBuildType } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  buildConfigCode: '',
  buildStoreType: '',
  buildStoreTypeLabel: '',
  singleMonthDeliveryCapacity: undefined,
  status: 1,
  statusLabel: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  dataSource: ''
};

export default {
  name: 'storeBuildCapacityConfigEdit',
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
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '配置编码：' + (this.form.buildConfigCode || '新建');
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
      pageTitle: '建店类型承载力配置',
      pageType: 'edit',
      moduleKey: 'AISVR-storeBuildCapacityConfig',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      shopTypeList: [],
      rules: {
        buildStoreType: [
          { required: true, message: '请选择建店类型', trigger: 'change' }
        ],
        singleMonthDeliveryCapacity: [
          { required: true, message: '请输入单人月度交付承载力', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback();
                return;
              }
              const num = Number(value);
              if (!/^[1-9]\d*$/.test(value)) {
                callback(new Error('只能输入正整数'));
              } else if (num < 1) {
                callback(new Error('数值必须大于0'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
    this.fetchShopTypeEnum();
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
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      return {
        ...defaultForm,
        status: 1
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async fetchShopTypeEnum () {
      try {
        this.shopTypeList = await getBuildType({ status: 1 });
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
