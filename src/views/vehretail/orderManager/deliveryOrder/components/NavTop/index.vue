<template>
  <section>
    <div class="common-section-header">
      <h2>{{title}}</h2>
    </div>
    <div class="common-section-body">
      <div class="page-common-nav">
        <div :class="{'nav-item': true, 'active': isActive(item.code)}" v-for="item in list" :key="item.code" @click="handleClick(item.code)">
          <span class="nav-item-text">{{ item.name }}</span>
          <div class="arrow-shape">
            <div class="arrow-shape-left"></div>
            <div class="arrow-shape-right"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

// import { orderStatusNodes } from '@/api/vehretail/orderManager/retailOrderInfo/index';
export default {
  name: 'PageCommonNav',
  props: {
    title: {
      type: String,
      default: ''
    },
    stepHighlight: {
      type: Object,
      default: () => ({})
    },
    // navType: {
    //   type: String,
    //   default: 'APP'
    // },
    // retailOrderCode: {
    //   type: String,
    //   default: ''
    // }
  },
  data () {
    return {
      list: [
        { name: '预约交车', code: 1 },
        { name: '核销订单权益', code: 2 },
        { name: '录入门店优惠', code: 3 },
        { name: '计算尾款', code: 4 },
        { name: '添加尾款收款记录', code: 5 },
        { name: '确认收款', code: 6 },
        { name: '上传发票', code: 7 },
        { name: '交车完成', code: 8 }
      ]
    };
  },
  // watch: {
  //   retailOrderCode () {
  //     this.orderStatusNodes();
  //   }
  // },
  methods: {
    // orderStatusNodes () {
    //   orderStatusNodes(this.retailOrderCode).then(res => {
    //     this.list = res.map(ele => {
    //       return {
    //         name: ele.orderStatusLabel,
    //         code: ele.orderStatus,
    //         ...ele
    //       };
    //     });
    //   }).catch(() => {});
    // },
    handleClick (id) {
      // this.$emit('change', id);
    },
    isActive (code) {
      // 根据 stepHighlight 字段控制高亮
      const highlightMap = {
        1: 'appointmentDeliveryHighlight', // 预约交车
        7: 'uploadInvoiceHighlight', // 上传发票
        8: 'deliveryCompleteHighlight' // 交车完成
      };
      const highlightKey = highlightMap[code];
      if (highlightKey && this.stepHighlight) {
        return !!this.stepHighlight[highlightKey];
      }
      // code 2-6 受 confirmPaymentHighlight 控制
      if (code >= 2 && code <= 6 && this.stepHighlight) {
        return !!this.stepHighlight.confirmPaymentHighlight;
      }
      return false;
    }
  }
};
</script>
<style lang="scss" scoped>
.page-common-nav {
  display: flex;
  align-items: center;
  padding-top: 16px;
  position: sticky;
  top: 0px;
  z-index: 20;
  background-color: #fff;
  gap: 8px 20px;
  .nav-item {
    height: 32px;
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: var(--leap-color-default-light-1);
    position: relative;
    min-width: 90px;
    .nav-item-text {
      position: relative;
      z-index: 1;
      display: block;
      line-height: 32px;
    }
    .arrow-shape{
      height: 32px;
      background: var(--leap-color-default-light-5);
      position: relative;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      &-left {
        position: absolute;
        left: -10px;
        top: 0;
        width: 0;
        height: 0;
        border-top: 16px solid var(--leap-color-default-light-5);
        border-bottom: 16px solid var(--leap-color-default-light-5);
        border-left: 10px solid transparent;
      }
      &-right {
        position: absolute;
        right: -10px;
        top: 0;
        width: 0;
        height: 0;
        border-top: 16px solid transparent;
        border-bottom: 16px solid transparent;
        border-left: 10px solid var(--leap-color-default-light-5);
      }
    }
    &.active {
      color: var(--leap-color-primary);
      border-color: var(--leap-color-primary-light-9);
      .arrow-shape {
        background: var(--leap-color-primary-light-9);
        &-left {
          border-top: 16px solid var(--leap-color-primary-light-9);
          border-bottom: 16px solid var(--leap-color-primary-light-9);
        }
        &-right {
          border-left: 10px solid var(--leap-color-primary-light-9);
        }
      }
    }
    &:first-child {
      width: 150px;
      .arrow-shape-left {
        left: 0;
      }
    }
  }
}
</style>
