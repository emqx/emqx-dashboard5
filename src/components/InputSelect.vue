<template>
  <el-select
    class="input-select"
    ref="SelectCom"
    v-model="value"
    filterable
    allow-create
    default-first-option
    :placeholder="tl('pleaseInputOrSelect')"
    :popper-class="popperClass"
    @change="handleChange"
  >
    <el-option
      v-for="item in options"
      v-show="options?.includes(item)"
      :key="item"
      :label="item"
      :value="item"
    />
  </el-select>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import {
  PropType,
  computed,
  defineEmits,
  defineProps,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
  },
  options: {
    type: Array as PropType<Array<string>>,
  },
})
const emit = defineEmits(['update:modelValue', 'input', 'change'])

const { tl } = useI18nTl('Flow')

const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const inputValue = ref('')
const handleInput = (e: InputEvent) => {
  inputValue.value = (e.target as HTMLInputElement)?.value || ''
}

const handleFocus = () => {
  inputValue.value = ''
}

const popperClass = computed(() => {
  const withRet = props.options?.some((item) => item.includes(inputValue.value))
  return !withRet ? 'input-select-popper popper-hidden' : ''
})

const handleChange = (val: string) => {
  emit('change', val)
}

const SelectCom = ref()
const handleBlur = async (event: Event) => {
  const val = (event?.target as HTMLInputElement)?.value
  if (val && value.value !== val) {
    value.value = val
    emit('change', val)
  }
}

onMounted(async () => {
  await nextTick()
  SelectCom.value?.$el?.querySelector('input')?.addEventListener('focus', handleFocus)
  SelectCom.value?.$el?.querySelector('input')?.addEventListener('input', handleInput)
  SelectCom.value?.$el?.querySelector('input')?.addEventListener('blur', handleBlur)
})

onUnmounted(() => {
  SelectCom.value?.$el?.querySelector('input')?.removeListener('focus', handleFocus)
  SelectCom.value?.$el?.querySelector('input')?.removeListener('input', handleInput)
  SelectCom.value?.$el?.querySelector('input')?.removeListener('blur', handleBlur)
})
</script>

<style lang="scss">
.input-select {
  &.el-select .el-input .el-select__caret {
    display: none;
  }
}
.popper-hidden {
  display: none;
}
</style>
