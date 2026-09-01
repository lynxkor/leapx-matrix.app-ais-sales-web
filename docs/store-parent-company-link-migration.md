# 销售前端 门店 / 母公司 详情跳转改造说明

> 范围：`app-ais-sales-front` 全项目  
> 类型：纯字符串替换，无逻辑改动  
> 目标：所有门店/母公司详情跳转统一指向 aftersale-front 路由（`/service/datacenter/...`）

## 一、改动概要

| 项 | 数值 |
|---|---|
| 改动文件数 | 99（含 `src/libs` 子模块 1 处 commit） |
| 代码净增删 | +202 / -202（纯字符串替换） |
| 门店跳转替换处数 | **96** |
| 母公司跳转替换处数 | **99**（全部位于注释中） |
| 验证 | `channelManagement/shopDetail` / `channelManagement/companyDetails` 已清零 |

## 二、路径映射规则

| 旧路径 | 新路径 | 参数对应 |
|---|---|---|
| `/partner/channelManagement/shopDetail?dealerCode=X` | `/service/datacenter/store/store/detail?storeCode=X` | `dealerCode` → `storeCode` |
| `/partner/channelManagement/companyDetails?companyCode=X`（注释中） | `/service/datacenter/store/parentCompany/detail?companyCode=X` | `companyCode` 保持 |

> 注：`?num=2&dealerCode=` 这种带额外参数的写法，已去掉 `num=2`，仅保留 `storeCode`。

## 三、零售 vehretail（22 个文件）

### 3.1 订单管理 orderManager（36 处）

| 文件 | 环节 | 位置 | 链接类型 |
|---|---|---|---|
| `dealerCommitmentRecord/edit.vue` | 表单 | 销售门店 `el-link` | 门店 |
| `deliveryInvoice/edit.vue` | 表单 | 销售/交车门店 `el-link` ×4 | 门店 |
| `deliveryOrder/edit.vue` | 表单 | 销售/交车门店 `el-link` ×4 | 门店 |
| `orderBackStatusRecord/index.vue` | 列表 | "销售门店"列 `window.open` | 门店 |
| `orderConfigChange/edit.vue` | 表单 | 销售门店 `el-link` | 门店 |
| `orderLockRecord/edit.vue` | 表单 | 销售门店 `el-link` | 门店 |
| `orderPayRecord/edit.vue` | 表单 | 销售门店 `el-link` ×2 | 门店 |
| `retailOrderInfo/components/fieldConfigs.js` | 配置 | `saleDealerName` / `deliveryDealerName` link & paramName | 门店 |
| `soldPlateInfo/edit.vue` | 表单 | 销售门店 `el-link` | 门店 |
| `specialVehicleSalesReport/edit.vue` | 表单 | 销售/交车门店 `el-link` ×2 | 门店 |
| `vrEquityApply/index.vue` | 列表 | 经销商列 `window.open` | 门店 |
| `vrEquityApply/edit.vue` | 表单 | 经销商 `el-link` | 门店 |
| `vrGroupbuyOrderEquityApply/index.vue` | 列表 | 经销商列 `window.open` | 门店 |
| `vrGroupbuyOrderEquityApply/edit.vue` | 表单 | 经销商 ×2、销售门店、交付门店 `el-link` | 门店 |
| `vrSpecialVehicleEquityApply/index.vue` | 列表 | 销售门店列 `window.open` | 门店 |
| `vrSpecialVehicleEquityApply/edit.vue` | 表单 | 销售门店 `el-link` | 门店 |

**门店统计：28 处**

### 3.2 订单退款 orderRefund（4 处）

| 文件 | 位置 | 链接类型 |
|---|---|---|
| `changeApply/edit.vue` | 原销售门店 + 销售门店 `el-link`（去掉 `num=2`） | 门店 |
| `payRefundRecord/edit.vue` | 销售门店 `el-link` | 门店 |
| `refundApply/edit.vue` | `handleRouteToStoreDetail()` 方法 path/query | 门店 |

### 3.3 基础配置 basicConfig（3 处）

