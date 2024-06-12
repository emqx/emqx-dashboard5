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
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props =
  defineProps<{ modelValue?: string; [key: string]: any; customPlaceholders?: Array<string> }>()
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
const fetchSuggestions = (queryString: string, cb: any) => {
  const matchPart = getMatchPart()
  let ret: Array<{ value: string }> = []
  if (matchPart) {
    const filterReg = new RegExp(escapeRegExp(matchPart), 'i')
    const availableList = props.customPlaceholders || availablePlaceholders.value
    ret = availableList.reduce((arr: Array<{ value: string }>, value: string) => {
      if (filterReg.test(value)) {
        arr.push({ value })
      }
      return arr
    }, [] as Array<{ value: string }>)
  }
  cb(ret)
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
