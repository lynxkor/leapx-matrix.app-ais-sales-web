// 更新文件: src/views/vehretail/orderManager/retailOrderInfo/fieldConfigs.js
export const retailOrderDisplayFields = [
  { key: 'mallOrderCode', label: '商城订单编号' },
  { key: 'retailOrderCode', label: '整车订单号' },
  { key: 'orderStatusLabel', label: '订单状态' },
  { key: 'orderTime', label: '商城下单时间' },
  { key: 'createTime', label: '创建时间' },
  { key: 'compositeOrderCode', label: '综合订单编码' },
  { key: 'orderSource', label: '订单来源' },
  { key: 'outTradeNo', label: '外部订单号' },
  { key: 'saleModeLabel', label: '销售模式' },
  { key: 'saleDealerName', label: '订单销售门店' },
  { key: 'saleUserName', label: '订单销售顾问' },
  { key: 'deliveryDealerName', label: '订单交付门店' },
  { key: 'deliveryUserName', label: '订单交付顾问' },
  { key: 'preSaleOrderLabel', label: '是否预售订单' },
  { key: 'blindOrderLabel', label: '是否盲订订单' },
  { key: 'remark', label: '订单备注' },
  { key: 'specialRemark', label: '特殊备注' },
  { key: 'contractTerminationFileUrl', label: '合同解除协议文件地址' },
  { key: 'deliveryCycleMaxWeek', label: '交付周期上限(周)' },
  { key: 'dynamicDeliveryCycleDesc', label: '动态交付周期说明' },
  { key: 'initialDeliveryCycleDesc', label: '初始交付周期说明' },
  { key: 'secondNetStoreName', label: '二网门店' }
];

// 购车人信息字段配置
export const carOwnerDisplayFields = [
  { key: 'carBuyerName', label: '购车人姓名' },
  { key: 'carBuyerPhone', label: '购车人手机' },
  { key: 'idCardTypeLabel', label: '证件类型' },
  { key: 'idCardNo', label: '证件号码' },
  { key: 'agentName', label: '代办联系人' },
  { key: 'orderUserName', label: '下单人姓名' },
  { key: 'orderUserPhone', label: '下单人手机号' },
  { key: 'orderUserId', label: '下单人ID' },
  { key: 'orderTypeLabel', label: '订单类型' }
];

// 资金信息字段配置
export const orderFundDisplayFields = [
  { key: 'paymentTime', label: '缴定金时间' },
  { key: 'guidePrice', label: '整车指导价' },
  { key: 'depositAmount', label: '定金' },
  { key: 'invitationCode', label: '邀请码' }
];

// 订单物料信息字段配置
export const materialsDisplayFields = [
  { key: 'skuCode', label: '商品SKU编码' },
  { key: 'productCode', label: '商品编码' },
  { key: 'materialsCode', label: '物料编码' },
  { key: 'seriesName', label: '车系名称' },
  { key: 'modelName', label: '车型名称' },
  { key: 'materialsDesc', label: '物料描述' },
  { key: 'drivingRangeName', label: '续航里程' },
  { key: 'rangePowerName', label: '选配动力' },
  { key: 'exteriorName', label: '外观名称' },
  { key: 'interiorName', label: '内饰名称' },
  { key: 'wheelHubName', label: '轮毂名称' },
  { key: 'yearTypeName', label: '年款名称' },
  { key: 'optionPackageName', label: '选装包名称' }
];

// 锁/配车信息字段配置
export const lockAllocationDisplayFields = [
  { key: 'lockCarTypeLabel', label: '锁车类型' },
  { key: 'lockTypeLabel', label: '锁车匹配类型' },
  { key: 'lockStatusLabel', label: '是否锁单' },
  { key: 'lockTime', label: '锁单时间' },
  { key: 'orderMaterialCode', label: '订单物料码' },
  { key: 'allocationMaterialCode', label: '配车物料编码' },
  { key: 'matchVin', label: '配车VIN码' },
  { key: 'deliveryVin', label: '交车VIN码' },
  { key: 'deliveryTime', label: '交车时间' },
  { key: 'orderSortTime', label: '订单排序时间' },
  { key: 'changeConfigCount', label: '改配次数' },
  { key: 'unlockCount', label: '解绑次数' }
];

// 批售信息字段配置
export const wholesaleDisplayFields = [
  { key: 'wholesaleBindStatusLabel', label: '是否绑定批售' },
  { key: 'lockWholesaleTime', label: '锁批售时间' },
  { key: 'confirmedCount', label: '批售确认次数' },
  { key: 'wholesaleOrderCode', label: '批售订单号' },
  { key: 'matchVin', label: '配车VIN码' },
  { key: 'wholesaleOrderStatusLabel', label: '批售订单状态' },
  { key: 'confirmStatusLabel', label: '批售确认状态' },
  { key: 'confirmTime', label: '批售确认时间' },
  { key: 'createdShippingPlanLabel', label: '是否创建发运计划' }
];

// 订单取消信息字段配置
export const refundDisplayFields = [
  { key: 'cancelReason', label: '订单取消原因' },
  { key: 'cancelDescription', label: '订单取消说明' },
  { key: 'cancelTime', label: '订单取消时间' }
];

