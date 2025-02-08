<template>
  <div class="tong-pagination-sizes">
    <span>{{ tl('perPage') }}</span>
    <el-select class="tong-size-select" v-model="pageSize">
      <el-option v-for="size in pageSizes" :key="size" :label="size" :value="size" />
    </el-select>
    <span>{{ tl('items') }}</span>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps<{
  modelValue: number
  pageSizes: Array<number>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const { tl } = useI18nTl('Base')

const pageSize = computed<number>({
  get() {
    return props.modelValue
  },
  set(val: number) {
    emit('update:modelValue', val)
  },
})
</script>
