import api from '@/libs/axios';

// 风险车辆排查 车辆清单
export const getDetailList = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckTaskDetail/page', params);
};

// 取消排查（G9：已排查不可取消）
export const cancelCheck = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckTaskDetail/cancelCheck', params);
};

// 车辆解锁（G10：已解锁不重复操作）
export const unlockVehicle = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckTaskDetail/unlockVehicle', params);
};

// 一键提醒（统计待排查数并发事件）
export const oneClickRemind = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckTaskDetail/oneClickRemind', params);
};
