<!-- Only one can be selected -->
<template>
  <el-autocomplete
    v-model="inputValue"
    clearable
    :fetch-suggestions="querySearch"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { escapeRegExp, isObject, isUndefined } from 'lodash'
import { computed, defineEmits, defineProps, withDefaults } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | boolean | number
    options: Array<Record<string, any>> | Array<string> | Array<number>
    valueKey?: string
    labelKey?: string
    [key: string]: any
  }>(),
  {
    valueKey: 'value',
    labelKey: 'label',
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean): void
}>()

const inputValue = computed({
  get: () => props.modelValue?.toString?.(),
  set: (val) => emit('update:modelValue', val),
})

const opts = computed(() => {
  if (!props.options || isUndefined(props.options[0])) {
    return []
  }
  const isObj = isObject(props.options[0])
  if (isObj) {
    return props.options.map((item: Record<string, any>) => ({
      value: item[props.valueKey],
      label: item[props.labelKey],
    }))
  }
  const deduplicatedOpts: Array<string | number> = Array.from(new Set(props.options))
  return deduplicatedOpts.map((item: string | number) => ({ value: item, label: item }))
})

const querySearch = (queryString: string, cb: (arg0: Array<Record<string, any>>) => void) => {
  if (!queryString) {
    cb(opts.value)
  } else {
    const filterReg = new RegExp(escapeRegExp(queryString), 'i')
    const ret = opts.value.reduce(
      (arr: Array<{ value: string }>, { value }: { value: string; item: string }) => {
        if (filterReg.test(value)) {
          arr.push({ value })
        }
        return arr
      },
      [] as Array<{ value: string }>,
    )
    cb(ret)
  }
}
</script>
