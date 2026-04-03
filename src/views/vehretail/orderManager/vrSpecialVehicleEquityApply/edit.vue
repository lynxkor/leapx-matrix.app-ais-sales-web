<template>
  <edit-page-layout ref="editLayout" title="特殊车辆权益申请详情" showPaneFooter>
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
          <span class="status primary">{{ form.applyStatusLabel }}</span>
        </template>
        <el-main>

          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="权益申请编号：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="VIN号：">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="整车物料码：">
                  {{ form.materialsCode }}
                </el-form-item>
                <el-form-item label="申请时间：">
                  {{ form.applyTime }}
                </el-form-item>
                <el-form-item label="基本车型：">
                  {{ form.modelName }}
                </el-form-item>
                <el-form-item label="申请人：">
                  {{ form.applyUserName }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 原车主信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>原车主信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="原车主名称：">
                  {{ form.originalOwnerName }}
                </el-form-item>
                <el-form-item label="原车主手机号码：">
                  {{ form.originalOwnerPhone }}
                </el-form-item>
                <el-form-item label="原车主证件类型：">
                  {{ form.originalOwnerIdTypeLabel }}
                </el-form-item>
                <el-form-item label="原车主证件号码：">
                  {{ form.originalOwnerIdNumber }}
                </el-form-item>
                <el-form-item label="原车主渠道ID号：">
                  {{ form.originalOwnerChannelId }}
                </el-form-item>
                <el-form-item label="原车主车牌号：">
                  {{ form.originalOwnerPlateNumber }}
                </el-form-item>
                <el-form-item label="原销售日期：">
                  {{ form.originalSaleDate }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 新车主信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>新车主信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="新车主名称：">
                  {{ form.newOwnerName }}
                </el-form-item>
                <el-form-item label="新车主手机号码：">
                  {{ form.newOwnerPhone }}
                </el-form-item>
                <el-form-item label="新车主证件类型：">
                  {{ form.newOwnerIdTypeLabel }}
                </el-form-item>
                <el-form-item label="新车主证件号码：">
                  {{ form.newOwnerIdNumber }}
                </el-form-item>
                <el-form-item label="新车主车牌号：">
                  {{ form.newOwnerPlateNumber }}
                </el-form-item>
                <el-form-item label="销售门店：">
                  {{ form.saleDealerName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- OCR识别信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>OCR识别信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="证件识别的证件名称：">
                  {{ form.ocrIdName }}
                </el-form-item>
                <el-form-item label="证件识别的证件号码：">
                  {{ form.ocrIdNumber }}
                </el-form-item>
                <el-form-item label="发票识别的开票名称：">
                  {{ form.ocrInvoiceName }}
                </el-form-item>
                <el-form-item label="发票识别的证件号码：">
                  {{ form.ocrInvoiceIdNumber }}
                </el-form-item>
                <el-form-item label="发票识别的发票VIN：">
                  {{ form.ocrInvoiceVin }}
                </el-form-item>
                <el-form-item label="发票识别的发票号码：">
                  {{ form.ocrInvoiceNumber }}
                </el-form-item>
                <el-form-item label="发票识别的开票金额：">
                  {{ form.ocrInvoiceAmount }}
                </el-form-item>
                <el-form-item label="发票识别的开票日期：">
                  {{ form.ocrInvoiceDate }}
                </el-form-item>
              </el-form>
            </div>
            <!-- 附件材料 -->
            <section class="common-section" v-if="_id">
              <div class="common-section-header">
                <h2>附件材料</h2>
              </div>
              <div class="common-section-body">
                <div class="attachment-grid">
                  <AisAttachmentList
                    v-for="(item, index) in attachmentList" :key="index"
                    :businessId="_id"
                    :ref="'attachment' + index"
                    :configCode="item.configCode"
                    :attachType="item.attachType"
                    :title="item.label"
                    :uploadConfig="item.uploadConfig"
                    type="card"
                    :readonly="true"
                  />
                </div>
              </div>
            </section>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <section class="common-section">
          <div class="common-section-header">
            <h2>申请概况</h2>
          </div>
          <div class="common-section-body">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="申请编号">
                {{ form.code || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="申请状态">
                {{ form.applyStatusLabel }}
              </el-descriptions-item>
              <el-descriptions-item label="VIN">
                {{ form.vin || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="整车物料码">
                {{ form.materialsCode || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="基本车型">
                {{ form.modelName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="销售门店">
                {{ form.saleDealerName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="新车主">
                {{ form.newOwnerName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="申请时间">
                {{ form.applyTime || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </section>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/orderManager/vrSpecialVehicleEquityApply/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import AisAttachmentList from '@/libs/components/AisAttachmentList/index.vue';

const defaultForm = {
  id: '',
  code: '', // 权益申请编号
  vin: '', // VIN号
  vinId: '', // VIN ID
  applyStatus: null, // 申请状态
  applyStatusLabel: '', // 申请状态标签
  applyTime: '', // 申请时间
  materialsCode: '', // 整车物料码
  materialsId: '', // 物料ID
  modelName: '', // 基本车型
  modelId: '', // 基本车型ID
  saleDealerName: '', // 销售门店名称
  ownerOrgId: '', // 所属组织ID
  originalOwnerName: '', // 原车主名称
  originalOwnerPhone: '', // 原车主手机号码
  originalOwnerIdType: null, // 原车主证件类型
  originalOwnerIdTypeLabel: '', // 原车主证件类型标签
  originalOwnerIdNumber: '', // 原车主证件号码
  originalOwnerChannelId: '', // 原车主渠道ID号
  originalOwnerPlateNumber: '', // 原车主车牌号
  originalSaleDate: '', // 原销售日期
  newOwnerName: '', // 新车主名称
  newOwnerPhone: '', // 新车主手机号码
  newOwnerIdType: null, // 新车主证件类型
  newOwnerIdTypeLabel: '', // 新车主证件类型标签
  newOwnerIdNumber: '', // 新车主证件号码
  newOwnerPlateNumber: '', // 新车主车牌号
  ocrIdName: '', // 证件识别的证件名称
  ocrIdNumber: '', // 证件识别的证件号码
  ocrInvoiceName: '', // 发票识别的开票名称
  ocrInvoiceIdNumber: '', // 发票识别的证件号码
  ocrInvoiceVin: '', // 发票识别的发票VIN
  ocrInvoiceNumber: '', // 发票识别的发票号码
  ocrInvoiceDate: '', // 发票识别的开票日期
  ocrInvoiceAmount: '', // 发票识别的开票金额
  remark: '', // 备注
  createTime: '', // 创建时间
  applicant: '', // 申请人
  applicationTime: '', // 申请时间
  approver: '', // 审批人
  approveTime: '', // 审批时间
  approveRemark: '', // 审批意见
  applyUserName: '' // 申请人姓名
};

export default {
  name: 'vrSpecialVehicleEquityApplyEdit',
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
    AisAttachmentList
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '特殊车辆权益申请编号：' + (this.form.code || '');
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
    const form = this.getDefaultForm();
    return {
      pageTitle: '特殊车辆权益申请',
      pageType: 'edit',
      moduleKey: 'AISVR-vrSpecialVehicleEquityApply',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      isEditing: false,
      attachmentList: [
        { label: '附件资料', required: false, configCode: 'mcs_licensedvehiclessale', attachType: '附件资料' }
      ]
    };
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
    getDefaultForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
