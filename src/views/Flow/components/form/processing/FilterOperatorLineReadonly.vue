<template>
  <div
    class="filter-item-connector-readonly"
    :class="{ 'is-or': operator === FilterLogicalOperator.Or }"
  >
    <i class="line"></i>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'FilterItemConnectorReadonly',
})
</script>

<script setup lang="ts">
import { FilterLogicalOperator } from '@/types/enum'

defineProps({
  operator: {
    type: String as PropType<FilterLogicalOperator>,
  },
})
</script>

<style lang="scss">
@use 'sass:math';

$content-width: 9px;
$padding-right: 9px;
$width: $content-width + $padding-right;
// style associated with file src/views/Flow/components/form/processing/FilterItemReadonly.vue
$item-padding-vertical: 8px;
$line-height: 20px;
$padding-vertical: $item-padding-vertical + math.div($line-height, 2);
.filter-item-connector-readonly {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: $width;
  padding-right: $padding-right;
  padding-top: $padding-vertical;
  padding-bottom: $padding-vertical;
  .line {
    display: block;
    height: 100%;
    // 16px is the margin bottom of the form item.
    width: 1px;
    border-left: 1px dashed #9de7cd;
  }

  &.is-or {
    .line {
      border-left-color: #ffd99f;
    }
  }
}
</style>
