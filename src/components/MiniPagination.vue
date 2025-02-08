<!-- Pagination only with sizes, pre and next button -->
<template>
  <el-pagination
    background
    layout="prev, next, slot"
    :current-page="currentPage"
    :page-count="pageCount"
    @current-change="handleCurrentChanged"
  >
    <TongPaginationSizes v-model="pageLimit" :page-sizes="DEFAULT_PAGE_SIZE_OPT" />
  </el-pagination>
</template>

<script setup lang="ts">
import { DEFAULT_PAGE_SIZE_OPT } from '@/common/constants'
import { computed, defineEmits, defineProps } from 'vue'
import TongPaginationSizes from './TongPaginationSizes.vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  hasnext: {
    type: Boolean,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['current-change', 'size-change'])

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

const pageLimit = computed({
  get() {
    return props.pageSize
  },
  set(val: number) {
    emit('size-change', val)
  },
})
</script>

<style lang="scss">
.tong-pagination-sizes {
  margin-left: 8px;
}
</style>
