<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title="车辆预留配置："
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="车辆预留编号：" prop="code">
                  <el-input
                    placeholder="系统自动创建"
                    v-model="form.code"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="类型：" prop="type">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehstock_reservation_type"
                    v-model="form.type"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="业务编号：" prop="bizCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.bizCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="需预留数：" prop="reserveNum">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.reserveNum"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="已预留数：" prop="reservedNum">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.reservedNum"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="是否映射其他物料：" prop="isRelatedMatch">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.isRelatedMatch"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="截取预留起始位：" prop="reserveStartPos">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.reserveStartPos"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="截取预留截止位：" prop="reserveEndPos">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.reserveEndPos"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="VIN截取预留值：" prop="reserveCutValue">
                  <el-input
                    placeholder="请输入"
                    v-model="form.reserveCutValue"
                    clearable
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
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    maxLength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="车辆预留编号：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="类型：">
                  {{ form.typeLabel }}
                </el-form-item>
                <el-form-item label="业务编号：">
                  {{ form.bizCode }}
                </el-form-item>
                <el-form-item label="需预留数：">
                  {{ form.reserveNum }}
                </el-form-item>
                <el-form-item label="已预留数：">
                  {{ form.reservedNum }}
                </el-form-item>
                <el-form-item label="是否映射其他物料：">
                  {{ form.isRelatedMatchLabel }}
                </el-form-item>
                <el-form-item label="截取预留起始位：">
                  {{ form.reserveStartPos }}
                </el-form-item>
                <el-form-item label="截取预留截止位：">
                  {{ form.reserveEndPos }}
                </el-form-item>
                <el-form-item label="截取预留值：">
                  {{ form.reserveCutValue }}
                </el-form-item>
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
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
import { getDetail, addOrUpdate } from '@/api/vehstock/basic/vehicleReservationConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusLabel: '',
  statusDesc: '',
  bizCode: '',
  reserveNum: '',
  reservedNum: '',
  reserveStartPos: '',
  reserveEndPos: '',
  reserveCutValue: '',
  isRelatedMatch: '',
  isRelatedMatchLabel: '',
  type: '',
  typeLabel: '',
  code: '',
};

export default {
  name: 'vehicleReservationConfigEdit',
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
      return '车辆预留配置：' + (this.form.code || '');
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
      pageTitle: '车辆预留配置',
      pageType: 'edit',
      moduleKey: 'AISVS-vehicleReservationConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        reserveNum: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '' || value === null || value === undefined) {
                callback(new Error('需预留数不能为空'));
              } else if (value < 1) {
                callback(new Error('需预留数不能小于1'));
              } else if (value > 99999999) {
                callback(new Error('需预留数不能大于99999999'));
              } else if (isNaN(Number(value))) {
                callback(new Error('输入有效的数字'));
              } else if (Math.floor(Number(value)) !== Number(value)) {
                callback(new Error('需预留数必须为整数'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
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
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>
