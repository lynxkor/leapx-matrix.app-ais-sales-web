import api from '@/libs/axios';

// 风险车辆排查 审核
export const getAuditList = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckAudit/page', params);
};

// 审核动作（通过 / 不通过）
export const approve = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckAudit/approve', params);
};

// 门店提交排查结果（APP 端亦复用）
export const submitCheckResult = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckAudit/submit', params);
};

// 审核详情查询（T24）
export const getAuditDetail = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckAudit/get', params);
};
