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
          :checkbox-config="{ checkField: 'checked', checkMethod: ({ row }) => row.status !== '2' }"
        >
          <vxe-column type="checkbox" width="60" fixed="left" />
          <vxe-column field="rightsId" title="权益 ID" width="200" />
          <vxe-column field="rightsName" title="权益名称" width="150" />
          <vxe-column field="couponType" title="卡券类型" width="120" />
          <vxe-column field="discountAmount" title="满减金额" width="120"  />
          <vxe-column field="receiveTime" title="领券时间" width="180" />
          <vxe-column field="validPeriod" title="有效期" width="180" />
          <vxe-column field="statusLabel" title="状态" width="100" />
          <vxe-column field="description" title="权益说明" min-width="200" />
          <vxe-column field="applicableVehicle" title="适用车型" min-width="150" />
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
          <div v-if="successList.length > 0" class="result-item success-item">
            <span class="result-status success">
              核销成功：{{ totalSuccess }}条
            </span>
          </div>
          <!-- 失败信息 -->
          <div v-if="failList.length > 0" class="result-item fail-item">
            <span class="result-status fail">
              权益锁定失败：{{ totalFail }}条
            </span>
            <div class="fail-details">
              <div v-for="(item, index) in failList" :key="index" class="fail-detail-item">
                <div class="fail-reason">
                  <span>锁定失败原因：{{ item.reason }}</span>
                  <span v-if="item.rightsId">{{ item.rightsId }}</span>
                </div>
              </div>
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

<script>
export default {
  name: 'VerifyOrderRightsDialog',
  props: {
    // 订单 ID
    orderId: {
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
      failList: [],
      successList: []
    };
  },
  computed: {
    totalSuccess () {
      return this.successList.reduce((sum, item) => sum + (item.count || 0), 0);
    },
    totalFail () {
      return this.failList.reduce((sum, item) => sum + (item.count || 0), 0);
    }
  },
  methods: {
    // 打开对话框
    open () {
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
      this.failList = [];
      this.successList = [];
    },
    // 加载权益列表（模拟接口）
    async loadRightsList () {
      this.loading = true;
      try {
        // 模拟接口调用
        // const response = await getOrderRightsList(this.orderId);
        // 模拟数据
        await new Promise(resolve => setTimeout(resolve, 500));
        this.tableData = [
          {
            rightsId: 'LEAP2323923657923462',
            rightsName: '盲订优惠券',
            couponType: '满减卡',
            discountAmount: '100,000.00',
            receiveTime: '2023-07-12 12:12:12',
            validPeriod: '2023-07-12 12:12:12',
            statusLabel: '未核销',
            status: '1',
            description: '这是一条权益说明',
            applicableVehicle: '',
            checked: false
          },
          {
            rightsId: 'LEAP2323923657923463',
            rightsName: '盲订优惠券',
            couponType: '满减卡',
            discountAmount: '100,000.00',
            receiveTime: '2023-07-12 12:12:12',
            validPeriod: '2023-07-12 12:12:12',
            statusLabel: '已核销',
            status: '2',
            description: '这是一条权益说明',
            applicableVehicle: '',
            checked: false
          },
          {
            rightsId: 'LEAP2323923657923464',
            rightsName: '盲订优惠券',
            couponType: '满减卡',
            discountAmount: '100,000.00',
            receiveTime: '2023-07-12 12:12:12',
            validPeriod: '2023-07-12 12:12:12',
            statusLabel: '未核销',
            status: '1',
            description: '这是一条权益说明',
            applicableVehicle: '',
            checked: false
          },
          {
            rightsId: 'LEAP2323923657923465',
            rightsName: '盲订优惠券',
            couponType: '满减卡',
            discountAmount: '100,000.00',
            receiveTime: '2023-07-12 12:12:12',
            validPeriod: '2023-07-12 12:12:12',
            statusLabel: '已核销',
            status: '2',
            description: '这是一条权益说明',
            applicableVehicle: '',
            checked: false
          }
        ];
      } catch (error) {
        console.error('加载权益列表失败:', error);
        this.$message.error('加载权益列表失败');
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
        // 模拟接口调用
        // const params = {
        //   orderId: this.orderId,
        //   rightsIds: checkedRows.map(row => row.rightsId)
        // };
        // const response = await submitVerifyRights(params);
        // const data = response.data;

        // 模拟接口返回
        await new Promise(resolve => setTimeout(resolve, 500));
        // 假设接口返回格式：{ successList: [], failList: [] }
        const data = {
          successList: checkedRows.slice(0, 1), // 模拟 1 条成功
          failList: [
            {
              rightsId: checkedRows[1]?.rightsId || 'YH20252338975329872956',
              failReason: '核销申请信息与权益使用配置的规则不符，不允许锁定及核销'
            },
            {
              rightsId: checkedRows[2]?.rightsId || 'YH20252338975329872957',
              failReason: '权益已过期，无法核销'
            },
            {
              rightsId: checkedRows[3]?.rightsId || 'YH20252338975329872958',
              failReason: '该权益不适用于当前订单'
            }
          ]
        };

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
      this.failList = [];
      this.successList = [];
      // 处理失败列表 - 每条失败记录单独显示
      if (data.failList && data.failList.length > 0) {
        data.failList.forEach(item => {
          this.failList.push({
            count: 1,
            reason: item.failReason || '核销申请信息与权益使用配置的规则不符，不允许锁定及核销',
            rightsId: item.rightsId
          });
        });
      }
      // 处理成功列表
      if (data.successList && data.successList.length > 0) {
        this.successList.push({
          count: data.successList.length
        });
      }
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
