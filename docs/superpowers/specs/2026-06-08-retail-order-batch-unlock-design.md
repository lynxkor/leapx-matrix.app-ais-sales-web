# 门店整车订单 — 取消锁车（单条 + 批量）功能设计

日期：2026-06-08
状态：已批准

## 1. 目标

在门店整车订单（retailOrderInfo）模块中：

1. **编辑页（edit.vue）**：新增"取消锁车"按钮，保留单条流程的全部校验逻辑（门店权限、次数限制、单车调拨确认）。
2. **列表页（index.vue）**：新增"批量取消锁车"按钮，支持一次最多 30 条订单的批量取消锁车；批量场景只允许厂端使用，且强制使用 `DJY099` 申请原因，跳过单车调拨确认。
3. **复用 UnlockDialog**：通过 `mode` prop 区分单/批两种模式，避免维护两份弹框。

## 2. 改动范围

| 文件 | 改动 |
| --- | --- |
| [src/api/vehretail/orderManager/retailOrderInfo/index.js](src/api/vehretail/orderManager/retailOrderInfo/index.js) | 新增 `batchUnlock` 接口封装 |
| [src/views/vehretail/orderManager/retailOrderInfo/index.vue](src/views/vehretail/orderManager/retailOrderInfo/index.vue) | 新增"批量取消锁车"按钮 + `handleBatchUnlock` 方法 |
| [src/views/vehretail/orderManager/retailOrderInfo/edit.vue](src/views/vehretail/orderManager/retailOrderInfo/edit.vue) | 新增"取消锁车"按钮 + 完整单条 `handleUnlock` 逻辑 |
| [src/views/vehretail/orderManager/retailOrderInfo/components/UnlockDialog/index.vue](src/views/vehretail/orderManager/retailOrderInfo/components/UnlockDialog/index.vue) | 新增 `mode` prop 区分单/批逻辑 |

## 3. 接口

### 3.1 新增：批量取消锁车

- **方法**：`POST /web/order/batchUnlock`
- **YAPI**：https://itdev-yapi.leapmotor.com/project/184/interface/api/128773
- **入参**（`Array<OrderUnlockBatchReq>`）：

  ```json
  [
    {
      "retailOrderId": "string",
      "retailOrderCode": "string",
      "remark": "string"   // 备注（来自弹框的 form.remark）
    }
  ]
  ```

- **响应**：`AjaxResultBoolean`，布尔 `data` 表示是否成功。

### 3.2 现有接口（不变）

- `perUnlock` — 单条取消锁车提交
- `checkBeforePerUnlock` — 单条取消锁车前置校验（仅单条用）
- `getOrderUnlockConfig` — 校验门店是否可锁车（仅单条用）
- `getSysConfigParamValue` — 取系统参数（仅单条用）

## 4. 列表页（index.vue）— 批量取消锁车

### 4.1 按钮

放在 `ais-actions` 区域，"取消锁车"（单条）按钮之后：

```html
<el-button
  v-permission="moduleKey+'-batchUnlock'"
  size="small"
  :disabled="selectionList.length === 0 || accountFlag !== false"
  @click="handleBatchUnlock"
>批量取消锁车</el-button>
```

`accountFlag` 为 `false` 表示厂端（已在 `loginUserGet` 中设置）。

### 4.2 `handleBatchUnlock` 流程

1. **厂端校验**：`this.accountFlag !== false` → `this.$message.error('仅厂端可执行批量取消锁车')`，return。
2. **截取前 30 条**：`const list = this.selectionList.slice(0, 30)`（超过 30 条静默截取）。
3. **打开弹框**：`this.$refs.unlockDialog.show({ mode: 'batch', list }, { factoryUnlockStatus: '1' })`。
4. 弹框关闭或成功后 `getData()` 刷新列表。

### 4.3 模板侧引入 UnlockDialog

已存在（`#unlockDialog`），仅修改传参和 `unlockDialog` 内的处理。

## 5. 编辑页（edit.vue）— 单条取消锁车

### 5.1 按钮

放在 `extraButtons` 区域，靠近"自动锁车/手工配车"位置：

```html
<el-button
  size="small"
  :loading="unlockLoading"
  v-if="canPerUnlock"
  v-permission="moduleKey+'-perUnlock'"
  @click="handleUnlock"
>取消锁车</el-button>
```

`canPerUnlock = form.lockStatus === 1`（订单处于锁单状态才显示）。

### 5.2 `handleUnlock` 流程（与 index.vue handleUnlock 一致）

1. 取 `this.row = { id: this._id, retailOrderCode, materialsCode, saleDealerCode, unlockCount }`。
2. 调 `getOrderUnlockConfig` 校验门店权限：`allowUnlockStatus !== 1` → 提示"该门店暂无该车型取消锁车权限"，return。
3. 调 `getSysConfigParamValue({ paramCode: 'veretailUnlockConfigCount' })` 取次数上限。
4. 店端校验：`this.accountFlag && this.row.unlockCount >= unlockConfigCount` → 提示"该订单取消配车次数已达上限"，return。
5. 打开 `UnlockDialog`（`mode: 'single'`），传 `param = { storeUnlockStatus 或 factoryUnlockStatus: '1' }`。
6. 弹框 `submit` 走 `checkBeforePerUnlock` → `perUnlock`。

