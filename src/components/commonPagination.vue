<template>
  <div class="common-pagination">
    <el-pagination
      v-if="
        meta.count &&
        meta.count > (meta.limit >= defaultPageSizeOpt[0] ? defaultPageSizeOpt[0] : meta.limit)
      "
      background
      layout="total, sizes, prev, pager, next"
      :page-sizes="defaultPageSizeOpt"
      v-model:page-size="meta.limit"
      v-model:current-page="meta.page"
      :total="meta.count"
      @size-change="handleSizeChanged"
      @current-change="handleCurrentChanged"
    />
    <MiniPagination
      v-else-if="meta.count === -1"
      :current-page="meta.page"
      :hasnext="!!meta.hasnext"
      :page-sizes="defaultPageSizeOpt"
      v-model:page-size="meta.limit"
      @size-change="handleSizeChanged"
      @current-change="handleCurrentChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_PAGE_SIZE_OPT as defaultPageSizeOpt } from '@/common/constants'
import MiniPagination from './MiniPagination.vue'
import { PageData } from '@/types/common'

const props = defineProps({
  metaData: {
    type: Object as PropType<PageData>,
    required: true,
    default: () => ({}),
  },
})

const meta = computed<PageData>(() => props.metaData)
meta.value.limit ||= 20
meta.value.page ||= 1

const emits = defineEmits(['loadPage', 'update:metaData'])

watch(meta, (v) => {
  emits('update:metaData', v)
})

const handleSizeChanged = (size: number) => {
  meta.value.page = 1
  emits('loadPage', {
    page: meta.value.page,
    limit: size,
  })
}

const handleCurrentChanged = (current: number) => {
  if (meta.value.page !== current) {
    meta.value.page = current
  }
  emits('loadPage', {
    page: current,
    limit: meta.value.limit,
  })
}
</script>

<style lang="scss">
.common-pagination {
  padding-bottom: 24px;
}
</style>
