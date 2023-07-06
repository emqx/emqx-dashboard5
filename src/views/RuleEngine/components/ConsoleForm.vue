<template>
  <p class="tip">
    {{ tl('console') }}
  </p>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'

const { tl } = useI18nTl('RuleEngine')
</script>
