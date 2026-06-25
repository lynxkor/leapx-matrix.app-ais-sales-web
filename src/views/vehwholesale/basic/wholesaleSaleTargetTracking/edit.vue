<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <!-- 顶部操作区（详情模式下显示） -->
    <div v-if="!isEditing" class="detail-actions">
      <el-button
        v-if="canAddOrUpdate"
        size="small"
        type="primary"
        plain
        @click="handleWholesaleEdit"
      >
        <i class="iconfont icon-lxppc-edit"></i>批售编辑
      </el-button>
      <el-button
        v-if="canAddOrUpdate"
        size="small"
        type="primary"
        plain
        @click="handleRetailEdit"
      >
        <i class="iconfont icon-lxppc-edit"></i>零售编辑
      </el-button>
    </div>
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
          <span class="status primary">{{ form.cooperationTypeLabel }}</span>
        </template>
        <el-main>
          <!-- 基础信息区（只读，两模式共用） -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" ref="ruleForm" class="form-detail">
                <el-form-item label="编号：">
                  {{ form.wholesaleSaleTargetTrackingCode }}
                </el-form-item>
                <el-form-item label="年：">
                  {{ form.year }}
                </el-form-item>
                <el-form-item label="月：">
                  {{ form.month }}
                </el-form-item>
                <el-form-item label="母公司：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/partner/channelManagement/companyDetails?companyCode=' + form.dealerParentOrgCode)">{{ form.dealerParentOrgName }}</el-button>
                </el-form-item>
                <el-form-item label="大区：">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="省份：">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="城市：">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="门店编码：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/partner/channelManagement/shopDetail?dealerCode=' + form.dealerCode)">{{ form.dealerCode }}</el-button>
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="车系：">
                  <el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/datacenter/materials/vehicleSeries/edit?id=' + form.seriesId)">{{ form.seriesName }}</el-button>
                </el-form-item>
                <el-form-item label="合作类型：">
                  {{ form.cooperationTypeLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <!-- 模式特定字段（批售模式） -->
          <section v-if="mode === 'wholesale'" class="common-section">
            <div class="common-section-header">
              <h2>{{ isEditing ? '编辑信息' : '查看信息' }}</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form
                v-if="isEditing"
                :inline="true"
                :model="form"
                :rules="rules"
                ref="ruleForm"
                label-width="150px"
                class="form-edit"
              >
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
                <el-form-item label="批售备注：" prop="wholesaleRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.wholesaleRemark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form v-else :inline="true" class="form-detail">
                <el-form-item label="批售目标数：">
                  {{ form.wholesaleTargetQty }}
                </el-form-item>
                <el-form-item label="批售备注：">
                  {{ form.wholesaleRemark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <!-- 模式特定字段（零售模式） -->
          <section v-else class="common-section">
            <div class="common-section-header">
              <h2>{{ isEditing ? '编辑信息' : '查看信息' }}</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form
                v-if="isEditing"
                :inline="true"
                :model="form"
                :rules="rules"
                ref="ruleForm"
                label-width="150px"
                class="form-edit"
              >
                <el-form-item label="新增缴定订单数：" prop="newOrderQty">
                  <el-input-number
                    :controls="false"
                    placeholder="请输入"
                    v-model="form.newOrderQty"
                    clearable
                    :min="0"
                    :precision="0"
                  />
                </el-form-item>
                <el-form-item label="新增锁单目标数：" prop="newLockTargetQty">
                  <el-input-number
                    :controls="false"
                    placeholder="请输入"
                    v-model="form.newLockTargetQty"
                    clearable
                    :min="0"
                    :precision="0"
                  />
                </el-form-item>
                <el-form-item label="净增锁单目标数：" prop="netLockTargetQty">
                  <el-input-number
                    :controls="false"
                    placeholder="请输入"
                    v-model="form.netLockTargetQty"
                    clearable
                    :min="0"
                    :precision="0"
                  />
                </el-form-item>
                <el-form-item label="批售考核目标数：" prop="wholesaleAssessmentTargetQty">
                  <el-input-number
                    :controls="false"
                    placeholder="请输入"
                    v-model="form.wholesaleAssessmentTargetQty"
                    clearable
                    :min="0"
                    :precision="0"
                  />
                </el-form-item>
                <el-form-item label="交付目标数：" prop="deliveryTargetQty">
                  <el-input-number
                    :controls="false"
                    placeholder="请输入"
                    v-model="form.deliveryTargetQty"
                    clearable
                    :min="0"
                    :precision="0"
                  />
                </el-form-item>
                <el-form-item label="零售备注：" prop="retailRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retailRemark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form v-else :inline="true" class="form-detail">
                <el-form-item label="新增缴定订单数：">
                  {{ form.newOrderQty }}
                </el-form-item>
                <el-form-item label="新增锁单目标数：">
                  {{ form.newLockTargetQty }}
                </el-form-item>
                <el-form-item label="净增锁单目标数：">
                  {{ form.netLockTargetQty }}
                </el-form-item>
                <el-form-item label="批售考核目标数：">
                  {{ form.wholesaleAssessmentTargetQty }}
                </el-form-item>
                <el-form-item label="交付目标数：">
                  {{ form.deliveryTargetQty }}
                </el-form-item>
                <el-form-item label="零售备注：">
                  {{ form.retailRemark }}
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
import { getDetail, addOrUpdate } from '@/api/vehwholesale/basic/wholesaleSaleTargetTracking/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  wholesaleSaleTargetTrackingCode: '',
  year: '',
  month: '',
  dealerParentOrgCode: '',
  dealerParentOrgName: '',
  cooperationType: '',
  cooperationTypeLabel: '',
  dealerCode: '',
  dealerName: '',
  regionName: '',
  provinceName: '',
  cityName: '',
  seriesName: '',
  newOrderQty: '',
  newLockTargetQty: '',
  netLockTargetQty: '',
  wholesaleAssessmentTargetQty: '',
  deliveryTargetQty: '',
  wholesaleTargetQty: '',
  confirmedQty: '',
  wholesaleRemark: '',
  retailRemark: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  regionId: '',
  provinceCode: '',
  cityCode: '',
  seriesId: '',
  ownerOrgId: '',
};

// 批售模式校验规则
const wholesaleRules = {
  wholesaleTargetQty: [
    { required: false, message: '请输入批售目标数', trigger: 'blur' }
  ],
};

// 零售模式校验规则
const retailRules = {
  newOrderQty: [
    { required: false, message: '请输入新增缴定订单数', trigger: 'blur' }
  ],
  newLockTargetQty: [
    { required: false, message: '请输入新增锁单目标数', trigger: 'blur' }
  ],
  netLockTargetQty: [
    { required: false, message: '请输入净增锁单目标数', trigger: 'blur' }
  ],
  wholesaleAssessmentTargetQty: [
    { required: false, message: '请输入批售考核目标数', trigger: 'blur' }
  ],
  deliveryTargetQty: [
    { required: false, message: '请输入交付目标数', trigger: 'blur' }
  ],
};

export default {
  name: 'wholesaleSaleTargetTrackingEdit',
  components: {
    EditPageLayout,
    EditBaseContainer,
  },
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
    mode () {
      // route.query.type: 'wholesale' (默认) | 'retail'
      return this.$route.query.type === 'retail' ? 'retail' : 'wholesale';
    },
    title () {
      const prefix = this.mode === 'retail' ? '销售目标跟踪（零售）' : '销售目标跟踪（批售）';
      return prefix + '：' + (this.form.wholesaleSaleTargetTrackingCode || '');
    },
    rules () {
      return this.mode === 'retail' ? retailRules : wholesaleRules;
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '销售目标跟踪',
      pageType: 'edit',
      moduleKey: 'AISVW-wholesaleSaleTargetTracking',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      isEditing: this.computeInitialEditing(),
    };
  },
  watch: {
    '$route.query.isEditing' () {
      this.isEditing = this.computeInitialEditing();
    }
  },
  methods: {
    openPane () {
      this.$refs.editLayout.openPane();
    },
    openWindow (url) {
      window.open(url, '_blank');
    },
    handleWholesaleEdit () {
      this.$router.push({
        path: '/vehwholesale/basic/wholesaleSaleTargetTracking/edit',
        query: {
          id: this._id,
          type: 'wholesale',
          isEditing: true
        }
      });
    },
    handleRetailEdit () {
      this.$router.push({
        path: '/vehwholesale/basic/wholesaleSaleTargetTracking/edit',
        query: {
          id: this._id,
          type: 'retail',
          isEditing: true
        }
      });
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
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    computeInitialEditing () {
      const id = this.id || this.$route.query.id;
      if (this.$route.query.isEditing === undefined) return !id;
      return this.$route.query.isEditing === 'true' || this.$route.query.isEditing === true;
    }
  }
};
</script>
