<template>
  <el-autocomplete
    v-model="inputValue"
    :fetch-suggestions="fetchSuggestions"
    clearable
    popper-class="is-wider"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  options: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const fetchSuggestions = (queryString: string, cb: any) => {
  if (!queryString) {
    cb(props.options)
  }
  const ret = props.options
    .filter((value) => value.includes(queryString))
    .map((value) => ({
      value,
      label: value,
    }))
  cb(ret)
}
</script>
