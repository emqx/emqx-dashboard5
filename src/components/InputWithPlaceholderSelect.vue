<!-- 
 This component's code is modified from element-plus licensed under the MIT License.
 The original code and its license can be found at https://github.com/element-plus/element-plus
 -->
<template>
  <el-tooltip
    ref="popperRef"
    :visible="suggestionVisible"
    placement="bottom-start"
    :fallback-placements="['bottom-start', 'top-start']"
    :popper-class="[ns.e('popper')]"
    :gpu-acceleration="false"
    pure
    manual-mode
    effect="light"
    trigger="click"
    :transition="`${ns.namespace.value}-zoom-in-top`"
    persistent
    role="listbox"
    @before-show="onSuggestionShow"
    @hide="onHide"
  >
    <div
      ref="listboxRef"
      :class="[ns.b(), $attrs.class]"
      :style="styles"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="suggestionVisible"
      :aria-owns="listboxId"
    >
      <el-input
        ref="inputRef"
        v-bind="attrs"
        :clearable="true"
        :disabled="disabled"
        :model-value="modelValue"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @clear="handleClear"
        @keydown.up.prevent="highlight(highlightedIndex - 1)"
        @keydown.down.prevent="highlight(highlightedIndex + 1)"
        @keydown.enter="handleKeyEnter"
        @keydown.tab="close"
        @keydown.esc="handleKeyEscape"
        @mousedown="handleMouseDown"
      />
    </div>
    <template #content>
      <div
        ref="regionRef"
        :style="{
          ['minWidth']: dropdownWidth,
          outline: 'none',
        }"
        role="region"
        class="el-autocomplete-suggestion"
      >
        <el-scrollbar
          :id="listboxId"
          tag="ul"
          role="listbox"
          :max-height="280"
          :wrap-class="ns.be('suggestion', 'wrap')"
          :view-class="ns.be('suggestion', 'list')"
        >
          <li
            v-for="(item, index) in suggestions"
            :id="`${listboxId}-item-${index}`"
            :key="index"
            :class="{ highlighted: highlightedIndex === index }"
            role="option"
            :aria-selected="highlightedIndex === index"
            @click="handleSelect(item)"
          >
            <slot :item="item">{{ item[valueKey] }}</slot>
          </li>
        </el-scrollbar>
      </div>
    </template>
  </el-tooltip>
</template>

<script lang="ts" setup>
import useSQLAvailablePlaceholder from '@/hooks/Rule/useSQLAvailablePlaceholder'
import { onClickOutside } from '@vueuse/core'
import type { AutocompleteData } from 'element-plus'
import { useAttrs, useId, useNamespace } from 'element-plus'
import { debounce, escapeRegExp, isArray } from 'lodash'
import type { StyleValue } from 'vue'
import { computed, defineEmits, defineProps, onMounted, ref, useAttrs as useRawAttrs } from 'vue'

const props = defineProps<{
  modelValue: string | number
  disabled?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'input', v: string): void
  (e: 'change', v: string): void
  (e: 'focus', v: FocusEvent): void
  (e: 'blur', v: FocusEvent): void
  (e: 'clear'): void
}>()

const attrs = useAttrs()
const rawAttrs = useRawAttrs()
/**
 * name space
 */
const ns = useNamespace('autocomplete')

const inputRef = ref()
const regionRef = ref<HTMLElement>()
const popperRef = ref()
const listboxRef = ref<HTMLElement>()

let readonly = false
let ignoreFocusEvent = false
const suggestions = ref<AutocompleteData>([])
const highlightedIndex = ref(-1)
const dropdownWidth = ref('')
const activated = ref(false)

const listboxId = useId()
const styles = computed(() => rawAttrs.style as StyleValue)

const suggestionVisible = computed(() => {
  const isValidData = suggestions.value.length > 0
  return isValidData && activated.value
})

const refInput = computed<HTMLInputElement[]>(() => {
  if (inputRef.value) {
    return Array.from<HTMLInputElement>(inputRef.value.$el.querySelectorAll('input'))
  }
  return []
})

const onSuggestionShow = () => {
  if (suggestionVisible.value) {
    dropdownWidth.value = `${inputRef.value?.$el.offsetWidth}px`
  }
}

const onHide = () => {
  highlightedIndex.value = -1
}

