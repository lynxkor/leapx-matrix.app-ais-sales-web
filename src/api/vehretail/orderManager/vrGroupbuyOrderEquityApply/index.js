import api from '@/axios';

const prefix = 'vr/web/order/vrGroupbuyOrderEquityApply/';

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
 * 团购订单权益申请步骤条信息查询
 * @param {Object} data
 */
export function queryStepInfo (data) {
  return api.jsonPost(prefix + 'queryStepInfo', data);
}

/**
 * 团购订单权益申请审核人员查询
 * @param {Object} data
 */
export function queryAuditor (data) {
  return api.jsonPost(prefix + 'queryAuditor', data);
}

/**
 * 提交审批
 * @param {Object} data
 */
export function submit (data) {
  return api.jsonPost(prefix + 'submit', data);
}

/**
 * 审批
 * @param {Object} data
 */
export function firstApprove (data) {
  return api.jsonPost(prefix + 'firstApprove', data);
}

/**
 * 审批
 * @param {Object} data
 */
export function secondApprove (data) {
  return api.jsonPost(prefix + 'secondApprove', data);
}

/**
 * 审批
 * @param {Object} data
 */
export function finalApprove (data) {
  return api.jsonPost(prefix + 'finalApprove', data);
}

/*
 * 获取审批明细
 * @param {Object} data
 */
export function getApprovalDetailList (data) {
  return api.jsonPost(prefix + 'getApprovalDetailList', data);
}

/**
 * 作废
 * @param {Object} data
 */
export function invalid (data) {
  return api.jsonPost(prefix + 'invalid', data);
}

/**
 * 团购订单权益申请整车订单号校验
 * @param {Object} data
 */
export function selectedVehicleOrderValid (data) {
  return api.jsonPost(prefix + 'selectedVehicleOrderValid', data);
}
