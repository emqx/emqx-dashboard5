<template>
  <div class="streaming-empty-placeholder">
    <el-empty :description="tl('streamingPlaceholder')" />
    <el-button :disabled="!$hasPermission('put')" @click="handleEnableStreaming" type="primary">
      {{ t('SlowSub.enable') }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { defineEmits } from 'vue'

const emit = defineEmits<{
  (e: 'enable-streaming'): void
}>()

const { t, tl } = useI18nTl('Streaming')

const handleEnableStreaming = () => {
  emit('enable-streaming')
}
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