const placeholderReg = /\$(\{[^\s\n}]*)?$/
const getMatchPart = () => {
  const matchRet = props.modelValue.toString().match(placeholderReg)
  return matchRet && matchRet[0]
}
const { availablePlaceholders } = useSQLAvailablePlaceholder()
const fetchSuggestions = () => {
  const matchPart = getMatchPart()
  if (!matchPart) {
    return []
  }
  const filterReg = new RegExp(escapeRegExp(matchPart), 'i')
  return availablePlaceholders.value.reduce((arr, value) => {
    if (filterReg.test(value)) {
      arr.push({ value })
    }
    return arr
  }, [] as Array<{ value: string }>)
}

const getData = async () => {
  const cb = (suggestionList: AutocompleteData) => {
    if (isArray(suggestionList)) {
      suggestions.value = suggestionList
      highlightedIndex.value = -1
    }
  }

  const result = await fetchSuggestions()
  if (isArray(result)) cb(result)
}
const debouncedGetData = debounce(getData, 300)

const handleInput = (value: string) => {
  const valuePresented = !!value

  emit('input', value)
  emit('update:modelValue', value)

  activated.value ||= valuePresented

  debouncedGetData()
}

const handleMouseDown = (event: MouseEvent) => {
  if (props.disabled) return
  if (
    (event.target as HTMLElement)?.tagName !== 'INPUT' ||
    refInput.value.includes(document.activeElement as HTMLInputElement)
  ) {
    activated.value = true
  }
}

const handleChange = (value: string) => {
  emit('change', value)
}

const handleFocus = (evt: FocusEvent) => {
  if (!ignoreFocusEvent) {
    activated.value = true
    emit('focus', evt)

    if (!readonly) {
      debouncedGetData()
    }
  } else {
    ignoreFocusEvent = false
  }
}

const handleBlur = (evt: FocusEvent) => {
  setTimeout(() => {
    // validate current focus event is inside el-tooltip-content
    // if so, ignore the blur event and the next focus event
    if (popperRef.value?.isFocusInsideContent()) {
      ignoreFocusEvent = true
      return
    }
    activated.value && close()
    emit('blur', evt)
  })
}

const handleClear = () => {
  activated.value = false
  emit('update:modelValue', '')
  emit('clear')
}

const handleKeyEnter = async (e: KeyboardEvent | Event) => {
  if (
    suggestionVisible.value &&
    highlightedIndex.value >= 0 &&
    highlightedIndex.value < suggestions.value.length
  ) {
    handleSelect(suggestions.value[highlightedIndex.value])
    e.preventDefault()
  }
}

const handleKeyEscape = (evt: Event) => {
  if (suggestionVisible.value) {
    evt.preventDefault()
    evt.stopPropagation()
    close()
  }
}

const close = () => {
  activated.value = false
}

const valueKey = 'value'
const handleSelect = async (item: any) => {
  const matchPart = getMatchPart()
  if (!matchPart) {
    return
  }
  const value = props.modelValue.toString().replace(placeholderReg, item[valueKey])
  emit('input', value)
  emit('update:modelValue', value)
  suggestions.value = []
  highlightedIndex.value = -1
}

const highlight = (index: number) => {
  if (!suggestionVisible.value) return

  if (index < 0) {
    highlightedIndex.value = -1
    return
  }

  if (index >= suggestions.value.length) {
    index = suggestions.value.length - 1
  }
  const suggestion = regionRef.value?.querySelector(`.${ns.be('suggestion', 'wrap')}`)
  if (!suggestion) {
    return
  }
  const suggestionList = suggestion.querySelectorAll<HTMLElement>(
    `.${ns.be('suggestion', 'list')} li`,
  )
  const highlightItem = suggestionList[index]
  const scrollTop = suggestion.scrollTop
  const { offsetTop, scrollHeight } = highlightItem

  if (offsetTop + scrollHeight > scrollTop + suggestion.clientHeight) {
    suggestion.scrollTop += scrollHeight
  }
  if (offsetTop < scrollTop) {
    suggestion.scrollTop -= scrollHeight
  }
  highlightedIndex.value = index
  ;(inputRef.value as any).ref?.setAttribute(
    'aria-activedescendant',
    `${listboxId.value}-item-${highlightedIndex.value}`,
  )
}

onClickOutside(listboxRef, () => {
  suggestionVisible.value && close()
})

onMounted(() => {
  ;(inputRef.value as any).ref?.setAttribute('role', 'textbox')
  ;(inputRef.value as any).ref?.setAttribute('aria-autocomplete', 'list')
  ;(inputRef.value as any).ref?.setAttribute('aria-controls', 'id')
  ;(inputRef.value as any).ref?.setAttribute(
    'aria-activedescendant',
    `${listboxId.value}-item-${highlightedIndex.value}`,
  )
  // get readonly attr
  readonly = (inputRef.value as any).ref?.hasAttribute('readonly')
})
</script>
