import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './../store';
import { logout } from '@/libs/api/common';

const routerPush = VueRouter.prototype.push;
// 修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error);
};
if (!window.VueRouter) Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      isNew: true
    },
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/404',
    name: '404',
    meta: {
      name: '404',
      requiresAuth: false,
      noResourceUrl: true
    },
    component: () => import('@/views/404.vue')
  },
  {
    path: '/',
    name: 'index',
    // component: Layout,
    component: () => import('@/views/layout/index.vue'),
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        name: '首页'
      },
      component: () => import('@/views/home.vue')
    }, {
      path: '/',
      redirect: '/home',
      name: 'index',
      component: () => import('@/views/home.vue')
    }, {
      path: '/vehstock/basic/regionNoticeDirectory',
      name: 'regionNoticeDirectory',
      component: () => import('@/views/vehstock/basic/regionNoticeDirectory/index.vue'),

      meta: {
        name: '地区对应公告目录',
        keepAlive: true
      }
    }, {
      path: '/vehstock/basic/regionNoticeDirectory/detail',
      name: 'regionNoticeDirectoryDetail',
      component: () => import('@/views/vehstock/basic/regionNoticeDirectory/detail.vue'),

      meta: {
        name: '地区对应公告目录详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/basic/regionNoticeDirectory/edit',
      name: 'regionNoticeDirectoryEdit',
      component: () => import('@/views/vehstock/basic/regionNoticeDirectory/edit.vue'),

      meta: {
        name: '地区对应公告目录详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/basic/vehicleInventoryStock',
      name: 'vehicleInventoryStock',
      component: () => import('@/views/vehstock/basic/vehicleInventoryStock/index.vue'),

      meta: {
        name: '整车库存存量定义',
        keepAlive: true
      }
    }, {
      path: '/vehstock/basic/vehicleInventoryStock/detail',
      name: 'vehicleInventoryStockDetail',
      component: () => import('@/views/vehstock/basic/vehicleInventoryStock/detail.vue'),

      meta: {
        name: '整车库存存量定义详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/basic/vehicleInventoryStock/edit',
      name: 'vehicleInventoryStockEdit',
      component: () => import('@/views/vehstock/basic/vehicleInventoryStock/edit.vue'),

      meta: {
        name: '整车库存存量定义详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/basic/vehicleReservationConfig',
      name: 'vehicleReservationConfig',
      component: () => import('@/views/vehstock/basic/vehicleReservationConfig/index.vue'),

      meta: {
        name: '车辆预留配置',
        keepAlive: true
      }
    }, {
      path: '/vehstock/basic/vehicleReservationConfig/detail',
      name: 'vehicleReservationConfigDetail',
      component: () => import('@/views/vehstock/basic/vehicleReservationConfig/detail.vue'),

      meta: {
        name: '车辆预留配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/basic/vehicleReservationConfig/edit',
      name: 'vehicleReservationConfigEdit',
      component: () => import('@/views/vehstock/basic/vehicleReservationConfig/edit.vue'),

      meta: {
        name: '车辆预留配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/risktask/riskCheckTask',
      name: 'riskCheckTask',
      component: () => import('@/views/vehstock/risktask/riskCheckTask/index.vue'),

      meta: {
        name: '车辆排查任务',
        keepAlive: true
      }
    }, {
      path: '/vehstock/risktask/riskCheckTask/edit',
      name: 'riskCheckTaskEdit',
      component: () => import('@/views/vehstock/risktask/riskCheckTask/edit.vue'),

      meta: {
        name: '车辆排查任务详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/risktask/riskCheckTask/detail',
      name: 'riskCheckTaskDetail',
      component: () => import('@/views/vehstock/risktask/riskCheckTask/detail.vue'),

      meta: {
        name: '车辆排查清单',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/risktask/riskCheckTask/audit',
      name: 'riskCheckTaskAudit',
      component: () => import('@/views/vehstock/risktask/riskCheckTask/audit.vue'),

      meta: {
        name: '车辆排查任务审核',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/risktask/riskCheckTask/auditDetail',
      name: 'riskCheckTaskAuditDetail',
      component: () => import('@/views/vehstock/risktask/riskCheckTask/auditDetail.vue'),

      meta: {
        name: '排查任务审核详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/risktask/riskCheckAudit',
      name: 'riskCheckAudit',
      component: () => import('@/views/vehstock/risktask/riskCheckAudit/index.vue'),

      meta: {
        name: '排查任务审核',
        keepAlive: true
      }
    }, {
      path: '/vehstock/basic/vehicleReservationDetail',
      name: 'vehicleReservationDetail',
      component: () => import('@/views/vehstock/basic/vehicleReservationDetail/index.vue'),

      meta: {
        name: '车辆预留明细',
        keepAlive: true
      }
    }, {
      path: '/vehstock/basic/vehicleReservationDetail/detail',
      name: 'vehicleReservationDetailDetail',
      component: () => import('@/views/vehstock/basic/vehicleReservationDetail/detail.vue'),

      meta: {
        name: '车辆预留明细详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/basic/warehouseVehicleRelation',
      name: 'warehouseVehicleRelation',
      component: () => import('@/views/vehstock/basic/warehouseVehicleRelation/index.vue'),

      meta: {
        name: '仓库配车关系',
        keepAlive: true
      }
    }, {
      path: '/vehstock/basic/warehouseVehicleRelation/detail',
      name: 'warehouseVehicleRelationDetail',
      component: () => import('@/views/vehstock/basic/warehouseVehicleRelation/detail.vue'),

      meta: {
        name: '仓库配车关系详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/basic/warehouseVehicleRelation/edit',
      name: 'warehouseVehicleRelationEdit',
      component: () => import('@/views/vehstock/basic/warehouseVehicleRelation/edit.vue'),

      meta: {
        name: '仓库配车关系详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleBrand',
      name: 'vehicleBrand',
      component: () => import('@/views/datacenter/materials/vehicleBrand/index.vue'),

      meta: {
        name: '整车主数据-品牌管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleBrand/detail',
      name: 'vehicleBrandDetail',
      component: () => import('@/views/datacenter/materials/vehicleBrand/detail.vue'),

      meta: {
        name: '整车主数据-品牌管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleBrand/edit',
      name: 'vehicleBrandEdit',
      component: () => import('@/views/datacenter/materials/vehicleBrand/edit.vue'),

      meta: {
        name: '整车主数据-品牌管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleModelLine',
      name: 'vehicleModelLine',
      component: () => import('@/views/datacenter/materials/vehicleModelLine/index.vue'),

      meta: {
        name: '整车主数据-系列管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleModelLine/detail',
      name: 'vehicleModelLineDetail',
      component: () => import('@/views/datacenter/materials/vehicleModelLine/detail.vue'),

      meta: {
        name: '整车主数据-系列管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleModelLine/edit',
      name: 'vehicleModelLineEdit',
      component: () => import('@/views/datacenter/materials/vehicleModelLine/edit.vue'),

      meta: {
        name: '整车主数据-系列管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleOptionPackage',
      name: 'vehicleOptionPackage',
      component: () => import('@/views/datacenter/materials/vehicleOptionPackage/index.vue'),

      meta: {
        name: '整车主数据-选装包管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleOptionPackage/detail',
      name: 'vehicleOptionPackageDetail',
      component: () => import('@/views/datacenter/materials/vehicleOptionPackage/detail.vue'),

      meta: {
        name: '整车主数据-选装包管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleOptionPackage/edit',
      name: 'vehicleOptionPackageEdit',
      component: () => import('@/views/datacenter/materials/vehicleOptionPackage/edit.vue'),

      meta: {
        name: '整车主数据-选装包管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleRegisteredModel',
      name: 'vehicleRegisteredModel',
      component: () => import('@/views/datacenter/materials/vehicleRegisteredModel/index.vue'),

      meta: {
        name: '整车主数据-公告车型管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleRegisteredModel/detail',
      name: 'vehicleRegisteredModelDetail',
      component: () => import('@/views/datacenter/materials/vehicleRegisteredModel/detail.vue'),

      meta: {
        name: '整车主数据-公告车型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleRegisteredModel/edit',
      name: 'vehicleRegisteredModelEdit',
      component: () => import('@/views/datacenter/materials/vehicleRegisteredModel/edit.vue'),

      meta: {
        name: '整车主数据-公告车型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleRoof',
      name: 'vehicleRoof',
      component: () => import('@/views/datacenter/materials/vehicleRoof/index.vue'),

      meta: {
        name: '整车主数据-车顶管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleRoof/detail',
      name: 'vehicleRoofDetail',
      component: () => import('@/views/datacenter/materials/vehicleRoof/detail.vue'),

      meta: {
        name: '整车主数据-车顶管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleRoof/edit',
      name: 'vehicleRoofEdit',
      component: () => import('@/views/datacenter/materials/vehicleRoof/edit.vue'),

      meta: {
        name: '整车主数据-车顶管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleBatteryCell',
      name: 'vehicleBatteryCell',
      component: () => import('@/views/datacenter/materials/vehicleBatteryCell/index.vue'),

      meta: {
        name: '整车主数据-电池电芯管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleBatteryCell/detail',
      name: 'vehicleBatteryCellDetail',
      component: () => import('@/views/datacenter/materials/vehicleBatteryCell/detail.vue'),

      meta: {
        name: '整车主数据-电池电芯管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleBatteryCell/edit',
      name: 'vehicleBatteryCellEdit',
      component: () => import('@/views/datacenter/materials/vehicleBatteryCell/edit.vue'),

      meta: {
        name: '整车主数据-电池电芯管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleYearType',
      name: 'vehicleYearType',
      component: () => import('@/views/datacenter/materials/vehicleYearType/index.vue'),

      meta: {
        name: '整车主数据-年款管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleYearType/detail',
      name: 'vehicleYearTypeDetail',
      component: () => import('@/views/datacenter/materials/vehicleYearType/detail.vue'),

      meta: {
        name: '整车主数据-年款管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleYearType/edit',
      name: 'vehicleYearTypeEdit',
      component: () => import('@/views/datacenter/materials/vehicleYearType/edit.vue'),

      meta: {
        name: '整车主数据-年款管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleRangePower',
      name: 'vehicleRangePower',
      component: () => import('@/views/datacenter/materials/vehicleRangePower/index.vue'),

      meta: {
        name: '整车主数据-续配动力管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleRangePower/detail',
      name: 'vehicleRangePowerDetail',
      component: () => import('@/views/datacenter/materials/vehicleRangePower/detail.vue'),

      meta: {
        name: '整车主数据-续配动力管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleRangePower/edit',
      name: 'vehicleRangePowerEdit',
      component: () => import('@/views/datacenter/materials/vehicleRangePower/edit.vue'),

      meta: {
        name: '整车主数据-续配动力管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleWheelHub',
      name: 'vehicleWheelHub',
      component: () => import('@/views/datacenter/materials/vehicleWheelHub/index.vue'),

      meta: {
        name: '整车主数据-轮毂管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleWheelHub/detail',
      name: 'vehicleWheelHubDetail',
      component: () => import('@/views/datacenter/materials/vehicleWheelHub/detail.vue'),

      meta: {
        name: '整车主数据-轮毂管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleWheelHub/edit',
      name: 'vehicleWheelHubEdit',
      component: () => import('@/views/datacenter/materials/vehicleWheelHub/edit.vue'),

      meta: {
        name: '整车主数据-轮毂管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleExterior',
      name: 'vehicleExterior',
      component: () => import('@/views/datacenter/materials/vehicleExterior/index.vue'),

      meta: {
        name: '整车主数据-外观管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleExterior/detail',
      name: 'vehicleExteriorDetail',
      component: () => import('@/views/datacenter/materials/vehicleExterior/detail.vue'),

      meta: {
        name: '整车主数据-外观管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleExterior/edit',
      name: 'vehicleExteriorEdit',
      component: () => import('@/views/datacenter/materials/vehicleExterior/edit.vue'),

      meta: {
        name: '整车主数据-外观管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleInterior',
      name: 'vehicleInterior',
      component: () => import('@/views/datacenter/materials/vehicleInterior/index.vue'),

      meta: {
        name: '整车主数据-内饰管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleInterior/detail',
      name: 'vehicleInteriorDetail',
      component: () => import('@/views/datacenter/materials/vehicleInterior/detail.vue'),

      meta: {
        name: '整车主数据-内饰管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleInterior/edit',
      name: 'vehicleInteriorEdit',
      component: () => import('@/views/datacenter/materials/vehicleInterior/edit.vue'),

      meta: {
        name: '整车主数据-内饰管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleDrivingRange',
      name: 'vehicleDrivingRange',
      component: () => import('@/views/datacenter/materials/vehicleDrivingRange/index.vue'),

      meta: {
        name: '整车主数据-续航里程管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleDrivingRange/detail',
      name: 'vehicleDrivingRangeDetail',
      component: () => import('@/views/datacenter/materials/vehicleDrivingRange/detail.vue'),

      meta: {
        name: '整车主数据-续航里程管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleDrivingRange/edit',
      name: 'vehicleDrivingRangeEdit',
      component: () => import('@/views/datacenter/materials/vehicleDrivingRange/edit.vue'),

      meta: {
        name: '整车主数据-续航里程管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleMaterials',
      name: 'vehicleMaterials',
      component: () => import('@/views/datacenter/materials/vehicleMaterials/index.vue'),

      meta: {
        name: '整车主数据-整车物料管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleMaterials/detail',
      name: 'vehicleMaterialsDetail',
      component: () => import('@/views/datacenter/materials/vehicleMaterials/detail.vue'),

      meta: {
        name: '整车主数据-整车物料管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleMaterials/edit',
      name: 'vehicleMaterialsEdit',
      component: () => import('@/views/datacenter/materials/vehicleMaterials/edit.vue'),

      meta: {
        name: '整车主数据-整车物料管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleMaterialsMatch',
      name: 'vehicleMaterialsMatch',
      component: () => import('@/views/datacenter/materials/vehicleMaterialsMatch/index.vue'),

      meta: {
        name: '整车主数据-物料可配关系管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleMaterialsMatch/detail',
      name: 'vehicleMaterialsMatchDetail',
      component: () => import('@/views/datacenter/materials/vehicleMaterialsMatch/detail.vue'),

      meta: {
        name: '整车主数据-物料可配关系管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleMaterialsMatch/edit',
      name: 'vehicleMaterialsMatchEdit',
      component: () => import('@/views/datacenter/materials/vehicleMaterialsMatch/edit.vue'),

      meta: {
        name: '整车主数据-物料可配关系管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/salesParameterConfig',
      name: 'salesParameterConfig',
      component: () => import('@/views/datacenter/materials/salesParameterConfig/index.vue'),
      meta: {
        name: '整车主数据-销售参数配置',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleSeries',
      name: 'vehicleSeries',
      component: () => import('@/views/datacenter/materials/vehicleSeries/index.vue'),

      meta: {
        name: '整车主数据-车系管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleSeries/detail',
      name: 'vehicleSeriesDetail',
      component: () => import('@/views/datacenter/materials/vehicleSeries/detail.vue'),

      meta: {
        name: '整车主数据-车系管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleSeries/edit',
      name: 'vehicleSeriesEdit',
      component: () => import('@/views/datacenter/materials/vehicleSeries/edit.vue'),

      meta: {
        name: '整车主数据-车系管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleModel',
      name: 'vehicleModel',
      component: () => import('@/views/datacenter/materials/vehicleModel/index.vue'),

      meta: {
        name: '整车主数据-车型管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/materials/vehicleModel/detail',
      name: 'vehicleModelDetail',
      component: () => import('@/views/datacenter/materials/vehicleModel/detail.vue'),

      meta: {
        name: '整车主数据-车型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleModel/edit',
      name: 'vehicleModelEdit',
      component: () => import('@/views/datacenter/materials/vehicleModel/edit.vue'),

      meta: {
        name: '整车主数据-车型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleModel/edit',
      name: 'vehicleModelEdit',
      component: () => import('@/views/datacenter/materials/vehicleModel/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/dealerFundAccount',
      name: 'dealerFundAccount',
      component: () => import('@/views/vehwholesale/fund/dealerFundAccount/index.vue'),

      meta: {
        name: '账户管理-整车资金-整车资金账户管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/fund/dealerFundAccount/detail',
      name: 'dealerFundAccountDetail',
      component: () => import('@/views/vehwholesale/fund/dealerFundAccount/detail.vue'),

      meta: {
        name: '账户管理-整车资金-整车资金账户管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/dealerFundAccount/edit',
      name: 'accountEdit',
      component: () => import('@/views/vehwholesale/fund/dealerFundAccount/edit.vue'),

      meta: {
        name: '账户管理-整车资金-整车资金账户管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/dealerFundAccountTransLog',
      name: 'dealerFundAccountTransLog',
      component: () => import('@/views/vehwholesale/fund/dealerFundAccountTransLog/index.vue'),

      meta: {
        name: '账户管理-整车资金-整车资金账户交易流水管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/fund/dealerFundAccountTransLog/detail',
      name: 'accountTranslogDetail',
      component: () => import('@/views/vehwholesale/fund/dealerFundAccountTransLog/detail.vue'),

      meta: {
        name: '账户管理-整车资金-整车资金账户交易流水管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/dealerFundAccountTransLog/edit',
      name: 'accountTranslogEdit',
      component: () => import('@/views/vehwholesale/fund/dealerFundAccountTransLog/edit.vue'),

      meta: {
        name: '账户管理-整车资金-整车资金账户交易流水管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundBudgetItem',
      name: 'fundBudgetItem',
      component: () => import('@/views/vehwholesale/fund/fundBudgetItem/index.vue'),

      meta: {
        name: '账户管理-基础配置-预算科目管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/fund/fundBudgetItem/detail',
      name: 'fundBudgetItemDetail',
      component: () => import('@/views/vehwholesale/fund/fundBudgetItem/detail.vue'),

      meta: {
        name: '账户管理-基础配置-预算科目管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundBudgetItem/edit',
      name: 'fundBudgetItemEdit',
      component: () => import('@/views/vehwholesale/fund/fundBudgetItem/edit.vue'),

      meta: {
        name: '账户管理-基础配置-预算科目管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundFeeSupportType',
      name: 'fundFeeSupportType',
      component: () => import('@/views/vehwholesale/fund/fundFeeSupportType/index.vue'),

      meta: {
        name: '账户管理-基础配置-费用支持类型管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/fund/fundFeeSupportType/detail',
      name: 'fundFeeSupportTypeDetail',
      component: () => import('@/views/vehwholesale/fund/fundFeeSupportType/detail.vue'),

      meta: {
        name: '账户管理-基础配置-费用支持类型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundFeeSupportType/edit',
      name: 'fundFeeSupportTypeEdit',
      component: () => import('@/views/vehwholesale/fund/fundFeeSupportType/edit.vue'),

      meta: {
        name: '账户管理-基础配置-费用支持类型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundRebateReturnConfig',
      name: 'fundRebateReturnConfig',
      component: () => import('@/views/vehwholesale/fund/fundRebateReturnConfig/index.vue'),

      meta: {
        name: '账户管理-基础配置-返利自动返还设置管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/fund/fundRebateReturnConfig/detail',
      name: 'fundRebateReturnConfigDetail',
      component: () => import('@/views/vehwholesale/fund/fundRebateReturnConfig/detail.vue'),

      meta: {
        name: '账户管理-基础配置-返利自动返还设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundRebateReturnConfig/edit',
      name: 'fundRebateReturnConfigEdit',
      component: () => import('@/views/vehwholesale/fund/fundRebateReturnConfig/edit.vue'),

      meta: {
        name: '账户管理-基础配置-返利自动返还设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundFinancialOrganization',
      name: 'fundFinancialOrganization',
      component: () => import('@/views/vehwholesale/fund/fundFinancialOrganization/index.vue'),

      meta: {
        name: '账户管理-基础配置-金融机构管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/fund/fundFinancialOrganization/detail',
      name: 'fundFinancialOrganizationDetail',
      component: () => import('@/views/vehwholesale/fund/fundFinancialOrganization/detail.vue'),

      meta: {
        name: '账户管理-基础配置-金融机构管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundFinancialOrganization/edit',
      name: 'fundFinancialOrganizationEdit',
      component: () => import('@/views/vehwholesale/fund/fundFinancialOrganization/edit.vue'),

      meta: {
        name: '账户管理-基础配置-金融机构管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundSaleCompany',
      name: 'fundSaleCompany',
      component: () => import('@/views/vehwholesale/fund/fundSaleCompany/index.vue'),

      meta: {
        name: '账户管理-基础配置-销售公司管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/fund/fundSaleCompany/detail',
      name: 'fundSaleCompanyDetail',
      component: () => import('@/views/vehwholesale/fund/fundSaleCompany/detail.vue'),

      meta: {
        name: '账户管理-基础配置-销售公司管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundSaleCompany/edit',
      name: 'fundSaleCompanyEdit',
      component: () => import('@/views/vehwholesale/fund/fundSaleCompany/edit.vue'),

      meta: {
        name: '账户管理-基础配置-销售公司管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/vdc/vehiclePo',
      name: '',
      component: () => import('@/views/vehstock/vdc/vehiclePo/index.vue'),

      meta: {
        name: '整车采购订单',
        keepAlive: true
      }
    }, {
      path: '/vehstock/vdc/vehiclePo/detail',
      name: 'Detail',
      component: () => import('@/views/vehstock/vdc/vehiclePo/detail.vue'),

      meta: {
        name: '整车采购订单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/vdc/vehiclePo/edit',
      name: 'Edit',
      component: () => import('@/views/vehstock/vdc/vehiclePo/edit.vue'),

      meta: {
        name: '整车采购订单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleTestDrivePurchaseConf',
      name: 'wholesaleTestDrivePurchaseConf',
      component: () => import('@/views/vehwholesale/basic/wholesaleTestDrivePurchaseConf/index.vue'),

      meta: {
        name: '整车批售-批售主数据-试驾车采购配置管理',
        // keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/wholesaleTestDrivePurchaseConf/detail',
      name: 'wholesaleTestDrivePurchaseConfDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleTestDrivePurchaseConf/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-试驾车采购配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleTestDrivePurchaseConf/edit',
      name: 'wholesaleTestDrivePurchaseConfEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleTestDrivePurchaseConf/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-试驾车采购配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleDealerTestDriveQuota',
      name: 'wholesaleDealerTestDriveQuota',
      component: () => import('@/views/vehwholesale/basic/wholesaleDealerTestDriveQuota/index.vue'),

      meta: {
        name: '整车批售-批售主数据-门店试驾车配额管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/wholesaleDealerTestDriveQuota/detail',
      name: 'wholesaleDealerTestDriveQuotaDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleDealerTestDriveQuota/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-门店试驾车配额管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleDealerTestDriveQuota/edit',
      name: 'wholesaleDealerTestDriveQuotaEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleDealerTestDriveQuota/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-门店试驾车配额管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleSaleTargetTracking',
      name: 'wholesaleSaleTargetTracking',
      component: () => import('@/views/vehwholesale/basic/wholesaleSaleTargetTracking/index.vue'),

      meta: {
        name: '整车批售-批售主数据-销售目标跟踪管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/wholesaleSaleTargetTracking/edit',
      name: 'wholesaleSaleTargetTrackingEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleSaleTargetTracking/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-销售目标跟踪管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleNoAutoCarModelConf',
      name: 'wholesaleNoAutoCarModelConf',
      component: () => import('@/views/vehwholesale/basic/wholesaleNoAutoCarModelConf/index.vue'),

      meta: {
        name: '整车批售-批售主数据-不自动批售确认车型管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/wholesaleNoAutoCarModelConf/detail',
      name: 'wholesaleNoAutoCarModelConfDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleNoAutoCarModelConf/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-不自动批售确认车型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleNoAutoCarModelConf/edit',
      name: 'wholesaleNoAutoCarModelConfEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleNoAutoCarModelConf/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-不自动批售确认车型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleTargetDefaultQuota',
      name: 'wholesaleTargetDefaultQuota',
      component: () => import('@/views/vehwholesale/basic/wholesaleTargetDefaultQuota/index.vue'),

      meta: {
        name: '整车批售-批售主数据-批售目标默认配额管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/wholesaleTargetDefaultQuota/detail',
      name: 'wholesaleTargetDefaultQuotaDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleTargetDefaultQuota/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-批售目标默认配额管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleTargetDefaultQuota/edit',
      name: 'wholesaleTargetDefaultQuotaEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleTargetDefaultQuota/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-批售目标默认配额管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleTestDriveQuota',
      name: 'wholesaleTestDriveQuota',
      component: () => import('@/views/vehwholesale/basic/wholesaleTestDriveQuota/index.vue'),

      meta: {
        name: '整车批售-批售主数据-试驾车默认配额管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/wholesaleTestDriveQuota/detail',
      name: 'wholesaleTestDriveQuotaDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleTestDriveQuota/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-试驾车默认配额管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleTestDriveQuota/edit',
      name: 'wholesaleTestDriveQuotaEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleTestDriveQuota/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-试驾车默认配额管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleDealerAutoConfirmConf',
      name: 'wholesaleDealerAutoConfirmConf',
      component: () => import('@/views/vehwholesale/basic/wholesaleDealerAutoConfirmConf/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/wholesaleDealerAutoConfirmConf/detail',
      name: 'wholesaleDealerAutoConfirmConfDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleDealerAutoConfirmConf/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleDealerAutoConfirmConf/edit',
      name: 'wholesaleDealerAutoConfirmConfEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleDealerAutoConfirmConf/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleDealerWholesaleConf',
      name: 'wholesaleDealerWholesaleConf',
      component: () => import('@/views/vehwholesale/basic/wholesaleDealerWholesaleConf/index.vue'),

      meta: {
        name: '整车批售-批售主数据-门店批售设置管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/wholesaleDealerWholesaleConf/detail',
      name: 'wholesaleDealerWholesaleConfDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleDealerWholesaleConf/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-门店批售设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleDealerWholesaleConf/edit',
      name: 'wholesaleDealerWholesaleConfEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleDealerWholesaleConf/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-门店批售设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleVehicleSaleModelConf',
      name: 'wholesaleVehicleSaleModelConf',
      component: () => import('@/views/vehwholesale/basic/wholesaleVehicleSaleModelConf/index.vue'),

      meta: {
        name: '整车批售-批售主数据-整车销售模式配置管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/wholesaleVehicleSaleModelConf/detail',
      name: 'wholesaleVehicleSaleModelConfDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleVehicleSaleModelConf/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-整车销售模式配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleVehicleSaleModelConf/edit',
      name: 'wholesaleVehicleSaleModelConfEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleVehicleSaleModelConf/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-整车销售模式配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/vdc/vehicleVdcInventoryLedger',
      name: 'vehicleVdcInventoryLedger',
      component: () => import('@/views/vehstock/vdc/vehicleVdcInventoryLedger/index.vue'),

      meta: {
        name: 'VDC库存台账',
        keepAlive: true
      }
    }, {
      path: '/vehstock/vdc/vehicleVdcInventoryLedger/detail',
      name: 'vehicleVdcInventoryLedgerDetail',
      component: () => import('@/views/vehstock/vdc/vehicleVdcInventoryLedger/detail.vue'),

      meta: {
        name: 'VDC库存台账详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/vdc/vehicleVdcInventoryLedger/edit',
      name: 'vehicleVdcInventoryLedgerEdit',
      component: () => import('@/views/vehstock/vdc/vehicleVdcInventoryLedger/edit.vue'),

      meta: {
        name: 'VDC库存台账详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/productManager/productSkuPrice',
      name: 'productManager',
      component: () => import('@/views/vehretail/productManager/productSkuPrice/index.vue'),

      meta: {
        name: '销售管理-商品管理-商品SKU价格维护管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/productManager/productSkuPrice/detail',
      name: 'productManagerDetail',
      component: () => import('@/views/vehretail/productManager/productSkuPrice/detail.vue'),

      meta: {
        name: '销售管理-商品管理-商品SKU价格维护管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/productManager/productSkuPrice/edit',
      name: 'productManagerEdit',
      component: () => import('@/views/vehretail/productManager/productSkuPrice/edit.vue'),

      meta: {
        name: '销售管理-商品管理-商品SKU价格维护管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/productManager/productCenter',
      name: 'productCenter',
      component: () => import('@/views/vehretail/productManager/productCenter/index.vue'),

      meta: {
        name: '销售管理-商品管理-商品中心管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/productManager/productCenter/detail',
      name: 'productCenterDetail',
      component: () => import('@/views/vehretail/productManager/productCenter/detail.vue'),

      meta: {
        name: '销售管理-商品管理-商品中心管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/productManager/productCenter/edit',
      name: 'productCenterEdit',
      component: () => import('@/views/vehretail/productManager/productCenter/edit.vue'),

      meta: {
        name: '销售管理-商品管理-商品中心管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/rebate/fundVehicleRebateBill',
      name: 'fundVehicleRebateBill',
      component: () => import('@/views/vehwholesale/rebate/fundVehicleRebateBill/index.vue'),

      meta: {
        name: '账户管理-整车返利-整车返利核算单明细管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/rebate/fundVehicleRebateBill/detail',
      name: 'fundVehicleRebateBillDetail',
      component: () => import('@/views/vehwholesale/rebate/fundVehicleRebateBill/detail.vue'),

      meta: {
        name: '账户管理-整车返利-整车返利核算单明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/rebate/fundVehicleRebateBill/edit',
      name: 'fundVehicleRebateBillEdit',
      component: () => import('@/views/vehwholesale/rebate/fundVehicleRebateBill/edit.vue'),

      meta: {
        name: '账户管理-整车返利-整车返利核算单明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/rebate/fundVehicleRebateBillDetail',
      name: 'fundVehicleRebateBillDetail',
      component: () => import('@/views/vehwholesale/rebate/fundVehicleRebateBillDetail/index.vue'),

      meta: {
        name: '账户管理-整车返利-整车返利核算单明细管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/rebate/fundVehicleRebateBillDetail/detail',
      name: 'fundVehicleRebateBillDetailDetail',
      component: () => import('@/views/vehwholesale/rebate/fundVehicleRebateBillDetail/detail.vue'),

      meta: {
        name: '账户管理-整车返利-整车返利核算单明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/rebate/fundVehicleRebateBillDetail/edit',
      name: 'fundVehicleRebateBillDetailEdit',
      component: () => import('@/views/vehwholesale/rebate/fundVehicleRebateBillDetail/edit.vue'),

      meta: {
        name: '账户管理-整车返利-整车返利核算单明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesLimit',
      name: 'fundOwnCreditSalesLimit',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesLimit/index.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销额度管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesLimit/detail',
      name: 'fundOwnCreditSalesLimitDetail',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesLimit/detail.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销额度管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesLimit/edit',
      name: 'fundOwnCreditSalesLimitEdit',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesLimit/edit.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销额度管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesConfig',
      name: 'fundOwnCreditSalesConfig',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesConfig/index.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销配置管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesConfig/detail',
      name: 'fundOwnCreditSalesConfigDetail',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesConfig/detail.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesConfig/edit',
      name: 'fundOwnCreditSalesConfigReview',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesConfig/edit.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesConfig/review',
      name: 'fundOwnCreditSalesConfigEdit',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesConfig/review.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundCreditSalesFeeConfig',
      name: 'fundCreditSalesFeeConfig',
      component: () => import('@/views/vehwholesale/creditsales/fundCreditSalesFeeConfig/index.vue'),

      meta: {
        name: '账户管理-赊销管理-赊销资费设置管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/creditsales/fundCreditSalesFeeConfig/detail',
      name: 'fundCreditSalesFeeConfigDetail',
      component: () => import('@/views/vehwholesale/creditsales/fundCreditSalesFeeConfig/detail.vue'),

      meta: {
        name: '账户管理-赊销管理-赊销资费设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundCreditSalesFeeConfig/edit',
      name: 'fundCreditSalesFeeConfigEdit',
      component: () => import('@/views/vehwholesale/creditsales/fundCreditSalesFeeConfig/edit.vue'),

      meta: {
        name: '账户管理-赊销管理-赊销资费设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail',
      name: 'page',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesDetail/index.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销明细管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/creditsales/fundowncreditsalesdetail/detail',
      name: 'pageDetail',

      component: () => import(
        '@/views/vehwholesale/creditsales/fundOwnCreditSalesDetail/detail.vue'
      ),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail/edit',
      name: 'pageEdit',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesDetail/edit.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail',
      name: 'fundOwnCreditSalesDetail',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesDetail/index.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销明细管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail/detail',
      name: 'fundOwnCreditSalesDetailDetail',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesDetail/detail.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail/edit',
      name: 'fundOwnCreditSalesDetailEdit',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesDetail/edit.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail',
      name: 'fundOwnCreditSalesDetail',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesDetail/index.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销明细管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail/detail',
      name: 'fundOwnCreditSalesDetailDetail',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesDetail/detail.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundOwnCreditSalesDetail/edit',
      name: 'fundOwnCreditSalesDetailEdit',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesDetail/edit.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleProdScheduleActivity',
      name: 'wholesaleProdScheduleActivity',
      component: () => import('@/views/vehwholesale/basic/wholesaleProdScheduleActivity/index.vue'),

      meta: {
        name: '整车批售-批售主数据-排产专项活动管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/wholesaleProdScheduleActivity/edit',
      name: 'wholesaleProdScheduleActivityEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleProdScheduleActivity/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-排产专项活动管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleProdScheduleActivity',
      name: 'wholesaleProdScheduleActivity',
      component: () => import('@/views/vehwholesale/basic/wholesaleProdScheduleActivity/index.vue'),

      meta: {
        name: '整车批售-批售主数据-排产专项活动管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/wholesaleProdScheduleActivity/edit',
      name: 'wholesaleProdScheduleActivityEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleProdScheduleActivity/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-排产专项活动管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaleProdScheduleActivityDetail',
      name: 'wholesaleProdScheduleActivityDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleProdScheduleActivityDetail/index.vue'),

      meta: {
        name: '整车批售-批售主数据-排产专项活动明细管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/wholesaleProdScheduleActivityDetail/edit',
      name: 'wholesaleProdScheduleActivityDetailEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleProdScheduleActivityDetail/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-排产专项活动明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/replenish/dealerVehicleReplenishApplyDetail',
      name: 'dealerVehicleReplenishApplyDetail',
      component: () => import('@/views/vehwholesale/replenish/dealerVehicleReplenishApplyDetail/index.vue'),

      meta: {
        name: '整车批售-批售主数据-整车门店补货明细管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/replenish/dealerVehicleReplenishApplyDetail/edit',
      name: 'dealerVehicleReplenishApplyDetailEdit',
      component: () => import('@/views/vehwholesale/replenish/dealerVehicleReplenishApplyDetail/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-整车门店补货明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/replenish/dealerVehicleReplenishApply',
      name: 'vehwholesale/replenish/dealerVehicleReplenishApply',
      component: () => import('@/views/vehwholesale/replenish/dealerVehicleReplenishApply/index.vue'),

      meta: {
        name: '整车批售-批售主数据-整车门店补货申请管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/replenish/dealerVehicleReplenishApply/edit',
      name: 'vehwholesale/replenish/dealerVehicleReplenishApplyEdit',
      component: () => import('@/views/vehwholesale/replenish/dealerVehicleReplenishApply/edit.vue'),
      meta: {
        name: '整车批售-批售主数据-整车门店补货申请管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/wholesale/vehicleWholesaleOrder',
      name: 'order',
      component: () => import('@/views/vehwholesale/wholesale/vehicleWholesaleOrder/index.vue'),

      meta: {
        name: '整车批售-批售主数据-整车批售订单管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/wholesale/vehicleWholesaleOrder/edit',
      name: 'orderEdit',
      component: () => import('@/views/vehwholesale/wholesale/vehicleWholesaleOrder/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-整车批售订单管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/wholesale/vehicleWholesaleOrder',
      name: 'order',
      component: () => import('@/views/vehwholesale/wholesale/vehicleWholesaleOrder/index.vue'),

      meta: {
        name: '整车批售-批售主数据-整车批售订单管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/wholesale/vehicleWholesaleOrder/edit',
      name: 'orderEdit',
      component: () => import('@/views/vehwholesale/wholesale/vehicleWholesaleOrder/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-整车批售订单管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/wholesale/vehicleWholesaleOrderFactory',
      name: 'orderFactory',
      component: () => import('@/views/vehwholesale/wholesale/vehicleWholesaleOrderFactory/index.vue'),

      meta: {
        name: '整车批售-批售主数据-整车批售订单管理(厂端)',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/wholesale/vehicleWholesaleOrderFactory/edit',
      name: 'orderEditFactory',
      component: () => import('@/views/vehwholesale/wholesale/vehicleWholesaleOrderFactory/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-整车批售订单管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/store/vehiclePdiCheckItemConfig',
      name: 'vehiclePdiCheckItemConfig',
      component: () => import('@/views/vehstock/store/vehiclePdiCheckItemConfig/index.vue'),

      meta: {
        name: '整车PDI检查项配置',
        keepAlive: true
      }
    }, {
      path: '/vehstock/store/vehiclePdiCheckItemConfig/edit',
      name: 'vehiclePdiCheckItemConfigEdit',
      component: () => import('@/views/vehstock/store/vehiclePdiCheckItemConfig/edit.vue'),

      meta: {
        name: '整车PDI检查项配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/store/storeVehiclePdi',
      name: 'storeVehiclePdi',
      component: () => import('@/views/vehstock/store/storeVehiclePdi/index.vue'),

      meta: {
        name: '门店整车PDI单',
        keepAlive: true
      }
    }, {
      path: '/vehstock/store/storeVehiclePdi/edit',
      name: 'storeVehiclePdiEdit',
      component: () => import('@/views/vehstock/store/storeVehiclePdi/edit.vue'),

      meta: {
        name: '门店整车PDI单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/store/storeInventoryLedger',
      name: 'storeInventoryLedger',
      component: () => import('@/views/vehstock/store/storeInventoryLedger/index.vue'),

      meta: {
        name: '门店库存台账',
        keepAlive: true
      }
    }, {
      path: '/vehstock/store/storeInventoryLedger/edit',
      name: 'storeInventoryLedgerEdit',
      component: () => import('@/views/vehstock/store/storeInventoryLedger/edit.vue'),

      meta: {
        name: '门店库存台账单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderRefund/category',
      name: 'orderRefundCategory',
      component: () => import('@/views/vehretail/orderRefund/category/index.vue'),

      meta: {
        name: '退订原因分类',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderRefund/category/edit',
      name: 'orderRefundCategoryEdit',
      component: () => import('@/views/vehretail/orderRefund/category/edit.vue'),

      meta: {
        name: '退订原因分类详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderRefund/categoryDetail',
      name: 'orderRefundCategoryDetail',
      component: () => import('@/views/vehretail/orderRefund/categoryDetail/index.vue'),

      meta: {
        name: '原因二级分类',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderRefund/categoryDetail/edit',
      name: 'orderRefundCategoryDetailEdit',
      component: () => import('@/views/vehretail/orderRefund/categoryDetail/edit.vue'),

      meta: {
        name: '原因二级分类详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/event/eventNotifyTask',
      name: 'eventNotifyTask',
      component: () => import('@/views/vehretail/event/eventNotifyTask/index.vue'),

      meta: {
        name: '事件通知任务',
        keepAlive: true
      }
    }, {
      path: '/vehretail/event/eventNotifyTask/edit',
      name: 'eventNotifyTaskEdit',
      component: () => import('@/views/vehretail/event/eventNotifyTask/edit.vue'),

      meta: {
        name: '事件通知任务详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/finance/bank/finBankCreditRecord',
      name: 'bank',
      component: () => import('@/views/vehwholesale/finance/bank/finBankCreditRecord/index.vue'),

      meta: {
        name: '账户管理-银行融资信息-银行授信记录管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/finance/bank/finBankCreditRecord/edit',
      name: 'bankEdit',
      component: () => import('@/views/vehwholesale/finance/bank/finBankCreditRecord/edit.vue'),

      meta: {
        name: '账户管理-银行融资信息-银行授信记录管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/finance/bank/finBankFinancingRecord',
      name: 'finBankFinancingRecord',
      component: () => import('@/views/vehwholesale/finance/bank/finBankFinancingRecord/index.vue'),

      meta: {
        name: '账户管理-银行融资信息-银行融资记录管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/finance/bank/finBankFinancingRecord/edit',
      name: 'finBankFinancingRecordEdit',
      component: () => import('@/views/vehwholesale/finance/bank/finBankFinancingRecord/edit.vue'),

      meta: {
        name: '账户管理-银行融资信息-银行融资记录管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/finance/bank/finCustomerRepaymentRecord',
      name: 'finCustomerRepaymentRecord',
      component: () => import('@/views/vehwholesale/finance/bank/finCustomerRepaymentRecord/index.vue'),

      meta: {
        name: '账户管理-银行融资信息-客户还款记录管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/finance/bank/finCustomerRepaymentRecord/edit',
      name: 'finCustomerRepaymentRecordEdit',
      component: () => import('@/views/vehwholesale/finance/bank/finCustomerRepaymentRecord/edit.vue'),

      meta: {
        name: '账户管理-银行融资信息-客户还款记录管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/finance/bank/finBankVehicleRepaymentRecord',
      name: 'finBankVehicleRepaymentRecord',

      component: () => import(
        '@/views/vehwholesale/finance/bank/finBankVehicleRepaymentRecord/index.vue'
      ),

      meta: {
        name: '账户管理-银行融资信息-银行还款车辆记录管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/finance/bank/finBankVehicleRepaymentRecord/edit',
      name: 'finBankVehicleRepaymentRecordEdit',
      component: () => import('@/views/vehwholesale/finance/bank/finBankVehicleRepaymentRecord/edit.vue'),

      meta: {
        name: '账户管理-银行融资信息-银行还款车辆记录管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/finance/factory/finVehicleBindingMileageRecord',
      name: 'finVehicleBindingMileageRecord',

      component: () => import(
        '@/views/vehwholesale/finance/factory/finVehicleBindingMileageRecord/index.vue'
      ),

      meta: {
        name: '账户管理-车厂融资信息-车辆绑车及里程记录管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/finance/factory/finVehicleBindingMileageRecord/edit',
      name: 'finVehicleBindingMileageRecordEdit',

      component: () => import(
        '@/views/vehwholesale/finance/factory/finVehicleBindingMileageRecord/edit.vue'
      ),

      meta: {
        name: '账户管理-车厂融资信息-车辆绑车及里程记录管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/finance/factory/finVehicleStatusRecord',
      name: 'finVehicleStatusRecord',

      component: () => import(
        '@/views/vehwholesale/finance/factory/finVehicleStatusRecord/index.vue'
      ),

      meta: {
        name: '账户管理-车厂融资信息-车辆状态记录管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/finance/factory/finVehicleStatusRecord/edit',
      name: 'finVehicleStatusRecordEdit',

      component: () => import(
        '@/views/vehwholesale/finance/factory/finVehicleStatusRecord/edit.vue'
      ),

      meta: {
        name: '账户管理-车厂融资信息-车辆状态记录管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/finance/apply/finFinancingApplicationDealer',
      name: 'finFinancingApplicationDealer',

      component: () => import(
        '@/views/vehwholesale/finance/apply/finFinancingApplicationDealer/index.vue'
      ),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/finance/apply/finFinancingApplicationDealer/edit',
      name: 'finFinancingApplicationDealerEdit',

      component: () => import(
        '@/views/vehwholesale/finance/apply/finFinancingApplicationDealer/edit.vue'
      ),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/finance/factory/finCustomerPurchaseRecord',
      name: 'finCustomerPurchaseRecord',
      component: () => import('@/views/vehwholesale/finance/factory/finCustomerPurchaseRecord/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/finance/factory/finCustomerPurchaseRecord/edit',
      name: 'finCustomerPurchaseRecordEdit',
      component: () => import('@/views/vehwholesale/finance/factory/finCustomerPurchaseRecord/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/finance/factory/finDealerRecommendation',
      name: 'finDealerRecommendation',
      component: () => import('@/views/vehwholesale/finance/factory/finDealerRecommendation/index.vue'),

      meta: {
        name: '账户管理-车厂融资信息-经销商推荐函管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/finance/factory/finDealerRecommendation/edit',
      name: 'finDealerRecommendationEdit',
      component: () => import('@/views/vehwholesale/finance/factory/finDealerRecommendation/edit.vue'),

      meta: {
        name: '账户管理-车厂融资信息-经销商推荐函管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/orderUnlockApply',
      name: 'orderUnlockApply',
      component: () => import('@/views/vehretail/orderManager/orderUnlockApply/index.vue'),

      meta: {
        name: '订单锁车解绑申请记录管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/orderUnlockApply/edit',
      name: 'orderUnlockApplyEdit',
      component: () => import('@/views/vehretail/orderManager/orderUnlockApply/edit.vue'),

      meta: {
        name: '订单锁车解绑申请记录管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/orderPayRecord',
      name: 'orderPayRecord',
      component: () => import('@/views/vehretail/orderManager/orderPayRecord/index.vue'),

      meta: {
        name: '订单收款记录管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/orderPayRecord/edit',
      name: 'orderPayRecordEdit',
      component: () => import('@/views/vehretail/orderManager/orderPayRecord/edit.vue'),

      meta: {
        name: '订单收款记录管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/retailOrderAggregation',
      name: 'orderAggregationDetail',
      component: () => import('@/views/vehretail/orderManager/retailOrderAggregation/index.vue'),

      meta: {
        name: '订单车辆聚合查询',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/store/storeInventoryInboundDetails',
      name: 'storeInventoryInboundDetails',
      component: () => import('@/views/vehstock/store/storeInventoryInboundDetails/index.vue'),

      meta: {
        name: '门店库存入库明细',
        keepAlive: true
      }
    }, {
      path: '/vehstock/store/storeInventoryOutboundDetails',
      name: 'storeInventoryOutboundDetails',
      component: () => import('@/views/vehstock/store/storeInventoryOutboundDetails/index.vue'),

      meta: {
        name: '门店库存出库明细',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/retailOrderUnlockConfig',
      name: 'retailOrderUnlockConfig',
      component: () => import('@/views/vehretail/basicConfig/retailOrderUnlockConfig/index.vue'),

      meta: {
        name: '订单解绑配车配置管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/retailOrderUnlockConfig/edit',
      name: 'retailOrderUnlockConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/retailOrderUnlockConfig/edit.vue'),

      meta: {
        name: '订单解绑配车配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/retailOrderUnlockReasonConfig',
      name: 'retailOrderUnlockReasonConfig',
      component: () => import('@/views/vehretail/basicConfig/retailOrderUnlockReasonConfig/index.vue'),

      meta: {
        name: '订单解绑原因配置管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/retailOrderUnlockReasonConfig/edit',
      name: 'retailOrderUnlockReasonConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/retailOrderUnlockReasonConfig/edit.vue'),

      meta: {
        name: '订单解绑原因配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/retailOrderInfo',
      name: 'retailOrderInfo',
      component: () => import('@/views/vehretail/orderManager/retailOrderInfo/index.vue'),

      meta: {
        name: '整车零售订单管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/retailOrderInfo/edit',
      name: 'retailOrderInfoEdit',
      component: () => import('@/views/vehretail/orderManager/retailOrderInfo/edit.vue'),

      meta: {
        name: '整车零售订单管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/orderBackStatusRecord',
      name: 'orderBackStatusRecord',
      component: () => import('@/views/vehretail/orderManager/orderBackStatusRecord/index.vue'),

      meta: {
        name: '回退订单状态记录查询管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/orderBackStatusRecord/edit',
      name: 'orderBackStatusRecordEdit',
      component: () => import('@/views/vehretail/orderManager/retailOrderInfo/edit.vue'),

      meta: {
        name: '回退订单状态记录查询详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/deliveryCycleTimeConfig',
      name: 'deliveryCycleTimeConfig',
      component: () => import('@/views/vehretail/basicConfig/deliveryCycleTimeConfig/index.vue'),

      meta: {
        name: '交付周期时效信息',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/deliveryCycleTimeConfig/edit',
      name: 'deliveryCycleTimeConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/deliveryCycleTimeConfig/edit.vue'),

      meta: {
        name: '交付周期时效信息详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/deliveryCycleConfig',
      name: 'deliveryCycleConfig',
      component: () => import('@/views/vehretail/basicConfig/deliveryCycleConfig/index.vue'),

      meta: {
        name: '交付周期信息配置',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/deliveryCycleConfig/edit',
      name: 'deliveryCycleConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/deliveryCycleConfig/edit.vue'),

      meta: {
        name: '交付周期信息配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/orderLockRecord',
      name: 'orderLockRecord',
      component: () => import('@/views/vehretail/orderManager/orderLockRecord/index.vue'),

      meta: {
        name: '订单锁车记录管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/orderLockRecord/edit',
      name: 'orderLockRecordEdit',
      component: () => import('@/views/vehretail/orderManager/orderLockRecord/edit.vue'),

      meta: {
        name: '订单锁车记录管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/deliveryOrder',
      name: 'deliveryOrder',
      component: () => import('@/views/vehretail/orderManager/deliveryOrder/index.vue'),

      meta: {
        name: '交车单管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/deliveryOrder/edit',
      name: 'deliveryOrderEdit',
      component: () => import('@/views/vehretail/orderManager/deliveryOrder/edit.vue'),

      meta: {
        name: '交车单管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/orderConfigChange',
      name: 'orderConfigChange',
      component: () => import('@/views/vehretail/orderManager/orderConfigChange/index.vue'),

      meta: {
        name: '订单改配信息管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/orderConfigChange/edit',
      name: 'orderConfigChangeEdit',
      component: () => import('@/views/vehretail/orderManager/orderConfigChange/edit.vue'),

      meta: {
        name: '订单改配信息管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderRefund/changeApply',
      name: 'orderChangeApply',
      component: () => import('@/views/vehretail/orderRefund/changeApply/index.vue'),

      meta: {
        name: '订单信息变更申请',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderRefund/changeApply/edit',
      name: 'orderChangeApplyEdit',
      component: () => import('@/views/vehretail/orderRefund/changeApply/edit.vue'),

      meta: {
        name: '订单信息变更申请详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderRefund/changeReason',
      name: 'orderChangeReason',
      component: () => import('@/views/vehretail/orderRefund/changeReason'),

      meta: {
        name: '变更原因',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderRefund/changeReason/edit',
      name: 'orderChangeReasonEdit',
      component: () => import('@/views/vehretail/orderRefund/changeReason/edit.vue'),

      meta: {
        name: '变更原因详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderRefund/refundApply',
      name: 'orderRefundApply',
      component: () => import('@/views/vehretail/orderRefund/refundApply/index.vue'),

      meta: {
        name: '整车零售退订申请单管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderRefund/refundApply/edit',
      name: 'orderRefundApplyEdit',
      component: () => import('@/views/vehretail/orderRefund/refundApply/edit.vue'),

      meta: {
        name: '整车零售退订申请单管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderRefund/refundApprovalLog',
      name: 'orderRefundApprovalLog',
      component: () => import('@/views/vehretail/orderRefund/refundApprovalLog/index.vue'),

      meta: {
        name: '订单退订审批明细管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderRefund/refundApprovalLog/edit',
      name: 'orderRefundApprovalLogEdit',
      component: () => import('@/views/vehretail/orderRefund/refundApprovalLog/edit.vue'),

      meta: {
        name: '订单退订审批明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderRefund/payRefundRecord',
      name: 'orderPayRefundRecord',
      component: () => import('@/views/vehretail/orderRefund/payRefundRecord/index.vue'),

      meta: {
        name: '订单退订退款记录管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderRefund/payRefundRecord/edit',
      name: 'orderPayRefundRecordEdit',
      component: () => import('@/views/vehretail/orderRefund/payRefundRecord/edit.vue'),

      meta: {
        name: '订单退订退款记录管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/storeBuildCapacityConfig',
      name: 'storeBuildCapacityConfig',
      component: () => import('@/views/vehretail/basicConfig/storeBuildCapacityConfig/index.vue'),

      meta: {
        name: '建店类型承载力配置',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/storeBuildCapacityConfig/edit',
      name: 'storeBuildCapacityConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/storeBuildCapacityConfig/edit.vue'),

      meta: {
        name: '建店类型承载力配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/storeDeliveryCapacityConfig',
      name: 'storeDeliveryCapacityConfig',
      component: () => import('@/views/vehretail/basicConfig/storeDeliveryCapacityConfig/index.vue'),

      meta: {
        name: '门店交付承载力配置',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/storeDeliveryCapacityConfig/edit',
      name: 'storeDeliveryCapacityConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/storeDeliveryCapacityConfig/edit.vue'),

      meta: {
        name: '门店交付承载力配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/deliveryInfoConfig',
      name: 'deliveryInfoConfig',
      component: () => import('@/views/vehretail/basicConfig/deliveryInfoConfig/index.vue'),

      meta: {
        name: '交付信息配置',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/deliveryInfoConfig/edit',
      name: 'deliveryInfoConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/deliveryInfoConfig/edit.vue'),

      meta: {
        name: '交付信息配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/modelDeliveryConfig',
      name: 'modelDeliveryConfig',
      component: () => import('@/views/vehretail/basicConfig/modelDeliveryConfig/index.vue'),

      meta: {
        name: '车型交付配置管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/modelDeliveryConfig/edit',
      name: 'modelDeliveryConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/modelDeliveryConfig/edit.vue'),

      meta: {
        name: '车型交付配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/productionOfflineConfig',
      name: 'productionOfflineConfig',
      component: () => import('@/views/vehretail/basicConfig/productionOfflineConfig/index.vue'),

      meta: {
        name: '排产下线时效管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/productionOfflineConfig/edit',
      name: 'productionOfflineConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/productionOfflineConfig/edit.vue'),

      meta: {
        name: '排产下线时效管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/orderUrgentConfig',
      name: 'orderUrgentConfig',
      component: () => import('@/views/vehretail/basicConfig/orderUrgentConfig/index.vue'),

      meta: {
        name: '预售/盲订急单配置管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/orderUrgentConfig/edit',
      name: 'orderUrgentConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/orderUrgentConfig/edit.vue'),

      meta: {
        name: '预售/盲订急单配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/lockCarShareConfig',
      name: 'lockCarShareConfig',
      component: () => import('@/views/vehretail/basicConfig/lockCarShareConfig/index.vue'),
      meta: {
        name: '锁车资源共享配置管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/lockCarShareConfig/edit',
      name: 'lockCarShareConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/lockCarShareConfig/edit.vue'),

      meta: {
        name: '锁车资源共享配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/bizMasterData/configMasterData/salesConfig',
      name: 'salesConfig',
      component: () => import('@/views/vehretail/bizMasterData/configMasterData/salesConfig/index.vue'),

      meta: {
        name: '销售/交付顾问配置管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/bizMasterData/configMasterData/salesConfig/edit',
      name: 'salesConfigEdit',
      component: () => import('@/views/vehretail/bizMasterData/configMasterData/salesConfig/edit.vue'),

      meta: {
        name: '销售/交付顾问配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/shipping/vehicleShippingPlanDetail',
      name: 'vehicleShippingPlanDetail',
      component: () => import('@/views/vehwholesale/shipping/vehicleShippingPlanDetail/index.vue'),

      meta: {
        name: '新页面',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/shipping/vehicleShippingPlanDetail/edit',
      name: 'vehicleShippingPlanDetailEdit',
      component: () => import('@/views/vehwholesale/shipping/vehicleShippingPlanDetail/edit.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/financeSubsidy/vrFinancePlan',
      name: 'vrFinancePlan',
      component: () => import('@/views/vehretail/financeSubsidy/vrFinancePlan/index.vue'),

      meta: {
        name: '整车零售-金融补贴-金融方案-适用金融产品管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/financeSubsidy/vrFinanceOrder',
      name: 'vrFinanceOrder',
      component: () => import('@/views/vehretail/financeSubsidy/vrFinanceOrder/index.vue'),

      meta: {
        name: '整车零售-金融补贴-金融订单管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/financeSubsidy/vrFinanceOrder/edit',
      name: 'vrFinanceOrderEdit',
      component: () => import('@/views/vehretail/financeSubsidy/vrFinanceOrder/edit.vue'),

      meta: {
        name: '整车零售-金融补贴-金融订单管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/financeSubsidy/vrFinanceProduct',
      name: 'vrFinanceProduct',
      component: () => import('@/views/vehretail/financeSubsidy/vrFinanceProduct/index.vue'),

      meta: {
        name: '整车零售-金融补贴-金融产品管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/financeSubsidy/vrFinanceProduct/edit',
      name: 'vrFinanceProductEdit',
      component: () => import('@/views/vehretail/financeSubsidy/vrFinanceProduct/edit.vue'),

      meta: {
        name: '整车零售-金融补贴-金融产品管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/financeSubsidy/vrFinanceOrganization',
      name: 'financePlan',
      component: () => import('@/views/vehretail/financeSubsidy/vrFinanceOrganization/index.vue'),

      meta: {
        name: '整车零售-金融补贴-金融机构',
        keepAlive: true
      }
    }, {
      path: '/vehretail/financeSubsidy/vrFinanceOrganization/edit',
      name: 'financePlanEdit',
      component: () => import('@/views/vehretail/financeSubsidy/vrFinanceOrganization/edit.vue'),

      meta: {
        name: '整车零售-金融补贴-金融机构详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/financeSubsidy/vrFinancePlan',
      name: 'financePlan',
      component: () => import('@/views/vehretail/financeSubsidy/vrFinancePlan/index.vue'),

      meta: {
        name: '整车零售-金融补贴-金融方案',
        keepAlive: true
      }
    }, {
      path: '/vehretail/financeSubsidy/vrFinancePlan/edit',
      name: 'financePlanEdit',
      component: () => import('@/views/vehretail/financeSubsidy/vrFinancePlan/edit.vue'),

      meta: {
        name: '整车零售-金融补贴-金融方案详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/vrEquityCategory',
      name: 'vrEquityCategory',
      component: () => import('@/views/vehretail/basicConfig/vrEquityCategory/index.vue'),

      meta: {
        name: '整车零售-基础设置-权益大类管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/vrEquityCategory/edit',
      name: 'vrEquityCategoryEdit',
      component: () => import('@/views/vehretail/basicConfig/vrEquityCategory/edit.vue'),

      meta: {
        name: '整车零售-基础设置-权益大类管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/vrEquityApply',
      name: 'vrEquityApply',
      component: () => import('@/views/vehretail/orderManager/vrEquityApply/index.vue'),

      meta: {
        name: '整车零售-订单管理-订单权益申请管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/vrEquityApply/edit',
      name: 'vrEquityApplyEdit',
      component: () => import('@/views/vehretail/orderManager/vrEquityApply/edit.vue'),

      meta: {
        name: '整车零售-订单管理-订单权益申请管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/vrGroupbuyOrderEquityApply',
      name: 'vrGroupbuyOrderEquityApply',
      component: () => import('@/views/vehretail/orderManager/vrGroupbuyOrderEquityApply/index.vue'),

      meta: {
        name: '整车零售-订单管理-团购订单权益申请管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/vrGroupbuyOrderEquityApply/edit',
      name: 'vrGroupbuyOrderEquityApplyEdit',
      component: () => import('@/views/vehretail/orderManager/vrGroupbuyOrderEquityApply/edit.vue'),

      meta: {
        name: '整车零售-订单管理-团购订单权益申请管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/vrGroupbuyEnterprisePolicy',
      name: 'vrGroupbuyEnterprisePolicy',
      component: () => import('@/views/vehretail/orderManager/vrGroupbuyEnterprisePolicy/index.vue'),

      meta: {
        name: '整车零售-订单管理-团购企业优惠政策管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/vrGroupbuyEnterprisePolicy/edit',
      name: 'vrGroupbuyEnterprisePolicyEdit',
      component: () => import('@/views/vehretail/orderManager/vrGroupbuyEnterprisePolicy/edit.vue'),

      meta: {
        name: '整车零售-订单管理-团购企业优惠政策管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/deliveryConfirmItemConfig',
      name: 'deliveryConfirmItemConfig',
      component: () => import('@/views/vehretail/basicConfig/deliveryConfirmItemConfig/index.vue'),

      meta: {
        name: '交车确认项配置管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/deliveryConfirmItemConfig/edit',
      name: 'deliveryConfirmItemConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/deliveryConfirmItemConfig/edit.vue'),

      meta: {
        name: '交车确认项配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/vrGroupbuyEnterpriseCustomer',
      name: 'vrGroupbuyEnterpriseCustomer',
      component: () => import('@/views/vehretail/orderManager/vrGroupbuyEnterpriseCustomer/index.vue'),

      meta: {
        name: '整车零售-订单管理-团购企业客户管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/vrGroupbuyEnterpriseCustomer/edit',
      name: 'vrGroupbuyEnterpriseCustomerEdit',
      component: () => import('@/views/vehretail/orderManager/vrGroupbuyEnterpriseCustomer/edit.vue'),

      meta: {
        name: '整车零售-订单管理-团购企业客户管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/vrSpecialVehicleEquityApply',
      name: 'vrSpecialVehicleEquityApply',
      component: () => import('@/views/vehretail/orderManager/vrSpecialVehicleEquityApply/index.vue'),

      meta: {
        name: '整车零售-订单管理-特殊车辆权益申请管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/vrSpecialVehicleEquityApply/edit',
      name: 'vrSpecialVehicleEquityApplyEdit',
      component: () => import('@/views/vehretail/orderManager/vrSpecialVehicleEquityApply/edit.vue'),

      meta: {
        name: '整车零售-订单管理-特殊车辆权益申请管理',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/wholesale/vehicleWholesaleOrderRecord',
      name: 'vehicleWholesaleOrderRecord',
      component: () => import('@/views/vehwholesale/wholesale/vehicleWholesaleOrderRecord/index.vue'),

      meta: {
        name: '整车批售-批售管理-批售配车结算记录管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/wholesale/vehicleWholesaleOrderRecord/edit',
      name: 'vehicleWholesaleOrderRecordEdit',
      component: () => import('@/views/vehwholesale/wholesale/vehicleWholesaleOrderRecord/edit.vue'),

      meta: {
        name: '整车批售-批售管理-批售配车结算记录管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/vrSpecialVehicle',
      name: 'vrSpecialVehicle',
      component: () => import('@/views/vehretail/orderManager/vrSpecialVehicle/index.vue'),

      meta: {
        name: '整车零售-订单管理-特殊车辆清单管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/deliveryScheduleTimeConfig',
      name: 'deliveryScheduleTimeConfig',
      component: () => import('@/views/vehretail/basicConfig/deliveryScheduleTimeConfig/index.vue'),

      meta: {
        name: '交付排程时间段配置',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/deliveryScheduleTimeConfig/edit',
      name: 'deliveryScheduleTimeConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/deliveryScheduleTimeConfig/edit.vue'),

      meta: {
        name: '交付排程时间段配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/deliveryAppointmentTimeConfig',
      name: 'deliveryAppointmentTimeConfig',
      component: () => import('@/views/vehretail/basicConfig/deliveryAppointmentTimeConfig/index.vue'),

      meta: {
        name: '交付预约时效配置',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/deliveryAppointmentTimeConfig/edit',
      name: 'deliveryAppointmentTimeConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/deliveryAppointmentTimeConfig/edit.vue'),

      meta: {
        name: '交付预约时效配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/storeDeliveryAllocationConfig',
      name: 'storeDeliveryAllocationConfig',
      component: () => import('@/views/vehretail/basicConfig/storeDeliveryAllocationConfig/index.vue'),

      meta: {
        name: '门店交付分派配置',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/storeDeliveryAllocationConfig/edit',
      name: 'storeDeliveryAllocationConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/storeDeliveryAllocationConfig/edit.vue'),

      meta: {
        name: '门店交付分派配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/replenish/entVehicleReplenishOrder',
      name: 'entVehicleReplenishOrder',
      component: () => import('@/views/vehwholesale/replenish/entVehicleReplenishOrder/index.vue'),

      meta: {
        name: '整车销售-企业客户订单-企业客户补货订单管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/replenish/entVehicleReplenishOrder/edit',
      name: 'entVehicleReplenishOrderEdit',
      component: () => import('@/views/vehwholesale/replenish/entVehicleReplenishOrder/edit.vue'),

      meta: {
        name: '整车销售-企业客户订单-企业客户补货订单管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/entorder/entVehicleOrder',
      name: 'entVehicleOrder',
      component: () => import('@/views/vehwholesale/entorder/entVehicleOrder/index.vue'),

      meta: {
        name: '整车销售-企业客户订单-企业客户整车订单管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/entorder/entVehicleOrder/edit',
      name: 'entVehicleOrderEdit',
      component: () => import('@/views/vehwholesale/entorder/entVehicleOrder/edit.vue'),

      meta: {
        name: '整车销售-企业客户订单-企业客户整车订单管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/entorder/entTransactionTaxPriceConfig',
      name: 'entTransactionTaxPriceConfig',
      component: () => import('@/views/vehwholesale/entorder/entTransactionTaxPriceConfig/index.vue'),

      meta: {
        name: '整车批售-企业订单管理-关联交易计算比例管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/entorder/entTransactionTaxPriceConfig/edit',
      name: 'entTransactionTaxPriceConfigEdit',
      component: () => import('@/views/vehwholesale/entorder/entTransactionTaxPriceConfig/edit.vue'),

      meta: {
        name: '整车批售-企业订单管理-关联交易计算比例管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/activationModeConfig',
      name: 'activationModeConfig',
      component: () => import('@/views/vehretail/basicConfig/activationModeConfig/index.vue'),

      meta: {
        name: '激活模式配置',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/activationModeConfig/edit',
      name: 'activationModeConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/activationModeConfig/edit.vue'),

      meta: {
        name: '激活模式配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/basicConfig/deliveryQuestionnaireConfig',
      name: 'deliveryQuestionnaireConfig',
      component: () => import('@/views/vehretail/basicConfig/deliveryQuestionnaireConfig/index.vue'),

      meta: {
        name: '交付满意度问卷配置',
        keepAlive: true
      }
    }, {
      path: '/vehretail/basicConfig/deliveryQuestionnaireConfig/edit',
      name: 'deliveryQuestionnaireConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/deliveryQuestionnaireConfig/edit.vue'),

      meta: {
        name: '交付满意度问卷配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/deliveryInvoice',
      name: 'deliveryInvoice',
      component: () => import('@/views/vehretail/orderManager/deliveryInvoice/index.vue'),

      meta: {
        name: '整车开票记录',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/deliveryInvoice/edit',
      name: 'deliveryInvoiceEdit',
      component: () => import('@/views/vehretail/orderManager/deliveryInvoice/edit.vue'),

      meta: {
        name: '整车开票记录',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/basic/storeInventoryTransferWhitelist',
      name: 'storeInventoryTransferWhitelist',
      component: () => import('@/views/vehstock/basic/storeInventoryTransferWhitelist/index.vue'),

      meta: {
        name: '门店库存调拨白名单',
        keepAlive: true
      }
    }, {
      path: '/vehstock/basic/storeInventoryTransferWhitelist/edit',
      name: 'storeInventoryTransferWhitelistEdit',
      component: () => import('@/views/vehstock/basic/storeInventoryTransferWhitelist/edit.vue'),

      meta: {
        name: '门店库存调拨白名单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/soldPlateInfo',
      name: 'soldPlateInfo',
      component: () => import('@/views/vehretail/orderManager/soldPlateInfo/index.vue'),

      meta: {
        name: '已售上牌车辆资料',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/soldPlateInfo/edit',
      name: 'soldPlateInfoEdit',
      component: () => import('@/views/vehretail/orderManager/soldPlateInfo/edit.vue'),

      meta: {
        name: '已售上牌车辆资料详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/specialVehicleSalesReport',
      name: 'specialVehicleSalesReport',
      component: () => import('@/views/vehretail/orderManager/specialVehicleSalesReport/index.vue'),

      meta: {
        name: '特殊车辆销售提报',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/specialVehicleSalesReport/edit',
      name: 'specialVehicleSalesReportEdit',
      component: () => import('@/views/vehretail/orderManager/specialVehicleSalesReport/edit.vue'),

      meta: {
        name: '特殊车辆销售提报详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/store/storeInventoryTransfer',
      name: 'storeInventoryTransfer',
      component: () => import('@/views/vehstock/store/storeInventoryTransfer/index.vue'),

      meta: {
        name: '门店库存调拨管理',
        keepAlive: true
      }
    }, {
      path: '/vehstock/store/storeInventoryTransfer/edit',
      name: 'storeInventoryTransferEdit',
      component: () => import('@/views/vehstock/store/storeInventoryTransfer/edit.vue'),

      meta: {
        name: '门店库存调拨管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/store/storeTransferInbound',
      name: 'storeTransferInbound',
      component: () => import('@/views/vehstock/store/storeTransferInbound/index.vue'),

      meta: {
        name: '门店调拨入库',
        keepAlive: true
      }
    }, {
      path: '/vehstock/store/storeTransferInbound/edit',
      name: 'storeTransferInboundEdit',
      component: () => import('@/views/vehstock/store/storeTransferInbound/edit.vue'),

      meta: {
        name: '门店调拨入库详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/store/vehiclePurposeChangeApply',
      name: 'vehiclePurposeChangeApply',
      component: () => import('@/views/vehstock/store/vehiclePurposeChangeApply/index.vue'),

      meta: {
        name: '车辆用途变更申请',
        keepAlive: true
      }
    }, {
      path: '/vehstock/store/vehiclePurposeChangeApply/edit',
      name: 'vehiclePurposeChangeApplyEdit',
      component: () => import('@/views/vehstock/store/vehiclePurposeChangeApply/edit.vue'),

      meta: {
        name: '车辆用途变更申请详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/back/vehicleBackOrder',
      name: 'vehicleBackOrder',
      component: () => import('@/views/vehwholesale/back/vehicleBackOrder/index.vue'),

      meta: {
        name: '整车批售-批售管理-整车退车订单管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/back/vehicleBackOrder/edit',
      name: 'vehicleBackOrderEdit',
      component: () => import('@/views/vehwholesale/back/vehicleBackOrder/edit.vue'),

      meta: {
        name: '整车批售-批售管理-整车退车订单管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/back/vehicleBackOrderDetail',
      name: 'vehicleBackOrderDetail',
      component: () => import('@/views/vehwholesale/back/vehicleBackOrderDetail/index.vue'),

      meta: {
        name: '整车批售-批售管理-整车退车车辆明细管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/back/vehicleBackOrderDetail/edit',
      name: 'vehicleBackOrderDetailEdit',
      component: () => import('@/views/vehwholesale/back/vehicleBackOrderDetail/edit.vue'),

      meta: {
        name: '整车批售-批售管理-整车退车车辆明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/certificate/vehicleCertificateRedemption',
      name: 'vehicleCertificateRedemption',
      component: () => import('@/views/vehwholesale/certificate/vehicleCertificateRedemption/index.vue'),

      meta: {
        name: '车辆合格证赎回',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/certificate/vehicleCertificateRedemption/edit',
      name: 'vehicleCertificateRedemptionEdit',
      component: () => import('@/views/vehwholesale/certificate/vehicleCertificateRedemption/edit.vue'),

      meta: {
        name: '车辆合格证赎回详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/wholesale/vehicleWholesalePaymentNotice',
      name: 'vehicleWholesalePaymentNotice',
      component: () => import('@/views/vehwholesale/wholesale/vehicleWholesalePaymentNotice/index.vue'),

      meta: {
        name: '整车批售-批售管理-批售请款通知管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/wholesale/vehicleWholesalePaymentNotice/edit',
      name: 'vehicleWholesalePaymentNoticeEdit',
      component: () => import('@/views/vehwholesale/wholesale/vehicleWholesalePaymentNotice/edit.vue'),

      meta: {
        name: '整车批售-批售管理-批售请款通知管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/store/vehicleAbnormalRecord',
      name: 'vehicleAbnormalRecord',
      component: () => import('@/views/vehstock/store/vehicleAbnormalRecord/index.vue'),

      meta: {
        name: '车辆异常记录',
        keepAlive: true
      }
    }, {
      path: '/vehstock/store/storeSharedInventory',
      name: 'storeSharedInventory',
      component: () => import('@/views/vehstock/store/storeSharedInventory/index.vue'),

      meta: {
        name: '门店共享库存',
        keepAlive: true
      }
    }, {
      path: '/vehstock/store/storeSharedInventory/edit',
      name: 'storeSharedInventoryEdit',
      component: () => import('@/views/vehstock/store/storeSharedInventory/edit.vue'),

      meta: {
        name: '门店共享库存详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/store/eopMaterialDemandTotal',
      name: 'eopMaterialDemandTotal',
      component: () => import('@/views/vehstock/store/eopMaterialDemandTotal/index.vue'),

      meta: {
        name: 'EOP物料需求总量',
        keepAlive: true
      }
    }, {
      path: '/vehstock/store/eopMaterialDemandTotal/edit',
      name: 'eopMaterialDemandTotalEdit',
      component: () => import('@/views/vehstock/store/eopMaterialDemandTotal/edit.vue'),

      meta: {
        name: 'EOP物料需求总量详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/store/eopMaterialDemandTotalRecord',
      name: 'eopMaterialDemandTotalRecord',
      component: () => import('@/views/vehstock/store/eopMaterialDemandTotalRecord/index.vue'),

      meta: {
        name: 'EOP物料需求总量记录',
        keepAlive: true
      }
    }, {
      path: '/vehstock/store/eopMaterialDemandTotalRecord/edit',
      name: 'eopMaterialDemandTotalRecordEdit',
      component: () => import('@/views/vehstock/store/eopMaterialDemandTotalRecord/edit.vue'),

      meta: {
        name: 'EOP物料需求总量记录详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/store/vehicleVdcInventoryStatistics',
      name: 'vehicleVdcInventoryStatistics',
      component: () => import('@/views/vehstock/store/vehicleVdcInventoryStatistics/index.vue'),

      meta: {
        name: '整车库存存量统计',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/fund/fundAccountMonthBalance',
      name: 'FundAccountMonthBalance',
      component: () => import('@/views/vehwholesale/fund/fundAccountMonthBalance/index.vue'),
      meta: {
        name: '整车批售-整车资金-资金账户月度余额',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/fund/fundAccountMonthBalance/edit',
      name: 'FundAccountMonthBalanceEdit',
      component: () => import('@/views/vehwholesale/fund/fundAccountMonthBalance/edit.vue'),
      meta: {
        name: '整车批售-整车资金-资金账户月度余额详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundVehwhite',
      name: 'FundVehwhite',
      component: () => import('@/views/vehwholesale/fund/fundVehwhite/index.vue'),
      meta: {
        name: '整车批售-整车资金-车辆白名单管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/fund/fundVehwhite/edit',
      name: 'FundVehwhiteEdit',
      component: () => import('@/views/vehwholesale/fund/fundVehwhite/edit.vue'),
      meta: {
        name: '整车批售-整车资金-车辆白名单管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/event/eventNotifyTask',
      name: 'eventNotifyTask',
      component: () => import('@/views/vehretail/event/eventNotifyTask/index.vue'),

      meta: {
        name: '退订原因分类',
        keepAlive: true
      }
    }, {
      path: '/vehretail/event/eventNotifyTask/edit',
      name: 'eventNotifyTaskyEdit',
      component: () => import('@/views/vehretail/event/eventNotifyTask/edit.vue'),

      meta: {
        name: '退订原因分类详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/dealerCommitmentConfig',
      name: 'dealerCommitmentConfig',
      component: () => import('@/views/vehretail/orderManager/dealerCommitmentConfig/index.vue'),

      meta: {
        name: '承诺配置',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/dealerCommitmentConfig/edit',
      name: 'dealerCommitmentConfigEdit',
      component: () => import('@/views/vehretail/orderManager/dealerCommitmentConfig/edit.vue'),

      meta: {
        name: '承诺配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderManager/dealerCommitmentRecord',
      name: 'dealerCommitmentRecord',
      component: () => import('@/views/vehretail/orderManager/dealerCommitmentRecord/index.vue'),

      meta: {
        name: '承诺结果',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderManager/dealerCommitmentRecord/edit',
      name: 'dealerCommitmentRecordEdit',
      component: () => import('@/views/vehretail/orderManager/dealerCommitmentRecord/edit.vue'),

      meta: {
        name: '承诺结果详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datareport/fund/fundDealerStatementsLetter',
      name: 'fundDealerStatementsLetter',
      component: () => import('@/views/datareport/fund/fundDealerStatementsLetter/index.vue'),
      meta: {
        name: '对账函管理-经销商对账函管理',
        keepAlive: true
      }
    }, {
      path: '/datareport/fund/fundDealerStatementsLetter/edit',
      name: 'fundDealerStatementsLetterEdit',
      component: () => import('@/views/datareport/fund/fundDealerStatementsLetter/edit.vue'),
      meta: {
        name: '对账函管理-经销商对账函管理详情',
        noResourceUrl: 'true'
      }
    }]
  }
];

// 作为子应用时，重定向会导致路由出错
if (!window.__POWERED_BY_QIANKUN__) {
  routes.push({
    path: '*',
    redirect: '/404',
    hidden: true,
    meta: {
      backSwitch: 'both',
      noResourceUrl: true
    }
  });
}

function toLoginPage (to, next) {
  if (window.__POWERED_BY_QIANKUN__) {
    window.location.href = '/login?redirect=' + to.fullPath;
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
}

const appPrefix = window.APP_AIS_WEB_CONFIG.VUE_APP_ROUTER_BASE;
export function getRouter () {
  const router = new VueRouter({
    base: `${appPrefix}/`,
    mode: 'history',
    routes
  });
  let confirmInstance = null;
  router.beforeEach((to, from, next) => {
    if (to.matched?.some(record => record.meta.requiresAuth)) {
      // 需要登录
      if (!store.state.user.token || store.state.user.token === '') {
        toLoginPage(to, next);
        return;
      }
      // 开发阶段先跳过权限验证
      const sourceUrl = localStorage.getItem('sourceUrl') || '';
      if (sourceUrl.includes(to.path) || to.meta.noResourceUrl) {
        next();
      } else {
        // 防止重复弹出
        if (confirmInstance) return;
        confirmInstance = Vue.prototype.$confirm('您没有访问该页面的权限，如已经添加权限，请退出重新登录', '提示', {
          confirmButtonText: '确定',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          return logout().then(() => {
            store.commit('USER_CLICK_MENU');
            store.commit('USER_SIGN_OUT');
            // 显式跳转到登录页
            toLoginPage(to, next);
          });
        }).catch(() => {
          // logout 失败也需要清理状态
          store.commit('USER_SIGN_OUT');
          toLoginPage(to, next);
        }).finally(() => {
          confirmInstance = null;
        });
        next(from.fullPath);
      }
      return;
    }
    next();
  });
  return router;
}
