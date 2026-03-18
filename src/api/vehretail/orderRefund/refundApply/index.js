import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vr/web/refund/retailOrderRefund/';

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
 * 作废
 * @param {Object} data
 */
export function cancel (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

/**
 * 提交至审核
 * @param {Object} data
 */
export function submit (data) {
  return api.jsonPost(prefix + 'submit', data);
}

/**
 * 提交初审内容
 * @param {Object} data
 */
export function preApprove (data) {
  return api.jsonPost(prefix + 'preApprove', data);
}

/**
 * 提交审核内容
 * @param {Object} data
 */
export function approve (data) {
  return api.jsonPost(prefix + 'approve', data);
}

/**
 * 提交终审内容
 * @param {Object} data
 */
export function finalApprove (data) {
  return api.jsonPost(prefix + 'finalApprove', data);
}

/**
 * 批量审核
 * @param {Object} data
 */
export function batchAudit (data) {
  return api.jsonPost(prefix + 'batchAudit', data);
}

/**
 * 合法性校验
 * @param {Object} data
 */
export function legalVerification (data) {
  return api.jsonPost(prefix + 'legalVerification', data);
}
