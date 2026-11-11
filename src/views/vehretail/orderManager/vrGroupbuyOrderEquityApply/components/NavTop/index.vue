<template>
  <section>
    <div class="page-common-nav">
      <div
        :class="{'nav-item': true, 'active': isActive(item.status)}"
        v-for="item in list"
        :key="item.status"
      >
        <span class="nav-item-text">{{ item.name }}</span>
        <div class="arrow-shape">
          <div class="arrow-shape-left"></div>
          <div class="arrow-shape-right"></div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

export default {
  name: 'PageCommonNav',
  props: {
    current: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      // 与后端 OrderBenefitApplyStatusEnum 对齐：10 草稿 / 30 已提交 / 40 已初审 / 50 已复审 / 60 已终审
      list: [
        { name: '草稿', status: 10 },
        { name: '已提交', status: 30 },
        { name: '已初审', status: 40 },
        { name: '已复审', status: 50 },
        { name: '已终审', status: 60 }
      ]
    };
  },
  methods: {
    isActive (status) {
      let currentStatus = Number(this.current);
      // 作废：全部不高亮
      if (currentStatus === 70) {
        return false;
      }
      // 驳回按草稿算；无状态（新建页）按草稿算
      if (currentStatus === 20 || !currentStatus) {
        currentStatus = 10;
      }
      const currentIndex = this.list.findIndex(item => item.status === currentStatus);
      const targetIndex = this.list.findIndex(item => item.status === status);
      if (currentIndex === -1) {
        return false;
      }
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
  z-index: 20;
  background-color: #fff;
  gap: 8px 20px;
  width: 100%;
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
