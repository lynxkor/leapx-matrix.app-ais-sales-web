import api from '@/axios';

const prefix = 'vr/web/order/vrEquityApply/';

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
export function submit (data) {
  return api.jsonPost(prefix + 'submit', data);
}

/**
 * 审核
 * @param {Object} data
 */
export function approve (data) {
  return api.jsonPost(prefix + 'approve', data);
}

/**
 * 订单权益申请整单校验
 * @param {Object} data
 */
export function selectedVehicleOrderValid (data) {
  return api.jsonPost(prefix + 'selectedVehicleOrderValid', data);
}

/**
 * 作废
 * @param {Object} data
 */
export function invalid (data) {
  return api.jsonPost(prefix + 'invalid', data);
}

/**
 * 审核撤回
 * @param {Object} data
 */
export function cancelApprove (data) {
  return api.jsonPost(prefix + 'cancelApprove', data);
}

/**
 * 订单权益申请撤销审批验证
 * @param {Object} data
 */
export function cancelApproveValid (data) {
  return api.jsonPost(prefix + 'cancelApproveValid', data);
}

/**
 * 订单权益申请审批记录查询
 * @param {Object} data
 */
export function approveRecord (data) {
  return api.jsonPost(prefix + 'approveRecord', data);
}
