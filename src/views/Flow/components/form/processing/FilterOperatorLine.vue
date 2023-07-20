<template>
  <div class="filter-operator-line">
    <div
      class="op-tag"
      :class="{ 'is-or': operator === FilterLogicalOperator.Or }"
      @click="handleClick"
    >
      <el-icon v-if="showDel" class="icon-del"><CircleCloseFilled @click="handleDel" /></el-icon>
      <p>{{ operator }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FilterLogicalOperator } from '@/types/enum'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { PropType, defineEmits, defineProps } from 'vue'

defineProps({
  operator: {
    type: String as PropType<FilterLogicalOperator>,
  },
  showDel: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['toggle', 'delete'])

const handleClick = () => {
  emit('toggle')
}

const handleDel = () => {
  emit('delete')
}
</script>

<style lang="scss">
.filter-operator-line {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;

  &.sub-level {
    width: 36px;
  }
  $icon-size: 14px;
  $icon-padding: 4px;
  $tag-height: 18px;
  $total-size: $icon-size + $icon-padding;
  .icon-del {
    display: none;
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
    line-height: 1;
    transform: translate($icon-size - 2px, -$icon-size + 2px);
    width: $total-size;
    height: $total-size;
    padding-left: $icon-padding;
    padding-bottom: $icon-padding;
    color: #757789;
    svg {
      cursor: pointer;
      &:hover {
        color: var(--color-primary);
      }
    }
  }

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
  .op-tag {
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
    &.is-or {
      color: #f19710;
      background-color: #fff0da;
      border-color: #fff0da;
    }
    &:hover {
      border-color: #00b173;
      box-shadow: 0px 4px 6px 0px #00b17329;
      .icon-del {
        display: block;
      }
      &.is-or {
        border-color: #f19710;
        box-shadow: 0px 4px 6px 0px #f1971029;
      }
    }
  }
}
</style>
