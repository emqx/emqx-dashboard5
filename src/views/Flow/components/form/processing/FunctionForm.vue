<template>
  <div class="function-form">
    <template v-if="record.editedWay === EditedWay.Form">
      <el-table
        :data="record.form"
        style="width: 100%"
        row-key="id"
        :expand-row-keys="expandRowKeys"
      >
        <el-table-column type="expand" width="1">
          <template #default="{ $index }">
            <FunctionParamsColumnContent
              v-model="record.form[$index]"
              v-bind="columnContentProps"
              :ref="(el) => setFormCom(el, $index)"
              @vue:before-unmount="delFormCom($index)"
            />
          </template>
        </el-table-column>
        <el-table-column :label="t('components.field')" prop="field" width="150">
          <template #default="{ $index }">
            <FunctionFieldColumnContent
              v-model="record.form[$index]"
              v-bind="columnContentProps"
              :error="getErrorMsg($index, 'field')"
              @blur="validateItem($index, 'field')"
            />
          </template>
        </el-table-column>
        <el-table-column :label="t('Flow.transform')" prop="func.name">
          <template #default="{ $index }">
            <FunctionFuncColumnContent v-model="record.form[$index]" v-bind="columnContentProps" />
          </template>
        </el-table-column>
        <el-table-column :label="t('Flow.alias')" prop="alias" width="150">
          <template #default="{ $index }">
            <CustomFormItem
              prop="alias"
              class="item-alias"
              :readonly="readonly"
              :error="getErrorMsg($index, 'alias')"
            >
              <el-input
                v-model="record.form[$index].alias"
                :placeholder="t('Flow.alias')"
                @blur="validateItem($index, 'alias')"
              />
            </CustomFormItem>
          </template>
        </el-table-column>
        <el-table-column v-if="!readonly" :label="t('Auth.action')" width="80">
          <template #default="{ $index }">
            <el-button
              link
              class="btn-del"
              :disabled="record.form.length < 2"
              @click="deleteItem($index)"
            >
              <el-icon :size="16" class="icon-del"><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button v-if="!readonly" link type="primary" :icon="Plus" @click="addItem">
        {{ tl('add') }}
      </el-button>
    </template>

    <el-form
      v-else
      ref="FormCom"
      class="message-form"
      hide-required-asterisk
      :rules="rules"
      :model="record"
      :validate-on-rule-change="false"
    >
      <el-form-item prop="sql">
        <div class="monaco-container">
          <Monaco
            :id="createRandomString()"
            lang="sql"
            v-model="record.sql"
            :disabled="readonly"
            @blur="transformToFormFromSql"
          />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import CustomFormItem from '@/components/CustomFormItem.vue'
import Monaco from '@/components/Monaco.vue'
import { EditedWay, FunctionForm, SourceType } from '@/hooks/Flow/useFlowNode'
import useGenerateFlowDataUtils from '@/hooks/Flow/useGenerateFlowDataUtils'
import useHandleFlowDataUtils from '@/hooks/Flow/useHandleFlowDataUtils'
import { createFunctionItem } from '@/hooks/Flow/useNodeForm'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useI18nTl from '@/hooks/useI18nTl'
import useRuleFunc from '@/hooks/useRuleFunc'
import { RuleEvent } from '@/types/rule'
import { Delete, Plus } from '@element-plus/icons-vue'
import { Node } from '@vue-flow/core'
import type { Rules, ValidateError } from 'async-validator'
import Schema from 'async-validator'
import { get, isFunction, set } from 'lodash'
import {
  ComputedRef,
  PropType,
  Ref,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  ref,
  watch,
} from 'vue'
import FunctionFieldColumnContent from './FunctionFieldColumnContent.vue'
import FunctionFuncColumnContent from './FunctionFuncColumnContent.vue'
import FunctionParamsColumnContent from './FunctionParamsColumnContent.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<FunctionForm>,
    default: () => ({ form: [] }),
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  sourceNodes: {
    type: Array as PropType<Array<Node>>,
  },
})

const getSource = (node: Node) => {
  const {
    data: { specificType, formData },
  } = node
  switch (specificType) {
    case SourceType.Message:
      return TOPIC_EVENT
    case SourceType.Event:
      return formData.event
  }
  console.error('cannot find source')
}
const addedSources: ComputedRef<Array<string>> = computed(() => {
  return props.sourceNodes?.map(getSource).filter(Boolean) || []
})

const { getEventList } = useRuleEvents()
const eventList: Ref<Array<RuleEvent>> = ref([])
;(async () => (eventList.value = await getEventList()))()
const getSourceFields = (source: string) => {
  const event = eventList.value.find(({ event }) => event === source)
  return event?.columns || []
}

const availableFields: ComputedRef<Array<string>> = computed(() => {
  return addedSources.value.reduce((arr: Array<string>, source) => {
    return [...arr, ...getSourceFields(source)]
  }, [])
})

