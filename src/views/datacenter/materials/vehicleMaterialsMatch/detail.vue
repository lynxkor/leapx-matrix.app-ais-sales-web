<template>
  <div class="page-common-detail m-vehicle-materials-match-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>物料编码：{{ info.materialsCode || '' }}</h2>
        <el-button size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="物料编码：" prop="materialsCode">
              {{ info.materialsCode || ''  }}
            </el-form-item>
            <el-form-item label="物料名称：" prop="materialsDesc">
              {{ info.materialsCode || ''  }}
            </el-form-item>
            <el-form-item label="车系：" prop="materialsCode">
              {{ info.materialsCode || ''  }}
            </el-form-item>
            <el-form-item label="车型：" prop="materialsCode">
              {{ info.materialsCode || ''  }}
            </el-form-item>
            <el-form-item label="年款：" prop="materialsCode">
              {{ info.materialsCode || ''  }}
            </el-form-item>
            <el-form-item label="外观：" prop="materialsCode">
              {{ info.materialsCode || ''  }}
            </el-form-item>
            <el-form-item label="内饰：" prop="materialsCode">
              {{ info.materialsCode || ''  }}
            </el-form-item>
            <el-form-item label="车顶：" prop="materialsCode">
              {{ info.materialsCode || ''  }}
            </el-form-item>
            <el-form-item label="轮毂：" prop="materialsCode">
              {{ info.materialsCode || ''  }}
            </el-form-item>
            <el-form-item label="选装包：" prop="materialsCode">
              {{ info.materialsCode || ''  }}
            </el-form-item>
            <el-form-item label="电池电芯：" prop="materialsCode">
              {{ info.materialsCode || ''  }}
            </el-form-item>

          </el-form>
        </div>
      </section>

      <section class="common-section">
        <div class="common-section-header">
          <h2>可配物料信息</h2>
        </div>
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" inline>
          <el-form-item label="可配物料编码：" prop="matchMaterialsCode">
            {{ info.matchMaterialsCode  }}
          </el-form-item>

          <el-form-item label="车系：" prop="materialsCode">
            {{ info.materialsCode || ''  }}
          </el-form-item>
          <el-form-item label="内饰：" prop="materialsCode">
            {{ info.materialsCode || ''  }}
          </el-form-item>
          <el-form-item label="外观：" prop="materialsCode">
            {{ info.materialsCode || ''  }}
          </el-form-item>
          <el-form-item label="年款：" prop="materialsCode">
            {{ info.materialsCode || ''  }}
          </el-form-item>
          <el-form-item label="电池电芯：" prop="materialsCode">
            {{ info.materialsCode || ''  }}
          </el-form-item>

          <el-form-item label="可配物料名称：" prop="matchmaterialsCode">
            {{ info.matchmaterialsCode  }}
          </el-form-item>

          <el-form-item label="车型：" prop="materialsCode">
            {{ info.materialsCode || ''  }}
          </el-form-item>
          <el-form-item label="轮毂：" prop="materialsCode">
            {{ info.materialsCode || ''  }}
          </el-form-item>
          <el-form-item label="选装包：" prop="materialsCode">
            {{ info.materialsCode || ''  }}
          </el-form-item>
          <el-form-item label="电池电芯：" prop="materialsCode">
            {{ info.materialsCode || ''  }}
          </el-form-item>

        </el-form>
      </section>

      <section class="common-section">
        <div class="common-section-header">
          <h2>属性信息</h2>
        </div>
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" inline>
          <el-form-item label="状态：" prop="status">
            {{ info.status || ''  }}
          </el-form-item>
        </el-form>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/datacenter/materials/vehicleMaterialsMatch/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
export default {
  name: 'vehicleMaterialsMatchDetail',
  components: {
  },
  data () {
    return {
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车主数据-物料配车关系管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/datacenter/materials/vehicleMaterialsMatch/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
