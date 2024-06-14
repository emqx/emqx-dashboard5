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
      <p class="part-header">{{ tl('verificationMethod') }}</p>
      <el-row :gutter="24">
        <el-col :span="21"> </el-col>
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
import {
  useFailureAction,
  useMessageTransformLogLevel,
} from '@/hooks/Rule/transform/useMessageTransform'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { FormRules } from '@/types/common'
import type { MessageTransform, MessageTransformOperation } from '@/types/typeAlias'
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
} from 'vue'

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

const addOperationItem = () => {
  formData.value.operations.push({ key: '', value: '' })
}

const validate = async () => formCom.value.validate()

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
