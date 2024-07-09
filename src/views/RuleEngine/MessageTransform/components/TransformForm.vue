<template>
  <el-form
    class="message-transform-form"
    ref="formCom"
    label-position="top"
    require-asterisk-position="right"
    :model="formData"
    :rules="rules"
  >
    <el-row :gutter="24">
      <el-col :span="15">
        <el-form-item prop="name" :label="tl('name')">
          <el-input v-model="formData.name" :disabled="isEdit" />
        </el-form-item>
      </el-col>
      <el-col :span="15">
        <el-form-item prop="topics" :label="tl('msgSourceTopic')">
          <ul class="topic-list">
            <li class="topic-item" v-for="(item, $index) in formData.topics" :key="$index">
              <el-form-item :prop="`topics.${$index}`" :rules="arrayItemRule.topic">
                <el-input v-model="formData.topics[$index]" />
                <div class="btn-container vertical-align-center">
                  <el-button
                    class="btn-del"
                    :icon="Delete"
                    :disabled="formData.topics.length <= 1 || !$hasPermission('delete')"
                    @click="delTopic($index)"
                  />
                  <el-button
                    v-if="$index === formData.topics.length - 1"
                    class="btn-add"
                    :icon="Plus"
                    :disabled="!$hasPermission('post')"
                    @click="addTopic"
                  />
                </div>
              </el-form-item>
            </li>
          </ul>
        </el-form-item>
      </el-col>
      <el-col :span="15">
        <el-form-item prop="description" :label="tl('note')">
          <el-input v-model="formData.description" />
        </el-form-item>
      </el-col>
    </el-row>
    <div>
      <p class="part-header">{{ tl('messageFormatTransformation') }}</p>
      <p class="tip">{{ tl('formatTransDesc') }}</p>
      <el-row>
        <el-col :span="20">
          <el-row :gutter="24" class="row-formats">
            <!-- ------- DECODER ------- -->
            <el-col :span="12">
              <el-form-item prop="payload_decoder.type" :label="tl('inputFormat')">
                <el-select
                  v-model="(formData.payload_decoder as any).type"
                  @change="handleDecoderTypeChanged(formData.payload_decoder)"
                >
                  <el-option
                    v-for="{ label, value } in formatOpts"
                    :key="value"
                    :value="value"
                    :label="label"
                  />
                </el-select>
              </el-form-item>
              <div
                class="space-between schema-select-container"
                v-if="showSchemaSelect(formData.payload_decoder.type)"
              >
                <el-form-item
                  prop="payload_decoder.schema"
                  :label="`${getSchemaTypeLabel(formData.payload_decoder.type)} Schema`"
                >
                  <el-select v-model="(formData.payload_decoder as any).schema">
                    <el-option
                      v-for="{ name } in getSchemaTypeList(formData.payload_decoder.type)"
                      :key="name"
                      :value="name"
                      :label="name"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  prop="payload_decoder.message_type"
                  v-if="showMessageTypeSelect(formData.payload_decoder.type)"
                >
                  <el-input
                    v-model="(formData.payload_decoder as any).message_type"
                    :placeholder="tl('messageType')"
                  />
                </el-form-item>
              </div>
            </el-col>
            <!-- ------- ENCODER ------- -->
            <el-col :span="12">
              <el-form-item prop="payload_encoder.type" :label="tl('outputFormat')">
                <el-select
                  v-model="(formData.payload_encoder as any).type"
                  @change="handleTypeChanged(formData.payload_encoder)"
                >
                  <el-option
                    v-for="{ label, value } in formatOpts"
                    :key="value"
                    :value="value"
                    :label="label"
                    :disabled="isDisabledEncodeType(value)"
                  />
                </el-select>
              </el-form-item>
              <div
                class="space-between schema-select-container"
                v-if="showSchemaSelect(formData.payload_encoder.type)"
              >
                <el-form-item
                  prop="payload_encoder.schema"
                  :label="`${getSchemaTypeLabel(formData.payload_encoder.type)} Schema`"
                >
                  <el-select v-model="(formData.payload_encoder as any).schema">
                    <el-option
                      v-for="{ name } in getSchemaTypeList(formData.payload_encoder.type)"
                      :key="name"
                      :value="name"
                      :label="name"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  prop="payload_encoder.message_type"
                  v-if="showMessageTypeSelect(formData.payload_encoder.type)"
                >
                  <el-input
                    v-model="(formData.payload_encoder as any).message_type"
                    :placeholder="tl('messageType')"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div>
      <p class="part-header">{{ tl('messagePropsTransformation') }}</p>
      <p class="tip">{{ tl('propsTransDesc') }}</p>
      <el-row :gutter="24">
        <el-col :span="21">
          <el-form-item prop="operations" ref="OperationsFormItemRef">
            <OperationsTable
              v-model="formData.operations"
              :transformation-form="formData"
              @blur="validateOperations"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <div>
      <p class="part-header">{{ tl('transformationFailureOperation') }}</p>
      <el-row :gutter="24">
        <el-col :span="15">
          <el-form-item prop="failure_action" :label="tl('actionAfterFailure')" class="label-right">
            <el-radio-group v-model="formData.failure_action">
              <el-radio
                v-for="{ label, value } in failureActionOpts"
                :key="value"
                :value="value"
                :label="value"
              >
                {{ label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item :label="tl('outputLogs')" class="label-right">
            <el-switch v-model="outputLogs" />
          </el-form-item>
        </el-col>
        <el-col :span="15" v-if="outputLogs">
          <el-form-item prop="log_failure.level" :label="t('MonitoringIntegration.logsLevel')">
            <el-select v-model="formData.log_failure!.level">
              <el-option
                v-for="{ label, value } in messageTransformLogLevelOpts"
                :key="value"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { querySchemas } from '@/api/ruleengine'
import { customValidate, getLabelFromValueInOptionList } from '@/common/tools'
import {
  AvailableKey,
  MESSAGE_TYPE_NONE,
  useFailureAction,
  useMessageTransformForm,
  useMessageTransformLogLevel,
} from '@/hooks/Rule/transform/useMessageTransform'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { FormRules } from '@/types/common'
import { SchemaRegistryType } from '@/types/enum'
import { SchemaRegistry } from '@/types/rule'
import type { MessageTransform } from '@/types/typeAlias'
import { MessageTransformLogLevel } from '@/types/typeAlias'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  PropType,
  WritableComputedRef,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  nextTick,
  ref,
} from 'vue'
import OperationsTable from './OperationsTable.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<MessageTransform>,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const formData: WritableComputedRef<MessageTransform> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const outputLogs = computed({
  get() {
    return formData.value.log_failure?.level !== MessageTransformLogLevel.none
  },
  set(val) {
    if (!formData.value.log_failure) {
      formData.value.log_failure = {}
    }
    formData.value.log_failure.level = val
      ? MessageTransformLogLevel.warning
      : MessageTransformLogLevel.none
  },
})

