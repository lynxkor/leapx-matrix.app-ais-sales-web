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
      class="appointment-dialog"
    >
      <!-- 信息展示区域 -->
      <div class="info-section">
        <div class="info-item">
          <span class="info-label">所选日期排程数：</span>
          <span class="info-value">{{ scheduleCount }}</span>
        </div>
        <div v-if="currentMode === 'change'" class="info-item">
          <span class="info-label">调整前预约时间：</span>
          <span class="info-value">{{ appointmentForm.originalAppointmentTime }}</span>
        </div>
        <!-- <div class="info-item">
          <span class="info-label">订单创建时间：</span>
          <span class="info-value">{{ createTime }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">交付预约时效：</span>
          <span class="info-value">{{ deliveryAppointmentTimeout }} 小时</span>
        </div>
        <div class="info-item" v-if="appointmentForm.appointmentDate && appointmentForm.appointmentTime">
          <span class="info-label">预约时间：</span>
          <span class="info-value">{{ appointmentForm.appointmentDate }} {{ appointmentForm.appointmentTime }}</span>
        </div>
        <div class="info-item" v-if="timeDiffHours !== null">
          <span class="info-label">时间差：</span>
          <span class="info-value" :class="{ 'is-overtime': isOvertime }">{{ timeDiffHours }} 小时</span>
          <el-tag v-if="isOvertime" type="danger" size="mini" style="margin-left: 8px;">已超时</el-tag>
          <el-tag v-else type="success" size="mini" style="margin-left: 8px;">未超时</el-tag>
        </div> -->
      </div>

      <el-form
        ref="appointmentForm"
        :model="appointmentForm"
        :rules="appointmentRules"
        label-width="140px"
        class="appointment-form"
      >
        <!-- 调整后预约时间（更改模式）或预约提车时间（预约模式） -->
        <el-form-item
          :label="currentMode === 'change' ? '调整后预约时间：' : '预约提车时间：'"
          prop="appointmentDate"
        >
          <el-date-picker
            v-model="appointmentForm.appointmentDate"
            type="date"
            placeholder="选择预约日期"
            :picker-options="datePickerOptions"
            value-format="yyyy-MM-dd"
            @change="handleDateChange"
            style="width: 220px;"
          />
          <el-select
            v-model="appointmentForm.appointmentTime"
            placeholder="选择时间"
            clearable
            style="width: 220px; margin-left: 12px;"
            @change="handleTimeChange"
          >
            <el-option
              v-for="slot in timeSlots"
              :key="slot"
              :label="slot"
              :value="slot"
            />
          </el-select>
        </el-form-item>

        <!-- 更改时间原因/超时原因 -->
        <el-form-item
          :label="currentMode === 'change' ? '更改时间原因：' : '超时原因：'"
          prop="changeReason"
          :required="isChangeReasonRequired"
        >
          <el-select
            v-model="appointmentForm.changeReason"
            placeholder="请选择"
            clearable
            :disabled="!isChangeReasonRequired"
            style="width: 220px;"
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
// 查询预约时间段
import { getList as deliveryScheduleTimeConfigGetList } from '@/api/vehretail/basicConfig/deliveryScheduleTimeConfig/index';
// 交付预约时效配置 查市区配置如果没查到
import { findByCityCode } from '@/api/vehretail/basicConfig/deliveryAppointmentTimeConfig/index';
// 大于交付预约时效 带着报错分类 查询报错原因
import { getList as deliveryInfoConfigGetList } from '@/api/vehretail/basicConfig/deliveryInfoConfig/index';
import {
  deliveryOrderScheduledNum, // 交车单预约交车所选日期排程数
  appointment, // 预约交车
  changeAppointmentTime, // 更改预约时间
} from '@/api/vehretail/orderManager/deliveryOrder/index';
export default {
  name: 'DeliveryAppointmentDialog',
  props: {
    // 交付顾问 ID
    deliveryUserId: {
      type: [String, Number],
      default: ''
    },
    // 交付城市 code
    cityCode: {
      type: [String, Number],
      default: ''
    },
    // 交车单创建时间
    createTime: {
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
    // 交车单 ID）
    orderId: {
      type: [String, Number],
      default: ''
    },
    // 交车单 code
    orderCode: {
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
          { validator: validateChangeReason, trigger: 'change' }
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
      // 交付预约时效（小时）
      deliveryAppointmentTimeout: 0,
      // 时间差（小时）
      timeDiffHours: null,
      // 是否超时
      isOvertime: false,
      // 日期选择器配置
      datePickerOptions: {
        disabledDate: (time) => {
          // 不能选择当前日期之前的日期
          return time.getTime() < Date.now() - 8.64e7;
        }
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
  beforeDestroy () {
    this.clearCountdown();
  },
  methods: {
    findByCityCode () {
      findByCityCode({
        cityCode: this.cityCode
      }).then((res) => {
        this.deliveryAppointmentTimeout = res.timeLimitHour || 0;
      }).catch(() => {
        this.deliveryAppointmentTimeout = 0;
      });
    },
    // 打开提醒对话框
    openReminder () {
      this.reminderVisible = true;
      this.startCountdown();
    },
    // 打开预约对话框
    openAppointment () {
      this.internalMode = 'book';
      this.resetForm();
      // 生成时间段选项
      this.generateTimeSlots();
      this.findByCityCode();
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
      this.generateTimeSlots();
      this.findByCityCode();
      this.appointmentForm.originalAppointmentTime = data.originalAppointmentTime || this.originalAppointmentTime;
      this.appointmentVisible = true;
    },
    // 加载原因选项（超时原因/更改时间原因）
    loadChangeReasonOptions () {
      if (this.changeReasonOptions.length && this.changeReasonOptions.length > 0) {
        return;
      }
      const params = {
        infoCategory: this.currentMode === 'change' ? '10' : '5',
        pageNum: 1,
        pageSize: 20
      };
      deliveryInfoConfigGetList(params).then(response => {
        const list = response.records;
        this.changeReasonOptions = list.map(item => ({
          label: item.specificType,
          value: item.specificType
        }));
      }).catch();
    },
    // 开始倒计时
    startCountdown () {
      this.countdown = 5;
      this.countdownTimer = setInterval(() => {
        if (this.countdown <= 1) {
          this.clearCountdown();
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
      this.timeDiffHours = null;
      this.isOvertime = false;
      this.changeReasonOptions = [];
      this.timeSlots = [];
      if (this.$refs.appointmentForm) {
        this.$refs.appointmentForm.clearValidate();
      }
    },
    // 加载排程数
    async loadScheduleCount () {
      try {
        const response = await deliveryOrderScheduledNum({
          deliveryUserId: this.deliveryUserId,
          appointmentTime: this.appointmentForm.appointmentDate
        });
        // 模拟数据
        this.scheduleCount = response;
      } catch (error) {
        console.error('加载排程数失败:', error);
      }
    },
    // 处理日期变更
    async handleDateChange (date) {
      if (date) {
        // 加载该日期的排程数
        await this.loadScheduleCount();
        this.checkTimeout();
      } else {
        this.scheduleCount = 0;
      }
    },
    // 处理时间变更
    handleTimeChange () {
      this.checkTimeout();
    },
    // 生成时间段选项
    async generateTimeSlots () {
      try {
        // 替换为真实接口
        const mockScheduleList = await deliveryScheduleTimeConfigGetList({
          pageNum: 1,
          pageSize: 20,
          status: 1
        });

        if (!mockScheduleList.records || mockScheduleList.records.length === 0) {
          // 默认时间段 08:00 - 20:00
          this.timeSlots = this.generateTimeRange('08:00', '20:00');
          return;
        }
        // 收集所有时间段
        const allTimeSlots = [];
        mockScheduleList.records?.forEach(slot => {
          if (!slot.startTime || !slot.endTime) return;
          // 为每个记录对象生成其 startTime 到 endTime 之间的 15 分钟间隔时间段
          const timeRange = this.generateTimeRange(slot.startTime, slot.endTime);
          allTimeSlots.push(...timeRange);
        });

        // 合并去重并按时间排序
        this.timeSlots = [...new Set(allTimeSlots)].sort((a, b) => {
          const [aHour, aMinute] = a.split(':').map(Number);
          const [bHour, bMinute] = b.split(':').map(Number);
          return (aHour * 60 + aMinute) - (bHour * 60 + bMinute);
        });
      } catch (error) {
        console.error('生成时间段选项失败:', error);
        // 使用默认配置
        this.timeSlots = this.generateTimeRange('08:00', '20:00');
      }
    },
    // 生成时间范围（15 分钟间隔）
    generateTimeRange (startTime, endTime) {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      let currentMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      const timeRange = [];

      while (currentMinutes <= endMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        timeRange.push(timeStr);
        currentMinutes += 15;
      }

      return timeRange;
    },
    // 检查是否超时
    async checkTimeout () {
      console.log('checkTimeout 入参:', {
        appointmentDate: this.appointmentForm.appointmentDate,
        appointmentTime: this.appointmentForm.appointmentTime,
        createTime: this.createTime,
        deliveryAppointmentTimeout: this.deliveryAppointmentTimeout
      });

      if (!this.appointmentForm.appointmentDate || !this.appointmentForm.appointmentTime || !this.createTime) {
        this.isChangeReasonRequired = false;
        this.timeDiffHours = null;
        this.isOvertime = false;
        return;
      }

      try {
        // 拼接预约日期时间为 yyyy-MM-dd HH:mm:ss 格式
        const appointmentDateTimeStr = `${this.appointmentForm.appointmentDate} ${this.appointmentForm.appointmentTime}:00`;
        const appointmentDateTime = new Date(appointmentDateTimeStr.replace(/-/g, '/'));

        // createTime 可能是 yyyy-MM-dd 或 yyyy-MM-dd HH:mm:ss 格式，统一处理为当天 00:00:00
        const createTimeStr = this.createTime.includes(' ') ? this.createTime.split(' ')[0] : this.createTime;
        const createTime = new Date(createTimeStr.replace(/-/g, '/') + ' 00:00:00');

        console.log('解析后的时间:', {
          appointmentDateTime: appointmentDateTime,
          createTime: createTime,
          isValid1: !isNaN(appointmentDateTime.getTime()),
          isValid2: !isNaN(createTime.getTime())
        });

        // 计算时间差（毫秒）
        const timeDiffMs = appointmentDateTime - createTime;

        console.log('时间差（毫秒）:', timeDiffMs);

        // 转换为小时（保留一位小数）
        const hours = (timeDiffMs / (1000 * 60 * 60)).toFixed(1);

        console.log('时间差（小时）:', hours);

        // 更新页面显示
        this.timeDiffHours = hours;
        const wasRequired = this.isChangeReasonRequired;
        this.isChangeReasonRequired = parseFloat(hours) > this.deliveryAppointmentTimeout;
        this.isOvertime = this.isChangeReasonRequired;

        console.log('超时判断:', {
          wasRequired: wasRequired,
          isChangeReasonRequired: this.isChangeReasonRequired,
          isOvertime: this.isOvertime
        });

        // 如果从非必填变为必填，调用接口获取超时原因选项
        if (!wasRequired && this.isChangeReasonRequired) {
          await this.loadChangeReasonOptions();
        }

        // 如果从必填变为非必填，清空已选值和校验
        if (wasRequired && !this.isChangeReasonRequired) {
          this.appointmentForm.changeReason = '';
          this.$refs.appointmentForm?.clearValidate('changeReason');
        }
      } catch (error) {
        console.error('检查超时失败:', error);
        this.isChangeReasonRequired = false;
        this.timeDiffHours = null;
        this.isOvertime = false;
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

        // 拼接预约时间为 yyyy-MM-dd HH:mm:ss 格式
        const appointmentTimeAfter = `${this.appointmentForm.appointmentDate} ${this.appointmentForm.appointmentTime}:00`;

        // 基础参数
        const params = {
          deliveryOrderId: this.orderId,
          deliveryOrderCode: this.orderCode,
          appointmentTimeAfter: appointmentTimeAfter,
          appointmentRemark: this.appointmentForm.remark
        };

        // 变更模式时需要传预约时间修改前
        if (this.currentMode === 'change') {
          params.appointmentTimeBefore = this.appointmentForm.originalAppointmentTime;
          // 更改时间原因
          if (this.appointmentForm.changeReason) {
            params.changeTimeReason = this.appointmentForm.changeReason;
            params.infoCategory = 10;
          }
        } else {
          // 预约模式，超时时传超时原因
          if (this.appointmentForm.changeReason) {
            params.appointmentTimeoutReason = this.appointmentForm.changeReason;
            params.infoCategory = 5;
          }
        }

        // 根据模式调用不同接口
        if (this.currentMode === 'change') {
          // 更改预约时间接口
          await changeAppointmentTime(params);
        } else {
          // 预约交车接口
          await appointment(params);
        }

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

// 预约对话框样式
.appointment-dialog {
  .info-section {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding: 16px 20px;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .info-value.is-overtime {
        color: var(--leap-color-danger);
        font-weight: 600;
      }
    }
  }
}
</style>
