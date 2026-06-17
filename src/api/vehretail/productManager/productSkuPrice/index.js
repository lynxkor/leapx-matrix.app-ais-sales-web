import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vr/web/product/productSkuPrice/';

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
 * 商品定价根据SKU编码查询商品定价信息
 * @param {Object} data
 */
export function getProductSkuBySkuCode (data) {
  return api.jsonPost('vr/web/product/productSku/getProductSkuBySkuCode', data);
}

/**
 * 设置允许改配
 * @param {Object} data
 */
export function batchUpdateAllowConfigChange (data) {
  return api.jsonPost('vr/web/product/productSkuPrice/batchUpdateAllowConfigChange', data);
}
