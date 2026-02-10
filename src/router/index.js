import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './../store';

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
      path: '/vehstock/basic/vehiclereservationconfig/detail',
      name: 'vehicleReservationConfigDetail',
      component: () => import('@/views/vehstock/basic/vehicleReservationConfig/detail.vue'),

      meta: {
        name: '车辆预留配置详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/basic/vehiclereservationconfig/edit',
      name: 'vehicleReservationConfigEdit',
      component: () => import('@/views/vehstock/basic/vehicleReservationConfig/edit.vue'),

      meta: {
        name: '车辆预留配置详情',
        noResourceUrl: 'true'
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
      path: '/vehstock/basic/vehiclereservationdetail/detail',
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
      path: '/vehstock/basic/warehousevehiclerelation/detail',
      name: 'warehouseVehicleRelationDetail',
      component: () => import('@/views/vehstock/basic/warehouseVehicleRelation/detail.vue'),

      meta: {
        name: '仓库配车关系详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/basic/warehousevehiclerelation/edit',
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
      path: '/datacenter/materials/vehiclebrand/detail',
      name: 'vehicleBrandDetail',
      component: () => import('@/views/datacenter/materials/vehicleBrand/detail.vue'),

      meta: {
        name: '整车主数据-品牌管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehiclebrand/edit',
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
      path: '/datacenter/materials/vehiclemodelline/detail',
      name: 'vehicleModelLineDetail',
      component: () => import('@/views/datacenter/materials/vehicleModelLine/detail.vue'),

      meta: {
        name: '整车主数据-系列管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehiclemodelline/edit',
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
      path: '/datacenter/materials/vehicleoptionpackage/detail',
      name: 'vehicleOptionPackageDetail',
      component: () => import('@/views/datacenter/materials/vehicleOptionPackage/detail.vue'),

      meta: {
        name: '整车主数据-选装包管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleoptionpackage/edit',
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
      path: '/datacenter/materials/vehicleregisteredmodel/detail',
      name: 'vehicleRegisteredModelDetail',
      component: () => import('@/views/datacenter/materials/vehicleRegisteredModel/detail.vue'),

      meta: {
        name: '整车主数据-公告车型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleregisteredmodel/edit',
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
      path: '/datacenter/materials/vehicleroof/detail',
      name: 'vehicleRoofDetail',
      component: () => import('@/views/datacenter/materials/vehicleRoof/detail.vue'),

      meta: {
        name: '整车主数据-车顶管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleroof/edit',
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
      path: '/datacenter/materials/vehiclebatterycell/detail',
      name: 'vehicleBatteryCellDetail',
      component: () => import('@/views/datacenter/materials/vehicleBatteryCell/detail.vue'),

      meta: {
        name: '整车主数据-电池电芯管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehiclebatterycell/edit',
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
      path: '/datacenter/materials/vehicleyeartype/detail',
      name: 'vehicleYearTypeDetail',
      component: () => import('@/views/datacenter/materials/vehicleYearType/detail.vue'),

      meta: {
        name: '整车主数据-年款管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleyeartype/edit',
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
      path: '/datacenter/materials/vehiclerangepower/detail',
      name: 'vehicleRangePowerDetail',
      component: () => import('@/views/datacenter/materials/vehicleRangePower/detail.vue'),

      meta: {
        name: '整车主数据-续配动力管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehiclerangepower/edit',
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
      path: '/datacenter/materials/vehiclewheelhub/detail',
      name: 'vehicleWheelHubDetail',
      component: () => import('@/views/datacenter/materials/vehicleWheelHub/detail.vue'),

      meta: {
        name: '整车主数据-轮毂管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehiclewheelhub/edit',
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
      path: '/datacenter/materials/vehicleexterior/detail',
      name: 'vehicleExteriorDetail',
      component: () => import('@/views/datacenter/materials/vehicleExterior/detail.vue'),

      meta: {
        name: '整车主数据-外观管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleexterior/edit',
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
      path: '/datacenter/materials/vehicleinterior/detail',
      name: 'vehicleInteriorDetail',
      component: () => import('@/views/datacenter/materials/vehicleInterior/detail.vue'),

      meta: {
        name: '整车主数据-内饰管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleinterior/edit',
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
      path: '/datacenter/materials/vehicledrivingrange/detail',
      name: 'vehicleDrivingRangeDetail',
      component: () => import('@/views/datacenter/materials/vehicleDrivingRange/detail.vue'),

      meta: {
        name: '整车主数据-续航里程管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicledrivingrange/edit',
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
      path: '/datacenter/materials/vehiclematerials/detail',
      name: 'vehicleMaterialsDetail',
      component: () => import('@/views/datacenter/materials/vehicleMaterials/detail.vue'),

      meta: {
        name: '整车主数据-整车物料管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehiclematerials/edit',
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
      path: '/datacenter/materials/vehiclematerialsmatch/detail',
      name: 'vehicleMaterialsMatchDetail',
      component: () => import('@/views/datacenter/materials/vehicleMaterialsMatch/detail.vue'),

      meta: {
        name: '整车主数据-物料可配关系管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehiclematerialsmatch/edit',
      name: 'vehicleMaterialsMatchEdit',
      component: () => import('@/views/datacenter/materials/vehicleMaterialsMatch/edit.vue'),

      meta: {
        name: '整车主数据-物料可配关系管理详情',
        noResourceUrl: 'true'
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
      path: '/datacenter/materials/vehicleseries/detail',
      name: 'vehicleSeriesDetail',
      component: () => import('@/views/datacenter/materials/vehicleSeries/detail.vue'),

      meta: {
        name: '整车主数据-车系管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehicleseries/edit',
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
      path: '/datacenter/materials/vehiclemodel/detail',
      name: 'vehicleModelDetail',
      component: () => import('@/views/datacenter/materials/vehicleModel/detail.vue'),

      meta: {
        name: '整车主数据-车型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehiclemodel/edit',
      name: 'vehicleModelEdit',
      component: () => import('@/views/datacenter/materials/vehicleModel/edit.vue'),

      meta: {
        name: '整车主数据-车型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/materials/vehiclemodel/edit',
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
      path: '/vehwholesale/fund/fundbudgetitem/detail',
      name: 'fundBudgetItemDetail',
      component: () => import('@/views/vehwholesale/fund/fundBudgetItem/detail.vue'),

      meta: {
        name: '账户管理-基础配置-预算科目管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundbudgetitem/edit',
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
      path: '/vehwholesale/fund/fundfeesupporttype/detail',
      name: 'fundFeeSupportTypeDetail',
      component: () => import('@/views/vehwholesale/fund/fundFeeSupportType/detail.vue'),

      meta: {
        name: '账户管理-基础配置-费用支持类型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundfeesupporttype/edit',
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
      path: '/vehwholesale/fund/fundrebatereturnconfig/detail',
      name: 'fundRebateReturnConfigDetail',
      component: () => import('@/views/vehwholesale/fund/fundRebateReturnConfig/detail.vue'),

      meta: {
        name: '账户管理-基础配置-返利自动返还设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundrebatereturnconfig/edit',
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
      path: '/vehwholesale/fund/fundfinancialorganization/detail',
      name: 'fundFinancialOrganizationDetail',
      component: () => import('@/views/vehwholesale/fund/fundFinancialOrganization/detail.vue'),

      meta: {
        name: '账户管理-基础配置-金融机构管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundfinancialorganization/edit',
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
      path: '/vehwholesale/fund/fundsalecompany/detail',
      name: 'fundSaleCompanyDetail',
      component: () => import('@/views/vehwholesale/fund/fundSaleCompany/detail.vue'),

      meta: {
        name: '账户管理-基础配置-销售公司管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/fund/fundsalecompany/edit',
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
      path: '/vehwholesale/basic/wholesaletestdrivepurchaseconf/detail',
      name: 'wholesaleTestDrivePurchaseConfDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleTestDrivePurchaseConf/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-试驾车采购配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaletestdrivepurchaseconf/edit',
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
      path: '/vehwholesale/basic/wholesalesaletargettracking/detail',
      name: 'wholesaleSaleTargetTrackingDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleSaleTargetTracking/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-销售目标跟踪管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesalesaletargettracking/wholesaleEdit',
      name: 'wholesaleSaleTargetTrackingWholesaleEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleSaleTargetTracking/wholesaleEdit.vue'),

      meta: {
        name: '整车批售-批售主数据-销售目标跟踪管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesalesaletargettracking/retailEdit',
      name: 'wholesaleSaleTargetTrackingRetailEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleSaleTargetTracking/retailEdit.vue'),

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
      path: '/vehwholesale/basic/wholesalenoautocarmodelconf/detail',
      name: 'wholesaleNoAutoCarModelConfDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleNoAutoCarModelConf/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-不自动批售确认车型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesalenoautocarmodelconf/edit',
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
      path: '/vehwholesale/basic/wholesaletargetdefaultquota/detail',
      name: 'wholesaleTargetDefaultQuotaDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleTargetDefaultQuota/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-批售目标默认配额管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaletargetdefaultquota/edit',
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
      path: '/vehwholesale/basic/wholesaletestdrivequota/detail',
      name: 'wholesaleTestDriveQuotaDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleTestDriveQuota/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-试驾车默认配额管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaletestdrivequota/edit',
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
      path: '/vehwholesale/basic/wholesaledealerautoconfirmconf/detail',
      name: 'wholesaleDealerAutoConfirmConfDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleDealerAutoConfirmConf/detail.vue'),

      meta: {
        name: '新页面详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaledealerautoconfirmconf/edit',
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
      path: '/vehwholesale/basic/wholesaledealerwholesaleconf/detail',
      name: 'wholesaleDealerWholesaleConfDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleDealerWholesaleConf/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-门店批售设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesaledealerwholesaleconf/edit',
      name: 'wholesaleDealerWholesaleConfEdit',
      component: () => import('@/views/vehwholesale/basic/wholesaleDealerWholesaleConf/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-门店批售设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/dealerDemoVehicleQuotaRecord',
      name: 'dealerDemoVehicleQuotaRecord',
      component: () => import('@/views/vehwholesale/basic/dealerDemoVehicleQuotaRecord/index.vue'),

      meta: {
        name: '整车批售-批售主数据-门店试驾车配额调整记录管理',
        keepAlive: true
      }
    }, {
      path: '/vehwholesale/basic/dealerdemovehiclequotarecord/detail',
      name: 'dealerDemoVehicleQuotaRecordDetail',
      component: () => import('@/views/vehwholesale/basic/dealerDemoVehicleQuotaRecord/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-门店试驾车配额调整记录管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/dealerdemovehiclequotarecord/edit',
      name: 'dealerDemoVehicleQuotaRecordEdit',
      component: () => import('@/views/vehwholesale/basic/dealerDemoVehicleQuotaRecord/edit.vue'),

      meta: {
        name: '整车批售-批售主数据-门店试驾车配额调整记录管理详情',
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
      path: '/vehwholesale/basic/wholesalevehiclesalemodelconf/detail',
      name: 'wholesaleVehicleSaleModelConfDetail',
      component: () => import('@/views/vehwholesale/basic/wholesaleVehicleSaleModelConf/detail.vue'),

      meta: {
        name: '整车批售-批售主数据-整车销售模式配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/basic/wholesalevehiclesalemodelconf/edit',
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
      path: '/vehstock/vdc/vehiclevdcinventoryledger/detail',
      name: 'vehicleVdcInventoryLedgerDetail',
      component: () => import('@/views/vehstock/vdc/vehicleVdcInventoryLedger/detail.vue'),

      meta: {
        name: 'VDC库存台账详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehstock/vdc/vehiclevdcinventoryledger/edit',
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
      path: '/vehretail/productmanager/productSkuPrice/detail',
      name: 'productManagerDetail',
      component: () => import('@/views/vehretail/productManager/productSkuPrice/detail.vue'),

      meta: {
        name: '销售管理-商品管理-商品SKU价格维护管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/productmanager/productSkuPrice/edit',
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
      path: '/vehretail/productmanager/productcenter/detail',
      name: 'productCenterDetail',
      component: () => import('@/views/vehretail/productManager/productCenter/detail.vue'),

      meta: {
        name: '销售管理-商品管理-商品中心管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/productmanager/productcenter/edit',
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
      path: '/vehwholesale/rebate/fundvehiclerebatebill/detail',
      name: 'fundVehicleRebateBillDetail',
      component: () => import('@/views/vehwholesale/rebate/fundVehicleRebateBill/detail.vue'),

      meta: {
        name: '账户管理-整车返利-整车返利核算单明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/rebate/fundvehiclerebatebill/edit',
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
      path: '/vehwholesale/rebate/fundvehiclerebatebilldetail/detail',
      name: 'fundVehicleRebateBillDetailDetail',
      component: () => import('@/views/vehwholesale/rebate/fundVehicleRebateBillDetail/detail.vue'),

      meta: {
        name: '账户管理-整车返利-整车返利核算单明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/rebate/fundvehiclerebatebilldetail/edit',
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
      path: '/vehwholesale/creditsales/fundowncreditsaleslimit/detail',
      name: 'fundOwnCreditSalesLimitDetail',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesLimit/detail.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销额度管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundowncreditsaleslimit/edit',
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
      path: '/vehwholesale/creditsales/fundowncreditsalesconfig/detail',
      name: 'fundOwnCreditSalesConfigDetail',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesConfig/detail.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundowncreditsalesconfig/edit',
      name: 'fundOwnCreditSalesConfigReview',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesConfig/edit.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销配置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundowncreditsalesconfig/review',
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
      path: '/vehwholesale/creditsales/fundcreditsalesfeeconfig/detail',
      name: 'fundCreditSalesFeeConfigDetail',
      component: () => import('@/views/vehwholesale/creditsales/fundCreditSalesFeeConfig/detail.vue'),

      meta: {
        name: '账户管理-赊销管理-赊销资费设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundcreditsalesfeeconfig/edit',
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
      path: '/vehwholesale/creditsales/fundowncreditsalesdetail/edit',
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
      path: '/vehwholesale/creditsales/fundowncreditsalesdetail/detail',
      name: 'fundOwnCreditSalesDetailDetail',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesDetail/detail.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundowncreditsalesdetail/edit',
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
      path: '/vehwholesale/creditsales/fundowncreditsalesdetail/detail',
      name: 'fundOwnCreditSalesDetailDetail',
      component: () => import('@/views/vehwholesale/creditsales/fundOwnCreditSalesDetail/detail.vue'),

      meta: {
        name: '账户管理-赊销管理-自有资金赊销明细管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehwholesale/creditsales/fundowncreditsalesdetail/edit',
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
      path: '/vehwholesale/basic/wholesaleprodscheduleactivity/edit',
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
      path: '/vehwholesale/basic/wholesaleprodscheduleactivity/edit',
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
      path: '/vehwholesale/basic/wholesaleprodscheduleactivitydetail/edit',
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
        name: '整车批售-批售主数据-整车批售订单管理',
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
      path: '/vehstock/store/vehiclepdicheckitemconfig/edit',
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
      path: '/vehstock/store/storevehiclepdi/edit',
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
      path: '/vehstock/store/storeinventoryledger/edit',
      name: 'storeInventoryLedgerEdit',
      component: () => import('@/views/vehstock/store/storeInventoryLedger/edit.vue'),

      meta: {
        name: '门店库存台账单详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderRefund/category',
      name: 'orderRefund',
      component: () => import('@/views/vehretail/orderRefund/category/index.vue'),

      meta: {
        name: '退订原因分类',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderRefund/category/edit',
      name: 'orderRefundEdit',
      component: () => import('@/views/vehretail/orderRefund/category/edit.vue'),

      meta: {
        name: '退订原因分类详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderRefund/categoryDetail',
      name: 'subCategory',
      component: () => import('@/views/vehretail/orderRefund/categoryDetail/index.vue'),

      meta: {
        name: '原因二级分类',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderRefund/categoryDetail/edit',
      name: 'subCategoryEdit',
      component: () => import('@/views/vehretail/orderRefund/categoryDetail/edit.vue'),

      meta: {
        name: '原因二级分类详情',
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
      path: '/vehwholesale/finance/bank/finbankfinancingrecord/edit',
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
      path: '/vehwholesale/finance/bank/fincustomerrepaymentrecord/edit',
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
      path: '/vehwholesale/finance/bank/finbankvehiclerepaymentrecord/edit',
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
      path: '/vehwholesale/finance/factory/finvehiclebindingmileagerecord/edit',
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
      path: '/vehwholesale/finance/factory/finvehiclestatusrecord/edit',
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
      path: '/vehwholesale/finance/apply/finfinancingapplicationdealer/edit',
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
      path: '/vehwholesale/finance/factory/fincustomerpurchaserecord/edit',
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
      path: '/vehwholesale/finance/factory/findealerrecommendation/edit',
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
      path: '/vehretail/ordermanager/orderunlockapply/edit',
      name: 'orderUnlockApplyEdit',
      component: () => import('@/views/vehretail/orderManager/orderUnlockApply/edit.vue'),

      meta: {
        name: '订单锁车解绑申请记录管理详情',
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
      path: '/vehretail/basicconfig/retailorderunlockconfig/edit',
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
      path: '/vehretail/basicconfig/retailorderunlockreasonconfig/edit',
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
      path: '/vehretail/ordermanager/retailorderinfo/edit',
      name: 'retailOrderInfoEdit',
      component: () => import('@/views/vehretail/orderManager/retailOrderInfo/edit.vue'),

      meta: {
        name: '整车零售订单管理详情',
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
      path: '/vehretail/basicconfig/deliverycycletimeconfig/edit',
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
      path: '/vehretail/orderManager/orderConfigChange',
      name: 'orderConfigChange',
      component: () => import('@/views/vehretail/orderManager/orderConfigChange/index.vue'),

      meta: {
        name: '订单改配信息管理',
        keepAlive: true
      }
    }, {
      path: '/vehretail/ordermanager/orderconfigchange/edit',
      name: 'orderConfigChangeEdit',
      component: () => import('@/views/vehretail/orderManager/orderConfigChange/edit.vue'),

      meta: {
        name: '订单改配信息管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/vehretail/orderRefund/changeApply',
      name: 'orderChange',
      component: () => import('@/views/vehretail/orderRefund/changeApply/index.vue'),

      meta: {
        name: '订单信息变更申请',
        keepAlive: true
      }
    }, {
      path: '/vehretail/orderRefund/changeApply/edit',
      name: 'orderChangeEdit',
      component: () => import('@/views/vehretail/orderRefund/changeApply/edit.vue'),

      meta: {
        name: '订单信息变更申请详情',
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
      path: '/vehretail/basicconfig/modeldeliveryconfig/edit',
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
      path: '/vehretail/basicconfig/productionofflineconfig/edit',
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
      path: '/vehretail/basicconfig/orderurgentconfig/edit',
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
      path: '/vehretail/basicconfig/lockcarshareconfig/edit',
      name: 'lockCarShareConfigEdit',
      component: () => import('@/views/vehretail/basicConfig/lockCarShareConfig/edit.vue'),

      meta: {
        name: '锁车资源共享配置管理详情',
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

const appPrefix = process.env.VUE_APP_ROUTER_BASE;
export function getRouter () {
  const router = new VueRouter({
    base: `${appPrefix}/`,
    mode: 'history',
    routes
  });
  router.beforeEach((to, from, next) => {
    if (to.matched?.some(record => record.meta.requiresAuth)) {
      // 需要登录
      if (!store.state.user.token || store.state.user.token === '') {
        toLoginPage(to, next);
        return;
      }
      // 开发阶段先跳过权限验证
      if (localStorage.getItem('sourceUrl').includes(to.path) || to.meta.noResourceUrl) {
      // if (true) {
        next();
      } else {
        window.alert('你没有访问该页面的权限');
        if (store.state.user.token) {
          next({
            path: '/404'
          });
        } else {
          toLoginPage(to, next);
        }
      }
    }
    next();
  });
  return router;
}
