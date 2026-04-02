import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vw/web/certificate/vehicleCertificateRedemption/';

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
 * 赎回
 * @param {Object} data
 */
export function submit (data) {
  return api.jsonPost(prefix + 'submit', data);
}
/**
 * 查询批售订单、企业客户订单
 * @param {Object} data
 */
export function listWholesaleOrEntOrder (data) {
  return api.jsonPost(prefix + 'listWholesaleOrEntOrder', data);
}
/**
 * 查询收货人地址
 * @param {Object} data
 */
export function getLatestReceiverAddress (data) {
  return api.jsonPost(prefix + 'getLatestReceiverAddress', data);
}

/**
 * 签收合格证
 * @param {Object} data
 */
export function batchconfirmSign (data) {
  return api.jsonPost(prefix + 'confirmSign', data);
}
