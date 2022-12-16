<template>
  <el-input v-model="inputData" type="textarea" :rows="3" :disabled="disabled" />
</template>

<script setup lang="ts">
import { computed, defineProps, PropType, defineEmits } from 'vue'

const SEPARATOR = ','

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<string | number>>,
  },
  disabled: {
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue'])

const inputData = computed({
  get() {
    return (props.modelValue || []).join(SEPARATOR)
  },
  set(val) {
    emit('update:modelValue', val.split(SEPARATOR))
  },
})
</script>
