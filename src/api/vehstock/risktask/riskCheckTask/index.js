import api from '@/libs/axios';

// 风险车辆排查任务
export const getList = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckTask/page', params);
};

export const getDetail = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckTask/get', params);
};

export const addOrUpdate = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckTask/addOrUpdate', params);
};

export const update = (params) => {
  return api.put('vehstock/web/risktask/riskCheckTask/update', params);
};

export const deleteItem = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckTask/delete', params);
};

// 结束任务（支持批量）
export const endTask = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckTask/end', params);
};

// 批量新增排查车辆
export const addVehicle = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckTask/addVehicle', params);
};

// 发布任务（草稿 → 进行中）
export const publishTask = (params) => {
  return api.jsonPost('vehstock/web/risktask/riskCheckTask/publish', params);
};

// 查询用户角色（权限）列表，供「推送对象」下拉选择：value=authorityCode（存编码）、label=authorityName（显名称）
export const getAuthorityList = (params) => {
  return api.get('passport/authorityInfo/page', params);
};
