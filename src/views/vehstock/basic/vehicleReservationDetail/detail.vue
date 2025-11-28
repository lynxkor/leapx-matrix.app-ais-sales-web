<template>
  <div class="page-common-detail m-vehicle-reservation-detail-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>车辆预留编号：{{ info.code }}</h2>
        <el-button size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="车辆预留编号：" prop="code">
              {{ info.code  }}
            </el-form-item>
            <el-form-item label="业务编号：" prop="bizCode">
              {{ info.bizCode  }}
            </el-form-item>
            <el-form-item label="VIN：" prop="vin">
              {{ info.vin  }}
            </el-form-item>
            <el-form-item label="预留时间：" prop="reserveTime">
              {{ info.reserveTime  }}
            </el-form-item>
            <el-form-item label="需预留数：" prop="reserveNum">
              {{ info.reserveNum  }}
            </el-form-item>
            <el-form-item label="已预留数：" prop="reservedNum">
              {{ info.reservedNum  }}
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
import { getDetail } from '@/api/vehstock/basic/vehicleReservationDetail/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
export default {
  name: 'vehicleReservationDetailDetail',
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
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['车辆预留明细', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/vehstock/basic/vehicleReservationDetail/edit',
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
