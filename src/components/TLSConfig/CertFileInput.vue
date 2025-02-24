<template>
  <TextareaWithUploader
    v-if="showUploader"
    class="TLS-input"
    v-model="inputValue"
    :accept="CER_FILE_ACCEPTS"
    :placeholder="isUndefined(placeholder) ? defaultPlaceholder : placeholder"
  />
  <ConfigItemDataLook v-else class="TLS-input" :value="inputValue" @reset="editConfigItem" />
</template>

<script setup lang="ts">
import ConfigItemDataLook from './ConfigItemDataLook.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { isUndefined } from 'lodash'

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
  },
  isEdit: {
    type: Boolean,
  },
  placeholder: {
    type: String,
  },
})
const emit = defineEmits(['update:modelValue'])

const { tl } = useI18nTl('Base')

const defaultPlaceholder = tl('certPlaceholder')

const openReset = ref((props.isEdit && !props.modelValue) || false)
const showUploader = computed(() => {
  return !props.isEdit || !props.modelValue || openReset.value
})

const inputValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const editConfigItem = () => {
  inputValue.value = ''
  openReset.value = true
}
</script>
