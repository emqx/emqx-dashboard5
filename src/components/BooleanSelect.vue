<template>
  <el-select v-model="selectedValue">
    <el-option :label="trueLabel" :value="true" />
    <el-option :label="falseLabel" :value="false" />
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

const emit = defineEmits(['update:modelValue', 'change'])

const selectedValue: WritableComputedRef<boolean | undefined> = computed({
  get() {
    return props.modelValue === undefined ? undefined : props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
    emit('change', val)
  },
})
</script>

<style lang="scss"></style>