// 附属信息字段配置
export const financeDisplayFields = [
  { key: 'financialPlan', label: '金融方案' },
  { key: 'mortgageProgress', label: '金融按揭进度' },
  { key: 'financialOrderCode', label: '金融订单号' },
  { key: 'financialOrderStatusLabel', label: '金融订单状态' },
  { key: 'insuranceProgress', label: '保险办理进度' },
  { key: 'insurancePlan', label: '保险方案' }
];

// 期限信息字段配置
export const termDisplayFields = [
  { key: 'deliveryNoticeTime', label: '触发交付通知时间' },
  { key: 'deliveryDelayFlagLabel', label: '是否延期交付' },
  { key: 'deliveryWithdrawFlagLabel', label: '是否做过交车撤回' },
  { key: 'statusRollbackFlagLabel', label: '状态是否回退过' },
  { key: 'userPickupDeadline', label: '用户提车截止日' },
  { key: 'deliveryDelayDays', label: '交付延期天数' },
  { key: 'rightsEnjoyDate', label: '权益享受日期' }
];

// 整车订单改配信息字段配置————暂时没有
export const modificationRecordDisplayFields = [
  { key: 'operationTime', label: '操作时间' },
  { key: 'operateUserName', label: '操作人' },
  { key: 'paymentTime', label: '缴定金时间' },
  { key: 'materialsDescBefore', label: '修改前物料描述' },
  { key: 'modelNameBefore', label: '修改前车型名称' },
  { key: 'yearTypeNameBefore', label: '修改前年款名称' },
  { key: 'materialsCodeAfter', label: '修改后物料编码' },
  { key: 'modelNameAfter', label: '修改后车型名称' },
  { key: 'yearTypeNameAfter', label: '修改后年款名称' },
  { key: 'materialsCodeBefore', label: '修改前物料编码' },
  { key: 'materialsDescAfter', label: '修改后物料描述' },
  { key: 'remark', label: '备注' }
];

// 订单信息变更申请字段配置
export const orderChangeApplicationDisplayFields = [
  { key: 'changeApplyCode', label: '订单变更申请编号' },
  { key: 'applyStatusLabel', label: '申请状态' },
  { key: 'changeTypeLabel', label: '变更类型' },
  { key: 'changeReason', label: '变成原因' },
  { key: 'changeDescription', label: '变更说明' },
  { key: 'deliveryStatusLabel', label: '是否完成交车' },
  { key: 'createTime', label: '创建时间' }
];

// 锁车解绑申请记录字段配置
export const unlockApplicationRecordDisplayFields = [
  { key: 'unlockApplyCode', label: '申请单号' },
  { key: 'submitTime', label: '提交时间' },
  { key: 'unlockReason', label: '订单解绑原因' },
  { key: 'vin', label: 'VIN号' },
  { key: 'wholesaleOrderCode', label: '批售订单号' },
  { key: 'applyDesc', label: '申请说明' },
  { key: 'orderHandleTypeLabel', label: '订单处理方式' },
  { key: 'carHandleTypeLabel', label: '车辆处理方式' },
  { key: 'autoGenerateStatusLabel', label: '是否自动生成' },
  { key: 'auditUserName', label: '审核人' },
  { key: 'auditTime', label: '审核时间' }
];

// 锁车记录字段配置
export const lockCarRecordDisplayFields = [
  { key: 'saleDealerName', label: '门店' }, // 塞入销售门店数据
  { key: 'retailOrderCode', label: '整车订单' },
  { key: 'mallOrderCode', label: '商城订单编号' },
  { key: 'wholesaleOrderCode', label: '批售单号' },
  { key: 'lockTypeLabel', label: '锁车匹配类型' },
  { key: 'materialsCode', label: '物料编码' },
  { key: 'materialsDesc', label: '物料描述' },
  { key: 'paymentTime', label: '缴定金时间' }, // 少
  { key: 'vin', label: 'VIN号' },
  { key: 'createTime', label: '创建时间' } // 少
];

// 订单透明化状态跟踪字段配置
export const orderTransparencyTrackingDisplayFields = [
  { key: 'trackCode', label: '编号' },
  { key: 'saleDealerName', label: '门店' }, // 塞入销售门店数据
  { key: 'retailOrderCode', label: '整车订单' },
  { key: 'oldOrderStatus', label: '原订单状态' },
  { key: 'newOrderStatus', label: '新订单状态' },
  { key: 'operateTime', label: '操作时间' },
  { key: 'operateDesc', label: '操作描述' }
];

// 订单退订记录字段配置
export const orderCancellationRecordDisplayFields = [
  { key: 'refundCode', label: '退订申请单号' },
  { key: 'refundStatusLabel', label: '申请单状态' },
  { key: 'applyTime', label: '申请时间' },
  { key: 'creator', label: '申请人' },
  { key: 'orderRefundTypeLabel', label: '退订方式' },
  { key: 'subCateName', label: '退订原因分类' },
  { key: 'refundReason', label: '退订原因说明' }
];

// 订单收款记录字段配置
export const orderPaymentRecordDisplayFields = [
  { key: 'payCategoryLabel', label: '收款类型', width: '25%' },
  { key: 'paymentTypeLabel', label: '支付方式', width: '25%' },
  { key: 'paymentAmount', label: '付款金额', width: '25%' },
  { key: 'paymentTime', label: '付款时间', width: '25%' }
];