| 文件 | 位置 | 链接类型 |
|---|---|---|
| `lockCarShareConfig/edit.vue` | 销售门店 `el-link` | 门店 |
| `storeDeliveryAllocationConfig/edit.vue` | 交付门店 `el-link` | 门店 |
| `storeDeliveryCapacityConfig/edit.vue` | 交付门店 `el-link` | 门店 |

### 3.4 财务补贴 financeSubsidy（1 处）

| 文件 | 位置 | 链接类型 |
|---|---|---|
| `vrFinanceOrder/edit.vue` | 经销商 `el-link` | 门店 |

---

## 四、批售 vehwholesale（76 个文件）

### 4.1 整车批售 wholesale（8 文件）

| 文件 | 门店 | 母公司(注释) |
|---|---|---|
| `vehicleWholesaleOrder/index.vue` | 列表按钮 | 列表按钮 |
| `vehicleWholesaleOrder/edit.vue` | 表单 ×2 | — |
| `vehicleWholesaleOrderFactory/index.vue` | 列表按钮 | 列表按钮 |
| `vehicleWholesaleOrderFactory/edit.vue` | 表单 ×2 | — |
| `vehicleWholesaleOrderRecord/index.vue` | 列表按钮 | 列表按钮 |
| `vehicleWholesaleOrderRecord/edit.vue` | 表单 ×1 | 表单 ×1 |
| `vehicleWholesalePaymentNotice/index.vue` | 列表按钮 | 列表按钮 |
| `vehicleWholesalePaymentNotice/edit.vue` | 表单 ×3 | — |

门店合计：**10 处** ｜ 母公司合计：**6 处**

### 4.2 退款返利 rebate（5 文件）

`fundVehicleRebateBill/{detail,edit,index}.vue`、`fundVehicleRebateBillDetail/{detail,edit}.vue`

门店合计：**6 处** ｜ 母公司合计：**5 处**

### 4.3 退车 back（4 文件）

`vehicleBackOrder/{edit,index}.vue`、`vehicleBackOrderDetail/{edit,index}.vue`

门店合计：**4 处** ｜ 母公司合计：**6 处**

### 4.4 基础配置 basic（11 文件）

| 子模块 | 文件 | 门店 | 母公司(注释) |
|---|---|---|---|
| `wholesaleDealerAutoConfirmConf` | `detail,edit,index.vue` | 各 2 处 | — |
| `wholesaleDealerTestDriveQuota` | `detail,edit,index.vue` | 各 2 处 | — |
| `wholesaleDealerWholesaleConf` | `detail,edit,index.vue` | 各 2 处 | 表单 ×1 |
| `wholesaleProdScheduleActivity` | `edit.vue` | 表单 ×2 | — |
| `wholesaleProdScheduleActivityDetail` | `edit,index.vue` | 列表 + 表单 | — |
| `wholesaleSaleTargetTracking` | `edit,index.vue` | 表单 ×2 | 表单 ×1 |

门店合计：**22 处** ｜ 母公司合计：**4 处**

### 4.5 补货 replenish（6 文件）

- `dealerVehicleReplenishApply/{edit,index}.vue`、`dealerVehicleReplenishApplyDetail/{edit,index}.vue` —— 门店
- `entVehicleReplenishOrder/{edit,index}.vue` —— 母公司(注释)

门店合计：**6 处** ｜ 母公司合计：**2 处**

### 4.6 资金 fund（8 文件）

`dealerFundAccount/{detail,edit,index}.vue`、`dealerFundAccountTransLog/{edit,index}.vue`、`fundAccountMonthBalance/{edit,index}.vue`、`fundVehwhite/{edit,index}.vue`

门店合计：**0 处** ｜ 母公司合计：**15 处**

### 4.7 凭证 / 配送 / 企业订单（3 文件）

- `certificate/vehicleCertificateRedemption/{edit,index}.vue` —— 门店 + 母公司(注释)
- `shipping/vehicleShippingPlanDetail/index.vue` —— 门店
- `entorder/entVehicleOrder/{edit,index}.vue` —— 母公司(注释)

