import api from '@/axios';

const prefix = 'datareport/web/order/retailOrderInfo/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'queryOrderStatusBackRecord', data);
};
