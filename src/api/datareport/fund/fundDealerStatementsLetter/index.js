import api from '@/axios';
const prefix = 'datareport/web/fund/fundDealerStatementsLetter/';

export function getList (data) { return api.jsonPost(prefix + 'page', data); }
export function addOrUpdate (data) { return api.jsonPost(prefix + 'addOrUpdate', data); }
export function deleteItem (data) { return api.jsonPost(prefix + 'delete', data); }
export function getDetail (data) { return api.jsonPost(prefix + 'get', data); }
export function enableItem (data) { return api.jsonPost(prefix + 'enableOrDisable', data); }
export function downloadStatement (data) {
  return api.postExport(prefix + 'export', data, { responseType: 'blob' });
}
export function confirmStatement (data) { return api.jsonPost(prefix + 'confirm', data); }
export function cancelStatement (data) { return api.jsonPost(prefix + 'cancel', data); }
export function regenerateStatement (data) { return api.jsonPost(prefix + 'rebuild', data); }

// 整车返利对账流水
export function getVehicleRebateList (data) { return api.jsonPost('datareport/web/fund/fundVehicleReturnDetail/page', data); }

// 备件返利对账流水
export function getSpareRebateList (data) { return api.jsonPost('datareport/web/fund/fundPartsReturnDetail/page', data); }

// 整车现金对账流水
export function getVehicleCashList (data) { return api.jsonPost('datareport/web/fund/fundVehicleCashDetail/page', data); }

// 备件现金对账流水
export function getSpareCashList (data) { return api.jsonPost('datareport/web/fund/fundPartsCashDetail/page', data); }
