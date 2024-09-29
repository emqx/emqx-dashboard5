<template>
  <div class="overflow-tooltip" ref="Com" @mouseenter="handleMouseEnter">
    <slot v-if="!needTooltip"></slot>
    <el-tooltip v-else :content="content?.toString()" popper-class="overflow-tooltip-popper">
      <slot></slot>
      <template v-if="$slots.content" #content>
        <slot name="content"></slot>
      </template>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const Com = ref()
const content = ref('')
const needTooltip = ref(false)

/**
 * This code is copied from the Element Plus repository.
 * Copyright (c) Element Plus contributors.
 * Licensed under the MIT License.
 *
 * Source: https://github.com/element-plus/element-plus/blob/main/packages/components/table/src/table-body/events-helper.ts#L65
 */
function isGreaterThan(a: number, b: number, epsilon = 0.01) {
  return a - b > epsilon
}

const getPadding = (el: HTMLElement) => {
  const style = window.getComputedStyle(el, null)
  const paddingLeft = Number.parseInt(style.paddingLeft, 10) || 0
  const paddingRight = Number.parseInt(style.paddingRight, 10) || 0
  const paddingTop = Number.parseInt(style.paddingTop, 10) || 0
  const paddingBottom = Number.parseInt(style.paddingBottom, 10) || 0
  return {
    left: paddingLeft,
    right: paddingRight,
    top: paddingTop,
    bottom: paddingBottom,
  }
}

const detectContentOverflow = (ele: HTMLElement) => {
  if (!ele?.childNodes?.length) {
    return false
  }
  const range = document.createRange()
  range.setStart(ele, 0)
  range.setEnd(ele, ele.childNodes.length)
  let { width: rangeWidth, height: rangeHeight } = range.getBoundingClientRect()
  const offsetWidth = rangeWidth - Math.floor(rangeWidth)
  const { width: cellChildWidth, height: cellChildHeight } = ele.getBoundingClientRect()
  if (offsetWidth < 0.001) {
    rangeWidth = Math.floor(rangeWidth)
  }
  const offsetHeight = rangeHeight - Math.floor(rangeHeight)
  if (offsetHeight < 0.001) {
    rangeHeight = Math.floor(rangeHeight)
  }

  const { top, left, right, bottom } = getPadding(ele)
  const horizontalPadding = left + right
  const verticalPadding = top + bottom
  if (
    isGreaterThan(rangeWidth + horizontalPadding, cellChildWidth) ||
    isGreaterThan(rangeHeight + verticalPadding, cellChildHeight) ||
    isGreaterThan(ele.scrollWidth, cellChildWidth, 1)
  ) {
    return true
  }
  return false
}

const handleMouseEnter = () => {
  const el = Com.value as HTMLElement
  const isOverflow = detectContentOverflow(el)
  needTooltip.value = isOverflow
  if (isOverflow) {
    content.value = el.innerText
  }
}
</script>

<style lang="scss">
.overflow-tooltip-popper {
  &.el-popper.is-dark {
    padding-right: 0;
  }
}
</style>
