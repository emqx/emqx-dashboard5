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
      <el-row :gutter="24">
        <!-- DECODER -->
        <el-col :span="7">
          <el-form-item prop="payload_decoder.type" :label="tl('inputFormat')">
            <el-select v-model="(formData.payload_decoder as any).type">
              <el-option
                v-for="{ label, value } in formatOpts"
                :key="value"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="payload_decoder.schema" :label="tl('selectSchema')">
            <el-select v-model="(formData.payload_decoder as any).schema">
              <el-option v-for="{ name } in schemaOpts" :key="name" :value="name" :label="name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="payload_decoder.schema" label="Message Type">
            <el-input v-model="(formData.payload_decoder as any).message_type" />
          </el-form-item>
        </el-col>
        <!-- -----ENCODER----- -->
        <el-col :span="7">
          <el-form-item prop="payload_encoder.type" :label="tl('outputFormat')">
            <el-select v-model="(formData.payload_encoder as any).type">
              <el-option
                v-for="{ label, value } in formatOpts"
                :key="value"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="payload_encoder.schema" :label="tl('selectSchema')">
            <el-select v-model="(formData.payload_encoder as any).schema">
              <el-option v-for="{ name } in schemaOpts" :key="name" :value="name" :label="name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="payload_encoder.schema" label="Message Type">
            <el-input v-model="(formData.payload_encoder as any).message_type" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <div>
      <p class="part-header">{{ tl('messagePropsTransformation') }}</p>
      <p class="tip">{{ tl('propsTransDesc') }}</p>
      <el-row :gutter="24">
        <el-col :span="21">
          <el-form-item prop="operations">
            <OperationsTable v-model="formData.operations" :transformation-form="formData" />
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
import { customValidate } from '@/common/tools'
import {
  MESSAGE_TYPE_NONE,
  useFailureAction,
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
import {
  PropType,
  WritableComputedRef,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  ref,
  watch,
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

const formCom = ref()

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
          }
        }
        cb(error)
      },
      trigger: 'blur',
      required: true,
    },
  ],
}

const arrayItemRule = {}

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
  { value: SchemaRegistryType.Avro, label: 'Avro' },
  { value: SchemaRegistryType.JSON, label: 'JSON' },
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

const isDisabledDecodeType = (type: string | SchemaRegistryType) => {}
const isDisabledEncodeType = (type: string | SchemaRegistryType) => {}

const showSchemaTypeSelect = computed(() => {
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  const { payload_decoder, payload_encoder } = formData.value
  return [payload_decoder.type, payload_encoder.type].some(
    (type) => ![MESSAGE_TYPE_NONE, SchemaRegistryType.JSON].includes(type),
  )
})
watch(showSchemaTypeSelect, (nV, oV) => {
  if (oV && !nV && (formData.value?.payload_decoder as any)?.schema) {
    Reflect.deleteProperty(formData.value.payload_decoder as any, 'schema')
  }
})

const schemaType = computed(() => {
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  const { payload_decoder, payload_encoder } = formData.value
  return [payload_decoder.type, payload_encoder.type].find(
    (type) => ![MESSAGE_TYPE_NONE, SchemaRegistryType.JSON].includes(type),
  )
})

const getSchemaTypeList = (type: string) => {
  return schemasList.value.filter((item) => item.type === type)
}

const schemaOpts = computed(() => {
  if (!schemaType.value) {
    return []
  }
  return getSchemaTypeList(schemaType.value)
})

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
}
</style>
