<template>
  <div
    class="filter-item-connector-readonly"
    :class="{ 'is-or': operator === FilterLogicalOperator.Or, 'is-second-level': level === 2 }"
  >
    <i
      class="dot"
      v-for="index in dotNum"
      :key="index"
      :class="{ 'is-show': filterIndexArr.includes(Number(index) - 1) }"
    ></i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FilterItemConnectorReadonly',
})
</script>

<script setup lang="ts">
import { FilterLogicalOperator } from '@/types/enum'
import { computed, defineProps, PropType } from 'vue'

const props = defineProps({
  /**
   * The index here is the index after flattening
   */
  filterData: {
    type: Array as PropType<Array<{ filterIndex: number }>>,
  },
  operator: {
    type: String as PropType<FilterLogicalOperator>,
  },
  level: {
    type: Number as PropType<1 | 2>,
    default: 0,
  },
})

const filterIndexArr = computed(() => {
  if (!props.filterData || !props.filterData.length) {
    return []
  }
  return props.filterData.map(({ filterIndex }) => filterIndex)
})

const dotNum = computed(() => {
  return !filterIndexArr.value.length ? 0 : Math.max(...filterIndexArr.value) + 1
})
console.log(JSON.stringify(props.filterData, null, 4))
console.log(JSON.stringify(filterIndexArr.value, null, 4))
</script>

<style lang="scss">
$content-width: 9px;
$padding-right: 9px;
$width: $content-width + $padding-right;
// style associated with file src/views/Flow/components/form/processing/FilterItemReadonly.vue
$item-padding-vertical: 8px;
$line-height: 20px;
$dot-size: 9px;
$padding-vertical: $item-padding-vertical + $line-height / 2 - $dot-size / 2;
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
  &::before {
    content: '';
    position: absolute;
    left: $content-width / 2;
    top: 0;
    display: block;
    height: 100%;
    // 16px is the margin bottom of the form item.
    width: 1px;
    border-left: 1px dashed #9de7cd;
  }

  .dot.is-show {
    box-sizing: border-box;
    display: block;
    width: 9px;
    height: 9px;
    border-radius: 5px;
    background-color: #9de7cd;
  }
  &.is-second-level {
    .dot.is-show {
      border: 1px solid transparent;
      background-clip: content-box;
    }
  }
  &.is-or {
    &::before {
      border-left-color: #ffd99f;
    }
    .dot.is-show {
      background-color: #ffd99f;
    }
  }
}
</style>
