import api from '@/axios';

const prefix = 'vr/web/orderManager/vrEquityApply/';

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
 * 提交审批
 * @param {Object} data
 */
export function submitApproval (data) {
  return api.jsonPost(prefix + 'submitApproval', data);
}

/**
 * 初审
 * @param {Object} data
 */
export function firstAudit (data) {
  return api.jsonPost(prefix + 'firstAudit', data);
}

/**
 * 审核
 * @param {Object} data
 */
export function audit (data) {
  return api.jsonPost(prefix + 'audit', data);
}

/**
 * 作废
 * @param {Object} data
 */
export function cancelItem (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

/**
 * 审核撤回
 * @param {Object} data
 */
export function recallApproval (data) {
  return api.jsonPost(prefix + 'recallApproval', data);
}

/**
 * 上传附件
 * @param {FormData} data
 */
export function uploadAttachment (data) {
  return api.post(prefix + 'uploadAttachment', data);
}
