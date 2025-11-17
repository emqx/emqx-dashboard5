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

const arrProxy = ref<string[]>([])
const filterEmpty = (arr: string[]): string[] => arr.filter(Boolean)

const inputData = computed({
  get() {
    if (isEqual(props.modelValue, filterEmpty(arrProxy.value))) {
      return arrProxy.value.join(SEPARATOR)
    }
    return (props.modelValue || []).join(SEPARATOR)
  },
  set(val) {
    const arr = val.split(SEPARATOR).map((item) => item.trim())
    const filteredArr = filterEmpty(arr)
    arrProxy.value = arr
    emit('update:modelValue', filteredArr)
  },
})
</script>
