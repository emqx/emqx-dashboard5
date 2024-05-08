<template>
  <el-drawer v-model="showDrawer" :title="tl('mockData')" class="mock-data-drawer" :size="660">
    
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, WritableComputedRef } from 'vue'
import useI18nTl from '@/hooks/useI18nTl'

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue', 'use-sql', 'test-sql'])

const showDrawer: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { tl } = useI18nTl('RuleEngine')
</script>

<style lang="scss"></style>
