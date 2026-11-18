import api from '@/axios';

// 整车批售-批售主数据-现车批售信息配置（LP260286 7.1）
const prefix = 'vw/web/basic/wholesaleSpotConfig/';

/**
 * 不分页列表（供导出用）
 */
export function getList (data) {
  return api.jsonPost(prefix + 'list', data);
}

/**
 * 分页查询
 */
export function pageList (data) {
  return api.jsonPost(prefix + 'page', data);
}

/**
 * 详情
 */
export function getDetail (id) {
  return api.jsonPost(prefix + 'get', id);
}

/**
 * 新增/编辑
 */
export function addOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 启用/禁用（批量）
 */
export function enableOrDisable (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}
