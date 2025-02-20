<template>
  <TextareaWithUploader
    v-if="showUploader"
    class="TLS-input"
    v-model="inputValue"
    :accept="CER_FILE_ACCEPTS"
    :placeholder="$t('Base.certPlaceholder')"
  />
  <ConfigItemDataLook v-else class="TLS-input" :value="inputValue" @reset="editConfigItem" />
</template>

<script setup lang="ts">
import { CER_FILE_ACCEPTS } from '@/common/constants'
import TextareaWithUploader from '@/components/TextareaWithUploader.vue'
import ConfigItemDataLook from './ConfigItemDataLook.vue'

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
  },
  isEdit: {
    type: Boolean,
  },
})
const emit = defineEmits(['update:modelValue'])

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
