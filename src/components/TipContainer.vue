<template>
  <div class="tip-container">
    <p class="result-tip">
      <el-icon class="icon-tip"><WarningFilled /></el-icon>
      <span>{{ content }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { WarningFilled } from '@element-plus/icons-vue'
import { defineProps } from 'vue'

defineProps({
  content: {
    type: String,
  },
})
</script>

<style lang="scss">
.tip-container {
  margin-bottom: 12px;
  padding: 8px;
  background-color: var(--color-bg-split);
  border: 1px solid var(--color-border-normal);
  border-radius: 8px;
  .icon-tip {
    --color: var(--el-color-warning);
    margin-right: 4px;
    vertical-align: text-top;
  }
  .result-tip {
    margin-top: 0;
    margin-bottom: 0;
    line-height: 1.5;
  }
}
</style>
