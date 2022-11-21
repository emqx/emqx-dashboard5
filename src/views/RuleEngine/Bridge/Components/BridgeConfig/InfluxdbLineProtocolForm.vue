<template>
  <el-row class="influx-db-line-protocol-form" :gutter="26">
    <el-col :span="12">
      <el-form-item label="Measurement" class="is-required" :error="measurementErrorMsg">
        <el-input v-model="measurement" @change="updateModelValue" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="Timestamp">
        <el-input v-model="timestamp" @change="updateModelValue" />
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="Fields" class="is-required" :error="fieldsErrorMsg">
        <InfluxdbFieldsEditor :model-value="fieldMap" @update:model-value="handleFieldMapChanged" />
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="Tags">
        <KeyAndValueEditor :model-value="tagMap" @update:model-value="handleTabMapChanged" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useI18nTl from '@/hooks/useI18nTl'

export default defineComponent({
  name: 'InfluxDBLineProtocolForm',
})
</script>

<script setup lang="ts">
import { ref, Ref, defineProps, defineEmits, defineExpose, watch } from 'vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import InfluxdbFieldsEditor from './InfluxdbFieldsEditor.vue'
import useInfluxdbLineProtocol, { KeyValueItem } from '@/hooks/Rule/bridge/useInfluxdbLineProtocol'

// TODO:the best implementation is bi-bind model value in time, maybe sometime can refactor

// ❗️do not bi-bind model value now, parent component need to get model value manually

const props = defineProps({
  modelValue: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18nTl('Rule')

const measurement = ref('')
const timestamp: Ref<undefined | number> = ref(undefined)
const fieldMap: Ref<Record<string, string>> = ref({})
const tagMap: Ref<Record<string, string>> = ref({})

const measurementErrorMsg = ref('')
const fieldsErrorMsg = ref('')

/**
 * prevent duplicate fill the form using the same line protocol
 */
const preLineProtocol: Ref<undefined | string> = ref(undefined)

const {
  parseLine,
  convertArrToMap,
  trimLineProtocol,
  escape,
  escapeFieldValue,
  unescape,
  unescapeFieldValue,
} = useInfluxdbLineProtocol()

const unescapeTagArr = (arr: Array<KeyValueItem>) =>
  arr.map(({ key, value }) => ({
    key: unescape(key),
    value: unescape(value),
  }))

const unescapeFieldArr = (arr: Array<KeyValueItem>) =>
  arr.map(({ key, value }) => ({
    key: unescape(key),
    value: unescapeFieldValue(value),
  }))

const fillFormFromLineProtocol = () => {
  if (props.modelValue === preLineProtocol.value || !props.modelValue) {
    return
  }
  preLineProtocol.value = trimLineProtocol(props.modelValue)
  const parseResult = parseLine(trimLineProtocol(props.modelValue))
  if (parseResult) {
    const { measurement: m, tagArr, fieldArr, timestamp: t } = parseResult
    measurement.value = unescape(m)
    timestamp.value = t
    fieldMap.value = convertArrToMap(unescapeFieldArr(fieldArr))
    tagMap.value = convertArrToMap(unescapeTagArr(tagArr))
  }
}

const getTagPartStr = () => {
  const keys = Object.keys(tagMap.value).filter((key) => {
    const value = tagMap.value[key]
    return value !== '' && value !== undefined && key !== ''
  })
  const ret = keys.reduce((str, currentKey, index) => {
    const key = escape(currentKey)
    const value = escape(tagMap.value[currentKey])
    return `${str}${index === 0 ? '' : ','}${key}=${value}`
  }, '')
  return ret.length > 0 ? `,${ret}` : ret
}

const getFieldPartStr = () => {
  const keys = Object.keys(fieldMap.value).filter((key) => {
    const value = fieldMap.value[key]
    return value !== '' && value !== undefined && key !== ''
  })
  return keys.reduce((str, currentKey, index) => {
    const key = escape(currentKey)
    const value = escapeFieldValue(fieldMap.value[currentKey])
    return `${str}${index === 0 ? '' : ','}${key}=${value}`
  }, '')
}

const getTimestamp = () => {
  return timestamp.value ? ` ${timestamp.value}` : ''
}

const getLineProtocol = () => {
  return `${escape(measurement.value)}${getTagPartStr()} ${getFieldPartStr()}${getTimestamp()}`
}

const updateModelValue = () => {
  const newLineProtocol = getLineProtocol()
  preLineProtocol.value = newLineProtocol
  emit('update:modelValue', newLineProtocol)
}

const handleFieldMapChanged = (val: Record<string, string>) => {
  fieldMap.value = val
  updateModelValue()
}
const handleTabMapChanged = (val: Record<string, string>) => {
  tagMap.value = val
  updateModelValue()
}

const validate = () => {
  if (!measurement.value) {
    measurementErrorMsg.value = t('Rule.inputFieldRequiredError', { name: 'Measurement' })
  }
  if (
    Object.keys(fieldMap.value).filter((key) => {
      const value = fieldMap.value[key]
      return key !== '' && value !== '' && value !== undefined
    }).length === 0
  ) {
    fieldsErrorMsg.value = t('Rule.inputFieldRequiredError', { name: 'Field set' })
  }
  if (measurementErrorMsg.value || fieldsErrorMsg.value) {
    return Promise.reject()
  }
  return Promise.resolve()
}

const clearValidate = () => {
  measurementErrorMsg.value = ''
  fieldsErrorMsg.value = ''
}

defineExpose({ validate, clearValidate })

watch(() => props.modelValue, fillFormFromLineProtocol)

fillFormFromLineProtocol()
</script>

<style lang="scss">
.influx-db-line-protocol-form {
  .el-col:not(:last-child) {
    margin-bottom: 18px;
  }
}
</style>
