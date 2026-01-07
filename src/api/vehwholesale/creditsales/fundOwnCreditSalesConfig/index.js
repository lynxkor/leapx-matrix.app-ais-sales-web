import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vw/web/creditsales/fundOwnCreditSalesConfig/';

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
 * 账户管理-赊销管理-自有资金赊销配置-提交
 * @param {Object} data
 */
export function submitItem (data) {
  return api.jsonPost(prefix + 'submit', data);
}
/**
 * 账户管理-赊销管理-自有资金赊销配置-审核
 * @param {Object} data
 */
export function reviewItem (data) {
  return api.jsonPost(prefix + 'review', data);
}
/**
 * 账户管理-赊销管理-自有资金赊销配置-作废
 * @param {Object} data
 */

export function cancelItem (data) {
  return api.jsonPost(prefix + 'cancel', data);
}
