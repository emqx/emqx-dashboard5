<template>
  <el-form
    ref="FormCom"
    class="function-block"
    label-position="right"
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
    :hide-required-asterisk="readonly"
  >
    <el-row :gutter="12" class="row-select">
      <el-col :span="7">
        <CustomFormItem :readonly="readonly" prop="field">
          <el-autocomplete
            v-model="record.field"
            :fetch-suggestions="getFieldList"
            :placeholder="t('components.field')"
            clearable
            class="common-fields"
            popper-class="is-wider"
            @change="handleFieldChanged"
            @select="handleFieldChanged($event.value)"
          />
        </CustomFormItem>
      </el-col>
      <el-col :span="10">
        <CustomFormItem :readonly="readonly" prop="func.name">
          <el-cascader
            v-model="record.func.name"
            filterable
            class="select-func"
            :show-all-levels="false"
            :options="(funcOptList as any)"
            :props="cascaderProps"
            :placeholder="t('Flow.transform')"
            @change="handleSelectFunc"
          />
        </CustomFormItem>
      </el-col>
      <el-col :span="1" class="col-as">as</el-col>
      <el-col :span="6">
        <CustomFormItem :readonly="readonly" prop="alias" class="item-alias">
          <el-input v-model="record.alias" :placeholder="t('Flow.alias')" />
        </CustomFormItem>
      </el-col>
    </el-row>
    <div class="args-block" v-if="showArgsBlock">
      <CustomFormItem
        v-for="(item, $index) in args"
        :prop="`func.args.${$index}`"
        :key="`${record.func.name}-${item.name}`"
      >
        <el-row :gutter="12" class="row-para">
          <el-col :span="7" class="col-para-label">
            <label>{{ tl(item.name) }}</label>
          </el-col>
          <el-col :span="10">
            <template v-if="!readonly">
              <el-select
                v-if="item.type === ArgumentType.Enum"
                clearable
                filterable
                allow-create
                v-model="record.func.args[$index]"
                @change="handleSelectFunc"
              >
                <el-option
                  v-for="value in item.optionalValues"
                  :key="value"
                  :label="value"
                  :value="value"
                />
              </el-select>
              <el-input
                v-else
                v-model="record.func.args[$index]"
                @change="handleArgChanged($event, $index, item.type)"
              />
            </template>
            <p class="value" v-else>{{ record.func.args[$index] }}</p>
          </el-col>
        </el-row>
      </CustomFormItem>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import CustomFormItem from '@/components/CustomFormItem.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import useRuleFunc, { ArgumentType, FuncItem } from '@/hooks/useRuleFunc'
import { FormRules } from '@/types/common'
import { PropType, computed, defineEmits, defineExpose, defineProps, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  availableFields: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('Function')

const { funcOptList, getFuncItemByName, getFuncGroupByName, getArgIndex } = useRuleFunc()
const cascaderProps = { value: 'name', label: 'name', children: 'list', emitPath: false }

const FormCom = ref()

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const fillParams = (
  field: string,
  { groupLabel, func }: { groupLabel: string; func: FuncItem },
) => {
  let targetIndex = getArgIndex(func, groupLabel)
  return func.args.map((_, index) => (index === targetIndex ? field : ''))
}

const selectedFunc = computed(() => {
  const funcName = record.value?.func?.name
  return funcName ? getFuncItemByName(funcName) : null
})

const args = computed(() => (selectedFunc.value ? selectedFunc.value.args : []))

const showArgsBlock = computed(() => {
  return !(args.value.length === 0 || (args.value.length === 1 && args.value[0].required))
})

const handleSelectFunc = (funcName: string) => {
  if (!funcName) {
    record.value.func.args = []
    return
  }
  const groupLabel = getFuncGroupByName(funcName)
  if (!groupLabel || !selectedFunc.value) {
    return
  }
  if (showArgsBlock.value) {
    record.value.func.args = fillParams(record.value.field, {
      groupLabel,
      func: selectedFunc.value,
    })
  } else {
    record.value.func.args = [record.value.field]
  }
}

const totalList = computed(() => props.availableFields.map((value) => ({ value })))
const getFieldList = (queryString: string, cb: any) => {
  if (!queryString) {
    cb(totalList.value)
  }
  const ret = totalList.value.filter(({ value }) => value.includes(queryString))
  cb(ret)
}

const handleFieldChanged = (val: string) => {
  if (args.value.length && !showArgsBlock.value) {
    record.value.func.args = [val]
  }
}

const numberTypes = [ArgumentType.Number, ArgumentType.Float, ArgumentType.Integer]
/**
 * When the type of the parameter is a number type and
 * no placeholder is used, convert the type of its value
 */
const handleArgChanged = (val: string, index: number, type: ArgumentType) => {
  if (numberTypes.includes(type) && val !== '' && !Number.isNaN(Number(val))) {
    record.value.func.args[index] = Number(val)
  }
}

const { createRequiredRule } = useFormRules()
const rules = computed(() => {
  const { func = {} } = record.value || {}
  const ret: FormRules = {
    field: [
      ...createRequiredRule(t('components.field')),
      {
        validator(rules: any, value: string, callback) {
          if (showArgsBlock.value && Array.isArray(func.args) && !func.args.includes(value)) {
            callback(new Error(t('Flow.unusedField')))
          }
          callback()
        },
      },
    ],
  }
  if (func.name) {
    ret.alias = [
      {
        required: true,
        validator(rules, value, cb) {
          if (func.name && !value) {
            cb(new Error(t('Flow.aliasRequired')))
          }
          cb()
        },
      },
    ]
  }
  args.value.forEach((item, index) => {
    if (item.required) {
      // TODO:replace name to label
      ret[`func.args.${index}`] = createRequiredRule(tl(item.name))
    }
  })
  return ret
})

const validate = () => FormCom.value.validate()

defineExpose({ validate })
</script>

<style lang="scss">
.function-block {
  position: relative;
  padding-bottom: 4px;
  .row-select {
    .el-col {
      padding-bottom: 16px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-cascader {
      flex-grow: 1;
    }
  }
  .item-alias {
    .el-form-item__error {
      white-space: wrap;
    }
  }
  .col-as {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .args-block {
    // same as label width
    margin-bottom: 16px;
    padding: 16px 0;
    border-radius: 8px;
    background-color: var(--color-bg-split);
    .el-form-item:last-child {
      margin-bottom: 0;
    }
  }
  .row-para {
    flex-grow: 1;
  }
  .col-para-label {
    display: flex;
    text-align: right;
    line-height: 1.2;
    align-items: center;
    justify-content: flex-end;
    label {
      word-break: break-all;
    }
  }
  .common-fields {
    width: 100%;
  }
}
</style>
