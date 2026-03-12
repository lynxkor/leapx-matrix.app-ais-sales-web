import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vw/web/replenish/entVehicleReplenishOrder/';

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
 * 获取当前登录用户可操作的部门
 * @param {Object} data
 */

export function listDealersForParentCompany (data) {
  return api.jsonPost(prefix + 'listDealersForParentCompany', data);
}

/**
 * 提交审核
 * @param {Object} data
 */

export function batchSubmitAudit (data) {
  return api.jsonPost(prefix + 'batchSubmitAudit', data);
}

/**
 * 审核通过或者审核驳回
 * @param {Object} data
 */

export function batchAudit (data) {
  return api.jsonPost(prefix + 'batchAudit', data);
}

/**
 * 作废
 * @param {Object} data
 */

export function batchCancel (data) {
  return api.jsonPost(prefix + 'batchCancel', data);
}

/**
 * 企业客户名称，模糊查询【网发门店母公司信息】
 * @param {Object} data
 */
const prefixNetwork = 'network/portal/parentCompany/';
export function networkParentCompanyItem (data) {
  return api.jsonPost(prefixNetwork + 'page', data);
}

/**
 * 企业客户补货明细
 * @param {Object} data
 */
const prefixDetail = 'vw/web/replenish/entVehicleReplenishOrderDetail/';
export function addOrUpdateDetail (data) {
  return api.jsonPost(prefixDetail + 'addOrUpdate', data);
}
