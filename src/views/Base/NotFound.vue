<template>
  <div class="not-found">
    <div class="container">
      <el-icon :size="60"><CircleCloseFilled /></el-icon>
      <p class="title-404">404</p>
      <p class="desc">{{ tl('notFound') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleCloseFilled } from '@element-plus/icons-vue'
import useI18nTl from '@/hooks/useI18nTl'

const { tl } = useI18nTl('Base')
</script>

<style lang="scss">
.not-found {
  display: flex;
  height: 100%;
  align-items: center;
  .el-icon {
    color: var(--color-text-secondary);
  }
  .container {
    width: 100%;
    text-align: center;
  }
  .title-404 {
    font-size: 28px;
    font-weight: bold;
    letter-spacing: 2px;
  }
  .desc {
    font-size: 16px;
    color: var(--color-text-secondary);
  }
}
</style>
