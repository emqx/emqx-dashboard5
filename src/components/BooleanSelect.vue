<template>
  <el-select v-model="selectedValue">
    <el-option :label="trueLabel" :value="VALUE_MAP.get(true)" />
    <el-option :label="falseLabel" :value="VALUE_MAP.get(false)" />
  </el-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BooleanSelect',
})
</script>

<script setup lang="ts">
import { defineProps, computed, defineEmits, WritableComputedRef } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  trueLabel: {
    type: String,
    default: 'true',
  },
  falseLabel: {
    type: String,
    default: 'false',
  },
})

const emit = defineEmits(['update:modelValue'])

const VALUE_MAP: Map<boolean, string> = new Map([
  [false, 'false'],
  [true, 'true'],
])

const selectedValue: WritableComputedRef<string> = computed({
  get() {
    return props.modelValue ? (VALUE_MAP.get(true) as string) : (VALUE_MAP.get(false) as string)
  },
  set(val) {
    emit('update:modelValue', val === VALUE_MAP.get(true) ? true : false)
  },
})
</script>

<style lang="scss"></style>
