<template>
  <edit-page-layout ref="editLayout" :title="pannelTitle" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
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
              <el-form :inline="true"
                       :model="form"
                       :rules="rules"
                       colmuns="2"
                       ref="ruleForm"
                       label-width="180px"
                       class="form-edit"
                       v-show="isEditing || !_id">
                <el-form-item label="原因分类代码：" prop="cateCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cateCode"
                    :disabled="true"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退订原因分类：" prop="cateName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cateName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下拉选中是否展示：" prop="selectorDisplay">
                  <el-select
                    placeholder="请选择"
                    v-model="form.selectorDisplay"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in yes_no_enum"
                      :key="Number(item.code)"
                      :label="item.message"
                      :value="Number(item.code)"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="原路退回允许选择：" prop="originalRefund">
                  <el-select
                    placeholder="请选择"
                    v-model="form.originalRefund"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in yes_no_enum"
                      :key="Number(item.code)"
                      :label="item.message"
                      :value="Number(item.code)"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否需要初审：" prop="preApproval">
                  <el-select
                    placeholder="请选择"
                    v-model="form.preApproval"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in yes_no_enum"
                      :key="Number(item.code)"
                      :label="item.message"
                      :value="Number(item.code)"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否需要终审：" prop="finalApproval">
                  <el-select
                    placeholder="请选择"
                    v-model="form.finalApproval"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in yes_no_enum"
                      :key="Number(item.code)"
                      :label="item.message"
                      :value="Number(item.code)"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="默认定金退回方式：" prop="refundTypeDefault">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="order_fund_return_type"
                    v-model="form.refundTypeDefault"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="退还方式是否允许选择：" prop="refundTypeSelect">
                  <el-select
                    placeholder="请选择"
                    v-model="form.refundTypeSelect"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in yes_no_enum"
                      :key="Number(item.code)"
                      :label="item.message"
                      :value="Number(item.code)"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="退订附件上传要求：" prop="refundAttachRequired">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundAttachRequired"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="默认退订原因说明：" prop="refundReasonDefault">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundReasonDefault"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否允许修改退订原因：" prop="refundReasonChanged">
                  <el-select
                    placeholder="请选择"
                    v-model="form.refundReasonChanged"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in yes_no_enum"
                      :key="Number(item.code)"
                      :label="item.message"
                      :value="Number(item.code)"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item v-show="form.cateCode === '1210'" label="超时订单自动审核通过：" prop="expireOrderAutoPass">
                  <el-select
                    placeholder="请选择"
                    v-model="form.expireOrderAutoPass"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in yes_no_enum"
                      :key="Number(item.code)"
                      :label="item.message"
                      :value="Number(item.code)"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="form.cateCode === '1210'"
                  label="超时订单时间设置："
                  prop="expireOrderTime"
                  :rules="form.expireOrderAutoPass === 1 ? rules.expireOrderTime: []"
                >
                  <div>
                    <span>【缴定金时间】距离当前超过 </span>
                    <el-input
                      type="number"
                      min="1"
                      max="999"
                      placeholder="请输入"
                      v-model="form.expireOrderTime"
                      clearable
                    />
                    <span>个月可自动审核通过</span>
                  </div>

                </el-form-item>
              </el-form>
              <el-form label-width="180px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="原因分类代码：" prop="cateCode">
                  {{ form.cateCode }}
                </el-form-item>
                <el-form-item label="退订原因分类：" prop="cateName">
                  {{ form.cateName }}
                </el-form-item>
                <el-form-item label="下拉是否展示：" prop="selectorDisplayLabel">
                  {{ form.selectorDisplayLabel }}
                </el-form-item>
                <el-form-item label="原路退回允许选择：" prop="originalRefundLabel">
                  {{ form.originalRefundLabel }}
                </el-form-item>
                <el-form-item label="是否需要初审：" prop="preApprovalLabel">
                  {{ form.preApprovalLabel }}
                </el-form-item>
                <el-form-item label="是否需要终审：" prop="finalApprovalLabel">
                  {{ form.finalApprovalLabel }}
                </el-form-item>
                <el-form-item label="默认定金退回方式：" prop="refundTypeDefault">
                  {{ form.refundTypeDefault }}
                </el-form-item>
                <el-form-item label="退还方式是否允许选择：" prop="refundTypeSelectLabel">
                  {{ form.refundTypeSelectLabel }}
                </el-form-item>
                <el-form-item label="退订附件上传要求：" prop="refundAttachRequired">
                  {{ form.refundAttachRequired }}
                </el-form-item>
                <el-form-item label="默认退订原因说明：" prop="refundReasonDefault">
                  {{ form.refundReasonDefault }}
                </el-form-item>
                <el-form-item label="是否允许修改退订原因：" prop="refundReasonChangedLabel">
                  {{ form.refundReasonChangedLabel }}
                </el-form-item>
                <el-form-item v-if="form.cateCode === '1210'" label="超时订单自动审核通过：" prop="expireOrderAutoPassLabel">
                  {{ form.expireOrderAutoPassLabel }}
                </el-form-item>
                <el-form-item v-if="form.cateCode === '1210'" label="超时订单时间设置：" prop="expireOrderTime">
                  {{ '【缴定金时间】距离当前超过 ' + form.expireOrderTime + ' 个月可自动审核通过' }}
                </el-form-item>
