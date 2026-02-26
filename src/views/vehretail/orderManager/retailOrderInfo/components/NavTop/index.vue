<template>
  <section>
    <div class="common-section-header">
      <h2>{{title}}</h2>
    </div>
    <div class="common-section-body">
      <div class="page-common-nav">
        <div :class="{'nav-item': true, 'active': isActive(item.code)}" v-for="item in list" :key="item.code" @click="handleClick(item.code)">{{ item.name }}</div>
      </div>
    </div>
  </section>
</template>
<script>

import { orderStatusNodes } from '@/api/vehretail/orderManager/retailOrderInfo/index';
export default {
  name: 'PageCommonNav',
  props: {
    title: {
      type: String,
      default: ''
    },
    current: {
      type: [Number, String],
      default: 0
    },
    navType: {
      type: String,
      default: 'APP'
    },
    retailOrderCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      list: [
        { name: '待门店向工厂下单', code: 1 },
        { name: '车辆生产中', code: 3 },
        { name: '待门店向工厂付款', code: 33 },
        { name: '车辆发运准备中', code: 36 },
        { name: '车辆运输中', code: 4 },
        { name: '车辆已到店', code: 5 },
        { name: '交付完成', code: 6 }
      ]
    };
  },
  watch: {
    retailOrderCode () {
      this.orderStatusNodes();
    }
  },
  methods: {
    orderStatusNodes () {
      orderStatusNodes(this.retailOrderCode).then(res => {
        this.list = res.map(ele => {
          return {
            name: ele.orderStatusLabel,
            code: ele.orderStatus,
            ...ele
          };
        });
      }).catch(() => {});
    },
    handleClick (id) {
      // this.$emit('change', id);
    },
    isActive (code) {
      const currentCode = Number(this.current);
      const currentIndex = this.list.findIndex(item => item.code === currentCode);
      const targetIndex = this.list.findIndex(item => item.code === code);
      if (currentIndex === -1) return false;
      return targetIndex !== -1 && targetIndex <= currentIndex;
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
  z-index: 10;
  background-color: #fff;
  gap: 8px 0;
  .nav-item {
    height: 32px;
    line-height: 32px;
    width: 166px;
    text-align: center;
    font-size: 14px;
    color: var(--leap-color-default-light-1);
    background: url(./bg-nav.png) no-repeat center;
    background-size: cover;
    &.active {
      background: url(./bg-nav-active.png) no-repeat center;
      background-size: cover;
      color: var(--leap-color-primary);
    }
    &:first-child {
      width: 150px;
      background-size: auto;
      background-position: right;
    }
  }
}
</style>
