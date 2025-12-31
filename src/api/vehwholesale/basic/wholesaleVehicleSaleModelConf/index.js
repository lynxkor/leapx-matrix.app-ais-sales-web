import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vw/web/basic/wholesaleVehicleSaleModelConf/';

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
 * 批量编辑
 * @param {Object} data
 */
export function batchEdit (data) {
  return api.jsonPost(prefix + 'batchEdit', data);
}

/**
 * 批量编辑校验
 * @param {Object} data
 */
export function batchEditValid (data) {
  return api.jsonPost(prefix + 'batchEditValid', data);
}

/**
 * 批量审核
 * @param {Object} data
 */
export function batchAudit (data) {
  return api.jsonPost(prefix + 'batchAudit', data);
}

/**
 * 批量提交
 * @param {Object} data
 */
export function batchSubmit (data) {
  return api.jsonPost(prefix + 'batchSubmit', data);
}

/**
 * 批量审核校验
 * @param {Object} data
 */
export function batchAuditValid (data) {
  return api.jsonPost(prefix + 'batchAuditValid', data);
}

/**
 * 批量提交校验
 * @param {Object} data
 */
export function batchSubmitValid (data) {
  return api.jsonPost(prefix + 'batchSubmitValid', data);
}
