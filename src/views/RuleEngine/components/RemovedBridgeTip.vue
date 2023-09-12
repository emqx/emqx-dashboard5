<template>
  <p class="removed-bridge-tip">
    {{ tl('bridgeRemovedTip') }}
  </p>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'

const { tl } = useI18nTl('Flow')
</script>
