import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vehstock/web/store/storeSharedInventory/';

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
 * 门店共享库存表发布
 * @param {Object} data
 */
export function publishItem (data) {
  return api.jsonPost(prefix + 'publish', data);
}

/**
 * 门店共享库存表下架
 * @param {Object} data
 */
export function offShelfItem (data) {
  return api.jsonPost(prefix + 'offShelf', data);
}

/**
 * 门店共享库存表作废
 * @param {Object} data
 */
export function invalidItem (data) {
  return api.jsonPost(prefix + 'invalid', data);
}
