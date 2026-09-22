import api from '@/axios';

// 二网门店：由网发 app-network 提供，不走本项目的 vw 前缀
const prefix = 'network/portal/storeSecond/';

/**
 * 二网门店分页查询
 * 供「整车门店补货申请 - 二网门店」下拉使用（按当前销售门店查询其下二级经销商门店）
 *
 * @param {Object} data
 * @param {String} data.storeCode 销售门店编码（必填，当前申请门店）
 * @param {String} data.keyword   二网门店名称/编码关键词（可空，远程搜索用）
 * @param {Number} data.page      页码
 * @param {Number} data.size      每页条数
 * @param {String} data.status    二网状态（"3"=运营，建议只展示运营中）
 */
export function getSecondDealerPage (data) {
  return api.jsonPost(prefix + 'page', data);
}