### 5.3 引入 UnlockDialog 组件

```javascript
import UnlockDialog from './components/UnlockDialog';
```

注册到 `components`，模板中：

```html
<UnlockDialog
  ref="unlockDialog"
  :businessId="_id"
  :row="form"
  :accountFlag="accountFlag"
  @refresh="getDetailData"
/>
```

### 5.4 新增 `data.unlockLoading`、`computed.canPerUnlock`

```javascript
data () {
  return {
    unlockLoading: false,
    // ...
  };
},
computed: {
  canPerUnlock () {
    return this.form.lockStatus === 1;
  }
}
```

## 6. UnlockDialog 改造

### 6.1 新增 `mode` prop

```javascript
props: {
  mode: {
    type: String,
    default: 'single' // 'single' | 'batch'
  }
}
```

### 6.2 数据结构调整

data 中增加：

```javascript
return {
  batchList: [],   // 批量模式下的订单列表
  // ... 现有
};
```

### 6.3 `show` 方法签名扩展

```javascript
show (params, unlockReason) {
  // params: { mode?, list?, materialsCode?, saleDealerCode? }
  this.dialogVisible = true;
  this.vinForm = params;
  this.mode = params.mode || 'single';
  this.batchList = params.list || [];
  this.getList(unlockReason);
}
```

并在 `closed()` 中清理新增字段：

```javascript
closed () {
  this.$refs.form.resetFields();
  this.form = { ...defaultForm };
  this.batchList = [];
  this.mode = 'single';
}
```

### 6.4 批量模式 — 申请原因处理

- `unlockReasonCode` 强制为 `'DJY099'`，下拉只展示 `unlockReasonCode === 'DJY099'` 的选项。
- `computed.batchUnlockReasonOptions`：过滤 `unlockReasonOptions`，仅保留 `DJY099`。
- `el-form-item` 申请原因 `:options="mode === 'batch' ? batchUnlockReasonOptions : unlockReasonOptions"`。
- 当用户切换到非 `DJY099` 项时（基本不会发生，但下拉里若混入要兜底）：`this.$message.error('批量取消锁车只支持申请原因为特殊情况')` 并回滚到 `DJY099`。

### 6.5 批量模式 — submit 流程

```javascript
submit () {
  this.$refs.form.validate(valid => {
    if (!valid) return;
    this.submitLoading = true;
    if (this.mode === 'batch') {
      // 批量：直接调 batchUnlock，跳过 checkBeforePerUnlock
      const params = this.batchList.map(item => ({
        retailOrderId: item.id,
        retailOrderCode: item.retailOrderCode,
        remark: this.form.remark
      }));
      this.doBatchUnlock(params);
    } else {
      // 单条：保留原 checkBeforePerUnlock + perUnlock 流程
      // ... 现有逻辑
    }
  });
}

doBatchUnlock (params) {
  batchUnlock(params).then(res => {
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

### 6.6 批量模式 — UI 差异

- 隐藏"更换后配置"（`shouldShowMaterialField`）— `DJY099` 不需要改配。
- 隐藏"处理方式" / "需绑定 VIN" — 同上。
- 顶部展示已选订单数：`已选择 ${batchList.length} 条订单`，标题改为"批量取消锁车"。

```html
<el-dialog
  :title="mode === 'batch' ? '批量取消锁车' : '取消锁车'"
  :visible.sync="dialogVisible"
  ...
>
  <div v-if="mode === 'batch'" class="batch-tip">
    <i class="el-icon-info"></i>
    本次将对 <b>{{ batchList.length }}</b> 条订单执行取消锁车操作，请填写申请原因与备注。
  </div>
  ...
</el-dialog>
```

## 7. 边界与错误处理

| 场景 | 处理 |
| --- | --- |
| 选择数 > 30 | 静默截取前 30 条（不打断用户） |
| 非厂端点击批量按钮 | 按钮 disabled + 兜底 `message.error` 提示 |
| 批量原因选择非 `DJY099` | `message.error` 提示并自动回滚到 `DJY099` |
| 后端部分失败 | 沿用 `api` 封装提示，依赖后端返回结构 |
| 锁单状态变化（编辑页） | `canPerUnlock` 通过 `form.lockStatus` 动态隐藏按钮 |

## 8. 不在范围内

- 批量接口返回的逐条成功/失败明细展示（由后端统一返回，依赖后端返回结构）。
- 批量场景下 `checkBeforePerUnlock` 调拨确认（按需求跳过）。
- 店端的批量入口（按需求仅厂端可用）。

## 9. 验收标准

1. 列表页：勾选 ≤ 30 条 → 厂端可点击"批量取消锁车"，店端按钮置灰。
2. 列表页：勾选 > 30 条 → 点击后实际只对前 30 条发起请求。
3. 列表页：批量弹框中只能选 `DJY099`，其他项被屏蔽。
4. 编辑页：订单未锁车（`lockStatus !== 1`）时按钮隐藏。
5. 编辑页：点击按钮后 `getOrderUnlockConfig` 校验失败 → 弹错误提示，不开弹框。
6. 编辑页：店端次数超限 → 弹"已达上限"提示，不开弹框。
7. 编辑页：调拨车辆时弹"调拨 / 不调拨"确认。
8. 批量与单条互不影响：单条走完整流程，批量跳过 `checkBeforePerUnlock`。
