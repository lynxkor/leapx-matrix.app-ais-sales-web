import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vw/web/wholesale/vehicleWholesaleOrder/';

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
 * 批量确认
 * @param {Object} data
 */
export function batchConfirmItem (data) {
  return api.jsonPost(prefix + 'batchConfirm', data);
}

/**
 * 设置急单
 * @param {Object} data
 */
export function setEmergencyOrderItem (data) {
  return api.jsonPost(prefix + 'setEmergencyOrder', data);
}

/**
 * 批量作废
 * @param {Object} data
 */
export function batchCancelItem (data) {
  return api.jsonPost(prefix + 'batchCancel', data);
}

/**
 * 配车或取消自动配车
 * @param {Object} data
 */
export function batchSetAutoAllocateItem (data) {
  return api.jsonPost(prefix + 'batchSetAutoAllocate', data);
}

/**
 * 批量结算
 * @param {Object} data
 */

export function batchSettleSubmitItem (data) {
  return api.jsonPost(prefix + 'batchSettleSubmit', data);
}

/**
 * 批量取消结算
 * @param {Object} data
 */

export function batchCancelSettleItem (data) {
  return api.jsonPost(prefix + 'batchCancelSettle', data);
}

/**
 * 指定VIN配车-提交配车
 * @param {Object} data
 */

export function vinAllocateVehicleSubmitItem (data) {
  return api.jsonPost(prefix + 'vinAllocateVehicleSubmit', data);
}

/**
 * 批量配车
 * @param {Object} data
 */

export function batchAllocateVehicleItem (data) {
  return api.jsonPost(prefix + 'batchAllocateVehicle', data);
}
