<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :showEditBtn="false"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :title="title"
      >
        <template #extraButtons>
          <el-button v-if="form.isPdiSubmit === 1 && form.isUnusual === 0" type="primary" size="small"  @click="handleDownloadPDF">下载PDF单据</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基本信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="PDI单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  <el-link type="primary" :href="`/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=${form.vin}`" target="_blank">{{ form.vin }}</el-link>
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="PDI类型：" prop="vehPdiType">
                  {{ form.vehPdiTypeLabel }}
                </el-form-item>
                <el-form-item label="生成方式：" prop="dataCreationType">
                  {{ form.dataCreationTypeLabel }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="VDC出库时间：" prop="outboundDateTime">
                  {{ form.outboundDateTime }}
                </el-form-item>
                <el-form-item label="收车确认时间：" prop="receivedOn">
                  {{ form.receivedOn }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="物料编码：" prop="materialsCode">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclematerials/edit?id=${form.materialsId}`" target="_blank">{{ form.materialsCode }}</el-link>
                </el-form-item>
                <el-form-item label="收车确认人：" prop="receivedBy">
                  {{ form.receivedBy }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="物料描述：" prop="materialsDesc">
                  {{ form.materialsDesc }}
                </el-form-item>
                <el-form-item label="车系：" prop="seriesName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleseries/edit?id=${form.seriesId}`" target="_blank">{{ form.seriesName }}</el-link>
                </el-form-item>
                <el-form-item label="车型：" prop="modelName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclemodel/edit?id=${form.modelId}`" target="_blank">{{ form.modelName }}</el-link>
                </el-form-item>
                <el-form-item label="外观：" prop="exteriorName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleexterior/edit?id=${form.exteriorId}`" target="_blank">{{ form.exteriorName }}</el-link>
                </el-form-item>
                <el-form-item label="续航里程：" prop="drivingRangeName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicledrivingrange/edit?id=${form.drivingRangeId}`" target="_blank">{{ form.drivingRangeName }}</el-link>
                </el-form-item>
                <el-form-item label="选配动力：" prop="rangePowerName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclerangepower/edit?id=${form.rangePowerId}`" target="_blank">{{ form.rangePowerName }}</el-link>
                </el-form-item>
                <el-form-item label="电池电芯：" prop="batteryCellName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclebatterycell/edit?id=${form.batteryCellId}`" target="_blank">{{ form.batteryCellName }}</el-link>
                </el-form-item>
                <el-form-item label="内饰：" prop="interiorName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleinterior/edit?id=${form.interiorId}`" target="_blank">{{ form.interiorName }}</el-link>
                </el-form-item>
                <el-form-item label="选配轮毂：" prop="wheelHubName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclewheelhub/edit?id=${form.wheelHubId}`" target="_blank">{{ form.wheelHubName }}</el-link>
                </el-form-item>
                <el-form-item label="年款：" prop="yearTypeName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleyeartype/edit?id=${form.yearTypeId}`" target="_blank">{{ form.yearTypeName }}</el-link>
                </el-form-item>
                <el-form-item label="选配包：" prop="optionPackageName">
                  <el-link type="primary" :href="`/sales/datacenter/materials/vehicleoptionpackage/edit?id=${form.optionPackageId}`" target="_blank">{{ form.optionPackageName }}</el-link>
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>门店信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="销售门店名称：" prop="saleDealerName">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.saleDealerCode}`" target="_blank">{{ form.saleDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.deliveryDealerCode}`" target="_blank">{{ form.deliveryDealerName }}</el-link>
                </el-form-item>
                <el-form-item label="大区：" prop="regionName">
                  {{ form.regionName }}
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>PDI信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="PDI是否完成提交：" prop="isPdiSubmit">
                  {{ form.isPdiSubmitLabel }}
                </el-form-item>
                <el-form-item label="PDI提交人：" prop="pdiSubmitBy">
                  {{ form.pdiSubmitBy }}
                </el-form-item>
                <el-form-item label="PDI提交时间：" prop="pdiSubmitOn">
                  {{ form.pdiSubmitOn }}
                </el-form-item>
                <el-form-item label="车辆是否存在异常：" prop="isUnusual">
                  {{ form.isUnusualLabel }}
                </el-form-item>
                <el-form-item label="车辆异常是否修复：" prop="isRepaired">
                  {{ form.isRepairedLabel }}
                </el-form-item>
                <el-form-item label="异常修复确认人：" prop="repairedBy">
                  {{ form.repairedBy }}
                </el-form-item>
                <el-form-item label="异常修复确认时间：" prop="repairedOn">
                  {{ form.repairedOn }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>一级检查</h2>
              <!-- <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button> -->
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="mainCheckTable"
                  :data="mainCheckList"
                  stripe
                  border="inner"
                  size="medium"
                  :cell-style="getCellStyle"
                  max-height="500px"
                >
                  <vxe-column field="name" title="检查项"></vxe-column>
                  <vxe-column field="isUnusualLabel" title="是否异常"></vxe-column>
                  <vxe-column field="isRepairedLabel" title="异常是否修复"></vxe-column>
                  <vxe-column field="repairedOn" title="异常修复时间"></vxe-column>
                  <vxe-column field="repairedDesc" title="修复说明" show-overflow-tooltip></vxe-column>
                </vxe-table>
                <el-pagination
                  @size-change="mainCheckSizeChange"
                  @current-change="mainCheckPageChange"
                  :current-page="mainCheckPagination.page"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="mainCheckPagination.size"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="mainCheckPagination.total"
                />
              </div>
            </div>
          </section>
          <section>
            <div class="common-section-header">
              <h2>子项检查</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="mainCheckTable"
                  :data="childCheckList"
                  stripe
                  border="inner"
                  size="medium"
                  :cell-style="getCellStyle"
                  max-height="500px"
                >
                  <vxe-column field="parentName" title="上级检查"></vxe-column>
                  <vxe-column field="name" title="检查项目"></vxe-column>
                  <vxe-column field="isUnusualLabel" title="是否异常"></vxe-column>
                  <vxe-column field="ab" title="异常描述"  show-overflow-tooltip></vxe-column>
                  <vxe-column field="damagedType" title="受损类型"></vxe-column>
                  <vxe-column field="isRepairedLabel" title="异常是否修复"></vxe-column>
                  <vxe-column field="repairedOn" title="异常修复时间"></vxe-column>
                  <vxe-column field="repairedDesc" title="修复说明" show-overflow-tooltip></vxe-column>
                  <vxe-column title="附件">
                    <template slot-scope="scope">
                      <span v-if="scope.row.abnormalUrl" style="cursor: pointer; color: #4C4CD6;" @click="viewFile(scope.row)">查看</span>
                      <span v-else>--</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="createTime" title="创建时间"></vxe-column>
                </vxe-table>
                <el-pagination
                  @size-change="childCheckSizeChange"
                  @current-change="childCheckPageChange"
                  :current-page="childCheckPagination.page"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="childCheckPagination.size"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="childCheckPagination.total"
                />
              </div>
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
    <el-dialog
      class="m-AuditLog-dialog"
      title="附件"
      :visible.sync="fileDialogVisible"
      width="700px"
      max-height="600px"
      :close-on-click-modal="false"
      append-to-body
    >
      <div style="display: inline-flex; align-items: center; flex-wrap: wrap">
        <el-image v-for="(item, index) in viewPictureList" :key="index" :src="item" fit="fit"
          :preview-src-list="viewPictureList"
          :style="{
            width: '200px',
            height: '200px',
            margin: `0 ${(index + 1) % 3 === 0 ? 0 : 20}px 20px 0`
          }"
        ></el-image>
      </div>
    </el-dialog>
    <el-dialog
      title="下载PDF单据"
      v-loading="showPdfItemLoading"
      :visible.sync="showPdfItemVisible"
      width="1200px"
      :close-on-click-modal="false"
      @cancel="showPdfItemVisible = false"
      append-to-body
    >
      <PdfItem ref="childPdfItem" :form="form" :pdfData="pdfData"></PdfItem>
    </el-dialog>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, storeVehiclePdiCheckItemPage, getPdiEntryDetails } from '@/api/vehstock/store/storeVehiclePdi/index';