<!--                <el-form-item label="主键：" prop="id">-->
<!--                  {{ form.id }}-->
<!--                </el-form-item>-->
<!--                <el-form-item label="创建者：" prop="creator">-->
<!--                  {{ form.creator }}-->
<!--                </el-form-item>-->
<!--                <el-form-item label="创建者名称：" prop="creatorName">-->
<!--                  {{ form.creatorName }}-->
<!--                </el-form-item>-->
<!--                <el-form-item label="创建时间：" prop="createTime">-->
<!--                  {{ form.createTime }}-->
<!--                </el-form-item>-->
<!--                <el-form-item label="修改者：" prop="modifier">-->
<!--                  {{ form.modifier }}-->
<!--                </el-form-item>-->
<!--                <el-form-item label="修改者名称：" prop="modifierName">-->
<!--                  {{ form.modifierName }}-->
<!--                </el-form-item>-->
<!--                <el-form-item label="修改时间：" prop="updateTime">-->
<!--                  {{ form.updateTime }}-->
<!--                </el-form-item>-->
<!--                <el-form-item label="备注：" prop="remark">-->
<!--                  {{ form.remark }}-->
<!--                </el-form-item>-->
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
import { addOrUpdate, getDetail } from '@/api/vehretail/orderRefund/category';
import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: null,
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  cateCode: '',
  cateName: '',
  selectorDisplay: '',
  originalRefund: '',
  preApproval: '',
  finalApproval: '',
  refundTypeDefault: '',
  refundTypeSelect: '',
  refundAttachRequired: '',
  refundReasonDefault: '',
  refundReasonChanged: '',
  expireOrderAutoPass: '',
  expireOrderTime: '',
};

export default {
  name: 'orderRefundCategoryEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
    // EditTable,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true,
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '退订原因分类',
      pageType: 'edit',
      title: '主键：' + form.id,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVR-orderRefundCategory',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        {
          id: 1,
          name: '张三',
          age: 25,
          email: 'zhangsan@example.com',
        },
        {
          id: 2,
          name: '李四',
          age: 30,
          email: 'lisi@example.com',
        },
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      pannelTitle: '',
      rules: {
        id: [
          {
            required: false,
            message: '请输入主键',
            trigger: 'change',
          },
        ],
        creator: [
          {
            required: false,
            message: '请输入创建者',
            trigger: 'change',
          },
        ],
        creatorName: [
          {
            required: false,
            message: '请输入创建者名称',
            trigger: 'change',
          },
        ],
        createTime: [
          {
            required: false,
            message: '请选择创建时间',
            trigger: 'change',
          },
        ],
        modifier: [
          {
            required: false,
            message: '请输入修改者',
            trigger: 'change',
          },
        ],
        modifierName: [
          {
            required: false,
            message: '请输入修改者名称',
            trigger: 'change',
          },
        ],
        updateTime: [
          {
            required: false,
            message: '请选择修改时间',
            trigger: 'change',
          },
        ],
        remark: [
          {
            required: false,
            message: '请输入备注',
            trigger: 'change',
          },
        ],
        cateCode: [
          {
            required: false,
            message: '请输入原因分类代码',
            trigger: 'change',
          },
        ],
        cateName: [
          {
            required: true,
            message: '请输入退订原因分类',
            trigger: 'change',
          },
        ],
        selectorDisplay: [
          {
            required: false,
            message: '请输入下拉是否展示',
            trigger: 'change',
          },
        ],
        originalRefund: [
          {
            required: false,
            message: '请输入原路退回允许选择',
            trigger: 'change',
          },
        ],
        preApproval: [
          {
            required: false,
            message: '请输入是否需要初审',
            trigger: 'change',
          },
        ],
        finalApproval: [
          {
            required: false,
            message: '请输入是否需要终审',
            trigger: 'change',
          },
        ],
        refundTypeDefault: [
          {
            required: false,
            message: '请选择默认定金退回方式',
            trigger: 'change',
          },
        ],
        refundTypeSelect: [
          {
            required: false,
            message: '请选择退还方式是否允许选择',
            trigger: 'change',
          },
        ],
        refundAttachRequired: [
          {
            required: false,
            message: '请输入退订附件上传要求',
            trigger: 'change',
          },
        ],
        refundReasonDefault: [
          {
            required: false,
            message: '请输入默认退订原因说明',
            trigger: 'change',
          },
        ],
        refundReasonChanged: [
          {
            required: false,
            message: '请输入是否允许修改退订原因',
            trigger: 'change',
          },
        ],
        expireOrderAutoPass: [
          {
            required: false,
            message: '请输入超时订单自动审核通过',
            trigger: 'change',
          },
        ],
        expireOrderTime: [
          {
            required: true,
            message: '请选择超时订单时间设置 单位月',
            trigger: 'change',
          },
        ],
      },
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
        ...defaultForm,
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
  },
};
</script>
