<template>
  <div class="guide-bar">
    <div
      v-for="(item, index) in guideList"
      :key="item"
      :class="['guide-item', { active: activeGuideIndexList.includes(index) }]"
    >
      <i v-if="activeGuideIndexList.includes(index)" class="el-icon-check"></i>
      <span class="icon-number" v-else>{{ index + 1 }}</span>
      <span class="guide-title">{{ item }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuideBar',

  props: {
    guideList: {
      type: Array,
      default: () => [],
    },
    activeGuideIndexList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {}
  },
}
</script>

<style lang="scss">
.guide-bar {
  display: flex;
  font-size: 16px;
  margin-bottom: 32px;

  .guide-item {
    position: relative;
    padding-right: 110px;
    flex-shrink: 0;
    display: flex;
    align-items: center;

    .el-icon-check,
    .icon-number {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      line-height: 20px;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .el-icon-check {
      font-weight: 600;
      background: #00b299;
    }
    .icon-number {
      background: #c7c7c7;
    }

    .guide-title {
      display: inline-block;
      margin-left: 8px;
      color: #1d1d1d;
    }

    &.active {
      font-weight: 600;
      .guide-title {
        color: #1d1d1d;
      }
    }

    &::after {
      position: absolute;
      content: '';
      width: 88px;
      height: 1px;
      background-color: #e2edeb;
      top: 50%;
      right: 12px;
    }

    &:last-child {
      padding-right: 0;
      &::after {
        display: none;
      }
    }
  }
}
</style>
