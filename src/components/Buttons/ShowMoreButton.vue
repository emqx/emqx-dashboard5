<template>
  <el-tooltip
    :content="!showMoreQuery ? t('Base.showMore') : t('Base.lessMore')"
    placement="top"
    :hide-after="0"
  >
    <el-button class="icon-button" plain @click="showMoreQuery = !showMoreQuery">
      <ChevronUp v-if="showMoreQuery" />
      <ChevronDown v-else />
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ChevronUp, ChevronDown } from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const showMoreQuery = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>
