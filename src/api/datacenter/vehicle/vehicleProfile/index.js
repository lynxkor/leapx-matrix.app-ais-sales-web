import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'datacenter/web/vehicle/vehicleProfile/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'listFull', data);
};

/**
 * 快速查询列表
 * @param {Object} data
 */
export function fastSearchVehicleProfilePage (data) {
  return api.jsonPost(prefix + 'orderVehicleQuery', data);
};
