import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vw/web/entorder/entVehicleOrder/';

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
 * 批量配车
 * @param {Object} data
 */
export function batchAllocateSubmit (data) {
  return api.jsonPost(prefix + 'batchAllocateSubmit', data);
}

/**
 * 批量取消配车
 * @param {Object} data
 */
export function batchCancelAllocateSubmit (data) {
  return api.jsonPost(prefix + 'batchCancelAllocateSubmit', data);
}

/**
 * 批量结算
 * @param {Object} data
 */
export function batchSettleSubmit (data) {
  return api.jsonPost(prefix + 'batchSettleSubmit', data);
}

/**
 * 批量取消结算
 * @param {Object} data
 */
export function batchCancelSettleSubmit (data) {
  return api.jsonPost(prefix + 'batchCancelSettleSubmit', data);
}

/**
 * 批量作废
 * @param {Object} data
 */
export function batchCancelOrders (data) {
  return api.jsonPost(prefix + 'batchCancelOrders', data);
}
