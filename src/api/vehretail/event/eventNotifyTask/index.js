import api from '@/axios';

// 根据项目名称手动修改前缀
const prefix = '/web/task/event/';

/**
 * 查询事件任务分页
 * @param {Object} data
 */
export function getList (data, systemPrefix) {
  return api.jsonPost(systemPrefix + prefix + 'page', data);
}

/**
 * 查询事件任务列表
 * @param {Object} data
 */
export function getAllList (data, systemPrefix) {
  return api.jsonPost(systemPrefix + prefix + 'list', data);
}

/**
 * 同步执行
 * @param {Object} data
 */
export function manualExecute (data, systemPrefix) {
  return api.jsonPost(systemPrefix + prefix + 'manualExecute', data);
}

/**
 * 异步执行
 * @param {Object} data
 */
export function manualExecuteAsync (data, systemPrefix) {
  return api.jsonPost(systemPrefix + prefix + 'manualExecuteAsync', data);
}

/**
 * 手动取消
 * @param {Object} data
 */
export function manualCancel (data, systemPrefix) {
  return api.jsonPost(systemPrefix + prefix + 'manualCancel', data);
}

/**
 * 获取事件任务详细信息
 * @param {String|Number} id
 */
export function getDetail (id, systemPrefix) {
  return api.get(systemPrefix + prefix + 'getInfo?id=' + id);
}

/**
 * 新增事件任务
 * @param {Object} data
 */
export function addItem (data, systemPrefix) {
  return api.jsonPost(systemPrefix + prefix + 'add', data);
}

/**
 * 修改事件任务
 * @param {Object} data
 */
export function updateItem (data, systemPrefix) {
  return api.jsonPost(systemPrefix + prefix + 'edit', data);
}

/**
 * 新增或修改（根据是否有id判断）
 * @param {Object} data
 */
export function addOrUpdate (data, systemPrefix) {
  if (data.id) {
    return updateItem(data, systemPrefix);
  }
  return addItem(data, systemPrefix);
}

/**
 * 删除事件任务
 * @param {Array<String|Number>} data
 */
export function deleteItem (data, systemPrefix) {
  return api.jsonPost(systemPrefix + prefix + 'remove', data);
}

/**
 * 查询事件列表
 * @param {Array<String|Number>} data
 */
export function findEventTypeList (systemPrefix) {
  return api.jsonPost(systemPrefix + prefix + 'findEventTypeList');
}

/**
 * 查询目标平台列表
 * @param {Array<String|Number>} data
 */
export function findThirdTargetPlatformList (systemPrefix) {
  return api.jsonPost(systemPrefix + prefix + 'findThirdTargetPlatformList');
}
