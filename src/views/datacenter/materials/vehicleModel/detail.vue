<template>
  <div class="page-common-detail m-vehicle-model-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>车型名称：{{ info.modelName }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="车型名称：" prop="modelName">
              {{ info.modelName  }}
            </el-form-item>
            <!-- <el-form-item label="年型名称：" prop="yearTypeName">
              {{ info.yearTypeName  }}
            </el-form-item> -->
            <el-form-item label="车系名称：" prop="seriesName">
              <el-link type="primary" :href="`/datacenter/materials/vehicleSeries/detail?id=${info.seriesId}`" target="_blank">{{ info.seriesName }}</el-link>
            </el-form-item>
            <el-form-item label="系列名称：" prop="modelLineName">
              <el-link type="primary" :href="`/datacenter/materials/vehicleModelLine/detail?id=${info.modelLineId}`" target="_blank">{{ info.modelLineName }}</el-link>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.statusLabel  }}
            </el-form-item>
            <!-- <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item> -->
            <el-form-item label="创建人：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <!-- <el-form-item label="修改者名称：" prop="modifierName">
              {{ info.modifierName  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="主键：" prop="id">
              {{ info.id  }}
            </el-form-item>
            <el-form-item label="创建者：" prop="creator">
              {{ info.creator  }}
            </el-form-item>
            <el-form-item label="修改者：" prop="modifier">
              {{ info.modifier  }}
            </el-form-item>
            <el-form-item label="车系ID：" prop="seriesId">
              {{ info.seriesId  }}
            </el-form-item>
            <el-form-item label="系列ID：" prop="modelLineId">
              {{ info.modelLineId  }}
            </el-form-item>
            <el-form-item label="年型ID：" prop="yearTypeId">
              {{ info.yearTypeId  }}
            </el-form-item>
            <el-form-item label="年款-车型-关系列表：" prop="modelYearTypeRelations">
              {{ info.modelYearTypeRelations  }}
            </el-form-item> -->
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <!-- TIPS: 根据实际情况修改标题 -->
          <h2>年款信息</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-table">
            <edit-table
              ref="editTable"
              :columns="columns"
              :data="modelYearTypeRelations"
              :show-toolbar="false"
            />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/datacenter/materials/vehicleModel/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'vehicleModelDetail',
  mixins: [permissions],
  components: {
    EditTable
  },
  data () {
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISDC-vehicleModel',
      loading: true,
      info: {},
      modelYearTypeRelations: [],
      columns: [
        // TIPS: 根据实际情况修改字段名field和width
        {
          field: 'yearTypeName',
          title: '年款名称',
          width: '33%',
        },
        {
          field: 'creatorName',
          title: '创建人',
          width: '33%',
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '33%',
        },
      ],
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['车型', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/datacenter/materials/vehicleModel/edit',
        query: {
          id: this.$route.query.id,
          isEditing: true
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
        this.modelYearTypeRelations = res.modelYearTypeRelations || []; // TIPS: 根据实际情况修改表格数据res.list的取值
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
