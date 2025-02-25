<template>
  <span class="operator-tag" :class="{ disabled, 'is-or': operator === FilterLogicalOperator.Or }">
    <slot></slot>
    <template v-if="!$slots.default">{{ operator }}</template>
  </span>
</template>

<script setup lang="ts">
import { FilterLogicalOperator } from '@/types/enum'

defineProps({
  operator: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss">
/* Operator Tag in Filter Form */
$tag-height: 18px;
.operator-tag {
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: $tag-height;
  width: 34px;
  padding: 1px 6px;
  border: 1px solid #e2fff5;
  border-radius: 4px;
  user-select: none;
  line-height: 1;
  text-align: center;
  color: var(--color-primary);
  background-color: #e2fff5;
  cursor: pointer;
  &.disabled {
    cursor: default;
  }
  &.is-or {
    color: #f19710;
    background-color: #fff0da;
    border-color: #fff0da;
  }
  &:not(.disabled) {
    &:hover {
      border-color: #00b173;
      box-shadow: 0px 4px 6px 0px #00b17329;

      &.is-or {
        border-color: #f19710;
        box-shadow: 0px 4px 6px 0px #f1971029;
      }
    }
  }
}
</style>
