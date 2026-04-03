// 车辆保养
import api from '@/axios';

const prefix = '/datacenter/web/common/';

/**
 * 查询table配置
 * @param {Object} data
 */
export function getTableConfig (tableCode) {
  return api.get(prefix + 'userDefineTable/get', { tableCode });
};

/**
 * 新增或修改Table配置
 * @param {Object} data
 */
export function tableAddOrUpdate (data) {
  return api.jsonPost(prefix + 'userDefineTable/addOrUpdate', data);
}

/**
 * 列表下载模板
 * @param {*} data
 */
export function getTemplateUrl (data) {
  return api.jsonPost('/data/commonDataProcessExcelModelMap/get', data);
}

/**
 * 列表下载模板 code
 * @param {*} data
 */
export function getTemplateCode (data) {
  return api.jsonPost('/data/commonDataProcessExcelModelMap/code', data);
}

/**
 * 列表模板确认
 * @param {*} data
 */
export function importExcelConfirmFile (formData, config = {}) {
  const { businessParams, id, token, headers, ...restConfig } = config;
  // 动态构建 params 对象，使用解构和条件展开
  const params = {
    id,
    token,
    ...(businessParams && { businessParams }) // 如果 businessParams 存在，则添加到 params 中
  };
  return api.postExport('/data/ExcelManage/importExcelConfirm', formData, {
    params, // 直接使用动态构建的 params
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    ...restConfig
  });
}

/**
 * 列表导出
 * @param {*} data
 */
export function exportTable (data) {
  return api.jsonPost('/data/excelOperate/commonExport', data);
}

/**
 * 枚举通用接口
 * @param {*} data
 */
export function getEnum (code, size) {
  console.log('code:', code);
  console.log('size:', size);

  return api.jsonPost('/datacenter/web/common/commonDictValue/get', { dictType: code, pageSize: size || 200 });
}

/**
 * 根据名称或工号查询用户
 * @param {*} data
 */
export function getUserByNameOrNo (data) {
  return api.jsonPost('/accountService/user/listByNameOrEmpNo', data);
}

/**
 * 网发--门店模糊搜索
 * @param {*} data
 */
export function listStoreInfo (data) {
  return api.jsonPost('/network/portal/store/List', data);
}

/**
 * 网发--门店模糊搜索
 * @param {*} data
 */
export function listOrgStoreInfo (data) {
  return api.jsonPost('/network/portal/store/pageWithAuth', data);
}

/**
 * 门店仓库模糊搜索
 * @param {*} data
 */
export function listOrgWarehouseStoreInfo (data) {
  return api.jsonPost('/network/portal/store/warehouse/page', data);
}

/**
 * 门店详情获取通过CODE
 * @param {*} data
 */
export function getDealerDetailByCode (data) {
  return api.get(`/network/api/store/getStoreDetailByCode2R?storeCode=${data}`);
}

/**
 * 门店模糊搜索
 * @param {*} data
 */
// export function listOrgStoreInfo (data) {
//   return api.get('/accountService/orgInfo/listOrgStoreInfo', data);
// }

/**
 * 车型模糊搜索
 * @param {*} data
 */
export function listVehicleModel (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleModel/list', data);
}

/**
 * 年款模糊搜索
 * @param {*} data
 */
export function listVehicleYearType (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleYearType/list', data);
}

/**
 * 维修类型模糊搜索
 * @param {*} data
 */
export function repairItemType (data) {
  return api.jsonPost('/maintain/web/basic/repairItemType/list', data);
}

/**
 * 省模糊搜索
 * @param {*}
 */
export function getProvinceTree () {
  return api.get('/area/tree');
}

/**
 * 城市分页搜索
 * @param {*} data
 */
export function cityPage (data) {
  return api.jsonPost('/area/findPage/city', data);
}

/**
 * 城市模糊搜索
 * @param {*} data
 */
export function cityListByName (data) {
  return api.post('/area/search/city', data);
}

