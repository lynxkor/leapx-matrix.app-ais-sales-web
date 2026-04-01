import api from '@/axios';

// 根据项目名称手动修改前缀
const prefix = 'vr/web/task/event/';

/**
 * 查询事件任务分页
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
}

/**
 * 查询事件任务列表
 * @param {Object} data
 */
export function getAllList (data) {
  return api.jsonPost(prefix + 'list', data);
}

/**
 * 获取事件执行最终状态
 */
export function getFinalStatus () {
  return api.jsonPost(prefix + 'finalStatus');
}

/**
 * 同步执行
 * @param {Object} data
 */
export function manualExecute (data) {
  return api.jsonPost(prefix + 'manualExecute', data);
}

/**
 * 异步执行
 * @param {Object} data
 */
export function manualExecuteAsync (data) {
  return api.jsonPost(prefix + 'manualExecuteAsync', data);
}

/**
 * 手动取消
 * @param {Object} data
 */
export function manualCancel (data) {
  return api.jsonPost(prefix + 'manualCancel', data);
}

/**
 * 获取事件任务详细信息
 * @param {String|Number} id
 */
export function getDetail (id) {
  return api.get(prefix + 'getInfo?id=' + id);
}

/**
 * 新增事件任务
 * @param {Object} data
 */
export function addItem (data) {
  return api.jsonPost(prefix + 'add', data);
}

/**
 * 修改事件任务
 * @param {Object} data
 */
export function updateItem (data) {
  return api.jsonPost(prefix + 'edit', data);
}

/**
 * 新增或修改（根据是否有id判断）
 * @param {Object} data
 */
export function addOrUpdate (data) {
  if (data.id) {
    return updateItem(data);
  }
  return addItem(data);
}

/**
 * 删除事件任务
 * @param {Array<String|Number>} data
 */
export function deleteItem (data) {
  return api.jsonPost(prefix + 'remove', data);
}
