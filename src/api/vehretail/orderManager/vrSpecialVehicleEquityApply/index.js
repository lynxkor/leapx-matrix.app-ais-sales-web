import api from '@/axios';

const prefix = 'vr/web/order/vrSpecialVehicleEquityApply/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 查询详情
 * @param {Object} data
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
};

/**
 * 新增或修改
 * @param {Object} data
 */
export function addOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 查询加密数据
 * @param {String} id
 * @param {String} field
 */
export function getDecryptField (id, field) {
  return api.jsonPost(prefix + 'getFieldDecryptValue', {
    id: id,
    decryptField: field
  });
};