/**
 * 整车主数据-品牌模糊搜索
 * @param {*} data
 */
export function vehicleBrandNameList (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleBrand/list', data);
}

/**
 * 销售公告车型模糊搜索
 * @param {*} data
 */
export function vehicleSalesVersionList (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleRegisteredModel/list', data);
}

/**
 * 整车主数据-车系-列表查询
 * @param {*} data
 */
export function vehicleSeriesList (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleSeries/list', data);
}

/**
 * 整车主数据-车系-列表查询
 * @param {*} data
 */
export function vehicleSeriesListFull (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleSeries/listFull', data);
}

/**
 * 整车主数据-系列-列表查询
 * @param {*} data
 */
export function vehicleModelLineList (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleModelLine/list', data);
}

/**
 * 整车主数据-车型列表查询
 * @param {*} data
 */
export function vehicleModelList (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleModel/list', data);
}

/**
 * 整车主数据-外观列表查询
 * @param {*} data
 */
export function vehicleExterior (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleExterior/list', data);
}

/**
 * 整车主数据-内饰列表查询
 * @param {*} data
 */
export function vehicleInterior (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleInterior/list', data);
}

/**
 * 整车主数据-轮毂列表查询
 * @param {*} data
 */
export function vehicleWheelHub (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleWheelHub/list', data);
}

/**
 * 整车主数据-选装包列表查询
 * @param {*} data
 */
export function vehicleOptionPackage (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleOptionPackage/list', data);
}

/**
 * 整车主数据-电池电芯列表查询
 * @param {*} data
 */
export function vehicleBatteryCell (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleBatteryCell/list', data);
}

/**
 * 整车主数据-车顶列表查询
 * @param {*} data
 */
export function vehicleRoof (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleRoof/list', data);
}

/**
 * 整车主数据-续航里程管理
 * @param {*} data
 */
export function vehicleDrivingRange (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleDrivingRange/list', data);
}

/**
 * 整车主数据-续配动力列表查询
 * @param {*} data
 */
export function vehicleRangePower (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleRangePower/list', data);
}

/**
 * 整车主数据-整车物料列表查询
 * @param {*} data
 */
export function vehicleMaterials (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleMaterials/list', data);
}

/**
 * 仓库名称查询
 * @param {*} data
 */
export function page (data) {
  return api.jsonPost('/zcwms/base/headquartersWarehouse/page', data);
}

/**
 * 车型-年款-关联关系表列表查询
 * @param {*} data
 */
export function vehicleModelYearTypeRelation (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleModelYearTypeRelation/list', data);
}

/**
 * 车型-年款-关联关系表列表查询
 * @param {*} data
 */
export function vehicleModelYearTypeRelationDistinctYeayType (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleModelYearTypeRelation/listDistinctYearType', data);
}

/**
 * 用户登录信息查询
 * @param {*} data
 */
export function loginUserGet (data) {
  return api.jsonPost('/datacenter/web/common/loginUser/get', data);
}

/**
 * 建店类型接口 级联
 * @param {*} data
 */
export function getBuildType (data) {
  return api.get('/network/portal/DataDict/getBuildType', data);
}

/**
 * 大区列表查询
 * @param {*} data
 */
export function getRigion (data) {
  data = {
    ...data,
    orgType: '1020',
  };
  return api.jsonPost('/accountService/orgInfo/findByReginType2R', data);
}

/**
 * 母公司列表查询
 * @param {*} data
 */
export function getParentCompany (data) {
  return api.jsonPost('/network/portal/parentCompany/pageWithoutAuth', data);
}

/**
 * 销售顾问/交付顾问/交付衍生工程师 列表查询
 * @param {*} data
 */
export function searchEngineer (data) {
  return api.jsonPost('/vr/web/order/common/userList', data);
}

/**
   * 审批记录分页查询
   * @param {*} data
   */
export function approvalRecordPage (data) {
  return api.jsonPost('/vehstock/web/basic/approvalRecord/page', data);
}
