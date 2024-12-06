<template>
  <div class="streaming-empty-placeholder">
    <el-empty :description="tl('streamingPlaceholder')" />
    <el-button
      :disabled="!$hasPermission('put')"
      @click="$router.push({ name: 'streaming-config', query: { enable: 'true' } })"
      type="primary"
    >
      {{ t('SlowSub.enable') }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'

const { t, tl } = useI18nTl('Streaming')
</script>

<style lang="scss">
.streaming-empty-placeholder {
  padding-top: 80px;
  text-align: center;

  .el-empty__description {
    margin-top: 20px;
  }
}
</style>
