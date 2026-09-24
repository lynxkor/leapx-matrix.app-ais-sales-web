import api from '@/axios';

// 二网门店：由网发 app-network 提供，不走本项目的 vw 前缀
const prefix = 'network/portal/storeSecond/';

/**
 * 二网门店分页查询（底层入口，业务侧请优先使用 searchSecondDealer 封装）
 * @param {Object} data
 * @param {String} data.storeCode 销售门店编码（可空；编辑场景必填，列表搜索场景可空）
 * @param {String} data.keyword   二网门店名称/编码关键词（可空）
 * @param {Number} data.page      页码
 * @param {Number} data.size      每页条数
 */
export function getSecondDealerPage (data) {
  return api.jsonPost(prefix + 'page', data);
}

/**
 * LP261730: 统一查询二网门店（编辑/列表搜索两个场景共用）
 * @param {String|undefined} keyword    关键词
 * @param {String}           [storeCode] 销售门店编码（可空；编辑场景锁门店，列表搜索场景全局）
 * @returns {Promise<Array>}            records 数组（直接喂给 fetch-select）
 *
 * 固定传 status='3' 仅返回【运营】状态（"3"=运营；"5"=已退网）的二网门店，
 * 避免下拉出现已退网废数据。
 */
export async function searchSecondDealer (keyword, storeCode) {
  const params = {
    keyword: keyword || '',
    status: '3',   // 仅运营中的二网（"3"=运营；"5"=已退网），网发接口原生支持精确过滤
    page: 1,
    size: 100
  };
  if (storeCode) params.storeCode = storeCode;
  const result = await getSecondDealerPage(params);
  // 与 LP261730 同款修法——api.jsonPost 二次解外层 .data，此处取 records 即可
  return result?.records || [];
}
