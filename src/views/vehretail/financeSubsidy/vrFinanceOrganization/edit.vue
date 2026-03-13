<template>
  <edit-base-container
    :id="_id"
    :title="title"
    :isEditing.sync="isEditing"
    :form.sync="form"
    :submitRequest="submitRequest"
    :detailRequest="detailRequest"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      size="small"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="金融机构名称" prop="financeOrganizationName">
            <el-input
              v-model="form.financeOrganizationName"
              placeholder="请输入金融机构名称"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="金融机构编码" prop="code">
            <el-input
              v-model="form.code"
              placeholder="请输入金融机构编码"
              maxlength="50"
              :disabled="_id"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据来源" prop="dataSource">
            <fetch-select
              :request="fetchOptions"
              enumCode="dataSourceEnum"
              v-model="form.dataSource"
              placeholder="请选择数据来源"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <fetch-select
              :request="fetchOptions"
              enumCode="common_status_enum"
              v-model="form.status"
              placeholder="请选择状态"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="4"
              placeholder="请输入备注"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </edit-base-container>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/vehretail/financeSubsidy/vrFinanceOrganization/index';
import { getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';

export default {
  components: {
    FetchSelect
  },
  data() {
    return {
      _id: this.$route.query.id,
      isEditing: this.$route.query.isEditing === 'true',
      title: this.$route.query.id ? '编辑金融机构' : '新增金融机构',
      form: {
        financeOrganizationName: '',
        code: '',
        dataSource: '',
        status: 1, // 默认启用
        remark: ''
      },
      rules: {
        financeOrganizationName: [
          { required: true, message: '请输入金融机构名称', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入金融机构编码', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    submitRequest() {
      return addOrUpdate;
    },
    detailRequest() {
      return getDetail;
    }
  },
  methods: {
    async fetchOptions(code) {
      if (code) {
        return getEnum(code);
      }
      return [];
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
