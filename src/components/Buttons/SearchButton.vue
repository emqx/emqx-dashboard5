<template>
  <el-tooltip :content="tl('search')" placement="top" :hide-after="0">
    <el-button class="icon-button" plain v-bind="$attrs">
      <Search />
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const { tl } = useI18nTl('Base')
</script>
