# 门店整车订单 — 取消锁车（单条+批量）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 retailOrderInfo 模块新增"批量取消锁车"功能（列表页，厂端，最多 30 条），并在编辑页保留完整的单条取消锁车流程。

**Architecture:** 复用 `UnlockDialog` 组件，通过新增 `mode` prop（`'single' | 'batch'`）区分单/批两种交互；单条走完整 `checkBeforePerUnlock → perUnlock` 流程，批量走 `batchUnlock` 接口、强制 `DJY099` 申请原因、跳过调拨确认。

**Tech Stack:** Vue 2.6 + Element UI + 微前端 (`@/libs` 共享库) + `api.jsonPost` 请求封装。

**Spec:** [docs/superpowers/specs/2026-06-08-retail-order-batch-unlock-design.md](../specs/2026-06-08-retail-order-batch-unlock-design.md)

**测试说明:** 本项目为 Vue 2 微前端子应用，无 Jest/Vitest 自动化测试基础设施；变更以"读-改-本地启动 + 浏览器手测"为验证方式（与项目 CLAUDE.md 一致）。每个任务的"验证"步骤列出预期看到的行为。

---

## 文件改动一览

| 文件 | 改动 |
| --- | --- |
| [src/api/vehretail/orderManager/retailOrderInfo/index.js](src/api/vehretail/orderManager/retailOrderInfo/index.js) | 新增 `batchUnlock` 导出函数 |
| [src/views/vehretail/orderManager/retailOrderInfo/components/UnlockDialog/index.vue](src/views/vehretail/orderManager/retailOrderInfo/components/UnlockDialog/index.vue) | 新增 `mode` / `batchList` 数据 / `batchUnlockReasonOptions` 计算属性 / 批量 submit 分支 |
| [src/views/vehretail/orderManager/retailOrderInfo/index.vue](src/views/vehretail/orderManager/retailOrderInfo/index.vue) | 列表页新增"批量取消锁车"按钮 + `handleBatchUnlock` 方法 |
| [src/views/vehretail/orderManager/retailOrderInfo/edit.vue](src/views/vehretail/orderManager/retailOrderInfo/edit.vue) | 编辑页新增"取消锁车"按钮 + 完整 `handleUnlock` 逻辑 + 引入 `UnlockDialog` |

---

## Task 1: 在 API 模块新增 batchUnlock

**Files:**
- Modify: [src/api/vehretail/orderManager/retailOrderInfo/index.js](src/api/vehretail/orderManager/retailOrderInfo/index.js) — 在 `autoLock` 函数后追加 `batchUnlock`

- [ ] **Step 1: 打开 `index.js` 定位插入点**

打开 `src/api/vehretail/orderManager/retailOrderInfo/index.js`，找到 `autoLock` 函数（大约在 122-124 行）：

```js
export function autoLock (data) {
  return api.jsonPost('vr/web/order/autoLock', data);
};
```

- [ ] **Step 2: 在 `autoLock` 后插入 `batchUnlock`**

在该函数下方、`querySnapShot` 上方插入：

```js
/**
 * 批量取消锁车
 * @param {Array<{retailOrderId:string,retailOrderCode:string,remark:string}>} data
 */
export function batchUnlock (data) {
  return api.jsonPost('vr/web/order/batchUnlock', data);
}
```

参考 YAPI: https://itdev-yapi.leapmotor.com/project/184/interface/api/128773，接口路径 `/web/order/batchUnlock`，前缀 `vr/`，最终 `vr/web/order/batchUnlock`（与 `autoLock` 同一前缀风格）。

- [ ] **Step 3: 提交**

```bash
cd d:/xiaofu/app-ais-sales-front
git add src/api/vehretail/orderManager/retailOrderInfo/index.js
git commit -m "feat(api): 新增 batchUnlock 批量取消锁车接口封装"
```

---

## Task 2: UnlockDialog 增加批量模式支持

**Files:**
- Modify: [src/views/vehretail/orderManager/retailOrderInfo/components/UnlockDialog/index.vue](src/views/vehretail/orderManager/retailOrderInfo/components/UnlockDialog/index.vue)

- [ ] **Step 1: 在 `<script>` 顶部 import 增加 `batchUnlock`**

找到第 88 行附近的 import：

