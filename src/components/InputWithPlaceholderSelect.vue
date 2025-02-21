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
import { NUM_REG } from '@/common/constants'
import { PropType } from '@/types/enum'
import { Property } from '@/types/schemaForm'

const props = defineProps<{
  modelValue?: string | number | boolean
  [key: string]: any
  customPlaceholders?: Array<string>
  /**
   * The provided options are available when the input has no value.
   * If there are suggestions,
   * the options are added at the end of the list.
   */
  options?: Array<string | number>
  oneOf?: Array<Property>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number | boolean): void
  (e: 'input', v: any): void
}>()

const getValueForEmit = (val: string) => {
  if (!props.oneOf || props.oneOf.length === 0) {
    return val
  }
  const oneOfBoolean = props.oneOf.find(({ type }) => type === PropType.Boolean)
  const oneOfNum = props.oneOf.find(({ type }) =>
    [PropType.Integer, PropType.Number].includes(type),
  )
  if (oneOfBoolean && /^(true|false)$/i.test(val)) {
    return /^true/i.test(val)
  }
  if (oneOfNum && NUM_REG.test(val)) {
    return Number(val)
  }
  return val
}

const inputValue = computed({
  get: () => props.modelValue?.toString() || '',
  set: (value: string) => {
    emit('update:modelValue', getValueForEmit(value))
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
