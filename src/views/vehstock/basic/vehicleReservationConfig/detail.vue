<template>
  <div class="page-common-detail m-vehicle-reservation-config-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>主键：{{ info.id }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="车辆预留编号：" prop="code">
              {{ info.code  }}
            </el-form-item>
            <el-form-item label="类型：" prop="type">
              {{ info.typeLabel  }}
            </el-form-item>
            <el-form-item label="业务编号：" prop="bizCode">
              {{ info.bizCode  }}
            </el-form-item>
            <el-form-item label="需预留数：" prop="reserveNum">
              {{ info.reserveNum  }}
            </el-form-item>
            <el-form-item label="已预留数：" prop="reservedNum">
              {{ info.reservedNum  }}
            </el-form-item>
            <el-form-item label="是否映射其他物料：" prop="isRelatedMatch">
              {{ info.isRelatedMatchLabel  }}
            </el-form-item>
            <el-form-item label="截取预留起始位：" prop="reserveStartPos">
              {{ info.reserveStartPos  }}
            </el-form-item>
            <el-form-item label="截取预留截止位：" prop="reserveEndPos">
              {{ info.reserveEndPos  }}
            </el-form-item>
            <el-form-item label="截取预留值：" prop="reserveCutValue">
              {{ info.reserveCutValue  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.statusLabel  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehstock/basic/vehicleReservationConfig/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'vehicleReservationConfigDetail',
  components: {
  },
  mixins: [permissions],
  data () {
    return {
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP,
      moduleKey: 'AISVS-vehicleReservationConfig'
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['车辆预留配置', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehstock/basic/vehicleReservationConfig/edit',
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
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
