import api from '@/axios';

// 注意：此模块数据来源于整车零售订单视图，使用零售订单的API路径
const prefix = 'vr/web/orderManager/retailOrderInfo/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'backRecord/page', data);
};