// import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import PdfItem from './component/pdfItem.vue';

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
  code: '',
  vin: '',
  vehPdiType: '',
  isPdiSubmit: '',
  isUnusual: '',
  isRepaired: '',
  lockStatus: '',
  seriesName: '',
  modelName: '',
  yearTypeName: '',
  materialsDesc: '',
  materialsCode: '',
  saleDealerCode: '',
  saleDealerName: '',
  deliveryDealerCode: '',
  deliveryDealerName: '',
  pdiSubmitById: '',
  pdiSubmitBy: '',
  pdiSubmitOn: '',
  repairedById: '',
  repairedBy: '',
  repairedOn: '',
  dataCreationType: '',
  outboundDateTime: '',
  receivedOn: '',
  receivedById: '',
  receivedBy: '',
  exteriorName: '',
  interiorName: '',
  drivingRangeName: '',
  rangePowerName: '',
  batteryCellName: '',
  wheelHubName: '',
  optionPackageName: '',
  regionCode: '',
  regionName: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
};

export default {
  name: 'storeVehiclePdiEdit',
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
    PdfItem,
    // EditTable,
    // FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return 'PDI单号：' + this.form.code;
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
    form: {
      async handler (val) {
        if (val) {
          this.getMainCheckList();
          this.getChildCheckList();
        }
      },
      deep: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      showPdfItemLoading: false,
      showPdfItemVisible: false,
      fileDialogVisible: false,
      viewPictureList: [],
      pageTitle: '门店整车PDI单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVS-storeVehiclePdi',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      mainCheckList: [], // 一级检查项
      mainCheckPagination: {
        page: 1,
        size: 20,
        total: 0
      },
      childCheckList: [], // 子项检查
      childCheckPagination: {
        page: 1,
        size: 20,
        total: 0
      },
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      rules: {
      },
      pdfData: {}
    };
  },
  mounted () {
  },
  methods: {
    // 是否异常=是，异常是否修复=否，则红色字体显示
    getCellStyle (rowItem) {
      if (rowItem.row.isUnusual === 1 && rowItem.row.isRepaired === 0) {
        return {
          color: '#B91919'
        };
      }
    },
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
    },
    // 一级检查分页
    mainCheckPageChange (page) {
      this.mainCheckPagination.page = page;
      this.getMainCheckList();
    },
    mainCheckSizeChange (size) {
      this.mainCheckPagination.size = size;
      this.getMainCheckList();
    },
    // 一级检查项
    async getMainCheckList () {
      let res = await storeVehiclePdiCheckItemPage({
        code: this.form.code,
        layerType: '10',
        pageNum: this.mainCheckPagination.page,
        pageSize: this.mainCheckPagination.size,
        isUnusualFrontDisplay: 1
      });
      if (res) {
        this.mainCheckList = res.records;
        this.mainCheckPagination.total = res.total;
      }
    },
    // 子级检查项
    async getChildCheckList () {
      let res = await storeVehiclePdiCheckItemPage({
        code: this.form.code,
        layerTypeList: ['20', '30'],
        pageNum: this.childCheckPagination.page,
        pageSize: this.childCheckPagination.size,
        isUnusualFrontDisplay: 1
      });
      if (res) {
        this.childCheckList = res.records;
        this.childCheckPagination.total = res.total;
      }
    },
    // 子项检查分页
    childCheckPageChange (page) {
      this.childCheckPagination.page = page;
      this.getChildCheckList();
    },
    childCheckSizeChange (size) {
      this.childCheckPagination.size = size;
      this.getChildCheckList();
    },
    viewFile (row) {
      this.viewPictureList = (row.abnormalUrl && row.abnormalUrl.split(',')) || [];
      this.fileDialogVisible = true;
    },
    handleDownloadPDF () {
      this.showPdfItemVisible = true;
      this.$nextTick(async () => {
        this.showPdfItemLoading = true;
        let res = await getPdiEntryDetails(this.form.id);
        this.showPdfItemLoading = false;
        this.pdfData = res;
        if (this.$refs.childPdfItem && this.pdfData) {
          this.$refs.childPdfItem.handlePdf();
        }
      });
    },
  }
};
</script>
