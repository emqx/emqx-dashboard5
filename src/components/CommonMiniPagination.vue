<template>
  <MiniPagination
    v-if="!(currentPage === 1 && !hasnext)"
    :current-page="currentPage"
    :hasnext="hasnext"
    :page-size="pageSize"
    :page-sizes="pageSizes"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import MiniPagination from './MiniPagination.vue'

defineProps<{
  currentPage: number
  hasnext: boolean
  pageSize: number
  pageSizes: number[]
}>()
</script>
