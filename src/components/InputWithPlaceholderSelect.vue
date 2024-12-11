<template>
  <el-autocomplete
    ref="AutocompleteRef"
    v-model="inputValue"
    :fetch-suggestions="fetchSuggestions"
    @select="handleSelect($event)"
    @keydown.enter="handleEnter"
  >
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix"></slot>
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix"></slot>
    </template>
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend"></slot>
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append"></slot>
    </template>
  </el-autocomplete>
</template>

<script setup lang="ts">
import useSQLAvailablePlaceholder from '@/hooks/Rule/useSQLAvailablePlaceholder'
import { escapeRegExp } from 'lodash'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: string
  [key: string]: any
  customPlaceholders?: Array<string>
  /**
   * The provided options are available when the input has no value.
   * If there are suggestions,
   * the options are added at the end of the list.
   */
  options?: Array<string | number>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'input', v: any): void
}>()

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value: string) => {
    emit('update:modelValue', value)
  },
})

const placeholderReg = /\$(\{[^\s\n}]*)?$/
const getMatchPart = () => {
  const matchRet = props.modelValue?.toString().match(placeholderReg)
  return matchRet && matchRet[0]
}
const { availablePlaceholders } = useSQLAvailablePlaceholder()

const convertStrArrToOptArr = (arr: Array<string>): Array<{ value: string }> =>
  arr.map((item: string) => ({ value: item.toString() }))

const effectivePlaceholders = computed(
  () => props.customPlaceholders || availablePlaceholders.value,
)

const getMatchedPlaceholders = () => {
  const matchPart = getMatchPart()
  let ret: Array<string> = []
  if (matchPart) {
    const filterReg = new RegExp(escapeRegExp(matchPart), 'i')
    ret = effectivePlaceholders.value.reduce((arr: Array<string>, value: string) => {
      if (filterReg.test(value)) {
        arr.push(value)
      }
      return arr
    }, [] as Array<string>)
  }
  return ret
}

const fetchSuggestions = (queryString: string, cb: any) => {
  const ret = [...getMatchedPlaceholders(), ...(props.options ?? [])]
  cb(convertStrArrToOptArr(ret))
}

const handleSelect = ({ value: selected }: { value: string }) => {
  const matchPart = getMatchPart()
  if (!matchPart) {
    return
  }
  inputValue.value = props.modelValue?.replace(placeholderReg, selected) || ''
}

const AutocompleteRef = ref()
const handleEnter = (e: KeyboardEvent) => {
  // If the enter event is triggered by a select event, prevent default
  // (In order not to enter an extra carriage return after selecting the)
  if (AutocompleteRef.value.highlightedIndex > -1 && AutocompleteRef.value.popperRef.visible) {
    e.preventDefault()
  }
}

watch(inputValue, (val) => {
  emit('input', val)
})
</script>
