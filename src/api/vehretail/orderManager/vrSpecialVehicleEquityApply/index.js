import api from '@/axios';

const prefix = 'vr/web/orderManager/vrSpecialVehicleEquityApply/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};
