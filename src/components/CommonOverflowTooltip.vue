<template>
  <OverflowTooltip class="common-overflow-tooltip">
    <PreWithEllipsis>{{ content }}</PreWithEllipsis>
    <template #content>
      <el-scrollbar :max-height="150">
        <PreWrap>{{ content }}</PreWrap>
      </el-scrollbar>
    </template>
  </OverflowTooltip>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import OverflowTooltip from './OverflowTooltip.vue'
import PreWithEllipsis from './PreWithEllipsis.vue'
import PreWrap from './PreWrap.vue'

defineProps<{ content: string }>()
</script>

<style lang="scss">
.overflow-tooltip-popper {
  .el-scrollbar__view {
    padding-right: 8px;
  }
  .el-scrollbar__thumb {
    opacity: 0.9;
  }
}
</style>
