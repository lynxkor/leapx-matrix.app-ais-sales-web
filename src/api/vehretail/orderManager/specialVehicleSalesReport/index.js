import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vr/web/delivery/specialVehicleSalesReport/';

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
 * 提交特殊车辆销售报告
 * @param {Object} data
 */
export function submitReport (data) {
  return api.jsonPost(prefix + 'submit', data);
}

/**
 * 作废特殊车辆销售报告
 * @param {Object} data
 */
export function cancelReport (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

/**
 * 撤回特殊车辆销售报告
 * @param {Object} data
 */
export function revokeReport (data) {
  return api.jsonPost(prefix + 'revocation', data);
}

/**
 * 批量作废特殊车辆销售报告
 * @param {Object} data
 */
export function batchCancelReports (data) {
  return api.jsonPost(prefix + 'batchCancel', data);
}

/**
 * 批量撤回特殊车辆销售报告
 * @param {Object} data
 */
export function batchRevokeReports (data) {
  return api.jsonPost(prefix + 'batchRevocation', data);
}

/**
 * 调整车辆属性
 * @param {Object} data
 */
export function adjustVehicleAttribute (data) {
  return api.jsonPost(prefix + 'vehicleAttribute', data);
}

/**
 * VIN校验
 * @param {Object} data
 */
export function effectiveVinValidate (data) {
  return api.get(prefix + `effectiveVinValidate?vin=${data}`);
}