const { t, tl } = useI18nTl('RuleEngine')
const { createRequiredRule, createCommonIdRule } = useFormRules()

/**
 * They both have some magical limitations, so declare the variables
 */
const specialTypeBrothers = [SchemaRegistryType.Avro, SchemaRegistryType.Protobuf]

const formCom = ref()

const withSetPayloadDirectly = (arr: Array<{ key: string; value: string }>) => {
  return arr.some(({ key }) => key === AvailableKey.Payload)
}
const payloadSubReg = new RegExp(`^${AvailableKey.Payload}\\.(\\w|-)+`)
const withSetPayloadSub = (arr: Array<{ key: string; value: string }>) => {
  return arr.some(({ key }) => payloadSubReg.test(key))
}

const userPropSubReg = new RegExp(`^${AvailableKey.UserProperty}\\.(\\w|-)+`)
const detectSetMultiLevelUserProperty = (arr: Array<{ key: string; value: string }>) => {
  return arr.some(({ key }) => userPropSubReg.test(key) && key.split('.').length > 2)
}

const { detectCanSetToPayload, detectCanSetToPayloadSub } = useMessageTransformForm()
const rules: FormRules = {
  name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
  failure_action: [...createRequiredRule(tl('actionAfterFailure'), 'select')],
  topics: [
    {
      type: 'array',
      validator(rules: any, value: Array<string>, cb: (error?: Error) => void) {
        if (Array.isArray(value) && value.length === 0) {
          cb(new Error(tl('msgSourceTopicRequired')))
        } else {
          cb()
        }
      },
      trigger: 'blur',
      required: true,
    },
  ],
  'payload_decoder.type': createRequiredRule(tl('inputFormat'), 'select'),
  'payload_decoder.schema': createRequiredRule('Schema', 'select'),
  'payload_decoder.message_type': createRequiredRule(tl('messageType')),
  'payload_encoder.type': createRequiredRule(tl('outputFormat'), 'select'),
  'payload_encoder.schema': createRequiredRule('Schema', 'select'),
  'payload_encoder.message_type': createRequiredRule(tl('messageType')),
  operations: [
    {
      type: 'array',
      validator(rules: any, value: Array<any>, cb: (error?: Error) => void) {
        const {
          payload_decoder: { type: decoderType } = {},
          payload_encoder: { type: encoderType } = {},
        } = formData.value
        const doNotNeedOperations =
          (decoderType === SchemaRegistryType.JSON &&
            [SchemaRegistryType.Avro, SchemaRegistryType.Protobuf].includes(
              encoderType as SchemaRegistryType,
            )) ||
          (encoderType === SchemaRegistryType.JSON &&
            [SchemaRegistryType.Avro, SchemaRegistryType.Protobuf].includes(
              decoderType as SchemaRegistryType,
            ))
        let error = undefined
        if (!doNotNeedOperations && Array.isArray(value) && value.length === 0) {
          error = new Error(tl('operationsListRequired'))
        } else if (Array.isArray(value)) {
          if (value.some(({ key, value }) => !key || !value)) {
            error = new Error(tl('operationFillRequired'))
          } else if ([...new Set(value.map(({ key }) => key))].length < value.length) {
            error = new Error(tl('operationKeyRepeat'))
          } else if (
            withSetPayloadDirectly(value) &&
            !detectCanSetToPayload(decoderType, encoderType)
          ) {
            error = new Error(tl('canNotSetPayloadTip'))
          } else if (
            withSetPayloadSub(value) &&
            !detectCanSetToPayloadSub(decoderType, encoderType)
          ) {
            error = new Error(tl('canNotSetPayloadSubTip'))
          } else if (detectSetMultiLevelUserProperty(value)) {
            error = new Error(tl('canNotSetMultiLevelUserProperty'))
          }
        }
        cb(error)
      },
      trigger: 'blur',
    },
  ],
}

