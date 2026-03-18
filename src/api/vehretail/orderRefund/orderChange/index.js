import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vr/web/order/retailOrderChangeApply/';

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
 * 变更申请作废
 * @param {Object} data
 */
export function cancel (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

/**
 * 变更申请提交审核
 * @param {Object} data
 */
export function submit (data) {
  return api.jsonPost(prefix + 'submit', data);
}

/**
 * 变更申请审核
 * @param {Object} data
 */
export function audit (data) {
  return api.jsonPost(prefix + 'audit', data);
}

/**
 * 合法性校验
 * @param {Object} data
 */
export function legalVerification (data) {
  return api.jsonPost(prefix + 'legalVerification', data);
}
