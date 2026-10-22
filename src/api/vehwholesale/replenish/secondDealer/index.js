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
 * @param {Object} [params={}]  网发接口请求参数对象，调用方按需传：
 *                            - keyword  关键词（空时自动 undefined 让 axios JSON.stringify 跳过该字段）
 *                            - storeCode 销售门店编码（编辑场景必填，列表场景可省）
 *                            - 其它任意字段（page/size 等）也可以传
 * @returns {Promise<Array>}  records 数组（直接喂给 fetch-select）
 *
 * 固定传 status='3' 仅返回【运营】状态（"3"=运营；"5"=已退网），避免下拉出现已退网废数据。
 *
 * 【坑1】axios 的 paramsFilter 会过滤空字符串字段，导致首次 focus 下拉时（用户未输入）
 * 网发接口收不到 keyword 字段 → 网发按默认权限返回极少门店。
 *
 * 【坑2】如果传 `keyword=null`，部分后端框架（如 Spring）会按"显式 null"处理，可能拒绝请求。
 * 改用 `keyword=undefined` —— axios 的 JSON.stringify 会自动跳过 undefined 字段，
 * 请求 body 中根本不会出现 keyword 键。
 */
export async function searchSecondDealer (params = {}) {
  const { keyword, ...rest } = params;
  const finalParams = {
    status: '3',  // 仅运营中的二网（"3"=运营；"5"=已退网）
    page: 1,
    size: 100,
    ...rest,
    // 显式处理 keyword：空字符串/空数组 → undefined（让 axios JSON.stringify 跳过该字段）
    keyword: keyword && keyword.length > 0 ? keyword : undefined
  };
  // 直接调用 getSecondDealerPage 走 axios 的 jsonPost（JSON body 序列化），
  // 走 paramsFilter 不会过滤 null/undefined，所以这条链路上 keyword=undefined 会被 JSON 跳过
  const result = await getSecondDealerPage(finalParams);
  // 与 LP261730 同款修法——api.jsonPost 二次解外层 .data，此处取 records 即可
  return result?.records || [];
}
