<template>
  <el-row class="influx-db-line-protocol-form" :gutter="26">
    <el-col :span="12">
      <CustomFormItem
        label="Measurement"
        class="is-required"
        :error="measurementErrorMsg"
        :readonly="readonly"
      >
        <InputWithPlaceholderSelect
          v-model="measurement"
          @change="updateModelValue"
          @blur="validateItemWhenBlur('measurement')"
        />
      </CustomFormItem>
    </el-col>
    <el-col :span="12">
      <CustomFormItem :readonly="readonly">
        <template #label>
          <FormItemLabel label="Timestamp" :desc="tl('timestampDesc', { database })" desc-marked />
        </template>
        <InputWithPlaceholderSelect v-model="timestamp" @change="updateModelValue" />
      </CustomFormItem>
    </el-col>
    <el-col :span="24">
      <el-form-item class="is-required" :error="fieldsErrorMsg">
        <template #label>
          <FormItemLabel
            label="Fields"
            :desc="
              tl(
                type === BridgeType.InfluxDB
                  ? 'influxdbFieldValueDesc'
                  : 'datalayersFieldValueDesc',
              )
            "
            desc-marked
          />
        </template>
        <InfluxdbFieldsEditor
          :model-value="fieldMap"
          @update:model-value="handleFieldMapChanged"
          @add="fieldsErrorMsg = ''"
          :readonly="readonly"
          :type="type"
        />
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="Tags">
        <KeyAndValueEditor
          :model-value="tagMap"
          :readonly="readonly"
          :disabled="disabled"
          :support-placeholder="['key', 'value']"
          @update:model-value="handleTabMapChanged"
        />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script lang="ts">
export default defineComponent({
  name: 'InfluxDBLineProtocolForm',
})
</script>

<script setup lang="ts">
import { BridgeType } from '@/types/enum'
import InfluxdbFieldsEditor from './InfluxdbFieldsEditor.vue'

// TODO:the best implementation is bi-bind model value in time, maybe sometime can refactor

// ❗️do not bi-bind model value now, parent component need to get model value manually

const props = defineProps({
  modelValue: {
    type: String,
  },
  readonly: {
    type: Boolean,
  },
  disabled: {
    type: Boolean,
  },
  type: {
    type: String as PropType<BridgeType>,
    default: BridgeType.InfluxDB,
  },
})

const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('RuleEngine')

const measurement = ref('')
const timestamp: Ref<undefined | string> = ref(undefined)
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

const validateItemWhenBlur = (fieldName: 'measurement' | 'fields') => {
  if (fieldName === 'measurement') {
    measurementErrorMsg.value = !measurement.value
      ? t('Rule.inputFieldRequiredError', { name: 'Measurement' })
      : ''
  } else if (fieldName === 'fields') {
    fieldsErrorMsg.value = ''
    if (
      Object.keys(fieldMap.value).filter((key) => {
        const value = fieldMap.value[key]
        return key !== '' && value !== '' && value !== undefined
      }).length === 0
    ) {
      fieldsErrorMsg.value = t('Rule.inputFieldRequiredError', { name: 'Field set' })
    }
  }
}

const validate = () => {
  validateItemWhenBlur('measurement')
  validateItemWhenBlur('fields')
  return measurementErrorMsg.value || fieldsErrorMsg.value ? Promise.reject() : Promise.resolve()
}

const clearValidate = () => {
  measurementErrorMsg.value = ''
  fieldsErrorMsg.value = ''
}

const { getBridgeLabelByTypeValue } = useBridgeTypeValue()
const database = computed(() => getBridgeLabelByTypeValue(props.type) ?? '')

defineExpose({ validate, clearValidate })

watch(() => props.modelValue, fillFormFromLineProtocol)

fillFormFromLineProtocol()
</script>

<style lang="scss">
.influx-db-line-protocol-form {
  .el-col:not(:last-child) {
    margin-bottom: 18px;
  }
  .el-form-item {
    display: block;
  }
  .el-form-item__label {
    justify-content: flex-start;
  }
  .el-col {
    .el-form-item {
      .el-form-item__content {
        > .el-input:not(.el-input-group--append) {
          width: 100%;
        }
      }
    }
  }
}
</style>