```js
import { perUnlock, checkBeforePerUnlock, getSysConfigParamValue } from '@/api/vehretail/orderManager/retailOrderInfo/index';
```

改为：

```js
import { perUnlock, checkBeforePerUnlock, getSysConfigParamValue, batchUnlock } from '@/api/vehretail/orderManager/retailOrderInfo/index';
```

- [ ] **Step 2: 新增 `mode` prop**

找到 `props` 块（约 110-123 行），在 `accountFlag` 之后追加：

```js
mode: {
  type: String,
  default: 'single' // 'single' | 'batch'
}
```

- [ ] **Step 3: data 中新增 `batchList`**

在 `data()` 返回对象内（约 130 行），在 `unlockReasonOptions: []` 之后追加：

```js
batchList: [],
```

- [ ] **Step 4: computed 中新增 `batchUnlockReasonOptions` 与 `isBatch`**

在现有的 `computed` 块（约 162 行）后追加：

```js
isBatch () {
  return this.mode === 'batch';
},
batchUnlockReasonOptions () {
  return (this.unlockReasonOptions || []).filter(item => item.unlockReasonCode === 'DJY099');
}
```

- [ ] **Step 5: 修改 `show` 方法接收批量参数**

找到 `show (params, unlockReason)` 方法（约 226-230 行）：

```js
show (params, unlockReason) {
  this.dialogVisible = true;
  this.vinForm = params;
  this.getList(unlockReason);
},
```

改为：

```js
show (params, unlockReason) {
  this.dialogVisible = true;
  this.mode = (params && params.mode) || 'single';
  this.batchList = (params && params.list) || [];
  this.vinForm = params;
  this.getList(unlockReason);
  if (this.mode === 'batch') {
    // 批量模式强制默认申请原因为 DJY099
    this.$nextTick(() => {
      this.form.unlockReasonCode = 'DJY099';
    });
  }
},
```

- [ ] **Step 6: 修改 `closed` 重置新增字段**

找到 `closed()` 方法（约 222-225 行）：

```js
closed () {
  this.$refs.form.resetFields();
  this.form = { ...defaultForm };
},
```

改为：

```js
closed () {
  this.$refs.form.resetFields();
  this.form = { ...defaultForm };
  this.batchList = [];
  this.mode = 'single';
},
```

- [ ] **Step 7: 模板标题与提示文案（顶部 dialog 元素）**

找到模板顶部的 `<el-dialog>` 标签（约 2-10 行）：

```html
<el-dialog
  class="m-confirmdoc-dialog"
  title="取消锁车"
  width="30%"
  :visible.sync="dialogVisible"
  @close="close"
  @closed="closed"
  :z-index="2001"
>
```

将 `title="取消锁车"` 改为：

```html
:title="isBatch ? '批量取消锁车' : '取消锁车'"
```

- [ ] **Step 8: 模板插入"批量"顶部提示**

在 `<el-form>` 元素前插入：

```html
<div v-if="isBatch" class="batch-tip" style="padding: 0 20px 12px; color: #E6A23C; font-size: 12px;">
  <i class="el-icon-info"></i>
  本次将对 <b>{{ batchList.length }}</b> 条订单执行取消锁车操作（仅厂端可用，最多 30 条）。
</div>
```

- [ ] **Step 9: 申请原因下拉切换为批量选项**

找到 `<fetch-select>` 申请原因（约 13-24 行），将 `:options="unlockReasonOptions"` 替换为：

```html
:options="isBatch ? batchUnlockReasonOptions : unlockReasonOptions"
```

- [ ] **Step 10: `handleUnlockReasonCodeChange` 增加批量校验**

找到 `handleUnlockReasonCodeChange` 方法（约 180-190 行）：

```js
handleUnlockReasonCodeChange (val, row) {
  this.form.unlockReason = row.unlockReason;
  this.form.reasonExplain = row.reasonExplain;
  // 切换申请原因时，清空其他可能变化的字段
  this.form.materialsCode = '';
  this.form.materialsDesc = '';
  this.form.orderHandleType = null;
  this.form.bindVin = '';
  this.form.remark = '';
  this.form.orderUnlockFileReqList = [];
},
```

在函数体最前面增加（`val` 判空之后）：

