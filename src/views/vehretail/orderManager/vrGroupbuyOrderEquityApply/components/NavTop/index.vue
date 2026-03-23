<template>
  <section>
    <div class="page-common-nav">
      <div
        :class="{'nav-item': true, 'active': item.isCome}"
        v-for="(item, index) in stepInfoList"
        :key="index"
      >
        {{ item.name }}
      </div>
    </div>
  </section>
</template>
<script>

export default {
  name: 'PageCommonNav',
  props: {
    stepInfoList: {
      type: Array,
      default: () => []
    },
  },
  methods: {
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
  width: 100%; // 确保占满容器宽度
  .nav-item {
    height: 32px;
    line-height: 32px;
    flex: 1; // 让所有项目平均分配空间
    text-align: center;
    font-size: 14px;
    color: var(--leap-color-default-light-1);
    background: url(./bg-nav.png) no-repeat center;
    background-size: 100% 100%; // 调整背景大小以适应动态宽度
    min-width: 120px; // 设置最小宽度，防止过度压缩
    &.active {
      background: url(./bg-nav-active.png) no-repeat center;
      background-size: 100% 100%; // 调整背景大小以适应动态宽度
      color: var(--leap-color-primary);
    }
    &:first-child {
      background-size: 100% 100%; // 保持一致的背景大小
      background-position: center;
    }
    &:last-child {
      background-size: 100% 100%; // 保持一致的背景大小
      background-position: center;
    }
  }
}
</style>
