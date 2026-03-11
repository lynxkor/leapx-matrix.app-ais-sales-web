import api from '@/axios';

const prefix = 'vehretail/web/orderManager/vrSpecialVehicle/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};
