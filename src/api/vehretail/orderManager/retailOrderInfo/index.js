import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'vr/web/order/retailOrderInfo/';

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

/**
 * 获取可解绑的整车订单信息列表
 * @param {Object} data
 */
export function findCanUnlockOrderList (data) {
  return api.jsonPost(prefix + 'findCanUnlockOrderList', data);
}

/**
 * 批量更换订单门店
 * @param {Object} data
 */
export function batchReplaceStore (data) {
  return api.jsonPost(prefix + 'batchReplaceStore', data);
}

/**
 * 取消锁车-申请原因
 * @param {Object} data
 */
export function unlockReasonList (data) {
  return api.jsonPost('vr/web/order/unlockReasonList', data);
};

/**
 * 取消锁车-单车-弹框检查该车
 * @param {Object} data
 */
export function checkBeforePerUnlock (data) {
  return api.jsonPost('vr/web/order/checkBeforePerUnlock', data);
};

/**
 * 取消锁车-单车提交
 * @param {Object} data
 */
export function perUnlock (data) {
  return api.jsonPost('vr/web/order/perUnlock', data);
};

/**
 * 取消锁车-手工配车
 * @param {Object} data
 */
export function manualLock (data) {
  return api.jsonPost('vr/web/order/manualLock', data);
};

/**
 * 查询订单状态接口
 * @param {Object} data
 */
export function orderStatusNodes (data) {
  return api.jsonPost('vr/web/order/retailOrderInfo/orderStatus/nodes', data);
};

/**
 * 取消锁车-选择配置
 * @param {Object} data
 */
export function allowConfigChangeSkuPage (data) {
  return api.jsonPost('vr/web/product/productSkuPrice/allowConfigChangeSkuPage', data);
};

/**
 * 取消锁车-校验门店是否允许锁车
 * @param {Object} data
 */
export function getOrderUnlockConfig (data) {
  return api.jsonPost('vr/web/order/retailOrderUnlockConfig/unlock/getOrderUnlockConfig', data);
};

/**
 * 自动锁车
 * @param {Object} data
 */
export function autoLock (data) {
  return api.jsonPost('vr/web/order/autoLock', data);
};

/**
 * 批量取消锁车
 * @param {Array<{retailOrderId:string,retailOrderCode:string,remark:string}>} data
 */
export function batchUnlock (data) {
  return api.jsonPost('vr/web/order/batchUnlock', data);
};

/**
 * 获取零跑APP获取购车协议]
 * @param {Object} data
 */
export function querySnapShot (data) {
  return api.jsonPost('vr/web/order/retailOrderInfo/querySnapShot', data);
};

/**
 * 订单配置修改
 * @param {Object} data
 */
export function changeOrderMaterials (data) {
  return api.jsonPost(prefix + 'changeOrderMaterials', data);
}

/**
 * 设置特殊备注
 * @param {Object} data
 */
export function setSpecialRemark (data) {
  return api.jsonPost(prefix + 'setSpecialRemark', data);
}

/**
 * 获取合同解绑链接
 * @param {Object} data
 */
export function getUnbindContractUrl (data) {
  return api.jsonPost(prefix + 'getUnbindContractUrl', data);
}

/**
 * 查询加密数据
 * @param {String} id
 * @param {String} field
 */
export function getDetailDecryptField (id, field) {
  let param = {
    id,
    decryptFields: [field]
  };
  return new Promise(resolve => {
    api.jsonPost(prefix + 'viewOrderDesensitizationData', param).then(res => {
      resolve(res[field]);
    });
  });
}

/**
 * 回退订单状态记录查询
 * @param {Object} data
 */
export function queryOrderStatusBackRecord (data) {
  return api.jsonPost(prefix + 'queryOrderStatusBackRecord', data);
}

/**
 * 获取系统参数值 veretailUnlockConfigCount:取消锁车次数,veretailChangeConfigCount:修改配置次数
 * @param {Object} data
 */
export function getSysConfigParamValue (data) {
  return api.jsonPost('vr/web/order/common/getSysConfigParamValue', data);
}