```js
if (this.mode === 'batch' && val !== 'DJY099') {
  this.$message.error('批量取消锁车只支持申请原因为特殊情况');
  this.$nextTick(() => {
    this.form.unlockReasonCode = 'DJY099';
  });
  return;
}
```

完整方法体：

```js
handleUnlockReasonCodeChange (val, row) {
  if (this.mode === 'batch' && val !== 'DJY099') {
    this.$message.error('批量取消锁车只支持申请原因为特殊情况');
    this.$nextTick(() => {
      this.form.unlockReasonCode = 'DJY099';
    });
    return;
  }
  this.form.unlockReason = row.unlockReason;
  this.form.reasonExplain = row.reasonExplain;
  // 切换申请原因时，清空其他可能变化的字段
  this.form.materialsCode = '';
  this.form.materialsDesc = '';
  this.form.orderHandleType = null;
  this.form.bindVin = '';
  this.form.remark = '';
  this.form.orderUnlockFileReqList = [];
},
```

- [ ] **Step 11: `submit` 拆分单/批分支**

找到 `submit()` 方法（约 231-272 行）：

```js
submit () {
  this.$refs.form.validate(valid => {
    if (valid) {
      this.submitLoading = true;
      const params = {
        retailOrderId: this.businessId,
        retailOrderCode: this.row.retailOrderCode,
        ...
```

将整个 `submit` 方法体改为：

```js
submit () {
  this.$refs.form.validate(valid => {
    if (!valid) return;
    this.submitLoading = true;
    if (this.mode === 'batch') {
      this.doBatchUnlock();
    } else {
      this.doSingleUnlock();
    }
  });
},
doSingleUnlock () {
  const params = {
    retailOrderId: this.businessId,
    retailOrderCode: this.row.retailOrderCode,
    unlockReasonCode: this.form.unlockReasonCode,
    unlockReason: this.form.unlockReason,
    materialsCode: this.form.materialsCode,
    materialsDesc: this.form.materialsDesc,
    orderHandleType: this.form.orderHandleType,
    bindVin: this.form.bindVin,
    remark: this.form.remark,
    orderUnlockFileReqList: this.form.orderUnlockFileReqList,
    changeProductSkuPriceId: this.form.changeProductSkuPriceId,
  };
  // 先调用弹框校验接口,根据返回的 transferVehicle 判断是否需要弹"调拨回原门店"提示
  checkBeforePerUnlock(params).then(checkRes => {
    const transferVehicle = checkRes && checkRes.transferVehicle;
    if (transferVehicle) {
      const originalDealerName = (checkRes && checkRes.originalDealerName) || '';
      this.$confirm(`订单车辆为自动调拨匹配，取消锁车是否自动调拨车辆回原门店（${originalDealerName}）`, '取消锁车', {
        confirmButtonText: '调拨',
        cancelButtonText: '不调拨',
        type: 'warning'
      }).then(() => {
        this.doPerUnlock({ ...params, confirmTransferBack: true });
      }).catch(() => {
        this.doPerUnlock({ ...params, confirmTransferBack: false });
      });
    } else {
      this.doPerUnlock(params);
    }
  }).catch(() => {
    this.submitLoading = false;
  });
},
doBatchUnlock () {
  // 批量：直接调 batchUnlock，跳过 checkBeforePerUnlock
  const params = this.batchList.map(item => ({
    retailOrderId: item.id,
    retailOrderCode: item.retailOrderCode,
    remark: this.form.remark
  }));
  if (!params.length) {
    this.$message.warning('未选择任何订单');
    this.submitLoading = false;
    return;
  }
  batchUnlock(params).then(() => {
    this.$message.success('批量取消锁车成功');
    this.$emit('refresh');
  }).catch(() => {
    this.$message.error('批量取消锁车失败，请稍后重试');
  }).finally(() => {
    this.submitLoading = false;
    this.close();
  });
}
```

- [ ] **Step 12: 保留原 `doPerUnlock` 方法不动**

`doPerUnlock` 方法（约 273-281 行）保持原样，无需修改。

- [ ] **Step 13: 验证编译**

```bash
cd d:/xiaofu/app-ais-sales-front
npm run local
```

启动本地服务（端口 7779），打开浏览器 DevTools 控制台，确认无 JS 报错。然后进入订单详情页（带 `_id`）点击"取消锁车"按钮，应能正常弹出 `UnlockDialog` 且仍走单条流程（说明 `mode='single'` 默认值生效）。

