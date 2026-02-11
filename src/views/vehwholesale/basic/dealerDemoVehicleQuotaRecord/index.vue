<template>
  <div class="page-common m-dealer-demo-vehicle-quota-record-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <template v-if="show">
      </template>
    </el-form>
    <div class="ais-actions">
    </div>
    <div
      class="ais-table-c"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="1"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import { getList } from '@/api/vehwholesale/basic/dealerDemoVehicleQuotaRecord/index';
import { getTableConfig, getEnum } from '@/api/common';
// import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    LPVxeTable,
    // FetchSelect,
    Upload
  },
  computed: {
    relatedId () {
      return this.$route.query.id;
    }
  },
  data () {
    return {
      pageTitle: '门店试驾车配额调整记录管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISVW-dealerDemoVehicleQuotaRecord',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: true,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      optionObj: {
        id: 'dealerDemoVehicleQuotaRecordTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'changeBeforeQty',
            label: '变化前数量',
            visible: true,
            width: 200,
          },
          { props: 'changeAfterQty', label: '变化后数量', visible: true, width: 200 },
          { props: 'changeQty', label: '变化数量', visible: true, width: 200 },
          { props: 'changeTime', label: '变化时间', visible: true, width: 200 },
          { props: 'logDataSourceLabel', label: '数据来源', visible: true, width: 200 },
          { props: 'relatedFormCode', label: '相关单号', visible: true, width: 200 },
          { props: 'changeDesc', label: '调整说明', visible: true, width: 200 },
          { props: 'changeDescFileId', label: '附件调整说明', visible: true, width: 200 },
          { props: 'responsibleName', label: '负责人', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/vehwholesale/basic/dealerDemoVehicleQuotaRecord/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.getData();
    },
    // exportExcel () {
    //   this.exportLoading = true;
    //   exportTable({
    //     businessType: '门店试驾车配额调整记录管理',
    //     dataFetchPath: 'vehwholesale/web/basic/dealerDemoVehicleQuotaRecord/page',
    //     reqParams: this.getFormData(),
    //     titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
    //     httpMethod: 'POST'
    //   }).then(async res => {
    //     if (res && res.excelUrl) {
    //       try {
    //         await downloadExcel(res.excelUrl, '门店试驾车配额调整记录管理.xlsx');
    //       } catch (error) {
    //         this.$message({
    //           type: 'error',
    //           message: '文件导出失败'
    //         });
    //       }
    //     } else {
    //       this.$message({
    //         type: 'info',
    //         message: '请前往导出列表中查询导出结果'
    //       });
    //     }
    //   }).finally(() => {
    //     this.exportLoading = false;
    //   });
    // },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },

    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      data.relatedId = this.relatedId;

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }

      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>

<style lang="scss" scoped>
.m-dealer-demo-vehicle-quota-record-list {
}
</style>
