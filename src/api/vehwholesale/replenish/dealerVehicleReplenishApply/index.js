import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vw/web/replenish/dealerVehicleReplenishApply/';

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
 *  下拉框查询
 * @param {Object} data
 */
export function listIdNames (data) {
  return api.jsonPost(prefix + 'list', data);
}

/**
 *  厂端现车批售-弹框 弹框查询
 * @param {Object} data
 */
export function queryPlantWholesaleInStockInventory (data) {
  return api.jsonPost(prefix + 'queryPlantWholesaleInStockInventory', data);
}

/**
 *  厂端现车批售-弹框 确认下单接口
 * @param {Object} data
 */
export function plantWholesaleInStockCreateApply (data) {
  return api.jsonPost(prefix + 'plantWholesaleInStockCreateApply', data);
}

/**
 *  厂端现车批售-弹框 校验库存是否充足
 * @param {Object} data
 */
export function checkInStockInventoryIsFull (data) {
  return api.jsonPost(prefix + 'checkInStockInventoryIsFull', data);
}

/**
 * 批量厂端审核校验
 * @param {Object} data
 */
export function factoryAuditValid (data) {
  return api.jsonPost(prefix + 'factoryAuditValid', data);
}

/**
 *  批量厂端审核
 * @param {Object} data
 */
export function factoryApproval (data) {
  return api.jsonPost(prefix + 'factoryApproval', data);
}

/**
 * 批量门店审核校验
 * @param {Object} data
 */
export function dealerAuditValid (data) {
  return api.jsonPost(prefix + 'dealerAuditValid', data);
}

/**
 *  批量门店审核
 * @param {Object} data
 */
export function dealerApproval (data) {
  return api.jsonPost(prefix + 'dealerApproval', data);
}

/**
 *  提交补货申请
 * @param {Object} data
 */
export function replenishmentSubmit (data) {
  return api.jsonPost(prefix + 'submit', data);
}

/**
 *  作废补货申请
 * @param {Object} data
 */
export function unusedApply (data) {
  return api.jsonPost(prefix + 'invalid', data);
}
