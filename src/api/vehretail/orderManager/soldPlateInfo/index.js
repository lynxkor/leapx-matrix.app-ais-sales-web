import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vr/web/delivery/soldPlateInfo/';

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
 * VIN校验
 * @param {Object} data
 */
export function effectiveVinValidate (data) {
  return api.get(prefix + `effectiveVinValidate?vin=${data}`);
}

/**
 * VIN查询已售上牌资料
 * @param {Object} data
 */
export function getEffectiveByVin (data) {
  return api.get(prefix + `getEffectiveByVin?vin=${data}`);
}

/**
 * 根据VIN创建已售上牌资料
 * @param {Object} data
 */
export function generateSoldPlateInfoByVin (data) {
  return api.post(prefix + `generateSoldPlateInfoByVin?vin=${data}`);
}
