<template>
  <el-button type="primary" plain :icon="Search">
    <template v-if="!noText">{{ t('search') }}</template>
  </el-button>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { Search } from '@element-plus/icons-vue'
import { defineProps } from 'vue'

defineProps<{
  noText?: boolean
}>()

const { t } = useI18nTl('Base')
</script>
