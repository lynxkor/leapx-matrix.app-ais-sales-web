import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vehstock/web/store/storeInventoryLedger/';

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
 * 门店库存台账批量预留
 * @param {Object} data
 */
export function batchReserve (data) {
  return api.jsonPost(prefix + 'batchReserve', data);
}

/**
 * 门店库存台账批量解预留
 * @param {Object} data
 */
export function batchCancelReserve (data) {
  return api.jsonPost(prefix + 'batchCancelReserve', data);
}

/**
 * 门店库存台账运损车出库
 * @param {Object} data
 */
export function outbound (data) {
  return api.jsonPost(prefix + 'outbound', data);
}

/**
 * 门店库存台账同门店移库
 * @param {Object} data
 */
export function move (data) {
  return api.jsonPost(prefix + 'move', data);
}

/**
 * 车辆类型变更记录分页查询
 * @param {Object} data
 */
export function getRecord (data) {
  return api.jsonPost('vehstock/web/store/vehicleTypeChangeRecord/page', data);
};

/**
 * 门店库存台账批量车辆类型转换
 * @param {Object} data
 */
export function batchConvertType (data) {
  return api.jsonPost(prefix + 'batchConvertType', data);
}
