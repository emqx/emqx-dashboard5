<template>
  <el-tooltip :content="tl('search')" placement="top" :hide-after="0">
    <IconButton :icon="Search" />
  </el-tooltip>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

const { tl } = useI18nTl('Base')
</script>
