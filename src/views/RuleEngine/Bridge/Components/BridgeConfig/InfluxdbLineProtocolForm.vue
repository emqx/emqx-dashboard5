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
import { ref, Ref, defineProps, defineEmits, defineExpose } from 'vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import InfluxdbFieldsEditor from './InfluxdbFieldsEditor.vue'

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
const timestamp = ref(undefined)
const fieldMap: Ref<Record<string, string>> = ref({})
const tagMap: Ref<Record<string, string>> = ref({})

const measurementErrorMsg = ref('')
const fieldsErrorMsg = ref('')

const getTagPartStr = () => {
  const keys = Object.keys(tagMap.value).filter((key) => {
    const value = tagMap.value[key]
    return value !== '' && value !== undefined && key !== ''
  })
  const ret = keys.reduce((str, currentKey, index) => {
    return `${str}${index === 0 ? '' : ','}${currentKey}=${tagMap.value[currentKey]}`
  }, '')
  return ret.length > 0 ? `,${ret}` : ret
}

const getFieldPartStr = () => {
  const keys = Object.keys(fieldMap.value).filter((key) => {
    const value = fieldMap.value[key]
    return value !== '' && value !== undefined && key !== ''
  })
  return keys.reduce((str, currentKey, index) => {
    return `${str}${index === 0 ? '' : ','}${currentKey}=${fieldMap.value[currentKey]}`
  }, '')
}

const getTimestamp = () => {
  return timestamp.value ? ` ${timestamp.value}` : ''
}

const getLineProtocol = () => {
  return `${measurement.value}${getTagPartStr()} ${getFieldPartStr()}${getTimestamp()}`
}

const updateModelValue = () => {
  emit('update:modelValue', getLineProtocol())
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
</script>

<style lang="scss">
.influx-db-line-protocol-form {
  .el-col:not(:last-child) {
    margin-bottom: 18px;
  }
}
</style>