const arrayItemRule = { topic: createRequiredRule(t('Base.topic')) }

const { failureActionOpts } = useFailureAction()
const { messageTransformLogLevelOpts: rawMessageTransformLogLevelOpts } =
  useMessageTransformLogLevel()
const messageTransformLogLevelOpts = rawMessageTransformLogLevelOpts.filter(
  (item) => item.value !== MessageTransformLogLevel.none,
)

const delTopic = (index: number) => {
  if (Array.isArray(formData.value.topics)) {
    formData.value.topics.splice(index, 1)
  } else {
    throw new Error('topics is not an array')
  }
}
const addTopic = () => {
  if (Array.isArray(formData.value.topics)) {
    formData.value.topics.push('')
  } else {
    throw new Error('topics is not an array')
  }
}

const formatOpts = [
  { value: MESSAGE_TYPE_NONE, label: t('Base.none') },
  { value: SchemaRegistryType.JSON, label: 'JSON' },
  { value: SchemaRegistryType.Avro, label: 'Avro' },
  { value: SchemaRegistryType.Protobuf, label: 'Protobuf' },
]
const schemasList = ref<Array<SchemaRegistry>>([])
const querySchemasList = async () => {
  try {
    schemasList.value = await querySchemas()
  } catch (error) {
    //
  }
}
querySchemasList()

const getSchemaTypeLabel = (type: string) => {
  return getLabelFromValueInOptionList(type, formatOpts)
}

