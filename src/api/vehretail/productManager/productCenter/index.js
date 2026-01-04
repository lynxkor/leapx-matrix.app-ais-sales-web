import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vr/web/product/productInfo/';

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
 * 订购属性 新增/编辑
 * @param {Object} data
 */
export function productSaleAttributeAddOrUpdate (data) {
  return api.jsonPost('vr/web/product/productSaleAttribute/addOrUpdate', data);
}

/**
 * 订购属性 删除
 * @param {Object} data
 */
export function productSaleAttributeDelete (data) {
  return api.jsonPost('vr/web/product/productSaleAttribute/delete', data);
}

/**
 * 订购属性 分页
 * @param {Object} data
 */
export function productSaleAttributePage (data) {
  return api.jsonPost('vr/web/product/productSaleAttribute/page', data);
}

/**
 * 订购属性SKU 分页
 * @param {Object} data
 */
export function productSkuPage (data) {
  return api.jsonPost('vr/web/product/productSku/page', data);
}

/**
 * 订购属性SKU 新增/编辑
 * @param {Object} data
 */
export function productSkuAddOrUpdate (data) {
  return api.jsonPost('vr/web/product/productSku/addOrUpdate', data);
}

/**
 * 订购属性SKU 删除
 * @param {Object} data
 */
export function productSkuDelete (data) {
  return api.jsonPost('vr/web/product/productSku/delete', data);
}

/**
 * 订购属性SKU 下拉
 * @param {Object} data
 */
export function getSaleAttributeGroupList (data) {
  return api.jsonPost('vr/web/product/productSku/getSaleAttributeGroupList', data);
}

/**
 * 订购属性SKU 修改市场指导价
 * @param {Object} data
 */
export function updateMarketGuidePrice (data) {
  return api.jsonPost('vr/web/product/productSku/updateMarketGuidePrice', data);
}