- [ ] **Step 14: 提交**

```bash
cd d:/xiaofu/app-ais-sales-front
git add src/views/vehretail/orderManager/retailOrderInfo/components/UnlockDialog/index.vue
git commit -m "feat(unlock-dialog): 支持批量模式 (mode='batch')"
```

---

## Task 3: 列表页 index.vue 新增批量取消锁车入口

**Files:**
- Modify: [src/views/vehretail/orderManager/retailOrderInfo/index.vue](src/views/vehretail/orderManager/retailOrderInfo/index.vue)

- [ ] **Step 1: 模板 — 在原"取消锁车"按钮后新增"批量取消锁车"按钮**

找到约 215 行的按钮：

```html
<el-button v-permission="moduleKey+'-perUnlock'" size="small" :disabled="selectionList.length !== 1 || (selectionList.length > 0 && selectionList[0].lockStatus === 0)" @click="handleUnlock">取消锁车</el-button>
```

在其后追加：

```html
<el-button v-permission="moduleKey+'-batchUnlock'" size="small" :disabled="selectionList.length === 0 || accountFlag !== false" @click="handleBatchUnlock">批量取消锁车</el-button>
```

- [ ] **Step 2: `handleBatchUnlock` 方法 — 在 `handleUnlock` 之后插入**

找到 `handleUnlock` 方法（约 610-638 行），在其后插入新方法：

```js
async handleBatchUnlock () {
  // 1. 厂端校验
  if (this.accountFlag !== false) {
    this.$message.error('仅厂端可执行批量取消锁车');
    return;
  }
  // 2. 截取前 30 条
  const list = this.selectionList.slice(0, 30);
  // 3. 打开弹框（批量模式）
  this.$refs.unlockDialog.show(
    { mode: 'batch', list, materialsCode: list[0]?.materialsCode, saleDealerCode: list[0]?.saleDealerCode },
    { factoryUnlockStatus: '1' }
  );
},
```

说明：
- `mode: 'batch'` 触发 `UnlockDialog` 批量分支（Task 2 改造）。
- `list` 是从 `selectionList` 截取的前 30 条（即使后端已校验前端也兜底）。
- 第二个参数 `{ factoryUnlockStatus: '1' }` 通过 `unlockDialog.show` 透传给 `getList` 的接口参数（与现有单条调用一致），如果现有 `getList` 不需要此参数，传 `{}` 即可 — 这里保留与单条一致便于后续扩展。

- [ ] **Step 3: 验证按钮与权限**

```bash
cd d:/xiaofu/app-ais-sales-front
npm run local
```

启动后用**厂端账号**登录（`accountFlag === false`），访问 `/vehretail/orderManager/retailOrderInfo` 路径：
- 多选框至少勾选 1 条时，"批量取消锁车"按钮应可点。
- 多选框为空时按钮置灰。
- 用**店端账号**（`accountFlag === true`）登录，按钮应保持置灰（disabled）。

- [ ] **Step 4: 验证弹框**

点击按钮后：
- 弹框标题应为"批量取消锁车"。
- 顶部应出现橙色提示"本次将对 N 条订单执行取消锁车操作..."。
- 申请原因下拉只展示一个 `DJY099` 选项。
- 切换到其他项（如有）应被弹窗+回滚（如果只有一项则不会触发）。
- 提交后调用 `/web/order/batchUnlock`（DevTools Network 可看）。

- [ ] **Step 5: 提交**

```bash
cd d:/xiaofu/app-ais-sales-front
git add src/views/vehretail/orderManager/retailOrderInfo/index.vue
git commit -m "feat(retail-order-list): 新增批量取消锁车入口（厂端，最多30条）"
```

---

## Task 4: 编辑页 edit.vue 新增单条取消锁车入口

**Files:**
- Modify: [src/views/vehretail/orderManager/retailOrderInfo/edit.vue](src/views/vehretail/orderManager/retailOrderInfo/edit.vue)

- [ ] **Step 1: 模板 — 在 `extraButtons` 区域新增"取消锁车"按钮**

找到 `<template #extraButtons>` 块（约 20-33 行），在"自动锁车"按钮后追加（与自动锁车对称）：

