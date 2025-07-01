<template>
  <el-autocomplete
    v-model="inputValue"
    :fetch-suggestions="fetchSuggestions"
    clearable
    popper-class="is-wider"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string
    options: string[]
    filterable?: boolean
  }>(),
  {
    filterable: true,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val ?? '')
  },
})

const fetchSuggestions = (queryString: string, cb: any) => {
  if (!queryString) {
    cb(props.options)
  }
  let options = props.options
  if (props.filterable) {
    options = options.filter((value) => value.includes(queryString))
  }
  const ret = options.map((value) => ({ value, label: value }))
  cb(ret)
}
</script>
