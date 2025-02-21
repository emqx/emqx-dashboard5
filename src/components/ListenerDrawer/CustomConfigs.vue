<template>
  <el-form-item class="custom-configs" :label="tl('customConfig')">
    <p class="desc-tips">{{ tl('customConfigDescription') }}</p>
    <el-input
      type="textarea"
      v-model="rawListener"
      :rows="12"
      :placeholder="defaultPlaceHolder"
      @keydown.tab="handleTab"
      @blur="resetRawData"
      @focus="handleFocus"
    />
    <p class="error-msg" v-if="errorMsg !== ''">{{ errorMsg }}</p>
  </el-form-item>
</template>

<script lang="ts" setup>
import { Listener } from '@/types/listener'
import { unexposedConfigs } from '@/common/constants'

const { tl } = useI18nTl('Gateway')

const props = defineProps({
  modelValue: {
    type: Object as PropType<Listener>,
    required: true,
  },
  type: {
    type: String as PropType<'ssl' | 'tcp' | 'ws' | 'wss'>,
    required: true,
  },
})

const emits = defineEmits(['update:modelValue'])

const { objectToHocon, hoconToObject } = useListenerUtils()

const errorMsg = ref('')

const rawListener = ref(objectToHocon(props.modelValue))

watch(
  () => props.type,
  (val) => {
    setDefaultPlaceHolder(val)
  },
)

watch(
  () => props.modelValue,
  (val) => {
    rawListener.value = objectToHocon(val)
  },
)

const defaultPlaceHolder = ref('')

function setDefaultPlaceHolder(type: 'ssl' | 'tcp' | 'ws' | 'wss') {
  defaultPlaceHolder.value = objectToHocon(unexposedConfigs[type])
}
setDefaultPlaceHolder(props.type)

async function resetRawData() {
  try {
    const parsed = await hoconToObject(rawListener.value)
    emits('update:modelValue', parsed)
  } catch (error) {
    const err = error as Error
    errorMsg.value = err.toString()
  }
}

function handleFocus() {
  errorMsg.value = ''
}

const handleTab = (e: KeyboardEvent) => {
  e.preventDefault()
  const textarea = e.target as HTMLTextAreaElement
  const { selectionStart, selectionEnd, value } = textarea
  const tabSize = 2
  const before = value.slice(0, selectionStart)
  const after = value.slice(selectionEnd)
  const newText = before + ' '.repeat(tabSize) + after
  const newCursorPos = selectionStart + tabSize
  textarea.value = newText
  textarea.setSelectionRange(newCursorPos, newCursorPos)
}

defineExpose({
  rawListener,
})
</script>

<style lang="scss">
.custom-configs {
  p.desc-tips {
    margin-top: 0;
  }
  p.error-msg {
    color: #eb4e3d;
    margin: 0;
    padding: 0;
  }
}
</style>
