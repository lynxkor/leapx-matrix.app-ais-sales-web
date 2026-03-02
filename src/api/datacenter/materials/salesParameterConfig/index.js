import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'datacenter/web/materials/salesParameterConfig/';
/**
 * 查询详情
 * @param {Object} data
 */
export function getDetail(data) {
  return api.jsonPost(prefix + 'get', data);
};

/**
 * 启用停用
 * @param {Object} data
 */
export function addOrUpdate(data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}
