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
      <el-col :span="15">
        <el-form-item prop="name" :label="tl('name')">
          <el-input v-model="formData.name" :disabled="isEdit" />
        </el-form-item>
      </el-col>
      <el-col :span="15">
        <el-form-item prop="topics" :label="tl('msgSourceTopic')">
          <EditTopicList v-model="topics" prop="topics" :rules="arrayItemRule.topic" />
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
        <el-col :span="15">
          <el-form-item prop="strategy" :label="tl('validationStrategy')" class="label-right">
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
        <el-col :span="21">
          <el-form-item prop="checks" :label="tl('validationList')">
            <el-table class="key-and-value-editor shadow-none" :data="formData.checks">
              <el-table-column class-name="column-type" :label="tl('type')" :min-width="180">
                <template #default="{ $index }">
                  <el-select
                    v-model="formData.checks[$index].type"
                    @change="handleValidatorTypeChanged($event, $index)"
                  >
                    <el-option
                      v-for="{ label, value } in validationItemTypeOpts"
                      :key="value"
                      :value="value as any"
                      :label="label"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                class-name="column-value"
                :min-width="300"
                :label="`${tl('schema')}/SQL`"
              >
                <template #default="{ row, $index }">
                  <template v-if="row.type && isSchemaRegistry(row.type)">
                    <div class="space-between">
                      <el-form-item :prop="`checks.${$index}.schema`" :rules="arrayItemRule.schema">
                        <el-select v-model="(formData.checks[$index] as any).schema">
                          <el-option
                            v-for="{ name } in getSchemaTypeList(
                              formData.checks[$index].type as string,
                            )"
                            :key="name"
                            :value="name"
                            :label="name"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        v-if="formData.checks[$index].type === SchemaRegistryType.Protobuf"
                        :prop="`checks.${$index}.message_type`"
                        :rules="arrayItemRule.message_type"
                      >
                        <el-input
                          v-model="(formData.checks[$index] as any).message_type"
                          :placeholder="tl('messageType')"
                        />
                      </el-form-item>
                    </div>
                  </template>

                  <el-form-item v-else :prop="`checks.${$index}.sql`" :rules="arrayItemRule.sql">
                    <el-input
                      :modelValue="formatSQLInInput((formData.checks[$index] as any).sql)"
                      readonly
                      @click="editSQL($index)"
                    >
                      <template #suffix>
                        <el-button link type="primary" @click="editSQL($index)">
                          {{ !row.sql ? tl('setting') : tl('view') }}
                        </el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column width="120">
                <template #header>
                  <el-button link @click="addValidationItem" :disabled="!$hasPermission('post')">
                    {{ $t('Base.add') }}
                  </el-button>
                </template>
                <template #default="{ $index }">
                  <div class="space-between">
                    <el-button
                      class="btn-del"
                      :icon="Delete"
                      :disabled="!$hasPermission('delete')"
                      @click="deleteValidationItem($index)"
                    />
                    <template
                      v-if="
                        formData.checks[$index].type &&
                        isSchemaRegistry(formData.checks[$index].type)
                      "
                    >
                      <el-tooltip :content="t('components.schema-create')" placement="top">
                        <el-button
                          class="btn-add"
                          :icon="Plus"
                          :disabled="!$hasPermission('post')"
                          @click="addSchema($index)"
                        />
                      </el-tooltip>
                    </template>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <div>
      <p class="part-header">{{ tl('validationFailureOperation') }}</p>
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
                v-for="{ label, value } in validationLogLevelOpts"
                :key="value"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <SchemaCreateDrawer
      v-model="showSchemaCreateDrawer"
      :type="currentSchemaType"
      @submitted="handleSchemaCreated"
    />
    <SQLContentDialog
      v-model="showSQLContentDialog"
      :sql="currentSQL"
      :title="tl('pleaseEnterSQL')"
      @submit="handleSQLContentDialogSubmitted"
    />
  </el-form>
</template>

