<template>
  <div class="guide-bar">
    <div
      v-for="(item, index) in guideList"
      :key="item"
      :class="['guide-item', { active: activeGuideIndexList.includes(index) }]"
    >
      <el-icon v-if="activeGuideIndexList.includes(index)" class="el-icon-check">
        <Check />
      </el-icon>
      <span class="icon-number" v-else>{{ index + 1 }}</span>
      <span class="guide-title">{{ item }}</span>
    </div>
  </div>
</template>

<script>
import { Check } from '@element-plus/icons-vue'

export default {
  name: 'GuideBar',

  components: { Check },

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
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      background: #00b173;
      &::before {
        position: absolute;
        content: '';
        border-radius: 50%;
        left: -4px;
        width: 28px;
        height: 28px;
        background-color: #00b17333;
      }
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