const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('Base')

const { getFuncExpressionFromFuncList } = useHandleFlowDataUtils()
const { generateFunctionFormFromExpression } = useGenerateFlowDataUtils()

const FormCom = ref()
const FormComArr: Array<any> = []
const setFormCom = (form: any, index: number) => {
  FormComArr[index] = form
}
const delFormCom = (index: number) => {
  FormComArr.splice(index, 1)
}

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const addItem = () => {
  record.value.form.push(createFunctionItem())
}

const deleteItem = (index: number) => {
  record.value.form.splice(index, 1)
}

const { getFuncItemByName } = useRuleFunc()
const expandRowKeys = computed(() => {
  return record.value.form
    .filter(({ func }) => {
      const funcItem = func.name ? getFuncItemByName(func.name) : null
      return funcItem?.args?.length && funcItem.args.length > 1
    })
    .map(({ id }) => id)
})
const columnContentProps = computed(() => ({
  readonly: props.readonly,
  availableFields: availableFields.value,
}))

const rules: Rules = {
  field: {
    validator: (rule: unknown, value: string, callback: unknown, source: any) => {
      const errors = []
      if (!value) {
        errors.push(new Error(t('Rule.inputFieldRequiredError', { name: t('components.field') })))
      } else if (source.func.args.length && !source.func.args.includes(value)) {
        errors.push(new Error(t('Flow.unusedField')))
      }
      return errors
    },
  },
  alias: {
    validator: (rule: unknown, value: string, callback: unknown, source: any) => {
      const errors = []
      if (source.func.name && !value) {
        errors.push(new Error(t('Flow.aliasRequired')))
      }
      return errors
    },
  },
}
const errorMsgMap = ref<Record<string, Record<string, string>>>({})
const getErrorMsg = (index: number, field: string) => get(errorMsgMap.value, `${index}.${field}`)
const updateErrorMsg = (errorArr: Array<Array<ValidateError> | null>) => {
  errorArr.forEach((error, index) => {
    if (error) {
      errorMsgMap.value[index.toString()] = error.reduce(
        (map: Record<string, string>, { field, message }) => {
          if (field) {
            map[field] = message?.toString() ?? ''
          }
          return map
        },
        {},
      )
    }
  })
}
const customValidate = async () => {
  return new Promise((resolve, reject) => {
    const validator = new Schema(rules)
    errorMsgMap.value = {}
    const errorArr: Array<Array<ValidateError> | null> = []
    record.value.form.forEach((item) => validator.validate(item, (error) => errorArr.push(error)))
    updateErrorMsg(errorArr)
    errorArr.some(Boolean) ? reject() : resolve(undefined)
  })
}
const validateItem = async (index: number, field: string) => {
  await waitAMoment()
  const validator = new Schema({ [field]: rules[field] })
  validator.validate(record.value.form[index], (errors) => {
    set(errorMsgMap.value, `${index}.${field}`, errors ? (errors[0].message ?? '') : '')
  })
}

const validate = () => {
  if (record.value.editedWay === EditedWay.Form) {
    return Promise.all([
      customValidate(),
      ...FormComArr.map((item) => {
        if (item.validate && isFunction(item.validate)) {
          return item.validate()
        }
        return Promise.resolve()
      }),
    ])
  } else {
    return FormCom.value.validate()
  }
}

const transformToSqlFormForm = () => {
  record.value.sql = getFuncExpressionFromFuncList(record.value.form) || ''
}

const transformToFormFromSql = () => {
  const defaultForm = [createFunctionItem()]
  if (trimSpacesAndLFs(record.value.sql) === DEFAULT_SELECT) {
    record.value.form = defaultForm
  } else {
    const form = generateFunctionFormFromExpression(record.value.sql)
    record.value.form = form?.length ? form : defaultForm
  }
}

watch(
  () => props.modelValue?.editedWay,
  (val) => {
    if (val === EditedWay.SQL) {
      transformToSqlFormForm()
    } else {
      transformToFormFromSql()
    }
  },
)

defineExpose({ validate })
</script>

<style lang="scss">
@use 'sass:math';
.function-form {
  .el-table .el-table__expand-icon {
    display: none;
  }
  .el-table__expanded-cell {
    background: var(--color-bg-split);
    .el-form-item__label {
      padding-right: 16px;
    }
  }
  .el-table__cell {
    .cell {
      overflow: visible;
    }
    .el-form-item {
      &:not(:last-child) {
        margin-bottom: 12px;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-form-item__content > .value {
      padding-left: 0;
    }
  }
  .form-item-param {
    // alias column width + last column width + padding right
    margin-right: 150px + 80px + 16px;
    .el-form-item__content {
      margin-left: 16px;
    }
  }
  .el-table {
    margin-bottom: 16px;
  }
}
</style>
