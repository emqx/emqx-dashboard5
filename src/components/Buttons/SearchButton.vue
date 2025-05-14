<template>
  <el-button :icon="Search" v-if="noText"></el-button>
  <el-button :icon="Search" v-else>
    {{ tl('search') }}
  </el-button>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

defineProps<{
  noText?: boolean
}>()

const { tl } = useI18nTl('Base')
</script>
