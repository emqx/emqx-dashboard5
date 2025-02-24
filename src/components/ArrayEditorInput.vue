<template>
  <el-input v-model="inputData" type="textarea" :rows="3" :disabled="disabled" />
</template>

<script setup lang="ts">
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
    const arr = val.split(SEPARATOR).map((item) => item.trim())
    emit('update:modelValue', arr)
  },
})
</script>
