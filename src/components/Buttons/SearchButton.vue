<template>
  <el-tooltip :content="tl('search')" placement="top" :hide-after="0">
    <el-button class="icon-button" plain v-bind="$attrs">
      <Icon icon="lucide:search" />
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
const { tl } = useI18nTl('Base')
</script>
