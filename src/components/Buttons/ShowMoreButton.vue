<template>
  <el-tooltip :content="!showMoreQuery ? t('Base.showMore') : t('Base.lessMore')" placement="top">
    <el-button
      class="icon-button"
      plain
      :icon="showMoreQuery ? ArrowUp : ArrowDown"
      @click="showMoreQuery = !showMoreQuery"
    >
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

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
