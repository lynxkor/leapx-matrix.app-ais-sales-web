<template>
  <edit-page-layout ref="editLayout" title="金融机构详情" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :detailRequest="detailRequest"
      >
        <el-main>
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="数据来源：">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="金融机构名称：">
                  {{ form.financeOrganizationName }}
                </el-form-item>
                <el-form-item label="金融机构编码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="创建者：">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="最近更新时间：">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="修改者：">
                  {{ form.modifierName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <div style="padding: 20px;">
          <h3>机构概况</h3>
          <div style="margin-top: 10px; padding: 15px; background: #f5f7fa; border-radius: 4px;">
            <div><strong>金融机构名称:</strong> {{ form.financeOrganizationName || '-' }}</div>
            <div style="margin-top: 8px;"><strong>金融机构编码:</strong> {{ form.code || '-' }}</div>
            <div style="margin-top: 8px;"><strong>数据来源:</strong> {{ form.dataSource || '-' }}</div>
            <div style="margin-top: 8px;"><strong>创建时间:</strong> {{ form.createTime || '-' }}</div>
          </div>
        </div>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail } from '@/api/vehretail/financeSubsidy/vrFinanceOrganization/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  creator: null,
  creatorName: '',
  createTime: '',
  modifier: null,
  modifierName: '',
  updateTime: '',
  remark: '',
  status: null,
  statusDesc: '',
  dataSource: null,
  code: '',
  ownerOrgId: null,
  financeOrganizationName: ''
};

export default {
  name: 'vrFinanceOrganizationEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '金融机构编码：' + (this.form.code || '');
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
      pageTitle: '整车零售-金融补贴-金融机构管理',
      pageType: 'edit',
      moduleKey: 'AISMC-vrFinanceOrganization',
      form: { ...form },
      originalForm: { ...form }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.page-common-edit {
  h3 {
    margin: 0 0 15px;
    font-size: 16px;
  }
}
</style>
