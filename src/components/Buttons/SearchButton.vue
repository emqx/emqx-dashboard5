<template>
  <el-button type="primary" plain :icon="Search" v-if="noText"></el-button>
  <el-button type="primary" plain :icon="Search" v-else>
    {{ tl('search') }}
  </el-button>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { Search } from '@element-plus/icons-vue'
import { defineProps } from 'vue'

defineProps<{
  noText?: boolean
}>()

const { tl } = useI18nTl('Base')
</script>
