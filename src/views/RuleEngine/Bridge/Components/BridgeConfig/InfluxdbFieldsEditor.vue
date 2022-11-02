<template>
  <el-table class="influxdb-fields-editor shadow-none" :data="tableData">
    <el-table-column :label="keyValueLabel.key">
      <template #default="{ row }">
        <el-input v-model="row.key" class="key-input" @input="atInputChange" />
      </template>
    </el-table-column>
    <el-table-column :label="keyValueLabel.value">
      <template #default="{ row }">
        <BooleanSelect
          v-model="row.value"
          v-if="row.type === FieldValueType.Boolean"
          @change="atInputChange"
        />
        <el-input
          v-else-if="row.type === FieldValueType.Integer || row.type === FieldValueType.UInteger"
          v-model="row.value"
          @input="atInputChange"
        />
        <el-input v-else v-model="row.value" @input="atInputChange" />
      </template>
    </el-table-column>
    <el-table-column :label="tl('type')">
      <template #default="{ row }">
        <el-select v-model="row.type">
          <el-option
            v-for="{ value, label } in typeOpts"
            :label="label"
            :value="value"
            :key="value"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column v-if="!disabled" width="100">
      <template #header>
        <a href="javascript:;" class="btn" @click="addColumn">
          {{ $t('Base.add') }}
        </a>
      </template>
      <template #default="{ row }">
        <a href="javascript:;" class="btn" @click="deleteItem(row)">
          {{ $t('Base.delete') }}
        </a>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { ref, computed, Ref, defineComponent, watch } from 'vue'
import { isPlainObject, cloneDeep, isEqual } from 'lodash'
import useI18nTl from '@/hooks/useI18nTl'
import BooleanSelect from '@/components/BooleanSelect.vue'

enum State {
  OK = 0,
  Error,
}
enum FieldValueType {
  Float,
  Integer,
  // TODO: confirm : seems just v2 with this type
  UInteger,
  String,
  Boolean,
  Placeholder,
}
type kvRow = {
  key: string
  value: string | undefined | boolean
  type: FieldValueType
  state: State
}

const STRING_REGEX = /^".*"$/
const BOOL_REGEX = /^((t|true)|(f|false))$/i
const INT_REGEX = /^\d+i$/
const U_INT_REGEX = /^\d+u$/
const NUMBER_REGEX = /\d+(\.\d+)?/
const SCIENTIFIC_NOTATION_REGEX = new RegExp(`${NUMBER_REGEX.source}e(\\+|-)\\d+`)
const FLOAT_REGEX = new RegExp(`^${SCIENTIFIC_NOTATION_REGEX.source}|${NUMBER_REGEX.source}$`)
const PLACEHOLDER_REGEX = /\$\{.+\}(i|u)?/
const typeRegexMap: Record<FieldValueType, RegExp> = {
  [FieldValueType.String]: STRING_REGEX,
  [FieldValueType.Integer]: INT_REGEX,
  [FieldValueType.UInteger]: U_INT_REGEX,
  [FieldValueType.Boolean]: BOOL_REGEX,
  [FieldValueType.Float]: FLOAT_REGEX,
  [FieldValueType.Placeholder]: PLACEHOLDER_REGEX,
}
const typeRegexMapKeys: Array<FieldValueType> = Object.keys(typeRegexMap).map((key) => Number(key))
const judgeFieldValueType = (str: string) => {
  const ret = typeRegexMapKeys.find((type: FieldValueType) => {
    return typeRegexMap[type].test(str)
  })
  return ret ?? undefined
}

const convertToRawValueByType = (valueInProtocolLine: string, type: FieldValueType) => {
  switch (type) {
    case FieldValueType.String:
      if (STRING_REGEX.test(valueInProtocolLine)) {
        return valueInProtocolLine.slice(1, -1)
      }
      break
    case FieldValueType.Integer:
      if (INT_REGEX.test(valueInProtocolLine)) {
        return valueInProtocolLine.slice(0, -1)
      }
      break
    case FieldValueType.UInteger:
      if (U_INT_REGEX.test(valueInProtocolLine)) {
        return valueInProtocolLine.slice(0, -1)
      }
      break
    case FieldValueType.Boolean:
      if (BOOL_REGEX.test(valueInProtocolLine)) {
        return valueInProtocolLine[0].toLocaleLowerCase() === 't' ? true : false
      }
      break
  }
  // float and others, return value directly
  return valueInProtocolLine
}

/**
 * convert raw value to value in line protocol
 */
const handleValueByType = (value: string | boolean, type: FieldValueType) => {
  switch (type) {
    case FieldValueType.String:
      return `"${value}"`
    case FieldValueType.Integer:
      if (Number.isNaN(Number(value))) {
        throw new Error()
      }
      return `${value}i`
    case FieldValueType.UInteger:
      if (Number.isNaN(Number(value))) {
        throw new Error()
      }
      return `${value}u`
    case FieldValueType.Boolean:
      return value
    case FieldValueType.Float:
      return value
    default:
      return value
  }
}

export default defineComponent({
  name: 'KeyAndValueEditor',
  emits: ['update:modelValue'],
  components: { BooleanSelect },
  props: {
    modelValue: {
      type: Object,
    },
    customLabel: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const rowData: kvRow = {
      key: '',
      value: undefined,
      type: FieldValueType.Placeholder,
      state: State.OK,
    }
    const tableData: Ref<kvRow[]> = ref([])

    let lastTimeObjData = {}

    const { t, tl } = useI18nTl('RuleEngine')
    const { emit } = context

    const typeOpts = [
      { value: FieldValueType.Placeholder, label: tl('placeholder') },
      { value: FieldValueType.Float, label: tl('float') },
      { value: FieldValueType.Integer, label: tl('integer') },
      { value: FieldValueType.UInteger, label: tl('uInteger') },
      { value: FieldValueType.String, label: tl('string') },
      { value: FieldValueType.Boolean, label: tl('boolean') },
    ]

    function createTbData() {
      const d = props.modelValue
      if (!d || !isPlainObject(d)) {
        return
      }
      lastTimeObjData = cloneDeep(d)
      tableData.value = []
      Object.entries(d).forEach(([key, value]: [string, string]) => {
        const type = judgeFieldValueType(value)
        if (type !== undefined) {
          const rawValue = convertToRawValueByType(value, type)
          tableData.value.push({ key, value: rawValue, state: 0, type })
        } else {
          // TODO:throw error
        }
      })
    }

    createTbData()

    const keyValueLabel = computed(() => {
      if (props.customLabel === null) {
        return {
          key: t('components.key'),
          value: t('components.value'),
        }
      }
      return props.customLabel
    })

    function atInputChange() {
      const data: Record<string, unknown> = {}
      tableData.value.forEach((item) => {
        const { key, value, type } = item
        if (value !== undefined) {
          data[key] = handleValueByType(value, type)
        }
      })
      lastTimeObjData = cloneDeep(data)
      emit('update:modelValue', data)
    }
    function deleteItem(row: kvRow) {
      tableData.value = tableData.value.filter(($) => $ !== row)
      atInputChange()
    }
    function addColumn() {
      tableData.value.push({ ...rowData })
    }

    watch(
      () => props.modelValue,
      (val) => {
        if (!isEqual(val, lastTimeObjData)) {
          createTbData()
        }
      },
    )

    return {
      tl,
      tableData,
      typeOpts,
      FieldValueType,
      atInputChange,
      deleteItem,
      addColumn,
      keyValueLabel,
    }
  },
})
</script>

<style lang="scss" scoped>
.key-and-value-editor {
  min-width: 200px;
}
</style>
