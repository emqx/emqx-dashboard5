<template>
  <div class="guide-bar">
    <div
      v-for="(item, index) in guideList"
      :key="item"
      class="guide-item"
      :class="{ active: currentStep === index, completed: currentStep > index }"
    >
      <el-icon v-if="currentStep > index" class="el-icon-check">
        <Check />
      </el-icon>
      <span class="icon-number" v-else>{{ index + 1 }}</span>
      <span class="guide-title">{{ item }}</span>
      <span v-if="descList[index]" class="guide-desc">({{ descList[index] }})</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, PropType, computed } from 'vue'
import { Check } from '@element-plus/icons-vue'

const props = defineProps({
  guideList: {
    type: Array as PropType<string[] | number[]>,
    required: true,
  },
  descList: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  activeGuideIndexList: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
})

const currentStep = computed(() => {
  return props.activeGuideIndexList[props.activeGuideIndexList.length - 1]
})
</script>

<style lang="scss">
.guide-bar {
  display: flex;
  font-size: 16px;
  margin-bottom: 36px;

  .guide-item {
    position: relative;
    padding-right: 110px;
    flex-shrink: 0;
    display: flex;
    align-items: center;

    .el-icon-check,
    .icon-number {
      height: 24px;
      width: 24px;
      border-radius: 50%;
      line-height: 24px;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .el-icon-check {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
    }
    .icon-number {
      background: var(--color-border-primary);
    }
    .guide-title {
      display: inline-block;
      margin-left: 8px;
      color: var(--color-title-primary);
    }
    .guide-desc {
      color: var(--color-text-secondary);
      font-size: 14px;
      font-weight: normal;
      margin-left: 6px;
    }
    &.active {
      font-weight: 600;
      .icon-number {
        background: var(--color-primary);
      }
      .guide-title {
        color: var(--color-title-primary);
      }
    }
    // the line
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
.guide-bar.vertical {
  flex-direction: column;
  .guide-item {
    &::after {
      position: absolute;
      content: '';
      width: 1px;
      height: 90%;
      background-color: #e2edeb;
      top: 38px;
      left: 10px;
    }
  }
}
</style>
