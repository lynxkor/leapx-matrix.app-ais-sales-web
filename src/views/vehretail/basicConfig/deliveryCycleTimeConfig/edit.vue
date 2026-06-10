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
                <el-form-item label="时效指标：" prop="timeIndexLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.timeIndexLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="维度：" prop="dimensionLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dimensionLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="车型：" prop="modelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modelName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="城市：" prop="cityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="省份：" prop="provinceName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.regionName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="时效值：" prop="timeValue">
                  <el-input
                    placeholder="请输入"
                    v-model="form.timeValue"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="调整值：" prop="adjustValue">
                  <el-input
                    placeholder="请输入"
                    v-model="form.adjustValue"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
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
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="时效指标：" prop="timeIndexLabel">
                  {{ form.timeIndexLabel }}
                </el-form-item>
                <el-form-item label="维度：" prop="dimensionLabel">
                  {{ form.dimensionLabel }}
                </el-form-item>
                <el-form-item label="车型：" prop="modelName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleModel/edit?id=${form.modelId}`" target="_blank">{{ form.modelName }}</el-link>
                </el-form-item>
                <el-form-item label="城市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="省份：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="时效值：" prop="timeValue">
                  {{ form.timeValue }}
                </el-form-item>
                <el-form-item label="调整值：" prop="adjustValue">
                  {{ form.adjustValue }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：" prop="statusLabel">
                  <span :class="['status-tag', form.status === 1 ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
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
import { getDetail, addOrUpdate } from '@/api/vehretail/basicConfig/deliveryCycleTimeConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  timeIndex: '',
  dimension: '',
  modelName: '',
  cityName: '',
  provinceName: '',
  regionName: '',
  timeValue: '',
  adjustValue: '',
  remark: '',
  statusDesc: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  status: '',
  modelId: '',
  regionCode: '',
  provinceCode: '',
  cityCode: '',
  dataSource: '',
};

export default {
  name: 'deliveryCycleTimeConfigEdit',
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
      return '时效指标：' + this.form.timeIndexLabel;
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
      pageTitle: '交付周期时效信息',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-deliveryCycleTimeConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        timeIndex: [
          { required: true, message: '请选择时效指标 10-确认批售时效;20-门店结算时效;30-VDC出库时效;40-物流到店时效;50-门店交付时效', trigger: 'change' }
        ],
        dimension: [
          { required: true, message: '请输入维度 10-车型;20-城市;30-省份;40-大区;50-全国', trigger: 'change' }
        ],
        modelName: [
          { required: true, message: '请输入车型名称', trigger: 'change' }
        ],
        cityName: [
          { required: true, message: '请输入市', trigger: 'change' }
        ],
        provinceName: [
          { required: true, message: '请输入省', trigger: 'change' }
        ],
        regionName: [
          { required: true, message: '请输入大区', trigger: 'change' }
        ],
        timeValue: [
          { required: true, message: '请选择时效值', trigger: 'change' }
        ],
        adjustValue: [
          { required: true, message: '请输入调整值', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态 0-禁用;1-启用', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        regionCode: [
          { required: true, message: '请输入大区组织编码', trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: '请输入省组织编码', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请输入市组织编码', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150-新销服; 10-老销服', trigger: 'change' }
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
    }
  }
};
</script>
