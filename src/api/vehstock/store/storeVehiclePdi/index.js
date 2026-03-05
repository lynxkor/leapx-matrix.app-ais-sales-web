import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vehstock/web/store/storeVehiclePdi/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 新增或修改
 * @param {Object} data
 */
export function addOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 删除
 * @param {Array<Number>} data
 */
export function deleteItem (data) {
  return api.jsonPost(prefix + 'delete', data);
}

/**
 * 查询
 * @param {Object} data
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}

/**
 * 启用停用
 * @param {Object} data
 */
export function enableItem (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}
/**
 * 门店整车PDI单检查项结果信息分页查询
 * @param {Object} data
 */
export function storeVehiclePdiCheckItemPage (data) {
  return api.jsonPost('vehstock/web/store/storeVehiclePdiCheckItem/page', data);
}
/**
 * 门店整车PDI单导出pdf
 */
export function getPdiEntryDetails (data) {
  return api.jsonPost('vehstock/web/store/storeVehiclePdi/getPdiEntryDetails', data);
}
