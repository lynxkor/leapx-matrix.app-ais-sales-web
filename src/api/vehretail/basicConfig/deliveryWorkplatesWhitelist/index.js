import api from '@/axios';

const prefix = 'vr/web/delivery/deliveryWorkplatesWhitelist/';

/**
 * 分页查询
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
}

/**
 * 列表查询
 * @param {Object} data
 */
export function getAllList (data) {
  return api.jsonPost(prefix + 'list', data);
}

/**
 * 新增或修改
 * @param {Object} data
 */
export function addOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 删除
 * @param {Array<String>} data
 */
export function deleteItem (data) {
  return api.jsonPost(prefix + 'delete', data);
}

/**
 * 详情
 * @param {String} data
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}

/**
 * 启用/禁用
 * @param {Object} data
 */
export function enableOrDisable (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}
