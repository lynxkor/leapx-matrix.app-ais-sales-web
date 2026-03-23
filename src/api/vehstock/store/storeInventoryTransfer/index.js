import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vehstock/web/store/storeInventoryTransfer/';

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
 * 门店库存调拨调出审批
 * @param {Object} data
 */
export function approveOut (data) {
  return api.jsonPost(prefix + 'approveOut', data);
}

/**
 * 门店库存调拨调入审批
 * @param {Object} data
 */
export function approveIn (data) {
  return api.jsonPost(prefix + 'approveIn', data);
}

/**
 * 门店库存调拨提交
 * @param {Object} data
 */
export function storeSubmit (data) {
  return api.jsonPost(prefix + 'submit', data);
}

/**
 * 门店库存调拨作废
 * @param {Object} data
 */
export function storeInvalid (data) {
  return api.jsonPost(prefix + 'invalid', data);
}