<script setup lang="ts">
import { querySchemas } from '@/api/ruleengine'
import {
  useValidationFailureAction,
  useValidationItemType,
  useValidationLogLevel,
  useValidationStrategy,
} from '@/hooks/Rule/validation/useValidation'

import { FormRules } from '@/types/common'
import { SchemaRegistryType } from '@/types/enum'
import { SchemaRegistry } from '@/types/rule'
import type { SchemaValidation, SchemaValidationCheckItem } from '@/types/typeAlias'
import { SchemaValidationLogLevel } from '@/types/typeAlias'
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
import SQLContentDialog from '../../components/SQLContentDialog.vue'
import SchemaCreateDrawer from './SchemaCreateDrawer.vue'
import EditTopicList from '@/components/EditTopicList.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<SchemaValidation>,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const formData: WritableComputedRef<SchemaValidation> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const outputLogs = computed({
  get() {
    return formData.value.log_failure?.level !== SchemaValidationLogLevel.none
  },
  set(val) {
    if (!formData.value.log_failure) {
      formData.value.log_failure = {}
    }
    formData.value.log_failure.level = val
      ? SchemaValidationLogLevel.warning
      : SchemaValidationLogLevel.none
  },
})

const { t, tl } = useI18nTl('RuleEngine')
const { createRequiredRule, createCommonIdRule } = useFormRules()

const formCom = ref()

const rules: FormRules = {
  name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
  strategy: [...createRequiredRule(tl('validationStrategy'), 'select')],
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
  checks: [
    {
      type: 'array',
      validator(rules: any, value: Array<SchemaValidationCheckItem>, cb: (error?: Error) => void) {
        if (Array.isArray(value) && value.length === 0) {
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

const arrayItemRule = {
  topic: createRequiredRule(t('Base.topic')),
  schema: createRequiredRule(tl('schema'), 'select'),
  sql: createRequiredRule('SQL'),
  message_type: createRequiredRule(tl('messageType')),
}

const topics = computed({
  get() {
    return Array.isArray(formData.value.topics) ? formData.value.topics : [formData.value.topics]
  },
  set(value) {
    formData.value.topics = value
  },
})

const { validationStrategyOpts } = useValidationStrategy()
const { failureActionOpts } = useValidationFailureAction()
const { validationLogLevelOpts: rawValidationLogLevelOpts } = useValidationLogLevel()
const validationLogLevelOpts = rawValidationLogLevelOpts.filter(
  (item) => item.value !== SchemaValidationLogLevel.none,
)
const { validationItemTypeOpts, isSchemaRegistry } = useValidationItemType()

const addValidationItem = () => {
  formData.value.checks.push({
    type: validationItemTypeOpts[0].value,
    schema: '',
  } as SchemaValidationCheckItem)
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

const showSQLContentDialog = ref(false)
const currentSQL = computed(() =>
  currentSchemaIndex.value >= 0
    ? (formData.value.checks[currentSchemaIndex.value] as any)?.sql || ''
    : '',
)
const editSQL = (index: number) => {
  currentSchemaIndex.value = index
  showSQLContentDialog.value = true
}
const handleSQLContentDialogSubmitted = (sql: string) => {
  if (!formData.value.checks[currentSchemaIndex.value]) {
    return
  }
  ;(formData.value.checks[currentSchemaIndex.value] as any).sql = sql
  currentSchemaIndex.value = -1
}
const formatSQLInInput = (sql: string) => sql.replace(/\n/g, ' ')

const deleteValidationItem = (index: number) => {
  formData.value.checks.splice(index, 1)
}

const handleValidatorTypeChanged = (value: string, validatorIndex: number) => {
  const target: any = formData.value.checks[validatorIndex]
  target[isSchemaRegistry(value) ? 'schema' : 'sql'] = ''
  Reflect.deleteProperty(target, isSchemaRegistry(value) ? 'sql' : 'schema')
  if (value !== SchemaRegistryType.Protobuf) {
    Reflect.deleteProperty(target, 'message_type')
  }
}

const validate = async () => formCom.value.validate()

defineExpose({
  validate,
})
</script>

<style lang="scss">
.message-validation-form {
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