const showSchemaSelect = (type: string | SchemaRegistryType) =>
  type && ![MESSAGE_TYPE_NONE, SchemaRegistryType.JSON].includes(type)
const showMessageTypeSelect = (type: string | SchemaRegistryType) =>
  type === SchemaRegistryType.Protobuf

/**
|                     | none (to encoder) | json | arvo | protobuf |
| ------------------- | ----------------- | --- | --- | --- |
| none (from decoder) | ✔︎                 | ✔︎   | ✘   | ✘   |
| json                | ✔︎                 | ✔︎   | ✔︎   | ✔︎   |
| arvo                | ✘                 | ✔︎   | ✔︎   | ✔︎   |
| protobuf            | ✘                 | ✔︎   | ✔︎   | ✔︎   |
 */
const isDisabledEncodeType = (type: string | SchemaRegistryType) => {
  const { payload_decoder: { type: decoderType } = {} } = formData.value
  return (
    (decoderType === MESSAGE_TYPE_NONE &&
      specialTypeBrothers.includes(type as SchemaRegistryType)) ||
    (specialTypeBrothers.includes(decoderType as SchemaRegistryType) && type === MESSAGE_TYPE_NONE)
  )
}

const getSchemaTypeList = (type: string) => {
  if (!showSchemaSelect(type)) {
    return []
  }
  return schemasList.value.filter((item) => item.type === type)
}

const handleTypeChanged = (data: MessageTransform['payload_decoder']) => {
  data.schema = ''
  if (!showSchemaSelect(data.type)) {
    Reflect.deleteProperty(data, 'schema')
    Reflect.deleteProperty(data, 'message_type')
  } else if (!showMessageTypeSelect(data.type)) {
    Reflect.deleteProperty(data, 'message_type')
  }
}

const handleDecoderTypeChanged = (data: MessageTransform['payload_decoder']) => {
  handleTypeChanged(data)
  const { payload_encoder: { type: encoderType } = {} } = formData.value
  if (encoderType && isDisabledEncodeType(encoderType)) {
    ElMessage.warning(tl('noSupportTransformationWarning'))
    formData.value.payload_encoder = { type: SchemaRegistryType.JSON }
  }
}

const OperationsFormItemRef = ref()
const validateOperations = async () => {
  await nextTick()
  if (OperationsFormItemRef.value.validateState === 'error') {
    formCom.value.validateField('operations')
  }
}

const validate = async () => customValidate(formCom.value)

defineExpose({
  validate,
})
</script>

<style lang="scss">
.message-transform-form {
  .topic-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .topic-item {
    margin-bottom: 12px;
    .el-form-item {
      width: 100%;
    }
    .el-form-item__content {
      position: relative;
    }
    .el-button {
      margin-left: 12px;
    }
  }
  .btn-container {
    position: absolute;
    top: 0;
    right: -12px;
    transform: translateX(100%);
  }
  .part-header + .tip {
    margin-bottom: 20px;
  }
  .column-type.el-table__cell {
    vertical-align: top;
  }
  .column-value .cell {
    overflow: visible;
  }
  .column-value {
    .el-form-item {
      flex-grow: 1;
      &:not(:last-child) {
        margin-right: 12px;
      }
    }
  }
  .el-table .el-button {
    margin-top: 0;
    margin-bottom: 0;
  }
  .btn-del,
  .btn-add {
    padding-left: 8px;
    padding-right: 8px;
  }
  .label-right {
    display: flex;
  }
  .el-form-item.label-right .el-form-item__label {
    margin-bottom: 0;
    line-height: 32px;
    padding-right: 12px;
  }
  .row-formats {
    > .el-col:not(:last-child) {
      position: relative;
      &::after {
        position: absolute;
        top: 30px;
        right: 0;
        content: '';
        display: block;
        width: 1px;
        height: calc(100% - 30px - 18px);
        background-color: #ebeef5;
        margin-left: 24px;
      }
    }
  }
  .schema-select-container {
    align-items: flex-end;
    .el-form-item {
      flex-grow: 1;
      &:not(:last-child) {
        margin-right: 12px;
      }
    }
  }
}
</style>
