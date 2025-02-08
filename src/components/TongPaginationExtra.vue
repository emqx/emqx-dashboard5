<template>
  <div class="tong-pagination-extra">
    <TongPaginationSizes class="extra-item tong-size" v-model="pageSize" :page-sizes="pageSizes" />
    <div class="extra-item tong-jumper" v-if="jumper">
      <span>{{ tl('jumpTo') }}</span>
      <el-input class="tong-jumper-input" v-model.number="pageNo" @keyup.enter="jumpTo" />
      <span>{{ tl('page') }}</span>
      <el-button class="tong-jumper-button" @click="jumpTo">
        {{ tl('confirm') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { PageData } from '@/types/common'
import { computed, defineEmits, defineProps, ref } from 'vue'
import TongPaginationSizes from './TongPaginationSizes.vue'

const props = defineProps<{
  metaData: PageData
  pageSizes: Array<number>
  jumper?: boolean
}>()
const emits = defineEmits<{
  (e: 'size-change', size: number): void
  (e: 'current-change', page: number): void
}>()

const { tl } = useI18nTl('Base')

const pageSize = computed<number>({
  get() {
    return props.metaData.limit
  },
  set(val: number) {
    debugger
    emits('size-change', val)
  },
})

const maxPageNo = computed<number>(() =>
  Math.ceil((props.metaData.count ?? 0) / props.metaData.limit),
)
const pageNo = ref<number>(props.metaData.page)
const jumpTo = () => {
  let no = Math.round(pageNo.value)
  if (no < 1) {
    no = 1
  }
  if (no > maxPageNo.value) {
    no = maxPageNo.value
  }
  pageNo.value = no
  emits('current-change', no)
}
</script>
