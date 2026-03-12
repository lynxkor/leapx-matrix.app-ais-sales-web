import api from '@/axios';

// 根据项目名称（如 maintain 代表维保项目）手动修改前缀
const prefix = 'vr/web/delivery/deliveryOrder/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 新增或修改
 * @param {Object} data
 */
export function addOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 删除
 * @param {Array<Number>} data
 */
export function deleteItem (data) {
  return api.jsonPost(prefix + 'delete', data);
}

/**
 * 查询
 * @param {Object} data
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}

/**
 * 启用停用
 * @param {Object} data
 */
export function enableItem (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}

// 假接口 （记得删除）=====================================================================================================
/**
 * 校验开票金额
 * @param {Object} data
 */
export function validateInvoiceAmount (data) {
  return api.jsonPost(prefix + 'validateInvoiceAmount', data);
}

/**
 * 校验剩余应收款
 * @param {Object} data
 */
export function validateRemainingReceivable (data) {
  return api.jsonPost(prefix + 'validateRemainingReceivable', data);
}

/**
 * 校验未核销权益
 * @param {Object} data
 */
export function validateUnverifiedRights (data) {
  return api.jsonPost(prefix + 'validateUnverifiedRights', data);
}

/**
 * 确认收款
 * @param {Object} data
 */
export function confirmPayment (data) {
  return api.jsonPost(prefix + 'confirmPayment', data);
}

// 假接口 （记得删除）=====================================================================================================

/**
 * 交车单预约交车所选日期排程数
 * @param {Object} data
 */
export function deliveryOrderScheduledNum (data) {
  return api.jsonPost(prefix + 'deliveryOrderScheduledNum', data);
}

/**
 * 校验购车人手机号是否注册零跑APP
 * @param {Object} data
 */
export function checkCarBuyerPhoneRegistered (data) {
  return api.jsonPost(prefix + 'checkCarBuyerPhoneRegistered', data);
}

/**
 * 预约交车
 * @param {Object} data
 */
export function appointment (data) {
  return api.jsonPost(prefix + 'appointment', data);
}

/**
 * 更改预约时间
 * @param {Object} data
 */
export function changeAppointmentTime (data) {
  return api.jsonPost(prefix + 'changeAppointmentTime', data);
}

/**
 * 分派
 * @param {Object} data
 */
export function assign (data) {
  return api.jsonPost(prefix + 'assign', data);
}

/**
 * 校验交付工程师单月交付订单数量是否超过交付承载力
 * @param {Object} data
 */
export function checkOverDeliveryCapacity (data) {
  return api.jsonPost(prefix + 'checkOverDeliveryCapacity', data);
}

/**
 * 交车确认单生成
 * @param {Object} data
 */
export function deliveryConfirm (data) {
  return api.jsonPost(prefix + 'deliveryConfirm', data);
}

/**
 * 核销订单权益列表
 * @param {Object} data
 */
export function openGrantQuery (data) {
  return api.jsonPost(prefix + 'openGrantQuery', data);
}

/**
 * 核销订单权益
 * @param {Object} data
 */
export function writeOff (data) {
  return api.jsonPost(prefix + 'writeOff', data);
}

/**
 * 添加收款记录
 * @param {Object} data
 */
export function addPayRecord (data) {
  return api.jsonPost(prefix + 'addPayRecord', data);
}
