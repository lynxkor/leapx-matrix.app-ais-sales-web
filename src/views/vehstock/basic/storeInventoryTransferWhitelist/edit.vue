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
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="群编号：" prop="groupNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.groupNo"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="群名称：" prop="groupName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.groupName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="群描述：" prop="groupDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.groupDesc"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="群编号：" prop="groupNo">
                  {{ form.groupNo }}
                </el-form-item>
                <el-form-item label="群名称：" prop="groupName">
                  {{ form.groupName }}
                </el-form-item>
                <el-form-item label="群描述：" prop="groupDesc">
                  {{ form.groupDesc }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>门店信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <base-search
                  style="width: 300px;"
                  :remote-method="queryListData"
                  remote
                  placeholder="请选择"
                  clearable
                  value-key="storeCode"
                  label-key="storeName"
                  @change="handleAddTableData"
                />
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="form.storeInventoryTransferWhitelistDetailList"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="dealerCode" title="门店编码" min-width="15%" />
                  <vxe-column field="dealerName" title="门店名称" min-width="15%" />
                  <vxe-column field="regionName" title="区域" min-width="15%" />
                  <vxe-column field="provinceName" title="省" min-width="15%" />
                  <vxe-column field="cityName" title="市" min-width="15%" />
                  <vxe-column field="remark" title="备注" min-width="15%" />
                  <vxe-column title="操作" width="100" fixed="right" v-if="_id && canAddOrUpdate">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确认要删除行信息吗？" @confirm="handleDeleteRow(rowIndex)" confirm-button-text="删除" confirm-button-type="danger">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
                  </template>
                </vxe-table>
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
    <!-- 网发门店批量 -->
    <StoreInformationDialog
      ref="storeInformationDialogRef"
      :visible.sync="storeInformationDialogVisible"
      @update:visible="val => storeInformationDialogVisible = val"
      @submit="detailRequest"
    />
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehstock/basic/storeInventoryTransferWhitelist/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { listOrgStoreInfo } from '@/libs/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import StoreInformationDialog from './StoreInformationDialog.vue';
import BaseSearch from '@/libs/components/BaseSearch';

const defaultForm = {
  // 多选时字段有变化，自行修复
  groupNo: '',
  groupName: '',
  groupDesc: '',
  storeInventoryTransferWhitelistDetailList: [],
};

export default {
  name: 'storeInventoryTransferWhitelistEdit',
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
    BaseSearch,
    StoreInformationDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '主键：' + this.form.id;
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
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '门店库存调拨白名单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVS-storeInventoryTransferWhitelist',
      loading: false,
      submitLoading: false,
      storeInformationDialogVisible: false, // 门店信息弹窗
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        groupNo: [
          { required: false, message: '请输入群编号', trigger: 'change' }
        ],
        groupName: [
          { required: true, message: '请输入群名称', trigger: 'blur' }
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
    // 删除子表数据
    handleDeleteRow (index) {
      // const item = this.form.storeInventoryTransferWhitelistDetailList[index];
      this.form.storeInventoryTransferWhitelistDetailList.splice(index, 1);
      addOrUpdate({ ...this.form }).then(res => {
        this.$message.success('保存成功');
      });
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        listOrgStoreInfo({ keyword: queryString }).then(res => {
          const list = res.records || [];
          resolve(list);
        });
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 容错处理：确保列表存在
      if (!this.form.storeInventoryTransferWhitelistDetailList) {
        this.$set(this.form, 'storeInventoryTransferWhitelistDetailList', []);
      }
      // 检查是否已存在相同门店的记录
      const exists = this.form.storeInventoryTransferWhitelistDetailList.some(item => item.dealerCode === record.storeCode);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      this.form.storeInventoryTransferWhitelistDetailList.push({
        dealerCode: record.storeCode,
        dealerName: record.storeName,
        regionCode: record.regionCode,
        regionName: record.region,
        provinceCode: record.provinceCode,
        provinceName: record.provinceName,
        cityCode: record.cityCode,
        cityName: record.cityName,
        remark: record.remark,
      });
      addOrUpdate({ ...this.form }).then(res => {
        this.$message.success('保存成功');
      });
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        storeInventoryTransferWhitelistDetailList: []
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
  }
};
</script>
