<!-- Pagination only with pre and next button -->
<template>
  <el-pagination
    background
    layout="prev, next"
    :current-page="currentPage"
    :page-count="pageCount"
    @current-change="handleCurrentChanged"
  />
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  hasnext: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['current-change'])

const pageCount = computed(() => {
  if (props.hasnext) {
    return props.currentPage + 1
  } else {
    return props.currentPage
  }
})

const handleCurrentChanged = (page: number) => {
  emit('current-change', page)
}
</script>

<style lang="scss"></style>
