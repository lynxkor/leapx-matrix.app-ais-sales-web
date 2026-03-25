import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vehstock/web/store/vehiclePurposeChangeApply/';

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
 * 车辆用途变更申请零售经理审
 * @param {Object} data
 */
export function approveByRetailManager (data) {
  return api.jsonPost(prefix + 'approveByRetailManager', data);
}

/**
 * 车辆用途变更申请大区经理审
 * @param {Object} data
 */
export function approveByAreaManager (data) {
  return api.jsonPost(prefix + 'approveByAreaManager', data);
}

/**
 * 车辆用途变更申请总部审批
 * @param {Object} data
 */
export function approveByHeadquarters (data) {
  return api.jsonPost(prefix + 'approveByHeadquarters', data);
}

/**
 * 车辆用途变更申请提交
 * @param {Object} data
 */
export function enableItemSubmit (data) {
  return api.jsonPost(prefix + 'submit', data);
}

/**
 * 车辆用途变更申请作废
 * @param {Object} data
 */
export function enableItemCancel (data) {
  return api.jsonPost(prefix + 'cancel', data);
}
