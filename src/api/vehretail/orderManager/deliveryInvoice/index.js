import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = '/vr/web/delivery/deliveryInvoice/';

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
 * 确认上传
 * @param {Object} data
 */
export function confirmUpload (data) {
  return api.jsonPost(prefix + 'confirmUpload', data);
}

/**
 * 确认上传
 * @param {Object} data
 */
export function confirmUploadNew (data) {
  return api.jsonPost(prefix + 'confirmUploadNew', data);
}

/**
 * VIN查询
 * @param {Object} data
 */
export function getEffectiveByVin (data) {
  return api.get(prefix + `getEffectiveByVin?vin=${data}`);
}

/**
 * 交车单ID查询
 * @param {Object} data
 */
export function getEffectiveByDeliveryOrderId (data) {
  return api.get(prefix + `getEffectiveByDeliveryOrderId?deliveryOrderId=${data}`);
}

/**
 * 批量作废
 * @param {Array<Number>} data
 */
export function batchCancel (data) {
  return api.jsonPost(prefix + 'batchCancel', data);
}

/**
 * 附件上传校验
 * @param {Object} data
 */
export function checkUpload (data) {
  return api.jsonPost(prefix + 'checkUpload', data);
}

/**
 * 调整车辆属性（7.2 需求）
 * @param {Object} data { id, vehicleAttribute }
 */
export function updateVehicleAttribute (data) {
  return api.jsonPost(prefix + 'updateVehicleAttribute', data);
}

/**
 * 调整开票日期（7.2 需求）
 * @param {Object} data { id, invoiceTime }
 */
export function updateInvoiceTime (data) {
  return api.jsonPost(prefix + 'updateInvoiceTime', data);
}
