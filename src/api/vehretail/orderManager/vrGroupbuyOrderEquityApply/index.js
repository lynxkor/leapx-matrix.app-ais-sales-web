import api from '@/axios';

const prefix = 'vehretail/web/orderManager/vrGroupbuyOrderEquityApply/';

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
 * 复审
 * @param {Object} data
 */
export function reviewAudit (data) {
  return api.jsonPost(prefix + 'reviewAudit', data);
}

/**
 * 终审
 * @param {Object} data
 */
export function finalAudit (data) {
  return api.jsonPost(prefix + 'finalAudit', data);
}

/**
 * 获取审核人员列表
 * @param {Object} data
 */
export function getAuditUsers (data) {
  return api.jsonPost(prefix + 'getAuditUsers', data);
}

/**
 * 获取审批明细
 * @param {Object} data
 */
export function getApprovalDetailList (data) {
  return api.jsonPost(prefix + 'getApprovalDetailList', data);
}