```html
<el-button size="small" :loading="unlockLoading" v-if="canPerUnlock" v-permission="moduleKey+'-perUnlock'" @click="handleUnlock">取消锁车</el-button>
```

- [ ] **Step 2: 引入 `UnlockDialog` 组件并注册**

在 `<script>` 顶部 import 区域（约 438 行）找到：

```js
import { getDetail, addOrUpdate, autoLock, querySnapShot, setSpecialRemark, getUnbindContractUrl, getDetailDecryptField } from '@/api/vehretail/orderManager/retailOrderInfo/index';
```

将其改为：

```js
import { getDetail, addOrUpdate, autoLock, querySnapShot, setSpecialRemark, getUnbindContractUrl, getDetailDecryptField, getOrderUnlockConfig, getSysConfigParamValue } from '@/api/vehretail/orderManager/retailOrderInfo/index';
```

在 `<script>` 顶部其他 import 之后（约 477 行附近）追加：

```js
import UnlockDialog from './components/UnlockDialog';
```

- [ ] **Step 3: 注册 `UnlockDialog` 到 `components`**

找到 `components` 块（约 528-538 行）：

```js
components: {
  PurchaseAgreementDialog,
  MaterialsDialog,
  VinDialog,
  NavTop,
  ComponentTable,
  GenericDetailDisplay,
  EditPageLayout,
  EditBaseContainer,
  FetchSelect
}
```

在 `FetchSelect` 后追加：

```js
UnlockDialog
```

- [ ] **Step 4: 模板 — 在 `</el-main>` 前添加 `UnlockDialog` 引用**

在 `</edit-base-container>` 标签之前、`</template>` 之前（`<el-main ref="scrollContainer">` 之后但还在 `<edit-base-container>` 内），找到 `materials-dialog` 引用附近（约 392 行）：

```html
<materials-dialog ref="materialsDialog" :row="form" @confirm="getDetailData" />
```

在该行后追加：

```html
<unlock-dialog
  ref="unlockDialog"
  :businessId="_id"
  :row="form"
  :accountFlag="accountFlag"
  @refresh="getDetailData"
/>
```

- [ ] **Step 5: data 中新增 `unlockLoading`**

找到 `data()` 返回对象（约 575 行），在 `qualityIssueLoading: false` 后追加：

```js
unlockLoading: false, // 取消锁车的 loading 状态
```

- [ ] **Step 6: computed 中新增 `canPerUnlock`**

在现有 `computed` 块（539-554 行）的 `carOwnerFormData` 之后追加：

```js
canPerUnlock () {
  // 订单处于锁车状态（lockStatus === 1）时才显示取消锁车按钮
  return this.form.lockStatus === 1;
}
```

- [ ] **Step 7: 添加 `handleUnlock` 方法**

在 `methods` 中（754 行附近），在 `handleSetSpecialMark` 之前或合适位置插入新方法：

```js
async handleUnlock () {
  this.unlockLoading = true;
  this.row = { ...this.form, id: this._id };
  try {
    const res = await getOrderUnlockConfig(this.row.retailOrderCode);
    if (!res || res.allowUnlockStatus !== 1) {
      this.$message.error('该门店暂无该车型取消锁车权限');
      return;
    }
    const res1 = await getSysConfigParamValue({ paramCode: 'veretailUnlockConfigCount' });
    const unlockConfigCount = res1?.paramValue !== null && res1?.paramValue !== undefined ? Number(res1.paramValue) : 1;
    if (this.accountFlag && this.row.unlockCount >= unlockConfigCount) {
      this.$message.error('该订单取消配车次数已达上限');
      return;
    }
    const param = {
      [this.accountFlag ? 'storeUnlockStatus' : 'factoryUnlockStatus']: '1'
    };
    this.$refs.unlockDialog.show(
      { materialsCode: this.row.materialsCode, saleDealerCode: this.row.saleDealerCode },
      param
    );
  } catch (error) {
    this.$message.error('取消锁车失败，请稍后重试');
  } finally {
    this.unlockLoading = false;
  }
},
```

逻辑与 [src/views/vehretail/orderManager/retailOrderInfo/index.vue](src/views/vehretail/orderManager/retailOrderInfo/index.vue) `handleUnlock`（610-638 行）一致。

- [ ] **Step 8: 验证**

