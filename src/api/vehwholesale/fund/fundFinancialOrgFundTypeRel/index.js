import api from '@/axios';

const prefix = 'vw/web/fund/fundFinancialOrgFundTypeRel/';

/**
 * 列表查询（完整字段）
 * @param {Object} data
 */
export function listFull (data) {
  return api.jsonPost(prefix + 'listFull', data);
}

/**
 * 分页查询
 * @param {Object} data
 */
export function page (data) {
  return api.jsonPost(prefix + 'page', data);
}

/**
 * 详情查询
 * @param {String} id
 */
export function getDetail (id) {
  return api.jsonPost(prefix + 'get', id);
}

/**
 * 新增或修改单条关联关系
 * @param {Object} data
 */
export function addOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 根据金融机构ID全量替换关联关系
 * @param {Object} data { organizationId, relList }
 */
export function saveBatch (data) {
  return api.jsonPost(prefix + 'saveBatch', data);
}

/**
 * 删除关联关系
 * @param {Array<String>} ids
 */
export function deleteRel (ids) {
  return api.jsonPost(prefix + 'delete', ids);
}
