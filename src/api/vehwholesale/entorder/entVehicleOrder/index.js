import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vw/web/entorder/entVehicleOrder/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 聚合查询列表
 * @param {Object} data
 */
export function fastSearchPage (data) {
  return api.jsonPost(prefix + 'fastSearch', data);
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
 * 批量配车
 * @param {Object} data
 */
export function batchAllocateSubmit (data) {
  return api.jsonPost(prefix + 'batchAllocateSubmit', data);
}

/**
 * 批量取消配车
 * @param {Object} data
 */
export function batchCancelAllocateSubmit (data) {
  return api.jsonPost(prefix + 'batchCancelAllocateSubmit', data);
}

/**
 * 批量结算
 * @param {Object} data
 */
export function batchSettleSubmit (data) {
  return api.jsonPost(prefix + 'batchSettleSubmit', data);
}

/**
 * 批量取消结算
 * @param {Object} data
 */
export function batchCancelSettleSubmit (data) {
  return api.jsonPost(prefix + 'batchCancelSettleSubmit', data);
}

/**
 * 批量作废
 * @param {Object} data
 */
export function batchCancelOrders (data) {
  return api.jsonPost(prefix + 'batchCancelOrders', data);
}

/**
 * 配车查询库存
 * @param {Object} data
 */
export function vinAllocateVehicleQueryInventory (data) {
  return api.jsonPost(prefix + 'vinAllocateVehicleQueryInventory', data);
}

/**
 * 批量设置/取消自动配车
 * @param {Object} data
 */
export function setAutoAllocate (data) {
  return api.jsonPost(prefix + 'setAutoAllocate', data);
}

/**
 * 批量设置/取消急单
 * @param {Object} data
 */
export function setEmergencyOrder (data) {
  return api.jsonPost(prefix + 'setEmergencyOrder', data);
}

/**
 * 配车
 * @param {Object} data
 */
export function vinAllocateVehicleItem (data) {
  return api.jsonPost(prefix + 'vinAllocateVehicle', data);
}

/**
 * 查询SAP账户余额
 * @param {Object} data
 */
export function querySAPAccountBalance (data) {
  return api.jsonPost(prefix + 'querySAPAccountBalance', data);
}

/**
 * 整车批售-企业客户订单-编辑备注
 * @param {Object} data
 */
export function editRemark (data) {
  return api.jsonPost(prefix + 'editRemark', data);
}

/**
 * 整车批售-企业客户订单-设置资金类型弹框查询可用的资金账户类型
 * @param {Object} data
 */
export function queryEntCustomerFundTypes (data) {
  return api.jsonPost(prefix + 'queryEntCustomerFundTypes', data);
}

/**
 * 整车批售-企业客户订单-设置资金类型
 * @param {Object} data
 */
export function setSettleFundType (data) {
  return api.jsonPost(prefix + 'setSettleFundType', data);
}