门店合计：**3 处** ｜ 母公司合计：**2 处**

### 4.8 赊销 creditsales（4 文件）

`fundOwnCreditSalesConfig/{edit,index}.vue`、`fundOwnCreditSalesDetail/{edit,index}.vue`、`fundOwnCreditSalesLimit/edit.vue`、`fundOwnCreditSalesLimit/index.vue`

门店合计：**4 处** ｜ 母公司合计：**10 处**

### 4.9 财务 finance（16 文件）

#### 4.9.1 `apply/finFinancingApplicationDealer`（2 文件）

门店：**0** ｜ 母公司(注释)：**8 处**

#### 4.9.2 `bank/`（6 文件）

`finBankCreditRecord/{edit,index}.vue`、`finBankFinancingRecord/{edit,index}.vue`、`finBankVehicleRepaymentRecord/{edit,index}.vue`、`finCustomerRepaymentRecord/{edit,index}.vue`

- 门店：仅 `finBankVehicleRepaymentRecord/edit.vue:87` 1 处（HTML 注释块内）

门店合计：**1 处** ｜ 母公司合计：**23 处**

#### 4.9.3 `factory/`（8 文件）

`finCustomerPurchaseRecord/{edit,index}.vue`、`finDealerRecommendation/{edit,index}.vue`、`finVehicleBindingMileageRecord/edit.vue`、`finVehicleStatusRecord/{edit,index}.vue`

门店合计：**4 处** ｜ 母公司合计：**16 处**

### 4.10 批售模块门店统计汇总

| 模块 | 门店 | 母公司(注释) |
|---|---|---|
| wholesale | 10 | 6 |
| rebate | 6 | 5 |
| back | 4 | 6 |
| basic | 22 | 4 |
| replenish | 6 | 2 |
| fund | 0 | 15 |
| certificate | 2 | 2 |
| shipping | 1 | 0 |
| entorder | 0 | 2 |
| creditsales | 4 | 10 |
| finance.apply | 0 | 8 |
| finance.bank | 1 | 23 |
| finance.factory | 4 | 16 |
| **批售合计** | **60** | **99** |

---

## 五、链接形式分类

### 5.1 门店跳转形式
- `el-link :href="..." target="_blank"`：表单详情页跳门店（绝大多数 `edit.vue`）
- `window.open(..., '_blank')`：列表行按钮跳转（绝大多数 `index.vue`）
- `el-button @click="navigateToRoute({...})"`：批售配置详情页
  - `wholesaleDealerAutoConfirmConf/detail.vue`、`edit.vue`、`index.vue`
  - `wholesaleDealerTestDriveQuota/detail.vue`、`edit.vue`、`index.vue`
  - `wholesaleDealerWholesaleConf/detail.vue`、`edit.vue`、`index.vue`
- 辅助方法 `handleRouteToStoreDetail(...)`（`orderRefund/refundApply/edit.vue`）
- `fieldConfigs.js` 字段配置（`retailOrderInfo/components/fieldConfigs.js`）

### 5.2 母公司跳转形式
- 全部位于注释中（HTML `<!-- -->` 或 JS `//`），本批仅统一路径，未解开。

---

## 六、验证

```bash
# 旧路径清零
grep -r "channelManagement/shopDetail" src/   # → 0
grep -r "channelManagement/companyDetails" src/ # → 0

# 新路径覆盖
grep -r "store/store/detail" src/      # 96 处
grep -r "parentCompany/detail" src/    # 99 处
```

---

## 七、遗留事项

1. **母公司跳转全部位于注释中**，实际生效代码为 0。如需上线母公司详情跳转，需另开任务：
   - 逐文件解开注释
   - 验证字段名对齐（aftersale 页面要求 `companyCode`，需确认 `dealerCompanyCode` / `dealerParentOrgCode` / `parentCompanyCode` 与之对应）
2. `src/views/layout/routeData.js` 内的 URL 别名映射（`channelManagement/parentCompanyDetails`、`channelManagement/shopBasicsMessageDetails`）保留不动，不影响本次跳转逻辑。
