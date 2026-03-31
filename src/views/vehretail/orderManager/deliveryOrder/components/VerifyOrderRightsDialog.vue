<template>
  <div>
    <!-- 核销权益弹框 -->
    <el-dialog
      :visible.sync="visible"
      title="核销权益"
      width="1200px"
      :close-on-click-modal="false"
      class="verify-order-rights-dialog"
    >
      <div class="dialog-content" v-loading="loading">
        <vxe-table
          ref="rightsTable"
          :data="tableData"
          :height="400"
          :checkbox-config="{ checkField: 'checked', checkMethod: ({ row }) => row.status !== 2 }"
        >
          <vxe-column type="checkbox" width="60" fixed="left" />
          <vxe-column field="rightsGrantCode" title="权益 ID" width="200" />
          <vxe-column field="rightsName" title="权益名称" width="150" />
          <vxe-column field="cardType" title="卡券类型" width="120">
            <template v-slot="{ row }">
              <span>{{ row.cardType = 'fullcut' ? '满减卡' : row.cardType = 'discount' ? '折扣卡' : '' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="paymentAmount" title="满减金额" width="120"  />
          <vxe-column field="effectDate" title="领券时间" width="180" />
          <vxe-column field="expiryDate" title="有效期" width="180" />
          <vxe-column field="rightsStatus" title="状态" width="100">
            <template v-slot="{ row }">
              <span>{{ {'1': '待生效', '2': '可使用', '3': '已锁定', '4': '已使用', '5': '已失效', '6': '已回收'}[row.rightsStatus] || row.rightsStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="rightsDesc" title="权益说明" min-width="200">
            <template v-slot="{ row }">
              <span v-html="row.rightsDesc" />
            </template>
          </vxe-column>
          <!-- <vxe-column field="applicableVehicle" title="适用车型" min-width="150" /> -->
        </vxe-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">核销选中权益</el-button>
      </div>
    </el-dialog>

    <!-- 核销结果弹框 -->
    <el-dialog
      :visible.sync="resultVisible"
      width="500px"
      :close-on-click-modal="false"
      class="verify-order-rights-result-dialog"
    >
      <div class="result-content">
        <div class="result-header">
          <i class="el-icon-warning"></i>
          <span>核销权益提示</span>
        </div>
        <div class="result-list">
          <!-- 成功信息 -->
          <div v-if="resultData.consumeSuccessCount > 0" class="result-item success-item">
            <span class="result-status success">
              核销成功：{{ resultData.consumeSuccessCount }}条
            </span>
          </div>
          <!-- 锁定失败信息 -->
          <div v-if="resultData.lockErrCount > 0" class="result-item fail-item">
            <span class="result-status fail">
              权益锁定失败：{{ resultData.lockErrCount }}条
            </span>
            <div v-if="resultData.lockErr" class="fail-details">
              <span class="fail-reason">{{ resultData.lockErr }}</span>
            </div>
          </div>
          <!-- 核销失败信息 -->
          <div v-if="resultData.consumeErrCount > 0" class="result-item fail-item">
            <span class="result-status fail">
              核销失败：{{ resultData.consumeErrCount }}条
            </span>
            <div v-if="resultData.consumeErr" class="fail-details">
              <span class="fail-reason">{{ resultData.consumeErr }}</span>
            </div>
          </div>
          <!-- 其他失败信息 -->
          <div v-if="resultData.otherErrCount > 0" class="result-item fail-item">
            <span class="result-status fail">
              其他失败：{{ resultData.otherErrCount }}条
            </span>
            <div v-if="resultData.otherErr" class="fail-details">
              <span class="fail-reason">{{ resultData.otherErr }}</span>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCloseResult">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>import {
  openGrantQuery, // 核销订单权益列表
  cancelOrderRights, // 核销订单权益
} from '@/api/vehretail/orderManager/deliveryOrder/index';
export default {
  name: 'VerifyOrderRightsDialog',
  props: {
    // 订单 ID
    orderId: {
      type: [String, Number],
      default: ''
    },
    // 交车单
    deliveryOrderId: {
      type: [String, Number],
      default: ''
    },
    // 订单用户 ID
    orderUserId: {
      type: [String, Number],
      default: ''
    },
    // 商城订单code
    shopCode: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      resultVisible: false,
      loading: false,
      submitLoading: false,
      tableData: [],
      // 内部缓存 shopCode，用于接收 open 方法传入的参数
      cachedShopCode: '',
      resultData: {
        consumeSuccessCount: 0,
        lockErrCount: 0,
        consumeErrCount: 0,
        otherErrCount: 0,
        lockErr: '',
        consumeErr: '',
        otherErr: ''
      }
    };
  },
  computed: {},
  methods: {
    // 打开对话框
    open (shopCode) {
      // 优先使用传入的 shopCode，否则使用 prop
      this.cachedShopCode = shopCode || this.shopCode;
      // 检查 shopCode 是否存在
      if (!this.cachedShopCode) {
        this.$message.warning('订单数据加载中，请稍后再试');
        return;
      }
      this.visible = true;
      this.loadRightsList();
    },
    // 关闭对话框
    close () {
      this.visible = false;
      this.tableData = [];
    },
    // 关闭结果对话框
    closeResult () {
      this.resultVisible = false;
      this.resultData = {};
    },
    // 加载权益列表（模拟接口）
    async loadRightsList () {
      this.loading = true;
      try {
        // 使用 cachedShopCode
        const response = await openGrantQuery({
          userId: this.orderUserId,
          shopCode: this.cachedShopCode,
        });
        console.log('loadRightsList', response);
        this.tableData = response;
        // 模拟数据
        // this.tableData = [
        //   {
        //     rightsId: 'LEAP2323923657923462',
        //     rightsName: '盲订优惠券',
        //     couponType: '满减卡',
        //     discountAmount: '100,000.00',
        //     receiveTime: '2023-07-12 12:12:12',
        //     validPeriod: '2023-07-12 12:12:12',
        //     statusLabel: '未核销',
        //     status: '1',
        //     description: '这是一条权益说明',
        //     applicableVehicle: '',
        //     checked: false
        //   },
        //   {
        //     rightsId: 'LEAP2323923657923463',
        //     rightsName: '盲订优惠券',
        //     couponType: '满减卡',
        //     discountAmount: '100,000.00',
        //     receiveTime: '2023-07-12 12:12:12',
        //     validPeriod: '2023-07-12 12:12:12',
        //     statusLabel: '已核销',
        //     status: '2',
        //     description: '这是一条权益说明',
        //     applicableVehicle: '',
        //     checked: false
        //   },
        //   {
        //     rightsId: 'LEAP2323923657923464',
        //     rightsName: '盲订优惠券',
        //     couponType: '满减卡',
        //     discountAmount: '100,000.00',
        //     receiveTime: '2023-07-12 12:12:12',
        //     validPeriod: '2023-07-12 12:12:12',
        //     statusLabel: '未核销',
        //     status: '1',
        //     description: '这是一条权益说明',
        //     applicableVehicle: '',
        //     checked: false
        //   },
        //   {
        //     rightsId: 'LEAP2323923657923465',
        //     rightsName: '盲订优惠券',
        //     couponType: '满减卡',
        //     discountAmount: '100,000.00',
        //     receiveTime: '2023-07-12 12:12:12',
        //     validPeriod: '2023-07-12 12:12:12',
        //     statusLabel: '已核销',
        //     status: '2',
        //     description: '这是一条权益说明',
        //     applicableVehicle: '',
        //     checked: false
        //   }
        // ];
      } catch (error) {
        console.error('加载权益列表失败:', error);
      } finally {
        this.loading = false;
      }
    },
    // 取消
    handleCancel () {
      this.close();
    },
    // 提交核销
    async handleSubmit () {
      const checkedRows = this.$refs.rightsTable.getCheckboxRecords();
      if (checkedRows.length === 0) {
        this.$message.warning('请至少选择一项权益');
        return;
      }
      try {
        this.submitLoading = true;
        const params = {
          deliveryOrderId: this.orderId,
          openWriteOffRights: checkedRows
        };
        const response = await cancelOrderRights(params);
        const data = response.data || response;

        // 关闭当前弹框
        this.close();
        // 打开结果弹框
        this.showResult(data);
        this.$emit('refresh');
      } catch (error) {
        console.error('核销权益失败:', error);
        this.$message.error('核销权益失败');
      } finally {
        this.submitLoading = false;
      }
    },
    // 显示结果弹框
    showResult (data) {
      this.resultData = {
        consumeSuccessCount: data.consumeSuccessCount || 0,
        lockErrCount: data.lockErrCount || 0,
        lockErr: data.lockErr || '',
        consumeErrCount: data.consumeErrCount || 0,
        consumeErr: data.consumeErr || '',
        otherErrCount: data.otherErrCount || 0,
        otherErr: data.otherErr || ''
      };
      this.resultVisible = true;
    },
    // 关闭结果弹框
    handleCloseResult () {
      this.closeResult();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/libs/assets/styles/variables.scss';

.verify-order-rights-dialog {
  ::v-deep .el-dialog__header {
    padding: 16px 24px;
  }

  ::v-deep .el-dialog__body {
    padding: 24px;
  }

  ::v-deep .el-dialog__footer {
    padding: 12px 24px;
  }

  .dialog-content {
    min-height: 400px;
  }

  .dialog-footer {
    // display: flex;
    // justify-content: flex-end;
    // gap: 12px;
  }

  .status-tag {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
}

.verify-order-rights-result-dialog {
  ::v-deep .el-dialog__header {
    display: none;
  }

  ::v-deep .el-dialog__body {
    padding: 24px;
  }

  ::v-deep .el-dialog__footer {
    padding: 12px 24px;
  }

  .result-content {
    .result-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;

      i {
        font-size: 20px;
        color: var(--leap-color-warning);
      }

      span {
        font-size: 16px;
        font-weight: 500;
        color: var(--leap-color-default);
      }
    }

    .result-list {
      .result-item {
        // margin-bottom: 16px;

        .result-status {
          font-size: 14px;
          display: block;
          margin-bottom: 8px;

          &.success {
            color: var(--leap-color-success);
          }

          &.fail {
            color: var(--leap-color-danger);
          }
        }

        .fail-details {
          // margin-left: 12px;

          .fail-detail-item {
            // margin-bottom: 12px;

            &:last-child {
              margin-bottom: 0;
            }

            .fail-reason {
              font-size: 14px;
              color: var(--leap-color-default-light-1);
              line-height: 1.6;
              display: block;

              .rights-id {
                display: block;
                margin-top: 4px;
                font-size: 14px;
                color: var(--leap-color-default-light-1);
                // font-family: monospace;
              }
            }
          }
        }
      }

      &.success-item,
      &.fail-item {
        .result-status {
          font-weight: 500;
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
}
::v-deep .el-dialog__footer {
  border-top: 0;
}
</style>
