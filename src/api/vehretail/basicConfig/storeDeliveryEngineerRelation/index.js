import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vr/web/basicConfig/storeDeliveryEngineerRelation/';

/**
 * 根据分配配置ID查询关联的配送工程师列表
 * @param {Object} data
 */
export function getByAllocationConfigId (data) {
  return api.jsonPost(prefix + 'getByAllocationConfigId', data);
};
