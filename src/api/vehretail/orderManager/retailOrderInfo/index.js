import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vr/web/order/retailOrderInfo/';

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
 * 获取可解绑的整车订单信息列表
 * @param {Object} data
 */
export function findCanUnlockOrderList (data) {
  return api.jsonPost(prefix + 'findCanUnlockOrderList', data);
}

/**
 * 取消锁车-申请原因
 * @param {Object} data
 */
export function unlockReasonList (data) {
  return api.jsonPost('vr/web/order/unlockReasonList', data);
};

/**
 * 取消锁车-单车提交
 * @param {Object} data
 */
export function perUnlock (data) {
  return api.jsonPost('vr/web/order/perUnlock', data);
};

/**
 * 取消锁车-手工配车
 * @param {Object} data
 */
export function manualLock (data) {
  return api.jsonPost('vr/web/order/manualLock', data);
};

/**
 * 查询订单状态接口
 * @param {Object} data
 */
export function orderStatusNodes (data) {
  return api.jsonPost('vr/web/order/retailOrderInfo/orderStatus/nodes', data);
};