```bash
cd d:/xiaofu/app-ais-sales-front
npm run local
```

打开一条已锁车的订单详情页（如 `_id` 对应 `lockStatus === 1`）：
- "取消锁车"按钮应显示在 extraButtons 区域。
- 点击后弹出 `UnlockDialog`（单条模式，标题为"取消锁车"）。
- 走完整流程：getOrderUnlockConfig → getSysConfigParamValue → 弹框内 checkBeforePerUnlock（如调拨）→ perUnlock。
- 取消锁车成功后页面应通过 `@refresh="getDetailData"` 刷新详情。

打开一条未锁车的订单（`lockStatus === 0` 或缺省）：按钮应隐藏。

- [ ] **Step 9: 提交**

```bash
cd d:/xiaofu/app-ais-sales-front
git add src/views/vehretail/orderManager/retailOrderInfo/edit.vue
git commit -m "feat(retail-order-edit): 新增取消锁车入口（保留单条完整校验）"
```

---

## Task 5: 端到端验证

- [ ] **Step 1: 回归单条流程**

打开任意已锁车的订单详情 → 点击"取消锁车" → 走完流程 → 确认成功后 `lockStatus` 变为 0，按钮隐藏（`canPerUnlock` 计算属性变化）。

- [ ] **Step 2: 回归批量流程**

回到列表页 → 厂端账号 → 勾选 ≤ 30 条 → 点击"批量取消锁车" → 弹框中只能选 DJY099 → 提交 → 列表刷新，被选订单 `lockStatus` 变为 0。

- [ ] **Step 3: 边界场景**

- 列表页勾选 35 条 → 点击"批量取消锁车" → DevTools Network 应只看到 30 条的请求体。
- 店端账号 → 批量按钮保持置灰。
- 强制设置 `accountFlag = true` 调用 `handleBatchUnlock`（DevTools 改值）→ 应弹出"仅厂端可执行批量取消锁车"提示并 return。
- 弹框中（单条）切到 DJY003（用户要求更换配置）→ 应显示"更换后配置"按钮；切回其他则隐藏。

- [ ] **Step 4: 检查权限点**

确认已在权限系统新增 `AISVR-retailOrderInfo-batchUnlock` 权限点，并分配给需要使用批量取消锁车的角色（厂端）。`perUnlock` 权限点已存在。

- [ ] **Step 5: 最终提交（如有遗留）**

```bash
cd d:/xiaofu/app-ais-sales-front
git status
# 如有未提交修改：
git add -A
git commit -m "fix: 调整取消锁车功能细节"
```

---

## Self-Review

**1. Spec 覆盖检查：**
- 目标 1（编辑页保留单条完整校验）→ Task 4 ✅
- 目标 2（列表页批量取消锁车）→ Task 3 ✅
- 目标 3（UnlockDialog mode 区分）→ Task 2 ✅
- API 封装 → Task 1 ✅
- 边界：30 条截取 → Task 3 Step 2 ✅
- 边界：厂端校验 → Task 3 Step 2 + Task 3 Step 1 disabled ✅
- 边界：DJY099 强制 → Task 2 Step 9/10 ✅
- remark 字段 → Task 2 Step 11 `doBatchUnlock` ✅
- 跳过 checkBeforePerUnlock → Task 2 Step 11 `doBatchUnlock` 独立分支 ✅
- 单条保留 checkBeforePerUnlock → Task 2 Step 11 `doSingleUnlock` + Step 12 doPerUnlock 不动 ✅

**2. 占位符扫描：** 无 TBD/TODO，所有代码片段完整。

**3. 类型一致性：**
- `mode` 在 UnlockDialog props 与 show() 参数中一致使用。
- `batchList` 在 show() 写入、在 doBatchUnlock 读取、在 closed() 重置。
- `selectionList` 在 index.vue 现有 data 中已存在，Task 3 复用无新增。
- `accountFlag` 在 index.vue（380 行）与 edit.vue（584 行）均已存在，Task 3/4 复用无新增。

**4. 现有流程不破坏：**
- `doPerUnlock` 单条提交函数原样保留。
- `getOrderUnlockConfig` / `getSysConfigParamValue` 接口路径不变。
- `perUnlock` / `checkBeforePerUnlock` 接口路径不变。

无 issue，无需调整。
