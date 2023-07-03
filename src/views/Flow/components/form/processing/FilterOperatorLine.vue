<template>
  <div class="filter-operator-line">
    <span
      class="el-tag"
      :class="{ 'is-or': operator === FilterLogicalOperator.Or }"
      @click="handleClick"
    >
      {{ operator }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { FilterLogicalOperator } from '@/types/enum'
import { PropType, defineEmits, defineProps } from 'vue'

defineProps({
  operator: {
    type: String as PropType<FilterLogicalOperator>,
  },
})
const emit = defineEmits(['toggle'])

const handleClick = () => {
  emit('toggle')
}
</script>

<style lang="scss">
.filter-operator-line {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    display: block;
    height: 100%;
    // 16px is the margin bottom of the form item.
    width: 1px;
    background-color: #babcbe;
  }
  .el-tag {
    position: relative;
    top: 0;
    left: 0;
    cursor: pointer;
    height: 18px;
    width: 34px;
    padding: 1px 6px;
    border-radius: 4px;
    user-select: none;
    color: var(--color-primary);
    background-color: #e2fff5;
    border-color: #e2fff5;
    &.is-or {
      color: #f19710;
      background-color: #fff0da;
      border-color: #fff0da;
    }
  }
}
</style>
