<template>
  <div>
    <!-- 交车预约提醒对话框 -->
    <el-dialog
      :visible.sync="reminderVisible"
      width="500px"
      class="delivery-reminder-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div slot="title" class="reminder-title">
        <i class="el-icon-warning"></i>
        交车预约提醒
      </div>
      <div class="reminder-content">
        购车人手机号未注册零跑 APP，请提醒用户完成注册，避免权益发放延迟
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelReminder" size="small">取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleConfirmReminder"
          :disabled="countdown > 0"
        >
          我已知晓{{ countdown > 0 ? `(${countdown}s)` : '' }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 确认预约提车时间对话框 -->
    <el-dialog
      :visible.sync="appointmentVisible"
      :title="currentMode === 'change' ? '请确认预约提车时间' : '请确认预约提车时间'"
      width="680px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="appointmentForm"
        :model="appointmentForm"
        :rules="appointmentRules"
        label-width="140px"
      >
        <el-form-item label="所选日期排程数：">
          <span>{{ scheduleCount }}</span>
        </el-form-item>

        <!-- 更改预约时间模式特有字段：调整前预约时间 -->
        <el-form-item v-if="currentMode === 'change'" label="调整前预约时间：">
          <span>{{ appointmentForm.originalAppointmentTime }}</span>
        </el-form-item>

        <!-- 调整后预约时间（更改模式）或预约提车时间（预约模式） -->
        <el-row>
          <el-col :span="10">
            <el-form-item
              :label="currentMode === 'change' ? '调整后预约时间：' : '预约提车时间：'"
              prop="appointmentDate"
            >
              <el-date-picker
                v-model="appointmentForm.appointmentDate"
                type="date"
                placeholder="请选择预约日期"
                :picker-options="datePickerOptions"
                value-format="yyyy-MM-dd"
                @change="handleDateChange"
                style="width: 240px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="appointmentTime"
              label-width="140px"
            >
              <el-time-select
                v-model="appointmentForm.appointmentTime"
                :picker-options="timePickerOptions"
                placeholder="请选择预约时间"
                value-format="HH:mm"
                style="width: 240px;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 更改时间原因/超时原因 -->
        <el-form-item
          :label="currentMode === 'change' ? '更改时间原因：' : '超时原因：'"
          prop="changeReason"
        >
          <el-select
            v-model="appointmentForm.changeReason"
            placeholder="请选择"
            clearable
            :disabled="!isChangeReasonRequired"
            style="width: 240px;"
          >
            <el-option
              v-for="item in changeReasonOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="预约备注：">
          <el-input
            v-model="appointmentForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入备注"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">提交预约</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DeliveryAppointmentDialog',
  props: {
    // 交付顾问 ID
    deliveryAdvisorId: {
      type: [String, Number],
      default: ''
    },
    // 交付城市 ID
    deliveryCityId: {
      type: [String, Number],
      default: ''
    },
    // 交车单创建时间
    orderCreateTime: {
      type: String,
      default: ''
    },
    // 模式：'book' - 预约交车，'change' - 更改预约时间
    mode: {
      type: String,
      default: 'book',
      validator: (value) => ['book', 'change'].includes(value)
    },
    // 原预约时间（更改模式时使用）
    originalAppointmentTime: {
      type: String,
      default: ''
    },
    // 订单 ID（更改模式时使用）
    orderId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    const validateAppointmentDate = (_rule, _value, callback) => {
      if (!this.appointmentForm.appointmentDate) {
        callback(new Error('请选择预约日期'));
      } else {
        callback();
      }
    };

    const validateAppointmentTime = (_rule, _value, callback) => {
      if (!this.appointmentForm.appointmentTime) {
        callback(new Error('请选择预约时间'));
      } else {
        callback();
      }
    };

    const validateChangeReason = (_rule, _value, callback) => {
      if (this.isChangeReasonRequired && !this.appointmentForm.changeReason) {
        callback(new Error('请选择' + (this.currentMode === 'change' ? '更改时间原因' : '超时原因')));
      } else {
        callback();
      }
    };

    return {
      reminderVisible: false,
      appointmentVisible: false,
      countdown: 5,
      countdownTimer: null,
      // 内部模式状态，优先使用 internalMode，如果没有设置则使用 prop 的 mode
      internalMode: 'book',
      appointmentForm: {
        appointmentDate: '',
        appointmentTime: '',
        changeReason: '',
        remark: '',
        originalAppointmentTime: ''
      },
      appointmentRules: {
        appointmentDate: [
          { required: true, validator: validateAppointmentDate, trigger: 'change' }
        ],
        appointmentTime: [
          { required: true, validator: validateAppointmentTime, trigger: 'change' }
        ],
        changeReason: [
          { required: true, validator: validateChangeReason, trigger: 'change' }
        ]
      },
      // 排程数
      scheduleCount: 0,
      // 是否需要选择原因
      isChangeReasonRequired: false,
      // 原因选项（超时原因/更改时间原因）
      changeReasonOptions: [],
      // 时间段选项
      timeSlots: [],
      // 交付预约时效（秒）
      deliveryAppointmentTimeout: 0,
      // 日期选择器配置
      datePickerOptions: {
        disabledDate: (time) => {
          // 不能选择当前日期之前的日期
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      // 时间选择器配置
      timePickerOptions: {
        start: '08:00',
        step: '00:15',
        end: '20:00'
      },
      submitLoading: false
    };
  },
  computed: {
    // 使用内部模式或外部传入的 mode
    currentMode () {
      return this.internalMode || this.mode;
    }
  },
  mounted () {
    // 加载原因选项
    this.loadChangeReasonOptions();
    // 加载交付预约时效
    this.loadDeliveryAppointmentTimeout();
  },
  beforeDestroy () {
    this.clearCountdown();
  },
  methods: {
    // 打开提醒对话框
    openReminder () {
      this.reminderVisible = true;
      this.startCountdown();
    },
    // 打开预约对话框
    openAppointment () {
      this.internalMode = 'book';
      this.resetForm();
      this.loadScheduleCount();
      this.appointmentVisible = true;
    },
    // 关闭提醒对话框
    closeReminder () {
      this.clearCountdown();
      this.reminderVisible = false;
    },
    // 关闭预约对话框
    closeAppointment () {
      this.resetForm();
      this.appointmentVisible = false;
    },
    // 打开预约流程（根据是否注册自动处理）
    // isRegistered: 是否已注册
    open (isRegistered) {
      if (isRegistered) {
        this.openAppointment();
      } else {
        this.openReminder();
      }
    },
    // 打开更改预约时间
    openChangeAppointment (data = {}) {
      this.internalMode = 'change';
      this.resetForm();
      this.appointmentForm.originalAppointmentTime = data.originalAppointmentTime || this.originalAppointmentTime;
      this.appointmentVisible = true;
    },
    // 加载原因选项（模拟接口）
    async loadChangeReasonOptions () {
      try {
        // 替换为真实接口
        // const response = await getChangeReasonOptions(this.deliveryCityId);
        // 模拟数据 - 超时原因和更改时间原因共用一套选项
        this.changeReasonOptions = [
          { value: '1', label: '客户原因 - 时间冲突' },
          { value: '2', label: '客户原因 - 行程变更' },
          { value: '3', label: '门店原因 - 车辆未到店' },
          { value: '4', label: '门店原因 - 整备未完成' },
          { value: '5', label: '其他原因' }
        ];
      } catch (error) {
        console.error('加载原因选项失败:', error);
      }
    },
    // 加载交付预约时效（模拟接口）
    async loadDeliveryAppointmentTimeout () {
      try {
        // 替换为真实接口
        // const response = await getDeliveryAppointmentTimeout(this.deliveryCityId);
        // 模拟数据：7 天，单位秒
        this.deliveryAppointmentTimeout = 7 * 24 * 60 * 60;
      } catch (error) {
        console.error('加载交付预约时效失败:', error);
        this.deliveryAppointmentTimeout = 7 * 24 * 60 * 60;
      }
    },
    // 开始倒计时
    startCountdown () {
      this.countdown = 5;
      this.countdownTimer = setInterval(() => {
        if (this.countdown <= 1) {
          this.clearCountdown();
          // 倒计时结束后，自动打开预约对话框
          // this.openAppointment();
        } else {
          this.countdown--;
        }
      }, 1000);
    },
    // 清除倒计时
    clearCountdown () {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
      this.countdown = 0;
    },
    // 取消提醒
    handleCancelReminder () {
      this.$emit('close');
      this.closeReminder();
    },
    // 确认提醒
    handleConfirmReminder () {
      // 点击确认后，关闭提醒对话框，打开预约对话框
      this.closeReminder();
      this.openAppointment();
    },
    // 重置表单
    resetForm () {
      this.appointmentForm = {
        appointmentDate: '',
        appointmentTime: '',
        changeReason: '',
        remark: '',
        originalAppointmentTime: this.currentMode === 'change' ? this.originalAppointmentTime : ''
      };
      this.scheduleCount = 0;
      this.isChangeReasonRequired = false;
      this.timeSlots = [];
      if (this.$refs.appointmentForm) {
        this.$refs.appointmentForm.clearValidate();
      }
    },
    // 加载排程数（模拟接口）
    async loadScheduleCount () {
      try {
        // 替换为真实接口
        // const response = await getScheduleCount({
        //   deliveryAdvisorId: this.deliveryAdvisorId,
        //   appointmentDate: this.appointmentForm.appointmentDate
        // });
        // 模拟数据
        this.scheduleCount = 0;
      } catch (error) {
        console.error('加载排程数失败:', error);
      }
    },
    // 处理日期变更
    async handleDateChange (date) {
      if (date) {
        // 加载该日期的排程数
        await this.loadScheduleCount();
        // 生成时间段选项
        this.generateTimeSlots();
        // 检查是否超时
        this.checkTimeout();
      }
    },
    // 生成时间段选项（模拟接口）
    generateTimeSlots () {
      try {
        // 替换为真实接口
        // const response = await getDeliveryScheduleTimeSlots({
        //   deliveryAdvisorId: this.deliveryAdvisorId,
        //   appointmentDate: this.appointmentForm.appointmentDate
        // });

        // 模拟接口返回的数据结构
        const mockScheduleList = [
          { startTime: '08:00', endTime: '08:15' },
          { startTime: '08:15', endTime: '08:30' },
          { startTime: '08:30', endTime: '08:45' },
          { startTime: '08:45', endTime: '09:00' },
          { startTime: '09:00', endTime: '09:15' },
          { startTime: '09:15', endTime: '09:30' }
        ];

        // 找出最早和最晚时间
        const allTimes = [];
        mockScheduleList.forEach(slot => {
          if (slot.startTime) allTimes.push(slot.startTime);
          if (slot.endTime) allTimes.push(slot.endTime);
        });

        if (allTimes.length === 0) {
          // 默认时间段 08:00 - 20:00
          this.timePickerOptions.start = '08:00';
          this.timePickerOptions.end = '20:00';
          return;
        }

        const sortedTimes = allTimes.sort();
        const minTime = sortedTimes[0];
        const maxTime = sortedTimes[sortedTimes.length - 1];

        // 生成 15 分钟间隔的时间段
        const timeSlots = [];
        const [startHour, startMinute] = minTime.split(':').map(Number);
        const [endHour, endMinute] = maxTime.split(':').map(Number);

        let currentMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;

        while (currentMinutes <= endMinutes) {
          const hours = Math.floor(currentMinutes / 60);
          const minutes = currentMinutes % 60;
          const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
          timeSlots.push(timeStr);
          currentMinutes += 15;
        }

        // 去重
        this.timeSlots = [...new Set(timeSlots)];

        // 更新选择器配置
        this.timePickerOptions.start = minTime;
        this.timePickerOptions.end = maxTime;
      } catch (error) {
        console.error('生成时间段选项失败:', error);
        // 使用默认配置
        this.timePickerOptions.start = '08:00';
        this.timePickerOptions.end = '20:00';
      }
    },
    // 检查是否超时
    checkTimeout () {
      if (!this.appointmentForm.appointmentDate || !this.orderCreateTime) {
        this.isChangeReasonRequired = false;
        return;
      }

      try {
        const appointmentDateTime = new Date(this.appointmentForm.appointmentDate);
        const orderCreateTime = new Date(this.orderCreateTime);

        // 计算时间差（秒）
        const timeDiff = (appointmentDateTime - orderCreateTime) / 1000;

        // 如果预约时间 - 交车单创建时间 > 交付预约时效，则原因必填
        const wasRequired = this.isChangeReasonRequired;
        this.isChangeReasonRequired = timeDiff > this.deliveryAppointmentTimeout;

        // 如果从必填变为非必填，清空已选值和校验
        if (wasRequired && !this.isChangeReasonRequired) {
          this.appointmentForm.changeReason = '';
          this.$refs.appointmentForm?.clearValidate('changeReason');
        }
      } catch (error) {
        console.error('检查超时失败:', error);
        this.isChangeReasonRequired = false;
      }
    },
    // 关闭对话框
    handleClose () {
      this.appointmentVisible = false;
    },
    // 提交预约
    async handleSubmit () {
      try {
        await this.$refs.appointmentForm.validate();
        this.submitLoading = true;

        const params = {
          deliveryAdvisorId: this.deliveryAdvisorId,
          deliveryCityId: this.deliveryCityId,
          orderId: this.orderId,
          appointmentTime: `${this.appointmentForm.appointmentDate} ${this.appointmentForm.appointmentTime}`,
          changeReason: this.appointmentForm.changeReason,
          remark: this.appointmentForm.remark
        };

        // 根据模式调用不同接口
        if (this.currentMode === 'change') {
          // 更改预约时间接口
          // await changeAppointment(params);
          console.log('调用更改预约时间接口:', params);
        } else {
          // 预约交车接口
          // await submitAppointment(params);
          console.log('调用预约交车接口:', params);
        }

        // 模拟提交
        await new Promise(resolve => setTimeout(resolve, 500));

        this.$message.success(this.currentMode === 'change' ? '更改预约时间成功' : '预约成功');
        this.closeAppointment();
        this.$emit('refresh');
      } catch (error) {
        if (error !== false) { // el-form validate 失败会返回 false
          console.error('提交预约失败:', error);
        }
      } finally {
        this.submitLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.delivery-reminder-dialog {
  ::v-deep .el-dialog__header {
    border-bottom: 0;
  }

  ::v-deep .el-dialog__body {
    padding: 0 24px;
  }

  ::v-deep .el-dialog__footer {
    border-top: 0;
    padding-top: 16px;
  }

  .reminder-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--leap-color-default);

    i {
      font-size: 18px;
      color: var(--leap-color-warning);
    }
  }

  .reminder-content {
    font-size: 14px;
    line-height: 1.6;
    color: var(--leap-color-default-light-1);
  }

  ::v-deep .dialog-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0 12px;

    .el-button {
      // min-width: 88px;
      font-size: 14px;
    }

    .el-button--primary {
      background-color: var(--leap-color-success);
      border-color: var(--leap-color-success);
    }

    // 倒计时期间按钮样式（禁用状态）
    .el-button--primary.is-disabled {
      background-color: var(--leap-color-primary-light-6);
      border-color: var(--leap-color-primary-light-6);
      color: #fff;
    }
  }
}
</style>
