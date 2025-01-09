<template>
  <el-button link @click="showMoreQuery = !showMoreQuery">
    {{ showMoreQuery ? t('Base.lessMore') : t('Base.showMore') }}
  </el-button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { defineProps, defineEmits, computed } from 'vue'

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
