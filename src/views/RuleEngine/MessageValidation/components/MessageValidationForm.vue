<template>
  <el-form
    class="message-validation-form"
    ref="formCom"
    label-position="top"
    require-asterisk-position="right"
    :model="formData"
    :rules="rules"
  >
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item prop="name" :label="tl('name')">
          <el-input v-model="formData.name" :disabled="isEdit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="topics" :label="tl('msgSourceTopic')">
          <ul class="topic-list">
            <!-- TODO: validate topic item -->
            <li class="topic-item" v-for="(item, $index) in formData.topics" :key="item">
              <el-input v-model="formData.topics[$index]" />
              <el-button class="btn-del" link @click="delTopic($index)">
                <el-icon :size="16"><Delete /></el-icon>
              </el-button>
            </li>
          </ul>
          <el-button
            class="btn-add"
            :icon="Plus"
            :disabled="!$hasPermission('post')"
            @click="addTopic"
          >
            {{ tl('addTopic') }}
          </el-button>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="description" :label="tl('note')">
          <el-input v-model="formData.description" />
        </el-form-item>
      </el-col>
    </el-row>
    <p class="part-header">{{ tl('verificationMethod') }}</p>
    <el-row :gutter="24">
      <el-col :span="18">
        <el-form-item prop="strategy" :label="tl('validationStrategy')">
          <el-radio-group v-model="formData.strategy">
            <el-radio
              v-for="{ label, value } in validationStrategyOpts"
              :key="value"
              :value="value"
              :label="value"
            >
              {{ label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item prop="checks" :label="tl('validationList')">
          <el-table class="key-and-value-editor shadow-none" :data="formData.checks">
            <!-- TODO: validate validator item -->
            <el-table-column class-name="column-type" :label="tl('type')">
              <template #default="{ $index }">
                <el-select v-model="formData.checks[$index].type">
                  <el-option
                    v-for="{ label, value } in validationItemTypeOpts"
                    :key="value"
                    :value="(value as any)"
                    :label="label"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="`${tl('schema')}/SQL`">
              <template #default="{ $index }">
                <div
                  class="select-wrap vertical-align-center"
                  v-if="
                    formData.checks[$index].type && isSchemaRegistry(formData.checks[$index].type)
                  "
                >
                  <el-select v-model="(formData.checks[$index] as any).schema">
                    <el-option
                      v-for="{ name } in getSchemaTypeList(formData.checks[$index].type)"
                      :key="name"
                      :value="name"
                      :label="name"
                    />
                  </el-select>
                  <el-tooltip :content="tl('createConnector')" placement="top">
                    <el-button
                      class="btn-add"
                      :icon="Plus"
                      :disabled="!$hasPermission('post')"
                      @click="addSchema($index)"
                    />
                  </el-tooltip>
                </div>
                <div v-else class="monaco-container">
                  <Monaco v-model="(formData.checks[$index] as any).sql" />
                </div>
              </template>
            </el-table-column>
            <el-table-column width="100">
              <template #header>
                <a href="javascript:;" class="btn" @click="addValidationItem">
                  {{ $t('Base.add') }}
                </a>
              </template>
              <template #default="{ $index }">
                <a href="javascript:;" class="btn" @click="deleteValidationItem($index)">
                  {{ $t('Base.delete') }}
                </a>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="failure_action" :label="tl('actionAfterFailure')">
          <el-select v-model="formData.failure_action">
            <el-option
              v-for="{ label, value } in failureActionOpts"
              :key="value"
              :value="value"
              :label="label"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" />
      <el-col :span="12">
        <el-form-item prop="log_failure.level" :label="t('MonitoringIntegration.logsLevel')">
          <el-select v-model="formData.log_failure!.level">
            <el-option
              v-for="{ label, value } in validationLogLevelOpts"
              :key="value"
              :value="value"
              :label="label"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <SchemaCreateDrawer
      v-model="showSchemaCreateDrawer"
      :type="currentSchemaType"
      @submitted="handleSchemaCreated"
    />
  </el-form>
</template>

<script setup lang="ts">
import { querySchemas } from '@/api/ruleengine'
import Monaco from '@/components/Monaco.vue'
import {
  useFailureAction,
  useValidationItemType,
  useValidationLogLevel,
  useValidationStrategy,
} from '@/hooks/Rule/validation/useValidation'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { FormRules } from '@/types/common'
import { SchemaRegistry } from '@/types/rule'
import type { MessageValidation, MessageValidationCheckItem } from '@/types/typeAlias'
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
import SchemaCreateDrawer from './SchemaCreateDrawer.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<MessageValidation>,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const formData: WritableComputedRef<MessageValidation> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('RuleEngine')
const { createRequiredRule, createIntFieldRule, createCommonIdRule } = useFormRules()

const formCom = ref()

const rules: FormRules = {
  name: [...createRequiredRule(tl('name'))],
  strategy: [...createRequiredRule(tl('validationStrategy'), 'select')],
  failure_action: [...createRequiredRule(tl('actionAfterFailure'), 'select')],
  topics: [
    {
      type: 'array',
      validator(rules: any, value: Array<string>, cb: (error?: Error) => void) {
        if (value.length === 0 || value.every((item: string) => !item)) {
          cb(new Error(tl('msgSourceTopicRequired')))
        } else {
          cb()
        }
      },
      trigger: 'blur',
      required: true,
    },
  ],
  checks: [
    {
      type: 'array',
      validator(rules: any, value: Array<MessageValidationCheckItem>, cb: (error?: Error) => void) {
        if (value.length === 0) {
          cb(new Error(tl('validationListRequired')))
        } else {
          cb()
        }
      },
      trigger: 'blur',
      required: true,
    },
  ],
}

const { validationStrategyOpts } = useValidationStrategy()
const { failureActionOpts } = useFailureAction()
const { validationLogLevelOpts } = useValidationLogLevel()
const { validationItemTypeOpts, isSchemaRegistry } = useValidationItemType()

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

const addValidationItem = () => {
  formData.value.checks.push({
    type: validationItemTypeOpts[0].value,
    schema: '',
  } as MessageValidationCheckItem)
}

const schemasList = ref<Array<SchemaRegistry>>([])
const querySchemasList = async () => {
  try {
    schemasList.value = await querySchemas()
  } catch (error) {
    //
  }
}
querySchemasList()
const getSchemaTypeList = (type: string) => {
  return schemasList.value.filter((item) => item.type === type)
}

const showSchemaCreateDrawer = ref(false)
const currentSchemaIndex = ref(-1)
const currentSchemaType = computed(() => formData.value.checks[currentSchemaIndex.value]?.type)
const addSchema = (index: number) => {
  currentSchemaIndex.value = index
  showSchemaCreateDrawer.value = true
}
const handleSchemaCreated = (schemaName: string) => {
  if (!formData.value.checks[currentSchemaIndex.value]) {
    return
  }
  ;(formData.value.checks[currentSchemaIndex.value] as any).schema = schemaName
  currentSchemaIndex.value = -1
}

const deleteValidationItem = (index: number) => {
  formData.value.checks.splice(index, 1)
}

const validate = async () => formCom.value.validate()

defineExpose({
  validate,
})
</script>

<style lang="scss">
.message-validation-form {
  .topic-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .topic-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    .el-button {
      margin-left: 12px;
    }
  }
  .select-wrap {
    .el-button {
      margin-left: 12px;
    }
  }
  .monaco-container {
    height: 100px;
  }
  .column-type.el-table__cell {
    vertical-align: top;
  }
  .el-table .el-button {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
