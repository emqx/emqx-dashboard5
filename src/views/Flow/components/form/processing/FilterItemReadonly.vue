<template>
  <div
    class="filter-item-readonly"
    :class="{ 'is-or': operator === FilterLogicalOperator.Or, 'is-second-level': level === 2 }"
  >
    <p class="field">{{ data.field }}</p>
    <span class="operator">{{ data.operator }}</span>
    <p class="tip">{{ data.valueForComparison }}</p>
  </div>
</template>

<script setup lang="ts">
import { FilterLogicalOperator } from '@/types/enum'

defineProps({
  data: {
    type: Object,
    required: true,
  },
  operator: {
    type: String as PropType<FilterLogicalOperator>,
  },
  level: {
    type: Number as PropType<1 | 2>,
  },
})
</script>

<style lang="scss">
@use 'sass:math';

.filter-item-readonly {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 0;
  line-height: 0;
  // style associated with file src/views/Flow/components/form/processing/FilterOperatorLineReadonly.vue
  $padding-right: 9px;
  $line-width: 9px;
  $dot-size: 9px;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -$padding-right - math.div($line-width, 2) - math.div($dot-size, 2);
    transform: translateY(-50%);
    box-sizing: border-box;
    display: block;
    width: 9px;
    height: 9px;
    border-radius: 5px;
    background-color: #9de7cd;
  }

  &.is-or::before {
    background-color: #ffd99f;
  }
  &.is-second-level::before {
    border: 1px solid transparent;
    background-clip: content-box;
  }

  p {
    margin: 0;
  }
  .field {
    font-weight: 600;
  }
  .operator {
    margin: 0 8px;
  }
  p,
  .operator {
    line-height: 20px;
  }
}
</style>
