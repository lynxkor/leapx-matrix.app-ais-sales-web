<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :detailRequest="detailRequest" @submit="handleMySubmit">
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <!-- <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body"> -->
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <!-- <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
              </el-form>
              <el-form :inline="true" class="form-detail" >
              </el-form>
            </div>
          </section> -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>门店共享库存</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <base-search
                  style="width: 300px;"
                  filterable
                  clearable
                  remote
                  :remote-method="queryListData"
                  @change="handleAddTableData"
                  value-key="id"
                  label-key="vinDesc"
                  :disabled="!(isEditing || !_id)"
                />
              </div>
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="form.storeSharedInventoryDetailAddOrUpdateReqList" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="vin" title="VIN" min-width="9%" />
                  <vxe-column field="materialsCode" title="物料编码" min-width="9%" />
                  <vxe-column field="materialsDesc" title="物料描述" min-width="9%" />
                  <vxe-column field="sharedVehicleCategory" title="共享车辆类别" min-width="9%">
                    <template #default="{ row }">
                      <fetch-select :request="fetchOptions" enumCode="vehstock_shared_vehicle_category"
                        v-model="row.sharedVehicleCategory" placeholder="请选择" clearable filterable :disabled="!(isEditing || !_id)" />
                    </template>
                  </vxe-column>
                  <vxe-column field="drivingRangeName" title="选配续航" min-width="9%" />
                  <vxe-column field="rangePowerName" title="选配动力" min-width="9%" />
                  <vxe-column field="exteriorName" title="外饰" min-width="9%" />
                  <vxe-column field="interiorName" title="内饰" min-width="9%" />
                  <vxe-column field="modelName" title="车型" min-width="9%" />
                  <vxe-column field="wheelHubName" title="选配轮毂" min-width="9%" />
                  <vxe-column field="remark" title="备注" min-width="9%" />
                  <vxe-column field="createTime" title="创建时间" min-width="9%" />
                  <vxe-column title="操作" width="100" fixed="right" v-if="isEditing || !_id">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)" confirm-button-text="删除" confirm-button-type="danger">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
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
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehstock/store/storeSharedInventory/index';
import { getList } from '@/api/vehstock/store/storeInventoryLedger/index';
import FetchSelect from '@/libs/components/FetchSelect';
import BaseSearch from '@/libs/components/BaseSearch';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
};

export default {
  name: 'storeSharedInventoryEdit',
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
    FetchSelect,
    BaseSearch
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
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '门店共享库存',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改，name为小写驼峰格式
      moduleKey: 'AISVS-storeSharedInventory',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
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
    async handleMySubmit (success) {
      await addOrUpdate({ ...this.form });
      this.$message.success('保存成功');
      this.$router.push('/vehstock/store/storeSharedInventory');
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.form.storeSharedInventoryDetailAddOrUpdateReqList[index];
      this.form.storeSharedInventoryDetailAddOrUpdateReqList.splice(index, 1);
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
        getList({ vin: queryString }).then(res => {
          const list = res.records?.map(item => ({
            ...item,
            vinDesc: item.vin + '-' + item.materialsDesc,
          })) || [];
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
      // 检查车辆是否符合调拨条件
      if (!(Number(record.vechicleStatus) === 12 && Number(record.lockStatus) === 0 && Number(record.reserved) === 0)) {
        this.$message.warning('车辆不符合共享状态，请确认！');
        return;
      }
      // 检查是否已存在
      const exists = this.form.storeSharedInventoryDetailAddOrUpdateReqList.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.form.storeSharedInventoryDetailAddOrUpdateReqList.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        storeSharedInventoryDetailAddOrUpdateReqList: [],
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
